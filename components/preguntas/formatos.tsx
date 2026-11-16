'use client';

import {Check, X} from 'lucide-react';
import {Celula, type EstadoZona} from '@/components/laboratorio/celula';
import type {Marcado, PreguntaUI} from './tipos';

// Cada formato del Ineval, en su forma interactiva (práctica) o como en el examen real (simulacro).

const LETRAS = 'ABCD';
const LETRAS_MIN = 'abcdefghij';

export interface Correccion {
  correctaIndex: number;
  solucion: number[] | null;
  acerto: boolean;
}

interface FormatoProps {
  p: PreguntaUI;
  marcado: Marcado | null;
  setMarcado: (m: Marcado | null) => void;
  bloqueado: boolean;
  correccion: Correccion | null;
  /** Simulacro: se ve como el examen real (lista numerada + 4 opciones). */
  comoExamen: boolean;
}

export function marcadoCompleto(p: PreguntaUI, m: Marcado | null): boolean {
  if (!m) return false;
  if ('elegida' in m) return true;
  if (p.formato === 'seleccion') return m.interactiva.length > 0;
  if (p.formato === 'ordenamiento') return m.interactiva.length === (p.elementos as string[]).length;
  if (p.formato === 'emparejamiento') {
    const izq = (p.elementos as {izquierda: string[]}).izquierda;
    return m.interactiva.length === izq.length && m.interactiva.every((x) => x >= 0);
  }
  return false;
}

/** ¿Se responde esta pregunta de forma interactiva? */
export function esInteractiva(p: PreguntaUI, comoExamen: boolean) {
  return !comoExamen && (p.formato === 'seleccion' || p.formato === 'ordenamiento' || p.formato === 'emparejamiento');
}

