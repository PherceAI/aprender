import {test} from 'node:test';
import assert from 'node:assert/strict';
import {crearDbPrueba} from '../lib/db/index.ts';
import {sembrar} from '../lib/db/sembrar.ts';
import {crearUsuario, elegirEspecialidad} from '../lib/usuarios.ts';
import {iniciarIntento, responder} from '../lib/intentos.ts';
import {completarLeccion} from '../lib/curso.ts';
import {actividadSemana, metaDeHoy} from '../lib/actividad.ts';

// Inicio y Mi ruta muestran la meta del día y la actividad de la semana con datos reales.

const AHORA = new Date('2026-11-18T15:00:00Z'); // miércoles 18, 10:00 en Ecuador

async function preparar() {
  const db = await crearDbPrueba();
  await sembrar(db);
  const u = await crearUsuario(db, {nombre: 'Docente', correo: 'docente@correo.com', clave: '12345678'});
  await elegirEspecialidad(db, u.id, 'ccnn-egb-superior');
  return {db, uid: u.id};
}

test('la semana va de lunes a domingo y cuenta las preguntas de cada día', async () => {
  const {db, uid} = await preparar();
  const v = await iniciarIntento(db, uid, 'diagnostico', null, AHORA);
  for (const p of v.preguntas.slice(0, 4)) await responder(db, uid, v.id, p.id, {elegida: 0}, AHORA);
  const s = await actividadSemana(db, uid, AHORA);
  assert.deepEqual(s.map((d) => d.etiqueta), ['L', 'M', 'M', 'J', 'V', 'S', 'D']);
  assert.equal(s[0].dia, '2026-11-16');
  const hoy = s.find((d) => d.esHoy)!;
  assert.equal(hoy.dia, '2026-11-18');
  assert.equal(hoy.respuestas, 4);
  assert.ok(hoy.activo);
  assert.equal(s[0].activo, false);
});

test('la meta de hoy sabe si estudió una lección y cuántas preguntas respondió', async () => {
  const {db, uid} = await preparar();
  let m = await metaDeHoy(db, uid, AHORA);
  assert.deepEqual([m.leccionHoy, m.respuestasHoy, m.repasoHoy], [false, 0, false]);
  await completarLeccion(db, uid, 'anatomia-celular-1', AHORA);
  const v = await iniciarIntento(db, uid, 'diagnostico', null, AHORA);
  for (const p of v.preguntas.slice(0, 3)) await responder(db, uid, v.id, p.id, {elegida: 0}, AHORA);
  m = await metaDeHoy(db, uid, AHORA);
  assert.deepEqual([m.leccionHoy, m.respuestasHoy], [true, 3]);
});
