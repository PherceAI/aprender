import type {Metadata} from 'next';
import Link from 'next/link';
import {CalendarClock, CheckCircle2, Repeat} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {contarPendientes, MAX_REPASO_DIA} from '@/lib/repaso';
import {BotonIniciar} from '@/components/boton-iniciar';
import {btn} from '@/components/ui';

export const metadata: Metadata = {title: 'Repaso'};

// Repaso: las preguntas que falló vuelven en el momento justo, hasta que las domina.

const DIAS = ['Mañana', '3 días', '7 días', '14 días', '30 días'];

export default async function Repaso() {
  const u = await requerirDocente();
  const pendientes = await contarPendientes(await getDb(), u.id, new Date());
  const hoy = Math.min(pendientes, MAX_REPASO_DIA);

  return (
    <div className="rise flex flex-col gap-6">
      <div>
        <h1 className="text-[30px] font-semibold tracking-[-0.04em] text-ink sm:text-[36px]">Repaso</h1>
        <p className="mt-1.5 max-w-[60ch] text-[16px] text-ink-2">Las preguntas que fallaste vuelven aquí, con su explicación, hasta que las domines.</p>
      </div>

      <section className={`rounded-[22px] p-6 sm:p-8 ${hoy ? 'bg-[linear-gradient(120deg,#e8360c_0%,#f25a2c_100%)] text-white' : 'card'}`}>
        {hoy ? (
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-[14px] font-semibold text-white/90">
                <Repeat size={16} /> Para hoy
              </p>
              <p className="mt-1 text-[28px] font-semibold tracking-[-0.03em]">
                {hoy} {hoy === 1 ? 'pregunta' : 'preguntas'} por repasar
              </p>
              <p className="mt-1 text-[15px] text-white/90">Unos {Math.max(2, Math.round(hoy * 0.7))} minutos. Ves la explicación apenas respondes.</p>
            </div>
            <BotonIniciar tipo="repaso" texto="Empezar repaso" className="!rounded-full !bg-white !text-[#b8300a]" />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ok-soft text-ok">
              <CheckCircle2 size={24} />
            </span>
            <div>
              <p className="text-[18px] font-semibold text-ink">Nada pendiente por hoy</p>
              <p className="mt-0.5 text-[15px] text-ink-2">Cuando falles una pregunta en una práctica o una prueba, vuelve aquí desde mañana.</p>
            </div>
          </div>
        )}
      </section>

      <section className="card p-5 sm:p-7">
        <h2 className="flex items-center gap-2.5 text-[18px] font-semibold text-ink">
          <CalendarClock size={20} className="text-accent" /> Cómo funciona
        </h2>
        <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-ink-2">
          Cada vez que aciertas una pregunta del repaso, vuelve más tarde. Si la fallas, vuelve mañana. Así lo difícil se queda en tu memoria para el examen.
        </p>
        <ol className="mt-5 grid grid-cols-[repeat(5,minmax(0,1fr))] gap-1">
          {DIAS.map((d, i) => (
            <li key={d} className="relative flex flex-col items-center gap-2 text-center">
              {i > 0 && <span aria-hidden className="absolute top-4 right-1/2 h-0.5 w-full bg-dom-1" />}
              <span className={`num relative grid h-8 w-8 place-items-center rounded-full text-[13px] font-bold ${i === DIAS.length - 1 ? 'bg-accent text-white' : 'bg-dom-1 text-accent-ink'}`}>
                {i + 1}
              </span>
              <span className="text-[12.5px] leading-tight text-ink-2">{d}</span>
            </li>
          ))}
        </ol>
      </section>

      {!hoy && (
        <div>
          <Link href="/curso" className={`${btn.secondary} rounded-full px-5`}>
            Ir a mi ruta
          </Link>
        </div>
      )}
    </div>
  );
}
