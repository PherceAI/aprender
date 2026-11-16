import Link from 'next/link';
import {redirect} from 'next/navigation';
import {ArrowRight, ArrowUpRight, Check, FileText, Flame, MessageCircle, Play, Plus, Repeat, Smartphone, Sparkles, Timer} from 'lucide-react';
import {sesionActual} from '@/lib/auth/cookies';
import {enlaceAcceso, enlaceFicha, PAGINAS_FICHA} from '@/lib/ficha';
import {Anillo, Aviso, Marca, btn, colorDominio} from '@/components/ui';
import {TemaToggle} from '@/components/tema-toggle';
import {PreguntaMuestra} from '@/components/pregunta-muestra';
import {CONTENIDO} from '@/contenido';

// Portada que vende: poco texto, el producto a la vista. Los dibujos de la plataforma son ilustraciones de la interfaz real.

// Niveles de ejemplo para el mosaico ilustrativo (31 temas).
const NIVELES = [92, 85, 64, 20, 48, 88, 30, 72, 10, 55, 81, 36, 0, 67, 90, 42, 15, 58, 83, 26, 70, 5, 50, 95, 33, 61, 12, 77, 40, 86, 22];

const FAQ: {p: string; r: string}[] = [
  {p: '¿Es del Ineval?', r: 'No. Somos una plataforma independiente que usa el temario público de su ficha técnica 2026.'},
  {p: '¿Qué parte de la evaluación prepara?', r: 'Las dos pruebas con respuestas correctas: Conocimientos generales y Conocimientos de tu especialidad.'},
  {p: '¿Las preguntas son las del examen?', r: 'No: el Ineval no las publica. Las nuestras siguen su temario y sus cinco formatos, y todas vienen explicadas.'},
  {p: '¿Qué especialidades hay?', r: 'Ciencias Naturales de EGB Superior. Matemática, Lengua y Estudios Sociales llegan pronto.'},
  {p: '¿Cómo obtengo mi acceso?', r: 'Haces un solo pago y te enviamos tu usuario y contraseña.'},
];

