import Image from 'next/image';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  ChartNoAxesColumnIncreasing,
  Check,
  ClipboardCheck,
  FileCheck,
  Globe,
  Leaf,
  Play,
  Plus,
  Repeat,
  Smartphone,
  Trophy,
  UserPlus,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import {sesionActual} from '@/lib/auth/cookies';
import {Aviso, Marca} from '@/components/ui';
import {TemaToggle} from '@/components/tema-toggle';
import {ConoceEvaluacion} from '@/components/conoce-evaluacion';
import {PreguntaMuestra, type Muestra} from '@/components/pregunta-muestra';
import {CONTENIDO} from '@/contenido';
import fotoHero from '@/public/landing/docente-hero.jpg';
import fotoCelular from '@/public/landing/docente-celular.jpg';
import fotoLibros from '@/public/landing/docente-libros.jpg';

// Portada pública con estilo de academia (referencia del dueño, 16 nov): portada con foto y tarjetas,
// lo que respalda, cursos, una pregunta para probar, «Conoce tu evaluación», especialidades, método y banner.
// Sin precios, valoraciones ni cifras de alumnos inventadas. Fotos de Unsplash: ver public/landing/CREDITOS.md.

const REGISTRO = '/registro';

const RESPALDO: {icono: LucideIcon; titulo: string; texto: string}[] = [
  {icono: FileCheck, titulo: 'Ficha técnica oficial', texto: 'El temario del Ineval, tema por tema'},
  {icono: ClipboardCheck, titulo: 'Diagnóstico personal', texto: '40 preguntas para saber dónde estás'},
  {icono: Smartphone, titulo: 'A tu ritmo', texto: 'En el celular o la computadora'},
  {icono: Wallet, titulo: 'Un solo pago', texto: 'Sin mensualidades'},
];

const CURSOS: {nombre: string; estado: string; texto: string; meta: string; img: string; fondo: string; bloques?: [string, number][]}[] = [
  {
    nombre: 'Ciencias Naturales',
    estado: 'Disponible · EGB Superior',
    texto: 'Todo lo que pide la prueba de tu especialidad, con lecciones interactivas y un laboratorio de la célula.',
    meta: '21 temas · 60 preguntas y 120 minutos en el examen',
    img: '/ilustraciones/microscope.png',
    fondo: 'linear-gradient(135deg,#ccf3dc,#7fd8a4)',
    bloques: [
      ['Los seres vivos y su ambiente', 9],
      ['Cuerpo humano y salud', 5],
      ['Materia y energía', 2],
      ['La Tierra y el Universo', 5],
    ],
  },
  {
    nombre: 'Conocimientos pedagógicos',
    estado: 'Incluido para todas las especialidades',
    texto: 'Teorías del aprendizaje, DUA, planificación, evaluación, metodologías y técnicas.',
    meta: '6 temas · parte de la prueba de 39 preguntas',
    img: '/ilustraciones/books.png',
    fondo: 'linear-gradient(135deg,#ffd6ea,#f39ac6)',
  },
  {
    nombre: 'Conocimientos digitales',
    estado: 'Incluido para todas las especialidades',
    texto: 'Recursos abiertos, medios y herramientas digitales, y uso seguro de internet.',
    meta: '4 temas · parte de la prueba de 39 preguntas',
    img: '/ilustraciones/laptop.png',
    fondo: 'linear-gradient(135deg,#d4e2ff,#93b4fb)',
  },
];

const PASOS: {icono: LucideIcon; titulo: string; texto: string}[] = [
  {icono: UserPlus, titulo: 'Entra gratis', texto: 'Crea tu cuenta en un minuto.'},
  {icono: ClipboardCheck, titulo: 'Haz tu diagnóstico', texto: 'Descubre qué ya dominas.'},
  {icono: Play, titulo: 'Aprende a tu ritmo', texto: 'Lecciones cortas e interactivas.'},
  {icono: ChartNoAxesColumnIncreasing, titulo: 'Mide tu avance', texto: 'Mira cómo sube tu preparación.'},
  {icono: Trophy, titulo: 'Llega listo', texto: 'Simulacros como el examen real.'},
];

