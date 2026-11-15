import {createReadStream} from 'node:fs';
import {Readable} from 'node:stream';
import {NextResponse, type NextRequest} from 'next/server';
import {sesionDeRequest} from '@/lib/auth/cookies';
import {archivoVideo, rango} from '@/lib/videos';

export const dynamic = 'force-dynamic';

// Sirve los videos de las lecciones solo a usuarios con sesión, con soporte de Range
// (el teléfono pide trozos para poder adelantar sin descargar todo).
export async function GET(req: NextRequest, {params}: {params: Promise<{archivo: string}>}) {
  if (!sesionDeRequest(req)) return NextResponse.json({error: 'Inicia sesión'}, {status: 401});
  const v = await archivoVideo((await params).archivo);
  if (!v) return NextResponse.json({error: 'No encontrado'}, {status: 404});

  const r = rango(req.headers.get('range'), v.tamano);
  const comun = {'Content-Type': v.tipo, 'Accept-Ranges': 'bytes', 'Cache-Control': 'private, max-age=3600'};
  if (req.headers.get('range') && !r) {
    return new NextResponse(null, {status: 416, headers: {'Content-Range': `bytes */${v.tamano}`}});
  }
  if (!r) {
    const cuerpo = Readable.toWeb(createReadStream(v.ruta)) as ReadableStream;
    return new NextResponse(cuerpo, {status: 200, headers: {...comun, 'Content-Length': String(v.tamano)}});
  }
  const cuerpo = Readable.toWeb(createReadStream(v.ruta, {start: r.inicio, end: r.fin})) as ReadableStream;
  return new NextResponse(cuerpo, {
    status: 206,
    headers: {...comun, 'Content-Length': String(r.fin - r.inicio + 1), 'Content-Range': `bytes ${r.inicio}-${r.fin}/${v.tamano}`},
  });
}
