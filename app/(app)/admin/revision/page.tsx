import type {Metadata} from 'next';
import Link from 'next/link';
import {headers} from 'next/headers';
import {ArrowLeft, Check, Monitor, RotateCcw, Smartphone} from 'lucide-react';
import {accionResolverComentario} from '@/app/acciones';
import {requerirAdmin} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {claveRevision, todosLosComentarios, type Comentario} from '@/lib/revision';

export const metadata: Metadata = {title: 'Comentarios de revisión'};

// Lo que el revisor fue comentando pantalla por pantalla, para mejorar antes del lanzamiento.

const TIPO: Record<string, {texto: string; clase: string}> = {
  mejorar: {texto: 'Mejorar', clase: 'bg-accent-soft text-accent-ink'},
  quitar: {texto: 'Quitar', clase: 'bg-bad-soft text-bad'},
  agregar: {texto: 'Agregar', clase: 'bg-wip-soft text-wip'},
  error: {texto: 'Hay un error', clase: 'bg-bad-soft text-bad'},
  gusta: {texto: 'Me gusta', clase: 'bg-ok-soft text-ok'},
};

function fecha(d: Date) {
  return new Intl.DateTimeFormat('es-EC', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Guayaquil'}).format(d);
}

export default async function Revision() {
  await requerirAdmin();
  const clave = claveRevision();
  const h = await headers();
  const origen = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('x-forwarded-host') ?? h.get('host')}`;
  const lista = await todosLosComentarios(await getDb());
  const pendientes = lista.filter((c) => !c.resuelto).length;

  const porRuta = new Map<string, Comentario[]>();
  for (const c of lista) porRuta.set(c.ruta, [...(porRuta.get(c.ruta) ?? []), c]);

  return (
    <div className="rise flex flex-col gap-5">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-3 hover:text-ink">
        <ArrowLeft size={16} /> Panel
      </Link>
      <div>
        <h1 className="text-[30px] font-semibold tracking-[-0.04em] text-ink sm:text-[34px]">Comentarios de revisión</h1>
        <p className="mt-1.5 text-[15.5px] text-ink-2">
          <span className="num">{pendientes}</span> pendientes de <span className="num">{lista.length}</span>. Lo que el revisor comentó en cada pantalla.
        </p>
      </div>

      <section className="card p-5">
        <h2 className="text-[16px] font-semibold text-ink">Enlace para el revisor</h2>
        {clave ? (
          <>
            <p className="mt-1 text-[14px] text-ink-2">Envíaselo. Al abrirlo, en su navegador aparece el botón «Comentar» en todas las pantallas, desde la portada hasta el final.</p>
            <p className="mt-3 rounded-[10px] bg-surface-2 px-3 py-2.5 font-mono text-[13px] break-all text-ink select-all">
              {origen}/revision?clave={clave}
            </p>
            <p className="mt-2 text-[13px] text-ink-3">Para apagar el modo revisión en toda la plataforma, borra la variable REVISION_CLAVE en Coolify y vuelve a desplegar.</p>
          </>
        ) : (
          <p className="mt-1 text-[14px] text-ink-2">El modo revisión está apagado. Para encenderlo, crea la variable REVISION_CLAVE (8 caracteres o más) en Coolify y vuelve a desplegar.</p>
        )}
      </section>

      {lista.length === 0 ? (
        <p className="card p-6 text-center text-[15px] text-ink-2">Todavía no hay comentarios.</p>
      ) : (
        [...porRuta.entries()].map(([ruta, cs]) => (
          <section key={ruta} className="card p-5">
            <h2 className="font-mono text-[14px] font-semibold break-all text-ink">{ruta}</h2>
            <ul className="mt-3 flex flex-col gap-2.5">
              {cs.map((c) => {
                const t = TIPO[c.tipo] ?? {texto: c.tipo, clase: 'bg-surface-2 text-ink-2'};
                return (
                  <li key={c.id} className={`rounded-[14px] border border-line p-4 ${c.resuelto ? 'opacity-55' : ''}`}>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-ink-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[12.5px] font-semibold ${t.clase}`}>{t.texto}</span>
                      <span className="font-medium text-ink-2">{c.autor}</span>
                      <span>{fecha(c.creado)}</span>
                      <span className="inline-flex items-center gap-1">
                        {c.ancho && c.ancho < 768 ? <Smartphone size={14} /> : <Monitor size={14} />}
                        {c.ancho && c.ancho < 768 ? 'Teléfono' : 'Computadora'}
                      </span>
                    </div>
                    <p className="mt-2 text-[15.5px] leading-relaxed text-ink">{c.texto}</p>
                    <p className="mt-1 text-[13px] text-ink-3">{c.ancla ? `En: «${c.muestra || 'parte de la pantalla'}»` : 'Sobre la pantalla entera'}</p>
                    <form action={accionResolverComentario.bind(null, c.id, !c.resuelto)} className="mt-3">
                      <button type="submit" className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3.5 text-[13.5px] font-semibold text-ink hover:bg-surface-2">
                        {c.resuelto ? <RotateCcw size={14} /> : <Check size={14} />}
                        {c.resuelto ? 'Volver a pendiente' : 'Marcar como resuelto'}
                      </button>
                    </form>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
