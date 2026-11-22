import {tema} from '../estructura-helpers';
import type {Pregunta, Tema} from '../tipos';

// Conocimientos digitales (ficha 4.1.2): los cuatro temas con sus lecciones y preguntas.
// Contenido escrito por el equipo a partir de los subtemas de la ficha: lo revisa el docente experto.

export const REA: Tema = tema(
  'rea',
  'Recursos educativos digitales abiertos',
  [['Cómo evaluar un recurso abierto', 'Definir los criterios para evaluar los recursos educativos digitales abiertos: accesibilidad, reusabilidad, adaptabilidad, interactividad y portabilidad.']],
  {
    abierto: true,
    minutos: {1: 8},
    contenido: {
      1: [
        {
          tipo: 'texto',
          texto:
            'Un recurso educativo abierto (REA) es un material para enseñar o aprender (un video, una simulación, una guía, un libro) que es de dominio público o tiene una licencia abierta. Esa licencia permite usarlo, adaptarlo y compartirlo sin pagar. Las más comunes son las licencias Creative Commons, como CC BY: puedes usar y modificar el recurso si citas a su autor.',
        },
        {
          tipo: 'puntos',
          titulo: 'Los cinco criterios para evaluar un REA',
          puntos: [
            'Accesibilidad: todos pueden usarlo, también estudiantes con discapacidad (subtítulos, texto alternativo en las imágenes, buen contraste) y con conexiones o equipos limitados.',
            'Reusabilidad: sirve en otros cursos, temas o grupos, y su licencia permite volver a usarlo.',
            'Adaptabilidad: se puede modificar para el nivel, el idioma o el contexto de tus estudiantes (por ejemplo, viene en un formato editable).',
            'Interactividad: el estudiante hace algo con el recurso (manipula, responde, explora) y recibe una respuesta, en lugar de solo mirar.',
            'Portabilidad: funciona en distintos dispositivos, sistemas y plataformas (celular, computadora, aula virtual) sin perder calidad.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'La simulación de la fotosíntesis',
          situacion:
            'Una docente encuentra una simulación en línea donde los estudiantes mueven la luz y el agua y ven cómo cambia el crecimiento de una planta. Se abre en el navegador del celular, está traducida al español y su licencia permite descargarla y compartirla con otros docentes.',
          explicacion:
            'Cumple varios criterios a la vez: es interactiva (el estudiante cambia variables y ve el resultado), portable (funciona en el celular y en la computadora), accesible (en el idioma de los estudiantes) y reusable (la licencia permite compartirla). Antes de usarla, la docente revisa además si puede adaptarla a su planificación.',
        },
        {
          tipo: 'comparacion',
          titulo: 'Criterios que se confunden',
          columnas: ['Reusabilidad', 'Adaptabilidad'],
          filas: [
            {aspecto: 'Pregunta clave', a: '¿Puedo volver a usarlo en otro curso o tema?', b: '¿Puedo modificarlo para mis estudiantes?'},
            {aspecto: 'Ejemplo', a: 'El mismo video sirve en 8.º y en 10.º', b: 'Cambio el texto de la guía y agrego un ejercicio'},
          ],
        },
        {
          tipo: 'clave',
          texto:
            'Abierto no es lo mismo que gratis: un video gratis en internet puede tener todos los derechos reservados. Un REA, además de gratuito, tiene una licencia que permite usarlo, adaptarlo y compartirlo.',
        },
      ],
    },
  }
);

export const MEDIOS: Tema = tema(
  'medios-digitales',
  'Medios digitales',
  [['Multimodalidad e hipertextualidad', 'Reconocer las características y usos de los medios digitales relacionados con multimodalidad o hipertextualidad.']],
  {
    abierto: true,
    minutos: {1: 7},
    contenido: {
      1: [
        {
          tipo: 'texto',
          texto:
            'Los medios digitales comunican de dos maneras que el Ineval pregunta: la multimodalidad, que combina varios lenguajes en un mismo mensaje, y la hipertextualidad, que conecta la información con enlaces para que el lector elija su propio recorrido.',
        },
        {
          tipo: 'comparacion',
          titulo: 'Multimodalidad e hipertextualidad',
          columnas: ['Multimodalidad', 'Hipertextualidad'],
          filas: [
            {aspecto: 'Qué es', a: 'Combinar varios modos: texto, imagen, audio, video, gráficos', b: 'Información enlazada con hipervínculos'},
            {aspecto: 'Cómo se lee', a: 'El mensaje llega por varios sentidos a la vez', b: 'De forma no lineal: el lector decide a dónde ir'},
            {aspecto: 'Ejemplos', a: 'Infografía con video, presentación con narración', b: 'Página web, wiki, libro digital con enlaces'},
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Dos recursos sobre el ciclo del agua',
          situacion:
            'El docente A prepara un video con animaciones, narración y textos cortos. La docente B arma una página donde cada etapa del ciclo (evaporación, condensación, precipitación) es un enlace que abre su propia explicación y lleva a ejemplos de Ecuador.',
          explicacion:
            'El video del docente A es multimodal: une imagen, sonido y texto en un mismo mensaje. La página de la docente B es hipertextual: el estudiante elige el orden en que recorre las etapas. Cuando un recurso tiene las dos cosas (enlaces que llevan a videos, audios e imágenes) se le llama hipermedia.',
        },
        {
          tipo: 'aula',
          texto:
            'La multimodalidad se relaciona con el DUA: presentar el mismo contenido por varias vías (texto, imagen y audio) da múltiples formas de representación y llega a más estudiantes.',
        },
        {
          tipo: 'clave',
          texto: 'Multimodal = varios lenguajes juntos. Hipertextual = información enlazada que se recorre sin un orden fijo.',
        },
      ],
    },
  }
);

export const HERRAMIENTAS: Tema = tema(
  'herramientas-digitales',
  'Herramientas tecnológicas digitales',
  [
    ['Herramientas sincrónicas y asincrónicas', 'Reconocer las características de las herramientas tecnológicas digitales sincrónicas y asincrónicas.'],
    ['Entornos virtuales de aprendizaje', 'Reconocer las características, usos e implementación de los entornos virtuales de aprendizaje.'],
    ['Ofimática para el docente', 'Usar herramientas de ofimática: hojas de cálculo, presentación multimedia, procesador de texto y correo electrónico.'],
  ],
  {
    abierto: true,
    minutos: {1: 7, 2: 8, 3: 9},
    contenido: {
      1: [
        {
          tipo: 'texto',
          texto:
            'La diferencia está en el tiempo. Con una herramienta sincrónica, docente y estudiantes se comunican al mismo tiempo, en vivo. Con una asincrónica, cada uno participa en su propio momento y la comunicación queda guardada.',
        },
        {
          tipo: 'comparacion',
          titulo: 'Sincrónicas y asincrónicas',
          columnas: ['Sincrónicas', 'Asincrónicas'],
          filas: [
            {aspecto: 'Tiempo', a: 'En vivo, a la misma hora', b: 'Cada quien en su momento'},
            {aspecto: 'Ejemplos', a: 'Videoconferencia (Zoom, Meet, Teams), chat en vivo, pizarra colaborativa en clase', b: 'Foro, correo, tareas en el aula virtual, videos grabados, wikis, blogs'},
            {aspecto: 'Ventaja', a: 'Respuesta inmediata y sensación de grupo', b: 'Flexibilidad y tiempo para pensar la respuesta'},
            {aspecto: 'Cuidado', a: 'Depende de que todos tengan conexión a la misma hora', b: 'La retroalimentación tarda y exige organización'},
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Clase con estudiantes de zona rural',
          situacion:
            'Varios estudiantes viven en una zona con mala señal y solo pueden conectarse por la noche. La docente necesita que todos discutan un caso sobre el reciclaje.',
          explicacion:
            'Le conviene un foro (asincrónico): cada estudiante lee y responde cuando tiene señal, y la discusión queda guardada. Una videoconferencia (sincrónica) dejaría fuera a quienes no pueden conectarse a esa hora.',
        },
        {
          tipo: 'clave',
          texto: 'Sincrónico = al mismo tiempo (en vivo). Asincrónico = en distinto tiempo (queda guardado).',
        },
      ],
      2: [
        {
          tipo: 'texto',
          texto:
            'Un entorno virtual de aprendizaje (EVA) es un espacio en internet donde se organiza un curso: contenidos, actividades, comunicación y evaluación en un mismo lugar. Ejemplos conocidos son Moodle, Google Classroom y Microsoft Teams para Educación.',
        },
        {
          tipo: 'puntos',
          titulo: 'Qué tiene un entorno virtual',
          puntos: [
            'Contenidos: lecturas, videos y enlaces organizados por unidades o semanas.',
            'Actividades: tareas, cuestionarios, foros y trabajos en grupo.',
            'Comunicación: avisos, mensajes y foros entre docente y estudiantes.',
            'Evaluación y seguimiento: calificaciones, rúbricas, retroalimentación y registro de quién entregó qué.',
            'Roles: el docente crea y administra; el estudiante accede, participa y entrega.',
          ],
        },
        {
          tipo: 'puntos',
          titulo: 'Implementarlo en el aula',
          puntos: [
            'Planifica primero: objetivos, contenidos y cómo evaluarás cada unidad.',
            'Organiza el espacio de forma clara y siempre igual, para que el estudiante sepa dónde buscar.',
            'Da instrucciones, fechas y criterios de evaluación (por ejemplo, una rúbrica) en cada actividad.',
            'Retroalimenta a tiempo y revisa quién no está participando.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Aula invertida con el aula virtual',
          situacion: 'Un docente sube un video corto sobre los niveles tróficos al aula virtual y un cuestionario de tres preguntas. En clase, usa el tiempo para armar una red trófica en grupos.',
          explicacion:
            'El EVA le permite aplicar aula invertida: la teoría se revisa en casa y el cuestionario le muestra quién la entendió antes de la clase. Así el tiempo presencial se usa para practicar y resolver dudas.',
        },
        {
          tipo: 'clave',
          texto: 'Un EVA no es solo un lugar para subir archivos: reúne contenidos, actividades, comunicación y evaluación de un curso.',
        },
      ],
      3: [
        {
          tipo: 'texto',
          texto:
            'La ofimática son los programas que se usan para el trabajo diario de oficina: procesador de texto, hoja de cálculo, presentaciones y correo electrónico. Para el docente son herramientas de planificación, registro de notas y comunicación.',
        },
        {
          tipo: 'puntos',
          titulo: 'Para qué sirve cada una',
          puntos: [
            'Procesador de texto (Word, Google Docs): planificaciones, guías e informes. Usa estilos de título, tablas y control de cambios.',
            'Hoja de cálculo (Excel, Google Sheets): registro de calificaciones y estadísticas del grupo con fórmulas.',
            'Presentación multimedia (PowerPoint, Google Slides, Canva): apoyo visual de la clase con pocas palabras e imágenes claras.',
            'Correo electrónico (Gmail, Outlook): comunicación formal con estudiantes, representantes y autoridades.',
          ],
        },
        {
          tipo: 'comparacion',
          titulo: 'Funciones de la hoja de cálculo que más usa un docente',
          columnas: ['Ejemplo', 'Qué hace'],
          filas: [
            {aspecto: 'PROMEDIO', a: '=PROMEDIO(B2:B30)', b: 'Calcula la media de las notas del rango'},
            {aspecto: 'SUMA', a: '=SUMA(B2:E2)', b: 'Suma los valores de varias celdas'},
            {aspecto: 'MAX y MIN', a: '=MAX(B2:B30)', b: 'Devuelven la nota más alta y la más baja'},
            {aspecto: 'SI', a: '=SI(B2>=7, "Aprueba", "Refuerzo")', b: 'Escribe un resultado según una condición'},
            {aspecto: 'CONTAR.SI', a: '=CONTAR.SI(B2:B30, "<7")', b: 'Cuenta cuántas celdas cumplen la condición'},
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'El correo a todos los representantes',
          situacion:
            'Un docente envía la convocatoria a la reunión a los 35 representantes del curso escribiendo todos los correos en el campo «Para». Una representante se queja porque su correo quedó a la vista de todos.',
          explicacion:
            'Para escribir a muchas personas que no se conocen, los correos van en CCO (copia oculta): cada uno recibe el mensaje, pero nadie ve las direcciones de los demás. CC (copia) sí deja ver a todos los destinatarios.',
        },
        {
          tipo: 'clave',
          texto: 'Las fórmulas empiezan con «=» y usan rangos como B2:B30. En el correo, CCO protege las direcciones de los destinatarios.',
        },
      ],
    },
  }
);

export const RIESGOS: Tema = tema(
  'riesgos-digitales',
  'Riesgos en entornos digitales',
  [
    [
      'Riesgos en la red y cómo prevenirlos',
      'Identificar los riesgos en entornos digitales: acoso cibernético, sexteo, plagio académico, suplantación de identidad, tecnoadicciones, engaño pederasta (grooming), fraude informático (phishing), correo basura (spam) y el uso de antivirus.',
    ],
  ],
  {
    abierto: true,
    minutos: {1: 9},
    contenido: {
      1: [
        {
          tipo: 'texto',
          texto:
            'Como docente debes reconocer cada riesgo por lo que lo distingue de los demás, porque el Ineval suele describir un caso y pregunta de qué riesgo se trata.',
        },
        {
          tipo: 'puntos',
          titulo: 'Los riesgos y lo que los distingue',
          puntos: [
            'Acoso cibernético (ciberbullying): burlas, amenazas o humillaciones repetidas por medios digitales, a menudo entre pares.',
            'Sexteo (sexting): enviar o compartir fotos o videos de contenido sexual propios.',
            'Grooming (engaño pederasta): un adulto se gana la confianza de un menor, a veces con un perfil falso, con fines sexuales.',
            'Suplantación de identidad: hacerse pasar por otra persona con un perfil falso o usando su cuenta.',
            'Phishing (fraude informático): mensajes que imitan a un banco o empresa para robar claves y datos.',
            'Spam (correo basura): mensajes masivos que nadie pidió, a veces con publicidad o virus.',
            'Plagio académico: presentar como propio un trabajo ajeno sin citar la fuente.',
            'Tecnoadicción: no poder dejar el celular, los juegos o las redes, al punto de afectar el sueño, los estudios o las relaciones.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: '¿Grooming o ciberacoso?',
          situacion:
            'Una estudiante de 9.º cuenta que un «chico de 15 años» que conoció en un juego en línea le hace regalos virtuales, le pide guardar el secreto y ahora le pide fotos. Nadie del colegio lo conoce en persona.',
          explicacion:
            'Es grooming: alguien que probablemente es un adulto con un perfil falso se gana la confianza de una menor (regalos, secreto) para obtener material sexual. No es ciberacoso, porque no hay burlas ni humillaciones repetidas entre compañeros. El docente no confronta al agresor: acompaña a la estudiante, guarda las evidencias y activa la ruta con el DECE y las autoridades.',
        },
        {
          tipo: 'puntos',
          titulo: 'Cómo prevenir',
          puntos: [
            'No compartir contraseñas y activar la verificación en dos pasos.',
            'Revisar el remitente y no abrir enlaces de mensajes sospechosos.',
            'Configurar la privacidad de las redes y no aceptar a desconocidos.',
            'Usar un antivirus actualizado: detecta y elimina programas maliciosos.',
            'Ante un caso: escuchar, guardar evidencias (capturas) y reportar al DECE y a las autoridades.',
          ],
        },
        {
          tipo: 'clave',
          texto:
            'Pistas rápidas: adulto que engaña a un menor = grooming; burla repetida = ciberacoso; mensaje falso del banco = phishing; copiar sin citar = plagio.',
        },
      ],
    },
  }
);

// ───────────── Preguntas ─────────────

const D = ['diagnostico-tema', 'prueba'] as const;
const PP = ['practica', 'prueba'] as const;

export const PREGUNTAS_DIGITALES: Pregunta[] = [
  // ── Recursos educativos digitales abiertos (rea-1)
  {
    id: 'dg-rea-01', temaId: 'rea', leccionId: 'rea-1', formato: 'simple', dificultad: 1, usos: [...D],
    enunciado: '¿Qué hace que un recurso educativo sea «abierto»?',
    opciones: ['Que sea gratis en internet', 'Que tenga una licencia que permite usarlo, adaptarlo y compartirlo', 'Que se use solo en línea', 'Que lo haya hecho el Ministerio'],
    correcta: 1,
    explicaciones: [
      'Gratis no basta: un recurso gratuito puede tener todos los derechos reservados.',
      'Correcto: un REA es de dominio público o tiene licencia abierta que permite usar, adaptar y compartir.',
      'Un REA puede ser impreso o digital; lo que importa es su licencia.',
      'Cualquier persona o institución puede publicar un REA.',
    ],
  },
  {
    id: 'dg-rea-02', temaId: 'rea', leccionId: 'rea-1', formato: 'simple', dificultad: 1, usos: [...D],
    enunciado: 'Un video educativo tiene subtítulos y una versión en audio descrito para estudiantes con discapacidad visual. ¿Qué criterio cumple?',
    opciones: ['Portabilidad', 'Interactividad', 'Accesibilidad', 'Reusabilidad'],
    correcta: 2,
    explicaciones: [
      'La portabilidad trata de funcionar en distintos dispositivos y plataformas.',
      'La interactividad pide que el estudiante haga algo y reciba respuesta.',
      'Correcto: la accesibilidad busca que todos puedan usar el recurso, incluidas las personas con discapacidad.',
      'La reusabilidad es poder volver a usarlo en otros contextos.',
    ],
  },
  {
    id: 'dg-rea-03', temaId: 'rea', leccionId: 'rea-1', formato: 'simple', dificultad: 1, usos: [...D],
    enunciado: 'Una docente descarga una guía en formato editable y cambia los ejemplos por otros de su provincia. ¿Qué criterio le permitió hacerlo?',
    opciones: ['Adaptabilidad', 'Portabilidad', 'Accesibilidad', 'Interactividad'],
    correcta: 0,
    explicaciones: [
      'Correcto: la adaptabilidad es poder modificar el recurso para el contexto de los estudiantes.',
      'La portabilidad es que funcione en distintos dispositivos, no que se pueda editar.',
      'La accesibilidad es que todos puedan usarlo.',
      'La interactividad es la participación activa del estudiante con el recurso.',
    ],
  },
  {
    id: 'dg-rea-04', temaId: 'rea', leccionId: 'rea-1', formato: 'simple', dificultad: 1, usos: [...PP],
    enunciado: 'Una simulación se abre igual en el celular, en la tableta y en la computadora, y también dentro del aula virtual. ¿Qué criterio cumple?',
    opciones: ['Reusabilidad', 'Portabilidad', 'Adaptabilidad', 'Accesibilidad'],
    correcta: 1,
    explicaciones: [
      'La reusabilidad es usarla en otros cursos o temas.',
      'Correcto: la portabilidad es funcionar en distintos dispositivos, sistemas y plataformas sin perder calidad.',
      'La adaptabilidad es poder modificarla.',
      'La accesibilidad se centra en que todas las personas puedan usarla.',
    ],
  },
  {
    id: 'dg-rea-05', temaId: 'rea', leccionId: 'rea-1', formato: 'completamiento', dificultad: 1, usos: [...PP],
    enunciado: 'Un recurso es ____ cuando el estudiante manipula variables, responde y recibe una respuesta del propio recurso.',
    opciones: ['portable', 'interactivo', 'reusable', 'accesible'],
    correcta: 1,
    explicaciones: [
      'Portable se refiere a los dispositivos y plataformas.',
      'Correcto: la interactividad pide una participación activa del estudiante con retroalimentación.',
      'Reusable es que se pueda volver a usar.',
      'Accesible es que todos puedan usarlo.',
    ],
  },
  {
    id: 'dg-rea-06', temaId: 'rea', leccionId: 'rea-1', formato: 'simple', dificultad: 2, usos: [...PP],
    enunciado: 'Un docente usa la misma presentación abierta sobre el sistema solar en 8.º, 9.º y 10.º, y otra institución también la usa. ¿Qué criterio se destaca?',
    opciones: ['Interactividad', 'Accesibilidad', 'Reusabilidad', 'Portabilidad'],
    correcta: 2,
    explicaciones: [
      'Mostrar una presentación no implica que el estudiante interactúe con ella.',
      'Nada indica adaptaciones para personas con discapacidad.',
      'Correcto: la reusabilidad es poder usar el recurso en distintos cursos y contextos.',
      'La portabilidad trata de los dispositivos, no de distintos cursos.',
    ],
  },
  {
    id: 'dg-rea-07', temaId: 'rea', leccionId: 'rea-1', formato: 'simple', dificultad: 2, usos: [...PP],
    enunciado: '¿Qué indica una licencia Creative Commons «CC BY» en un recurso?',
    opciones: [
      'Que no se puede copiar ni modificar',
      'Que se puede usar y modificar citando al autor',
      'Que solo se puede usar si se paga',
      'Que pertenece al Estado',
    ],
    correcta: 1,
    explicaciones: [
      'Eso describe «todos los derechos reservados», lo contrario de una licencia abierta.',
      'Correcto: CC BY permite usar, adaptar y compartir el recurso siempre que se reconozca al autor.',
      'Las licencias Creative Commons no exigen pago.',
      'La licencia no habla de quién es el dueño, sino de lo que se permite hacer.',
    ],
  },
  {
    id: 'dg-rea-08', temaId: 'rea', leccionId: 'rea-1', formato: 'simple', dificultad: 2, usos: [...PP],
    enunciado: 'Un recurso solo funciona en un programa que hay que instalar en computadoras con Windows. ¿Qué criterio NO cumple bien?',
    opciones: ['Portabilidad', 'Interactividad', 'Reusabilidad', 'Adaptabilidad'],
    correcta: 0,
    explicaciones: [
      'Correcto: si depende de un sistema y de un programa, no se puede usar en el celular ni en otras plataformas.',
      'Puede ser muy interactivo aunque solo funcione en Windows.',
      'Podría reutilizarse en varios cursos que tengan esas computadoras.',
      'La adaptabilidad depende de si se puede modificar, no del sistema.',
    ],
  },
  {
    id: 'dg-rea-09', temaId: 'rea', leccionId: 'rea-1', formato: 'simple', dificultad: 2, usos: [...PP],
    enunciado: 'Un docente encuentra un video gratuito en internet con la leyenda «Todos los derechos reservados». ¿Es un recurso educativo abierto?',
    opciones: [
      'Sí, porque es gratis',
      'Sí, porque está en internet',
      'No, porque su licencia no permite adaptarlo ni redistribuirlo',
      'No, porque los videos nunca son REA',
    ],
    correcta: 2,
    explicaciones: [
      'Gratis no es lo mismo que abierto.',
      'Estar en internet no da permiso de adaptarlo ni compartirlo.',
      'Correcto: un REA necesita una licencia abierta; «todos los derechos reservados» lo impide.',
      'Un video puede ser REA si tiene licencia abierta.',
    ],
  },
  {
    id: 'dg-rea-10', temaId: 'rea', leccionId: 'rea-1', formato: 'simple', dificultad: 1, usos: [...PP],
    enunciado: '¿Cuál de estos NO es uno de los criterios para evaluar un REA que pide la ficha?',
    opciones: ['Accesibilidad', 'Popularidad', 'Portabilidad', 'Adaptabilidad'],
    correcta: 1,
    explicaciones: [
      'La accesibilidad sí es un criterio.',
      'Correcto: los criterios son accesibilidad, reusabilidad, adaptabilidad, interactividad y portabilidad; la popularidad no está.',
      'La portabilidad sí es un criterio.',
      'La adaptabilidad sí es un criterio.',
    ],
  },

  // ── Medios digitales (medios-digitales-1)
  {
    id: 'dg-med-01', temaId: 'medios-digitales', leccionId: 'medios-digitales-1', formato: 'simple', dificultad: 1, usos: [...D],
    enunciado: 'Un recurso combina texto, imágenes, audio y video en un mismo mensaje. ¿Qué característica tiene?',
    opciones: ['Hipertextualidad', 'Multimodalidad', 'Linealidad', 'Portabilidad'],
    correcta: 1,
    explicaciones: [
      'La hipertextualidad trata de enlaces entre informaciones.',
      'Correcto: la multimodalidad combina varios modos o lenguajes en un mismo mensaje.',
      'Lo lineal es lo contrario del hipertexto, y no describe la mezcla de lenguajes.',
      'La portabilidad es un criterio de los REA, no un rasgo del medio.',
    ],
  },
  {
    id: 'dg-med-02', temaId: 'medios-digitales', leccionId: 'medios-digitales-1', formato: 'simple', dificultad: 1, usos: [...D],
    enunciado: 'En una wiki, el estudiante toca enlaces y decide en qué orden lee la información. ¿Qué característica es?',
    opciones: ['Multimodalidad', 'Sincronía', 'Hipertextualidad', 'Interactividad física'],
    correcta: 2,
    explicaciones: [
      'La multimodalidad mezcla lenguajes; aquí lo central son los enlaces.',
      'Sincronía es comunicarse al mismo tiempo.',
      'Correcto: la hipertextualidad organiza la información con enlaces y permite una lectura no lineal.',
      'No es un término de la ficha.',
    ],
  },
  {
    id: 'dg-med-03', temaId: 'medios-digitales', leccionId: 'medios-digitales-1', formato: 'completamiento', dificultad: 1, usos: [...D],
    enunciado: 'Un texto con hipervínculos que el lector recorre sin un orden fijo es un texto ____.',
    opciones: ['lineal', 'hipertextual', 'multimodal', 'impreso'],
    correcta: 1,
    explicaciones: [
      'Lineal es leerlo de principio a fin en un solo orden.',
      'Correcto: la hipertextualidad se basa en enlaces y en una lectura no lineal.',
      'Multimodal se refiere a combinar lenguajes, no a los enlaces.',
      'Un texto impreso no tiene hipervínculos.',
    ],
  },
  {
    id: 'dg-med-04', temaId: 'medios-digitales', leccionId: 'medios-digitales-1', formato: 'simple', dificultad: 2, usos: [...PP],
    enunciado: 'Un libro digital tiene enlaces que abren videos, audios e imágenes de cada tema. ¿Cómo se llama un recurso que une ambas características?',
    opciones: ['Hipermedia', 'Monomedia', 'Texto lineal', 'Medio analógico'],
    correcta: 0,
    explicaciones: [
      'Correcto: la hipermedia une hipertexto (enlaces) y multimedia (varios lenguajes).',
      'Monomedia usa un solo lenguaje.',
      'Tiene enlaces, así que no es lineal.',
      'Un libro digital no es un medio analógico.',
    ],
  },
  {
    id: 'dg-med-05', temaId: 'medios-digitales', leccionId: 'medios-digitales-1', formato: 'simple', dificultad: 2, usos: [...PP],
    enunciado: 'Una docente explica la célula con un esquema, un video corto y una lectura. ¿Con qué principio del DUA se relaciona esta multimodalidad?',
    opciones: ['Múltiples formas de implicación', 'Múltiples formas de representación', 'Múltiples formas de evaluación sumativa', 'Múltiples formas de disciplina'],
    correcta: 1,
    explicaciones: [
      'La implicación trata de la motivación e interés, no de cómo se presenta el contenido.',
      'Correcto: presentar el contenido por varias vías es dar múltiples formas de representación.',
      'No es un principio del DUA.',
      'No es un principio del DUA.',
    ],
  },
  {
    id: 'dg-med-06', temaId: 'medios-digitales', leccionId: 'medios-digitales-1', formato: 'simple', dificultad: 1, usos: [...PP],
    enunciado: '¿Cuál de estos recursos es el MÁS multimodal?',
    opciones: ['Un texto de una página', 'Un audio de un minuto', 'Una infografía animada con narración y música', 'Una lista de palabras'],
    correcta: 2,
    explicaciones: [
      'Usa un solo modo: el texto escrito.',
      'Usa un solo modo: el sonido.',
      'Correcto: combina imagen, movimiento, voz y música.',
      'Usa un solo modo: el texto.',
    ],
  },
  {
    id: 'dg-med-07', temaId: 'medios-digitales', leccionId: 'medios-digitales-1', formato: 'simple', dificultad: 2, usos: [...PP],
    enunciado: '¿Qué ventaja da la hipertextualidad al estudiante?',
    opciones: [
      'Le obliga a leer todo en el mismo orden',
      'Le permite profundizar en lo que necesita siguiendo enlaces',
      'Elimina la necesidad de leer',
      'Funciona sin conexión en cualquier caso',
    ],
    correcta: 1,
    explicaciones: [
      'Eso describe la lectura lineal.',
      'Correcto: el estudiante elige su recorrido y profundiza donde lo necesita.',
      'Sigue habiendo lectura; cambia el recorrido.',
      'Los enlaces a otras páginas suelen necesitar conexión.',
    ],
  },
  {
    id: 'dg-med-08', temaId: 'medios-digitales', leccionId: 'medios-digitales-1', formato: 'completamiento', dificultad: 1, usos: [...PP],
    enunciado: 'Un video con animación, narración y subtítulos es un ejemplo de mensaje ____.',
    opciones: ['hipertextual', 'multimodal', 'asincrónico', 'abierto'],
    correcta: 1,
    explicaciones: [
      'No se menciona ningún enlace.',
      'Correcto: combina imagen, sonido y texto.',
      'Asincrónico se refiere al momento de la comunicación.',
      'Abierto se refiere a la licencia, no a los lenguajes.',
    ],
  },
  {
    id: 'dg-med-09', temaId: 'medios-digitales', leccionId: 'medios-digitales-1', formato: 'simple', dificultad: 3, usos: [...PP],
    enunciado: 'Un docente arma una página donde cada etapa del ciclo del agua es un enlace a su explicación, pero todo es texto escrito. ¿Qué describe mejor su recurso?',
    opciones: ['Es multimodal y no hipertextual', 'Es hipertextual y poco multimodal', 'Es hipermedia completa', 'No es un medio digital'],
    correcta: 1,
    explicaciones: [
      'Usa un solo lenguaje (texto), así que es poco multimodal.',
      'Correcto: tiene enlaces (hipertextual) pero un solo lenguaje (texto).',
      'La hipermedia pide además varios lenguajes (video, audio, imagen).',
      'Una página con enlaces sí es un medio digital.',
    ],
  },
  {
    id: 'dg-med-10', temaId: 'medios-digitales', leccionId: 'medios-digitales-1', formato: 'simple', dificultad: 2, usos: [...PP],
    enunciado: '¿Cuál es un ejemplo típico de hipertextualidad?',
    opciones: ['Un periódico impreso', 'Una página web con enlaces a otras páginas', 'Una pizarra con un esquema', 'Una grabación de radio'],
    correcta: 1,
    explicaciones: [
      'El papel no tiene hipervínculos.',
      'Correcto: los enlaces entre páginas son la base del hipertexto.',
      'Un esquema en la pizarra no tiene enlaces.',
      'Una grabación de radio se escucha de forma lineal.',
    ],
  },

  // ── Herramientas: sincrónicas y asincrónicas (herramientas-digitales-1)
  {
    id: 'dg-her-01', temaId: 'herramientas-digitales', leccionId: 'herramientas-digitales-1', formato: 'simple', dificultad: 1, usos: [...D],
    enunciado: '¿Cuál de estas herramientas es sincrónica?',
    opciones: ['Foro', 'Correo electrónico', 'Videoconferencia', 'Blog'],
    correcta: 2,
    explicaciones: [
      'En el foro cada uno participa en su momento: es asincrónico.',
      'El correo se lee cuando cada persona puede: es asincrónico.',
      'Correcto: en una videoconferencia todos participan al mismo tiempo, en vivo.',
      'El blog se publica y se lee en distintos momentos: es asincrónico.',
    ],
  },
  {
    id: 'dg-her-02', temaId: 'herramientas-digitales', leccionId: 'herramientas-digitales-1', formato: 'completamiento', dificultad: 1, usos: [...PP],
    enunciado: 'Las herramientas ____ permiten que docente y estudiantes participen en distintos momentos, y lo que se escribe queda guardado.',
    opciones: ['sincrónicas', 'asincrónicas', 'presenciales', 'analógicas'],
    correcta: 1,
    explicaciones: [
      'Las sincrónicas son en vivo, al mismo tiempo.',
      'Correcto: la comunicación asincrónica ocurre en distinto tiempo.',
      'Presencial se refiere a estar en el mismo lugar.',
      'Analógico es lo contrario de digital.',
    ],
  },
  {
    id: 'dg-her-03', temaId: 'herramientas-digitales', leccionId: 'herramientas-digitales-1', formato: 'simple', dificultad: 2, usos: [...PP],
    enunciado: 'Varios estudiantes solo tienen señal por la noche. ¿Qué herramienta conviene para que todos discutan un caso?',
    opciones: ['Una videoconferencia a las 10:00', 'Un foro en el aula virtual', 'Un chat en vivo en horario de clase', 'Una llamada grupal'],
    correcta: 1,
    explicaciones: [
      'Exige conectarse a una hora fija; dejaría fuera a varios.',
      'Correcto: el foro es asincrónico; cada uno participa cuando tiene señal.',
      'El chat en vivo es sincrónico y exige la misma hora.',
      'La llamada grupal también es sincrónica.',
    ],
  },
  {
    id: 'dg-her-04', temaId: 'herramientas-digitales', leccionId: 'herramientas-digitales-1', formato: 'simple', dificultad: 2, usos: [...PP],
    enunciado: '¿Cuál es una ventaja propia de las herramientas sincrónicas?',
    opciones: ['Flexibilidad total de horario', 'Retroalimentación inmediata', 'Más tiempo para pensar la respuesta', 'No necesitan conexión'],
    correcta: 1,
    explicaciones: [
      'La flexibilidad de horario es ventaja de las asincrónicas.',
      'Correcto: al ser en vivo, las dudas se resuelven al momento.',
      'Tener tiempo para pensar es propio de lo asincrónico.',
      'Las herramientas sincrónicas necesitan conexión a la misma hora.',
    ],
  },
  // ── Herramientas: entornos virtuales (herramientas-digitales-2)
  {
    id: 'dg-her-05', temaId: 'herramientas-digitales', leccionId: 'herramientas-digitales-2', formato: 'simple', dificultad: 1, usos: [...D],
    enunciado: '¿Cuál de estos es un entorno virtual de aprendizaje?',
    opciones: ['Moodle', 'Una calculadora', 'Un proyector', 'Un procesador de texto'],
    correcta: 0,
    explicaciones: [
      'Correcto: Moodle reúne contenidos, actividades, comunicación y evaluación de un curso.',
      'Una calculadora no organiza un curso.',
      'Un proyector es un equipo, no un entorno en línea.',
      'El procesador de texto es una herramienta de ofimática.',
    ],
  },
  {
    id: 'dg-her-06', temaId: 'herramientas-digitales', leccionId: 'herramientas-digitales-2', formato: 'simple', dificultad: 2, usos: [...PP],
    enunciado: '¿Qué conjunto describe mejor lo que reúne un entorno virtual de aprendizaje?',
    opciones: [
      'Solo archivos para descargar',
      'Contenidos, actividades, comunicación y evaluación',
      'Solo videoconferencias',
      'Solo el registro de asistencia',
    ],
    correcta: 1,
    explicaciones: [
      'Un EVA es más que un repositorio de archivos.',
      'Correcto: reúne los contenidos, las actividades, la comunicación y la evaluación de un curso.',
      'La videoconferencia puede ser una parte, no el todo.',
      'El seguimiento es una función, pero no la única.',
    ],
  },
  {
    id: 'dg-her-07', temaId: 'herramientas-digitales', leccionId: 'herramientas-digitales-2', formato: 'simple', dificultad: 2, usos: [...PP],
    enunciado: 'Antes de abrir un curso en el aula virtual, ¿qué debe hacer primero el docente?',
    opciones: ['Subir todos los videos que encuentre', 'Planificar objetivos, contenidos y evaluación', 'Crear muchos foros', 'Invitar a los representantes'],
    correcta: 1,
    explicaciones: [
      'Subir material sin plan desordena el curso.',
      'Correcto: la implementación empieza por planificar qué se aprenderá y cómo se evaluará.',
      'Los foros se crean según lo planificado, no al azar.',
      'Puede hacerse, pero no es el primer paso pedagógico.',
    ],
  },
  {
    id: 'dg-her-08', temaId: 'herramientas-digitales', leccionId: 'herramientas-digitales-2', formato: 'simple', dificultad: 3, usos: [...PP],
    enunciado: 'Un docente sube un video al aula virtual para verlo en casa y usa la clase para resolver ejercicios. ¿Qué metodología apoya el EVA?',
    opciones: ['Aula invertida', 'Clase magistral', 'Gamificación', 'Aprendizaje basado en proyectos'],
    correcta: 0,
    explicaciones: [
      'Correcto: en el aula invertida la teoría se revisa en casa y la clase se usa para practicar.',
      'En la clase magistral el docente expone en clase.',
      'La gamificación usa elementos de juego.',
      'El ABP gira alrededor de crear un producto en un tiempo largo.',
    ],
  },
  // ── Herramientas: ofimática (herramientas-digitales-3)
  {
    id: 'dg-her-09', temaId: 'herramientas-digitales', leccionId: 'herramientas-digitales-3', formato: 'simple', dificultad: 1, usos: [...D],
    enunciado: 'Un docente quiere enviar una convocatoria a 35 representantes sin que vean los correos de los demás. ¿En qué campo pone las direcciones?',
    opciones: ['Para', 'CC', 'CCO', 'Asunto'],
    correcta: 2,
    explicaciones: [
      'En «Para» todos ven las direcciones.',
      'CC (copia) también deja ver a todos los destinatarios.',
      'Correcto: CCO (copia oculta) envía el mensaje sin mostrar las direcciones de los demás.',
      'El asunto es el tema del mensaje, no los destinatarios.',
    ],
  },
  {
    id: 'dg-her-10', temaId: 'herramientas-digitales', leccionId: 'herramientas-digitales-3', formato: 'simple', dificultad: 1, usos: [...PP],
    enunciado: '¿Qué fórmula calcula el promedio de las notas que están de la celda B2 a la B30?',
    opciones: ['=SUMA(B2:B30)', '=PROMEDIO(B2:B30)', '=MAX(B2:B30)', '=CONTAR(B2:B30)'],
    correcta: 1,
    explicaciones: [
      'SUMA suma las notas, no las promedia.',
      'Correcto: PROMEDIO calcula la media del rango.',
      'MAX devuelve la nota más alta.',
      'CONTAR cuenta cuántas celdas tienen números.',
    ],
  },
  {
    id: 'dg-her-11', temaId: 'herramientas-digitales', leccionId: 'herramientas-digitales-3', formato: 'simple', dificultad: 2, usos: [...PP],
    enunciado: '¿Qué hace la fórmula =SI(B2>=7, "Aprueba", "Refuerzo")?',
    opciones: [
      'Suma las notas mayores a 7',
      'Escribe «Aprueba» si la nota de B2 es 7 o más; si no, «Refuerzo»',
      'Cuenta cuántos estudiantes aprueban',
      'Calcula el promedio de B2',
    ],
    correcta: 1,
    explicaciones: [
      'SI no suma; evalúa una condición.',
      'Correcto: la función SI devuelve un resultado si la condición se cumple y otro si no.',
      'Para contar se usa CONTAR.SI.',
      'B2 es una sola celda; no hay nada que promediar.',
    ],
  },
  {
    id: 'dg-her-12', temaId: 'herramientas-digitales', leccionId: 'herramientas-digitales-3', formato: 'simple', dificultad: 2, usos: [...PP],
    enunciado: 'Para el apoyo visual de una clase, ¿qué práctica es la más adecuada en una presentación multimedia?',
    opciones: [
      'Copiar todo el texto del libro en las diapositivas',
      'Pocas palabras por diapositiva, con imágenes claras',
      'Usar muchas animaciones en cada línea',
      'Letra pequeña para que quepa más información',
    ],
    correcta: 1,
    explicaciones: [
      'Diapositivas llenas de texto distraen; el estudiante lee en vez de escuchar.',
      'Correcto: la presentación apoya la explicación con ideas clave e imágenes.',
      'El exceso de animaciones distrae del contenido.',
      'La letra pequeña no se lee desde el fondo del aula.',
    ],
  },

  // ── Riesgos en entornos digitales (riesgos-digitales-1)
  {
    id: 'dg-rie-01', temaId: 'riesgos-digitales', leccionId: 'riesgos-digitales-1', formato: 'simple', dificultad: 1, usos: [...D],
    enunciado: 'Un estudiante recibe un correo que imita a su banco y le pide su clave para «actualizar sus datos». ¿Qué riesgo es?',
    opciones: ['Spam', 'Phishing', 'Grooming', 'Tecnoadicción'],
    correcta: 1,
    explicaciones: [
      'El spam es correo masivo no solicitado; aquí lo central es el engaño para robar la clave.',
      'Correcto: el phishing suplanta a una empresa o banco para robar claves y datos.',
      'El grooming es el engaño de un adulto a un menor con fines sexuales.',
      'La tecnoadicción es el uso compulsivo de la tecnología.',
    ],
  },
  {
    id: 'dg-rie-02', temaId: 'riesgos-digitales', leccionId: 'riesgos-digitales-1', formato: 'simple', dificultad: 1, usos: [...D],
    enunciado: 'Un grupo de compañeros publica memes para burlarse de un estudiante y lo hace todas las semanas. ¿Qué riesgo es?',
    opciones: ['Acoso cibernético', 'Plagio académico', 'Phishing', 'Spam'],
    correcta: 0,
    explicaciones: [
      'Correcto: el ciberacoso son burlas o humillaciones repetidas por medios digitales.',
      'El plagio es presentar como propio un trabajo ajeno.',
      'El phishing busca robar datos.',
      'El spam es correo masivo no solicitado.',
    ],
  },
  {
    id: 'dg-rie-03', temaId: 'riesgos-digitales', leccionId: 'riesgos-digitales-1', formato: 'simple', dificultad: 2, usos: [...D],
    enunciado: 'Un adulto con un perfil falso de adolescente se gana la confianza de una estudiante con regalos virtuales, le pide guardar el secreto y luego le pide fotos. ¿Qué riesgo es?',
    opciones: ['Sexteo', 'Grooming', 'Suplantación de identidad entre pares', 'Tecnoadicción'],
    correcta: 1,
    explicaciones: [
      'El sexteo es enviar contenido sexual propio; aquí lo central es el adulto que engaña a una menor.',
      'Correcto: el grooming (engaño pederasta) es un adulto que gana la confianza de un menor con fines sexuales.',
      'Hay un perfil falso, pero el riesgo principal es el abuso de un adulto hacia una menor.',
      'La tecnoadicción es el uso compulsivo de la tecnología.',
    ],
  },
  {
    id: 'dg-rie-04', temaId: 'riesgos-digitales', leccionId: 'riesgos-digitales-1', formato: 'completamiento', dificultad: 1, usos: [...PP],
    enunciado: 'Presentar como propio un ensayo copiado de internet, sin citar la fuente, es ____.',
    opciones: ['spam', 'plagio académico', 'phishing', 'sexteo'],
    correcta: 1,
    explicaciones: [
      'El spam es correo masivo no solicitado.',
      'Correcto: el plagio académico es usar el trabajo de otro sin reconocer a su autor.',
      'El phishing es un fraude para robar datos.',
      'El sexteo es enviar contenido sexual propio.',
    ],
  },
  {
    id: 'dg-rie-05', temaId: 'riesgos-digitales', leccionId: 'riesgos-digitales-1', formato: 'simple', dificultad: 1, usos: [...PP],
    enunciado: 'Alguien crea una cuenta con el nombre y las fotos de una docente y publica mensajes como si fuera ella. ¿Qué riesgo es?',
    opciones: ['Suplantación de identidad', 'Tecnoadicción', 'Spam', 'Plagio académico'],
    correcta: 0,
    explicaciones: [
      'Correcto: hacerse pasar por otra persona con un perfil falso es suplantación de identidad.',
      'La tecnoadicción es un uso compulsivo de la tecnología.',
      'El spam es correo masivo no solicitado.',
      'El plagio es copiar un trabajo sin citar.',
    ],
  },
  {
    id: 'dg-rie-06', temaId: 'riesgos-digitales', leccionId: 'riesgos-digitales-1', formato: 'simple', dificultad: 1, usos: [...PP],
    enunciado: 'Un estudiante se desvela todas las noches jugando en línea, se duerme en clase y se enoja si le quitan el celular. ¿Qué riesgo muestra?',
    opciones: ['Grooming', 'Tecnoadicción', 'Phishing', 'Ciberacoso'],
    correcta: 1,
    explicaciones: [
      'No hay un adulto que lo engañe con fines sexuales.',
      'Correcto: la tecnoadicción es el uso compulsivo que afecta el sueño, los estudios y las relaciones.',
      'No hay un intento de robar sus datos.',
      'No hay burlas ni humillaciones de otros.',
    ],
  },
  {
    id: 'dg-rie-07', temaId: 'riesgos-digitales', leccionId: 'riesgos-digitales-1', formato: 'simple', dificultad: 1, usos: [...PP],
    enunciado: 'La bandeja de entrada se llena de mensajes de publicidad que nadie pidió. ¿Cómo se llama ese correo?',
    opciones: ['Phishing', 'Spam o correo basura', 'Grooming', 'Sexteo'],
    correcta: 1,
    explicaciones: [
      'El phishing busca robar datos haciéndose pasar por una entidad.',
      'Correcto: el spam son mensajes masivos no solicitados.',
      'El grooming es el engaño de un adulto a un menor.',
      'El sexteo es enviar contenido sexual propio.',
    ],
  },
  {
    id: 'dg-rie-08', temaId: 'riesgos-digitales', leccionId: 'riesgos-digitales-1', formato: 'simple', dificultad: 1, usos: [...PP],
    enunciado: '¿Para qué sirve un antivirus actualizado?',
    opciones: [
      'Para navegar más rápido',
      'Para detectar y eliminar programas maliciosos',
      'Para guardar las contraseñas en público',
      'Para evitar el ciberacoso entre compañeros',
    ],
    correcta: 1,
    explicaciones: [
      'No acelera la conexión.',
      'Correcto: el antivirus detecta, bloquea y elimina software malicioso.',
      'Las contraseñas nunca deben estar en público.',
      'El ciberacoso se previene con educación y acompañamiento, no con un antivirus.',
    ],
  },
  {
    id: 'dg-rie-09', temaId: 'riesgos-digitales', leccionId: 'riesgos-digitales-1', formato: 'simple', dificultad: 2, usos: [...PP],
    enunciado: 'Una estudiante cuenta que un desconocido le pide fotos íntimas. ¿Qué debe hacer primero el docente?',
    opciones: [
      'Escribirle al desconocido para enfrentarlo',
      'Escucharla, guardar evidencias y reportar al DECE y a las autoridades',
      'Pedirle que borre todo y olvidarse del tema',
      'Contarlo al grupo para prevenir a los demás',
    ],
    correcta: 1,
    explicaciones: [
      'Enfrentar al agresor puede poner en riesgo a la estudiante y borrar pruebas.',
      'Correcto: se protege a la estudiante, se guardan las evidencias y se activa la ruta con el DECE y las autoridades.',
      'Borrar todo elimina las evidencias y deja el caso sin atender.',
      'Exponer el caso vulnera la intimidad de la estudiante.',
    ],
  },
  {
    id: 'dg-rie-10', temaId: 'riesgos-digitales', leccionId: 'riesgos-digitales-1', formato: 'simple', dificultad: 2, usos: [...PP],
    enunciado: 'Dos adolescentes se envían fotos íntimas propias por mensaje. ¿Qué riesgo es?',
    opciones: ['Sexteo', 'Spam', 'Plagio académico', 'Phishing'],
    correcta: 0,
    explicaciones: [
      'Correcto: el sexteo (sexting) es enviar o compartir fotos o videos de contenido sexual propios.',
      'El spam es correo masivo no solicitado.',
      'El plagio es copiar un trabajo sin citar.',
      'El phishing busca robar datos.',
    ],
  },
];
