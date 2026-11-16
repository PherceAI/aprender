import {test} from 'node:test';
import assert from 'node:assert/strict';
import {inArray} from 'drizzle-orm';
import {crearDbPrueba, type Db} from '../lib/db/index.ts';
import {sembrar} from '../lib/db/sembrar.ts';
import {preguntas} from '../lib/db/schema.ts';
import {crearUsuario, elegirEspecialidad} from '../lib/usuarios.ts';
import {iniciarIntento, responder, terminarIntento, vistaIntento} from '../lib/intentos.ts';
import {historialPreparacion} from '../lib/avance.ts';
import {hoyEc} from '../lib/util.ts';

// El docente debe ver cuánto subió después de cada prueba, y su preparación día a día.

const AHORA = new Date('2026-11-16T15:00:00Z'); // 10:00 en Ecuador

async function preparar() {
  const db = await crearDbPrueba();
  await sembrar(db);
  const u = await crearUsuario(db, {nombre: 'Docente', correo: 'docente@correo.com', clave: '12345678'});
  await elegirEspecialidad(db, u.id, 'ccnn-egb-superior');
  return {db, uid: u.id};
}

async function hacer(db: Db, uid: string, tipo: 'diagnostico' | 'prueba-tema', referencia: string | null, acertar: (i: number) => boolean) {
  const v = await iniciarIntento(db, uid, tipo, referencia, AHORA);
  const vista = await vistaIntento(db, uid, v.id);
  const ps = await db.select().from(preguntas).where(inArray(preguntas.id, vista.preguntas.map((p) => p.id)));
  const k = new Map(ps.map((p) => [p.id, p.correcta]));
  for (const [i, p] of vista.preguntas.entries()) {
    const c = k.get(p.id)!;
    await responder(db, uid, v.id, p.id, {elegida: acertar(i) ? c : (c + 1) % 4, seguridad: 'lo-se'}, AHORA);
  }
  return v.id;
}

test('la prueba del tema guarda cuánto subió y no cambia al recargar', async () => {
  const {db, uid} = await preparar();
  await terminarIntento(db, uid, await hacer(db, uid, 'diagnostico', null, (i) => i % 2 === 0), AHORA);
  const id = await hacer(db, uid, 'prueba-tema', 'anatomia-celular', () => true);
  const r = await terminarIntento(db, uid, id, AHORA);
  assert.ok(r.avance, 'el resultado trae el avance');
  const tema = r.avance.temas.find((t) => t.id === 'anatomia-celular')!;
  assert.equal(tema.despues, 100);
  assert.ok(tema.antes < tema.despues);
  assert.ok(r.avance.preparacionDespues > r.avance.preparacionAntes);
  const otra = await terminarIntento(db, uid, id, new Date(AHORA.getTime() + 3600_000));
  assert.deepEqual(otra.avance, r.avance, 'recargar no cambia el antes y el después');
});

test('la preparación del día queda anotada y se actualiza', async () => {
  const {db, uid} = await preparar();
  await terminarIntento(db, uid, await hacer(db, uid, 'diagnostico', null, (i) => i % 2 === 0), AHORA);
  const h1 = await historialPreparacion(db, uid, 30, AHORA);
  assert.equal(h1.length, 1);
  assert.equal(h1[0].dia, hoyEc(AHORA));
  await terminarIntento(db, uid, await hacer(db, uid, 'prueba-tema', 'anatomia-celular', () => true), AHORA);
  const h2 = await historialPreparacion(db, uid, 30, AHORA);
  assert.equal(h2.length, 1, 'un solo registro por día');
  assert.ok(h2[0].preparacion > h1[0].preparacion);
});
