import Link from 'next/link';
import {redirect} from 'next/navigation';
import {ArrowUpRight, FileText, LogOut} from 'lucide-react';
import {accionSalir} from '@/app/acciones';
import {requerirUsuario} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {planDe} from '@/lib/acceso';
import {contarPendientes} from '@/lib/repaso';
import {enlaceFicha} from '@/lib/ficha';
import {Marca} from '@/components/ui';
import {NavInferior, NavLateral, type ItemNav} from '@/components/nav';
import {TemaToggle} from '@/components/tema-toggle';

// El cascarón de la plataforma: barra lateral fija en computadora y barra inferior en el teléfono.
// Cinco destinos con nombres que dicen lo que hay: Inicio, Mi ruta, Repaso, Simulacros y Mi progreso.

const DOCENTE: ItemNav[] = [
  {href: '/inicio', texto: 'Inicio', icono: 'inicio'},
  {href: '/curso', texto: 'Mi ruta', corto: 'Ruta', icono: 'ruta'},
  {href: '/repaso', texto: 'Repaso', icono: 'repaso'},
  {href: '/simulacro', texto: 'Simulacros', corto: 'Simulacro', icono: 'simulacro'},
  {href: '/perfil', texto: 'Mi progreso', corto: 'Progreso', icono: 'progreso'},
];
const ADMIN: ItemNav[] = [{href: '/admin', texto: 'Panel', icono: 'admin'}];

function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
}

export default async function LayoutApp({children}: {children: React.ReactNode}) {
  const u = await requerirUsuario();
  if (u.rol === 'docente' && !u.especialidadId) redirect('/bienvenida');
  const esDocente = u.rol === 'docente';
  const items = esDocente ? DOCENTE : ADMIN;
  const db = await getDb();
  const [plan, pendientes] = esDocente ? await Promise.all([planDe(db, u.id), contarPendientes(db, u.id, new Date())]) : ['completo' as const, 0];
  const insignias = {'/repaso': pendientes};

  return (
    <div className="min-h-dvh bg-bg">
      <div className="fixed inset-y-0 left-0 z-30 hidden w-[264px] lg:block">
        <aside className="flex h-full flex-col border-r border-line bg-surface px-4 py-6">
          <Link href={esDocente ? '/inicio' : '/admin'} className="px-2">
            <Marca />
          </Link>
          <div className="mt-8">
            <NavLateral items={items} insignias={insignias} />
            {esDocente && (
              <a
                href={enlaceFicha(1)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex h-12 items-center gap-3 rounded-[12px] px-4 text-[15px] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <FileText size={19} strokeWidth={1.9} /> Ficha oficial <ArrowUpRight size={15} className="ml-auto text-ink-3" />
              </a>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-4">
            {esDocente && plan === 'gratis' && (
              <div className="rounded-[16px] bg-accent-soft p-4">
                <p className="text-[15px] font-semibold text-ink">Cuenta gratis</p>
                <p className="mt-1 text-[13px] leading-snug text-ink-2">Desbloquea todo el curso, las pruebas y los simulacros con un solo pago.</p>
                <Link href="/acceso" className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-full bg-accent text-[13.5px] font-semibold text-white">
                  Ver acceso completo
                </Link>
              </div>
            )}
            <div className="flex items-center gap-3 border-t border-line pt-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-[14px] font-semibold text-on-accent">{iniciales(u.nombre)}</span>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-[14px] font-semibold text-ink">{u.nombre}</p>
                <p className="truncate text-[12.5px] text-ink-3">{esDocente ? 'Ciencias Naturales' : 'Administración'}</p>
              </div>
              <TemaToggle compacto />
              <form action={accionSalir}>
                <button className="grid h-10 w-10 place-items-center rounded-ctl text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Cerrar sesión" title="Cerrar sesión">
                  <LogOut size={18} />
                </button>
              </form>
            </div>
          </div>
        </aside>
      </div>

      <div className="min-w-0 lg:pl-[264px]">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-bg/90 px-4 backdrop-blur-md lg:hidden">
          <Link href={esDocente ? '/inicio' : '/admin'}>
            <Marca />
          </Link>
          <div className="flex items-center">
            <TemaToggle compacto />
            <form action={accionSalir}>
              <button className="grid h-10 w-10 place-items-center rounded-ctl text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Cerrar sesión" title="Cerrar sesión">
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1180px] px-4 pt-5 pb-28 sm:px-6 lg:px-9 lg:pt-8 lg:pb-12">{children}</main>
      </div>
      <NavInferior items={items} insignias={insignias} />
    </div>
  );
}
