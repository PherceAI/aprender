# Progreso visible y pestañas pulidas — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Objetivo:** que el docente vea en cada resultado cuánto subió, que tenga una pestaña «Mi progreso» con su evolución, que las demás pestañas sigan el estilo nuevo y que las lecciones traigan ejemplos.

**Arquitectura:** al terminar un intento por primera vez, el motor guarda la preparación de antes y de después y el nivel de antes y de después de cada tema tocado. Lo guarda en la fila del intento, para que recargar la página no cambie nada, y además anota la preparación del día en una tabla nueva. Las pantallas leen esos datos. Las lecciones suman un tipo de sección «ejemplo».

**Stack:** Next.js 15 (App Router), Drizzle con Postgres/PGlite, Tailwind v4, pruebas con `node:test` vía `tsx`.

**Spec:** `docs/pulido-checklist.md` (partes 6 y siguientes) y los pedidos del dueño del 15 y 16 de nov: «ve cada pestaña y hazla de nuevo limpia, clara, profesional y funcional»; «que el aprendizaje sea claro, didáctico y con ejemplos, mejor que los cursos caros de solo videos».

## Restricciones globales

- Estilo del hotel: fondo blanco, naranja #f0360a como único acento, Instrument Sans, sin sombras pesadas, modo claro por defecto.
- **Nunca debe haber scroll horizontal en el teléfono:** `scrollWidth` debe ser igual al ancho de la pantalla en 390 px.
- Español de Ecuador y palabras simples. Una acción principal por pantalla.
- No se inventan testimonios, cifras ni claims. Los ejemplos de contenido deben ser exactos.
- Cuenta gratis: diagnóstico y 2 lecciones. Las pruebas de tema y los simulacros son del acceso completo (`lib/acceso.ts`).
- Las 58 pruebas actuales siguen pasando.

## Foco de revisión

1. Si se recarga la página de un resultado, el «antes → después» no cambia, porque se lee de lo guardado. La prueba está en la tarea 1.
2. Un docente sin historia (primer día) ve un estado vacío claro en el gráfico de «Mi progreso», no un gráfico roto. Se verifica en la tarea 3.
3. Con cuenta gratis, «Simulacros» muestra el candado y cómo desbloquear, nunca un error. Se verifica en la tarea 4.
4. En la práctica el nivel no cambia: no se muestra «+0 %». El avance solo aparece si antes ≠ después. Se verifica en la tarea 2.
5. Nombres de tema largos en el teléfono se recortan y no generan scroll horizontal. Se verifica en las tareas 2 y 3.

---

### Task 1 — guardar el avance de cada intento

**Archivos:**
- Modificar: `lib/db/schema.ts` (`intentos`: `prepAntes` int null, `prepDespues` int null, `cambios` jsonb null; tabla nueva `preparacionDias`).
- Crear: `drizzle/0003_avance.sql` con `npx drizzle-kit generate --name avance`.
- Crear: `lib/avance.ts`.
- Modificar: `lib/intentos.ts` (`terminarIntento` y la interfaz `Resultado`).
- Prueba: `tests/avance.test.mts`.

**Interfaces:**
- Produce: `type Avance = {preparacionAntes: number; preparacionDespues: number; temas: {id: string; nombre: string; antes: number; despues: number}[]}`, exportado desde `lib/avance.ts`.
- Produce: `Resultado.avance?: Avance`.
- Produce: `historialPreparacion(db, usuarioId, dias = 30): Promise<{dia: string; preparacion: number}[]>`, ordenado del más antiguo al más nuevo.
- Produce: `anotarPreparacion(db, usuarioId, especialidadId, ahora): Promise<number>`, que hace upsert de `(usuarioId, hoyEc(ahora))` y devuelve la preparación.

- [ ] Prueba «la prueba del tema guarda cuánto subió y no cambia al recargar»: prueba de Anatomía celular toda correcta → `avance.temas[0].despues === 100`, `avance.preparacionDespues > avance.preparacionAntes`; un segundo `terminarIntento` devuelve el mismo `avance` con `deepEqual`.
- [ ] Prueba «la preparación del día queda anotada»: después del diagnóstico, `historialPreparacion` tiene 1 fila con `dia === hoyEc(AHORA)`; tras la prueba del tema la misma fila sube (sigue siendo 1 fila).
- [ ] Correr y ver que fallan.
- [ ] Implementar. En `terminarIntento`, si es la primera vez, leer la preparación y los niveles de los temas de `porTema` antes del `switch` y después de él. Guardar `prepAntes`, `prepDespues` y `cambios` en la fila. Si no es la primera vez, armar `avance` desde la fila. Llamar `anotarPreparacion` al final.
- [ ] Correr toda la suite: 58 + 2 pasan. Commit.

### Task 2 — resultado que muestra cuánto subiste

