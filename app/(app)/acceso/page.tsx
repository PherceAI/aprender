import type {Metadata} from 'next';
import {Building2, Check, Clock, CreditCard, ExternalLink, MessageCircle, QrCode, XCircle} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {LECCIONES_GRATIS, planDe} from '@/lib/acceso';
import {enlaceAcceso} from '@/lib/ficha';
import {ACCESO_HASTA, datosCobro, precioTexto, ultimoPago} from '@/lib/pagos';
import {CAJITA_CSS, CAJITA_JS, configPayphone, datosCajita} from '@/lib/payphone';
import {AvisoPago} from './aviso-pago';
import {CajitaPayphone} from './cajita-payphone';

export const metadata: Metadata = {title: 'Acceso completo'};

// El pago único: precio, qué incluye y cómo pagar (Deuna o transferencia, que el administrador confirma).

const INCLUYE = [
  'Todas las lecciones de tu especialidad y de conocimientos generales',
  'La prueba de cada tema, para dejarlo dominado',
  'Simulacros con el tiempo y los formatos del examen',
  'Repaso de lo que fallas y tutor con IA',
];

export default async function Acceso() {
  const u = await requerirDocente();
  const db = await getDb();
  const [plan, pago, cobro] = await Promise.all([planDe(db, u.id), ultimoPago(db, u.id), datosCobro(db)]);
  const whatsapp = enlaceAcceso();

  if (plan === 'completo') {
    return (
      <div className="rise mx-auto max-w-[640px]">
        <h1 className="text-[30px] font-semibold tracking-[-0.04em] text-ink sm:text-[36px]">Tienes el acceso completo</h1>
        <p className="mt-1.5 text-[16px] text-ink-2">Todo Pragma está abierto para ti hasta {ACCESO_HASTA}.</p>
      </div>
    );
  }

  const hayDeuna = Boolean(cobro.deunaQr || cobro.deunaLink);
  const hayCuentas = Boolean(cobro.cuentas);
  const metodos = [...(hayDeuna ? [{id: 'deuna' as const, texto: 'Deuna'}] : []), ...(hayCuentas ? [{id: 'transferencia' as const, texto: 'Transferencia'}] : [])];
  // Tarjeta con Payphone: solo si están PAYPHONE_TOKEN y PAYPHONE_STORE_ID. Abre todo al instante, sin revisión.
  const payphone = configPayphone();

  return (
    <div className="rise mx-auto flex max-w-[860px] flex-col gap-5">
      <section className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(125deg,#d9300a_0%,#ec4416_60%,#f25d2a_100%)] p-6 text-white sm:p-8">
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] sm:text-[34px]">Acceso completo</h1>
        <p className="mt-1 text-[15.5px] text-white">Hoy tienes el diagnóstico, {LECCIONES_GRATIS} lecciones a tu elección y un simulacro. Con un solo pago se abre todo.</p>
        <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-1">
          <p className="num text-[52px] leading-none font-semibold tracking-[-0.04em]">{precioTexto()}</p>
          <p className="pb-1.5 text-[15px] font-medium text-white">Pago único, IVA incluido. Acceso hasta {ACCESO_HASTA}.</p>
        </div>
        <ul className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-2.5 sm:grid-cols-2">
          {INCLUYE.map((x) => (
            <li key={x} className="flex items-start gap-2.5 text-[15px] text-white">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-accent">
                <Check size={12} strokeWidth={3} />
              </span>
              {x}
            </li>
          ))}
        </ul>
      </section>

      {payphone && (
        <section className="card p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-[18px] font-semibold text-ink">
            <CreditCard size={19} className="text-accent" /> Paga con tarjeta
          </h2>
          <p className="mt-1 text-[15px] text-ink-2">Débito o crédito, con el pago seguro de Payphone. Se abre todo al instante.</p>
          <CajitaPayphone datos={datosCajita(u.id, payphone)} js={CAJITA_JS} css={CAJITA_CSS} precio={precioTexto()} />
        </section>
      )}

      {pago?.estado === 'pendiente' ? (
        <section className="card flex items-start gap-4 p-5 sm:p-6">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
            <Clock size={20} />
          </span>
          <div>
            <h2 className="text-[18px] font-semibold text-ink">Estamos verificando tu pago</h2>
            <p className="mt-1 text-[15px] text-ink-2">Recibimos tu aviso. Apenas confirmemos el pago se abre todo, sin que tengas que hacer nada más.</p>
          </div>
        </section>
      ) : (
        <>
          {pago?.estado === 'rechazado' && (
            <section className="flex items-start gap-3 rounded-[16px] bg-bad-soft p-4 text-bad">
              <XCircle size={20} className="mt-0.5 shrink-0" />
              <p className="text-[15px]">
                <strong>No pudimos confirmar tu pago anterior.</strong> {pago.nota} Revisa los datos y vuelve a avisarnos.
              </p>
            </section>
          )}

          {metodos.length === 0 && payphone ? null : metodos.length === 0 ? (
            <section className="card p-5 sm:p-6">
              <h2 className="text-[18px] font-semibold text-ink">Muy pronto podrás pagar aquí</h2>
              <p className="mt-1 text-[15px] text-ink-2">Estamos terminando de habilitar los pagos.</p>
              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-[15px] font-semibold text-white">
                  <MessageCircle size={17} /> Escríbenos por WhatsApp
                </a>
              )}
            </section>
          ) : (
            <>
              {payphone && <p className="mt-2 text-[15px] font-semibold text-ink-2">¿Prefieres Deuna o transferencia?</p>}
              <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-ink">1. Paga {precioTexto()} por uno de estos medios</h2>
              <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
                {hayDeuna && (
                  <section className="card flex flex-col p-5 sm:p-6">
                    <h3 className="flex items-center gap-2 text-[17px] font-semibold text-ink">
                      <QrCode size={19} className="text-accent" /> Deuna
                    </h3>
                    <p className="mt-1 text-[14.5px] text-ink-2">Escanea el QR desde Deuna o desde la app de tu banco o cooperativa.</p>
                    {cobro.deunaQr && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/api/pagos/${cobro.deunaQr}`} alt="Código QR de Deuna para pagar" className="mx-auto mt-4 w-full max-w-[240px] rounded-[14px] border border-line" />
                    )}
                    {cobro.deunaLink && (
                      <a href={cobro.deunaLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-accent px-5 text-[15px] font-semibold text-accent-ink hover:bg-accent-soft">
                        Pagar con Deuna <ExternalLink size={16} />
                      </a>
                    )}
                  </section>
                )}
                {hayCuentas && (
                  <section className="card flex flex-col p-5 sm:p-6">
                    <h3 className="flex items-center gap-2 text-[17px] font-semibold text-ink">
                      <Building2 size={19} className="text-accent" /> Transferencia o depósito
                    </h3>
                    <p className="mt-1 text-[14.5px] text-ink-2">Transfiere el valor exacto a esta cuenta:</p>
                    <p className="mt-3 rounded-[12px] bg-surface-2 px-4 py-3 text-[15px] leading-relaxed whitespace-pre-line text-ink select-all">{cobro.cuentas}</p>
                  </section>
                )}
              </div>

              <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.02em] text-ink">2. Avísanos que pagaste</h2>
              <section className="card p-5 sm:p-6">
                <AvisoPago metodos={metodos} />
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}
