import {tema} from '../estructura-helpers';
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
        ]),
        tema('dua', 'Diseño Universal de Aprendizaje', [
          ['Los tres principios del DUA 2.0', 'Reconocer las características de los principios del Diseño Universal para el Aprendizaje (DUA) 2.0: representación, acción y expresión, e implicación.'],
        ]),
      ],
    },
    {
      id: 'gen-curriculo',
      nombre: 'Currículo y planificación',
      temas: [
        tema('planificacion-curricular', 'Planificación curricular', [
          ['Los elementos de la planificación', 'Definir los elementos de la planificación curricular: objetivo, contenido, metodología y evaluación.'],
        ]),
        tema('evaluacion-educativa', 'Evaluación educativa', [
          ['Diagnóstica, formativa y sumativa', 'Reconocer las características y el uso de los tipos de evaluación según su propósito: formativa, diagnóstica y sumativa.'],
          ['Instrumentos de evaluación', 'Reconocer las características y el uso de los instrumentos de evaluación: lista de cotejo, rúbrica, diarios de reflexión, diana de aprendizaje y portafolio.'],
        ]),
      ],
    },
    {
      id: 'gen-ensenanza',
      nombre: 'Proceso de enseñanza-aprendizaje',
      temas: [
        tema('metodologias', 'Metodologías de enseñanza-aprendizaje', [
          ['Proyectos, STEAM+H, gamificación, aula invertida y problemas', 'Reconocer las características y la aplicación del aprendizaje basado en proyectos, STEAM+H, gamificación, aula invertida y aprendizaje basado en problemas.'],
        ]),
        tema('tecnicas', 'Técnicas de enseñanza-aprendizaje', [
          ['Técnicas para el aula', 'Reconocer las características y la aplicación del debate, foro, exposición oral, organizadores gráficos, resúmenes, lluvia de ideas, panel de discusión, mesa redonda, ensayo, línea de tiempo y juego de roles.'],
        ]),
      ],
    },
    {
      id: 'gen-digitales',
      nombre: 'Recursos digitales abiertos, medios digitales, herramientas tecnológicas digitales',
      temas: [
        tema('rea', 'Recursos educativos digitales abiertos', [
          ['Cómo evaluar un recurso abierto', 'Definir los criterios para evaluar los recursos educativos digitales abiertos: accesibilidad, reusabilidad, adaptabilidad, interactividad y portabilidad.'],
        ]),
        tema('medios-digitales', 'Medios digitales', [
          ['Multimodalidad e hipertextualidad', 'Reconocer las características y usos de los medios digitales relacionados con multimodalidad o hipertextualidad.'],
        ]),
        tema('herramientas-digitales', 'Herramientas tecnológicas digitales', [
          ['Herramientas sincrónicas y asincrónicas', 'Reconocer las características de las herramientas tecnológicas digitales sincrónicas y asincrónicas.'],
          ['Entornos virtuales de aprendizaje', 'Reconocer las características, usos e implementación de los entornos virtuales de aprendizaje.'],
          ['Ofimática para el docente', 'Usar herramientas de ofimática: hojas de cálculo, presentación multimedia, procesador de texto y correo electrónico.'],
        ]),
      ],
    },
    {
      id: 'gen-internet',
      nombre: 'Uso seguro de internet',
      temas: [
        tema('riesgos-digitales', 'Riesgos en entornos digitales', [
          ['Riesgos en la red y cómo prevenirlos', 'Identificar los riesgos en entornos digitales: acoso cibernético, sexteo, plagio académico, suplantación de identidad, tecnoadicciones, engaño pederasta (grooming), fraude informático (phishing), correo basura (spam) y el uso de antivirus.'],
        ]),
      ],
    },
  ],
};
