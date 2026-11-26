import {CCNN, CCNN_DISCIPLINARES} from './ccnn-egb-superior/estructura';
import {EGB, EGB_DISCIPLINARES} from './egb-elemental-media/estructura';
import {PREGUNTAS_CCNN} from './ccnn-egb-superior/preguntas';
import {GENERALES} from './generales/estructura';
import {PREGUNTAS_GENERALES} from './generales/preguntas';
import {PREGUNTAS_DIGITALES} from './generales/digitales';
import {DIAGNOSTICO_CCNN, DIAGNOSTICO_GENERALES} from './diagnostico-ampliado';
import type {Contenido, Especialidad} from './tipos';

// Todo el contenido de la plataforma. Para agregar una especialidad: su carpeta + una línea aquí.

// Un curso = una especialidad del Ineval: cada docente rinde solo la de su nombramiento (docs/investigacion-ineval.md).
// Orden: las de la Fase 1, cuyas fichas tenemos en fuentes/, y luego las grandes de la Fase 2.
// Los ids viejos se conservan (la siembra actualiza por id); solo se corrigieron nombres y niveles.
const proxima = (id: string, nombre: string, nivel: string, orden: number): Especialidad => ({id, nombre, nivel, estado: 'proximamente', orden, bloques: ['generales']});

/** Especialidades que se muestran como «próximamente» (aún sin contenido). */
const PROXIMAMENTE: Especialidad[] = [
  proxima('estudios-sociales-egb-superior', 'Estudios Sociales', 'EGB Superior (8.º a 10.º)', 3),
  proxima('biologia-bgu', 'Biología', 'Bachillerato', 4),
  proxima('quimica-bgu', 'Química', 'Bachillerato', 5),
  proxima('filosofia-bgu', 'Filosofía', 'Bachillerato', 6),
  proxima('emprendimiento-bgu', 'Emprendimiento y Gestión', 'Bachillerato', 7),
  proxima('matematica-egb-superior', 'Matemática', '8.º EGB a 3.º BGU', 8),
  proxima('lengua-egb-superior', 'Lengua y Literatura', '8.º EGB a 3.º BGU', 9),
];

export const CONTENIDO: Contenido = {
  especialidades: [CCNN, EGB, ...PROXIMAMENTE],
  bloques: [GENERALES, CCNN_DISCIPLINARES, EGB_DISCIPLINARES],
  preguntas: [...PREGUNTAS_GENERALES, ...PREGUNTAS_DIGITALES, ...DIAGNOSTICO_GENERALES, ...PREGUNTAS_CCNN, ...DIAGNOSTICO_CCNN],
};
