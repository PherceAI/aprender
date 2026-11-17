import {timingSafeEqual} from 'node:crypto';
import {and, asc, desc, eq} from 'drizzle-orm';
import type {Db} from './db';
import {comentariosRevision, TIPOS_COMENTARIO} from './db/schema';

// Modo revisión: mientras se prepara el lanzamiento, el docente experto recorre la plataforma y deja
// comentarios anclados a cada parte. Se activa con la variable REVISION_CLAVE (8+ caracteres) y un enlace
// /revision?clave=...; al quitar la variable, el modo se apaga en toda la plataforma.

export const COOKIE_REVISION = 'revision';
export type TipoComentario = (typeof TIPOS_COMENTARIO)[number];
export type Comentario = typeof comentariosRevision.$inferSelect;

const MAX_TEXTO = 2000;

export function claveRevision(): string | null {
  const c = process.env.REVISION_CLAVE?.trim();
  return c && c.length >= 8 ? c : null;
}

/** ¿Esta clave (de la cookie o del enlace) abre el modo revisión? Si no hay clave configurada, nunca. */
export function claveValida(clave: string | undefined | null): boolean {
  const real = claveRevision();
  if (!real || !clave) return false;
  const a = Buffer.from(clave);
  const b = Buffer.from(real);
  return a.length === b.length && timingSafeEqual(a, b);
}

export type NuevoComentario = {autor: string; ruta: string; ancla?: string; muestra?: string; tipo: string; texto: string; ancho?: number};

export class ErrorRevision extends Error {}

export async function crearComentario(db: Db, c: NuevoComentario): Promise<Comentario> {
  const texto = c.texto.trim().slice(0, MAX_TEXTO);
  if (!texto) throw new ErrorRevision('Escribe tu comentario');
  if (!(TIPOS_COMENTARIO as readonly string[]).includes(c.tipo)) throw new ErrorRevision('Elige qué tipo de comentario es');
  const ruta = c.ruta.startsWith('/') ? c.ruta.slice(0, 300) : '/';
  const [fila] = await db
    .insert(comentariosRevision)
    .values({
      autor: c.autor.trim().slice(0, 60) || 'Revisor',
      ruta,
      ancla: (c.ancla ?? '').slice(0, 600),
      muestra: (c.muestra ?? '').replace(/\s+/g, ' ').trim().slice(0, 160),
      tipo: c.tipo as TipoComentario,
      texto,
      ancho: Math.max(0, Math.min(10000, Math.round(c.ancho ?? 0))),
    })
    .returning();
  return fila;
}

/** Los comentarios de una pantalla, del más antiguo al más nuevo (para el revisor). */
export async function comentariosDeRuta(db: Db, ruta: string): Promise<Comentario[]> {
  return db.select().from(comentariosRevision).where(eq(comentariosRevision.ruta, ruta)).orderBy(asc(comentariosRevision.id));
}

/** Todos los comentarios para el administrador: primero los pendientes, los más nuevos arriba. */
export async function todosLosComentarios(db: Db, soloPendientes = false): Promise<Comentario[]> {
  const q = db.select().from(comentariosRevision);
  return (soloPendientes ? q.where(eq(comentariosRevision.resuelto, false)) : q).orderBy(asc(comentariosRevision.resuelto), desc(comentariosRevision.id));
}

export async function marcarResuelto(db: Db, id: number, resuelto: boolean) {
  await db.update(comentariosRevision).set({resuelto}).where(eq(comentariosRevision.id, id));
}

export async function borrarComentario(db: Db, id: number, autor?: string) {
  await db.delete(comentariosRevision).where(autor ? and(eq(comentariosRevision.id, id), eq(comentariosRevision.autor, autor)) : eq(comentariosRevision.id, id));
}
