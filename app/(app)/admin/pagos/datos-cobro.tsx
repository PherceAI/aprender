'use client';

import {useActionState} from 'react';
import {accionGuardarCobro, type Estado} from '@/app/acciones';
import {btn, field} from '@/components/ui';

// Los datos que ve el docente en la pantalla de pago: cuentas bancarias, link y QR de Deuna.

export function DatosCobro({cuentas, deunaLink, deunaQr}: {cuentas: string; deunaLink: string; deunaQr: string | null}) {
  const [estado, enviar, enviando] = useActionState<Estado, FormData>(accionGuardarCobro, undefined);
  return (
    <form action={enviar} className="flex flex-col gap-4">
      <div>
        <label htmlFor="cuentas" className="text-[14px] font-semibold text-ink">
          Cuentas para transferencia
        </label>
        <textarea
          id="cuentas"
          name="cuentas"
          defaultValue={cuentas}
          rows={5}
          placeholder={'Banco, tipo y número de cuenta\nTitular y cédula o RUC\nCorreo para el comprobante'}
          className={`${field} mt-1.5 h-auto py-2.5 leading-relaxed`}
        />
        <p className="mt-1 text-[13px] text-ink-3">Si lo dejas vacío, la transferencia no aparece como opción.</p>
      </div>
      <div>
        <label htmlFor="deunaLink" className="text-[14px] font-semibold text-ink">
          Link de pago de Deuna <span className="font-normal text-ink-3">(opcional)</span>
        </label>
        <input id="deunaLink" name="deunaLink" defaultValue={deunaLink} placeholder="https://…" className={`${field} mt-1.5`} />
      </div>
      <div>
        <label htmlFor="qr" className="text-[14px] font-semibold text-ink">
          QR de Deuna {deunaQr ? <span className="font-normal text-ok">(ya hay uno; sube otro para cambiarlo)</span> : <span className="font-normal text-ink-3">(imagen)</span>}
        </label>
        {deunaQr && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/api/pagos/${deunaQr}`} alt="QR de Deuna actual" className="mt-2 w-32 rounded-[10px] border border-line" />
        )}
        <input
          id="qr"
          name="qr"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="mt-1.5 block w-full text-[14px] text-ink-2 file:mr-3 file:h-10 file:rounded-full file:border-0 file:bg-surface-2 file:px-4 file:font-semibold file:text-ink"
        />
      </div>
      {estado?.error && <p className="text-[14px] font-medium text-bad">{estado.error}</p>}
      {estado?.ok && <p className="text-[14px] font-medium text-ok">{estado.ok}</p>}
      <button type="submit" disabled={enviando} className={`${btn.primary} self-start rounded-full px-6`}>
        {enviando ? 'Guardando…' : 'Guardar datos de cobro'}
      </button>
    </form>
  );
}
