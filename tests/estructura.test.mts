import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CONTENIDO} from '../contenido/index.ts';
import {validarContenido} from '../contenido/validar.ts';

const bloque = (id: string) => CONTENIDO.bloques.find((b) => b.id === id)!;
const temasDe = (id: string) => bloque(id).unidades.flatMap((u) => u.temas);
const especialidad = (id: string) => CONTENIDO.especialidades.find((e) => e.id === id)!;
/** Las unidades que rinde una especialidad: el bloque general y el suyo. */
const unidadesDe = (id: string) => especialidad(id).bloques.flatMap((b) => bloque(b).unidades);

// Los 31 temas de la ficha técnica Ineval 2026 (Dimensión 1), en orden.
const TEMAS_FICHA = [
  'Teorías del aprendizaje', 'Diseño Universal de Aprendizaje', 'Planificación curricular', 'Evaluación educativa',
  'Metodologías de enseñanza-aprendizaje', 'Técnicas de enseñanza-aprendizaje', 'Recursos educativos digitales abiertos',
  'Medios digitales', 'Herramientas tecnológicas digitales', 'Riesgos en entornos digitales',
  'Propiedades de los seres vivos', 'Organización de la materia viva', 'Anatomía celular', 'Fisiología celular', 'Histología',
  'Clasificación de los seres vivos', 'Flujos de energía en los ecosistemas y cadenas tróficas', 'Evolución de los seres vivos',
  'Ambientes de interacción de los seres vivos', 'Reproducción humana', 'Aparatos y sistemas del cuerpo', 'Sistema inmunológico',
  'Salud sexual y enfermedades de transmisión sexual', 'Relación de los seres humanos con los organismos patógenos',
  'El carbono y biomoléculas', 'El movimiento y la fuerza', 'Origen y estructura del universo', 'Ciclos biogeoquímicos',
  'Efectos antrópicos', 'Origen de la vida', 'Cambios geológicos en la Tierra',
];

test('la Dimensión 1 de Ciencias Naturales tiene 9 unidades, 31 temas y 70 lecciones', () => {
  const unidades = unidadesDe('ccnn-egb-superior');
  const temas = unidades.flatMap((u) => u.temas);
  assert.equal(unidades.length, 9);
  assert.equal(temas.length, 31);
  assert.equal(temas.flatMap((t) => t.lecciones).length, 70);
  assert.deepEqual(temas.map((t) => t.nombre), TEMAS_FICHA);
});

test('los bloques tienen las cantidades y tiempos del Ineval', () => {
  const g = bloque('generales');
  assert.deepEqual([g.compartido, g.preguntasExamen, g.minutosExamen, g.unidades.length, temasDe('generales').length], [true, 39, 45, 5, 10]);
  const cn = bloque('ccnn-disciplinares');
  assert.deepEqual([cn.compartido, cn.preguntasExamen, cn.minutosExamen, cn.unidades.length, temasDe('ccnn-disciplinares').length], [false, 60, 120, 4, 21]);
});

test('Ciencias Naturales rinde el bloque general compartido y el suyo', () => {
  const cn = CONTENIDO.especialidades.find((e) => e.id === 'ccnn-egb-superior')!;
  assert.equal(cn.estado, 'activa');
  assert.deepEqual(cn.bloques, ['generales', 'ccnn-disciplinares']);
  for (const e of CONTENIDO.especialidades) assert.ok(e.bloques.includes('generales'), `${e.id} sin el bloque general`);
});

test('todo el contenido pasa el validador', () => {
  assert.deepEqual(validarContenido(CONTENIDO), []);
});

test('el diagnóstico de Ciencias Naturales tiene 40 preguntas, toca los 31 temas y usa formatos interactivos', () => {
  const temas = unidadesDe('ccnn-egb-superior').flatMap((u) => u.temas);
  const ids = new Set(temas.map((t) => t.id));
  const diag = CONTENIDO.preguntas.filter((p) => p.usos.includes('diagnostico') && ids.has(p.temaId));
  assert.equal(diag.length, 40);
  for (const t of temas) assert.ok(diag.some((p) => p.temaId === t.id), `el tema ${t.id} no tiene pregunta de diagnóstico`);
  const formatos = new Set(diag.map((p) => p.formato));
  for (const f of ['simple', 'completamiento', 'seleccion', 'ordenamiento', 'emparejamiento']) assert.ok(formatos.has(f as never), `falta ${f}`);
  assert.ok(diag.some((p) => p.dibujo), 'el diagnóstico necesita al menos una pregunta sobre un dibujo');
});

test('los temas abiertos tienen lecciones escritas y preguntas para su prueba', () => {
  const abiertos = CONTENIDO.bloques.flatMap((b) => b.unidades.flatMap((u) => u.temas)).filter((t) => t.abierto);
  assert.deepEqual(abiertos.map((t) => t.id).sort(), ['anatomia-celular', 'herramientas-digitales', 'medios-digitales', 'rea', 'riesgos-digitales'].sort());
  for (const t of abiertos) {
    assert.ok(t.lecciones.every((l) => l.contenido?.length), `${t.id}: todas sus lecciones tienen contenido`);
    const prueba = CONTENIDO.preguntas.filter((p) => p.temaId === t.id && p.usos.includes('prueba'));
    assert.ok(prueba.length >= 10, `${t.id}: al menos 10 preguntas para la prueba del tema`);
    assert.ok(CONTENIDO.preguntas.some((p) => p.temaId === t.id && p.usos.includes('diagnostico-tema')), `${t.id}: tiene «¿Ya lo sabes?»`);
  }
});
