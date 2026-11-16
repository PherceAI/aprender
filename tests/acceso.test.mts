import {test} from 'node:test';
import assert from 'node:assert/strict';
import {crearDbPrueba} from '../lib/db/index.ts';
import {sembrar} from '../lib/db/sembrar.ts';
import {crearUsuario, elegirEspecialidad, registrar} from '../lib/usuarios.ts';
import {cambiarPlan, LECCIONES_GRATIS, leccionesGratis, planDe} from '../lib/acceso.ts';
import {completarLeccion, leccion} from '../lib/curso.ts';
import {ErrorAcademia, iniciarIntento} from '../lib/intentos.ts';
import {eq} from 'drizzle-orm';
import {temas} from '../lib/db/schema.ts';
import {CONTENIDO} from '../contenido/index.ts';

// La demo abre un solo tema (2 lecciones). Se abre también el siguiente para tener lecciones más allá de las gratis.
async function preparar() {
  const db = await crearDbPrueba();
  await sembrar(db);
  const todos = CONTENIDO.bloques.flatMap((b) => b.unidades.flatMap((u) => u.temas));
  const i = todos.findIndex((t) => t.abierto);
  await db.update(temas).set({abierto: true}).where(eq(temas.id, todos[i + 1].id));
  return {db, ids: [...todos[i].lecciones, ...todos[i + 1].lecciones].map((l) => l.id)};
}

test('quien se registra solo empieza con cuenta gratis; las cuentas del administrador son completas', async () => {
  const {db} = await preparar();
  const g = await registrar(db, {nombre: 'Ana Ruiz', correo: 'ana@correo.ec', clave: 'clave-segura'});
  const c = await crearUsuario(db, {nombre: 'Luis Mora', correo: 'luis@correo.ec', clave: 'clave-segura'});
  assert.equal(await planDe(db, g.id), 'gratis');
  assert.equal(await planDe(db, c.id), 'completo');
  await assert.rejects(registrar(db, {nombre: 'Otra', correo: 'ANA@correo.ec', clave: 'clave-segura'}), /Ya existe/);
});

test('la cuenta gratis abre las primeras lecciones y bloquea las demás, las pruebas y el simulacro', async () => {
  const {db, ids} = await preparar();
  const u = await registrar(db, {nombre: 'Ana Ruiz', correo: 'ana@correo.ec', clave: 'clave-segura'});
  await elegirEspecialidad(db, u.id, 'ccnn-egb-superior');

  assert.deepEqual([...(await leccionesGratis(db))], ids.slice(0, LECCIONES_GRATIS));
  assert.notEqual(await leccion(db, u.id, ids[0]), 'bloqueada');
  assert.equal(await leccion(db, u.id, ids[LECCIONES_GRATIS]), 'bloqueada');
  await assert.rejects(completarLeccion(db, u.id, ids[LECCIONES_GRATIS]), (e) => e instanceof ErrorAcademia && e.codigo === 'bloqueado');
  await assert.rejects(iniciarIntento(db, u.id, 'simulacro'), (e) => e instanceof ErrorAcademia && e.codigo === 'bloqueado');
  await assert.rejects(iniciarIntento(db, u.id, 'practica', ids[LECCIONES_GRATIS]), (e) => e instanceof ErrorAcademia && e.codigo === 'bloqueado');
  // El diagnóstico sí es gratis.
  const d = await iniciarIntento(db, u.id, 'diagnostico');
  assert.ok(d.id);
});

test('al activar el acceso completo se abre todo', async () => {
  const {db, ids} = await preparar();
  const u = await registrar(db, {nombre: 'Ana Ruiz', correo: 'ana@correo.ec', clave: 'clave-segura'});
  await elegirEspecialidad(db, u.id, 'ccnn-egb-superior');
  await cambiarPlan(db, u.id, 'completo');
  assert.notEqual(await leccion(db, u.id, ids[LECCIONES_GRATIS]), 'bloqueada');
  const s = await iniciarIntento(db, u.id, 'simulacro');
  assert.ok(s.id);
});
