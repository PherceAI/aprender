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
  GraduationCap,
  Leaf,
  Play,
  Plus,
  Repeat,
  Trophy,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import {sesionActual} from '@/lib/auth/cookies';
import {enlaceFicha} from '@/lib/ficha';
import {Aviso, Marca} from '@/components/ui';
import {TemaToggle} from '@/components/tema-toggle';
import fotoHero from '@/public/landing/docente-hero.jpg';
import fotoAula from '@/public/landing/docente-aula.jpg';
import fotoCelular from '@/public/landing/docente-celular.jpg';
import fotoLibros from '@/public/landing/docente-libros.jpg';

// Portada pública. Sigue las referencias del dueño (landing de academia con fotos, pasos con íconos,
// especialidades en mosaicos y banner final), en el naranja del hotel. Fotos de Unsplash: ver public/landing/CREDITOS.md.

const REGISTRO = '/registro';

const PASOS: {icono: LucideIcon; titulo: string; texto: string}[] = [
  {icono: UserPlus, titulo: 'Entra gratis', texto: 'Crea tu cuenta en un minuto.'},
  {icono: ClipboardCheck, titulo: 'Haz tu diagnóstico', texto: 'Descubre qué ya dominas.'},
  {icono: Play, titulo: 'Aprende a tu ritmo', texto: 'Lecciones cortas e interactivas.'},
  {icono: ChartNoAxesColumnIncreasing, titulo: 'Mide tu avance', texto: 'Mira cómo sube tu preparación.'},
  {icono: Trophy, titulo: 'Llega listo', texto: 'Simulacros como el examen real.'},
];

