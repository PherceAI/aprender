import type {Metadata} from 'next';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {and, desc, eq, isNotNull} from 'drizzle-orm';
import {ArrowRight, Check, ClipboardCheck, FileText, Flame, Lock, Play, Sparkles, Target, Timer} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {intentos} from '@/lib/db/schema';
import {hoyDe, rutaDe} from '@/lib/ruta';
import {perfilDe} from '@/lib/perfil';
import {mapaCurso} from '@/lib/curso';
import {planDe} from '@/lib/acceso';
import {actividadSemana, metaDeHoy} from '@/lib/actividad';
import {enlaceFicha, paginaDeTema} from '@/lib/ficha';
import {visualDeUnidad} from '@/lib/visual';
import {Anillo} from '@/components/ui';
import {BotonIniciar} from '@/components/boton-iniciar';
import {RutaModulos} from '@/components/ruta-modulos';

export const metadata: Metadata = {title: 'Inicio'};

// Inicio: qué hacer ahora (un solo paso), cómo va y qué le falta hoy. Todo con datos reales.

const blanca = 'inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-[#b8300a] transition-transform active:translate-y-px';
const marca = {WebkitMask: 'url(/marca/pragma-simbolo.png) center / contain no-repeat', mask: 'url(/marca/pragma-simbolo.png) center / contain no-repeat'};

