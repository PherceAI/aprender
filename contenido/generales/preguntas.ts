import type {Pregunta} from '../tipos';

// Conocimientos generales: diagnóstico de entrada (2 por unidad) y preguntas para el simulacro corto.
// Contenido de demo: lo revisa el docente experto antes de vender.

export const PREGUNTAS_GENERALES: Pregunta[] = [
  // ── Diagnóstico · Fundamentos para el aprendizaje
  {
    id: 'diag-gen-01', temaId: 'teorias-aprendizaje', formato: 'emparejamiento', dificultad: 2,
    usos: ['diagnostico', 'practica'],
    enunciado: 'Relaciona cada teoría del aprendizaje con su idea central.',
    elementos: {
      izquierda: ['Conductismo', 'Cognitivismo', 'Constructivismo', 'Conectivismo'],
      derecha: [
        'Se aprende en redes y conexiones, también digitales',
        'Aprender es cambiar la conducta con estímulos y refuerzos',
        'El estudiante construye el conocimiento desde lo que ya sabe y su experiencia',
        'Aprender es procesar, organizar y guardar información en la mente',
      ],
    },
    solucion: [1, 3, 2, 0],
    opciones: ['1b, 2c, 3d, 4a', '1b, 2d, 3c, 4a', '1a, 2d, 3c, 4b', '1d, 2b, 3c, 4a'],
    correcta: 1,
    explicaciones: [
      'Cognitivismo y constructivismo están cruzados: el cognitivismo mira cómo se procesa la información.',
      'Correcto: conductismo–refuerzo, cognitivismo–procesar información, constructivismo–construir, conectivismo–redes.',
      'El conductismo no habla de redes: habla de estímulos, respuestas y refuerzos.',
      'El conductismo no trata de procesos mentales: solo mira la conducta observable.',
    ],
  },
  {
    id: 'diag-gen-02', temaId: 'dua', formato: 'simple', dificultad: 1,
    usos: ['diagnostico', 'practica'],
    enunciado: 'Una docente presenta el tema con un video, un esquema y una lectura corta. ¿Qué principio del DUA aplica?',
    opciones: ['Implicación', 'Acción y expresión', 'Representación', 'Evaluación'],
    correcta: 2,
    explicaciones: [
      'Implicación es despertar y sostener el interés y la motivación.',
      'Acción y expresión es dar varias formas de demostrar lo aprendido.',
      'Correcto: ofrecer la información de varias formas es el principio de representación.',
      'La evaluación no es uno de los tres principios del DUA.',
    ],
  },
  // ── Diagnóstico · Currículo y planificación
  {
    id: 'diag-gen-03', temaId: 'planificacion-curricular', formato: 'seleccion', dificultad: 1,
    usos: ['diagnostico', 'practica'],
    enunciado: '¿Cuáles son elementos de la planificación curricular?',
    elementos: ['Objetivo', 'Contenido', 'Presupuesto', 'Metodología', 'Evaluación'],
    solucion: [0, 1, 3, 4],
    opciones: ['1, 2, 3 y 4', '1, 2, 4 y 5', '2, 3, 4 y 5', '1, 3, 4 y 5'],
    correcta: 1,
    explicaciones: [
      'El presupuesto (3) no es un elemento de la planificación curricular.',
      'Correcto: objetivo, contenido, metodología y evaluación.',
      'Falta el objetivo (1), que guía toda la planificación, y sobra el presupuesto (3).',
      'Falta el contenido (2) y sobra el presupuesto (3).',
    ],
  },
  {
    id: 'diag-gen-04', temaId: 'evaluacion-educativa', formato: 'completamiento', dificultad: 1,
    usos: ['diagnostico', 'practica'],
    enunciado: 'Al iniciar el año, la docente aplica una prueba para conocer los saberes previos del grupo. Es una evaluación ____.',
    opciones: ['sumativa', 'formativa', 'diagnóstica', 'final'],
    correcta: 2,
    explicaciones: [
      'La sumativa mide lo logrado al final de un periodo.',
      'La formativa acompaña el proceso para ajustar la enseñanza mientras ocurre.',
      'Correcto: la diagnóstica se aplica al inicio para conocer los saberes previos.',
      'Una evaluación final es sumativa, no de inicio.',
    ],
  },
  // ── Diagnóstico · Proceso de enseñanza-aprendizaje
  {
    id: 'diag-gen-05', temaId: 'metodologias', formato: 'simple', dificultad: 1,
    usos: ['diagnostico', 'practica'],
    enunciado: 'Los estudiantes ven en casa un video sobre la fotosíntesis y en clase hacen experimentos y resuelven dudas. ¿Qué metodología es?',
    opciones: ['Gamificación', 'Aula invertida', 'Aprendizaje basado en proyectos', 'STEAM+H'],
    correcta: 1,
    explicaciones: [
      'La gamificación usa elementos de juego (puntos, retos, niveles).',
      'Correcto: la teoría se revisa en casa y la clase se usa para practicar y resolver dudas.',
      'El aprendizaje basado en proyectos gira en torno a crear un producto a lo largo del tiempo.',
      'STEAM+H integra varias disciplinas en un reto; no se define por dónde se ve la teoría.',
    ],
  },
  {
    id: 'diag-gen-06', temaId: 'tecnicas', formato: 'emparejamiento', dificultad: 1,
    usos: ['diagnostico', 'practica'],
    enunciado: 'Relaciona cada técnica con lo que hace.',
    elementos: {
      izquierda: ['Debate', 'Lluvia de ideas', 'Línea de tiempo', 'Juego de roles'],
      derecha: [
        'Ordenar hechos o procesos en el tiempo',
        'Defender posturas opuestas con argumentos',
        'Representar personajes o situaciones',
        'Generar muchas ideas sin juzgarlas',
      ],
    },
    solucion: [1, 3, 0, 2],
    opciones: ['1b, 2d, 3a, 4c', '1d, 2b, 3a, 4c', '1b, 2a, 3d, 4c', '1c, 2d, 3a, 4b'],
    correcta: 0,
    explicaciones: [
      'Correcto: debate–posturas, lluvia de ideas–generar ideas, línea de tiempo–ordenar, juego de roles–representar.',
      'Debate y lluvia de ideas están cruzados: en la lluvia de ideas no se discute ni se juzga.',
      'Lluvia de ideas y línea de tiempo están cruzadas.',
      'Debate y juego de roles están cruzados: en el debate se argumenta, no se actúa un personaje.',
    ],
  },
  // ── Diagnóstico · Recursos, medios y herramientas digitales
  {
    id: 'diag-gen-07', temaId: 'rea', formato: 'simple', dificultad: 2,
    usos: ['diagnostico', 'practica'],
    enunciado: 'Un recurso educativo abierto funciona igual en celular, tableta y computadora. ¿Qué criterio cumple?',
    opciones: ['Reusabilidad', 'Portabilidad', 'Interactividad', 'Adaptabilidad'],
    correcta: 1,
    explicaciones: [
      'Reusabilidad es poder usarlo de nuevo en otros cursos o contextos.',
      'Correcto: portabilidad es que funcione en distintos dispositivos y plataformas.',
      'Interactividad es que el usuario participe y reciba respuesta del recurso.',
      'Adaptabilidad es poder modificarlo según las necesidades del grupo.',
    ],
  },
  {
    id: 'diag-gen-08', temaId: 'herramientas-digitales', leccionId: 'herramientas-digitales-1', formato: 'seleccion', dificultad: 1,
    usos: ['diagnostico', 'practica'],
    enunciado: '¿Cuáles de estas herramientas son asincrónicas?',
    elementos: ['Videoconferencia en vivo', 'Foro de discusión', 'Correo electrónico', 'Chat en vivo durante la clase', 'Tarea en un aula virtual'],
    solucion: [1, 2, 4],
    opciones: ['1, 2 y 3', '2, 4 y 5', '1, 3 y 5', '2, 3 y 5'],
    correcta: 3,
    explicaciones: [
      'La videoconferencia en vivo (1) es sincrónica: todos están conectados al mismo tiempo.',
      'El chat en vivo (4) es sincrónico.',
      'La videoconferencia (1) es sincrónica.',
      'Correcto: foro, correo y tarea permiten participar en distintos momentos.',
    ],
  },
  // ── Diagnóstico · Uso seguro de internet
  {
    id: 'diag-gen-09', temaId: 'riesgos-digitales', formato: 'simple', dificultad: 1,
    usos: ['diagnostico', 'practica'],
    enunciado: 'Un adulto se hace pasar por adolescente en redes sociales para ganarse la confianza de un estudiante con fines sexuales. ¿Qué riesgo es?',
    opciones: ['Sexteo', 'Grooming', 'Phishing', 'Ciberacoso'],
    correcta: 1,
    explicaciones: [
      'El sexteo es enviar contenido sexual propio; aquí hay un adulto que engaña a un menor.',
      'Correcto: el grooming (engaño pederasta) es un adulto que gana la confianza de un menor con fines sexuales.',
      'El phishing es robar datos haciéndose pasar por una entidad confiable.',
      'El ciberacoso es hostigar o humillar de forma repetida por medios digitales.',
    ],
  },
  {
    id: 'diag-gen-10', temaId: 'riesgos-digitales', formato: 'completamiento', dificultad: 1,
    usos: ['diagnostico', 'practica'],
    enunciado: 'Un mensaje que imita a tu banco y te pide la clave para «verificar tu cuenta» es un caso de ____.',
    opciones: ['spam', 'plagio', 'phishing', 'grooming'],
    correcta: 2,
    explicaciones: [
      'El spam es correo masivo no deseado; no siempre busca robar datos.',
      'El plagio es presentar como propio un trabajo ajeno.',
      'Correcto: el phishing suplanta a una entidad confiable para robar datos.',
      'El grooming es el engaño de un adulto a un menor con fines sexuales.',
    ],
  },
  // ── Simulacro corto
  {
    id: 'sim-gen-01', temaId: 'teorias-aprendizaje', formato: 'simple', dificultad: 2,
    usos: ['simulacro', 'practica'],
    enunciado: 'Según Vygotsky, la distancia entre lo que un estudiante logra solo y lo que logra con ayuda se llama:',
    opciones: ['Andamiaje', 'Zona de desarrollo próximo', 'Aprendizaje significativo', 'Equilibración'],
    correcta: 1,
    explicaciones: [
      'El andamiaje es la ayuda que se da dentro de esa zona, no la zona misma.',
      'Correcto: la zona de desarrollo próximo es un concepto central del constructivismo social.',
      'El aprendizaje significativo es de Ausubel: relacionar lo nuevo con lo que ya se sabe.',
      'La equilibración es un concepto de Piaget.',
    ],
  },
  {
    id: 'sim-gen-02', temaId: 'evaluacion-educativa', leccionId: 'evaluacion-educativa-2', formato: 'simple', dificultad: 1,
    usos: ['simulacro', 'practica'],
    enunciado: '¿Qué instrumento describe niveles de desempeño para cada criterio y permite una retroalimentación detallada?',
    opciones: ['Lista de cotejo', 'Rúbrica', 'Diario de reflexión', 'Portafolio'],
    correcta: 1,
    explicaciones: [
      'La lista de cotejo solo registra si algo está presente o no (sí/no).',
      'Correcto: la rúbrica describe niveles de logro para cada criterio.',
      'El diario de reflexión registra lo que el estudiante piensa de su aprendizaje.',
      'El portafolio reúne evidencias del trabajo a lo largo del tiempo.',
    ],
  },
  {
    id: 'sim-gen-03', temaId: 'metodologias', formato: 'simple', dificultad: 1,
    usos: ['simulacro', 'practica'],
    enunciado: 'Integrar ciencia, tecnología, ingeniería, arte, matemática y humanidades en un mismo reto corresponde a:',
    opciones: ['Gamificación', 'Aula invertida', 'STEAM+H', 'Aprendizaje basado en problemas'],
    correcta: 2,
    explicaciones: [
      'La gamificación usa elementos de juego.',
      'El aula invertida cambia dónde se ve la teoría y dónde se practica.',
      'Correcto: STEAM+H son las siglas de esas disciplinas integradas.',
      'El aprendizaje basado en problemas parte de un problema, pero no exige integrar esas disciplinas.',
    ],
  },
  {
    id: 'sim-gen-04', temaId: 'medios-digitales', formato: 'simple', dificultad: 2,
    usos: ['simulacro', 'practica'],
    enunciado: 'Un texto en línea con enlaces que llevan a otros textos, videos e imágenes es un ejemplo de:',
    opciones: ['Hipertextualidad', 'Portabilidad', 'Sincronía', 'Reusabilidad'],
    correcta: 0,
    explicaciones: [
      'Correcto: la hipertextualidad conecta contenidos mediante enlaces.',
      'La portabilidad es funcionar en distintos dispositivos.',
      'La sincronía es coincidir en el tiempo, como en una videollamada.',
      'La reusabilidad es usar un recurso en otros contextos.',
    ],
  },
];
