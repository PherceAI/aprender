import type {Metadata} from 'next';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {ArrowLeft, Info} from 'lucide-react';
import {requerirUsuario} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {listarEspecialidades} from '@/lib/curso';
import {Marca} from '@/components/ui';
import {TemaToggle} from '@/components/tema-toggle';
import {ElegirEspecialidad} from './elegir';

export const metadata: Metadata = {title: 'Elige tu curso'};

// Un curso = una especialidad del Ineval, y cada docente se evalúa solo en la de su nombramiento
// (docs/investigacion-ineval.md). La misma pantalla sirve para elegir el primero y para cambiar de curso.

export default async function Bienvenida() {
  const u = await requerirUsuario();
  if (u.rol === 'admin') redirect('/admin');
  const especialidades = await listarEspecialidades(await getDb());
  const nombre = u.nombre.split(' ')[0];
  const cambiando = Boolean(u.especialidadId);
  return (
    <div className="mx-auto flex min-h-dvh max-w-[720px] flex-col px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between">
        <Marca />
        <TemaToggle compacto />
      </div>
      <div className="rise flex flex-1 flex-col justify-center py-8">
        {cambiando && (
          <Link href="/perfil" className="mb-5 inline-flex items-center gap-1.5 self-start text-[14.5px] font-semibold text-ink-2 hover:text-ink">
            <ArrowLeft size={16} /> Volver a mi perfil
          </Link>
        )}
        <h1 className="text-[30px] leading-[1.1] font-semibold tracking-[-0.04em] text-ink sm:text-[38px]">
          {cambiando ? 'Cambiar de curso' : `Hola, ${nombre}. ¿Cuál es la especialidad de tu nombramiento?`}
        </h1>
        <div className="mt-4 flex gap-3 rounded-card bg-accent-soft p-4 text-[15px] leading-relaxed text-ink">
          <Info size={19} className="mt-0.5 shrink-0 text-accent-ink" />
          <p>
            {cambiando ? (
              <>Tu avance se guarda: si vuelves a este curso, sigue ahí. Conocimientos generales es el mismo en todos los cursos. En el curso nuevo haces su diagnóstico.</>
            ) : (
              <>
                El Ineval te evalúa <b className="font-semibold text-accent-ink">solo en la especialidad de tu nombramiento</b>, aunque des varias materias. Elige esa. Los Conocimientos generales (pedagógicos y digitales) vienen en todos los cursos, y puedes cambiar de curso después.
              </>
            )}
          </p>
        </div>
        <ElegirEspecialidad
          actual={u.especialidadId}
          especialidades={especialidades.map((e) => ({id: e.id, nombre: e.nombre, nivel: e.nivel, activa: e.estado === 'activa'}))}
        />
      </div>
    </div>
  );
}
