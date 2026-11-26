import {test} from 'node:test';
import assert from 'node:assert/strict';
import {asc, eq} from 'drizzle-orm';
import {CONTENIDO} from '../contenido/index.ts';
import {validarContenido} from '../contenido/validar.ts';
import type {Contenido} from '../contenido/tipos.ts';
import {crearDbPrueba} from '../lib/db/index.ts';
import {sembrar} from '../lib/db/sembrar.ts';
import {intentos, unidades, usuarios} from '../lib/db/schema.ts';
import {diagnosticoHecho} from '../lib/ruta.ts';
import {iniciarIntento, responder, terminarIntento} from '../lib/intentos.ts';
import {mapaCurso} from '../lib/curso.ts';
import {preparacion} from '../lib/dominio.ts';
import {crearUsuario, elegirEspecialidad} from '../lib/usuarios.ts';

// EGB 2.º a 7.º: ficha técnica Ineval 2026, sección 4.2 (fuentes/Ficha EGB 2do a 7mo.pdf, págs. 6 a 9).

const egb = CONTENIDO.especialidades.find((e) => e.id === 'egb-elemental-media')!;
const disciplinar = CONTENIDO.bloques.find((b) => b.id === 'egb-disciplinares')!;

// Asignatura → unidades → [tema, subtemas], tal como están en la ficha.
const FICHA: Record<string, [unidad: string, temas: [string, number][]][]> = {
  'Matemática': [
    ['Álgebra y funciones', [['Conjuntos numéricos', 3], ['Proporcionalidad y porcentajes', 2]]],
    ['Geometría y medida', [['Figuras geométricas', 2], ['Cuerpos geométricos', 2], ['Recta y plano', 2], ['Medidas de longitud, área, volumen, masa, tiempo y angulares', 2]]],
    ['Estadística y probabilidad', [['Gráficos estadísticos, tablas de frecuencias, medidas de tendencia central y dispersión', 1], ['Combinaciones simples', 1], ['Probabilidad', 1]]],
  ],
  'Lengua y Literatura': [
    ['Lengua y cultura', [['Variedades lingüísticas', 2], ['Cultura escrita', 1]]],
    ['Comunicación oral', [['La lengua en interacción social', 1], ['Expresión oral', 1]]],
    ['Lectura', [['Comprensión de textos', 2], ['Uso de recursos', 1]]],
    ['Escritura', [['Producción de textos', 4]]],
    ['Literatura', [['Literatura en contexto', 2]]],
  ],
  'Ciencias Naturales': [
    ['Los seres vivos y su ambiente', [['Clasificación de los animales', 2], ['Plantas: clasificación y funciones vitales', 2], ['Ecosistemas y flujo de energía', 2]]],
    ['Cuerpo humano y salud', [['Sistemas del cuerpo humano', 1], ['Órganos de los sentidos', 1]]],
    ['La materia', [['Clasificación, propiedades y estados de la materia', 3]]],
    ['La Tierra', [['La atmósfera, el clima y el suelo', 4]]],
  ],
  'Ciencias Sociales': [
    ['Historia e identidad', [['Época aborigen en Ecuador', 3], ['Época colonial en Ecuador', 3], ['Independencia e integración en Ecuador', 1], ['Periodo republicano en Ecuador', 3]]],
    ['Los seres humanos en el espacio', [['Recursos económicos de Ecuador', 1], ['Características geográficas de Ecuador', 1], ['División político-administrativa de Ecuador', 2]]],
    ['Convivencia', [['El Estado ecuatoriano', 1], ['Derechos y responsabilidades', 1], ['Diversidad cultural', 2]]],
  ],
};

test('EGB rinde el bloque general compartido y su prueba de 60 preguntas en 120 minutos', () => {
  assert.deepEqual(egb.bloques, ['generales', 'egb-disciplinares']);
  assert.deepEqual([disciplinar.compartido, disciplinar.preguntasExamen, disciplinar.minutosExamen], [false, 60, 120]);
});

