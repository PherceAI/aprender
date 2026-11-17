import type {Metadata} from 'next';
import Link from 'next/link';
import {BookCheck, ChevronDown, Flame, ListChecks, Play, RefreshCw, Sprout, Target, Check} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {gruposDeTemas, perfilDe} from '@/lib/perfil';
import {mapaCurso} from '@/lib/curso';
import {conHoy, historialPreparacion} from '@/lib/avance';
import {hoyEc} from '@/lib/util';
import {ILUSTRACION} from '@/lib/visual';
import {GraficoPreparacion} from '@/components/grafico-preparacion';

export const metadata: Metadata = {title: 'Mi progreso'};

// Mi progreso: cuánto está preparado, cómo cambia día a día, qué temas tiene y qué hacer para seguir subiendo.

function fecha(d: Date) {
  return new Intl.DateTimeFormat('es-EC', {day: 'numeric', month: 'short', timeZone: 'America/Guayaquil'}).format(d);
}

function AnilloBlanco({valor}: {valor: number}) {
  const r = 70;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-[170px] w-[170px] shrink-0" role="img" aria-label={`Tu preparación: ${valor} %`}>
      <svg viewBox="0 0 170 170" className="-rotate-90">
        <circle cx="85" cy="85" r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="14" />
        <circle cx="85" cy="85" r={r} fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - valor / 100)} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center leading-none">
        <div>
          <span className="text-[46px] font-semibold tracking-[-0.04em]">{valor}</span>
          <span className="text-[20px] font-semibold">%</span>
          <p className="mt-1 text-[12.5px] font-medium text-white/85">Tu preparación</p>
        </div>
      </div>
    </div>
  );
}

