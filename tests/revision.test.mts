import {test} from 'node:test';
import assert from 'node:assert/strict';
import {crearDbPrueba} from '../lib/db/index.ts';
import {claveValida, comentariosDeRuta, crearComentario, ErrorRevision, marcarResuelto, todosLosComentarios} from '../lib/revision.ts';

test('el modo revisión solo se abre con la clave configurada (8+ caracteres)', () => {
  const antes = process.env.REVISION_CLAVE;
  try {
    delete process.env.REVISION_CLAVE;
    assert.equal(claveValida('cualquier-cosa'), false);
    process.env.REVISION_CLAVE = 'corta';
    assert.equal(claveValida('corta'), false);
    process.env.REVISION_CLAVE = 'clave-de-prueba-123';
    assert.equal(claveValida('clave-de-prueba-123'), true);
    assert.equal(claveValida('clave-de-prueba-124'), false);
    assert.equal(claveValida(undefined), false);
  } finally {
    if (antes === undefined) delete process.env.REVISION_CLAVE;
    else process.env.REVISION_CLAVE = antes;
  }
});

test('el revisor deja comentarios anclados y el administrador los ve y los resuelve', async () => {
  const db = await crearDbPrueba();
  const a = await crearComentario(db, {autor: 'Luis', ruta: '/curso/anatomia-celular', ancla: 'main > h1', muestra: '  Anatomía   celular ', tipo: 'mejorar', texto: 'Más ejemplos de Riobamba', ancho: 390});
  await crearComentario(db, {autor: 'Luis', ruta: '/', tipo: 'agregar', texto: 'Agregar el precio'});
  assert.equal(a.muestra, 'Anatomía celular');
  assert.equal(a.resuelto, false);

  assert.equal((await comentariosDeRuta(db, '/curso/anatomia-celular')).length, 1);
  await marcarResuelto(db, a.id, true);
  const todos = await todosLosComentarios(db);
  assert.equal(todos.length, 2);
  assert.equal(todos[0].resuelto, false, 'los pendientes van primero');
  assert.equal((await todosLosComentarios(db, true)).length, 1);

  await assert.rejects(crearComentario(db, {autor: 'Luis', ruta: '/', tipo: 'mejorar', texto: '   '}), ErrorRevision);
  await assert.rejects(crearComentario(db, {autor: 'Luis', ruta: '/', tipo: 'otro', texto: 'hola'}), ErrorRevision);
});
