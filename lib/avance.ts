import {and, asc, eq, gte} from 'drizzle-orm';
import type {Db} from './db';
import {preparacionDias} from './db/schema';
import {preparacion} from './dominio';
import {hoyEc, sumarDias} from './util';

// Cuánto avanza el docente: el antes y después de cada intento y su preparación día a día.

export type Avance = {
  preparacionAntes: number;
  preparacionDespues: number;
  temas: {id: string; nombre: string; antes: number; despues: number}[];
};

/** Anota la preparación de hoy (una fila por día; la última del día manda) y la devuelve. */
export async function anotarPreparacion(db: Db, usuarioId: string, especialidadId: string, ahora: Date): Promise<number> {
  const valor = await preparacion(db, usuarioId, especialidadId);
  await db
    .insert(preparacionDias)
    .values({usuarioId, dia: hoyEc(ahora), preparacion: valor})
    .onConflictDoUpdate({target: [preparacionDias.usuarioId, preparacionDias.dia], set: {preparacion: valor}});
  return valor;
}

/** La preparación de los últimos días en que estudió, del más antiguo al más nuevo. */
export async function historialPreparacion(db: Db, usuarioId: string, dias = 30, ahora: Date = new Date()): Promise<{dia: string; preparacion: number}[]> {
  const desde = sumarDias(hoyEc(ahora), -(dias - 1));
  return db
    .select({dia: preparacionDias.dia, preparacion: preparacionDias.preparacion})
    .from(preparacionDias)
    .where(and(eq(preparacionDias.usuarioId, usuarioId), gte(preparacionDias.dia, desde)))
    .orderBy(asc(preparacionDias.dia));
}
