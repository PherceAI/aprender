import {NextResponse, type NextRequest} from 'next/server';
import {sesionDeRequest} from '@/lib/auth/cookies';
import {leerArchivo} from '@/lib/pagos';

export const dynamic = 'force-dynamic';

// El QR de Deuna lo ve cualquier usuario con sesión (está en la pantalla de pago);
// las fotos de comprobantes, solo el administrador.
export async function GET(req: NextRequest, {params}: {params: Promise<{archivo: string}>}) {
  const s = sesionDeRequest(req);
  const nombre = (await params).archivo;
  if (!s) return NextResponse.json({error: 'Inicia sesión'}, {status: 401});
  if (!nombre.startsWith('qr-') && s.rol !== 'admin') return NextResponse.json({error: 'Solo el administrador'}, {status: 403});
  const a = await leerArchivo(nombre);
  if (!a) return NextResponse.json({error: 'No encontrado'}, {status: 404});
  return new NextResponse(new Uint8Array(a.datos), {headers: {'Content-Type': a.tipo, 'Cache-Control': 'private, max-age=600'}});
}
