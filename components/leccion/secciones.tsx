import {Lightbulb, School} from 'lucide-react';
import type {Seccion} from '@/contenido/tipos';
import {Explorar} from '@/components/laboratorio/explorar';

// Dibuja las piezas de una lección. Cada tipo tiene su forma; nada de muros de texto.

const RETO: Record<string, string[]> = {'celula-vegetal': ['pared', 'cloroplasto', 'vacuola']};

export function Secciones({secciones}: {secciones: Seccion[]}) {
  return (
    <div className="flex flex-col gap-6">
      {secciones.map((s, i) => {
        switch (s.tipo) {
          case 'texto':
            return (
              <div key={i}>
                {s.titulo && <h2 className="mb-2 text-[19px] font-semibold text-ink">{s.titulo}</h2>}
                <p className="max-w-[68ch] text-[16.5px] leading-[1.7] text-ink">{s.texto}</p>
              </div>
            );
          case 'puntos':
            return (
              <div key={i}>
                {s.titulo && <h2 className="mb-3 text-[19px] font-semibold text-ink">{s.titulo}</h2>}
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {s.puntos.map((p, j) => {
                    const [cabeza, ...resto] = p.split(': ');
                    return (
                      <li key={j} className="rounded-ctl bg-surface-2 p-3.5 text-[15px] leading-relaxed text-ink">
                        {resto.length ? (
                          <>
                            <span className="font-semibold">{cabeza}:</span> {resto.join(': ')}
                          </>
                        ) : (
                          p
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          case 'comparacion':
            return (
              <div key={i}>
                {s.titulo && <h2 className="mb-3 text-[19px] font-semibold text-ink">{s.titulo}</h2>}
                <div className="overflow-hidden rounded-[16px] border border-line">
                  <div className="grid grid-cols-[1fr_1fr_1fr] bg-surface-2 text-[13px] font-semibold text-ink-2">
                    <span className="px-3.5 py-2.5" />
                    <span className="px-3.5 py-2.5">{s.columnas[0]}</span>
                    <span className="px-3.5 py-2.5">{s.columnas[1]}</span>
                  </div>
                  {s.filas.map((f, j) => (
                    <div key={j} className="grid grid-cols-[1fr_1fr_1fr] border-t border-line text-[14.5px]">
                      <span className="px-3.5 py-2.5 font-semibold text-ink">{f.aspecto}</span>
                      <span className="px-3.5 py-2.5 text-ink-2">{f.a}</span>
                      <span className="px-3.5 py-2.5 text-ink-2">{f.b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          case 'laboratorio':
            return (
              <div key={i} className="rounded-card border border-line bg-surface p-4 sm:p-5">
                <p className="mb-3 inline-flex h-7 items-center rounded-full bg-accent px-3 text-[13px] font-semibold text-on-accent">Laboratorio</p>
                <Explorar lab={s.lab} consigna={s.consigna} reto={RETO[s.lab]} compacto />
              </div>
            );
          case 'aula':
            return (
              <div key={i} className="flex gap-3.5 rounded-card bg-accent-soft p-4 sm:p-5">
                <School size={22} className="mt-0.5 shrink-0 text-accent-ink" />
                <div>
                  <p className="text-[14px] font-semibold text-accent-ink">En tu aula</p>
                  <p className="mt-1 text-[15.5px] leading-relaxed text-ink">{s.texto}</p>
                </div>
              </div>
            );
          case 'clave':
            return (
              <div key={i} className="flex gap-3.5 rounded-card bg-warm-soft p-4 sm:p-5">
                <Lightbulb size={22} className="mt-0.5 shrink-0 text-warm" />
                <div>
                  <p className="text-[14px] font-semibold text-warm">Para el examen</p>
                  <p className="mt-1 text-[15.5px] leading-relaxed text-ink">{s.texto}</p>
                </div>
              </div>
            );
        }
      })}
    </div>
  );
}
