import {NextResponse, type NextRequest} from 'next/server';

// La dirección vieja (aprender.…) lleva a la nueva (pragma.…) con la misma ruta, para no romper enlaces compartidos.
const VIEJO = 'aprender.automationpherce.cloud';
const NUEVO = 'pragma.automationpherce.cloud';

export function middleware(req: NextRequest) {
  const host = (req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '').split(':')[0];
  if (host !== VIEJO) return NextResponse.next();
  const {pathname, search} = req.nextUrl;
  return NextResponse.redirect(`https://${NUEVO}${pathname}${search}`, 308);
}

export const config = {matcher: '/:path*'};
