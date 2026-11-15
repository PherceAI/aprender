import {Route} from 'lucide-react';
import type {EstadoDominio} from '@/lib/dominio';

// Piezas visuales compartidas. Tokens en app/globals.css; decisiones en DESIGN.md.

export const btn = {
  primary:
    'inline-flex h-12 items-center justify-center gap-2 rounded-ctl bg-primary px-5 text-[15px] font-semibold text-on-primary shadow-card transition-[opacity,transform] hover:opacity-90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50',
  secondary:
    'inline-flex h-11 items-center justify-center gap-2 rounded-ctl border border-line bg-surface px-4 text-[15px] font-medium text-ink transition-colors hover:bg-surface-2 active:translate-y-px disabled:opacity-50',
  ghost: 'inline-flex h-10 items-center justify-center gap-1.5 rounded-ctl px-3 text-[14px] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink',
};

export const field =
  'h-12 w-full rounded-ctl border border-line bg-surface px-3.5 text-[16px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-3 focus:border-accent-ink focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_60%,transparent)]';

export function Marca({className = '', grande = false}: {className?: string; grande?: boolean}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className={`grid shrink-0 place-items-center rounded-[10px] bg-accent text-on-accent ${grande ? 'h-10 w-10' : 'h-8 w-8'}`}>
        <Route size={grande ? 22 : 18} strokeWidth={2.2} />
      </span>
      <span className={`font-semibold tracking-[-0.03em] text-ink ${grande ? 'text-[21px]' : 'text-[17px]'}`}>Ruta Docente</span>
    </span>
  );
}

/** Color de la escala de dominio para un nivel 0–100. */
export function colorDominio(nivel: number, estado?: EstadoDominio): string {
  if (estado === 'dominado' || nivel >= 80) return 'var(--dom-4)';
  if (nivel >= 70) return 'var(--dom-3)';
  if (nivel >= 40) return 'var(--dom-2)';
  if (nivel >= 1) return 'var(--dom-1)';
  return 'var(--dom-0)';
}

export const NOMBRE_ESTADO: Record<EstadoDominio, string> = {
  'sin-empezar': 'Por empezar',
  aprendiendo: 'Aprendiendo',
  dominado: 'Dominado',
  repasar: 'Toca repasar',
};

export function EtiquetaEstado({estado}: {estado: EstadoDominio}) {
  const tono: Record<EstadoDominio, string> = {
    'sin-empezar': 'bg-surface-2 text-ink-3',
    aprendiendo: 'bg-wip-soft text-wip',
    dominado: 'bg-accent-soft text-accent-ink',
    repasar: 'bg-warm-soft text-warm',
  };
  return <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-[12px] font-semibold ${tono[estado]}`}>{NOMBRE_ESTADO[estado]}</span>;
}

/** Anillo de progreso con el número en el centro (dato real: preparación o dominio). */
export function Anillo({valor, tam = 132, grosor = 12, etiqueta}: {valor: number; tam?: number; grosor?: number; etiqueta?: string}) {
  const r = (tam - grosor) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, valor));
  return (
    <div className="relative shrink-0" style={{width: tam, height: tam}} role="img" aria-label={`${etiqueta ?? 'Progreso'}: ${v} %`}>
      <svg width={tam} height={tam} className="-rotate-90">
        <circle cx={tam / 2} cy={tam / 2} r={r} fill="none" stroke="var(--line-2)" strokeWidth={grosor} />
        <circle
          cx={tam / 2}
          cy={tam / 2}
          r={r}
          fill="none"
          stroke="var(--anillo)"
          strokeWidth={grosor}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v / 100)}
          style={{transition: 'stroke-dashoffset 900ms var(--ease-out-expo)'}}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center leading-none">
          <span className="num font-semibold tracking-[-0.04em] text-ink" style={{fontSize: tam * 0.27}}>
            {v}
          </span>
          <span className="font-semibold text-ink-3" style={{fontSize: tam * 0.13}}>
            %
          </span>
        </div>
      </div>
    </div>
  );
}

/** Barra fina de avance (sin pista de relleno pesada). */
export function Barra({valor, className = ''}: {valor: number; className?: string}) {
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-line-2 ${className}`}>
      <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{width: `${Math.max(0, Math.min(100, valor))}%`}} />
    </div>
  );
}

export function Aviso() {
  return <p className="text-[12px] leading-relaxed text-ink-3">Ruta Docente no es el Ineval ni habla en su nombre. El temario sale de la ficha técnica pública 2026.</p>;
}
