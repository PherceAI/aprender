import {and, asc, eq, inArray} from 'drizzle-orm';
import type {Seccion} from '../contenido/tipos';
import type {Db} from './db';
import {especialidades, intentos, lecciones, notas, progresoLecciones, temas, unidades, usuarios} from './db/schema';
import {marcarAprendiendo, nivelesDe, temasConPeso, type EstadoDominio} from './dominio';
import {ErrorAcademia} from './intentos';
import {accesoLeccion, puedeVerLeccion} from './acceso';

// Lo que el docente ve del curso: especialidades, el mapa con su dominio, cada tema y cada lección.

export async function listarEspecialidades(db: Db) {
  return db.select().from(especialidades).orderBy(asc(especialidades.orden));
}

export async function especialidadDelUsuario(db: Db, usuarioId: string): Promise<string> {
  const [u] = await db.select({e: usuarios.especialidadId}).from(usuarios).where(eq(usuarios.id, usuarioId));
  if (!u?.e) throw new ErrorAcademia('sin-especialidad', 'Primero elige tu especialidad');
  return u.e;
}

async function completadasDe(db: Db, usuarioId: string): Promise<Set<string>> {
  const filas = await db.select({id: progresoLecciones.leccionId}).from(progresoLecciones).where(eq(progresoLecciones.usuarioId, usuarioId));
  return new Set(filas.map((f) => f.id));
}

export interface TemaEnMapa {
  id: string;
  nombre: string;
  abierto: boolean;
  nivel: number;
  estado: EstadoDominio;
  lecciones: number;
  completadas: number;
}

export interface MapaCurso {
  especialidadId: string;
  bloques: {
    id: string;
    nombre: string;
    nivel: number;
    unidades: {id: string; nombre: string; nivel: number; temas: TemaEnMapa[]}[];
  }[];
}

/** El curso completo de su especialidad, con el dominio de cada tema. */
export async function mapaCurso(db: Db, usuarioId: string): Promise<MapaCurso> {
  const especialidadId = await especialidadDelUsuario(db, usuarioId);
  const lista = await temasConPeso(db, especialidadId);
  const niveles = await nivelesDe(db, usuarioId, lista.map((t) => t.temaId));
  const ls = await db.select({id: lecciones.id, temaId: lecciones.temaId}).from(lecciones).where(inArray(lecciones.temaId, lista.map((t) => t.temaId)));
  const hechas = await completadasDe(db, usuarioId);

  const mapa: MapaCurso = {especialidadId, bloques: []};
  for (const t of lista) {
    let b = mapa.bloques.find((x) => x.id === t.bloqueId);
    if (!b) mapa.bloques.push((b = {id: t.bloqueId, nombre: t.bloqueNombre, nivel: 0, unidades: []}));
    let u = b.unidades.find((x) => x.id === t.unidadId);
    if (!u) b.unidades.push((u = {id: t.unidadId, nombre: t.unidadNombre, nivel: 0, temas: []}));
    const delTema = ls.filter((l) => l.temaId === t.temaId);
    u.temas.push({
      id: t.temaId,
      nombre: t.temaNombre,
      abierto: t.abierto,
      nivel: niveles.get(t.temaId)?.nivel ?? 0,
      estado: niveles.get(t.temaId)?.estado ?? 'sin-empezar',
      lecciones: delTema.length,
      completadas: delTema.filter((l) => hechas.has(l.id)).length,
    });
  }
  const promedio = (xs: number[]) => (xs.length ? Math.round(xs.reduce((s, x) => s + x, 0) / xs.length) : 0);
  for (const b of mapa.bloques) {
    for (const u of b.unidades) u.nivel = promedio(u.temas.map((t) => t.nivel));
    b.nivel = promedio(b.unidades.flatMap((u) => u.temas.map((t) => t.nivel)));
  }
  return mapa;
}

