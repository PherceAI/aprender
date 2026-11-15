import {test} from 'node:test';
import assert from 'node:assert/strict';
import {crearDbPrueba} from '../lib/db/index.ts';
import {sembrar} from '../lib/db/sembrar.ts';
import {crearUsuario, elegirEspecialidad, ingresar, usuarioPorId} from '../lib/usuarios.ts';
import {firmarToken, leerToken} from '../lib/auth/sesion.ts';
import {hashClave, verificarClave} from '../lib/auth/clave.ts';

async function dbSembrada() {
  const db = await crearDbPrueba();
  await sembrar(db);
  return db;
}

test('la clave se guarda cifrada y se verifica', () => {
  const h = hashClave('clave-segura-1');
  assert.notEqual(h, 'clave-segura-1');
  assert.ok(verificarClave('clave-segura-1', h));
  assert.ok(!verificarClave('otra-clave', h));
});

test('ingresar no distingue mayúsculas en el correo y rechaza la clave incorrecta', async () => {
  const db = await dbSembrada();
  await crearUsuario(db, {nombre: 'Juan Pérez', correo: '  Juan.Perez@Gmail.com ', clave: 'profe2026!'});
  const u = await ingresar(db, 'juan.perez@gmail.com', 'profe2026!');
  assert.equal(u?.nombre, 'Juan Pérez');
  assert.equal(u?.correo, 'juan.perez@gmail.com');
  assert.ok(u?.ultimoIngreso);
  assert.equal(await ingresar(db, 'juan.perez@gmail.com', 'mala-clave'), null);
  assert.equal(await ingresar(db, 'nadie@gmail.com', 'profe2026!'), null);
});

test('no se crean cuentas con correo repetido ni clave corta', async () => {
  const db = await dbSembrada();
  await crearUsuario(db, {nombre: 'A', correo: 'a@correo.com', clave: '12345678'});
  await assert.rejects(crearUsuario(db, {nombre: 'B', correo: 'A@correo.com', clave: '12345678'}), /ya existe/i);
  await assert.rejects(crearUsuario(db, {nombre: 'C', correo: 'c@correo.com', clave: '123'}), /8 caracteres/);
  await assert.rejects(crearUsuario(db, {nombre: 'D', correo: 'no-es-correo', clave: '12345678'}), /correo/);
});

test('solo se elige una especialidad activa', async () => {
  const db = await dbSembrada();
  const u = await crearUsuario(db, {nombre: 'A', correo: 'a@correo.com', clave: '12345678'});
  await assert.rejects(elegirEspecialidad(db, u.id, 'matematica-egb-superior'), /próximamente/);
  await elegirEspecialidad(db, u.id, 'ccnn-egb-superior');
  assert.equal((await usuarioPorId(db, u.id))?.especialidadId, 'ccnn-egb-superior');
});

test('el token de sesión no se puede alterar y vence', () => {
  const ahora = new Date('2026-11-15T12:00:00Z');
  const t = firmarToken({uid: 'u1', rol: 'docente'}, ahora);
  assert.deepEqual(leerToken(t, ahora), {uid: 'u1', rol: 'docente'});
  const [cuerpo, firma] = t.split('.');
  const otro = Buffer.from(JSON.stringify({uid: 'u2', rol: 'admin', iat: 0})).toString('base64url');
  assert.equal(leerToken(`${otro}.${firma}`, ahora), null);
  assert.equal(leerToken(`${cuerpo}.x${firma}`, ahora), null);
  const en31dias = new Date(ahora.getTime() + 31 * 86400_000);
  assert.equal(leerToken(t, en31dias), null);
  const admin = firmarToken({uid: 'a', rol: 'admin'}, ahora);
  assert.equal(leerToken(admin, new Date(ahora.getTime() + 13 * 3600_000)), null);
});
