import type {Cuatro, Formato, Pregunta, Seccion, Uso} from '../tipos';

// Conocimientos pedagógicos (ficha 4.1.1): las lecciones y preguntas de los 6 temas. Son 21 de las 99
// preguntas del examen y los rinden todas las especialidades. Lecciones cortas: solo lo que pide el subtema.
// Contenido escrito por el equipo a partir de los subtemas de la ficha: lo revisa el docente experto.

type TemaAbierto = {abierto: true; contenido: Record<number, Seccion[]>; minutos?: Record<number, number>};

export const LECCIONES_PEDAGOGICAS: Record<string, TemaAbierto> = {
  'teorias-aprendizaje': {
    abierto: true,
    minutos: {1: 8},
    contenido: {
      1: [
        {tipo: 'texto', texto: 'Las teorías del aprendizaje explican cómo aprende una persona y, por eso, cómo conviene enseñar. El Ineval pregunta por cuatro: conductismo, cognitivismo, constructivismo y conectivismo. Casi siempre te dará una situación de aula para que reconozcas cuál está detrás.'},
        {
          tipo: 'puntos',
          titulo: 'Las cuatro teorías',
          puntos: [
            'Conductismo: aprender es cambiar una conducta observable con estímulos, respuestas y refuerzos (Pavlov, Watson, Skinner). El docente dirige y premia o corrige.',
            'Cognitivismo: aprender es procesar, organizar y guardar información en la mente: atención, memoria y esquemas. Ausubel propuso el aprendizaje significativo: lo nuevo se ancla en lo que ya se sabe.',
            'Constructivismo: el estudiante construye su conocimiento a partir de sus saberes previos y su experiencia; el docente es mediador (Piaget). Vygotsky sumó la interacción social y la zona de desarrollo próximo.',
            'Conectivismo: en la era digital se aprende en redes de personas, fuentes y tecnologías; saber dónde encontrar la información también es aprender (Siemens, Downes).',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Reconoce la teoría',
          situacion: 'Antes de enseñar las fracciones, una docente pregunta cómo reparten una pizza en casa; luego los estudiantes, en grupos, descubren la regla con material concreto y ella los guía con preguntas.',
          explicacion: 'Es constructivismo: parte de los saberes previos, el estudiante construye el concepto y la docente media. Si solo hubiera dado una carita feliz por cada respuesta correcta, sería conductismo.',
        },
        {tipo: 'clave', texto: 'Palabras que delatan la teoría: refuerzo, premio o estímulo, conductismo; memoria, procesar o esquemas, cognitivismo; saberes previos, construir o mediador, constructivismo; redes, nodos o conexiones digitales, conectivismo.'},
      ],
    },
  },

  dua: {
    abierto: true,
    minutos: {1: 7},
    contenido: {
      1: [
        {tipo: 'texto', texto: 'El Diseño Universal para el Aprendizaje (DUA) busca que todos los estudiantes puedan aprender, porque la clase se planifica desde el inicio con opciones que quitan barreras, en lugar de adaptarla después para unos pocos. La versión 2.0 tiene tres principios.'},
        {
          tipo: 'puntos',
          titulo: 'Los tres principios',
          puntos: [
            'Representación: es el «qué» del aprendizaje. Presentar la información de varias formas (texto, imagen, audio, ejemplos), según las pautas de percepción, lenguaje y comprensión.',
            'Acción y expresión: es el «cómo». Dar varias formas de mostrar lo aprendido (escribir, exponer, dibujar, construir) y apoyar la planificación (funciones ejecutivas).',
            'Implicación: es el «por qué». Varias formas de despertar el interés, mantener el esfuerzo y ayudar a autorregularse.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Una clase con los tres principios',
          situacion: 'Una docente explica los planetas con un video subtitulado, una maqueta y una lectura. Cada estudiante elige si presenta un dibujo, una exposición o un escrito, y la clase empieza con una pregunta sobre el cielo que ven desde su barrio.',
          explicacion: 'Video, maqueta y lectura son representación; elegir cómo presentar es acción y expresión; la pregunta que conecta con su vida es implicación.',
        },
        {tipo: 'clave', texto: 'Los principios se relacionan con tres redes cerebrales: representación, con las de reconocimiento; acción y expresión, con las estratégicas; implicación, con las afectivas.'},
      ],
    },
  },

  'planificacion-curricular': {
    abierto: true,
    minutos: {1: 7},
    contenido: {
      1: [
        {tipo: 'texto', texto: 'Planificar es decidir con anticipación qué se quiere lograr y cómo. La ficha pide reconocer cuatro elementos de la planificación curricular y para qué sirve cada uno.'},
        {
          tipo: 'puntos',
          titulo: 'Los cuatro elementos',
          puntos: [
            'Objetivo: responde «¿para qué enseño?». Dice con claridad lo que el estudiante logrará y debe poder verificarse.',
            'Contenido: responde «¿qué enseño?». Son los conocimientos, destrezas y actitudes que se trabajan.',
            'Metodología: responde «¿cómo enseño?». Son las estrategias, actividades y recursos.',
            'Evaluación: responde «¿cómo sé que lo lograron?». Son los criterios, indicadores e instrumentos.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Encuentra los elementos',
          situacion: 'En una planificación se lee: «Que los estudiantes calculen el perímetro de figuras planas», «El perímetro de triángulos y cuadriláteros», «Medir en grupos el contorno de objetos del aula» y «Lista de cotejo durante la actividad».',
          explicacion: 'En ese orden son el objetivo, el contenido, la metodología y la evaluación. Los cuatro deben ser coherentes entre sí: se evalúa lo que dice el objetivo.',
        },
        {tipo: 'aula', texto: 'En Ecuador el currículo tiene tres niveles de concreción: macro, el currículo nacional del Ministerio; meso, el Proyecto Curricular Institucional (PCI); y micro, la planificación que hace cada docente para su aula.'},
      ],
    },
  },

  'evaluacion-educativa': {
    abierto: true,
    minutos: {1: 6, 2: 8},
    contenido: {
      1: [
        {tipo: 'texto', texto: 'Según su propósito, la evaluación puede ser diagnóstica, formativa o sumativa. Para reconocerla, pregúntate cuándo se hace y para qué sirve.'},
        {
          tipo: 'puntos',
          titulo: 'Los tres tipos',
          puntos: [
            'Diagnóstica: al inicio. Sirve para conocer los saberes previos y planificar; no es para poner nota.',
            'Formativa: durante el proceso. Sirve para retroalimentar al estudiante y ajustar la enseñanza a tiempo.',
            'Sumativa: al final de una unidad o periodo. Sirve para certificar lo logrado y asignar una calificación.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Durante la clase',
          situacion: 'Mientras sus estudiantes resuelven ejercicios, un docente recorre los grupos, nota que varios confunden área y perímetro y vuelve a explicar antes de seguir.',
          explicacion: 'Es evaluación formativa: ocurre durante el proceso y sirve para ajustar la enseñanza, no para poner una nota.',
        },
        {tipo: 'clave', texto: 'Antes y para conocer, diagnóstica; durante y para mejorar, formativa; al final y para certificar, sumativa.'},
      ],
      2: [
        {tipo: 'texto', texto: 'Los instrumentos son las herramientas con las que se recoge la información de la evaluación. La ficha pide cinco: lista de cotejo, rúbrica, diario de reflexión, diana de aprendizaje y portafolio.'},
        {
          tipo: 'puntos',
          titulo: 'Los cinco instrumentos',
          puntos: [
            'Lista de cotejo: una lista de indicadores que se marcan como presentes o ausentes (sí o no).',
            'Rúbrica: una tabla con criterios y niveles de desempeño descritos, por ejemplo de «excelente» a «en proceso».',
            'Diario de reflexión: el estudiante escribe seguido qué aprendió, cómo y qué le costó. Favorece la metacognición.',
            'Diana de aprendizaje: un gráfico circular, como un tiro al blanco, con un sector por criterio; el estudiante marca su nivel en cada uno.',
            'Portafolio: una colección organizada de trabajos del estudiante que muestra su progreso en el tiempo.',
          ],
        },
        {
          tipo: 'comparacion',
          titulo: 'Las dos que más se confunden',
          columnas: ['Lista de cotejo', 'Rúbrica'],
          filas: [
            {aspecto: 'Qué registra', a: 'Si el indicador está o no está', b: 'En qué nivel está cada criterio'},
            {aspecto: 'Ejemplo', a: '«Usa mayúscula al iniciar»: sí o no', b: '«Ortografía»: excelente, bueno, en proceso o inicial'},
          ],
        },
        {tipo: 'clave', texto: 'Si las opciones son solo «sí» o «no», es una lista de cotejo. Si hay niveles descritos, es una rúbrica.'},
      ],
    },
  },

  metodologias: {
    abierto: true,
    minutos: {1: 8},
    contenido: {
      1: [
        {tipo: 'texto', texto: 'Las metodologías activas ponen al estudiante en el centro: hace, investiga y crea. La ficha pide reconocer cinco y saber cuándo aplicarlas.'},
        {
          tipo: 'puntos',
          titulo: 'Las cinco metodologías',
          puntos: [
            'Proyectos: los estudiantes trabajan varias semanas en un reto real y terminan con un producto final que presentan.',
            'Problemas: se parte de un problema abierto; los estudiantes investigan y proponen una solución argumentada.',
            'STEAM+H: integra ciencia, tecnología, ingeniería, arte, matemática y humanidades para resolver un reto.',
            'Gamificación: usa elementos del juego (puntos, niveles, insignias, retos) en una tarea que no es un juego, para motivar.',
            'Aula invertida: el estudiante revisa la teoría en casa (video o lectura) y la clase se usa para practicar y resolver dudas.',
          ],
        },
        {
          tipo: 'comparacion',
          titulo: 'Proyectos frente a problemas',
          columnas: ['Basado en proyectos', 'Basado en problemas'],
          filas: [
            {aspecto: 'Punto de partida', a: 'Un reto o una pregunta para crear algo', b: 'Un problema para analizar y resolver'},
            {aspecto: 'Resultado', a: 'Un producto final que se presenta', b: 'Una solución argumentada'},
          ],
        },
        {tipo: 'clave', texto: 'Gamificar no es jugar en clase: es usar puntos, niveles o insignias para motivar una tarea que no es un juego.'},
      ],
    },
  },

  tecnicas: {
    abierto: true,
    minutos: {1: 8},
    contenido: {
      1: [
        {tipo: 'texto', texto: 'Las técnicas son procedimientos concretos para una parte de la clase. La ficha nombra once; agruparlas te ayuda a recordarlas.'},
        {
          tipo: 'puntos',
          titulo: 'Para dialogar y argumentar',
          puntos: [
            'Debate: dos posturas contrarias argumentan sobre un tema, con un moderador.',
            'Mesa redonda: varios expertos con puntos de vista distintos exponen por turnos, con un moderador.',
            'Panel de discusión: varios expertos conversan entre sí sobre los aspectos de un tema ante un público.',
            'Foro: todo el grupo opina y pregunta libremente sobre un tema, con un moderador que da la palabra.',
            'Lluvia de ideas: el grupo dice todas sus ideas sin juzgarlas y luego las selecciona.',
          ],
        },
        {
          tipo: 'puntos',
          titulo: 'Para organizar y producir',
          puntos: [
            'Exposición oral: una persona presenta un tema de forma ordenada ante otros.',
            'Organizadores gráficos: muestran ideas y sus relaciones (mapa conceptual, cuadro sinóptico, diagrama de Venn).',
            'Resumen: reduce un texto a sus ideas principales, con palabras propias y sin opiniones.',
            'Ensayo: el autor defiende una postura propia con argumentos (introducción, desarrollo y conclusión).',
            'Línea de tiempo: ordena los hechos en secuencia cronológica.',
            'Juego de roles: los estudiantes representan personajes o situaciones para comprender otros puntos de vista.',
          ],
        },
        {tipo: 'clave', texto: 'Las que más se confunden: en la mesa redonda los expertos exponen por turnos; en el panel conversan entre sí; en el debate se enfrentan dos posturas.'},
      ],
    },
  },
};

// ───────────── Preguntas: 10 por tema (3 de «¿Ya lo sabes?» y 7 de práctica), todas para la prueba ─────────────

const D: Uso[] = ['diagnostico-tema', 'prueba'];
const PP: Uso[] = ['practica', 'prueba'];
type Extra = {formato?: Formato; elementos?: Pregunta['elementos']; solucion?: number[]};

const q = (
  id: string,
  leccionId: string,
  usos: Uso[],
  enunciado: string,
  opciones: Cuatro<string>,
  correcta: 0 | 1 | 2 | 3,
  explicaciones: Cuatro<string>,
  extra: Extra = {}
): Pregunta => ({
  id,
  temaId: leccionId.replace(/-\d+$/, ''),
  leccionId,
  formato: extra.formato ?? 'simple',
  dificultad: extra.formato && extra.formato !== 'simple' ? 2 : 1,
  usos: [...usos],
  enunciado,
  opciones,
  correcta,
  explicaciones,
  ...(extra.elementos ? {elementos: extra.elementos} : {}),
  ...(extra.solucion ? {solucion: extra.solucion} : {}),
});

const TA = 'teorias-aprendizaje-1';
const DU = 'dua-1';
const PC = 'planificacion-curricular-1';
const EV1 = 'evaluacion-educativa-1';
const EV2 = 'evaluacion-educativa-2';
const ME = 'metodologias-1';
const TE = 'tecnicas-1';

export const PREGUNTAS_PEDAGOGICAS: Pregunta[] = [
  // ── Teorías del aprendizaje
  q('pd-ta-01', TA, D, 'Un docente da una estrella a cada estudiante que entrega la tarea a tiempo, para que repita esa conducta. ¿Qué teoría aplica?', ['Conductismo', 'Cognitivismo', 'Constructivismo', 'Conectivismo'], 0, [
    'Correcto: premiar para que una conducta se repita es un refuerzo, idea central del conductismo.',
    'El cognitivismo se ocupa de cómo se procesa y organiza la información en la mente.',
    'El constructivismo parte de los saberes previos para que el estudiante construya el conocimiento.',
    'El conectivismo trata del aprendizaje en redes digitales.',
  ]),
  q('pd-ta-02', TA, D, 'Según el constructivismo, ¿cuál es el papel del docente?', ['Mediador que parte de los saberes previos del estudiante', 'Transmisor que entrega el conocimiento ya elaborado', 'Controlador que premia y castiga las respuestas', 'Evaluador que solo mide el resultado final'], 0, [
    'Correcto: el docente media y el estudiante construye su conocimiento.',
    'Transmitir el conocimiento listo es propio de la enseñanza tradicional.',
    'Premiar y castigar es propio del conductismo.',
    'El constructivismo valora el proceso, no solo el resultado.',
  ]),
  q('pd-ta-03', TA, D, 'La teoría que explica el aprendizaje en la era digital como la capacidad de crear conexiones entre personas, fuentes y redes es el ____.', ['conectivismo', 'conductismo', 'cognitivismo', 'constructivismo'], 0, [
    'Correcto: el conectivismo (Siemens) entiende el aprendizaje como redes de conexiones.',
    'El conductismo se basa en estímulos, respuestas y refuerzos.',
    'El cognitivismo estudia los procesos mentales, como la memoria.',
    'El constructivismo se centra en la construcción personal y social del conocimiento.',
  ], {formato: 'completamiento'}),
  q('pd-ta-04', TA, PP, 'Ausubel propuso que se aprende de verdad cuando lo nuevo se relaciona con lo que el estudiante ya sabe. ¿Cómo se llama ese aprendizaje?', ['Aprendizaje significativo', 'Aprendizaje por refuerzo', 'Aprendizaje memorístico', 'Aprendizaje en red'], 0, [
    'Correcto: es el aprendizaje significativo de Ausubel.',
    'El refuerzo es una idea del conductismo.',
    'El memorístico es justo lo contrario: repetir sin relacionar.',
    'El aprendizaje en red es una idea del conectivismo.',
  ]),
  q('pd-ta-05', TA, PP, 'Vygotsky llamó «zona de desarrollo próximo» a…', ['La distancia entre lo que el estudiante hace solo y lo que logra con ayuda', 'El espacio físico donde se aprende', 'Lo que el estudiante ya domina sin ayuda', 'La edad en que se aprende a leer'], 0, [
    'Correcto: es el espacio donde la ayuda del docente o de un compañero permite avanzar.',
    'No es un lugar físico.',
    'Lo que ya domina solo es su nivel de desarrollo real, no la zona próxima.',
    'No es una edad ni una etapa.',
  ]),
  q('pd-ta-06', TA, PP, 'Relaciona cada teoría con uno de sus autores.', ['1c, 2d, 3b, 4a', '1c, 2b, 3d, 4a', '1d, 2c, 3b, 4a', '1c, 2d, 3a, 4b'], 0, [
    'Correcto: Skinner, Ausubel, Vygotsky y Siemens.',
    'Vygotsky es del constructivismo social y Ausubel del aprendizaje significativo: están cruzados.',
    'Skinner es conductista; Ausubel, cognitivista.',
    'Siemens es el autor del conectivismo, no del constructivismo social.',
  ], {formato: 'emparejamiento', elementos: {izquierda: ['Conductismo', 'Cognitivismo (aprendizaje significativo)', 'Constructivismo social', 'Conectivismo'], derecha: ['George Siemens', 'Lev Vygotsky', 'B. F. Skinner', 'David Ausubel']}, solucion: [2, 3, 1, 0]}),
  q('pd-ta-07', TA, PP, 'Un docente enseña a hacer mapas mentales y técnicas de memoria para que sus estudiantes organicen y recuerden la información. ¿Qué teoría está detrás?', ['Cognitivismo', 'Conductismo', 'Conectivismo', 'Constructivismo social'], 0, [
    'Correcto: organizar y guardar información en la mente es el foco del cognitivismo.',
    'El conductismo no se ocupa de los procesos internos, sino de la conducta observable.',
    'El conectivismo se centra en las redes, no en la memoria individual.',
    'El constructivismo social se centra en la interacción con otros.',
  ]),
  q('pd-ta-08', TA, PP, 'Los estudiantes investigan en foros, siguen a expertos en línea y comparten lo que encuentran en una red de la clase. ¿Qué teoría lo explica mejor?', ['Conectivismo', 'Conductismo', 'Cognitivismo', 'Constructivismo'], 0, [
    'Correcto: aprender en redes de personas y fuentes digitales es conectivismo.',
    'No hay estímulos ni refuerzos: no es conductismo.',
    'No se centra en los procesos de la memoria individual.',
    'Construyen conocimiento, pero lo distintivo aquí son las redes digitales.',
  ]),
  q('pd-ta-09', TA, PP, '¿Cuáles son características del constructivismo?', ['1, 3 y 5', '2 y 4', '1, 2 y 3', '3, 4 y 5'], 0, [
    'Correcto: el estudiante construye, se parte de los saberes previos y la interacción ayuda a aprender.',
    'Premios y castigos son del conductismo, y un docente dueño del saber es la enseñanza tradicional.',
    'Aprender con premios y castigos es conductismo.',
    'En el constructivismo el docente no es el único que tiene el conocimiento.',
  ], {formato: 'seleccion', elementos: ['El estudiante construye activamente su conocimiento', 'Se aprende con premios y castigos', 'Se parte de los saberes previos', 'El docente es el único que tiene el conocimiento', 'La interacción con otros ayuda a aprender'], solucion: [0, 2, 4]}),
  q('pd-ta-10', TA, PP, 'En el conductismo, ¿qué es un refuerzo?', ['Una consecuencia que aumenta la probabilidad de que una conducta se repita', 'Una clase de recuperación', 'La conexión entre una idea nueva y una previa', 'Un nodo de la red de aprendizaje'], 0, [
    'Correcto: el refuerzo hace más probable que la conducta se repita.',
    'No es una clase de recuperación.',
    'Relacionar ideas nuevas y previas es el aprendizaje significativo.',
    'Los nodos son del conectivismo.',
  ]),

  // ── Diseño Universal para el Aprendizaje
  q('pd-du-01', DU, D, 'Una docente presenta el tema con un video subtitulado, una infografía y una lectura. ¿Qué principio del DUA aplica?', ['Representación', 'Acción y expresión', 'Implicación', 'Evaluación'], 0, [
    'Correcto: presentar la información de varias formas es el principio de representación.',
    'Acción y expresión es dar varias formas de mostrar lo aprendido.',
    'Implicación es despertar y mantener el interés.',
    'La evaluación no es un principio del DUA.',
  ]),
  q('pd-du-02', DU, D, 'Para mostrar lo que aprendieron, los estudiantes eligen entre grabar un audio, hacer un cartel o escribir un informe. ¿Qué principio aplica?', ['Acción y expresión', 'Representación', 'Implicación', 'Adaptación curricular'], 0, [
    'Correcto: dar varias formas de expresar lo aprendido es acción y expresión.',
    'Representación es cómo se presenta la información, no cómo responde el estudiante.',
    'Elegir puede motivar, pero lo central aquí es la forma de expresar lo aprendido.',
    'El DUA se planifica para todos desde el inicio; no es una adaptación individual.',
  ]),
  q('pd-du-03', DU, D, 'Un docente deja que los estudiantes elijan el tema de su proyecto y conecta la clase con problemas de su comunidad para mantener su interés. ¿Qué principio aplica?', ['Implicación', 'Representación', 'Acción y expresión', 'Percepción'], 0, [
    'Correcto: despertar y mantener el interés es el principio de implicación.',
    'No cambia cómo se presenta la información.',
    'No se trata de cómo expresan lo aprendido.',
    'La percepción es una pauta del principio de representación.',
  ]),
  q('pd-du-04', DU, PP, '¿Cuál es el propósito del Diseño Universal para el Aprendizaje?', [
    'Planificar desde el inicio para que todos puedan aprender, quitando barreras',
    'Adaptar la clase solo para estudiantes con discapacidad, después de planificarla',
    'Usar la misma actividad para todos los estudiantes',
    'Reemplazar el currículo nacional',
  ], 0, [
    'Correcto: el DUA se planifica para todos desde el inicio.',
    'El DUA no espera a adaptar después ni es solo para algunos.',
    'Es lo contrario: ofrece varias opciones.',
    'El DUA se aplica dentro del currículo; no lo reemplaza.',
  ]),
  q('pd-du-05', DU, PP, 'Relaciona cada principio del DUA con lo que responde.', ['1b, 2c, 3a', '1a, 2c, 3b', '1c, 2b, 3a', '1b, 2a, 3c'], 0, [
    'Correcto: representación, el «qué»; acción y expresión, el «cómo»; implicación, el «por qué».',
    'La representación es el «qué», no el «por qué».',
    'La representación presenta la información; la expresión de lo aprendido es acción y expresión.',
    'Acción y expresión es el «cómo»; la motivación es implicación.',
  ], {formato: 'emparejamiento', elementos: {izquierda: ['Representación', 'Acción y expresión', 'Implicación'], derecha: ['El «por qué»: el interés y la motivación', 'El «qué»: cómo se presenta la información', 'El «cómo»: cómo se expresa lo aprendido']}, solucion: [1, 2, 0]}),
  q('pd-du-06', DU, PP, 'El principio de implicación del DUA se relaciona con las redes ____ del cerebro.', ['afectivas', 'de reconocimiento', 'estratégicas', 'motoras'], 0, [
    'Correcto: la implicación tiene que ver con las emociones y la motivación.',
    'Las de reconocimiento se relacionan con la representación.',
    'Las estratégicas se relacionan con acción y expresión.',
    'El DUA no habla de redes motoras.',
  ], {formato: 'completamiento'}),
  q('pd-du-07', DU, PP, 'Un estudiante con baja visión recibe el texto en letra grande y en audio. ¿Qué principio se atiende?', ['Representación', 'Implicación', 'Acción y expresión', 'Autorregulación'], 0, [
    'Correcto: se ofrecen otras formas de percibir la información.',
    'No se busca despertar el interés.',
    'No cambia cómo el estudiante responde.',
    'La autorregulación es una pauta de la implicación.',
  ]),
  q('pd-du-08', DU, PP, 'Dar listas de control y metas por etapas para que el estudiante planifique su trabajo corresponde a…', ['Acción y expresión (funciones ejecutivas)', 'Representación (percepción)', 'Implicación (captar el interés)', 'Una adaptación curricular individual'], 0, [
    'Correcto: apoyar la planificación y las metas son las funciones ejecutivas, dentro de acción y expresión.',
    'La percepción trata de cómo se recibe la información.',
    'Captar el interés es despertar la curiosidad, no organizar el trabajo.',
    'En el DUA estos apoyos se planifican para todos.',
  ]),
  q('pd-du-09', DU, PP, '¿Cuáles acciones aplican el principio de representación?', ['2, 4 y 5', '1 y 3', '1, 2 y 4', '3, 4 y 5'], 0, [
    'Correcto: subtítulos, gráficos con ejemplos y glosario son formas de presentar la información.',
    'Elegir cómo presentar es acción y expresión, y trabajar solo o en grupo es implicación.',
    'Elegir cómo presentar la tarea es acción y expresión.',
    'Las opciones para trabajar solo o en grupo son de implicación.',
  ], {formato: 'seleccion', elementos: ['Dejar elegir cómo presentar la tarea', 'Usar subtítulos en los videos', 'Dar opciones para trabajar solo o en grupo', 'Explicar con gráficos y ejemplos concretos', 'Ofrecer un glosario de los términos nuevos'], solucion: [1, 3, 4]}),
  q('pd-du-10', DU, PP, '¿Cuántos principios tiene el DUA 2.0?', ['Tres', 'Dos', 'Cuatro', 'Cinco'], 0, [
    'Correcto: representación, acción y expresión, e implicación.',
    'Son tres, no dos.',
    'Son tres; no hay un cuarto principio.',
    'Son tres principios.',
  ]),

  // ── Planificación curricular
  q('pd-pc-01', PC, D, 'En la planificación, ¿qué elemento responde a la pregunta «¿para qué enseño?»?', ['El objetivo', 'El contenido', 'La metodología', 'La evaluación'], 0, [
    'Correcto: el objetivo dice lo que el estudiante logrará.',
    'El contenido responde «¿qué enseño?».',
    'La metodología responde «¿cómo enseño?».',
    'La evaluación responde «¿cómo sé que lo lograron?».',
  ]),
  q('pd-pc-02', PC, D, 'Las estrategias, las actividades y los recursos con los que se enseña forman parte de la ____.', ['metodología', 'evaluación', 'objetivo', 'contenido'], 0, [
    'Correcto: la metodología es el «cómo» de la enseñanza.',
    'La evaluación verifica lo aprendido.',
    'El objetivo es la meta, no el camino.',
    'El contenido es lo que se enseña, no cómo.',
  ], {formato: 'completamiento'}),
  q('pd-pc-03', PC, D, 'Una docente decide que verificará el aprendizaje con una rúbrica y criterios de desempeño. ¿Qué elemento de la planificación está definiendo?', ['La evaluación', 'El objetivo', 'La metodología', 'El contenido'], 0, [
    'Correcto: criterios e instrumentos son parte de la evaluación.',
    'El objetivo es lo que se quiere lograr.',
    'La metodología son las actividades y estrategias.',
    'El contenido es lo que se enseña.',
  ]),
  q('pd-pc-04', PC, PP, 'Relaciona cada elemento de la planificación con la pregunta que responde.', ['1d, 2b, 3a, 4c', '1b, 2d, 3a, 4c', '1d, 2b, 3c, 4a', '1a, 2b, 3d, 4c'], 0, [
    'Correcto: objetivo, ¿para qué?; contenido, ¿qué?; metodología, ¿cómo?; evaluación, ¿cómo sé que lo lograron?',
    'El objetivo es el «para qué» y el contenido el «qué»: están cruzados.',
    'La metodología es el «cómo enseño» y la evaluación el «cómo sé»: están cruzadas.',
    'El objetivo no responde «¿cómo enseño?»: eso es la metodología.',
  ], {formato: 'emparejamiento', elementos: {izquierda: ['Objetivo', 'Contenido', 'Metodología', 'Evaluación'], derecha: ['¿Cómo enseño?', '¿Qué enseño?', '¿Cómo sé que lo aprendieron?', '¿Para qué enseño?']}, solucion: [3, 1, 0, 2]}),
  q('pd-pc-05', PC, PP, '«Que los estudiantes expliquen el ciclo del agua». ¿Qué elemento de la planificación es?', ['Un objetivo', 'Un contenido', 'Una metodología', 'Un instrumento de evaluación'], 0, [
    'Correcto: dice lo que el estudiante logrará.',
    'El contenido sería «el ciclo del agua», sin la acción del estudiante.',
    'No dice cómo se enseñará.',
    'No es una herramienta para recoger información.',
  ]),
  q('pd-pc-06', PC, PP, '«El ciclo del agua: evaporación, condensación y precipitación». ¿Qué elemento de la planificación es?', ['Un contenido', 'Un objetivo', 'Una metodología', 'Un criterio de evaluación'], 0, [
    'Correcto: es lo que se enseña.',
    'Un objetivo diría lo que el estudiante logrará.',
    'No dice cómo se enseñará.',
    'No dice qué se valorará.',
  ]),
  q('pd-pc-07', PC, PP, '¿Qué debe tener un buen objetivo de aprendizaje?', ['Decir con claridad lo que el estudiante logrará, de forma que se pueda verificar', 'Describir lo que hará el docente', 'Enumerar los materiales de la clase', 'Ser general, sin poder medirse'], 0, [
    'Correcto: se centra en el estudiante y se puede verificar.',
    'El objetivo habla de lo que logra el estudiante, no de lo que hace el docente.',
    'Los materiales son parte de la metodología.',
    'Un objetivo que no se puede verificar no sirve para evaluar.',
  ]),
  q('pd-pc-08', PC, PP, 'En Ecuador, la planificación que hace el docente para su aula corresponde al nivel de concreción…', ['Micro', 'Macro', 'Meso', 'Nacional'], 0, [
    'Correcto: el nivel micro es la planificación del docente.',
    'El nivel macro es el currículo nacional del Ministerio.',
    'El nivel meso es el Proyecto Curricular Institucional (PCI).',
    'Lo nacional corresponde al nivel macro.',
  ]),
  q('pd-pc-09', PC, PP, 'Ordena los niveles de concreción curricular de lo más general a lo más específico.', ['2, 3, 1', '1, 3, 2', '3, 2, 1', '2, 1, 3'], 0, [
    'Correcto: currículo nacional, PCI y planificación de aula.',
    'Está al revés: lo más general es el currículo nacional.',
    'El PCI se hace a partir del currículo nacional, no antes.',
    'La planificación de aula es lo más específico: va al final.',
  ], {formato: 'ordenamiento', elementos: ['Planificación de aula del docente', 'Currículo nacional del Ministerio', 'Proyecto Curricular Institucional (PCI)'], solucion: [1, 2, 0]}),
  q('pd-pc-10', PC, PP, 'Una planificación tiene objetivo, contenido y actividades, pero no dice cómo se verificará el aprendizaje. ¿Qué elemento le falta?', ['La evaluación', 'La metodología', 'El objetivo', 'El contenido'], 0, [
    'Correcto: verificar el aprendizaje es la evaluación.',
    'Las actividades ya son la metodología.',
    'El objetivo ya está.',
    'El contenido ya está.',
  ]),

  // ── Evaluación educativa: tipos
  q('pd-ev-01', EV1, D, 'Al iniciar el año, un docente aplica una prueba sin nota para saber qué recuerdan sus estudiantes. ¿Qué tipo de evaluación es?', ['Diagnóstica', 'Formativa', 'Sumativa', 'Coevaluación'], 0, [
    'Correcto: se hace al inicio para conocer los saberes previos.',
    'La formativa ocurre durante el proceso.',
    'La sumativa es al final y da una nota.',
    'La coevaluación es entre compañeros; aquí evalúa el docente.',
  ]),
  q('pd-ev-02', EV1, D, '¿Cuál es el propósito principal de la evaluación formativa?', ['Retroalimentar y ajustar la enseñanza durante el proceso', 'Asignar la nota final del periodo', 'Conocer los saberes previos antes de empezar', 'Comparar la escuela con otras'], 0, [
    'Correcto: es evaluación para aprender, durante el proceso.',
    'Eso es propio de la sumativa.',
    'Eso es propio de la diagnóstica.',
    'Eso no es un tipo de evaluación del aula.',
  ]),
  q('pd-ev-03', EV1, PP, 'La prueba al final de una unidad, que certifica lo aprendido y da una calificación, es una evaluación…', ['sumativa', 'diagnóstica', 'formativa', 'inicial'], 0, [
    'Correcto: al final y para certificar, sumativa.',
    'La diagnóstica es al inicio.',
    'La formativa ocurre durante el proceso y no busca certificar.',
    'La inicial es otro nombre de la diagnóstica.',
  ]),
  q('pd-ev-04', EV1, PP, 'Relaciona cada momento con el tipo de evaluación.', ['1b, 2c, 3a', '1a, 2c, 3b', '1c, 2b, 3a', '1b, 2a, 3c'], 0, [
    'Correcto: antes, diagnóstica; durante, formativa; al cerrar, sumativa.',
    'Antes de empezar no se certifica: es diagnóstica.',
    'Antes de empezar es diagnóstica; durante el proceso, formativa.',
    'Durante el proceso es formativa, no sumativa.',
  ], {formato: 'emparejamiento', elementos: {izquierda: ['Antes de empezar una unidad', 'Durante el proceso', 'Al cerrar la unidad'], derecha: ['Sumativa', 'Diagnóstica', 'Formativa']}, solucion: [1, 2, 0]}),
  q('pd-ev-05', EV1, PP, 'Durante una práctica, la docente recorre los grupos, detecta un error común y vuelve a explicar antes de seguir. ¿Qué tipo de evaluación realiza?', ['Formativa', 'Sumativa', 'Diagnóstica', 'Heteroevaluación final'], 0, [
    'Correcto: ocurre durante el proceso y ajusta la enseñanza.',
    'No es al final ni pone una nota.',
    'No es al inicio para conocer saberes previos.',
    'No es un cierre: es durante el proceso.',
  ]),
  q('pd-ev-06', EV1, PP, 'La evaluación ____ se hace al inicio para conocer los saberes previos y planificar.', ['diagnóstica', 'formativa', 'sumativa', 'final'], 0, [
    'Correcto: es la que abre el proceso.',
    'La formativa ocurre durante el proceso.',
    'La sumativa se hace al final.',
    'Lo final es lo contrario de lo inicial.',
  ], {formato: 'completamiento'}),

  // ── Evaluación educativa: instrumentos
  q('pd-ev-07', EV2, D, 'Un instrumento con criterios y niveles de desempeño descritos (excelente, bueno, en proceso) es una…', ['rúbrica', 'lista de cotejo', 'diana de aprendizaje', 'línea de tiempo'], 0, [
    'Correcto: la rúbrica describe niveles para cada criterio.',
    'La lista de cotejo solo marca si algo está o no está.',
    'La diana es un gráfico circular para autoevaluarse.',
    'La línea de tiempo no es un instrumento de evaluación.',
  ]),
  q('pd-ev-08', EV2, PP, 'Un instrumento que registra si cada indicador está presente o ausente («sí» o «no») es…', ['una lista de cotejo', 'una rúbrica', 'un diario de reflexión', 'un portafolio'], 0, [
    'Correcto: la lista de cotejo es de sí o no.',
    'La rúbrica tiene niveles descritos, no solo sí o no.',
    'El diario es un escrito del estudiante.',
    'El portafolio es una colección de trabajos.',
  ]),
  q('pd-ev-09', EV2, PP, 'Relaciona cada instrumento con su descripción.', ['1c, 2a, 3b', '1a, 2c, 3b', '1c, 2b, 3a', '1b, 2a, 3c'], 0, [
    'Correcto: portafolio, colección de trabajos; diario, escritos sobre lo aprendido; diana, gráfico por sectores.',
    'El portafolio reúne trabajos; los escritos sobre lo aprendido son el diario.',
    'El diario son escritos del estudiante; el gráfico por sectores es la diana.',
    'El portafolio no es un gráfico circular.',
  ], {formato: 'emparejamiento', elementos: {izquierda: ['Portafolio', 'Diario de reflexión', 'Diana de aprendizaje'], derecha: ['Escritos frecuentes del estudiante sobre qué aprendió y cómo', 'Gráfico circular por sectores donde se marca el nivel en cada criterio', 'Colección de trabajos que muestra el progreso en el tiempo']}, solucion: [2, 0, 1]}),
  q('pd-ev-10', EV2, PP, '¿Qué instrumento favorece más la metacognición, porque el estudiante escribe qué aprendió y qué le costó?', ['El diario de reflexión', 'La lista de cotejo', 'La rúbrica', 'La prueba objetiva'], 0, [
    'Correcto: reflexionar por escrito sobre el propio aprendizaje es metacognición.',
    'La lista de cotejo la llena quien observa, con sí o no.',
    'La rúbrica valora niveles, pero no pide reflexionar por escrito.',
    'La prueba objetiva mide respuestas, no la reflexión.',
  ]),
  q('pd-ev-11', EV2, PP, 'Para ver de un vistazo cómo se autoevalúa todo el grupo en cinco criterios, ¿qué instrumento conviene?', ['La diana de aprendizaje', 'El portafolio', 'El ensayo', 'El diario de reflexión'], 0, [
    'Correcto: cada criterio es un sector y las marcas del grupo se ven juntas.',
    'El portafolio muestra el progreso de cada estudiante, no la foto del grupo.',
    'El ensayo es un texto, no un instrumento de autoevaluación grupal.',
    'El diario es individual y escrito.',
  ]),
  q('pd-ev-12', EV2, PP, '¿Qué instrumento muestra mejor el progreso de un estudiante a lo largo del año?', ['El portafolio', 'La lista de cotejo', 'La diana de aprendizaje', 'La lluvia de ideas'], 0, [
    'Correcto: reúne sus trabajos en el tiempo y deja ver cómo avanza.',
    'La lista de cotejo registra un momento puntual.',
    'La diana muestra un momento, no la evolución.',
    'La lluvia de ideas es una técnica, no un instrumento de evaluación.',
  ]),

  // ── Metodologías
  q('pd-me-01', ME, D, 'Los estudiantes ven en casa un video sobre las fracciones y en clase resuelven ejercicios en grupo con la ayuda del docente. ¿Qué metodología es?', ['Aula invertida', 'Gamificación', 'Aprendizaje basado en proyectos', 'STEAM+H'], 0, [
    'Correcto: la teoría en casa y la práctica en clase es aula invertida.',
    'No hay puntos, niveles ni insignias.',
    'No hay un reto largo con un producto final.',
    'No integra varias disciplinas en un reto.',
  ]),
  q('pd-me-02', ME, D, 'Un docente da puntos, insignias y niveles por las tareas cumplidas para motivar a sus estudiantes. ¿Qué metodología aplica?', ['Gamificación', 'Aula invertida', 'Aprendizaje basado en problemas', 'Juego de roles'], 0, [
    'Correcto: usar mecánicas del juego en una tarea que no es un juego es gamificación.',
    'El aula invertida cambia dónde se ve la teoría.',
    'El aprendizaje basado en problemas parte de un problema real.',
    'El juego de roles es representar personajes.',
  ]),
  q('pd-me-03', ME, D, 'Durante seis semanas, el grado diseña y construye un huerto escolar, y al final lo presenta a la comunidad. ¿Qué metodología es?', ['Aprendizaje basado en proyectos', 'Aprendizaje basado en problemas', 'Aula invertida', 'Gamificación'], 0, [
    'Correcto: un reto largo con un producto final que se presenta.',
    'En el basado en problemas se busca una solución argumentada, no un producto que se construye.',
    'No se trata de ver la teoría en casa.',
    'No hay puntos ni niveles.',
  ]),
  q('pd-me-04', ME, PP, '¿Qué significa la «H» de STEAM+H?', ['Humanidades', 'Historia', 'Habilidades', 'Hogar'], 0, [
    'Correcto: se suman las humanidades a ciencia, tecnología, ingeniería, arte y matemática.',
    'La historia es parte de las humanidades, pero la H se refiere a todas.',
    'No se refiere a habilidades.',
    'No se refiere al hogar.',
  ]),
  q('pd-me-05', ME, PP, 'Se presenta a los estudiantes este caso: «el agua del pozo de la escuela salió turbia». Ellos investigan las causas y proponen soluciones. ¿Qué metodología es?', ['Aprendizaje basado en problemas', 'Aprendizaje basado en proyectos', 'Gamificación', 'Aula invertida'], 0, [
    'Correcto: se parte de un problema real para analizarlo y resolverlo.',
    'No se construye un producto final durante semanas.',
    'No hay puntos ni insignias.',
    'No se trata de ver la teoría en casa.',
  ]),
  q('pd-me-06', ME, PP, '¿En qué se diferencia el aprendizaje basado en proyectos del basado en problemas?', [
    'El de proyectos termina en un producto final; el de problemas, en una solución argumentada',
    'El de problemas usa juegos y puntos',
    'El de proyectos se hace sin docente',
    'No tienen ninguna diferencia',
  ], 0, [
    'Correcto: esa es la diferencia principal.',
    'Los puntos y los juegos son gamificación.',
    'En los dos el docente guía.',
    'Se parecen, pero su punto de partida y su resultado son distintos.',
  ]),
  q('pd-me-07', ME, PP, 'Relaciona cada metodología con su rasgo.', ['1b, 2c, 3a', '1a, 2c, 3b', '1c, 2b, 3a', '1b, 2a, 3c'], 0, [
    'Correcto: aula invertida, la teoría en casa; gamificación, puntos y niveles; STEAM+H, integra disciplinas.',
    'El aula invertida no integra disciplinas: cambia dónde se ve la teoría.',
    'El aula invertida no usa puntos; eso es la gamificación.',
    'La gamificación no integra disciplinas; STEAM+H sí.',
  ], {formato: 'emparejamiento', elementos: {izquierda: ['Aula invertida', 'Gamificación', 'STEAM+H'], derecha: ['Integra ciencia, tecnología, ingeniería, arte, matemática y humanidades', 'La teoría se revisa en casa y la práctica se hace en clase', 'Usa puntos, niveles e insignias para motivar']}, solucion: [1, 2, 0]}),
  q('pd-me-08', ME, PP, 'Usar elementos propios del juego, como puntos y niveles, en una actividad que no es un juego se llama ____.', ['gamificación', 'aula invertida', 'juego de roles', 'lluvia de ideas'], 0, [
    'Correcto: es la gamificación.',
    'El aula invertida es la teoría en casa y la práctica en clase.',
    'El juego de roles es representar personajes.',
    'La lluvia de ideas es una técnica para generar ideas.',
  ], {formato: 'completamiento'}),
  q('pd-me-09', ME, PP, 'Los estudiantes diseñan un puente de palitos, calculan cuánto peso resiste, lo decoran y escriben su historia. ¿Qué enfoque es?', ['STEAM+H', 'Aula invertida', 'Gamificación', 'Debate'], 0, [
    'Correcto: integra ingeniería, matemática, arte y humanidades en un mismo reto.',
    'No se trata de ver la teoría en casa.',
    'No hay puntos ni niveles.',
    'No se enfrentan dos posturas.',
  ]),
  q('pd-me-10', ME, PP, '¿Cuáles son rasgos del aula invertida?', ['1, 3 y 4', '2 y 5', '1, 2 y 3', '3, 4 y 5'], 0, [
    'Correcto: se revisa el contenido antes, en casa, y la clase es para practicar.',
    'En el aula invertida el docente no dicta toda la hora y el trabajo en grupo es habitual.',
    'Dictar la teoría toda la hora es lo contrario del aula invertida.',
    'El aula invertida no prohíbe el trabajo en grupo; lo aprovecha.',
  ], {formato: 'seleccion', elementos: ['El estudiante revisa los contenidos antes de la clase', 'El docente dicta la teoría toda la hora', 'El tiempo de clase se usa para practicar y resolver dudas', 'Se usan videos o lecturas en casa', 'Se prohíbe el trabajo en grupo'], solucion: [0, 2, 3]}),

  // ── Técnicas
  q('pd-te-01', TE, D, 'Varios especialistas con puntos de vista distintos exponen por turnos sobre un tema ante el grupo, guiados por un moderador. ¿Qué técnica es?', ['Mesa redonda', 'Panel de discusión', 'Lluvia de ideas', 'Juego de roles'], 0, [
    'Correcto: en la mesa redonda los expertos exponen por turnos.',
    'En el panel los expertos conversan entre sí, no exponen por turnos.',
    'En la lluvia de ideas el grupo propone ideas sin juzgarlas.',
    'En el juego de roles se representan personajes.',
  ]),
  q('pd-te-02', TE, D, 'Para empezar un tema, el grupo dice todas las ideas que se le ocurren sin juzgarlas y después las selecciona. ¿Qué técnica es?', ['Lluvia de ideas', 'Debate', 'Foro', 'Resumen'], 0, [
    'Correcto: primero se generan ideas libremente y luego se eligen.',
    'En el debate se enfrentan dos posturas.',
    'En el foro se discute un tema con un moderador.',
    'El resumen reduce un texto a sus ideas principales.',
  ]),
  q('pd-te-03', TE, D, 'Para estudiar la Independencia, los estudiantes ordenan los hechos de 1809 a 1830 en una secuencia. ¿Qué técnica usan?', ['Línea de tiempo', 'Mapa conceptual', 'Ensayo', 'Resumen'], 0, [
    'Correcto: ordena los hechos en secuencia cronológica.',
    'El mapa conceptual relaciona conceptos, no fechas en orden.',
    'El ensayo defiende una postura con argumentos.',
    'El resumen reduce un texto.',
  ]),
  q('pd-te-04', TE, PP, 'Un grupo de expertos conversa entre sí sobre los distintos aspectos de un tema frente a un público. ¿Qué técnica es?', ['Panel de discusión', 'Mesa redonda', 'Debate', 'Exposición oral'], 0, [
    'Correcto: en el panel los expertos dialogan entre sí.',
    'En la mesa redonda exponen por turnos puntos de vista distintos.',
    'En el debate se enfrentan dos posturas contrarias.',
    'En la exposición oral habla una sola persona.',
  ]),
  q('pd-te-05', TE, PP, '¿Qué técnica consiste en reducir un texto a sus ideas principales, con palabras propias y sin opiniones?', ['El resumen', 'El ensayo', 'La exposición oral', 'El foro'], 0, [
    'Correcto: el resumen se queda con lo esencial y no opina.',
    'El ensayo, al contrario, defiende una opinión.',
    'La exposición oral presenta un tema ante otros.',
    'El foro es una discusión en grupo.',
  ]),
  q('pd-te-06', TE, PP, '¿En qué texto el estudiante defiende una postura propia con argumentos, con introducción, desarrollo y conclusión?', ['El ensayo', 'El resumen', 'La línea de tiempo', 'El cuadro sinóptico'], 0, [
    'Correcto: el ensayo argumenta una postura personal.',
    'El resumen no incluye opiniones.',
    'La línea de tiempo ordena hechos.',
    'El cuadro sinóptico organiza ideas en forma gráfica.',
  ]),
  q('pd-te-07', TE, PP, 'Relaciona cada técnica con su rasgo.', ['1c, 2a, 3b', '1a, 2c, 3b', '1c, 2b, 3a', '1b, 2a, 3c'], 0, [
    'Correcto: debate, dos posturas; juego de roles, representar; organizador gráfico, ideas en forma visual.',
    'El debate no es representar personajes: eso es el juego de roles.',
    'El juego de roles no es un esquema visual; el organizador gráfico sí.',
    'El debate no es un esquema visual.',
  ], {formato: 'emparejamiento', elementos: {izquierda: ['Debate', 'Juego de roles', 'Organizador gráfico'], derecha: ['Representar personajes o situaciones para comprender otros puntos de vista', 'Mostrar de forma visual las ideas y cómo se relacionan', 'Dos posturas contrarias argumentan con un moderador']}, solucion: [2, 0, 1]}),
  q('pd-te-08', TE, PP, '¿Cuáles de estos son organizadores gráficos?', ['1, 3 y 5', '2 y 4', '1, 2 y 3', '3 y 5'], 0, [
    'Correcto: el mapa conceptual, el cuadro sinóptico y el diagrama de Venn.',
    'El ensayo es un texto y el debate es una técnica oral.',
    'El ensayo es un texto, no un organizador gráfico.',
    'También el mapa conceptual es un organizador gráfico.',
  ], {formato: 'seleccion', elementos: ['Mapa conceptual', 'Ensayo', 'Cuadro sinóptico', 'Debate', 'Diagrama de Venn'], solucion: [0, 2, 4]}),
  q('pd-te-09', TE, PP, 'Después de ver una película, todo el grupo opina y pregunta libremente, con un moderador que da la palabra. ¿Qué técnica es?', ['El foro', 'La mesa redonda', 'El panel de discusión', 'El debate'], 0, [
    'Correcto: en el foro participa todo el grupo, con un moderador.',
    'En la mesa redonda exponen expertos por turnos.',
    'En el panel conversan expertos ante el público.',
    'En el debate se enfrentan dos posturas.',
  ]),
  q('pd-te-10', TE, PP, 'En la ____, una persona presenta un tema de forma ordenada ante un grupo.', ['exposición oral', 'lluvia de ideas', 'mesa redonda', 'línea de tiempo'], 0, [
    'Correcto: la exposición oral la hace una persona.',
    'En la lluvia de ideas participa todo el grupo.',
    'En la mesa redonda participan varios expertos.',
    'La línea de tiempo ordena hechos; no es una presentación oral.',
  ], {formato: 'completamiento'}),
];
