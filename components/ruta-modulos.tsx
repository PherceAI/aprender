import Link from 'next/link';
import {ChevronDown, ChevronRight, Lock} from 'lucide-react';
import {visualDeUnidad} from '@/lib/visual';

// La ruta completa por módulos: cada módulo se abre con un toque y muestra sus temas con su nivel y estado.
// Vive en Inicio (antes era la pantalla «Mi ruta»).

type Tema = {id: string; nombre: string; abierto: boolean; estado: string; nivel: number; completadas: number; lecciones: number};
type Unidad = {id: string; nombre: string; bloque: string; nivel: number; temas: Tema[]};

function estadoDe(t: Tema) {
  if (t.estado === 'dominado') return {texto: 'Dominado', clase: 'bg-ok-soft text-ok'};
  if (!t.abierto) return {texto: 'Pronto', clase: 'bg-surface-2 text-ink-2'};
  if (t.completadas > 0) return {texto: 'En curso', clase: 'bg-accent-soft text-accent-ink'};
  return {texto: 'Disponible', clase: 'bg-accent-soft text-accent-ink'};
}

export function RutaModulos({unidades, actualId}: {unidades: Unidad[]; actualId: string | null}) {
  return (
    <div className="flex flex-col gap-3">
      {unidades.map((un, i) => {
        const v = visualDeUnidad(un.id);
        const abiertos = un.temas.filter((t) => t.abierto).length;
        const dominados = un.temas.filter((t) => t.estado === 'dominado').length;
        const contieneActual = actualId ? un.temas.some((t) => t.id === actualId) : false;
        return (
          <details key={un.id} className="group overflow-hidden rounded-[18px] border border-line bg-surface" open={contieneActual}>
            <summary className="flex cursor-pointer list-none items-center gap-3.5 p-3.5 sm:gap-4 sm:p-4 [&::-webkit-details-marker]:hidden">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] sm:h-14 sm:w-14" style={{background: v.suave}}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.img} alt="" aria-hidden className="h-9 w-9 sm:h-10 sm:w-10" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-bold" style={{color: v.color}}>
                  Módulo {i + 1} · {un.bloque.startsWith('Conocimientos generales') ? 'Generales' : 'Ciencias Naturales'}
                </span>
                <span className="line-clamp-2 block text-[15.5px] leading-snug font-semibold text-ink sm:truncate sm:text-[16px]">{un.nombre}</span>
                <span className="block text-[12.5px] text-ink-2">
                  {un.temas.length} {un.temas.length === 1 ? 'tema' : 'temas'}
                  {dominados ? ` · ${dominados} dominado${dominados === 1 ? '' : 's'}` : abiertos ? ` · ${abiertos} disponible` : ' · se abre pronto'}
                </span>
              </span>
              <span className="hidden w-36 items-center gap-2 sm:flex">
                <span className="num text-[13px] font-semibold text-ink">{un.nivel} %</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-line-2">
                  <span className="block h-full rounded-full" style={{width: `${un.nivel}%`, background: v.color}} />
                </span>
              </span>
              <ChevronDown size={20} className="shrink-0 text-ink-3 transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t border-line px-1.5 pb-1.5 sm:px-2 sm:pb-2">
              {un.temas.map((t) => (
                <FilaTema key={t.id} t={t} color={v.color} actual={t.id === actualId} />
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}

function FilaTema({t, color, actual}: {t: Tema; color: string; actual: boolean}) {
  const e = estadoDe(t);
  return (
    <Link href={`/curso/${t.id}`} className={`flex items-center gap-3 rounded-[12px] px-2.5 py-3 hover:bg-surface-2 sm:px-3 ${actual ? 'bg-accent-soft/60' : ''}`}>
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{background: `conic-gradient(${color} 0 ${t.nivel}%, var(--line-2) ${t.nivel}% 100%)`}}>
        <span className="num grid h-8 w-8 place-items-center rounded-full bg-surface text-[11px] font-bold text-ink">{t.nivel}</span>
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-[15px] font-medium ${t.abierto ? 'text-ink' : 'text-ink-2'}`}>{t.nombre}</span>
        <span className="block text-[12.5px] text-ink-3">
          {actual ? 'Aquí vas · ' : ''}
          {t.lecciones} {t.lecciones === 1 ? 'lección' : 'lecciones'}
          {t.abierto && t.completadas ? ` · ${t.completadas} vista${t.completadas === 1 ? '' : 's'}` : ''}
        </span>
      </span>
      <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${e.clase}`}>
        {!t.abierto && <Lock size={11} />}
        {e.texto}
      </span>
      <ChevronRight size={17} className="hidden shrink-0 text-ink-3 sm:block" />
    </Link>
  );
}
