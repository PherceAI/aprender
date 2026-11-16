import Link from 'next/link';
import {Lock} from 'lucide-react';
import type {EstadoDominio} from '@/lib/dominio';
import {colorDominio, NOMBRE_ESTADO} from './ui';

// El movimiento distintivo: los temas como un mosaico de baldosas, teñidas por cuánto domina cada uno.

export interface TemaMapa {
  id: string;
  nombre: string;
  nivel: number;
  estado: EstadoDominio;
  abierto: boolean;
}
export interface UnidadMapa {
  id: string;
  nombre: string;
  temas: TemaMapa[];
}

export function MapaDominio({unidades, revelar = false, enlazar = false, compacto = false, sinCandados = false}: {unidades: UnidadMapa[]; revelar?: boolean; enlazar?: boolean; compacto?: boolean; sinCandados?: boolean}) {
  let i = 0;
  return (
    <div className={`grid gap-x-6 gap-y-4 grid-cols-[minmax(0,1fr)] ${compacto ? 'sm:grid-cols-[repeat(2,minmax(0,1fr))]' : 'sm:grid-cols-[repeat(2,minmax(0,1fr))] xl:grid-cols-[repeat(3,minmax(0,1fr))]'} ${revelar ? 'revelar' : ''}`}>
      {unidades.map((u) => (
        <div key={u.id}>
          <p className="mb-2 truncate text-[13px] font-semibold text-ink-2">{u.nombre}</p>
          <div className="flex flex-wrap gap-1.5">
            {u.temas.map((t) => {
              const estilo = {'--i': i++, backgroundColor: colorDominio(t.nivel, t.estado)} as React.CSSProperties;
              const titulo = `${t.nombre}: ${t.nivel} % · ${NOMBRE_ESTADO[t.estado]}`;
              const cls = `baldosa relative grid h-9 w-9 place-items-center rounded-[9px] ${t.nivel >= 70 || t.estado === 'dominado' ? 'text-on-accent' : 'text-ink-3'}`;
              const dentro = !t.abierto && !sinCandados && <Lock size={12} strokeWidth={2.2} aria-hidden className="opacity-60" />;
              return enlazar ? (
                <Link key={t.id} href={`/curso/${t.id}`} title={titulo} aria-label={titulo} className={`${cls} hover:scale-110`} style={estilo}>
                  {dentro}
                </Link>
              ) : (
                <span key={t.id} title={titulo} aria-label={titulo} role="img" className={cls} style={estilo}>
                  {dentro}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function LeyendaDominio() {
  const pasos = [
    {c: 'var(--dom-0)', t: 'Sin empezar'},
    {c: 'var(--dom-1)', t: 'Poco'},
    {c: 'var(--dom-2)', t: 'A medias'},
    {c: 'var(--dom-3)', t: 'Casi'},
    {c: 'var(--dom-4)', t: 'Dominado'},
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px] text-ink-3">
      {pasos.map((p) => (
        <span key={p.t} className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-[4px]" style={{background: p.c}} />
          {p.t}
        </span>
      ))}
    </div>
  );
}
