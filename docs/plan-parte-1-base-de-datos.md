# Parte 1 · Base de datos — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar la base de datos de la academia lista y probada. Incluye las tablas, el temario completo de la Dimensión 1 cargado desde el PDF y el banco inicial de preguntas, de modo que las partes 2 y 3 solo lean y escriban.

**Architecture:**
- El proyecto es una copia de `evaluaciones-zeus` (Next.js 15) sin lo del hotel.
- Postgres con Drizzle ORM:
  - En producción usa `pg` con `DATABASE_URL`.
  - En local y en las pruebas usa PGlite, que es Postgres dentro del proceso, en `data-local/pg` o en memoria.
- Todo el contenido de una especialidad vive en `contenido/<especialidad>/` como datos tipados. Un validador común lo revisa antes de sembrarlo: es el «núcleo para cualquier materia».

**Tech Stack:** Next.js 15, TypeScript, drizzle-orm, drizzle-kit, pg, @electric-sql/pglite, tsx con node:test.

**Spec:** `VISION.md`, secciones 2b, 3, 4, 4b, 4c, 10 y 10b.

## Global Constraints

- El proyecto del hotel (`C:\Users\Keybe\Videos\evaluaciones-zeus`) no se modifica.
- La estructura sale **literal** del PDF:
  - 2 bloques, 9 unidades, 31 temas y 70 lecciones (una por subtema).
  - Bloque generales: 39 preguntas en 45 minutos. Bloque de Ciencias Naturales: 60 preguntas en 120 minutos.
- El bloque «generales» es compartido entre especialidades: se guarda una sola vez.
- Toda pregunta lleva 4 opciones, una sola correcta (índice 0 a 3) y 4 explicaciones, una por opción.
- Su formato es uno de: `simple | completamiento | seleccion | ordenamiento | emparejamiento`.
- El diagnóstico de entrada tiene exactamente 2 preguntas por unidad (18 en Ciencias Naturales).
- Los textos visibles van en español de Ecuador, en palabras simples.

## Review Focus

1. **Contenido incoherente**, por ejemplo una pregunta de ordenamiento cuya opción correcta no coincide con su solución. Lo esperado es que el validador lo rechace y que la siembra falle.
2. **Sembrar dos veces.** Lo esperado es que las cantidades queden iguales (actualiza, no duplica).
3. **Correo repetido con mayúsculas distintas.** Lo esperado es que lo rechace (el correo se guarda en minúsculas y es único).
4. **Responder la misma pregunta dos veces en un intento.** Lo esperado es una sola respuesta por pregunta e intento (restricción única).
5. **Una pregunta que apunta a un tema que no existe.** Lo esperado es que el validador lo rechace.

---

### Task 1: Clonar la base y quitar lo del hotel

**Files:**
- Copy: `evaluaciones-zeus/*` → `academia-docente/`, sin `node_modules`, `.next`, `data-local`, `.git` ni `.impeccable`.
- Delete: `app/empleado`, `app/gerencia`, `app/actions.ts`, `lib/areas.ts`, `lib/banco.ts`, `lib/exam.ts`, `lib/insights.ts`, `lib/months.ts`, `lib/stats.ts`, `lib/db.ts`, `lib/types.ts`, `scripts/demo.ts`, los componentes del hotel y `tests/*`. Quedan en el primer commit como referencia para la parte 3.
- Modify: `package.json` (nombre `ruta-docente`), `app/page.tsx` (página mínima) y `README.md`.

- [ ] Primer commit con la copia exacta: «Copia de evaluaciones-zeus como base».
- [ ] Borrar lo del hotel y correr `npm run build`. Esperado: compila.
- [ ] Commit: «Quitar lo del hotel».

### Task 2: Esquema de la base de datos

**Files:**
- Create: `lib/db/schema.ts`, `lib/db/index.ts`, `drizzle.config.ts` y `drizzle/` (migraciones generadas).
- Test: `tests/db.test.mts`.

**Interfaces — Produces:**
- `getDb(): Promise<Db>`: PGlite si no hay `DATABASE_URL`, `pg` si la hay. Aplica las migraciones la primera vez.
- `crearDbPrueba(): Promise<Db>`: PGlite en memoria, migrado.
- Tablas:
  - Contenido: `especialidades`, `bloques`, `especialidadBloques`, `unidades`, `temas`, `lecciones`, `preguntas`.
  - Docente: `usuarios`, `intentos`, `respuestas`, `dominio`, `repaso`, `progresoLecciones`, `notas`, `tutorMensajes`.
