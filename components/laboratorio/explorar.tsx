'use client';

import {useMemo, useState} from 'react';
import {Hand, Sparkles} from 'lucide-react';
import {LABORATORIOS} from '@/contenido/laboratorios';
import type {LabId} from '@/contenido/tipos';
import {Celula, type EstadoZona} from './celula';

/**
 * Laboratorio para explorar: se toca una parte y aparece qué es y para qué sirve.
 * Con `reto`, además hay que encontrar ciertas partes (p. ej. las 3 que la célula animal no tiene).
 */
export function Explorar({lab, consigna, reto, compacto = false}: {lab: LabId; consigna?: string; reto?: string[]; compacto?: boolean}) {
  const zonas = LABORATORIOS[lab].zonas;
  const [activa, setActiva] = useState<string | null>(null);
  const [halladas, setHalladas] = useState<Set<string>>(new Set());
  const info = zonas.find((z) => z.id === activa);

  const estados = useMemo(() => {
    const e: Record<string, EstadoZona> = {};
    for (const h of halladas) e[h] = 'hallada';
    if (activa) e[activa] = 'activa';
    return e;
  }, [activa, halladas]);

  const tocar = (z: string) => {
    setActiva(z);
    if (reto?.includes(z)) setHalladas((h) => new Set(h).add(z));
  };
  const completo = reto && halladas.size === reto.length;

  return (
    <div className={`grid gap-4 ${compacto ? '' : 'md:grid-cols-[1.35fr_1fr] md:items-center'}`}>
      <div className="rounded-[16px] bg-surface-2 p-3 sm:p-4">
        <Celula lab={lab} estados={estados} onToque={tocar} />
      </div>
      <div className="min-h-[132px]" aria-live="polite">
        {consigna && <p className="mb-3 text-[14px] font-medium text-ink-2">{consigna}</p>}
        {reto && (
          <p className={`mb-3 inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold ${completo ? 'bg-ok-soft text-ok' : 'bg-accent-soft text-accent-ink'}`}>
            {completo ? <Sparkles size={14} /> : null}
            {completo ? '¡Las encontraste todas!' : `${halladas.size} de ${reto.length} encontradas`}
          </p>
        )}
        {info ? (
          <div key={info.id} className="rise">
            <p className="text-[19px] font-semibold tracking-[-0.02em] text-ink">{info.nombre}</p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{info.funcion}</p>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-[15px] text-ink-3">
            <Hand size={18} /> Toca cualquier parte de la célula.
          </p>
        )}
      </div>
    </div>
  );
}
