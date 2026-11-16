import type {Metadata} from 'next';
import Link from 'next/link';
import {BookOpen, Check, ChevronDown, ChevronRight, FileText, Flame, LayoutGrid, List, Lock, Play, Target, Timer} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {mapaCurso} from '@/lib/curso';
import {hoyDe} from '@/lib/ruta';
import {perfilDe} from '@/lib/perfil';
import {actividadSemana} from '@/lib/actividad';
import {enlaceFicha, paginaDeTema} from '@/lib/ficha';
import {visualDeUnidad, ILUSTRACION} from '@/lib/visual';
import {Anillo} from '@/components/ui';

export const metadata: Metadata = {title: 'Mi ruta'};

// Mi ruta: seguir donde quedó, ver el temario completo por módulo (se abre con un toque) y qué hacer después.

function estadoDe(t: {abierto: boolean; estado: string; completadas: number}) {
  if (t.estado === 'dominado') return {texto: 'Dominado', clase: 'bg-ok-soft text-ok'};
  if (!t.abierto) return {texto: 'Pronto', clase: 'bg-surface-2 text-ink-2'};
  if (t.completadas > 0) return {texto: 'En curso', clase: 'bg-accent-soft text-accent-ink'};
  return {texto: 'Disponible', clase: 'bg-accent-soft text-accent-ink'};
}

