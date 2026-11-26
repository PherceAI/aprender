import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowRight, ChevronDown, Target, Trophy} from 'lucide-react';
import {RevisionRespuestas} from '@/components/revision-respuestas';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {ErrorAcademia, terminarIntento} from '@/lib/intentos';
import {mapaCurso} from '@/lib/curso';
import {rutaDe} from '@/lib/ruta';
import {Barra, Marca, btn} from '@/components/ui';
import {LeyendaDominio, MapaDominio} from '@/components/mapa-dominio';
import {PuntajeIneval} from '@/components/puntaje-ineval';
import {pruebasDe} from '@/lib/evaluacion';

export const metadata: Metadata = {title: 'Tu punto de partida'};

// El informe del diagnóstico. Arriba, solo lo importante: su puntaje y el botón para seguir.
// El detalle (tema por tema y las respuestas) queda plegado, para no abrumar a quien recién empieza.

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
  const [mapa, ruta] = await Promise.all([mapaCurso(db, u.id), rutaDe(db, u.id)]);
  const unidades = mapa.bloques.flatMap((b) => b.unidades);

  // Aciertos por prueba (Conocimientos generales y de la especialidad).
  const porPrueba = mapa.bloques.map((b) => {
    const ids = new Set(b.unidades.map((x) => x.id));
    const partes = res.porUnidad.filter((x) => ids.has(x.id));
    const aciertos = partes.reduce((s, x) => s + x.aciertos, 0);
    const total = partes.reduce((s, x) => s + x.total, 0);
    return {id: b.id, nombre: b.nombre, aciertos, total};
  });
  const fuertes = res.porTema.filter((t) => t.total > 0 && t.aciertos === t.total);
  const reforzar = res.porTema.filter((t) => t.aciertos === 0);
  const primeros = ruta.filter((r) => r.abierto).concat(ruta.filter((r) => !r.abierto)).slice(0, 3);
  const fallas = res.total - res.aciertos;
  // Puntaje estimado: el acierto de cada prueba, pesado con sus preguntas en el examen real (39 y 60).
  const examen = pruebasDe(u.especialidadId);
  const pesoTotal = examen.reduce((s, x) => s + x.preguntas, 0);
  const pctExamen = porPrueba.reduce((s, x, i) => s + (x.total ? x.aciertos / x.total : 0) * (examen[i]?.preguntas ?? 0), 0) / (pesoTotal || 1) * 100;
  const totalTemas = unidades.reduce((s, x) => s + x.temas.length, 0);

  return (
    <div className="mx-auto max-w-[860px] px-4 py-6 sm:px-6 lg:py-10">
      <Marca />

      <div className="rise mt-6">
        <h1 className="text-[30px] leading-[1.1] font-semibold tracking-[-0.04em] text-ink sm:text-[40px]">
          ¡Listo, {u.nombre.split(' ')[0]}! Este es tu <span className="text-accent">punto de partida</span>.
        </h1>
        <p className="mt-2 text-[17px] text-ink-2">
          Respondiste bien <strong className="text-ink">{res.aciertos} de {res.total}</strong> preguntas.
        </p>
      </div>

      <PuntajeIneval porcentaje={pctExamen} titulo="Si el examen fuera hoy, tu puntaje estimado sería" className="mt-5" compacto />

      {/* Lo siguiente: un solo paso, sin bajar hasta el final */}
      <section className="card mt-4 p-5 sm:p-6">
        <p className="text-[13.5px] font-semibold text-ink-2">Tu siguiente paso</p>
        <p className="mt-1 text-[19px] leading-snug font-semibold tracking-[-0.02em] text-ink">
          {primeros[0] ? `Empieza por ${primeros[0].nombre}` : 'Sigue tu ruta'}
        </p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">
          Tu ruta empieza por lo que más te conviene reforzar.
          {fallas > 0 ? ` Las ${fallas} preguntas que fallaste vuelven en tu repaso desde mañana, con su explicación.` : ''}
        </p>
        <Link href="/inicio" className={`${btn.primary} mt-5 w-full px-8 sm:w-auto`}>
          Empezar mi ruta <ArrowRight size={18} />
        </Link>
      </section>

      {/* El detalle, plegado */}
      <details className="group card mt-4 overflow-hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-[16px] font-semibold text-ink sm:px-6 [&::-webkit-details-marker]:hidden">
          Ver mi resultado tema por tema
          <ChevronDown size={20} className="shrink-0 text-ink-3 transition-transform group-open:rotate-180" />
        </summary>
        <div className="flex flex-col gap-5 border-t border-line p-5 sm:p-6">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
            {porPrueba.map((p) => {
              const pct = p.total ? Math.round((p.aciertos / p.total) * 100) : 0;
              return (
                <div key={p.id} className="rounded-[14px] bg-surface-2 p-4">
                  <p className="text-[14px] font-semibold text-ink-2">{p.nombre}</p>
                  <p className="mt-1.5 text-[24px] leading-none font-semibold tracking-[-0.03em] text-ink">
                    {p.aciertos}
                    <span className="text-[15px] font-medium text-ink-2"> / {p.total} correctas</span>
                  </p>
                  <Barra valor={pct} className="mt-3" />
                </div>
              );
            })}
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-ink">Tus {totalTemas} temas</h2>
              <LeyendaDominio />
            </div>
            <p className="mb-4 text-[14px] text-ink-2">Cada cuadro es un tema de la ficha. Mientras más naranja, más lo dominas.</p>
            <MapaDominio unidades={unidades} revelar sinCandados />
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
            <div>
              <h2 className="flex items-center gap-2 text-[15.5px] font-semibold text-ink">
                <Trophy size={17} className="text-ok" /> Lo que ya traes
              </h2>
              {fuertes.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {fuertes.map((t) => (
                    <li key={t.id} className="rounded-full bg-ok-soft px-3 py-1.5 text-[13.5px] font-medium text-ink">
                      {t.nombre}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-[14.5px] text-ink-2">Todavía ningún tema firme, y está bien: para eso es la ruta.</p>
              )}
            </div>
            <div>
              <h2 className="flex items-center gap-2 text-[15.5px] font-semibold text-ink">
                <Target size={17} className="text-accent" /> Por reforzar
              </h2>
              {reforzar.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {reforzar.map((t) => (
                    <li key={t.id} className="rounded-full bg-accent-soft px-3 py-1.5 text-[13.5px] font-medium text-ink">
                      {t.nombre}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-[14.5px] text-ink-2">Ningún tema en cero. ¡Buen comienzo!</p>
              )}
            </div>
          </div>
        </div>
      </details>

      {res.correccion && (
        <details className="group card mt-4 overflow-hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-[16px] font-semibold text-ink sm:px-6 [&::-webkit-details-marker]:hidden">
            Revisar mis respuestas
            <ChevronDown size={20} className="shrink-0 text-ink-3 transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-t border-line px-5 pb-5 sm:px-6">
            <RevisionRespuestas correccion={res.correccion} falladasPrimero titulo="Pregunta por pregunta" />
          </div>
        </details>
      )}
    </div>
  );
}
