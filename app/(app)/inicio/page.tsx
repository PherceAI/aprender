import type {Metadata} from 'next';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {and, desc, eq, isNotNull} from 'drizzle-orm';
import {ArrowRight, BookOpen, Check, ClipboardCheck, Flame, Lock, Play, Repeat, Target, Timer, type LucideIcon} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {intentos} from '@/lib/db/schema';
import {hoyDe, rutaDe} from '@/lib/ruta';
import {perfilDe} from '@/lib/perfil';
import {mapaCurso} from '@/lib/curso';
import {planDe} from '@/lib/acceso';
import {Anillo} from '@/components/ui';
import {BotonIniciar} from '@/components/boton-iniciar';

export const metadata: Metadata = {title: 'Inicio'};

// Inicio: un solo «siguiente paso», el progreso en una mirada y cómo se avanza en cada tema.

const pildoraBlanca = 'inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-[#b8300a] transition-transform active:translate-y-px';

export default async function Inicio() {
  const u = await requerirDocente();
  const db = await getDb();
  const [hoy, ruta, perfil, mapa, plan, [diag]] = await Promise.all([
    hoyDe(db, u.id),
    rutaDe(db, u.id),
    perfilDe(db, u.id),
    mapaCurso(db, u.id),
    planDe(db, u.id),
    db
      .select({puntaje: intentos.puntaje})
      .from(intentos)
      .where(and(eq(intentos.usuarioId, u.id), eq(intentos.tipo, 'diagnostico'), isNotNull(intentos.terminado)))
      .orderBy(desc(intentos.terminado))
      .limit(1),
  ]);
  if (hoy.siguiente.tipo === 'diagnostico') redirect('/diagnostico');
  const s = hoy.siguiente;
  const temas = mapa.bloques.flatMap((b) => b.unidades.flatMap((un) => un.temas.map((t) => ({...t, unidad: un.nombre}))));
  const dominados = perfil.temas.filter((t) => t.estado === 'dominado').length;
  const tarjetas = ruta.slice(0, 3).map((r) => temas.find((t) => t.id === r.temaId)!).filter(Boolean);

  // En qué paso del método está ahora.
  const pasoActual = s.tipo === 'leccion' ? 1 : s.tipo === 'prueba-tema' ? 2 : 3;
  const PASOS: {titulo: string; texto: string}[] = [
    {titulo: 'Diagnóstico', texto: 'Ya sabemos qué dominas.'},
    {titulo: 'Lecciones', texto: 'Aprende el tema en pantallas cortas.'},
    {titulo: 'Prueba del tema', texto: '10 preguntas. Con 80 % lo dominas.'},
    {titulo: 'Simulacro', texto: 'Mídete como en el examen real.'},
  ];

  const stats: {icono: LucideIcon; valor: string; texto: string}[] = [
    {icono: Target, valor: `${dominados}`, texto: `de ${perfil.temas.length} temas dominados`},
    {icono: ClipboardCheck, valor: diag?.puntaje != null ? `${diag.puntaje} %` : '—', texto: 'en el diagnóstico'},
    {icono: Flame, valor: `${hoy.racha.dias}`, texto: hoy.racha.dias === 1 ? 'día de racha' : 'días de racha'},
  ];

  return (
    <div className="rise flex flex-col gap-6">
      <div>
        <h1 className="text-[30px] leading-tight font-semibold tracking-[-0.04em] text-ink sm:text-[36px]">¡Hola, {u.nombre.split(' ')[0]}!</h1>
        <p className="mt-1 text-[16px] text-ink-2">{s.tipo === 'nada' ? 'Vas al día con tus temas abiertos.' : 'Tu siguiente paso está listo.'}</p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        {/* Siguiente paso */}
        <section className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(120deg,#e0330b_0%,#f04a1c_100%)] p-6 text-white sm:p-8">
          <span aria-hidden className="pointer-events-none absolute -top-20 -right-12 h-60 w-60 rounded-full bg-white/10" />
          <span aria-hidden className="pointer-events-none absolute -right-24 -bottom-32 h-72 w-72 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-6">
            <span className="hidden h-24 w-24 shrink-0 place-items-center rounded-[22px] bg-white/15 sm:grid">
              {s.tipo === 'leccion' ? <Play size={38} fill="currentColor" /> : s.tipo === 'prueba-tema' ? <ClipboardCheck size={38} /> : <Timer size={38} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium text-white/85">
                {s.tipo === 'leccion' ? `Tu siguiente paso · ${s.temaNombre}` : s.tipo === 'prueba-tema' ? `Tu siguiente paso · ${s.temaNombre}` : 'Tu siguiente paso'}
              </p>
              <h2 className="mt-1 text-[24px] leading-tight font-semibold tracking-[-0.03em] sm:text-[28px]">
                {s.tipo === 'leccion' ? `Lección ${s.numero}: ${s.titulo}` : s.tipo === 'prueba-tema' ? 'Haz la prueba del tema' : 'Haz un simulacro corto'}
              </h2>
              <p className="mt-1 text-[15px] text-white/90">
                {s.tipo === 'leccion'
                  ? `Lección ${s.numero} de ${s.de} · unos ${s.minutos} minutos`
                  : s.tipo === 'prueba-tema'
                    ? 'Ya viste las lecciones. 10 preguntas: con 80 % el tema queda dominado.'
                    : '15 preguntas en 20 minutos, mezcladas como en el examen.'}
              </p>
              {s.tipo === 'leccion' && (
                <div className="mt-4 h-2 max-w-[380px] overflow-hidden rounded-full bg-white/25">
                  <div className="h-full rounded-full bg-white" style={{width: `${Math.round(((s.numero - 1) / s.de) * 100)}%`}} />
                </div>
              )}
              <div className="mt-5">
                {s.tipo === 'leccion' ? (
                  <Link href={`/leccion/${s.leccionId}`} className={pildoraBlanca}>
                    <Play size={16} fill="currentColor" /> {s.numero === 1 ? 'Empezar' : 'Continuar'}
                  </Link>
                ) : s.tipo === 'prueba-tema' && plan === 'gratis' ? (
                  <Link href="/acceso" className={pildoraBlanca}>
                    <Lock size={16} /> Desbloquear la prueba
                  </Link>
                ) : s.tipo === 'prueba-tema' ? (
                  <BotonIniciar tipo="prueba-tema" referencia={s.temaId} texto="Hacer la prueba" className="!rounded-full !bg-white !text-[#b8300a]" />
                ) : (
                  <Link href="/simulacro" className={pildoraBlanca}>
                    Ir a simulacros <ArrowRight size={18} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Progreso */}
        <section className="card p-5 sm:p-6">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Tu progreso</h2>
          <div className="mt-4 flex items-center gap-5">
            <Anillo valor={hoy.preparacion} tam={118} grosor={11} etiqueta="Preparación" />
            <ul className="flex min-w-0 flex-col gap-3">
              {stats.map((x) => (
                <li key={x.texto} className="flex items-center gap-2.5 text-[14px] text-ink-2">
                  <x.icono size={18} className="shrink-0 text-accent" />
                  <span className="font-semibold text-ink">{x.valor}</span>
                  <span className="min-w-0">{x.texto}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-[13px] leading-snug text-ink-3">El anillo es tu preparación para el examen. Sube cada vez que dominas un tema.</p>
        </section>
      </div>

      {/* Cómo se avanza */}
      <section className="card p-5 sm:p-6">
        <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Así avanzas en cada tema</h2>
        <ol className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {PASOS.map((p, i) => {
            const hecho = i === 0 || i < pasoActual;
            const aqui = i === pasoActual;
            return (
              <li
                key={p.titulo}
                className={`relative rounded-[16px] border p-4 ${aqui ? 'border-2 border-accent bg-surface' : hecho ? 'border-[#cfeedd] bg-ok-soft' : 'border-line bg-surface-2'}`}
              >
                {aqui && <span className="absolute -top-2.5 right-3 rounded-full bg-accent px-2.5 py-0.5 text-[11.5px] font-bold text-white">Estás aquí</span>}
                <p className={`flex items-center gap-1 text-[12.5px] font-bold ${aqui ? 'text-accent-ink' : hecho ? 'text-ok' : 'text-ink-3'}`}>
                  {hecho && !aqui ? (
                    <>
                      <Check size={14} strokeWidth={3} /> Hecho
                    </>
                  ) : (
                    `Paso ${i + 1}`
                  )}
                </p>
                <p className="mt-1 text-[15.5px] font-semibold text-ink">{p.titulo}</p>
                <p className="mt-0.5 text-[13.5px] leading-snug text-ink-2">{p.texto}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        {/* Tu ruta */}
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-[20px] font-semibold tracking-[-0.025em] text-ink">Tu ruta</h2>
            <Link href="/curso" className="inline-flex items-center gap-1 text-[14px] font-semibold text-accent-ink">
              Ver toda la ruta <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-3">
            {tarjetas.map((t, i) => {
              const enCurso = t.abierto && t.completadas > 0;
              const etiqueta = !t.abierto ? 'Se abre pronto' : enCurso ? `En curso · ${t.completadas} de ${t.lecciones}` : i === 0 ? 'Empieza aquí' : 'Disponible';
              return (
                <Link key={t.id} href={`/curso/${t.id}`} className="card overflow-hidden transition-colors hover:border-accent">
                  <div className={`relative h-20 ${t.abierto ? 'bg-[linear-gradient(135deg,#ffb08f_0%,#f0360a_100%)]' : 'bg-[linear-gradient(135deg,#f6f3f1_0%,#ebe6e3_100%)]'}`}>
                    <span className="absolute -bottom-[18px] left-4 grid h-11 w-11 place-items-center rounded-[12px] bg-surface text-accent shadow-[0_6px_14px_-8px_rgba(0,0,0,0.25)]">
                      {t.abierto ? <BookOpen size={20} /> : <Lock size={18} className="text-ink-3" />}
                    </span>
                  </div>
                  <div className="p-4 pt-7">
                    <p className="truncate text-[15.5px] font-semibold text-ink">{t.nombre}</p>
                    <p className="truncate text-[12.5px] text-ink-3">{t.unidad}</p>
                    <span className={`mt-3 inline-block rounded-full px-2.5 py-1 text-[12px] font-semibold ${t.abierto ? 'bg-accent-soft text-accent-ink' : 'bg-surface-2 text-ink-3'}`}>
                      {etiqueta}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Para hoy */}
        <section className="card p-5">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Para hoy</h2>
          <ul className="mt-2 flex flex-col divide-y divide-line">
            <li className="flex items-center gap-3 py-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-accent-soft text-accent">
                <Repeat size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-semibold text-ink">Repaso</p>
                <p className="text-[12.5px] text-ink-3">{hoy.repasoPendiente ? `${Math.min(hoy.repasoPendiente, 10)} preguntas que fallaste` : 'Nada pendiente hoy'}</p>
              </div>
              {hoy.repasoPendiente > 0 && (
                <Link href="/repaso" className="rounded-full bg-accent-soft px-3 py-1.5 text-[13px] font-semibold text-accent-ink">
                  Repasar
                </Link>
              )}
            </li>
            <li className="flex items-center gap-3 py-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-accent-soft text-accent">
                <Timer size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-semibold text-ink">Simulacro corto</p>
                <p className="text-[12.5px] text-ink-3">{hoy.ultimoSimulacro ? `Tu último: ${hoy.ultimoSimulacro.puntaje} %` : '15 preguntas · 20 minutos'}</p>
              </div>
              <Link href="/simulacro" className="rounded-full bg-accent-soft px-3 py-1.5 text-[13px] font-semibold text-accent-ink">
                Ver
              </Link>
            </li>
            <li className="flex items-center gap-3 py-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-accent-soft text-accent">
                <Flame size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-semibold text-ink">{hoy.racha.hoyHecho ? 'Racha al día' : 'Mantén tu racha'}</p>
                <p className="text-[12.5px] text-ink-3">{hoy.racha.hoyHecho ? 'Ya estudiaste hoy. ¡Bien!' : 'Estudia algo hoy para no perderla'}</p>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