export default async function MiProgreso() {
  const u = await requerirDocente();
  const db = await getDb();
  const [p, mapa, historia] = await Promise.all([perfilDe(db, u.id), mapaCurso(db, u.id), historialPreparacion(db, u.id, 30)]);
  const {dominados, enCamino, porEmpezar} = gruposDeTemas(p.temas);
  const evolucion = conHoy(historia, hoyEc(new Date()), p.preparacion);
  const nombreTema = new Map(p.temas.map((t) => [t.temaId, t.nombre]));
  const historial = [
    ...p.pruebas.map((x) => ({tipo: 'Prueba del tema', nombre: nombreTema.get(x.temaId) ?? x.temaId, puntaje: x.puntaje, fecha: x.fecha})),
    ...p.simulacros.map((x) => ({tipo: 'Simulacro', nombre: `${x.preguntas} preguntas`, puntaje: x.puntaje, fecha: x.fecha})),
  ]
    .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
    .slice(0, 6);

  const titulo = p.preparacion >= 70 ? 'Vas muy bien preparado' : p.preparacion >= 40 ? 'Vas a buen ritmo' : 'Estás comenzando tu preparación';
  const datos = [
    {icono: Target, valor: `${dominados.length} de ${p.temas.length}`, texto: 'temas dominados'},
    {icono: ListChecks, valor: `${p.totales.respondidas}`, texto: `preguntas · ${p.totales.acierto} % bien`},
    {icono: Flame, valor: `${p.racha.dias}`, texto: p.racha.dias === 1 ? 'día de racha' : 'días de racha'},
    {icono: BookCheck, valor: `${p.totales.lecciones}`, texto: p.totales.lecciones === 1 ? 'lección vista' : 'lecciones vistas'},
  ];
  const grupos = [
    {titulo: 'Dominados', lista: dominados, icono: Check, fondo: 'bg-ok-soft', color: 'text-ok', vacio: 'Con 80 % en la prueba de un tema, queda aquí.'},
    {titulo: 'En camino', lista: enCamino, icono: RefreshCw, fondo: 'bg-accent-soft', color: 'text-accent-ink', vacio: 'Los temas que vas estudiando aparecen aquí.'},
    {titulo: 'Por empezar', lista: porEmpezar, icono: Play, fondo: 'bg-surface', color: 'text-ink-2', vacio: '¡Ya empezaste todos!'},
  ];

  return (
    <div className="rise flex flex-col gap-5">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-ink sm:text-[34px]">
          Mi <span className="text-accent">progreso</span>
        </h1>
        <p className="mt-1 text-[15.5px] text-ink-2">
          Así vas en tu preparación para la evaluación docente.{' '}
          <Link href="/evaluacion" className="font-semibold whitespace-nowrap text-accent-ink hover:underline lg:hidden">
            Conoce tu evaluación
          </Link>
        </p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="relative flex flex-col items-center gap-6 overflow-hidden rounded-[24px] bg-[linear-gradient(125deg,#d9300a_0%,#ec4416_60%,#f25d2a_100%)] p-6 text-white sm:flex-row sm:p-8">
          <span aria-hidden className="pointer-events-none absolute -right-16 -bottom-24 h-64 w-64 rounded-full bg-white/10" />
          <AnilloBlanco valor={p.preparacion} />
          <div className="relative text-center sm:border-l sm:border-white/25 sm:pl-6 sm:text-left">
            <h2 className="text-[24px] leading-tight font-semibold tracking-[-0.03em]">{titulo}</h2>
            <p className="mt-2 max-w-[34ch] text-[14.5px] leading-relaxed text-white/90">
              Es tu dominio de los {p.temas.length} temas de la ficha, con el peso que cada prueba tiene en el examen. Sube cada vez que dominas un tema.
            </p>
            <Link href="/curso" className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[14.5px] font-semibold text-[#b8300a]">
              <Play size={15} fill="currentColor" /> Continuar mi ruta
            </Link>
          </div>
        </section>
        <section className="card p-5 sm:p-6">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Tu evolución</h2>
          <p className="mb-3 text-[13.5px] text-ink-2">Tu preparación en los últimos 30 días.</p>
          <GraficoPreparacion puntos={evolucion} />
        </section>
      </div>

      <section className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
        {datos.map((d) => (
          <div key={d.texto} className="card flex items-center gap-3 p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] bg-accent-soft text-accent">
              <d.icono size={20} />
            </span>
            <div className="min-w-0">
              <p className="text-[20px] leading-none font-semibold tracking-[-0.03em] text-ink">{d.valor}</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-2">{d.texto}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <section className="card p-5 sm:p-6">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Por prueba</h2>
          <ul className="mt-4 flex flex-col gap-5">
            {mapa.bloques.map((b, i) => (
              <li key={b.id} className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-accent-soft text-accent">{i === 0 ? <BookCheck size={18} /> : <Sprout size={18} />}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-[15px] font-medium text-ink">{b.nombre}</span>
                    <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-0.5 text-[13px] font-bold text-accent-ink">{b.nivel} %</span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-line-2">
                    <div className="h-full rounded-full bg-[linear-gradient(90deg,#e0330b,#f25d2a)]" style={{width: `${b.nivel}%`}} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="relative flex items-center gap-4 overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#fff3ea,#ffe2d2)] p-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-[20px] font-semibold tracking-[-0.025em] text-[#171717]">Sigue avanzando</h2>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-[#525252]">
              {enCamino.length ? `Tienes ${enCamino.length} ${enCamino.length === 1 ? 'tema' : 'temas'} en camino. Termina sus lecciones y haz la prueba para dominarlos.` : 'La constancia es la clave: un poco cada día vale más que mucho un solo día.'}
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ILUSTRACION.trofeo} alt="" aria-hidden className="h-24 w-24 shrink-0 drop-shadow-[0_12px_18px_rgba(0,0,0,0.2)] sm:h-28 sm:w-28" />
        </section>
      </div>

      {/* Temas en tres grupos: se abren con un toque */}
      <section className="grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-3">
        {grupos.map((g) => (
          <details key={g.titulo} className={`group rounded-[18px] ${g.fondo} p-4 shadow-card`}>
            <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface ${g.color}`}>
                <g.icono size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14.5px] font-semibold text-ink">{g.titulo}</span>
                <span className="block text-[26px] leading-none font-semibold tracking-[-0.03em] text-ink">{g.lista.length}</span>
              </span>
              <ChevronDown size={18} className="shrink-0 text-ink-3 transition-transform group-open:rotate-180" />
            </summary>
            {g.lista.length ? (
              <ul className="mt-3 flex flex-col rounded-[12px] bg-surface p-1">
                {g.lista.map((t) => (
                  <li key={t.temaId}>
                    <Link href={`/curso/${t.temaId}`} className="flex items-center justify-between gap-3 rounded-[10px] px-2.5 py-2 text-[14px] hover:bg-surface-2">
                      <span className="min-w-0 truncate text-ink">{t.nombre}</span>
                      <span className="shrink-0 text-[12.5px] text-ink-2">{t.nivel} %</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[13.5px] text-ink-2">{g.vacio}</p>
            )}
          </details>
        ))}
      </section>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-2">
        <section className="card p-5 sm:p-6">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Lo que más se te complica</h2>
          {p.errores.length ? (
            <ul className="mt-4 flex flex-col gap-3">
              {p.errores.slice(0, 4).map((e) => (
                <li key={e.preguntaId} className="rounded-[14px] bg-surface-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[14.5px] leading-snug font-medium text-ink">{e.enunciado.replace('____', '___')}</p>
                    <span className="shrink-0 rounded-full bg-bad-soft px-2 py-0.5 text-[12px] font-bold text-bad">{e.veces}×</span>
                  </div>
                  <p className="mt-1.5 text-[13.5px] text-ink">
                    <span className="font-semibold text-ok">Respuesta: </span>
                    {e.respuesta}
                  </p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{e.porQue.replace(/^Correcto:\s*/, '')}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[14.5px] text-ink-2">Todavía no hay preguntas falladas en tus prácticas y pruebas.</p>
          )}
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Tus pruebas y simulacros</h2>
          {historial.length ? (
            <ul className="mt-3 flex flex-col divide-y divide-line">
              {historial.map((h, i) => (
                <li key={i} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14.5px] font-medium text-ink">{h.nombre}</p>
                    <p className="text-[12.5px] text-ink-2">
                      {h.tipo} · {fecha(h.fecha)}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[13px] font-bold ${h.puntaje >= 80 ? 'bg-ok-soft text-ok' : 'bg-accent-soft text-accent-ink'}`}>{h.puntaje} %</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[14.5px] text-ink-2">Cuando hagas la prueba de un tema o un simulacro, tus resultados aparecen aquí.</p>
          )}
        </section>
      </div>
    </div>
  );
}
