'use client';

import {useCallback, useEffect, useMemo, useRef, useState, useTransition} from 'react';
import Link from 'next/link';
import {ArrowLeft, ArrowRight, Check, FileText, Lightbulb, NotebookPen, RotateCcw, School, Sparkles, Trophy, X} from 'lucide-react';
import type {Seccion} from '@/contenido/tipos';
import {accionGuardarNota, accionMarcarLeccion} from '@/app/acciones';
import {Explorar} from '@/components/laboratorio/explorar';
import {BotonIniciar} from '@/components/boton-iniciar';
import {Notas, Tutor} from './panel';

// La lección por pantallas: una idea a la vez, algo que hacer en cada una y una pregunta de control
// con su explicación. Arriba se ve cuánto falta; abajo, Atrás y Continuar. El tutor y las notas van al costado.

type Msg = {rol: 'docente' | 'tutor'; texto: string};
export type Control = {enunciado: string; opciones: string[]; correcta: number; explicaciones: string[]};

type Pantalla =
  | {tipo: 'seccion'; s: Seccion}
  | {tipo: 'control'; p: Control}
  | {tipo: 'final'};

const RETO: Record<string, string[]> = {'celula-vegetal': ['pared', 'cloroplasto', 'vacuola']};
const LETRAS = 'ABCD';