/** Un tema con sus lecciones. Si está cerrado, se ve su temario pero no se puede estudiar. */
export async function temaDetalle(db: Db, usuarioId: string, temaId: string) {
  const [t] = await db
    .select({tema: temas, unidadNombre: unidades.nombre})
    .from(temas)
    .innerJoin(unidades, eq(unidades.id, temas.unidadId))
    .where(eq(temas.id, temaId));
  if (!t) throw new ErrorAcademia('no-encontrado', 'Ese tema no existe');
  const ls = await db.select().from(lecciones).where(eq(lecciones.temaId, temaId)).orderBy(asc(lecciones.orden));
  const hechas = await completadasDe(db, usuarioId);
  const niv = (await nivelesDe(db, usuarioId, [temaId])).get(temaId);
  const diags = await db
    .select({puntaje: intentos.puntaje, terminado: intentos.terminado})
    .from(intentos)
    .where(and(eq(intentos.usuarioId, usuarioId), eq(intentos.tipo, 'diagnostico-tema'), eq(intentos.referencia, temaId)));
  const diagnostico = diags.filter((d) => d.terminado).sort((a, b) => +b.terminado! - +a.terminado!)[0];
  return {
    id: t.tema.id,
    nombre: t.tema.nombre,
    unidadNombre: t.unidadNombre,
    abierto: t.tema.abierto,
    video: t.tema.abierto && t.tema.videoUrl ? {url: t.tema.videoUrl, titulo: t.tema.videoTitulo ?? t.tema.nombre} : null,
    nivel: niv?.nivel ?? 0,
    estado: niv?.estado ?? ('sin-empezar' as EstadoDominio),
    /** Último diagnóstico del tema (si lo hizo). */
    diagnostico: diagnostico ? {puntaje: diagnostico.puntaje ?? 0} : null,
    lecciones: ls.map((l) => ({id: l.id, titulo: l.titulo, objetivo: l.objetivo, minutos: l.minutos, completada: hechas.has(l.id)})),
  };
}

export type LeccionVista =
  | 'tema-cerrado'
  | 'bloqueada'
  | 'por-elegir'
  | {
      id: string;
      titulo: string;
      objetivo: string;
      minutos: number;
      contenido: Seccion[];
      tema: {id: string; nombre: string; video: {url: string; titulo: string} | null};
      anterior: {id: string; titulo: string} | null;
      siguiente: {id: string; titulo: string} | null;
      completada: boolean;
      nota: string;
    };

export async function leccion(db: Db, usuarioId: string, leccionId: string): Promise<LeccionVista> {
  const [l] = await db.select().from(lecciones).where(eq(lecciones.id, leccionId));
  if (!l) throw new ErrorAcademia('no-encontrado', 'Esa lección no existe');
  const [t] = await db.select().from(temas).where(eq(temas.id, l.temaId));
  if (!t.abierto) return 'tema-cerrado';
  const acceso = await accesoLeccion(db, usuarioId, l.id);
  if (acceso !== 'libre') return acceso;
  const hermanas = await db.select().from(lecciones).where(eq(lecciones.temaId, t.id)).orderBy(asc(lecciones.orden));
  const i = hermanas.findIndex((h) => h.id === l.id);
  const [n] = await db.select().from(notas).where(and(eq(notas.usuarioId, usuarioId), eq(notas.leccionId, l.id)));
  const [p] = await db
    .select()
    .from(progresoLecciones)
    .where(and(eq(progresoLecciones.usuarioId, usuarioId), eq(progresoLecciones.leccionId, l.id)));
  const corto = (x?: typeof l) => (x ? {id: x.id, titulo: x.titulo} : null);
  return {
    id: l.id,
    titulo: l.titulo,
    objetivo: l.objetivo,
    minutos: l.minutos,
    contenido: (l.contenido as Seccion[] | null) ?? [],
    tema: {id: t.id, nombre: t.nombre, video: t.videoUrl ? {url: t.videoUrl, titulo: t.videoTitulo ?? t.nombre} : null},
    anterior: corto(hermanas[i - 1]),
    siguiente: corto(hermanas[i + 1]),
    completada: Boolean(p),
    nota: n?.texto ?? '',
  };
}

export async function completarLeccion(db: Db, usuarioId: string, leccionId: string, ahora: Date = new Date()) {
  const [l] = await db.select().from(lecciones).where(eq(lecciones.id, leccionId));
  if (!l) throw new ErrorAcademia('no-encontrado', 'Esa lección no existe');
  const [t] = await db.select({abierto: temas.abierto}).from(temas).where(eq(temas.id, l.temaId));
  if (!t.abierto) throw new ErrorAcademia('tema-cerrado', 'Este tema estará disponible próximamente');
  if (!(await puedeVerLeccion(db, usuarioId, l.id))) throw new ErrorAcademia('bloqueado', 'Esta lección es parte del acceso completo');
  await db.insert(progresoLecciones).values({usuarioId, leccionId, completada: ahora}).onConflictDoNothing();
  await marcarAprendiendo(db, usuarioId, l.temaId);
}

const MAX_NOTA = 5000;
export async function guardarNota(db: Db, usuarioId: string, leccionId: string, texto: string) {
  const limpio = texto.slice(0, MAX_NOTA);
  if (!limpio.trim()) {
    await db.delete(notas).where(and(eq(notas.usuarioId, usuarioId), eq(notas.leccionId, leccionId)));
    return;
  }
  await db
    .insert(notas)
    .values({usuarioId, leccionId, texto: limpio})
    .onConflictDoUpdate({target: [notas.usuarioId, notas.leccionId], set: {texto: limpio, actualizado: new Date()}});
}
