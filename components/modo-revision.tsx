'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {usePathname} from 'next/navigation';
import {Crosshair, LogOut, MessageSquarePlus, Send, Trash2, X} from 'lucide-react';
import {accionBorrarMiComentario, accionComentar, accionComentariosDeRuta} from '@/app/acciones';

// Modo revisión: el docente experto toca cualquier parte de cualquier pantalla y deja un comentario.
// Solo aparece en el navegador que abrió el enlace del revisor (cookie) y mientras exista REVISION_CLAVE.

type Comentario = Awaited<ReturnType<typeof accionComentariosDeRuta>>[number];
type Objetivo = {ancla: string; muestra: string};

const TIPOS = [
  {id: 'mejorar', texto: 'Mejorar'},
  {id: 'quitar', texto: 'Quitar'},
  {id: 'agregar', texto: 'Agregar'},
  {id: 'error', texto: 'Hay un error'},
  {id: 'gusta', texto: 'Me gusta'},
] as const;
const NOMBRE_TIPO: Record<string, string> = Object.fromEntries(TIPOS.map((t) => [t.id, t.texto]));

/** Un selector estable de la parte tocada: sube hasta un id o hasta <body>. */
function selectorDe(el: Element): string {
  const partes: string[] = [];
  let n: Element | null = el;
  while (n && n !== document.body && partes.length < 14) {
    if (n.id && !/^:|\d{3,}/.test(n.id)) {
      partes.unshift(`#${CSS.escape(n.id)}`);
      break;
    }
    const tag = n.tagName.toLowerCase();
    const hermanos = n.parentElement ? [...n.parentElement.children].filter((h) => h.tagName === n!.tagName) : [];
    partes.unshift(hermanos.length > 1 ? `${tag}:nth-of-type(${hermanos.indexOf(n) + 1})` : tag);
    n = n.parentElement;
  }
  return partes.join(' > ');
}

function muestraDe(el: Element): string {
  const t = (el as HTMLElement).innerText || el.getAttribute('aria-label') || el.getAttribute('alt') || el.tagName.toLowerCase();
  return t.replace(/\s+/g, ' ').trim().slice(0, 120);
}

type Marco = {top: number; left: number; width: number; height: number};
const marcoDe = (el: Element): Marco => {
  const r = el.getBoundingClientRect();
  return {top: r.top, left: r.left, width: r.width, height: r.height};
};

