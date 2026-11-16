'use client';

import {useTransition} from 'react';
import {Atom, BookText, Calculator, Globe, LoaderCircle, type LucideIcon} from 'lucide-react';
import {accionElegirEspecialidad} from '@/app/acciones';

const ICONO: Record<string, LucideIcon> = {
  'ccnn-egb-superior': Atom,
  'matematica-egb-superior': Calculator,
  'lengua-egb-superior': BookText,
  'estudios-sociales-egb-superior': Globe,
};

export function ElegirEspecialidad({especialidades}: {especialidades: {id: string; nombre: string; nivel: string; activa: boolean}[]}) {
  const [pendiente, iniciar] = useTransition();
  return (
    <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
      {especialidades.map((e) => {
        const Icono = ICONO[e.id] ?? Atom;
        return (
          <button
            key={e.id}
            type="button"
            disabled={!e.activa || pendiente}
            onClick={() => iniciar(() => accionElegirEspecialidad(e.id))}
            className={`group flex items-center gap-4 rounded-card border p-4 text-left transition-[border-color,transform,box-shadow] ${
              e.activa
                ? 'border-line bg-surface shadow-card hover:border-accent-ink active:translate-y-px'
                : 'cursor-not-allowed border-line border-dashed bg-transparent'
            }`}
          >
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-ctl ${e.activa ? 'bg-accent-soft text-accent-ink' : 'bg-surface-2 text-ink-3'}`}>
              {pendiente && e.activa ? <LoaderCircle size={22} className="animate-spin" /> : <Icono size={22} />}
            </span>
            <span className="min-w-0">
              <span className={`block text-[16px] font-semibold ${e.activa ? 'text-ink' : 'text-ink-3'}`}>{e.nombre}</span>
              <span className="block truncate text-[13px] text-ink-3">{e.activa ? e.nivel : 'Próximamente'}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