- Columnas clave:
  - `usuarios.correo`: único, en minúsculas.
  - `respuestas`: única por (`intentoId`, `preguntaId`).
  - `dominio`: clave primaria (`usuarioId`, `temaId`), con `nivel` de 0 a 100 y `estado`.
  - `repaso`: clave primaria (`usuarioId`, `preguntaId`), con `caja` de 0 a 5 y `proxima` (fecha).
  - `temas`: `videoUrl` y `videoTitulo`.

- [ ] Test: después de migrar existen las 15 tablas; un correo repetido en otra combinación de mayúsculas falla; una respuesta duplicada en el mismo intento falla.
- [ ] Correrlo. Esperado: FAIL.
- [ ] Implementar el esquema y generar la migración con `npx drizzle-kit generate`.
- [ ] Correrlo. Esperado: PASS.
- [ ] Commit.

### Task 3: Tipos y validador del contenido (el núcleo)

**Files:**
- Create: `contenido/tipos.ts` y `contenido/validar.ts`.
- Test: `tests/validar.test.mts`.

**Interfaces — Produces:**
- `interface Especialidad { id; nombre; nivel; estado: 'activa'|'proximamente'; bloques: string[] }`
- `interface Bloque { id; nombre; compartido: boolean; preguntasExamen: number; minutosExamen: number; unidades: Unidad[] }`
- `Unidad { id; nombre; temas: Tema[] }`
- `Tema { id; nombre; lecciones: Leccion[]; abierto?: boolean }`
- `Leccion { id; titulo; objetivo: string; minutos: number; contenido?: Bloquecito[] }`
- `Pregunta { id; temaId; leccionId?; formato; enunciado; elementos?; solucion?; opciones: [string,string,string,string]; correcta: 0|1|2|3; explicaciones: [x4]; usos: Uso[]; dificultad: 1|2|3; dibujo?: {lab: string; zonas: [x4]} }`
- `validarContenido(bloques, preguntas): string[]`: devuelve la lista de errores; vacía si todo está bien.

**Reglas que mide:**
- ids únicos;
- `temaId` existente;
- 4 opciones distintas y no vacías, y 4 explicaciones;
- `ordenamiento` y `seleccion`: el texto de `opciones[correcta]` es igual a `solucion` en base 1, unida con «, »;
- `emparejamiento`: `opciones[correcta]` es igual a las parejas «1a, 2b…» de la solución;
- por cada unidad del bloque, exactamente 2 preguntas con uso `diagnostico`;
- `dibujo.lab` es uno de los laboratorios conocidos (`celula-animal`, `celula-vegetal`).

- [ ] Tests: uno por regla. Cada uno arma un contenido roto mínimo y espera el mensaje de error.
- [ ] FAIL, luego implementar, luego PASS.
- [ ] Commit.

### Task 4: Temario completo de Ciencias Naturales y del bloque general

**Files:**
- Create: `contenido/generales/estructura.ts` y `contenido/ccnn-egb-superior/estructura.ts`.
- Test: `tests/estructura.test.mts`.

- [ ] Test: 9 unidades, 31 temas y 70 lecciones; generales 39/45 compartido; Ciencias Naturales 60/120; los nombres de los temas son iguales a los del PDF.
- [ ] Transcribir el PDF, con un objetivo por subtema.
- [ ] PASS y commit.

### Task 5: Banco inicial de preguntas y contenido del tema de la demo

**Files:**
- Create: `contenido/generales/preguntas.ts`, `contenido/ccnn-egb-superior/preguntas.ts` y `contenido/ccnn-egb-superior/anatomia-celular.ts` (las lecciones con contenido).

**Qué contiene:**
- Diagnóstico: 18 preguntas, 2 por unidad. Mezclan los 5 formatos y hay al menos 2 con `dibujo`.
- Tema «Anatomía celular»: 2 lecciones con contenido y unas 14 preguntas (diagnóstico del tema, práctica y prueba).
- Simulacro corto: unas 12 preguntas de otras unidades.

- [ ] `validarContenido` sobre todo el contenido devuelve `[]` (prueba en `tests/contenido.test.mts`).
- [ ] Commit.

### Task 6: Siembra

**Files:**
- Create: `contenido/index.ts`, que exporta todas las especialidades, y `scripts/sembrar.ts` (`npm run sembrar`).
- Test: `tests/sembrar.test.mts`.

**Interfaces — Produces:** `sembrar(db: Db): Promise<{temas: number; lecciones: number; preguntas: number}>`. Valida primero y lanza un error si hay errores. Actualiza por id.

- [ ] Tests:
  - sembrar en PGlite en memoria da 31 temas y 70 lecciones;
  - sembrar dos veces deja las mismas cantidades;
  - un contenido inválido no siembra nada.
- [ ] FAIL, luego implementar, luego PASS.
- [ ] `npm run sembrar` en local. Esperado: imprime las cantidades.
- [ ] Commit.
