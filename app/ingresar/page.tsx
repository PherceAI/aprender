import type {Metadata} from 'next';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {sesionActual} from '@/lib/auth/cookies';
import {Aviso, Marca} from '@/components/ui';
import {FormIngreso} from './form';

export const metadata: Metadata = {title: 'Iniciar sesión'};

export default async function Ingresar() {
  if (await sesionActual()) redirect('/inicio');
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="rise w-full max-w-[400px]">
        <Link href="/" aria-label="Volver a la portada">
          <Marca grande />
        </Link>
        <div className="card mt-7 p-6 sm:p-7">
          <h1 className="text-[24px] font-medium tracking-[-0.04em] text-ink">Hola de nuevo</h1>
          <p className="mt-1 text-[15px] text-ink-2">Entra con el correo y la contraseña que te dimos.</p>
          <FormIngreso />
        </div>
        <div className="mt-6 px-1">
          <Aviso />
        </div>
      </div>
    </div>
  );
}
