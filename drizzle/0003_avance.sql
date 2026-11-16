CREATE TABLE "preparacion_dias" (
	"usuario_id" text NOT NULL,
	"dia" text NOT NULL,
	"preparacion" smallint NOT NULL,
	CONSTRAINT "preparacion_dias_usuario_id_dia_pk" PRIMARY KEY("usuario_id","dia")
);
--> statement-breakpoint
ALTER TABLE "intentos" ADD COLUMN "prep_antes" smallint;--> statement-breakpoint
ALTER TABLE "intentos" ADD COLUMN "prep_despues" smallint;--> statement-breakpoint
ALTER TABLE "intentos" ADD COLUMN "cambios" jsonb;--> statement-breakpoint
ALTER TABLE "preparacion_dias" ADD CONSTRAINT "preparacion_dias_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;