export function ModoRevision() {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [eligiendo, setEligiendo] = useState(false);
  const [marco, setMarco] = useState<Marco | null>(null);
  const [objetivo, setObjetivo] = useState<Objetivo | null>(null);
  const [tipo, setTipo] = useState<string>('mejorar');
  const [texto, setTexto] = useState('');
  const [nombre, setNombre] = useState('');
  const [lista, setLista] = useState<Comentario[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState<{error?: string; ok?: string}>({});
  const textoRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      setNombre(localStorage.getItem('revisor-nombre') ?? '');
    } catch {}
  }, []);

  // Al cambiar de pantalla: se limpia lo elegido y se cargan los comentarios de esta pantalla.
  useEffect(() => {
    setObjetivo(null);
    setAviso({});
    accionComentariosDeRuta(ruta).then(setLista).catch(() => setLista([]));
  }, [ruta]);

  // Elegir una parte: se resalta lo que está bajo el puntero y el toque no activa enlaces ni botones.
  useEffect(() => {
    if (!eligiendo) return;
    const fuera = (e: Event) => !(e.target as Element).closest('[data-revision]');
    const mover = (e: PointerEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el && !el.closest('[data-revision]')) setMarco(marcoDe(el));
    };
    const tocar = (e: MouseEvent) => {
      if (!fuera(e)) return;
      e.preventDefault();
      e.stopPropagation();
      const el = e.target as Element;
      setObjetivo({ancla: selectorDe(el), muestra: muestraDe(el)});
      setMarco(marcoDe(el));
      setEligiendo(false);
      setAbierto(true);
      setTimeout(() => textoRef.current?.focus(), 50);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEligiendo(false);
        setAbierto(true);
      }
    };
    document.addEventListener('pointermove', mover, true);
    document.addEventListener('click', tocar, true);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('pointermove', mover, true);
      document.removeEventListener('click', tocar, true);
      document.removeEventListener('keydown', tecla);
    };
  }, [eligiendo]);

  // El marco de lo elegido se apaga solo después de un momento.
  useEffect(() => {
    if (eligiendo || !marco) return;
    const t = setTimeout(() => setMarco(null), 1800);
    return () => clearTimeout(t);
  }, [marco, eligiendo]);

  const senalar = useCallback((ancla: string) => {
    if (!ancla) return;
    let el: Element | null = null;
    try {
      el = document.querySelector(ancla);
    } catch {}
    if (!el) {
      setAviso({error: 'Esa parte ya no está en esta pantalla.'});
      return;
    }
    el.scrollIntoView({block: 'center', behavior: 'smooth'});
    setTimeout(() => setMarco(marcoDe(el!)), 450);
  }, []);

  async function enviar() {
    if (!texto.trim()) {
      setAviso({error: 'Escribe tu comentario.'});
      return;
    }
    const autor = nombre.trim() || 'Revisor';
    try {
      localStorage.setItem('revisor-nombre', autor);
    } catch {}
    setEnviando(true);
    setAviso({});
    const r = await accionComentar({autor, ruta, ancla: objetivo?.ancla ?? '', muestra: objetivo?.muestra ?? '', tipo, texto, ancho: window.innerWidth});
    setEnviando(false);
    if ('error' in r) {
      setAviso({error: r.error});
      return;
    }
    setLista(r.lista);
    setTexto('');
    setObjetivo(null);
    setAviso({ok: '¡Gracias! Tu comentario quedó guardado.'});
  }

  async function borrar(c: Comentario) {
    setLista(await accionBorrarMiComentario(c.id, c.autor, ruta));
  }

  const chip = (activo: boolean) =>
    `h-9 rounded-full border px-3.5 text-[13.5px] font-semibold transition-colors ${activo ? 'border-accent bg-accent-soft text-accent-ink' : 'border-line bg-surface text-ink-2 hover:bg-surface-2'}`;

  return (
    <div data-revision>
      {marco && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-[80] rounded-[8px] border-2 border-accent bg-accent/10 transition-all duration-100"
          style={{top: marco.top - 3, left: marco.left - 3, width: marco.width + 6, height: marco.height + 6}}
        />
      )}

      {eligiendo && (
        <div className="fixed inset-x-0 top-0 z-[90] flex items-center justify-center gap-3 bg-[#171717] px-4 py-3 text-[14.5px] font-medium text-white">
          <Crosshair size={17} /> Toca la parte que quieres comentar
          <button
            type="button"
            onClick={() => {
              setEligiendo(false);
              setMarco(null);
              setAbierto(true);
            }}
            className="ml-2 rounded-full border border-white/40 px-3 py-1 text-[13.5px] font-semibold hover:bg-white/10"
          >
            Cancelar
          </button>
        </div>
      )}

      {!abierto && !eligiendo && (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="fixed bottom-[calc(88px+env(safe-area-inset-bottom))] left-4 z-[70] inline-flex h-12 items-center gap-2 rounded-full bg-[#171717] px-4 text-[14.5px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)] lg:right-6 lg:bottom-6 lg:left-auto"
        >
          <MessageSquarePlus size={18} /> Comentar
          {lista.length > 0 && <span className="num grid h-6 min-w-6 place-items-center rounded-full bg-accent px-1.5 text-[12.5px]">{lista.length}</span>}
        </button>
      )}

      {abierto && !eligiendo && (
        <section
          aria-label="Modo revisión"
          className="fixed inset-x-0 bottom-0 z-[70] max-h-[85dvh] overflow-y-auto rounded-t-[24px] border border-line bg-surface p-5 pb-[calc(20px+env(safe-area-inset-bottom))] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.35)] lg:inset-x-auto lg:right-6 lg:bottom-6 lg:w-[400px] lg:rounded-[22px] lg:pb-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Modo revisión</h2>
              <p className="mt-0.5 text-[13.5px] leading-snug text-ink-2">Comenta cualquier parte de esta pantalla. Tus comentarios le llegan al administrador.</p>
            </div>
            <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink">
              <X size={18} />
            </button>
          </div>

          <label className="mt-4 block text-[13px] font-semibold text-ink-2" htmlFor="revisor-nombre">
            Tu nombre
          </label>
          <input
            id="revisor-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Para saber quién comentó"
            className="mt-1.5 h-11 w-full rounded-ctl border border-line bg-surface px-3 text-[15px] text-ink outline-none placeholder:text-ink-3 focus:border-accent-ink"
          />

          <p className="mt-4 text-[13px] font-semibold text-ink-2">¿Qué comentas?</p>
          {objetivo ? (
            <div className="mt-1.5 flex items-start gap-2 rounded-[12px] bg-surface-2 px-3 py-2.5">
              <p className="min-w-0 flex-1 text-[13.5px] leading-snug text-ink">
                <span className="text-ink-3">Esta parte: </span>«{objetivo.muestra || 'sin texto'}»
              </p>
              <button type="button" onClick={() => setObjetivo(null)} aria-label="Quitar la parte elegida" className="shrink-0 text-ink-3 hover:text-ink">
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="mt-1.5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setAbierto(false);
                  setEligiendo(true);
                }}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-accent px-4 text-[14px] font-semibold text-white"
              >
                <Crosshair size={16} /> Tocar una parte
              </button>
              <span className="inline-flex h-10 items-center px-1 text-[13.5px] text-ink-3">o comenta la pantalla entera</span>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Tipo de comentario">
            {TIPOS.map((t) => (
              <button key={t.id} type="button" onClick={() => setTipo(t.id)} aria-pressed={tipo === t.id} className={chip(tipo === t.id)}>
                {t.texto}
              </button>
            ))}
          </div>

          <label className="mt-4 block text-[13px] font-semibold text-ink-2" htmlFor="revisor-texto">
            Tu comentario
          </label>
          <textarea
            id="revisor-texto"
            ref={textoRef}
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              if (aviso.error) setAviso({});
            }}
            rows={3}
            placeholder="Qué mejorarías, quitarías o agregarías"
            className="mt-1.5 w-full resize-y rounded-ctl border border-line bg-surface px-3 py-2.5 text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-3 focus:border-accent-ink"
          />
          {aviso.error && <p className="mt-1.5 text-[13.5px] font-medium text-bad">{aviso.error}</p>}
          {aviso.ok && <p className="mt-1.5 text-[13.5px] font-medium text-ok">{aviso.ok}</p>}

          <button
            type="button"
            onClick={enviar}
            disabled={enviando}
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#171717] text-[15px] font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-[#171717]"
          >
            <Send size={16} /> {enviando ? 'Guardando…' : 'Guardar comentario'}
          </button>

          {lista.length > 0 && (
            <div className="mt-5 border-t border-line pt-4">
              <p className="text-[13px] font-semibold text-ink-2">En esta pantalla ({lista.length})</p>
              <ul className="mt-2 flex flex-col gap-2">
                {lista.map((c) => (
                  <li key={c.id} className="rounded-[12px] border border-line p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12.5px] font-semibold text-accent-ink">
                        {NOMBRE_TIPO[c.tipo] ?? c.tipo} · {c.autor}
                        {c.resuelto && <span className="ml-1.5 font-medium text-ok">Resuelto</span>}
                      </span>
                      {c.autor === (nombre.trim() || 'Revisor') && !c.resuelto && (
                        <button type="button" onClick={() => borrar(c)} aria-label="Borrar mi comentario" className="text-ink-3 hover:text-bad">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-[14px] leading-snug text-ink">{c.texto}</p>
                    {c.ancla && (
                      <button type="button" onClick={() => senalar(c.ancla)} className="mt-1 text-left text-[12.5px] text-ink-3 underline-offset-2 hover:text-ink hover:underline">
                        Señalar: «{c.muestra || 'parte de la pantalla'}»
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a href="/revision?salir=1" className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-3 hover:text-ink">
            <LogOut size={14} /> Salir del modo revisión
          </a>
        </section>
      )}
    </div>
  );
}
