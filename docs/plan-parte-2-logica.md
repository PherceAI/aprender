# Parte 2 · Lógica de negocio — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que toda la plataforma funcione en el servidor, probada, sin interfaz. Incluye: cuentas, elección de especialidad, diagnóstico y ubicación, ruta, lecciones, práctica, prueba del tema, repaso espaciado, simulacro con tiempo, perfil, panel de administración y videos.

**Architecture:**
- Funciones en `lib/` que reciben `db: Db` y el id del docente, y devuelven datos simples.
- La parte 3 solo las llama desde *server actions*.
- Las reglas que dependen de la fecha reciben `ahora: Date` para poder probarlas.
- Al docente nunca le llega la respuesta correcta antes de responder (`preguntaPublica`).

**Tech Stack:** igual que en la parte 1. La IA del tutor es Gemini, cuando llegue la clave.

**Spec:** `VISION.md`, secciones 2b, 4, 4c, 5, 6, 8 y 9. La parte 1 está en `docs/plan-parte-1-base-de-datos.md`.

## Global Constraints

- **Dominio:**
  - El tema queda dominado con 80 % o más en la prueba del tema.
  - Si el diagnóstico del tema da 80 % o más, el docente puede saltarlo («Ya lo sé»).
  - El diagnóstico de entrada nunca deja un tema dominado; su nivel máximo es 70.
- **Valor de cada respuesta del diagnóstico para ubicar al docente:**

  | Respuesta | Vale |
  |---|---|
  | Bien y «lo sé» | 1 |
  | Bien y «creo» | 0,75 |
  | Bien y «adiviné» | 0,25 |
  | Mal | 0 |

  El nivel inicial de cada tema de la unidad es `round(promedio × 70)`.
- **Repaso:**
  - Una pregunta fallada vuelve al día siguiente.
  - Si se acierta, vuelve a los 3, 7, 14 y 30 días.
  - Hay como máximo 10 por día.
- **Retroalimentación al responder:**
  - inmediata en práctica, repaso y prueba del tema;
  - al final en el simulacro;
  - nunca en los diagnósticos.
- **Simulacro corto:** 15 preguntas en 20 minutos. Se cierra solo al pasar el límite, con 5 segundos de gracia.
- **Preparación (%):** promedio del nivel de los temas, ponderado por el peso del bloque en el examen (39 y 60 preguntas).
- **El «día»** es el de Ecuador (UTC-5).
- **Contraseñas:** scrypt con sal. La sesión va en una cookie firmada con HMAC. Tras 6 intentos fallidos en 15 minutos, se bloquea.
- **Un docente nunca ve ni toca los intentos de otro.**

## Review Focus

1. **Responder después de que se acabó el tiempo del simulacro.** Lo esperado es que se rechace y el intento se cierre con lo respondido.
2. **Responder dos veces la misma pregunta,** o una pregunta que no es del intento. Lo esperado es que se rechace sin cambiar la nota.
3. **Abrir un tema cerrado o una lección de un tema cerrado.** Lo esperado es «tema cerrado», sin datos.
4. **Volver al diagnóstico a medias** (por ejemplo, se cerró la app). Lo esperado es que siga el mismo intento, sin crear otro.
5. **Respuesta interactiva** (ordenar, unir o seleccionar). Lo esperado es que se califique comparando con la solución, igual que con la opción equivalente.

---

### Task 1: Cuentas y sesión

- Archivos: `lib/util.ts`, `lib/auth/clave.ts`, `lib/auth/sesion.ts`, `lib/usuarios.ts` y `tests/usuarios.test.mts`.
- **Produces:**
  - `hashClave(c)` y `verificarClave(c, hash)`.
  - `firmarToken(p)` y `leerToken(t, ahora)`: la sesión del docente dura 30 días y la del administrador, 12 horas.
  - `crearUsuario(db, {nombre, correo, clave, rol?})`: el correo se guarda normalizado y la clave debe tener al menos 8 caracteres.
  - `ingresar(db, correo, clave)`: devuelve `Usuario | null`.
  - `elegirEspecialidad(db, uid, espId)`: rechaza las especialidades «próximamente».
- **Tests:**
  - ingresar con mayúsculas en el correo funciona;
  - una clave incorrecta da null;
  - elegir una especialidad «próximamente» falla;
  - un token alterado o vencido da null.

### Task 2: Motor de preguntas

