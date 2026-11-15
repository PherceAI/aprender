# Design · Ruta Docente

Dirección fijada por el dueño el 15 nov: sus referencias de Pinterest (Vektora Academy, Edulearn, Quest, DoDo, AdsVoice) más el estilo limpio de sus apps del hotel. Por eso no se sorteó un mundo visual: lo eligió él (ver PRODUCT.md, Brand Commitments). Tokens en `app/globals.css`; piezas en `components/`.

## Mundo

15 nov (segunda revisión del dueño): descartó la paleta lima/crema. Quiere el estilo de su sistema del hotel: blanco, limpio, premium, profesional, con el **naranja del hotel** (#f0360a) como único acento, líneas finas y nada recargado. Modo claro y oscuro. **Nunca desplazamiento horizontal en el teléfono.**

## Color

- Claro: fondo y tarjetas blancos, `surface-2` #fafafa, texto #171717 / #525252 / #737373, líneas #e5e5e5.
- Acento: #f0360a (texto de acento #d42d06, fondo suave #fff3ee). Botón principal naranja con texto blanco.
- Oscuro: fondo #0a0a0a, tarjetas #121212, acento #ff5a2e.
- Escala de dominio: de gris #f0f0f0 a naranja #f0360a.
- Estados: verde, rojo y ámbar del hotel.

## Tipo

Una sola familia: **Instrument Sans** (decisión del dueño). Cifras con `tabular-nums`.
- Títulos de pantalla 28–34 px, peso 600, tracking −0.03em.
- Cifras grandes (preparación) 44–56 px, peso 600.
- Cuerpo 15–16 px; etiquetas 13 px en `ink-3`, sin mayúsculas sostenidas.

## Forma

- Tarjetas: radio 14 px, borde de 1 px y sombra mínima.
- Controles (botones, campos, opciones): radio 8 px. Chips y pastillas: radio completo.
- Botón principal: naranja con texto blanco, 44–48 px de alto. Al presionar baja 1 px.

## Piezas

- **Cascarón:** barra lateral blanca de 272 px con línea fina a la derecha y la persona arriba en computadora (marca, Inicio, Curso, Simulacro, Perfil; Admin para administración; abajo, tema claro/oscuro y cuenta). En teléfono, barra inferior de 4 pestañas y cabecera compacta.
- **Mapa de dominio (movimiento distintivo):** los 31 temas como un mosaico de baldosas agrupadas por unidad, cada una teñida por su nivel en la escala de dominio. Aparece en el resultado del diagnóstico (se «revela» baldosa por baldosa), en Inicio y en Perfil. Es dato real, no decoración.
- **Anillo de preparación:** un solo anillo grande con el % de preparación (dato real, pedido en las referencias).
- **Laboratorio:** célula animal y vegetal dibujadas en SVG con zonas tocables. Es el único dibujo a mano y se justifica porque es contenido interactivo.
- **Pregunta:** una pregunta por pantalla, opciones de 56 px, retroalimentación en un panel inferior (verde/rojo suave + explicación).

## Movimiento

Un momento con autor: la revelación del mapa de dominio tras el diagnóstico (baldosas que se tiñen en cascada). Lo demás, transiciones cortas de 160–240 ms con salida exponencial. Todo se apaga con `prefers-reduced-motion`.
