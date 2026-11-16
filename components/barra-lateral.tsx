'use client';

import {useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {
  ArrowUpRight,
  ChartLine,
  ChartNoAxesColumnIncreasing,
  ChevronLeft,
  ChevronRight,
  Crown,
  FileText,
  House,
  LogOut,
  Repeat,
  Route,
  Timer,
  type LucideIcon,
} from 'lucide-react';
import {accionSalir} from '@/app/acciones';
import {TemaToggle} from './tema-toggle';
import {BotonInstalar} from './instalar';

// Barra lateral de computadora: se pliega a solo íconos y recuerda la elección (cookie, sin parpadeo al cargar).

export type ItemBarra = {href: string; texto: string; icono: 'inicio' | 'ruta' | 'repaso' | 'simulacro' | 'progreso' | 'admin'; grupo: 'Aprender' | 'Seguimiento'};

const ICONOS: Record<ItemBarra['icono'], LucideIcon> = {
  inicio: House,
  ruta: Route,
  repaso: Repeat,
  simulacro: Timer,
  progreso: ChartNoAxesColumnIncreasing,
  admin: ChartLine,
};

function activo(path: string, href: string) {
  if (href === '/curso') return path.startsWith('/curso') || path.startsWith('/leccion');
  return path === href || path.startsWith(`${href}/`);
}

export function BarraLateral({
  items,
  insignias,
  fichaUrl,
  plan,
  usuario,
  inicialMini,
}: {
  items: ItemBarra[];
  insignias: Record<string, number>;
  fichaUrl: string | null;
  plan: 'gratis' | 'completo';
  usuario: {nombre: string; iniciales: string; detalle: string};
  inicialMini: boolean;
}) {
  const path = usePathname();
  const [mini, setMini] = useState(inicialMini);
  const cambiar = () => {
    const nuevo = !mini;
    setMini(nuevo);
    document.cookie = `barra=${nuevo ? 'mini' : 'abierta'}; path=/; max-age=31536000; samesite=lax`;
    document.getElementById('cascaron')?.style.setProperty('--barra', nuevo ? '84px' : '264px');
  };
  const grupos = (['Aprender', 'Seguimiento'] as const).map((g) => ({g, lista: items.filter((i) => i.grupo === g)})).filter((x) => x.lista.length || (x.g === 'Seguimiento' && fichaUrl));

  const claseItem = (on: boolean) =>
    `group relative flex h-11 items-center gap-3 rounded-[13px] text-[15px] font-medium transition-colors ${mini ? 'justify-center' : 'px-3.5'} ${
      on ? 'bg-[linear-gradient(120deg,#e0330b,#f04a1c)] font-semibold text-white shadow-[0_6px_14px_-8px_rgba(224,51,11,0.7)]' : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
    }`;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-line bg-surface px-3 py-5 transition-[width] duration-200 lg:flex" style={{width: mini ? 84 : 264}}>
      <button
        type="button"
        onClick={cambiar}
        aria-label={mini ? 'Abrir la barra lateral' : 'Plegar la barra lateral'}
        title={mini ? 'Abrir' : 'Plegar'}
        className="absolute top-8 -right-3.5 grid h-7 w-7 place-items-center rounded-full border border-line bg-surface text-ink-2 shadow-[0_2px_6px_rgba(0,0,0,0.08)] hover:text-ink"
      >
        {mini ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
      </button>

      <Link href={items[0]?.href ?? '/'} className="flex h-12 items-center justify-center gap-2.5" aria-label="Pragma, inicio">
        <span aria-hidden className="h-9 w-9 shrink-0 bg-accent" style={{WebkitMask: 'url(/marca/pragma-simbolo.png) center / contain no-repeat', mask: 'url(/marca/pragma-simbolo.png) center / contain no-repeat'}} />
        {!mini && <span className="text-[21px] font-semibold tracking-[-0.035em] text-ink">Pragma</span>}
      </Link>

      <nav className="mt-4 flex flex-col" aria-label="Principal">
        {grupos.map(({g, lista}) => (
          <div key={g} className="mt-3">
            {mini ? <div className="mx-auto mb-2 h-px w-8 bg-line" /> : <p className="mb-1.5 px-3.5 text-[11.5px] font-bold tracking-[0.06em] text-ink-3 uppercase">{g}</p>}
            <div className="flex flex-col gap-1">
              {lista.map((it) => {
                const Icono = ICONOS[it.icono];
                const on = activo(path, it.href);
                const n = insignias[it.href] ?? 0;
                return (
                  <Link key={it.href} href={it.href} aria-current={on ? 'page' : undefined} title={mini ? it.texto : undefined} className={claseItem(on)}>
                    <Icono size={19} strokeWidth={on ? 2.2 : 1.9} />
                    {!mini && it.texto}
                    {n > 0 &&
                      (mini ? (
                        <span className="absolute top-1.5 right-3 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-surface" />
                      ) : (
                        <span className={`ml-auto rounded-full px-2 py-0.5 text-[12px] font-bold ${on ? 'bg-white/25 text-white' : 'bg-accent-soft text-accent-ink'}`}>{n}</span>
                      ))}
                  </Link>
                );
              })}
              {g === 'Seguimiento' && fichaUrl && (
                <a href={fichaUrl} target="_blank" rel="noopener noreferrer" title={mini ? 'Ficha oficial' : undefined} className={claseItem(false)}>
                  <FileText size={19} strokeWidth={1.9} />
                  {!mini && (
                    <>
                      Ficha oficial <ArrowUpRight size={15} className="ml-auto text-ink-3" />
                    </>
                  )}
                </a>
              )}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        {plan === 'gratis' &&
          (mini ? (
            <Link href="/acceso" title="Ver acceso completo" className="mx-auto grid h-11 w-11 place-items-center rounded-[13px] bg-accent-soft text-accent-ink">
              <Crown size={19} />
            </Link>
          ) : (
            <div className="relative overflow-hidden rounded-[18px] bg-[linear-gradient(150deg,#fff1eb,#ffe1d3)] p-4">
              <Crown size={22} className="text-accent" />
              <p className="mt-2 text-[15px] font-semibold text-[#171717]">Cuenta gratis</p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-[#525252]">Desbloquea todo el curso, las pruebas y los simulacros con un solo pago.</p>
              <Link href="/acceso" className="mt-3 flex h-9 items-center justify-center rounded-full bg-accent text-[13.5px] font-semibold text-white">
                Ver acceso completo
              </Link>
            </div>
          ))}
        <BotonInstalar mini={mini} />
        <div className={`flex items-center gap-2.5 border-t border-line pt-3 ${mini ? 'flex-col' : ''}`}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-[14px] font-semibold text-on-accent" title={usuario.nombre}>
            {usuario.iniciales}
          </span>
          {!mini && (
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[14px] font-semibold text-ink">{usuario.nombre}</p>
              <p className="truncate text-[12.5px] text-ink-3">{usuario.detalle}</p>
            </div>
          )}
          <TemaToggle compacto />
          <form action={accionSalir}>
            <button className="grid h-10 w-10 place-items-center rounded-ctl text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Cerrar sesión" title="Cerrar sesión">
              <LogOut size={18} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
