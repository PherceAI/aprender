'use client';

import {useActionState, useState} from 'react';
import {Send} from 'lucide-react';
import {accionAvisarPago, type Estado} from '@/app/acciones';
import {btn, field} from '@/components/ui';

// «Ya pagué»: el docente dice cómo pagó y deja el número o la foto del comprobante.

export function AvisoPago({metodos}: {metodos: {id: 'deuna' | 'transferencia'; texto: string}[]}) {
  const [estado, enviar, enviando] = useActionState<Estado, FormData>(accionAvisarPago, undefined);
  const [metodo, setMetodo] = useState(metodos[0]?.id ?? 'transferencia');

  if (estado?.ok) {
    return <p className="rounded-[14px] bg-ok-soft px-4 py-3.5 text-[15px] font-medium text-ok">{estado.ok}</p>;
  }

  return (
    <form action={enviar} className="flex flex-col gap-4">
      <fieldset>
        <legend className="text-[14px] font-semibold text-ink">¿Cómo pagaste?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {metodos.map((m) => (
            <label key={m.id} className={`inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-[14.5px] font-semibold ${metodo === m.id ? 'border-accent bg-accent-soft text-accent-ink' : 'border-line bg-surface text-ink-2'}`}>
              <input type="radio" name="metodo" value={m.id} checked={metodo === m.id} onChange={() => setMetodo(m.id)} className="sr-only" />
              {m.texto}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="referencia" className="text-[14px] font-semibold text-ink">
          Número de comprobante
        </label>
        <input id="referencia" name="referencia" className={`${field} mt-1.5`} placeholder="El que aparece en tu comprobante" autoComplete="off" />
      </div>

      <div>
        <label htmlFor="comprobante" className="text-[14px] font-semibold text-ink">
          Foto del comprobante <span className="font-normal text-ink-3">(opcional si escribiste el número)</span>
        </label>
        <input
          id="comprobante"
          name="comprobante"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="mt-1.5 block w-full text-[14px] text-ink-2 file:mr-3 file:h-10 file:rounded-full file:border-0 file:bg-surface-2 file:px-4 file:font-semibold file:text-ink"
        />
      </div>

      {estado?.error && <p className="text-[14px] font-medium text-bad">{estado.error}</p>}

      <button type="submit" disabled={enviando} className={`${btn.primary} rounded-full`}>
        <Send size={17} /> {enviando ? 'Enviando…' : 'Ya pagué, avisar'}
      </button>
    </form>
  );
}
