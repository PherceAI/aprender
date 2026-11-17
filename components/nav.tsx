'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ChartLine, ChartNoAxesColumnIncreasing, ClipboardList, House, Repeat, Route, Timer, type LucideIcon} from 'lucide-react';

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
  if (href === '/curso') return path.startsWith('/curso') || path.startsWith('/leccion');
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

export function NavInferior({items, insignias = {}}: {items: ItemNav[]; insignias?: Record<string, number>}) {
  const path = usePathname();
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto grid max-w-lg" style={{gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`}}>
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
      </div>
    </nav>
  );
}
