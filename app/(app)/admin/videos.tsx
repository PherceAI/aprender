'use client';

import {useRef, useState, useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {CheckCircle2, Lock, Trash2, Upload} from 'lucide-react';
import {accionQuitarVideo} from '@/app/acciones';

type T = {id: string; nombre: string; unidad: string; abierto: boolean; videoUrl: string | null; videoTitulo: string | null};

export function Videos({temas}: {temas: T[]}) {
  const [ver, setVer] = useState<'abiertos' | 'todos'>('abiertos');
  const lista = ver === 'abiertos' ? temas.filter((t) => t.abierto) : temas;
  return (
    <div className="mt-4">
      <div className="mb-3 flex gap-1.5">
        {(['abiertos', 'todos'] as const).map((v) => (
          <button key={v} onClick={() => setVer(v)} className={`h-9 rounded-full px-3.5 text-[13.5px] font-semibold ${ver === v ? 'bg-ink text-bg' : 'bg-surface-2 text-ink-2'}`}>
            {v === 'abiertos' ? 'Temas abiertos' : 'Los 31 temas'}
          </button>
        ))}
      </div>
      <ul className="flex flex-col divide-y divide-line">
        {lista.map((t) => (
          <FilaVideo key={t.id} t={t} />
        ))}
      </ul>
    </div>
  );
}

function FilaVideo({t}: {t: T}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [progreso, setProgreso] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quitando, iniciar] = useTransition();

  const subir = (f: File) => {
    setError(null);
    setProgreso(0);
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `/api/admin/videos?tema=${encodeURIComponent(t.id)}&titulo=${encodeURIComponent(f.name.replace(/\.[^.]+$/, ''))}`);
    xhr.setRequestHeader('content-type', f.type || 'video/mp4');
    xhr.upload.onprogress = (e) => e.lengthComputable && setProgreso(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      setProgreso(null);
      if (xhr.status >= 200 && xhr.status < 300) router.refresh();
      else {
        try {
          setError(JSON.parse(xhr.responseText).error);
        } catch {
          setError('No se pudo subir el video');
        }
      }
    };
    xhr.onerror = () => {
      setProgreso(null);
      setError('Se cortó la conexión. Vuelve a intentarlo.');
    };
    xhr.send(f);
  };

  return (
    <li className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-[15px] font-medium text-ink">
          {!t.abierto && <Lock size={14} className="shrink-0 text-ink-3" />}
          <span className="truncate">{t.nombre}</span>
        </p>
        <p className="truncate text-[12.5px] text-ink-3">
          {t.videoUrl ? (
            <span className="inline-flex items-center gap-1 text-ok">
              <CheckCircle2 size={13} /> {t.videoTitulo}
            </span>
          ) : (
            t.unidad
          )}
        </p>
        {error && <p className="text-[12.5px] font-medium text-bad">{error}</p>}
      </div>
      <div className="flex items-center gap-2">
        {progreso !== null ? (
          <div className="flex w-40 items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
              <div className="h-full bg-[var(--anillo)] transition-[width]" style={{width: `${progreso}%`}} />
            </div>
            <span className="num text-[12.5px] font-semibold text-ink-2">{progreso}%</span>
          </div>
        ) : (
          <>
            <input ref={input} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={(e) => e.target.files?.[0] && subir(e.target.files[0])} />
            <button onClick={() => input.current?.click()} className="inline-flex h-9 items-center gap-1.5 rounded-ctl border border-line px-3 text-[13.5px] font-semibold text-ink hover:bg-surface-2">
              <Upload size={15} /> {t.videoUrl ? 'Cambiar' : 'Subir video'}
            </button>
            {t.videoUrl && (
              <button
                onClick={() => iniciar(() => accionQuitarVideo(t.id))}
                disabled={quitando}
                className="grid h-9 w-9 place-items-center rounded-ctl text-ink-3 hover:bg-bad-soft hover:text-bad"
                aria-label="Quitar video"
              >
                <Trash2 size={15} />
              </button>
            )}
          </>
        )}
      </div>
    </li>
  );
}
