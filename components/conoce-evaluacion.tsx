import {ArrowUpRight} from 'lucide-react';
import {AÑO_EXAMEN, FORMATOS, PRUEBAS} from '@/lib/evaluacion';
import {enlaceFicha} from '@/lib/ficha';

// «Conoce tu evaluación»: solo la Dimensión 1, que es la que falta rendir (examen de 2027).
// Se usa en la portada y dentro de la plataforma (/evaluacion).

/** Versión corta de la portada: título a la izquierda y las dos pruebas a la derecha. */
export function DimensionUno() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,2fr)]">
      <div>
        <p className="text-[13px] font-bold tracking-[0.04em] text-accent-ink uppercase">Tu evaluación</p>
        <h2 className="mt-2 text-[30px] leading-[1.1] font-semibold tracking-[-0.035em] text-ink sm:text-[34px]">Conoce la estructura de la Dimensión 1</h2>
        <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">
          En {AÑO_EXAMEN}, la Dimensión 1 se evalúa con dos pruebas de opción múltiple. Las dimensiones 2, 3 y 4 ya se aplicaron.
        </p>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-[repeat(2,minmax(0,1fr))]">
        {PRUEBAS.map((p, i) => (
          <section key={p.nombre} className="flex flex-col rounded-[20px] border border-line bg-surface p-5 shadow-[0_16px_40px_-28px_rgba(240,54,10,0.35)]">
            <span className="self-start rounded-full bg-accent-soft px-2.5 py-0.5 text-[12.5px] font-semibold text-accent-ink">Prueba {i + 1}</span>
            <h3 className="mt-2 text-[18px] leading-tight font-semibold tracking-[-0.02em] text-ink">{p.nombre}</h3>
            <p className="mt-0.5 text-[13.5px] text-ink-2">{p.detalle}</p>
            <div className="num mt-4 grid grid-cols-2 divide-x divide-line text-center">
              <p>
                <span className="block text-[36px] leading-none font-semibold tracking-[-0.04em] text-accent">{p.preguntas}</span>
                <span className="text-[13px] text-ink-2">preguntas</span>
              </p>
              <p>
                <span className="block text-[36px] leading-none font-semibold tracking-[-0.04em] text-ink">{p.minutos}</span>
                <span className="text-[13px] text-ink-2">minutos</span>
              </p>
            </div>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {p.partes.map((parte) => (
                <li key={parte.nombre} className="rounded-full bg-surface-2 px-2.5 py-1 text-[12.5px] font-medium text-ink">
                  {parte.nombre} <span className="num font-normal text-ink-3">· {parte.temas} temas</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export function ConoceEvaluacion({titulo = 'h2'}: {titulo?: 'h1' | 'h2'}) {
  const H = titulo;
  const preguntas = PRUEBAS.reduce((a, p) => a + p.preguntas, 0);
  const minutos = PRUEBAS.reduce((a, p) => a + p.minutos, 0);
  return (
    <div>
      <H className="text-[30px] leading-tight font-semibold tracking-[-0.035em] text-ink sm:text-[38px]">Conoce tu evaluación</H>
      <p className="mt-3 max-w-[62ch] text-[16.5px] leading-relaxed text-ink-2">
        En {AÑO_EXAMEN} rindes la Dimensión 1, saberes disciplinares: dos pruebas de opción múltiple. Las dimensiones 2, 3 y 4 ya se aplicaron.
      </p>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[repeat(2,minmax(0,1fr))]">
        {PRUEBAS.map((p, i) => (
          <section key={p.nombre} className="flex flex-col rounded-[20px] border border-line bg-surface p-5 sm:p-6">
            <p className="text-[13px] font-semibold text-accent-ink">Prueba {i + 1}</p>
            <h3 className="mt-1 text-[21px] leading-tight font-semibold tracking-[-0.02em] text-ink">{p.nombre}</h3>
            <p className="mt-1 text-[14.5px] text-ink-2">{p.detalle}</p>
            <div className="num mt-5 flex gap-8">
              <p>
                <span className="block text-[40px] leading-none font-semibold tracking-[-0.04em] text-accent">{p.preguntas}</span>
                <span className="text-[13.5px] text-ink-2">preguntas</span>
              </p>
              <p>
                <span className="block text-[40px] leading-none font-semibold tracking-[-0.04em] text-ink">{p.minutos}</span>
                <span className="text-[13.5px] text-ink-2">minutos</span>
              </p>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {p.partes.map((parte) => (
                <li key={parte.nombre} className="rounded-full bg-surface-2 px-3 py-1.5 text-[13.5px] font-medium text-ink">
                  {parte.nombre} <span className="num font-normal text-ink-3">· {parte.temas} temas</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-4 rounded-[20px] bg-accent-soft p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[15.5px] font-semibold text-ink">
            <span className="num">{preguntas}</span> preguntas en <span className="num">{minutos}</span> minutos. Cada una tiene 4 opciones y una sola correcta.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Formatos de pregunta">
            {FORMATOS.map((f) => (
              <li key={f} className="rounded-full border border-accent/25 bg-surface px-3 py-1 text-[13px] font-medium text-accent-ink">
                {f}
              </li>
            ))}
          </ul>
        </div>
        <a href={enlaceFicha(3)} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1.5 text-[14.5px] font-semibold text-accent-ink hover:underline">
          Ver el temario en la ficha oficial <ArrowUpRight size={15} />
        </a>
      </div>
    </div>
  );
}
