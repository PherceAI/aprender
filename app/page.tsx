import Image from 'next/image';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  ChartNoAxesColumnIncreasing,
  Check,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Globe,
  GraduationCap,
  Brain,
  Briefcase,
  Dna,
  FlaskConical,
  Layers,
  Leaf,
  School,
  Play,
  Plus,
  Repeat,
  ShieldCheck,
  Target,
  Trophy,
  User,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import {sesionActual} from '@/lib/auth/cookies';
import {Aviso, Marca} from '@/components/ui';
import {TemaToggle} from '@/components/tema-toggle';
import {PreguntaMuestra, type Muestra} from '@/components/pregunta-muestra';
import {CONTENIDO} from '@/contenido';
import fotoRecorte from '@/public/landing/docente-recorte.png';
import fotoCelular from '@/public/landing/docente-celular.jpg';
import {BotonWhatsApp} from '@/components/whatsapp';

// Portada pública (referencia del dueño, 16 nov, segunda versión): academia cálida en naranja.
// Sin precios, valoraciones ni cifras de alumnos inventadas. Fotos de Unsplash: ver public/landing/CREDITOS.md.

const REGISTRO = '/registro';

const RESPALDO: {icono: LucideIcon; titulo: string; texto: string}[] = [
  {icono: Target, titulo: 'Contenido alineado', texto: 'a la ficha técnica oficial'},
  {icono: Layers, titulo: 'Diagnóstico personal', texto: 'y una ruta de estudio a tu medida'},
  {icono: Clock, titulo: 'A tu ritmo', texto: 'en el celular o la computadora'},
  {icono: ShieldCheck, titulo: 'Un solo pago de $45', texto: 'sin mensualidades'},
];

// En pantallas grandes: arriba a la izquierda (sobre la cabeza no), y abajo sobre la camiseta.
const TARJETAS_HERO: {icono: LucideIcon; titulo: string; texto: string; lugar: string}[] = [
  {icono: ClipboardList, titulo: 'Ficha técnica oficial', texto: 'Todo el temario del Ineval', lugar: 'top-[1%] left-0 sm:-left-6 xl:-left-12'},
  {icono: GraduationCap, titulo: 'EGB 2.º a 7.º y Ciencias Naturales', texto: 'Cursos disponibles', lugar: 'bottom-[12%] left-0 sm:-left-8 xl:-left-16'},
  {icono: BarChart3, titulo: 'Preguntas tipo examen', texto: 'Con su explicación', lugar: 'right-0 bottom-[-2%] xl:-right-12'},
];

// Los cursos disponibles (un curso = una especialidad del Ineval). Las cifras salen de las fichas oficiales.
const CURSOS: {etiqueta: string; nombre: string; nivel: string; texto: string; incluye: string[]; img: string}[] = [
  {
    etiqueta: 'Nuevo',
    nombre: 'Educación General Básica',
    nivel: 'De 2.º a 7.º año',
    texto: 'Para docentes de escuela: Matemática, Lengua y Literatura, Ciencias Naturales y Ciencias Sociales en una sola prueba, como en tu examen.',
    incluye: ['Las 4 asignaturas de la ficha: 34 temas', 'Matemática completa, con lecciones y pruebas', 'Diagnóstico de los 44 temas de tu evaluación', 'Práctica y prueba de cada tema'],
    img: '/ilustraciones/abacus.png',
  },
  {
    etiqueta: 'Disponible',
    nombre: 'Ciencias Naturales',
    nivel: 'EGB Superior (8.º a 10.º)',
    texto: 'Todo lo que pide la prueba de tu especialidad, con lecciones interactivas y ejemplos de la vida real.',
    incluye: ['4 bloques del temario: 21 temas', 'Laboratorio interactivo de la célula', 'Diagnóstico de los 31 temas de tu evaluación', 'Práctica y prueba de cada tema'],
    img: '/ilustraciones/microscope.png',
  },
];

