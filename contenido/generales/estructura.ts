import {tema} from '../estructura-helpers';
import {HERRAMIENTAS, MEDIOS, REA, RIESGOS} from './digitales';
import {LECCIONES_PEDAGOGICAS} from './pedagogicos';
import type {Bloque} from '../tipos';

// Ficha técnica Ineval 2026, sección 4.1: Conocimientos generales (pedagógicos y digitales).
// Es igual para todas las especialidades: se escribe una vez y la comparten todas.

export const GENERALES: Bloque = {
  id: 'generales',
  nombre: 'Conocimientos generales',
  descripcion: 'Pedagógicos y digitales. Igual para todas las especialidades.',
  compartido: true,
  preguntasExamen: 39,
  minutosExamen: 45,
  unidades: [
    {
      id: 'gen-fundamentos',
      nombre: 'Fundamentos para el aprendizaje',
      temas: [
        tema('teorias-aprendizaje', 'Teorías del aprendizaje', [
          ['Conductismo, cognitivismo, constructivismo y conectivismo', 'Reconocer las características de las teorías del aprendizaje: conductismo, cognitivismo, constructivismo y conectivismo.'],
        ], LECCIONES_PEDAGOGICAS['teorias-aprendizaje']),
        tema('dua', 'Diseño Universal de Aprendizaje', [
          ['Los tres principios del DUA 2.0', 'Reconocer las características de los principios del Diseño Universal para el Aprendizaje (DUA) 2.0: representación, acción y expresión, e implicación.'],
        ], LECCIONES_PEDAGOGICAS['dua']),
      ],
    },
    {
      id: 'gen-curriculo',
      nombre: 'Currículo y planificación',
      temas: [
        tema('planificacion-curricular', 'Planificación curricular', [
          ['Los elementos de la planificación', 'Definir los elementos de la planificación curricular: objetivo, contenido, metodología y evaluación.'],
        ], LECCIONES_PEDAGOGICAS['planificacion-curricular']),
        tema('evaluacion-educativa', 'Evaluación educativa', [
          ['Diagnóstica, formativa y sumativa', 'Reconocer las características y el uso de los tipos de evaluación según su propósito: formativa, diagnóstica y sumativa.'],
          ['Instrumentos de evaluación', 'Reconocer las características y el uso de los instrumentos de evaluación: lista de cotejo, rúbrica, diarios de reflexión, diana de aprendizaje y portafolio.'],
        ], LECCIONES_PEDAGOGICAS['evaluacion-educativa']),
      ],
    },
    {
      id: 'gen-ensenanza',
      nombre: 'Proceso de enseñanza-aprendizaje',
      temas: [
        tema('metodologias', 'Metodologías de enseñanza-aprendizaje', [
          ['Proyectos, STEAM+H, gamificación, aula invertida y problemas', 'Reconocer las características y la aplicación del aprendizaje basado en proyectos, STEAM+H, gamificación, aula invertida y aprendizaje basado en problemas.'],
        ], LECCIONES_PEDAGOGICAS['metodologias']),
        tema('tecnicas', 'Técnicas de enseñanza-aprendizaje', [
          ['Técnicas para el aula', 'Reconocer las características y la aplicación del debate, foro, exposición oral, organizadores gráficos, resúmenes, lluvia de ideas, panel de discusión, mesa redonda, ensayo, línea de tiempo y juego de roles.'],
        ], LECCIONES_PEDAGOGICAS['tecnicas']),
      ],
    },
    {
      id: 'gen-digitales',
      nombre: 'Recursos digitales abiertos, medios digitales, herramientas tecnológicas digitales',
      temas: [
        REA,
        MEDIOS,
        HERRAMIENTAS,
      ],
    },
    {
      id: 'gen-internet',
      nombre: 'Uso seguro de internet',
      temas: [
        RIESGOS,
      ],
    },
  ],
};
