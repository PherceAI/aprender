import {redirect} from 'next/navigation';
import {LogOut} from 'lucide-react';
import {accionSalir} from '@/app/acciones';
import {requerirUsuario} from '@/lib/auth/cookies';
import {Marca} from '@/components/ui';
import {NavInferior, NavLateral, type ItemNav} from '@/components/nav';
import {TemaToggle} from '@/components/tema-toggle';

const DOCENTE: ItemNav[] = [
  {href: '/inicio', texto: 'Inicio', icono: 'inicio'},
  {href: '/curso', texto: 'Curso', icono: 'curso'},
  {href: '/simulacro', texto: 'Simulacro', icono: 'simulacro'},
  {href: '/perfil', texto: 'Perfil', icono: 'perfil'},
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
  const items = u.rol === 'admin' ? ADMIN : DOCENTE;

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[272px_1fr]">
      {/* Barra lateral flotante (referencia DoDo): tarjeta redondeada con la persona arriba. */}
      <div className="sticky top-0 hidden h-dvh lg:block">
        <aside className="flex h-full flex-col border-r border-line bg-surface px-4 py-6">
          <Marca className="px-2" />
          <div className="mt-7 flex flex-col items-center text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-[20px] font-semibold text-on-accent">{iniciales(u.nombre)}</span>
            <p className="mt-3 max-w-full truncate text-[15px] font-semibold text-ink">{u.nombre}</p>
            <p className="max-w-full truncate text-[12.5px] text-ink-3">{u.rol === 'admin' ? 'Administración' : 'Docente · Ciencias Naturales'}</p>
          </div>
          <div className="mt-7 flex-1">
            <NavLateral items={items} />
          </div>
          <div className="flex items-center justify-between border-t border-line pt-4">
            <TemaToggle />
            <form action={accionSalir}>
              <button className="grid h-10 w-10 place-items-center rounded-ctl text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Cerrar sesión" title="Cerrar sesión">
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </aside>
      </div>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-bg/90 px-4 backdrop-blur-md lg:hidden">
          <Marca />
          <div className="flex items-center">
            <TemaToggle compacto />
            <form action={accionSalir}>
              <button className="grid h-10 w-10 place-items-center rounded-ctl text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Cerrar sesión" title="Cerrar sesión">
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1180px] px-4 pt-5 pb-28 sm:px-6 lg:px-8 lg:pt-8 lg:pb-12">{children}</main>
      </div>
      <NavInferior items={items} />
    </div>
  );
}
