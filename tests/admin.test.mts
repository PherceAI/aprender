import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';

// Las rutas usan la base global (getDb): se apunta a una carpeta temporal antes de cargarlas.
process.env.DATA_DIR = mkdtempSync(path.join(tmpdir(), 'ruta-docente-'));
process.env.SESSION_SECRET = 'secreto-de-prueba';

const {getDb} = await import('../lib/db/index.ts');
const {sembrar} = await import('../lib/db/sembrar.ts');
const {crearUsuario} = await import('../lib/usuarios.ts');
const {crearDocente, docentesConAvance, resumenAdmin, preguntasConUso} = await import('../lib/admin.ts');
const {firmarToken, COOKIE_SESION} = await import('../lib/auth/sesion.ts');
const {rango} = await import('../lib/videos.ts');
const {NextRequest} = await import('next/server');
const subir = await import('../app/api/admin/videos/route.ts');
const ver = await import('../app/api/videos/[archivo]/route.ts');

const db = await getDb();
await sembrar(db);
const admin = await crearUsuario(db, {nombre: 'Admin', correo: 'admin@correo.com', clave: '12345678', rol: 'admin'});
const docente = await crearDocente(db, {nombre: 'Profe', correo: 'profe@correo.com', clave: '12345678', especialidadId: 'ccnn-egb-superior'});
const cookie = (uid: string, rol: 'admin' | 'docente') => `${COOKIE_SESION}=${firmarToken({uid, rol})}`;

test('el administrador crea docentes y ve su avance', async () => {
  const lista = await docentesConAvance(db);
  assert.equal(lista.length, 1);
  assert.deepEqual([lista[0].nombre, lista[0].especialidad, lista[0].preparacion, lista[0].diagnosticoHecho], ['Profe', 'Ciencias Naturales', 0, false]);
  const r = await resumenAdmin(db);
  assert.equal(r.docentes, 1);
  assert.equal((await preguntasConUso(db, 'anatomia-celular')).length, 15, '14 del tema + 1 del diagnóstico de entrada');
});

test('rango de bytes para adelantar el video', () => {
  assert.deepEqual(rango('bytes=0-99', 1000), {inicio: 0, fin: 99});
  assert.deepEqual(rango('bytes=900-', 1000), {inicio: 900, fin: 999});
  assert.deepEqual(rango('bytes=-100', 1000), {inicio: 900, fin: 999});
  assert.equal(rango('bytes=2000-', 1000), null);
  assert.equal(rango(null, 1000), null);
});

test('solo el administrador sube videos, y se ven solo con sesión y por partes', async () => {
  const bytes = new Uint8Array(1000).map((_, i) => i % 256);
  const put = (c: string, tipo = 'video/mp4') =>
    subir.PUT(
      new NextRequest('http://local/api/admin/videos?tema=anatomia-celular&titulo=La%20c%C3%A9lula', {
        method: 'PUT',
        headers: {cookie: c, 'content-type': tipo},
        body: bytes,
        duplex: 'half',
      } as RequestInit)
    );
  assert.equal((await put('')).status, 401);
  assert.equal((await put(cookie(docente.id, 'docente'))).status, 403);
  assert.equal((await put(cookie(admin.id, 'admin'), 'application/pdf')).status, 415);
  const ok = await put(cookie(admin.id, 'admin'));
  assert.equal(ok.status, 200);
  const {url} = (await ok.json()) as {url: string};
  assert.match(url, /^\/api\/videos\/anatomia-celular-[a-z0-9]+\.mp4$/);
  const archivo = url.split('/').pop()!;

  const get = (c: string, range?: string, nombre = archivo) =>
    ver.GET(new NextRequest(`http://local${url}`, {headers: {cookie: c, ...(range && {range})}}), {params: Promise.resolve({archivo: nombre})});
  assert.equal((await get('')).status, 401, 'sin sesión no se ve');
  assert.equal((await get(cookie(docente.id, 'docente'), undefined, '..%2Fpg')).status, 404, 'no se puede leer otra cosa del disco');
  const todo = await get(cookie(docente.id, 'docente'));
  assert.equal(todo.status, 200);
  assert.equal((await todo.arrayBuffer()).byteLength, 1000);
  const parte = await get(cookie(docente.id, 'docente'), 'bytes=10-19');
  assert.equal(parte.status, 206);
  assert.equal(parte.headers.get('content-range'), 'bytes 10-19/1000');
  assert.deepEqual([...new Uint8Array(await parte.arrayBuffer())], [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
});
