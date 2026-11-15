'use client';

import {Moon, Sun} from 'lucide-react';
import {useEffect, useState} from 'react';

/** Interruptor de modo claro / oscuro. Guarda la elección en el teléfono. */
export function TemaToggle({compacto = false}: {compacto?: boolean}) {
  const [tema, setTema] = useState<'claro' | 'oscuro' | null>(null);
  useEffect(() => {
    setTema(document.documentElement.dataset.tema === 'oscuro' ? 'oscuro' : 'claro');
  }, []);
  const cambiar = () => {
    const nuevo = tema === 'oscuro' ? 'claro' : 'oscuro';
    document.documentElement.dataset.tema = nuevo;
    try {
      localStorage.setItem('tema', nuevo);
    } catch {}
    setTema(nuevo);
  };
  const etiqueta = tema === 'oscuro' ? 'Modo claro' : 'Modo oscuro';
  return (
    <button
      type="button"
      onClick={cambiar}
      aria-label={etiqueta}
      title={etiqueta}
      className={`inline-flex items-center gap-2 rounded-ctl text-[14px] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink ${compacto ? 'h-10 w-10 justify-center' : 'h-10 px-3'}`}
    >
      {tema === 'oscuro' ? <Sun size={18} /> : <Moon size={18} />}
      {!compacto && <span>{tema === null ? 'Tema' : etiqueta}</span>}
    </button>
  );
}
