import {test} from 'node:test';
import assert from 'node:assert/strict';
import {crearDbPrueba} from '../lib/db/index.ts';
import {sembrar} from '../lib/db/sembrar.ts';
import {registrar} from '../lib/usuarios.ts';
import {planDe} from '../lib/acceso.ts';
import {aprobarPago, avisarPago, datosCobro, ErrorPago, guardarDatosCobro, pagosParaRevisar, PRECIO_CENTAVOS, rechazarPago, ultimoPago} from '../lib/pagos.ts';

async function preparar() {
  const db = await crearDbPrueba();
  await sembrar(db);
  const u = await registrar(db, {nombre: 'Ana Ruiz', correo: 'ana@correo.ec', clave: 'clave-segura'});
  return {db, u};
}

test('el docente avisa su pago por transferencia y el administrador lo aprueba: se abre todo', async () => {
  const {db, u} = await preparar();
  await assert.rejects(avisarPago(db, u.id, {metodo: 'transferencia', referencia: '  '}), ErrorPago);
  await assert.rejects(avisarPago(db, u.id, {metodo: 'efectivo', referencia: '123'}), ErrorPago);
  const p = await avisarPago(db, u.id, {metodo: 'transferencia', referencia: 'Comp 0045123'});
  assert.equal(p.monto, PRECIO_CENTAVOS);
  assert.equal(p.estado, 'pendiente');
  await assert.rejects(avisarPago(db, u.id, {metodo: 'deuna', referencia: 'otra'}), /en revisión/);
  assert.equal((await pagosParaRevisar(db))[0].nombre, 'Ana Ruiz');

  await aprobarPago(db, p.id);
  assert.equal(await planDe(db, u.id), 'completo');
  assert.equal((await ultimoPago(db, u.id))?.estado, 'aprobado');
  await assert.rejects(aprobarPago(db, p.id), ErrorPago);
  await assert.rejects(avisarPago(db, u.id, {metodo: 'deuna', referencia: 'x'}), /Ya tienes el acceso completo/);
});

test('un pago rechazado deja la cuenta gratis, con el motivo, y se puede volver a avisar', async () => {
  const {db, u} = await preparar();
  const p = await avisarPago(db, u.id, {metodo: 'deuna', referencia: '', archivo: 'comprobante-abc.jpg'});
  await rechazarPago(db, p.id, 'El monto no coincide');
  assert.equal(await planDe(db, u.id), 'gratis');
  assert.equal((await ultimoPago(db, u.id))?.nota, 'El monto no coincide');
  assert.ok(await avisarPago(db, u.id, {metodo: 'deuna', referencia: 'Deuna 778899'}));
});

test('el administrador guarda las cuentas y el link de Deuna', async () => {
  const {db} = await preparar();
  assert.deepEqual(await datosCobro(db), {cuentas: '', deunaLink: '', deunaQr: null});
  await guardarDatosCobro(db, {cuentas: 'Banco Pichincha, ahorros 2200...', deunaLink: 'https://pagar.deuna.app/x'});
  await guardarDatosCobro(db, {deunaQr: 'qr-deuna-1.png'});
  const d = await datosCobro(db);
  assert.equal(d.deunaQr, 'qr-deuna-1.png');
  assert.match(d.cuentas, /Pichincha/);
  await assert.rejects(guardarDatosCobro(db, {deunaLink: 'http://inseguro'}), ErrorPago);
});
