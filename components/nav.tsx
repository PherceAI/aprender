'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
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
  return (
    <nav
      aria-label="Principal"
      className={`fixed inset-x-0 bottom-0 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden ${abierto ? 'z-[60]' : 'z-30'}`}
    >
      {mas && abierto && <HojaMas mas={mas} cerrar={() => setAbierto(false)} />}
      <div className="mx-auto grid max-w-lg" style={{gridTemplateColumns: `repeat(${columnas}, minmax(0, 1fr))`}}>
        {items.map((it) => {
          const Icono = ICONOS[it.icono];
          const on = activo(path, it.href);
          const n = insignias[it.href] ?? 0;
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={on ? 'page' : undefined}
              className={`relative flex h-16 flex-col items-center justify-center gap-1 text-[11.5px] font-semibold ${on ? 'text-accent-ink' : 'text-ink-3'}`}
            >
              <Icono size={22} strokeWidth={on ? 2.2 : 1.8} />
              {it.corto ?? it.texto}
              {n > 0 && <span className="num absolute top-2 left-[calc(50%+6px)] grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">{n}</span>}
            </Link>
          );
        })}
        {mas && (
          <button
            type="button"
            onClick={() => setAbierto((x) => !x)}
            aria-expanded={abierto}
            className={`relative flex h-16 flex-col items-center justify-center gap-1 text-[11.5px] font-semibold ${abierto ? 'text-accent-ink' : 'text-ink-3'}`}
          >
            {abierto ? <X size={22} /> : <Menu size={22} />}
            Más
            {mas.gratis && <span className="absolute top-2.5 left-[calc(50%+7px)] h-2 w-2 rounded-full bg-accent" />}
          </button>
        )}
      </div>
    </nav>
  );
}

function HojaMas({mas, cerrar}: {mas: MenuMas; cerrar: () => void}) {
  const fila = 'flex h-14 items-center gap-3.5 rounded-[14px] px-3 text-[15.5px] font-medium text-ink hover:bg-surface-2';
  return (
    <>
      <button type="button" aria-label="Cerrar el menú" onClick={cerrar} className="fixed inset-0 -z-10 bg-black/30" />
      <div className="absolute inset-x-0 bottom-full rounded-t-[22px] border-t border-line bg-surface px-3 pt-4 pb-3 shadow-float">
        <div className="px-3 pb-3">
          <p className="text-[16px] font-semibold text-ink">{mas.nombre}</p>
          {mas.curso && <p className="text-[13px] text-ink-2">{mas.curso}</p>}
        </div>
        {mas.gratis && (
          <Link href="/acceso" className="mb-1 flex h-14 items-center gap-3.5 rounded-[14px] bg-accent px-3 text-[15.5px] font-semibold text-white">
            <CreditCard size={20} /> Desbloquear todo · {mas.precio}
          </Link>
        )}
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
        <form action={mas.salir}>
          <button className={`${fila} w-full text-left`}>
            <LogOut size={20} className="text-ink-2" /> Cerrar sesión
          </button>
        </form>
      </div>
    </>
  );
}
