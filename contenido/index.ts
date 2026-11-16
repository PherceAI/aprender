import {CCNN, CCNN_DISCIPLINARES} from './ccnn-egb-superior/estructura';
import {PREGUNTAS_CCNN} from './ccnn-egb-superior/preguntas';
import {GENERALES} from './generales/estructura';
import {PREGUNTAS_GENERALES} from './generales/preguntas';
import {DIAGNOSTICO_CCNN, DIAGNOSTICO_GENERALES} from './diagnostico-ampliado';
import type {Contenido, Especialidad} from './tipos';

// Todo el contenido de la plataforma. Para agregar una especialidad: su carpeta + una línea aquí.

/** Especialidades que se muestran como «próximamente» (aún sin contenido). */
const PROXIMAMENTE: Especialidad[] = [
  {id: 'matematica-egb-superior', nombre: 'Matemática', nivel: 'Educación General Básica Superior', estado: 'proximamente', orden: 2, bloques: ['generales']},
  {id: 'lengua-egb-superior', nombre: 'Lengua y Literatura', nivel: 'Educación General Básica Superior', estado: 'proximamente', orden: 3, bloques: ['generales']},
  {id: 'estudios-sociales-egb-superior', nombre: 'Estudios Sociales', nivel: 'Educación General Básica Superior', estado: 'proximamente', orden: 4, bloques: ['generales']},
];

export const CONTENIDO: Contenido = {
  especialidades: [CCNN, ...PROXIMAMENTE],
  bloques: [GENERALES, CCNN_DISCIPLINARES],
  preguntas: [...PREGUNTAS_GENERALES, ...DIAGNOSTICO_GENERALES, ...PREGUNTAS_CCNN, ...DIAGNOSTICO_CCNN],
};
