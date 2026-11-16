'use client';

import {useState} from 'react';
import {Check, RotateCcw, X} from 'lucide-react';

// Una pregunta real de práctica en la portada: el visitante prueba el método antes de comprar.

export type Muestra = {tema: string; enunciado: string; opciones: string[]; correcta: number; explicaciones: string[]};

const LETRAS = 'ABCD';

export function PreguntaMuestra({p}: {p: Muestra}) {
  const [elegida, setElegida] = useState<number | null>(null);
  const respondida = elegida !== null;
  const acerto = elegida === p.correcta;

  return (
    <div className="rounded-card border border-line bg-surface p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-ink-3">
        <span>Pregunta de práctica · {p.tema}</span>
        <span className="rounded-full bg-surface-2 px-2.5 py-1 font-medium text-ink-2">Formato simple</span>
      </div>
      <p className="mt-4 text-[18px] leading-snug font-semibold tracking-[-0.015em] text-ink sm:text-[20px]">{p.enunciado}</p>

      <div className="mt-5 flex flex-col gap-2.5" role="group" aria-label="Opciones">
        {p.opciones.map((o, i) => {
          const esCorrecta = respondida && i === p.correcta;
          const esMala = respondida && i === elegida && !acerto;
          return (
            <button
              key={o}
              type="button"
              disabled={respondida}
              onClick={() => setElegida(i)}
              className={`flex min-h-[52px] w-full items-center gap-3 rounded-ctl border px-3.5 py-2.5 text-left text-[15px] transition-colors ${
                esCorrecta
                  ? 'border-ok bg-ok-soft text-ink'
                  : esMala
                    ? 'border-bad bg-bad-soft text-ink'
                    : respondida
                      ? 'border-line text-ink-3'
                      : 'border-line text-ink hover:border-accent hover:bg-accent-soft'
              }`}
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[13px] font-semibold ${
                  esCorrecta ? 'bg-ok text-white' : esMala ? 'bg-bad text-white' : 'bg-surface-2 text-ink-2'
                }`}
              >
                {esCorrecta ? <Check size={15} strokeWidth={3} /> : esMala ? <X size={15} strokeWidth={3} /> : LETRAS[i]}
              </span>
              <span className="min-w-0">{o}</span>
            </button>
          );
        })}
      </div>

      <div aria-live="polite">
        {respondida && (
          <div className="rise mt-5 border-t border-line pt-4">
            <p className={`text-[15px] font-semibold ${acerto ? 'text-ok' : 'text-bad'}`}>{acerto ? '¡Correcto!' : 'No es esa, y está bien equivocarse aquí.'}</p>
            {!acerto && <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">{p.explicaciones[elegida!]}</p>}
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">{p.explicaciones[p.correcta].replace(/^Correcto:\s*/, '')}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] text-ink-3">{acerto ? 'En la plataforma, lo que dominas avanza tu ruta.' : 'En la plataforma, esta pregunta vuelve mañana para que no se te olvide.'}</p>
              <button type="button" onClick={() => setElegida(null)} className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-accent-ink">
                <RotateCcw size={14} /> Otra vez
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
