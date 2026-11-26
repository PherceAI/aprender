import {tema} from '../estructura-helpers';
import type {Bloque, Especialidad} from '../tipos';

// Ficha técnica Ineval 2026, especialidad Educación General Básica (2.º a 7.º año), sección 4.2:
// Conocimientos disciplinares. Una sola prueba de 60 preguntas que mezcla cuatro asignaturas
// (subniveles Elemental y Media). Cada lección es un subtema de la ficha, en el mismo orden.
// El PDF está en fuentes/Ficha EGB 2do a 7mo.pdf.

export const EGB: Especialidad = {
  id: 'egb-elemental-media',
  nombre: 'Educación General Básica',
  nivel: '2.º a 7.º año (Elemental y Media)',
  // Se activa cuando tenga su diagnóstico completo (docs/plan-egb.md, fase 6).
  estado: 'proximamente',
  orden: 2,
  bloques: ['generales', 'egb-disciplinares'],
};

const MAT = 'Matemática';
const LEN = 'Lengua y Literatura';
const CN = 'Ciencias Naturales';
const CS = 'Ciencias Sociales';

export const EGB_DISCIPLINARES: Bloque = {
  id: 'egb-disciplinares',
  nombre: 'Conocimientos de Educación General Básica',
  descripcion: 'Matemática, Lengua y Literatura, Ciencias Naturales y Ciencias Sociales, de 2.º a 7.º año.',
  compartido: false,
  preguntasExamen: 60,
  minutosExamen: 120,
  unidades: [
    // ───────────── 4.2.1 Matemática ─────────────
    {
      id: 'egb-algebra',
      asignatura: MAT,
      nombre: 'Álgebra y funciones',
      temas: [
        tema('egb-conjuntos-numericos', 'Conjuntos numéricos', [
          ['Operaciones con números enteros', 'Resolver operaciones combinadas con números enteros.'],
          ['Potencias y raíces con números naturales', 'Resolver operaciones combinadas con números naturales que incluyen potenciación y radicación.'],
          ['Operaciones con fracciones', 'Resolver operaciones combinadas con números racionales en fracciones.'],
        ]),
        tema('egb-proporcionalidad', 'Proporcionalidad y porcentajes', [
          ['Proporcionalidad directa e inversa', 'Resolver problemas cotidianos de proporcionalidad directa e inversa.'],
          ['Porcentajes', 'Resolver problemas cotidianos con porcentajes.'],
        ]),
      ],
    },
    {
      id: 'egb-geometria',
      asignatura: MAT,
      nombre: 'Geometría y medida',
      temas: [
        tema('egb-figuras-geometricas', 'Figuras geométricas', [
          ['Perímetros', 'Resolver problemas de perímetros de círculos, triángulos, cuadriláteros y polígonos.'],
          ['Áreas', 'Resolver problemas de áreas de círculos, triángulos, cuadriláteros y polígonos regulares.'],
        ]),
        tema('egb-cuerpos-geometricos', 'Cuerpos geométricos', [
          ['Volúmenes', 'Resolver problemas de volumen de pirámides, prismas, conos, cilindros y esferas.'],
          ['La fórmula de Euler', 'Aplicar la fórmula de Euler en poliedros regulares.'],
        ]),
        tema('egb-recta-plano', 'Recta y plano', [
          ['Posición entre dos rectas', 'Reconocer la posición relativa entre dos rectas.'],
          ['Clasificación de los ángulos', 'Clasificar los ángulos.'],
        ]),
        tema('egb-medidas', 'Medidas de longitud, área, volumen, masa, tiempo y angulares', [
          ['Longitud, masa y tiempo', 'Convertir y usar las unidades fundamentales del Sistema Internacional (longitud, masa y tiempo) sin notación científica.'],
          ['Superficie y volumen', 'Convertir unidades de superficie y volumen en el Sistema Internacional.'],
        ]),
      ],
    },
    {
      id: 'egb-estadistica',
      asignatura: MAT,
      nombre: 'Estadística y probabilidad',
      temas: [
        tema('egb-estadistica-datos', 'Gráficos estadísticos, tablas de frecuencias, medidas de tendencia central y dispersión', [
          ['Tendencia central y dispersión', 'Aplicar las medidas de tendencia central y de dispersión en datos agrupados y no agrupados.'],
        ]),
        tema('egb-combinaciones', 'Combinaciones simples', [
          ['Combinaciones', 'Comprender y aplicar las combinaciones simples.'],
        ]),
        tema('egb-probabilidad', 'Probabilidad', [
          ['Probabilidad clásica', 'Comprender y aplicar la probabilidad clásica.'],
        ]),
      ],
    },

    // ───────────── 4.2.2 Lengua y Literatura ─────────────
    {
      id: 'egb-lengua-cultura',
      asignatura: LEN,
      nombre: 'Lengua y cultura',
      temas: [
        tema('egb-variedades-linguisticas', 'Variedades lingüísticas', [
          ['Tipos de variedades lingüísticas', 'Reconocer los tipos de variedades lingüísticas.'],
          ['La diglosia en Ecuador', 'Reconocer la diglosia en las manifestaciones culturales o identitarias de Ecuador.'],
        ]),
        tema('egb-cultura-escrita', 'Cultura escrita', [
          ['Funciones del lenguaje', 'Reconocer las funciones del lenguaje.'],
        ]),
      ],
    },
    {
      id: 'egb-comunicacion-oral',
      asignatura: LEN,
      nombre: 'Comunicación oral',
      temas: [
        tema('egb-lengua-interaccion', 'La lengua en interacción social', [
          ['Formatos de la comunicación oral', 'Reconocer las características de los formatos de la comunicación oral.'],
        ]),
        tema('egb-expresion-oral', 'Expresión oral', [
          ['Elementos de la comunicación', 'Reconocer los elementos de la comunicación.'],
        ]),
      ],
    },
    {
      id: 'egb-lectura',
      asignatura: LEN,
      nombre: 'Lectura',
      temas: [
        tema('egb-comprension-textos', 'Comprensión de textos', [
          ['Tema, ideas y argumentos', 'Identificar el tema, la idea principal, las ideas secundarias, los argumentos y las propiedades textuales.'],
          ['Relaciones semánticas', 'Diferenciar la sinonimia, la antonimia, la homonimia y la paronimia.'],
        ]),
        tema('egb-uso-recursos', 'Uso de recursos', [
          ['Fuentes de información', 'Diferenciar las fuentes de información primarias, secundarias y terciarias.'],
        ]),
      ],
    },
    {
      id: 'egb-escritura',
      asignatura: LEN,
      nombre: 'Escritura',
      temas: [
        tema('egb-produccion-textos', 'Producción de textos', [
          ['Tipos de texto', 'Clasificar los tipos de texto.'],
          ['Citas y referencias', 'Aplicar las normas de citación y referencias bibliográficas.'],
          ['Palabras variables e invariables', 'Reconocer los tipos de palabras variables e invariables.'],
          ['Tipos de oraciones', 'Reconocer los tipos de oraciones.'],
        ]),
      ],
    },
    {
      id: 'egb-literatura',
      asignatura: LEN,
      nombre: 'Literatura',
      temas: [
        tema('egb-literatura-contexto', 'Literatura en contexto', [
          ['Géneros literarios', 'Clasificar los géneros literarios.'],
          ['Figuras literarias', 'Reconocer las figuras literarias.'],
        ]),
      ],
    },

    // ───────────── 4.2.3 Ciencias Naturales ─────────────
    {
      id: 'egb-seres-vivos',
      asignatura: CN,
      nombre: 'Los seres vivos y su ambiente',
      temas: [
        tema('egb-clasificacion-animales', 'Clasificación de los animales', [
          ['Invertebrados', 'Clasificar los animales invertebrados.'],
          ['Vertebrados', 'Clasificar los animales vertebrados.'],
        ]),
        tema('egb-plantas', 'Plantas: clasificación y funciones vitales', [
          ['Funciones vitales de las plantas', 'Explicar la fotosíntesis, la nutrición, la respiración y la reproducción de las plantas.'],
          ['Clasificación de las plantas', 'Clasificar las plantas.'],
        ]),
        tema('egb-ecosistemas', 'Ecosistemas y flujo de energía', [
          ['La cadena trófica', 'Explicar el funcionamiento de una cadena trófica.'],
          ['Interacciones entre seres vivos', 'Diferenciar las interacciones interespecíficas e intraespecíficas.'],
        ]),
      ],
    },
    {
      id: 'egb-cuerpo-humano',
      asignatura: CN,
      nombre: 'Cuerpo humano y salud',
      temas: [
        tema('egb-sistemas-cuerpo', 'Sistemas del cuerpo humano', [
          ['Órganos y sistemas', 'Relacionar los órganos con su función en los sistemas del cuerpo humano.'],
        ]),
        tema('egb-organos-sentidos', 'Órganos de los sentidos', [
          ['Los órganos de los sentidos', 'Reconocer la estructura de los órganos de los sentidos.'],
        ]),
      ],
    },
    {
      id: 'egb-materia',
      asignatura: CN,
      nombre: 'La materia',
      temas: [
        tema('egb-materia-estados', 'Clasificación, propiedades y estados de la materia', [
          ['Clasificación de la materia', 'Clasificar la materia.'],
          ['Propiedades de la materia', 'Reconocer las propiedades de la materia.'],
          ['Cambios de estado', 'Explicar los cambios de estado de la materia.'],
        ]),
      ],
    },
    {
      id: 'egb-tierra',
      asignatura: CN,
      nombre: 'La Tierra',
      temas: [
        tema('egb-atmosfera-clima-suelo', 'La atmósfera, el clima y el suelo', [
          ['Capas de la atmósfera', 'Reconocer las características de las capas atmosféricas.'],
          ['Factores del clima', 'Explicar los factores del clima.'],
          ['Tipos de suelos', 'Reconocer los tipos de suelos.'],
          ['Estructura de la Tierra', 'Reconocer la estructura de la Tierra.'],
        ]),
      ],
    },

    // ───────────── 4.2.4 Ciencias Sociales ─────────────
    {
      id: 'egb-historia',
      asignatura: CS,
      nombre: 'Historia e identidad',
      temas: [
        tema('egb-epoca-aborigen', 'Época aborigen en Ecuador', [
          ['Los primeros pobladores', 'Explicar la organización económica y social de los primeros pobladores.'],
          ['Sociedades agrícolas aborígenes', 'Explicar la organización económica y social de las sociedades agrícolas aborígenes.'],
          ['La dominación incaica', 'Explicar la organización económica, política y social durante la dominación incaica.'],
        ]),
        tema('egb-epoca-colonial', 'Época colonial en Ecuador', [
          ['La administración colonial', 'Reconocer las características del sistema administrativo colonial español.'],
          ['Conquista y colonización', 'Explicar los cambios producidos durante el proceso de conquista y colonización.'],
          ['Emancipación de la Real Audiencia de Quito', 'Reconocer las características del proceso de emancipación de la Real Audiencia de Quito.'],
        ]),
        tema('egb-independencia', 'Independencia e integración en Ecuador', [
          ['La Gran Colombia', 'Explicar el proyecto bolivariano: la integración, las características y la desintegración de la Gran Colombia.'],
        ]),
        tema('egb-periodo-republicano', 'Periodo republicano en Ecuador', [
          ['Estado oligárquico terrateniente', 'Explicar los aspectos sociales, políticos y económicos de los periodos del Estado oligárquico terrateniente.'],
          ['Estado liberal mestizo', 'Explicar los aspectos sociales, políticos y económicos de los periodos del Estado liberal mestizo.'],
          ['De 1972 hasta hoy', 'Explicar los aspectos sociales, políticos y económicos de los gobiernos del periodo republicano desde 1972 hasta la actualidad.'],
        ]),
      ],
    },
    {
      id: 'egb-espacio',
      asignatura: CS,
      nombre: 'Los seres humanos en el espacio',
      temas: [
        tema('egb-recursos-economicos', 'Recursos económicos de Ecuador', [
          ['Sectores de producción', 'Relacionar los sectores de producción con los bienes, recursos y servicios.'],
        ]),
        tema('egb-geografia', 'Características geográficas de Ecuador', [
          ['La geografía de Ecuador', 'Reconocer las características geográficas de Ecuador: relieve, suelo, regiones naturales, hidrografía, clima, pisos climáticos y estructura geológica.'],
        ]),
        tema('egb-division-politica', 'División político-administrativa de Ecuador', [
          ['División política', 'Reconocer la división política de Ecuador.'],
          ['Gobiernos autónomos descentralizados', 'Explicar la estructura y las funciones de los gobiernos autónomos descentralizados.'],
        ]),
      ],
    },
    {
      id: 'egb-convivencia',
      asignatura: CS,
      nombre: 'Convivencia',
      temas: [
        tema('egb-estado', 'El Estado ecuatoriano', [
          ['Las funciones del Estado', 'Reconocer las atribuciones y responsabilidades de las funciones Ejecutiva, Legislativa, Judicial, Electoral, y de Transparencia y Control Social.'],
        ]),
        tema('egb-derechos', 'Derechos y responsabilidades', [
          ['Derechos y responsabilidades', 'Reconocer los derechos y responsabilidades de los ecuatorianos.'],
        ]),
        tema('egb-diversidad-cultural', 'Diversidad cultural', [
          ['Organizaciones sociales', 'Reconocer la participación de las organizaciones sociales en Ecuador.'],
          ['Términos de la diversidad cultural', 'Reconocer los términos asociados a la diversidad cultural en el contexto ecuatoriano y latinoamericano.'],
        ]),
      ],
    },
  ],
};