const LATERALES = [
  {nombre: 'Conocimientos pedagógicos', texto: 'Teorías del aprendizaje, DUA, planificación, evaluación y más.', img: '/ilustraciones/books.png', fondo: 'bg-[linear-gradient(120deg,#fdf0f6,#fff6f2)]'},
  {nombre: 'Conocimientos digitales', texto: 'Recursos y herramientas digitales, y su uso seguro en el aula.', img: '/ilustraciones/laptop.png', fondo: 'bg-[linear-gradient(120deg,#eef0ff,#f7f4ff)]'},
];

const PASOS: {icono: LucideIcon; titulo: string; texto: string}[] = [
  {icono: UserPlus, titulo: 'Crea tu cuenta', texto: 'Regístrate gratis en menos de un minuto.'},
  {icono: ClipboardCheck, titulo: 'Haz tu diagnóstico', texto: 'Descubre tu nivel y qué temas reforzar.'},
  {icono: Play, titulo: 'Aprende a tu ritmo', texto: 'Lecciones cortas e interactivas.'},
  {icono: ChartNoAxesColumnIncreasing, titulo: 'Practica y avanza', texto: 'Preguntas tipo examen y tu avance a la vista.'},
  {icono: Trophy, titulo: 'Llega listo', texto: 'Simulacros como el examen real.'},
];

const ESPECIALIDADES: {icono: LucideIcon; nombre: string; nivel: string; estado: string; fondo: string; color: string; activa?: boolean}[] = [
  {icono: School, nombre: 'Educación General Básica', nivel: '2.º a 7.º', estado: 'Disponible', fondo: '#fff1ea', color: '#f0360a', activa: true},
  {icono: Leaf, nombre: 'Ciencias Naturales', nivel: '8.º a 10.º', estado: 'Disponible', fondo: '#fff1ea', color: '#f0360a', activa: true},
  {icono: Globe, nombre: 'Estudios Sociales', nivel: '8.º a 10.º', estado: 'Muy pronto', fondo: '#ecfbf4', color: '#15803d'},
  {icono: Dna, nombre: 'Biología', nivel: 'Bachillerato', estado: 'Muy pronto', fondo: '#ecfbf4', color: '#15803d'},
  {icono: FlaskConical, nombre: 'Química', nivel: 'Bachillerato', estado: 'Muy pronto', fondo: '#f4efff', color: '#7c3aed'},
  {icono: Brain, nombre: 'Filosofía', nivel: 'Bachillerato', estado: 'Muy pronto', fondo: '#fdf0f6', color: '#c0267a'},
  {icono: Briefcase, nombre: 'Emprendimiento y Gestión', nivel: 'Bachillerato', estado: 'Muy pronto', fondo: '#fff6e5', color: '#b45309'},
  {icono: Calculator, nombre: 'Matemática', nivel: '8.º EGB a 3.º BGU', estado: 'Muy pronto', fondo: '#eef6ff', color: '#2563eb'},
  {icono: BookOpen, nombre: 'Lengua y Literatura', nivel: '8.º EGB a 3.º BGU', estado: 'Muy pronto', fondo: '#fdf0f6', color: '#c0267a'},
];

const VENTAJAS = [
  'Lecciones claras e interactivas',
  'Preguntas tipo examen con retroalimentación',
  'Un tutor con IA para resolver tus dudas al instante',
  'Lo que fallas vuelve hasta que lo dominas',
  'Estudia desde cualquier dispositivo',
];

const CIFRAS: {icono: LucideIcon; n: string; t: string}[] = [
  {icono: BookOpen, n: '2', t: 'cursos: EGB 2.º a 7.º y Ciencias Naturales'},
  {icono: Layers, n: '5', t: 'formatos de pregunta, como en el examen'},
  {icono: BarChart3, n: '0–1000', t: 'tu puntaje estimado, calculado como el Ineval'},
];