function Mosaico({tam = 'h-9 w-9', revelar = false}: {tam?: string; revelar?: boolean}) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${revelar ? 'revelar' : ''}`}>
      {NIVELES.map((n, i) => (
        <span key={i} className={`baldosa rounded-[7px] ${tam}`} style={{'--i': i, backgroundColor: colorDominio(n)} as React.CSSProperties} />
      ))}
    </div>
  );
}

/** La plataforma en miniatura: el inicio del docente, con dos piezas flotando. */
function VistaPrevia() {
  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      <div className="rounded-[24px] border border-line bg-surface p-4 shadow-[0_40px_80px_-40px_rgba(23,23,23,0.28)] sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-[13px] font-semibold text-on-accent">MR</span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[14.5px] font-semibold text-ink">¡Hola, María!</p>
              <p className="truncate text-[12px] text-ink-3">Ciencias Naturales · EGB Superior</p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent-ink">
            <Flame size={13} /> 5 días
          </span>
        </div>

        <div className="relative mt-4 overflow-hidden rounded-[18px] bg-[linear-gradient(120deg,#f0360a_0%,#c2410c_100%)] p-5 text-white">
          <span aria-hidden className="absolute -top-12 -right-8 h-40 w-40 rounded-full bg-white/10" />
          <span aria-hidden className="absolute -right-16 -bottom-20 h-44 w-44 rounded-full bg-white/10" />
          <div className="relative">
            <p className="text-[12px] font-medium text-white/80">Continúa tu aprendizaje</p>
            <p className="mt-0.5 text-[20px] font-semibold tracking-[-0.02em]">Anatomía celular</p>
            <p className="text-[13px] text-white/85">Lección 2 · Organelos y sus funciones</p>
            <div className="mt-3 flex items-center gap-2.5">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/25">
                <div className="h-full w-[60%] rounded-full bg-white" />
              </div>
              <span className="num text-[12px] font-semibold">60%</span>
            </div>
            <span className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-4 text-[13px] font-semibold text-[#c22a05]">
              <Play size={13} fill="currentColor" /> Continuar clase
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3">
          <div className="flex flex-col items-center justify-center rounded-[16px] border border-line p-3">
            <Anillo valor={64} tam={92} grosor={9} etiqueta="Preparación" />
            <p className="mt-2 text-[12px] font-medium text-ink-2">Tu preparación</p>
          </div>
          <div className="rounded-[16px] border border-line p-3">
            <p className="text-[12px] font-medium text-ink-2">Tus 31 temas</p>
            <div className="mt-2.5">
              <Mosaico tam="h-[17px] w-[17px]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flotar absolute top-[38%] -left-10 hidden items-center gap-2.5 rounded-[14px] border border-line bg-surface py-2.5 pr-4 pl-2.5 shadow-[0_18px_40px_-18px_rgba(23,23,23,0.3)] sm:flex">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ok text-white">
          <Check size={16} strokeWidth={3} />
        </span>
        <div className="leading-tight">
          <p className="text-[13px] font-semibold text-ink">¡Correcto!</p>
          <p className="text-[11.5px] text-ink-3">Retículo rugoso y Golgi</p>
        </div>
      </div>

      <div className="flotar-b absolute -right-6 -bottom-6 hidden items-center gap-2.5 rounded-[14px] border border-line bg-surface py-2.5 pr-4 pl-2.5 shadow-[0_18px_40px_-18px_rgba(23,23,23,0.3)] sm:flex">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft text-accent">
          <Repeat size={15} />
        </span>
        <div className="leading-tight">
          <p className="text-[13px] font-semibold text-ink">Repaso de hoy</p>
          <p className="text-[11.5px] text-ink-3">4 preguntas que fallaste</p>
        </div>
      </div>
    </div>
  );
}

function Paso({n, titulo, texto, children, invertido = false}: {n: number; titulo: string; texto: string; children: React.ReactNode; invertido?: boolean}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
      <div className={invertido ? 'lg:order-2' : ''}>
        <span className="num grid h-11 w-11 place-items-center rounded-full bg-accent text-[17px] font-semibold text-on-accent">{n}</span>
        <h3 className="mt-5 text-[28px] leading-[1.1] font-semibold tracking-[-0.035em] text-balance text-ink sm:text-[34px]">{titulo}</h3>
        <p className="mt-3 max-w-[40ch] text-[17px] leading-relaxed text-ink-2">{texto}</p>
      </div>
      <div className={invertido ? 'lg:order-1' : ''}>{children}</div>
    </div>
  );
}

export default async function Portada() {
  if (await sesionActual()) redirect('/inicio');
  const acceso = enlaceAcceso();
  const [generales, disciplinares] = CONTENIDO.bloques;
  const q = CONTENIDO.preguntas.find((x) => x.id === 'ac-06')!;
  const muestra = {tema: 'Anatomía celular', enunciado: q.enunciado, opciones: [...q.opciones], correcta: q.correcta, explicaciones: [...q.explicaciones]};

  return (
    <div className="min-h-dvh bg-bg">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6">
          <Marca />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Secciones">
            <a href="#como-funciona" className={btn.ghost}>Cómo funciona</a>
            <a href="#incluye" className={btn.ghost}>Qué incluye</a>
            <a href="#preguntas" className={btn.ghost}>Preguntas</a>
          </nav>
          <div className="flex items-center gap-1">
            <TemaToggle compacto />
            <Link href="/ingresar" className={`${btn.secondary} h-10`}>
              Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Portada */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_78%_18%,#ffe4d6_0%,transparent_72%)] dark:bg-[radial-gradient(55%_60%_at_78%_18%,rgba(240,54,10,0.16)_0%,transparent_72%)]" />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--line)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(60%_70%_at_75%_25%,black,transparent)]" />
          <div className="relative mx-auto grid max-w-[1180px] grid-cols-[minmax(0,1fr)] items-center gap-16 px-4 pt-12 pb-24 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:pt-20 lg:pb-32">
            <div className="rise">
              <h1 className="text-[42px] leading-[1.02] font-semibold tracking-[-0.04em] text-balance text-ink sm:text-[60px]">
                Prepárate para la evaluación docente con <span className="text-accent">tu propia ruta</span>.
              </h1>
              <p className="mt-6 max-w-[40ch] text-[18px] leading-relaxed text-ink-2">Diagnóstico, lecciones interactivas y simulacros con el temario oficial del Ineval 2026.</p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                {acceso ? (
                  <a href={acceso} target="_blank" rel="noopener noreferrer" className={`${btn.primary} h-[52px] px-7 text-[16px]`}>
                    Quiero mi acceso <ArrowRight size={18} />
                  </a>
                ) : (
                  <Link href="/ingresar" className={`${btn.primary} h-[52px] px-7 text-[16px]`}>
                    Entrar a la plataforma <ArrowRight size={18} />
                  </Link>
                )}
                <a href="#como-funciona" className={`${btn.secondary} h-[52px] px-6 text-[16px]`}>
                  Ver cómo funciona
                </a>
              </div>
              <a href={enlaceFicha(1)} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 text-[14px] text-ink-2 hover:text-ink">
                <FileText size={16} className="text-accent" /> Basado en la ficha técnica oficial 2026 <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="rise [animation-delay:120ms]">
              <VistaPrevia />
            </div>
          </div>
        </section>

        {/* Cómo funciona: tres pasos, cada uno con lo que el docente ve */}
        <section id="como-funciona" className="scroll-mt-16 border-t border-line bg-surface-2">
          <div className="mx-auto max-w-[1180px] px-4 py-20 sm:px-6 lg:py-28">
            <h2 className="max-w-[16ch] text-[36px] leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-ink sm:text-[48px]">Así de simple funciona.</h2>
            <div className="mt-16 flex flex-col gap-20 lg:gap-28">
              <Paso n={1} titulo="Descubre dónde estás" texto="Un diagnóstico mide cada tema del examen y te muestra qué ya dominas.">
                <div className="rounded-[22px] border border-line bg-surface p-6 sm:p-8">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[15px] font-semibold text-ink">Resultado de tu diagnóstico</p>
                    <p className="num text-[13px] text-ink-3">31 temas</p>
                  </div>
                  <div className="mt-5">
                    <Mosaico tam="h-9 w-9 sm:h-10 sm:w-10" revelar />
                  </div>
                  <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink-2">
                    {[
                      ['var(--dom-4)', 'Dominado'],
                      ['var(--dom-2)', 'En camino'],
                      ['var(--dom-0)', 'Por aprender'],
                    ].map(([c, t]) => (
                      <span key={t} className="inline-flex items-center gap-2">
                        <span className="h-3 w-3 rounded-[4px]" style={{backgroundColor: c}} /> {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Paso>

              <Paso n={2} invertido titulo="Aprende haciendo" texto="Lecciones cortas donde tocas, ordenas y unes. Pruébalo aquí mismo.">
                <PreguntaMuestra p={muestra} />
              </Paso>

              <Paso n={3} titulo="Domina y mídete" texto="Lo que fallas vuelve hasta que lo dominas. Al final, simulacros con el tiempo real.">
                <div className="flex flex-col gap-3">
                  <div className="rounded-[22px] border border-line bg-surface p-6 sm:p-8">
                    <p className="text-[15px] font-semibold text-ink">Una pregunta que fallaste vuelve…</p>
                    <ol className="mt-6 grid grid-cols-6 gap-1">
                      {['Hoy', '1 día', '3', '7', '14', '30 días'].map((d, i) => (
                        <li key={d} className="relative flex flex-col items-center gap-2">
                          {i > 0 && <span aria-hidden className="absolute top-[13px] right-1/2 h-0.5 w-full bg-dom-1" />}
                          <span
                            className={`relative grid h-7 w-7 place-items-center rounded-full ${i === 0 ? 'bg-bad-soft text-bad' : i === 5 ? 'bg-accent text-on-accent' : 'bg-dom-1 text-accent-ink'}`}
                          >
                            {i === 5 ? <Check size={14} strokeWidth={3} /> : <Repeat size={12} />}
                          </span>
                          <span className="num text-center text-[12px] text-ink-3">{d}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-5 text-[13.5px] text-ink-2">…hasta que la dominas.</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-[22px] border border-line bg-surface px-6 py-5 sm:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                        <Timer size={19} />
                      </span>
                      <div className="min-w-0 leading-tight">
                        <p className="text-[15px] font-semibold text-ink">Simulacro</p>
                        <p className="truncate text-[12.5px] text-ink-3">Mismos formatos y tiempo del examen</p>
                      </div>
                    </div>
                    <span className="num shrink-0 text-[26px] font-semibold tracking-[-0.03em] text-ink">20:00</span>
                  </div>
                </div>
              </Paso>
            </div>
          </div>
        </section>

        {/* Qué incluye: mosaico de piezas reales */}
        <section id="incluye" className="mx-auto max-w-[1180px] scroll-mt-16 px-4 py-20 sm:px-6 lg:py-28">
          <h2 className="max-w-[18ch] text-[36px] leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-ink sm:text-[48px]">Todo en un solo lugar.</h2>
          <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[repeat(3,minmax(0,1fr))]">
            {/* Tutor */}
            <div className="flex flex-col justify-between gap-8 rounded-[22px] border border-line bg-surface-2 p-6 sm:p-8 md:col-span-2">
              <div>
                <Sparkles size={22} className="text-accent" />
                <h3 className="mt-4 text-[22px] font-semibold tracking-[-0.025em] text-ink">Un tutor con IA en cada lección</h3>
                <p className="mt-1.5 text-[15.5px] text-ink-2">Pregúntale lo que no entiendes. Te explica por qué fallaste.</p>
              </div>
              <div className="flex flex-col gap-2.5">
                <p className="ml-auto max-w-[80%] rounded-[16px] rounded-br-[6px] bg-accent px-4 py-2.5 text-[14px] text-on-accent">¿Por qué el retículo rugoso y no el liso?</p>
                <p className="max-w-[88%] rounded-[16px] rounded-bl-[6px] border border-line bg-surface px-4 py-2.5 text-[14px] leading-relaxed text-ink">
                  Las enzimas son proteínas. El rugoso tiene ribosomas y las fabrica; el liso fabrica lípidos.
                </p>
              </div>
            </div>

            {/* Las dos pruebas */}
            <div className="rounded-[22px] bg-[linear-gradient(150deg,#f0360a_0%,#c2410c_100%)] p-6 text-white sm:p-8">
              <h3 className="text-[22px] font-semibold tracking-[-0.025em]">Las 2 pruebas que se estudian</h3>
              <div className="mt-6 flex flex-col gap-5">
                {[generales, disciplinares].map((b) => (
                  <div key={b.id} className="border-t border-white/25 pt-4">
                    <p className="num text-[32px] leading-none font-semibold tracking-[-0.03em]">
                      {b.preguntasExamen} <span className="text-[15px] font-medium text-white/80">preguntas · {b.minutosExamen} min</span>
                    </p>
                    <p className="mt-1.5 text-[14px] text-white/90">{b.nombre}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Formatos */}
            <div className="rounded-[22px] border border-line bg-surface-2 p-6 sm:p-8">
              <h3 className="text-[22px] font-semibold tracking-[-0.025em] text-ink">Los 5 formatos del examen</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {['Simple', 'Completamiento', 'Selección', 'Ordenamiento', 'Emparejamiento'].map((f) => (
                  <span key={f} className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-[14px] font-medium text-ink">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Ficha oficial */}
            <div className="flex flex-col justify-between gap-6 rounded-[22px] border border-line bg-surface-2 p-6 sm:p-8">
              <div>
                <h3 className="text-[22px] font-semibold tracking-[-0.025em] text-ink">Sale de la ficha oficial</h3>
                <p className="mt-1.5 text-[15.5px] text-ink-2">Cada tema te lleva a su página del PDF.</p>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  ['Conocimientos generales', PAGINAS_FICHA.generales],
                  ['Ciencias Naturales', PAGINAS_FICHA.disciplinares],
                ].map(([t, pag]) => (
                  <a
                    key={t}
                    href={enlaceFicha(Number(pag))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-[12px] border border-line bg-surface px-3.5 py-3 transition-colors hover:border-accent"
                  >
                    <FileText size={17} className="shrink-0 text-accent" />
                    <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-ink">{t}</span>
                    <span className="num shrink-0 text-[12.5px] text-ink-3 group-hover:text-accent-ink">pág. {pag}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Celular */}
            <div className="flex flex-col justify-between gap-6 rounded-[22px] border border-line bg-surface-2 p-6 sm:p-8">
              <span className="grid h-14 w-14 place-items-center rounded-[16px] bg-accent-soft text-accent">
                <Smartphone size={26} />
              </span>
              <div>
                <h3 className="text-[22px] font-semibold tracking-[-0.025em] text-ink">En tu celular</h3>
                <p className="mt-1.5 text-[15.5px] text-ink-2">Estudia donde estés. Se instala como app.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Acceso */}
        <section className="mx-auto max-w-[1180px] px-4 pb-20 sm:px-6 lg:pb-28">
          <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(120deg,#f0360a_0%,#c2410c_100%)] px-6 py-14 text-white sm:px-14 sm:py-20">
            <span aria-hidden className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/10" />
            <span aria-hidden className="absolute -right-32 -bottom-40 h-96 w-96 rounded-full bg-white/10" />
            <div className="relative">
              <h2 className="max-w-[14ch] text-[36px] leading-[1.05] font-semibold tracking-[-0.04em] text-balance sm:text-[52px]">Un solo pago. Sin mensualidades.</h2>
              <p className="mt-4 max-w-[42ch] text-[17px] text-white/90">Diagnóstico, lecciones, práctica, simulacros y tutor: todo incluido.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                {acceso && (
                  <a href={acceso} target="_blank" rel="noopener noreferrer" className="inline-flex h-[52px] items-center gap-2 rounded-ctl bg-white px-7 text-[16px] font-semibold text-[#c22a05] transition-transform active:translate-y-px">
                    <MessageCircle size={18} /> Quiero mi acceso
                  </a>
                )}
                <Link
                  href="/ingresar"
                  className={
                    acceso
                      ? 'inline-flex h-[52px] items-center gap-2 rounded-ctl border border-white/40 px-6 text-[16px] font-semibold text-white transition-colors hover:bg-white/10'
                      : 'inline-flex h-[52px] items-center gap-2 rounded-ctl bg-white px-7 text-[16px] font-semibold text-[#c22a05] transition-transform active:translate-y-px'
                  }
                >
                  Ya tengo cuenta <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Preguntas frecuentes */}
        <section id="preguntas" className="mx-auto grid max-w-[1180px] scroll-mt-16 grid-cols-[minmax(0,1fr)] gap-8 px-4 pb-24 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <h2 className="text-[36px] leading-[1.05] font-semibold tracking-[-0.04em] text-ink sm:text-[44px]">Preguntas frecuentes</h2>
          <div className="border-t border-line">
            {FAQ.map((f) => (
              <details key={f.p} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[17px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {f.p}
                  <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-ink-2 transition-transform group-open:rotate-45">
                    <Plus size={16} />
                  </span>
                </summary>
                <p className="max-w-[60ch] pb-5 text-[16px] leading-relaxed text-ink-2">{f.r}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Marca />
          <div className="max-w-[60ch]">
            <Aviso />
          </div>
        </div>
      </footer>
    </div>
  );
}
