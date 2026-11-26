'use client';

import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {Download, EllipsisVertical, Share, X} from 'lucide-react';

// «Instalar app»: si el navegador ofrece su aviso (Android, computadora), lo usa; si no, explica cómo hacerlo
// a mano (menú ⋮ en Android, «Compartir» en iPhone). Si ya está abierta como app instalada, no se muestra.
// El aviso se guarda desde el arranque (app/layout.tsx), porque a veces llega antes de que cargue la página.

type Aviso = Event & {prompt: () => Promise<void>; userChoice: Promise<{outcome: string}>};
type Ventana = Window & {__avisoInstalar?: Aviso | null};

export function BotonInstalar({mini = false, compacto = false, fila = false}: {mini?: boolean; compacto?: boolean; fila?: boolean}) {
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [esIos, setEsIos] = useState(false);
  const [esMovil, setEsMovil] = useState(false);
  const [instalada, setInstalada] = useState(true);
  const [ayuda, setAyuda] = useState(false);

  useEffect(() => {
    const w = window as Ventana;
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as {standalone?: boolean}).standalone === true;
    setInstalada(standalone);
    setEsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    setEsMovil(/android|iphone|ipad|ipod/i.test(navigator.userAgent));
    setAviso(w.__avisoInstalar ?? null);
    const tomar = () => setAviso(w.__avisoInstalar ?? null);
    const f = (e: Event) => {
      e.preventDefault();
      w.__avisoInstalar = e as Aviso;
      setAviso(e as Aviso);
    };
    const listo = () => setInstalada(true);
    window.addEventListener('aviso-instalar', tomar);
    window.addEventListener('beforeinstallprompt', f);
    window.addEventListener('appinstalled', listo);
    return () => {
      window.removeEventListener('aviso-instalar', tomar);
      window.removeEventListener('beforeinstallprompt', f);
      window.removeEventListener('appinstalled', listo);
    };
  }, []);

  // En el teléfono siempre se ofrece (con instrucciones si el navegador no trae su aviso); en la computadora, solo con aviso.
  if (instalada || (!aviso && !esMovil)) return null;

  const instalar = async () => {
    if (aviso) {
      await aviso.prompt();
      const r = await aviso.userChoice;
      if (r.outcome === 'accepted') setInstalada(true);
      (window as Ventana).__avisoInstalar = null;
      setAviso(null);
    } else setAyuda(true);
  };

  const clase = fila
    ? 'flex h-14 w-full items-center gap-3.5 rounded-[14px] px-3 text-left text-[15.5px] font-medium text-ink hover:bg-surface-2'
    : compacto
      ? 'grid h-10 w-10 place-items-center rounded-ctl text-accent-ink hover:bg-accent-soft'
      : mini
        ? 'mx-auto grid h-11 w-11 place-items-center rounded-[13px] border border-line text-accent-ink hover:bg-accent-soft'
        : 'flex h-11 items-center justify-center gap-2 rounded-[13px] border border-line text-[14px] font-semibold text-ink hover:bg-surface-2';

  return (
    <>
      <button type="button" onClick={instalar} title="Instalar la app" className={clase}>
        <Download size={fila ? 20 : 18} className="text-accent" />
        {(fila || (!mini && !compacto)) && 'Instalar la app'}
      </button>
      {ayuda &&
        createPortal(
        <div className="fixed inset-0 z-[70] grid place-items-end bg-black/40 sm:place-items-center" role="dialog" aria-label="Cómo instalar la app" onClick={() => setAyuda(false)}>
          <div className="m-3 mb-[calc(0.75rem+env(safe-area-inset-bottom))] w-full max-w-[420px] rounded-[24px] bg-surface p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="text-[18px] font-semibold text-ink">Instala Pragma en tu {esIos ? 'iPhone' : 'teléfono'}</p>
              <button type="button" onClick={() => setAyuda(false)} aria-label="Cerrar" className="grid h-9 w-9 place-items-center rounded-full text-ink-3 hover:bg-surface-2">
                <X size={18} />
              </button>
            </div>
            <ol className="mt-4 flex flex-col gap-3 text-[15px] text-ink">
              <li className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft font-bold text-accent-ink">1</span>
                {esIos ? (
                  <span>
                    Toca <Share size={17} className="inline text-accent" /> «Compartir» en Safari.
                  </span>
                ) : (
                  <span>
                    Toca el menú <EllipsisVertical size={17} className="inline text-accent" /> de Chrome, arriba a la derecha.
                  </span>
                )}
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft font-bold text-accent-ink">2</span>
                {esIos ? 'Elige «Agregar a inicio».' : 'Elige «Instalar aplicación» o «Agregar a pantalla de inicio».'}
              </li>
            </ol>
            {!esIos && (
              <p className="mt-4 text-[13.5px] leading-relaxed text-ink-2">
                Si ya tenías Pragma instalada con la dirección anterior (aprender…), borra ese ícono e instálala de nuevo desde aquí.
              </p>
            )}
          </div>
        </div>,
          document.body
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
