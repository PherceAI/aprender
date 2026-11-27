import Image from 'next/image';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Briefcase,
  Calculator,
  CalendarCheck,
  ChevronRight,
  CircleCheck,
  ClipboardCheck,
  Dna,
  FileCheck,
  FlaskConical,
  Gauge,
  Globe,
  Info,
  Layers,
  Leaf,
  ListChecks,
  MessageCircle,
  MessageSquareText,
  PlayCircle,
  Plus,
  Repeat,
  School,
  Shapes,
  Sparkles,
  Timer,
  type LucideIcon,
} from 'lucide-react';
import {sesionActual} from '@/lib/auth/cookies';
import {LECCIONES_GRATIS} from '@/lib/acceso';
import {configPayphone} from '@/lib/payphone';
import {TemaToggle} from '@/components/tema-toggle';
import {PreguntaMuestra, type Muestra} from '@/components/pregunta-muestra';
import {BotonWhatsApp, IconoWhatsApp, enlaceWhatsApp} from '@/components/whatsapp';
import {CONTENIDO} from '@/contenido';
import type {Bloque} from '@/contenido/tipos';
import type {StaticImageData} from 'next/image';
import fotoPortada from '@/public/landing/docente-portada.png';
import fotoEgb from '@/public/landing/cursos/egb.jpg';
import fotoCcnn from '@/public/landing/cursos/ccnn.jpg';
import fotoPedagogicos from '@/public/landing/cursos/pedagogicos.jpg';
import fotoDigitales from '@/public/landing/cursos/digitales.jpg';

// Portada pública (boceto v2 aprobado por el dueño el 26 nov, sobre su referencia de academia):
// barra superior y bandas en azul marino, naranja como acento, docente recortada sobre un círculo naranja.
// Reglas: columnas parejas (nunca 2 contra 1), cifras solo reales (se calculan del contenido),
// sin alumnos, profesores ni testimonios inventados. La foto es generada con IA (public/landing/CREDITOS.md).

const REGISTRO = '/registro';
const MARINO = 'bg-[#111a2e]';

// ---------- Cifras reales, calculadas del contenido para que no se desactualicen ----------
const bloque = (id: string) => CONTENIDO.bloques.find((b) => b.id === id) as Bloque;
const temasDe = (b: Bloque, unidades?: string[]) => b.unidades.filter((u) => !unidades || unidades.includes(u.id)).flatMap((u) => u.temas);
const leccionesListas = (b: Bloque, unidades?: string[]) => temasDe(b, unidades).flatMap((t) => t.lecciones).filter((l) => l.contenido?.length).length;

const GEN = bloque('generales');
const CCNN = bloque('ccnn-disciplinares');
const EGB = bloque('egb-disciplinares');
const PEDAGOGICOS = ['gen-fundamentos', 'gen-curriculo', 'gen-ensenanza'];
const DIGITALES = ['gen-digitales', 'gen-internet'];

const asignaturasEgb = [...new Set(EGB.unidades.map((u) => u.asignatura).filter(Boolean))] as string[];
const asignaturasEgbAbiertas = asignaturasEgb.filter((a) => EGB.unidades.filter((u) => u.asignatura === a).every((u) => u.temas.every((t) => t.abierto)));
const temasCcnnAbiertos = temasDe(CCNN).filter((t) => t.abierto);

const TOTAL_PREGUNTAS = CONTENIDO.preguntas.length;
const TOTAL_LECCIONES = CONTENIDO.bloques.reduce((n, b) => n + leccionesListas(b), 0);

// ---------- Contenido de las secciones ----------
// Datos de la portada: en computadora flotan a los lados de la docente; en teléfono van en una franja debajo.
const DATOS_PORTADA: {icono: LucideIcon; titulo: string; texto: string}[] = [
  {icono: ListChecks, titulo: `${GEN.preguntasExamen + EGB.preguntasExamen} preguntas`, texto: 'como el examen real'},
  {icono: Gauge, titulo: '0 a 1000', texto: 'tu puntaje estimado'},
  {icono: FileCheck, titulo: 'Ficha oficial', texto: 'todo el temario'},
];

// Fotos reales de Unsplash (licencia libre, ver public/landing/CREDITOS.md).
type Curso = {nombre: string; nivel: string; foto: StaticImageData; alt: string; etiqueta: string; etiquetaClase: string; meta: [LucideIcon, string][]; pie: string};

