import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowRight, Sprout, Trophy} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {ErrorAcademia, terminarIntento} from '@/lib/intentos';
import {mapaCurso} from '@/lib/curso';
import {preparacion} from '@/lib/dominio';
import {rutaDe} from '@/lib/ruta';
import {Anillo, Marca, btn} from '@/components/ui';
import {LeyendaDominio, MapaDominio} from '@/components/mapa-dominio';

export const metadata: Metadata = {title: 'Tu punto de partida'};

export default async function ResultadoDiagnostico({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const u = await requerirDocente();
  const db = await getDb();
  let res;
  try {
    res = await terminarIntento(db, u.id, id);
  } catch (e) {
    if (e instanceof ErrorAcademia) notFound();
    throw e;
  }
  if (res.tipo !== 'diagnostico') notFound();
  const [mapa, prep, ruta] = await Promise.all([mapaCurso(db, u.id), preparacion(db, u.id, u.especialidadId!), rutaDe(db, u.id)]);
  const unidades = mapa.bloques.flatMap((b) => b.unidades);
  const fuertes = res.ubicacion!.filter((x) => x.categoria === 'fuerte');
  const medias = res.ubicacion!.filter((x) => x.categoria === 'media');
  const debiles = res.ubicacion!.filter((x) => x.categoria === 'debil');
  const primeros = ruta.filter((r) => r.abierto).concat(ruta.filter((r) => !r.abierto)).slice(0, 3);

  return (
    <div className="mx-auto max-w-[1080px] px-4 py-6 sm:px-6 lg:py-10">
      <Marca />
      <div className="mt-8 grid items-center gap-6 sm:grid-cols-[1fr_auto]">
        <div className="rise">
          <h1 className="text-[32px] leading-[1.1] font-semibold tracking-[-0.03em] text-ink sm:text-[42px]">
            ¡Listo, {u.nombre.split(' ')[0]}! Este es tu <span className="text-resalte">punto de partida</span>.
          </h1>
          <p className="mt-3 max-w-[54ch] text-[16.5px] leading-relaxed text-ink-2">
            Cada cuadro es un tema de tu evaluación. Mientras más lleno, más lo dominas. Desde aquí armamos tu ruta.
          </p>
        </div>
        <div className="card flex items-center gap-4 p-4">
          <Anillo valor={prep} tam={104} grosor={10} etiqueta="Preparación" />
          <div>
            <p className="text-[13px] font-semibold text-ink-3">Tu preparación hoy</p>
            <p className="mt-1 max-w-[18ch] text-[14px] leading-snug text-ink-2">Sube con cada tema que dominas.</p>
          </div>
        </div>
      </div>

      <section className="card mt-8 p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-ink">Tu mapa de dominio</h2>
          <LeyendaDominio />
        </div>
        <MapaDominio unidades={unidades} revelar />
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="card p-5 sm:p-6">
          <h2 className="flex items-center gap-2.5 text-[17px] font-semibold text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-ctl bg-accent text-on-accent">
              <Trophy size={18} />
            </span>
            Lo que ya traes
          </h2>
          {fuertes.length || medias.length ? (
            <ul className="mt-4 flex flex-col gap-2.5">
              {[...fuertes, ...medias].map((x) => (
                <li key={x.unidadId} className="flex items-center justify-between gap-3 text-[15px]">
                  <span className="text-ink">{x.nombre}</span>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[12.5px] font-semibold ${x.categoria === 'fuerte' ? 'bg-accent-soft text-accent-ink' : 'bg-wip-soft text-wip'}`}>
                    {x.categoria === 'fuerte' ? 'Fuerte' : 'A medias'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-[15px] leading-relaxed text-ink-2">Todavía nada firme, y está bien: para eso es la ruta. En pocos días esto cambia.</p>
          )}
        </section>
        <section className="card p-5 sm:p-6">
          <h2 className="flex items-center gap-2.5 text-[17px] font-semibold text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-ctl bg-warm-soft text-warm">
              <Sprout size={18} />
            </span>
            Por aquí empezamos
          </h2>
          <ol className="mt-4 flex flex-col gap-2.5">
            {primeros.map((t, i) => (
              <li key={t.temaId} className="flex items-center gap-3 text-[15px]">
                <span className="num grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-2 text-[13px] font-bold text-ink-2">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate text-ink">{t.nombre}</span>
                {!t.abierto && <span className="shrink-0 text-[12.5px] text-ink-3">Próximamente</span>}
              </li>
            ))}
          </ol>
          {debiles.length > 0 && <p className="mt-4 text-[13.5px] text-ink-3">Unidades por reforzar: {debiles.map((d) => d.nombre).join(', ')}.</p>}
        </section>
      </div>

      <div className="mt-8 flex justify-end">
        <Link href="/inicio" className={`${btn.primary} w-full px-8 sm:w-auto`}>
          Empezar mi ruta <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
