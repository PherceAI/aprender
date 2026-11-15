import {test} from 'node:test';
import assert from 'node:assert/strict';
import {and, eq, inArray} from 'drizzle-orm';
import {crearDbPrueba, type Db} from '../lib/db/index.ts';
import {sembrar} from '../lib/db/sembrar.ts';
import {dominio, intentos, preguntas} from '../lib/db/schema.ts';
import {crearUsuario, elegirEspecialidad} from '../lib/usuarios.ts';
import {iniciarIntento, responder, terminarIntento, vistaIntento, ErrorAcademia} from '../lib/intentos.ts';
import {preparacion, saltarTema} from '../lib/dominio.ts';
import {pendientesDeRepaso} from '../lib/repaso.ts';

const AHORA = new Date('2026-11-15T15:00:00Z'); // 10:00 en Ecuador
const enMin = (min: number) => new Date(AHORA.getTime() + min * 60_000);
const enDias = (d: number) => new Date(AHORA.getTime() + d * 86400_000);

async function preparar() {
  const db = await crearDbPrueba();
  await sembrar(db);
  const u = await crearUsuario(db, {nombre: 'Docente', correo: 'docente@correo.com', clave: '12345678'});
  await elegirEspecialidad(db, u.id, 'ccnn-egb-superior');
  return {db, uid: u.id};
}

async function claves(db: Db, ids: string[]) {
  const ps = await db.select().from(preguntas).where(inArray(preguntas.id, ids));
  return new Map(ps.map((p) => [p.id, p]));
}

/** Responde todo el intento: acierta las preguntas para las que `acertar` devuelve true. */
async function responderTodo(db: Db, uid: string, intentoId: string, acertar: (id: string, i: number) => boolean, extra = {}) {
  const v = await vistaIntento(db, uid, intentoId);
  const k = await claves(db, v.preguntas.map((p) => p.id));
  for (const [i, p] of v.preguntas.entries()) {
    const c = k.get(p.id)!.correcta;
    await responder(db, uid, intentoId, p.id, {elegida: acertar(p.id, i) ? c : (c + 1) % 4, ...extra}, AHORA);
  }
}

test('la pregunta que recibe el docente no trae la respuesta', async () => {
  const {db, uid} = await preparar();
  const v = await iniciarIntento(db, uid, 'diagnostico', null, AHORA);
  for (const p of v.preguntas) {
    assert.ok(!('correcta' in p) && !('explicaciones' in p) && !('solucion' in p), `la pregunta ${p.id} trae la respuesta`);
  }
});

test('diagnóstico: 18 preguntas por unidad, sin retroalimentación, se retoma y ubica al docente', async () => {
  const {db, uid} = await preparar();
  const v = await iniciarIntento(db, uid, 'diagnostico', null, AHORA);
  assert.equal(v.preguntas.length, 18);
  assert.equal(v.retroalimentacion, 'ninguna');
  const r = await responder(db, uid, v.id, v.preguntas[0].id, {elegida: 0, seguridad: 'lo-se'}, AHORA);
  assert.deepEqual(r, {registrada: true});
  // Se cerró la app: al volver sigue el mismo intento.
  const otra = await iniciarIntento(db, uid, 'diagnostico', null, enMin(30));
  assert.equal(otra.id, v.id);
  assert.equal(Object.keys(otra.respondidas).length, 1);

  // Acierta todo con seguridad en las 2 primeras unidades (Fundamentos), falla el resto.
  const k = await claves(db, v.preguntas.map((p) => p.id));
  await db.delete(intentos).where(eq(intentos.id, v.id));
  const nuevo = await iniciarIntento(db, uid, 'diagnostico', null, AHORA);
  for (const [i, p] of nuevo.preguntas.entries()) {
    const c = k.get(p.id)!.correcta;
    await responder(db, uid, nuevo.id, p.id, {elegida: i < 2 ? c : (c + 1) % 4, seguridad: 'lo-se'}, AHORA);
  }
  const res = await terminarIntento(db, uid, nuevo.id, AHORA);
  assert.equal(res.correccion, undefined, 'el diagnóstico no muestra corrección');
  const fund = res.ubicacion!.find((u) => u.unidadId === 'gen-fundamentos')!;
  assert.deepEqual([fund.nivel, fund.categoria], [70, 'fuerte']);
  assert.equal(res.ubicacion!.find((u) => u.unidadId === 'cn-seres-vivos')!.categoria, 'debil');
  const doms = await db.select().from(dominio).where(eq(dominio.usuarioId, uid));
  assert.ok(doms.every((d) => d.estado !== 'dominado'), 'el diagnóstico nunca da un tema por dominado');
  assert.equal(doms.find((d) => d.temaId === 'teorias-aprendizaje')!.nivel, 70);
});