const ESPECIALIDADES: {icono: LucideIcon; nombre: string; estado: string; fondo: string; color: string; activa?: boolean}[] = [
  {icono: Leaf, nombre: 'Ciencias Naturales', estado: 'Disponible', fondo: '#fff1ea', color: '#f0360a', activa: true},
  {icono: GraduationCap, nombre: 'Conocimientos generales', estado: 'Incluido', fondo: '#fff6e5', color: '#c2700a', activa: true},
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

const FAQ: {p: string; r: string}[] = [
  {p: '¿Cuánto cuesta?', r: 'Empiezas gratis con las primeras lecciones. Para desbloquear todo haces un solo pago, sin mensualidades.'},
  {p: '¿Es del Ineval?', r: 'No. Somos una plataforma independiente que prepara con el temario público de su ficha técnica 2026.'},
  {p: '¿Qué parte de la evaluación prepara?', r: 'Las dos pruebas con respuestas correctas: Conocimientos generales y Conocimientos de tu especialidad.'},
  {p: '¿Necesito instalar algo?', r: 'No. Entras desde el navegador y, si quieres, la guardas en tu celular como una app.'},
];

const tarjeta = 'rounded-[24px] border border-[#f1e6e1] bg-surface shadow-[0_1px_2px_rgba(23,23,23,0.04),0_16px_40px_-24px_rgba(240,54,10,0.18)] dark:border-line dark:shadow-none';
const pildora = 'inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15.5px] font-semibold transition-transform active:translate-y-px';

export default async function Portada() {
  if (await sesionActual()) redirect('/inicio');

  return (
    <div className="min-h-dvh bg-surface">
      {/* Fondo cálido de la portada, como el degradado suave de la referencia */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[900px] bg-[radial-gradient(60%_50%_at_15%_10%,#ffe8dd_0%,transparent_70%),radial-gradient(50%_45%_at_90%_20%,#ffeef0_0%,transparent_70%)] dark:opacity-20" />

      <header className="relative z-20">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
          <Marca />
          <nav className="hidden items-center gap-8 text-[15px] font-medium text-ink-2 md:flex" aria-label="Secciones">
            <a href="#como-funciona" className="hover:text-ink">Cómo funciona</a>
            <a href="#especialidades" className="hover:text-ink">Especialidades</a>
            <a href="#preguntas" className="hover:text-ink">Preguntas</a>
          </nav>
          <div className="flex items-center gap-2">
            <TemaToggle compacto />
            <Link href="/ingresar" className="hidden h-10 items-center rounded-full px-4 text-[14.5px] font-semibold text-ink hover:bg-surface-2 sm:inline-flex">
              Iniciar sesión
            </Link>
            <Link href={REGISTRO} className={`${pildora} h-10 bg-accent px-4 text-[14px] whitespace-nowrap text-white sm:px-5 sm:text-[14.5px]`}>
              Empieza gratis
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Portada */}
        <section className="mx-auto max-w-[1200px] px-4 pt-10 pb-16 text-center sm:px-6 lg:pt-16">
          <h1 className="rise text-[44px] leading-[1.02] font-semibold tracking-[-0.045em] text-ink sm:text-[72px]">
            Prepárate. Practica. <span className="text-accent">Domina.</span>
          </h1>
          <p className="rise mx-auto mt-5 max-w-[46ch] text-[17px] leading-relaxed text-ink-2 sm:text-[19px]">
            La plataforma para preparar tu evaluación docente del Ineval, a tu ritmo y desde tu celular.
          </p>
          <div className="rise mt-8 flex flex-wrap justify-center gap-3">
            <Link href={REGISTRO} className={`${pildora} bg-accent text-white`}>
              Empieza gratis <ArrowRight size={18} />
            </Link>
            <a href="#como-funciona" className={`${pildora} border border-line bg-surface text-ink hover:bg-surface-2`}>
              Cómo funciona
            </a>
          </div>
          <p className="rise mt-4 text-[14.5px] text-ink-2 sm:hidden">
            ¿Ya tienes cuenta?{' '}
            <Link href="/ingresar" className="font-semibold text-accent-ink">
              Inicia sesión
            </Link>
          </p>

          <div className="mt-14 grid grid-cols-[minmax(0,1fr)] items-center gap-6 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.6fr)_minmax(0,0.6fr)] lg:gap-8">
            {/* Respaldo */}
            <div className="order-2 flex flex-col items-center gap-3 lg:order-1 lg:items-start lg:text-left">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-surface text-accent shadow-[0_8px_24px_-12px_rgba(240,54,10,0.35)] dark:shadow-none">
                <FileCheck size={24} />
              </span>
              <p className="max-w-[24ch] text-[15px] leading-snug font-medium text-ink">Basado en la ficha técnica oficial del Ineval 2026.</p>
              <a href={enlaceFicha(1)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent-ink hover:underline">
                Ver la ficha <ArrowRight size={15} />
              </a>
            </div>

            {/* La docente estudiando: foto grande con piezas de la plataforma encima */}
            <div className="relative order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-[28px] border-[6px] border-surface shadow-[0_30px_60px_-30px_rgba(120,40,10,0.35)] dark:border-line">
                <Image src={fotoHero} alt="Docente sonriendo en su sala de estudio" priority placeholder="blur" sizes="(min-width: 1024px) 640px, 100vw" className="aspect-[16/10] h-auto w-full object-cover" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[12.5px] font-semibold text-[#171717] backdrop-blur">
                  <Leaf size={14} className="text-accent" /> Ciencias Naturales
                </span>
                <div className="absolute right-4 bottom-4 hidden w-[300px] items-center gap-3 rounded-[16px] bg-white/92 p-3 text-left backdrop-blur sm:flex">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-white">
                    <Play size={16} fill="currentColor" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold text-[#171717]">Anatomía celular · Lección 2</p>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#f1e6e1]">
                      <div className="h-full w-[60%] rounded-full bg-accent" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lo que cubre */}
            <div className="order-3 flex justify-center gap-10 lg:flex-col lg:items-end lg:gap-6 lg:text-right">
              <div>
                <p className="text-[40px] leading-none font-semibold tracking-[-0.04em] text-ink">31</p>
                <p className="mt-1 text-[14px] text-ink-2">temas del examen</p>
              </div>
              <div>
                <p className="text-[40px] leading-none font-semibold tracking-[-0.04em] text-ink">5</p>
                <p className="mt-1 text-[14px] text-ink-2">formatos de pregunta</p>
              </div>
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" className="mx-auto max-w-[1200px] scroll-mt-8 px-4 pb-20 sm:px-6">
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

        {/* Foto + mensaje */}
        <section className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 pb-24 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="relative overflow-hidden rounded-[28px] bg-accent-soft">
            <Image src={fotoAula} alt="Docente en su aula" placeholder="blur" sizes="(min-width: 1024px) 560px, 100vw" className="aspect-[4/3] h-auto w-full object-cover" />
            <span className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/92 px-4 py-2 text-[13.5px] font-semibold text-[#171717] backdrop-blur">
              <GraduationCap size={16} className="text-accent" /> Pensado para el docente de aula
            </span>
          </div>
          <div>
            <h2 className="text-[34px] leading-[1.08] font-semibold tracking-[-0.035em] text-ink sm:text-[44px]">
              Estudia solo lo que <span className="text-accent">toma el examen</span>
            </h2>
            <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed text-ink-2">Cada lección es un subtema de la ficha oficial. Sin relleno y sin perder tu tiempo.</p>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                ['39', 'preguntas de generales'],
                ['60', 'preguntas de Ciencias'],
                ['165', 'minutos de examen'],
              ].map(([n, t]) => (
                <div key={t}>
                  <p className="text-[30px] leading-none font-semibold tracking-[-0.03em] text-accent">{n}</p>
                  <p className="mt-1.5 text-[13.5px] leading-snug text-ink-2">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Especialidades */}
        <section id="especialidades" className="mx-auto max-w-[1200px] scroll-mt-8 px-4 pb-24 sm:px-6">
          <div className={`${tarjeta} p-6 sm:p-8`}>
            <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-ink">Especialidades</h2>
            <div className="mt-6 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 sm:grid-cols-[repeat(3,minmax(0,1fr))] lg:grid-cols-[repeat(5,minmax(0,1fr))]">
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
          </div>
        </section>

        {/* Aprende más inteligente */}
        <section className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-6">
          <div className={`${tarjeta} grid grid-cols-[minmax(0,1fr)] items-center gap-10 overflow-hidden p-6 sm:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]`}>
            <div>
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
            <div className="relative">
              <Image src={fotoCelular} alt="Docente estudiando desde su celular" placeholder="blur" sizes="(min-width: 1024px) 600px, 100vw" className="aspect-[16/10] h-auto w-full rounded-[22px] object-cover" />
              <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-[16px] bg-white/94 py-2.5 pr-4 pl-2.5 backdrop-blur">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-soft text-accent">
                  <Repeat size={16} />
                </span>
                <div className="leading-tight">
                  <p className="text-[13.5px] font-semibold text-[#171717]">Repaso de hoy</p>
                  <p className="text-[12px] text-[#525252]">4 preguntas que fallaste</p>
                </div>
              </div>
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

        {/* Banner final */}
        <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
          <div className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-8 overflow-hidden rounded-[28px] bg-[linear-gradient(115deg,#f0360a_0%,#ff6a3d_100%)] px-6 py-10 sm:px-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:py-0">
            <div className="text-white lg:py-14">
              <h2 className="text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[40px]">Empieza hoy tu preparación</h2>
              <p className="mt-3 text-[17px] text-white/90">Entra gratis y prueba tus primeras lecciones.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={REGISTRO} className={`${pildora} bg-white text-[#c22a05]`}>
                  Crear mi cuenta gratis <ArrowRight size={18} />
                </Link>
                <Link href="/ingresar" className={`${pildora} border border-white/50 text-white hover:bg-white/10`}>
                  Ya tengo cuenta
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
