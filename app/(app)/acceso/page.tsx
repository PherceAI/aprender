import type {Metadata} from 'next';
import {Check, MessageCircle} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {LECCIONES_GRATIS, planDe} from '@/lib/acceso';
import {enlaceAcceso} from '@/lib/ficha';
import {btn} from '@/components/ui';

export const metadata: Metadata = {title: 'Acceso completo'};

const INCLUYE = [
  'Todas las lecciones de tu especialidad y de conocimientos generales',
  'La prueba de cada tema, para dejarlo dominado',
  'Simulacros con el tiempo y los formatos del examen',
  'Repaso de lo que fallas y tutor con IA',
];

export default async function Acceso() {
  const u = await requerirDocente();
  const plan = await planDe(await getDb(), u.id);
  const acceso = enlaceAcceso();

  return (
    <div className="rise mx-auto max-w-[640px]">
      <h1 className="text-[30px] font-semibold tracking-[-0.04em] text-ink sm:text-[36px]">{plan === 'completo' ? 'Tienes el acceso completo' : 'Acceso completo'}</h1>
      <p className="mt-1.5 text-[16px] text-ink-2">
        {plan === 'completo' ? 'Todo Pragma está abierto para ti.' : `Hoy tienes el diagnóstico y las primeras ${LECCIONES_GRATIS} lecciones. Con un solo pago, sin mensualidades, se abre todo:`}
      </p>
      <ul className="card mt-6 flex flex-col gap-3.5 p-6">
        {INCLUYE.map((x) => (
          <li key={x} className="flex items-start gap-3 text-[15.5px] text-ink">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-white">
              <Check size={14} strokeWidth={3} />
            </span>
            {x}
          </li>
        ))}
      </ul>
      {plan === 'gratis' &&
        (acceso ? (
          <a href={acceso} target="_blank" rel="noopener noreferrer" className={`${btn.primary} mt-6 w-full rounded-full sm:w-auto sm:px-8`}>
            <MessageCircle size={18} /> Quiero el acceso completo
          </a>
        ) : (
          <p className="mt-6 text-[15px] font-medium text-ink">Pide tu acceso completo a quien te invitó a Pragma.</p>
        ))}
    </div>
  );
}
