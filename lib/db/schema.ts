import {sql} from 'drizzle-orm';
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  smallint,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// Las columnas se escriben en camelCase aquí y quedan en snake_case en Postgres (casing: 'snake_case').

// ───────────── Contenido: lo que se enseña (igual para todos los docentes) ─────────────

export const especialidades = pgTable('especialidades', {
  id: text().primaryKey(),
  nombre: text().notNull(),
  nivel: text().notNull(),
  estado: text({enum: ['activa', 'proximamente']}).notNull(),
  orden: integer().notNull().default(0),
});

/** Un bloque es una prueba del Ineval (p. ej. Conocimientos generales: 39 preguntas, 45 min). */
export const bloques = pgTable('bloques', {
  id: text().primaryKey(),
  nombre: text().notNull(),
  descripcion: text().notNull().default(''),
  /** Compartido = lo rinden todas las especialidades (Conocimientos generales). */
  compartido: boolean().notNull(),
  preguntasExamen: integer().notNull(),
  minutosExamen: integer().notNull(),
});

export const especialidadBloques = pgTable(
  'especialidad_bloques',
  {
    especialidadId: text()
      .notNull()
      .references(() => especialidades.id, {onDelete: 'cascade'}),
    bloqueId: text()
      .notNull()
      .references(() => bloques.id, {onDelete: 'cascade'}),
    orden: integer().notNull(),
  },
  (t) => [primaryKey({columns: [t.especialidadId, t.bloqueId]})]
);

export const unidades = pgTable('unidades', {
  id: text().primaryKey(),
  bloqueId: text()
    .notNull()
    .references(() => bloques.id, {onDelete: 'cascade'}),
  nombre: text().notNull(),
  orden: integer().notNull(),
});

export const temas = pgTable('temas', {
  id: text().primaryKey(),
  unidadId: text()
    .notNull()
    .references(() => unidades.id, {onDelete: 'cascade'}),
  nombre: text().notNull(),
  orden: integer().notNull(),
  /** Abierto = su contenido ya está listo para estudiar. */
  abierto: boolean().notNull().default(false),
  videoUrl: text(),
  videoTitulo: text(),
});

/** Una lección por subtema de la ficha. */
export const lecciones = pgTable('lecciones', {
  id: text().primaryKey(),
  temaId: text()
    .notNull()
    .references(() => temas.id, {onDelete: 'cascade'}),
  titulo: text().notNull(),
  objetivo: text().notNull(),
  minutos: integer().notNull().default(6),
  orden: integer().notNull(),
  contenido: jsonb(),
});

export const FORMATOS = ['simple', 'completamiento', 'seleccion', 'ordenamiento', 'emparejamiento'] as const;
export const USOS = ['diagnostico', 'diagnostico-tema', 'practica', 'prueba', 'simulacro'] as const;

export const preguntas = pgTable(
  'preguntas',
  {
    id: text().primaryKey(),
    temaId: text()
      .notNull()
      .references(() => temas.id, {onDelete: 'cascade'}),
    leccionId: text().references(() => lecciones.id, {onDelete: 'set null'}),
    formato: text({enum: FORMATOS}).notNull(),
    enunciado: text().notNull(),
    /** Lista numerada (selección, ordenamiento) o columnas {izquierda, derecha} (emparejamiento). */
    elementos: jsonb(),
    /** La respuesta en forma interactiva: índices a seleccionar, el orden, o la pareja de cada fila. */
    solucion: jsonb(),
    opciones: jsonb().$type<string[]>().notNull(),
    correcta: smallint().notNull(),
    explicaciones: jsonb().$type<string[]>().notNull(),
    usos: text().array().notNull(),
    dificultad: smallint().notNull(),
    /** Pregunta sobre un dibujo: cada opción corresponde a una zona del laboratorio. */
    dibujo: jsonb(),
    estado: text({enum: ['aprobada', 'borrador']}).notNull().default('aprobada'),
    creado: timestamp({withTimezone: true}).notNull().defaultNow(),
  },
  (t) => [index('preguntas_tema').on(t.temaId)]
);

// ───────────── Docentes y su avance ─────────────

export const usuarios = pgTable(
  'usuarios',
  {
    id: text().primaryKey(),
    nombre: text().notNull(),
    correo: text().notNull(),
    claveHash: text().notNull(),
    rol: text({enum: ['docente', 'admin']}).notNull().default('docente'),
    especialidadId: text().references(() => especialidades.id),
    creado: timestamp({withTimezone: true}).notNull().defaultNow(),
    ultimoIngreso: timestamp({withTimezone: true}),
  },
  (t) => [uniqueIndex('usuarios_correo_unico').on(sql`lower(${t.correo})`)]
);

