import {createWriteStream, promises as fs} from 'node:fs';
import path from 'node:path';
import {Readable, Transform} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import type {ReadableStream as WebReadableStream} from 'node:stream/web';
import {eq} from 'drizzle-orm';
import type {Db} from './db';
import {temas} from './db/schema';

// Videos de cada tema (los hace el dueño con NotebookLM). Se guardan en el volumen persistente.

export const MAX_VIDEO_BYTES = 600 * 1024 * 1024;
const TIPOS: Record<string, string> = {'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov'};
const NOMBRE_VALIDO = /^[a-z0-9-]+\.(mp4|webm|mov)$/;
export const PREFIJO_URL = '/api/videos/';

export function carpetaVideos(): string {
  return path.join(process.env.DATA_DIR || path.join(process.cwd(), 'data-local'), 'videos');
}

export class ErrorVideo extends Error {
  constructor(public estado: number, mensaje: string) {
    super(mensaje);
  }
}

/** Guarda el video subido, lo asigna al tema y borra el anterior. Devuelve su URL. */
export async function guardarVideo(
  db: Db,
  temaId: string,
  cuerpo: WebReadableStream<Uint8Array> | ReadableStream<Uint8Array> | Readable,
  tipo: string,
  titulo?: string
): Promise<string> {
  const ext = TIPOS[tipo.split(';')[0].trim()];
  if (!ext) throw new ErrorVideo(415, 'Sube un video MP4, WebM o MOV');
  const [t] = await db.select().from(temas).where(eq(temas.id, temaId));
  if (!t) throw new ErrorVideo(404, 'Ese tema no existe');

  const dir = carpetaVideos();
  await fs.mkdir(dir, {recursive: true});
  const nombre = `${temaId}-${Date.now().toString(36)}.${ext}`;
  const destino = path.join(dir, nombre);
  let bytes = 0;
  const contador = new Transform({
    transform(trozo: Buffer, _enc, listo) {
      bytes += trozo.length;
      if (bytes > MAX_VIDEO_BYTES) listo(new ErrorVideo(413, 'El video pasa de 600 MB'));
      else listo(null, trozo);
    },
  });
  const origen = cuerpo instanceof Readable ? cuerpo : Readable.fromWeb(cuerpo as WebReadableStream<Uint8Array>);
  try {
    await pipeline(origen, contador, createWriteStream(destino));
  } catch (e) {
    await fs.rm(destino, {force: true});
    throw e instanceof ErrorVideo ? e : new ErrorVideo(400, 'No se pudo guardar el video');
  }
  if (bytes === 0) {
    await fs.rm(destino, {force: true});
    throw new ErrorVideo(400, 'El archivo está vacío');
  }

  const url = `${PREFIJO_URL}${nombre}`;
  await db.update(temas).set({videoUrl: url, videoTitulo: titulo?.trim() || t.nombre}).where(eq(temas.id, temaId));
  await borrarSiEsLocal(t.videoUrl);
  return url;
}

/** Un enlace externo (https) en lugar de un archivo. */
export async function fijarEnlaceVideo(db: Db, temaId: string, url: string, titulo?: string) {
  if (!/^https:\/\//.test(url)) throw new ErrorVideo(400, 'El enlace debe empezar con https://');
  const [t] = await db.select().from(temas).where(eq(temas.id, temaId));
  if (!t) throw new ErrorVideo(404, 'Ese tema no existe');
  await db.update(temas).set({videoUrl: url, videoTitulo: titulo?.trim() || t.nombre}).where(eq(temas.id, temaId));
  await borrarSiEsLocal(t.videoUrl);
}

export async function quitarVideo(db: Db, temaId: string) {
  const [t] = await db.select().from(temas).where(eq(temas.id, temaId));
  if (!t) return;
  await db.update(temas).set({videoUrl: null, videoTitulo: null}).where(eq(temas.id, temaId));
  await borrarSiEsLocal(t.videoUrl);
}

async function borrarSiEsLocal(url: string | null) {
  if (!url?.startsWith(PREFIJO_URL)) return;
  const nombre = url.slice(PREFIJO_URL.length);
  if (NOMBRE_VALIDO.test(nombre)) await fs.rm(path.join(carpetaVideos(), nombre), {force: true});
}

/** Ubica un video guardado. El nombre se valida para que no se pueda leer otra cosa del disco. */
export async function archivoVideo(nombre: string): Promise<{ruta: string; tamano: number; tipo: string} | null> {
  if (!NOMBRE_VALIDO.test(nombre)) return null;
  const ruta = path.join(carpetaVideos(), nombre);
  try {
    const st = await fs.stat(ruta);
    const ext = nombre.split('.').pop()!;
    const tipo = Object.entries(TIPOS).find(([, e]) => e === ext)![0];
    return {ruta, tamano: st.size, tipo};
  } catch {
    return null;
  }
}

/** Interpreta «Range: bytes=inicio-fin». Devuelve null si no hay rango o si no es válido. */
export function rango(cabecera: string | null, tamano: number): {inicio: number; fin: number} | null {
  const m = cabecera?.match(/^bytes=(\d*)-(\d*)$/);
  if (!m || (m[1] === '' && m[2] === '')) return null;
  let inicio: number;
  let fin: number;
  if (m[1] === '') {
    inicio = Math.max(0, tamano - Number(m[2]));
    fin = tamano - 1;
  } else {
    inicio = Number(m[1]);
    fin = m[2] === '' ? tamano - 1 : Math.min(Number(m[2]), tamano - 1);
  }
  if (inicio > fin || inicio >= tamano) return null;
  return {inicio, fin};
}