- Archivos: `lib/intentos.ts` y `tests/intentos.test.mts`.
- **Produces:**
  - `iniciarIntento(db, uid, tipo, ref?, ahora)`: crea el intento o retoma el abierto del mismo tipo y referencia.
  - `preguntaPublica(p)`: la pregunta sin `correcta`, `explicaciones` ni `solucion`.
  - `responder(db, uid, intentoId, preguntaId, {elegida?, interactiva?, seguridad?, segundos?}, ahora)`: devuelve la retroalimentación o `{registrada: true}`.
  - `terminarIntento(db, uid, intentoId, ahora)`: devuelve el `Resultado`, con puntaje, desglose por unidad y por tema, y las preguntas con su explicación cuando corresponde.
- **Qué preguntas toma cada tipo:**

  | Tipo | Preguntas |
  |---|---|
  | `diagnostico` | 2 por unidad de su especialidad, en orden |
  | `diagnostico-tema` | las de ese uso en el tema |
  | `practica` (por lección) | hasta 3 de práctica de la lección |
  | `prueba-tema` | hasta 10 de prueba, primero las falladas antes |
  | `repaso` | las pendientes de hoy, hasta 10 |
  | `simulacro` | corto: 15 de práctica, prueba o simulacro de sus bloques, mezcladas |

- **Tests:** uno por cada punto del Review Focus, más que la pregunta pública no trae la respuesta.

### Task 3: Dominio, repaso y ruta

- Archivos: `lib/dominio.ts`, `lib/repaso.ts`, `lib/ruta.ts` y sus tests.
- `terminarIntento` llama a `aplicarResultado`:
  - **diagnóstico de entrada:** ubica cada unidad;
  - **prueba del tema:** el nivel pasa a ser el puntaje, con estado «dominado» o «aprendiendo»;
  - **práctica, prueba y repaso:** actualizan el repaso.
- **Produces:**
  - `rutaDe(db, uid)`: los temas no dominados, primero los abiertos, luego de menor nivel y de mayor peso.
  - `hoyDe(db, uid, ahora)`: la siguiente lección, los repasos pendientes, la preparación y la racha.
  - `saltarTema(db, uid, temaId)`.

### Task 4: Curso, lecciones y perfil

- Archivos: `lib/curso.ts`, `lib/perfil.ts` y sus tests.
- **Produces:**
  - `mapaCurso(db, uid)`: bloques, unidades y temas, con el dominio de cada tema y su estado abierto o cerrado.
  - `leccion(db, uid, id)`: la lección con su anterior y siguiente; si el tema está cerrado, devuelve `'tema-cerrado'`.
  - `completarLeccion`.
  - `notas`: leer y guardar.
  - `perfilDe(db, uid)`: preparación, racha, dominio de los 31 temas, simulacros y errores frecuentes.

### Task 5: Administración y videos

- Archivos: `lib/admin.ts`, `lib/videos.ts`, `app/api/videos/[archivo]/route.ts`, `app/api/admin/videos/route.ts` y sus tests.
- **Produces:**
  - `resumenAdmin(db, ahora)`: docentes, activos en 7 días, temas más fallados y simulacros.
  - `docentesConAvance`, `crearDocente`.
  - `guardarVideo(temaId, stream, nombre)`: guarda en `DATA_DIR/videos` y actualiza `temas.videoUrl`.
  - La ruta GET sirve el video con soporte de `Range` para que el teléfono pueda adelantar.

### Task 6: Arranque y cuentas de demo

- Archivo: `instrumentation.ts`. Al arrancar el servidor:
  1. migra la base;
  2. siembra el contenido;
  3. crea o actualiza la cuenta de administrador (`ADMIN_CORREO` y `ADMIN_CLAVE`) y la del docente de demo (`DEMO_CORREO` y `DEMO_CLAVE`), si esas variables existen.
- En local, `npm run cuentas` genera las claves en `data-local/credenciales-demo.txt`, que no se sube al repositorio.

### Task 7: Tutor con IA

- Archivos: `lib/tutor.ts` y sus tests.
- **Produces:**
  - `preguntarTutor(db, uid, leccionId, texto)`: responde con Gemini usando solo el contenido de la lección. Tiene un límite de 30 mensajes al día y guarda el historial. Sin `GEMINI_API_KEY`, devuelve `{disponible: false}`.
  - `porQueMeEquivoque(db, uid, respuestaId)`.
