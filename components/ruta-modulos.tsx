import Link from 'next/link';
import {ChevronDown, ChevronRight, Lock} from 'lucide-react';
import {visualDeUnidad} from '@/lib/visual';

// La ruta completa por módulos: cada módulo se abre con un toque y muestra sus temas con su nivel y estado.
// Vive en Inicio (antes era la pantalla «Mi ruta»).

type Tema = {id: string; nombre: string; abierto: boolean; estado: string; nivel: number; completadas: number; lecciones: number};
type Unidad = {id: string; nombre: string; bloque: string; asignatura?: string | null; nivel: number; temas: Tema[]};

function estadoDe(t: Tema) {
  // «Dominado» sin lecciones vistas viene del diagnóstico: el docente ya lo sabía.
  if (t.estado === 'dominado') return {texto: t.completadas ? 'Dominado' : 'Ya lo sabes', clase: 'bg-ok-soft text-ok'};
  if (!t.abierto) return {texto: 'Pronto', clase: 'bg-surface-2 text-ink-2'};
  if (t.completadas > 0) return {texto: 'En curso', clase: 'bg-accent-soft text-accent-ink'};
  return {texto: 'Disponible', clase: 'bg-accent-soft text-accent-ink'};
}

/** El grupo de cada módulo: «Conocimientos generales» o la asignatura (EGB 2.º a 7.º tiene cuatro). */
function grupoDe(un: Unidad): string {
  if (un.bloque.startsWith('Conocimientos generales')) return 'Conocimientos generales';
  return un.asignatura ?? un.bloque;
}

export function RutaModulos({unidades, actualId}: {unidades: Unidad[]; actualId: string | null}) {
  // Los encabezados de grupo solo hacen falta cuando el curso mezcla asignaturas.
  const conGrupos = new Set(unidades.map(grupoDe)).size > 2;
  return (
    <div className="flex flex-col gap-3">
      {unidades.map((un, i) => {
        const grupo = grupoDe(un);
        const encabezado = conGrupos && (i === 0 || grupoDe(unidades[i - 1]) !== grupo);
        const v = visualDeUnidad(un.id);
        const abiertos = un.temas.filter((t) => t.abierto).length;
        const dominados = un.temas.filter((t) => t.estado === 'dominado').length;
        const contieneActual = actualId ? un.temas.some((t) => t.id === actualId) : false;
        const totalLecciones = un.temas.reduce((a, t) => a + t.lecciones, 0);
        const vistas = un.temas.reduce((a, t) => a + Math.min(t.completadas, t.lecciones), 0);
        const avance = totalLecciones ? Math.round((vistas / totalLecciones) * 100) : 0;
        return (
          <div key={un.id} className="flex flex-col gap-3">
          {encabezado && <h3 className={`text-[14px] font-semibold text-ink-2 ${i === 0 ? '' : 'mt-3'}`}>{grupo}</h3>}
          <details className="group overflow-hidden rounded-[18px] border border-line bg-surface" open={contieneActual}>
            <summary className="flex cursor-pointer list-none items-center gap-3.5 p-3.5 sm:gap-4 sm:p-4 [&::-webkit-details-marker]:hidden">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] sm:h-14 sm:w-14" style={{background: v.suave}}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.img} alt="" aria-hidden className="h-9 w-9 sm:h-10 sm:w-10" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-bold" style={{color: v.color}}>
                  Módulo {i + 1} · {un.bloque.startsWith('Conocimientos generales') ? 'Generales' : (un.asignatura ?? un.bloque.replace(/^Conocimientos de /, ''))}
                </span>
                <span className="line-clamp-2 block text-[15.5px] leading-snug font-semibold text-ink sm:truncate sm:text-[16px]">{un.nombre}</span>
                <span className="block text-[12.5px] text-ink-2">
                  {un.temas.length} {un.temas.length === 1 ? 'tema' : 'temas'}
                  {dominados ? ` · ${dominados} dominado${dominados === 1 ? '' : 's'}` : abiertos ? ` · ${abiertos} ${abiertos === 1 ? 'disponible' : 'disponibles'}` : ' · se abre pronto'}
                </span>
              </span>
              <span className="hidden w-40 flex-col gap-1 sm:flex" title="Lecciones vistas en este módulo">
                <span className="num text-[12.5px] text-ink-2">
                  <b className="text-ink">{vistas}</b> de {totalLecciones} lecciones
                </span>
                <span className="h-2 overflow-hidden rounded-full bg-line-2">
                  <span className="block h-full rounded-full" style={{width: `${avance}%`, background: v.color}} />
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
          </div>
        );
      })}
    </div>
  );
}

function FilaTema({t, color, actual}: {t: Tema; color: string; actual: boolean}) {
  const e = estadoDe(t);
  const vistas = Math.min(t.completadas, t.lecciones);
  const avance = t.lecciones ? Math.round((vistas / t.lecciones) * 100) : 0;
  return (
    <Link href={`/curso/${t.id}`} className={`flex items-center gap-3 rounded-[12px] px-2.5 py-3 hover:bg-surface-2 sm:px-3 ${actual ? 'bg-accent-soft/60' : ''}`}>
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full" title="Lecciones vistas" style={{background: `conic-gradient(${color} 0 ${avance}%, var(--line-2) ${avance}% 100%)`}}>
        <span className="num grid h-8 w-8 place-items-center rounded-full bg-surface text-[11px] font-bold text-ink">
          {vistas}/{t.lecciones}
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className={`line-clamp-2 block text-[15px] leading-snug font-medium sm:truncate ${t.abierto ? 'text-ink' : 'text-ink-2'}`}>{t.nombre}</span>
        <span className="block text-[12.5px] text-ink-3">
          {actual ? 'Aquí vas · ' : ''}
          {vistas} de {t.lecciones} {t.lecciones === 1 ? 'lección vista' : 'lecciones vistas'}
          {t.nivel > 0 ? ` · tu nivel: ${t.nivel} %` : ''}
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
