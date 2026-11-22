import {randomBytes} from 'node:crypto';
import {promises as fs} from 'node:fs';
import path from 'node:path';
import {and, desc, eq} from 'drizzle-orm';
import type {Db} from './db';
import {ajustes, pagos, usuarios, type METODOS_PAGO} from './db/schema';
import {cambiarPlan, planDe} from './acceso';

// Pago único: $45 con IVA incluido, acceso completo hasta el examen de 2027.
// Deuna y transferencia: el docente avisa con su comprobante y el administrador aprueba desde el panel.
// Tarjeta (Payphone) se agrega cuando estén las credenciales.

export const PRECIO_CENTAVOS = 4500;
export const IVA_PORCENTAJE = 15;
export const ACCESO_HASTA = 'el examen de 2027';
export const precioTexto = () => `$${(PRECIO_CENTAVOS / 100).toFixed(0)}`;

export type MetodoPago = (typeof METODOS_PAGO)[number];
export type Pago = typeof pagos.$inferSelect;

export class ErrorPago extends Error {}

// ── Datos de cobro que el administrador edita en el panel ──

export type DatosCobro = {cuentas: string; deunaLink: string; deunaQr: string | null};
const CLAVES = {cuentas: 'cobro_cuentas', deunaLink: 'cobro_deuna_link', deunaQr: 'cobro_deuna_qr'} as const;

export async function datosCobro(db: Db): Promise<DatosCobro> {
  const filas = await db.select().from(ajustes);
  const v = (k: string) => filas.find((f) => f.clave === k)?.valor ?? '';
  return {cuentas: v(CLAVES.cuentas), deunaLink: v(CLAVES.deunaLink), deunaQr: v(CLAVES.deunaQr) || null};
}

async function fijar(db: Db, clave: string, valor: string) {
  await db.insert(ajustes).values({clave, valor}).onConflictDoUpdate({target: ajustes.clave, set: {valor}});
}

