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

test('EGB sigue «próximamente» hasta tener su diagnóstico', () => {
  assert.equal(egb.estado, 'proximamente');
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

test('cada lección de EGB dice su objetivo y aún no hay temas abiertos', () => {
  for (const t of disciplinar.unidades.flatMap((u) => u.temas)) {
    assert.ok(t.id.startsWith('egb-'), `${t.id}: los temas de EGB empiezan con egb-`);
    assert.ok(!t.abierto, `${t.id}: todavía no tiene lecciones escritas`);
    for (const l of t.lecciones) assert.match(l.objetivo, /^[A-ZÁÉÍÓÚ].+\.$/, `${l.id}: objetivo como frase completa`);
  }
});

test('el validador: el diagnóstico completo se exige solo a las especialidades activas', () => {
  assert.deepEqual(validarContenido(CONTENIDO), []);
  const activa: Contenido = {...CONTENIDO, especialidades: CONTENIDO.especialidades.map((e) => (e.id === egb.id ? {...e, estado: 'activa'} : e))};
  const errores = validarContenido(activa);
  assert.equal(errores.length, 34, 'un error por cada tema de EGB sin pregunta de diagnóstico');
  assert.ok(errores.every((e) => e.startsWith('Tema «egb-') && e.includes('diagnóstico')));
});

test('el validador: si una unidad del bloque tiene asignatura, todas deben tenerla', () => {
  const sinUna: Contenido = {
    ...CONTENIDO,
    bloques: CONTENIDO.bloques.map((b) => (b.id === disciplinar.id ? {...b, unidades: b.unidades.map((u, i) => (i === 0 ? {...u, asignatura: undefined} : u))} : b)),
  };
  assert.deepEqual(validarContenido(sinUna), ['Bloque «egb-disciplinares»: si una unidad tiene asignatura, todas deben tenerla']);
});

test('la siembra guarda la asignatura de cada unidad y no se puede elegir EGB todavía', async () => {
  const db = await crearDbPrueba();
  await sembrar(db);
  const filas = await db.select().from(unidades).where(eq(unidades.bloqueId, 'egb-disciplinares')).orderBy(asc(unidades.orden));
  assert.equal(filas.length, 15);
  assert.deepEqual([...new Set(filas.map((f) => f.asignatura))], ['Matemática', 'Lengua y Literatura', 'Ciencias Naturales', 'Ciencias Sociales']);
  const cn = await db.select().from(unidades).where(eq(unidades.bloqueId, 'ccnn-disciplinares'));
  assert.ok(cn.every((f) => f.asignatura === null), 'Ciencias Naturales de EGB Superior no cambia');

  const u = await crearUsuario(db, {nombre: 'Docente', correo: 'egb@prueba.ec', clave: 'clave-segura-1'});
  await assert.rejects(elegirEspecialidad(db, u.id, 'egb-elemental-media'), /próximamente/);
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
  // Cuando EGB se active, el docente podrá pasarse a ese curso (aquí se fuerza en la base).
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
