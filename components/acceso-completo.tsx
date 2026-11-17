import Link from 'next/link';
import {ArrowLeft, Lock, MessageCircle} from 'lucide-react';
import {enlaceAcceso} from '@/lib/ficha';
import {LECCIONES_GRATIS} from '@/lib/acceso';
import {btn} from './ui';

/** Lo que ve un docente con cuenta gratis cuando llega a algo del acceso completo. */
export function AccesoCompleto({volver, texto}: {volver: {href: string; texto: string}; texto: string}) {
  const acceso = enlaceAcceso();
  return (
    <div className="rise mx-auto max-w-[560px] py-6">
      <Link href={volver.href} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-3 hover:text-ink">
        <ArrowLeft size={16} /> {volver.texto}
      </Link>
      <div className="card mt-5 p-7 text-center sm:p-9">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
          <Lock size={24} />
        </span>
        <h1 className="mt-5 text-[24px] font-semibold tracking-[-0.03em] text-ink">{texto}</h1>
        <p className="mx-auto mt-2 max-w-[42ch] text-[15.5px] leading-relaxed text-ink-2">
          Con tu cuenta gratis tienes el diagnóstico y {LECCIONES_GRATIS} lecciones a tu elección. Desbloquea todo el curso, las pruebas y los simulacros con un solo pago.
        </p>
        {acceso ? (
          <a href={acceso} target="_blank" rel="noopener noreferrer" className={`${btn.primary} mt-6 px-6`}>
            <MessageCircle size={18} /> Quiero el acceso completo
          </a>
        ) : (
          <p className="mt-6 text-[14px] font-medium text-ink">Pide tu acceso completo a quien te invitó a Pragma.</p>
        )}
      </div>
    </div>
  );
}