export function Reproductor(props: {
  leccion: {id: string; titulo: string; numero: number; de: number; objetivo: string; contenido: Seccion[]; completada: boolean};
  tema: {id: string; nombre: string};
  siguiente: {id: string; titulo: string} | null;
  fichaPagina: {pagina: number; url: string} | null;
  control: Control | null;
  nota: string;
  historial: Msg[];
  tutorActivo: boolean;
}) {
  const {leccion, tema, siguiente, fichaPagina, control} = props;
  const pantallas = useMemo<Pantalla[]>(() => {
    const ps: Pantalla[] = leccion.contenido.map((s) => ({tipo: 'seccion', s}));
    if (control) ps.push({tipo: 'control', p: control});
    ps.push({tipo: 'final'});
    return ps;
  }, [leccion.contenido, control]);

  const clave = `leccion:${leccion.id}`;
  const [i, setI] = useState(0);
  const [listo, setListo] = useState<Record<number, boolean>>({});
  const [panel, setPanel] = useState<null | 'tutor' | 'notas'>(null);
  const [marcando, marcar] = useTransition();
  const [errorMarca, setErrorMarca] = useState<string | null>(null);

  // Retoma la pantalla donde quedó (solo una comodidad: si falla, empieza desde el inicio).
  useEffect(() => {
    try {
      const n = Number(localStorage.getItem(clave));
      if (n > 0 && n < pantallas.length - 1) setI(n);
    } catch {}
  }, [clave, pantallas.length]);
  useEffect(() => {
    try {
      localStorage.setItem(clave, String(i));
    } catch {}
  }, [clave, i]);

  const p = pantallas[i];
  const total = pantallas.length;
  const puedeSeguir = p.tipo === 'final' || listo[i] || !requiereAccion(p);

  const ir = useCallback(
    (n: number) => {
      const destino = Math.max(0, Math.min(total - 1, n));
      setI(destino);
      window.scrollTo({top: 0});
      if (pantallas[destino].tipo === 'final' && !leccion.completada) {
        marcar(async () => {
          const r = await accionMarcarLeccion(leccion.id);
          if ('error' in r) setErrorMarca(r.error);
        });
      }
    },
    [total, pantallas, leccion.completada, leccion.id]
  );

  // Teclado: flecha derecha o Enter para continuar, flecha izquierda para volver.
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT') return;
      if ((e.key === 'ArrowRight' || e.key === 'Enter') && puedeSeguir && p.tipo !== 'final') ir(i + 1);
      if (e.key === 'ArrowLeft' && i > 0) ir(i - 1);
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [i, ir, puedeSeguir, p.tipo]);

  // Notas: el texto vive aquí y se guarda solo (y al cerrar el panel o salir).
  const [nota, setNota] = useState(props.nota);
  const [estadoNota, setEstadoNota] = useState<'' | 'guardando' | 'guardado' | 'error'>('');
  const pendiente = useRef<string | null>(null);
  const guardar = useCallback(
    async (texto: string) => {
      setEstadoNota('guardando');
      try {
        await accionGuardarNota(leccion.id, texto);
        if (pendiente.current === texto) pendiente.current = null;
        setEstadoNota('guardado');
      } catch {
        setEstadoNota('error');
      }
    },
    [leccion.id]
  );
  useEffect(() => {
    if (pendiente.current === null) return;
    const t = setTimeout(() => pendiente.current !== null && guardar(pendiente.current), 600);
    return () => clearTimeout(t);
  }, [nota, guardar]);
  useEffect(() => {
    const salir = () => {
      if (pendiente.current !== null) void accionGuardarNota(leccion.id, pendiente.current);
    };
    window.addEventListener('pagehide', salir);
    return () => {
      window.removeEventListener('pagehide', salir);
      salir();
    };
  }, [leccion.id]);
  const cambiarNota = (t: string) => {
    pendiente.current = t;
    setNota(t);
  };
  const cerrarPanel = () => {
    if (pendiente.current !== null) void guardar(pendiente.current);
    setPanel(null);
  };

  const marcarListo = useCallback((n: number) => setListo((l) => (l[n] ? l : {...l, [n]: true})), []);

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      {/* Barra superior */}
      <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-3 px-3 sm:gap-4 sm:px-6">
          <Link href={`/curso/${tema.id}`} aria-label="Salir de la lección" className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] border border-line text-ink-2 hover:bg-surface-2">
            <X size={19} />
          </Link>
          <p className="hidden max-w-[260px] truncate text-[15px] font-semibold text-ink md:block">
            Lección {leccion.numero} · {leccion.titulo}
          </p>
          <div className="flex min-w-0 flex-1 gap-1" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={i + 1} aria-label="Avance de la lección">
            {pantallas.map((_, n) => (
              <span key={n} className={`h-2 flex-1 rounded-full transition-colors ${n < i ? 'bg-accent' : n === i ? 'bg-accent/60' : 'bg-line-2'}`} />
            ))}
          </div>
          <div className="flex shrink-0 gap-1.5">
            <button type="button" onClick={() => setPanel(panel === 'tutor' ? null : 'tutor')} className={`inline-flex h-10 items-center gap-1.5 rounded-[12px] border px-2.5 text-[14px] font-semibold sm:px-3 ${panel === 'tutor' ? 'border-accent bg-accent-soft text-accent-ink' : 'border-line text-ink-2 hover:bg-surface-2'}`}>
              <Sparkles size={17} /> <span className="hidden sm:inline">Tutor</span>
            </button>
            <button type="button" onClick={() => (panel === 'notas' ? cerrarPanel() : setPanel('notas'))} className={`inline-flex h-10 items-center gap-1.5 rounded-[12px] border px-2.5 text-[14px] font-semibold sm:px-3 ${panel === 'notas' ? 'border-accent bg-accent-soft text-accent-ink' : 'border-line text-ink-2 hover:bg-surface-2'}`}>
              <NotebookPen size={17} /> <span className="hidden sm:inline">Notas</span>
            </button>
            {fichaPagina && (
              <a href={fichaPagina.url} target="_blank" rel="noopener noreferrer" className="hidden h-10 items-center gap-1.5 rounded-[12px] border border-line px-3 text-[14px] font-semibold text-ink-2 hover:bg-surface-2 lg:inline-flex">
                <FileText size={17} /> Ficha pág. {fichaPagina.pagina}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Pantalla */}
      <main className="mx-auto w-full max-w-[1080px] flex-1 px-4 pt-8 pb-36 sm:px-6 lg:pt-12">
        <div key={i} className="rise">
          {p.tipo === 'seccion' && <PantallaSeccion s={p.s} n={i + 1} total={total} titulo={leccion.titulo} onListo={() => marcarListo(i)} />}
          {p.tipo === 'control' && <PantallaControl p={p.p} n={i + 1} total={total} onListo={() => marcarListo(i)} />}
          {p.tipo === 'final' && (
            <PantallaFinal
              leccion={leccion}
              tema={tema}
              siguiente={siguiente}
              claves={leccion.contenido.filter((s): s is Extract<Seccion, {tipo: 'clave'}> => s.tipo === 'clave').map((s) => s.texto)}
              guardando={marcando}
              error={errorMarca}
              onRepetir={() => ir(0)}
              fichaPagina={fichaPagina}
            />
          )}
        </div>
      </main>

      {/* Barra inferior */}
      {p.tipo !== 'final' && (
        <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
          <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
            <button type="button" onClick={() => ir(i - 1)} disabled={i === 0} className="inline-flex h-12 items-center gap-2 rounded-full border border-line px-5 text-[15px] font-semibold text-ink disabled:opacity-40">
              <ArrowLeft size={18} /> <span className="hidden sm:inline">Atrás</span>
            </button>
            <p className="min-w-0 truncate text-center text-[13.5px] text-ink-3">{puedeSeguir ? `Pantalla ${i + 1} de ${total}` : pistaDe(p)}</p>
            <button type="button" onClick={() => ir(i + 1)} disabled={!puedeSeguir} className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-[15px] font-semibold text-white transition-opacity disabled:opacity-40">
              Continuar <ArrowRight size={18} />
            </button>
          </div>
        </footer>
      )}

      {/* Panel: tutor o notas (al costado en computadora, desde abajo en el teléfono) */}
      {panel && (
        <>
          <button type="button" aria-label="Cerrar panel" onClick={cerrarPanel} className="fixed inset-0 z-30 bg-black/20 lg:hidden" />
          <aside className="fixed inset-x-0 bottom-0 z-40 flex h-[78dvh] flex-col overflow-hidden rounded-t-[24px] border border-line bg-surface lg:inset-x-auto lg:top-16 lg:right-0 lg:bottom-0 lg:h-auto lg:w-[400px] lg:rounded-none lg:border-y-0 lg:border-r-0">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                {panel === 'tutor' ? <Sparkles size={17} className="text-accent" /> : <NotebookPen size={17} className="text-accent" />}
                {panel === 'tutor' ? 'Tutor con IA' : 'Mis notas'}
              </p>
              <button type="button" onClick={cerrarPanel} aria-label="Cerrar" className="grid h-9 w-9 place-items-center rounded-[10px] text-ink-3 hover:bg-surface-2">
                <X size={18} />
              </button>
            </div>
            {panel === 'tutor' ? <Tutor leccionId={leccion.id} inicial={props.historial} activo={props.tutorActivo} /> : <Notas texto={nota} onCambio={cambiarNota} estado={estadoNota} />}
          </aside>
        </>
      )}
    </div>
  );
}

