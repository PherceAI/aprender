'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {BookOpen, ChartLine, House, Timer, UserRound, type LucideIcon} from 'lucide-react';

export type ItemNav = {href: string; texto: string; icono: 'inicio' | 'curso' | 'simulacro' | 'perfil' | 'admin'};

const ICONOS: Record<ItemNav['icono'], LucideIcon> = {
  inicio: House,
  curso: BookOpen,
  simulacro: Timer,
  perfil: UserRound,
  admin: ChartLine,
};

function activo(path: string, href: string) {
  if (href === '/curso') return path.startsWith('/curso') || path.startsWith('/leccion');
  return path === href || path.startsWith(`${href}/`);
}

export function NavLateral({items}: {items: ItemNav[]}) {
  const path = usePathname();
  return (
    <nav className="flex flex-col gap-1" aria-label="Principal">
      {items.map((it) => {
        const Icono = ICONOS[it.icono];
        const on = activo(path, it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={on ? 'page' : undefined}
            className={`flex h-12 items-center gap-3 rounded-[12px] px-4 text-[15px] font-medium transition-colors ${
              on ? 'bg-accent text-on-accent' : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
            }`}
          >
            <Icono size={19} strokeWidth={on ? 2.2 : 1.9} />
            {it.texto}
          </Link>
        );
      })}
    </nav>
  );
}

export function NavInferior({items}: {items: ItemNav[]}) {
  const path = usePathname();
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto grid max-w-md" style={{gridTemplateColumns: `repeat(${items.length}, 1fr)`}}>
        {items.map((it) => {
          const Icono = ICONOS[it.icono];
          const on = activo(path, it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={on ? 'page' : undefined}
              className={`flex h-16 flex-col items-center justify-center gap-1 text-[11.5px] font-semibold ${on ? 'text-accent-ink' : 'text-ink-3'}`}
            >
              <Icono size={22} strokeWidth={on ? 2.2 : 1.8} />
              {it.texto}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
