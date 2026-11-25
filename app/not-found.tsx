import Link from 'next/link';
import {Marca, btn} from '@/components/ui';

// Página no encontrada, en español y con la marca.
export default function NoEncontrada() {
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-[420px] text-center">
        <div className="flex justify-center">
          <Marca grande />
        </div>
        <h1 className="mt-8 text-[26px] font-semibold tracking-[-0.03em] text-ink">No encontramos esta página</h1>
        <p className="mt-2 text-[15.5px] text-ink-2">Puede que el enlace esté mal escrito o que la página ya no exista.</p>
        <Link href="/" className={`${btn.primary} mt-6 rounded-full px-6`}>
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
