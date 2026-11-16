'use client';

import {useEffect, useState} from 'react';
import {Download, Share, X} from 'lucide-react';

// «Instalar app»: en Android y computadora usa el aviso del navegador; en iPhone explica los dos toques.
// Si ya está instalada (abierta como app), no se muestra.

type Aviso = Event & {prompt: () => Promise<void>; userChoice: Promise<{outcome: string}>};

export function BotonInstalar({mini = false, compacto = false}: {mini?: boolean; compacto?: boolean}) {
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [esIos, setEsIos] = useState(false);
  const [instalada, setInstalada] = useState(true);
  const [ayuda, setAyuda] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as {standalone?: boolean}).standalone === true;
    setInstalada(standalone);
    setEsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    const f = (e: Event) => {
      e.preventDefault();
      setAviso(e as Aviso);
    };
    const listo = () => setInstalada(true);
    window.addEventListener('beforeinstallprompt', f);
    window.addEventListener('appinstalled', listo);
    return () => {
      window.removeEventListener('beforeinstallprompt', f);
      window.removeEventListener('appinstalled', listo);
    };
  }, []);

  if (instalada || (!aviso && !esIos)) return null;

  const instalar = async () => {
    if (aviso) {
      await aviso.prompt();
      const r = await aviso.userChoice;
      if (r.outcome === 'accepted') setInstalada(true);
      setAviso(null);
    } else setAyuda(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={instalar}
        title="Instalar la app"
        className={
          compacto
            ? 'grid h-10 w-10 place-items-center rounded-ctl text-accent-ink hover:bg-accent-soft'
            : mini
              ? 'mx-auto grid h-11 w-11 place-items-center rounded-[13px] border border-line text-accent-ink hover:bg-accent-soft'
              : 'flex h-11 items-center justify-center gap-2 rounded-[13px] border border-line text-[14px] font-semibold text-ink hover:bg-surface-2'
        }
      >
        <Download size={18} className="text-accent" />
        {!mini && !compacto && 'Instalar la app'}
      </button>
      {ayuda && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/30 sm:place-items-center" role="dialog" aria-label="Cómo instalar la app" onClick={() => setAyuda(false)}>
          <div className="w-full max-w-[420px] rounded-t-[24px] bg-surface p-6 sm:rounded-[24px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="text-[18px] font-semibold text-ink">Instala Pragma en tu iPhone</p>
              <button type="button" onClick={() => setAyuda(false)} aria-label="Cerrar" className="grid h-9 w-9 place-items-center rounded-full text-ink-3 hover:bg-surface-2">
                <X size={18} />
              </button>
            </div>
            <ol className="mt-4 flex flex-col gap-3 text-[15px] text-ink">
              <li className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft font-bold text-accent-ink">1</span>
                Toca <Share size={18} className="text-accent" /> «Compartir» abajo en Safari.
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft font-bold text-accent-ink">2</span>
                Elige «Agregar a inicio».
              </li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
}

/** Registra el service worker (solo en producción) para que la app instalada abra rápido y avise si no hay conexión. */
export function RegistrarSW() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);
  return null;
}
