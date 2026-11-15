# Design · Ruta Docente

Dirección fijada por el dueño el 15 nov: sus referencias de Pinterest (Vektora Academy, Edulearn, Quest, DoDo, AdsVoice) más el estilo limpio de sus apps del hotel. Por eso no se sorteó un mundo visual: lo eligió él (ver PRODUCT.md, Brand Commitments). Tokens en `app/globals.css`; piezas en `components/`.

## Mundo

Un cuaderno de estudio moderno y sereno: fondo azulado muy suave, tarjetas claras redondeadas que flotan apenas, un solo acento cobalto que marca lo que se domina y lo que se hace ahora. Profesional, nunca infantil. Funciona igual en modo claro y oscuro (el docente elige; arranca con el del teléfono).

## Color

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `bg` | #F2F4F8 | #0D1017 | Fondo de la app (tintado, no gris plano) |
| `surface` | #FDFDFE | #151A23 | Tarjetas y barra lateral |
| `surface-2` | #F6F7FA | #1B212C | Rellenos suaves, hover, pistas |
| `ink` / `ink-2` / `ink-3` | #121826 / #4A5265 / #646C80 | #EEF1F7 / #B3BACA / #8E96A9 | Texto, secundario, etiquetas |
| `line` / `line-2` | #E3E6EE / #EEF0F5 | #262D3A / #1F2531 | Bordes de 1 px |
| `accent` | #2E5BFF | #6D8BFF | Acción principal, selección, progreso, dominio |
| `warm` | #E8590C | #FF8A4C | Solo la racha (energía del día) |
| `ok` / `bad` / `wip` | #12805C / #C92A36 / #A35F00 | #3FC08E / #FF6B76 / #F2B14B | Correcto, incorrecto, aprendiendo |

**Escala de dominio** (un solo tono, de vacío a cobalto): sin empezar `line-2`; 1–39 `dom-1`; 40–69 `dom-2`; 70–79 `dom-3`; 80+ dominado `accent`.

## Tipo

Una sola familia: **Instrument Sans** (decisión del dueño). Cifras con `tabular-nums`.
- Títulos de pantalla 28–34 px, peso 600, tracking −0.03em.
- Cifras grandes (preparación) 44–56 px, peso 600.
- Cuerpo 15–16 px; etiquetas 13 px en `ink-3`, sin mayúsculas sostenidas.

## Forma

- Tarjetas: radio 20 px, borde `line` de 1 px y sombra suave tintada.
- Controles (botones, campos, opciones): radio 12 px. Chips y pastillas: radio completo.
- Botón principal: cobalto, 44–48 px de alto. Al presionar baja 1 px.

## Piezas

- **Cascarón:** barra lateral de 248 px en computadora (marca, Inicio, Curso, Simulacro, Perfil; Admin para administración; abajo, tema claro/oscuro y cuenta). En teléfono, barra inferior de 4 pestañas y cabecera compacta.
- **Mapa de dominio (movimiento distintivo):** los 31 temas como un mosaico de baldosas agrupadas por unidad, cada una teñida por su nivel en la escala de dominio. Aparece en el resultado del diagnóstico (se «revela» baldosa por baldosa), en Inicio y en Perfil. Es dato real, no decoración.
- **Anillo de preparación:** un solo anillo grande con el % de preparación (dato real, pedido en las referencias).
- **Laboratorio:** célula animal y vegetal dibujadas en SVG con zonas tocables. Es el único dibujo a mano y se justifica porque es contenido interactivo.
- **Pregunta:** una pregunta por pantalla, opciones de 56 px, retroalimentación en un panel inferior (verde/rojo suave + explicación).

## Movimiento

Un momento con autor: la revelación del mapa de dominio tras el diagnóstico (baldosas que se tiñen en cascada). Lo demás, transiciones cortas de 160–240 ms con salida exponencial. Todo se apaga con `prefers-reduced-motion`.