const ESPECIALIDADES: {icono: LucideIcon; nombre: string; estado: string; fondo: string; color: string; activa?: boolean}[] = [
  {icono: Leaf, nombre: 'Ciencias Naturales', estado: 'Disponible', fondo: '#fff1ea', color: '#f0360a', activa: true},
  {icono: Calculator, nombre: 'Matemática', estado: 'Muy pronto', fondo: '#eef6ff', color: '#2563eb'},
  {icono: BookOpen, nombre: 'Lengua y Literatura', estado: 'Muy pronto', fondo: '#fdf0f6', color: '#c0267a'},
  {icono: Globe, nombre: 'Estudios Sociales', estado: 'Muy pronto', fondo: '#ecfbf4', color: '#15803d'},
];

const VENTAJAS = [
  'Lecciones cortas e interactivas',
  'Preguntas en los 5 formatos del examen',
  'Un tutor con IA para tus dudas',
  'Lo que fallas vuelve hasta que lo dominas',
  'En tu celular o en tu computadora',
];

const CIFRAS: [string, string][] = [
  ['31', 'temas de la ficha'],
  ['5', 'formatos de pregunta'],
  ['40', 'preguntas de diagnóstico'],
  ['3', 'lecciones gratis'],
];

const FAQ: {p: string; r: string}[] = [
  {p: '¿Cuánto cuesta?', r: 'Empiezas gratis: haces el diagnóstico y eliges 3 lecciones de cualquier tema. Para desbloquear todo haces un solo pago, sin mensualidades.'},
  {p: '¿Es del Ineval?', r: 'No. Somos una plataforma independiente que prepara con el temario público de su ficha técnica oficial.'},
  {p: '¿Qué parte de la evaluación prepara?', r: 'La Dimensión 1, la que falta rendir en 2027: Conocimientos generales (pedagógicos y digitales) y Conocimientos de tu especialidad.'},
  {p: '¿Necesito instalar algo?', r: 'No. Entras desde el navegador y, si quieres, la guardas en tu celular como una app.'},
];

// Una pregunta real del banco (formato simple) para probar el método en la portada.
const MUESTRA: Muestra = (() => {
  const p = CONTENIDO.preguntas.find((x) => x.id === 'diag-gen-05')!;
  return {tema: 'Metodologías', enunciado: p.enunciado, opciones: p.opciones as string[], correcta: p.correcta, explicaciones: p.explicaciones as string[]};
})();

const tarjeta = 'rounded-[24px] border border-[#f1e6e1] bg-surface shadow-[0_1px_2px_rgba(23,23,23,0.04),0_16px_40px_-24px_rgba(240,54,10,0.18)] dark:border-line dark:shadow-none';
const pildora = 'inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15.5px] font-semibold whitespace-nowrap transition-transform active:translate-y-px';
const flotante = 'rounded-[16px] border border-line bg-surface shadow-[0_18px_40px_-20px_rgba(120,40,10,0.35)] dark:shadow-none';