const CURSOS: Curso[] = [
  {
    nombre: 'Educación General Básica',
    nivel: 'De 2.º a 7.º año',
    foto: fotoEgb,
    alt: 'Niños de escuela trabajando en sus pupitres',
    etiqueta: 'Disponible',
    etiquetaClase: 'bg-ok',
    meta: [
      [Layers, `${temasDe(EGB).length} temas`],
      [BookOpen, `${asignaturasEgb.length} asignaturas`],
    ],
    pie: asignaturasEgbAbiertas.length === 1 ? `${asignaturasEgbAbiertas[0]} completa` : `${asignaturasEgbAbiertas.length} asignaturas completas`,
  },
  {
    nombre: 'Ciencias Naturales',
    nivel: 'EGB Superior, 8.º a 10.º',
    foto: fotoCcnn,
    alt: 'Estudiante con bata mirando por un microscopio',
    etiqueta: 'Disponible',
    etiquetaClase: 'bg-ok',
    meta: [
      [Layers, `${temasDe(CCNN).length} temas`],
      [FlaskConical, 'Laboratorio'],
    ],
    pie: temasCcnnAbiertos.length === 1 ? temasCcnnAbiertos[0].nombre : `${temasCcnnAbiertos.length} temas abiertos`,
  },
  {
    nombre: 'Conocimientos pedagógicos',
    // 21 de las 39 preguntas de Conocimientos generales (ficha técnica, págs. 4 y 5).
    nivel: 'Generales, 21 preguntas del examen',
    foto: fotoPedagogicos,
    alt: 'Docente dando clase frente a su grupo',
    etiqueta: 'En todos los cursos',
    etiquetaClase: 'bg-[#d42d06]',
    meta: [
      [Layers, `${temasDe(GEN, PEDAGOGICOS).length} temas`],
      [PlayCircle, `${leccionesListas(GEN, PEDAGOGICOS)} lecciones`],
    ],
    pie: 'Curso completo',
  },
  {
    nombre: 'Conocimientos digitales',
    nivel: 'Generales, 18 preguntas del examen',
    foto: fotoDigitales,
    alt: 'Docente trabajando con su laptop en el aula',
    etiqueta: 'En todos los cursos',
    etiquetaClase: 'bg-[#d42d06]',
    meta: [
      [Layers, `${temasDe(GEN, DIGITALES).length} temas`],
      [PlayCircle, `${leccionesListas(GEN, DIGITALES)} lecciones`],
    ],
    pie: 'Curso completo',
  },
];

// Nombre corto, ícono y color de cada especialidad; el estado (disponible o pronto) sale del contenido.
const VISTA_ESPECIALIDAD: Record<string, {corto: string; icono: LucideIcon; color: string; fondo: string}> = {
  'egb-elemental-media': {corto: 'EGB 2.º a 7.º', icono: School, color: '#2563eb', fondo: '#ecf2ff'},
  'ccnn-egb-superior': {corto: 'Ciencias Naturales', icono: Leaf, color: '#15803d', fondo: '#e9f8ef'},
  'estudios-sociales-egb-superior': {corto: 'Estudios Sociales', icono: Globe, color: '#b45309', fondo: '#fff6e5'},
  'biologia-bgu': {corto: 'Biología', icono: Dna, color: '#15803d', fondo: '#e9f8ef'},
  'quimica-bgu': {corto: 'Química', icono: FlaskConical, color: '#b45309', fondo: '#fff6e5'},
  'filosofia-bgu': {corto: 'Filosofía', icono: Brain, color: '#c0267a', fondo: '#fdf0f6'},
  'emprendimiento-bgu': {corto: 'Emprendimiento', icono: Briefcase, color: '#b45309', fondo: '#fff6e5'},
  'matematica-egb-superior': {corto: 'Matemática', icono: Calculator, color: '#2563eb', fondo: '#ecf2ff'},
  'lengua-egb-superior': {corto: 'Lengua', icono: BookOpen, color: '#c0267a', fondo: '#fdf0f6'},
};
const ESPECIALIDADES = [...CONTENIDO.especialidades]
  .sort((a, b) => Number(b.estado === 'activa') - Number(a.estado === 'activa') || a.orden - b.orden)
  .filter((e) => VISTA_ESPECIALIDAD[e.id])
  .map((e) => ({...VISTA_ESPECIALIDAD[e.id], id: e.id, activa: e.estado === 'activa'}));

