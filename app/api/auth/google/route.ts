import {NextResponse} from 'next/server';
import {COOKIE_ESTADO, googleListo, nuevoEstado, urlGoogle} from '@/lib/auth/google';
import {URL_PUBLICA} from '@/lib/revision';

// Lleva al docente a elegir su cuenta de Google.
export async function GET() {
  if (!googleListo()) return NextResponse.redirect(new URL('/ingresar', URL_PUBLICA));
  const estado = nuevoEstado();
  const r = NextResponse.redirect(urlGoogle(estado, `${URL_PUBLICA}/api/auth/google/callback`));
  r.cookies.set(COOKIE_ESTADO, estado, {httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 600});
  return r;
}
