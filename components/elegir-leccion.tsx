import Link from 'next/link';
import {ArrowLeft, Gift, Play} from 'lucide-react';
import {accionElegirLeccion} from '@/app/acciones';
import {LECCIONES_GRATIS} from '@/lib/acceso';
import {btn} from './ui';

/** Antes de abrir una lección nueva con la cuenta gratis: el docente confirma que es una de las suyas. */
export function ElegirLeccion({
  leccion,
  tema,
  restantes,
}: {
  leccion: {id: string; titulo: string; objetivo: string; minutos: number};
  tema: {id: string; nombre: string};
  restantes: number;
}) {
  const usadas = LECCIONES_GRATIS - restantes;
  return (
    <div className="rise mx-auto max-w-[560px] px-4 py-6">
      <Link href={`/curso/${tema.id}`} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-3 hover:text-ink">
        <ArrowLeft size={16} /> {tema.nombre}
      </Link>
      <div className="card mt-5 p-7 sm:p-9">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
          <Gift size={24} />
        </span>
        <h1 className="mt-5 text-[24px] leading-tight font-semibold tracking-[-0.03em] text-ink">¿Abres esta lección gratis?</h1>
        <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">
          Con tu cuenta gratis eliges {LECCIONES_GRATIS} lecciones de cualquier tema. Esta sería la {usadas + 1} de {LECCIONES_GRATIS}.
        </p>

        <div className="mt-5 rounded-[12px] bg-surface-2 px-4 py-3">
          <p className="text-[13px] font-medium text-ink-3">{tema.nombre}</p>
          <p className="mt-0.5 text-[15.5px] font-semibold text-ink">{leccion.titulo}</p>
          <p className="mt-0.5 text-[13.5px] leading-snug text-ink-2">{leccion.objetivo}</p>
        </div>

        <div className="mt-5 flex items-center gap-2" aria-label={`Has usado ${usadas} de ${LECCIONES_GRATIS} lecciones gratis`}>
          {Array.from({length: LECCIONES_GRATIS}, (_, i) => (
            <span key={i} className={`h-2 flex-1 rounded-full ${i < usadas ? 'bg-accent' : i === usadas ? 'bg-accent/40' : 'bg-line'}`} />
          ))}
        </div>
        <p className="mt-2 text-[13px] text-ink-3">
          {restantes === 1 ? 'Es tu última lección gratis.' : `Después te ${restantes - 1 === 1 ? 'queda 1' : `quedan ${restantes - 1}`}.`} Las que ya abriste quedan para siempre.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <form action={accionElegirLeccion.bind(null, leccion.id)}>
            <button type="submit" className={`${btn.primary} rounded-full px-6`}>
              <Play size={16} fill="currentColor" /> Abrir esta lección
            </button>
          </form>
          <Link href="/curso" className={`${btn.ghost} rounded-full`}>
            Elegir otra
          </Link>
        </div>
      </div>
    </div>
  );
}
