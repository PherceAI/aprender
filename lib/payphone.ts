import {randomBytes} from 'node:crypto';
import {and, eq} from 'drizzle-orm';
import type {Db} from './db';
import {pagos} from './db/schema';
import {cambiarPlan, planDe} from './acceso';
import {ACCESO_HASTA, IVA_PORCENTAJE, PRECIO_CENTAVOS} from './pagos';

// Pago con tarjeta por la Cajita de Pagos de Payphone (docs.payphone.app/cajita-de-pagos).
// 1. La página de acceso muestra la Cajita con el token y el storeId de la app WEB de Payphone.
// 2. Payphone cobra y redirige a /acceso/payphone?id=…&clientTransactionId=…
// 3. Ahí el servidor confirma con la API de Payphone (antes de 5 minutos, si no, Payphone lo reversa)
//    y, si quedó aprobado por el monto correcto, abre el acceso completo al momento.
// Credenciales: PAYPHONE_TOKEN y PAYPHONE_STORE_ID en Coolify. Sin ellas, la tarjeta no aparece.

export const URL_CONFIRMAR = 'https://paymentbox.payphonetodoesposible.com/api/confirm';
export const CAJITA_JS = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.js';
export const CAJITA_CSS = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.css';

export type ConfigPayphone = {token: string; storeId: string};

export function configPayphone(env: Record<string, string | undefined> = process.env): ConfigPayphone | null {
  const token = env.PAYPHONE_TOKEN?.trim();
  const storeId = env.PAYPHONE_STORE_ID?.trim();
  return token && storeId ? {token, storeId} : null;
}

/** El precio en centavos, separado como lo pide Payphone: base gravada + IVA = total (el IVA ya está incluido). */
export function montosPayphone(total = PRECIO_CENTAVOS, iva = IVA_PORCENTAJE) {
  const amountWithTax = Math.round((total * 100) / (100 + iva));
  const tax = total - amountWithTax;
  return {amount: total, amountWithTax, tax};
}

/** Un id único por intento de pago, que empieza con el id del docente: así se sabe de quién es al volver. */
export function nuevoClientTransactionId(usuarioId: string): string {
  return `${usuarioId}-${Date.now().toString(36)}${randomBytes(2).toString('hex')}`;
}

/** Lo que la página de acceso le pasa a la Cajita. */
export function datosCajita(usuarioId: string, cfg: ConfigPayphone) {
  return {
    token: cfg.token,
    storeId: cfg.storeId,
    clientTransactionId: nuevoClientTransactionId(usuarioId),
    ...montosPayphone(),
    currency: 'USD',
    reference: `Pragma: acceso completo hasta ${ACCESO_HASTA}`.slice(0, 100),
    lang: 'es',
    defaultMethod: 'card',
    timeZone: -5,
  };
}

export type ResultadoTarjeta =
  | {estado: 'aprobado'; yaEstaba: boolean}
  | {estado: 'cancelado'}
  | {estado: 'error'; mensaje: string};

type Fetch = (url: string, init: {method: string; headers: Record<string, string>; body: string}) => Promise<{ok: boolean; json: () => Promise<unknown>}>;

/**
 * Confirma con Payphone el pago que acaba de volver y, si está aprobado por el monto correcto,
 * lo registra como pago aprobado y abre el acceso completo. Se puede llamar dos veces (recargar la página):
 * la segunda vez encuentra el pago ya registrado.
 */
export async function confirmarPagoTarjeta(
  db: Db,
  usuarioId: string,
  d: {id: string | null | undefined; clientTransactionId: string | null | undefined},
  cfg: ConfigPayphone | null = configPayphone(),
  fetcher: Fetch = fetch as unknown as Fetch,
  ahora: Date = new Date()
): Promise<ResultadoTarjeta> {
  const id = Number(d.id);
  const clientTxId = (d.clientTransactionId ?? '').trim();
  if (!cfg) return {estado: 'error', mensaje: 'El pago con tarjeta todavía no está activo.'};
  if (!Number.isInteger(id) || id <= 0 || !clientTxId) return {estado: 'error', mensaje: 'No recibimos los datos del pago.'};
  if (!clientTxId.startsWith(`${usuarioId}-`)) return {estado: 'error', mensaje: 'Este pago no corresponde a tu cuenta.'};

  const referencia = `payphone:${id}`;
  const [previo] = await db.select().from(pagos).where(eq(pagos.referencia, referencia));
  if (previo) {
    if (previo.usuarioId !== usuarioId) return {estado: 'error', mensaje: 'Este pago no corresponde a tu cuenta.'};
    return {estado: 'aprobado', yaEstaba: true};
  }

  let r: {statusCode?: number; transactionStatus?: string; amount?: number; clientTransactionId?: string; message?: string};
  try {
    const resp = await fetcher(URL_CONFIRMAR, {
      method: 'POST',
      headers: {Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({id, clientTxId}),
    });
    r = (await resp.json()) as typeof r;
  } catch {
    return {estado: 'error', mensaje: 'No pudimos comunicarnos con Payphone. Si se debitó el valor, escríbenos por WhatsApp.'};
  }

  if (r.statusCode === 2 || r.transactionStatus === 'Canceled') return {estado: 'cancelado'};
  if (r.statusCode !== 3 || r.transactionStatus !== 'Approved') {
    return {estado: 'error', mensaje: r.message ? `Payphone respondió: ${r.message}` : 'Payphone no confirmó el pago.'};
  }
  if (r.amount !== PRECIO_CENTAVOS) return {estado: 'error', mensaje: 'El monto del pago no coincide. Escríbenos por WhatsApp.'};
  if (r.clientTransactionId && r.clientTransactionId !== clientTxId) return {estado: 'error', mensaje: 'Este pago no corresponde a tu cuenta.'};

  try {
    await db.insert(pagos).values({usuarioId, metodo: 'tarjeta', monto: PRECIO_CENTAVOS, estado: 'aprobado', referencia, creado: ahora, revisado: ahora});
  } catch {
    // Otra pestaña lo registró al mismo tiempo (índice único): el acceso ya quedó abierto.
    return {estado: 'aprobado', yaEstaba: true};
  }
  if ((await planDe(db, usuarioId)) !== 'completo') await cambiarPlan(db, usuarioId, 'completo');
  // Si tenía un aviso de Deuna o transferencia en revisión, se cierra: ya pagó con tarjeta.
  await db
    .update(pagos)
    .set({estado: 'rechazado', revisado: ahora, nota: 'Ya pagaste con tarjeta: este aviso no hace falta.'})
    .where(and(eq(pagos.usuarioId, usuarioId), eq(pagos.estado, 'pendiente')));
  return {estado: 'aprobado', yaEstaba: false};
}
