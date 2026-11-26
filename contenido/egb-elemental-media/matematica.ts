import type {Cuatro, Formato, Pregunta, Seccion, Uso} from '../tipos';

// EGB 2.º a 7.º · Matemática (ficha, sección 4.2.1, págs. 6 y 7): las lecciones y las preguntas de los 9 temas.
// Contenido escrito por el equipo a partir de los subtemas de la ficha: lo revisa el docente experto.
// Las cifras se escriben como en el currículo ecuatoriano: coma decimal y espacio para los miles.

type Leccion = Record<number, Seccion[]>;
export type TemaAbierto = {abierto: true; contenido: Leccion; minutos?: Record<number, number>};

export const LECCIONES_MATEMATICA: Record<string, TemaAbierto> = {
  'egb-conjuntos-numericos': {
    abierto: true,
    minutos: {1: 7, 2: 7, 3: 7},
    contenido: {
      1: [
        {tipo: 'texto', texto: 'Los números enteros son los naturales (1, 2, 3…), sus opuestos negativos (−1, −2, −3…) y el cero. En una operación combinada no se resuelve de izquierda a derecha sin más: hay un orden obligatorio, y los signos siguen sus propias reglas.'},
        {
          tipo: 'puntos',
          titulo: 'El orden de las operaciones',
          puntos: [
            '1.º Agrupación: lo que está dentro de ( ), [ ] y { }, de adentro hacia afuera.',
            '2.º Potencias y raíces: se calculan antes de multiplicar o dividir.',
            '3.º Multiplicaciones y divisiones: de izquierda a derecha.',
            '4.º Sumas y restas: al final, de izquierda a derecha.',
          ],
        },
        {
          tipo: 'puntos',
          titulo: 'La ley de los signos',
          puntos: [
            'Al multiplicar o dividir: signos iguales dan positivo, (−3) × (−4) = 12; signos distintos dan negativo, 3 × (−4) = −12.',
            'Restar un número es sumar su opuesto: 5 − (−3) = 5 + 3 = 8.',
            'Sumar enteros de distinto signo: se restan sus valores absolutos y queda el signo del mayor, −9 + 4 = −5.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Paso a paso',
          situacion: 'Calcula −12 ÷ (−3) + 2 × (−5) − (−7).',
          explicacion: 'Primero la división y la multiplicación: −12 ÷ (−3) = 4 y 2 × (−5) = −10. Queda 4 + (−10) − (−7) = 4 − 10 + 7 = 1.',
        },
        {tipo: 'clave', texto: 'El error más común es operar en el orden en que aparecen: en 2 + 3 × 4 primero va la multiplicación (2 + 12 = 14), no (2 + 3) × 4 = 20.'},
        {tipo: 'aula', texto: 'Con tus estudiantes, la recta numérica y las situaciones de temperatura, deudas o pisos bajo tierra dan sentido a los negativos antes de aplicar la ley de los signos.'},
      ],
      2: [
        {tipo: 'texto', texto: 'Una potencia es una multiplicación repetida: 2⁴ = 2 × 2 × 2 × 2 = 16, donde 2 es la base y 4 el exponente. La raíz es la operación inversa: √49 = 7 porque 7² = 49. En una operación combinada, las potencias y las raíces se resuelven antes que las multiplicaciones y las divisiones.'},
        {
          tipo: 'puntos',
          titulo: 'Propiedades que ahorran tiempo',
          puntos: [
            'Producto de potencias de igual base: se suman los exponentes. 2³ × 2² = 2⁵ = 32.',
            'Cociente de potencias de igual base: se restan los exponentes. 5⁶ ÷ 5⁴ = 5² = 25.',
            'Potencia de una potencia: se multiplican los exponentes. (3²)³ = 3⁶.',
            'Exponente cero: todo número distinto de cero elevado a 0 es 1, 7⁰ = 1.',
            'Raíz de un producto: es el producto de las raíces, √(4 × 9) = 2 × 3 = 6.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Paso a paso',
          situacion: 'Calcula 3² + √64 ÷ 2³ × 5 − 4.',
          explicacion: 'Potencias y raíces: 3² = 9, √64 = 8 y 2³ = 8. Queda 9 + 8 ÷ 8 × 5 − 4. Después, de izquierda a derecha, 8 ÷ 8 = 1 y 1 × 5 = 5. Al final, 9 + 5 − 4 = 10.',
        },
        {tipo: 'clave', texto: 'La raíz de una suma no es la suma de las raíces: √(9 + 16) = √25 = 5, no 3 + 4 = 7. Y 2³ no es 2 × 3: es 2 × 2 × 2 = 8.'},
      ],
      3: [
        {tipo: 'texto', texto: 'Un número racional se puede escribir como fracción a/b, con b distinto de cero. Para sumar y restar fracciones hace falta un denominador común; para multiplicarlas y dividirlas, no.'},
        {
          tipo: 'puntos',
          titulo: 'Cómo se opera',
          puntos: [
            'Sumar o restar con distinto denominador: se busca el mínimo común múltiplo. 1/4 + 2/3 = 3/12 + 8/12 = 11/12.',
            'Multiplicar: numerador por numerador y denominador por denominador. 2/5 × 3/4 = 6/20 = 3/10.',
            'Dividir: se multiplica por la inversa de la segunda fracción. 3/4 ÷ 1/2 = 3/4 × 2/1 = 6/4 = 3/2.',
            'Simplificar: se dividen numerador y denominador para su máximo común divisor. 6/20 = 3/10.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Paso a paso',
          situacion: 'Calcula 1/2 + 3/4 × 2/3.',
          explicacion: 'Primero la multiplicación: 3/4 × 2/3 = 6/12 = 1/2. Después la suma: 1/2 + 1/2 = 1.',
        },
        {tipo: 'clave', texto: 'Los denominadores no se suman: 1/2 + 1/3 no es 2/5. Es 3/6 + 2/6 = 5/6.'},
        {tipo: 'aula', texto: 'Las fracciones se entienden mejor con material concreto: tiras de papel, una pizza dibujada o la recta numérica antes de pasar al algoritmo.'},
      ],
    },
  },

  'egb-proporcionalidad': {
    abierto: true,
    minutos: {1: 8, 2: 7},
    contenido: {
      1: [
        {tipo: 'texto', texto: 'Dos magnitudes son directamente proporcionales cuando, si una se duplica, la otra también se duplica: su cociente se mantiene. Son inversamente proporcionales cuando, si una se duplica, la otra se reduce a la mitad: su producto se mantiene.'},
        {
          tipo: 'comparacion',
          titulo: 'Directa frente a inversa',
          columnas: ['Directa', 'Inversa'],
          filas: [
            {aspecto: 'Si una aumenta', a: 'La otra aumenta en la misma razón', b: 'La otra disminuye en la misma razón'},
            {aspecto: 'Lo que no cambia', a: 'El cociente y ÷ x', b: 'El producto x × y'},
            {aspecto: 'Ejemplo', a: 'Kilos de arroz y lo que se paga', b: 'Número de obreros y días de trabajo'},
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Regla de tres directa',
          situacion: '3 kg de arroz cuestan $4,50. ¿Cuánto cuestan 5 kg?',
          explicacion: 'Más kilos, más dinero: es directa. Un kilo cuesta 4,50 ÷ 3 = $1,50, así que 5 kg cuestan 5 × 1,50 = $7,50.',
        },
        {
          tipo: 'ejemplo',
          titulo: 'Regla de tres inversa',
          situacion: '6 obreros construyen un muro en 10 días. ¿Cuántos días tardan 4 obreros que trabajan al mismo ritmo?',
          explicacion: 'Menos obreros tardan más: es inversa. El producto se mantiene, 6 × 10 = 60 jornadas de trabajo. Con 4 obreros: 60 ÷ 4 = 15 días.',
        },
        {tipo: 'clave', texto: 'Antes de plantear la regla de tres, pregúntate: si una magnitud aumenta, ¿la otra aumenta o disminuye? La respuesta te dice si es directa o inversa.'},
      ],
      2: [
        {tipo: 'texto', texto: 'Un porcentaje es una fracción de denominador 100: 25 % = 25/100 = 0,25. Para calcular el p % de una cantidad, se multiplica la cantidad por p/100.'},
        {
          tipo: 'puntos',
          titulo: 'Los cuatro casos de siempre',
          puntos: [
            'El 20 % de 150: 150 × 0,20 = 30.',
            'Un aumento del 12 % sobre $50: 50 × 1,12 = $56.',
            'Un descuento del 30 % sobre $80: se paga el 70 %, 80 × 0,70 = $56.',
            'Qué porcentaje es 18 de 72: 18 ÷ 72 = 0,25, es decir, el 25 %.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Descuentos seguidos',
          situacion: 'Un producto de $100 tiene un descuento del 20 % y, sobre el nuevo precio, otro del 10 %. ¿Es lo mismo que un descuento del 30 %?',
          explicacion: 'No. Primero 100 × 0,80 = $80 y luego 80 × 0,90 = $72. El descuento total es del 28 %, porque el segundo se calcula sobre un precio menor.',
        },
        {tipo: 'clave', texto: 'El IVA en Ecuador es del 15 % y se suma al precio: un artículo de $20 sin IVA cuesta 20 × 1,15 = $23.'},
      ],
    },
  },

  'egb-figuras-geometricas': {
    abierto: true,
    minutos: {1: 6, 2: 8},
    contenido: {
      1: [
        {tipo: 'texto', texto: 'El perímetro es la longitud del contorno de una figura: la suma de sus lados. En el círculo, el contorno se llama circunferencia y su longitud es 2πr, o π por el diámetro. Para π se usa 3,14.'},
        {
          tipo: 'puntos',
          titulo: 'Fórmulas del perímetro',
          puntos: [
            'Cuadrado: P = 4 × lado.',
            'Rectángulo: P = 2 × (base + altura).',
            'Triángulo: la suma de sus tres lados.',
            'Polígono regular de n lados: P = n × lado.',
            'Circunferencia: L = 2 × π × radio.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Cercar un terreno',
          situacion: 'Un terreno rectangular mide 25 m de largo y 12 m de ancho. ¿Cuántos metros de alambre se necesitan para cercarlo con 3 vueltas?',
          explicacion: 'El perímetro es 2 × (25 + 12) = 74 m. Con 3 vueltas: 74 × 3 = 222 m de alambre.',
        },
        {tipo: 'clave', texto: 'El perímetro se mide en unidades de longitud (m, cm); el área, en unidades cuadradas (m², cm²). Si la respuesta tiene «²», no es un perímetro.'},
      ],
      2: [
        {tipo: 'texto', texto: 'El área es la medida de la superficie que ocupa una figura. Cada figura tiene su fórmula, y casi todas salen del rectángulo: base por altura.'},
        {
          tipo: 'puntos',
          titulo: 'Fórmulas del área',
          puntos: [
            'Cuadrado: A = lado².',
            'Rectángulo: A = base × altura.',
            'Triángulo: A = (base × altura) ÷ 2.',
            'Rombo: A = (diagonal mayor × diagonal menor) ÷ 2.',
            'Trapecio: A = (base mayor + base menor) × altura ÷ 2.',
            'Polígono regular: A = (perímetro × apotema) ÷ 2.',
            'Círculo: A = π × radio².',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Un hexágono regular',
          situacion: 'Un hexágono regular tiene 6 cm de lado y 5,2 cm de apotema. ¿Cuál es su área?',
          explicacion: 'Su perímetro es 6 × 6 = 36 cm. El área es (36 × 5,2) ÷ 2 = 93,6 cm².',
        },
        {tipo: 'clave', texto: 'En el círculo se usa el radio, no el diámetro: si el diámetro mide 10 cm, el radio es 5 cm y el área es 3,14 × 5² = 78,5 cm².'},
      ],
    },
  },

  'egb-cuerpos-geometricos': {
    abierto: true,
    minutos: {1: 8, 2: 6},
    contenido: {
      1: [
        {tipo: 'texto', texto: 'El volumen es el espacio que ocupa un cuerpo y se mide en unidades cúbicas (cm³, m³). Los cuerpos con dos bases iguales (prismas y cilindros) se calculan con «base por altura»; los que terminan en punta (pirámides y conos), con la tercera parte de eso.'},
        {
          tipo: 'puntos',
          titulo: 'Fórmulas del volumen',
          puntos: [
            'Prisma: V = área de la base × altura.',
            'Cilindro: V = π × radio² × altura.',
            'Pirámide: V = (área de la base × altura) ÷ 3.',
            'Cono: V = (π × radio² × altura) ÷ 3.',
            'Esfera: V = (4 ÷ 3) × π × radio³.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Un tanque de agua',
          situacion: 'Un tanque cilíndrico tiene 1 m de radio y 2 m de altura. ¿Cuántos litros de agua le caben? (1 m³ = 1 000 litros)',
          explicacion: 'V = 3,14 × 1² × 2 = 6,28 m³. Como cada metro cúbico son 1 000 litros, le caben 6 280 litros.',
        },
        {tipo: 'clave', texto: 'Si en la pirámide o en el cono olvidas dividir para 3, el resultado sale el triple. Una pirámide ocupa la tercera parte del prisma que tiene su misma base y su misma altura.'},
      ],
      2: [
        {tipo: 'texto', texto: 'Un poliedro es un cuerpo limitado por caras planas que son polígonos. En todo poliedro convexo se cumple la fórmula de Euler: caras + vértices = aristas + 2 (C + V = A + 2). Un poliedro es regular cuando todas sus caras son polígonos regulares iguales y en cada vértice concurre el mismo número de caras; solo hay cinco.'},
        {
          tipo: 'puntos',
          titulo: 'Los cinco poliedros regulares',
          puntos: [
            'Tetraedro: 4 caras triangulares, 4 vértices y 6 aristas.',
            'Cubo o hexaedro: 6 caras cuadradas, 8 vértices y 12 aristas.',
            'Octaedro: 8 caras triangulares, 6 vértices y 12 aristas.',
            'Dodecaedro: 12 caras pentagonales, 20 vértices y 30 aristas.',
            'Icosaedro: 20 caras triangulares, 12 vértices y 30 aristas.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Encontrar el dato que falta',
          situacion: 'Un poliedro tiene 12 caras y 30 aristas. ¿Cuántos vértices tiene?',
          explicacion: 'C + V = A + 2, entonces 12 + V = 30 + 2 = 32 y V = 20. Es el dodecaedro.',
        },
        {tipo: 'clave', texto: 'Para recordarla: «caras más vértices es igual a aristas más dos». Compruébala con el cubo: 6 + 8 = 12 + 2.'},
      ],
    },
  },

  'egb-recta-plano': {
    abierto: true,
    minutos: {1: 6, 2: 7},
    contenido: {
      1: [
        {tipo: 'texto', texto: 'Dos rectas de un mismo plano pueden ser paralelas (nunca se cortan), secantes (se cortan en un solo punto) o coincidentes (son la misma recta). Cuando dos secantes forman cuatro ángulos rectos, se llaman perpendiculares.'},
        {
          tipo: 'puntos',
          titulo: 'Las posiciones',
          puntos: [
            'Paralelas: tienen la misma dirección y no se cortan, como los rieles de un tren.',
            'Secantes: se cortan en un solo punto.',
            'Perpendiculares: son secantes que forman ángulos de 90°, como la esquina de una hoja.',
            'Coincidentes: todos sus puntos son comunes.',
            'Que se cruzan (en el espacio): no son paralelas y no se cortan porque están en planos distintos.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'El mapa del barrio',
          situacion: 'En el mapa de un barrio, la calle A y la calle B nunca se encuentran; la calle C corta a las dos formando esquinas en ángulo recto.',
          explicacion: 'A y B son paralelas. C es secante a las dos y, como forma ángulos de 90°, es perpendicular a ellas.',
        },
        {tipo: 'clave', texto: 'Toda recta perpendicular es secante, pero no toda secante es perpendicular: solo lo es si forma ángulos de 90°.'},
      ],
      2: [
        {tipo: 'texto', texto: 'Un ángulo es la abertura entre dos semirrectas que salen de un mismo punto, el vértice. Se mide en grados (°) con el graduador.'},
        {
          tipo: 'puntos',
          titulo: 'Según su medida',
          puntos: [
            'Agudo: mide más de 0° y menos de 90°.',
            'Recto: mide 90°.',
            'Obtuso: mide más de 90° y menos de 180°.',
            'Llano: mide 180°.',
            'Cóncavo o reflejo: mide más de 180° y menos de 360°.',
            'Completo: mide 360°.',
          ],
        },
        {
          tipo: 'puntos',
          titulo: 'Según cómo se relacionan',
          puntos: [
            'Complementarios: suman 90°.',
            'Suplementarios: suman 180°.',
            'Adyacentes: comparten un lado y forman una línea recta, así que suman 180°.',
            'Opuestos por el vértice: tienen la misma medida.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Complemento y suplemento',
          situacion: 'Un ángulo mide 35°. ¿Cuánto miden su complemento y su suplemento?',
          explicacion: 'Complemento: 90° − 35° = 55°. Suplemento: 180° − 35° = 145°.',
        },
        {tipo: 'clave', texto: 'Para no confundirlos: los complementarios forman una esquina (90°); los suplementarios, una línea recta (180°).'},
      ],
    },
  },

  'egb-medidas': {
    abierto: true,
    minutos: {1: 7, 2: 7},
    contenido: {
      1: [
        {tipo: 'texto', texto: 'El Sistema Internacional de Unidades (SI) usa el metro (m) para la longitud, el kilogramo (kg) para la masa y el segundo (s) para el tiempo. En longitud y masa, cada unidad es 10 veces la que le sigue hacia abajo; el tiempo, en cambio, no es decimal.'},
        {
          tipo: 'puntos',
          titulo: 'Cómo convertir',
          puntos: [
            'Longitud: km, hm, dam, m, dm, cm, mm. Hacia la derecha se multiplica por 10 en cada paso; hacia la izquierda se divide. 3,5 km = 3 500 m.',
            'Masa: kg, hg, dag, g, dg, cg, mg. 2,4 kg = 2 400 g. Una tonelada (t) son 1 000 kg.',
            'Tiempo: 1 hora = 60 minutos = 3 600 segundos; 1 día = 24 horas.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'La hora de llegada',
          situacion: 'Un bus sale a las 07:45 y el viaje dura 2 h 35 min. ¿A qué hora llega?',
          explicacion: '07:45 más 2 horas son las 09:45. Más 35 minutos: 45 + 35 = 80 min, que es 1 h 20 min. Llega a las 10:20.',
        },
        {tipo: 'clave', texto: '1,5 horas no es 1 h 50 min: es 1 h 30 min, porque 0,5 horas es la mitad de 60 minutos.'},
      ],
      2: [
        {tipo: 'texto', texto: 'En las medidas de superficie, cada unidad es 100 veces la siguiente (un cuadrado de 10 × 10). En las de volumen, 1 000 veces (un cubo de 10 × 10 × 10). Por eso convertir m² o m³ no es igual que convertir metros.'},
        {
          tipo: 'puntos',
          titulo: 'Equivalencias clave',
          puntos: [
            'Metro cuadrado: 1 m² = 100 dm² = 10 000 cm².',
            'Kilómetro cuadrado y hectárea: 1 km² = 1 000 000 m², y 1 ha = 10 000 m².',
            'Metro cúbico: 1 m³ = 1 000 dm³ = 1 000 000 cm³.',
            'Litro: 1 dm³ = 1 litro, y 1 cm³ = 1 mililitro.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Llenar una piscina',
          situacion: 'Una piscina mide 10 m de largo, 5 m de ancho y 2 m de profundidad. ¿Cuántos litros de agua le caben?',
          explicacion: 'Su volumen es 10 × 5 × 2 = 100 m³. Como 1 m³ = 1 000 dm³ = 1 000 litros, le caben 100 000 litros.',
        },
        {tipo: 'clave', texto: 'El error típico es multiplicar por 10 en superficie: 3 m² son 300 dm², no 30 dm².'},
      ],
    },
  },

  'egb-estadistica-datos': {
    abierto: true,
    minutos: {1: 9},
    contenido: {
      1: [
        {tipo: 'texto', texto: 'Las tablas de frecuencias ordenan los datos y los gráficos (de barras, circulares, histogramas) los muestran. Para resumirlos se usan las medidas de tendencia central, que dicen dónde está el centro, y las de dispersión, que dicen qué tan separados están los datos.'},
        {
          tipo: 'puntos',
          titulo: 'Tendencia central',
          puntos: [
            'Media: la suma de los datos dividida para el número de datos.',
            'Mediana: el dato del centro con los datos ordenados. Si son pares, el promedio de los dos centrales.',
            'Moda: el dato que más se repite.',
          ],
        },
        {
          tipo: 'puntos',
          titulo: 'Dispersión',
          puntos: [
            'Rango: el dato mayor menos el dato menor.',
            'Varianza: el promedio de los cuadrados de las distancias de cada dato a la media.',
            'Desviación estándar: la raíz cuadrada de la varianza.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Datos no agrupados',
          situacion: 'Calcula las medidas de los datos 2, 4, 4, 5 y 10.',
          explicacion: 'Media: 25 ÷ 5 = 5. Mediana: 4. Moda: 4. Rango: 10 − 2 = 8. Varianza: (9 + 1 + 1 + 0 + 25) ÷ 5 = 36 ÷ 5 = 7,2. Desviación estándar: √7,2 ≈ 2,68.',
        },
        {
          tipo: 'ejemplo',
          titulo: 'Datos agrupados',
          situacion: 'En una tabla, 2 estudiantes tienen entre 0 y 10 puntos, 5 entre 10 y 20, y 3 entre 20 y 30. ¿Cuál es la media?',
          explicacion: 'Con datos agrupados se usa la marca de clase, el punto medio de cada intervalo: 5, 15 y 25. Media = (5 × 2 + 15 × 5 + 25 × 3) ÷ 10 = (10 + 75 + 75) ÷ 10 = 16.',
        },
        {tipo: 'clave', texto: 'La media se deja arrastrar por los valores extremos; la mediana no. Si hay un dato muy grande o muy pequeño, la mediana describe mejor al grupo.'},
      ],
    },
  },

  'egb-combinaciones': {
    abierto: true,
    minutos: {1: 7},
    contenido: {
      1: [
        {tipo: 'texto', texto: 'Una combinación es una manera de elegir k elementos de un grupo de n cuando el orden no importa. Se calcula con C(n, k) = n! ÷ (k! × (n − k)!), donde n! (factorial de n) es n × (n − 1) × … × 1.'},
        {
          tipo: 'puntos',
          titulo: 'Lo que hay que saber',
          puntos: [
            'Factorial: 4! = 4 × 3 × 2 × 1 = 24, y por definición 0! = 1.',
            'Atajo para elegir 2: C(n, 2) = n × (n − 1) ÷ 2. Por ejemplo, C(6, 2) = 6 × 5 ÷ 2 = 15.',
            'Simetría: elegir k es lo mismo que dejar fuera n − k, C(10, 2) = C(10, 8).',
            'Cuando el orden importa: no es combinación sino variación (un podio, una clave).',
          ],
        },
        {
          tipo: 'comparacion',
          titulo: 'Combinación frente a variación',
          columnas: ['Combinación', 'Variación'],
          filas: [
            {aspecto: '¿Importa el orden?', a: 'No', b: 'Sí'},
            {aspecto: 'Ejemplo', a: 'Elegir 3 de 10 docentes para una comisión', b: 'Elegir presidente, secretario y tesorero entre 10'},
            {aspecto: 'Cálculo', a: 'C(10, 3) = 120', b: '10 × 9 × 8 = 720'},
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'La heladería',
          situacion: 'Una heladería tiene 6 sabores. ¿Cuántas copas distintas de 2 sabores diferentes se pueden armar?',
          explicacion: 'Fresa con mora es la misma copa que mora con fresa: el orden no importa. C(6, 2) = 6! ÷ (2! × 4!) = (6 × 5) ÷ 2 = 15 copas.',
        },
        {tipo: 'clave', texto: 'Pregunta clave: si cambio el orden, ¿obtengo otro resultado? Si la respuesta es no, es una combinación.'},
      ],
    },
  },

  'egb-probabilidad': {
    abierto: true,
    minutos: {1: 7},
    contenido: {
      1: [
        {tipo: 'texto', texto: 'La probabilidad clásica (regla de Laplace) mide qué tan posible es un suceso cuando todos los resultados son igual de probables: P(A) = casos favorables ÷ casos posibles.'},
        {
          tipo: 'puntos',
          titulo: 'Lo que hay que saber',
          puntos: [
            'Valores posibles: de 0 (suceso imposible) a 1 (suceso seguro); en porcentaje, 1/4 = 25 %.',
            'Suceso contrario: la probabilidad de que algo no ocurra es 1 menos la de que ocurra, P(no A) = 1 − P(A).',
            'Casos posibles: un dado tiene 6; una moneda, 2; dos dados, 6 × 6 = 36.',
          ],
        },
        {
          tipo: 'ejemplo',
          titulo: 'Un dado',
          situacion: 'Se lanza un dado. ¿Cuál es la probabilidad de sacar un número mayor que 4?',
          explicacion: 'Los casos favorables son 5 y 6 (2 casos) de 6 posibles. P = 2/6 = 1/3, cerca del 33 %.',
        },
        {
          tipo: 'ejemplo',
          titulo: 'Dos monedas',
          situacion: 'Se lanzan dos monedas. ¿Cuál es la probabilidad de obtener exactamente una cara?',
          explicacion: 'Los resultados posibles son cara-cara, cara-sello, sello-cara y sello-sello (4 casos). Los favorables son cara-sello y sello-cara (2 casos). P = 2/4 = 1/2.',
        },
        {tipo: 'clave', texto: 'Con dos monedas hay 4 resultados, no 3: «una cara y un sello» ocurre de dos maneras distintas.'},
      ],
    },
  },
};

// ───────────── Preguntas ─────────────

const D: Uso[] = ['diagnostico-tema', 'prueba'];
const PP: Uso[] = ['practica', 'prueba'];
type Extra = {formato?: Formato; elementos?: Pregunta['elementos']; solucion?: number[]};

const q = (
  id: string,
  leccionId: string,
  usos: Uso[],
  dificultad: 1 | 2 | 3,
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
  dificultad,
  usos: [...usos],
  enunciado,
  opciones,
  correcta,
  explicaciones,
  ...(extra.elementos ? {elementos: extra.elementos} : {}),
  ...(extra.solucion ? {solucion: extra.solucion} : {}),
});

const CN = 'egb-conjuntos-numericos';
const PR = 'egb-proporcionalidad';
const FG = 'egb-figuras-geometricas';
const CG = 'egb-cuerpos-geometricos';
const RP = 'egb-recta-plano';
const MD = 'egb-medidas';
const ES = 'egb-estadistica-datos';
const CO = 'egb-combinaciones';
const PB = 'egb-probabilidad';

export const PREGUNTAS_MATEMATICA: Pregunta[] = [
  // ── Conjuntos numéricos
  q('m-cn-01', `${CN}-1`, D, 2, '¿Cuál es el resultado de 15 − 3 × (−2) + (−20) ÷ 4?', ['16', '−11', '4', '26'], 0, [
    'Correcto: 3 × (−2) = −6 y (−20) ÷ 4 = −5. Queda 15 + 6 − 5 = 16.',
    'Operó en orden de aparición: (15 − 3) × (−2) + (−20), y todo dividido para 4.',
    'Restar −6 es sumar 6: 15 − (−6) = 21, no 9.',
    'El cociente (−20) ÷ 4 es negativo: −5, no +5.',
  ]),
  q('m-cn-02', `${CN}-1`, PP, 1, 'El valor de (−3) × (−4) − (−5) es ____.', ['17', '7', '−7', '−17'], 0, [
    'Correcto: (−3) × (−4) = 12 y 12 − (−5) = 12 + 5 = 17.',
    'Restar −5 es sumar 5: no se resta.',
    'Menos por menos da más: (−3) × (−4) es 12, no −12.',
    'Cambió los dos signos: el producto es positivo y restar un negativo suma.',
  ], {formato: 'completamiento'}),
  q('m-cn-03', `${CN}-1`, PP, 1, 'En Quito la temperatura mínima fue de 4 °C y en la cima del Chimborazo, de −12 °C. ¿Cuál es la diferencia de temperatura?', ['16 °C', '8 °C', '−8 °C', '−16 °C'], 0, [
    'Correcto: 4 − (−12) = 4 + 12 = 16 °C.',
    'Restó 12 − 4: entre 4 °C y −12 °C hay que pasar por el cero.',
    'Sumó 4 + (−12): la diferencia es una resta.',
    'Una diferencia entre dos temperaturas se expresa positiva: hay 16 grados entre ellas.',
  ]),
  q('m-cn-04', `${CN}-1`, PP, 1, 'Ordena estos números de menor a mayor.', ['3, 1, 5, 4, 2', '4, 5, 1, 2, 3', '1, 3, 5, 4, 2', '3, 1, 4, 5, 2'], 0, [
    'Correcto: −8, −3, −1, 0 y 5.',
    'Los ordenó por su valor absoluto: entre negativos, el que está más lejos del cero es el menor.',
    '−8 es menor que −3: está más a la izquierda en la recta.',
    '−1 es menor que 0.',
  ], {formato: 'ordenamiento', elementos: ['−3', '5', '−8', '0', '−1'], solucion: [2, 0, 4, 3, 1]}),
  q('m-cn-05', `${CN}-2`, D, 2, '¿Cuál es el resultado de 5² − 2³ + √36 × 2?', ['29', '46', '5', '31'], 0, [
    'Correcto: 25 − 8 + 6 × 2 = 25 − 8 + 12 = 29.',
    'Sumó antes de multiplicar: (25 − 8 + 6) × 2.',
    'Restó la suma de todo lo demás: la resta solo afecta a 2³.',
    'Tomó 2³ como 2 × 3 = 6: es 2 × 2 × 2 = 8.',
  ]),
  q('m-cn-06', `${CN}-2`, PP, 2, '(3²)³ ÷ 3⁴ = ____', ['9', '3', '27', '81'], 0, [
    'Correcto: (3²)³ = 3⁶ y 3⁶ ÷ 3⁴ = 3² = 9.',
    'En la potencia de una potencia los exponentes se multiplican (2 × 3 = 6), no se suman.',
    'Ese es 3³: al dividir potencias de igual base se restan los exponentes, 6 − 4 = 2.',
    'Ese es 3⁴, el divisor.',
  ], {formato: 'completamiento'}),
  q('m-cn-07', `${CN}-2`, PP, 1, '¿Cuál de estas igualdades es verdadera?', ['√(9 + 16) = 5', '√(9 + 16) = 7', '2⁵ = 10', '4⁰ = 0'], 0, [
    'Correcto: 9 + 16 = 25 y √25 = 5.',
    'La raíz de una suma no es la suma de las raíces (3 + 4).',
    '2⁵ es 2 × 2 × 2 × 2 × 2 = 32, no 2 × 5.',
    'Todo número distinto de cero elevado a 0 es 1.',
  ]),
  q('m-cn-08', `${CN}-2`, PP, 1, 'Un patio cuadrado tiene 144 m² de área. ¿Cuánto mide su lado?', ['12 m', '36 m', '72 m', '14 m'], 0, [
    'Correcto: el lado es la raíz cuadrada del área, √144 = 12 m.',
    'Dividió el área para 4, como si fuera el perímetro.',
    'Dividió el área para 2.',
    '14² = 196, no 144.',
  ]),
  q('m-cn-09', `${CN}-3`, D, 1, '¿Cuál es el resultado de 2/3 + 1/4?', ['11/12', '3/7', '1/6', '8/12'], 0, [
    'Correcto: 8/12 + 3/12 = 11/12.',
    'Sumó numeradores y denominadores: así no se suman fracciones.',
    'Multiplicó en lugar de sumar: 2/3 × 1/4 = 2/12 = 1/6.',
    'Convirtió solo la primera fracción; falta sumar 3/12.',
  ]),
  q('m-cn-10', `${CN}-3`, PP, 2, '¿Cuánto es 3/5 ÷ 9/10?', ['2/3', '27/50', '3/2', '1/3'], 0, [
    'Correcto: 3/5 × 10/9 = 30/45 = 2/3.',
    'Multiplicó directo: para dividir se multiplica por la inversa de la segunda.',
    'Invirtió la primera fracción en lugar de la segunda.',
    'Simplificó mal: 30/45 se divide para 15 y queda 2/3.',
  ]),
  q('m-cn-11', `${CN}-3`, PP, 2, 'Una familia gasta 1/3 de su sueldo en arriendo y 1/4 en comida. ¿Qué fracción del sueldo le queda?', ['5/12', '7/12', '2/7', '1/12'], 0, [
    'Correcto: gasta 4/12 + 3/12 = 7/12, y le quedan 12/12 − 7/12 = 5/12.',
    'Esa es la parte que gasta, no la que le queda.',
    'Sumó numeradores y denominadores (1 + 1 y 3 + 4).',
    'Restó las fracciones (1/3 − 1/4) en lugar de sumarlas.',
  ]),
  q('m-cn-12', `${CN}-3`, PP, 1, '1/2 + 1/2 × 1/2 = ____', ['3/4', '1/2', '1', '1/4'], 0, [
    'Correcto: primero 1/2 × 1/2 = 1/4, y 1/2 + 1/4 = 3/4.',
    'Sumó primero: (1/2 + 1/2) × 1/2. La multiplicación va antes.',
    'Solo sumó las dos primeras fracciones.',
    'Ese es solo el producto; falta sumar 1/2.',
  ], {formato: 'completamiento'}),

  // ── Proporcionalidad y porcentajes
  q('m-pp-01', `${PR}-1`, D, 1, '5 cuadernos cuestan $7,50. ¿Cuánto cuestan 8 cuadernos?', ['$12,00', '$10,50', '$4,69', '$15,00'], 0, [
    'Correcto: cada cuaderno cuesta 7,50 ÷ 5 = $1,50, y 8 × 1,50 = $12,00.',
    'Sumó $1 por cada cuaderno extra; cada uno cuesta $1,50.',
    'La trató como inversa: a más cuadernos se paga más, no menos.',
    'Duplicó el precio, pero 8 no es el doble de 5.',
  ]),
  q('m-pp-02', `${PR}-1`, D, 2, '4 grifos iguales llenan un tanque en 6 horas. ¿En cuántas horas lo llenan 3 de esos grifos?', ['8 horas', '4,5 horas', '9 horas', '7 horas'], 0, [
    'Correcto: es inversa. 4 × 6 = 24 horas-grifo, y 24 ÷ 3 = 8 horas.',
    'La trató como directa: con menos grifos se tarda más, no menos.',
    'Sumó 3 horas: en una relación inversa se mantiene el producto grifos × horas (4 × 6 = 24).',
    'Sumó una hora por el grifo que falta.',
  ]),
  q('m-pp-03', `${PR}-1`, PP, 1, '¿En cuál situación las magnitudes son inversamente proporcionales?', [
    'La velocidad de un bus y el tiempo que tarda en recorrer la misma distancia',
    'Las libras de papas y lo que se paga por ellas',
    'Los metros de tela y su costo',
    'Las horas trabajadas y el sueldo, con un pago fijo por hora',
  ], 0, [
    'Correcto: a más velocidad, menos tiempo; su producto (la distancia) se mantiene.',
    'Más libras, más dinero: es directa.',
    'Más metros, más costo: es directa.',
    'Más horas, más sueldo: es directa.',
  ]),
  q('m-pp-04', `${PR}-1`, PP, 1, 'Si x e y son directamente proporcionales y cuando x = 4, y = 10, entonces cuando x = 6, y = ____.', ['15', '12', '6,7', '20'], 0, [
    'Correcto: y ÷ x = 10 ÷ 4 = 2,5, así que y = 6 × 2,5 = 15.',
    'Sumó 2 a y porque x aumentó en 2: la proporción es un cociente, no una suma.',
    'La trató como inversa: 4 × 10 ÷ 6 ≈ 6,7.',
    'Duplicó y, pero x no se duplicó.',
  ], {formato: 'completamiento'}),
  q('m-pp-05', `${PR}-1`, PP, 1, 'Una receta para 4 personas lleva 300 g de arroz. ¿Cuánto arroz se necesita para 10 personas?', ['750 g', '600 g', '120 g', '1 200 g'], 0, [
    'Correcto: 300 ÷ 4 = 75 g por persona, y 75 × 10 = 750 g.',
    'Duplicó la receta, pero 10 personas son 2,5 veces 4.',
    'La trató como inversa: más personas necesitan más arroz.',
    'Multiplicó 300 × 4: ese sería el arroz para 16 personas.',
  ]),
  q('m-pp-06', `${PR}-2`, D, 1, '¿Cuál es el 35 % de 240?', ['84', '35', '205', '68,6'], 0, [
    'Correcto: 240 × 0,35 = 84.',
    'Ese es el porcentaje, no la cantidad que representa.',
    'Restó 35 unidades, no el 35 %.',
    'Dividió 240 para 3,5: para hallar un porcentaje se multiplica por p/100.',
  ]),
  q('m-pp-07', `${PR}-2`, PP, 1, 'Un televisor cuesta $500 sin IVA. Con el IVA del 15 %, ¿cuál es el precio final?', ['$575', '$515', '$425', '$750'], 0, [
    'Correcto: 500 × 1,15 = $575.',
    'Sumó $15, no el 15 %.',
    'Restó el IVA: el impuesto se suma al precio.',
    'Sumó el 50 %, no el 15 %.',
  ]),
  q('m-pp-08', `${PR}-2`, PP, 1, 'En un grado de 40 estudiantes, 14 son hombres. ¿Qué porcentaje son mujeres?', ['65 %', '35 %', '26 %', '14 %'], 0, [
    'Correcto: las mujeres son 40 − 14 = 26, y 26 ÷ 40 = 0,65, es decir, el 65 %.',
    'Ese es el porcentaje de hombres.',
    'Ese es el número de mujeres, no su porcentaje.',
    'Ese es el número de hombres.',
  ]),
  q('m-pp-09', `${PR}-2`, PP, 2, 'El pasaje subió de $0,25 a $0,35. ¿En qué porcentaje subió?', ['40 %', '10 %', '28,6 %', '35 %'], 0, [
    'Correcto: subió $0,10 sobre $0,25, y 0,10 ÷ 0,25 = 0,40, es decir, el 40 %.',
    'Diez centavos no es el 10 %: hay que compararlos con el precio inicial.',
    'Comparó con el precio nuevo: el aumento se calcula sobre el precio inicial.',
    'Ese es el precio nuevo en centavos, no el aumento.',
  ]),
  q('m-pp-10', `${PR}-2`, PP, 3, 'Después de un descuento del 25 %, un par de zapatos cuesta $45. ¿Cuál era el precio original?', ['$60', '$56,25', '$70', '$33,75'], 0, [
    'Correcto: $45 es el 75 % del precio original, y 45 ÷ 0,75 = $60.',
    'Sumó el 25 % de $45, pero el descuento se calculó sobre el precio original.',
    'Sumó 25 dólares, no el 25 %.',
    'Volvió a descontar el 25 %.',
  ]),

  // ── Figuras geométricas
  q('m-fg-01', `${FG}-1`, D, 1, '¿Cuál es el perímetro de un rectángulo de 8 cm de largo y 3 cm de ancho?', ['22 cm', '11 cm', '24 cm²', '32 cm'], 0, [
    'Correcto: 2 × (8 + 3) = 22 cm.',
    'Sumó solo dos lados; el rectángulo tiene cuatro.',
    'Calculó el área (8 × 3) y no el perímetro.',
    'Multiplicó el largo por 4, como si fuera un cuadrado.',
  ]),
  q('m-fg-02', `${FG}-1`, PP, 2, 'Una rueda tiene 40 cm de diámetro. ¿Cuánto avanza en una vuelta completa? (π ≈ 3,14)', ['125,6 cm', '251,2 cm', '62,8 cm', '1 256 cm'], 0, [
    'Correcto: π × diámetro = 3,14 × 40 = 125,6 cm.',
    'Usó el diámetro como si fuera el radio en 2πr.',
    'Usó el radio sin multiplicar por 2.',
    'Calculó el área del círculo, no su contorno.',
  ]),
  q('m-fg-03', `${FG}-1`, PP, 1, 'Un pentágono regular tiene 60 cm de perímetro. ¿Cuánto mide cada lado?', ['12 cm', '10 cm', '15 cm', '300 cm'], 0, [
    'Correcto: el pentágono tiene 5 lados iguales, 60 ÷ 5 = 12 cm.',
    'Dividió para 6: ese sería un hexágono.',
    'Dividió para 4: ese sería un cuadrado.',
    'Multiplicó en lugar de dividir.',
  ]),
  q('m-fg-04', `${FG}-1`, PP, 1, 'Un triángulo equilátero de 9 cm de lado tiene un perímetro de ____.', ['27 cm', '18 cm', '81 cm', '9 cm'], 0, [
    'Correcto: tiene 3 lados iguales, 3 × 9 = 27 cm.',
    'Sumó solo dos lados.',
    'Elevó el lado al cuadrado: eso no es un perímetro.',
    'Ese es un solo lado.',
  ], {formato: 'completamiento'}),
  q('m-fg-05', `${FG}-1`, PP, 2, 'Se quiere poner cinta alrededor de una mesa circular de 70 cm de radio. ¿Cuánta cinta se necesita? (π ≈ 3,14)', ['439,6 cm', '219,8 cm', '15 386 cm', '140 cm'], 0, [
    'Correcto: 2 × 3,14 × 70 = 439,6 cm.',
    'Olvidó multiplicar por 2: π × r no es la circunferencia.',
    'Calculó el área (π × r²), no el contorno.',
    'Ese es el diámetro, no la longitud del contorno.',
  ]),
  q('m-fg-06', `${FG}-2`, D, 2, '¿Cuál es el área de un trapecio con bases de 10 cm y 6 cm y una altura de 4 cm?', ['32 cm²', '64 cm²', '20 cm²', '240 cm²'], 0, [
    'Correcto: (10 + 6) × 4 ÷ 2 = 32 cm².',
    'Olvidó dividir para 2.',
    'Sumó todas las medidas.',
    'Multiplicó las tres medidas.',
  ]),
  q('m-fg-07', `${FG}-2`, D, 2, '¿Cuál es el área de un círculo de 6 cm de radio? (π ≈ 3,14)', ['113,04 cm²', '37,68 cm²', '18,84 cm²', '452,16 cm²'], 0, [
    'Correcto: 3,14 × 6² = 3,14 × 36 = 113,04 cm².',
    'Calculó la circunferencia (2πr), no el área.',
    'Multiplicó π por el radio sin elevarlo al cuadrado.',
    'Usó el diámetro (12 cm) en lugar del radio.',
  ]),
  q('m-fg-08', `${FG}-2`, PP, 1, 'Un rombo tiene diagonales de 12 cm y 8 cm. ¿Cuál es su área?', ['48 cm²', '96 cm²', '20 cm²', '40 cm²'], 0, [
    'Correcto: (12 × 8) ÷ 2 = 48 cm².',
    'Olvidó dividir para 2.',
    'Sumó las diagonales.',
    'Sumó las diagonales y multiplicó por 2: eso no da el área.',
  ]),
  q('m-fg-09', `${FG}-2`, PP, 2, '¿Cuál es el área de un octágono regular de 5 cm de lado y 6 cm de apotema?', ['120 cm²', '240 cm²', '30 cm²', '15 cm²'], 0, [
    'Correcto: el perímetro es 8 × 5 = 40 cm, y (40 × 6) ÷ 2 = 120 cm².',
    'Olvidó dividir para 2.',
    'Multiplicó el lado por la apotema, sin usar el perímetro.',
    'Calculó el área de uno solo de los 8 triángulos: (5 × 6) ÷ 2.',
  ]),
  q('m-fg-10', `${FG}-2`, PP, 3, 'Un aula rectangular mide 8 m por 6 m. ¿Cuántas baldosas cuadradas de 40 cm de lado se necesitan para cubrir el piso?', ['300', '120', '30', '3 000'], 0, [
    'Correcto: el aula mide 48 m² y cada baldosa 0,4 × 0,4 = 0,16 m², así que 48 ÷ 0,16 = 300.',
    'Dividió el área para el lado de la baldosa (0,4 m), no para su área.',
    'Dividió para 1,6 en lugar de 0,16.',
    'Se equivocó al convertir centímetros cuadrados a metros cuadrados.',
  ]),

  // ── Cuerpos geométricos
  q('m-cg-01', `${CG}-1`, D, 1, '¿Cuál es el volumen de una caja con forma de prisma rectangular de 10 cm × 5 cm × 4 cm?', ['200 cm³', '19 cm³', '100 cm³', '220 cm²'], 0, [
    'Correcto: 10 × 5 × 4 = 200 cm³.',
    'Sumó las tres medidas.',
    'Dividió para 2: eso solo se hace en algunas áreas, no en el volumen del prisma.',
    'Calculó el área total de la caja, no su volumen.',
  ]),
  q('m-cg-02', `${CG}-1`, D, 2, '¿Cuál es el volumen de un cono de 3 cm de radio y 10 cm de altura? (π ≈ 3,14)', ['94,2 cm³', '282,6 cm³', '31,4 cm³', '28,26 cm³'], 0, [
    'Correcto: (3,14 × 3² × 10) ÷ 3 = 282,6 ÷ 3 = 94,2 cm³.',
    'Olvidó dividir para 3: ese es el volumen del cilindro.',
    'Usó el radio sin elevarlo al cuadrado.',
    'Calculó solo el área de la base, sin la altura.',
  ]),
  q('m-cg-03', `${CG}-1`, PP, 2, 'Un recipiente cilíndrico tiene 10 cm de radio y 20 cm de altura. ¿Cuántos litros le caben? (π ≈ 3,14; 1 litro = 1 000 cm³)', ['6,28 litros', '62,8 litros', '25,12 litros', '628 litros'], 0, [
    'Correcto: 3,14 × 10² × 20 = 6 280 cm³, que son 6,28 litros.',
    'Dividió para 100 en lugar de 1 000.',
    'Usó el diámetro (20 cm) en lugar del radio.',
    'Dividió para 10 en lugar de 1 000.',
  ]),
  q('m-cg-04', `${CG}-1`, PP, 2, '¿Cuál es el volumen de una esfera de 3 cm de radio? (π ≈ 3,14)', ['113,04 cm³', '84,78 cm³', '37,68 cm³', '339,12 cm³'], 0, [
    'Correcto: (4 ÷ 3) × 3,14 × 27 = 113,04 cm³.',
    'Olvidó multiplicar por 4/3.',
    'Usó el radio al cuadrado; en la esfera va al cubo.',
    'Multiplicó por 4 pero olvidó dividir para 3.',
  ]),
  q('m-cg-05', `${CG}-1`, PP, 1, 'Una pirámide y un prisma tienen la misma base y la misma altura. El volumen de la pirámide es ____ del volumen del prisma.', ['la tercera parte', 'la mitad', 'el doble', 'igual'], 0, [
    'Correcto: V de la pirámide = (base × altura) ÷ 3.',
    'La mitad es la relación entre el triángulo y el rectángulo, no entre la pirámide y el prisma.',
    'La pirámide es más pequeña que el prisma, no más grande.',
    'Termina en punta: ocupa menos espacio que el prisma.',
  ], {formato: 'completamiento'}),
  q('m-cg-06', `${CG}-2`, D, 1, '¿Qué dice la fórmula de Euler para los poliedros convexos?', [
    'Caras + vértices = aristas + 2',
    'Caras + aristas = vértices + 2',
    'Caras × vértices = aristas',
    'Caras + vértices + aristas = 2',
  ], 0, [
    'Correcto: C + V = A + 2.',
    'Cambió vértices por aristas: en el cubo, 6 + 12 no es 8 + 2.',
    'No es un producto: en el cubo, 6 × 8 no es 12.',
    'La suma de los tres siempre es mayor que 2.',
  ]),
  q('m-cg-07', `${CG}-2`, PP, 1, 'Un icosaedro regular tiene 20 caras y 12 vértices. ¿Cuántas aristas tiene?', ['30', '32', '34', '28'], 0, [
    'Correcto: 20 + 12 = A + 2, así que A = 30.',
    'Sumó caras y vértices, pero falta restar 2.',
    'Sumó 2 en lugar de restarlo.',
    'Restó 4 en lugar de 2.',
  ]),
  q('m-cg-08', `${CG}-2`, PP, 2, 'Relaciona cada poliedro regular con sus caras.', ['1c, 2d, 3a, 4b', '1a, 2d, 3c, 4b', '1c, 2b, 3a, 4d', '1d, 2c, 3a, 4b'], 0, [
    'Correcto: tetraedro, 4 triángulos; cubo, 6 cuadrados; octaedro, 8 triángulos; dodecaedro, 12 pentágonos.',
    'El tetraedro («tetra», cuatro) tiene 4 caras; el octaedro («octo», ocho), 8.',
    'El cubo tiene caras cuadradas y el dodecaedro, pentagonales.',
    'El cubo tiene 6 caras cuadradas, no 4 triángulos.',
  ], {formato: 'emparejamiento', elementos: {izquierda: ['Tetraedro', 'Cubo', 'Octaedro', 'Dodecaedro'], derecha: ['8 triángulos', '12 pentágonos', '4 triángulos', '6 cuadrados']}, solucion: [2, 3, 0, 1]}),
  q('m-cg-09', `${CG}-2`, PP, 1, 'Un cubo tiene 6 caras y 12 aristas. Según la fórmula de Euler, ¿cuántos vértices tiene?', ['8', '6', '4', '10'], 0, [
    'Correcto: 6 + V = 12 + 2, así que V = 8.',
    'Ese es el número de caras.',
    'Ese es el número de vértices de una cara.',
    'Restó 2 en lugar de sumarlo: V = 12 − 2.',
  ]),
  q('m-cg-10', `${CG}-2`, PP, 1, '¿Cuáles de estos poliedros regulares tienen caras triangulares?', ['1, 3 y 5', '1 y 3', '2 y 4', '1, 3 y 4'], 0, [
    'Correcto: el tetraedro, el octaedro y el icosaedro tienen caras triangulares.',
    'También el icosaedro: sus 20 caras son triángulos.',
    'El cubo tiene cuadrados y el dodecaedro, pentágonos.',
    'El dodecaedro tiene caras pentagonales, no triangulares.',
  ], {formato: 'seleccion', elementos: ['Tetraedro', 'Cubo', 'Octaedro', 'Dodecaedro', 'Icosaedro'], solucion: [0, 2, 4]}),

  // ── Recta y plano
  q('m-rp-01', `${RP}-1`, D, 1, '¿Cómo se llaman dos rectas de un mismo plano que nunca se cortan?', ['Paralelas', 'Perpendiculares', 'Secantes', 'Coincidentes'], 0, [
    'Correcto: las paralelas mantienen la misma dirección y nunca se cortan.',
    'Las perpendiculares se cortan formando ángulos de 90°.',
    'Las secantes se cortan en un punto.',
    'Las coincidentes tienen todos sus puntos en común.',
  ]),
  q('m-rp-02', `${RP}-1`, D, 1, 'Dos rectas secantes que forman cuatro ángulos rectos son ____.', ['perpendiculares', 'paralelas', 'coincidentes', 'oblicuas'], 0, [
    'Correcto: las perpendiculares se cortan formando ángulos de 90°.',
    'Las paralelas no se cortan.',
    'Las coincidentes son la misma recta.',
    'Las oblicuas se cortan sin formar ángulos rectos.',
  ], {formato: 'completamiento'}),
  q('m-rp-03', `${RP}-1`, D, 1, 'Las rectas l y m se cortan formando un ángulo de 60°. ¿Cómo son?', ['Secantes, pero no perpendiculares', 'Paralelas', 'Perpendiculares', 'Coincidentes'], 0, [
    'Correcto: se cortan en un punto, pero no forman ángulos de 90°.',
    'Las paralelas nunca se cortan.',
    'Para ser perpendiculares deberían formar 90°, no 60°.',
    'Las coincidentes son la misma recta; no forman ángulos.',
  ]),
  q('m-rp-04', `${RP}-1`, PP, 2, '¿Cuáles de estos pares de rectas son secantes?', ['2, 3 y 5', '1 y 4', '1, 2 y 3', '2 y 5'], 0, [
    'Correcto: las líneas de la esquina, las agujas a las 3:00 y las diagonales del cuadrado se cortan.',
    'Los rieles y los renglones son paralelos: no se cortan.',
    'Los rieles del tren son paralelos.',
    'Las agujas del reloj a las 3:00 también se cortan (en el centro, a 90°).',
  ], {formato: 'seleccion', elementos: ['Los rieles de una línea de tren', 'Las líneas de una cancha que forman una esquina', 'Las agujas del reloj a las 3:00', 'Los renglones de un cuaderno', 'Las diagonales de un cuadrado'], solucion: [1, 2, 4]}),
  q('m-rp-05', `${RP}-1`, PP, 2, 'En un aula, una recta del techo y una recta del piso no son paralelas y nunca se cortan. Son rectas…', ['que se cruzan', 'secantes', 'paralelas', 'perpendiculares'], 0, [
    'Correcto: están en planos distintos, no son paralelas y no se cortan: se cruzan.',
    'Las secantes se cortan en un punto, y estas nunca se cortan.',
    'El enunciado dice que no son paralelas.',
    'Las perpendiculares se cortan formando 90°.',
  ]),
  q('m-rp-06', `${RP}-2`, PP, 1, '¿Cómo se clasifica un ángulo de 135°?', ['Obtuso', 'Agudo', 'Recto', 'Llano'], 0, [
    'Correcto: mide más de 90° y menos de 180°.',
    'Los agudos miden menos de 90°.',
    'El recto mide exactamente 90°.',
    'El llano mide exactamente 180°.',
  ]),
  q('m-rp-07', `${RP}-2`, PP, 1, '¿Cuál es el suplemento de un ángulo de 72°?', ['108°', '18°', '288°', '162°'], 0, [
    'Correcto: 180° − 72° = 108°.',
    'Ese es el complemento (90° − 72°).',
    'Restó de 360°: el suplemento se calcula con 180°.',
    'Sumó 90° en lugar de restar de 180°.',
  ]),
  q('m-rp-08', `${RP}-2`, PP, 2, 'Dos ángulos opuestos por el vértice miden 3x y 60°. ¿Cuánto vale x?', ['20', '10', '40', '60'], 0, [
    'Correcto: los opuestos por el vértice son iguales, 3x = 60 y x = 20.',
    'Los tomó como complementarios (3x + 60 = 90).',
    'Los tomó como suplementarios (3x + 60 = 180).',
    'Ese es el ángulo, no el valor de x.',
  ]),
  q('m-rp-09', `${RP}-2`, PP, 1, '¿Cuáles de estos pares de ángulos son complementarios?', ['2, 4 y 5', '1 y 3', '1, 2 y 4', '2 y 4'], 0, [
    'Correcto: 30° + 60°, 20° + 70° y 55° + 35° suman 90°.',
    'Esos pares suman 180°: son suplementarios.',
    '45° + 135° suman 180°: es suplementario.',
    'También 55° y 35° suman 90°.',
  ], {formato: 'seleccion', elementos: ['45° y 135°', '30° y 60°', '90° y 90°', '20° y 70°', '55° y 35°'], solucion: [1, 3, 4]}),
  q('m-rp-10', `${RP}-2`, PP, 1, 'Dos ángulos adyacentes (que comparten un lado y forman una línea recta) suman ____.', ['180°', '90°', '360°', '270°'], 0, [
    'Correcto: juntos forman un ángulo llano, 180°.',
    'Esa es la suma de los complementarios.',
    'Ese es el ángulo completo.',
    'Esa suma no corresponde a ninguna relación entre dos ángulos.',
  ], {formato: 'completamiento'}),

  // ── Medidas
  q('m-md-01', `${MD}-1`, D, 1, '¿A cuántos metros equivalen 4,25 km?', ['4 250 m', '425 m', '42,5 m', '42 500 m'], 0, [
    'Correcto: 1 km = 1 000 m, y 4,25 × 1 000 = 4 250 m.',
    'Multiplicó por 100: de kilómetros a metros hay tres pasos (× 1 000).',
    'Multiplicó por 10.',
    'Multiplicó por 10 000.',
  ]),
  q('m-md-02', `${MD}-1`, D, 2, 'Una película dura 2,25 horas. ¿Cuánto dura en horas y minutos?', ['2 h 15 min', '2 h 25 min', '2 h 30 min', '2 h 45 min'], 0, [
    'Correcto: 0,25 horas es un cuarto de hora, 0,25 × 60 = 15 minutos.',
    'Leyó el decimal como minutos: el tiempo no es decimal.',
    '2 h 30 min serían 2,5 horas.',
    '2 h 45 min serían 2,75 horas.',
  ]),
  q('m-md-03', `${MD}-1`, PP, 1, '¿Cuántos gramos hay en 0,8 kg?', ['800 g', '80 g', '8 000 g', '8 g'], 0, [
    'Correcto: 1 kg = 1 000 g, y 0,8 × 1 000 = 800 g.',
    'Multiplicó por 100.',
    'Multiplicó por 10 000.',
    'Multiplicó por 10.',
  ]),
  q('m-md-04', `${MD}-1`, PP, 1, 'Un atleta da 3 vueltas a una pista de 400 m. ¿Cuántos kilómetros recorre?', ['1,2 km', '12 km', '0,12 km', '120 km'], 0, [
    'Correcto: 3 × 400 = 1 200 m, y 1 200 ÷ 1 000 = 1,2 km.',
    'Dividió para 100 en lugar de 1 000.',
    'Dividió para 10 000.',
    'Dividió para 10.',
  ]),
  q('m-md-05', `${MD}-1`, PP, 2, '¿Cuántos segundos hay en 1 h 5 min?', ['3 900 s', '3 605 s', '65 s', '3 650 s'], 0, [
    'Correcto: 1 h = 3 600 s y 5 min = 300 s; en total, 3 900 s.',
    'Sumó 5 segundos en lugar de 5 minutos.',
    'Convirtió a minutos (65 min), no a segundos.',
    'Sumó 50 segundos: 5 minutos son 300 segundos.',
  ]),
  q('m-md-06', `${MD}-2`, D, 2, '¿A cuántos cm² equivalen 2,5 m²?', ['25 000 cm²', '250 cm²', '2 500 cm²', '250 000 cm²'], 0, [
    'Correcto: 1 m² = 10 000 cm², y 2,5 × 10 000 = 25 000 cm².',
    'Multiplicó por 100, como en longitud.',
    'Multiplicó por 1 000.',
    'Multiplicó por 100 000.',
  ]),
  q('m-md-07', `${MD}-2`, PP, 1, 'Una botella tiene 1,5 dm³ de capacidad. ¿Cuántos litros son?', ['1,5 litros', '15 litros', '150 litros', '0,15 litros'], 0, [
    'Correcto: 1 dm³ es exactamente 1 litro.',
    'Multiplicó por 10: no hace falta convertir.',
    'Multiplicó por 100.',
    'Dividió para 10.',
  ]),
  q('m-md-08', `${MD}-2`, PP, 1, 'Un terreno mide 2 hectáreas. ¿Cuántos metros cuadrados son?', ['20 000 m²', '200 m²', '2 000 m²', '200 000 m²'], 0, [
    'Correcto: 1 ha = 10 000 m², y 2 × 10 000 = 20 000 m².',
    'Multiplicó por 100.',
    'Multiplicó por 1 000.',
    'Multiplicó por 100 000.',
  ]),
  q('m-md-09', `${MD}-2`, PP, 1, '3 m³ equivalen a ____ dm³.', ['3 000', '30', '300', '30 000'], 0, [
    'Correcto: 1 m³ = 1 000 dm³.',
    'Multiplicó por 10, como en longitud.',
    'Multiplicó por 100, como en superficie.',
    'Multiplicó por 10 000.',
  ], {formato: 'completamiento'}),
  q('m-md-10', `${MD}-2`, PP, 2, 'Una cisterna de 2 m × 1,5 m × 1 m está llena. ¿Cuántos litros de agua tiene?', ['3 000 litros', '300 litros', '30 litros', '30 000 litros'], 0, [
    'Correcto: 2 × 1,5 × 1 = 3 m³, y 3 × 1 000 = 3 000 litros.',
    'Multiplicó por 100: cada m³ son 1 000 litros.',
    'Multiplicó por 10.',
    'Multiplicó por 10 000.',
  ]),

  // ── Estadística
  q('m-es-01', `${ES}-1`, D, 1, 'Los datos son 4, 9, 2, 7 y 3. ¿Cuál es la mediana?', ['4', '5', '2', '7'], 0, [
    'Correcto: ordenados quedan 2, 3, 4, 7, 9, y el del centro es 4.',
    'Esa es la media (25 ÷ 5).',
    'Tomó el dato del centro sin ordenar los datos.',
    'Ese es el rango (9 − 2).',
  ]),
  q('m-es-02', `${ES}-1`, D, 1, 'En la lista 5, 8, 8, 6, 8, 5, 9, ¿cuál es la moda?', ['8', '5', '7', '9'], 0, [
    'Correcto: el 8 aparece tres veces, más que cualquier otro.',
    'El 5 aparece dos veces; el 8, tres.',
    'Esa es la media (49 ÷ 7).',
    'Ese es el dato mayor.',
  ]),
  q('m-es-03', `${ES}-1`, D, 1, '¿Cuál es el rango de los datos 12, 18, 7, 25 y 14?', ['18', '14', '15,2', '13'], 0, [
    'Correcto: 25 − 7 = 18.',
    'Esa es la mediana.',
    'Esa es la media (76 ÷ 5).',
    'Restó el primero del mayor, no el menor del mayor.',
  ]),
  q('m-es-04', `${ES}-1`, PP, 2, 'Las notas de un estudiante son 8, 9, 7 y x. Si su promedio es 8,5, ¿cuánto vale x?', ['10', '8,5', '9', '24'], 0, [
    'Correcto: la suma debe ser 8,5 × 4 = 34, y 34 − (8 + 9 + 7) = 10.',
    'Ese es el promedio, no la nota que falta.',
    'Con 9 el promedio sería 8,25.',
    'Esa es la suma de las otras tres notas.',
  ]),
  q('m-es-05', `${ES}-1`, PP, 1, '¿Cuál es la mediana de los datos 2, 4, 6 y 8?', ['5', '4', '6', '20'], 0, [
    'Correcto: con un número par de datos, es el promedio de los dos centrales, (4 + 6) ÷ 2 = 5.',
    'Tomó solo uno de los dos datos centrales.',
    'Tomó solo uno de los dos datos centrales.',
    'Esa es la suma de los datos.',
  ]),
  q('m-es-06', `${ES}-1`, PP, 3, 'En una tabla, 4 estudiantes están en el intervalo [10, 20) y 6 en el intervalo [20, 30). ¿Cuál es la media?', ['21', '20', '25', '5'], 0, [
    'Correcto: con las marcas de clase 15 y 25, (15 × 4 + 25 × 6) ÷ 10 = 210 ÷ 10 = 21.',
    'Promedió las marcas de clase sin tener en cuenta cuántos estudiantes hay en cada una.',
    'Esa es la marca de clase del intervalo con más estudiantes.',
    'Promedió las frecuencias, no los datos.',
  ]),
  q('m-es-07', `${ES}-1`, PP, 1, '¿Qué mide la desviación estándar?', [
    'Qué tan dispersos están los datos alrededor de la media',
    'El dato que más se repite',
    'La diferencia entre el dato mayor y el menor',
    'El valor central de los datos ordenados',
  ], 0, [
    'Correcto: es la raíz de la varianza y mide la dispersión respecto de la media.',
    'Esa es la moda.',
    'Ese es el rango.',
    'Esa es la mediana.',
  ]),
  q('m-es-08', `${ES}-1`, PP, 3, 'Los datos 1, 3 y 5 tienen media 3. ¿Cuál es su varianza, dividiendo para el número de datos?', ['8/3', '4/3', '8', '2'], 0, [
    'Correcto: ((1 − 3)² + (3 − 3)² + (5 − 3)²) ÷ 3 = (4 + 0 + 4) ÷ 3 = 8/3.',
    'Promedió las distancias sin elevarlas al cuadrado.',
    'Sumó los cuadrados pero no dividió para 3.',
    'Esa es la distancia de cada extremo a la media.',
  ]),
  q('m-es-09', `${ES}-1`, PP, 1, 'Relaciona cada medida con su definición.', ['1b, 2a, 3d, 4c', '1a, 2b, 3d, 4c', '1b, 2a, 3c, 4d', '1c, 2a, 3d, 4b'], 0, [
    'Correcto: media, suma ÷ número de datos; mediana, el central; moda, el más repetido; rango, mayor − menor.',
    'La media es el cociente; la mediana es el dato central.',
    'La moda es el más repetido; el rango, la diferencia entre extremos.',
    'La media no es la diferencia entre extremos: ese es el rango.',
  ], {formato: 'emparejamiento', elementos: {izquierda: ['Media', 'Mediana', 'Moda', 'Rango'], derecha: ['El dato central con los datos ordenados', 'La suma de los datos dividida para el número de datos', 'La diferencia entre el dato mayor y el menor', 'El dato que más se repite']}, solucion: [1, 0, 3, 2]}),
  q('m-es-10', `${ES}-1`, PP, 2, 'Los sueldos de un grupo son parecidos, pero una persona gana mucho más que todas. ¿Qué medida representa mejor el sueldo típico?', ['La mediana', 'La media', 'El rango', 'La varianza'], 0, [
    'Correcto: la mediana no se deja arrastrar por un valor extremo.',
    'La media sube mucho por ese único sueldo alto.',
    'El rango mide dispersión, no un valor típico.',
    'La varianza mide dispersión, no un valor típico.',
  ]),

  // ── Combinaciones
  q('m-co-01', `${CO}-1`, D, 1, '¿Cuánto es C(6, 2)?', ['15', '30', '12', '36'], 0, [
    'Correcto: (6 × 5) ÷ 2 = 15.',
    'Contó el orden: 6 × 5 = 30 son variaciones.',
    'Multiplicó 6 × 2.',
    'Elevó 6 al cuadrado.',
  ]),
  q('m-co-02', `${CO}-1`, D, 2, 'De 8 docentes se elige una comisión de 3. ¿Cuántas comisiones distintas hay?', ['56', '336', '24', '512'], 0, [
    'Correcto: C(8, 3) = (8 × 7 × 6) ÷ (3 × 2 × 1) = 336 ÷ 6 = 56.',
    'Contó el orden (8 × 7 × 6): en una comisión el orden no importa.',
    'Multiplicó 8 × 3.',
    'Elevó 8 al cubo.',
  ]),
  q('m-co-03', `${CO}-1`, D, 1, '¿En cuál situación el orden NO importa?', [
    'Elegir 3 libros para llevar de viaje',
    'Formar una clave de 4 dígitos',
    'Repartir el 1.º, 2.º y 3.º lugar de una carrera',
    'Nombrar presidente y secretario de un comité',
  ], 0, [
    'Correcto: llevar los libros A, B y C es lo mismo que llevar C, B y A.',
    'En una clave, 1234 y 4321 son claves distintas.',
    'Ganar el primer lugar no es lo mismo que el tercero.',
    'Ser presidente no es lo mismo que ser secretario.',
  ]),
  q('m-co-04', `${CO}-1`, PP, 1, '¿Cuánto vale 5!?', ['120', '25', '15', '60'], 0, [
    'Correcto: 5 × 4 × 3 × 2 × 1 = 120.',
    'Elevó 5 al cuadrado.',
    'Sumó 5 + 4 + 3 + 2 + 1.',
    'Se detuvo antes: 5 × 4 × 3 = 60.',
  ]),
  q('m-co-05', `${CO}-1`, PP, 2, 'En una reunión hay 7 personas y cada una saluda una vez a todas las demás con un apretón de manos. ¿Cuántos saludos hay?', ['21', '42', '49', '14'], 0, [
    'Correcto: cada saludo es una pareja sin orden, C(7, 2) = (7 × 6) ÷ 2 = 21.',
    'Contó dos veces cada saludo (A con B y B con A).',
    'Elevó 7 al cuadrado.',
    'Multiplicó 7 × 2.',
  ]),
  q('m-co-06', `${CO}-1`, PP, 2, 'Elegir 2 estudiantes de 10 da el mismo número de grupos que elegir ____ de 10.', ['8', '5', '20', '12'], 0, [
    'Correcto: C(10, 2) = C(10, 8), porque elegir 2 es lo mismo que dejar fuera 8.',
    'Con 5 sale C(10, 5) = 252, distinto de 45.',
    'No se puede elegir 20 de 10.',
    'No se puede elegir 12 de 10.',
  ], {formato: 'completamiento'}),
  q('m-co-07', `${CO}-1`, PP, 1, 'Una pizzería ofrece 5 ingredientes. ¿Cuántas pizzas distintas de 3 ingredientes se pueden pedir?', ['10', '60', '15', '125'], 0, [
    'Correcto: C(5, 3) = (5 × 4 × 3) ÷ 6 = 10.',
    'Contó el orden de los ingredientes (5 × 4 × 3).',
    'Multiplicó 5 × 3.',
    'Elevó 5 al cubo.',
  ]),
  q('m-co-08', `${CO}-1`, PP, 1, 'Una caja tiene 4 bolas: roja, azul, verde y amarilla. ¿Cuántas parejas de colores distintos se pueden sacar?', ['6', '12', '8', '16'], 0, [
    'Correcto: C(4, 2) = (4 × 3) ÷ 2 = 6.',
    'Contó cada pareja dos veces (roja-azul y azul-roja).',
    'Multiplicó 4 × 2.',
    'Elevó 4 al cuadrado.',
  ]),
  q('m-co-09', `${CO}-1`, PP, 1, '¿Cuál es la fórmula de las combinaciones de n elementos tomados de k en k?', ['n! ÷ (k! × (n − k)!)', 'n! ÷ (n − k)!', 'n × k', 'nᵏ'], 0, [
    'Correcto: se divide para k! porque el orden de los k elegidos no importa.',
    'Esa es la fórmula de las variaciones: cuenta el orden.',
    'Multiplicar n × k no cuenta las maneras de elegir.',
    'nᵏ cuenta las selecciones con orden y con repetición.',
  ]),
  q('m-co-10', `${CO}-1`, PP, 3, 'Con 6 docentes y 4 directivos se forma una comisión de 2 docentes y 1 directivo. ¿Cuántas comisiones distintas hay?', ['60', '19', '120', '24'], 0, [
    'Correcto: C(6, 2) × C(4, 1) = 15 × 4 = 60.',
    'Sumó 15 + 4: las elecciones se combinan, así que se multiplican.',
    'Eligió 3 personas de las 10 sin respetar cuántas de cada grupo.',
    'Multiplicó 6 × 4 sin elegir las parejas de docentes.',
  ]),

  // ── Probabilidad
  q('m-pr-01', `${PB}-1`, D, 1, 'Se lanza un dado. ¿Cuál es la probabilidad de obtener un número par?', ['1/2', '1/6', '1/3', '2/3'], 0, [
    'Correcto: hay 3 pares (2, 4 y 6) de 6 resultados, 3/6 = 1/2.',
    'Esa es la probabilidad de un solo número.',
    'Contó solo 2 números pares.',
    'Contó 4 números pares.',
  ]),
  q('m-pr-02', `${PB}-1`, D, 1, 'En una rifa se venden 200 boletos y compras 5. ¿Cuál es la probabilidad de ganar?', ['1/40', '1/200', '1/5', '5 %'], 0, [
    'Correcto: 5/200 = 1/40, es decir, el 2,5 %.',
    'Esa es la probabilidad con un solo boleto.',
    'Dividió 1 para tus 5 boletos: hay que dividir tus boletos para el total vendido.',
    '5/200 es el 2,5 %, no el 5 %.',
  ]),
  q('m-pr-03', `${PB}-1`, D, 1, 'Si la probabilidad de que llueva mañana es 0,3, ¿cuál es la probabilidad de que no llueva?', ['0,7', '0,3', '1,3', '0'], 0, [
    'Correcto: 1 − 0,3 = 0,7.',
    'Esa es la probabilidad de que sí llueva.',
    'Una probabilidad no puede ser mayor que 1.',
    'Que no llueva es posible, así que su probabilidad no es 0.',
  ]),
  q('m-pr-04', `${PB}-1`, PP, 1, 'Se lanzan dos monedas. ¿Cuál es la probabilidad de obtener dos caras?', ['1/4', '1/2', '1/3', '3/4'], 0, [
    'Correcto: de 4 resultados (CC, CS, SC, SS), solo 1 es dos caras.',
    'Esa es la probabilidad de una cara con una sola moneda.',
    'Contó 3 resultados, pero «una cara y un sello» ocurre de dos maneras.',
    'Esa es la probabilidad de obtener al menos una cara.',
  ]),
  q('m-pr-05', `${PB}-1`, PP, 3, 'Se lanzan dos dados. ¿Cuál es la probabilidad de que la suma sea 7?', ['1/6', '1/12', '7/36', '1/11'], 0, [
    'Correcto: hay 6 casos (1-6, 2-5, 3-4, 4-3, 5-2, 6-1) de 36, 6/36 = 1/6.',
    'Contó solo 3 casos, pero 1-6 y 6-1 son resultados distintos.',
    'Usó la suma como número de casos favorables.',
    'Contó las 11 sumas posibles como si fueran igual de probables.',
  ]),
  q('m-pr-06', `${PB}-1`, PP, 1, 'Un suceso imposible tiene una probabilidad de ____.', ['0', '1', '0,5', '−1'], 0, [
    'Correcto: lo imposible tiene probabilidad 0.',
    'La probabilidad 1 es la de un suceso seguro.',
    '0,5 es la de un suceso tan probable como improbable.',
    'Las probabilidades nunca son negativas.',
  ], {formato: 'completamiento'}),
  q('m-pr-07', `${PB}-1`, PP, 1, 'En un grado hay 12 niñas y 18 niños. Si se elige un estudiante al azar, ¿cuál es la probabilidad de que sea niña?', ['2/5', '2/3', '3/5', '1/12'], 0, [
    'Correcto: 12 niñas de 30 estudiantes, 12/30 = 2/5.',
    'Dividió niñas para niños: hay que dividir para el total.',
    'Esa es la probabilidad de que sea niño.',
    'Tomó una sola niña como caso favorable.',
  ]),
  q('m-pr-08', `${PB}-1`, PP, 2, 'Una ruleta tiene 8 sectores iguales: 3 rojos, 4 azules y 1 blanco. ¿Cuál es la probabilidad de que NO caiga en azul?', ['1/2', '3/8', '1/8', '5/8'], 0, [
    'Correcto: los no azules son 3 + 1 = 4 de 8, 4/8 = 1/2.',
    'Contó solo los rojos.',
    'Contó solo el blanco.',
    'Hizo 1 − 3/8: restó los rojos en lugar de los azules.',
  ]),
  q('m-pr-09', `${PB}-1`, PP, 1, 'Al lanzar un dado común, ¿cuáles sucesos son seguros (probabilidad 1)?', ['2, 4 y 5', '1 y 3', '2 y 3', '3, 4 y 5'], 0, [
    'Correcto: siempre sale un número menor que 7, natural y entre 1 y 6.',
    'Sacar un 7 es imposible y sacar par es posible, pero no seguro.',
    'Sacar un número par no es seguro: puede salir impar.',
    'Sacar un número par es posible, pero no seguro.',
  ], {formato: 'seleccion', elementos: ['Sacar un 7', 'Sacar un número menor que 7', 'Sacar un número par', 'Sacar un número natural', 'Sacar un número entre 1 y 6'], solucion: [1, 3, 4]}),
  q('m-pr-10', `${PB}-1`, PP, 1, 'Una funda tiene 10 caramelos de fresa, 6 de menta y 4 de limón. ¿Cuál es la probabilidad de sacar uno de menta?', ['3/10', '1/3', '1/2', '6/14'], 0, [
    'Correcto: 6 de 20 caramelos, 6/20 = 3/10.',
    'No basta contar sabores: hay distinta cantidad de cada uno.',
    'Esa es la probabilidad de sacar uno de fresa.',
    'Dividió para los que no son de menta; hay que dividir para el total.',
  ]),
];