const PLANES = [
  {
    nombre: 'Cuenta gratis',
    precio: 'Para empezar hoy, sin tarjeta',
    incluye: ['Diagnóstico completo de tu especialidad', 'Tu puntaje estimado y qué temas reforzar', '3 lecciones a tu elección, de cualquier tema', 'Un simulacro para conocerlo'],
    boton: 'Empieza gratis',
    destacado: false,
  },
  {
    nombre: 'Acceso completo',
    precio: '$45, pago único con IVA incluido, hasta el examen de 2027',
    incluye: ['Todos los cursos y sus lecciones, y las nuevas que se abren hasta el examen', 'Prueba de cada tema hasta dominarlo', 'Simulacros como el examen real', 'Repaso de lo que fallas y tutor con IA'],
    boton: 'Empieza gratis y desbloquea',
    destacado: true,
  },
];

const FAQ: {p: string; r: string}[] = [
  {p: '¿Cuánto cuesta?', r: 'Empiezas gratis: haces el diagnóstico, eliges 3 lecciones de cualquier tema y pruebas un simulacro. Para desbloquear todo pagas $45 una sola vez, con IVA incluido, y tienes acceso hasta el examen de 2027. Puedes pagar con Deuna o por transferencia.'},
  {p: '¿Es del Ineval?', r: 'No. Somos una plataforma independiente que prepara con el temario público de su ficha técnica oficial.'},
  {p: '¿Qué parte de la evaluación prepara?', r: 'La Dimensión 1, la que falta rendir en 2027: Conocimientos generales (pedagógicos y digitales) y Conocimientos de tu especialidad.'},
  {p: '¿Qué curso me toca?', r: 'El de la especialidad de tu nombramiento: el Ineval evalúa a cada docente solo en esa, aunque dé varias materias. Si das clases de 2.º a 7.º, es Educación General Básica. Con el pago único tienes todos los cursos y puedes cambiar cuando quieras.'},
  {p: '¿Necesito instalar algo?', r: 'No. Entras desde el navegador y, si quieres, la guardas en tu celular como una app.'},
];

const MUESTRA: Muestra = (() => {
  const p = CONTENIDO.preguntas.find((x) => x.id === 'diag-gen-05')!;
  return {tema: 'Metodologías', enunciado: p.enunciado, opciones: p.opciones as string[], correcta: p.correcta, explicaciones: p.explicaciones as string[]};
})();

const pildora = 'inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15.5px] font-semibold whitespace-nowrap transition-transform active:translate-y-px';
const flotante = 'rounded-[16px] border border-line bg-surface shadow-[0_18px_40px_-20px_rgba(120,40,10,0.35)] dark:shadow-none';
const ceja = 'text-[13px] font-bold tracking-[0.04em] text-accent-ink uppercase';

