CREATE TABLE "lecciones_elegidas" (
	"usuario_id" text NOT NULL,
	"leccion_id" text NOT NULL,
	"elegida" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lecciones_elegidas_usuario_id_leccion_id_pk" PRIMARY KEY("usuario_id","leccion_id")
);
--> statement-breakpoint
ALTER TABLE "lecciones_elegidas" ADD CONSTRAINT "lecciones_elegidas_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lecciones_elegidas" ADD CONSTRAINT "lecciones_elegidas_leccion_id_lecciones_id_fk" FOREIGN KEY ("leccion_id") REFERENCES "public"."lecciones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- Quien ya tiene cuenta gratis conserva como elegidas las lecciones que ya terminó.
INSERT INTO "lecciones_elegidas" ("usuario_id", "leccion_id", "elegida") SELECT p."usuario_id", p."leccion_id", p."completada" FROM "progreso_lecciones" p JOIN "usuarios" u ON u."id" = p."usuario_id" WHERE u."plan" = 'gratis' ON CONFLICT DO NOTHING;
