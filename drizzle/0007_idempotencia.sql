-- Por si ya hay avisos duplicados: se deja el más reciente pendiente y los demás como rechazados.
UPDATE "pagos" SET "estado" = 'rechazado', "nota" = 'Aviso duplicado' WHERE "estado" = 'pendiente' AND "id" NOT IN (SELECT max("id") FROM "pagos" WHERE "estado" = 'pendiente' GROUP BY "usuario_id");--> statement-breakpoint
CREATE UNIQUE INDEX "pagos_un_pendiente" ON "pagos" USING btree ("usuario_id") WHERE estado = 'pendiente';
