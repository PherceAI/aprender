CREATE TABLE "bloques" (
	"id" text PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"descripcion" text DEFAULT '' NOT NULL,
	"compartido" boolean NOT NULL,
	"preguntas_examen" integer NOT NULL,
	"minutos_examen" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dominio" (
	"usuario_id" text NOT NULL,
	"tema_id" text NOT NULL,
	"nivel" smallint DEFAULT 0 NOT NULL,
	"estado" text DEFAULT 'sin-empezar' NOT NULL,
	"actualizado" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dominio_usuario_id_tema_id_pk" PRIMARY KEY("usuario_id","tema_id")
);
--> statement-breakpoint
CREATE TABLE "especialidad_bloques" (
	"especialidad_id" text NOT NULL,
	"bloque_id" text NOT NULL,
	"orden" integer NOT NULL,
	CONSTRAINT "especialidad_bloques_especialidad_id_bloque_id_pk" PRIMARY KEY("especialidad_id","bloque_id")
);
--> statement-breakpoint
CREATE TABLE "especialidades" (
	"id" text PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"nivel" text NOT NULL,
	"estado" text NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "intentos" (
	"id" text PRIMARY KEY NOT NULL,
	"usuario_id" text NOT NULL,
	"tipo" text NOT NULL,
	"referencia" text,
	"pregunta_ids" jsonb NOT NULL,
	"iniciado" timestamp with time zone DEFAULT now() NOT NULL,
	"terminado" timestamp with time zone,
	"limite_seg" integer,
	"puntaje" smallint
);
--> statement-breakpoint
CREATE TABLE "lecciones" (
	"id" text PRIMARY KEY NOT NULL,
	"tema_id" text NOT NULL,
	"titulo" text NOT NULL,
	"objetivo" text NOT NULL,
	"minutos" integer DEFAULT 6 NOT NULL,
	"orden" integer NOT NULL,
	"contenido" jsonb
);
--> statement-breakpoint
CREATE TABLE "notas" (
	"usuario_id" text NOT NULL,
	"leccion_id" text NOT NULL,
	"texto" text NOT NULL,
	"actualizado" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notas_usuario_id_leccion_id_pk" PRIMARY KEY("usuario_id","leccion_id")
);
--> statement-breakpoint
CREATE TABLE "preguntas" (
	"id" text PRIMARY KEY NOT NULL,
	"tema_id" text NOT NULL,
	"leccion_id" text,
	"formato" text NOT NULL,
	"enunciado" text NOT NULL,
	"elementos" jsonb,
	"solucion" jsonb,
	"opciones" jsonb NOT NULL,
	"correcta" smallint NOT NULL,
	"explicaciones" jsonb NOT NULL,
	"usos" text[] NOT NULL,
	"dificultad" smallint NOT NULL,
	"dibujo" jsonb,
	"estado" text DEFAULT 'aprobada' NOT NULL,
	"creado" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "progreso_lecciones" (
	"usuario_id" text NOT NULL,
	"leccion_id" text NOT NULL,
	"completada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "progreso_lecciones_usuario_id_leccion_id_pk" PRIMARY KEY("usuario_id","leccion_id")
);
--> statement-breakpoint
CREATE TABLE "repaso" (
	"usuario_id" text NOT NULL,
	"pregunta_id" text NOT NULL,
	"caja" smallint DEFAULT 0 NOT NULL,
	"proxima" date NOT NULL,
	"aciertos" integer DEFAULT 0 NOT NULL,
	"fallos" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "repaso_usuario_id_pregunta_id_pk" PRIMARY KEY("usuario_id","pregunta_id")
);
--> statement-breakpoint
CREATE TABLE "respuestas" (
	"id" serial PRIMARY KEY NOT NULL,
	"intento_id" text NOT NULL,
	"usuario_id" text NOT NULL,
	"pregunta_id" text NOT NULL,
	"elegida" smallint,
	"correcta" boolean NOT NULL,
	"seguridad" text,
	"segundos" integer,
	"creado" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "temas" (
	"id" text PRIMARY KEY NOT NULL,
	"unidad_id" text NOT NULL,
	"nombre" text NOT NULL,
	"orden" integer NOT NULL,
	"abierto" boolean DEFAULT false NOT NULL,
	"video_url" text,
	"video_titulo" text
);
--> statement-breakpoint
CREATE TABLE "tutor_mensajes" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" text NOT NULL,
	"leccion_id" text NOT NULL,
	"rol" text NOT NULL,
	"texto" text NOT NULL,
	"creado" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unidades" (
	"id" text PRIMARY KEY NOT NULL,
	"bloque_id" text NOT NULL,
	"nombre" text NOT NULL,
	"orden" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" text PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"correo" text NOT NULL,
	"clave_hash" text NOT NULL,
	"rol" text DEFAULT 'docente' NOT NULL,
	"especialidad_id" text,
	"creado" timestamp with time zone DEFAULT now() NOT NULL,
	"ultimo_ingreso" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "dominio" ADD CONSTRAINT "dominio_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dominio" ADD CONSTRAINT "dominio_tema_id_temas_id_fk" FOREIGN KEY ("tema_id") REFERENCES "public"."temas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "especialidad_bloques" ADD CONSTRAINT "especialidad_bloques_especialidad_id_especialidades_id_fk" FOREIGN KEY ("especialidad_id") REFERENCES "public"."especialidades"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "especialidad_bloques" ADD CONSTRAINT "especialidad_bloques_bloque_id_bloques_id_fk" FOREIGN KEY ("bloque_id") REFERENCES "public"."bloques"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intentos" ADD CONSTRAINT "intentos_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lecciones" ADD CONSTRAINT "lecciones_tema_id_temas_id_fk" FOREIGN KEY ("tema_id") REFERENCES "public"."temas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notas" ADD CONSTRAINT "notas_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notas" ADD CONSTRAINT "notas_leccion_id_lecciones_id_fk" FOREIGN KEY ("leccion_id") REFERENCES "public"."lecciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preguntas" ADD CONSTRAINT "preguntas_tema_id_temas_id_fk" FOREIGN KEY ("tema_id") REFERENCES "public"."temas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preguntas" ADD CONSTRAINT "preguntas_leccion_id_lecciones_id_fk" FOREIGN KEY ("leccion_id") REFERENCES "public"."lecciones"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progreso_lecciones" ADD CONSTRAINT "progreso_lecciones_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progreso_lecciones" ADD CONSTRAINT "progreso_lecciones_leccion_id_lecciones_id_fk" FOREIGN KEY ("leccion_id") REFERENCES "public"."lecciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repaso" ADD CONSTRAINT "repaso_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repaso" ADD CONSTRAINT "repaso_pregunta_id_preguntas_id_fk" FOREIGN KEY ("pregunta_id") REFERENCES "public"."preguntas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "respuestas" ADD CONSTRAINT "respuestas_intento_id_intentos_id_fk" FOREIGN KEY ("intento_id") REFERENCES "public"."intentos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "respuestas" ADD CONSTRAINT "respuestas_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "respuestas" ADD CONSTRAINT "respuestas_pregunta_id_preguntas_id_fk" FOREIGN KEY ("pregunta_id") REFERENCES "public"."preguntas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "temas" ADD CONSTRAINT "temas_unidad_id_unidades_id_fk" FOREIGN KEY ("unidad_id") REFERENCES "public"."unidades"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tutor_mensajes" ADD CONSTRAINT "tutor_mensajes_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tutor_mensajes" ADD CONSTRAINT "tutor_mensajes_leccion_id_lecciones_id_fk" FOREIGN KEY ("leccion_id") REFERENCES "public"."lecciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unidades" ADD CONSTRAINT "unidades_bloque_id_bloques_id_fk" FOREIGN KEY ("bloque_id") REFERENCES "public"."bloques"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_especialidad_id_especialidades_id_fk" FOREIGN KEY ("especialidad_id") REFERENCES "public"."especialidades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "intentos_usuario" ON "intentos" USING btree ("usuario_id","tipo");--> statement-breakpoint
CREATE INDEX "preguntas_tema" ON "preguntas" USING btree ("tema_id");--> statement-breakpoint
CREATE INDEX "repaso_proxima" ON "repaso" USING btree ("usuario_id","proxima");--> statement-breakpoint
CREATE UNIQUE INDEX "respuestas_una_por_intento" ON "respuestas" USING btree ("intento_id","pregunta_id");--> statement-breakpoint
CREATE INDEX "tutor_conversacion" ON "tutor_mensajes" USING btree ("usuario_id","leccion_id");--> statement-breakpoint
CREATE UNIQUE INDEX "usuarios_correo_unico" ON "usuarios" USING btree (lower("correo"));