export async function guardarDatosCobro(db: Db, d: {cuentas?: string; deunaLink?: string; deunaQr?: string}) {
  if (d.cuentas !== undefined) await fijar(db, CLAVES.cuentas, d.cuentas.trim().slice(0, 2000));
  if (d.deunaLink !== undefined) {
    const link = d.deunaLink.trim();
    if (link && !/^https:\/\//.test(link)) throw new ErrorPago('El link de Deuna debe empezar con https://');
    await fijar(db, CLAVES.deunaLink, link.slice(0, 500));
  }
  if (d.deunaQr !== undefined) await fijar(db, CLAVES.deunaQr, d.deunaQr);
}

// ── Archivos: fotos de comprobantes y el QR de Deuna, en el volumen persistente ──

const TIPOS: Record<string, string> = {'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'application/pdf': 'pdf'};
export const MAX_ARCHIVO_BYTES = 6 * 1024 * 1024;
const NOMBRE_VALIDO = /^[a-z0-9-]+\.(jpg|png|webp|pdf)$/;

export function carpetaPagos(): string {
  return path.join(process.env.DATA_DIR || path.join(process.cwd(), 'data-local'), 'pagos');
}

/** Guarda una imagen o PDF y devuelve su nombre. */
export async function guardarArchivo(archivo: File, prefijo: string): Promise<string> {
  const ext = TIPOS[archivo.type];
  if (!ext) throw new ErrorPago('Sube una foto (JPG, PNG o WebP) o un PDF');
  if (archivo.size > MAX_ARCHIVO_BYTES) throw new ErrorPago('El archivo pasa de 6 MB');
  if (archivo.size === 0) throw new ErrorPago('El archivo está vacío');
  await fs.mkdir(carpetaPagos(), {recursive: true});
  const nombre = `${prefijo}-${Date.now().toString(36)}-${randomBytes(4).toString('hex')}.${ext}`;
  await fs.writeFile(path.join(carpetaPagos(), nombre), Buffer.from(await archivo.arrayBuffer()));
  return nombre;
}

export async function leerArchivo(nombre: string): Promise<{datos: Buffer; tipo: string} | null> {
  if (!NOMBRE_VALIDO.test(nombre)) return null;
  try {
    const datos = await fs.readFile(path.join(carpetaPagos(), nombre));
    const ext = nombre.split('.').pop()!;
    const tipo = Object.entries(TIPOS).find(([, e]) => e === ext)![0];
    return {datos, tipo};
  } catch {
    return null;
  }
}

// ── Pagos ──

/** El último pago del docente (para mostrarle si está en revisión o si fue rechazado). */
export async function ultimoPago(db: Db, usuarioId: string): Promise<Pago | null> {
  const [p] = await db.select().from(pagos).where(eq(pagos.usuarioId, usuarioId)).orderBy(desc(pagos.id)).limit(1);
  return p ?? null;
}

/** El docente avisa que pagó por Deuna o transferencia. Queda pendiente hasta que el administrador lo revise. */
export async function avisarPago(db: Db, usuarioId: string, d: {metodo: string; referencia: string; archivo?: string | null}): Promise<Pago> {
  if (d.metodo !== 'deuna' && d.metodo !== 'transferencia') throw new ErrorPago('Elige cómo pagaste');
  const referencia = d.referencia.trim().slice(0, 120);
  if (!referencia && !d.archivo) throw new ErrorPago('Escribe el número de comprobante o sube la foto del comprobante');
  if ((await planDe(db, usuarioId)) === 'completo') throw new ErrorPago('Ya tienes el acceso completo');
  const [pendiente] = await db.select({id: pagos.id}).from(pagos).where(and(eq(pagos.usuarioId, usuarioId), eq(pagos.estado, 'pendiente')));
  if (pendiente) throw new ErrorPago('Ya tienes un pago en revisión. Te avisamos apenas lo confirmemos.');
  const [p] = await db
    .insert(pagos)
    .values({usuarioId, metodo: d.metodo, monto: PRECIO_CENTAVOS, referencia, archivo: d.archivo ?? null})
    .returning();
  return p;
}

export type PagoConDocente = Pago & {nombre: string; correo: string};

/** Para el panel: los pendientes primero, luego los más recientes. */
export async function pagosParaRevisar(db: Db): Promise<PagoConDocente[]> {
  const filas = await db
    .select({p: pagos, nombre: usuarios.nombre, correo: usuarios.correo})
    .from(pagos)
    .innerJoin(usuarios, eq(usuarios.id, pagos.usuarioId))
    .orderBy(desc(pagos.id))
    .limit(200);
  const lista = filas.map((f) => ({...f.p, nombre: f.nombre, correo: f.correo}));
  return [...lista.filter((p) => p.estado === 'pendiente'), ...lista.filter((p) => p.estado !== 'pendiente')];
}

/** Aprueba el pago y abre todo para el docente. */
export async function aprobarPago(db: Db, id: number, ahora: Date = new Date()) {
  const [p] = await db
    .update(pagos)
    .set({estado: 'aprobado', revisado: ahora, nota: null})
    .where(and(eq(pagos.id, id), eq(pagos.estado, 'pendiente')))
    .returning();
  if (!p) throw new ErrorPago('Ese pago ya fue revisado');
  await cambiarPlan(db, p.usuarioId, 'completo');
}

export async function rechazarPago(db: Db, id: number, nota: string, ahora: Date = new Date()) {
  const [p] = await db
    .update(pagos)
    .set({estado: 'rechazado', revisado: ahora, nota: nota.trim().slice(0, 300) || 'No pudimos confirmar el pago.'})
    .where(and(eq(pagos.id, id), eq(pagos.estado, 'pendiente')))
    .returning();
  if (!p) throw new ErrorPago('Ese pago ya fue revisado');
}
