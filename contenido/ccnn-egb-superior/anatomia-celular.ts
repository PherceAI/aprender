import {tema} from '../estructura-helpers';
import type {Pregunta, Tema} from '../tipos';

// Tema abierto para la demo: Anatomía celular (ficha 4.2.1, «Los seres vivos y su ambiente»).
// Contenido de demo: lo revisa el docente experto antes de vender.

export const ANATOMIA_CELULAR: Tema = tema(
  'anatomia-celular',
  'Anatomía celular',
  [
    ['Estructura y función de la célula', 'Relacionar la estructura celular con su función.'],
    ['Célula vegetal y célula animal', 'Diferenciar la estructura de la célula vegetal y la estructura de la célula animal.'],
  ],
  {
    abierto: true,
    minutos: {1: 7, 2: 7},
    contenido: {
      1: [
        {
          tipo: 'texto',
          texto:
            'La célula es la unidad estructural, funcional y de origen de todo ser vivo: así lo dice la teoría celular (Schleiden, Schwann y Virchow). Cada estructura de la célula existe porque cumple una función. Si cambia la forma, cambia lo que la célula puede hacer.',
        },
        {
          tipo: 'puntos',
          titulo: 'Lo que tiene toda célula',
          puntos: [
            'Membrana plasmática: el límite que decide qué entra y qué sale.',
            'Citoplasma: el medio donde ocurre el metabolismo.',
            'Material genético (ADN): dentro del núcleo en las eucariotas; suelto en el nucleoide en las procariotas.',
            'Ribosomas: fabrican las proteínas.',
          ],
        },
        {
          tipo: 'comparacion',
          titulo: 'Procariota y eucariota',
          columnas: ['Procariota', 'Eucariota'],
          filas: [
            {aspecto: 'Núcleo', a: 'No tiene; el ADN está en el nucleoide', b: 'Sí, con envoltura nuclear'},
            {aspecto: 'Organelos con membrana', a: 'No', b: 'Sí (mitocondrias, retículo, Golgi…)'},
            {aspecto: 'Tamaño', a: '1 a 10 µm', b: '10 a 100 µm'},
            {aspecto: 'Ejemplos', a: 'Bacterias y arqueas', b: 'Animales, plantas, hongos y protistas'},
          ],
        },
        {
          tipo: 'laboratorio',
          lab: 'celula-animal',
          consigna: 'Toca cada organelo para descubrir qué hace. Antes de abrirlo, intenta adivinar su función.',
        },
        {
          tipo: 'puntos',
          titulo: 'La estructura explica la función',
          puntos: [
            'Las células del páncreas fabrican y exportan enzimas: tienen mucho retículo rugoso y aparato de Golgi.',
            'Las células musculares gastan mucha energía: tienen muchas mitocondrias.',
            'Las neuronas tienen prolongaciones largas (axón y dendritas) para llevar impulsos lejos.',
            'Los glóbulos rojos maduros de los mamíferos pierden el núcleo: queda más espacio para la hemoglobina.',
          ],
        },
        {
          tipo: 'aula',
          texto:
            'Pide a tus estudiantes comparar la célula con una fábrica (núcleo = gerencia, ribosomas = obreros, Golgi = despacho) y luego que encuentren dónde falla la comparación. Usas varias formas de representación, como pide el DUA.',
        },
        {
          tipo: 'clave',
          texto: 'Si te preguntan por una célula con una función especial, busca el organelo que esa función necesita en abundancia.',
        },
      ],
      2: [
        {
          tipo: 'texto',
          texto:
            'Las dos son eucariotas y comparten núcleo, membrana, mitocondrias, ribosomas, retículo y aparato de Golgi. Sus diferencias se explican por su forma de vida: la planta fabrica su alimento y no se desplaza; el animal busca su alimento y se mueve.',
        },
        {
          tipo: 'comparacion',
          titulo: 'Célula vegetal y célula animal',
          columnas: ['Vegetal', 'Animal'],
          filas: [
            {aspecto: 'Pared celular', a: 'Sí, de celulosa', b: 'No'},
            {aspecto: 'Cloroplastos', a: 'Sí (en las partes verdes)', b: 'No'},
            {aspecto: 'Vacuola', a: 'Una grande y central', b: 'Pequeñas y varias, o ninguna'},
            {aspecto: 'Forma', a: 'Regular, poliédrica', b: 'Irregular, variable'},
            {aspecto: 'Centriolos', a: 'No (en plantas con flor)', b: 'Sí'},
            {aspecto: 'Lisosomas', a: 'Escasos', b: 'Sí'},
            {aspecto: 'Reserva de energía', a: 'Almidón', b: 'Glucógeno'},
            {aspecto: 'Nutrición', a: 'Autótrofa', b: 'Heterótrofa'},
          ],
        },
        {
          tipo: 'laboratorio',
          lab: 'celula-vegetal',
          consigna: 'Encuentra y toca las tres estructuras que la célula animal no tiene.',
        },
        {
          tipo: 'puntos',
          titulo: 'Cuidado con estas trampas',
          puntos: [
            'Las células vegetales también tienen mitocondrias: hacen fotosíntesis y también respiración.',
            'La pared celular no reemplaza a la membrana: la célula vegetal tiene las dos.',
            'No todas las células vegetales tienen cloroplastos: las de la raíz, por ejemplo, no.',
            'La vacuola central mantiene la turgencia: por eso una planta sin agua se marchita.',
          ],
        },
        {
          tipo: 'aula',
          texto:
            'Observa al microscopio epidermis de cebolla (vegetal) y mucosa bucal (animal). Plantea el problema: «¿Por qué la cebolla es una planta y no es verde?». Es una entrada natural al aprendizaje basado en problemas.',
        },
        {
          tipo: 'clave',
          texto: 'Pared celular, cloroplastos y vacuola central: son las tres diferencias clave del lado vegetal. Centriolos y lisosomas son la pista del lado animal.',
        },
      ],
    },
  }
);