test('adivinar vale menos que saber', async () => {
  const {db, uid} = await preparar();
  const v = await iniciarIntento(db, uid, 'diagnostico', null, AHORA);
  const k = await claves(db, v.preguntas.map((p) => p.id));
  for (const p of v.preguntas) await responder(db, uid, v.id, p.id, {elegida: k.get(p.id)!.correcta, seguridad: 'adivine'}, AHORA);
  const res = await terminarIntento(db, uid, v.id, AHORA);
  assert.equal(res.puntaje, 100);
  assert.ok(res.ubicacion!.every((u) => u.nivel === 18 && u.categoria === 'debil'));
});

test('no se responde dos veces, ni una pregunta ajena, ni el intento de otro docente', async () => {
  const {db, uid} = await preparar();
  const otro = await crearUsuario(db, {nombre: 'Otro', correo: 'otro@correo.com', clave: '12345678'});
  const v = await iniciarIntento(db, uid, 'prueba-tema', 'anatomia-celular', AHORA);
  const p = v.preguntas[0].id;
  await responder(db, uid, v.id, p, {elegida: 0}, AHORA);
  await assert.rejects(responder(db, uid, v.id, p, {elegida: 1}, AHORA), (e: ErrorAcademia) => e.codigo === 'repetida');
  await assert.rejects(responder(db, uid, v.id, 'diag-gen-01', {elegida: 1}, AHORA), (e: ErrorAcademia) => e.codigo === 'invalida');
  await assert.rejects(responder(db, otro.id, v.id, v.preguntas[1].id, {elegida: 1}, AHORA), (e: ErrorAcademia) => e.codigo === 'ajena');
  await assert.rejects(vistaIntento(db, otro.id, v.id), (e: ErrorAcademia) => e.codigo === 'ajena');
});

test('simulacro: tiene tiempo límite y se cierra solo al pasarlo', async () => {
  const {db, uid} = await preparar();
  const v = await iniciarIntento(db, uid, 'simulacro', null, AHORA);
  assert.equal(v.preguntas.length, 15);
  assert.equal(v.terminaEn!.getTime() - AHORA.getTime(), 20 * 60_000);
  const r = await responder(db, uid, v.id, v.preguntas[0].id, {elegida: 0}, enMin(1));
  assert.deepEqual(r, {registrada: true}, 'el simulacro no muestra la respuesta hasta el final');
  await assert.rejects(
    responder(db, uid, v.id, v.preguntas[1].id, {elegida: 0}, enMin(21)),
    (e: ErrorAcademia) => e.codigo === 'tiempo'
  );
  const [i] = await db.select().from(intentos).where(eq(intentos.id, v.id));
  assert.ok(i.terminado, 'el intento quedó cerrado');
  const res = await terminarIntento(db, uid, v.id, enMin(22));
  assert.equal(res.total, 15);
  assert.equal(res.correccion!.length, 15, 'al final sí muestra la corrección');
});

test('respuesta interactiva: ordenar se califica contra la solución', async () => {
  const {db, uid} = await preparar();
  const v = await iniciarIntento(db, uid, 'practica', 'anatomia-celular-1', AHORA);
  const i = (await db.insert(intentos).values({id: 'ix', usuarioId: uid, tipo: 'practica', referencia: 'anatomia-celular-1', preguntaIds: ['ac-08', 'ac-04']}).returning())[0];
  const bien = await responder(db, uid, i.id, 'ac-08', {interactiva: [1, 3, 0, 2, 4]}, AHORA);
  assert.ok('correcta' in bien && bien.correcta);
  const mal = await responder(db, uid, i.id, 'ac-04', {interactiva: [0, 1, 2, 3]}, AHORA);
  assert.ok('correcta' in mal && !mal.correcta);
  assert.ok(v.preguntas.length > 0 && v.preguntas.length <= 3);
});

test('un tema cerrado no se puede estudiar', async () => {
  const {db, uid} = await preparar();
  await assert.rejects(iniciarIntento(db, uid, 'prueba-tema', 'fisiologia-celular', AHORA), (e: ErrorAcademia) => e.codigo === 'tema-cerrado');
  await assert.rejects(iniciarIntento(db, uid, 'practica', 'fisiologia-celular-1', AHORA), (e: ErrorAcademia) => e.codigo === 'tema-cerrado');
});

