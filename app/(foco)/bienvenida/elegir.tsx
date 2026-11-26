'use client';

import {useState, useTransition} from 'react';
import {Atom, BookText, Brain, Briefcase, Calculator, Check, Dna, FlaskConical, Globe, LoaderCircle, School, type LucideIcon} from 'lucide-react';
import {accionElegirEspecialidad} from '@/app/acciones';

const ICONO: Record<string, LucideIcon> = {
  'ccnn-egb-superior': Atom,
  'egb-elemental-media': School,
  'matematica-egb-superior': Calculator,
  'lengua-egb-superior': BookText,
  'estudios-sociales-egb-superior': Globe,
  'biologia-bgu': Dna,
  'quimica-bgu': FlaskConical,
  'filosofia-bgu': Brain,
  'emprendimiento-bgu': Briefcase,
};

type Curso = {id: string; nombre: string; nivel: string; activa: boolean};

/** Los cursos: primero los disponibles y después los que vienen. El nivel siempre se ve, para que cada docente se reconozca. */
export function ElegirEspecialidad({especialidades, actual}: {especialidades: Curso[]; actual: string | null}) {
  const [pendiente, iniciar] = useTransition();
  const [elegido, setElegido] = useState<string | null>(null);
  const disponibles = especialidades.filter((e) => e.activa);
  const proximas = especialidades.filter((e) => !e.activa);
  return (
    <div className="mt-6 flex flex-col gap-6">
      <section>
        <h2 className="mb-2.5 text-[13.5px] font-semibold text-ink-2">Disponibles</h2>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
          {disponibles.map((e) => {
            const Icono = ICONO[e.id] ?? Atom;
            const esActual = e.id === actual;
            return (
              <button
                key={e.id}
                type="button"
                disabled={pendiente}
                onClick={() => {
                  setElegido(e.id);
                  iniciar(() => accionElegirEspecialidad(e.id));
                }}
                className="flex items-center gap-4 rounded-card border-2 border-accent bg-surface p-4 text-left transition-[background-color,transform] hover:bg-accent-soft active:translate-y-px disabled:opacity-70"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-ctl bg-accent-soft text-accent-ink">
                  {pendiente && elegido === e.id ? <LoaderCircle size={22} className="animate-spin" /> : <Icono size={22} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-semibold text-ink">{e.nombre}</span>
                  <span className="block text-[13px] text-ink-2">{e.nivel}</span>
                </span>
                {esActual && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent-ink">
                    <Check size={13} /> Tu curso
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>
      {proximas.length > 0 && (
        <section>
          <h2 className="mb-2.5 text-[13.5px] font-semibold text-ink-2">Muy pronto</h2>
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-2.5 sm:grid-cols-2">
            {proximas.map((e) => {
              const Icono = ICONO[e.id] ?? Atom;
              return (
                <li key={e.id} className="flex items-center gap-3.5 rounded-card border border-line bg-surface-2 p-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-ctl bg-surface text-ink-3">
                    <Icono size={19} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-ink-2">{e.nombre}</span>
                    <span className="block text-[12.5px] text-ink-2">{e.nivel}</span>
                  </span>
                  <span className="shrink-0 rounded-full border border-line bg-surface px-2.5 py-0.5 text-[12px] font-semibold text-ink-2">Muy pronto</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
