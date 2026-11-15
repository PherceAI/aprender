'use client';

import {useEffect, useRef, useState, useTransition} from 'react';
import {LoaderCircle, NotebookPen, SendHorizontal, Sparkles} from 'lucide-react';
import {accionGuardarNota, accionTutor} from '@/app/acciones';

// Panel lateral de la lección: el tutor con IA y las notas del docente.

type Msg = {rol: 'docente' | 'tutor'; texto: string};

const SUGERENCIAS = ['Explícamelo con un ejemplo del aula', '¿Qué es lo más preguntado de esto?', 'Hazme una pregunta para practicar'];

export function PanelLeccion({leccionId, historial, nota, tutorActivo}: {leccionId: string; historial: Msg[]; nota: string; tutorActivo: boolean}) {
  const [pestana, setPestana] = useState<'tutor' | 'notas'>('tutor');
  return (
    <div className="card flex flex-col overflow-hidden lg:sticky lg:top-6 lg:max-h-[calc(100dvh-48px)]">
      <div className="flex gap-1 border-b border-line p-1.5" role="tablist">
        {(
          [
            ['tutor', 'Tutor IA', Sparkles],
            ['notas', 'Mis notas', NotebookPen],
          ] as const
        ).map(([id, texto, Icono]) => (
          <button
            key={id}
            role="tab"
            aria-selected={pestana === id}
            onClick={() => setPestana(id)}
            className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] text-[14px] font-semibold transition-colors ${
              pestana === id ? 'bg-surface-2 text-ink shadow-card' : 'text-ink-3 hover:bg-surface-2 hover:text-ink'
            }`}
          >
            <Icono size={16} /> {texto}
          </button>
        ))}
      </div>
      {pestana === 'tutor' ? <Tutor leccionId={leccionId} inicial={historial} activo={tutorActivo} /> : <Notas leccionId={leccionId} inicial={nota} />}
    </div>
  );
}

function Tutor({leccionId, inicial, activo}: {leccionId: string; inicial: Msg[]; activo: boolean}) {
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

function Notas({leccionId, inicial}: {leccionId: string; inicial: string}) {
  const [texto, setTexto] = useState(inicial);
  const [estado, setEstado] = useState<'' | 'guardando' | 'guardado'>('');
  const primero = useRef(true);
  useEffect(() => {
    if (primero.current) {
      primero.current = false;
      return;
    }
    setEstado('guardando');
    const t = setTimeout(async () => {
      await accionGuardarNota(leccionId, texto);
      setEstado('guardado');
    }, 700);
    return () => clearTimeout(t);
  }, [texto, leccionId]);
  return (
    <div className="flex min-h-[340px] flex-1 flex-col p-4">
      <label htmlFor="nota" className="text-[13.5px] font-medium text-ink-3">
        Lo que quieras recordar de esta lección. Se guarda solo.
      </label>
      <textarea
        id="nota"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        className="mt-2 min-h-[240px] flex-1 resize-none rounded-ctl border border-line bg-surface-2 p-3 text-[15px] leading-relaxed text-ink outline-none focus:border-accent-ink"
      />
      <p className="mt-2 h-5 text-[12.5px] text-ink-3">{estado === 'guardando' ? 'Guardando…' : estado === 'guardado' ? 'Guardado' : ''}</p>
    </div>
  );
}
