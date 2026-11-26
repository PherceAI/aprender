'use client';

import {useEffect, useState} from 'react';
import {CreditCard, LoaderCircle} from 'lucide-react';

// La Cajita de Pagos de Payphone (docs.payphone.app/cajita-de-pagos). Se carga solo cuando el docente
// toca «Pagar con tarjeta», para no traer el script de Payphone a quien no lo va a usar.

type Datos = Record<string, string | number>;
type Cajita = new (datos: Datos) => {render: (id: string) => void};

export function CajitaPayphone({datos, js, css, precio}: {datos: Datos; js: string; css: string; precio: string}) {
  const [abierta, setAbierta] = useState(false);
  const [estado, setEstado] = useState<'cargando' | 'lista' | 'error'>('cargando');

  useEffect(() => {
    if (!abierta) return;
    if (!document.querySelector(`link[href="${css}"]`)) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = css;
      document.head.appendChild(l);
    }
    const pintar = () => {
      const PPaymentButtonBox = (window as unknown as {PPaymentButtonBox?: Cajita}).PPaymentButtonBox;
      if (!PPaymentButtonBox) return setEstado('error');
      try {
        new PPaymentButtonBox(datos).render('pp-button');
        setEstado('lista');
      } catch {
        setEstado('error');
      }
    };
    if ((window as unknown as {PPaymentButtonBox?: Cajita}).PPaymentButtonBox) return pintar();
    const s = document.createElement('script');
    s.type = 'module';
    s.src = js;
    s.onload = pintar;
    s.onerror = () => setEstado('error');
    document.head.appendChild(s);
  }, [abierta, datos, js, css]);

  if (!abierta) {
    return (
      <button type="button" onClick={() => setAbierta(true)} className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 text-[15.5px] font-semibold text-white active:translate-y-px sm:w-auto">
        <CreditCard size={18} /> Pagar {precio} con tarjeta
      </button>
    );
  }
  return (
    <div className="mt-4">
      {estado === 'cargando' && (
        <p className="flex items-center gap-2 text-[14.5px] text-ink-2">
          <LoaderCircle size={17} className="animate-spin" /> Abriendo el pago seguro de Payphone…
        </p>
      )}
      {estado === 'error' && <p className="text-[14.5px] text-bad">No pudimos abrir el pago con tarjeta. Recarga la página o paga con Deuna o transferencia.</p>}
      <div id="pp-button" className="min-w-0" />
    </div>
  );
}
