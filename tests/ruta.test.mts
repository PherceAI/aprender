import {test} from 'node:test';
import {MAX_REPASO_DIA} from '../lib/repaso.ts';
import assert from 'node:assert/strict';
import {inArray} from 'drizzle-orm';
import {crearDbPrueba, type Db} from '../lib/db/index.ts';
import {sembrar} from '../lib/db/sembrar.ts';
import {preguntas} from '../lib/db/schema.ts';
import {crearUsuario, elegirEspecialidad} from '../lib/usuarios.ts';
import {iniciarIntento, responder, terminarIntento, vistaIntento} from '../lib/intentos.ts';
import {completarLeccion, guardarNota, leccion, mapaCurso, temaDetalle} from '../lib/curso.ts';
import {hoyDe, rachaDe, rutaDe, siguientePaso} from '../lib/ruta.ts';
import {perfilDe} from '../lib/perfil.ts';

const AHORA = new Date('2026-11-15T15:00:00Z');
const enDias = (d: number) => new Date(AHORA.getTime() + d * 86400_000);

async function preparar() {
  const db = await crearDbPrueba();
  await sembrar(db);
  const u = await crearUsuario(db, {nombre: 'Docente', correo: 'docente@correo.com', clave: '12345678'});
  await elegirEspecialidad(db, u.id, 'ccnn-egb-superior');
  return {db, uid: u.id};
}

async function hacer(db: Db, uid: string, tipo: 'diagnostico' | 'prueba-tema', ref: string | null, acierto: (i: number) => boolean, ahora = AHORA) {
  const v = await iniciarIntento(db, uid, tipo, ref, ahora);
  const ps = await db.select().from(preguntas).where(inArray(preguntas.id, v.preguntas.map((p) => p.id)));
  const c = new Map(ps.map((p) => [p.id, p.correcta]));
  for (const [i, p] of v.preguntas.entries()) {
    await responder(db, uid, v.id, p.id, {elegida: acierto(i) ? c.get(p.id)! : (c.get(p.id)! + 1) % 4, seguridad: 'lo-se', segundos: 30}, ahora);
  }
  return terminarIntento(db, uid, v.id, ahora);
}

test('lo primero es el diagnóstico; después, las lecciones del tema abierto y su prueba', async () => {
  const {db, uid} = await preparar();
  assert.deepEqual(await siguientePaso(db, uid), {tipo: 'diagnostico'});
  await hacer(db, uid, 'diagnostico', null, (i) => i % 2 === 0);
  let s = await siguientePaso(db, uid);
  assert.equal(s.tipo, 'leccion');
  assert.equal(s.tipo === 'leccion' && s.leccionId, 'anatomia-celular-1');
  await completarLeccion(db, uid, 'anatomia-celular-1', AHORA);
  s = await siguientePaso(db, uid);
  assert.equal(s.tipo === 'leccion' && s.leccionId, 'anatomia-celular-2');
  await completarLeccion(db, uid, 'anatomia-celular-2', AHORA);
  assert.deepEqual(await siguientePaso(db, uid), {tipo: 'prueba-tema', temaId: 'anatomia-celular', temaNombre: 'Anatomía celular'});
  await hacer(db, uid, 'prueba-tema', 'anatomia-celular', () => true);
  assert.deepEqual(await siguientePaso(db, uid), {tipo: 'nada'});
});

test('la ruta pone primero lo que se puede estudiar y luego lo más débil, y quita lo dominado', async () => {
  const {db, uid} = await preparar();
  // Acierta las unidades de generales (las 10 primeras preguntas), falla las de Ciencias Naturales.
  await hacer(db, uid, 'diagnostico', null, (i) => i < 10);
  let ruta = await rutaDe(db, uid);
  assert.equal(ruta.length, 31);
  assert.equal(ruta[0].temaId, 'anatomia-celular', 'el tema abierto va primero');
  assert.ok(ruta[1].unidadNombre !== 'Fundamentos para el aprendizaje' && ruta[1].nivel === 0, 'luego los más débiles');
  assert.equal(ruta[ruta.length - 1].nivel, 70, 'al final lo que ya sabe');
  await hacer(db, uid, 'prueba-tema', 'anatomia-celular', () => true);
  ruta = await rutaDe(db, uid);
  assert.equal(ruta.length, 30);
  assert.ok(!ruta.some((p) => p.temaId === 'anatomia-celular'));
});

