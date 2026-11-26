import {and, asc, desc, eq, inArray, isNotNull} from 'drizzle-orm';
import type {Db} from './db';
import {bloques, dominio, especialidadBloques, intentos, temas, unidades, ESTADOS_DOMINIO} from './db/schema';

// Dominio de cada tema (0–100) y su estado. Reglas en VISION.md §4 y §4c.

export type EstadoDominio = (typeof ESTADOS_DOMINIO)[number];
export const UMBRAL_DOMINIO = 80;
/** El diagnóstico de entrada ubica, pero nunca da un tema por dominado. */
export const NIVEL_MAX_DIAGNOSTICO = 70;

/** Cuánto vale una respuesta del diagnóstico para ubicar: separa al que sabe del que adivinó. */
export function valorDiagnostico(correcta: boolean, seguridad: 'lo-se' | 'creo' | 'adivine' | null): number {
  if (!correcta) return 0;
  if (seguridad === 'creo') return 0.75;
  if (seguridad === 'adivine') return 0.25;
  return 1;
}

export type Categoria = 'fuerte' | 'media' | 'debil';
export function categoriaDe(promedio: number): Categoria {
  if (promedio >= 0.875) return 'fuerte';
  if (promedio >= 0.4) return 'media';
  return 'debil';
}

export async function dominioDe(db: Db, usuarioId: string, temaId: string) {
  const [d] = await db.select().from(dominio).where(and(eq(dominio.usuarioId, usuarioId), eq(dominio.temaId, temaId)));
  return d ?? null;
}

export async function fijarDominio(
  db: Db,
  usuarioId: string,
  temaId: string,
  cambio: {nivel?: number; estado?: EstadoDominio}
) {
  const nivel = cambio.nivel === undefined ? undefined : Math.max(0, Math.min(100, Math.round(cambio.nivel)));
  await db
    .insert(dominio)
    .values({usuarioId, temaId, nivel: nivel ?? 0, estado: cambio.estado ?? 'sin-empezar'})
    .onConflictDoUpdate({
      target: [dominio.usuarioId, dominio.temaId],
      set: {...(nivel !== undefined && {nivel}), ...(cambio.estado && {estado: cambio.estado}), actualizado: new Date()},
    });
}

/** Al estudiar algo de un tema que no había empezado, pasa a «aprendiendo». */
export async function marcarAprendiendo(db: Db, usuarioId: string, temaId: string) {
  const d = await dominioDe(db, usuarioId, temaId);
  if (!d || d.estado === 'sin-empezar') await fijarDominio(db, usuarioId, temaId, {estado: 'aprendiendo'});
}

/** «Ya lo sé»: solo si su último diagnóstico del tema llegó al 80 %. */
export async function saltarTema(db: Db, usuarioId: string, temaId: string) {
  const [ultimo] = await db
    .select()
    .from(intentos)
    .where(
      and(
        eq(intentos.usuarioId, usuarioId),
        eq(intentos.tipo, 'diagnostico-tema'),
        eq(intentos.referencia, temaId),
        isNotNull(intentos.terminado)
      )
    )
    .orderBy(desc(intentos.terminado))
    .limit(1);
  if (!ultimo || (ultimo.puntaje ?? 0) < UMBRAL_DOMINIO) {
    throw new Error('Para saltar el tema necesitas 80 % o más en su diagnóstico');
  }
  await fijarDominio(db, usuarioId, temaId, {nivel: Math.max(UMBRAL_DOMINIO, ultimo.puntaje ?? 0), estado: 'dominado'});
}

/** Temas de una especialidad, con el peso de cada uno en el examen (preguntas del bloque ÷ temas del bloque). */
export async function temasConPeso(db: Db, especialidadId: string) {
  const filas = await db
    .select({
      temaId: temas.id,
      temaNombre: temas.nombre,
      temaOrden: temas.orden,
      abierto: temas.abierto,
      unidadId: unidades.id,
      unidadNombre: unidades.nombre,
      unidadOrden: unidades.orden,
      unidadAsignatura: unidades.asignatura,
      bloqueId: bloques.id,
      bloqueNombre: bloques.nombre,
      bloqueOrden: especialidadBloques.orden,
      preguntasExamen: bloques.preguntasExamen,
    })
    .from(especialidadBloques)
    .innerJoin(bloques, eq(bloques.id, especialidadBloques.bloqueId))
    .innerJoin(unidades, eq(unidades.bloqueId, bloques.id))
    .innerJoin(temas, eq(temas.unidadId, unidades.id))
    .where(eq(especialidadBloques.especialidadId, especialidadId))
    .orderBy(asc(especialidadBloques.orden), asc(unidades.orden), asc(temas.orden));
  const temasPorBloque = new Map<string, number>();
  for (const f of filas) temasPorBloque.set(f.bloqueId, (temasPorBloque.get(f.bloqueId) ?? 0) + 1);
  return filas.map((f) => ({...f, peso: f.preguntasExamen / (temasPorBloque.get(f.bloqueId) ?? 1)}));
}

/** Preparación para la evaluación (0–100): el dominio de los temas, pesado como en el examen. */
export async function preparacion(db: Db, usuarioId: string, especialidadId: string): Promise<number> {
  const lista = await temasConPeso(db, especialidadId);
  if (!lista.length) return 0;
  const niveles = await nivelesDe(db, usuarioId, lista.map((t) => t.temaId));
  const total = lista.reduce((s, t) => s + t.peso, 0);
  const logrado = lista.reduce((s, t) => s + t.peso * (niveles.get(t.temaId)?.nivel ?? 0), 0);
  return Math.round(logrado / total);
}

export async function nivelesDe(db: Db, usuarioId: string, temaIds: string[]) {
  if (!temaIds.length) return new Map<string, {nivel: number; estado: EstadoDominio}>();
  const filas = await db
    .select()
    .from(dominio)
    .where(and(eq(dominio.usuarioId, usuarioId), inArray(dominio.temaId, temaIds)));
  return new Map(filas.map((f) => [f.temaId, {nivel: f.nivel, estado: f.estado}]));
}
