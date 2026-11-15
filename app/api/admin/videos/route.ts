import {NextResponse, type NextRequest} from 'next/server';
import {sesionDeRequest} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {ErrorVideo, guardarVideo} from '@/lib/videos';

export const dynamic = 'force-dynamic';

// Subida de un video al tema: el cuerpo es el archivo tal cual (se guarda en streaming, sin cargarlo en memoria).
// PUT /api/admin/videos?tema=<id>&titulo=<texto>   Content-Type: video/mp4
export async function PUT(req: NextRequest) {
  const s = sesionDeRequest(req);
  if (!s) return NextResponse.json({error: 'Inicia sesión'}, {status: 401});
  if (s.rol !== 'admin') return NextResponse.json({error: 'Solo el administrador sube videos'}, {status: 403});
  const tema = req.nextUrl.searchParams.get('tema');
  if (!tema || !req.body) return NextResponse.json({error: 'Falta el tema o el archivo'}, {status: 400});
  try {
    const url = await guardarVideo(await getDb(), tema, req.body, req.headers.get('content-type') ?? '', req.nextUrl.searchParams.get('titulo') ?? undefined);
    return NextResponse.json({url});
  } catch (e) {
    if (e instanceof ErrorVideo) return NextResponse.json({error: e.message}, {status: e.estado});
    throw e;
  }
}
