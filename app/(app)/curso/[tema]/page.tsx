import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowLeft, CheckCircle2, Circle, Clapperboard, Lock, PlayCircle, Target} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {temaDetalle} from '@/lib/curso';
import {leccionesGratis, planDe} from '@/lib/acceso';
import {ErrorAcademia} from '@/lib/intentos';
import {Anillo, EtiquetaEstado, btn} from '@/components/ui';
import {BotonIniciar} from '@/components/boton-iniciar';

export const metadata: Metadata = {title: 'Tema'};

export default async function Tema({params}: {params: Promise<{tema: string}>}) {
  const {tema} = await params;
  const u = await requerirDocente();
  const db = await getDb();
  let t;
  try {
    t = await temaDetalle(db, u.id, tema);
  } catch (e) {
    if (e instanceof ErrorAcademia) notFound();
    throw e;
  }
  const [plan, gratis] = await Promise.all([planDe(db, u.id), leccionesGratis(db)]);
  const bloqueada = (id: string) => plan === 'gratis' && !gratis.has(id);
  const hechas = t.lecciones.filter((l) => l.completada).length;
  const siguiente = t.lecciones.find((l) => !l.completada) ?? t.lecciones[0];

  return (
    <div className="rise">
      <Link href="/curso" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-3 hover:text-ink">
        <ArrowLeft size={16} /> Curso
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-5">
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-ink-3">{t.unidadNombre}</p>
          <h1 className="mt-1 text-[30px] leading-tight font-medium tracking-[-0.04em] text-ink sm:text-[36px]">{t.nombre}</h1>
          <div className="mt-3 flex items-center gap-2.5">
            {t.abierto ? <EtiquetaEstado estado={t.estado} /> : <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-surface px-2.5 text-[12px] font-semibold text-ink-3"><Lock size={12} /> Próximamente</span>}
            <span className="text-[13.5px] text-ink-3">{t.lecciones.length} lecciones</span>
          </div>
        </div>
        {t.abierto && <Anillo valor={t.nivel} tam={92} grosor={9} etiqueta="Dominio del tema" />}
      </div>

      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-6">
          {/* Video del tema (NotebookLM) */}
          <section className="card overflow-hidden">
            {t.video ? (
              /* eslint-disable-next-line jsx-a11y/media-has-caption */
              <video src={t.video.url} controls playsInline preload="metadata" className="aspect-video w-full bg-black" title={t.video.titulo} />
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-surface-2 px-6 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-surface text-ink-3 shadow-card">
                  <Clapperboard size={24} />
                </span>
                <p className="text-[16px] font-semibold text-ink">{t.abierto ? 'Aquí va el video del tema' : 'Este tema se abre pronto'}</p>
                <p className="max-w-[44ch] text-[14px] text-ink-3">
                  {t.abierto ? 'Un resumen en video de 5 a 8 minutos. Lo sube la administración desde su panel.' : 'Ya puedes ver lo que vas a aprender. Las lecciones se abren cuando el docente experto termine de revisarlas.'}
                </p>
              </div>
            )}
          </section>

          <section className="card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-ink">Lecciones</h2>
              {t.abierto && <span className="num text-[13.5px] font-semibold text-ink-3">{hechas}/{t.lecciones.length}</span>}
            </div>
            <ol className="mt-3 flex flex-col">
              {t.lecciones.map((l, i) => {
                const contenido = (
                  <>
                    <span className="mt-0.5 shrink-0">
                      {!t.abierto || bloqueada(l.id) ? <Lock size={20} className="text-ink-3" /> : l.completada ? <CheckCircle2 size={21} className="text-accent-ink" /> : <Circle size={21} className="text-ink-3" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15.5px] font-semibold text-ink">
                        {i + 1}. {l.titulo}
                      </span>
                      <span className="mt-0.5 block text-[13.5px] leading-snug text-ink-3">{l.objetivo}</span>
                    </span>
                    {t.abierto && (bloqueada(l.id) ? <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-[11.5px] font-semibold text-accent-ink">Acceso completo</span> : <span className="num shrink-0 text-[12.5px] text-ink-3">{l.minutos} min</span>)}
                  </>
                );
                return (
                  <li key={l.id}>
                    {t.abierto ? (
                      <Link href={`/leccion/${l.id}`} className="flex gap-3 rounded-ctl px-2 py-3 hover:bg-surface-2">
                        {contenido}
                      </Link>
                    ) : (
                      <div className="flex gap-3 px-2 py-3">{contenido}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        {t.abierto && (
          <div className="flex flex-col gap-4">
            <section className="card p-5">
              <h2 className="text-[16px] font-semibold text-ink">{hechas ? 'Sigue donde quedaste' : 'Empieza aquí'}</h2>
              <p className="mt-1 text-[14px] text-ink-3">{siguiente.titulo}</p>
              <Link href={`/leccion/${siguiente.id}`} className={`${btn.primary} mt-4 w-full`}>
                <PlayCircle size={18} /> {hechas ? 'Continuar' : 'Empezar la lección 1'}
              </Link>
            </section>
            {t.estado !== 'dominado' && (
              <section className="card p-5">
                <h2 className="text-[16px] font-semibold text-ink">¿Ya lo sabes?</h2>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-3">3 preguntas rápidas. Con 80 % o más puedes saltar el tema.</p>
                <BotonIniciar tipo="diagnostico-tema" referencia={t.id} texto="Probar lo que sé" variante="secondary" className="mt-4 w-full" />
              </section>
            )}
            <section className="card p-5">
              <h2 className="flex items-center gap-2 text-[16px] font-semibold text-ink">
                <Target size={18} className="text-accent-ink" /> Prueba del tema
              </h2>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-3">10 preguntas en los formatos del Ineval. Con 80 % el tema queda dominado.</p>
              <BotonIniciar tipo="prueba-tema" referencia={t.id} texto="Hacer la prueba" variante="secondary" className="mt-4 w-full" />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
