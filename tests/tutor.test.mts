import {test} from 'node:test';
import assert from 'node:assert/strict';
import {crearDbPrueba} from '../lib/db/index.ts';
import {sembrar} from '../lib/db/sembrar.ts';
import {crearUsuario, elegirEspecialidad} from '../lib/usuarios.ts';
import {historialTutor, porQueMeEquivoque, preguntarTutor, MAX_MENSAJES_DIA, type Llamador, type Mensaje} from '../lib/tutor.ts';

const AHORA = new Date('2026-11-15T15:00:00Z');

async function preparar() {
  const db = await crearDbPrueba();
  await sembrar(db);
  const u = await crearUsuario(db, {nombre: 'Docente', correo: 'docente@correo.com', clave: '12345678'});
  await elegirEspecialidad(db, u.id, 'ccnn-egb-superior');
  return {db, uid: u.id};
}

test('sin clave de Gemini el tutor no está disponible', async () => {
  delete process.env.GEMINI_API_KEY;
  const {db, uid} = await preparar();
  assert.deepEqual(await preguntarTutor(db, uid, 'anatomia-celular-1', '¿Qué es el nucléolo?'), {disponible: false});
});

test('el tutor recibe el contenido de la lección y guarda la conversación', async () => {
  const {db, uid} = await preparar();
  let visto: {sistema: string; mensajes: Mensaje[]} | null = null;
  const llamar: Llamador = async (sistema, mensajes) => {
    visto = {sistema, mensajes};
    return 'El nucléolo fabrica las subunidades de los ribosomas.';
  };
  const r = await preguntarTutor(db, uid, 'anatomia-celular-1', '¿Qué hace el nucléolo?', {ahora: AHORA, llamar});
  assert.deepEqual(r, {disponible: true, respuesta: 'El nucléolo fabrica las subunidades de los ribosomas.', restantes: MAX_MENSAJES_DIA - 1});
  assert.match(visto!.sistema, /Ineval/);
  assert.match(visto!.sistema, /Relacionar la estructura celular con su función/);
  assert.match(visto!.sistema, /Procariota y eucariota/);
  await preguntarTutor(db, uid, 'anatomia-celular-1', '¿Y el ribosoma?', {ahora: AHORA, llamar});
  assert.equal(visto!.mensajes.length, 3, 'manda la conversación previa');
  assert.equal((await historialTutor(db, uid, 'anatomia-celular-1')).length, 4);
});

test('el tutor no abre temas cerrados y tiene límite diario', async () => {
  const {db, uid} = await preparar();
  const llamar: Llamador = async () => 'ok';
  await assert.rejects(preguntarTutor(db, uid, 'fisiologia-celular-1', 'hola', {ahora: AHORA, llamar}), /próximamente/);
  for (let i = 0; i < MAX_MENSAJES_DIA; i++) await preguntarTutor(db, uid, 'anatomia-celular-2', `duda ${i}`, {ahora: AHORA, llamar});
  await assert.rejects(preguntarTutor(db, uid, 'anatomia-celular-2', 'una más', {ahora: AHORA, llamar}), /Mañana/);
  const manana = new Date(AHORA.getTime() + 86400_000);
  const r = await preguntarTutor(db, uid, 'anatomia-celular-2', 'nuevo día', {ahora: manana, llamar});
  assert.ok(r.disponible);
});

test('«¿Por qué me equivoqué?» explica desde la opción elegida', async () => {
  const {db, uid} = await preparar();
  let consulta = '';
  const llamar: Llamador = async (_s, m) => {
    consulta = m[0].texto;
    return 'Confundiste la membrana con la pared.';
  };
  const r = await porQueMeEquivoque(db, uid, 'ac-13', 0, {ahora: AHORA, llamar});
  assert.ok(r.disponible && r.respuesta.includes('pared'));
  assert.match(consulta, /Elegí: A\. La correcta es C/);
});
