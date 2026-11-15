import {tema} from '../estructura-helpers';
import type {Bloque, Especialidad} from '../tipos';
import {ANATOMIA_CELULAR} from './anatomia-celular';

// Ficha técnica Ineval 2026, sección 4.2: Conocimientos disciplinares de Ciencias Naturales (EGB Superior).

export const CCNN: Especialidad = {
  id: 'ccnn-egb-superior',
  nombre: 'Ciencias Naturales',
  nivel: 'Educación General Básica Superior',
  estado: 'activa',
  orden: 1,
  bloques: ['generales', 'ccnn-disciplinares'],
};

export const CCNN_DISCIPLINARES: Bloque = {
  id: 'ccnn-disciplinares',
  nombre: 'Conocimientos de Ciencias Naturales',
  descripcion: 'Conocimientos disciplinares de la especialidad.',
  compartido: false,
  preguntasExamen: 60,
  minutosExamen: 120,
  unidades: [
    {
      id: 'cn-seres-vivos',
      nombre: 'Los seres vivos y su ambiente',
      temas: [
        tema('propiedades-seres-vivos', 'Propiedades de los seres vivos', [
          ['Tropismos', 'Reconocer los tipos de tropismos.'],
          ['Homeóstasis', 'Explicar el proceso de homeóstasis.'],
          ['Adaptación biológica', 'Reconocer los tipos de adaptación biológica.'],
        ]),
        tema('organizacion-materia-viva', 'Organización de la materia viva', [
          ['Niveles de organización', 'Ordenar los niveles de organización biológicos y ecológicos.'],
        ]),
        ANATOMIA_CELULAR,
        tema('fisiologia-celular', 'Fisiología celular', [
          ['Transporte celular', 'Explicar el transporte celular por difusión, ósmosis, endocitosis y exocitosis.'],
          ['Metabolismo celular', 'Reconocer los procesos del metabolismo celular.'],
          ['El ciclo celular', 'Ordenar las etapas del ciclo celular.'],
          ['Fases de la mitosis', 'Reconocer y ordenar las fases de la mitosis.'],
          ['Meiosis y mitosis', 'Diferenciar la meiosis de la mitosis.'],
        ]),
        tema('histologia', 'Histología', [
          ['Tejidos vegetales', 'Relacionar los tejidos vegetales con su función.'],
          ['Tejidos animales', 'Relacionar los tejidos animales con su función.'],
        ]),
        tema('clasificacion-seres-vivos', 'Clasificación de los seres vivos', [
          ['Bacterias', 'Clasificar las bacterias.'],
          ['Protistas', 'Clasificar los protistas.'],
          ['Hongos', 'Clasificar los hongos.'],
          ['Plantas', 'Clasificar las plantas.'],
          ['Animales', 'Clasificar los animales.'],
        ]),
        tema('flujos-energia', 'Flujos de energía en los ecosistemas y cadenas tróficas', [
          ['Niveles tróficos', 'Reconocer los niveles tróficos en los seres vivos.'],
          ['Redes tróficas', 'Explicar el funcionamiento de una red trófica.'],
        ]),
        tema('evolucion', 'Evolución de los seres vivos', [
          ['Selección natural', 'Explicar los principios de la selección natural.'],
        ]),
        tema('ambientes-interaccion', 'Ambientes de interacción de los seres vivos', [
          ['Ecosistemas de Ecuador', 'Reconocer los tipos de ecosistemas de Ecuador.'],
          ['Áreas protegidas de Ecuador', 'Reconocer las categorías de las áreas protegidas de Ecuador según el Sistema Nacional de Áreas Protegidas.'],
        ]),
      ],
    },
    {
      id: 'cn-cuerpo-humano',
      nombre: 'Cuerpo humano y salud',
      temas: [
        tema('reproduccion-humana', 'Reproducción humana', [
          ['Aparato reproductor masculino', 'Reconocer la estructura del aparato reproductor masculino.'],
          ['Aparato reproductor femenino', 'Reconocer la estructura del aparato reproductor femenino.'],
          ['Formación de óvulos', 'Explicar la formación de óvulos.'],
          ['Formación de espermatozoides', 'Explicar la formación de espermatozoides.'],
          ['La fecundación', 'Explicar el proceso de fecundación.'],
          ['Etapas del embarazo', 'Ordenar las etapas del embarazo.'],
        ]),
        tema('aparatos-sistemas', 'Aparatos y sistemas del cuerpo', [
          ['Aparato digestivo', 'Relacionar los órganos del aparato digestivo con su función.'],
          ['Aparato respiratorio', 'Relacionar los órganos del aparato respiratorio con su función.'],
          ['Aparato circulatorio', 'Relacionar los órganos del aparato circulatorio con su función.'],
          ['Glándulas endocrinas', 'Relacionar las glándulas endocrinas con sus funciones.'],
          ['Sistema nervioso', 'Reconocer la estructura del sistema nervioso.'],
          ['Sistema osteoartromuscular', 'Reconocer la estructura del sistema osteoartromuscular.'],
          ['Estructura del sistema inmunológico', 'Reconocer la estructura del sistema inmunológico.'],
        ]),
        tema('sistema-inmunologico', 'Sistema inmunológico', [
          ['Tipos de inmunidad', 'Diferenciar los tipos de inmunidad en los seres humanos.'],
        ]),
        tema('salud-sexual', 'Salud sexual y enfermedades de transmisión sexual', [
          ['Métodos anticonceptivos', 'Reconocer los tipos de métodos anticonceptivos.'],
          ['Enfermedades de transmisión sexual', 'Reconocer las enfermedades de transmisión sexual.'],
        ]),
        tema('patogenos', 'Relación de los seres humanos con los organismos patógenos', [
          ['Estructura de las bacterias', 'Reconocer la estructura de las bacterias.'],
          ['Resistencia a los antibióticos', 'Explicar la resistencia de las bacterias a los antibióticos.'],
          ['Estructura de los virus', 'Reconocer la estructura de los virus.'],
          ['Formas de contagio', 'Reconocer las formas de contagio de bacterias y virus.'],
        ]),
      ],
    },
    {
      id: 'cn-materia-energia',
      nombre: 'Materia y energía',
      temas: [
        tema('carbono-biomoleculas', 'El carbono y biomoléculas', [
          ['Propiedades del carbono', 'Reconocer las propiedades físicas y químicas del carbono.'],
          ['Biomoléculas', 'Reconocer las características de las biomoléculas.'],
        ]),
        tema('movimiento-fuerza', 'El movimiento y la fuerza', [
          ['Trayectoria, distancia, velocidad y aceleración', 'Diferenciar trayectoria, distancia, velocidad y aceleración.'],
          ['Fuerzas y cambio de posición', 'Reconocer las fuerzas que actúan sobre el cambio de posición de los objetos.'],
        ]),
      ],
    },
    {
      id: 'cn-tierra-universo',
      nombre: 'La Tierra y el Universo',
      temas: [
        tema('origen-universo', 'Origen y estructura del universo', [
          ['Teorías del origen del universo', 'Reconocer las teorías del origen del universo.'],
          ['Cuerpos celestes', 'Reconocer las características de los cuerpos celestes que conforman el universo.'],
        ]),
        tema('ciclos-biogeoquimicos', 'Ciclos biogeoquímicos', [
          ['Ciclos del agua, oxígeno, nitrógeno y azufre', 'Explicar los ciclos del agua, oxígeno, nitrógeno y azufre.'],
        ]),
        tema('efectos-antropicos', 'Efectos antrópicos', [
          ['Efectos antrópicos en los biomas', 'Reconocer los efectos antrópicos en los biomas del mundo.'],
        ]),
        tema('origen-vida', 'Origen de la vida', [
          ['Teorías del origen de la vida', 'Reconocer las teorías del origen de la vida.'],
        ]),
        tema('cambios-geologicos', 'Cambios geológicos en la Tierra', [
          ['Placas tectónicas', 'Explicar el movimiento de las placas tectónicas.'],
          ['Deriva continental', 'Explicar la teoría de la deriva continental.'],
          ['Eras geológicas', 'Reconocer las características de las eras geológicas.'],
          ['El ciclo de las rocas', 'Explicar el ciclo de formación de las rocas.'],
          ['Estructura de un volcán', 'Reconocer la estructura de un volcán.'],
        ]),
      ],
    },
  ],
};