test('prueba del tema: con 80 % o más queda dominado; con menos, aprendiendo', async () => {
  const {db, uid} = await preparar();
  const v = await iniciarIntento(db, uid, 'prueba-tema', 'anatomia-celular', AHORA);
  assert.equal(v.preguntas.length, 10);
  await responderTodo(db, uid, v.id, () => true);
  const res = await terminarIntento(db, uid, v.id, AHORA);
  assert.deepEqual([res.puntaje, res.dominado], [100, true]);
  let [d] = await db.select().from(dominio).where(and(eq(dominio.usuarioId, uid), eq(dominio.temaId, 'anatomia-celular')));
  assert.deepEqual([d.nivel, d.estado], [100, 'dominado']);
  assert.equal(await preparacion(db, uid, 'ccnn-egb-superior'), 3);

  const v2 = await iniciarIntento(db, uid, 'prueba-tema', 'anatomia-celular', enMin(10));
  await responderTodo(db, uid, v2.id, (_, i) => i < 7);
  const res2 = await terminarIntento(db, uid, v2.id, enMin(11));
  assert.deepEqual([res2.puntaje, res2.dominado], [70, false]);
  [d] = await db.select().from(dominio).where(and(eq(dominio.usuarioId, uid), eq(dominio.temaId, 'anatomia-celular')));
  assert.equal(d.estado, 'aprendiendo');
});

test('lo fallado vuelve en el repaso: mañana, y si acierta a los 3 días', async () => {
  const {db, uid} = await preparar();
  const v = await iniciarIntento(db, uid, 'prueba-tema', 'anatomia-celular', AHORA);
  const fallada = v.preguntas[0].id;
  await responderTodo(db, uid, v.id, (id) => id !== fallada);
  await terminarIntento(db, uid, v.id, AHORA);
  assert.deepEqual(await pendientesDeRepaso(db, uid, AHORA), [], 'hoy no toca');
  assert.deepEqual(await pendientesDeRepaso(db, uid, enDias(1)), [fallada], 'mañana sí');

  const rep = await iniciarIntento(db, uid, 'repaso', null, enDias(1));
  const k = await claves(db, [fallada]);
  const r = await responder(db, uid, rep.id, fallada, {elegida: k.get(fallada)!.correcta}, enDias(1));
  assert.ok('correcta' in r && r.correcta);
  await terminarIntento(db, uid, rep.id, enDias(1));
  assert.deepEqual(await pendientesDeRepaso(db, uid, enDias(3)), []);
  assert.deepEqual(await pendientesDeRepaso(db, uid, enDias(4)), [fallada]);
  await assert.rejects(iniciarIntento(db, uid, 'repaso', null, enDias(2)), (e: ErrorAcademia) => e.codigo === 'sin-preguntas');
});

test('«Ya lo sé»: solo con 80 % o más en el diagnóstico del tema', async () => {
  const {db, uid} = await preparar();
  const v = await iniciarIntento(db, uid, 'diagnostico-tema', 'anatomia-celular', AHORA);
  await responderTodo(db, uid, v.id, (_, i) => i === 0);
  const r1 = await terminarIntento(db, uid, v.id, AHORA);
  assert.equal(r1.puedeSaltar, false);
  await assert.rejects(saltarTema(db, uid, 'anatomia-celular'), /80 %/);

  const v2 = await iniciarIntento(db, uid, 'diagnostico-tema', 'anatomia-celular', enMin(5));
  await responderTodo(db, uid, v2.id, () => true);
  const r2 = await terminarIntento(db, uid, v2.id, enMin(6));
  assert.equal(r2.puedeSaltar, true);
  await saltarTema(db, uid, 'anatomia-celular');
  const [d] = await db.select().from(dominio).where(and(eq(dominio.usuarioId, uid), eq(dominio.temaId, 'anatomia-celular')));
  assert.equal(d.estado, 'dominado');
});

test('sin especialidad no hay diagnóstico', async () => {
  const db = await crearDbPrueba();
  await sembrar(db);
  const u = await crearUsuario(db, {nombre: 'Sin', correo: 'sin@correo.com', clave: '12345678'});
  await assert.rejects(iniciarIntento(db, u.id, 'diagnostico', null, AHORA), (e: ErrorAcademia) => e.codigo === 'sin-especialidad');
});
