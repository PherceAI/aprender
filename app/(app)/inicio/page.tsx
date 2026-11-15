import type {Metadata} from 'next';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {ArrowRight, Flame, Lock, Repeat, Timer} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {hoyDe, rutaDe} from '@/lib/ruta';
import {mapaCurso} from '@/lib/curso';
import {Anillo, Barra, EtiquetaEstado, btn} from '@/components/ui';
import {MapaDominio} from '@/components/mapa-dominio';
import {BotonIniciar} from '@/components/boton-iniciar';

export const metadata: Metadata = {title: 'Inicio'};

export default async function Inicio() {
  const u = await requerirDocente();
  const db = await getDb();
  const [hoy, ruta, mapa] = await Promise.all([hoyDe(db, u.id), rutaDe(db, u.id), mapaCurso(db, u.id)]);
  if (hoy.siguiente.tipo === 'diagnostico') redirect('/diagnostico');
  const nombre = u.nombre.split(' ')[0];
  const s = hoy.siguiente;
  const unidades = mapa.bloques.flatMap((b) => b.unidades);

  return (
    <div className="rise flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[30px] leading-[1.08] font-semibold tracking-[-0.035em] text-ink sm:text-[40px]">
            Hola, {nombre}.<br />
            ¿Qué <span className="text-resalte">aprendemos</span> hoy?
          </h1>
        </div>
        <div className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-[14px] font-semibold ${hoy.racha.dias ? 'bg-warm-soft text-warm' : 'bg-surface text-ink-3'}`}>
          <Flame size={18} />
          {hoy.racha.dias === 1 ? '1 día de racha' : hoy.racha.dias ? `${hoy.racha.dias} días seguidos` : 'Empieza tu racha hoy'}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="flex flex-col gap-6">
          {/* Lo que toca ahora */}
          <section className="rounded-card bg-destacado p-6 text-on-destacado shadow-float sm:p-7">
            <p className="text-[14px] font-semibold opacity-70">{s.tipo === 'leccion' ? 'Continúa donde quedaste' : s.tipo === 'prueba-tema' ? 'Ya viste las lecciones' : 'Vas al día'}</p>
            <h2 className="mt-2 text-[24px] leading-tight font-semibold tracking-[-0.025em] sm:text-[28px]">
              {s.tipo === 'leccion' ? s.titulo : s.tipo === 'prueba-tema' ? `Prueba de ${s.temaNombre}` : 'Repasa o haz un simulacro'}
            </h2>
            <p className="mt-1.5 text-[15px] opacity-75">
              {s.tipo === 'leccion'
                ? `${s.temaNombre} · Lección ${s.numero} de ${s.de} · ${s.minutos} min`
                : s.tipo === 'prueba-tema'
                  ? '10 preguntas. Con 80 % el tema queda dominado.'
                  : 'Los demás temas se abren pronto.'}
            </p>
            <div className="mt-5">
              {s.tipo === 'leccion' ? (
                <Link href={`/leccion/${s.leccionId}`} className="inline-flex h-12 items-center gap-2 rounded-ctl bg-boton-destacado px-5 text-[15px] font-semibold text-on-boton-destacado transition-transform active:translate-y-px">
                  Seguir aprendiendo <ArrowRight size={18} />
                </Link>
              ) : s.tipo === 'prueba-tema' ? (
                <BotonIniciar tipo="prueba-tema" referencia={s.temaId} texto="Hacer la prueba" className="!bg-boton-destacado !text-on-boton-destacado" />
              ) : (
                <Link href="/simulacro" className="inline-flex h-12 items-center gap-2 rounded-ctl bg-boton-destacado px-5 text-[15px] font-semibold text-on-boton-destacado">
                  Ir al simulacro <ArrowRight size={18} />
                </Link>
              )}
            </div>
          </section>

          {/* Bloques y repaso */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {mapa.bloques.map((b) => (
              <div key={b.id} className="card flex items-center gap-3.5 p-4">
                <Anillo valor={b.nivel} tam={60} grosor={7} etiqueta={b.nombre} />
                <div className="min-w-0">
                  <p className="text-[14px] leading-snug font-semibold text-ink">{b.nombre.replace('Conocimientos de ', '')}</p>
                  <p className="text-[12.5px] text-ink-3">{b.unidades.reduce((n, x) => n + x.temas.filter((t) => t.estado === 'dominado').length, 0)} temas dominados</p>
                </div>
              </div>
            ))}
            <div className="card flex flex-col justify-between gap-3 p-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-ctl bg-accent-soft text-accent-ink">
                  <Repeat size={18} />
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-ink">Repaso de hoy</p>
                  <p className="text-[12.5px] text-ink-3">{hoy.repasoPendiente ? `${hoy.repasoPendiente} preguntas` : 'Nada pendiente'}</p>
                </div>
              </div>
              {hoy.repasoPendiente > 0 && <BotonIniciar tipo="repaso" texto="Repasar" variante="secondary" className="h-10 w-full" />}
            </div>
          </div>

          {/* La ruta */}
          <section className="card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Tu ruta</h2>
              <Link href="/curso" className="text-[14px] font-semibold text-accent-ink hover:underline">
                Ver el curso
              </Link>
            </div>
            <ol className="mt-4 flex flex-col gap-1">
              {ruta.slice(0, 5).map((t, i) => (
                <li key={t.temaId}>
                  <Link href={`/curso/${t.temaId}`} className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-ctl px-2 py-2.5 hover:bg-surface-2 sm:grid-cols-[28px_1fr_140px_auto]">
                    <span className="num grid h-7 w-7 place-items-center rounded-full bg-surface-2 text-[13px] font-bold text-ink-2">{i + 1}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-medium text-ink">{t.nombre}</span>
                      <span className="block truncate text-[12.5px] text-ink-3">{t.unidadNombre}</span>
                    </span>
                    <span className="hidden items-center gap-2 sm:flex">
                      <Barra valor={t.nivel} className="flex-1" />
                      <span className="num w-9 text-right text-[12.5px] font-semibold text-ink-3">{t.nivel}%</span>
                    </span>
                    {t.abierto ? <EtiquetaEstado estado={t.estado} /> : <Lock size={16} className="text-ink-3" aria-label="Próximamente" />}
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="card flex flex-col items-center p-6 text-center">
            <p className="text-[14px] font-semibold text-ink-2">Tu preparación</p>
            <div className="mt-4">
              <Anillo valor={hoy.preparacion} tam={156} grosor={14} etiqueta="Preparación" />
            </div>
            <p className="mt-4 max-w-[30ch] text-[13.5px] leading-relaxed text-ink-3">Es el dominio de tus 31 temas, pesado como en el examen.</p>
          </section>

          <section className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-ink">Mapa de dominio</h2>
              <Link href="/perfil" className="text-[13px] font-semibold text-accent-ink hover:underline">
                Detalle
              </Link>
            </div>
            <MapaDominio unidades={unidades} enlazar compacto />
          </section>

          <section className="card p-5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-ctl bg-accent-soft text-accent-ink">
                <Timer size={18} />
              </span>
              <div>
                <p className="text-[15px] font-semibold text-ink">Simulacro</p>
                <p className="text-[12.5px] text-ink-3">{hoy.ultimoSimulacro ? `Último: ${hoy.ultimoSimulacro.puntaje} %` : 'Aún no haces uno'}</p>
              </div>
            </div>
            <Link href="/simulacro" className={`${btn.secondary} mt-4 h-10 w-full`}>
              Practicar con tiempo
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
