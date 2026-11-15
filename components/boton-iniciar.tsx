'use client';

import {useState, useTransition} from 'react';
import {ArrowRight, LoaderCircle} from 'lucide-react';
import {accionIniciar} from '@/app/acciones';
import type {TipoIntento} from '@/lib/intentos';
import {btn} from './ui';

/** Empieza (o retoma) un diagnóstico, práctica, prueba, repaso o simulacro. */
export function BotonIniciar({
  tipo,
  referencia = null,
  texto,
  variante = 'primary',
  className = '',
}: {
  tipo: TipoIntento;
  referencia?: string | null;
  texto: string;
  variante?: 'primary' | 'secondary';
  className?: string;
}) {
  const [pendiente, iniciar] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={pendiente}
        onClick={() =>
          iniciar(async () => {
            const r = await accionIniciar(tipo, referencia);
            if (r?.error) setError(r.error);
          })
        }
        className={`${btn[variante]} ${className}`}
      >
        {pendiente ? <LoaderCircle size={18} className="animate-spin" /> : null}
        {texto}
        {!pendiente && variante === 'primary' && <ArrowRight size={18} />}
      </button>
      {error && <p className="text-[14px] font-medium text-ink-2">{error}</p>}
    </div>
  );
}
