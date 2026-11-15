'use client';

import {useActionState} from 'react';
import {LoaderCircle} from 'lucide-react';
import {accionCrearDocente} from '@/app/acciones';
import {btn, field} from '@/components/ui';

export function CrearDocente() {
  const [estado, enviar, enviando] = useActionState(accionCrearDocente, undefined);
  return (
    <form action={enviar} className="mt-4 flex flex-col gap-3">
      {(
        [
          ['nombre', 'Nombre', 'text', 'name'],
          ['correo', 'Correo', 'email', 'off'],
          ['clave', 'Contraseña (mínimo 8)', 'text', 'off'],
        ] as const
      ).map(([n, l, t, ac]) => (
        <div key={n} className="flex flex-col gap-1.5">
          <label htmlFor={`d-${n}`} className="text-[13.5px] font-semibold text-ink">
            {l}
          </label>
          <input id={`d-${n}`} name={n} type={t} autoComplete={ac} required className={`${field} h-11`} />
        </div>
      ))}
      {estado?.error && <p className="text-[13.5px] font-medium text-bad">{estado.error}</p>}
      {estado?.ok && <p className="text-[13.5px] font-medium text-ok">{estado.ok}</p>}
      <button className={`${btn.primary} h-11`} disabled={enviando}>
        {enviando && <LoaderCircle size={17} className="animate-spin" />} Crear cuenta
      </button>
    </form>
  );
}
