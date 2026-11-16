'use client';

import {useEffect, useRef, useState, useTransition} from 'react';
import {LoaderCircle, SendHorizontal} from 'lucide-react';
import {accionTutor} from '@/app/acciones';

// Piezas del panel de la lección: el tutor con IA y las notas del docente.

type Msg = {rol: 'docente' | 'tutor'; texto: string};

const SUGERENCIAS = ['Explícamelo con un ejemplo del aula', '¿Qué es lo más preguntado de esto?', 'Hazme una pregunta para practicar'];

export function Tutor({leccionId, inicial, activo}: {leccionId: string; inicial: Msg[]; activo: boolean}) {
  const [msgs, setMsgs] = useState<Msg[]>(inicial);
  const [texto, setTexto] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pensando, iniciar] = useTransition();
  const fin = useRef<HTMLDivElement>(null);
  useEffect(() => {
    fin.current?.scrollIntoView({block: 'nearest'});
  }, [msgs, pensando]);

  const enviar = (t: string) => {
    const q = t.trim();
    if (!q || pensando) return;
    setTexto('');
    setError(null);
    setMsgs((m) => [...m, {rol: 'docente', texto: q}]);
    iniciar(async () => {
      const r = await accionTutor(leccionId, q);
      if ('error' in r) setError(r.error);
      else if (!r.disponible) setError('El tutor con IA se activa en los próximos días.');
      else setMsgs((m) => [...m, {rol: 'tutor', texto: r.respuesta}]);
    });
  };

  return (
    <div className="flex min-h-[340px] flex-1 flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {msgs.length === 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-[15px] leading-relaxed text-ink-2">
              {activo
                ? 'Pregúntame lo que no te quedó claro de esta lección. Respondo con el contenido del temario.'
                : 'Aquí vivirá tu tutor con IA: responde dudas solo con el contenido de esta lección. Se activa en los próximos días.'}
            </p>
            {activo && (
              <div className="flex flex-col gap-2">
                {SUGERENCIAS.map((s) => (
                  <button key={s} onClick={() => enviar(s)} className="rounded-ctl border border-line px-3 py-2.5 text-left text-[14px] text-ink-2 transition-colors hover:border-accent-ink hover:text-ink">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col gap-3">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`max-w-[88%] rounded-[14px] px-3.5 py-2.5 text-[14.5px] leading-relaxed whitespace-pre-wrap ${
                m.rol === 'docente' ? 'self-end bg-accent text-on-accent' : 'self-start bg-surface-2 text-ink'
              }`}
            >
              {m.texto}
            </div>
          ))}
          {pensando && (
            <div className="flex items-center gap-2 self-start rounded-[14px] bg-surface-2 px-3.5 py-2.5 text-[14px] text-ink-3">
              <LoaderCircle size={15} className="animate-spin" /> Pensando…
            </div>
          )}
          {error && <p className="text-[13.5px] text-ink-3">{error}</p>}
          <div ref={fin} />
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviar(texto);
        }}
        className="flex gap-2 border-t border-line p-3"
      >
        <label htmlFor="duda" className="sr-only">
          Tu pregunta
        </label>
        <input
          id="duda"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          disabled={!activo}
          placeholder={activo ? 'Escribe tu duda…' : 'Disponible pronto'}
          className="h-11 min-w-0 flex-1 rounded-ctl border border-line bg-surface px-3 text-[15px] text-ink outline-none placeholder:text-ink-3 focus:border-accent-ink disabled:opacity-60"
        />
        <button disabled={!activo || !texto.trim() || pensando} className="grid h-11 w-11 shrink-0 place-items-center rounded-ctl bg-primary text-on-primary disabled:opacity-40" aria-label="Enviar">
          <SendHorizontal size={18} />
        </button>
      </form>
    </div>
  );
}

/** Notas de la lección. El texto vive en la lección (no se pierde al cambiar de pestaña) y se guarda solo. */
export function Notas({texto, onCambio, estado}: {texto: string; onCambio: (t: string) => void; estado: '' | 'guardando' | 'guardado' | 'error'}) {
  return (
    <div className="flex min-h-[300px] flex-1 flex-col p-4">
      <label htmlFor="nota" className="text-[13.5px] font-medium text-ink-2">
        Lo que quieras recordar de esta lección. Se guarda solo.
      </label>
      <textarea
        id="nota"
        value={texto}
        onChange={(e) => onCambio(e.target.value)}
        placeholder="Por ejemplo: el Golgi empaca y envía las proteínas."
        className="mt-2 min-h-[220px] flex-1 resize-none rounded-ctl border border-line bg-surface-2 p-3 text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-3 focus:border-accent-ink"
      />
      <p className="mt-2 h-5 text-[12.5px] text-ink-3" aria-live="polite">
        {estado === 'guardando' ? 'Guardando…' : estado === 'guardado' ? 'Guardado' : estado === 'error' ? 'No se pudo guardar. Revisa tu conexión.' : ''}
      </p>
    </div>
  );
}
