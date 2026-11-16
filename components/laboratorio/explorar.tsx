'use client';

import {useMemo, useState} from 'react';
import {Check, Hand, Sparkles} from 'lucide-react';
import {LABORATORIOS} from '@/contenido/laboratorios';
import type {LabId} from '@/contenido/tipos';
import {Celula, type EstadoZona} from './celula';

/**
 * Laboratorio para explorar: se toca una parte y aparece qué es y para qué sirve.
 * Con `reto`, además hay que encontrar ciertas partes (p. ej. las 3 que la célula animal no tiene).
 */
export function Explorar({lab, consigna, reto, compacto = false, onVistas}: {lab: LabId; consigna?: string; reto?: string[]; compacto?: boolean; onVistas?: (vistas: number, total: number, retoCompleto: boolean) => void}) {
  const zonas = LABORATORIOS[lab].zonas;
  const [activa, setActiva] = useState<string | null>(null);
  const [halladas, setHalladas] = useState<Set<string>>(new Set());
  const [vistas, setVistas] = useState<Set<string>>(new Set());
  const info = zonas.find((z) => z.id === activa);

  const estados = useMemo(() => {
    const e: Record<string, EstadoZona> = {};
    for (const h of halladas) e[h] = 'hallada';
    if (activa) e[activa] = 'activa';
    return e;
  }, [activa, halladas]);

  const tocar = (z: string) => {
    setActiva(z);
    const nuevasHalladas = reto?.includes(z) ? new Set(halladas).add(z) : halladas;
    const nuevasVistas = new Set(vistas).add(z);
    setHalladas(nuevasHalladas);
    setVistas(nuevasVistas);
    onVistas?.(nuevasVistas.size, zonas.length, Boolean(reto && nuevasHalladas.size === reto.length));
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
        {onVistas && (
          <div className="mt-5">
            <p className="mb-2 text-[13px] font-semibold text-ink-2">Partes de la célula</p>
            <div className="flex flex-wrap gap-1.5">
              {zonas.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => tocar(z.id)}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12.5px] font-semibold transition-colors ${
                    activa === z.id ? 'bg-accent text-white' : vistas.has(z.id) ? 'bg-ok-soft text-ok' : 'bg-surface-2 text-ink-2 hover:bg-accent-soft'
                  }`}
                >
                  {vistas.has(z.id) && activa !== z.id && <Check size={13} strokeWidth={3} />}
                  {z.nombre}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
