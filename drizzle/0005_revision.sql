CREATE TABLE "comentarios_revision" (
	"id" serial PRIMARY KEY NOT NULL,
	"autor" text NOT NULL,
	"ruta" text NOT NULL,
	"ancla" text DEFAULT '' NOT NULL,
	"muestra" text DEFAULT '' NOT NULL,
	"tipo" text NOT NULL,
	"texto" text NOT NULL,
	"ancho" integer DEFAULT 0 NOT NULL,
	"resuelto" boolean DEFAULT false NOT NULL,
	"creado" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "comentarios_revision_ruta" ON "comentarios_revision" USING btree ("ruta");