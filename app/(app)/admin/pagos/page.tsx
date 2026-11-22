import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowLeft, Check, FileImage, X} from 'lucide-react';
import {accionAprobarPago, accionRechazarPago} from '@/app/acciones';
import {requerirAdmin} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {datosCobro, pagosParaRevisar, precioTexto} from '@/lib/pagos';
import {field} from '@/components/ui';
import {DatosCobro} from './datos-cobro';

export const metadata: Metadata = {title: 'Pagos'};

// Pagos por Deuna y transferencia: el administrador revisa el comprobante y aprueba (se abre todo) o rechaza.

const METODO: Record<string, string> = {deuna: 'Deuna', transferencia: 'Transferencia', tarjeta: 'Tarjeta'};
const ESTADO: Record<string, string> = {pendiente: 'bg-accent-soft text-accent-ink', aprobado: 'bg-ok-soft text-ok', rechazado: 'bg-bad-soft text-bad'};

function fecha(d: Date) {
  return new Intl.DateTimeFormat('es-EC', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Guayaquil'}).format(d);
}

export default async function Pagos() {
  await requerirAdmin();
  const db = await getDb();
  const [lista, cobro] = await Promise.all([pagosParaRevisar(db), datosCobro(db)]);
  const pendientes = lista.filter((p) => p.estado === 'pendiente').length;

  return (
    <div className="rise flex flex-col gap-5">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-3 hover:text-ink">
        <ArrowLeft size={16} /> Panel
      </Link>
      <div>
        <h1 className="text-[30px] font-semibold tracking-[-0.04em] text-ink sm:text-[34px]">Pagos</h1>
        <p className="mt-1.5 text-[15.5px] text-ink-2">
          <span className="num">{pendientes}</span> por revisar. Precio: {precioTexto()} con IVA, pago único. Al aprobar, se abre todo para el docente.
        </p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section className="flex flex-col gap-3">
          {lista.length === 0 && <p className="card p-6 text-center text-[15px] text-ink-2">Todavía no hay pagos.</p>}
          {lista.map((p) => (
            <article key={p.id} className="card p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className={`rounded-full px-2.5 py-0.5 text-[12.5px] font-semibold capitalize ${ESTADO[p.estado]}`}>{p.estado}</span>
                <span className="font-semibold text-ink">{p.nombre}</span>
                <span className="text-[13.5px] text-ink-3">{p.correo}</span>
              </div>
              <p className="mt-2 text-[14.5px] text-ink-2">
                {METODO[p.metodo]} · <span className="num">${(p.monto / 100).toFixed(2)}</span> · {fecha(p.creado)}
                {p.referencia && (
                  <>
                    {' '}
                    · Comprobante <span className="font-semibold text-ink">{p.referencia}</span>
                  </>
                )}
              </p>
              {p.archivo && (
                <a href={`/api/pagos/${p.archivo}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent-ink hover:underline">
                  <FileImage size={16} /> Ver foto del comprobante
                </a>
              )}
              {p.estado === 'rechazado' && p.nota && <p className="mt-1 text-[13.5px] text-bad">Motivo: {p.nota}</p>}
              {p.estado === 'pendiente' && (
                <div className="mt-3 flex flex-wrap items-start gap-2">
                  <form action={accionAprobarPago.bind(null, p.id)}>
                    <button className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ok px-4 text-[14px] font-semibold text-white">
                      <Check size={16} /> Aprobar y abrir todo
                    </button>
                  </form>
                  <form action={accionRechazarPago.bind(null, p.id)} className="flex min-w-0 flex-1 flex-wrap gap-2">
                    <input name="nota" placeholder="Motivo del rechazo" aria-label="Motivo del rechazo" className={`${field} h-10 min-w-0 flex-1 text-[14px]`} />
                    <button className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-4 text-[14px] font-semibold text-bad hover:bg-bad-soft">
                      <X size={16} /> Rechazar
                    </button>
                  </form>
                </div>
              )}
            </article>
          ))}
        </section>

        <section className="card h-fit p-5 sm:p-6">
          <h2 className="text-[17px] font-semibold text-ink">Datos de cobro</h2>
          <p className="mt-1 mb-4 text-[14px] text-ink-2">Lo que ve el docente en la pantalla de pago.</p>
          <DatosCobro cuentas={cobro.cuentas} deunaLink={cobro.deunaLink} deunaQr={cobro.deunaQr} />
        </section>
      </div>
    </div>
  );
}
