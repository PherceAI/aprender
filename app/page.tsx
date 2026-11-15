import Link from 'next/link';
import {redirect} from 'next/navigation';
import {ArrowRight, Gauge, Repeat, Route, Timer} from 'lucide-react';
import {sesionActual} from '@/lib/auth/cookies';
import {Aviso, Marca, btn} from '@/components/ui';
import {TemaToggle} from '@/components/tema-toggle';
import {Explorar} from '@/components/laboratorio/explorar';
import {CONTENIDO} from '@/contenido';

// Página pública: qué es y para quién, en una mirada. Entra con «Iniciar sesión».

const PASOS = [
  {icono: Gauge, titulo: 'Te conocemos primero', texto: '18 preguntas cortas y, en cada una, qué tan seguro estás. Así sabemos qué dominas de verdad.'},
  {icono: Route, titulo: 'Tu ruta, no la de todos', texto: 'Empiezas por lo que más te falta y por lo que más pesa en el examen.'},
  {icono: Repeat, titulo: 'Lo que fallas vuelve', texto: 'Cada error regresa al día siguiente y luego a los 3, 7, 14 y 30 días, hasta que lo dominas.'},
  {icono: Timer, titulo: 'Simulacro como el real', texto: 'Mismos formatos, mismo tiempo por pregunta y corrección con explicación al final.'},
];

export default async function Portada() {
  if (await sesionActual()) redirect('/inicio');
  const bloques = CONTENIDO.bloques;
  const temas = bloques.flatMap((b) => b.unidades.flatMap((u) => u.temas)).length;

  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-4 sm:px-6">
        <Marca />
        <div className="flex items-center gap-1">
          <TemaToggle compacto />
          <Link href="/ingresar" className={`${btn.secondary} h-10`}>
            Iniciar sesión
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-[1180px] items-center gap-10 px-4 pt-8 pb-16 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:pt-16 lg:pb-24">
          <div className="rise">
            <h1 className="text-[38px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink sm:text-[52px]">
              Prepárate para tu evaluación docente <span className="text-resalte">haciendo</span>, no memorizando.
            </h1>
            <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-ink-2">
              Diagnóstico, ruta personal y práctica interactiva con el temario de la ficha técnica del Ineval 2026.
            </p>
            <div className="mt-8">
              <Link href="/ingresar" className={`${btn.primary} px-6`}>
                Iniciar sesión <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="card p-4 sm:p-6">
            <p className="mb-3 text-[15px] font-semibold text-ink">Pruébalo ahora: toca la célula</p>
            <Explorar lab="celula-vegetal" compacto />
          </div>
        </section>

        <section className="border-y border-line bg-surface">
          <div className="mx-auto grid max-w-[1180px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:py-20">
            <h2 className="text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] text-ink sm:text-[36px]">Un método, no un montón de videos.</h2>
            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {PASOS.map((p) => (
                <div key={p.titulo}>
                  <span className="grid h-11 w-11 place-items-center rounded-ctl bg-accent-soft text-accent-ink">
                    <p.icono size={21} />
                  </span>
                  <h3 className="mt-4 text-[17px] font-semibold text-ink">{p.titulo}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{p.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="max-w-[24ch] text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] text-ink sm:text-[36px]">
            Todo el temario de la Dimensión 1: {temas} temas.
          </h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {bloques.map((b) => (
              <div key={b.id} className="card p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-ink">{b.nombre}</h3>
                  <p className="num text-[14px] font-medium text-ink-3">
                    {b.preguntasExamen} preguntas · {b.minutosExamen} min
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {b.unidades.map((u) => (
                    <span key={u.id} className="rounded-full bg-surface-2 px-3 py-1.5 text-[13.5px] font-medium text-ink-2">
                      {u.nombre}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1180px] flex-col gap-3 px-4 pt-4 pb-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Marca />
        <div className="max-w-[60ch]">
          <Aviso />
        </div>
      </footer>
    </div>
  );
}
