import type {Metadata} from 'next';
import {WifiOff} from 'lucide-react';
import {Marca} from '@/components/ui';

export const metadata: Metadata = {title: 'Sin conexión'};

// La muestra la app instalada cuando no hay internet.
export default function SinConexion() {
  return (
    <div className="grid min-h-dvh place-items-center bg-surface px-6 text-center">
      <div>
        <Marca grande />
        <span className="mx-auto mt-8 grid h-16 w-16 place-items-center rounded-full bg-accent-soft text-accent">
          <WifiOff size={28} />
        </span>
        <h1 className="mt-5 text-[24px] font-semibold tracking-[-0.03em] text-ink">No hay conexión</h1>
        <p className="mx-auto mt-2 max-w-[34ch] text-[15.5px] leading-relaxed text-ink-2">Revisa tu internet y vuelve a abrir Pragma. Tu avance está guardado.</p>
      </div>
    </div>
  );
}
