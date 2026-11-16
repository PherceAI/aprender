import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowLeft, Check, CheckCircle2, Circle, FileText, Lock, Play, Target, Trophy} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {temaDetalle} from '@/lib/curso';
import {leccionesGratis, planDe} from '@/lib/acceso';
import {enlaceFicha, paginaDeTema} from '@/lib/ficha';
import {ErrorAcademia} from '@/lib/intentos';
import {Anillo, btn} from '@/components/ui';
import {BotonIniciar} from '@/components/boton-iniciar';

export const metadata: Metadata = {title: 'Tema'};

// Un tema se estudia en orden: 1) las lecciones, 2) la prueba del tema, 3) queda dominado.
// Una sola acción principal por vez; lo demás es secundario.

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
  const todas = hechas === t.lecciones.length;
  const siguiente = t.lecciones.find((l) => !l.completada) ?? t.lecciones[0];
  const siguienteIdx = t.lecciones.indexOf(siguiente);
  const dominado = t.estado === 'dominado';
  const pag = paginaDeTema(t.id);
  const paso = dominado ? 3 : todas ? 2 : 1;

  return (
    <div className="rise mx-auto flex max-w-[880px] flex-col gap-6">
      <Link href="/curso" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-3 hover:text-ink">
        <ArrowLeft size={16} /> Mi ruta
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-ink-3">{t.unidadNombre}</p>
          <h1 className="mt-1 text-[30px] leading-tight font-semibold tracking-[-0.04em] text-ink sm:text-[36px]">{t.nombre}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13.5px] text-ink-2">
            <span>
              {t.lecciones.length} {t.lecciones.length === 1 ? 'lección' : 'lecciones'}
            </span>
            {pag && (
              <a href={enlaceFicha(pag)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-accent-ink hover:underline">
                <FileText size={15} /> Ver en la ficha oficial, pág. {pag}
              </a>
            )}
          </div>
        </div>
        {t.abierto && (
          <div className="flex items-center gap-3">
            <Anillo valor={t.nivel} tam={84} grosor={8} etiqueta="Tu nivel en el tema" />
            <p className="max-w-[12ch] text-[13px] leading-snug text-ink-3">Tu nivel en este tema</p>
          </div>
        )}
      </div>

      {!t.abierto ? (
        <section className="card p-5 sm:p-7">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-surface-2 text-ink-3">
              <Lock size={22} />
            </span>
            <div>
              <h2 className="text-[18px] font-semibold text-ink">Este tema se abre pronto</h2>
              <p className="mt-1 text-[15px] leading-relaxed text-ink-2">El docente experto está revisando sus lecciones. Mientras tanto, esto es lo que vas a aprender:</p>
            </div>
          </div>
          <ol className="mt-5 flex flex-col gap-2">
            {t.lecciones.map((l, i) => (
              <li key={l.id} className="rounded-[12px] bg-surface-2 px-4 py-3">
                <p className="text-[15px] font-semibold text-ink">
                  {i + 1}. {l.titulo}
                </p>
                <p className="mt-0.5 text-[13.5px] text-ink-2">{l.objetivo}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <>
          {/* Paso 1: lecciones */}
          <section className={`card p-5 sm:p-7 ${paso === 1 ? 'border-2 border-accent' : ''}`}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-3 text-[18px] font-semibold text-ink">
                <PasoNum n={1} hecho={paso > 1} /> Aprende con las lecciones
              </h2>
              <span className="num text-[13.5px] font-semibold text-ink-2">
                {hechas} de {t.lecciones.length}
              </span>
            </div>

            {t.video && (
              <div className="mt-5 overflow-hidden rounded-[16px] border border-line">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video src={t.video.url} controls playsInline preload="metadata" className="aspect-video w-full bg-black" title={t.video.titulo} />
              </div>
            )}

            <ol className="mt-4 flex flex-col gap-1">
              {t.lecciones.map((l, i) => {
                const lock = bloqueada(l.id);
                return (
                  <li key={l.id}>
                    <Link href={`/leccion/${l.id}`} className="flex items-start gap-3 rounded-[12px] px-3 py-3 hover:bg-surface-2">
                      <span className="mt-0.5 shrink-0">
                        {lock ? <Lock size={20} className="text-ink-3" /> : l.completada ? <CheckCircle2 size={21} className="text-ok" /> : <Circle size={21} className="text-ink-3" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15.5px] font-semibold text-ink">
                          Lección {i + 1}. {l.titulo}
                        </span>
                        <span className="mt-0.5 block text-[13.5px] leading-snug text-ink-2">{l.objetivo}</span>
                      </span>
                      {lock ? (
                        <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-[11.5px] font-semibold text-accent-ink">Acceso completo</span>
                      ) : (
                        <span className="num shrink-0 text-[12.5px] text-ink-3">{l.minutos} min</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ol>

            {!todas && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <Link href={`/leccion/${siguiente.id}`} className={`${btn.primary} rounded-full px-6`}>
                  <Play size={16} fill="currentColor" /> {hechas ? `Seguir con la lección ${siguienteIdx + 1}` : 'Empezar la lección 1'}
                </Link>
                {t.estado !== 'dominado' && (
                  <BotonIniciar tipo="diagnostico-tema" referencia={t.id} texto="¿Ya lo sabes? Responde 3 preguntas" variante="secondary" className="!h-11 !rounded-full !border-0 !bg-transparent !px-2 !text-[14px] !font-semibold !text-accent-ink" />
                )}
              </div>
            )}
          </section>

          {/* Paso 2: prueba del tema */}
          <section className={`card p-5 sm:p-7 ${paso === 2 ? 'border-2 border-accent' : ''}`}>
            <h2 className="flex items-center gap-3 text-[18px] font-semibold text-ink">
              <PasoNum n={2} hecho={paso > 2} /> Haz la prueba del tema
            </h2>
            <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-ink-2">10 preguntas en los formatos del Ineval, con la explicación de cada una al final. Con 80 % el tema queda dominado.</p>
            <div className="mt-4">
              {plan === 'gratis' ? (
                <Link href="/acceso" className={`${btn.secondary} rounded-full px-5`}>
                  <Lock size={16} /> Parte del acceso completo
                </Link>
              ) : todas || dominado ? (
                <BotonIniciar tipo="prueba-tema" referencia={t.id} texto={dominado ? 'Volver a hacer la prueba' : 'Hacer la prueba'} variante={paso === 2 ? 'primary' : 'secondary'} className="!rounded-full px-6" />
              ) : (
                <p className="flex items-center gap-2 text-[14px] text-ink-3">
                  <Target size={16} /> Se recomienda al terminar las lecciones.
                </p>
              )}
            </div>
          </section>

          {/* Paso 3: dominado */}
          <section className={`card p-5 sm:p-7 ${dominado ? 'border-2 border-ok bg-ok-soft' : ''}`}>
            <h2 className="flex items-center gap-3 text-[18px] font-semibold text-ink">
              <PasoNum n={3} hecho={dominado} /> Tema dominado
            </h2>
            <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-ink-2">
              {dominado ? (
                <span className="inline-flex items-center gap-2 font-semibold text-ok">
                  <Trophy size={17} /> ¡Lo dominas! Tu preparación ya lo cuenta. Lo que falles después vuelve en tu repaso.
                </span>
              ) : (
                'Al dominarlo sube tu preparación y pasas al siguiente tema de tu ruta.'
              )}
            </p>
          </section>
        </>
      )}
    </div>
  );
}

function PasoNum({n, hecho}: {n: number; hecho: boolean}) {
  return (
    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[14px] font-bold ${hecho ? 'bg-ok text-white' : 'bg-accent text-white'}`}>
      {hecho ? <Check size={16} strokeWidth={3} /> : n}
    </span>
  );
}
