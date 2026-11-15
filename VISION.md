# Academia para docentes · Visión

> Documento vivo. Aquí queda lo que se decidió y lo que falta decidir. Antes de construir cualquier parte, se lee esto.
> Empezado el 15 de noviembre de 2026.

---

## 1. En una frase

Una plataforma en línea donde los **docentes de Ecuador se preparan para la Evaluación del Desempeño Docente del Ineval**. Es más didáctica, más interactiva y más barata que los cursos de $200 que se venden hoy. Funciona en el teléfono y en la computadora, y tiene un tutor con IA que sabe en qué falla cada docente.

## 2. El negocio y para quién

- **Quién aprende:** docentes en funciones que van a rendir la evaluación del Ineval, que decide ascensos y recategorizaciones. Son adultos, profesionales, con poco tiempo, y estudian de noche o en recreos, casi siempre desde el teléfono. **No son estudiantes de colegio.**
- **La idea:** salió del cuñado del dueño, profesor de Ciencias Naturales en Riobamba. Según él, hoy se venden cursos de preparación a unos $200. Nosotros ofrecemos algo mejor y más barato.
- **Por dónde empezamos:** la especialidad **Ciencias Naturales de Educación General Básica Superior (8.º a 10.º)**. Después vienen las demás materias (Matemática, Lengua y las otras).
- **Algo que juega a favor:** el bloque de **Conocimientos generales**, pedagógicos y digitales, es **el mismo para todas las especialidades**. Si se construye una vez, sirve para todos los docentes del país, desde el primer día, sea cual sea su materia.
- **El camino:**
  1. Hoy: una demo para el cuñado.
  2. Si la aprueba: se pule con él.
  3. Después: se venden los accesos.
- **Cómo trabajamos:** por partes. El dueño toma las decisiones importantes de cada parte, y no se construye todo de un golpe.

## 2b. Lo que decidió el dueño (15 nov, segunda conversación)

- **Se arma el curso completo de la Dimensión 1:** todas las unidades, los temas y las lecciones, sacados del PDF. Nada se inventa fuera de la ficha.
- **Página de inicio sencilla y bonita, con «Iniciar sesión».** En la demo no hay registro abierto: el dueño crea las cuentas y le entrega las credenciales al cuñado.
- **Después de entrar:**
  1. El docente elige su **especialidad**. Hoy solo está Ciencias Naturales; las demás aparecen como «próximamente».
  2. Hace el **diagnóstico de entrada**, porque para planificar la ruta primero hay que saber en qué punto está.
  3. **Entonces se abre la plataforma completa:** cursos, perfil y ruta.
- **Desde el primer minuto tiene que verse dinámica e interactiva,** no como una plataforma de leer texto. El diagnóstico ya tiene que mostrarlo.
- **Un núcleo que sirva para cualquier materia** (sección 4b): cada materia es distinta, pero el motor es el mismo.
- **Se construye por partes, y cada parte se prueba antes de pasar a la siguiente:**
  1. Base de datos.
  2. Lógica de negocio (el servidor).
  3. Interfaz y experiencia.

  Hay pruebas automáticas en cada parte, y un recorrido completo antes de mandarle el enlace al cuñado: no puede encontrar errores.
- **Se recicla el proyecto del hotel:** se clona en un proyecto nuevo, y el del hotel no se toca.
- **Interfaz:** del estilo de la del hotel, un poco más bonita. El dueño va a mandar una referencia de diseño, y la interfaz se hace como esa referencia.
- **Videos:** los hace el dueño con NotebookLM a partir del contenido, y se suben en la plataforma. No se usan videos de YouTube.
- **Teléfono:** tiene que sentirse como una app, instalable en la pantalla de inicio.
- **Tiene que ser real,** no una maqueta: si al cuñado le gusta, esto se pule y se lanza a la venta.

## 3. Qué evalúa el Ineval (de la ficha técnica 2026)

La fuente es `3. Ficha Técnica evaluación docente__CCNN.pdf` del Ineval, Evaluación del Desempeño Docente 2026, Fase 1.

La ficha tiene cuatro dimensiones. **Trabajamos solo la Dimensión 1, Saberes disciplinares**, porque es la única que tiene respuestas correctas e incorrectas. Las otras tres son un autorreporte socioemocional, una autoevaluación y una clase grabada que se califica con rúbrica.