test('EGB está activa: tiene su diagnóstico completo y Matemática abierta', () => {
  assert.equal(egb.estado, 'activa');
});

test('el bloque disciplinar de EGB es la ficha: 4 asignaturas, 15 unidades, 34 temas y 63 lecciones', () => {
  const real: typeof FICHA = {};
  for (const u of disciplinar.unidades) {
    (real[u.asignatura!] ??= []).push([u.nombre, u.temas.map((t) => [t.nombre, t.lecciones.length] as [string, number])]);
  }
  assert.deepEqual(real, FICHA);
  assert.deepEqual(Object.keys(real), ['Matemática', 'Lengua y Literatura', 'Ciencias Naturales', 'Ciencias Sociales']);
  const temas = disciplinar.unidades.flatMap((u) => u.temas);
  assert.equal(disciplinar.unidades.length, 15);
  assert.equal(temas.length, 34);
  assert.equal(temas.flatMap((t) => t.lecciones).length, 63);
});

test('cada lección de EGB dice su objetivo; Matemática está abierta completa y lo demás «pronto»', () => {
  for (const u of disciplinar.unidades) {
    for (const t of u.temas) {
      assert.ok(t.id.startsWith('egb-'), `${t.id}: los temas de EGB empiezan con egb-`);
      assert.equal(Boolean(t.abierto), u.asignatura === 'Matemática', `${t.id}: abierto solo si es de Matemática`);
      for (const l of t.lecciones) {
        assert.match(l.objetivo, /^[A-ZÁÉÍÓÚ].+\.$/, `${l.id}: objetivo como frase completa`);
        if (t.abierto) assert.ok((l.contenido?.length ?? 0) >= 4, `${l.id}: lección con al menos 4 piezas`);
      }
    }
  }
});

test('Matemática: cada tema tiene 3 de «¿Ya lo sabes?», 10 o más de prueba y cada lección 3 o más para practicar', () => {
  const temas = disciplinar.unidades.filter((u) => u.asignatura === 'Matemática').flatMap((u) => u.temas);
  assert.equal(temas.length, 9);
  for (const t of temas) {
    const propias = CONTENIDO.preguntas.filter((p) => p.temaId === t.id);
    assert.ok(propias.filter((p) => p.usos.includes('diagnostico-tema')).length >= 3, `${t.id}: «¿Ya lo sabes?»`);
    assert.ok(propias.filter((p) => p.usos.includes('prueba')).length >= 10, `${t.id}: prueba del tema`);
    for (const l of t.lecciones) assert.ok(propias.filter((p) => p.leccionId === l.id).length >= 3, `${l.id}: práctica`);
  }
});

test('el diagnóstico de EGB: 47 preguntas, al menos una por cada uno de los 44 temas y los cinco formatos', () => {
  const temas = egb.bloques.flatMap((b) => CONTENIDO.bloques.find((x) => x.id === b)!.unidades.flatMap((u) => u.temas));
  const ids = new Set(temas.map((t) => t.id));
  const diag = CONTENIDO.preguntas.filter((p) => p.usos.includes('diagnostico') && ids.has(p.temaId));
  assert.equal(temas.length, 44);
  assert.equal(diag.length, 47);
  for (const t of temas) assert.ok(diag.some((p) => p.temaId === t.id), `${t.id} sin pregunta de diagnóstico`);
  const formatos = new Set(diag.map((p) => p.formato));
  for (const f of ['simple', 'completamiento', 'seleccion', 'ordenamiento', 'emparejamiento']) assert.ok(formatos.has(f as never), `falta ${f}`);
});

