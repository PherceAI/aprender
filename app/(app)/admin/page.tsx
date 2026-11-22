import type {Metadata} from 'next';
import Link from 'next/link';
import {MessageSquareText, Wallet} from 'lucide-react';
import {accionCambiarPlan} from '@/app/acciones';
import {requerirAdmin} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {docentesConAvance, resumenAdmin, temasYVideos} from '@/lib/admin';
import {claveRevision, todosLosComentarios} from '@/lib/revision';
import {pagosParaRevisar} from '@/lib/pagos';
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
  const [r, docentes, temas, pendientes] = await Promise.all([resumenAdmin(db), docentesConAvance(db), temasYVideos(db), todosLosComentarios(db, true)]);
  const pagosPendientes = (await pagosParaRevisar(db)).filter((p) => p.estado === 'pendiente').length;
  const verRevision = Boolean(claveRevision()) || pendientes.length > 0;
  const cifras = [
    {v: r.docentes, t: 'docentes'},
    {v: r.activos7, t: 'activos esta semana'},
    {v: r.diagnosticos, t: 'diagnósticos hechos'},
    {v: r.simulacros, t: 'simulacros rendidos'},
  ];

  return (
    <div className="rise flex flex-col gap-6">
      <div>
        <h1 className="text-[30px] font-medium tracking-[-0.04em] text-ink sm:text-[36px]">Panel</h1>
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

      <Link href="/admin/pagos" className={`card flex items-center gap-4 p-4 hover:bg-surface-2 sm:p-5 ${pagosPendientes ? 'border-2 border-accent' : ''}`}>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
          <Wallet size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[16px] font-semibold text-ink">Pagos</span>
          <span className="text-[13.5px] text-ink-2">
            <span className="num">{pagosPendientes}</span> por revisar · tus cuentas y el QR de Deuna
          </span>
        </span>
      </Link>

      {verRevision && (
        <Link href="/admin/revision" className="card flex items-center gap-4 p-4 hover:bg-surface-2 sm:p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
            <MessageSquareText size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[16px] font-semibold text-ink">Comentarios de revisión</span>
            <span className="text-[13.5px] text-ink-2">
              <span className="num">{pendientes.length}</span> pendientes · el enlace para el revisor está aquí
            </span>
          </span>
        </Link>
      )}

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="card overflow-hidden">
          <h2 className="px-5 pt-5 text-[17px] font-semibold text-ink">Docentes</h2>
          {docentes.length === 0 ? (
            <p className="px-5 py-4 text-[14.5px] text-ink-3">Aún no hay docentes. Crea la primera cuenta a la derecha.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line border-t border-line">
              {docentes.map((d) => (
                <li key={d.id} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 px-5 py-3.5 sm:grid-cols-[1fr_110px_90px_150px] sm:items-center">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{d.nombre}</p>
                    <p className="truncate text-[12.5px] text-ink-3">{d.correo}</p>
                  </div>
                  <p className="num text-right text-[14px] text-ink sm:text-left">{d.diagnosticoHecho ? `${d.preparacion} %` : <span className="text-ink-3">Sin diagnóstico</span>}</p>
                  <p className="num text-[13px] text-ink-3 sm:text-[14px] sm:text-ink">{d.lecciones} lecciones</p>
                  <p className="text-right text-[13px] text-ink-3 sm:text-left">{fecha(d.ultimoIngreso)}</p>
                  <form action={accionCambiarPlan.bind(null, d.id, d.plan === 'gratis' ? 'completo' : 'gratis')} className="col-span-full flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${d.plan === 'gratis' ? 'bg-surface-2 text-ink-2' : 'bg-ok-soft text-ok'}`}>
                      {d.plan === 'gratis' ? 'Cuenta gratis' : 'Acceso completo'}
                    </span>
                    <button className="text-[12.5px] font-semibold text-accent-ink hover:underline">
                      {d.plan === 'gratis' ? 'Activar acceso completo' : 'Pasar a gratis'}
                    </button>
                  </form>
                </li>
              ))}
            </ul>
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
