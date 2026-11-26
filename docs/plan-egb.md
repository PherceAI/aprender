# Plan: Educación General Básica (2.º a 7.º)

> Empezado el 26 nov 2026. El cuñado pidió empezar por EGB 2.º a 7.º porque es la especialidad con más docentes del magisterio.
> Fuente: `fuentes/Ficha EGB 2do a 7mo.pdf` (Ineval, Evaluación del Desempeño Docente 2026, Fase 1).
> Las otras fichas que mandó (Ciencias Sociales EGB Superior, Biología, Química, Filosofía y Emprendimiento de Bachillerato) están en `fuentes/` y esperan su turno: **una especialidad a la vez, y no se pasa a la siguiente hasta que la anterior quede bien.**

## Qué se prepara

Solo la **Dimensión 1** (examen 2027). Las páginas 9 a 17 de la ficha (dimensiones 2, 3, 4 y factores asociados) no se usan.

| Prueba | Preguntas | Tiempo |
|---|---|---|
| Conocimientos generales | 39 | 45 min |
| Conocimientos disciplinares de EGB | 60 | 120 min |

- **Conocimientos generales** es idéntico al de Ciencias Naturales (págs. 4 y 5). Ya existe en la plataforma y se reutiliza tal cual: 5 unidades, 10 temas, 13 lecciones, 59 preguntas.
- **Conocimientos disciplinares** es lo nuevo. A diferencia de CCNN, mezcla **cuatro asignaturas** en una sola prueba de 60 preguntas.

## El temario disciplinar (págs. 6 a 9)

| Asignatura | Unidades | Temas | Subtemas (lecciones) | Pág. |
|---|---|---|---|---|
| Matemática | Álgebra y funciones · Geometría y medida · Estadística y probabilidad | 9 | 16 | 6–7 |
| Lengua y Literatura | Lengua y cultura · Comunicación oral · Lectura · Escritura · Literatura | 8 | 14 | 7 |
| Ciencias Naturales | Los seres vivos y su ambiente · Cuerpo humano y salud · La materia · La Tierra | 7 | 15 | 7–8 |
| Ciencias Sociales | Historia e identidad · Los seres humanos en el espacio · Convivencia | 10 | 18 | 8–9 |
| **Total** | **15** | **34** | **63** | |

Con generales: 20 unidades, 44 temas y 76 lecciones.

La ficha no dice cuántas de las 60 preguntas son de cada asignatura. Hoy el motor reparte el peso por igual entre los temas (Sociales ≈ 18, Matemática ≈ 16, Lengua ≈ 14, Naturales ≈ 12). **Pregunta para el cuñado:** ¿sabe cómo se repartieron en 2026?

## Qué cambia en el código

El motor ya es de datos (VISION 4b): una especialidad nueva es una carpeta en `contenido/`. Lo único que EGB trae nuevo es el **nivel «asignatura»** entre el bloque y la unidad. Además hay textos fijos de CCNN que hay que volver dinámicos:

- `app/(app)/layout.tsx`: el detalle del usuario dice «Ciencias Naturales».
- `app/(app)/simulacro/page.tsx`: la prueba disciplinar dice «Ciencias Naturales».
- `components/ruta-modulos.tsx`: la etiqueta del módulo dice «Ciencias Naturales».
- `app/(foco)/diagnostico/page.tsx` y `diagnostico/[id]/resultado`: «31 temas», «40 preguntas».
- `app/(app)/admin/videos.tsx`: «Los 31 temas».
- `lib/ficha.ts`: un solo PDF y páginas de CCNN; pasa a una ficha por especialidad.
- `lib/evaluacion.ts`: el detalle «Ciencias Naturales, EGB Superior».
- `lib/visual.ts`: ilustración y color para las 15 unidades nuevas.
- `app/page.tsx` (landing): la tarjeta de EGB.

## Fases (cada una se prueba y se sube a producción antes de la siguiente)