function requiereAccion(p: Pantalla) {
  if (p.tipo === 'control') return true;
  if (p.tipo === 'seccion') return p.s.tipo === 'laboratorio' || p.s.tipo === 'puntos' || p.s.tipo === 'ejemplo';
  return false;
}

function pistaDe(p: Pantalla) {
  if (p.tipo === 'control') return 'Responde para seguir';
  if (p.tipo === 'seccion' && p.s.tipo === 'laboratorio') return 'Explora la célula';
  if (p.tipo === 'seccion' && p.s.tipo === 'puntos') return 'Toca las tarjetas';
  if (p.tipo === 'seccion' && p.s.tipo === 'ejemplo') return 'Mira la explicación';
  return '';
}

function Etiqueta({children}: {children: React.ReactNode}) {
  return <span className="inline-flex h-7 items-center rounded-full bg-accent-soft px-3 text-[13px] font-semibold text-accent-ink">{children}</span>;
}

function PantallaSeccion({s, n, total, titulo, onListo}: {s: Seccion; n: number; total: number; titulo: string; onListo: () => void}) {
  switch (s.tipo) {
    case 'texto':
      return (
        <div className="mx-auto max-w-[680px]">
          <Etiqueta>
            Pantalla {n} de {total} · Lee
          </Etiqueta>
          <h1 className="mt-4 text-[30px] leading-tight font-semibold tracking-[-0.035em] text-ink sm:text-[38px]">{s.titulo ?? titulo}</h1>
          <p className="mt-5 text-[18px] leading-[1.7] text-ink sm:text-[19px]">{s.texto}</p>
        </div>
      );
    case 'puntos':
      return <Tarjetas s={s} n={n} total={total} onListo={onListo} />;
    case 'comparacion':
      return (
        <div className="mx-auto max-w-[820px]">
          <Etiqueta>
            Pantalla {n} de {total} · Compara
          </Etiqueta>
          <h1 className="mt-4 text-[28px] leading-tight font-semibold tracking-[-0.035em] text-ink sm:text-[34px]">{s.titulo ?? 'Compara'}</h1>
          <div className="mt-6 overflow-hidden rounded-[18px] border border-line bg-surface">
            <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)] bg-accent-soft text-[13.5px] font-semibold text-accent-ink">
              <span className="px-4 py-3" />
              <span className="px-4 py-3">{s.columnas[0]}</span>
              <span className="px-4 py-3">{s.columnas[1]}</span>
            </div>
            {s.filas.map((f, j) => (
              <div key={j} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)] border-t border-line text-[15px]">
                <span className="px-4 py-3.5 font-semibold text-ink">{f.aspecto}</span>
                <span className="px-4 py-3.5 text-ink-2">{f.a}</span>
                <span className="px-4 py-3.5 text-ink-2">{f.b}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case 'laboratorio':
      return <Laboratorio s={s} n={n} total={total} onListo={onListo} />;
    case 'ejemplo':
      return <Ejemplo s={s} n={n} total={total} onListo={onListo} />;
    case 'aula':
      return (
        <div className="mx-auto max-w-[680px]">
          <Etiqueta>
            Pantalla {n} de {total} · Llévalo al aula
          </Etiqueta>
          <div className="mt-5 flex gap-4 rounded-[22px] bg-accent-soft p-6 sm:p-8">
            <School size={28} className="mt-1 shrink-0 text-accent" />
            <div>
              <p className="text-[15px] font-semibold text-accent-ink">En tu aula</p>
              <p className="mt-2 text-[18px] leading-[1.65] text-ink">{s.texto}</p>
            </div>
          </div>
        </div>
      );
    case 'clave':
      return (
        <div className="mx-auto max-w-[680px]">
          <Etiqueta>
            Pantalla {n} de {total} · Para el examen
          </Etiqueta>
          <div className="mt-5 flex gap-4 rounded-[22px] border-2 border-accent bg-surface p-6 sm:p-8">
            <Lightbulb size={28} className="mt-1 shrink-0 text-accent" />
            <div>
              <p className="text-[15px] font-semibold text-accent-ink">Recuerda esto</p>
              <p className="mt-2 text-[19px] leading-[1.6] font-medium text-ink">{s.texto}</p>
            </div>
          </div>
        </div>
      );
  }
}