const POR_QUE: {icono: LucideIcon; titulo: string; texto: string}[] = [
  {icono: ClipboardCheck, titulo: 'Diagnóstico personal', texto: 'Una pregunta por tema: sabes qué reforzar desde el primer día.'},
  {icono: Timer, titulo: 'Lecciones de 5 a 8 min', texto: 'Una idea por pantalla, con ejemplos del aula.'},
  {icono: Repeat, titulo: 'Repaso inteligente', texto: 'Lo que fallas vuelve a los 1, 3, 7, 14 y 30 días.'},
  {icono: Sparkles, titulo: 'Tutor con IA', texto: 'Resuelve tus dudas con el contenido de tu lección.'},
];

const CIFRAS: {icono: LucideIcon; n: string; t: string}[] = [
  {icono: MessageSquareText, n: String(TOTAL_PREGUNTAS), t: 'preguntas con su explicación'},
  {icono: PlayCircle, n: String(TOTAL_LECCIONES), t: 'lecciones interactivas'},
  {icono: Shapes, n: '5', t: 'formatos, como en el examen'},
  {icono: Gauge, n: '0 a 1000', t: 'tu puntaje estimado'},
];

const PASOS: {titulo: string; texto: string}[] = [
  {titulo: 'Diagnóstico', texto: 'Ves tu puntaje estimado y qué temas reforzar.'},
  {titulo: 'Lecciones cortas', texto: 'Aprendes solo lo que no sabes, a tu ritmo.'},
  {titulo: 'Práctica y prueba', texto: 'Con 80 % en la prueba, el tema queda dominado.'},
  {titulo: 'Repaso y simulacro', texto: 'Lo fallado vuelve y cierras con el simulacro.'},
];

const FAQ: {p: string; r: string}[] = [
  {p: '¿Es del Ineval?', r: 'No. Somos una plataforma independiente que prepara con el temario público de su ficha técnica oficial.'},
  {p: '¿Qué parte de la evaluación prepara?', r: 'La Dimensión 1, la que falta rendir en 2027: Conocimientos generales (pedagógicos y digitales) y Conocimientos de tu especialidad.'},
  {p: '¿Qué curso me toca?', r: 'El de tu nombramiento: el Ineval te evalúa solo en esa especialidad. Si das clases de 2.º a 7.º, es Educación General Básica.'},
  {p: '¿Cuándo se abren los temas que faltan?', r: 'Antes del examen de 2027, una asignatura a la vez. Con el pago único los recibes sin pagar más.'},
  {p: '¿Necesito instalar algo?', r: 'No. Entras desde el navegador y, si quieres, la agregas a tu celular como una app.'},
];

const MUESTRA: Muestra = (() => {
  const p = CONTENIDO.preguntas.find((x) => x.id === 'diag-gen-05')!;
  return {tema: 'Metodologías', enunciado: p.enunciado, opciones: p.opciones as string[], correcta: p.correcta, explicaciones: p.explicaciones as string[]};
})();

// ---------- Piezas de estilo ----------
const boton = 'inline-flex h-12 items-center justify-center gap-2 rounded-[10px] px-6 text-[15px] font-semibold whitespace-nowrap transition-[transform,background-color] active:translate-y-px';
const principal = `${boton} bg-[#d42d06] text-white hover:bg-[#b92705]`;
const contorno = `${boton} border-[1.5px] border-[#111a2e] bg-surface text-[#111a2e] hover:bg-bg dark:border-line dark:text-ink`;
const tarjeta = 'rounded-[16px] border border-line bg-surface';
const tituloSeccion = 'text-[26px] leading-[1.15] font-bold tracking-[-0.03em] text-ink sm:text-[34px]';
const tituloColumna = 'text-[22px] leading-tight font-bold tracking-[-0.03em] text-ink sm:text-[24px]';

function Simbolo({className = 'h-[34px] w-[34px]'}: {className?: string}) {
  const mascara = 'url(/marca/pragma-simbolo.png) center / contain no-repeat';
  return <span aria-hidden className={`shrink-0 bg-accent ${className}`} style={{WebkitMask: mascara, mask: mascara}} />;
}

function Logo({oscuro = false}: {oscuro?: boolean}) {
  return (
    <span className="flex items-center gap-2.5">
      <Simbolo />
      <span className="leading-none">
        <span className={`block text-[21px] font-bold tracking-[-0.03em] ${oscuro ? 'text-white' : 'text-ink'}`}>Pragma</span>
        <span className={`mt-1 hidden text-[11.5px] min-[480px]:block ${oscuro ? 'text-[#9aa3b8]' : 'text-ink-3'}`}>Academia para docentes</span>
      </span>
    </span>
  );
}

