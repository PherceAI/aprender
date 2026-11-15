# Ruta Docente

Plataforma para que los docentes de Ecuador se preparen para la Evaluación del Desempeño Docente del Ineval. Empieza con Ciencias Naturales (EGB Superior), Dimensión 1.

- Qué es, qué se decidió y qué falta decidir: `VISION.md`.
- Planes de cada parte: `docs/`.
- Ficha técnica del Ineval: `fuentes/`.

Partió de una copia de `evaluaciones-zeus` (el sistema de exámenes del Hotel Zeus). El primer commit es esa copia exacta; el del hotel no se toca.

## Local

    npm install
    npm run sembrar   # crea la base local (PGlite en data-local/pg) y carga el temario
    npm run dev       # http://localhost:3200
    npm test

Sin `DATABASE_URL` usa PGlite (Postgres dentro del proceso). Con `DATABASE_URL` usa Postgres de verdad (producción en Coolify).
