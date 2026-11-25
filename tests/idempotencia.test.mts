import {test} from 'node:test';
import assert from 'node:assert/strict';
import {and, eq, inArray} from 'drizzle-orm';
import {crearDbPrueba} from '../lib/db/index.ts';
import {sembrar} from '../lib/db/sembrar.ts';
import {intentos, leccionesElegidas, pagos, preguntas, repaso, respuestas, usuarios} from '../lib/db/schema.ts';
import {crearUsuario, elegirEspecialidad, registrar} from '../lib/usuarios.ts';
import {iniciarIntento, responder, terminarIntento} from '../lib/intentos.ts';
import {elegirLeccion, LECCIONES_GRATIS} from '../lib/acceso.ts';
import {avisarPago} from '../lib/pagos.ts';

// Lo que pasa cuando el docente toca dos veces, tiene dos pestañas o recarga en medio de una acción.

async function preparar() {
  const db = await crearDbPrueba();
  await sembrar(db);
  const u = await crearUsuario(db, {nombre: 'Docente', correo: 'docente@correo.ec', clave: 'clave-segura'});
  await elegirEspecialidad(db, u.id, 'ccnn-egb-superior');
  return {db, uid: u.id};
}

test('responder la misma pregunta dos veces a la vez guarda una sola respuesta', async () => {
  const {db, uid} = await preparar();
  const v = await iniciarIntento(db, uid, 'prueba-tema', 'anatomia-celular');
  const p = v.preguntas[0];
  const rs = await Promise.allSettled([0, 1].map(() => responder(db, uid, v.id, p.id, {elegida: 0})));
  assert.equal(rs.filter((r) => r.status === 'fulfilled').length, 1);
  const guardadas = await db.select().from(respuestas).where(and(eq(respuestas.intentoId, v.id), eq(respuestas.preguntaId, p.id)));
  assert.equal(guardadas.length, 1);
});

test('terminar el mismo intento dos veces a la vez aplica los efectos una sola vez', async () => {
  const {db, uid} = await preparar();
  const v = await iniciarIntento(db, uid, 'prueba-tema', 'anatomia-celular');
  const ps = await db.select().from(preguntas).where(inArray(preguntas.id, v.preguntas.map((p) => p.id)));
  for (const p of ps) await responder(db, uid, v.id, p.id, {elegida: (p.correcta + 1) % 4});
  const [a, b] = await Promise.all([terminarIntento(db, uid, v.id), terminarIntento(db, uid, v.id)]);
  assert.equal(a.puntaje, b.puntaje);
  assert.equal(Boolean(a.avance) || Boolean(b.avance), true);
  const [i] = await db.select().from(intentos).where(eq(intentos.id, v.id));
  assert.ok(i.terminado);
  // Una nueva lectura del resultado (recargar la página) no vuelve a aplicar nada.
  const antes = (await db.select().from(repaso).where(eq(repaso.usuarioId, uid))).length;
  await terminarIntento(db, uid, v.id);
  assert.equal((await db.select().from(repaso).where(eq(repaso.usuarioId, uid))).length, antes);
});

test('avisar el pago dos veces a la vez deja un solo pago en revisión', async () => {
  const {db} = await preparar();
  const g = await registrar(db, {nombre: 'Ana', correo: 'ana@correo.ec', clave: 'clave-segura'});
  const rs = await Promise.allSettled([0, 1].map(() => avisarPago(db, g.id, {metodo: 'transferencia', referencia: 'Comp 1'})));
  assert.equal(rs.filter((r) => r.status === 'fulfilled').length, 1);
  assert.equal((await db.select().from(pagos).where(eq(pagos.usuarioId, g.id))).length, 1);
});

test('registrarse dos veces a la vez crea una sola cuenta', async () => {
  const {db} = await preparar();
  const rs = await Promise.allSettled([0, 1].map(() => registrar(db, {nombre: 'Luis', correo: 'luis@correo.ec', clave: 'clave-segura'})));
  assert.equal(rs.filter((r) => r.status === 'fulfilled').length, 1);
  const rechazo = rs.find((r) => r.status === 'rejected') as PromiseRejectedResult;
  assert.match(String(rechazo.reason?.message), /Ya existe/);
  assert.equal((await db.select().from(usuarios).where(eq(usuarios.correo, 'luis@correo.ec'))).length, 1);
});

test('elegir lecciones gratis desde varias pestañas no pasa del límite', async () => {
  const {db} = await preparar();
  const g = await registrar(db, {nombre: 'Ana', correo: 'ana@correo.ec', clave: 'clave-segura'});
  const ids = ['anatomia-celular-1', 'anatomia-celular-2', 'rea-1', 'medios-digitales-1', 'riesgos-digitales-1'];
  await Promise.all(ids.map((id) => elegirLeccion(db, g.id, id)));
  const elegidas = await db.select().from(leccionesElegidas).where(eq(leccionesElegidas.usuarioId, g.id));
  assert.ok(elegidas.length <= LECCIONES_GRATIS, `eligió ${elegidas.length}`);
});
