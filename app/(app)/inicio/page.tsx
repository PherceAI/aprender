import type {Metadata} from 'next';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {ArrowRight, BookCheck, Flame, ListChecks, Lock, Play, Repeat, Target, Timer, type LucideIcon} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {hoyDe, rutaDe} from '@/lib/ruta';
import {perfilDe} from '@/lib/perfil';
import {mapaCurso} from '@/lib/curso';
import {Anillo} from '@/components/ui';
import {BotonIniciar} from '@/components/boton-iniciar';

export const metadata: Metadata = {title: 'Inicio'};

export default async function Inicio() {
  const u = await requerirDocente();
  const db = await getDb();
  const [hoy, ruta, perfil, mapa] = await Promise.all([hoyDe(db, u.id), rutaDe(db, u.id), perfilDe(db, u.id), mapaCurso(db, u.id)]);
  if (hoy.siguiente.tipo === 'diagnostico') redirect('/diagnostico');
  const s = hoy.siguiente;
  const temas = mapa.bloques.flatMap((b) => b.unidades.flatMap((un) => un.temas.map((t) => ({...t, unidad: un.nombre}))));
  const temaActual = s.tipo === 'leccion' || s.tipo === 'prueba-tema' ? temas.find((t) => t.id === s.temaId) : null;
  const avanceTema = temaActual ? Math.round((temaActual.completadas / Math.max(1, temaActual.lecciones)) * 100) : 0;
  const dominados = perfil.temas.filter((t) => t.estado === 'dominado').length;
  const tarjetas = ruta.slice(0, 3).map((r) => temas.find((t) => t.id === r.temaId)!).filter(Boolean);

  const stats: {icono: LucideIcon; valor: string; texto: string}[] = [
    {icono: Target, valor: `${dominados}`, texto: 'temas dominados de 31'},
    {icono: BookCheck, valor: `${perfil.totales.lecciones}`, texto: 'lecciones vistas'},
    {icono: ListChecks, valor: `${perfil.totales.respondidas}`, texto: 'preguntas respondidas'},
    {icono: Flame, valor: `${hoy.racha.dias}`, texto: hoy.racha.dias === 1 ? 'día de racha' : 'días de racha'},
  ];

  return (
    <div className="rise flex flex-col gap-7">
      <div className="border-l-[3px] border-accent pl-4">
        <h1 className="text-[30px] leading-tight font-semibold tracking-[-0.035em] text-ink sm:text-[36px]">
          ¡Hola, <span className="text-accent">{u.nombre.split(' ')[0]}</span>!
        </h1>
        <p className="mt-1 text-[16px] text-ink-2">Continúa con tu preparación y sigue avanzando hacia tu evaluación.</p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
        <section className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(120deg,#f0360a_0%,#c2410c_100%)] p-6 text-white sm:p-8">
          <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -right-20 -bottom-24 h-64 w-64 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-6">
            <div className="hidden h-28 w-28 shrink-0 place-items-center rounded-[20px] bg-white/15 sm:grid">
              <Play size={40} fill="currentColor" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium text-white/80">{s.tipo === 'leccion' ? 'Continúa tu aprendizaje' : s.tipo === 'prueba-tema' ? 'Ya viste las lecciones' : 'Vas al día'}</p>
              <h2 className="mt-1 text-[24px] leading-tight font-semibold tracking-[-0.025em] sm:text-[28px]">
                {s.tipo === 'leccion' ? s.temaNombre : s.tipo === 'prueba-tema' ? `Prueba: ${s.temaNombre}` : 'Repasa o haz un simulacro'}
              </h2>
              <p className="mt-1 text-[15px] text-white/85">
                {s.tipo === 'leccion' ? `Lección ${s.numero} · ${s.titulo}` : s.tipo === 'prueba-tema' ? '10 preguntas. Con 80 % el tema queda dominado.' : 'Los demás temas se abren pronto.'}
              </p>
              {temaActual && (
                <div className="mt-4 flex max-w-[420px] items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/25">
                    <div className="h-full rounded-full bg-white" style={{width: `${avanceTema}%`}} />
                  </div>
                  <span className="num text-[14px] font-semibold">{avanceTema}%</span>
                </div>
              )}
              <div className="mt-5">
                {s.tipo === 'leccion' ? (
                  <Link href={`/leccion/${s.leccionId}`} className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-[#d42d06] transition-transform active:translate-y-px">
                    <Play size={16} fill="currentColor" /> Continuar clase
                  </Link>
                ) : s.tipo === 'prueba-tema' ? (
                  <BotonIniciar tipo="prueba-tema" referencia={s.temaId} texto="Hacer la prueba" className="!rounded-full !bg-white !text-[#d42d06]" />
                ) : (
                  <Link href="/simulacro" className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-[#d42d06]">
                    Ir al simulacro <ArrowRight size={18} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Tu progreso general</h2>
          <div className="mt-5 flex items-center gap-6">
            <Anillo valor={hoy.preparacion} tam={124} grosor={12} etiqueta="Preparación" />
            <ul className="flex min-w-0 flex-col gap-3">
              {stats.map((x) => (
                <li key={x.texto} className="flex items-center gap-2.5 text-[14px] text-ink-2">
                  <x.icono size={18} className="shrink-0 text-accent" />
                  <span className="num font-semibold text-ink">{x.valor}</span>
                  <span className="truncate">{x.texto}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-[13px] text-ink-3">El anillo es tu preparación: el dominio de los 31 temas, pesado como en el examen.</p>
        </section>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[22px] font-semibold tracking-[-0.025em] text-ink">Tu ruta</h2>
            <Link href="/curso" className="inline-flex items-center gap-1 text-[14px] font-semibold text-accent">
              Ver todo <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-3">
            {tarjetas.map((t, i) => {
              const avance = Math.round((t.completadas / Math.max(1, t.lecciones)) * 100);
              return (
                <Link key={t.id} href={`/curso/${t.id}`} className="card overflow-hidden">
                  <div className="relative h-24 bg-[linear-gradient(135deg,#ffb08f_0%,#f0360a_100%)]" style={{opacity: 1 - i * 0.18}}>
                    <span className="absolute -bottom-[18px] left-4 grid h-11 w-11 place-items-center rounded-[12px] bg-surface text-accent shadow-card">
                      {t.abierto ? <BookCheck size={20} /> : <Lock size={18} />}
                    </span>
                  </div>
                  <div className="p-4 pt-7">
                    <p className="truncate text-[15.5px] font-semibold text-ink">{t.nombre}</p>
                    <p className="truncate text-[12.5px] text-ink-3">{t.unidad}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line-2">
                        <div className="h-full rounded-full bg-accent" style={{width: `${t.abierto ? avance : 0}%`}} />
                      </div>
                      <span className="text-[12px] text-ink-3">{t.abierto ? `${avance}%` : 'Pronto'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Para hoy</h2>
          <ul className="mt-3 flex flex-col divide-y divide-line">
            <li className="flex items-center gap-3 py-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent">
                <Repeat size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-semibold text-ink">Repaso de hoy</p>
                <p className="text-[12.5px] text-ink-3">{hoy.repasoPendiente ? `${hoy.repasoPendiente} preguntas que fallaste` : 'Nada pendiente'}</p>
              </div>
              {hoy.repasoPendiente > 0 && <BotonIniciar tipo="repaso" texto="Repasar" variante="secondary" className="!h-9 !px-3 !text-[13px]" />}
            </li>
            <li className="flex items-center gap-3 py-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent">
                <Timer size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-semibold text-ink">Simulacro corto</p>
                <p className="text-[12.5px] text-ink-3">{hoy.ultimoSimulacro ? `Último: ${hoy.ultimoSimulacro.puntaje} %` : '15 preguntas · 20 min'}</p>
              </div>
              <Link href="/simulacro" className="rounded-full bg-accent-soft px-3 py-1.5 text-[12.5px] font-semibold text-accent-ink">
                Ir
              </Link>
            </li>
            <li className="flex items-center gap-3 py-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent">
                <Flame size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-semibold text-ink">{hoy.racha.hoyHecho ? 'Racha al día' : 'Mantén tu racha'}</p>
                <p className="text-[12.5px] text-ink-3">{hoy.racha.hoyHecho ? 'Ya estudiaste hoy. ¡Bien!' : 'Estudia algo hoy para no perderla'}</p>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