export default async function Portada() {
  if (await sesionActual()) redirect('/inicio');
  const conTarjeta = configPayphone() !== null;
  const whatsapp = enlaceWhatsApp();

  return (
    <div className="min-h-dvh overflow-x-clip bg-surface">
      {/* 1. Barra superior */}
      <div className={`${MARINO} text-[13.5px] text-[#cfd5e3]`}>
        <div className="mx-auto flex h-[42px] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
          <span className="flex min-w-0 items-center gap-2">
            <CalendarCheck size={15} className="shrink-0 text-[#ff8a5c]" />
            <span className="truncate">
              <span className="hidden md:inline">Evaluación del Desempeño Docente 2027 · </span>Dimensión 1
            </span>
          </span>
          <div className="flex shrink-0 items-center gap-5">
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 hover:text-white md:flex">
              <MessageCircle size={15} className="text-[#ff8a5c]" /> WhatsApp
            </a>
            <Link href="/ingresar" className="font-semibold text-white hover:underline sm:hidden">
              Ingresar
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Cabecera */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-[66px] max-w-[1200px] items-center justify-between gap-4 px-4 sm:h-[76px] sm:px-6">
          <Link href="/" aria-label="Pragma, inicio">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-8 text-[15px] font-medium text-ink-2 lg:flex" aria-label="Secciones">
            <a href="#cursos" className="hover:text-ink">Cursos</a>
            <a href="#como-funciona" className="hover:text-ink">Cómo funciona</a>
            <a href="#planes" className="hover:text-ink">Precio</a>
            <a href="#preguntas" className="hover:text-ink">Preguntas</a>
          </nav>
          <div className="flex items-center gap-2">
            <TemaToggle compacto />
            <Link href="/ingresar" className={`${contorno} h-11 px-[18px] text-[14.5px] max-sm:hidden`}>
              Ingresar
            </Link>
            <Link href={REGISTRO} className={`${principal} h-11 px-4 text-[14.5px] sm:px-[18px]`}>
              Empieza gratis
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* 3. Portada */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fff6f2_0%,#ffffff_100%)] dark:bg-none">
          <div aria-hidden className="pointer-events-none absolute -top-[200px] -right-[180px] h-[620px] w-[620px] rounded-full bg-[radial-gradient(closest-side,#ffe3d6,transparent)] dark:opacity-10" />
          <div className="relative mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 pt-12 sm:px-6 lg:min-h-[560px] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:pt-0">
            <div className="rise">
              <span className="inline-flex items-center gap-2.5 text-[14px] font-semibold text-accent-ink">
                <span aria-hidden className="h-0.5 w-7 rounded-full bg-accent" />
                Academia en línea para docentes de Ecuador
              </span>
              <h1 className="mt-[18px] text-[38px] leading-[1.06] font-bold tracking-[-0.04em] text-[#111a2e] sm:text-[48px] lg:text-[56px] dark:text-ink">
                Prepárate para tu evaluación docente con <span className="text-accent">Pragma</span>
              </h1>
              <p className="mt-5 max-w-[48ch] text-[17px] leading-relaxed text-ink-2 sm:text-[17.5px]">
                Diagnóstico, lecciones cortas, práctica tipo examen y simulacros de la Dimensión 1, con el temario de la ficha técnica oficial.
              </p>
              <div className="mt-[30px] flex flex-wrap gap-3">
                <Link href={REGISTRO} className={`${principal} max-sm:flex-1 max-sm:basis-full`}>
                  Empieza gratis <ArrowRight size={18} />
                </Link>
                <a href="#cursos" className={`${contorno} max-sm:flex-1 max-sm:basis-full`}>
                  <BookOpen size={18} /> Ver los cursos
                </a>
              </div>
              <ul className="mt-7 flex flex-wrap gap-x-[22px] gap-y-2.5 text-[14.5px] font-medium text-ink-2">
                {['Diagnóstico gratis', 'Pago único de $45', 'En tu celular'].map((x) => (
                  <li key={x} className="flex items-center gap-[7px]">
                    <CircleCheck size={17} className="text-ok" /> {x}
                  </li>
                ))}
              </ul>
            </div>

            {/* La docente recortada sobre el círculo naranja. Nada se le pone encima: en computadora, dos tarjetas
                a su derecha, lejos de la cara (medido con su silueta); en pantallas menores, los datos van en una franja debajo de la foto. */}
            <div className="pb-10 xl:pb-0">
            <div className="relative mx-auto h-[360px] w-full max-w-[460px] sm:h-[440px] lg:h-[520px] lg:max-w-none">
              <span aria-hidden className="absolute top-[30px] left-0 hidden h-[60px] w-[84px] bg-[radial-gradient(#f0360a_1.6px,transparent_1.8px)] bg-[length:14px_14px] opacity-55 sm:block" />
              <span aria-hidden className="absolute right-[10px] bottom-[120px] hidden h-[60px] w-[84px] bg-[radial-gradient(#f0360a_1.6px,transparent_1.8px)] bg-[length:14px_14px] opacity-55 sm:block" />
              <span aria-hidden className="absolute -bottom-[18px] left-1/2 xl:left-[36%] h-[320px] w-[320px] -translate-x-1/2 rounded-full border-[1.5px] border-dashed border-[#f6b59c] sm:h-[396px] sm:w-[396px] lg:h-[470px] lg:w-[470px]" />
              <span aria-hidden className="absolute bottom-0 left-1/2 xl:left-[36%] h-[290px] w-[290px] -translate-x-1/2 rounded-full bg-[linear-gradient(150deg,#ff7a4d_0%,#f0360a_55%,#c62a04_100%)] sm:h-[360px] sm:w-[360px] lg:h-[430px] lg:w-[430px]" />
              <Image
                src={fotoPortada}
                alt="Docente con sus libros"
                priority
                sizes="(min-width: 1024px) 365px, (min-width: 640px) 307px, 252px"
                className="absolute bottom-0 left-1/2 xl:left-[36%] z-[1] h-[345px] w-auto max-w-none -translate-x-1/2 drop-shadow-[0_20px_30px_rgba(17,26,46,0.18)] sm:h-[420px] lg:h-[500px]"
              />
              <Flotante className="top-[36px] right-0" {...DATOS_PORTADA[0]} />
              <Flotante className="top-[128px] right-0" {...DATOS_PORTADA[1]} />
            </div>
            <ul className="mx-auto grid max-w-[460px] grid-cols-[repeat(3,minmax(0,1fr))] divide-x divide-line rounded-[16px] border border-line bg-surface py-3.5 shadow-[0_14px_30px_-22px_rgba(17,26,46,0.35)] xl:hidden">
              {DATOS_PORTADA.map((d) => (
                <li key={d.titulo} className="flex flex-col items-center gap-1 px-2 text-center">
                  <d.icono size={20} className="text-accent" />
                  <b className="num text-[15px] leading-tight font-bold text-ink sm:text-[17px]">{d.titulo}</b>
                  <span className="text-[12px] leading-tight text-ink-3">{d.texto}</span>
                </li>
              ))}
            </ul>
            </div>
          </div>
        </section>

        {/* 4. Cursos: 4 tarjetas con imagen */}
        <section id="cursos" className="scroll-mt-20 py-14 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <div className="mx-auto mb-9 max-w-[620px] text-center">
              <h2 className={tituloSeccion}>Cursos de la academia</h2>
              <p className="mt-2.5 text-[16px] leading-relaxed text-ink-2">Elige el de tu nombramiento. Con el pago único tienes todos y puedes cambiar cuando quieras.</p>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)] gap-[22px] min-[600px]:grid-cols-[repeat(2,minmax(0,1fr))] lg:grid-cols-[repeat(4,minmax(0,1fr))]">
              {CURSOS.map((c) => (
                <article key={c.nombre} className={`${tarjeta} group flex flex-col overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_18px_36px_-24px_rgba(17,26,46,0.35)]`}>
                  <div className="relative h-[180px] overflow-hidden bg-bg">
                    <Image src={c.foto} alt={c.alt} fill placeholder="blur" sizes="(min-width: 1024px) 280px, (min-width: 600px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                    <span className={`absolute bottom-3 left-3.5 inline-flex h-[26px] items-center rounded-[6px] px-2.5 text-[12.5px] font-semibold text-white ${c.etiquetaClase}`}>{c.etiqueta}</span>
                  </div>
                  <div className="flex flex-1 flex-col px-[18px] pt-[18px] pb-4">
                    <h3 className="text-[17px] leading-snug font-semibold tracking-[-0.01em] text-ink">{c.nombre}</h3>
                    <p className="mt-1 text-[13px] text-ink-3">{c.nivel}</p>
                    <div className="mt-3.5 mb-4 flex gap-4 text-[13.5px] text-ink-2">
                      {c.meta.map(([Icono, t]) => (
                        <span key={t} className="flex items-center gap-1.5">
                          <Icono size={15} className="text-ink-3" /> {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3.5">
                      <b className="text-[14px] text-ink">{c.pie}</b>
                      <span className="flex items-center gap-1 text-[13px] font-semibold text-ok">
                        <CircleCheck size={15} /> Abierto
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Link href={REGISTRO} className={`${boton} ${MARINO} text-white hover:bg-[#1a2540]`}>
                Empieza con tu diagnóstico <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Especialidades | ¿Por qué Pragma?, y la banda de cifras */}
        <section className="bg-bg py-14 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <div className="grid grid-cols-[minmax(0,1fr)] rounded-[20px] border border-line bg-surface lg:grid-cols-[repeat(2,minmax(0,1fr))]">
              <div className="p-[18px] sm:p-8">
                <div className="mb-6 flex items-end justify-between gap-4">
                  <h2 className={tituloColumna}>Especialidades</h2>
                  <a href="#preguntas" className="inline-flex items-center gap-1 text-[14px] font-semibold whitespace-nowrap text-accent-ink">
                    ¿Cuál me toca? <ChevronRight size={16} />
                  </a>
                </div>
                <ul className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-2 sm:gap-3">
                  {ESPECIALIDADES.map((e) => (
                    <li key={e.id} className={`flex min-w-0 flex-col items-start gap-2 rounded-[12px] border p-2.5 sm:p-3 xl:flex-row xl:items-center xl:gap-2.5 ${e.activa ? 'border-[#ffc9b5] bg-[#fff6f2] dark:border-line dark:bg-surface-2' : 'border-line'}`}>
                      <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px]" style={{background: e.fondo, color: e.color}}>
                        <e.icono size={19} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[12.5px] leading-tight font-semibold hyphens-auto text-ink sm:text-[13.5px]">{e.corto}</span>
                        <span className={`text-[12px] ${e.activa ? 'font-semibold text-ok' : 'text-ink-3'}`}>{e.activa ? 'Disponible' : 'Muy pronto'}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-line p-[18px] sm:p-8 lg:border-t-0 lg:border-l">
                <h2 className={`${tituloColumna} mb-6`}>¿Por qué Pragma?</h2>
                <ul className="grid grid-cols-[minmax(0,1fr)] gap-x-5 gap-y-[22px] min-[480px]:grid-cols-[repeat(2,minmax(0,1fr))]">
                  {POR_QUE.map((p) => (
                    <li key={p.titulo} className="flex items-start gap-3">
                      <span className={`grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full ${MARINO} text-white`}>
                        <p.icono size={19} />
                      </span>
                      <span>
                        <span className="block text-[15px] font-semibold text-ink">{p.titulo}</span>
                        <span className="mt-0.5 block text-[13.5px] leading-normal text-ink-2">{p.texto}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 flex items-center gap-3 rounded-[12px] bg-accent-soft px-4 py-3.5 text-[14px] leading-normal text-ink">
                  <Info size={18} className="shrink-0 text-accent" />
                  Solo preparamos la Dimensión 1: es la única que se prepara estudiando.
                </p>
              </div>
            </div>

            {/* Cifras en claro (el dueño no quiso la banda oscura): tarjeta blanca, cifra naranja y una línea fina entre cada una. */}
            <dl className="mt-6 grid grid-cols-[repeat(2,minmax(0,1fr))] rounded-[20px] border border-line bg-surface lg:grid-cols-[repeat(4,minmax(0,1fr))]">
              {CIFRAS.map((c, i) => (
                <div
                  key={c.t}
                  className={`flex flex-col gap-3 px-4 py-5 sm:px-7 sm:py-7 ${i % 2 === 1 ? 'border-l border-line' : ''} ${i >= 2 ? 'border-t border-line lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-soft text-accent">
                    <c.icono size={19} />
                  </span>
                  <span>
                    <dd className="num text-[28px] leading-none font-bold tracking-[-0.03em] text-accent-ink sm:text-[34px]">{c.n}</dd>
                    <dt className="mt-1.5 text-[14px] leading-snug text-ink-2">{c.t}</dt>
                  </span>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 6. Cómo funciona | Pregunta de muestra */}
        <section id="como-funciona" className="scroll-mt-20 py-14 sm:py-20">
          <div className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)] gap-8 px-4 sm:px-6 lg:grid-cols-[repeat(2,minmax(0,1fr))]">
            <div>
              <div className="mb-6 flex items-end justify-between gap-4">
                <h2 className={tituloColumna}>Cómo funciona</h2>
                <Link href={REGISTRO} className="inline-flex items-center gap-1 text-[14px] font-semibold whitespace-nowrap text-accent-ink">
                  Empieza gratis <ChevronRight size={16} />
                </Link>
              </div>
              <ol className="flex flex-col gap-3">
                {PASOS.map((p, i) => (
                  <li key={p.titulo} className={`${tarjeta} grid grid-cols-[50px_minmax(0,1fr)] items-center gap-3 rounded-[14px] p-3.5 sm:grid-cols-[58px_minmax(0,1fr)] sm:gap-4`}>
                    <span className={`grid h-[50px] w-[50px] place-items-center rounded-[12px] text-[22px] font-bold text-white sm:h-[58px] sm:w-[58px] ${i % 2 ? 'bg-[#d42d06]' : MARINO}`}>{i + 1}</span>
                    <div>
                      <h3 className="text-[16px] font-semibold text-ink">{p.titulo}</h3>
                      <p className="mt-0.5 text-[13.5px] leading-normal text-ink-2">{p.texto}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h2 className={`${tituloColumna} mb-6`}>Prueba una pregunta</h2>
              <PreguntaMuestra p={MUESTRA} />
            </div>
          </div>
        </section>

        {/* 7. Planes | Planes | Preguntas frecuentes */}
        <section id="planes" className="scroll-mt-20 bg-bg py-14 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <div className="mx-auto mb-9 max-w-[620px] text-center">
              <h2 className={tituloSeccion}>Empieza gratis, sigue cuando quieras</h2>
              <p className="mt-2.5 text-[16px] leading-relaxed text-ink-2">
                Un solo pago, sin mensualidades. Pagas con Deuna, transferencia{conTarjeta ? ' o tarjeta' : ''}.
              </p>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)] gap-[22px] md:grid-cols-[repeat(2,minmax(0,1fr))] lg:grid-cols-[repeat(3,minmax(0,1fr))]">
              <Plan
                nombre="Cuenta gratis"
                precio="$0"
                nota="para conocer Pragma"
                incluye={['Diagnóstico completo y tu puntaje', `${LECCIONES_GRATIS} lecciones a tu elección`, 'Un simulacro para conocerlo']}
                boton={
                  <Link href={REGISTRO} className={`${contorno} w-full`}>
                    Crear cuenta gratis
                  </Link>
                }
              />
              <Plan
                destacado
                nombre="Acceso completo"
                precio="$45"
                nota="pago único con IVA, hasta 2027"
                incluye={['Todos los cursos y los temas nuevos', 'Práctica y prueba de cada tema', 'Simulacros como el examen real', 'Repaso y tutor con IA']}
                boton={
                  <Link href={REGISTRO} className={`${principal} w-full`}>
                    Quiero el acceso completo
                  </Link>
                }
              />
              <div id="preguntas" className={`${tarjeta} scroll-mt-24 px-6 py-[22px] md:col-span-2 lg:col-span-1`}>
                <h3 className="mb-1 text-[17px] font-semibold text-ink">Preguntas frecuentes</h3>
                {FAQ.map((f, i) => (
                  <details key={f.p} open={i === 0} className="group border-b border-line last:border-b-0">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3.5 text-[14.5px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                      {f.p}
                      <Plus size={18} className="shrink-0 text-accent transition-transform group-open:rotate-45" />
                    </summary>
                    <p className="pb-3.5 text-[13.5px] leading-relaxed text-ink-2">{f.r}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 8. Dudas: todo el contacto va directo a WhatsApp (decisión del dueño, sin formularios de correo). */}
        <section className="pt-14 sm:pt-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-6 rounded-[20px] border border-[#ffd9c9] bg-accent-soft px-5 py-7 sm:px-9 md:grid-cols-[auto_minmax(0,1fr)_auto] dark:border-line">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[#15803d] text-white max-md:hidden">
                <IconoWhatsApp size={28} />
              </span>
              <div>
                <h2 className="text-[22px] leading-tight font-bold tracking-[-0.02em] text-ink sm:text-[24px]">¿Tienes dudas antes de empezar?</h2>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">Escríbenos por WhatsApp: te ayudamos a elegir tu curso y te explicamos cómo pagar.</p>
              </div>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`${boton} bg-[#15803d] text-white hover:bg-[#126c34] max-md:w-full`}>
                <IconoWhatsApp size={20} /> Escríbenos por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Pie */}
      <footer className={`${MARINO} mt-16 text-[#c4cadb]`}>
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-8 py-14 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
            <div className="col-span-2 lg:col-span-1">
              <Logo oscuro />
              <p className="mt-3.5 max-w-[36ch] text-[14px] leading-relaxed">
                Preparación para la Evaluación del Desempeño Docente 2027. Pragma no es el Ineval ni habla en su nombre: el temario sale de su ficha técnica pública.
              </p>
            </div>
            <Columna titulo="Plataforma" enlaces={[['Cursos', '#cursos'], ['Cómo funciona', '#como-funciona'], ['Precio', '#planes'], ['Preguntas', '#preguntas']]} />
            <Columna titulo="Fichas oficiales" enlaces={[['EGB 2.º a 7.º (PDF)', '/ficha-tecnica-egb.pdf'], ['Ciencias Naturales (PDF)', '/ficha-tecnica-ccnn.pdf']]} />
            <Columna titulo="Tu cuenta" enlaces={[['Empieza gratis', REGISTRO], ['Ingresar', '/ingresar'], ['WhatsApp', whatsapp]]} />
          </div>
          <div className="flex flex-col gap-1.5 border-t border-white/10 py-[18px] text-[13px] sm:flex-row sm:justify-between">
            <span>© 2026 Pragma. Todos los derechos reservados.</span>
            <span>Hecho en Ecuador para sus docentes</span>
          </div>
        </div>
      </footer>
      <BotonWhatsApp />
    </div>
  );
}

function Flotante({className, icono: Icono, titulo, texto}: {className: string; icono: LucideIcon; titulo: string; texto: string}) {
  return (
    <div className={`absolute z-[2] flex items-center gap-3 rounded-[14px] border border-line bg-surface py-3 pr-4 pl-3 shadow-[0_14px_30px_-18px_rgba(17,26,46,0.35)] max-xl:hidden ${className}`}>
      <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-accent-soft text-accent">
        <Icono size={20} />
      </span>
      <span>
        <b className="num block text-[19px] leading-tight tracking-[-0.02em] text-[#111a2e] dark:text-ink">{titulo}</b>
        <span className="text-[12.5px] text-ink-3">{texto}</span>
      </span>
    </div>
  );
}

function Plan({nombre, precio, nota, incluye, boton, destacado = false}: {nombre: string; precio: string; nota: string; incluye: string[]; boton: React.ReactNode; destacado?: boolean}) {
  return (
    <article className={`flex flex-col rounded-[16px] border p-[26px] ${destacado ? `${MARINO} border-[#111a2e] text-white` : 'border-line bg-surface'}`}>
      {destacado && <span className="mb-2.5 self-start rounded-[6px] bg-[#d42d06] px-2.5 py-1 text-[12px] font-semibold text-white">Recomendado</span>}
      <h3 className={`text-[17px] font-semibold ${destacado ? 'text-white' : 'text-ink'}`}>{nombre}</h3>
      <p className="mt-3 flex items-baseline gap-2">
        <b className={`num text-[46px] leading-none tracking-[-0.04em] ${destacado ? 'text-white' : 'text-[#111a2e] dark:text-ink'}`}>{precio}</b>
        <span className={`text-[13.5px] ${destacado ? 'text-[#c4cadb]' : 'text-ink-3'}`}>{nota}</span>
      </p>
      <ul className={`mt-5 mb-6 flex flex-1 flex-col gap-2.5 border-t pt-[18px] ${destacado ? 'border-white/14' : 'border-line'}`}>
        {incluye.map((x) => (
          <li key={x} className={`flex gap-2.5 text-[14.5px] leading-snug ${destacado ? 'text-white' : 'text-ink'}`}>
            <CircleCheck size={18} className={`mt-px shrink-0 ${destacado ? 'text-[#ff8a5c]' : 'text-ok'}`} /> {x}
          </li>
        ))}
      </ul>
      {boton}
    </article>
  );
}

function Columna({titulo, enlaces}: {titulo: string; enlaces: [string, string][]}) {
  return (
    <div>
      <h4 className="mb-3.5 text-[15px] font-semibold text-white">{titulo}</h4>
      {enlaces.map(([t, href]) => (
        <a key={t} href={href} className="block py-[5px] text-[14px] hover:text-white" {...(href.startsWith('http') || href.endsWith('.pdf') ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>
          {t}
        </a>
      ))}
    </div>
  );
}