export function Opciones({p, marcado, setMarcado, bloqueado, correccion}: Omit<FormatoProps, 'comoExamen'>) {
  const elegida = marcado && 'elegida' in marcado ? marcado.elegida : null;
  return (
    <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Opciones">
      {p.opciones.map((o, i) => {
        const esCorrecta = correccion?.correctaIndex === i;
        const esMal = correccion && elegida === i && !correccion.acerto;
        const sel = elegida === i;
        const tono = esCorrecta
          ? 'border-ok bg-ok-soft text-ink'
          : esMal
            ? 'border-bad bg-bad-soft text-ink'
            : sel
              ? 'border-accent-ink bg-accent-soft text-ink shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_60%,transparent)]'
              : 'border-line bg-surface text-ink hover:border-ink-3';
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={sel}
            disabled={bloqueado}
            onClick={() => setMarcado({elegida: i})}
            className={`flex min-h-14 items-center gap-3.5 rounded-ctl border-[1.5px] px-3.5 py-3 text-left text-[15.5px] leading-snug transition-[border-color,background-color,box-shadow] active:translate-y-px disabled:cursor-default ${tono}`}
          >
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-[9px] text-[13px] font-bold ${
                esCorrecta ? 'bg-ok text-surface' : esMal ? 'bg-bad text-surface' : sel ? 'bg-accent text-on-accent' : 'bg-surface-2 text-ink-2'
              }`}
            >
              {esCorrecta ? <Check size={16} strokeWidth={3} /> : esMal ? <X size={16} strokeWidth={3} /> : LETRAS[i]}
            </span>
            <span>{o}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Pregunta sobre un dibujo: se toca la parte en la célula (o la opción de abajo). */
export function SobreDibujo(props: Omit<FormatoProps, 'comoExamen'>) {
  const {p, marcado, setMarcado, bloqueado, correccion} = props;
  const dib = p.dibujo!;
  const elegida = marcado && 'elegida' in marcado ? marcado.elegida : null;
  const estados: Record<string, EstadoZona> = {};
  const lab = dib.lab;
  dib.zonas.forEach((z, i) => {
    if (correccion) estados[z] = i === correccion.correctaIndex ? 'correcta' : i === elegida ? 'incorrecta' : 'normal';
    else estados[z] = i === elegida ? 'activa' : 'normal';
  });
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[1.2fr_1fr] md:items-start">
      <div className="rounded-[16px] bg-surface-2 p-3">
        <Celula
          lab={lab}
          estados={estados}
          tocables={bloqueado ? new Set() : new Set(dib.zonas)}
          onToque={(z) => setMarcado({elegida: dib.zonas.indexOf(z)})}
        />
      </div>
      <Opciones {...props} />
    </div>
  );
}

/** Completar: el espacio en blanco muestra lo que se elige. */
export function Completar(props: Omit<FormatoProps, 'comoExamen'>) {
  const {p, marcado, correccion} = props;
  const elegida = marcado && 'elegida' in marcado ? marcado.elegida : null;
  const [antes, despues] = p.enunciado.split('____');
  const texto = elegida === null ? '' : p.opciones[elegida];
  const tono = correccion ? (correccion.acerto ? 'border-ok bg-ok-soft text-ok' : 'border-bad bg-bad-soft text-bad') : elegida === null ? 'border-ink-3 text-ink-3' : 'border-accent-ink bg-accent-soft text-accent-ink';
  return (
    <div className="flex flex-col gap-5">
      <p className="text-[19px] leading-relaxed text-ink">
        {antes}
        <span className={`mx-1 inline-flex min-w-24 items-center justify-center rounded-[8px] border-[1.5px] border-dashed px-2.5 py-0.5 font-semibold ${tono}`}>
          {texto || ' '}
        </span>
        {despues}
      </p>
      <Opciones {...props} />
    </div>
  );
}

function ListaNumerada({items}: {items: string[]}) {
  return (
    <ol className="flex flex-col gap-1.5 rounded-ctl bg-surface-2 p-3.5">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3 text-[15px] text-ink">
          <span className="num w-5 shrink-0 font-semibold text-ink-3">{i + 1}.</span>
          {t}
        </li>
      ))}
    </ol>
  );
}

function Columnas({izquierda, derecha}: {izquierda: string[]; derecha: string[]}) {
  return (
    <div className="grid gap-3 rounded-ctl bg-surface-2 p-3.5 sm:grid-cols-2">
      <ol className="flex flex-col gap-1.5">
        {izquierda.map((t, i) => (
          <li key={i} className="flex gap-3 text-[15px] text-ink">
            <span className="num w-5 shrink-0 font-semibold text-ink-3">{i + 1}.</span>
            {t}
          </li>
        ))}
      </ol>
      <ol className="flex flex-col gap-1.5">
        {derecha.map((t, i) => (
          <li key={i} className="flex gap-3 text-[15px] text-ink">
            <span className="w-5 shrink-0 font-semibold text-ink-3">{LETRAS_MIN[i]})</span>
            {t}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Como en el examen del Ineval: los elementos numerados y 4 opciones. */
export function ComoExamen(props: Omit<FormatoProps, 'comoExamen'>) {
  const {p} = props;
  return (
    <div className="flex flex-col gap-4">
      {Array.isArray(p.elementos) && <ListaNumerada items={p.elementos} />}
      {p.elementos && !Array.isArray(p.elementos) && <Columnas {...p.elementos} />}
      <Opciones {...props} />
    </div>
  );
}

/** Selección de elementos: se marcan los que corresponden. */
export function Seleccionar({p, marcado, setMarcado, bloqueado, correccion}: Omit<FormatoProps, 'comoExamen'>) {
  const items = p.elementos as string[];
  const sel = new Set(marcado && 'interactiva' in marcado ? marcado.interactiva : []);
  const sol = new Set(correccion?.solucion ?? []);
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[13.5px] font-medium text-ink-3">Marca todos los que correspondan.</p>
      {items.map((t, i) => {
        const on = sel.has(i);
        const tono = correccion
          ? sol.has(i)
            ? 'border-ok bg-ok-soft'
            : on
              ? 'border-bad bg-bad-soft'
              : 'border-line bg-surface opacity-70'
          : on
            ? 'border-accent-ink bg-accent-soft'
            : 'border-line bg-surface hover:border-ink-3';
        return (
          <button
            key={i}
            type="button"
            role="checkbox"
            aria-checked={on}
            disabled={bloqueado}
            onClick={() => {
              const n = new Set(sel);
              if (n.has(i)) n.delete(i);
              else n.add(i);
              setMarcado(n.size ? {interactiva: [...n].sort((a, b) => a - b)} : null);
            }}
            className={`flex min-h-13 items-center gap-3.5 rounded-ctl border-[1.5px] px-3.5 py-2.5 text-left text-[15.5px] text-ink transition-colors active:translate-y-px ${tono}`}
          >
            <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-[7px] border-[1.5px] ${on ? 'border-accent-ink bg-accent text-on-accent' : 'border-ink-3'}`}>
              {on && <Check size={14} strokeWidth={3} />}
            </span>
            {t}
          </button>
        );
      })}
    </div>
  );
}

