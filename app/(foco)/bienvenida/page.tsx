import type {Metadata} from 'next';
import {redirect} from 'next/navigation';
import {requerirUsuario} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {listarEspecialidades} from '@/lib/curso';
import {Marca} from '@/components/ui';
import {TemaToggle} from '@/components/tema-toggle';
import {ElegirEspecialidad} from './elegir';

export const metadata: Metadata = {title: 'Bienvenida'};

export default async function Bienvenida() {
  const u = await requerirUsuario();
  if (u.rol === 'admin') redirect('/admin');
  const especialidades = await listarEspecialidades(await getDb());
  const nombre = u.nombre.split(' ')[0];
  return (
    <div className="mx-auto flex min-h-dvh max-w-[720px] flex-col px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between">
        <Marca />
        <TemaToggle compacto />
      </div>
      <div className="rise flex flex-1 flex-col justify-center py-10">
        <h1 className="text-[32px] leading-[1.1] font-medium tracking-[-0.04em] text-ink sm:text-[40px]">Hola, {nombre}. ¿Cuál es tu especialidad?</h1>
        <p className="mt-3 max-w-[52ch] text-[16px] leading-relaxed text-ink-2">
          Con esto armamos tu curso. Los Conocimientos generales vienen incluidos en todas.
        </p>
        <ElegirEspecialidad especialidades={especialidades.map((e) => ({id: e.id, nombre: e.nombre, nivel: e.nivel, activa: e.estado === 'activa'}))} />
      </div>
    </div>
  );
}
