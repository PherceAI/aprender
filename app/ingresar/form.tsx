'use client';

import {useActionState} from 'react';
import {LoaderCircle} from 'lucide-react';
import {accionIngresar} from '@/app/acciones';
import {btn, field} from '@/components/ui';

export function FormIngreso() {
  const [estado, enviar, enviando] = useActionState(accionIngresar, undefined);
  return (
    <form action={enviar} className="mt-6 flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="correo" className="text-[14px] font-semibold text-ink">
          Correo
        </label>
        <input id="correo" name="correo" type="email" autoComplete="email" inputMode="email" required className={field} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="clave" className="text-[14px] font-semibold text-ink">
          Contraseña
        </label>
        <input id="clave" name="clave" type="password" autoComplete="current-password" required className={field} />
      </div>
      {estado?.error && (
        <p role="alert" className="rounded-ctl bg-bad-soft px-3.5 py-2.5 text-[14px] font-medium text-bad">
          {estado.error}
        </p>
      )}
      <button className={`${btn.primary} mt-1 w-full`} disabled={enviando}>
        {enviando ? <LoaderCircle size={18} className="animate-spin" /> : null}
        {enviando ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
