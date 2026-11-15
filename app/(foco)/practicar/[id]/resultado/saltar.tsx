'use client';

import {useState, useTransition} from 'react';
import {LoaderCircle, SkipForward} from 'lucide-react';
import {accionSaltarTema} from '@/app/acciones';
import {btn} from '@/components/ui';

export function SaltarBoton({temaId}: {temaId: string}) {
  const [pendiente, iniciar] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        disabled={pendiente}
        onClick={() =>
          iniciar(async () => {
            const r = await accionSaltarTema(temaId);
            if (r?.error) setError(r.error);
          })
        }
        className={`${btn.secondary} w-full sm:w-auto`}
      >
        {pendiente ? <LoaderCircle size={17} className="animate-spin" /> : <SkipForward size={17} />} Ya lo sé, marcarlo dominado
      </button>
      {error && <p className="text-[13.5px] text-bad">{error}</p>}
    </div>
  );
}
