import {and, asc, count, eq, lte} from 'drizzle-orm';
import type {Db} from './db';
import {repaso} from './db/schema';
import {hoyEc, sumarDias} from './util';

// Repaso espaciado (cajas de Leitner). Una pregunta fallada vuelve mañana (caja 0).
// Cada acierto la pasa a la caja siguiente: vuelve a los 3, 7, 14 y 30 días. Acertar en la última la «gradúa».

export const INTERVALOS_DIAS = [1, 3, 7, 14, 30] as const;
export const MAX_REPASO_DIA = 10;

export async function actualizarRepaso(db: Db, usuarioId: string, preguntaId: string, correcta: boolean, ahora: Date) {
  const hoy = hoyEc(ahora);
  const [actual] = await db
    .select()
    .from(repaso)
    .where(and(eq(repaso.usuarioId, usuarioId), eq(repaso.preguntaId, preguntaId)));

  if (!correcta) {
    const fila = {usuarioId, preguntaId, caja: 0, proxima: sumarDias(hoy, INTERVALOS_DIAS[0]), fallos: (actual?.fallos ?? 0) + 1};
    await db
      .insert(repaso)
      .values(fila)
      .onConflictDoUpdate({target: [repaso.usuarioId, repaso.preguntaId], set: {caja: 0, proxima: fila.proxima, fallos: fila.fallos}});
    return;
  }
  if (!actual) return; // lo que ya sabe no necesita repaso
  const caja = actual.caja + 1;
  if (caja >= INTERVALOS_DIAS.length) {
    await db.delete(repaso).where(and(eq(repaso.usuarioId, usuarioId), eq(repaso.preguntaId, preguntaId)));
    return;
  }
  await db
    .update(repaso)
    .set({caja, proxima: sumarDias(hoy, INTERVALOS_DIAS[caja]), aciertos: actual.aciertos + 1})
    .where(and(eq(repaso.usuarioId, usuarioId), eq(repaso.preguntaId, preguntaId)));
}

/** Ids de las preguntas que tocan hoy (o que quedaron atrasadas), las más urgentes primero. */
export async function pendientesDeRepaso(db: Db, usuarioId: string, ahora: Date, limite = MAX_REPASO_DIA): Promise<string[]> {
  const filas = await db
    .select({preguntaId: repaso.preguntaId})
    .from(repaso)
    .where(and(eq(repaso.usuarioId, usuarioId), lte(repaso.proxima, hoyEc(ahora))))
    .orderBy(asc(repaso.proxima), asc(repaso.caja))
    .limit(limite);
  return filas.map((f) => f.preguntaId);
}

export async function contarPendientes(db: Db, usuarioId: string, ahora: Date): Promise<number> {
  const [{n}] = await db
    .select({n: count()})
    .from(repaso)
    .where(and(eq(repaso.usuarioId, usuarioId), lte(repaso.proxima, hoyEc(ahora))));
  return Math.min(n, MAX_REPASO_DIA);
}