| Prueba | Preguntas | Tiempo | Ritmo por pregunta |
|---|---|---|---|
| Conocimientos generales (pedagógicos y digitales) | 39 | 45 min | unos 69 segundos |
| Conocimientos disciplinares de Ciencias Naturales | 60 | 120 min | 2 minutos |

- Todas las preguntas son de **4 opciones con una sola correcta**.
- Vienen en **cinco formatos**:
  1. **Simple:** pregunta directa.
  2. **Completamiento:** un enunciado con espacios en blanco.
  3. **Selección de elementos:** una lista numerada, y las opciones son combinaciones, por ejemplo «1, 3 y 4».
  4. **Ordenamiento:** pasos numerados, y las opciones son secuencias.
  5. **Emparejamiento:** dos columnas, y las opciones son parejas, por ejemplo «1b, 2a, 3c».
- Hay que imitar estos formatos al pie de la letra en el simulacro, porque así es el examen de verdad.

Contexto: la Fase 1 de 2026 se aplicó en julio, y la primera jornada se reprogramó por fallas en la plataforma del Ineval ([El Diario](https://eldiario.ec/ecuador/ineval-reprograma-la-primera-jornada-de-la-evaluacion-del-desempeno-docente-tras-fallos-en-sistema-02072026/), [Primicias](https://www.primicias.ec/sociedad/fallas-plataforma-ineval-evaluacion-desempeno-docente-2julio-reprogramacion-126997/)). **La fecha de la próxima evaluación hay que preguntársela al cuñado**, porque de eso depende cuándo vender.

**Aviso obligatorio en la plataforma:** «No somos el Ineval. El temario sale de la ficha técnica pública 2026». No se usan el logo ni el nombre del Ineval como marca.

## 4. Cómo se arma el curso

### La estructura

Seguimos el orden del PDF, para que el docente reconozca su temario oficial:

```
Especialidad (Ciencias Naturales)
└─ Bloque (Conocimientos generales · Conocimientos de Ciencias Naturales)
   └─ Unidad (cada tabla de color del PDF)
      └─ Tema (cada fila «Tema» del PDF)
         └─ Lección (cada «Subtema» del PDF)
```

### El mapa completo: 2 bloques, 9 unidades, 31 temas

**Bloque 1 · Conocimientos generales (39 preguntas, 45 min)**

| Unidad | Temas |
|---|---|
| 1. Fundamentos para el aprendizaje | Teorías del aprendizaje (conductismo, cognitivismo, constructivismo, conectivismo) · Diseño Universal para el Aprendizaje (DUA) 2.0 |
| 2. Currículo y planificación | Planificación curricular (objetivo, contenido, metodología, evaluación) · Evaluación educativa (diagnóstica, formativa, sumativa; lista de cotejo, rúbrica, diario de reflexión, diana, portafolio) |
| 3. Proceso de enseñanza-aprendizaje | Metodologías (ABP, STEAM+H, gamificación, aula invertida, ABP por problemas) · Técnicas (debate, foro, exposición, organizadores gráficos, resúmenes, lluvia de ideas, panel, mesa redonda, ensayo, línea de tiempo, juego de roles) |
| 4. Recursos, medios y herramientas digitales | Recursos educativos digitales abiertos (accesibilidad, reusabilidad, adaptabilidad, interactividad, portabilidad) · Medios digitales (multimodalidad, hipertextualidad) · Herramientas tecnológicas (sincrónicas y asincrónicas, entornos virtuales, ofimática) |
| 5. Uso seguro de internet | Riesgos en entornos digitales (ciberacoso, sexteo, plagio, suplantación, tecnoadicciones, grooming, phishing, spam, antivirus) |

**Bloque 2 · Conocimientos de Ciencias Naturales (60 preguntas, 120 min)**

| Unidad | Temas |
|---|---|
| 6. Los seres vivos y su ambiente | Propiedades de los seres vivos · Organización de la materia viva · Anatomía celular · Fisiología celular · Histología · Clasificación de los seres vivos · Flujos de energía y cadenas tróficas · Evolución · Ecosistemas y áreas protegidas de Ecuador |
| 7. Cuerpo humano y salud | Reproducción humana · Aparatos y sistemas · Sistema inmunológico · Salud sexual y ETS · Seres humanos y organismos patógenos |
| 8. Materia y energía | El carbono y las biomoléculas · El movimiento y la fuerza |
| 9. La Tierra y el Universo | Origen y estructura del universo · Ciclos biogeoquímicos · Efectos antrópicos · Origen de la vida · Cambios geológicos |

Las lecciones de cada tema son los subtemas del PDF: 70 en total (13 de generales y 57 de Ciencias Naturales).

### Qué lleva cada tema

1. **Diagnóstico del tema:** 4 o 5 preguntas al entrar. Si el docente saca 80 % o más, puede marcar el tema como «Ya lo sé» y saltarlo. Es un adulto y su tiempo vale.
2. **Lecciones cortas,** de 5 a 8 minutos cada una. Cada lección tiene:
   - la clase, en video o en un laboratorio interactivo;
   - un resumen visual;
   - 3 preguntas rápidas para comprobar lo aprendido;
   - el tutor con IA a la mano.
3. **Laboratorio interactivo,** cuando el tema lo pide (la célula, la hoja, la mitosis, las placas tectónicas…).
4. **Prueba del tema:** unas 10 preguntas en los cinco formatos del Ineval, con retroalimentación de cada opción. Con 80 % o más el tema queda **dominado**. Con menos, la plataforma arma un **refuerzo** solo con los subtemas fallados y luego da otra prueba con preguntas nuevas.
5. Las preguntas falladas **vuelven a aparecer** en el repaso diario (ver la sección 5).

Cada unidad termina con una **prueba de unidad**, que mezcla sus temas.

## 4b. El núcleo para cualquier materia

El motor no sabe nada de Ciencias Naturales: todo lo que es de la materia vive en los **datos**.

- **Una especialidad** es su ficha cargada como datos:
  - bloques, unidades, temas y subtemas;
  - las pruebas de cada bloque, con su cantidad de preguntas y su tiempo;
  - su banco de preguntas;
  - sus lecciones y videos;
  - sus laboratorios.
- **El bloque de Conocimientos generales se guarda una sola vez** y lo comparten todas las especialidades.
- **Todo sale de esos datos:** el diagnóstico, la ruta, el dominio, el repaso y los simulacros. Por ejemplo, el diagnóstico toma 2 preguntas de cada unidad de la especialidad que eligió el docente.
- **Para agregar una materia nueva no se toca el código.** Los pasos son:
  1. Cargar su ficha. La IA ayuda a pasar el PDF a la estructura, y una persona la revisa.
  2. Escribir o generar sus preguntas.
  3. Que el experto las apruebe.
  4. Subir sus videos.
- Los laboratorios interactivos son piezas reutilizables, como «tocar las partes de un dibujo», «ordenar tarjetas» o «unir columnas». Cada materia las usa con sus propios dibujos y textos.

## 4c. El diagnóstico de entrada

Es lo primero que vive el docente, así que tiene que enganchar y, al mismo tiempo, ubicarlo bien.

1. **No se le pregunta cuándo es su examen ni cuánto tiempo tiene** (decidido el 15 nov). Al docente no le gusta que lo interroguen. La plataforma lo entiende por lo que hace, no por un formulario. Se le presenta como «No es un examen: es para conocerte y armar tu ruta», y al final se le muestran primero sus fortalezas.
2. **18 preguntas, 2 por unidad,** en unos 15 minutos. Se mezclan los formatos interactivos, para que desde el primer minuto se vea que esto no es leer texto:
   - tocar la parte de un dibujo;
   - ordenar tarjetas;
   - unir columnas;
   - elegir una opción.
3. **Después de cada respuesta, «¿Qué tan seguro estás?»:** «Lo sé», «Creo» o «Adiviné». Así se separa el que sabe del que tuvo suerte.
4. **Durante el diagnóstico no se dice si acertó,** porque es para ubicarlo y no para enseñar. Pero se siente vivo: barra de avance, animaciones y los sonidos del examen tipo juego del hotel.
5. **Al final se revela su mapa:**
   - las 9 unidades coloreadas según el resultado;
   - «Tu preparación hoy: 41 %»;
   - su **ruta**: los temas en orden, empezando por los más débiles y los que más pesan en el examen;
   - lo que le toca hoy: una lección y su repaso.

**Cómo se ubica cada unidad:**

| Resultado en la unidad | Qué significa | Qué pasa con sus temas |
|---|---|---|
| Las 2 bien y seguro | Probablemente la domina | Cada tema ofrece una prueba rápida para saltarlo |
| Una bien, o bien pero adivinando | La está aprendiendo | Sus temas entran a la ruta en la mitad |
| Las 2 mal | Es su punto débil | Sus temas van primero en la ruta |

Al entrar a cada tema hay además una prueba corta que afina la ubicación.

## 4d. Videos (con NotebookLM)

- **Hay un video por tema,** es decir, 31 en Ciencias Naturales, de 5 a 8 minutos cada uno. Por lección serían 90, y eso es demasiado.
- **Lo que se carga en NotebookLM para hacer cada video:** el equipo prepara un archivo por tema con su contenido, sacado de la ficha y de las lecciones. Así el video dice lo mismo que la lección.
- **En el panel de administración,** cada tema tiene «Subir video»: un archivo MP4 que se guarda en el servidor. También se puede poner un enlace.
- **Para la demo** basta con el video del tema que se abre.

## 5. Cómo se aprende aquí: el método

No inventamos un método. Usamos lo que la investigación muestra que funciona.

| Principio | Qué dice la evidencia | Cómo se ve en la plataforma |
|---|---|---|
| **Practicar respondiendo** (práctica de recuperación) | Es una de las dos técnicas de mayor utilidad según la revisión de Dunlosky y colegas (2013) ([resumen APS](https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html)). Releer y subrayar casi no sirve. | Hay preguntas cada pocos minutos, no solo al final. |
| **Repaso espaciado** | Es la otra técnica de mayor utilidad (Dunlosky, 2013): estudiar repartido en el tiempo gana a estudiar todo de golpe. | «Repaso de hoy»: una pregunta fallada vuelve al día siguiente; si se acierta, vuelve a los 3, 7, 14 y 30 días. |
| **Aprender hasta dominar** (Bloom) | Se avanza cuando se domina, no cuando se termina de ver. | El dominio de cada tema va de 0 a 100 %, y se considera dominado desde el 80 %. |
| **Retroalimentación que explica** | La retroalimentación que dice *por qué*, y no solo «correcto» o «incorrecto», mejora el aprendizaje. | Cada opción equivocada trae su explicación: por qué no es y qué confunde. |
| **Práctica mezclada** | Mezclar temas entrena a reconocer qué se está preguntando, igual que en el examen real. | Los simulacros y las pruebas de unidad mezclan temas. |
| **Imagen + palabra** (Mayer) | Se aprende mejor con un dibujo y su explicación juntos que con texto solo. | Laboratorios interactivos y esquemas en cada lección. |
| **Lecciones cortas** | Para un adulto con poco tiempo. | Clases de 5 a 8 minutos y una meta diaria de 10, 20 o 30 minutos. |

**«Cada persona es única», dicho con honestidad:** la idea de los «estilos de aprendizaje» (visual, auditivo…) no tiene respaldo científico (Pashler y colegas, 2008). Lo que sí funciona, y lo que hacemos, es:

- adaptarnos a **lo que cada docente ya sabe y a dónde falla**, con el diagnóstico, el dominio por tema y el repaso de sus propios errores;
- dar **varias formas de ver lo mismo**: video, laboratorio, resumen y la explicación del tutor. Esto es justamente el principio de *representación* del DUA, que está en el temario.

**Argumento de venta:** la plataforma enseña con las mismas metodologías que el Ineval le va a preguntar al docente:

- evaluación diagnóstica, formativa y sumativa;
- gamificación;
- aula invertida;
- DUA.

El docente las vive mientras estudia.

## 6. El recorrido del docente

1. **Llega a la página de inicio,** sencilla y bonita, y entiende en 5 segundos qué es y para qué le sirve. Toca **«Iniciar sesión»**. En la demo entra con las credenciales que le da el dueño. Cuando se venda, habrá registro y, más adelante, un diagnóstico gratis como gancho.
2. **Elige su especialidad:** Ciencias Naturales. Las demás aparecen como «próximamente».
3. **Hace el diagnóstico de entrada,** que se explica en la sección 4c.
4. **Ve su mapa:** la plataforma le muestra «Tu preparación hoy: 41 %», sus unidades fuertes y débiles, y una **ruta sugerida** que empieza por lo más débil.
5. **Estudia todos los días:** abre la plataforma, ve «Continúa donde te quedaste» y hace su repaso de hoy, que son unas 6 preguntas.
6. **Domina temas,** y su porcentaje de preparación sube.
7. **Hace simulacros** iguales al real, cronometrados, cuando quiera.
8. **Revisa su perfil:** su evolución, sus errores frecuentes y lo que le falta.

El número que se ve en todos lados es la **preparación para tu evaluación, en %**, calculada con el dominio de los 31 temas y con el peso que cada bloque tiene en el examen.

## 6b. Dirección visual (referencias del dueño, 15 nov)

El dueño mandó 6 referencias de Pinterest: AdsVoice, Vektora Academy, Edulearn, Quest y DoDo. Lo que tienen en común, y lo que se toma de ellas:

- **Modo claro y modo oscuro,** que cada docente elige con un interruptor. Arranca con el modo del teléfono.
- **Tarjetas suaves y redondeadas** (16 a 24 px), con mucho aire y fondo apenas tintado detrás de las tarjetas blancas. Es más cálido que el estilo del hotel, pero igual de limpio.
- **Barra lateral con íconos y nombres** en la computadora, y barra inferior en el teléfono.
- **Saludo arriba:** «Hola, Juan 👋 ¿Qué aprendemos hoy?».
- **Anillos de progreso** por unidad y por tema, y tarjetas de curso con imagen.
- **La lección al estilo AdsVoice:** el video grande, y a un lado las pestañas Resumen, Tutor IA y Notas. El tutor se ve como en la tarjeta «Ask Anything».
- **Un acento de color principal.** Se elige al diseñar.
- **Se mantiene del hotel:** una sola tipografía, líneas finas, nada recargado y nada infantil.
- **Cómo se diseña (pedido del dueño, 15 nov):** con las skills `impeccable` y `taste-skill`, y siguiendo las buenas prácticas web modernas de Google (rendimiento, accesibilidad, PWA).

## 7. Las pantallas

Se diseñan primero para el teléfono. En la computadora se usa más ancho, con barra lateral.

### Página web pública (antes de entrar)

- **Arriba:** «Prepárate para tu Evaluación del Desempeño Docente» y el botón «Haz tu diagnóstico gratis».
- **Cómo funciona,** en 3 pasos: diagnóstico, ruta personal y simulacro real.
- **Qué incluye:** el temario completo de la ficha 2026, laboratorios, el tutor con IA, simulacros y repaso inteligente.
- **Comparación** con los cursos de $200.
- **Precios** (por definir), preguntas frecuentes y el aviso de que no somos el Ineval.

### Inicio (ya dentro)

```
┌──────────────────────────────┐
│ Hola, Juan          🔥 4 días │
│ Faltan 38 días para tu        │
│ evaluación                    │
│                               │
│ Tu preparación        41 %    │
│ ████████░░░░░░░░░░░░          │
│                               │
│ ▶ Continúa donde quedaste     │
│   Anatomía celular · Lección 2│
│                               │
│ ↻ Repaso de hoy · 6 preguntas │
│                               │
│ Meta de hoy  12 / 20 min      │
│                               │
│ Generales      ██████░░ 58 %  │
│ C. Naturales   ███░░░░░ 32 %  │
└──────────────────────────────┘
 Inicio  Curso  Simulacro  Perfil
```

### Mapa del curso

Muestra las unidades, y dentro de cada una, sus temas. Cada tema tiene un **anillo de dominio** y un estado:

- sin empezar;
- aprendiendo;
- dominado ✓;
- toca repasar ↻.

### Lección (al estilo Platzi)

```
┌──────────────────────────────┐
│ ← Anatomía celular   2 / 3    │
│ ┌──────────────────────────┐ │
│ │   [ video o laboratorio ] │ │
│ └──────────────────────────┘ │
│ Célula vegetal vs. animal     │
│ Resumen · Recursos · Tutor IA │
│ ───────────────────────────── │
│ (contenido de la pestaña)     │
│                               │
│ [ Comprueba lo que aprendiste ]│
└──────────────────────────────┘
```

### Laboratorio interactivo

Es la idea del dueño: en vez de leer las partes de la hoja, se toca la hoja y se abren sus partes. Los cinco formatos del Ineval se vuelven gestos:

| Formato del Ineval | En la práctica (interactivo) | Ejemplo de Ciencias Naturales |
|---|---|---|
| Simple | Tocar la respuesta en el dibujo | «Toca el organelo que hace la fotosíntesis» |
| Completamiento | Arrastrar la palabra al espacio | «La ____ celular solo está en la célula vegetal» |
| Selección de elementos | Marcar varias partes | «Marca los organelos que comparten la célula animal y la vegetal» |
| Ordenamiento | Arrastrar tarjetas en orden | Fases de la mitosis |
| Emparejamiento | Unir con líneas | Tejido vegetal ↔ su función |

**La regla clave:** en las lecciones y la práctica, todo es interactivo para aprender. En el **simulacro**, en cambio, se ve **igual que el examen real**, con 4 opciones, porque ahí se entrena el formato y el tiempo.

### Simulacro

- **Modos:**
  - Simulacro completo de generales: 39 preguntas en 45 minutos.
  - Simulacro completo de Ciencias Naturales: 60 preguntas en 120 minutos.
  - Simulacro corto: 15 preguntas en 20 minutos, para practicar a diario.
- **Durante el simulacro:**
  - cronómetro;
  - un indicador de ritmo, por ejemplo «vas 3 minutos atrasado»;
  - navegación entre preguntas;
  - «marcar para revisar».
- **Al final:**
  - nota por bloque y por unidad;
  - las preguntas falladas con su explicación;
  - el informe del tutor con IA: lo que dominas, lo que te falta y qué hacer esta semana;
  - si conviene, un puntaje de referencia en escala de 1000, que el Ineval usa por dimensión, siempre aclarando que **no es oficial**.

### Perfil

Incluye:

- sus datos y la fecha de su evaluación;
- la evolución de su preparación en el tiempo;
- el historial de simulacros, en un gráfico;
- el dominio de los 31 temas en un mapa de calor;
- sus errores frecuentes, con retroalimentación guardada;
- su racha y sus logros, y al terminar el curso, un certificado de finalización (no oficial).

## 8. La IA: para qué sí y para qué no

| Dónde | Qué hace |
|---|---|
| **Tutor en cada lección** | Responde dudas **solo con el contenido de la lección y del temario**. Pregunta antes de dar la respuesta, como un buen profesor. Tiene un botón «Explícamelo de otra forma» que da un ejemplo del aula, una analogía o un esquema. |
| **«¿Por qué me equivoqué?»** | Tras un error, profundiza a partir de la opción que eligió el docente. La explicación básica ya viene escrita en cada opción, así que no cuesta IA. La IA entra solo si el docente pide más. |
| **Ruta personal** | Lee el diagnóstico y arma el plan: «Empieza por Fisiología celular, tu punto más débil. Con 20 minutos al día llegas al 80 % antes del 20 de diciembre». |
| **Informe del simulacro** | Convierte los resultados en 3 frases que se pueden aplicar. |
| **Generador de preguntas** (panel de administración) | Escribe preguntas en formato Ineval a partir de un subtema. **El docente experto las revisa y aprueba antes de publicarlas.** Así se crece rápido a otras especialidades. |

**Lo que la IA no hace:**

- **No califica.** La nota sale de la clave de respuestas, sin IA, y siempre es exacta.
- **No publica contenido sin revisión humana.**
- **No inventa temario** fuera de la ficha.

El **costo** es por uso. Se mide en la demo antes de ponerle precio al acceso.

## 9. El panel de administración

| Sección | Para qué sirve |
|---|---|
| Resumen | Docentes inscritos, activos esta semana, temas que más se fallan y simulacros rendidos. |
| Docentes | Altas, accesos y planes, el estado del pago (manual al inicio) y el progreso de cada docente. |
| Cursos | Especialidad → bloque → unidad → tema → lección: video, texto, laboratorio y recursos. |
| Banco de preguntas | Los cinco formatos; la explicación de cada opción; dificultad; tema y subtema; estado «borrador» o «aprobada». |
| Generador IA | Crea borradores de preguntas para revisar. |
| Simulacros | Cantidades y tiempos; por defecto, los de la ficha. |
| Ajustes | Nombre, fecha de la evaluación, textos de la página web y precios. |

Para la demo, al panel de administración se entra con una contraseña de administrador guardada en el servidor, igual que en la gerencia del hotel. Más adelante habrá usuarios con rol de administrador.

## 10. Qué reusamos de la plataforma del hotel

La base es `evaluaciones-zeus`, en producción en `examenes.automationpherce.cloud`.

**Se reusa:**

- **El examen tipo juego,** con racha, sonidos y elogios, como base de la práctica y las pruebas.
- **El panel de gerencia,** que pasa a ser el panel de administración, con sus gráficos.
- **El inicio de sesión con cookies,** cambiado a correo y contraseña. Las contraseñas se guardan cifradas.
- **El estilo:**
  - fondo blanco y líneas finas;
  - una sola tipografía, Instrument Sans;
  - un solo color de acento;
  - botones de 8 px.

  Es el estilo que el dueño ya aprobó. Se puede cambiar el color de acento para darle marca propia a la academia.
- **La forma de publicar:** Docker, Coolify y datos en `/data`.

**Se agrega:**

- la página web pública;
- lecciones con video;
- laboratorios;
- el tutor con IA;
- el repaso espaciado;
- los simulacros;
- el perfil;
- que sea **instalable en el teléfono** (PWA, es decir, «Agregar a pantalla de inicio»). La base no lo trae.

**Cómo se clona sin tocar el hotel:**

1. Se copia el código a esta carpeta.
2. Se crea un **repositorio nuevo y privado** en GitHub.
3. En Coolify se crea un **proyecto nuevo**, con su propia app, su propio volumen de datos y su propio subdominio en `*.automationpherce.cloud`.
4. La app, el repositorio y los datos del hotel no se tocan.

**Datos:** a diferencia del hotel, que guarda en archivos, aquí se usa una **base de datos Postgres** desde el principio. Va en el mismo servidor de Coolify, como una base propia de este proyecto.

- **Por qué:** esto se va a vender y debe aguantar a muchos docentes, y así no hay que migrar los datos más tarde.
- **En las pruebas automáticas** se usa una copia de Postgres que corre dentro de las mismas pruebas, sin instalar nada.

Es una decisión técnica del equipo y se puede revisar.

## 10b. Cómo se construye: tres partes, cada una probada

| Parte | Qué se hace | Cómo se sabe que está bien |
|---|---|---|
| **1. Base de datos** | Se copia el proyecto del hotel a esta carpeta y se quita todo lo del hotel. Se crean las tablas para especialidades, bloques, unidades, temas, lecciones, preguntas (en los cinco formatos), docentes, respuestas, dominio, repaso, simulacros y videos. Se carga la **estructura completa de la Dimensión 1** desde el PDF y el banco inicial de preguntas. | Pruebas automáticas: que existan las 9 unidades y los 31 temas, que cada pregunta tenga 4 opciones y una sola correcta con su explicación, y que el diagnóstico tenga 2 preguntas por unidad. |
| **2. Lógica de negocio** | Ingreso con correo y contraseña; elección de especialidad; diagnóstico y ubicación; ruta y calendario; dominio por tema; repaso espaciado; pruebas y refuerzo; simulacro con tiempo; tutor con IA; panel de administración, con la subida de videos. | Pruebas automáticas de cada regla. Por ejemplo: con 80 % el tema queda dominado; una pregunta fallada vuelve mañana; el simulacro se cierra solo al acabarse el tiempo; un docente no ve los datos de otro. |
| **3. Interfaz y experiencia** | Hecha como la referencia de diseño del dueño, partiendo de la del hotel. Incluye la página de inicio, el diagnóstico, el inicio, el curso, las lecciones, los laboratorios, el simulacro, el perfil, el panel de administración y la instalación en el teléfono. | Pruebas del recorrido completo en teléfono y en computadora, hechas en el navegador como lo haría el cuñado, **antes** de mandarle el enlace. |

**Publicación:**

- un repositorio **privado y nuevo** en GitHub;
- un **proyecto nuevo** en Coolify, con su app, su Postgres y su subdominio.

El hotel queda intacto.

## 11. La demo de hoy

**El objetivo:** que el cuñado entre desde su teléfono, cree su cuenta, haga el diagnóstico, estudie **un tema completo** y diga «¡uy, está genial!».

**Lo que funciona de verdad:**

- la página web pública;
- el registro y el ingreso con correo y contraseña;
- el diagnóstico inicial;
- el inicio, con su preparación en %, la racha y «continúa donde quedaste»;
- el mapa completo del curso, con las 9 unidades y los 31 temas del PDF a la vista y uno abierto;
- **un tema completo:**
  - diagnóstico;
  - 2 o 3 lecciones;
  - un laboratorio interactivo;
  - práctica en los cinco formatos;
  - prueba del tema con retroalimentación;
  - refuerzo;
- el **tutor con IA** en las lecciones;
- un **simulacro corto** cronometrado que mezcla temas. Para eso se escribe un pequeño banco de preguntas de varias unidades;
- el perfil, con su progreso;
- el panel de administración: docentes, preguntas y resultados;
- la instalación en el teléfono.

**Lo que se ve, pero queda «próximamente»:**

- los demás temas, que aparecen con candado;
- los pagos;
- las demás especialidades.

**Contenido:** lo escribe el equipo a partir de la ficha, y queda marcado como **contenido de demo para que lo revise el docente experto**, es decir, el cuñado.

## 12. Después de la demo, por partes

| Parte | Qué |
|---|---|
| 1. Pulir con el cuñado | Sus comentarios, el contenido real de Ciencias Naturales (31 temas) y un banco grande de preguntas (cada simulacro completo usa 99, así que hacen falta varios cientos). |
| 2. Videos | Él graba las clases cortas, y se suben a cada lección. |
| 3. Listo para vender | Base de datos real, recuperar contraseña por correo, pagos en Ecuador (por definir: Payphone, Kushki, transferencia con validación manual…), planes y precios. |
| 4. Crecer | Otras especialidades (el bloque general ya está hecho), comunidad o foro por lección, ingreso con Google y certificados. |

## 13. Decisiones del dueño

Cada decisión lleva una recomendación. Marcar ✅ cuando esté decidida.

| # | Decisión | Opciones | Recomendación |
|---|---|---|---|
| 1 | **Nombre de la plataforma** (puede ser provisional para la demo) | «Prepa Docente», «Aula Docente», «Ruta Docente» u otro | «Ruta Docente»: habla del camino personal, que es lo que la hace distinta. |
| 2 | **El tema de la demo** | a) **Anatomía celular**: célula vegetal contra animal, se tocan los organelos. b) **Histología**: la hoja y sus tejidos, la idea exacta del dueño. | a) Es el tema más conocido, el laboratorio luce mucho y deja pasar a la mitosis (ordenamiento) y la ósmosis (simulador). La hoja va como segundo laboratorio cuando se pula. |
| 3 | **Qué IA usa el tutor** | a) Gemini, con nivel gratis. b) Claude o ChatGPT por API, pagado. Ambas necesitan una clave. | a) Para la demo, porque cuesta $0. Se decide la pagada antes de vender. |
| 4 | ✅ **El video de la lección en la demo** | **Decidido:** lo hace el dueño con NotebookLM y se sube en la plataforma. No se usa YouTube. | — |
| 5 | **El subdominio** | `rutadocente.automationpherce.cloud` o el que se elija | Se ajusta al nombre que se elija. Es provisional hasta comprar un dominio propio. |

