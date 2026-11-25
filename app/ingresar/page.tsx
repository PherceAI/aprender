import type {Metadata} from 'next';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {sesionActual} from '@/lib/auth/cookies';
import {Aviso, Marca} from '@/components/ui';
import {FormIngreso} from './form';
import {BotonGoogle} from '@/components/boton-google';
import {googleListo} from '@/lib/auth/google';
import {BotonWhatsApp} from '@/components/whatsapp';

export const metadata: Metadata = {title: 'Iniciar sesión'};

export default async function Ingresar({searchParams}: {searchParams: Promise<{google?: string}>}) {
  const {google} = await searchParams;
  if (await sesionActual()) redirect('/inicio');
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-10">
      <BotonWhatsApp />
      <div className="rise w-full max-w-[400px]">
        <Link href="/" aria-label="Volver a la portada">
          <Marca grande />
        </Link>
        <div className="card mt-7 p-6 sm:p-7">
          <h1 className="text-[24px] font-semibold tracking-[-0.035em] text-ink">Hola de nuevo</h1>
          <p className="mt-1 text-[15px] text-ink-2">{googleListo() ? 'Entra con Google o con tu correo y tu contraseña.' : 'Entra con tu correo y tu contraseña.'}</p>
          <BotonGoogle error={google === 'error' ? 'No pudimos entrar con Google. Intenta de nuevo.' : undefined} />
          <FormIngreso />
          <p className="mt-5 text-center text-[14px] text-ink-2">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="font-semibold text-accent-ink hover:underline">
              Empieza gratis
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
