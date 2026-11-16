import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowRight, BookOpen, Repeat, Sprout, Target, Trophy} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {ErrorAcademia, terminarIntento} from '@/lib/intentos';
import {mapaCurso} from '@/lib/curso';
import {preparacion} from '@/lib/dominio';
import {rutaDe} from '@/lib/ruta';
import {Anillo, Barra, Marca, btn} from '@/components/ui';
import {LeyendaDominio, MapaDominio} from '@/components/mapa-dominio';

export const metadata: Metadata = {title: 'Tu punto de partida'};

// El informe del diagnóstico: cuánto acertó, tema por tema qué trae y qué le falta, y qué hace ahora.

export default async function ResultadoDiagnostico({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const u = await requerirDocente();
  const db = await getDb();
  let res;
  try {
    res = await terminarIntento(db, u.id, id);
  } catch (e) {
    if (e instanceof ErrorAcademia) notFound();
    throw e;
  }
  if (res.tipo !== 'diagnostico') notFound();
  const [mapa, prep, ruta] = await Promise.all([mapaCurso(db, u.id), preparacion(db, u.id, u.especialidadId!), rutaDe(db, u.id)]);
  const unidades = mapa.bloques.flatMap((b) => b.unidades);

  // Aciertos por prueba (Conocimientos generales y de la especialidad).
  const porPrueba = mapa.bloques.map((b) => {
    const ids = new Set(b.unidades.map((x) => x.id));
    const partes = res.porUnidad.filter((x) => ids.has(x.id));
    const aciertos = partes.reduce((s, x) => s + x.aciertos, 0);
    const total = partes.reduce((s, x) => s + x.total, 0);
    return {id: b.id, nombre: b.nombre, aciertos, total};
  });
  const fuertes = res.porTema.filter((t) => t.total > 0 && t.aciertos === t.total);
  const reforzar = res.porTema.filter((t) => t.aciertos === 0);
  const primeros = ruta.filter((r) => r.abierto).concat(ruta.filter((r) => !r.abierto)).slice(0, 3);
  const fallas = res.total - res.aciertos;

  return (
    <div className="mx-auto max-w-[1080px] px-4 py-6 sm:px-6 lg:py-10">
      <Marca />

      {/* Resumen */}
      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] items-center gap-6 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="rise">
          <h1 className="text-[32px] leading-[1.1] font-semibold tracking-[-0.04em] text-ink sm:text-[42px]">
            ¡Listo, {u.nombre.split(' ')[0]}! Este es tu <span className="text-accent">punto de partida</span>.
          </h1>
          <p className="mt-3 text-[18px] text-ink-2">
            Respondiste bien <strong className="text-ink">{res.aciertos} de {res.total}</strong> preguntas.
          </p>
        </div>
        <div className="card flex items-center gap-4 p-4">
          <Anillo valor={prep} tam={104} grosor={10} etiqueta="Preparación" />
          <div>
            <p className="text-[13px] font-semibold text-ink-3">Tu preparación hoy</p>
            <p className="mt-1 max-w-[20ch] text-[14px] leading-snug text-ink-2">Sube cada vez que dominas un tema.</p>
          </div>
        </div>
      </div>

      {/* Por prueba */}
      <section className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
        {porPrueba.map((p) => {
          const pct = p.total ? Math.round((p.aciertos / p.total) * 100) : 0;
          return (
            <div key={p.id} className="card p-5">
              <p className="text-[14px] font-semibold text-ink-2">{p.nombre}</p>
              <p className="mt-2 text-[28px] leading-none font-semibold tracking-[-0.03em] text-ink">
                {p.aciertos}
                <span className="text-[16px] font-medium text-ink-3"> / {p.total} correctas</span>
              </p>
              <Barra valor={pct} className="mt-3" />
            </div>
          );
        })}
      </section>

      {/* Mapa tema por tema */}
      <section className="card mt-6 p-5 sm:p-7">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-ink">Tus 31 temas</h2>
          <LeyendaDominio />
        </div>
        <p className="mb-5 text-[14.5px] text-ink-2">Cada cuadro es un tema de la ficha, agrupado por unidad. Mientras más naranja, más lo dominas.</p>
        <MapaDominio unidades={unidades} revelar sinCandados />
      </section>

      {/* Fortalezas y por reforzar */}
      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
        <section className="card p-5 sm:p-6">
          <h2 className="flex items-center gap-2.5 text-[17px] font-semibold text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-ctl bg-ok-soft text-ok">
              <Trophy size={18} />
            </span>
            Lo que ya traes
          </h2>
          {fuertes.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {fuertes.map((t) => (
                <li key={t.id} className="rounded-full bg-ok-soft px-3 py-1.5 text-[13.5px] font-medium text-ink">
                  {t.nombre}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-[15px] leading-relaxed text-ink-2">Todavía ningún tema firme, y está bien: para eso es la ruta.</p>
          )}
        </section>
        <section className="card p-5 sm:p-6">
          <h2 className="flex items-center gap-2.5 text-[17px] font-semibold text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-ctl bg-accent-soft text-accent">
              <Target size={18} />
            </span>
            Por reforzar
          </h2>
          {reforzar.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {reforzar.map((t) => (
                <li key={t.id} className="rounded-full bg-accent-soft px-3 py-1.5 text-[13.5px] font-medium text-ink">
                  {t.nombre}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-[15px] leading-relaxed text-ink-2">Ningún tema en cero. ¡Buen comienzo!</p>
          )}
        </section>
      </div>

      {/* Qué sigue */}
      <section className="card mt-6 p-5 sm:p-7">
        <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-ink">Qué sigue ahora</h2>
        <ol className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-3">
          <li className="flex gap-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-white">
              <Sprout size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-[15.5px] font-semibold text-ink">1. Sigue tu ruta</p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-ink-2">
                Empiezas por: {primeros.map((t) => t.nombre).join(', ')}.
              </p>
            </div>
          </li>
          <li className="flex gap-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-white">
              <BookOpen size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-[15.5px] font-semibold text-ink">2. Aprende y pruébate</p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-ink-2">Cada tema tiene lecciones cortas y una prueba de 10 preguntas. Con 80 % queda dominado.</p>
            </div>
          </li>
          <li className="flex gap-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-white">
              <Repeat size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-[15.5px] font-semibold text-ink">3. Repasa lo que fallaste</p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-ink-2">
                {fallas > 0 ? `Las ${fallas} preguntas que fallaste vuelven desde mañana en tu repaso, con su explicación.` : 'Lo que falles al practicar vuelve en tu repaso, con su explicación.'}
              </p>
            </div>
          </li>
        </ol>
      </section>

      <div className="mt-8 flex justify-end">
        <Link href="/inicio" className={`${btn.primary} w-full px-8 sm:w-auto`}>
          Empezar mi ruta <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
