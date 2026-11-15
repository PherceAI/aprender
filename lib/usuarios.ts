import {eq, sql} from 'drizzle-orm';
import {hashClave, verificarClave} from './auth/clave';
import type {Rol} from './auth/sesion';
import type {Db} from './db';
import {especialidades, usuarios} from './db/schema';
import {newId, normalizarCorreo} from './util';

export type Usuario = typeof usuarios.$inferSelect;
export type UsuarioPublico = Omit<Usuario, 'claveHash'>;

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publico(u: Usuario): UsuarioPublico {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {claveHash, ...resto} = u;
  return resto;
}

export async function crearUsuario(
  db: Db,
  d: {nombre: string; correo: string; clave: string; rol?: Rol}
): Promise<UsuarioPublico> {
  const correo = normalizarCorreo(d.correo);
  const nombre = d.nombre.trim();
  if (!nombre) throw new Error('Escribe el nombre');
  if (!CORREO.test(correo)) throw new Error('El correo no es válido');
  if (d.clave.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres');
  if (await usuarioPorCorreo(db, correo)) throw new Error('Ya existe una cuenta con ese correo');
  const [u] = await db
    .insert(usuarios)
    .values({id: newId('u'), nombre, correo, claveHash: hashClave(d.clave), rol: d.rol ?? 'docente'})
    .returning();
  return publico(u);
}

export async function usuarioPorCorreo(db: Db, correo: string): Promise<Usuario | null> {
  const [u] = await db
    .select()
    .from(usuarios)
    .where(sql`lower(${usuarios.correo}) = ${normalizarCorreo(correo)}`);
  return u ?? null;
}

export async function usuarioPorId(db: Db, id: string): Promise<UsuarioPublico | null> {
  const [u] = await db.select().from(usuarios).where(eq(usuarios.id, id));
  return u ? publico(u) : null;
}

/** Devuelve el usuario si correo y contraseña coinciden, y anota su último ingreso. */
export async function ingresar(db: Db, correo: string, clave: string): Promise<UsuarioPublico | null> {
  const u = await usuarioPorCorreo(db, correo);
  if (!u || !verificarClave(clave, u.claveHash)) return null;
  const [act] = await db.update(usuarios).set({ultimoIngreso: new Date()}).where(eq(usuarios.id, u.id)).returning();
  return publico(act);
}

/** Crea la cuenta o, si ya existe, le pone esta contraseña, nombre y rol (cuentas de demo y admin). */
export async function asegurarUsuario(db: Db, d: {nombre: string; correo: string; clave: string; rol: Rol}) {
  const existente = await usuarioPorCorreo(db, d.correo);
  if (!existente) return crearUsuario(db, d);
  const [u] = await db
    .update(usuarios)
    .set({nombre: d.nombre, rol: d.rol, claveHash: hashClave(d.clave)})
    .where(eq(usuarios.id, existente.id))
    .returning();
  return publico(u);
}

export async function elegirEspecialidad(db: Db, usuarioId: string, especialidadId: string) {
  const [e] = await db.select().from(especialidades).where(eq(especialidades.id, especialidadId));
  if (!e) throw new Error('Esa especialidad no existe');
  if (e.estado !== 'activa') throw new Error(`${e.nombre} estará disponible próximamente`);
  await db.update(usuarios).set({especialidadId}).where(eq(usuarios.id, usuarioId));
}