test('la racha cuenta días seguidos y se corta si falta uno', async () => {
  const {db, uid} = await preparar();
  assert.deepEqual(await rachaDe(db, uid, AHORA), {dias: 0, hoyHecho: false});
  await completarLeccion(db, uid, 'anatomia-celular-1', enDias(-1));
  assert.deepEqual(await rachaDe(db, uid, AHORA), {dias: 1, hoyHecho: false}, 'ayer cuenta mientras hoy no estudie');
  await completarLeccion(db, uid, 'anatomia-celular-2', AHORA);
  assert.deepEqual(await rachaDe(db, uid, AHORA), {dias: 2, hoyHecho: true});
  assert.deepEqual(await rachaDe(db, uid, enDias(2)), {dias: 0, hoyHecho: false}, 'faltó un día');
});

test('una lección de un tema cerrado no se abre', async () => {
  const {db, uid} = await preparar();
  assert.equal(await leccion(db, uid, 'fisiologia-celular-1'), 'tema-cerrado');
  await assert.rejects(completarLeccion(db, uid, 'fisiologia-celular-1', AHORA), /próximamente/);
  const t = await temaDetalle(db, uid, 'fisiologia-celular');
  assert.equal(t.abierto, false);
  assert.equal(t.lecciones.length, 5, 'se ve su temario aunque esté cerrado');
});

test('la lección trae contenido, navegación y la nota del docente', async () => {
  const {db, uid} = await preparar();
  await guardarNota(db, uid, 'anatomia-celular-1', 'Mitocondria = energía');
  const l = await leccion(db, uid, 'anatomia-celular-1');
  assert.ok(l !== 'tema-cerrado');
  assert.ok(l.contenido.some((s) => s.tipo === 'laboratorio'));
  assert.equal(l.anterior, null);
  assert.equal(l.siguiente?.id, 'anatomia-celular-2');
  assert.equal(l.nota, 'Mitocondria = energía');
});

test('el mapa del curso y el perfil reflejan lo estudiado', async () => {
  const {db, uid} = await preparar();
  await hacer(db, uid, 'diagnostico', null, (i) => i < 10);
  await completarLeccion(db, uid, 'anatomia-celular-1', AHORA);
  await hacer(db, uid, 'prueba-tema', 'anatomia-celular', (i) => i < 9);
  const mapa = await mapaCurso(db, uid);
  assert.equal(mapa.bloques.length, 2);
  assert.equal(mapa.bloques.flatMap((b) => b.unidades).length, 9);
  const ac = mapa.bloques[1].unidades[0].temas.find((t) => t.id === 'anatomia-celular')!;
  assert.deepEqual([ac.estado, ac.nivel, ac.completadas, ac.lecciones], ['dominado', 90, 1, 2]);

  const p = await perfilDe(db, uid, AHORA);
  assert.equal(p.temas.length, 31);
  assert.equal(p.especialidad, 'Ciencias Naturales');
  assert.ok(p.preparacion > 0);
  assert.equal(p.totales.respondidas, 50);
  assert.equal(p.totales.lecciones, 1);
  assert.ok(p.errores.length > 0 && p.errores[0].respuesta);
  assert.equal(p.pruebas.length, 1);

  const h = await hoyDe(db, uid, AHORA);
  assert.equal(h.preparacion, p.preparacion);
  assert.equal(h.racha.dias, 1);
  assert.equal(h.siguiente.tipo, 'nada');
  assert.equal(h.repasoPendiente, 0, 'lo fallado vuelve mañana, no hoy');
  // Mañana vuelven lo fallado en la prueba y lo fallado en el diagnóstico (con tope diario).
  assert.equal((await hoyDe(db, uid, enDias(1))).repasoPendiente, MAX_REPASO_DIA);
  await vistaIntento(db, uid, (await iniciarIntento(db, uid, 'repaso', null, enDias(1))).id);
});
