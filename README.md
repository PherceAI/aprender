# Pragma

Plataforma para que los docentes de Ecuador se preparen para la Evaluación del Desempeño Docente del Ineval. Empieza con Ciencias Naturales (EGB Superior), Dimensión 1.

- Qué es, qué se decidió y qué falta decidir: `VISION.md`.
- Planes de cada parte: `docs/`.
- Ficha técnica del Ineval: `fuentes/`.

Partió de una copia de `evaluaciones-zeus` (el sistema de exámenes del Hotel Zeus). El primer commit es esa copia exacta; el del hotel no se toca.

## Local

    npm install
    npm run cuentas   # claves de la cuenta admin y del docente de demo (data-local/credenciales-demo.txt)
    npm run sembrar   # crea la base local (PGlite en data-local/pg) y carga el temario (también lo hace el servidor al arrancar)
    npm run dev       # http://localhost:3200
    npm test

Sin `DATABASE_URL` usa PGlite (Postgres dentro del proceso). Con `DATABASE_URL` usa Postgres de verdad (producción en Coolify).

## Variables en producción (Coolify)

- `DATABASE_URL`: Postgres del proyecto.
- `SESSION_SECRET`: obligatoria; firma las sesiones.
- `ADMIN_CORREO`, `ADMIN_CLAVE` (y `ADMIN_NOMBRE`): cuenta de administración. Se crea o actualiza al arrancar.
- `DEMO_CORREO`, `DEMO_CLAVE` (y `DEMO_NOMBRE`): cuenta del docente de demo.
- `GEMINI_API_KEY` (y `GEMINI_MODEL`, por defecto `gemini-3.8-flash`): tutor con IA. Sin clave, el tutor se muestra como no disponible.
- `DATA_DIR=/data`: volumen persistente para los videos.
