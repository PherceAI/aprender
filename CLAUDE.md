# Pragma (academia docente)

Este es un proyecto aparte de PherceStudio y no se mezcla con él. Responde siempre en español. Lee VISION.md, PRODUCT.md y DESIGN.md antes de trabajar.
**Si eres un chat nuevo, lee primero `docs/CONTEXTO.md`.**


## Qué es
Es una academia en línea para que los **docentes** de Ecuador (no los estudiantes) se preparen para la Evaluación del Desempeño Docente del Ineval.
- La idea es del cuñado del dueño, docente de Ciencias Naturales en Riobamba. La competencia vende cursos a unos $200; aquí la idea es ser más barato, más didáctico y más interactivo.
- Empieza con Ciencias Naturales EGB Superior, solo la Dimensión 1. **El examen es en 2027**; las dimensiones 2, 3 y 4 ya se aplicaron, así que no se preparan. Las demás materias se agregan sobre el mismo núcleo.
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

## Decisiones del 15 nov (noche)
- La plataforma se llama **Pragma**. El logo del dueño está en public/marca/: el símbolo va en el naranja de la plataforma y el ícono de la app es naranja con el símbolo blanco.
- La landing sigue las referencias del dueño: academia con fotos de docentes (Unsplash, créditos en public/landing/CREDITOS.md), pasos con íconos, especialidades, «aprende más inteligente», preguntas frecuentes y banner final. Poco texto. Rechazó las versiones tipográficas y planas.
- Modelo de negocio (22 nov): entra gratis (diagnóstico, 3 lecciones a su elección y un simulacro una vez). Todo lo demás se desbloquea con un **pago único de $45 con IVA incluido, hasta el examen de 2027**. Se paga por Deuna (QR/link que el admin sube en Panel → Pagos) o transferencia; el admin aprueba el comprobante y se abre todo. Payphone (tarjeta) viene después, con credenciales propias de Pragma. Reglas en lib/acceso.ts y lib/pagos.ts.
- Para diseñar: correr Impeccable completo y Taste Skill, y mostrar opciones o referencias antes de programar.
- El checklist de pulido está en docs/pulido-checklist.md.

## Producción
- URL: https://pragma.automationpherce.cloud
- Repo: github.com/PherceAI/aprender (privado), rama main.
- Coolify en panel.automationpherce.cloud, proyecto "Ruta Docente" (nombre viejo en Coolify):
  - app awqesizwrfjoonek78fkjgwo
  - Postgres 53mtcwipdsyvonzdzlbx622y
  - volumen /data
- Para desplegar: push a main y luego `POST /api/v1/deploy {"uuid":...}` (el GET ya no funciona).
- Tutor: Gemini, modelo gemini-3.8-flash.
- La clave de Gemini y las contraseñas viven solo en las variables de entorno de Coolify, nunca en archivos del repo ni en el chat. Las credenciales están en data-local/credenciales-produccion.txt (ignorado por git).
- En local se usa `npm run dev`, en el puerto 3200. Los tests corren con `npm test`.