export default async function Inicio() {
  const u = await requerirDocente();
  const db = await getDb();
  const [hoy, ruta, perfil, mapa, plan, semana, meta, [diag]] = await Promise.all([
    hoyDe(db, u.id),
    rutaDe(db, u.id),
    perfilDe(db, u.id),
    mapaCurso(db, u.id),
    planDe(db, u.id),
    actividadSemana(db, u.id),
    metaDeHoy(db, u.id),
    db
      .select({puntaje: intentos.puntaje})
      .from(intentos)
      .where(and(eq(intentos.usuarioId, u.id), eq(intentos.tipo, 'diagnostico'), isNotNull(intentos.terminado)))
      .orderBy(desc(intentos.terminado))
      .limit(1),
  ]);
  if (hoy.siguiente.tipo === 'diagnostico') redirect('/diagnostico');
  const s = hoy.siguiente;
  const unidades = mapa.bloques.flatMap((b) => b.unidades.map((un) => ({...un, bloque: b.nombre})));
  const temas = mapa.bloques.flatMap((b) => b.unidades.flatMap((un) => un.temas.map((t) => ({...t, unidad: un.nombre, unidadId: un.id}))));
  const dominados = perfil.temas.filter((t) => t.estado === 'dominado').length;
  const temaActual = s.tipo === 'leccion' || s.tipo === 'prueba-tema' ? temas.find((t) => t.id === s.temaId) : null;
  const visual = visualDeUnidad(temaActual?.unidadId ?? '');
  const pag = temaActual ? paginaDeTema(temaActual.id) : null;
  const avanceTema = temaActual ? Math.round((temaActual.completadas / Math.max(1, temaActual.lecciones)) * 100) : 0;


  // Meta de hoy: tres tareas concretas.
  const tareas = [
    {texto: 'Estudiar una lección', detalle: meta.leccionHoy ? '¡Hecho!' : s.tipo === 'leccion' ? `Lección ${s.numero} de ${s.temaNombre}` : 'Abre una lección de tu ruta', hecho: meta.leccionHoy, href: s.tipo === 'leccion' ? `/leccion/${s.leccionId}` : '#ruta'},
    {
      texto: 'Repasar lo que fallaste',
      detalle: meta.repasoHoy ? '¡Hecho!' : meta.repasoPendiente ? `${Math.min(meta.repasoPendiente, 10)} preguntas · unos ${Math.max(2, Math.round(Math.min(meta.repasoPendiente, 10) * 0.7))} min` : 'Nada pendiente hoy',
      hecho: meta.repasoHoy || meta.repasoPendiente === 0,
      href: '/repaso',
    },
    {texto: 'Responder 10 preguntas', detalle: meta.respuestasHoy >= 10 ? '¡Hecho!' : `Llevas ${meta.respuestasHoy} hoy`, hecho: meta.respuestasHoy >= 10, href: s.tipo === 'leccion' ? `/leccion/${s.leccionId}` : '/repaso'},
  ];
  const hechas = tareas.filter((t) => t.hecho).length;

  // Mensaje del progreso: dice qué hacer, no solo el número.
  const consejo =
    dominados > 0
      ? `¡Bien! Ya dominas ${dominados} ${dominados === 1 ? 'tema' : 'temas'}. Sigue con el siguiente de tu ruta.`
      : s.tipo === 'prueba-tema'
        ? `Haz la prueba de ${s.temaNombre}: con 80 % dominas tu primer tema.`
        : 'Termina las lecciones de tu tema actual y haz su prueba: así sube tu preparación.';

  const max = Math.max(10, ...semana.map((d) => d.respuestas));
  const totalSemana = semana.reduce((a, d) => a + d.respuestas, 0);

  return (
    <div className="rise flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.04em] text-ink sm:text-[34px]">¡Hola, {u.nombre.split(' ')[0]}!</h1>
          <p className="mt-1 text-[15.5px] text-ink-2">
            {s.tipo === 'leccion' ? `Hoy te toca: lección ${s.numero} de ${s.temaNombre}.` : s.tipo === 'prueba-tema' ? `Hoy te toca: la prueba de ${s.temaNombre}.` : 'Vas al día con tus temas abiertos.'}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex h-10 items-center gap-1.5 rounded-full bg-surface px-3.5 text-[14px] font-semibold text-ink shadow-card">
            <Flame size={17} className="text-[#ea580c]" /> {hoy.racha.dias} {hoy.racha.dias === 1 ? 'día' : 'días'}
          </span>
          <span className="inline-flex h-10 items-center gap-1.5 rounded-full bg-surface px-3.5 text-[14px] font-semibold text-ink shadow-card">
            <Target size={17} className="text-accent" /> {hoy.preparacion} % preparado
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        {/* Siguiente paso */}
        <section className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(125deg,#d9300a_0%,#ec4416_55%,#f25d2a_100%)] p-6 text-white sm:p-8">
          <span aria-hidden className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 bg-white/10" style={marca} />
          <span aria-hidden className="pointer-events-none absolute -top-24 right-24 h-64 w-64 rounded-full bg-white/10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={visual.img} alt="" aria-hidden className="pointer-events-none absolute top-1/2 right-4 hidden w-[180px] -translate-y-1/2 drop-shadow-[0_18px_30px_rgba(0,0,0,0.25)] sm:block lg:right-8 lg:w-[210px]" />
          <div className="relative sm:max-w-[62%]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[13px] font-semibold">
              <Sparkles size={14} /> Tu siguiente paso
            </span>
            {temaActual && <p className="mt-4 text-[14px] font-medium text-white/90">{temaActual.nombre}</p>}
            <h2 className="mt-1 text-[24px] leading-tight font-semibold tracking-[-0.03em] sm:text-[30px]">
              {s.tipo === 'leccion' ? `Lección ${s.numero}: ${s.titulo}` : s.tipo === 'prueba-tema' ? 'Haz la prueba del tema' : 'Haz un simulacro corto'}
            </h2>
            <p className="mt-1.5 text-[15px] text-white/90">
              {s.tipo === 'leccion' ? `Lección ${s.numero} de ${s.de} · unos ${s.minutos} minutos` : s.tipo === 'prueba-tema' ? '10 preguntas · con 80 % el tema queda dominado' : '15 preguntas mezcladas · 20 minutos'}
            </p>
            {temaActual && (
              <div className="mt-4 flex max-w-[360px] items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/25">
                  <div className="h-full rounded-full bg-white" style={{width: `${avanceTema}%`}} />
                </div>
                <span className="text-[13.5px] font-semibold">{avanceTema} %</span>
              </div>
            )}
            <div className="mt-5 flex flex-wrap gap-2.5">
              {s.tipo === 'leccion' ? (
                <Link href={`/leccion/${s.leccionId}`} className={blanca}>
                  <Play size={16} fill="currentColor" /> {s.numero === 1 ? 'Empezar lección' : 'Continuar lección'}
                </Link>
              ) : s.tipo === 'prueba-tema' && plan === 'gratis' ? (
                <Link href="/acceso" className={blanca}>
                  <Lock size={16} /> Desbloquear la prueba
                </Link>
              ) : s.tipo === 'prueba-tema' ? (
                <BotonIniciar tipo="prueba-tema" referencia={s.temaId} texto="Hacer la prueba" className="!rounded-full !bg-white !text-[#b8300a]" />
              ) : (
                <Link href="/simulacro" className={blanca}>
                  <Timer size={16} /> Ir a simulacros
                </Link>
              )}
              {pag && (
                <a href={enlaceFicha(pag)} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/45 px-5 text-[14.5px] font-semibold text-white hover:bg-white/10">
                  <FileText size={16} /> Ficha, pág. {pag}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Progreso con consejo */}
        <section className="card flex flex-col p-5 sm:p-6">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Tu progreso general</h2>
          <div className="mt-4 flex items-center gap-5">
            <Anillo valor={hoy.preparacion} tam={116} grosor={11} etiqueta="Preparación" />
            <ul className="flex min-w-0 flex-col gap-3 text-[14px] text-ink-2">
              <li className="flex items-center gap-2.5">
                <Target size={18} className="shrink-0 text-accent" /> <b className="text-ink">{dominados}</b> de {perfil.temas.length} temas dominados
              </li>
              <li className="flex items-center gap-2.5">
                <ClipboardCheck size={18} className="shrink-0 text-accent" /> <b className="text-ink">{diag?.puntaje ?? 0} %</b> en el diagnóstico
              </li>
              <li className="flex items-center gap-2.5">
                <Flame size={18} className="shrink-0 text-accent" /> <b className="text-ink">{hoy.racha.dias}</b> {hoy.racha.dias === 1 ? 'día' : 'días'} de racha
              </li>
            </ul>
          </div>
          <Link href="/perfil" className="mt-auto flex items-center gap-3 rounded-[14px] bg-accent-soft p-3.5 pt-3.5 text-left hover:brightness-[0.98] max-xl:mt-5">
            <Sparkles size={18} className="shrink-0 text-accent" />
            <span className="min-w-0 flex-1 text-[13.5px] leading-snug text-ink">{consejo}</span>
            <ArrowRight size={16} className="shrink-0 text-accent-ink" />
          </Link>
        </section>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        {/* Tu ruta completa (antes «Mi ruta») */}
        <section id="ruta" className="card scroll-mt-6 p-4 sm:p-6">
          <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Tu ruta de aprendizaje</h2>
          <p className="mt-0.5 text-[14px] text-ink-2">
            Los {temas.length} temas de la ficha, por módulo. En cada tema: lecciones, prueba del tema y, con 80 %, queda dominado.
          </p>
          <div className="mt-4">
            <RutaModulos unidades={unidades} actualId={temaActual?.id ?? null} />
          </div>
        </section>

        <div className="flex flex-col gap-5">
        {/* Meta de hoy */}
        <section className="card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Tu meta de hoy</h2>
            <span className="text-[15px] font-bold text-accent-ink">
              {hechas} de {tareas.length}
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-line-2">
            <div className="h-full rounded-full bg-[linear-gradient(90deg,#e0330b,#f25d2a)]" style={{width: `${(hechas / tareas.length) * 100}%`}} />
          </div>
          <ul className="mt-2 flex flex-col divide-y divide-line">
            {tareas.map((t) => (
              <li key={t.texto}>
                <Link href={t.href} className="flex items-center gap-3 py-3">
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 ${t.hecho ? 'border-ok bg-ok text-white' : 'border-line'}`}>{t.hecho && <Check size={14} strokeWidth={3} />}</span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-[14.5px] font-semibold ${t.hecho ? 'text-ink-2 line-through decoration-ink-3/40' : 'text-ink'}`}>{t.texto}</span>
                    <span className="block text-[12.5px] text-ink-2">{t.detalle}</span>
                  </span>
                  {!t.hecho && <ArrowRight size={16} className="shrink-0 text-accent-ink" />}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        {/* Esta semana */}
        <section className="card p-5 sm:p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Esta semana</h2>
            <span className="text-[14px] font-semibold text-ink">
              {totalSemana} {totalSemana === 1 ? 'pregunta' : 'preguntas'}
            </span>
          </div>
          <div className="mt-5 flex h-36 items-end gap-2" role="img" aria-label={`Preguntas respondidas esta semana: ${totalSemana}`}>
            {semana.map((d) => (
              <div key={d.dia} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                {d.respuestas > 0 && <span className="text-[11.5px] font-semibold text-ink-2">{d.respuestas}</span>}
                <div
                  className={`w-full max-w-9 rounded-t-[8px] rounded-b-[4px] ${d.esHoy ? 'bg-[linear-gradient(180deg,#f25d2a,#e0330b)]' : d.activo ? 'bg-[#ffc9b4]' : 'bg-line-2'}`}
                  style={{height: `${Math.max(6, (d.respuestas / max) * 100)}%`}}
                />
                <span className={`text-[12px] ${d.esHoy ? 'font-bold text-accent-ink' : 'text-ink-3'}`}>{d.etiqueta}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[13px] text-ink-2">Preguntas que respondiste cada día. Hoy está en naranja.</p>
        </section>
        </div>
      </div>
    </div>
  );
}
