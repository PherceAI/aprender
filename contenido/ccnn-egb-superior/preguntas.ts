import type {Pregunta} from '../tipos';
import {PREGUNTAS_ANATOMIA_CELULAR} from './anatomia-celular';

// Ciencias Naturales: diagnóstico de entrada (2 por unidad), tema abierto y simulacro corto.
// Contenido de demo: lo revisa el docente experto antes de vender.

const DIAGNOSTICO_Y_SIMULACRO: Pregunta[] = [
  // ── Diagnóstico · Los seres vivos y su ambiente
  {
    id: 'diag-cn-01', temaId: 'anatomia-celular', leccionId: 'anatomia-celular-2', formato: 'simple', dificultad: 1,
    usos: ['diagnostico'],
    enunciado: 'Toca la capa rígida de celulosa que protege a la célula vegetal y le da forma.',
    dibujo: {lab: 'celula-vegetal', zonas: ['membrana', 'pared', 'vacuola', 'nucleo']},
    opciones: ['Membrana plasmática', 'Pared celular', 'Vacuola central', 'Núcleo'],
    correcta: 1,
    explicaciones: [
      'La membrana está por dentro de la pared y es flexible, no rígida.',
      'Correcto: la pared celular de celulosa da forma y protección.',
      'La vacuola guarda agua y ayuda a la turgencia, pero no es una capa de celulosa.',
      'El núcleo guarda el ADN; no protege a la célula por fuera.',
    ],
  },
  {
    id: 'diag-cn-02', temaId: 'fisiologia-celular', leccionId: 'fisiologia-celular-4', formato: 'ordenamiento', dificultad: 2,
    usos: ['diagnostico', 'practica'],
    enunciado: 'Ordena las fases de la mitosis.',
    elementos: ['Anafase', 'Profase', 'Telofase', 'Metafase'],
    solucion: [1, 3, 0, 2],
    opciones: ['2, 4, 1, 3', '2, 1, 4, 3', '4, 2, 1, 3', '2, 4, 3, 1'],
    correcta: 0,
    explicaciones: [
      'Correcto: profase, metafase, anafase y telofase.',
      'La anafase (separación de cromátidas) va después de la metafase (alineación).',
      'La profase, cuando se condensan los cromosomas, es la primera.',
      'La telofase cierra la mitosis: va al final.',
    ],
  },
  // ── Diagnóstico · Cuerpo humano y salud
  {
    id: 'diag-cn-03', temaId: 'aparatos-sistemas', leccionId: 'aparatos-sistemas-4', formato: 'emparejamiento', dificultad: 2,
    usos: ['diagnostico', 'practica'],
    enunciado: 'Relaciona cada glándula con su función.',
    elementos: {
      izquierda: ['Páncreas', 'Tiroides', 'Hipófisis'],
      derecha: [
        'Regula el metabolismo con la tiroxina',
        'Produce insulina y glucagón',
        'Controla a otras glándulas; se la llama glándula maestra',
      ],
    },
    solucion: [1, 0, 2],
    opciones: ['1a, 2b, 3c', '1b, 2a, 3c', '1c, 2a, 3b', '1b, 2c, 3a'],
    correcta: 1,
    explicaciones: [
      'El páncreas no produce tiroxina: esa hormona es de la tiroides.',
      'Correcto: páncreas–insulina y glucagón, tiroides–tiroxina, hipófisis–glándula maestra.',
      'La glándula maestra es la hipófisis, no el páncreas.',
      'La tiroides no controla a otras glándulas: lo hace la hipófisis.',
    ],
  },
  {
    id: 'diag-cn-04', temaId: 'sistema-inmunologico', formato: 'simple', dificultad: 2,
    usos: ['diagnostico', 'practica'],
    enunciado: 'Una persona recibe la vacuna contra el sarampión y su cuerpo produce anticuerpos. ¿Qué tipo de inmunidad adquiere?',
    opciones: ['Innata', 'Pasiva natural', 'Activa artificial', 'Pasiva artificial'],
    correcta: 2,
    explicaciones: [
      'La innata se tiene desde el nacimiento y no depende de vacunas.',
      'La pasiva natural son anticuerpos que pasan de la madre al bebé.',
      'Correcto: el cuerpo fabrica sus propios anticuerpos (activa) gracias a una vacuna (artificial).',
      'La pasiva artificial es recibir anticuerpos ya hechos, como en un suero.',
    ],
  },
  // ── Diagnóstico · Materia y energía
  {
    id: 'diag-cn-05', temaId: 'carbono-biomoleculas', leccionId: 'carbono-biomoleculas-2', formato: 'seleccion', dificultad: 1,
    usos: ['diagnostico', 'practica'],
    enunciado: '¿Cuáles son biomoléculas orgánicas?',
    elementos: ['Proteínas', 'Agua', 'Lípidos', 'Ácidos nucleicos', 'Sales minerales'],
    solucion: [0, 2, 3],
    opciones: ['1, 3 y 4', '1, 2 y 3', '2, 4 y 5', '3, 4 y 5'],
    correcta: 0,
    explicaciones: [
      'Correcto: proteínas, lípidos y ácidos nucleicos tienen esqueleto de carbono.',
      'El agua (2) es una biomolécula inorgánica.',
      'El agua (2) y las sales minerales (5) son inorgánicas.',
      'Las sales minerales (5) son inorgánicas.',
    ],
  },
  {
    id: 'diag-cn-06', temaId: 'movimiento-fuerza', leccionId: 'movimiento-fuerza-1', formato: 'simple', dificultad: 1,
    usos: ['diagnostico', 'practica'],
    enunciado: 'Un bus recorre 120 km en 2 horas. ¿Cuál es su rapidez media?',
    opciones: ['240 km/h', '60 km/h', '122 km/h', '30 km/h'],
    correcta: 1,
    explicaciones: [
      'Se multiplicó en lugar de dividir: la rapidez es distancia ÷ tiempo.',
      'Correcto: 120 km ÷ 2 h = 60 km/h.',
      'Se sumaron la distancia y el tiempo; hay que dividirlos.',
      'Se dividió dos veces; 120 ÷ 2 = 60.',
    ],
  },
  // ── Diagnóstico · La Tierra y el Universo
  {
    id: 'diag-cn-07', temaId: 'ciclos-biogeoquimicos', formato: 'ordenamiento', dificultad: 1,
    usos: ['diagnostico', 'practica'],
    enunciado: 'Ordena el ciclo del agua empezando por la evaporación.',
    elementos: ['Precipitación', 'Evaporación', 'Escorrentía e infiltración', 'Condensación'],
    solucion: [1, 3, 0, 2],
    opciones: ['2, 1, 4, 3', '2, 4, 1, 3', '4, 2, 1, 3', '2, 4, 3, 1'],
    correcta: 1,
    explicaciones: [
      'Antes de llover, el vapor tiene que condensarse en nubes.',
      'Correcto: evaporación, condensación, precipitación y escorrentía o infiltración.',
      'El ciclo pedido empieza por la evaporación.',
      'El agua escurre o se infiltra después de caer como precipitación.',
    ],
  },
  {
    id: 'diag-cn-08', temaId: 'cambios-geologicos', leccionId: 'cambios-geologicos-2', formato: 'completamiento', dificultad: 1,
    usos: ['diagnostico', 'practica'],
    enunciado: 'La teoría de la deriva continental fue propuesta por ____, quien planteó que los continentes estuvieron unidos en un supercontinente llamado Pangea.',
    opciones: ['Charles Darwin', 'Charles Lyell', 'Isaac Newton', 'Alfred Wegener'],
    correcta: 3,
    explicaciones: [
      'Darwin propuso la teoría de la evolución por selección natural.',
      'Lyell fue un geólogo del uniformismo, pero no propuso la deriva continental.',
      'Newton formuló las leyes del movimiento y la gravitación.',
      'Correcto: Alfred Wegener la propuso en 1912.',
    ],
  },
  // ── Simulacro corto
  {
    id: 'sim-cn-01', temaId: 'propiedades-seres-vivos', leccionId: 'propiedades-seres-vivos-1', formato: 'emparejamiento', dificultad: 1,
    usos: ['simulacro', 'practica'],
    enunciado: 'Relaciona cada tropismo con el estímulo al que responde.',
    elementos: {izquierda: ['Fototropismo', 'Gravitropismo', 'Tigmotropismo'], derecha: ['El contacto', 'La luz', 'La gravedad']},
    solucion: [1, 2, 0],
    opciones: ['1b, 2c, 3a', '1a, 2c, 3b', '1c, 2b, 3a', '1b, 2a, 3c'],
    correcta: 0,
    explicaciones: [
      'Correcto: foto = luz, gravi = gravedad, tigmo = contacto.',
      'Fototropismo viene de «foto», luz; no de contacto.',
      'Fototropismo responde a la luz, no a la gravedad.',
      'Gravitropismo responde a la gravedad, no al contacto.',
    ],
  },
  {
    id: 'sim-cn-02', temaId: 'organizacion-materia-viva', formato: 'ordenamiento', dificultad: 1,
    usos: ['simulacro', 'practica'],
    enunciado: 'Ordena los niveles de organización de menor a mayor complejidad.',
    elementos: ['Órgano', 'Célula', 'Sistema', 'Tejido', 'Organismo'],
    solucion: [1, 3, 0, 2, 4],
    opciones: ['2, 4, 1, 3, 5', '2, 1, 4, 3, 5', '4, 2, 1, 3, 5', '2, 4, 3, 1, 5'],
    correcta: 0,
    explicaciones: [
      'Correcto: célula, tejido, órgano, sistema y organismo.',
      'Las células forman primero tejidos; los tejidos forman órganos.',
      'La célula es el nivel más simple de los cinco.',
      'Los órganos forman sistemas, no al revés.',
    ],
  },
  {
    id: 'sim-cn-03', temaId: 'flujos-energia', leccionId: 'flujos-energia-1', formato: 'simple', dificultad: 1,
    usos: ['simulacro', 'practica'],
    enunciado: 'En la cadena pasto → conejo → zorro → águila, ¿qué nivel trófico ocupa el zorro?',
    opciones: ['Productor', 'Consumidor primario', 'Consumidor secundario', 'Descomponedor'],
    correcta: 2,
    explicaciones: [
      'El productor es el pasto, que hace fotosíntesis.',
      'El consumidor primario es el conejo, que come plantas.',
      'Correcto: el zorro come al consumidor primario.',
      'Los descomponedores (hongos y bacterias) no aparecen en esta cadena.',
    ],
  },
  {
    id: 'sim-cn-04', temaId: 'evolucion', formato: 'simple', dificultad: 2,
    usos: ['simulacro', 'practica'],
    enunciado: '¿Qué enunciado describe la selección natural?',
    opciones: [
      'Los organismos cambian a propósito para adaptarse',
      'Los individuos con características más favorables en su ambiente sobreviven y se reproducen más',
      'Los órganos que más se usan se heredan más desarrollados',
      'Todos los individuos de una especie dejan el mismo número de descendientes',
    ],
    correcta: 1,
    explicaciones: [
      'Los organismos no cambian a propósito: la variación existe antes y el ambiente selecciona.',
      'Correcto: es el principio de Darwin y Wallace.',
      'Esa es la idea de Lamarck (uso y desuso), que la evidencia no respalda.',
      'Justamente la diferencia en la reproducción es lo que produce la selección.',
    ],
  },
  {
    id: 'sim-cn-05', temaId: 'ambientes-interaccion', leccionId: 'ambientes-interaccion-1', formato: 'simple', dificultad: 1,
    usos: ['simulacro', 'practica'],
    enunciado: '¿Dónde se encuentra el páramo en Ecuador?',
    opciones: ['En la Costa, junto a los manglares', 'En los Andes, sobre los 3 000 m aproximadamente', 'En la Amazonía baja', 'En el litoral de Galápagos'],
    correcta: 1,
    explicaciones: [
      'Los manglares están en la Costa, a nivel del mar; el páramo es de altura.',
      'Correcto: el páramo es un ecosistema altoandino.',
      'La Amazonía baja tiene bosque húmedo tropical.',
      'El páramo es un ecosistema de los Andes, no de las islas.',
    ],
  },
  {
    id: 'sim-cn-06', temaId: 'patogenos', leccionId: 'patogenos-2', formato: 'simple', dificultad: 1,
    usos: ['simulacro', 'practica'],
    enunciado: '¿Por qué los antibióticos no sirven contra la gripe?',
    opciones: [
      'Porque la gripe la causa un virus, y los antibióticos atacan estructuras de las bacterias',
      'Porque el virus de la gripe es más grande que las bacterias',
      'Porque la gripe la causa un hongo',
      'Porque los antibióticos solo funcionan en niños',
    ],
    correcta: 0,
    explicaciones: [
      'Correcto: los virus no tienen pared, ribosomas propios ni metabolismo, que es donde actúan los antibióticos.',
      'Los virus son mucho más pequeños que las bacterias.',
      'La gripe la causa el virus influenza, no un hongo.',
      'Los antibióticos funcionan a cualquier edad, pero solo contra bacterias.',
    ],
  },
  {
    id: 'sim-cn-07', temaId: 'origen-universo', leccionId: 'origen-universo-1', formato: 'completamiento', dificultad: 1,
    usos: ['simulacro', 'practica'],
    enunciado: 'La teoría más aceptada sobre el origen del universo, que propone una gran expansión desde un estado muy caliente y denso, es la del ____.',
    opciones: ['Estado estacionario', 'Big Bang', 'Universo pulsante', 'Creacionismo'],
    correcta: 1,
    explicaciones: [
      'El estado estacionario propone un universo sin comienzo; fue descartado por la evidencia.',
      'Correcto: el Big Bang está respaldado por la radiación de fondo y la expansión del universo.',
      'El universo pulsante propone ciclos de expansión y contracción; no es la más aceptada.',
      'El creacionismo es una creencia, no una teoría científica.',
    ],
  },
  {
    id: 'sim-cn-08', temaId: 'cambios-geologicos', leccionId: 'cambios-geologicos-4', formato: 'simple', dificultad: 1,
    usos: ['simulacro', 'practica'],
    enunciado: 'En el ciclo de las rocas, una roca ígnea se forma cuando:',
    opciones: [
      'Se compactan sedimentos',
      'El magma o la lava se enfría y se solidifica',
      'Una roca cambia por presión y temperatura sin fundirse',
      'El viento erosiona una montaña',
    ],
    correcta: 1,
    explicaciones: [
      'Así se forman las rocas sedimentarias.',
      'Correcto: «ígnea» viene de fuego; nace del magma o la lava.',
      'Así se forman las rocas metamórficas.',
      'La erosión produce sedimentos; no forma rocas ígneas.',
    ],
  },
];

export const PREGUNTAS_CCNN: Pregunta[] = [...DIAGNOSTICO_Y_SIMULACRO, ...PREGUNTAS_ANATOMIA_CELULAR];
