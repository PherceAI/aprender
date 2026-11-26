import type {Metadata} from 'next';
import Link from 'next/link';
import {and, eq, lte, sql} from 'drizzle-orm';
import {CalendarClock, CheckCircle2, Lightbulb} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {preguntas, repaso, temas} from '@/lib/db/schema';
import {contarPendientes, MAX_REPASO_DIA} from '@/lib/repaso';
import {hoyEc} from '@/lib/util';
import {ILUSTRACION} from '@/lib/visual';
import {BotonIniciar} from '@/components/boton-iniciar';

export const metadata: Metadata = {title: 'Repaso'};

// Repaso: lo que falló vuelve en el momento justo, con su explicación, hasta que lo domina.

const DIAS = ['Mañana', '3 días', '7 días', '14 días', '30 días'];

export default async function Repaso() {
  const u = await requerirDocente();
  const db = await getDb();
  const ahora = new Date();
  const [pendientes, porTema] = await Promise.all([
    contarPendientes(db, u.id, ahora),
    db
      .select({tema: temas.nombre, n: sql<number>`count(*)`.mapWith(Number)})
      .from(repaso)
      .innerJoin(preguntas, eq(preguntas.id, repaso.preguntaId))
      .innerJoin(temas, eq(temas.id, preguntas.temaId))
      .where(and(eq(repaso.usuarioId, u.id), lte(repaso.proxima, hoyEc(ahora))))
      .groupBy(temas.nombre)
      .orderBy(sql`count(*) desc`),
  ]);
  const hoy = Math.min(pendientes, MAX_REPASO_DIA);

  return (
    <div className="rise flex flex-col gap-5">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-ink sm:text-[34px]">Repaso</h1>
        <p className="mt-1 max-w-[62ch] text-[15.5px] text-ink-2">Las preguntas que fallaste vuelven aquí, con su explicación, hasta que las domines.</p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {hoy ? (
          <section className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(125deg,#d9300a_0%,#ec4416_60%,#f25d2a_100%)] p-6 text-white sm:p-8">
            <span aria-hidden className="pointer-events-none absolute -top-20 right-24 h-60 w-60 rounded-full bg-white/10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ILUSTRACION.repaso} alt="" aria-hidden className="pointer-events-none absolute top-1/2 right-6 hidden w-[150px] -translate-y-1/2 drop-shadow-[0_18px_30px_rgba(0,0,0,0.25)] sm:block" />
            <div className="relative sm:max-w-[62%]">
              <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-[13px] font-semibold">Para hoy</span>
              <p className="mt-3 text-[30px] leading-tight font-semibold tracking-[-0.03em]">
                {hoy} {hoy === 1 ? 'pregunta' : 'preguntas'} por repasar
              </p>
              <p className="mt-1 text-[15px] text-white/90">Unos {Math.max(2, Math.round(hoy * 0.7))} minutos. Ves la explicación apenas respondes.</p>
              <div className="mt-5">
                <BotonIniciar tipo="repaso" texto="Empezar repaso" className="!rounded-full !bg-white !text-[#b8300a]" />
              </div>
            </div>
          </section>
        ) : (
          <section className="card flex items-center gap-5 p-6 sm:p-8">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-ok-soft text-ok">
              <CheckCircle2 size={30} />
            </span>
            <div>
              <p className="text-[20px] font-semibold text-ink">Nada pendiente por hoy</p>
              <p className="mt-1 text-[15px] text-ink-2">Cuando falles una pregunta en una práctica o una prueba, vuelve aquí desde mañana.</p>
              <Link href="/inicio#ruta" className="mt-4 inline-flex h-11 items-center rounded-full bg-accent px-5 text-[14.5px] font-semibold text-white">
                Ir a mi ruta
              </Link>
            </div>
          </section>
        )}

        <section className="card p-5 sm:p-6">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">De qué temas son</h2>
          {porTema.length ? (
            <ul className="mt-3 flex flex-col gap-2.5">
              {porTema.slice(0, 6).map((t) => (
                <li key={t.tema} className="flex items-center gap-3">
                  <span className="min-w-0 flex-1 truncate text-[14.5px] text-ink">{t.tema}</span>
                  <span className="h-2 w-24 overflow-hidden rounded-full bg-line-2">
                    <span className="block h-full rounded-full bg-accent" style={{width: `${Math.min(100, (t.n / porTema[0].n) * 100)}%`}} />
                  </span>
                  <span className="w-6 shrink-0 text-right text-[13.5px] font-semibold text-ink">{t.n}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[14.5px] text-ink-2">Aquí verás de qué temas son las preguntas que te tocan repasar.</p>
          )}
        </section>
      </div>

      <section className="card p-5 sm:p-7">
        <h2 className="flex items-center gap-2.5 text-[18px] font-semibold text-ink">
          <CalendarClock size={20} className="text-accent" /> Cómo funciona el repaso
        </h2>
        <p className="mt-2 max-w-[66ch] text-[15px] leading-relaxed text-ink-2">
          Cada vez que aciertas una pregunta del repaso, vuelve más tarde. Si la fallas, vuelve mañana. Así lo difícil se queda en tu memoria para el día del examen.
        </p>
        <ol className="mt-6 grid grid-cols-[repeat(5,minmax(0,1fr))] gap-1">
          {DIAS.map((d, i) => (
            <li key={d} className="relative flex flex-col items-center gap-2 text-center">
              {i > 0 && <span aria-hidden className="absolute top-[18px] right-1/2 z-0 h-1 w-full rounded-full bg-[linear-gradient(90deg,#ffd2bf,#ff9b74)]" />}
              <span className={`relative z-10 grid h-10 w-10 place-items-center rounded-full text-[14px] font-bold ring-4 ring-surface ${i === DIAS.length - 1 ? 'bg-ok text-white' : 'bg-accent text-white'}`}>{i + 1}</span>
              <span className="text-[12.5px] leading-tight font-medium text-ink-2">{d}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 flex items-start gap-2 rounded-[14px] bg-accent-soft p-3.5 text-[14px] text-ink">
          <Lightbulb size={18} className="mt-0.5 shrink-0 text-accent" /> Lo mejor es repasar un poco cada día: 5 a 10 minutos bastan.
        </p>
      </section>
    </div>
  );
}