## 14. Preguntas para el cuñado

1. ¿Cuándo es la próxima evaluación, o la próxima fase, para su especialidad?
2. ¿Quién graba los videos? ¿Él?
3. ¿Qué precio se imagina? ¿Y qué incluyen los cursos de $200 que vio?
4. ¿Tiene material propio, como bancos de preguntas, resúmenes o simulacros que ya usen los docentes?

## 15. Cuidados

- **Contenido correcto:** todo lo de Ciencias Naturales lo revisa el docente experto antes de vender. Una pregunta mal hecha destruye la confianza.
- **No parecer el Ineval:** marca propia y el aviso visible.
- **Videos de terceros:** solo en la demo. Para vender se usan videos propios.
- **Costo de la IA:** se mide en la demo y se le pone un límite por docente.
- **El hotel no se toca:** proyecto, repositorio y datos separados.

## Fuentes

- Ficha técnica del Ineval, Evaluación del Desempeño Docente 2026, Ciencias Naturales EGB Superior (el PDF del cuñado).
- Dunlosky et al. (2013), *Improving Students' Learning With Effective Learning Techniques*: [resumen de la APS](https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html) y [artículo en American Educator](https://www.aft.org/ae/fall2013/dunlosky).
- Bloom (1984), aprendizaje para el dominio. Roediger y Karpicke (2006), efecto de practicar respondiendo. Kornell y Bjork (2008), práctica mezclada. Mayer, principios multimedia. Pashler et al. (2008), sobre los estilos de aprendizaje.
- Noticias sobre la Fase 1 de 2026: [El Diario](https://eldiario.ec/ecuador/ineval-reprograma-la-primera-jornada-de-la-evaluacion-del-desempeno-docente-tras-fallos-en-sistema-02072026/) y [Primicias](https://www.primicias.ec/sociedad/fallas-plataforma-ineval-evaluacion-desempeno-docente-2julio-reprogramacion-126997/).
