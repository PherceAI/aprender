import {NIVELES, PREGUNTAS_EXAMEN, estimarIneval, type NivelIneval} from '@/lib/puntaje';

// El puntaje como lo da el Ineval: de 0 a 1000 y en cuatro niveles (Nota técnica de calificación, 2026).
// Se estima con el porcentaje de aciertos: cuántas de las 99 preguntas acertaría hoy.

// Los tramos de la barra usan tonos medios para que se distingan en modo claro y oscuro.
const ESTILO: Record<NivelIneval, {chip: string; barra: string}> = {
  'En formación': {chip: 'bg-bad-soft text-bad', barra: '#ef9a92'},
  Fundamental: {chip: 'bg-wip-soft text-wip', barra: '#eec25a'},
  Favorable: {chip: 'bg-ok-soft text-ok', barra: '#6fcf97'},
  Excelente: {chip: 'bg-accent-soft text-accent-ink', barra: '#f0360a'},
};

/** Cuántos «lugares» de aciertos ocupa cada nivel en la barra (0 a 28, 29 a 60, 61 a 92, 93 a 99). */
const TRAMOS = [...NIVELES].reverse().map((n, i, xs) => ({...n, ancho: (xs[i + 1]?.aciertos ?? PREGUNTAS_EXAMEN + 1) - n.aciertos}));

/** «compacto»: sin la leyenda de niveles ni la nota de la fuente, para pantallas donde el siguiente paso debe verse sin bajar. */
export function PuntajeIneval({porcentaje, titulo = 'Tu puntaje estimado en el Ineval', className = '', compacto = false}: {porcentaje: number; titulo?: string; className?: string; compacto?: boolean}) {
  const e = estimarIneval(porcentaje);
  return (
    <section className={`card p-5 sm:p-6 ${className}`} aria-label={`${titulo}: ${e.calificacion} de 1000, nivel ${e.nivel}`}>
      <div className="flex items-start gap-3">
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold text-ink-2">{titulo}</p>
          <p className="num mt-1 flex items-baseline gap-1.5">
            <span className="text-[52px] leading-none font-semibold tracking-[-0.05em] text-ink">{e.calificacion}</span>
            <span className="text-[17px] text-ink-2">/ 1000</span>
          </p>
        </div>
        <span className={`ml-auto shrink-0 rounded-full px-3 py-1 text-[13px] font-bold ${ESTILO[e.nivel].chip}`}>{e.nivel}</span>
      </div>

      <div className="relative mt-5" aria-hidden>
        <div className="flex h-2.5 gap-[3px]">
          {TRAMOS.map((t) => (
            <div key={t.nivel} className="rounded-full" style={{flex: t.ancho, background: ESTILO[t.nivel].barra}} />
          ))}
        </div>
        <span className="absolute -top-1 h-[18px] w-[3px] -translate-x-1/2 rounded-full bg-ink" style={{left: `${((e.aciertos + 0.5) / (PREGUNTAS_EXAMEN + 1)) * 100}%`}} />
      </div>
      {!compacto && (
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-ink-2">
        {TRAMOS.map((t) => (
          <li key={t.nivel} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{background: ESTILO[t.nivel].barra}} />
            {t.nivel} <span className="num">{t.desde}–{t.hasta}</span>
          </li>
        ))}
      </ul>
      )}

      <p className="mt-4 text-[15px] leading-relaxed text-ink">
        Hoy acertarías unas <b className="num font-semibold">{e.aciertos} de las {PREGUNTAS_EXAMEN} preguntas</b>.{' '}
        {e.siguiente ? (
          <>
            Te {e.siguiente.faltan === 1 ? 'falta' : 'faltan'}{' '}
            <b className="num font-semibold">
              {e.siguiente.faltan} {e.siguiente.faltan === 1 ? 'acierto' : 'aciertos'} para llegar a {e.siguiente.nivel}
            </b>
            .
          </>
        ) : (
          <>Estás en el nivel más alto.</>
        )}
      </p>
      {!compacto && (
      <p className="mt-2 text-[12.5px] leading-snug text-ink-2">
        Estimación con la tabla oficial de calificación del Ineval (nota técnica 2026): de 0 a 1000 puntos sobre 99 preguntas.
      </p>
      )}
    </section>
  );
}

/** Versión de una línea, para las tarjetas naranjas. */
export function PuntajeIneval1Linea({porcentaje}: {porcentaje: number}) {
  const e = estimarIneval(porcentaje);
  return (
    <p className="num text-[14.5px] font-medium text-white/95">
      Puntaje Ineval estimado: <b className="font-semibold text-white">{e.calificacion} / 1000</b> · {e.nivel}
    </p>
  );
}
