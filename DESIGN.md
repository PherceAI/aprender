# Design · Ruta Docente

Dirección fijada por el dueño el 15 nov: sus referencias de Pinterest (Vektora Academy, Edulearn, Quest, DoDo, AdsVoice) más el estilo limpio de sus apps del hotel. Por eso no se sorteó un mundo visual: lo eligió él (ver PRODUCT.md, Brand Commitments). Tokens en `app/globals.css`; piezas en `components/`.

## Mundo

Tras ver las referencias, el dueño eligió DoDo (15 nov): lienzo verdoso muy suave, barra lateral flotante con la persona arriba, acento lima, botones negros y la palabra clave del saludo en amarillo. Profesional, nunca infantil. Modo claro y oscuro (el docente elige; arranca con el del teléfono).

## Color

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `bg` | #ECEEE6 | #0F110F | Lienzo de la app |
| `surface` / `surface-2` | #FDFDFB / #F5F6F0 | #181B18 / #1F231F | Tarjetas, barra lateral; rellenos suaves |
| `ink` / `ink-2` / `ink-3` | #16181A / #4B504C / #656B66 | #F1F3EC / #BCC2B8 / #8F968C | Texto |
| `line` / `line-2` | #E2E5DC / #EEF0E8 | #2A2F29 / #222721 | Bordes de 1 px |
| `accent` (relleno) | #D9F26B | #D9F26B | Navegación activa, chips, marca; siempre con texto `on-accent` oscuro |
| `accent-ink` | #4A6300 | #D9F26B | Texto e íconos «de acento» (con contraste) |
| `primary` | #16181A | #D9F26B | Botón principal (negro en claro, lima en oscuro) |
| `destacado` | #16181A | #D9F26B | Tarjeta «lo que toca ahora» (como la tarjeta negra de DoDo) |
| `resalte` | #B98400 | #F6C944 | La palabra clave del saludo («aprendemos») |
| `anillo` | #86AE12 | #D9F26B | Anillos y barras de progreso |
| `warm` | #C77700 | #F6B73C | Solo la racha |
| `ok` / `bad` / `wip` | verde / rojo / ámbar | | Correcto, incorrecto, aprendiendo |

**Escala de dominio** (lima de vacío a lleno): `dom-0` sin empezar → `dom-4` dominado.

## Tipo

Una sola familia: **Instrument Sans** (decisión del dueño). Cifras con `tabular-nums`.
- Títulos de pantalla 28–34 px, peso 600, tracking −0.03em.
- Cifras grandes (preparación) 44–56 px, peso 600.
- Cuerpo 15–16 px; etiquetas 13 px en `ink-3`, sin mayúsculas sostenidas.

## Forma

- Tarjetas: radio 20 px, borde `line` de 1 px y sombra suave tintada.
- Controles (botones, campos, opciones): radio 12 px. Chips y pastillas: radio completo.
- Botón principal: negro en claro y lima en oscuro, 44–48 px de alto. Al presionar baja 1 px.

## Piezas

- **Cascarón:** barra lateral flotante de 272 px (tarjeta de radio 28 px con avatar y nombre arriba) en computadora (marca, Inicio, Curso, Simulacro, Perfil; Admin para administración; abajo, tema claro/oscuro y cuenta). En teléfono, barra inferior de 4 pestañas y cabecera compacta.
- **Mapa de dominio (movimiento distintivo):** los 31 temas como un mosaico de baldosas agrupadas por unidad, cada una teñida por su nivel en la escala de dominio. Aparece en el resultado del diagnóstico (se «revela» baldosa por baldosa), en Inicio y en Perfil. Es dato real, no decoración.
- **Anillo de preparación:** un solo anillo grande con el % de preparación (dato real, pedido en las referencias).
- **Laboratorio:** célula animal y vegetal dibujadas en SVG con zonas tocables. Es el único dibujo a mano y se justifica porque es contenido interactivo.
- **Pregunta:** una pregunta por pantalla, opciones de 56 px, retroalimentación en un panel inferior (verde/rojo suave + explicación).

## Movimiento

Un momento con autor: la revelación del mapa de dominio tras el diagnóstico (baldosas que se tiñen en cascada). Lo demás, transiciones cortas de 160–240 ms con salida exponencial. Todo se apaga con `prefers-reduced-motion`.
