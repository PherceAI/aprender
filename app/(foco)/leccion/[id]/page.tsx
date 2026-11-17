import type {Metadata} from 'next';
import {notFound, redirect} from 'next/navigation';
import {and, asc, eq} from 'drizzle-orm';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {preguntas} from '@/lib/db/schema';
import {leccion, temaDetalle} from '@/lib/curso';
import {ErrorAcademia} from '@/lib/intentos';
import {historialTutor, tutorDisponible} from '@/lib/tutor';
import {enlaceFicha, paginaDeTema} from '@/lib/ficha';
import {AccesoCompleto} from '@/components/acceso-completo';
import {ElegirLeccion} from '@/components/elegir-leccion';
import {estadoAcceso} from '@/lib/acceso';
import {Reproductor, type Control} from '@/components/leccion/reproductor';

export const metadata: Metadata = {title: 'Lección'};

// La lección en modo concentración: sin menú, una pantalla a la vez.

export default async function Leccion({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const u = await requerirDocente();
  const db = await getDb();
  let l;
  try {
    l = await leccion(db, u.id, id);
  } catch (e) {
    if (e instanceof ErrorAcademia) notFound();
    throw e;
  }
  if (l === 'tema-cerrado') redirect(`/curso/${id.replace(/-\d+$/, '')}`);
  if (l === 'por-elegir') {
    const [t, acceso] = await Promise.all([temaDetalle(db, u.id, id.replace(/-\d+$/, '')), estadoAcceso(db, u.id)]);
    const info = t.lecciones.find((x) => x.id === id);
    if (!info) notFound();
    return <ElegirLeccion leccion={info} tema={{id: t.id, nombre: t.nombre}} restantes={acceso.restantes} />;
  }
  if (l === 'bloqueada') {
    return (
      <div className="px-4">
        <AccesoCompleto volver={{href: '/curso', texto: 'Volver a mi ruta'}} texto="Esta lección es del acceso completo" />
      </div>
    );
  }

  const [t, historial, simples] = await Promise.all([
    temaDetalle(db, u.id, l.tema.id),
    historialTutor(db, u.id, l.id),
    db
      .select({enunciado: preguntas.enunciado, opciones: preguntas.opciones, correcta: preguntas.correcta, explicaciones: preguntas.explicaciones, usos: preguntas.usos})
      .from(preguntas)
      .where(and(eq(preguntas.leccionId, l.id), eq(preguntas.formato, 'simple'), eq(preguntas.estado, 'aprobada')))
      .orderBy(asc(preguntas.id)),
  ]);
  const elegida = simples.find((p) => p.usos.includes('practica')) ?? simples[0];
  const control: Control | null = elegida
    ? {enunciado: elegida.enunciado, opciones: elegida.opciones as string[], correcta: elegida.correcta, explicaciones: elegida.explicaciones as string[]}
    : null;
  const numero = t.lecciones.findIndex((x) => x.id === l.id) + 1;
  const pagina = paginaDeTema(l.tema.id);

  return (
    <Reproductor
      leccion={{id: l.id, titulo: l.titulo, numero, de: t.lecciones.length, objetivo: l.objetivo, contenido: l.contenido, completada: l.completada}}
      tema={{id: l.tema.id, nombre: l.tema.nombre}}
      siguiente={l.siguiente}
      fichaPagina={pagina ? {pagina, url: enlaceFicha(pagina)} : null}
      control={control}
      nota={l.nota}
      historial={historial}
      tutorActivo={tutorDisponible()}
    />
  );
}
