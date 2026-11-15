import type {Metadata} from 'next';
import Link from 'next/link';
import {ChevronRight, Lock} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {mapaCurso} from '@/lib/curso';
import {Anillo, EtiquetaEstado, colorDominio} from '@/components/ui';

export const metadata: Metadata = {title: 'Curso'};

export default async function Curso() {
  const u = await requerirDocente();
  const mapa = await mapaCurso(await getDb(), u.id);
  return (
    <div className="rise">
      <h1 className="text-[30px] font-medium tracking-[-0.04em] text-ink sm:text-[36px]">Tu curso</h1>
      <p className="mt-1.5 text-[15.5px] text-ink-2">Ciencias Naturales · EGB Superior · Dimensión 1 de la evaluación</p>

      <div className="mt-8 flex flex-col gap-10">
        {mapa.bloques.map((b) => (
          <section key={b.id}>
            <div className="mb-4 flex items-center gap-4">
              <Anillo valor={b.nivel} tam={56} grosor={6} etiqueta={b.nombre} />
              <div>
                <h2 className="text-[21px] font-semibold tracking-[-0.025em] text-ink">{b.nombre}</h2>
                <p className="text-[13.5px] text-ink-3">{b.unidades.length} unidades · {b.unidades.reduce((n, x) => n + x.temas.length, 0)} temas</p>
              </div>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
              {b.unidades.map((un) => (
                <div key={un.id} className="card p-4 sm:p-5">
                  <div className="mb-2 flex items-center justify-between gap-3 px-1">
                    <h3 className="text-[16px] font-semibold text-ink">{un.nombre}</h3>
                    <span className="num shrink-0 text-[13px] font-semibold text-ink-3">{un.nivel} %</span>
                  </div>
                  <ul className="flex flex-col">
                    {un.temas.map((t) => (
                      <li key={t.id}>
                        <Link href={`/curso/${t.id}`} className="flex items-center gap-3 rounded-ctl px-1.5 py-2.5 hover:bg-surface-2">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[9px]" style={{background: colorDominio(t.nivel, t.estado)}}>
                            {!t.abierto && <Lock size={13} className="text-ink-3" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[15px] font-medium text-ink">{t.nombre}</span>
                            <span className="block text-[12.5px] text-ink-3">
                              {t.abierto ? `${t.completadas} de ${t.lecciones} lecciones` : `${t.lecciones} lecciones · Próximamente`}
                            </span>
                          </span>
                          {t.abierto && t.estado !== 'sin-empezar' && <EtiquetaEstado estado={t.estado} />}
                          <ChevronRight size={17} className="shrink-0 text-ink-3" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
