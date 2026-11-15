import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import type {NextRequest} from 'next/server';
import {getDb} from '../db';
import {usuarioPorId, type UsuarioPublico} from '../usuarios';
import {COOKIE_SESION, DURACION_SEG, firmarToken, leerToken, type Sesion} from './sesion';

// La sesión en la cookie, para server components, server actions y rutas de la API.

export async function iniciarSesion(s: Sesion) {
  (await cookies()).set(COOKIE_SESION, firmarToken(s), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: DURACION_SEG[s.rol],
  });
}

export async function cerrarSesion() {
  (await cookies()).delete(COOKIE_SESION);
}

export async function sesionActual(): Promise<Sesion | null> {
  return leerToken((await cookies()).get(COOKIE_SESION)?.value);
}

export function sesionDeRequest(req: NextRequest): Sesion | null {
  return leerToken(req.cookies.get(COOKIE_SESION)?.value);
}

/** El usuario conectado (cualquier rol), o al inicio de sesión. */
export async function requerirUsuario(): Promise<UsuarioPublico> {
  const s = await sesionActual();
  if (!s) redirect('/ingresar');
  const u = await usuarioPorId(await getDb(), s.uid);
  if (!u) redirect('/ingresar');
  return u;
}

/** Un docente con su especialidad elegida (si no la eligió, a la bienvenida; el admin, a su panel). */
export async function requerirDocente(): Promise<UsuarioPublico & {especialidadId: string}> {
  const u = await requerirUsuario();
  if (u.rol === 'admin') redirect('/admin');
  if (!u.especialidadId) redirect('/bienvenida');
  return u as UsuarioPublico & {especialidadId: string};
}

export async function requerirAdmin(): Promise<UsuarioPublico> {
  const u = await requerirUsuario();
  if (u.rol !== 'admin') redirect('/inicio');
  return u;
}
