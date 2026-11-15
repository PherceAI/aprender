'use client';

import {useTransition} from 'react';
import {Check, LoaderCircle} from 'lucide-react';
import {accionCompletarLeccion} from '@/app/acciones';

export function CompletarLeccion({leccionId, despues, siguiente, completada}: {leccionId: string; despues: string; siguiente: string | null; completada: boolean}) {
  const [pendiente, iniciar] = useTransition();
  return (
    <button
      type="button"
      disabled={pendiente}
      onClick={() => iniciar(() => accionCompletarLeccion(leccionId, despues))}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-ctl border border-current/25 px-5 text-[15px] font-semibold transition-colors hover:bg-white/10 active:translate-y-px"
    >
      {pendiente ? <LoaderCircle size={18} className="animate-spin" /> : <Check size={18} />}
      {completada ? (siguiente ? 'Ir a la siguiente lección' : 'Volver al tema') : siguiente ? 'Marcar vista y seguir' : 'Marcar vista'}
    </button>
  );
}
