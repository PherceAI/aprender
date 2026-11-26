# Pragma: contexto para un chat nuevo

Lee esto antes de trabajar. Después lee `CLAUDE.md`, `VISION.md`, `PRODUCT.md`, `DESIGN.md` y `docs/pulido-checklist.md`.

## Qué es
**Pragma** es una academia en línea para que los **docentes** de Ecuador preparen la Evaluación del Desempeño Docente del Ineval 2026, Dimensión 1:
- Conocimientos generales: 39 preguntas en 45 min.
- Conocimientos de la especialidad: 60 preguntas en 120 min.

**El examen es en 2027 y solo se trabaja la Dimensión 1**: las dimensiones 2, 3 y 4 ya se aplicaron (dato del dueño, 16 nov). El PDF de la ficha se titula «2026 - Fase 1»; en la plataforma se dice «ficha técnica oficial» sin año y «examen 2027». Hoy tiene Ciencias Naturales de EGB Superior. Es un negocio del dueño con su cuñado, docente de Ciencias Naturales en Riobamba. Compite con cursos de unos $200 que son solo videos. Es independiente: no es del Ineval.

## Dónde está
- **Carpeta:** `C:\Users\Keybe\Videos\academia-docente`. Es aparte de PherceStudio y no se mezclan.
- **Repo:** github.com/PherceAI/aprender (privado), rama `main`.
- **Producción:** https://pragma.automationpherce.cloud
- **Coolify:** panel.automationpherce.cloud, proyecto «Ruta Docente», app `awqesizwrfjoonek78fkjgwo`.
  - Para desplegar: push a `main` y luego `source ~/.coolify-api.sh; api POST /deploy -d '{"uuid":"awqesizwrfjoonek78fkjgwo"}'`.
- **Secretos:** la clave de Gemini y las contraseñas viven solo en las variables de Coolify y en `data-local/` (ignorado por git). Nunca van al chat ni al repo.
- **Local:** `npm run dev` en el puerto 3200. Pruebas: `npx tsx --test tests/*.test.mts`; hoy pasan 68.
- **Stack:** Next.js 15, Drizzle, Postgres (PGlite en local), Tailwind v4 y Gemini (`gemini-3.8-flash`) para el tutor.

## Cómo funciona la plataforma
1. **Entrada:** la landing lleva a registrarse gratis. La cuenta gratis trae el diagnóstico y 3 lecciones que el docente elige de cualquier tema (tabla `lecciones_elegidas`). Con el pago no hay ningún orden obligatorio: todo tema abierto se estudia libremente. Lo demás se desbloquea con un **pago único**, que el administrador activa en el Panel (`lib/acceso.ts`).
2. **Diagnóstico:** el docente elige su especialidad y hace un diagnóstico de **40 preguntas**, al menos una por cada uno de los 31 temas. Al final ve un informe tema por tema.
3. **Inicio:** muestra un solo «siguiente paso», «Tu meta de hoy», los pasos del método y la actividad de la semana.
4. **Cada tema:**
   - lecciones por pantallas: una idea a la vez, tarjetas, laboratorio de la célula, ejemplos de la vida real y una pregunta de control;
   - práctica;
   - prueba del tema: con 80 % queda dominado.
5. **Retroalimentación:**
   - inmediata en cada pregunta;
   - «Tu avance» (nivel antes y después) en cada resultado;
   - **Repaso** espaciado: lo fallado vuelve a 1, 3, 7, 14 y 30 días;
   - **Mi progreso**, con su evolución diaria.
6. **Simulacros:** como el examen real.
7. **Ficha oficial:** el PDF está en `public/ficha-tecnica-ccnn.pdf` y cada tema enlaza a su página exacta (`lib/ficha.ts`).
8. **App instalable (PWA):** tiene service worker, página sin conexión y el botón «Instalar la app».

9. **Modo revisión (temporal, antes del lanzamiento):**
   - Se enciende con la variable `REVISION_CLAVE` (8+ caracteres) y el enlace `/revision?clave=...`, que está en Panel → «Comentarios de revisión».
   - En ese navegador aparece el botón «Comentar» en todas las pantallas: el revisor toca una parte y deja «mejorar, quitar, agregar, error o me gusta».
   - Los comentarios se ven en `/admin/revision` (tabla `comentarios_revision`, lógica en `lib/revision.ts`).
   - Para apagarlo: borrar `REVISION_CLAVE` en Coolify y desplegar.

## Cómo trabaja el dueño (importante)
- **Siempre en español.** Va parte por parte y decide él lo importante. Tiene pocos créditos, así que hay que trabajar en tandas eficientes.
- **Diseño:**
  - estilo del hotel con el naranja `#f0360a` e Instrument Sans (fuente elegida por él);
  - modo claro por defecto;
  - **nunca scroll horizontal en el teléfono**.
  - Detecta enseguida el «diseño hecho por IA»: usa las skills **Impeccable**, **Taste** y **Superpowers** completas.
  - **Antes de programar una pantalla, muéstrale un boceto** y espera su visto bueno.
- **Lo que le gustó:**
  - la landing con fotos de docentes y pasos con íconos;
  - el panel con fondo gris claro y tarjetas blancas;
  - color e ilustración 3D por unidad (`lib/visual.ts`, Fluent Emoji con licencia MIT);
  - el logo de Pragma de marca de agua;
  - la barra lateral plegable;
  - las preguntas grandes como su referencia de IA.
- **Lo que rechazó:** las versiones planas, solo blancas o con mucho texto; los fondos crema; las sombras pesadas; las pantallas de solo texto.
- **Reglas:**
  - no inventar testimonios, cifras ni precios;
  - no agregar botones de funciones que no existen;
  - el contenido debe ser exacto, porque es material para docentes.
- **Al terminar:** probar en PC y teléfono, publicar y mostrarle capturas.

## Pendiente
- El **número de WhatsApp** del dueño (593…) para el botón «Quiero el acceso completo». Va en la variable `CONTACTO_WHATSAPP` de Coolify.
- El **precio** del pago único: todavía no decidido; no se muestra.
- **Revisión del docente experto:** las 22 preguntas nuevas del diagnóstico y los 4 ejemplos de las lecciones.
- **Entrar con Google:** es la última parte del checklist.
- **Abrir más temas:** hoy solo Anatomía celular tiene lecciones; los demás dicen «Se abre pronto».
- **Detalles menores que quedaron anotados:**
  - dos pestañas terminando la misma prueba;
  - una cuenta sin especialidad;
  - la barra de avance cuando la nota baja;
  - los finales de línea CRLF.
