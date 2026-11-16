import Link from 'next/link';
import {redirect} from 'next/navigation';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  Bot,
  CalendarClock,
  ChartNoAxesColumnIncreasing,
  FileText,
  MessageCircle,
  MousePointerClick,
  Smartphone,
  Plus,
  type LucideIcon,
} from 'lucide-react';
import {sesionActual} from '@/lib/auth/cookies';
import {enlaceAcceso, enlaceFicha, PAGINAS_FICHA} from '@/lib/ficha';
import {Aviso, Marca, btn} from '@/components/ui';
import {TemaToggle} from '@/components/tema-toggle';
import {PreguntaMuestra} from '@/components/pregunta-muestra';
import {CONTENIDO} from '@/contenido';

// Página pública que vende: qué es, qué evalúa el Ineval, cómo funciona, qué incluye, de dónde sale y cómo obtener acceso.

const PASOS: {titulo: string; texto: string}[] = [
  {titulo: 'Haces el diagnóstico', texto: 'Preguntas de todo el temario, como las del examen. Al terminar ves, tema por tema, qué ya dominas y qué te falta.'},
  {titulo: 'Recibes tu ruta', texto: 'La plataforma ordena los temas por lo que más te falta y por lo que más pesa en el examen. Siempre sabes qué toca hoy.'},
  {titulo: 'Aprendes haciendo', texto: 'Lecciones cortas, una idea a la vez, con ejercicios donde tocas, ordenas y unes. Si una duda te frena, el tutor te la explica.'},
  {titulo: 'Practicas hasta dominar', texto: 'Cada tema cierra con una prueba: con 80 % queda dominado. Lo que fallas vuelve al día siguiente y luego a los 3, 7, 14 y 30 días.'},
  {titulo: 'Te mides con el simulacro', texto: 'Mismos formatos y mismo tiempo por pregunta que el examen real, con la corrección explicada al final.'},
];

const INCLUYE: {icono: LucideIcon; titulo: string; texto: string}[] = [
  {icono: MousePointerClick, titulo: 'Los 5 formatos del Ineval', texto: 'Simple, completamiento, selección, ordenamiento y emparejamiento. Practicas cada uno antes del día del examen.'},
  {icono: BookOpenCheck, titulo: 'Lecciones interactivas', texto: 'Cortas y a tu ritmo, con laboratorios para explorar, como la célula animal y la vegetal.'},
  {icono: Bot, titulo: 'Tutor con inteligencia artificial', texto: 'Responde tus dudas de cada lección y te explica por qué fallaste una pregunta.'},
  {icono: CalendarClock, titulo: 'Repaso que no se olvida', texto: 'Lo que fallas vuelve en el momento justo, hasta que lo dominas.'},
  {icono: ChartNoAxesColumnIncreasing, titulo: 'Tu avance a la vista', texto: 'Tu preparación en un número y cada tema con su nivel, para saber que lo que haces sirve.'},
  {icono: Smartphone, titulo: 'En el celular o la computadora', texto: 'Se abre en el navegador y se instala como app. Modo claro y oscuro.'},
];

const PREGUNTAS_FRECUENTES: {p: string; r: string}[] = [
  {
    p: '¿Ruta Docente es del Ineval?',
    r: 'No. Es una plataforma independiente de preparación. Usamos el temario público de la ficha técnica 2026 del Ineval, que puedes abrir aquí mismo.',
  },
  {
    p: '¿Qué parte de la evaluación prepara?',
    r: 'Las dos pruebas que tienen respuestas correctas: Conocimientos generales (pedagógicos y digitales) y Conocimientos de la especialidad. Los cuestionarios socioemocionales, la autoevaluación, la observación de clase y la encuesta no se preparan con preguntas.',
  },
  {
    p: '¿Las preguntas son las del examen?',
    r: 'No. El Ineval no publica sus preguntas. Las nuestras siguen su temario, sus subtemas y sus cinco formatos, y cada una explica por qué la respuesta es la correcta y en qué confunde cada opción.',
  },
  {
    p: '¿Qué especialidades hay?',
    r: 'Hoy, Ciencias Naturales de Educación General Básica Superior. Matemática, Lengua y Literatura y Estudios Sociales vienen después.',
  },
  {
    p: '¿Necesito instalar algo?',
    r: 'No. Entras desde el navegador del celular o de la computadora. Si quieres, la agregas a tu pantalla de inicio como una app.',
  },
  {
    p: '¿Cómo obtengo mi acceso?',
    r: 'Haces un solo pago y te enviamos tu usuario y contraseña. Entras, eliges tu especialidad y empiezas por el diagnóstico.',
  },
];