test('el validador: el diagnóstico completo se exige solo a las especialidades activas', () => {
  assert.deepEqual(validarContenido(CONTENIDO), []);
  const sinDiag: Contenido = {...CONTENIDO, preguntas: CONTENIDO.preguntas.filter((p) => !p.id.startsWith('diag-egb-'))};
  const errores = validarContenido(sinDiag);
  assert.equal(errores.length, 34, 'un error por cada tema de EGB sin pregunta de diagnóstico');
  assert.ok(errores.every((e) => e.startsWith('Tema «egb-') && e.includes('diagnóstico')));
  const proxima: Contenido = {...sinDiag, especialidades: sinDiag.especialidades.map((e) => (e.id === egb.id ? {...e, estado: 'proximamente'} : e))};
  assert.deepEqual(validarContenido(proxima), [], '«próximamente» puede cargar su temario antes que sus preguntas');
});

test('el validador: si una unidad del bloque tiene asignatura, todas deben tenerla', () => {
  const sinUna: Contenido = {
    ...CONTENIDO,
    bloques: CONTENIDO.bloques.map((b) => (b.id === disciplinar.id ? {...b, unidades: b.unidades.map((u, i) => (i === 0 ? {...u, asignatura: undefined} : u))} : b)),
  };
  assert.deepEqual(validarContenido(sinUna), ['Bloque «egb-disciplinares»: si una unidad tiene asignatura, todas deben tenerla']);
});

test('la siembra guarda la asignatura de cada unidad y EGB ya se puede elegir', async () => {
  const db = await crearDbPrueba();
  await sembrar(db);
  const filas = await db.select().from(unidades).where(eq(unidades.bloqueId, 'egb-disciplinares')).orderBy(asc(unidades.orden));
  assert.equal(filas.length, 15);
  assert.deepEqual([...new Set(filas.map((f) => f.asignatura))], ['Matemática', 'Lengua y Literatura', 'Ciencias Naturales', 'Ciencias Sociales']);
  const cn = await db.select().from(unidades).where(eq(unidades.bloqueId, 'ccnn-disciplinares'));
  assert.ok(cn.every((f) => f.asignatura === null), 'Ciencias Naturales de EGB Superior no cambia');

  const u = await crearUsuario(db, {nombre: 'Docente', correo: 'egb@prueba.ec', clave: 'clave-segura-1'});
  await elegirEspecialidad(db, u.id, 'egb-elemental-media');
  await assert.rejects(elegirEspecialidad(db, u.id, 'biologia-bgu'), /próximamente/);
});

test('recorrido de un docente de EGB: diagnóstico, mapa por asignatura, práctica, prueba y simulacro', async () => {
  const db = await crearDbPrueba();
  await sembrar(db);
  const u = await crearUsuario(db, {nombre: 'Docente EGB', correo: 'recorrido@prueba.ec', clave: 'clave-segura-1', plan: 'completo'});
  await elegirEspecialidad(db, u.id, 'egb-elemental-media');
  const AHORA = new Date('2026-11-26T15:00:00Z');
  const correctas = new Map(CONTENIDO.preguntas.map((p) => [p.id, p.correcta]));
  const responderTodo = async (id: string, ids: string[]) => {
    for (const pid of ids) await responder(db, u.id, id, pid, {elegida: correctas.get(pid)!, seguridad: 'lo-se'}, AHORA);
    return terminarIntento(db, u.id, id, AHORA);
  };

  const diag = await iniciarIntento(db, u.id, 'diagnostico', null, AHORA);
  assert.equal(diag.preguntas.length, 47);
  const r = await responderTodo(diag.id, diag.preguntas.map((p) => p.id));
  assert.equal(r.aciertos, 47);
  assert.equal(await diagnosticoHecho(db, u.id), true);

  const mapa = await mapaCurso(db, u.id);
  const asignaturas = [...new Set(mapa.bloques[1].unidades.map((x) => x.asignatura))];
  assert.deepEqual(asignaturas, ['Matemática', 'Lengua y Literatura', 'Ciencias Naturales', 'Ciencias Sociales']);
  assert.ok((await preparacion(db, u.id, 'egb-elemental-media')) > 0);

  const practica = await iniciarIntento(db, u.id, 'practica', 'egb-probabilidad-1', AHORA);
  assert.equal(practica.preguntas.length, 3);
  const prueba = await iniciarIntento(db, u.id, 'prueba-tema', 'egb-probabilidad', AHORA);
  assert.equal(prueba.preguntas.length, 10);
  const rp = await responderTodo(prueba.id, prueba.preguntas.map((p) => p.id));
  assert.equal(rp.dominado, true);
  await assert.rejects(iniciarIntento(db, u.id, 'practica', 'egb-epoca-aborigen-1', AHORA));

  const temasEgb = new Set(mapa.bloques.flatMap((b) => b.unidades.flatMap((x) => x.temas.map((t) => t.id))));
  const sim = await iniciarIntento(db, u.id, 'simulacro', null, AHORA);
  const delSim = CONTENIDO.preguntas.filter((p) => sim.preguntas.some((x) => x.id === p.id));
  assert.ok(delSim.length > 0 && delSim.every((p) => temasEgb.has(p.temaId)), 'el simulacro solo trae preguntas de su curso');
});