export default async function MiRuta({searchParams}: {searchParams: Promise<{vista?: string}>}) {
  const {vista} = await searchParams;
  const lista = vista === 'lista';
  const u = await requerirDocente();
  const db = await getDb();
  const [mapa, hoy, perfil, semana] = await Promise.all([mapaCurso(db, u.id), hoyDe(db, u.id), perfilDe(db, u.id), actividadSemana(db, u.id)]);
  const unidades = mapa.bloques.flatMap((b) => b.unidades.map((un) => ({...un, bloque: b.nombre})));
  const todos = unidades.flatMap((un) => un.temas.map((t) => ({...t, unidad: un.nombre, unidadId: un.id})));
  const s = hoy.siguiente;
  const actual = s.tipo === 'leccion' || s.tipo === 'prueba-tema' ? todos.find((t) => t.id === s.temaId) : null;
  const visual = visualDeUnidad(actual?.unidadId ?? '');
  const pag = actual ? paginaDeTema(actual.id) : null;
  const avance = actual ? Math.round((actual.completadas / Math.max(1, actual.lecciones)) * 100) : 0;
  const dominados = todos.filter((t) => t.estado === 'dominado').length;
  const preguntasHoy = semana.find((d) => d.esHoy)?.respuestas ?? 0;

  const cifras = [
    {icono: BookOpen, valor: todos.length, texto: 'temas en total', color: '#2563eb', suave: '#ecf2ff'},
    {icono: Check, valor: dominados, texto: dominados === 1 ? 'tema dominado' : 'temas dominados', color: '#15803d', suave: '#e9f8ef'},
    {icono: Timer, valor: perfil.simulacros.length, texto: perfil.simulacros.length === 1 ? 'simulacro hecho' : 'simulacros hechos', color: '#7c3aed', suave: '#f4efff'},
    {icono: Target, valor: preguntasHoy, texto: 'preguntas hoy', color: '#c2410c', suave: '#fff1eb'},
  ];

  return (
    <div className="rise flex flex-col gap-5">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-ink sm:text-[34px]">
          Mi ruta de <span className="text-accent">aprendizaje</span>
        </h1>
        <p className="mt-1 text-[15.5px] text-ink-2">Ciencias Naturales · EGB Superior. Los {todos.length} temas de la ficha oficial, en el orden del examen.</p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-5">
          {/* Continúa */}
          <section className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(125deg,#d9300a_0%,#ec4416_60%,#f25d2a_100%)] p-6 text-white sm:p-8">
            <span aria-hidden className="pointer-events-none absolute -top-24 right-28 h-64 w-64 rounded-full bg-white/10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={actual ? visual.img : ILUSTRACION.ruta} alt="" aria-hidden className="pointer-events-none absolute top-1/2 right-6 hidden w-[170px] -translate-y-1/2 drop-shadow-[0_18px_30px_rgba(0,0,0,0.25)] sm:block" />
            <div className="relative sm:max-w-[64%]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[13px] font-semibold">
                <Play size={13} fill="currentColor" /> {actual ? 'Continúa tu ruta' : 'Vas al día'}
              </span>
              <h2 className="mt-3 text-[26px] leading-tight font-semibold tracking-[-0.03em] sm:text-[30px]">{actual ? actual.nombre : 'Tus temas abiertos están listos'}</h2>
              <p className="mt-1 text-[15px] text-white/90">
                {s.tipo === 'leccion' ? `Lección ${s.numero} de ${s.de} · ${s.titulo}` : s.tipo === 'prueba-tema' ? 'Ya viste las lecciones: te falta la prueba del tema' : 'Los demás temas se abren pronto. Mientras, repasa o haz un simulacro.'}
              </p>
              {actual && (
                <div className="mt-4 flex max-w-[360px] items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/25">
                    <div className="h-full rounded-full bg-white" style={{width: `${avance}%`}} />
                  </div>
                  <span className="text-[13.5px] font-semibold">{avance} %</span>
                </div>
              )}
              <div className="mt-5 flex flex-wrap gap-2.5">
                <Link
                  href={s.tipo === 'leccion' ? `/leccion/${s.leccionId}` : actual ? `/curso/${actual.id}` : '/simulacro'}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-[#b8300a]"
                >
                  <Play size={16} fill="currentColor" /> {s.tipo === 'leccion' ? 'Continuar lección' : actual ? 'Ir a la prueba' : 'Ir a simulacros'}
                </Link>
                {pag && (
                  <a href={enlaceFicha(pag)} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/45 px-5 text-[14.5px] font-semibold hover:bg-white/10">
                    <FileText size={16} /> Ficha oficial, pág. {pag}
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* Cifras */}
          <section className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
            {cifras.map((c) => (
              <div key={c.texto} className="card flex items-center gap-3 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px]" style={{background: c.suave, color: c.color}}>
                  <c.icono size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-[22px] leading-none font-semibold tracking-[-0.03em] text-ink">{c.valor}</p>
                  <p className="mt-1 text-[13px] leading-snug text-ink-2">{c.texto}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Temario */}
          <section>
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-[20px] font-semibold tracking-[-0.025em] text-ink">Tu temario completo</h2>
                <p className="text-[13.5px] text-ink-2">Toca un módulo para ver sus temas. La barra es tu nivel.</p>
              </div>
              <div className="flex rounded-full bg-surface p-1 shadow-card" role="tablist" aria-label="Cómo ver el temario">
                <Link href="/curso" role="tab" aria-selected={!lista} className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-semibold ${!lista ? 'bg-accent text-white' : 'text-ink-2'}`}>
                  <LayoutGrid size={15} /> Por módulos
                </Link>
                <Link href="/curso?vista=lista" role="tab" aria-selected={lista} className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-semibold ${lista ? 'bg-accent text-white' : 'text-ink-2'}`}>
                  <List size={15} /> Lista completa
                </Link>
              </div>
            </div>

            {lista ? (
              <div className="card divide-y divide-line">
                {todos.map((t) => (
                  <FilaTema key={t.id} t={t} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {unidades.map((un, i) => {
                  const v = visualDeUnidad(un.id);
                  const abiertos = un.temas.filter((t) => t.abierto).length;
                  const contieneActual = actual ? un.temas.some((t) => t.id === actual.id) : false;
                  return (
                    <details key={un.id} className="group card overflow-hidden" open={contieneActual}>
                      <summary className="flex cursor-pointer list-none items-center gap-4 p-4 [&::-webkit-details-marker]:hidden">
                        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[16px]" style={{background: v.suave}}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={v.img} alt="" aria-hidden className="h-10 w-10" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12.5px] font-bold" style={{color: v.color}}>
                            Módulo {i + 1} · {un.bloque.startsWith('Conocimientos generales') ? 'Generales' : 'Ciencias Naturales'}
                          </span>
                          <span className="block truncate text-[16px] font-semibold text-ink">{un.nombre}</span>
                          <span className="block text-[12.5px] text-ink-2">
                            {un.temas.length} {un.temas.length === 1 ? 'tema' : 'temas'}
                            {abiertos ? ` · ${abiertos} disponible` : ' · se abre pronto'}
                          </span>
                        </span>
                        <span className="hidden w-40 items-center gap-2 sm:flex">
                          <span className="text-[13.5px] font-semibold text-ink">{un.nivel} %</span>
                          <span className="h-2 flex-1 overflow-hidden rounded-full bg-line-2">
                            <span className="block h-full rounded-full" style={{width: `${un.nivel}%`, background: v.color}} />
                          </span>
                        </span>
                        <ChevronDown size={20} className="shrink-0 text-ink-3 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="border-t border-line px-2 pb-2">
                        {un.temas.map((t) => (
                          <FilaTema key={t.id} t={{...t, unidadId: un.id}} />
                        ))}
                      </div>
                    </details>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Columna lateral */}
        <aside className="flex flex-col gap-5">
          <section className="card p-5">
            <h2 className="text-[17px] font-semibold text-ink">Tu progreso general</h2>
            <div className="mt-3 flex items-center gap-4">
              <Anillo valor={hoy.preparacion} tam={104} grosor={10} etiqueta="Preparación" />
              <ul className="flex flex-col gap-2 text-[13.5px] text-ink-2">
                <li>
                  <b className="text-ink">{dominados}</b> de {todos.length} temas
                </li>
                <li>
                  <b className="text-ink">{perfil.totales.acierto} %</b> de acierto
                </li>
                <li>
                  <b className="text-ink">{perfil.totales.lecciones}</b> lecciones vistas
                </li>
              </ul>
            </div>
          </section>

          <section className="flex items-center gap-4 rounded-[20px] bg-[linear-gradient(135deg,#fff1e6,#ffe0cc)] p-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ILUSTRACION.fuego} alt="" aria-hidden className="h-14 w-14" />
            <div>
              <p className="text-[18px] font-semibold text-[#9a3412]">
                {hoy.racha.dias} {hoy.racha.dias === 1 ? 'día' : 'días'} de racha
              </p>
              <p className="text-[13.5px] text-[#7c2d12]">{hoy.racha.hoyHecho ? '¡Ya estudiaste hoy! Vuelve mañana.' : 'Estudia algo hoy para no perderla.'}</p>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="flex items-center gap-2 text-[17px] font-semibold text-ink">
              <Flame size={18} className="text-accent" /> Tu actividad
            </h2>
            <ol className="mt-4 grid grid-cols-[repeat(7,minmax(0,1fr))] text-center">
              {semana.map((d) => (
                <li key={d.dia} className="flex flex-col items-center gap-1.5">
                  <span className="text-[12px] font-semibold text-ink-3">{d.etiqueta}</span>
                  <span className={`grid h-9 w-9 place-items-center rounded-full text-[13.5px] font-semibold ${d.esHoy ? 'bg-accent text-white' : d.activo ? 'bg-accent-soft text-accent-ink' : 'text-ink-2'}`}>{Number(d.dia.slice(8))}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${d.activo ? 'bg-ok' : 'bg-line'}`} />
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[12.5px] text-ink-2">El punto verde marca los días que estudiaste.</p>
          </section>

          <section className="card p-5">
            <h2 className="text-[17px] font-semibold text-ink">Próximas acciones</h2>
            <ul className="mt-2 flex flex-col">
              {[
                actual && s.tipo === 'leccion' ? {texto: `Termina ${actual.nombre}`, href: `/leccion/${s.leccionId}`, min: '9 min'} : null,
                actual && s.tipo === 'prueba-tema' ? {texto: `Prueba de ${actual.nombre}`, href: `/curso/${actual.id}`, min: '10 min'} : null,
                hoy.repasoPendiente ? {texto: `Repasa ${Math.min(hoy.repasoPendiente, 10)} preguntas falladas`, href: '/repaso', min: '7 min'} : null,
                {texto: 'Haz un simulacro corto', href: '/simulacro', min: '20 min'},
              ]
                .filter(Boolean)
                .map((a) => (
                  <li key={a!.texto}>
                    <Link href={a!.href} className="flex items-center gap-3 rounded-[12px] px-2 py-2.5 hover:bg-surface-2">
                      <span className="h-5 w-5 shrink-0 rounded-[6px] border-2 border-line" />
                      <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-ink">{a!.texto}</span>
                      <span className="shrink-0 text-[12.5px] text-ink-3">{a!.min}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

function FilaTema({t}: {t: {id: string; nombre: string; abierto: boolean; estado: string; nivel: number; completadas: number; lecciones: number; unidadId: string}}) {
  const e = estadoDe(t);
  const v = visualDeUnidad(t.unidadId);
  return (
    <Link href={`/curso/${t.id}`} className="flex items-center gap-3 rounded-[12px] px-3 py-3 hover:bg-surface-2">
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{background: `conic-gradient(${v.color} 0 ${t.nivel}%, var(--line-2) ${t.nivel}% 100%)`}}>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-surface text-[11px] font-bold text-ink">{t.nivel}</span>
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-[15px] font-medium ${t.abierto ? 'text-ink' : 'text-ink-2'}`}>{t.nombre}</span>
        <span className="block text-[12.5px] text-ink-3">
          {t.lecciones} {t.lecciones === 1 ? 'lección' : 'lecciones'}
          {t.abierto && t.completadas ? ` · ${t.completadas} vista${t.completadas === 1 ? '' : 's'}` : ''}
        </span>
      </span>
      <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${e.clase}`}>
        {!t.abierto && <Lock size={11} />}
        {e.texto}
      </span>
      <ChevronRight size={17} className="shrink-0 text-ink-3" />
    </Link>
  );
}

