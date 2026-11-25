'use client';

import {useEffect} from 'react';
import Link from 'next/link';
import {RotateCcw} from 'lucide-react';

// Si una pantalla falla, el docente ve un mensaje claro en español y puede reintentar sin perder la sesión.
export default function ErrorPantalla({error, reset}: {error: Error & {digest?: string}; reset: () => void}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="grid min-h-[70dvh] place-items-center px-4 py-10">
      <div className="w-full max-w-[420px] text-center">
        <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-ink">Algo no salió bien</h1>
        <p className="mt-2 text-[15.5px] text-ink-2">Tu avance está guardado. Intenta de nuevo; si sigue pasando, vuelve al inicio.</p>
        {error.digest && <p className="mt-2 text-[12.5px] text-ink-3">Código: {error.digest}</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-[15px] font-semibold text-white">
            <RotateCcw size={17} /> Intentar de nuevo
          </button>
          <Link href="/inicio" className="inline-flex h-12 items-center rounded-full border border-line px-6 text-[15px] font-semibold text-ink">
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