const L1 = 'anatomia-celular-1';
const L2 = 'anatomia-celular-2';
const T = 'anatomia-celular';

export const PREGUNTAS_ANATOMIA_CELULAR: Pregunta[] = [
  {
    id: 'ac-01', temaId: T, leccionId: L2, formato: 'simple', dificultad: 1,
    usos: ['diagnostico-tema', 'practica'],
    enunciado: 'Toca el organelo donde ocurre la fotosíntesis.',
    dibujo: {lab: 'celula-vegetal', zonas: ['cloroplasto', 'mitocondria', 'vacuola', 'nucleo']},
    opciones: ['Cloroplasto', 'Mitocondria', 'Vacuola central', 'Núcleo'],
    correcta: 0,
    explicaciones: [
      'Correcto: el cloroplasto tiene clorofila y transforma la energía de la luz en glucosa.',
      'La mitocondria hace la respiración celular: usa la glucosa, no la fabrica.',
      'La vacuola guarda agua y sustancias y mantiene la turgencia.',
      'El núcleo guarda el ADN y dirige la célula, pero no hace la fotosíntesis.',
    ],
  },
  {
    id: 'ac-02', temaId: T, leccionId: L2, formato: 'seleccion', dificultad: 2,
    usos: ['diagnostico-tema', 'prueba'],
    enunciado: '¿Cuáles de estas estructuras tiene la célula vegetal, pero no la célula animal?',
    elementos: ['Pared celular', 'Mitocondrias', 'Cloroplastos', 'Ribosomas', 'Vacuola central grande'],
    solucion: [0, 2, 4],
    opciones: ['1, 2 y 3', '2, 4 y 5', '1, 3 y 5', '1, 3 y 4'],
    correcta: 2,
    explicaciones: [
      'Las mitocondrias (2) están en las dos células: las plantas también respiran.',
      'Mitocondrias (2) y ribosomas (4) los tienen ambas células.',
      'Correcto: pared celular, cloroplastos y vacuola central son exclusivos de la célula vegetal.',
      'Los ribosomas (4) están en todas las células, incluso en las bacterias.',
    ],
  },
  {
    id: 'ac-03', temaId: T, leccionId: L1, formato: 'completamiento', dificultad: 1,
    usos: ['diagnostico-tema', 'prueba'],
    enunciado: 'Las células del músculo cardíaco trabajan sin descanso; por eso tienen gran cantidad de ____, que les dan energía.',
    opciones: ['lisosomas', 'mitocondrias', 'vacuolas', 'cloroplastos'],
    correcta: 1,
    explicaciones: [
      'Los lisosomas digieren sustancias; no producen energía.',
      'Correcto: las mitocondrias producen ATP por respiración celular, y el corazón necesita mucho.',
      'Las vacuolas almacenan; no producen energía.',
      'Las células animales no tienen cloroplastos.',
    ],
  },
  {
    id: 'ac-04', temaId: T, leccionId: L1, formato: 'emparejamiento', dificultad: 2,
    usos: ['prueba', 'practica'],
    enunciado: 'Relaciona cada organelo con su función.',
    elementos: {
      izquierda: ['Ribosoma', 'Aparato de Golgi', 'Lisosoma', 'Mitocondria'],
      derecha: ['Digiere sustancias y organelos viejos', 'Respiración celular', 'Síntesis de proteínas', 'Empaca y distribuye proteínas'],
    },
    solucion: [2, 3, 0, 1],
    opciones: ['1c, 2a, 3d, 4b', '1d, 2c, 3a, 4b', '1b, 2d, 3a, 4c', '1c, 2d, 3a, 4b'],
    correcta: 3,
    explicaciones: [
      'El Golgi no digiere: eso lo hace el lisosoma. El Golgi empaca y distribuye.',
      'El ribosoma fabrica proteínas; empacarlas es trabajo del Golgi.',
      'La mitocondria respira; las proteínas las fabrica el ribosoma.',
      'Correcto: ribosoma–síntesis, Golgi–empaque, lisosoma–digestión, mitocondria–respiración.',
    ],
  },
  {
    id: 'ac-05', temaId: T, leccionId: L1, formato: 'simple', dificultad: 1,
    usos: ['prueba'],
    enunciado: '¿Qué tienen en común las células procariotas y las eucariotas?',
    opciones: ['Núcleo con envoltura nuclear', 'Ribosomas', 'Mitocondrias', 'Pared de celulosa'],
    correcta: 1,
    explicaciones: [
      'Las procariotas no tienen núcleo: su ADN está en el nucleoide.',
      'Correcto: todas las células tienen ribosomas porque todas fabrican proteínas.',
      'Las procariotas no tienen organelos con membrana, como las mitocondrias.',
      'La celulosa es propia de las plantas; las bacterias tienen otra pared (peptidoglucano).',
    ],
  },
  {
    id: 'ac-06', temaId: T, leccionId: L1, formato: 'simple', dificultad: 2,
    usos: ['prueba', 'practica'],
    enunciado: 'Las células del páncreas producen y exportan muchas enzimas digestivas. ¿Qué estructuras tienen en abundancia?',
    opciones: [
      'Cloroplastos y vacuolas',
      'Centriolos y lisosomas',
      'Retículo endoplasmático rugoso y aparato de Golgi',
      'Retículo endoplasmático liso y vacuolas',
    ],
    correcta: 2,
    explicaciones: [
      'Las células animales no tienen cloroplastos.',
      'Los centriolos participan en la división y los lisosomas digieren: no fabrican enzimas para exportar.',
      'Correcto: el retículo rugoso fabrica las proteínas (las enzimas) y el Golgi las empaca para enviarlas fuera.',
      'El retículo liso fabrica lípidos, no proteínas.',
    ],
  },
  {
    id: 'ac-07', temaId: T, leccionId: L1, formato: 'simple', dificultad: 2,
    usos: ['prueba'],
    enunciado: 'Los glóbulos rojos maduros de los mamíferos no tienen núcleo. ¿Qué ventaja les da?',
    opciones: [
      'Se dividen más rápido',
      'Tienen más espacio para la hemoglobina y llevan más oxígeno',
      'Producen más energía',
      'Fabrican más proteínas',
    ],
    correcta: 1,
    explicaciones: [
      'Sin núcleo, el glóbulo rojo maduro no puede dividirse.',
      'Correcto: al perder el núcleo queda más espacio para la hemoglobina, que transporta oxígeno.',
      'Tampoco tienen mitocondrias; su energía sale de la glucólisis.',
      'Sin núcleo no hay nuevas instrucciones para fabricar proteínas.',
    ],
  },
  {
    id: 'ac-08', temaId: T, leccionId: L1, formato: 'ordenamiento', dificultad: 3,
    usos: ['prueba', 'practica'],
    enunciado: 'Ordena el recorrido de una proteína que la célula fabrica para exportar.',
    elementos: [
      'Aparato de Golgi',
      'Ribosomas del retículo rugoso',
      'Vesícula de secreción',
      'Interior del retículo endoplasmático rugoso',
      'Membrana plasmática (sale de la célula)',
    ],
    solucion: [1, 3, 0, 2, 4],
    opciones: ['2, 4, 1, 3, 5', '4, 2, 1, 3, 5', '2, 1, 4, 3, 5', '1, 2, 4, 3, 5'],
    correcta: 0,
    explicaciones: [
      'Correcto: se fabrica en el ribosoma, entra al retículo, pasa al Golgi, viaja en una vesícula y sale por la membrana.',
      'La proteína primero se fabrica (ribosoma) y luego entra al retículo, no al revés.',
      'Del ribosoma pasa al retículo, no directo al Golgi.',
      'El Golgi recibe la proteína ya fabricada; no es el primer paso.',
    ],
  },
  {
    id: 'ac-09', temaId: T, leccionId: L2, formato: 'completamiento', dificultad: 1,
    usos: ['prueba'],
    enunciado: 'La ____ es una capa rígida de celulosa que da forma a la célula vegetal y está por fuera de la membrana plasmática.',
    opciones: ['vacuola', 'pared celular', 'membrana nuclear', 'cápsula'],
    correcta: 1,
    explicaciones: [
      'La vacuola está dentro de la célula y guarda agua.',
      'Correcto: la pared celular de celulosa da forma y protección.',
      'La membrana nuclear rodea al núcleo, no a la célula.',
      'La cápsula es una capa de algunas bacterias, no de las plantas.',
    ],
  },
  {
    id: 'ac-10', temaId: T, leccionId: L2, formato: 'simple', dificultad: 3,
    usos: ['prueba'],
    enunciado: 'Un estudiante dice: «Las plantas no necesitan mitocondrias porque ya tienen cloroplastos». ¿Cuál es la mejor retroalimentación?',
    opciones: [
      'Tiene razón: el cloroplasto reemplaza a la mitocondria',
      'Las plantas hacen fotosíntesis de día y respiran solo de noche',
      'Las células vegetales sí tienen mitocondrias: el cloroplasto fabrica la glucosa y la mitocondria obtiene energía de ella',
      'Solo las células de la raíz tienen mitocondrias',
    ],
    correcta: 2,
    explicaciones: [
      'No: son procesos distintos y complementarios; la planta necesita ambos organelos.',
      'Las plantas respiran todo el tiempo, de día y de noche.',
      'Correcto: es una retroalimentación específica que corrige la confusión y explica la relación entre los dos procesos.',
      'Todas las células vegetales vivas tienen mitocondrias, no solo las de la raíz.',
    ],
  },
  {
    id: 'ac-11', temaId: T, leccionId: L2, formato: 'seleccion', dificultad: 2,
    usos: ['prueba', 'practica'],
    enunciado: '¿Cuáles de estas estructuras tiene la célula animal?',
    elementos: ['Centriolos', 'Pared celular', 'Lisosomas', 'Cloroplastos', 'Mitocondrias'],
    solucion: [0, 2, 4],
    opciones: ['2, 3 y 4', '1, 3 y 5', '1, 2 y 5', '3, 4 y 5'],
    correcta: 1,
    explicaciones: [
      'Pared celular (2) y cloroplastos (4) son propios de la célula vegetal.',
      'Correcto: centriolos, lisosomas y mitocondrias están en la célula animal.',
      'La célula animal no tiene pared celular (2).',
      'La célula animal no tiene cloroplastos (4).',
    ],
  },
  {
    id: 'ac-12', temaId: T, leccionId: L1, formato: 'simple', dificultad: 1,
    usos: ['prueba', 'practica'],
    enunciado: 'Toca la estructura que controla qué sustancias entran y salen de la célula.',
    dibujo: {lab: 'celula-animal', zonas: ['nucleo', 'golgi', 'membrana', 'lisosoma']},
    opciones: ['Núcleo', 'Aparato de Golgi', 'Membrana plasmática', 'Lisosoma'],
    correcta: 2,
    explicaciones: [
      'El núcleo dirige la célula, pero el paso de sustancias lo controla la membrana.',
      'El Golgi empaca y envía, pero no es el límite de la célula.',
      'Correcto: la membrana plasmática tiene permeabilidad selectiva.',
      'El lisosoma digiere sustancias dentro de la célula.',
    ],
  },
  {
    id: 'ac-13', temaId: T, leccionId: L2, formato: 'simple', dificultad: 2,
    usos: ['prueba'],
    enunciado: 'Una célula vegetal colocada en agua destilada se hincha pero no estalla. ¿Qué estructura lo impide?',
    opciones: ['La membrana plasmática', 'La vacuola central', 'La pared celular', 'El citoplasma'],
    correcta: 2,
    explicaciones: [
      'La membrana sola no resiste: un glóbulo rojo en agua destilada sí estalla.',
      'La vacuola es la que se llena de agua; no es la que resiste la presión.',
      'Correcto: la pared rígida de celulosa resiste la presión del agua que entra por ósmosis.',
      'El citoplasma no da resistencia mecánica.',
    ],
  },
  {
    id: 'ac-14', temaId: T, leccionId: L1, formato: 'completamiento', dificultad: 1,
    usos: ['practica'],
    enunciado: 'Según la teoría celular, la célula es la unidad estructural, ____ y de origen de todos los seres vivos.',
    opciones: ['funcional', 'energética', 'química', 'genética'],
    correcta: 0,
    explicaciones: [
      'Correcto: estructural, funcional y de origen (toda célula viene de otra célula).',
      'La teoría celular no habla de unidad energética.',
      'La teoría celular no habla de unidad química.',
      'El ADN está en la célula, pero el postulado es «funcional».',
    ],
  },
];