export default async function Portada() {
  if (await sesionActual()) redirect('/inicio');

  return (
    <div className="min-h-dvh overflow-x-clip bg-surface">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[900px] bg-[radial-gradient(60%_50%_at_15%_10%,#ffe8dd_0%,transparent_70%),radial-gradient(50%_45%_at_90%_20%,#ffeef0_0%,transparent_70%)] dark:opacity-20" />

      <header className="relative z-20">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
          <Marca />
          <nav className="hidden items-center gap-8 text-[15px] font-medium text-ink-2 md:flex" aria-label="Secciones">
            <a href="#cursos" className="hover:text-ink">Cursos</a>
            <a href="#planes" className="hover:text-ink">Qué incluye</a>
            <a href="#como-funciona" className="hover:text-ink">Cómo funciona</a>
            <a href="#preguntas" className="hover:text-ink">Preguntas</a>
          </nav>
          <div className="flex items-center gap-2">
            <TemaToggle compacto />
            <Link href="/ingresar" className="hidden h-10 items-center gap-1.5 rounded-full px-4 text-[14.5px] font-semibold text-ink hover:bg-surface-2 sm:inline-flex">
              <User size={16} /> Iniciar sesión
            </Link>
            <Link href={REGISTRO} className={`${pildora} h-10 bg-accent px-4 text-[14px] text-white sm:px-5 sm:text-[14.5px]`}>
              Empieza gratis <ArrowRight size={16} className="hidden sm:block" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Portada */}
        <section className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)] items-center gap-12 px-4 pt-8 pb-16 sm:px-6 lg:min-h-[620px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:pt-14 lg:pb-20">
          <div className="rise text-center lg:text-left">
            <span className="inline-flex rounded-full border border-accent/20 bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-accent-ink">Academia en línea para docentes</span>
            <h1 className="mt-6 text-[46px] leading-[1.02] font-semibold tracking-[-0.045em] text-ink sm:text-[68px] xl:text-[78px]">
              Prepárate. Practica. <span className="text-accent">Domina.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[44ch] text-[17.5px] leading-relaxed text-ink-2 sm:text-[20px] lg:mx-0">
              La academia en línea para preparar la Dimensión 1 de tu evaluación docente 2027, a tu ritmo y desde donde quieras.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link href={REGISTRO} className={`${pildora} bg-accent text-white`}>
                Empieza gratis <ArrowRight size={18} />
              </Link>
              <a href="#como-funciona" className={`${pildora} border border-line bg-surface text-ink hover:bg-surface-2`}>
                <Play size={16} /> Ver cómo funciona
              </a>
            </div>
            <p className="mt-4 text-[14.5px] text-ink-2 sm:hidden">
              ¿Ya tienes cuenta?{' '}
              <Link href="/ingresar" className="font-semibold text-accent-ink">
                Inicia sesión
              </Link>
            </p>
          </div>

          {/* La docente recortada sobre una mancha naranja. Las tarjetas flotan solo en pantallas grandes, a los lados
              de la cabeza y sobre la camiseta; en pantallas más chicas van debajo de la foto para no taparle la cara. */}
          <div className="relative mx-auto w-full max-w-[460px]">
            <div className="relative aspect-[1/1.05]">
              <div className="absolute top-[8%] right-[4%] bottom-0 left-[8%] overflow-hidden rounded-[46%_54%_42%_58%/55%_45%_55%_45%] bg-[linear-gradient(150deg,#ffcfb8_0%,#ff8a5c_45%,#f0360a_100%)]">
                <Image src={fotoRecorte} alt="Docente sonriendo" priority sizes="(min-width: 1024px) 460px, 90vw" className="absolute bottom-0 left-[46%] h-auto w-[94%] -translate-x-1/2" />
              </div>
              <div aria-hidden className="absolute top-[2%] right-[6%] flex rotate-[20deg] gap-1.5">
                <span className="h-5 w-1.5 rounded-full bg-accent" />
                <span className="mt-2 h-5 w-1.5 rounded-full bg-accent/70" />
                <span className="mt-4 h-5 w-1.5 rounded-full bg-accent/40" />
              </div>
            </div>
            <ul className="contents">
              {TARJETAS_HERO.map((t) => (
                <li key={t.titulo} className={`${flotante} absolute flex items-center gap-2 p-2 pr-3 sm:gap-3 sm:p-3 sm:pr-5 ${t.lugar}`}>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent sm:h-10 sm:w-10">
                    <t.icono size={18} />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[12px] font-semibold text-ink sm:text-[13.5px]">{t.titulo}</span>
                    <span className="hidden text-[12.5px] text-ink-2 sm:block">{t.texto}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Respaldo */}
        <section aria-label="Lo que incluye" className="mx-auto max-w-[1200px] px-4 pt-6 pb-20 sm:px-6">
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-y-5 sm:grid-cols-[repeat(2,minmax(0,1fr))] lg:grid-cols-[repeat(4,minmax(0,1fr))] lg:divide-x lg:divide-line">
            {RESPALDO.map((r) => (
              <li key={r.titulo} className="flex items-center gap-3.5 lg:justify-center lg:px-4">
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

        {/* Cursos */}
        <section id="cursos" className="mx-auto max-w-[1200px] scroll-mt-8 px-4 pb-20 sm:px-6">
          <p className={ceja}>Cursos</p>
          <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.035em] text-ink sm:text-[38px]">Cursos de la academia</h2>
          <p className="mt-2 max-w-[60ch] text-[16px] text-ink-2">Los conocimientos que se evalúan en la Dimensión 1, con cursos claros y enfocados en tu examen.</p>
          <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
              {CURSOS.map((c) => (
                <article key={c.nombre} className="relative grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[24px] border border-[#f6dccf] bg-[linear-gradient(125deg,#fff3ec,#ffe6d9)] p-6 sm:grid-cols-[minmax(0,1fr)_170px] sm:p-8 dark:border-line dark:bg-surface-2 dark:bg-none">
                  <div>
                    <span className="inline-flex rounded-full bg-surface px-3 py-1 text-[12.5px] font-semibold text-accent-ink">{c.etiqueta}</span>
                    <h3 className="mt-3 text-[28px] leading-tight font-semibold tracking-[-0.03em] text-ink">{c.nombre}</h3>
                    <p className="text-[14.5px] font-semibold text-accent-ink">{c.nivel}</p>
                    <p className="mt-2 max-w-[44ch] text-[15px] leading-relaxed text-ink-2">{c.texto}</p>
                    <ul className="mt-4 flex flex-col gap-2">
                      {c.incluye.map((x) => (
                        <li key={x} className="flex items-center gap-2.5 text-[14.5px] text-ink">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-white">
                            <Check size={12} strokeWidth={3} />
                          </span>
                          {x}
                        </li>
                      ))}
                    </ul>
                    <Link href={REGISTRO} className={`${pildora} mt-6 h-11 border border-accent bg-surface px-5 text-[15px] text-accent-ink hover:bg-accent-soft`}>
                      Empezar el curso <ArrowRight size={17} />
                    </Link>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt="" aria-hidden className="mx-auto mt-6 h-36 w-36 self-center drop-shadow-[0_18px_26px_rgba(120,40,10,0.25)] sm:mt-0 sm:h-40 sm:w-40" />
                </article>
              ))}
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)] content-start gap-5">
              {LATERALES.map((c) => (
                <Link key={c.nombre} href={REGISTRO} className={`group flex items-center gap-5 rounded-[24px] border border-line p-5 sm:p-6 ${c.fondo} dark:bg-surface-2 dark:bg-none`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt="" aria-hidden className="h-20 w-20 shrink-0 drop-shadow-[0_12px_20px_rgba(0,0,0,0.15)] sm:h-24 sm:w-24" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[18px] leading-tight font-semibold tracking-[-0.02em] text-ink">{c.nombre}</span>
                    <span className="mt-1 block text-[14px] leading-snug text-ink-2">{c.texto}</span>
                    <span className="mt-1.5 block text-[12.5px] font-semibold text-ok">Incluido para todas las especialidades</span>
                  </span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface text-accent transition-transform group-hover:translate-x-0.5">
                    <ChevronRight size={18} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Practica */}
        <section className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)] items-center gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
          <div>
            <p className={ceja}>Practica y afianza</p>
            <h2 className="mt-2 text-[30px] leading-[1.08] font-semibold tracking-[-0.035em] text-ink sm:text-[40px]">Pon a prueba tus conocimientos</h2>
            <p className="mt-4 max-w-[44ch] text-[16px] leading-relaxed text-ink-2">Responde preguntas estilo examen, ve al instante por qué y resuelve tus dudas con explicaciones claras.</p>
            <Link href={REGISTRO} className={`${pildora} mt-7 bg-accent text-white`}>
              Empezar práctica gratis <ArrowRight size={18} />
            </Link>
          </div>
          <PreguntaMuestra p={MUESTRA} />
        </section>

        {/* Qué incluye: gratis y acceso completo */}
        <section id="planes" className="scroll-mt-8 bg-[linear-gradient(180deg,transparent,#fff6f1_18%,#fff6f1_82%,transparent)] py-16 dark:bg-none">
          <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
            <div className="text-center">
              <p className={ceja}>Qué incluye</p>
              <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.035em] text-ink sm:text-[38px]">Pruébalo gratis, sigue cuando quieras</h2>
              <p className="mx-auto mt-2 max-w-[52ch] text-[16px] text-ink-2">Empiezas sin pagar. Si te gusta, desbloqueas todo con un solo pago, sin mensualidades.</p>
            </div>
            <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-[repeat(2,minmax(0,1fr))]">
              {PLANES.map((pl) => (
                <article key={pl.nombre} className={`flex flex-col rounded-[24px] p-6 sm:p-7 ${pl.destacado ? 'bg-[linear-gradient(140deg,#e8360c,#ff6a3d)] text-white' : 'border border-line bg-surface'}`}>
                  <h3 className={`text-[22px] font-semibold tracking-[-0.02em] ${pl.destacado ? 'text-white' : 'text-ink'}`}>{pl.nombre}</h3>
                  <p className={`mt-1 text-[15px] ${pl.destacado ? 'text-white' : 'text-ink-2'}`}>{pl.precio}</p>
                  <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                    {pl.incluye.map((x) => (
                      <li key={x} className={`flex items-start gap-2.5 text-[15px] ${pl.destacado ? 'text-white' : 'text-ink'}`}>
                        <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${pl.destacado ? 'bg-white text-accent' : 'bg-accent text-white'}`}>
                          <Check size={12} strokeWidth={3} />
                        </span>
                        {x}
                      </li>
                    ))}
                  </ul>
                  <Link href={REGISTRO} className={`${pildora} mt-6 ${pl.destacado ? 'bg-white text-[#b8300a]' : 'bg-accent text-white'}`}>
                    {pl.boton} <ArrowRight size={18} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Especialidades */}
        <section id="especialidades" className="mx-auto max-w-[1000px] scroll-mt-8 px-4 py-16 sm:px-6">
          <div className="text-center">
            <p className={ceja}>Especialidades</p>
            <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-ink sm:text-[32px]">Elige tu especialidad</h2>
            <p className="mt-2 text-[15px] text-ink-2">Elige la de tu nombramiento: es la única en la que te evalúa el Ineval.</p>
          </div>
          <div className="mt-8 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 sm:grid-cols-[repeat(3,minmax(0,1fr))]">
            {ESPECIALIDADES.map((e) => (
              <div key={e.nombre} className={`flex flex-col items-center rounded-[18px] px-3 py-5 text-center dark:!bg-surface-2 ${e.activa ? 'border-2 border-accent/40' : 'border border-transparent'}`} style={{backgroundColor: e.fondo}}>
                <e.icono size={24} style={{color: e.color}} />
                <p className="mt-2.5 text-[14.5px] leading-snug font-semibold text-ink">{e.nombre}</p>
                <p className="text-[12.5px] text-ink-2">{e.nivel}</p>
                <p className={`mt-1 text-[12.5px] font-semibold ${e.activa ? 'text-ok' : 'text-ink-2'}`}>{e.estado}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" className="mx-auto max-w-[1200px] scroll-mt-8 px-4 pb-20 sm:px-6">
          <div className="text-center">
            <p className={ceja}>Cómo funciona</p>
            <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-ink sm:text-[34px]">Tu camino, paso a paso</h2>
            <p className="mt-2 text-[15.5px] text-ink-2">Un proceso simple para que llegues bien preparado a tu evaluación.</p>
          </div>
          <ol className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {PASOS.map((p, i) => (
              <li key={p.titulo} className="relative flex items-center gap-4 text-left sm:flex-col sm:gap-0 sm:text-center">
                {i < PASOS.length - 1 && <span aria-hidden className="absolute top-7 left-[calc(50%+40px)] hidden h-px w-[calc(100%-80px)] border-t-2 border-dotted border-[#f6c9b6] lg:block" />}
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <p.icono size={24} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[16px] font-semibold text-ink sm:mt-4">
                    {i + 1}. {p.titulo}
                  </h3>
                  <p className="mt-0.5 text-[14px] leading-snug text-ink-2 sm:mt-1">{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Beneficios */}
        <section className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <Image src={fotoCelular} alt="Docente estudiando desde su celular" placeholder="blur" sizes="(min-width: 1024px) 560px, 100vw" className="aspect-[16/10] h-auto w-full rounded-[24px] object-cover" />
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
            <p className={ceja}>Tus beneficios</p>
            <h2 className="mt-2 text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] text-ink sm:text-[36px]">
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
        </section>

        {/* Preguntas frecuentes */}
        <section id="preguntas" className="mx-auto grid max-w-[1200px] scroll-mt-8 grid-cols-[minmax(0,1fr)] gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.6fr)]">
          <div>
            <p className={ceja}>Preguntas frecuentes</p>
            <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-ink sm:text-[34px]">Resuelve tus dudas</h2>
            <p className="mt-2 text-[15px] text-ink-2">Lo que necesitas saber para empezar en Pragma.</p>
          </div>
          <div className="flex flex-col gap-3">
            {FAQ.map((f) => (
              <details key={f.p} className="group rounded-[16px] border border-line bg-surface px-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[16px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {f.p}
                  <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-accent transition-transform group-open:rotate-45">
                    <Plus size={18} />
                  </span>
                </summary>
                <p className="pb-5 text-[15px] leading-relaxed text-ink-2">{f.r}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Banner final */}
        <section className="mx-auto max-w-[1200px] px-4 pb-14 sm:px-6">
          <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 rounded-[28px] bg-[linear-gradient(115deg,#d9300a_0%,#f0360a_45%,#ff6a3d_100%)] px-6 py-10 text-white sm:px-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div>
              <h2 className="text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[38px]">Empieza hoy tu preparación</h2>
              <p className="mt-3 text-[16.5px] text-white">Crea tu cuenta gratis, haz tu diagnóstico y prueba 3 lecciones a tu elección.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={REGISTRO} className={`${pildora} bg-white text-[#b8300a]`}>
                  Empieza gratis <ArrowRight size={18} />
                </Link>
                <Link href="/ingresar" className={`${pildora} border border-white/60 text-white hover:bg-white/10`}>
                  Iniciar sesión
                </Link>
              </div>
            </div>
            <dl className="grid grid-cols-3 divide-x divide-white/30 border-white/30 lg:border-l lg:pl-6">
              {CIFRAS.map((c) => (
                <div key={c.t} className="flex flex-col items-center px-2 text-center">
                  <c.icono size={24} className="text-white" />
                  <dd className="num mt-2 text-[34px] leading-none font-semibold tracking-[-0.03em]">{c.n}</dd>
                  <dt className="mt-1 text-[13px] leading-snug text-white">{c.t}</dt>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <Marca />
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-ink-2" aria-label="Pie de página">
            <a href="#cursos" className="hover:text-ink">Cursos</a>
            <a href="#planes" className="hover:text-ink">Qué incluye</a>
            <a href="#como-funciona" className="hover:text-ink">Cómo funciona</a>
            <a href="#preguntas" className="hover:text-ink">Preguntas</a>
          </nav>
          <div className="max-w-[46ch]">
            <Aviso />
          </div>
        </div>
      </footer>
      <BotonWhatsApp />
    </div>
  );
}
