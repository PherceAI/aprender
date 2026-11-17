import {NextResponse, type NextRequest} from 'next/server';
import {claveValida, COOKIE_REVISION} from '@/lib/revision';

// /revision?clave=...  activa el modo revisión en este navegador (30 días) y lleva a la portada.
// /revision?salir=1    lo desactiva. Sin REVISION_CLAVE configurada, el enlace no hace nada.

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const inicio = new URL('/', url);
  if (url.searchParams.get('salir')) {
    const r = NextResponse.redirect(inicio);
    r.cookies.delete(COOKIE_REVISION);
    return r;
  }
  const clave = url.searchParams.get('clave');
  if (!claveValida(clave)) return new NextResponse('Enlace no válido', {status: 404});
  const r = NextResponse.redirect(inicio);
  r.cookies.set(COOKIE_REVISION, clave!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return r;
}
