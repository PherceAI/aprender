CREATE TABLE "ajustes" (
	"clave" text PRIMARY KEY NOT NULL,
	"valor" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pagos" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" text NOT NULL,
	"metodo" text NOT NULL,
	"monto" integer NOT NULL,
	"estado" text DEFAULT 'pendiente' NOT NULL,
	"referencia" text DEFAULT '' NOT NULL,
	"archivo" text,
	"nota" text,
	"creado" timestamp with time zone DEFAULT now() NOT NULL,
	"revisado" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pagos_estado" ON "pagos" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "pagos_usuario" ON "pagos" USING btree ("usuario_id");