# Ruta Docente (academia docente)

Este es un proyecto aparte de PherceStudio y no se mezcla con él. Responde siempre en español. Lee VISION.md, PRODUCT.md y DESIGN.md antes de trabajar.

## Qué es
Es una academia en línea para que los **docentes** de Ecuador (no los estudiantes) se preparen para la Evaluación del Desempeño Docente del Ineval.
- La idea es del cuñado del dueño, docente de Ciencias Naturales en Riobamba. La competencia vende cursos a unos $200; aquí la idea es ser más barato, más didáctico y más interactivo.
- Empieza con Ciencias Naturales EGB Superior, solo la Dimensión 1. Las demás materias se agregan sobre el mismo núcleo.
- VISION.md manda. En fuentes/ está el PDF del Ineval.
- Es un clon de la app de exámenes del Hotel Zeus (evaluaciones-zeus). **La app del hotel no se toca.**
- Inspiración: la UX de Platzi, y la racha y el repaso estilo Duolingo.
- Entrada con correo y contraseña, sin Google. Es una PWA que se instala en el teléfono.

## Cómo trabaja el dueño
- Va por partes y toma él las decisiones importantes: preséntale opciones con tu recomendación.
- Tiene pocos créditos, así que trabaja en tandas cortas y termina lo que se pueda entregar.

## Diseño
- Igual que el sistema del hotel: fondo blanco y el naranja del hotel #f0360a como único acento.
- Bordes finos y limpio, con aspecto premium.
- Sin fondos crema y sin sombras pesadas.
- La barra lateral queda fija y la opción activa es una píldora naranja.
- **Nunca debe haber scroll horizontal en el teléfono.** En móvil las grillas usan `grid-cols-[minmax(0,1fr)]`, y en cada página `scrollWidth` debe ser igual al ancho de la pantalla.
- Ya se rechazaron dos versiones: una en cobalto y otra lima/crema estilo DoDo.

## Producción
- URL: https://aprender.automationpherce.cloud
- Repo: github.com/PherceAI/aprender (privado), rama main.
- Coolify en panel.automationpherce.cloud, proyecto "Ruta Docente":
  - app awqesizwrfjoonek78fkjgwo
  - Postgres 53mtcwipdsyvonzdzlbx622y
  - volumen /data
- Para desplegar: push a main y luego `POST /api/v1/deploy {"uuid":...}` (el GET ya no funciona).
- Tutor: Gemini, modelo gemini-3.8-flash.
- La clave de Gemini y las contraseñas viven solo en las variables de entorno de Coolify, nunca en archivos del repo ni en el chat. Las credenciales están en data-local/credenciales-produccion.txt (ignorado por git).
- En local se usa `npm run dev`, en el puerto 3200. Los tests corren con `npm test`.
