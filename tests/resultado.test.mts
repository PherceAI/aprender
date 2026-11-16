import {test} from 'node:test';
import assert from 'node:assert/strict';
import {destinoResultado} from '../lib/resultado.ts';
import {conHoy} from '../lib/avance.ts';
import {gruposDeTemas} from '../lib/perfil.ts';

// Hallazgos de la revisión final: el botón dice a dónde lleva, el gráfico coincide con el anillo
// y «En camino» son solo los temas que de verdad está estudiando.

test('el botón del resultado dice a dónde lleva', () => {
  const tema = destinoResultado({tipo: 'nada'}, 'prueba-tema', 'anatomia-celular');
  assert.deepEqual(tema, {href: '/curso/anatomia-celular', texto: 'Ver el tema'});
  const inicio = destinoResultado({tipo: 'nada'}, 'simulacro', null);
  assert.deepEqual(inicio, {href: '/inicio', texto: 'Volver al inicio'});
  const leccion = destinoResultado({tipo: 'leccion', leccionId: 'x-2', titulo: 'T', temaId: 'x', temaNombre: 'Histología', minutos: 7, numero: 2, de: 2}, 'practica', 'x-1');
  assert.deepEqual(leccion, {href: '/leccion/x-2', texto: 'Seguir: lección 2 de Histología'});
});

test('el gráfico termina en la preparación de hoy, la misma del anillo', () => {
  assert.deepEqual(conHoy([{dia: '2026-11-15', preparacion: 40}], '2026-11-16', 49), [
    {dia: '2026-11-15', preparacion: 40},
    {dia: '2026-11-16', preparacion: 49},
  ]);
  assert.deepEqual(conHoy([{dia: '2026-11-16', preparacion: 46}], '2026-11-16', 49), [{dia: '2026-11-16', preparacion: 49}]);
  assert.deepEqual(conHoy([], '2026-11-16', 0), [], 'sin estudio no se inventa un punto');
});

test('«En camino» son los temas que está estudiando, no los que solo ubicó el diagnóstico', () => {
  const g = gruposDeTemas([
    {temaId: 'a', estado: 'dominado', nivel: 90},
    {temaId: 'b', estado: 'aprendiendo', nivel: 40},
    {temaId: 'c', estado: 'sin-empezar', nivel: 70},
    {temaId: 'd', estado: 'repasar', nivel: 60},
  ]);
  assert.deepEqual(g.dominados.map((t) => t.temaId), ['a']);
  assert.deepEqual(g.enCamino.map((t) => t.temaId), ['b', 'd']);
  assert.deepEqual(g.porEmpezar.map((t) => t.temaId), ['c']);
});
