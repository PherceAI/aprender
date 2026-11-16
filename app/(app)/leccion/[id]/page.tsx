import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound, redirect} from 'next/navigation';
import {ArrowLeft, ArrowRight, Clock} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {leccion} from '@/lib/curso';
import {ErrorAcademia} from '@/lib/intentos';
import {historialTutor, tutorDisponible} from '@/lib/tutor';
import {Secciones} from '@/components/leccion/secciones';
import {PanelLeccion} from '@/components/leccion/panel';
import {BotonIniciar} from '@/components/boton-iniciar';
import {CompletarLeccion} from './completar';
import {AccesoCompleto} from '@/components/acceso-completo';

export const metadata: Metadata = {title: 'Lección'};

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
  if (l === 'bloqueada') return <AccesoCompleto volver={{href: '/curso', texto: 'Volver al curso'}} texto="Esta lección es del acceso completo" />;
  const historial = await historialTutor(db, u.id, l.id);
  const despues = l.siguiente ? `/leccion/${l.siguiente.id}` : `/curso/${l.tema.id}`;

  return (
    <div className="rise">
      <Link href={`/curso/${l.tema.id}`} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-3 hover:text-ink">
        <ArrowLeft size={16} /> {l.tema.nombre}
      </Link>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[1fr_360px]">
        <article className="min-w-0">
          <h1 className="text-[28px] leading-tight font-medium tracking-[-0.04em] text-ink sm:text-[34px]">{l.titulo}</h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-ink-3">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={15} /> {l.minutos} min
            </span>
            <span>Objetivo: {l.objetivo}</span>
          </div>

          {l.tema.video && (
            <div className="card mt-6 overflow-hidden">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video src={l.tema.video.url} controls playsInline preload="metadata" className="aspect-video w-full bg-black" title={l.tema.video.titulo} />
            </div>
          )}

          <div className="card mt-6 p-5 sm:p-7">
            <Secciones secciones={l.contenido} />
          </div>

          <section className="mt-6 rounded-card bg-destacado p-5 text-on-destacado sm:p-6">
            <h2 className="text-[19px] font-semibold">Comprueba lo que aprendiste</h2>
            <p className="mt-1 text-[14.5px] opacity-75">3 preguntas de esta lección, con explicación al instante.</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <BotonIniciar tipo="practica" referencia={l.id} texto="Practicar ahora" className="!bg-boton-destacado !text-on-boton-destacado" />
              <CompletarLeccion leccionId={l.id} despues={despues} siguiente={l.siguiente?.titulo ?? null} completada={l.completada} />
            </div>
          </section>

          <div className="mt-6 flex justify-between gap-3">
            {l.anterior ? (
              <Link href={`/leccion/${l.anterior.id}`} className="inline-flex min-w-0 items-center gap-1.5 text-[14px] font-medium text-ink-2 hover:text-ink">
                <ArrowLeft size={16} className="shrink-0" /> <span className="truncate">{l.anterior.titulo}</span>
              </Link>
            ) : (
              <span />
            )}
            {l.siguiente && (
              <Link href={`/leccion/${l.siguiente.id}`} className="inline-flex min-w-0 items-center gap-1.5 text-[14px] font-medium text-ink-2 hover:text-ink">
                <span className="truncate">{l.siguiente.titulo}</span> <ArrowRight size={16} className="shrink-0" />
              </Link>
            )}
          </div>
        </article>

        <aside>
          <PanelLeccion leccionId={l.id} historial={historial} nota={l.nota} tutorActivo={tutorDisponible()} />
        </aside>
      </div>
    </div>
  );
}
