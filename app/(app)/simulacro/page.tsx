import type {Metadata} from 'next';
import Link from 'next/link';
import {Clock, ListChecks, Lock, Timer} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {perfilDe} from '@/lib/perfil';
import {planDe, simulacroGratisDisponible} from '@/lib/acceso';
import {SIMULACRO_CORTO} from '@/lib/intentos';
import {ILUSTRACION} from '@/lib/visual';
import {BotonIniciar} from '@/components/boton-iniciar';

export const metadata: Metadata = {title: 'Simulacros'};

// Simulacros: medirse con el tiempo y los formatos del examen. El corto es para practicar seguido.

const COMPLETOS = [
  {nombre: 'Conocimientos generales', preguntas: 39, minutos: 45},
  {nombre: 'Ciencias Naturales', preguntas: 60, minutos: 120},
];

function fecha(d: Date) {
  return new Intl.DateTimeFormat('es-EC', {day: 'numeric', month: 'short', timeZone: 'America/Guayaquil'}).format(d);
}

export default async function Simulacros() {
  const u = await requerirDocente();
  const db = await getDb();
  const [p, plan, gratisDisponible] = await Promise.all([perfilDe(db, u.id), planDe(db, u.id), simulacroGratisDisponible(db, u.id)]);
  const ultimos = p.simulacros.slice(-8);

  return (
    <div className="rise flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-ink sm:text-[34px]">Simulacros</h1>
        <p className="mt-1.5 max-w-[60ch] text-[16px] text-ink-2">Mídete como en el examen real: con reloj, 4 opciones por pregunta y la corrección explicada al final.</p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(125deg,#d9300a_0%,#ec4416_60%,#f25d2a_100%)] p-6 text-white sm:p-8">
          <span aria-hidden className="pointer-events-none absolute -top-20 right-24 h-60 w-60 rounded-full bg-white/10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ILUSTRACION.reloj} alt="" aria-hidden className="pointer-events-none absolute top-1/2 right-6 hidden w-[150px] -translate-y-1/2 drop-shadow-[0_18px_30px_rgba(0,0,0,0.25)] sm:block" />
          <div className="relative sm:max-w-[64%]">
            <p className="flex items-center gap-2 text-[14px] font-medium text-white/90">
              <Timer size={16} /> Para practicar seguido
            </p>
            <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.03em]">Simulacro corto</h2>
            <div className="mt-4 flex flex-wrap gap-2 text-[14px] font-medium">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
                <ListChecks size={16} /> {SIMULACRO_CORTO.preguntas} preguntas mezcladas
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
                <Clock size={16} /> {SIMULACRO_CORTO.minutos} minutos
              </span>
            </div>
            <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-white/90">Mezcla temas de las dos pruebas, como el examen. Si se acaba el tiempo, se entrega solo con lo que respondiste.</p>
            <div className="mt-6">
              {!gratisDisponible ? (
                <Link href="/acceso" className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-[#b8300a]">
                  <Lock size={16} /> Desbloquear los simulacros
                </Link>
              ) : (
                <BotonIniciar tipo="simulacro" texto={plan === 'gratis' ? 'Hacer mi simulacro gratis' : 'Empezar el simulacro'} className="!rounded-full !bg-white !text-[#b8300a]" />
              )}
              {plan === 'gratis' && gratisDisponible && <p className="mt-3 text-[13.5px] text-white">Con tu cuenta gratis puedes hacer un simulacro para conocerlo.</p>}
            </div>
          </div>
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="text-[18px] font-semibold text-ink">Simulacros completos</h2>
          <p className="mt-1 text-[14px] text-ink-2">Con el mismo número de preguntas y tiempo del examen. Se abren cuando el banco de preguntas esté completo.</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {COMPLETOS.map((c) => (
              <li key={c.nombre} className="flex items-center gap-3 rounded-[14px] bg-surface-2 px-4 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium text-ink">{c.nombre}</p>
                  <p className="text-[13px] text-ink-2">
                    {c.preguntas} preguntas · {c.minutos} minutos
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-[12px] font-semibold text-ink-2">Muy pronto</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
        {[
          ['99', 'preguntas en el examen real'],
          ['165', 'minutos en total'],
          ['4', 'opciones, una correcta'],
          ['5', 'formatos de pregunta'],
        ].map(([n, t]) => (
          <div key={t} className="card p-4">
            <p className="text-[24px] leading-none font-semibold tracking-[-0.03em] text-accent">{n}</p>
            <p className="mt-1.5 text-[13px] leading-snug text-ink-2">{t}</p>
          </div>
        ))}
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="text-[18px] font-semibold text-ink">Tus simulacros</h2>
        {ultimos.length === 0 ? (
          <p className="mt-2 text-[15px] text-ink-2">Cuando hagas el primero, aquí verás cómo vas subiendo de un simulacro al siguiente.</p>
        ) : (
          <div className="mt-5 flex h-44 items-end gap-2 pb-1">
            {ultimos.map((s) => (
              <div key={s.id} className="flex min-w-0 max-w-16 flex-1 flex-col items-center gap-1.5">
                <span className="text-[12.5px] font-semibold text-ink">{s.puntaje} %</span>
                <div className={`w-full rounded-t-[8px] ${s.puntaje >= 80 ? 'bg-ok' : 'bg-accent'}`} style={{height: `${Math.max(6, s.puntaje * 1.1)}px`}} />
                <span className="text-[11.5px] text-ink-2">{fecha(s.fecha)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
