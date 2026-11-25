import {randomBytes} from 'node:crypto';
import {eq} from 'drizzle-orm';
import type {Db} from '../db';
import {usuarios} from '../db/schema';
import {registrar, usuarioPorCorreo, usuarioPorId, type UsuarioPublico} from '../usuarios';

// «Entrar con Google» directo con Google (OAuth 2.0, flujo de código), sin Supabase:
//   GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET de un cliente OAuth «Aplicación web» en Google Cloud,
//   con la URI de redirección <URL_PUBLICA>/api/auth/google/callback.
// Sin esas variables, el botón no aparece. Solo para docentes: el administrador entra con su contraseña.

export const COOKIE_ESTADO = 'rd_google';

export function googleListo(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim());
}

export const nuevoEstado = () => randomBytes(16).toString('hex');

export function urlGoogle(estado: string, redirectUri: string): string {
  const q = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!.trim(),
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state: estado,
    prompt: 'select_account',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${q}`;
}

export type PerfilGoogle = {correo: string; nombre: string; verificado: boolean};

/** Cambia el código por el id_token. El token llega directo de Google por TLS, así que basta con leerlo y revisar aud. */
export async function perfilDeCodigo(codigo: string, redirectUri: string): Promise<PerfilGoogle> {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      code: codigo,
      client_id: process.env.GOOGLE_CLIENT_ID!.trim(),
      client_secret: process.env.GOOGLE_CLIENT_SECRET!.trim(),
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
    signal: AbortSignal.timeout(15_000),
  });
  const datos = (await r.json().catch(() => null)) as {id_token?: string} | null;
  if (!r.ok || !datos?.id_token) throw new Error(`Google respondió ${r.status}`);
  const p = JSON.parse(Buffer.from(datos.id_token.split('.')[1], 'base64url').toString('utf8')) as {
    aud?: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
  };
  if (p.aud !== process.env.GOOGLE_CLIENT_ID!.trim() || !p.email) throw new Error('Token de Google no válido');
  return {correo: p.email, nombre: p.name?.trim() || p.email.split('@')[0], verificado: p.email_verified === true};
}

/** Encuentra o crea la cuenta del docente con ese correo de Google. Las cuentas de administrador no entran por aquí. */
export async function ingresarConGoogle(db: Db, perfil: PerfilGoogle): Promise<UsuarioPublico> {
  if (!perfil.verificado) throw new Error('Tu correo de Google no está verificado');
  const existente = await usuarioPorCorreo(db, perfil.correo);
  if (existente) {
    if (existente.rol !== 'docente') throw new Error('Esta cuenta entra con correo y contraseña');
    await db.update(usuarios).set({ultimoIngreso: new Date()}).where(eq(usuarios.id, existente.id));
    return (await usuarioPorId(db, existente.id))!;
  }
  // Cuenta nueva y gratis; la contraseña es al azar (entra con Google).
  try {
    return await registrar(db, {nombre: perfil.nombre, correo: perfil.correo, clave: randomBytes(24).toString('base64url')});
  } catch (e) {
    // Dos regresos de Google a la vez: la cuenta ya la creó el otro.
    const creada = await usuarioPorCorreo(db, perfil.correo);
    if (creada?.rol === 'docente') return (await usuarioPorId(db, creada.id))!;
    throw e;
  }
}
