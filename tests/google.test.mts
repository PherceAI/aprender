import {test} from 'node:test';
import assert from 'node:assert/strict';
import {crearDbPrueba} from '../lib/db/index.ts';
import {ingresarConGoogle} from '../lib/auth/google.ts';
import {planDe} from '../lib/acceso.ts';
import {crearUsuario, registrar} from '../lib/usuarios.ts';

test('Google crea una cuenta gratis la primera vez y luego entra a la misma', async () => {
  const db = await crearDbPrueba();
  const a = await ingresarConGoogle(db, {correo: 'Luis.Mora@gmail.com', nombre: 'Luis Mora', verificado: true});
  assert.equal(a.rol, 'docente');
  assert.equal(await planDe(db, a.id), 'gratis');
  const b = await ingresarConGoogle(db, {correo: 'luis.mora@gmail.com', nombre: 'Luis', verificado: true});
  assert.equal(b.id, a.id);
});

test('una cuenta hecha con correo y contraseña también entra con Google; el administrador y los correos sin verificar no', async () => {
  const db = await crearDbPrueba();
  const d = await registrar(db, {nombre: 'Ana Ruiz', correo: 'ana@gmail.com', clave: 'clave-segura'});
  assert.equal((await ingresarConGoogle(db, {correo: 'ana@gmail.com', nombre: 'Ana', verificado: true})).id, d.id);
  await crearUsuario(db, {nombre: 'Admin', correo: 'jefe@gmail.com', clave: 'clave-segura', rol: 'admin'});
  await assert.rejects(ingresarConGoogle(db, {correo: 'jefe@gmail.com', nombre: 'X', verificado: true}), /contraseña/);
  await assert.rejects(ingresarConGoogle(db, {correo: 'nuevo@gmail.com', nombre: 'X', verificado: false}), /verificado/);
});
