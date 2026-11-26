import {test} from 'node:test';
import assert from 'node:assert/strict';
import {count, eq} from 'drizzle-orm';
import {crearDbPrueba} from '../lib/db/index.ts';
import {lecciones, preguntas, temas} from '../lib/db/schema.ts';
import {sembrar} from '../lib/db/sembrar.ts';
import {CONTENIDO} from '../contenido/index.ts';

// Todos los temas y lecciones del contenido: CCNN (31 y 70) y EGB 2.º a 7.º (34 y 63) comparten los 10 temas generales.
const TEMAS = CONTENIDO.bloques.flatMap((b) => b.unidades.flatMap((u) => u.temas));
const LECCIONES = TEMAS.flatMap((t) => t.lecciones);

test('siembra el temario completo y el banco inicial', async () => {
  const db = await crearDbPrueba();
  const r = await sembrar(db);
  assert.deepEqual(r, {temas: TEMAS.length, lecciones: LECCIONES.length, preguntas: CONTENIDO.preguntas.length});
  assert.deepEqual([TEMAS.length, LECCIONES.length], [31 + 34, 70 + 63]);
  const [ac] = await db.select().from(temas).where(eq(temas.id, 'anatomia-celular'));
  assert.equal(ac.abierto, true);
  const [l] = await db.select().from(lecciones).where(eq(lecciones.id, 'anatomia-celular-2'));
  assert.ok(Array.isArray(l.contenido) && l.contenido.length > 0);
});

test('sembrar dos veces no duplica y respeta el video subido', async () => {
  const db = await crearDbPrueba();
  await sembrar(db);
  await db.update(temas).set({videoUrl: '/videos/anatomia.mp4', videoTitulo: 'La célula'}).where(eq(temas.id, 'anatomia-celular'));
  const r = await sembrar(db);
  assert.equal(r.temas, TEMAS.length);
  const [{n}] = await db.select({n: count()}).from(preguntas);
  assert.equal(n, CONTENIDO.preguntas.length);
  const [ac] = await db.select().from(temas).where(eq(temas.id, 'anatomia-celular'));
  assert.equal(ac.videoUrl, '/videos/anatomia.mp4');
});

test('un contenido inválido no siembra nada', async () => {
  const db = await crearDbPrueba();
  const roto = structuredClone(CONTENIDO);
  roto.preguntas[0].opciones[1] = roto.preguntas[0].opciones[0];
  await assert.rejects(sembrar(db, roto), /opciones/);
  const [{n}] = await db.select({n: count()}).from(temas);
  assert.equal(n, 0);
});
