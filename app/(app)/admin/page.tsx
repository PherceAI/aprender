import type {Metadata} from 'next';
import {requerirAdmin} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {docentesConAvance, resumenAdmin, temasYVideos} from '@/lib/admin';
import {CrearDocente} from './crear-docente';
import {Videos} from './videos';

export const metadata: Metadata = {title: 'Panel'};

function fecha(d: Date | null) {
  if (!d) return 'Nunca';
  return new Intl.DateTimeFormat('es-EC', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Guayaquil'}).format(d);
}

export default async function Admin() {
  await requerirAdmin();
  const db = await getDb();
  const [r, docentes, temas] = await Promise.all([resumenAdmin(db), docentesConAvance(db), temasYVideos(db)]);
  const cifras = [
    {v: r.docentes, t: 'docentes'},
    {v: r.activos7, t: 'activos esta semana'},
    {v: r.diagnosticos, t: 'diagnósticos hechos'},
    {v: r.simulacros, t: 'simulacros rendidos'},
  ];

  return (
    <div className="rise flex flex-col gap-6">
      <div>
        <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-ink sm:text-[36px]">Panel</h1>
        <p className="mt-1.5 text-[15.5px] text-ink-2">Cómo van los docentes, qué temas cuestan más, cuentas y videos.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cifras.map((c) => (
          <div key={c.t} className="card p-4 sm:p-5">
            <p className="num text-[30px] font-semibold tracking-[-0.03em] text-ink">{c.v}</p>
            <p className="text-[13.5px] text-ink-3">{c.t}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="card overflow-hidden">
          <h2 className="px-5 pt-5 text-[17px] font-semibold text-ink">Docentes</h2>
          {docentes.length === 0 ? (
            <p className="px-5 py-4 text-[14.5px] text-ink-3">Aún no hay docentes. Crea la primera cuenta a la derecha.</p>
          ) : (
            <div className="relative mt-3 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-[14px]">
                <thead className="bg-surface-2 text-[12.5px] font-semibold text-ink-3">
                  <tr>
                    <th className="px-5 py-2.5">Docente</th>
                    <th className="px-3 py-2.5">Preparación</th>
                    <th className="px-3 py-2.5">Lecciones</th>
                    <th className="px-3 py-2.5">Último ingreso</th>
                  </tr>
                </thead>
                <tbody>
                  {docentes.map((d) => (
                    <tr key={d.id} className="border-t border-line">
                      <td className="px-5 py-3">
                        <p className="font-semibold text-ink">{d.nombre}</p>
                        <p className="text-[12.5px] text-ink-3">{d.correo}</p>
                      </td>
                      <td className="num px-3 py-3 text-ink">{d.diagnosticoHecho ? `${d.preparacion} %` : <span className="text-ink-3">Sin diagnóstico</span>}</td>
                      <td className="num px-3 py-3 text-ink">{d.lecciones}</td>
                      <td className="px-3 py-3 text-ink-2">{fecha(d.ultimoIngreso)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="flex flex-col gap-6">
          <section className="card p-5">
            <h2 className="text-[17px] font-semibold text-ink">Crear cuenta de docente</h2>
            <CrearDocente />
          </section>
          <section className="card p-5">
            <h2 className="text-[17px] font-semibold text-ink">Temas que más se fallan</h2>
            {r.masFallados.length === 0 ? (
              <p className="mt-2 text-[14px] text-ink-3">Aparecen cuando los docentes empiecen a responder.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {r.masFallados.map((t) => (
                  <li key={t.temaId} className="flex items-center justify-between gap-3 text-[14px]">
                    <span className="min-w-0 truncate text-ink">{t.tema}</span>
                    <span className="num shrink-0 font-semibold text-bad">{t.error} % mal</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <section className="card p-5 sm:p-6">
        <h2 className="text-[17px] font-semibold text-ink">Videos de los temas</h2>
        <p className="mt-1 text-[14px] text-ink-3">Sube el video de cada tema (MP4 de NotebookLM, hasta 600 MB). Los docentes lo ven al abrir el tema.</p>
        <Videos temas={temas.map((t) => ({...t, videoUrl: t.videoUrl ?? null, videoTitulo: t.videoTitulo ?? null}))} />
      </section>
    </div>
  );
}
