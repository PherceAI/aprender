import {test} from 'node:test';
import assert from 'node:assert/strict';
import {eq} from 'drizzle-orm';
import {crearDbPrueba} from '../lib/db/index.ts';
import {sembrar} from '../lib/db/sembrar.ts';
import {pagos} from '../lib/db/schema.ts';
import {registrar} from '../lib/usuarios.ts';
import {planDe} from '../lib/acceso.ts';
import {avisarPago} from '../lib/pagos.ts';
import {configPayphone, confirmarPagoTarjeta, datosCajita, montosPayphone, nuevoClientTransactionId, URL_CONFIRMAR} from '../lib/payphone.ts';

const CFG = {token: 'token-de-prueba', storeId: 'tienda-de-prueba'};

/** Un Payphone de mentira: responde lo que se le diga y guarda lo que recibió. */
function payphoneFalso(respuesta: Record<string, unknown>) {
  const llamadas: {url: string; init: {method: string; headers: Record<string, string>; body: string}}[] = [];
  const fetcher = async (url: string, init: {method: string; headers: Record<string, string>; body: string}) => {
    llamadas.push({url, init});
    return {ok: true, json: async () => respuesta};
  };
  return {fetcher, llamadas};
}

async function preparar() {
  const db = await crearDbPrueba();
  await sembrar(db);
  const u = await registrar(db, {nombre: 'Ana Ruiz', correo: 'ana@correo.ec', clave: 'clave-segura'});
  return {db, u};
}

test('los montos de Payphone: $45 con el 15 % de IVA incluido, en centavos y sumando exacto', () => {
  const m = montosPayphone();
  assert.deepEqual(m, {amount: 4500, amountWithTax: 3913, tax: 587});
  assert.equal(m.amountWithTax + m.tax, m.amount);
});

test('sin token y storeId la tarjeta no está activa', () => {
  assert.equal(configPayphone({}), null);
  assert.equal(configPayphone({PAYPHONE_TOKEN: 'x'}), null);
  assert.deepEqual(configPayphone({PAYPHONE_TOKEN: ' t ', PAYPHONE_STORE_ID: 's'}), {token: 't', storeId: 's'});
});

test('cada intento lleva un id único de menos de 50 caracteres que empieza con el docente', () => {
  const a = nuevoClientTransactionId('u123abc');
  const b = nuevoClientTransactionId('u123abc');
  assert.notEqual(a, b);
  assert.ok(a.startsWith('u123abc-') && a.length <= 50);
  const d = datosCajita('u123abc', CFG);
  assert.equal(d.currency, 'USD');
  assert.ok(String(d.reference).length <= 100);
});

test('pago aprobado: confirma con Payphone, abre el acceso y registra el pago una sola vez', async () => {
  const {db, u} = await preparar();
  const clientTransactionId = nuevoClientTransactionId(u.id);
  const pp = payphoneFalso({statusCode: 3, transactionStatus: 'Approved', amount: 4500, clientTransactionId});
  const r = await confirmarPagoTarjeta(db, u.id, {id: '987', clientTransactionId}, CFG, pp.fetcher);
  assert.deepEqual(r, {estado: 'aprobado', yaEstaba: false});
  assert.equal(await planDe(db, u.id), 'completo');
  assert.equal(pp.llamadas[0].url, URL_CONFIRMAR);
  assert.equal(pp.llamadas[0].init.headers.Authorization, 'Bearer token-de-prueba');
  assert.deepEqual(JSON.parse(pp.llamadas[0].init.body), {id: 987, clientTxId: clientTransactionId});

  // Recargar la página no cobra ni registra dos veces.
  const otra = await confirmarPagoTarjeta(db, u.id, {id: '987', clientTransactionId}, CFG, pp.fetcher);
  assert.deepEqual(otra, {estado: 'aprobado', yaEstaba: true});
  const filas = await db.select().from(pagos).where(eq(pagos.usuarioId, u.id));
  assert.equal(filas.length, 1);
  assert.deepEqual([filas[0].metodo, filas[0].estado, filas[0].monto, filas[0].referencia], ['tarjeta', 'aprobado', 4500, 'payphone:987']);
});

test('pago cancelado o rechazado: no abre nada', async () => {
  const {db, u} = await preparar();
  const clientTransactionId = nuevoClientTransactionId(u.id);
  const r = await confirmarPagoTarjeta(db, u.id, {id: '5', clientTransactionId}, CFG, payphoneFalso({statusCode: 2, transactionStatus: 'Canceled'}).fetcher);
  assert.deepEqual(r, {estado: 'cancelado'});
  assert.equal(await planDe(db, u.id), 'gratis');
  const e = await confirmarPagoTarjeta(db, u.id, {id: '6', clientTransactionId}, CFG, payphoneFalso({message: 'La transacción no existe', errorCode: 20}).fetcher);
  assert.equal(e.estado, 'error');
  assert.equal(await planDe(db, u.id), 'gratis');
});

test('no se aceptan pagos de otro monto, de otra cuenta ni sin datos', async () => {
  const {db, u} = await preparar();
  const propio = nuevoClientTransactionId(u.id);
  const barato = await confirmarPagoTarjeta(db, u.id, {id: '7', clientTransactionId: propio}, CFG, payphoneFalso({statusCode: 3, transactionStatus: 'Approved', amount: 100}).fetcher);
  assert.equal(barato.estado, 'error');
  const ajeno = await confirmarPagoTarjeta(db, u.id, {id: '8', clientTransactionId: nuevoClientTransactionId('uotro')}, CFG, payphoneFalso({statusCode: 3, transactionStatus: 'Approved', amount: 4500}).fetcher);
  assert.equal(ajeno.estado, 'error');
  const vacio = await confirmarPagoTarjeta(db, u.id, {id: null, clientTransactionId: null}, CFG, payphoneFalso({}).fetcher);
  assert.equal(vacio.estado, 'error');
  const sinConfig = await confirmarPagoTarjeta(db, u.id, {id: '9', clientTransactionId: propio}, null, payphoneFalso({}).fetcher);
  assert.equal(sinConfig.estado, 'error');
  assert.equal(await planDe(db, u.id), 'gratis');
});

test('si tenía un aviso de Deuna en revisión y paga con tarjeta, el aviso se cierra', async () => {
  const {db, u} = await preparar();
  await avisarPago(db, u.id, {metodo: 'deuna', referencia: 'comprobante 123'});
  const clientTransactionId = nuevoClientTransactionId(u.id);
  await confirmarPagoTarjeta(db, u.id, {id: '42', clientTransactionId}, CFG, payphoneFalso({statusCode: 3, transactionStatus: 'Approved', amount: 4500, clientTransactionId}).fetcher);
  const filas = await db.select().from(pagos).where(eq(pagos.usuarioId, u.id));
  assert.deepEqual(filas.map((f) => [f.metodo, f.estado]).sort(), [['deuna', 'rechazado'], ['tarjeta', 'aprobado']]);
});
