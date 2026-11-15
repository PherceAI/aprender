# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Docentes de Ecuador en funciones** que van a rendir la Evaluación del Desempeño Docente del Ineval (ascensos y recategorización). Adultos y profesionales, con poco tiempo, que estudian de noche o en recreos, casi siempre desde el teléfono. Primera especialidad: Ciencias Naturales de Educación General Básica Superior (8.º a 10.º). Fuente: el dueño y su cuñado, docente de Ciencias Naturales en Riobamba.
- **Administración (el dueño y el docente experto):** crean las cuentas, suben los videos de cada tema (hechos con NotebookLM) y miran cómo van los docentes y qué temas se fallan. Usan más la computadora.

## Product Purpose

Preparar a los docentes para la Dimensión 1 (saberes disciplinares) de la evaluación del Ineval: Conocimientos generales (39 preguntas en 45 min) y Conocimientos de la especialidad (60 en 120 min). La plataforma diagnostica dónde está cada docente, le arma una ruta, le enseña en lecciones cortas e interactivas, lo hace practicar en los cinco formatos del Ineval y le devuelve lo que falla hasta que lo domina.

Éxito ahora: una demo que el cuñado abre desde su teléfono y dice «está genial». Después se pule con él y se venden los accesos. Es un negocio: competir con cursos de unos $200 siendo más didáctico, más interactivo y más barato.

## Positioning

No es un curso de videos ni un banco de preguntas: es un método. Diagnóstico con «¿qué tan seguro estás?», ruta personal, práctica de recuperación, repaso espaciado, prueba hasta dominar y simulacro igual al real. Enseña con las mismas metodologías que el Ineval le pregunta al docente (evaluación diagnóstica/formativa/sumativa, gamificación, DUA), así que el docente las vive mientras estudia.

## Operating Context

- El temario sale literal de la ficha técnica pública del Ineval 2026 (`fuentes/`). Nada fuera de la ficha.
- Formatos de pregunta del Ineval: simple, completamiento, selección de elementos, ordenamiento y emparejamiento, siempre con 4 opciones y una correcta. En práctica son interactivos (tocar el dibujo, ordenar, unir); en el simulacro se ven como en el examen real.
- Demo: el dueño entrega las credenciales; no hay registro abierto ni Google. Un tema abierto (Anatomía celular); los demás se ven con candado.

## Capabilities and Constraints

- Ver `VISION.md` (fuente de verdad) y `docs/plan-parte-*.md`. Lógica del servidor completa y probada en `lib/`.
- Debe funcionar en teléfono y computadora, e instalarse como app (PWA).
- No usar el nombre ni el logo del Ineval como marca; aviso visible «No somos el Ineval».
- Nombre provisional: «Ruta Docente».
- Sin decidir: precio, pagos, nombre definitivo, dominio.

## Brand Commitments

- El dueño exige interfaces limpias, modernas y profesionales; rechazó estilos fechados, bloques grises/oscuros pesados y fuentes mezcladas (una sola familia, Instrument Sans, como en sus apps del hotel).
- Referencias que mandó (15 nov): dashboards de cursos de Pinterest (Vektora Academy, Edulearn, Quest, DoDo, AdsVoice): tarjetas redondeadas, barra lateral, saludo arriba, anillos de progreso, lección con video grande y pestañas al lado. Modo claro **y** modo oscuro, a elección del docente.
- Nada infantil: son profesionales adultos.
- Idioma: español de Ecuador, palabras simples, sin jerga técnica.

## Evidence on Hand

- Ficha técnica Ineval 2026 de Ciencias Naturales (PDF en `fuentes/`).
- Contenido de demo escrito por el equipo (lecciones de Anatomía celular y 44 preguntas): marcado como pendiente de revisión del docente experto.
- No hay testimonios, clientes, precios ni cifras de resultados: no inventarlos.
- Videos: los hará el dueño con NotebookLM; aún no existen.

## Product Principles

1. Entender al docente por lo que hace, no interrogarlo: nada de formularios de fechas o tiempos.
2. Desde el primer minuto debe verse que se aprende haciendo, no leyendo.
3. Respetar su tiempo: lecciones cortas, «Ya lo sé» si lo domina, lo de hoy en una mirada.
4. Mostrar primero sus fortalezas, después lo que le falta.
5. Exactitud ante todo: una pregunta mal hecha destruye la confianza.

## Accessibility & Inclusion

Docentes con distintos niveles de comodidad tecnológica, en teléfonos de gama media y conexiones irregulares: textos legibles, objetivos táctiles grandes, contraste suficiente en ambos modos, y movimiento reducido cuando el sistema lo pide.
