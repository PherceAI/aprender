import type {Cuatro, Formato, Pregunta} from '../tipos';

// Diagnóstico de entrada de EGB 2.º a 7.º: una pregunta por cada uno de los 34 temas disciplinares de la
// ficha (págs. 6 a 9), en los cinco formatos del Ineval. Se suma a las 13 de Conocimientos generales.
// Contenido escrito por el equipo a partir de los subtemas de la ficha: lo revisa el docente experto.

type Extra = {formato?: Formato; elementos?: Pregunta['elementos']; solucion?: number[]; dificultad?: 1 | 2 | 3};

/** Pregunta del diagnóstico: sirve también para practicar la lección cuando el tema se abra. */
const d = (
  n: number,
  leccionId: string,
  enunciado: string,
  opciones: Cuatro<string>,
  correcta: 0 | 1 | 2 | 3,
  explicaciones: Cuatro<string>,
  extra: Extra = {}
): Pregunta => ({
  id: `diag-egb-${String(n).padStart(2, '0')}`,
  temaId: leccionId.replace(/-\d+$/, ''),
  leccionId,
  formato: extra.formato ?? 'simple',
  dificultad: extra.dificultad ?? 1,
  usos: ['diagnostico', 'practica'],
  enunciado,
  opciones,
  correcta,
  explicaciones,
  ...(extra.elementos ? {elementos: extra.elementos} : {}),
  ...(extra.solucion ? {solucion: extra.solucion} : {}),
});