**Archivos:** modificar `app/(foco)/practicar/[id]/resultado/page.tsx`.

**Interfaces:** consume `Resultado.avance` (tarea 1) y `siguientePaso`.

- [ ] Arriba van el anillo con el puntaje y «X de N correctas». Debajo, una tarjeta «Tu avance» que solo aparece si hay cambio:
  - una fila por tema con barra antes (gris) → después (naranja) y «35 % → 100 %»;
  - una fila «Tu preparación 46 % → 49 % (+3)».
- [ ] Una sola acción principal según el caso (`siguientePaso`); las secundarias van como enlaces. Botones en píldora, como el resto.
- [ ] Práctica: texto «La práctica no cambia tu nivel: lo cambia la prueba del tema. Lo que fallaste vuelve en tu repaso».
- [ ] Verificar en 1440 y 390: `scrollWidth` igual al ancho y nombres largos recortados. Commit.

### Task 3 — pestaña «Mi progreso»

**Archivos:**
- Modificar: `app/(app)/perfil/page.tsx`.
- Crear: `components/grafico-preparacion.tsx` (SVG de servidor, sin librería).

**Interfaces:** consume `historialPreparacion`, `perfilDe`, `mapaCurso`.

- [ ] Encabezado: el anillo de preparación con una frase que explica qué es.
- [ ] Cuatro cifras: temas dominados de 31, preguntas respondidas con su % de acierto, racha y lecciones vistas.
- [ ] Gráfico de la preparación de los últimos 30 días:
  - `GraficoPreparacion({puntos: {dia, preparacion}[]})` dibuja una línea con área y las etiquetas del primer y el último día;
  - con menos de 2 puntos muestra el estado vacío «Tu evolución aparece desde tu segundo día de estudio».
- [ ] «Por prueba»: barra de nivel de Conocimientos generales y de Ciencias Naturales.
- [ ] «Tus temas»: tres grupos (Dominados, En camino, Por empezar), cada tema enlazado a su página.
- [ ] Se mantiene «Lo que más se te complica».
- [ ] Historial: las últimas pruebas de tema y los últimos simulacros, con fecha y puntaje.
- [ ] Verificar con historia y sin historia, en PC y teléfono. Commit.

### Task 4 — Simulacros, bienvenida e ingreso con el mismo estilo

**Archivos:**
- Modificar: `app/(app)/simulacro/page.tsx`.
- Modificar: `app/(foco)/bienvenida/page.tsx` y `elegir.tsx`.
- Modificar: `app/ingresar/page.tsx`.

- [ ] Simulacros: la tarjeta del simulacro corto con «Empezar» en píldora. Con cuenta gratis, candado y «Ver acceso completo» hacia `/acceso`. Los simulacros completos quedan como «Muy pronto», claros. El historial se ve con barras.
- [ ] Bienvenida: cuatro tarjetas de especialidad, con la activa destacada y las demás «Muy pronto»; una sola acción.
- [ ] Ingreso: enlace «¿No tienes cuenta? Empieza gratis» hacia `/registro`; el texto deja de decir «que te dimos».
- [ ] Verificar las tres pantallas en PC y teléfono. Commit.

### Task 5 — lecciones con ejemplos

**Archivos:**
- Modificar: `contenido/tipos.ts` (agregar `{tipo: 'ejemplo'; titulo?: string; situacion: string; explicacion: string}` a `Seccion`).
- Modificar: `contenido/validar.ts` (rechazar `situacion` o `explicacion` vacías).
- Modificar: `lib/tutor.ts` (`textoDeSecciones` incluye «Ejemplo: …»).
- Modificar: `components/leccion/reproductor.tsx` (pantalla «Ejemplo»: muestra la situación y pide «¿Por qué crees que pasa?»; al tocar «Ver explicación» se habilita «Continuar»).
- Modificar: `contenido/ccnn-egb-superior/anatomia-celular.ts` (2 ejemplos por lección, exactos, de la vida diaria o del aula en Ecuador).
- Prueba: `tests/validar.test.mts`.

- [ ] Prueba «un ejemplo sin explicación es un error del contenido».
- [ ] Implementar el tipo, la validación, el texto para el tutor y la pantalla.
- [ ] Escribir los 4 ejemplos y pasar `validarContenido` sin errores.
- [ ] Recorrer la lección completa en PC y teléfono. Commit.

### Task 6 — verificar y publicar

- [ ] `npx tsc --noEmit`, `npm test` (todo pasa), `npx next build`.
- [ ] Recorrido como docente en PC y teléfono: Inicio, Mi ruta, tema, lección, práctica, resultado, Repaso, Simulacros y Mi progreso. Sin errores de página y `scrollWidth` correcto.
- [ ] Actualizar `docs/pulido-checklist.md`, commit, push y desplegar en Coolify. Comprobar que la portada responde 200.
