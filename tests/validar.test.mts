import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validarContenido, listaNumeros, listaOrden, listaParejas} from '../contenido/validar.ts';
import type {Contenido, Pregunta} from '../contenido/tipos.ts';

function pregunta(p: Partial<Pregunta> & {id: string}): Pregunta {
  return {
    temaId: 't1',
    formato: 'simple',
    enunciado: '¿Cuál?',
    opciones: ['a', 'b', 'c', 'd'],
    correcta: 0,
    explicaciones: ['sí', 'no', 'no', 'no'],
    usos: ['practica'],
    dificultad: 1,
    ...p,
  };
}

/** Contenido mínimo válido: 1 especialidad, 1 bloque, 1 unidad, 1 tema, 1 lección, 2 de diagnóstico. */
function base(): Contenido {
  return {
    especialidades: [{id: 'e', nombre: 'E', nivel: 'N', estado: 'activa', orden: 1, bloques: ['b']}],
    bloques: [
      {
        id: 'b', nombre: 'B', descripcion: '', compartido: false, preguntasExamen: 10, minutosExamen: 10,
        unidades: [{id: 'u1', nombre: 'U', temas: [{id: 't1', nombre: 'T', lecciones: [{id: 'l1', titulo: 'L', objetivo: 'O'}]}]}],
      },
    ],
    preguntas: [pregunta({id: 'd1', usos: ['diagnostico']}), pregunta({id: 'd2', usos: ['diagnostico']})],
  };
}

function errores(mutar: (c: Contenido) => void): string[] {
  const c = base();
  mutar(c);
  return validarContenido(c);
}

test('el contenido mínimo es válido', () => {
  assert.deepEqual(validarContenido(base()), []);
});

test('formatos de las opciones del Ineval', () => {
  assert.equal(listaNumeros([0, 2, 3]), '1, 3 y 4');
  assert.equal(listaNumeros([1, 2]), '2 y 3');
  assert.equal(listaOrden([1, 0, 3, 2]), '2, 1, 4, 3');
  assert.equal(listaParejas([1, 0, 2]), '1b, 2a, 3c');
});

test('ids repetidos', () => {
  const e = errores((c) => c.preguntas.push(pregunta({id: 'd1'})));
  assert.ok(e.some((x) => x.includes('d1') && x.includes('repetido')), e.join('\n'));
});

test('tema inexistente', () => {
  const e = errores((c) => c.preguntas.push(pregunta({id: 'p', temaId: 'nada'})));
  assert.ok(e.some((x) => x.includes('p') && x.includes('tema')), e.join('\n'));
});

test('lección de otro tema o inexistente', () => {
  const e = errores((c) => c.preguntas.push(pregunta({id: 'p', leccionId: 'nada'})));
  assert.ok(e.some((x) => x.includes('p') && x.includes('lección')), e.join('\n'));
});

test('opciones repetidas, vacías o correcta fuera de rango', () => {
  assert.ok(errores((c) => c.preguntas.push(pregunta({id: 'p', opciones: ['a', 'a', 'c', 'd']}))).some((x) => x.includes('opciones')));
  assert.ok(errores((c) => c.preguntas.push(pregunta({id: 'p', opciones: ['a', ' ', 'c', 'd']}))).some((x) => x.includes('opciones')));
  assert.ok(errores((c) => c.preguntas.push(pregunta({id: 'p', correcta: 4 as 0}))).some((x) => x.includes('correcta')));
  assert.ok(errores((c) => c.preguntas.push(pregunta({id: 'p', explicaciones: ['a', '', 'c', 'd']}))).some((x) => x.includes('explicaciones')));
});

test('completamiento necesita el espacio ____', () => {
  const e = errores((c) => c.preguntas.push(pregunta({id: 'p', formato: 'completamiento', enunciado: 'Sin espacio'})));
  assert.ok(e.some((x) => x.includes('____')), e.join('\n'));
});

test('selección: la opción correcta coincide con la solución', () => {
  const ok = pregunta({
    id: 'p', formato: 'seleccion', elementos: ['w', 'x', 'y', 'z'], solucion: [0, 2],
    opciones: ['1 y 3', '2 y 4', '1 y 2', '3 y 4'],
  });
  assert.deepEqual(errores((c) => c.preguntas.push(ok)), []);
  const mal = {...ok, correcta: 1 as const};
  assert.ok(errores((c) => c.preguntas.push(mal)).some((x) => x.includes('solución')));
});

test('ordenamiento: la solución es un orden completo y coincide con la opción', () => {
  const ok = pregunta({
    id: 'p', formato: 'ordenamiento', elementos: ['w', 'x', 'y'], solucion: [2, 0, 1],
    opciones: ['3, 1, 2', '1, 2, 3', '2, 3, 1', '3, 2, 1'],
  });
  assert.deepEqual(errores((c) => c.preguntas.push(ok)), []);
  assert.ok(errores((c) => c.preguntas.push({...ok, solucion: [2, 2, 1]})).some((x) => x.includes('solución')));
});

test('emparejamiento: una pareja por fila y coincide con la opción', () => {
  const ok = pregunta({
    id: 'p', formato: 'emparejamiento', elementos: {izquierda: ['A', 'B', 'C'], derecha: ['x', 'y', 'z']},
    solucion: [1, 0, 2], opciones: ['1b, 2a, 3c', '1a, 2b, 3c', '1c, 2a, 3b', '1b, 2c, 3a'],
  });
  assert.deepEqual(errores((c) => c.preguntas.push(ok)), []);
  assert.ok(errores((c) => c.preguntas.push({...ok, solucion: [1, 0]})).some((x) => x.includes('solución')));
});

test('dibujo: laboratorio y zonas conocidas', () => {
  const ok = pregunta({id: 'p', dibujo: {lab: 'celula-vegetal', zonas: ['cloroplasto', 'mitocondria', 'vacuola', 'nucleo']}});
  assert.deepEqual(errores((c) => c.preguntas.push(ok)), []);
  const mal = pregunta({id: 'q', dibujo: {lab: 'celula-animal', zonas: ['cloroplasto', 'mitocondria', 'nucleo', 'golgi']}});
  assert.ok(errores((c) => c.preguntas.push(mal)).some((x) => x.includes('cloroplasto')));
});

test('cada tema necesita al menos una pregunta de diagnóstico', () => {
  const e = errores((c) => {
    c.preguntas = c.preguntas.filter((p) => !p.usos.includes('diagnostico'));
  });
  assert.ok(e.some((x) => x.includes('diagnóstico')), e.join(String.fromCharCode(10)));
});

test('un tema abierto necesita lecciones con contenido y preguntas propias', () => {
  const e = errores((c) => {
    c.bloques[0].unidades[0].temas[0].abierto = true;
  });
  assert.ok(e.some((x) => x.includes('l1') && x.includes('contenido')), e.join('\n'));
  assert.ok(e.some((x) => x.includes('t1') && x.includes('diagnostico-tema')), e.join('\n'));
});

test('la especialidad apunta a bloques que existen', () => {
  const e = errores((c) => c.especialidades[0].bloques.push('nada'));
  assert.ok(e.some((x) => x.includes('nada')), e.join('\n'));
});
