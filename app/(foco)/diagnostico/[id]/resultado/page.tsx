import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowRight, BookOpen, CheckCheck, ListChecks, MessageCircleQuestion, Repeat, Sprout, Target, Trophy} from 'lucide-react';
import {RevisionRespuestas} from '@/components/revision-respuestas';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {ErrorAcademia, terminarIntento} from '@/lib/intentos';
import {mapaCurso} from '@/lib/curso';
import {preparacion} from '@/lib/dominio';
import {rutaDe} from '@/lib/ruta';
import {Anillo, Barra, Marca, btn} from '@/components/ui';
import {LeyendaDominio, MapaDominio} from '@/components/mapa-dominio';
import {PuntajeIneval} from '@/components/puntaje-ineval';
import {pruebasDe} from '@/lib/evaluacion';

export const metadata: Metadata = {title: 'Tu punto de partida'};

// El informe del diagnóstico: cuánto acertó, tema por tema qué trae y qué le falta, y qué hace ahora.

// Los momentos en que Pragma explica, para que el docente sepa dónde ver su retroalimentación.
const RETRO = [
  {icono: CheckCheck, titulo: 'Al responder', texto: 'En práctica, prueba del tema y repaso ves al instante si acertaste y por qué cada opción está bien o mal.'},
  {icono: ListChecks, titulo: 'Al terminar', texto: 'En el diagnóstico y los simulacros revisas cada pregunta al final, como aquí abajo.'},
  {icono: Repeat, titulo: 'Después', texto: 'Lo que fallas vuelve en tu repaso a los 1, 3, 7, 14 y 30 días, hasta que lo dominas.'},
  {icono: MessageCircleQuestion, titulo: 'Cuando tengas dudas', texto: 'El tutor con IA te explica «¿Por qué me equivoqué?» en tus propias palabras.'},
];

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
  // Puntaje estimado: el acierto de cada prueba, pesado con sus preguntas en el examen real (39 y 60).
  const examen = pruebasDe(u.especialidadId);
  const pesoTotal = examen.reduce((s, x) => s + x.preguntas, 0);
  const pctExamen = porPrueba.reduce((s, x, i) => s + (x.total ? x.aciertos / x.total : 0) * (examen[i]?.preguntas ?? 0), 0) / (pesoTotal || 1) * 100;
  const totalTemas = unidades.reduce((s, x) => s + x.temas.length, 0);

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

      <PuntajeIneval porcentaje={pctExamen} titulo="Si el examen fuera hoy, tu puntaje estimado sería" className="mt-8" />

      {/* Por prueba */}
      <section className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
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
          <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-ink">Tus {totalTemas} temas</h2>
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

      <section className="card mt-8 p-5 sm:p-6">
        <h2 className="text-[17px] font-semibold text-ink">Así te retroalimenta Pragma</h2>
        <ul className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
          {RETRO.map((r) => (
            <li key={r.titulo} className="flex gap-3 rounded-[14px] bg-surface-2 p-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                <r.icono size={17} />
              </span>
              <span className="min-w-0">
                <span className="block text-[14.5px] font-semibold text-ink">{r.titulo}</span>
                <span className="block text-[13.5px] leading-snug text-ink-2">{r.texto}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {res.correccion && <RevisionRespuestas correccion={res.correccion} falladasPrimero titulo="Revisa tus respuestas" />}

      <div className="mt-8 flex justify-end">
        <Link href="/inicio" className={`${btn.primary} w-full px-8 sm:w-auto`}>
          Empezar mi ruta <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
