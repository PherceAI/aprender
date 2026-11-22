import {NextResponse, type NextRequest} from 'next/server';
import {iniciarSesion} from '@/lib/auth/cookies';
import {COOKIE_ESTADO, ingresarConGoogle, perfilDeCodigo} from '@/lib/auth/google';
import {getDb} from '@/lib/db';
import {URL_PUBLICA} from '@/lib/revision';

// Google vuelve aquí con ?code&state. Se revisa el estado, se crea o encuentra la cuenta y se abre la sesión.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const error = (motivo: string) => NextResponse.redirect(new URL(`/ingresar?google=${motivo}`, URL_PUBLICA));
  const estado = req.cookies.get(COOKIE_ESTADO)?.value;
  if (!q.get('code') || !estado || q.get('state') !== estado) return error('cancelado');
  let u;
  try {
    const perfil = await perfilDeCodigo(q.get('code')!, `${URL_PUBLICA}/api/auth/google/callback`);
    u = await ingresarConGoogle(await getDb(), perfil);
  } catch (e) {
    console.error('[google]', e);
    return error('error');
  }
  await iniciarSesion({uid: u.id, rol: u.rol});
  const r = NextResponse.redirect(new URL(u.especialidadId ? '/inicio' : '/bienvenida', URL_PUBLICA));
  r.cookies.delete(COOKIE_ESTADO);
  return r;
}
