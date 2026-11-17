import Link from 'next/link';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {LogOut} from 'lucide-react';
import {accionSalir} from '@/app/acciones';
import {requerirUsuario} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {planDe} from '@/lib/acceso';
import {contarPendientes} from '@/lib/repaso';
import {enlaceFicha} from '@/lib/ficha';
import {Marca} from '@/components/ui';
import {NavInferior, type ItemNav} from '@/components/nav';
import {BarraLateral, type ItemBarra} from '@/components/barra-lateral';
import {BotonInstalar} from '@/components/instalar';
import {TemaToggle} from '@/components/tema-toggle';

// El cascarón de la plataforma: barra lateral plegable en computadora y barra inferior en el teléfono.

const DOCENTE: ItemBarra[] = [
  {href: '/inicio', texto: 'Inicio', icono: 'inicio', grupo: 'Aprender'},
  {href: '/curso', texto: 'Mi ruta', icono: 'ruta', grupo: 'Aprender'},
  {href: '/repaso', texto: 'Repaso', icono: 'repaso', grupo: 'Aprender'},
  {href: '/simulacro', texto: 'Simulacros', icono: 'simulacro', grupo: 'Aprender'},
  {href: '/perfil', texto: 'Mi progreso', icono: 'progreso', grupo: 'Seguimiento'},
  {href: '/evaluacion', texto: 'Tu evaluación', icono: 'evaluacion', grupo: 'Seguimiento'},
];
const ADMIN: ItemBarra[] = [{href: '/admin', texto: 'Panel', icono: 'admin', grupo: 'Aprender'}];
const CORTOS: Record<string, string> = {'/curso': 'Ruta', '/simulacro': 'Simulacro', '/perfil': 'Progreso'};

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
  const insignias = {'/repaso': Math.min(pendientes, 10)};
  const mini = (await cookies()).get('barra')?.value === 'mini';
  const itemsMovil: ItemNav[] = items.filter((i) => i.href !== '/evaluacion').map((i) => ({href: i.href, texto: i.texto, corto: CORTOS[i.href], icono: i.icono}));

  return (
    <div id="cascaron" className="min-h-dvh bg-bg" style={{'--barra': mini ? '84px' : '264px'} as React.CSSProperties}>
      <BarraLateral
        items={items}
        insignias={insignias}
        fichaUrl={esDocente ? enlaceFicha(1) : null}
        plan={plan}
        usuario={{nombre: u.nombre, iniciales: iniciales(u.nombre), detalle: esDocente ? 'Ciencias Naturales' : 'Administración'}}
        inicialMini={mini}
      />

      <div className="min-w-0 transition-[padding] duration-200 lg:pl-[var(--barra)]">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur-md lg:hidden">
          <Link href={esDocente ? '/inicio' : '/admin'}>
            <Marca />
          </Link>
          <div className="flex items-center">
            <BotonInstalar compacto />
            <TemaToggle compacto />
            <form action={accionSalir}>
              <button className="grid h-10 w-10 place-items-center rounded-ctl text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label="Cerrar sesión" title="Cerrar sesión">
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1320px] px-4 pt-5 pb-28 sm:px-6 lg:px-8 lg:pt-7 lg:pb-12">{children}</main>
      </div>
      <NavInferior items={itemsMovil} insignias={insignias} />
    </div>
  );
}