/** Ordenamiento: se tocan las tarjetas en el orden correcto. */
export function Ordenar({p, marcado, setMarcado, bloqueado, correccion}: Omit<FormatoProps, 'comoExamen'>) {
  const items = p.elementos as string[];
  const orden = marcado && 'interactiva' in marcado ? marcado.interactiva : [];
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[13.5px] font-medium text-ink-3">Toca las tarjetas en orden. Toca de nuevo para quitar.</p>
      <div className="flex flex-col gap-2.5">
        {items.map((t, i) => {
          const pos = orden.indexOf(i);
          const bien = correccion && correccion.solucion ? correccion.solucion[pos] === i : null;
          const tono = correccion ? (bien ? 'border-ok bg-ok-soft' : 'border-bad bg-bad-soft') : pos >= 0 ? 'border-accent-ink bg-accent-soft' : 'border-line bg-surface hover:border-ink-3';
          return (
            <button
              key={i}
              type="button"
              disabled={bloqueado}
              onClick={() => {
                const n = pos >= 0 ? orden.filter((x) => x !== i) : [...orden, i];
                setMarcado(n.length ? {interactiva: n} : null);
              }}
              className={`flex min-h-13 items-center gap-3.5 rounded-ctl border-[1.5px] px-3.5 py-2.5 text-left text-[15.5px] text-ink transition-colors active:translate-y-px ${tono}`}
            >
              <span className={`num grid h-8 w-8 shrink-0 place-items-center rounded-full text-[14px] font-bold ${pos >= 0 ? 'bg-accent text-on-accent' : 'border-[1.5px] border-dashed border-ink-3 text-transparent'}`}>
                {pos >= 0 ? pos + 1 : '·'}
              </span>
              {t}
            </button>
          );
        })}
      </div>
      {correccion && correccion.solucion && !correccion.acerto && (
        <p className="text-[14px] text-ink-2">
          <span className="font-semibold text-ok">Orden correcto: </span>
          {correccion.solucion.map((i) => items[i]).join(' → ')}
        </p>
      )}
    </div>
  );
}

/** Emparejamiento: se elige, para cada fila, su pareja de la otra columna. */
export function Emparejar({p, marcado, setMarcado, bloqueado, correccion}: Omit<FormatoProps, 'comoExamen'>) {
  const {izquierda, derecha} = p.elementos as {izquierda: string[]; derecha: string[]};
  const parejas = marcado && 'interactiva' in marcado ? marcado.interactiva : izquierda.map(() => -1);
  const usar = (fila: number, d: number) => {
    const n = [...parejas];
    n[fila] = parejas[fila] === d ? -1 : d;
    setMarcado(n.some((x) => x >= 0) ? {interactiva: n} : null);
  };
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13.5px] font-medium text-ink-3">Para cada fila, toca la letra de su pareja.</p>
      <ol className="flex flex-col gap-1.5 rounded-ctl bg-surface-2 p-3.5">
        {derecha.map((t, i) => (
          <li key={i} className="flex gap-3 text-[14.5px] text-ink-2">
            <span className="w-5 shrink-0 font-bold text-ink">{LETRAS_MIN[i]})</span>
            {t}
          </li>
        ))}
      </ol>
      {izquierda.map((t, fila) => {
        const bien = correccion?.solucion ? correccion.solucion[fila] === parejas[fila] : null;
        return (
          <div
            key={fila}
            className={`flex flex-col gap-2.5 rounded-ctl border-[1.5px] p-3 sm:flex-row sm:items-center sm:justify-between ${
              correccion ? (bien ? 'border-ok bg-ok-soft' : 'border-bad bg-bad-soft') : parejas[fila] >= 0 ? 'border-accent-ink bg-surface' : 'border-line bg-surface'
            }`}
          >
            <span className="text-[15.5px] font-semibold text-ink">{t}</span>
            <div className="flex gap-1.5">
              {derecha.map((_, d) => {
                const on = parejas[fila] === d;
                const esSol = correccion?.solucion?.[fila] === d;
                return (
                  <button
                    key={d}
                    type="button"
                    disabled={bloqueado}
                    aria-label={`${t}: ${LETRAS_MIN[d]}`}
                    aria-pressed={on}
                    onClick={() => usar(fila, d)}
                    className={`grid h-10 w-10 place-items-center rounded-[10px] text-[15px] font-bold transition-colors active:translate-y-px ${
                      correccion && esSol ? 'bg-ok text-surface' : on ? 'bg-accent text-on-accent' : 'bg-surface-2 text-ink-2 hover:bg-line'
                    }`}
                  >
                    {LETRAS_MIN[d]}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Formato(props: FormatoProps) {
  const {p, comoExamen} = props;
  if (p.dibujo) return <SobreDibujo {...props} />;
  if (p.formato === 'completamiento') return <Completar {...props} />;
  if (p.formato === 'simple') return <Opciones {...props} />;
  if (comoExamen) return <ComoExamen {...props} />;
  if (p.formato === 'seleccion') return <Seleccionar {...props} />;
  if (p.formato === 'ordenamiento') return <Ordenar {...props} />;
  return <Emparejar {...props} />;
}
