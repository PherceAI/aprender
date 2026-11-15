import {promises as fs} from 'node:fs';
import path from 'node:path';
import type {PgDatabase, PgQueryResultHKT} from 'drizzle-orm/pg-core';
import * as schema from './schema';

// Postgres en producción (DATABASE_URL, Coolify). Sin DATABASE_URL: PGlite, un Postgres
// dentro del proceso, guardado en data-local/pg (o en DATA_DIR/pg). Las pruebas lo usan en memoria.

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

const MIGRACIONES = path.join(process.cwd(), 'drizzle');

const global = globalThis as unknown as {__rutaDocenteDb?: Promise<Db>};

/** La base de la aplicación. Se abre y migra una sola vez por proceso. */
export function getDb(): Promise<Db> {
  global.__rutaDocenteDb ??= abrir().catch((err) => {
    global.__rutaDocenteDb = undefined;
    throw err;
  });
  return global.__rutaDocenteDb;
}

async function abrir(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const {Pool} = await import('pg');
    const {drizzle} = await import('drizzle-orm/node-postgres');
    const {migrate} = await import('drizzle-orm/node-postgres/migrator');
    const db = drizzle(new Pool({connectionString: url, max: 10}), {schema, casing: 'snake_case'});
    await migrate(db, {migrationsFolder: MIGRACIONES});
    return db as unknown as Db;
  }
  const dir = path.join(process.env.DATA_DIR || path.join(process.cwd(), 'data-local'), 'pg');
  await fs.mkdir(dir, {recursive: true});
  return abrirPglite(dir);
}

/** PGlite en una carpeta, o en memoria si no se da carpeta. Siempre migrado. */
export async function abrirPglite(dir?: string): Promise<Db> {
  const {PGlite} = await import('@electric-sql/pglite');
  const {drizzle} = await import('drizzle-orm/pglite');
  const {migrate} = await import('drizzle-orm/pglite/migrator');
  const db = drizzle(new PGlite(dir), {schema, casing: 'snake_case'});
  await migrate(db, {migrationsFolder: MIGRACIONES});
  return db as unknown as Db;
}

/** Base nueva y vacía en memoria, para las pruebas. */
export function crearDbPrueba(): Promise<Db> {
  return abrirPglite();
}
