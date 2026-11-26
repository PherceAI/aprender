'use client';

import {useActionState} from 'react';
import {LoaderCircle} from 'lucide-react';
import {accionRegistrar} from '@/app/acciones';
import {btn, field} from '@/components/ui';

export function FormRegistro({correo = ''}: {correo?: string}) {
  const [estado, enviar, enviando] = useActionState(accionRegistrar, undefined);
  return (
    <form action={enviar} className="mt-6 flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="nombre" className="text-[14px] font-semibold text-ink">
          Tu nombre
        </label>
        <input id="nombre" name="nombre" autoComplete="name" required maxLength={80} className={field} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="correo" className="text-[14px] font-semibold text-ink">
          Correo
        </label>
        <input id="correo" name="correo" type="email" autoComplete="email" inputMode="email" required defaultValue={correo} className={field} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="clave" className="text-[14px] font-semibold text-ink">
          Contraseña
        </label>
        <input id="clave" name="clave" type="password" autoComplete="new-password" required minLength={8} className={field} />
        <p className="text-[13px] text-ink-3">Al menos 8 caracteres.</p>
      </div>
      {estado?.error && (
        <p role="alert" className="rounded-ctl bg-bad-soft px-3.5 py-2.5 text-[14px] font-medium text-bad">
          {estado.error}
        </p>
      )}
      <button className={`${btn.primary} mt-1 w-full`} disabled={enviando}>
        {enviando ? <LoaderCircle size={18} className="animate-spin" /> : null}
        {enviando ? 'Creando tu cuenta…' : 'Crear mi cuenta gratis'}
      </button>
    </form>
  );
}