export default async function Portada() {
  if (await sesionActual()) redirect('/inicio');
  const acceso = enlaceAcceso();
  const [generales, disciplinares] = CONTENIDO.bloques;
  const temas = CONTENIDO.bloques.flatMap((b) => b.unidades.flatMap((u) => u.temas)).length;
  const q = CONTENIDO.preguntas.find((x) => x.id === 'ac-06')!;
  const muestra = {tema: 'Anatomía celular', enunciado: q.enunciado, opciones: [...q.opciones], correcta: q.correcta, explicaciones: [...q.explicaciones]};

  const pruebas = [
    {bloque: generales, pagina: PAGINAS_FICHA.generales},
    {bloque: disciplinares, pagina: PAGINAS_FICHA.disciplinares},
  ];

  const botonAcceso = (clase = '') =>
    acceso ? (
      <a href={acceso} target="_blank" rel="noopener noreferrer" className={`${btn.primary} px-6 ${clase}`}>
        <MessageCircle size={18} /> Quiero mi acceso
      </a>
    ) : null;

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6">
          <Marca />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Secciones">
            <a href="#como-funciona" className={btn.ghost}>Cómo funciona</a>
            <a href="#que-incluye" className={btn.ghost}>Qué incluye</a>
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
        {/* Portada: la promesa y una pregunta real para probar el método. */}
        <section className="mx-auto grid max-w-[1180px] grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:pt-20 lg:pb-24">
          <div className="rise">
            <h1 className="text-[36px] leading-[1.06] font-semibold tracking-[-0.04em] text-balance text-ink sm:text-[50px]">
              Prepárate para la evaluación docente con una <span className="text-accent">ruta hecha para ti</span>.
            </h1>
            <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-ink-2">
              Un diagnóstico mide lo que ya sabes. Después estudias solo lo que te falta, con lecciones cortas e interactivas y práctica en los mismos
              formatos del examen. Todo sale de la ficha técnica oficial del Ineval 2026.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {botonAcceso()}
              <Link href="/ingresar" className={acceso ? `${btn.secondary} h-12 px-5` : `${btn.primary} px-6`}>
                Ya tengo cuenta <ArrowRight size={18} />
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-ink-2">
              <li>Ciencias Naturales · EGB Superior</li>
              <li>Celular y computadora</li>
              <li>Pago único</li>
            </ul>
          </div>

          <div className="rise [animation-delay:120ms]">
            <PreguntaMuestra p={muestra} />
            <p className="mt-3 text-center text-[13px] text-ink-3">Pruébalo: elige una respuesta.</p>
          </div>
        </section>

        {/* Qué evalúa el Ineval y qué cubrimos. */}
        <section className="border-y border-line bg-surface-2">
          <div className="mx-auto grid max-w-[1180px] grid-cols-[minmax(0,1fr)] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:py-20">
            <div>
              <h2 className="text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] text-balance text-ink sm:text-[36px]">
                Preparamos las dos pruebas que se ganan estudiando.
              </h2>
              <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-ink-2">
                La evaluación del desempeño docente tiene seis componentes. Solo dos son pruebas con respuestas correctas, y son las que cubre Ruta Docente, con
                todos sus temas: {temas} en total.
              </p>
              <a href={enlaceFicha(PAGINAS_FICHA.componentes)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-accent-ink hover:underline">
                Ver los componentes en la ficha oficial (pág. {PAGINAS_FICHA.componentes}) <ArrowUpRight size={16} />
              </a>
            </div>

            <div className="flex flex-col gap-4">
              {pruebas.map(({bloque, pagina}) => (
                <div key={bloque.id} className="rounded-card border border-line bg-surface p-5 sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-ink">{bloque.nombre}</h3>
                    <p className="num text-[14px] font-medium text-ink-2">
                      <span className="text-[20px] font-semibold text-ink">{bloque.preguntasExamen}</span> preguntas ·{' '}
                      <span className="text-[20px] font-semibold text-ink">{bloque.minutosExamen}</span> min
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {bloque.unidades.map((u) => (
                      <span key={u.id} className="rounded-full bg-surface-2 px-3 py-1.5 text-[13.5px] text-ink-2">
                        {u.nombre}
                      </span>
                    ))}
                  </div>
                  <a href={enlaceFicha(pagina)} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-accent-ink hover:underline">
                    <FileText size={15} /> Temario en la ficha, pág. {pagina}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cómo funciona: el camino en orden, como lo vive el docente. */}
        <section id="como-funciona" className="mx-auto grid max-w-[1180px] scroll-mt-20 grid-cols-[minmax(0,1fr)] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:py-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] text-balance text-ink sm:text-[36px]">Así funciona, paso a paso.</h2>
            <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-ink-2">
              No es un montón de videos para ver cuando puedas. Es un camino en orden: cada paso te dice qué sigue y te muestra cuánto avanzaste.
            </p>
          </div>
          <ol className="relative flex flex-col">
            {PASOS.map((p, i) => (
              <li key={p.titulo} className="relative flex gap-5 pb-9 last:pb-0">
                {i < PASOS.length - 1 && <span aria-hidden className="absolute top-11 bottom-0 left-[19px] w-px bg-line" />}
                <span className="num relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-accent bg-accent-soft text-[15px] font-semibold text-accent-ink">
                  {i + 1}
                </span>
                <div className="min-w-0 pt-1.5">
                  <h3 className="text-[18px] font-semibold tracking-[-0.015em] text-ink">{p.titulo}</h3>
                  <p className="mt-1.5 max-w-[56ch] text-[15.5px] leading-relaxed text-ink-2">{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Qué incluye. */}
        <section id="que-incluye" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 lg:py-24">
            <h2 className="max-w-[22ch] text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] text-balance text-ink sm:text-[36px]">
              Todo lo que necesitas para llegar listo.
            </h2>
            <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
              {INCLUYE.map((x) => (
                <div key={x.titulo} className="flex gap-4 border-t border-line py-6">
                  <x.icono size={22} className="mt-0.5 shrink-0 text-accent" />
                  <div className="min-w-0">
                    <h3 className="text-[16.5px] font-semibold text-ink">{x.titulo}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{x.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* De dónde sale el contenido. */}
        <section className="bg-accent-soft">
          <div className="mx-auto grid max-w-[1180px] grid-cols-[minmax(0,1fr)] items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:py-16">
            <div>
              <h2 className="text-[26px] leading-[1.15] font-semibold tracking-[-0.03em] text-balance text-ink sm:text-[32px]">
                Nada inventado: cada tema sale de la ficha técnica oficial.
              </h2>
              <p className="mt-3 max-w-[56ch] text-[16px] leading-relaxed text-ink-2">
                Dentro de la plataforma, cada tema te lleva a la página de la ficha de donde sale. Puedes comprobarlo tú mismo.
              </p>
            </div>
            <a
              href={enlaceFicha(1)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-card border border-line bg-surface p-4 transition-colors hover:border-accent"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-ctl bg-accent-soft text-accent">
                <FileText size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-ink">Ficha técnica de evaluación 2026</span>
                <span className="block text-[13px] text-ink-3">Ciencias Naturales · EGB Superior · PDF</span>
              </span>
              <ArrowUpRight size={18} className="shrink-0 text-ink-3 transition-colors group-hover:text-accent" />
            </a>
          </div>
        </section>

        {/* Acceso: pago único. */}
        <section id="acceso" className="mx-auto max-w-[1180px] scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
          <div className="rounded-[20px] bg-[linear-gradient(120deg,#f0360a_0%,#c2410c_100%)] px-6 py-10 text-white sm:px-12 sm:py-14">
            <h2 className="max-w-[20ch] text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[40px]">Un solo pago. Sin mensualidades.</h2>
            <p className="mt-4 max-w-[54ch] text-[16.5px] leading-relaxed text-white/90">
              Pagas una vez y tienes la plataforma completa de tu especialidad: diagnóstico, lecciones, práctica, repaso, simulacros y tutor.
              {acceso ? '' : ' Pide tu acceso a la persona que te compartió esta página.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {acceso && (
                <a href={acceso} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-ctl bg-white px-6 text-[15px] font-semibold text-[#c22a05] transition-transform active:translate-y-px">
                  <MessageCircle size={18} /> Quiero mi acceso
                </a>
              )}
              <Link href="/ingresar" className="inline-flex h-12 items-center gap-2 rounded-ctl border border-white/40 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10">
                Ya tengo cuenta <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Preguntas frecuentes. */}
        <section id="preguntas" className="mx-auto grid max-w-[1180px] scroll-mt-20 grid-cols-[minmax(0,1fr)] gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <h2 className="text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] text-ink sm:text-[36px]">Preguntas frecuentes</h2>
          <div className="border-t border-line">
            {PREGUNTAS_FRECUENTES.map((f) => (
              <details key={f.p} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[16.5px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {f.p}
                  <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-2 text-ink-2 transition-transform group-open:rotate-45">
                    <Plus size={16} />
                  </span>
                </summary>
                <p className="max-w-[62ch] pb-5 text-[15.5px] leading-relaxed text-ink-2">{f.r}</p>
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