/** Tarjetas que se voltean: el docente intenta recordar antes de ver la explicación. */
function Tarjetas({s, n, total, onListo}: {s: Extract<Seccion, {tipo: 'puntos'}>; n: number; total: number; onListo: () => void}) {
  const [abiertas, setAbiertas] = useState<Set<number>>(new Set());
  const items = s.puntos.map((p) => {
    const [cabeza, ...resto] = p.split(': ');
    return resto.length ? {cabeza, cuerpo: resto.join(': ')} : {cabeza: p, cuerpo: ''};
  });
  const conCuerpo = items.filter((x) => x.cuerpo).length;
  useEffect(() => {
    if (conCuerpo === 0 || abiertas.size >= conCuerpo) onListo();
  }, [abiertas, conCuerpo, onListo]);
  return (
    <div className="mx-auto max-w-[820px]">
      <Etiqueta>
        Pantalla {n} de {total} · Descubre
      </Etiqueta>
      <h1 className="mt-4 text-[28px] leading-tight font-semibold tracking-[-0.035em] text-ink sm:text-[34px]">{s.titulo ?? 'Descubre'}</h1>
      {conCuerpo > 0 && <p className="mt-2 text-[16px] text-ink-2">Piensa qué hace cada uno y toca la tarjeta para comprobarlo.</p>}
      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
        {items.map((x, j) => {
          const abierta = abiertas.has(j) || !x.cuerpo;
          return (
            <button
              key={j}
              type="button"
              onClick={() => setAbiertas((a) => new Set(a).add(j))}
              aria-expanded={abierta}
              className={`min-h-[96px] rounded-[18px] border p-5 text-left transition-colors ${abierta ? 'border-accent bg-surface' : 'border-line bg-surface-2 hover:border-accent'}`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-[17px] font-semibold text-ink">{x.cabeza}</span>
                {abierta ? <Check size={18} className="shrink-0 text-ok" /> : <span className="shrink-0 text-[13px] font-semibold text-accent-ink">Toca</span>}
              </span>
              {abierta && x.cuerpo && <span className="rise mt-2 block text-[15.5px] leading-relaxed text-ink-2">{x.cuerpo}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Laboratorio({s, n, total, onListo}: {s: Extract<Seccion, {tipo: 'laboratorio'}>; n: number; total: number; onListo: () => void}) {
  const reto = RETO[s.lab];
  const [vistas, setVistas] = useState(0);
  const [totalZonas, setTotalZonas] = useState(0);
  const meta = reto ? reto.length : 3;
  return (
    <div>
      <Etiqueta>
        Pantalla {n} de {total} · Explora
      </Etiqueta>
      <h1 className="mt-4 max-w-[24ch] text-[28px] leading-tight font-semibold tracking-[-0.035em] text-ink sm:text-[34px]">Laboratorio: explora la célula</h1>
      <p className="mt-2 max-w-[60ch] text-[16px] text-ink-2">{s.consigna}</p>
      {!reto && (
        <p className={`mt-3 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13.5px] font-semibold ${vistas >= meta ? 'bg-ok-soft text-ok' : 'bg-accent-soft text-accent-ink'}`}>
          {vistas >= meta ? <Check size={15} strokeWidth={3} /> : null}
          {vistas >= meta ? `¡Bien! Exploraste ${vistas} de ${totalZonas || vistas} partes` : `Exploraste ${vistas} de al menos ${meta} partes`}
        </p>
      )}
      <div className="mt-6 rounded-[22px] border border-line bg-surface p-4 sm:p-6">
        <Explorar
          lab={s.lab}
          reto={reto}
          onVistas={(v, t, retoCompleto) => {
            setVistas(v);
            setTotalZonas(t);
            if ((reto && retoCompleto) || (!reto && v >= meta)) onListo();
          }}
        />
      </div>
    </div>
  );
}

/** Ejemplo de la vida real: primero piensa por qué pasa; después ve la explicación. */
function Ejemplo({s, n, total, onListo}: {s: Extract<Seccion, {tipo: 'ejemplo'}>; n: number; total: number; onListo: () => void}) {
  const [visto, setVisto] = useState(false);
  return (
    <div className="mx-auto max-w-[720px]">
      <Etiqueta>
        Pantalla {n} de {total} · Ejemplo
      </Etiqueta>
      <h1 className="mt-4 text-[28px] leading-tight font-semibold tracking-[-0.035em] text-ink sm:text-[34px]">{s.titulo ?? 'Míralo en la vida real'}</h1>
      <div className="mt-6 rounded-[22px] border border-line bg-surface p-6 sm:p-8">
        <p className="flex items-center gap-2 text-[14px] font-semibold text-accent-ink">
          <Lightbulb size={17} /> La situación
        </p>
        <p className="mt-2 text-[18px] leading-[1.65] text-ink">{s.situacion}</p>
        {!visto ? (
          <div className="mt-6 border-t border-line pt-5">
            <p className="text-[15.5px] font-medium text-ink-2">¿Por qué crees que pasa? Piénsalo un momento.</p>
            <button
              type="button"
              onClick={() => {
                setVisto(true);
                onListo();
              }}
              className="mt-4 inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-[15px] font-semibold text-white"
            >
              Ver la explicación
            </button>
          </div>
        ) : (
          <div className="subir mt-6 rounded-[16px] bg-ok-soft p-5">
            <p className="text-[15px] font-semibold text-ok">La explicación</p>
            <p className="mt-1.5 text-[16.5px] leading-[1.65] text-ink">{s.explicacion}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/** Pregunta de control: responde y ve al instante por qué. */
function PantallaControl({p, n, total, onListo}: {p: Control; n: number; total: number; onListo: () => void}) {
  const [elegida, setElegida] = useState<number | null>(null);
  const respondida = elegida !== null;
  const acerto = elegida === p.correcta;
  return (
    <div className="mx-auto max-w-[720px]">
      <Etiqueta>
        Pantalla {n} de {total} · Comprueba
      </Etiqueta>
      <h1 className="mt-4 text-[24px] leading-snug font-semibold tracking-[-0.025em] text-ink sm:text-[28px]">{p.enunciado}</h1>
      <div className="mt-6 flex flex-col gap-3">
        {p.opciones.map((o, j) => {
          const ok = respondida && j === p.correcta;
          const mal = respondida && j === elegida && !acerto;
          return (
            <button
              key={j}
              type="button"
              disabled={respondida}
              onClick={() => {
                setElegida(j);
                onListo();
              }}
              className={`flex min-h-[58px] items-center gap-3 rounded-[16px] border px-4 py-3 text-left text-[16px] transition-colors ${
                ok ? 'border-ok bg-ok-soft text-ink' : mal ? 'border-bad bg-bad-soft text-ink' : respondida ? 'border-line text-ink-3' : 'border-line bg-surface text-ink hover:border-accent hover:bg-accent-soft'
              }`}
            >
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[14px] font-semibold ${ok ? 'bg-ok text-white' : mal ? 'bg-bad text-white' : 'bg-surface-2 text-ink-2'}`}>
                {ok ? <Check size={16} strokeWidth={3} /> : mal ? <X size={16} strokeWidth={3} /> : LETRAS[j]}
              </span>
              {o}
            </button>
          );
        })}
      </div>
      {respondida && (
        <div aria-live="polite" className={`subir mt-5 rounded-[18px] p-5 ${acerto ? 'bg-ok-soft' : 'bg-bad-soft'}`}>
          <p className={`text-[17px] font-semibold ${acerto ? 'text-ok' : 'text-bad'}`}>{acerto ? '¡Correcto!' : 'Casi. Mira por qué:'}</p>
          {!acerto && <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink">{p.explicaciones[elegida!]}</p>}
          <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink">{p.explicaciones[p.correcta].replace(/^Correcto:\s*/, '')}</p>
        </div>
      )}
    </div>
  );
}

function PantallaFinal({
  leccion,
  tema,
  siguiente,
  claves,
  guardando,
  error,
  onRepetir,
  fichaPagina,
}: {
  leccion: {id: string; numero: number; de: number; titulo: string};
  tema: {id: string; nombre: string};
  siguiente: {id: string; titulo: string} | null;
  claves: string[];
  guardando: boolean;
  error: string | null;
  onRepetir: () => void;
  fichaPagina: {pagina: number; url: string} | null;
}) {
  return (
    <div className="mx-auto max-w-[680px] text-center">
      <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-ok-soft text-ok">
        <Trophy size={36} />
      </span>
      <h1 className="mt-5 text-[30px] leading-tight font-semibold tracking-[-0.035em] text-ink sm:text-[36px]">¡Lección completada!</h1>
      <p className="mt-2 text-[16.5px] text-ink-2">
        {error ?? (guardando ? 'Guardando tu avance…' : `Terminaste la lección ${leccion.numero} de ${leccion.de} de ${tema.nombre}.`)}
      </p>

      {claves.length > 0 && (
        <div className="mt-7 rounded-[20px] border border-line bg-surface p-5 text-left sm:p-6">
          <p className="flex items-center gap-2 text-[15px] font-semibold text-accent-ink">
            <Lightbulb size={18} /> Lo más importante
          </p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {claves.map((c) => (
              <li key={c} className="text-[15.5px] leading-relaxed text-ink">
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
        <BotonIniciar tipo="practica" referencia={leccion.id} texto="Practicar 3 preguntas" className="!rounded-full px-7" />
        {siguiente ? (
          <Link href={`/leccion/${siguiente.id}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line px-6 text-[15px] font-semibold text-ink hover:bg-surface-2">
            Siguiente lección <ArrowRight size={18} />
          </Link>
        ) : (
          <Link href={`/curso/${tema.id}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line px-6 text-[15px] font-semibold text-ink hover:bg-surface-2">
            Ir a la prueba del tema <ArrowRight size={18} />
          </Link>
        )}
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[14px]">
        <button type="button" onClick={onRepetir} className="inline-flex items-center gap-1.5 font-semibold text-ink-2 hover:text-ink">
          <RotateCcw size={15} /> Ver la lección otra vez
        </button>
        {fichaPagina && (
          <a href={fichaPagina.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-accent-ink hover:underline">
            <FileText size={15} /> De dónde sale: ficha oficial, pág. {fichaPagina.pagina}
          </a>
        )}
      </div>
    </div>
  );
}
