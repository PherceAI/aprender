import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calificacionIneval, estimarIneval, nivelIneval} from '../lib/puntaje.ts';

// Anexo 1 de la Nota técnica de calificación del Ineval (abril 2026): aciertos → calificación.
const ANEXO_1: [number, number][] = [
  [0, 0], [1, 21], [2, 43], [3, 64], [10, 214], [17, 364], [18, 386], [27, 579], [28, 600],
  [29, 603], [30, 606], [32, 613], [36, 625], [48, 663], [56, 688], [59, 697], [60, 700],
  [61, 708], [62, 715], [70, 777], [78, 838], [85, 892], [92, 946], [93, 954], [98, 992], [99, 1000],
];

test('la calificación coincide con la tabla oficial del Ineval', () => {
  for (const [aciertos, calificacion] of ANEXO_1) assert.equal(calificacionIneval(aciertos), calificacion, `${aciertos} aciertos`);
});

test('los cuatro niveles de desempeño y sus cortes', () => {
  assert.equal(nivelIneval(600), 'En formación');
  assert.equal(nivelIneval(601), 'Fundamental');
  assert.equal(nivelIneval(700), 'Fundamental');
  assert.equal(nivelIneval(708), 'Favorable');
  assert.equal(nivelIneval(950), 'Favorable');
  assert.equal(nivelIneval(954), 'Excelente');
  assert.equal(nivelIneval(calificacionIneval(28)), 'En formación');
  assert.equal(nivelIneval(calificacionIneval(29)), 'Fundamental');
  assert.equal(nivelIneval(calificacionIneval(61)), 'Favorable');
  assert.equal(nivelIneval(calificacionIneval(93)), 'Excelente');
});

test('estimar desde un porcentaje dice el puntaje, el nivel y cuánto falta para el siguiente', () => {
  assert.deepEqual(estimarIneval(50), {aciertos: 50, calificacion: 669, nivel: 'Fundamental', siguiente: {nivel: 'Favorable', faltan: 11}});
  assert.deepEqual(estimarIneval(62), {aciertos: 61, calificacion: 708, nivel: 'Favorable', siguiente: {nivel: 'Excelente', faltan: 32}});
  assert.deepEqual(estimarIneval(20), {aciertos: 20, calificacion: 429, nivel: 'En formación', siguiente: {nivel: 'Fundamental', faltan: 9}});
  assert.deepEqual(estimarIneval(100), {aciertos: 99, calificacion: 1000, nivel: 'Excelente', siguiente: null});
  assert.equal(estimarIneval(-5).calificacion, 0);
  assert.equal(estimarIneval(140).calificacion, 1000);
});
