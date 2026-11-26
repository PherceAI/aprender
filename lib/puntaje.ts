// El puntaje de la Dimensión 1 como lo calcula el Ineval: Nota técnica de calificación (abril 2026),
// sección 3.1 y anexo 1. La prueba real tiene 99 preguntas (60 de la especialidad, 21 pedagógicas
// y 18 digitales) y los aciertos se pasan a una escala de 0 a 1000 con tres tramos lineales:
//   0 a 28 aciertos → 0 a 600 · 29 a 60 → 601 a 700 · 61 a 99 → 701 a 1000.
// Ver docs/investigacion-ineval.md.

export const PREGUNTAS_EXAMEN = 99;

export type NivelIneval = 'En formación' | 'Fundamental' | 'Favorable' | 'Excelente';

/** Niveles de desempeño (Nota técnica, tabla 3), del más alto al más bajo. */
export const NIVELES: {nivel: NivelIneval; desde: number; hasta: number; aciertos: number; aciertosHasta: number}[] = [
  {nivel: 'Excelente', desde: 951, hasta: 1000, aciertos: 93, aciertosHasta: 99},
  {nivel: 'Favorable', desde: 701, hasta: 950, aciertos: 61, aciertosHasta: 92},
  {nivel: 'Fundamental', desde: 601, hasta: 700, aciertos: 29, aciertosHasta: 60},
  {nivel: 'En formación', desde: 0, hasta: 600, aciertos: 0, aciertosHasta: 28},
];

/** Calificación del Ineval (0 a 1000) para un número de aciertos de 99. Coincide con el anexo 1. */
export function calificacionIneval(aciertos: number): number {
  const a = Math.max(0, Math.min(PREGUNTAS_EXAMEN, Math.round(aciertos)));
  if (a <= 28) return Math.round((a * 600) / 28);
  if (a <= 60) return Math.round(600 + ((a - 28) * 100) / 32);
  return Math.round(700 + ((a - 60) * 300) / 39);
}

export function nivelIneval(calificacion: number): NivelIneval {
  return NIVELES.find((n) => calificacion >= n.desde)!.nivel;
}

/**
 * Puntaje estimado a partir de un porcentaje de aciertos (diagnóstico, simulacro o preparación):
 * cuántas de las 99 acertaría con ese porcentaje, y qué le daría el Ineval.
 */
export function estimarIneval(porcentaje: number) {
  const aciertos = Math.round((Math.max(0, Math.min(100, porcentaje)) * PREGUNTAS_EXAMEN) / 100);
  const calificacion = calificacionIneval(aciertos);
  const nivel = nivelIneval(calificacion);
  const siguiente = [...NIVELES].reverse().find((n) => n.aciertos > aciertos) ?? null;
  return {
    aciertos,
    calificacion,
    nivel,
    /** El nivel que sigue y cuántos aciertos más le faltan para llegar (null si ya está en Excelente). */
    siguiente: siguiente && {nivel: siguiente.nivel, faltan: siguiente.aciertos - aciertos},
  };
}
