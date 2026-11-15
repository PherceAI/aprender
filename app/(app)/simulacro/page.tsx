import type {Metadata} from 'next';
import {Clock, ListChecks, Lock} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {perfilDe} from '@/lib/perfil';
import {SIMULACRO_CORTO} from '@/lib/intentos';
import {BotonIniciar} from '@/components/boton-iniciar';

export const metadata: Metadata = {title: 'Simulacro'};

const COMPLETOS = [
  {nombre: 'Conocimientos generales', preguntas: 39, minutos: 45},
  {nombre: 'Ciencias Naturales', preguntas: 60, minutos: 120},
];

function fecha(d: Date) {
  return new Intl.DateTimeFormat('es-EC', {day: 'numeric', month: 'short', timeZone: 'America/Guayaquil'}).format(d);
}

export default async function Simulacro() {
  const u = await requerirDocente();
  const p = await perfilDe(await getDb(), u.id);
  const max = Math.max(100, ...p.simulacros.map((s) => s.puntaje));

  return (
    <div className="rise">
      <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-ink sm:text-[36px]">Simulacro</h1>
      <p className="mt-1.5 max-w-[60ch] text-[15.5px] text-ink-2">Practica con reloj y en el formato del examen real: 4 opciones, una correcta, y la corrección al final.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-card bg-destacado p-6 text-on-destacado shadow-float sm:p-7">
          <p className="text-[14px] font-semibold opacity-70">Para practicar a diario</p>
          <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.025em]">Simulacro corto</h2>
          <div className="mt-4 flex flex-wrap gap-2.5 text-[14px] font-medium">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-on-destacado/10 px-3 py-1.5">
              <ListChecks size={16} /> {SIMULACRO_CORTO.preguntas} preguntas mezcladas
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-on-destacado/10 px-3 py-1.5">
              <Clock size={16} /> {SIMULACRO_CORTO.minutos} minutos
            </span>
          </div>
          <p className="mt-4 max-w-[48ch] text-[14.5px] leading-relaxed opacity-80">Mezcla temas de los dos bloques, como el examen. Si se acaba el tiempo, se entrega solo con lo que respondiste.</p>
          <div className="mt-6">
            <BotonIniciar tipo="simulacro" texto="Empezar" className="!bg-boton-destacado !text-on-boton-destacado" />
          </div>
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="text-[17px] font-semibold text-ink">Simulacros completos</h2>
          <p className="mt-1 text-[14px] text-ink-3">Iguales al examen. Se abren cuando el banco de preguntas esté completo.</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {COMPLETOS.map((c) => (
              <li key={c.nombre} className="flex items-center gap-3 rounded-ctl bg-surface-2 px-3.5 py-3">
                <Lock size={16} className="shrink-0 text-ink-3" />
                <span className="min-w-0 flex-1 text-[15px] font-medium text-ink">{c.nombre}</span>
                <span className="num shrink-0 text-[13px] text-ink-3">
                  {c.preguntas} · {c.minutos} min
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card mt-6 p-5 sm:p-6">
        <h2 className="text-[17px] font-semibold text-ink">Tus simulacros</h2>
        {p.simulacros.length === 0 ? (
          <p className="mt-2 text-[14.5px] text-ink-3">Cuando hagas el primero, aquí verás cómo vas subiendo.</p>
        ) : (
          <div className="mt-5 flex h-40 items-end gap-3 overflow-x-auto pb-1">
            {p.simulacros.map((s) => (
              <div key={s.id} className="flex w-12 shrink-0 flex-col items-center gap-1.5">
                <span className="num text-[12.5px] font-semibold text-ink-2">{s.puntaje}</span>
                <div className="w-full rounded-t-[8px]" style={{height: `${Math.max(6, (s.puntaje / max) * 110)}px`, background: 'var(--anillo)'}} />
                <span className="text-[11.5px] text-ink-3">{fecha(s.fecha)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
