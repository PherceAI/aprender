'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {BotonInstalar} from './instalar';
import {TemaToggle} from './tema-toggle';
import {ArrowLeftRight, CreditCard, FileText, LogOut, Menu, X, ChartLine, ChartNoAxesColumnIncreasing, ClipboardList, House, Repeat, Route, Timer, type LucideIcon} from 'lucide-react';

export type ItemNav = {href: string; texto: string; corto?: string; icono: 'inicio' | 'ruta' | 'repaso' | 'simulacro' | 'progreso' | 'evaluacion' | 'admin'};

const ICONOS: Record<ItemNav['icono'], LucideIcon> = {
  inicio: House,
  ruta: Route,
  repaso: Repeat,
  simulacro: Timer,
  progreso: ChartNoAxesColumnIncreasing,
  evaluacion: ClipboardList,
  admin: ChartLine,
};

function activo(path: string, href: string) {
  if (href === '/inicio') return path.startsWith('/inicio') || path.startsWith('/curso') || path.startsWith('/leccion');
  return path === href || path.startsWith(`${href}/`);
}

export function NavLateral({items, insignias = {}}: {items: ItemNav[]; insignias?: Record<string, number>}) {
  const path = usePathname();
  return (
    <nav className="flex flex-col gap-1" aria-label="Principal">
      {items.map((it) => {
        const Icono = ICONOS[it.icono];
        const on = activo(path, it.href);
        const n = insignias[it.href] ?? 0;
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={on ? 'page' : undefined}
            className={`flex h-12 items-center gap-3 rounded-[12px] px-4 text-[15px] font-medium transition-colors ${
              on ? 'bg-accent font-semibold text-on-accent' : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
            }`}
          >
            <Icono size={19} strokeWidth={on ? 2.2 : 1.9} />
            {it.texto}
            {n > 0 && (
              <span className={`num ml-auto rounded-full px-2 py-0.5 text-[12px] font-bold ${on ? 'bg-white/25 text-white' : 'bg-accent-soft text-accent-ink'}`}>{n}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/** Lo que en la computadora está en la barra lateral y en el teléfono va en «Más». */
export type MenuMas = {nombre: string; curso: string | null; gratis: boolean; precio: string; fichaUrl: string | null; salir: () => void};

export function NavInferior({items, insignias = {}, mas}: {items: ItemNav[]; insignias?: Record<string, number>; mas?: MenuMas}) {
  const path = usePathname();
  const [abierto, setAbierto] = useState(false);
  useEffect(() => setAbierto(false), [path]);
  const columnas = items.length + (mas ? 1 : 0);
  const boton = (on: boolean) =>
    `relative flex h-16 flex-col items-center justify-center gap-1 rounded-[14px] text-[11.5px] font-semibold transition-colors ${on ? 'text-accent-ink' : 'text-ink-3'}`;
  return (
    <>
      {mas && abierto && (
        <>
          <button type="button" aria-label="Cerrar el menú" onClick={() => setAbierto(false)} className="fixed inset-0 z-[55] bg-black/35 lg:hidden" />
          <HojaMas mas={mas} />
        </>
      )}
      <nav
        aria-label="Principal"
        className={`fixed inset-x-0 bottom-0 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden ${abierto ? 'z-[57]' : 'z-30'}`}
      >
        <div className="mx-auto grid max-w-lg gap-1 px-3" style={{gridTemplateColumns: `repeat(${columnas}, minmax(0, 1fr))`}}>
          {items.map((it) => {
            const Icono = ICONOS[it.icono];
            const on = !abierto && activo(path, it.href);
            const n = insignias[it.href] ?? 0;
            return (
              <Link key={it.href} href={it.href} aria-current={on ? 'page' : undefined} className={boton(on)}>
                <Icono size={22} strokeWidth={on ? 2.2 : 1.8} />
                {it.corto ?? it.texto}
                {n > 0 && <span className="num absolute top-2 left-[calc(50%+6px)] grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">{n}</span>}
              </Link>
            );
          })}
          {mas && (
            <button type="button" onClick={() => setAbierto((x) => !x)} aria-expanded={abierto} className={boton(abierto)}>
              {abierto ? <X size={22} strokeWidth={2.2} /> : <Menu size={22} strokeWidth={1.8} />}
              Más
              {mas.gratis && !abierto && <span className="absolute top-2.5 left-[calc(50%+8px)] h-2 w-2 rounded-full bg-accent" />}
            </button>
          )}
        </div>
      </nav>
    </>
  );
}

function HojaMas({mas}: {mas: MenuMas}) {
  const fila = 'flex h-14 w-full items-center gap-3.5 rounded-[14px] px-3 text-left text-[15.5px] font-medium text-ink hover:bg-surface-2';
  const iniciales = mas.nombre.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join('');
  return (
    <div className="fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[56] mx-auto max-w-lg rounded-[24px] border border-line bg-surface p-3 shadow-float lg:hidden">
      <div className="flex items-center gap-3 px-2 pt-1 pb-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-[15px] font-semibold text-white">{iniciales}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-semibold text-ink">{mas.nombre}</p>
          {mas.curso && <p className="truncate text-[13px] text-ink-2">{mas.curso}</p>}
        </div>
        <TemaToggle compacto />
      </div>
      {mas.gratis && (
        <Link href="/acceso" className="mb-1.5 flex h-14 items-center gap-3.5 rounded-[14px] bg-accent px-3.5 text-[15.5px] font-semibold text-white">
          <CreditCard size={20} /> Desbloquear todo · {mas.precio}
        </Link>
      )}
      <div className="flex flex-col">
        <Link href="/evaluacion" className={fila}>
          <ClipboardList size={20} className="text-ink-2" /> Tu evaluación
        </Link>
        {mas.fichaUrl && (
          <a href={mas.fichaUrl} target="_blank" rel="noopener noreferrer" className={fila}>
            <FileText size={20} className="text-ink-2" /> Ficha técnica oficial
          </a>
        )}
        <Link href="/bienvenida" className={fila}>
          <ArrowLeftRight size={20} className="text-ink-2" /> Cambiar de curso
        </Link>
        <BotonInstalar fila />
        <form action={mas.salir} className="mt-1 border-t border-line pt-1">
          <button className={fila}>
            <LogOut size={20} className="text-ink-2" /> Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