export default async function Portada() {
  if (await sesionActual()) redirect('/inicio');

  return (
    <div className="min-h-dvh overflow-x-clip bg-surface">
      {/* Fondo cálido de la portada */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[900px] bg-[radial-gradient(60%_50%_at_15%_10%,#ffe8dd_0%,transparent_70%),radial-gradient(50%_45%_at_90%_20%,#ffeef0_0%,transparent_70%)] dark:opacity-20" />

      <header className="relative z-20">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
          <Marca />
          <nav className="hidden items-center gap-8 text-[15px] font-medium text-ink-2 md:flex" aria-label="Secciones">
            <a href="#cursos" className="hover:text-ink">Cursos</a>
            <a href="#evaluacion" className="hover:text-ink">Tu evaluación</a>
            <a href="#como-funciona" className="hover:text-ink">Cómo funciona</a>
            <a href="#preguntas" className="hover:text-ink">Preguntas</a>
          </nav>
          <div className="flex items-center gap-2">
            <TemaToggle compacto />
            <Link href="/ingresar" className="hidden h-10 items-center rounded-full px-4 text-[14.5px] font-semibold text-ink hover:bg-surface-2 sm:inline-flex">
              Iniciar sesión
            </Link>
            <Link href={REGISTRO} className={`${pildora} h-10 bg-accent px-4 text-[14px] text-white sm:px-5 sm:text-[14.5px]`}>
              Empieza gratis
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Portada: mensaje a la izquierda, la docente con piezas de la academia a la derecha */}
        <section className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)] items-center gap-14 px-4 pt-8 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:pt-14">
          <div className="rise text-center lg:text-left">
            <h1 className="text-[44px] leading-[1.02] font-semibold tracking-[-0.045em] text-ink sm:text-[64px]">
              Prepárate. Practica. <span className="text-accent">Domina.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-[40ch] text-[17px] leading-relaxed text-ink-2 sm:text-[19px] lg:mx-0">
              La academia en línea para preparar la Dimensión 1 de tu evaluación docente 2027, a tu ritmo y desde tu celular.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link href={REGISTRO} className={`${pildora} bg-accent text-white`}>
                Empieza gratis <ArrowRight size={18} />
              </Link>
              <a href="#cursos" className={`${pildora} border border-line bg-surface text-ink hover:bg-surface-2`}>
                Ver los cursos
              </a>
            </div>
            <p className="mt-4 text-[14.5px] text-ink-2 sm:hidden">
              ¿Ya tienes cuenta?{' '}
              <Link href="/ingresar" className="font-semibold text-accent-ink">
                Inicia sesión
              </Link>
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] sm:px-8">
            <div className="relative overflow-hidden rounded-[32px] border-[6px] border-surface shadow-[0_30px_60px_-30px_rgba(120,40,10,0.35)] dark:border-line">
              <Image src={fotoHero} alt="Docente sonriendo en su sala de estudio" priority placeholder="blur" sizes="(min-width: 1024px) 560px, 100vw" className="aspect-[4/3.3] h-auto w-full object-cover" />
            </div>
            <div className={`${flotante} absolute -top-5 left-0 hidden items-center gap-3 p-3 pr-4 sm:flex`}>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-soft text-accent">
                <FileCheck size={19} />
              </span>
              <span className="leading-tight">
                <span className="block text-[13.5px] font-semibold text-ink">Ficha técnica oficial del Ineval</span>
                <span className="text-[12.5px] text-ink-2">Todo el temario, tema por tema</span>
              </span>
            </div>
            <div className={`${flotante} absolute right-2 -bottom-7 flex items-center gap-3 p-3 pr-5 sm:right-0`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ilustraciones/microscope.png" alt="" aria-hidden className="h-12 w-12" />
              <span className="leading-tight">
                <span className="block text-[14px] font-semibold text-ink">Ciencias Naturales</span>
                <span className="text-[12.5px] text-ink-2">EGB Superior · 21 temas</span>
              </span>
            </div>
          </div>
        </section>

        {/* Lo que respalda a la academia */}
        <section aria-label="Lo que incluye" className="mx-auto max-w-[1200px] px-4 pb-20 sm:px-6">
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-5 border-y border-line py-7 sm:grid-cols-[repeat(2,minmax(0,1fr))] lg:grid-cols-[repeat(4,minmax(0,1fr))]">
            {RESPALDO.map((r) => (
              <li key={r.titulo} className="flex items-center gap-3.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <r.icono size={20} />
                </span>
                <span className="leading-tight">
                  <span className="block text-[15px] font-semibold text-ink">{r.titulo}</span>
                  <span className="text-[13.5px] text-ink-2">{r.texto}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Cursos: la especialidad grande y los dos cursos comunes al lado */}
        <section id="cursos" className="mx-auto max-w-[1200px] scroll-mt-8 px-4 pb-24 sm:px-6">
          <h2 className="text-[30px] font-semibold tracking-[-0.035em] text-ink sm:text-[38px]">Cursos de la academia</h2>
          <p className="mt-2 max-w-[60ch] text-[16.5px] text-ink-2">Tu especialidad, más los conocimientos generales que se evalúan a todos los docentes.</p>
          <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:grid-rows-[auto_auto]">
            {CURSOS.map((c, i) => (
              <article key={c.nombre} className={`${tarjeta} flex flex-col overflow-hidden ${i === 0 ? 'lg:row-span-2' : 'sm:flex-row'}`}>
                <div className={`grid shrink-0 place-items-center ${i === 0 ? 'h-[200px] lg:h-[260px]' : 'h-[140px] sm:h-auto sm:w-[170px]'}`} style={{background: c.fondo}}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt="" aria-hidden className={`${i === 0 ? 'h-32 w-32 lg:h-40 lg:w-40' : 'h-20 w-20 sm:h-24 sm:w-24'} drop-shadow-[0_14px_22px_rgba(0,0,0,0.18)]`} />
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="text-[13px] font-semibold text-ok">{c.estado}</p>
                  <h3 className="mt-1 text-[21px] leading-tight font-semibold tracking-[-0.02em] text-ink">{c.nombre}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{c.texto}</p>
                  {c.bloques && (
                    <ul className="mt-4 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-2">
                      {c.bloques.map(([b, n]) => (
                        <li key={b} className="rounded-[12px] bg-surface-2 px-3 py-2.5 text-[13.5px] leading-snug font-medium text-ink">
                          {b}
                          <span className="num block font-normal text-ink-3">{n} temas</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="num mt-auto pt-4 text-[13.5px] font-medium text-ink-2">{c.meta}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Prueba el método con una pregunta real */}
        <section className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)] items-center gap-8 px-4 pb-24 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
          <div>
            <h2 className="text-[30px] leading-[1.08] font-semibold tracking-[-0.035em] text-ink sm:text-[40px]">
              Pruébalo ahora: aquí se aprende <span className="text-accent">respondiendo</span>
            </h2>
            <p className="mt-4 max-w-[44ch] text-[16.5px] leading-relaxed text-ink-2">
              Eliges, ves al instante por qué es la correcta, y lo que fallas vuelve en tu repaso hasta que lo dominas.
            </p>
            <Link href={REGISTRO} className={`${pildora} mt-7 hidden bg-accent text-white lg:inline-flex`}>
              Empieza gratis <ArrowRight size={18} />
            </Link>
          </div>
          <PreguntaMuestra p={MUESTRA} />
        </section>

        {/* Conoce tu evaluación */}
        <section id="evaluacion" className="mx-auto max-w-[1200px] scroll-mt-8 px-4 pb-24 sm:px-6">
          <div className={`${tarjeta} p-5 sm:p-8`}>
            <ConoceEvaluacion />
          </div>
        </section>

        {/* Especialidades */}
        <section id="especialidades" className="mx-auto max-w-[1200px] scroll-mt-8 px-4 pb-24 sm:px-6">
          <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-ink sm:text-[30px]">Especialidades</h2>
          <div className="mt-6 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 sm:grid-cols-[repeat(4,minmax(0,1fr))]">
            {ESPECIALIDADES.map((e) => (
              <div key={e.nombre} className="flex flex-col items-center rounded-[18px] px-3 py-6 text-center dark:!bg-surface-2" style={{backgroundColor: e.fondo}}>
                <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-white shadow-[0_6px_16px_-8px_rgba(0,0,0,0.15)]" style={{color: e.color}}>
                  <e.icono size={22} />
                </span>
                <p className="mt-3 text-[14.5px] leading-snug font-semibold text-ink">{e.nombre}</p>
                <p className={`mt-1 text-[12.5px] font-medium ${e.activa ? 'text-ok' : 'text-ink-3'}`}>{e.estado}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" className="mx-auto max-w-[1200px] scroll-mt-8 px-4 pb-24 sm:px-6">
          <div className={`${tarjeta} px-6 py-10 sm:px-10`}>
            <h2 className="text-center text-[26px] font-semibold tracking-[-0.03em] text-ink sm:text-[30px]">Tu camino, paso a paso</h2>
            <ol className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-5 lg:gap-4">
              {PASOS.map((p, i) => (
                <li key={p.titulo} className="relative flex items-center gap-4 text-left sm:flex-col sm:gap-0 sm:text-center">
                  {i < PASOS.length - 1 && (
                    <span aria-hidden className="absolute top-8 left-[calc(50%+44px)] hidden h-px w-[calc(100%-88px)] border-t-2 border-dashed border-[#f6c9b6] lg:block" />
                  )}
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[18px] bg-accent-soft text-accent sm:h-16 sm:w-16">
                    <p.icono size={26} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[16.5px] font-semibold text-ink sm:mt-4">{p.titulo}</h3>
                    <p className="mt-0.5 text-[14.5px] text-ink-2 sm:mt-1">{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Aprende más inteligente */}
        <section className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
            <div className="relative order-2 lg:order-1">
              <Image src={fotoCelular} alt="Docente estudiando desde su celular" placeholder="blur" sizes="(min-width: 1024px) 600px, 100vw" className="aspect-[16/10] h-auto w-full rounded-[24px] object-cover" />
              <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-[16px] bg-white/94 py-2.5 pr-4 pl-2.5 backdrop-blur">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-soft text-accent">
                  <Repeat size={16} />
                </span>
                <div className="leading-tight">
                  <p className="text-[13.5px] font-semibold text-[#171717]">Repaso de hoy</p>
                  <p className="text-[12px] text-[#525252]">Las preguntas que fallaste</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] text-ink sm:text-[36px]">
                Aprende de forma <span className="text-accent">más inteligente</span>
              </h2>
              <ul className="mt-6 flex flex-col gap-3.5">
                {VENTAJAS.map((v) => (
                  <li key={v} className="flex items-center gap-3 text-[16px] text-ink">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-white">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Preguntas frecuentes */}
        <section id="preguntas" className="mx-auto max-w-[820px] scroll-mt-8 px-4 pb-24 sm:px-6">
          <h2 className="text-center text-[30px] font-semibold tracking-[-0.03em] text-ink sm:text-[36px]">Preguntas frecuentes</h2>
          <div className="mt-8 flex flex-col gap-3">
            {FAQ.map((f) => (
              <details key={f.p} className={`${tarjeta} group rounded-[18px] px-5`}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4.5 text-[16.5px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {f.p}
                  <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent transition-transform group-open:rotate-45">
                    <Plus size={16} />
                  </span>
                </summary>
                <p className="pb-5 text-[15.5px] leading-relaxed text-ink-2">{f.r}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Banner final con las cifras reales de la academia */}
        <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
          <div className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-8 overflow-hidden rounded-[28px] bg-[linear-gradient(115deg,#d9300a_0%,#f0360a_45%,#ff6a3d_100%)] px-6 py-10 sm:px-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:py-0">
            <div className="text-white lg:py-12">
              <h2 className="text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[40px]">Empieza hoy tu preparación</h2>
              <p className="mt-3 text-[17px] text-white">Haz tu diagnóstico y prueba 3 lecciones a tu elección, sin pagar.</p>
              <dl className="mt-7 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-x-6 gap-y-4 sm:grid-cols-[repeat(4,minmax(0,1fr))]">
                {CIFRAS.map(([n, t]) => (
                  <div key={t}>
                    <dt className="sr-only">{t}</dt>
                    <dd className="num text-[32px] leading-none font-semibold tracking-[-0.03em]">{n}</dd>
                    <dd className="mt-1 text-[13.5px] leading-snug text-white">{t}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={REGISTRO} className={`${pildora} bg-white text-[#b8300a]`}>
                  Empieza gratis <ArrowRight size={18} />
                </Link>
                <Link href="/ingresar" className={`${pildora} border border-white/60 text-white hover:bg-white/10`}>
                  Iniciar sesión
                </Link>
              </div>
            </div>
            <div className="relative mx-auto hidden w-full max-w-[280px] lg:mt-10 lg:block lg:self-end">
              <Image src={fotoLibros} alt="Docente con sus libros" placeholder="blur" sizes="280px" className="aspect-[4/5] h-auto w-full rounded-t-[24px] object-cover lg:rounded-b-none" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Marca />
          <div className="max-w-[60ch]">
            <Aviso />
          </div>
        </div>
      </footer>
    </div>
  );
}
