import type {Metadata} from 'next';
import Link from 'next/link';
import {CheckCircle2, MessageCircle, XCircle} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {confirmarPagoTarjeta} from '@/lib/payphone';
import {ACCESO_HASTA} from '@/lib/pagos';
import {enlaceAcceso} from '@/lib/ficha';

export const metadata: Metadata = {title: 'Tu pago'};
export const dynamic = 'force-dynamic';

// La «URL de respuesta» de Payphone: llega con ?id=…&clientTransactionId=… y aquí se confirma el pago.

export default async function RespuestaPayphone({searchParams}: {searchParams: Promise<Record<string, string | undefined>>}) {
  const u = await requerirDocente();
  const q = await searchParams;
  const r = await confirmarPagoTarjeta(await getDb(), u.id, {id: q.id, clientTransactionId: q.clientTransactionId ?? q.clientTransactionID});
  const whatsapp = enlaceAcceso();

  if (r.estado === 'aprobado') {
    return (
      <div className="rise mx-auto max-w-[560px]">
        <section className="card flex flex-col items-center p-6 text-center sm:p-8">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-ok-soft text-ok">
            <CheckCircle2 size={32} />
          </span>
          <h1 className="mt-4 text-[28px] font-semibold tracking-[-0.03em] text-ink">¡Pago aprobado!</h1>
          <p className="mt-2 text-[16px] leading-relaxed text-ink-2">Ya tienes el acceso completo hasta {ACCESO_HASTA}. Todas tus lecciones, pruebas y simulacros están abiertos.</p>
          <Link href="/inicio" className="mt-6 inline-flex h-12 items-center rounded-full bg-accent px-7 text-[15.5px] font-semibold text-white">
            Seguir con mi ruta
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="rise mx-auto max-w-[560px]">
      <section className="card flex flex-col items-center p-6 text-center sm:p-8">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-bad-soft text-bad">
          <XCircle size={32} />
        </span>
        <h1 className="mt-4 text-[26px] font-semibold tracking-[-0.03em] text-ink">{r.estado === 'cancelado' ? 'El pago no se completó' : 'No pudimos confirmar el pago'}</h1>
        <p className="mt-2 text-[16px] leading-relaxed text-ink-2">
          {r.estado === 'cancelado' ? 'No se hizo ningún cobro. Puedes intentarlo de nuevo cuando quieras.' : r.mensaje}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/acceso" className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 text-[15.5px] font-semibold text-white">
            Volver a intentar
          </Link>
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line px-6 text-[15px] font-semibold text-ink">
              <MessageCircle size={17} /> Escríbenos
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