export const DIAGNOSTICO_EGB: Pregunta[] = [
  // ───────────── Matemática ─────────────
  d(1, 'egb-conjuntos-numericos-1', '¿Cuál es el resultado de −8 + 3 × (−4) − (−6)?', ['−14', '26', '−26', '10'], 0, [
    'Correcto: primero la multiplicación, 3 × (−4) = −12. Luego −8 − 12 + 6 = −14.',
    'Operó de izquierda a derecha sin respetar la jerarquía: (−8 + 3) × (−4) − (−6).',
    'Restar un negativo es sumar su opuesto: − (−6) es + 6, no − 6.',
    'Cambió el signo de la multiplicación: 3 × (−4) es −12, no 12.',
  ]),
  d(2, 'egb-proporcionalidad-2', 'Una camisa cuesta $40 y tiene un descuento del 15 %. ¿Cuánto se paga?', ['$34', '$25', '$6', '$46'], 0, [
    'Correcto: se paga el 85 % del precio, 40 × 0,85 = $34.',
    'Restó 15 dólares, no el 15 %.',
    'Ese es el descuento (15 % de 40), no lo que se paga.',
    'Sumó el 15 % en lugar de restarlo.',
  ]),
  d(3, 'egb-figuras-geometricas-2', 'El área de un triángulo de 10 cm de base y 6 cm de altura es ____.', ['30 cm²', '60 cm²', '16 cm²', '15 cm²'], 0, [
    'Correcto: (base × altura) ÷ 2 = (10 × 6) ÷ 2 = 30 cm².',
    'Olvidó dividir para 2: 10 × 6 es el área del rectángulo.',
    'Sumó base y altura en lugar de multiplicarlas.',
    'Dividió para 4 en lugar de dividir para 2.',
  ], {formato: 'completamiento'}),
  d(4, 'egb-cuerpos-geometricos-2', 'Un poliedro regular tiene 8 caras y 6 vértices. Según la fórmula de Euler, ¿cuántas aristas tiene?', ['12', '14', '16', '10'], 0, [
    'Correcto: C + V = A + 2, entonces 8 + 6 = A + 2 y A = 12. Es el octaedro.',
    'Sumó caras y vértices, pero falta restar 2.',
    'Sumó 2 en lugar de restarlo.',
    'Restó 4: en la fórmula de Euler se resta 2.',
  ], {dificultad: 2}),
  d(5, 'egb-recta-plano-2', 'Relaciona cada ángulo con su clasificación.', ['1b, 2d, 3c, 4a', '1b, 2c, 3d, 4a', '1d, 2b, 3c, 4a', '1b, 2d, 3a, 4c'], 0, [
    'Correcto: 35° es agudo, 90° recto, 120° obtuso y 180° llano.',
    'Un ángulo de 90° es recto y uno de 120° es obtuso: están cruzados.',
    'Un ángulo de 35° (menos de 90°) es agudo, no recto.',
    'Un ángulo de 120° está entre 90° y 180°: es obtuso, no llano.',
  ], {formato: 'emparejamiento', elementos: {izquierda: ['35°', '90°', '120°', '180°'], derecha: ['Llano', 'Agudo', 'Obtuso', 'Recto']}, solucion: [1, 3, 2, 0]}),
  d(6, 'egb-medidas-2', '¿Cuántos centímetros cuadrados hay en 1 m²?', ['10 000', '100', '1 000', '1 000 000'], 0, [
    'Correcto: 1 m = 100 cm, así que 1 m² = 100 cm × 100 cm = 10 000 cm².',
    'Esa es la equivalencia de longitud (1 m = 100 cm), no de superficie.',
    '1 000 es la equivalencia entre m³ y dm³, no entre m² y cm².',
    'Esa es la equivalencia entre m³ y cm³.',
  ]),
  d(7, 'egb-estadistica-datos-1', 'Las notas de cinco estudiantes son 6, 8, 8, 9 y 4. ¿Cuál es la media aritmética?', ['7', '8', '35', '5'], 0, [
    'Correcto: (6 + 8 + 8 + 9 + 4) ÷ 5 = 35 ÷ 5 = 7.',
    '8 es la moda y también la mediana, no la media.',
    'Esa es la suma; falta dividir para el número de datos.',
    'Ese es el rango (9 − 4), una medida de dispersión.',
  ]),
  d(8, 'egb-combinaciones-1', '¿De cuántas maneras se pueden elegir 2 estudiantes de un grupo de 5, si el orden no importa?', ['10', '20', '25', '7'], 0, [
    'Correcto: C(5, 2) = (5 × 4) ÷ 2 = 10.',
    'Contó el orden: 5 × 4 = 20 son variaciones; cada pareja aparece dos veces.',
    '5² cuenta parejas con repetición y con orden.',
    'Sumó 5 + 2: las combinaciones no se calculan sumando.',
  ], {dificultad: 2}),
  d(9, 'egb-probabilidad-1', 'En una funda hay 3 bolas rojas, 5 azules y 2 verdes. Si se saca una al azar, ¿cuál es la probabilidad de que sea azul?', ['1/2', '1/3', '5/2', '3/10'], 0, [
    'Correcto: 5 casos favorables de 10 posibles, 5/10 = 1/2.',
    'No basta con contar colores: hay más bolas azules que de los otros colores.',
    'Una probabilidad nunca es mayor que 1: dividió casos favorables para los que no lo son.',
    'Esa es la probabilidad de sacar una bola roja.',
  ]),

  // ───────────── Lengua y Literatura ─────────────
  d(10, 'egb-variedades-linguisticas-1', 'Relaciona cada variedad lingüística con lo que la determina.', ['1b, 2c, 3a', '1a, 2b, 3c', '1c, 2b, 3a', '1b, 2a, 3c'], 0, [
    'Correcto: diatópica, por el lugar; diastrática, por el grupo social; diafásica, por la situación.',
    'La diatópica depende del lugar (topos), no de la situación.',
    'La diatópica es la geográfica; la diastrática es la social.',
    'La diastrática depende del nivel social o educativo, no de la situación formal o informal.',
  ], {formato: 'emparejamiento', dificultad: 2, elementos: {izquierda: ['Diatópica', 'Diastrática', 'Diafásica'], derecha: ['La situación de comunicación (formal o informal)', 'El lugar o la región del hablante', 'El nivel social o educativo del hablante']}, solucion: [1, 2, 0]}),
  d(11, 'egb-cultura-escrita-1', '«¡Qué hermoso atardecer!». ¿Qué función del lenguaje predomina?', ['Expresiva o emotiva', 'Referencial o informativa', 'Apelativa o conativa', 'Metalingüística'], 0, [
    'Correcto: el hablante expresa lo que siente; predomina la función expresiva.',
    'La referencial informa datos objetivos, sin emoción.',
    'La apelativa busca que el oyente haga algo (una orden, un pedido).',
    'La metalingüística usa la lengua para hablar de la propia lengua.',
  ]),
  d(12, 'egb-lengua-interaccion-1', 'Dos grupos defienden posturas contrarias sobre un tema, con turnos de palabra que regula un moderador. ¿Qué formato de comunicación oral es?', ['Debate', 'Conferencia', 'Entrevista', 'Exposición oral'], 0, [
    'Correcto: en el debate se confrontan posturas opuestas con argumentos, guiados por un moderador.',
    'En la conferencia una persona experta expone ante un público.',
    'En la entrevista una persona pregunta y otra responde.',
    'En la exposición oral una persona presenta un tema; no hay posturas enfrentadas.',
  ]),
  d(13, 'egb-expresion-oral-1', 'Relaciona cada elemento de la comunicación con su definición.', ['1b, 2d, 3c, 4a', '1d, 2b, 3c, 4a', '1b, 2d, 3a, 4c', '1c, 2d, 3b, 4a'], 0, [
    'Correcto: emisor, quien envía; receptor, quien recibe; mensaje, lo que se comunica; canal, el medio físico.',
    'Emisor y receptor están cruzados: el emisor produce el mensaje.',
    'El mensaje es lo que se comunica; el canal es el medio por el que viaja.',
    'El emisor produce el mensaje; no es el mensaje.',
  ], {formato: 'emparejamiento', elementos: {izquierda: ['Emisor', 'Receptor', 'Mensaje', 'Canal'], derecha: ['Medio físico por el que viaja el mensaje', 'Quien produce y envía el mensaje', 'Lo que se comunica', 'Quien recibe e interpreta el mensaje']}, solucion: [1, 3, 2, 0]}),
  d(14, 'egb-comprension-textos-2', '«Votar» (elegir) y «botar» (lanzar) suenan igual, se escriben distinto y significan cosas distintas. ¿Qué relación semántica tienen?', ['Homonimia', 'Paronimia', 'Sinonimia', 'Antonimia'], 0, [
    'Correcto: son homónimas homófonas, porque suenan igual y significan distinto.',
    'Los parónimos se parecen en el sonido, pero no son iguales (por ejemplo, actitud y aptitud).',
    'Los sinónimos significan lo mismo.',
    'Los antónimos significan lo contrario.',
  ], {dificultad: 2}),
  d(15, 'egb-uso-recursos-1', '¿Cuáles son fuentes primarias para estudiar la Independencia?', ['1, 3 y 5', '2 y 4', '1, 2 y 3', '3, 4 y 5'], 0, [
    'Correcto: el diario, la entrevista al testigo y la fotografía se produjeron durante el hecho o por quien lo vivió.',
    'La enciclopedia (terciaria) y el libro de texto (secundaria) resumen y analizan otras fuentes.',
    'La enciclopedia es una fuente terciaria: recopila información de otras fuentes.',
    'El libro de texto es una fuente secundaria: interpreta fuentes primarias.',
  ], {formato: 'seleccion', elementos: ['El diario personal de un soldado de 1822', 'Una enciclopedia', 'Una entrevista a un testigo del hecho', 'Un libro de texto escolar de historia', 'Una fotografía tomada durante el evento'], solucion: [0, 2, 4]}),
  d(16, 'egb-produccion-textos-3', '¿Cuáles son palabras invariables?', ['2, 4 y 5', '1 y 3', '1, 2 y 3', '3, 4 y 5'], 0, [
    'Correcto: el adverbio, la preposición y la conjunción no cambian de forma.',
    'El sustantivo y el verbo son variables: mesa/mesas, canto/cantamos.',
    'El sustantivo y el verbo cambian de forma; solo el adverbio es invariable aquí.',
    'El verbo cambia de forma según la persona y el tiempo.',
  ], {formato: 'seleccion', elementos: ['Mesa', 'Rápidamente', 'Cantar', 'Desde', 'Y'], solucion: [1, 3, 4]}),
  d(17, 'egb-literatura-contexto-2', 'Relaciona cada verso con la figura literaria que usa.', ['1b, 2c, 3a', '1a, 2c, 3b', '1c, 2b, 3a', '1b, 2a, 3c'], 0, [
    'Correcto: los ojos «son» luceros (metáfora), el viento susurra como una persona (personificación) y «un millón de veces» exagera (hipérbole).',
    'Decir que los ojos son luceros no exagera: los identifica con otra cosa. Es metáfora.',
    'El viento que susurra recibe una acción humana: es personificación, no metáfora.',
    '«Un millón de veces» exagera: es hipérbole.',
  ], {formato: 'emparejamiento', elementos: {izquierda: ['«Tus ojos son dos luceros»', '«El viento susurraba secretos»', '«Te lo he dicho un millón de veces»'], derecha: ['Hipérbole', 'Metáfora', 'Personificación']}, solucion: [1, 2, 0]}),

  // ───────────── Ciencias Naturales ─────────────
  d(18, 'egb-clasificacion-animales-2', '¿Cuáles de estos animales son mamíferos?', ['1, 3 y 5', '1, 2 y 5', '2, 3 y 4', '3 y 4'], 0, [
    'Correcto: el delfín, el murciélago y la ballena tienen pelo, respiran por pulmones y amamantan a sus crías.',
    'El tiburón es un pez cartilaginoso: respira por branquias.',
    'El tiburón es un pez y el pingüino es un ave.',
    'El pingüino es un ave aunque no vuele.',
  ], {formato: 'seleccion', elementos: ['Delfín', 'Tiburón', 'Murciélago', 'Pingüino', 'Ballena'], solucion: [0, 2, 4]}),
  d(19, 'egb-plantas-1', 'En la fotosíntesis, las plantas toman dióxido de carbono y agua y, con la energía de la luz, producen glucosa y liberan ____.', ['oxígeno', 'dióxido de carbono', 'nitrógeno', 'hidrógeno'], 0, [
    'Correcto: el oxígeno que respiramos sale de la fotosíntesis.',
    'El dióxido de carbono es lo que la planta toma, no lo que libera.',
    'El nitrógeno no es un producto de la fotosíntesis.',
    'El hidrógeno del agua queda en la glucosa; no se libera.',
  ], {formato: 'completamiento'}),
  d(20, 'egb-ecosistemas-1', 'Ordena esta cadena trófica empezando por el productor.', ['2, 4, 5, 3, 1', '2, 5, 4, 3, 1', '1, 3, 5, 4, 2', '2, 4, 3, 5, 1'], 0, [
    'Correcto: hierba → saltamontes → rana → culebra → águila.',
    'La rana come al saltamontes: el saltamontes va antes.',
    'Está al revés: la cadena empieza por el productor, la hierba.',
    'La culebra come a la rana: la rana va antes.',
  ], {formato: 'ordenamiento', dificultad: 2, elementos: ['Águila', 'Hierba', 'Culebra', 'Saltamontes', 'Rana'], solucion: [1, 3, 4, 2, 0]}),
  d(21, 'egb-sistemas-cuerpo-1', 'Relaciona cada órgano con su función.', ['1b, 2d, 3a, 4c', '1b, 2a, 3d, 4c', '1d, 2b, 3a, 4c', '1c, 2d, 3a, 4b'], 0, [
    'Correcto: corazón, bombea; pulmones, intercambian gases; riñones, filtran; estómago, digiere.',
    'Los pulmones intercambian gases; los riñones filtran la sangre.',
    'El corazón bombea la sangre; el intercambio de gases ocurre en los pulmones.',
    'El estómago digiere y el corazón bombea: están cruzados.',
  ], {formato: 'emparejamiento', elementos: {izquierda: ['Corazón', 'Pulmones', 'Riñones', 'Estómago'], derecha: ['Filtran la sangre y forman la orina', 'Bombea la sangre a todo el cuerpo', 'Digiere los alimentos con los jugos gástricos', 'Intercambian oxígeno y dióxido de carbono']}, solucion: [1, 3, 0, 2]}),
  d(22, 'egb-organos-sentidos-1', '¿En qué parte del ojo se forma la imagen gracias a los conos y los bastones?', ['La retina', 'La córnea', 'El iris', 'El cristalino'], 0, [
    'Correcto: en la retina están los conos (color) y los bastones (luz tenue), que convierten la luz en impulsos nerviosos.',
    'La córnea es la capa transparente del frente: deja pasar y desvía la luz.',
    'El iris es la parte de color que regula el tamaño de la pupila.',
    'El cristalino es la lente que enfoca la imagen sobre la retina.',
  ]),
  d(23, 'egb-materia-estados-3', 'Relaciona cada cambio con su nombre.', ['1a, 2d, 3b, 4c', '1a, 2b, 3d, 4c', '1c, 2d, 3b, 4a', '1d, 2a, 3b, 4c'], 0, [
    'Correcto: fusión, vaporización, condensación y solidificación.',
    'De líquido a gas es vaporización; la condensación es de gas a líquido.',
    'De sólido a líquido es fusión; la solidificación es lo contrario.',
    'La fusión pasa de sólido a líquido, no de líquido a gas.',
  ], {formato: 'emparejamiento', elementos: {izquierda: ['De sólido a líquido', 'De líquido a gas', 'De gas a líquido', 'De líquido a sólido'], derecha: ['Fusión', 'Condensación', 'Solidificación', 'Vaporización']}, solucion: [0, 3, 1, 2]}),
  d(24, 'egb-atmosfera-clima-suelo-1', 'Ordena las capas de la atmósfera desde la superficie de la Tierra hacia arriba.', ['2, 4, 1, 3', '2, 1, 4, 3', '4, 2, 1, 3', '2, 4, 3, 1'], 0, [
    'Correcto: tropósfera, estratósfera, mesósfera y termósfera.',
    'Sobre la tropósfera está la estratósfera, donde está la capa de ozono.',
    'La capa más cercana a la superficie es la tropósfera, donde ocurre el clima.',
    'La mesósfera está debajo de la termósfera.',
  ], {formato: 'ordenamiento', elementos: ['Mesósfera', 'Tropósfera', 'Termósfera', 'Estratósfera'], solucion: [1, 3, 0, 2]}),

  // ───────────── Ciencias Sociales ─────────────
  d(25, 'egb-epoca-aborigen-3', 'Durante la dominación incaica, ¿cómo se llamaba el trabajo obligatorio por turnos que las comunidades prestaban al Estado?', ['Mita', 'Minga', 'Ayni', 'Encomienda'], 0, [
    'Correcto: la mita era el trabajo por turnos para el Estado inca (obras, minas, ejército).',
    'La minga es el trabajo comunitario y voluntario para un bien común.',
    'El ayni es la ayuda recíproca entre familias: hoy te ayudo, mañana me ayudas.',
    'La encomienda es una institución de la Colonia española, no del incario.',
  ]),
  d(26, 'egb-epoca-colonial-1', '¿Qué institución gobernaba el territorio del actual Ecuador durante la Colonia?', ['La Real Audiencia de Quito', 'La Gran Colombia', 'El Virreinato de Nueva España', 'El Tahuantinsuyo'], 0, [
    'Correcto: la Real Audiencia de Quito, creada en 1563, dependía de un virreinato.',
    'La Gran Colombia se formó después de la Independencia.',
    'El Virreinato de Nueva España gobernaba México y Centroamérica.',
    'El Tahuantinsuyo fue el Estado inca, anterior a la conquista.',
  ]),
  d(27, 'egb-independencia-1', '¿En qué año el Ecuador se separó de la Gran Colombia y se constituyó como Estado?', ['1830', '1809', '1822', '1820'], 0, [
    'Correcto: en 1830 el Distrito del Sur se separó de la Gran Colombia y nació el Estado ecuatoriano.',
    'En 1809 fue el Primer Grito de Independencia en Quito.',
    'En 1822 fue la Batalla de Pichincha; después Quito se unió a la Gran Colombia.',
    'En 1820 se independizó Guayaquil.',
  ]),
  d(28, 'egb-periodo-republicano-2', '¿Quién encabezó la Revolución Liberal de 1895?', ['Eloy Alfaro', 'Gabriel García Moreno', 'Juan José Flores', 'Vicente Rocafuerte'], 0, [
    'Correcto: Eloy Alfaro lideró la Revolución Liberal, que inició el Estado liberal.',
    'García Moreno fue el gran líder conservador, antes del liberalismo.',
    'Juan José Flores fue el primer presidente del Ecuador (1830).',
    'Rocafuerte fue presidente entre 1835 y 1839, antes de la Revolución Liberal.',
  ]),
  d(29, 'egb-recursos-economicos-1', '¿Cuáles actividades pertenecen al sector primario?', ['2, 4 y 5', '1, 2 y 4', '1 y 3', '2, 3 y 5'], 0, [
    'Correcto: cultivar banano, extraer petróleo y pescar atún obtienen recursos directamente de la naturaleza.',
    'Fabricar chocolate transforma materias primas: es del sector secundario.',
    'Fabricar es del sector secundario y el turismo es un servicio (terciario).',
    'El turismo es un servicio: pertenece al sector terciario.',
  ], {formato: 'seleccion', elementos: ['Fabricación de chocolate', 'Cultivo de banano', 'Turismo', 'Extracción de petróleo', 'Pesca de atún'], solucion: [1, 3, 4]}),
  d(30, 'egb-geografia-1', 'Relaciona cada región natural del Ecuador con su característica.', ['1c, 2b, 3d, 4a', '1c, 2d, 3b, 4a', '1b, 2c, 3d, 4a', '1a, 2b, 3d, 4c'], 0, [
    'Correcto: Costa, llanuras cálidas; Sierra, los Andes; Amazonía, selva; Galápagos, islas volcánicas.',
    'La cordillera de los Andes atraviesa la Sierra; la selva está en la Amazonía.',
    'La Costa tiene llanuras junto al Pacífico; los Andes están en la Sierra.',
    'Las islas volcánicas son Galápagos, no la Costa.',
  ], {formato: 'emparejamiento', elementos: {izquierda: ['Costa', 'Sierra', 'Amazonía', 'Galápagos'], derecha: ['Islas volcánicas con especies endémicas', 'Atravesada por la cordillera de los Andes', 'Llanuras de clima cálido junto al océano Pacífico', 'Selva tropical húmeda y ríos caudalosos']}, solucion: [2, 1, 3, 0]}),
  d(31, 'egb-division-politica-1', '¿Cuántas provincias tiene el Ecuador?', ['24', '22', '21', '25'], 0, [
    'Correcto: son 24 desde 2007, cuando se crearon Santa Elena y Santo Domingo de los Tsáchilas.',
    'Eran 22 antes de 2007.',
    'Ese número no corresponde a ninguna etapa reciente.',
    'Son 24, no 25.',
  ]),
  d(32, 'egb-estado-1', 'Relaciona cada función del Estado con su atribución principal.', ['1c, 2d, 3a, 4b', '1d, 2c, 3a, 4b', '1c, 2d, 3b, 4a', '1a, 2d, 3c, 4b'], 0, [
    'Correcto: la Legislativa hace las leyes, la Judicial administra justicia, la Electoral organiza las elecciones y la de Transparencia promueve el control ciudadano.',
    'Hacer leyes es de la Legislativa; administrar justicia, de la Judicial: están cruzadas.',
    'La Electoral organiza las elecciones; la de Transparencia y Control Social promueve el control de lo público.',
    'La Legislativa no organiza elecciones: expide las leyes.',
  ], {formato: 'emparejamiento', dificultad: 2, elementos: {izquierda: ['Función Legislativa', 'Función Judicial', 'Función Electoral', 'Función de Transparencia y Control Social'], derecha: ['Organiza y controla los procesos electorales', 'Promueve el control de lo público y la participación ciudadana', 'Expide, reforma y deroga las leyes', 'Administra justicia']}, solucion: [2, 3, 0, 1]}),
  d(33, 'egb-derechos-1', 'Según la Constitución de 2008, ¿desde qué edad es facultativo el voto en el Ecuador?', ['16 años', '18 años', '14 años', '21 años'], 0, [
    'Correcto: entre los 16 y los 18 años el voto es facultativo; desde los 18 es obligatorio (hasta los 65).',
    'A los 18 años el voto pasa a ser obligatorio.',
    'A los 14 años no se vota.',
    'La mayoría de edad y el voto obligatorio empiezan a los 18, no a los 21.',
  ]),
  d(34, 'egb-diversidad-cultural-2', '¿Qué término describe la relación de respeto, diálogo e intercambio en igualdad de condiciones entre culturas diferentes?', ['Interculturalidad', 'Multiculturalidad', 'Aculturación', 'Etnocentrismo'], 0, [
    'Correcto: la interculturalidad es convivir e intercambiar en igualdad; la Constitución define al Ecuador como intercultural.',
    'La multiculturalidad es que varias culturas coexistan, aunque no necesariamente se relacionen.',
    'La aculturación es adoptar otra cultura perdiendo rasgos de la propia.',
    'El etnocentrismo es juzgar a otras culturas desde la propia como si fuera superior.',
  ]),
];
