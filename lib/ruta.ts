import {and, asc, desc, eq, isNotNull, sql} from 'drizzle-orm';
import type {Db} from './db';
import {intentos, lecciones, progresoLecciones, respuestas} from './db/schema';
import {especialidadDelUsuario} from './curso';
import {nivelesDe, preparacion, temasConPeso, type EstadoDominio} from './dominio';
import {contarPendientes} from './repaso';
import {hoyEc, sumarDias} from './util';

// La ruta personal y «lo de hoy»: qué estudiar, en qué orden, y cómo va.

export interface PasoRuta {
  temaId: string;
  nombre: string;
  unidadNombre: string;
  abierto: boolean;
  nivel: number;
  estado: EstadoDominio;
}

/**
 * Temas que le faltan, en el orden en que conviene estudiarlos: primero los que se pueden estudiar ya,
 * luego los que toca repasar, luego los más débiles, y a igual nivel los que más pesan en el examen.
 */
export async function rutaDe(db: Db, usuarioId: string): Promise<PasoRuta[]> {
  const especialidadId = await especialidadDelUsuario(db, usuarioId);
  const lista = await temasConPeso(db, especialidadId);
  const niveles = await nivelesDe(db, usuarioId, lista.map((t) => t.temaId));
  return lista
    .map((t, orden) => ({
      orden,
      peso: t.peso,
      temaId: t.temaId,
      nombre: t.temaNombre,
      unidadNombre: t.unidadNombre,
      abierto: t.abierto,
      nivel: niveles.get(t.temaId)?.nivel ?? 0,
      estado: niveles.get(t.temaId)?.estado ?? ('sin-empezar' as EstadoDominio),
    }))
    .filter((t) => t.estado !== 'dominado')
    .sort(
      (a, b) =>
        Number(b.abierto) - Number(a.abierto) ||
        Number(b.estado === 'repasar') - Number(a.estado === 'repasar') ||
        a.nivel - b.nivel ||
        b.peso - a.peso ||
        a.orden - b.orden
    )
    .map(({temaId, nombre, unidadNombre, abierto, nivel, estado}) => ({temaId, nombre, unidadNombre, abierto, nivel, estado}));
}

/** Días seguidos con actividad (respuestas o lecciones), hasta hoy o hasta ayer si hoy aún no estudia. */
export async function rachaDe(db: Db, usuarioId: string, ahora: Date): Promise<{dias: number; hoyHecho: boolean}> {
  // El día de Ecuador de cada actividad (UTC-5).
  const dia = (col: unknown) => sql<string>`to_char((${col} at time zone 'UTC') - interval '5 hours', 'YYYY-MM-DD')`;
  const r1 = await db.selectDistinct({d: dia(respuestas.creado)}).from(respuestas).where(eq(respuestas.usuarioId, usuarioId));
  const r2 = await db
    .selectDistinct({d: dia(progresoLecciones.completada)})
    .from(progresoLecciones)
    .where(eq(progresoLecciones.usuarioId, usuarioId));
  const dias = new Set([...r1, ...r2].map((r) => r.d));
  const hoy = hoyEc(ahora);
  const hoyHecho = dias.has(hoy);
  let d = hoyHecho ? hoy : sumarDias(hoy, -1);
  let n = 0;
  while (dias.has(d)) {
    n += 1;
    d = sumarDias(d, -1);
  }
  return {dias: n, hoyHecho};
}

export type Siguiente =
  | {tipo: 'diagnostico'}
  | {tipo: 'leccion'; leccionId: string; titulo: string; temaId: string; temaNombre: string; minutos: number; numero: number; de: number}
  | {tipo: 'prueba-tema'; temaId: string; temaNombre: string}
  | {tipo: 'nada'};

export async function diagnosticoHecho(db: Db, usuarioId: string): Promise<boolean> {
  const [i] = await db
    .select({id: intentos.id})
    .from(intentos)
    .where(and(eq(intentos.usuarioId, usuarioId), eq(intentos.tipo, 'diagnostico'), isNotNull(intentos.terminado)))
    .limit(1);
  return Boolean(i);
}

/** Lo que le toca hacer ahora: el diagnóstico, la siguiente lección o la prueba del tema. */
export async function siguientePaso(db: Db, usuarioId: string): Promise<Siguiente> {
  if (!(await diagnosticoHecho(db, usuarioId))) return {tipo: 'diagnostico'};
  const ruta = await rutaDe(db, usuarioId);
  const hechas = new Set(
    (await db.select({id: progresoLecciones.leccionId}).from(progresoLecciones).where(eq(progresoLecciones.usuarioId, usuarioId))).map(
      (f) => f.id
    )
  );
  for (const paso of ruta.filter((p) => p.abierto)) {
    const ls = await db.select().from(lecciones).where(eq(lecciones.temaId, paso.temaId)).orderBy(asc(lecciones.orden));
    const pendiente = ls.findIndex((l) => !hechas.has(l.id));
    if (pendiente !== -1) {
      const l = ls[pendiente];
      return {tipo: 'leccion', leccionId: l.id, titulo: l.titulo, temaId: paso.temaId, temaNombre: paso.nombre, minutos: l.minutos, numero: pendiente + 1, de: ls.length};
    }
    return {tipo: 'prueba-tema', temaId: paso.temaId, temaNombre: paso.nombre};
  }
  return {tipo: 'nada'};
}

/** Todo lo que muestra la pantalla de inicio. */
export async function hoyDe(db: Db, usuarioId: string, ahora: Date = new Date()) {
  const especialidadId = await especialidadDelUsuario(db, usuarioId);
  const [prep, racha, repaso, siguiente, ultimoSimulacro] = await Promise.all([
    preparacion(db, usuarioId, especialidadId),
    rachaDe(db, usuarioId, ahora),
    contarPendientes(db, usuarioId, ahora),
    siguientePaso(db, usuarioId),
    db
      .select({puntaje: intentos.puntaje, terminado: intentos.terminado})
      .from(intentos)
      .where(and(eq(intentos.usuarioId, usuarioId), eq(intentos.tipo, 'simulacro'), isNotNull(intentos.terminado)))
      .orderBy(desc(intentos.terminado))
      .limit(1),
  ]);
  return {preparacion: prep, racha, repasoPendiente: repaso, siguiente, ultimoSimulacro: ultimoSimulacro[0] ?? null};
}