1. **Base de datos y estructura.** Asignatura en las unidades (migración con columna opcional, CCNN no cambia). `contenido/egb/estructura.ts` con las 15 unidades, 34 temas y 63 lecciones al pie de la ficha. EGB queda como «Muy pronto»: en producción no se ve nada a medias. Pruebas de estructura.
2. **Lógica.** Ficha por especialidad, textos fijos a dinámicos, mapa del curso agrupado por asignatura. Pruebas.
3. **Diagnóstico de EGB.** Una pregunta por cada uno de los 34 temas, más las 13 de generales que ya existen (47 en total). Las revisa el cuñado.
4. **Interfaz.** Boceto primero (elegir especialidad, mapa con las 4 asignaturas, tarjeta de la landing), visto bueno del dueño y luego código. Teléfono sin scroll horizontal.
5. **Primeros temas abiertos.** Lecciones, práctica y prueba (mínimo 3 de diagnóstico del tema y 8 de prueba por tema).
6. **Simulacro y activación.** EGB pasa a «activa» y aparece en la landing.

## Regla de contenido óptimo (26 nov, pedido del dueño)

El docente no estudia una enciclopedia: estudia lo que la ficha pregunta, y solo lo que no sabe.
- **Cada lección es un subtema de la ficha, en 4 o 5 pantallas y de 5 a 8 minutos.** Lleva solo lo que el Ineval puede preguntar: el concepto, la regla o la fórmula, un ejemplo y la trampa típica. Sin historia ni teoría de relleno.
- **Cada tema tiene 10 preguntas**, en los formatos del examen y con la explicación de cada opción. No se hacen bancos gigantes.
- **El docente no lo ve todo.** El diagnóstico marca lo que ya sabe, «¿Ya lo sabes?» le deja saltar temas, la ruta empieza por lo débil y el repaso solo trae lo que falló.
- **Se escribe primero lo que más rinde en el examen** (preguntas por tema):

  | Parte | Preguntas | Temas | Lecciones | Preguntas por tema |
  |---|---|---|---|---|
  | Pedagógicos (todos los cursos) | 21 | 6 | 7 | 3,5 |
  | Digitales (todos los cursos, ya abiertos) | 18 | 4 | 6 | 4,5 |
  | Disciplinar de EGB | 60 | 34 | 63 | 1,8 |

  Los 6 temas pedagógicos son el 21 % del examen en 7 lecciones cortas, y sirven a todas las especialidades: son lo siguiente que conviene escribir.
- **Tamaño total:** el curso completo de EGB son unas 8 horas de lecciones (1,5 de generales y 6,6 de la especialidad). A cada docente le tocan menos, porque salta lo que ya domina.

## Decisiones

- **26 nov · Por asignatura.** El curso de EGB se organiza en 4 secciones (Matemática, Lengua y Literatura, Ciencias Naturales, Ciencias Sociales), cada una con sus unidades del PDF. En la base es la columna opcional `unidades.asignatura` (migración 0008); CCNN la deja vacía.
- **26 nov · Lecciones por asignatura completa.** En la fase 5 se escribe una asignatura entera antes de pasar a la siguiente (falta decidir cuál va primero).

- **26 nov · Investigación del Ineval** (`docs/investigacion-ineval.md`). Un curso = una especialidad, porque cada docente rinde la de su nombramiento. Los $45 abren todos los cursos y el docente puede cambiar de curso. Las lecciones gratis siguen siendo 3 en total (por confirmar con el dueño). El puntaje se muestra como el del Ineval (0 a 1000 y su nivel). El boceto está en `public/bocetos/cursos-y-puntaje.html` y espera aprobación.

## Estado

- **26 nov (noche): EGB activa y a la venta.**
  - Diagnóstico de 47 preguntas (34 de EGB y 13 generales).
  - **Matemática abierta completa:** 9 temas, 16 lecciones y 92 preguntas, con las cuentas comprobadas con código.
  - Lengua, Naturales y Sociales: temario cargado y «se abre pronto».
  - Pantallas nuevas: elegir curso por nombramiento, puntaje Ineval de 0 a 1000 y cambiar de curso desde Mi progreso.
  - Portada con los dos cursos.
  - **Siguiente:** escribir Lengua y Literatura completa (14 lecciones), luego Ciencias Naturales y Ciencias Sociales.
- **26 nov (noche): Conocimientos generales abierto completo** en todos los cursos. Son los 6 temas pedagógicos: 7 lecciones cortas y 62 preguntas, el 21 % del examen (`contenido/generales/pedagogicos.ts`).

- **Fase 1 (26 nov): hecha.** `contenido/egb-elemental-media/estructura.ts` con las 15 unidades, 34 temas y 63 lecciones. Especialidad `egb-elemental-media`, «próximamente». El validador exige el diagnóstico completo solo a las especialidades activas. Pruebas en `tests/egb.test.mts`.
