import type {Metadata} from 'next';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {sesionActual} from '@/lib/auth/cookies';
import {LECCIONES_GRATIS} from '@/lib/acceso';
import {Aviso, Marca} from '@/components/ui';
import {FormRegistro} from './form';

export const metadata: Metadata = {title: 'Empieza gratis'};

export default async function Registro() {
  if (await sesionActual()) redirect('/inicio');
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="rise w-full max-w-[420px]">
        <Link href="/" aria-label="Volver a la portada">
          <Marca grande />
        </Link>
        <div className="card mt-7 p-6 sm:p-7">
          <h1 className="text-[24px] font-semibold tracking-[-0.035em] text-ink">Empieza gratis</h1>
          <p className="mt-1 text-[15px] text-ink-2">Haz tu diagnóstico y elige {LECCIONES_GRATIS} lecciones de cualquier tema, sin pagar.</p>
          <FormRegistro />
          <p className="mt-5 text-center text-[14px] text-ink-2">
            ¿Ya tienes cuenta?{' '}
            <Link href="/ingresar" className="font-semibold text-accent-ink hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
        <div className="mt-6 px-1">
          <Aviso />
        </div>
      </div>
    </div>
  );
}