test('el diagnóstico es de cada curso: al cambiar de curso le toca el del curso nuevo', async () => {
  const db = await crearDbPrueba();
  await sembrar(db);
  const u = await crearUsuario(db, {nombre: 'Docente', correo: 'cambio@prueba.ec', clave: 'clave-segura-1'});
  assert.equal(await diagnosticoHecho(db, u.id), false, 'sin curso no hay diagnóstico');
  await elegirEspecialidad(db, u.id, 'ccnn-egb-superior');
  assert.equal(await diagnosticoHecho(db, u.id), false);
  const ahora = new Date();
  await db.insert(intentos).values({id: 'i-diag-cn', usuarioId: u.id, tipo: 'diagnostico', referencia: 'ccnn-egb-superior', preguntaIds: [], iniciado: ahora, terminado: ahora});
  assert.equal(await diagnosticoHecho(db, u.id), true);
  // Se pasa a EGB directamente en la base, para probar solo el diagnóstico.
  await db.update(usuarios).set({especialidadId: 'egb-elemental-media'}).where(eq(usuarios.id, u.id));
  assert.equal(await diagnosticoHecho(db, u.id), false, 'el curso nuevo tiene su propio diagnóstico');
  await db.update(usuarios).set({especialidadId: 'ccnn-egb-superior'}).where(eq(usuarios.id, u.id));
  assert.equal(await diagnosticoHecho(db, u.id), true, 'al volver, su diagnóstico sigue ahí');
});

test('el catálogo sigue las fases del Ineval: primero las de la Fase 1, luego Matemática y Lengua', () => {
  const orden = [...CONTENIDO.especialidades].sort((a, b) => a.orden - b.orden).map((e) => e.nombre);
  assert.deepEqual(orden, [
    'Ciencias Naturales', 'Educación General Básica', 'Estudios Sociales', 'Biología', 'Química', 'Filosofía',
    'Emprendimiento y Gestión', 'Matemática', 'Lengua y Literatura',
  ]);
  assert.equal(new Set(CONTENIDO.especialidades.map((e) => e.orden)).size, CONTENIDO.especialidades.length, 'sin órdenes repetidos');
});

test('las tarjetas de Matemática tienen título corto y su explicación («Título: explicación»)', () => {
  const lecciones = disciplinar.unidades.filter((u) => u.asignatura === 'Matemática').flatMap((u) => u.temas.flatMap((t) => t.lecciones));
  for (const l of lecciones) {
    for (const s of l.contenido ?? []) {
      if (s.tipo !== 'puntos') continue;
      for (const p of s.puntos) {
        const [cabeza, ...resto] = p.split(': ');
        assert.ok(resto.length, `${l.id}: «${p}» necesita «Título: explicación»`);
        assert.ok(cabeza.length <= 40, `${l.id}: el título «${cabeza}» es muy largo para una tarjeta`);
      }
    }
  }
});
