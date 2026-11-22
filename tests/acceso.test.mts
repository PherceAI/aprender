import {test} from 'node:test';
import assert from 'node:assert/strict';
import {crearDbPrueba} from '../lib/db/index.ts';
import {sembrar} from '../lib/db/sembrar.ts';
import {crearUsuario, elegirEspecialidad, registrar} from '../lib/usuarios.ts';
import {cambiarPlan, elegirLeccion, estadoAcceso, LECCIONES_GRATIS, planDe} from '../lib/acceso.ts';
import {completarLeccion, leccion} from '../lib/curso.ts';
import {ErrorAcademia, iniciarIntento, terminarIntento} from '../lib/intentos.ts';
import {eq} from 'drizzle-orm';
import {temas} from '../lib/db/schema.ts';
import {CONTENIDO} from '../contenido/index.ts';

// La demo abre un solo tema. Se abren también los dos siguientes para tener lecciones de varios temas, más de las gratis.
async function preparar() {
  const db = await crearDbPrueba();
  await sembrar(db);
  const todos = CONTENIDO.bloques.flatMap((b) => b.unidades.flatMap((u) => u.temas));
  const i = todos.findIndex((t) => t.abierto);
  const abiertos = todos.slice(i, i + 3);
  for (const t of abiertos) await db.update(temas).set({abierto: true}).where(eq(temas.id, t.id));
  const cerrado = todos.find((t, j) => j > i + 2 && t.lecciones.length && !t.abierto)!;
  return {db, ids: abiertos.flatMap((t) => t.lecciones).map((l) => l.id), cerrada: cerrado?.lecciones[0]?.id};
}

test('quien se registra solo empieza con cuenta gratis; las cuentas del administrador son completas', async () => {
  const {db} = await preparar();
  const g = await registrar(db, {nombre: 'Ana Ruiz', correo: 'ana@correo.ec', clave: 'clave-segura'});
  const c = await crearUsuario(db, {nombre: 'Luis Mora', correo: 'luis@correo.ec', clave: 'clave-segura'});
  assert.equal(await planDe(db, g.id), 'gratis');
  assert.equal(await planDe(db, c.id), 'completo');
  await assert.rejects(registrar(db, {nombre: 'Otra', correo: 'ANA@correo.ec', clave: 'clave-segura'}), /Ya existe/);
});

test('la cuenta gratis elige 3 lecciones de cualquier tema y bloquea las demás y las pruebas; el simulacro, una sola vez', async () => {
  const {db, ids} = await preparar();
  assert.ok(ids.length > LECCIONES_GRATIS, 'hacen falta más lecciones que las gratis');
  const u = await registrar(db, {nombre: 'Ana Ruiz', correo: 'ana@correo.ec', clave: 'clave-segura'});
  await elegirEspecialidad(db, u.id, 'ccnn-egb-superior');

  // Antes de elegir, cualquier lección abierta se puede elegir, sin orden: la última también.
  const ultima = ids[ids.length - 1];
  assert.equal(await leccion(db, u.id, ultima), 'por-elegir');
  await assert.rejects(completarLeccion(db, u.id, ultima), (e) => e instanceof ErrorAcademia && e.codigo === 'bloqueado');
  await assert.rejects(iniciarIntento(db, u.id, 'practica', ultima), (e) => e instanceof ErrorAcademia && e.codigo === 'bloqueado');

  // Elige 3 sin seguir el orden del curso.
  const elegidas = [ultima, ids[1], ids[0]].slice(0, LECCIONES_GRATIS);
  for (const id of elegidas) assert.equal(await elegirLeccion(db, u.id, id), true);
  for (const id of elegidas) assert.equal(typeof (await leccion(db, u.id, id)), 'object');
  await completarLeccion(db, u.id, ultima);
  // La práctica de una lección elegida también es gratis (la de Anatomía celular ya tiene preguntas).
  assert.ok((await iniciarIntento(db, u.id, 'practica', ids[0])).id);
  assert.equal((await estadoAcceso(db, u.id)).restantes, 0);

  // Volver a elegir una suya no gasta nada; una cuarta ya no se puede.
  assert.equal(await elegirLeccion(db, u.id, ultima), true);
  const otra = ids.find((id) => !elegidas.includes(id))!;
  assert.equal(await elegirLeccion(db, u.id, otra), false);
  assert.equal(await leccion(db, u.id, otra), 'bloqueada');

  // Un simulacro gratis: se puede empezar (y retomar), pero al terminarlo ya no hay otro.
  const sim = await iniciarIntento(db, u.id, 'simulacro');
  assert.equal((await iniciarIntento(db, u.id, 'simulacro')).id, sim.id);
  await terminarIntento(db, u.id, sim.id);
  await assert.rejects(iniciarIntento(db, u.id, 'simulacro'), (e) => e instanceof ErrorAcademia && e.codigo === 'bloqueado');
  await assert.rejects(iniciarIntento(db, u.id, 'prueba-tema', ids[0].replace(/-\d+$/, '')), (e) => e instanceof ErrorAcademia && e.codigo === 'bloqueado');
  // El diagnóstico sí es gratis.
  const d = await iniciarIntento(db, u.id, 'diagnostico');
  assert.ok(d.id);
});

test('no se gasta una lección gratis en un tema que aún no se abre', async () => {
  const {db, cerrada} = await preparar();
  const u = await registrar(db, {nombre: 'Ana Ruiz', correo: 'ana@correo.ec', clave: 'clave-segura'});
  if (cerrada) assert.equal(await elegirLeccion(db, u.id, cerrada), false);
  assert.equal((await estadoAcceso(db, u.id)).restantes, LECCIONES_GRATIS);
});

test('al activar el acceso completo se abre todo', async () => {
  const {db, ids} = await preparar();
  const u = await registrar(db, {nombre: 'Ana Ruiz', correo: 'ana@correo.ec', clave: 'clave-segura'});
  await elegirEspecialidad(db, u.id, 'ccnn-egb-superior');
  await cambiarPlan(db, u.id, 'completo');
  // Con el acceso completo todo tema abierto se estudia, en el orden que quiera.
  for (const id of ids) assert.equal(typeof (await leccion(db, u.id, id)), 'object');
  const s = await iniciarIntento(db, u.id, 'simulacro');
  assert.ok(s.id);
});
