import {and, eq, isNotNull} from 'drizzle-orm';
import type {Db} from './db';
import {intentos, lecciones, leccionesElegidas, temas, usuarios} from './db/schema';

// Cuenta gratis: el docente se registra solo, hace el diagnóstico y elige LECCIONES_GRATIS lecciones
// de cualquier tema abierto para probar. Lo demás (el resto de lecciones, las pruebas de tema y los
// simulacros) se desbloquea con el pago único, que el administrador activa desde el panel.
// Con el acceso completo no hay ningún orden obligatorio: todo tema abierto se puede estudiar.

export type Plan = 'gratis' | 'completo';
export const LECCIONES_GRATIS = 3;

/** libre: puede estudiarla. por-elegir: aún le quedan lecciones gratis y esta sería una. bloqueada: necesita el acceso completo. */
export type AccesoLeccion = 'libre' | 'por-elegir' | 'bloqueada';

export async function planDe(db: Db, usuarioId: string): Promise<Plan> {
  const [u] = await db.select({plan: usuarios.plan}).from(usuarios).where(eq(usuarios.id, usuarioId));
  return u?.plan ?? 'gratis';
}

/** Las lecciones gratis que el docente ya eligió. */
export async function leccionesElegidasDe(db: Db, usuarioId: string): Promise<Set<string>> {
  const filas = await db.select({id: leccionesElegidas.leccionId}).from(leccionesElegidas).where(eq(leccionesElegidas.usuarioId, usuarioId));
  return new Set(filas.map((f) => f.id));
}

/** Todo lo que una pantalla necesita para pintar los candados de una sola vez. */
export async function estadoAcceso(db: Db, usuarioId: string) {
  const plan = await planDe(db, usuarioId);
  const elegidas = plan === 'completo' ? new Set<string>() : await leccionesElegidasDe(db, usuarioId);
  const restantes = plan === 'completo' ? Infinity : Math.max(0, LECCIONES_GRATIS - elegidas.size);
  const de = (leccionId: string): AccesoLeccion => (plan === 'completo' || elegidas.has(leccionId) ? 'libre' : restantes > 0 ? 'por-elegir' : 'bloqueada');
  return {plan, elegidas, restantes, de};
}

/** ¿Cómo puede abrir esta lección con su plan? (No mira si el tema está abierto: eso lo decide el curso.) */
export async function accesoLeccion(db: Db, usuarioId: string, leccionId: string): Promise<AccesoLeccion> {
  return (await estadoAcceso(db, usuarioId)).de(leccionId);
}

export async function puedeVerLeccion(db: Db, usuarioId: string, leccionId: string): Promise<boolean> {
  return (await accesoLeccion(db, usuarioId, leccionId)) === 'libre';
}

/** El docente gratis elige esta lección como una de las suyas. Devuelve false si ya no le quedan. */
export async function elegirLeccion(db: Db, usuarioId: string, leccionId: string, ahora: Date = new Date()): Promise<boolean> {
  const [l] = await db
    .select({abierto: temas.abierto})
    .from(lecciones)
    .innerJoin(temas, eq(temas.id, lecciones.temaId))
    .where(eq(lecciones.id, leccionId));
  if (!l?.abierto) return false;
  const acceso = await accesoLeccion(db, usuarioId, leccionId);
  if (acceso === 'libre') return true;
  if (acceso === 'bloqueada') return false;
  await db.insert(leccionesElegidas).values({usuarioId, leccionId, elegida: ahora}).onConflictDoNothing();
  // Dos pestañas eligiendo a la vez: si se pasó del límite, se deshace esta elección.
  if ((await leccionesElegidasDe(db, usuarioId)).size > LECCIONES_GRATIS) {
    await db.delete(leccionesElegidas).where(and(eq(leccionesElegidas.usuarioId, usuarioId), eq(leccionesElegidas.leccionId, leccionId)));
    return false;
  }
  return true;
}

/** Con la cuenta gratis se puede hacer un simulacro completo una vez, para conocerlo. */
export async function simulacroGratisDisponible(db: Db, usuarioId: string): Promise<boolean> {
  if ((await planDe(db, usuarioId)) === 'completo') return true;
  const [hecho] = await db
    .select({id: intentos.id})
    .from(intentos)
    .where(and(eq(intentos.usuarioId, usuarioId), eq(intentos.tipo, 'simulacro'), isNotNull(intentos.terminado)))
    .limit(1);
  return !hecho;
}

export async function cambiarPlan(db: Db, usuarioId: string, plan: Plan) {
  await db
    .update(usuarios)
    .set({plan})
    .where(and(eq(usuarios.id, usuarioId), eq(usuarios.rol, 'docente')));
}
