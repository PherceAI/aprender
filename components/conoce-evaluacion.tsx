import {ArrowUpRight} from 'lucide-react';
import {AÑO_EXAMEN, FORMATOS, pruebasDe} from '@/lib/evaluacion';
import {enlaceFicha, fichaDe} from '@/lib/ficha';
import {NIVELES} from '@/lib/puntaje';

// «Conoce tu evaluación»: solo la Dimensión 1, que es la que falta rendir (examen de 2027).
// Se usa dentro de la plataforma (/evaluacion), con las pruebas de la especialidad del docente.

export function ConoceEvaluacion({titulo = 'h2', especialidadId}: {titulo?: 'h1' | 'h2'; especialidadId: string}) {
  const H = titulo;
  const PRUEBAS = pruebasDe(especialidadId);
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
        <a href={enlaceFicha(fichaDe(especialidadId).paginas.temario, especialidadId)} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1.5 text-[14.5px] font-semibold text-accent-ink hover:underline">
          Ver el temario en la ficha oficial <ArrowUpRight size={15} />
        </a>
      </div>

      <section className="mt-4 rounded-[20px] border border-line bg-surface p-5 sm:p-6">
        <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Cómo te califican</h3>
        <p className="mt-1 max-w-[70ch] text-[14.5px] leading-relaxed text-ink-2">
          El Ineval cuenta tus aciertos de las {preguntas} preguntas y los pasa a una nota de 0 a 1000. Con esa nota quedas en uno de cuatro niveles. Tu puntaje estimado aparece en el diagnóstico, en cada simulacro y en Mi progreso.
        </p>
        <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-2.5 sm:grid-cols-[repeat(2,minmax(0,1fr))] lg:grid-cols-[repeat(4,minmax(0,1fr))]">
          {[...NIVELES].reverse().map((n) => (
            <li key={n.nivel} className="rounded-[14px] bg-surface-2 px-4 py-3">
              <p className="text-[15px] font-semibold text-ink">{n.nivel}</p>
              <p className="num text-[13.5px] text-ink-2">
                {n.desde} a {n.hasta} puntos · {n.aciertos} a {n.aciertosHasta} aciertos
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12.5px] text-ink-2">Fuente: nota técnica de calificación del Ineval, abril de 2026.</p>
      </section>
    </div>
  );
}
