'use client';

import {useCallback, useEffect, useMemo, useRef, useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {ArrowRight, Check, Flame, LoaderCircle, Sparkles, Timer, X} from 'lucide-react';
import {accionPorQue, accionResponder, accionTerminar} from '@/app/acciones';
import {btn} from '@/components/ui';
import {esInteractiva, Formato, marcadoCompleto, type Correccion} from './formatos';
import type {IntentoUI, Marcado} from './tipos';

// La pantalla de preguntas: una por vez, con la retroalimentación que corresponde a cada tipo de intento.

type Retro = {correcta: boolean; correctaIndex: number; solucion: number[] | null; explicacion: string; explicacionCorrecta: string};
type Seguridad = 'lo-se' | 'creo' | 'adivine';

const ELOGIOS = ['¡Bien!', '¡Correcto!', '¡Exacto!', '¡Así es!', '¡Muy bien!'];

function reloj(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function Runner({intento, titulo, salir}: {intento: IntentoUI; titulo: string; salir: {href: string; texto: string}}) {
  const router = useRouter();
  const ps = intento.preguntas;
  const destino = intento.tipo === 'diagnostico' ? 'diagnostico' : 'practicar';
  const primeraPendiente = ps.findIndex((p) => !intento.respondidas[p.id]);
  const [idx, setIdx] = useState(primeraPendiente === -1 ? ps.length : primeraPendiente);
  const [marcado, setMarcado] = useState<Marcado | null>(null);
  const [retro, setRetro] = useState<Retro | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [racha, setRacha] = useState(0);
  const [efecto, setEfecto] = useState<'' | 'latir' | 'sacudir'>('');
  const [pidiendoSeguridad, setPidiendoSeguridad] = useState(false);
  const [enviando, iniciar] = useTransition();
  const [porQue, setPorQue] = useState<string | null>(null);
  const [cargandoPorQue, setCargandoPorQue] = useState(false);
  const inicioPregunta = useRef(Date.now());
  const terminando = useRef(false);

  const p = ps[idx];
  const comoExamen = intento.tipo === 'simulacro';
  const inmediata = intento.retroalimentacion === 'inmediata';
  const respondidas = Object.keys(intento.respondidas).length + (idx - Math.max(0, primeraPendiente === -1 ? ps.length : primeraPendiente));

  const terminar = useCallback(() => {
    if (terminando.current) return;
    terminando.current = true;
    iniciar(() => accionTerminar(intento.id, destino));
  }, [intento.id, destino]);

  // Simulacro: cuenta regresiva; al llegar a cero se cierra solo.
  const [ahora, setAhora] = useState(() => Date.now());
  const fin = intento.terminaEn ? new Date(intento.terminaEn).getTime() : null;
  useEffect(() => {
    if (!fin) return;
    const t = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(t);
  }, [fin]);
  useEffect(() => {
    if (fin && ahora >= fin) terminar();
  }, [ahora, fin, terminar]);

  useEffect(() => {
    if (idx >= ps.length) terminar();
  }, [idx, ps.length, terminar]);

  const siguiente = () => {
    setMarcado(null);
    setRetro(null);
    setError(null);
    setPorQue(null);
    setPidiendoSeguridad(false);
    setEfecto('');
    inicioPregunta.current = Date.now();
    setIdx((i) => i + 1);
  };

  const enviar = (seguridad?: Seguridad) => {
    if (!p || !marcado) return;
    const segundos = (Date.now() - inicioPregunta.current) / 1000;
    iniciar(async () => {
      const r = await accionResponder(intento.id, p.id, {...marcado, seguridad, segundos});
      if ('error' in r) {
        if (r.codigo === 'tiempo' || r.codigo === 'terminado') return terminar();
        if (r.codigo === 'repetida') return siguiente();
        setError(r.error);
        return;
      }
      if ('correcta' in r) {
        setRetro(r);
        setRacha((n) => (r.correcta ? n + 1 : 0));
        setEfecto(r.correcta ? 'latir' : 'sacudir');
      } else {
        siguiente();
      }
    });
  };

  const comprobar = () => {
    if (intento.tipo === 'diagnostico') setPidiendoSeguridad(true);
    else enviar();
  };

  const pedirPorQue = async () => {
    if (!p || !marcado || !('elegida' in marcado)) return;
    setCargandoPorQue(true);
    const r = await accionPorQue(p.id, marcado.elegida);
    setCargandoPorQue(false);
    setPorQue('error' in r ? r.error : r.disponible ? r.respuesta : 'El tutor con IA se activa pronto. Por ahora, revisa la explicación de arriba.');
  };

  const correccion: Correccion | null = useMemo(
    () => (retro ? {correctaIndex: retro.correctaIndex, solucion: retro.solucion, acerto: retro.correcta} : null),
    [retro]
  );

  if (!p) {
    return (
      <div className="grid min-h-dvh place-items-center px-4">
        <div className="flex items-center gap-3 text-[16px] text-ink-2">
          <LoaderCircle className="animate-spin" size={20} /> Calculando tu resultado…
        </div>
      </div>
    );
  }

  const total = ps.length;
  const listo = marcadoCompleto(p, marcado);
  const queda = fin ? fin - ahora : null;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[760px] flex-col px-4 sm:px-6">
      {/* Cabecera: salir, avance y (en el simulacro) el tiempo */}
      <div className="sticky top-0 z-10 -mx-4 bg-bg/95 px-4 pt-4 pb-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-3">
          <a href={salir.href} className="grid h-10 w-10 shrink-0 place-items-center rounded-ctl text-ink-3 hover:bg-surface-2 hover:text-ink" aria-label={salir.texto} title={salir.texto}>
            <X size={20} />
          </a>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full transition-[width] duration-500" style={{width: `${(idx / total) * 100}%`, background: 'var(--anillo)'}} />
          </div>
          {queda !== null ? (
            <span className={`num inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[14px] font-semibold ${queda < 120_000 ? 'bg-bad-soft text-bad' : 'bg-surface text-ink'}`}>
              <Timer size={16} /> {reloj(queda)}
            </span>
          ) : racha >= 2 ? (
            <span className="num inline-flex h-9 items-center gap-1 rounded-full bg-warm-soft px-3 text-[14px] font-semibold text-warm" aria-label={`${racha} seguidas`}>
              <Flame size={16} /> {racha}
            </span>
          ) : (
            <span className="num text-[14px] font-semibold text-ink-3">
              {idx + 1}/{total}
            </span>
          )}
        </div>
        <p className="mt-3 truncate text-[13px] font-medium text-ink-3">
          {titulo} · {p.tema}
        </p>
      </div>

      {/* La pregunta */}
      <div key={p.id} className={`rise flex-1 pt-3 pb-44 ${efecto}`}>
        {p.formato !== 'completamiento' && <h1 className="mb-5 text-[21px] leading-snug font-semibold tracking-[-0.02em] text-ink sm:text-[24px]">{p.enunciado}</h1>}
        {p.formato === 'completamiento' && <p className="mb-2 text-[13.5px] font-medium text-ink-3">Completa el enunciado.</p>}
        <Formato p={p} marcado={marcado} setMarcado={setMarcado} bloqueado={Boolean(retro) || enviando} correccion={correccion} comoExamen={comoExamen} />
        {esInteractiva(p, comoExamen) && !retro && <p className="mt-4 text-[12.5px] text-ink-3">En el examen real esta pregunta trae 4 opciones; aquí la resuelves con tus manos.</p>}
      </div>

      {/* Panel inferior: comprobar, seguridad o retroalimentación */}
      <div className="fixed inset-x-0 bottom-0 z-20 pb-[env(safe-area-inset-bottom)]">
        {retro ? (
          <div className={`subir border-t ${retro.correcta ? 'border-ok/30 bg-ok-soft' : 'border-bad/30 bg-bad-soft'}`}>
            <div className="mx-auto max-w-[760px] px-4 py-4 sm:px-6">
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${retro.correcta ? 'bg-ok' : 'bg-bad'} text-surface`}>
                  {retro.correcta ? <Check size={20} strokeWidth={3} /> : <X size={20} strokeWidth={3} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-[17px] font-semibold ${retro.correcta ? 'text-ok' : 'text-bad'}`}>
                    {retro.correcta ? ELOGIOS[idx % ELOGIOS.length] : 'No era esa'}
                  </p>
                  <p className="mt-1 max-h-[28dvh] overflow-y-auto text-[15px] leading-relaxed text-ink">
                    {!retro.correcta && <span className="font-semibold">La correcta: </span>}
                    {retro.explicacionCorrecta.replace(/^Correcto:\s*/, '')}
                  </p>
                  {!retro.correcta && retro.explicacion !== retro.explicacionCorrecta && (
                    <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">Tu respuesta: {retro.explicacion}</p>
                  )}
                  {porQue && <p className="rise mt-2.5 rounded-ctl bg-surface px-3 py-2.5 text-[14.5px] leading-relaxed text-ink">{porQue}</p>}
                </div>
              </div>
              <div className="mt-4 flex gap-2.5">
                {!retro.correcta && !porQue && marcado && 'elegida' in marcado && (
                  <button type="button" onClick={pedirPorQue} disabled={cargandoPorQue} className={`${btn.secondary} flex-1 sm:flex-none`}>
                    {cargandoPorQue ? <LoaderCircle size={17} className="animate-spin" /> : <Sparkles size={17} />} ¿Por qué me equivoqué?
                  </button>
                )}
                <button type="button" onClick={siguiente} className={`${btn.primary} flex-1`} autoFocus>
                  {idx + 1 >= total ? 'Ver resultado' : 'Continuar'} <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : pidiendoSeguridad ? (
          <div className="subir border-t border-line bg-surface">
            <div className="mx-auto max-w-[760px] px-4 py-4 sm:px-6">
              <p className="text-[15px] font-semibold text-ink">¿Qué tan seguro estás?</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(
                  [
                    ['lo-se', 'Lo sé'],
                    ['creo', 'Creo'],
                    ['adivine', 'Adiviné'],
                  ] as const
                ).map(([v, t]) => (
                  <button key={v} type="button" disabled={enviando} onClick={() => enviar(v)} className={`${btn.secondary} h-12 w-full`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="border-t border-line bg-bg/95 backdrop-blur-md">
            <div className="mx-auto flex max-w-[760px] items-center gap-3 px-4 py-4 sm:px-6">
              {error && <p className="flex-1 text-[14px] font-medium text-bad">{error}</p>}
              {!error && intento.tipo === 'diagnostico' && (
                <p className="hidden flex-1 text-[13.5px] text-ink-3 sm:block">No es un examen: es para conocerte. Aquí no se muestra si acertaste.</p>
              )}
              <button type="button" onClick={comprobar} disabled={!listo || enviando} className={`${btn.primary} ml-auto w-full sm:w-auto sm:min-w-44`}>
                {enviando && <LoaderCircle size={18} className="animate-spin" />}
                {inmediata ? 'Comprobar' : idx + 1 >= total ? 'Terminar' : 'Siguiente'}
              </button>
            </div>
          </div>
        )}
      </div>
      <span className="sr-only" aria-live="polite">
        Pregunta {idx + 1} de {total}. {respondidas} respondidas.
      </span>
    </div>
  );
}
