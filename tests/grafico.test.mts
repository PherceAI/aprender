import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

// Fuera de Next, tsx compila el JSX con React global.
(globalThis as {React?: typeof React}).React = React;
const {GraficoPreparacion} = await import('../components/grafico-preparacion.tsx');
const {createElement} = React;

// «Mi progreso»: el gráfico de evolución debe leerse bien con datos y no romperse el primer día.

test('con varios días dibuja la línea y dice de cuánto a cuánto subió', () => {
  const html = renderToStaticMarkup(
    createElement(GraficoPreparacion, {
      puntos: [
        {dia: '2026-11-14', preparacion: 40},
        {dia: '2026-11-15', preparacion: 46},
        {dia: '2026-11-16', preparacion: 55},
      ],
    })
  );
  assert.match(html, /<path d="M/);
  assert.equal((html.match(/<circle/g) ?? []).length, 3);
  assert.match(html, /De 40 % a <strong[^>]*>55 %<\/strong> en 3 días de estudio/);
});

test('con un solo día muestra el aviso en vez de un gráfico roto', () => {
  const html = renderToStaticMarkup(createElement(GraficoPreparacion, {puntos: [{dia: '2026-11-16', preparacion: 46}]}));
  assert.doesNotMatch(html, /<svg viewBox/);
  assert.match(html, /Tu evolución aparece desde tu segundo día de estudio/);
});
