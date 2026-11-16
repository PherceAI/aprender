import {and, asc, eq} from 'drizzle-orm';
import type {Db} from './db';
import {lecciones, temas, unidades, usuarios} from './db/schema';

// Cuenta gratis: el docente se registra solo, hace el diagnóstico y ve las primeras lecciones del curso.
// Lo demás (el resto de lecciones, las pruebas de tema y los simulacros) se desbloquea con el pago único,
// que el administrador activa desde el panel.

export type Plan = 'gratis' | 'completo';
export const LECCIONES_GRATIS = 2;

export async function planDe(db: Db, usuarioId: string): Promise<Plan> {
  const [u] = await db.select({plan: usuarios.plan}).from(usuarios).where(eq(usuarios.id, usuarioId));
  return u?.plan ?? 'gratis';
}

/** Las primeras lecciones del curso (temas abiertos, en el orden del temario). */
export async function leccionesGratis(db: Db): Promise<Set<string>> {
  const filas = await db
    .select({id: lecciones.id})
    .from(lecciones)
    .innerJoin(temas, eq(temas.id, lecciones.temaId))
    .innerJoin(unidades, eq(unidades.id, temas.unidadId))
    .where(eq(temas.abierto, true))
    .orderBy(asc(unidades.orden), asc(temas.orden), asc(lecciones.orden))
    .limit(LECCIONES_GRATIS);
  return new Set(filas.map((f) => f.id));
}

/** ¿Puede abrir esta lección con su plan? (No mira si el tema está abierto: eso lo decide el curso.) */
export async function puedeVerLeccion(db: Db, usuarioId: string, leccionId: string): Promise<boolean> {
  if ((await planDe(db, usuarioId)) === 'completo') return true;
  return (await leccionesGratis(db)).has(leccionId);
}

export async function cambiarPlan(db: Db, usuarioId: string, plan: Plan) {
  await db
    .update(usuarios)
    .set({plan})
    .where(and(eq(usuarios.id, usuarioId), eq(usuarios.rol, 'docente')));
}
