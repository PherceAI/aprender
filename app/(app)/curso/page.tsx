import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowRight, BookOpen, ChevronRight, FileText} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {mapaCurso} from '@/lib/curso';
import {enlaceFicha, paginaDeTema} from '@/lib/ficha';
import {Anillo} from '@/components/ui';

export const metadata: Metadata = {title: 'Mi ruta'};

// Mi ruta: primero lo que se puede estudiar hoy; después el temario completo de la ficha, unidad por unidad,
// con el nivel de cada tema y un estado claro (sin mezclar color y candado).

function estadoDe(t: {abierto: boolean; estado: string; completadas: number}) {
  if (t.estado === 'dominado') return {texto: 'Dominado', clase: 'bg-ok-soft text-ok'};
  if (!t.abierto) return {texto: 'Se abre pronto', clase: 'bg-surface-2 text-ink-3'};
  if (t.completadas > 0) return {texto: 'En curso', clase: 'bg-accent-soft text-accent-ink'};
  return {texto: 'Disponible', clase: 'bg-accent-soft text-accent-ink'};
}

export default async function Curso() {
  const u = await requerirDocente();
  const mapa = await mapaCurso(await getDb(), u.id);
  const todos = mapa.bloques.flatMap((b) => b.unidades.flatMap((un) => un.temas.map((t) => ({...t, unidad: un.nombre}))));
  const abiertos = todos.filter((t) => t.abierto);

  return (
    <div className="rise flex flex-col gap-8">
      <div>
        <h1 className="text-[30px] font-semibold tracking-[-0.04em] text-ink sm:text-[36px]">Mi ruta</h1>
        <p className="mt-1.5 text-[16px] text-ink-2">Ciencias Naturales · EGB Superior. Los {todos.length} temas de la ficha oficial, en el orden del examen.</p>
      </div>

      {/* Disponible ahora */}
      <section>
        <h2 className="text-[20px] font-semibold tracking-[-0.025em] text-ink">Disponible ahora</h2>
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
          {abiertos.map((t) => {
            const avance = Math.round((t.completadas / Math.max(1, t.lecciones)) * 100);
            const pag = paginaDeTema(t.id);
            return (
              <div key={t.id} className="card flex flex-col gap-4 p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-accent-soft text-accent">
                    <BookOpen size={22} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[18px] font-semibold tracking-[-0.02em] text-ink">{t.nombre}</p>
                    <p className="text-[13.5px] text-ink-3">{t.unidad}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold ${estadoDe(t).clase}`}>{estadoDe(t).texto}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-line-2">
                    <div className="h-full rounded-full bg-accent" style={{width: `${avance}%`}} />
                  </div>
                  <span className="text-[13px] text-ink-2">
                    {t.completadas} de {t.lecciones} lecciones
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Link href={`/curso/${t.id}`} className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-[15px] font-semibold text-white">
                    {t.completadas > 0 ? 'Continuar' : 'Empezar'} <ArrowRight size={17} />
                  </Link>
                  {pag && (
                    <a href={enlaceFicha(pag)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-accent-ink hover:underline">
                      <FileText size={15} /> Ficha oficial, pág. {pag}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Temario completo */}
      <section>
        <h2 className="text-[20px] font-semibold tracking-[-0.025em] text-ink">Tu temario completo</h2>
        <p className="mt-1 text-[14.5px] text-ink-2">La barra es tu nivel en cada tema, según el diagnóstico y lo que vas practicando.</p>
        <div className="mt-5 flex flex-col gap-8">
          {mapa.bloques.map((b) => (
            <div key={b.id}>
              <div className="mb-3 flex items-center gap-3">
                <Anillo valor={b.nivel} tam={48} grosor={5} etiqueta={b.nombre} />
                <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">{b.nombre}</h3>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
                {b.unidades.map((un) => (
                  <div key={un.id} className="card p-2">
                    <p className="px-3 pt-2.5 pb-1.5 text-[13.5px] font-semibold text-ink-2">{un.nombre}</p>
                    <ul>
                      {un.temas.map((t) => {
                        const e = estadoDe(t);
                        return (
                          <li key={t.id}>
                            <Link href={`/curso/${t.id}`} className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 hover:bg-surface-2">
                              <div className="min-w-0 flex-1">
                                <p className={`truncate text-[15px] font-medium ${t.abierto ? 'text-ink' : 'text-ink-2'}`}>{t.nombre}</p>
                                <div className="mt-1.5 flex items-center gap-2">
                                  <div className="h-1.5 w-full max-w-[160px] overflow-hidden rounded-full bg-line-2">
                                    <div className="h-full rounded-full bg-accent" style={{width: `${t.nivel}%`}} />
                                  </div>
                                  <span className="num text-[12px] text-ink-3">{t.nivel} %</span>
                                </div>
                              </div>
                              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${e.clase}`}>{e.texto}</span>
                              <ChevronRight size={17} className="shrink-0 text-ink-3" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