export const TIPOS_INTENTO = ['diagnostico', 'diagnostico-tema', 'practica', 'prueba-tema', 'repaso', 'simulacro'] as const;

export const intentos = pgTable(
  'intentos',
  {
    id: text().primaryKey(),
    usuarioId: text()
      .notNull()
      .references(() => usuarios.id, {onDelete: 'cascade'}),
    tipo: text({enum: TIPOS_INTENTO}).notNull(),
    /** Tema, unidad o bloque al que pertenece el intento (si aplica). */
    referencia: text(),
    /** Preguntas en el orden en que se presentan, congeladas al iniciar. */
    preguntaIds: jsonb().$type<string[]>().notNull(),
    iniciado: timestamp({withTimezone: true}).notNull().defaultNow(),
    terminado: timestamp({withTimezone: true}),
    limiteSeg: integer(),
    puntaje: smallint(),
  },
  (t) => [index('intentos_usuario').on(t.usuarioId, t.tipo)]
);

export const respuestas = pgTable(
  'respuestas',
  {
    id: serial().primaryKey(),
    intentoId: text()
      .notNull()
      .references(() => intentos.id, {onDelete: 'cascade'}),
    usuarioId: text()
      .notNull()
      .references(() => usuarios.id, {onDelete: 'cascade'}),
    preguntaId: text()
      .notNull()
      .references(() => preguntas.id, {onDelete: 'cascade'}),
    /** Índice de la opción elegida (0–3). Null = se acabó el tiempo sin responder. */
    elegida: smallint(),
    correcta: boolean().notNull(),
    seguridad: text({enum: ['lo-se', 'creo', 'adivine']}),
    segundos: integer(),
    creado: timestamp({withTimezone: true}).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('respuestas_una_por_intento').on(t.intentoId, t.preguntaId)]
);

export const ESTADOS_DOMINIO = ['sin-empezar', 'aprendiendo', 'dominado', 'repasar'] as const;

export const dominio = pgTable(
  'dominio',
  {
    usuarioId: text()
      .notNull()
      .references(() => usuarios.id, {onDelete: 'cascade'}),
    temaId: text()
      .notNull()
      .references(() => temas.id, {onDelete: 'cascade'}),
    nivel: smallint().notNull().default(0),
    estado: text({enum: ESTADOS_DOMINIO}).notNull().default('sin-empezar'),
    actualizado: timestamp({withTimezone: true}).notNull().defaultNow(),
  },
  (t) => [primaryKey({columns: [t.usuarioId, t.temaId]})]
);

/** Repaso espaciado (cajas de Leitner): caja 0 = mañana, luego 3, 7, 14 y 30 días. */
export const repaso = pgTable(
  'repaso',
  {
    usuarioId: text()
      .notNull()
      .references(() => usuarios.id, {onDelete: 'cascade'}),
    preguntaId: text()
      .notNull()
      .references(() => preguntas.id, {onDelete: 'cascade'}),
    caja: smallint().notNull().default(0),
    proxima: date().notNull(),
    aciertos: integer().notNull().default(0),
    fallos: integer().notNull().default(0),
  },
  (t) => [primaryKey({columns: [t.usuarioId, t.preguntaId]}), index('repaso_proxima').on(t.usuarioId, t.proxima)]
);

export const progresoLecciones = pgTable(
  'progreso_lecciones',
  {
    usuarioId: text()
      .notNull()
      .references(() => usuarios.id, {onDelete: 'cascade'}),
    leccionId: text()
      .notNull()
      .references(() => lecciones.id, {onDelete: 'cascade'}),
    completada: timestamp({withTimezone: true}).notNull().defaultNow(),
  },
  (t) => [primaryKey({columns: [t.usuarioId, t.leccionId]})]
);

export const notas = pgTable(
  'notas',
  {
    usuarioId: text()
      .notNull()
      .references(() => usuarios.id, {onDelete: 'cascade'}),
    leccionId: text()
      .notNull()
      .references(() => lecciones.id, {onDelete: 'cascade'}),
    texto: text().notNull(),
    actualizado: timestamp({withTimezone: true}).notNull().defaultNow(),
  },
  (t) => [primaryKey({columns: [t.usuarioId, t.leccionId]})]
);

export const tutorMensajes = pgTable(
  'tutor_mensajes',
  {
    id: serial().primaryKey(),
    usuarioId: text()
      .notNull()
      .references(() => usuarios.id, {onDelete: 'cascade'}),
    leccionId: text()
      .notNull()
      .references(() => lecciones.id, {onDelete: 'cascade'}),
    rol: text({enum: ['docente', 'tutor']}).notNull(),
    texto: text().notNull(),
    creado: timestamp({withTimezone: true}).notNull().defaultNow(),
  },
  (t) => [index('tutor_conversacion').on(t.usuarioId, t.leccionId)]
);
