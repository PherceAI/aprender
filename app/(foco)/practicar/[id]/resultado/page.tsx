import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowRight, Check, PartyPopper, RotateCcw, TrendingUp, X} from 'lucide-react';
import {requerirUsuario} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {ErrorAcademia, terminarIntento} from '@/lib/intentos';
import {siguientePaso} from '@/lib/ruta';
import {TITULO_INTENTO} from '@/lib/vista';
import {destinoResultado} from '@/lib/resultado';
import {Anillo, Marca, btn} from '@/components/ui';
import {BotonIniciar} from '@/components/boton-iniciar';
import {RevisionRespuestas} from '@/components/revision-respuestas';
import {PuntajeIneval} from '@/components/puntaje-ineval';
import {SaltarBoton} from './saltar';

export const metadata: Metadata = {title: 'Resultado'};

// Resultado de una práctica, prueba, repaso o simulacro: cuánto acertó, cuánto subió y qué hace ahora.


export default async function Resultado({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const u = await requerirUsuario();
  const db = await getDb();
  let r;
  try {
    r = await terminarIntento(db, u.id, id);
  } catch (e) {
    if (e instanceof ErrorAcademia) notFound();
    throw e;
  }
  if (r.tipo === 'diagnostico') notFound();
  const sig = await siguientePaso(db, u.id);

  const titulo =
    r.tipo === 'prueba-tema'
      ? r.dominado
        ? '¡Tema dominado!'
        : 'Ya casi lo tienes'
      : r.tipo === 'diagnostico-tema'
        ? r.puedeSaltar
          ? 'Este tema ya lo sabes'
          : 'Ahora sabes por dónde empezar'
        : r.tipo === 'simulacro'
          ? 'Simulacro terminado'
          : r.puntaje >= 80
            ? '¡Muy bien!'
            : 'Buen avance';
  const texto =
    r.tipo === 'prueba-tema'
      ? r.dominado
        ? 'Sacaste 80 % o más: el tema queda dominado. Lo que fallaste vuelve en tu repaso.'
        : 'Necesitas 80 % para dominarlo. Revisa abajo lo que fallaste y vuelve a intentarlo: la próxima prueba empieza por esas preguntas.'
      : r.tipo === 'diagnostico-tema'
        ? r.puedeSaltar
          ? 'Con 80 % o más puedes marcarlo como sabido y seguir con otro tema.'
          : 'Las lecciones de este tema son para ti. Empieza por la primera.'
        : r.tipo === 'simulacro'
          ? 'Revisa cada pregunta abajo. Las que fallaste vuelven en tu repaso.'
          : r.tipo === 'practica'
            ? 'La práctica no cambia tu nivel: lo cambia la prueba del tema. Lo que fallaste vuelve en tu repaso, con su explicación.'
            : 'Lo que fallaste vuelve en tu repaso, para que se quede.';

  // Avance: solo lo que cambió (nada de «+0 %»).
  const temasQueCambiaron = r.avance?.temas.filter((t) => t.antes !== t.despues) ?? [];
  const difPrep = r.avance ? r.avance.preparacionDespues - r.avance.preparacionAntes : 0;
  const hayAvance = temasQueCambiaron.length > 0 || difPrep !== 0;

  const ref = r.referencia;
  const volverLeccion = r.tipo === 'practica' && ref ? `/leccion/${ref}` : null;
  const {href: destino, texto: textoDestino} = destinoResultado(sig, r.tipo, ref);

  return (
    <div className="mx-auto max-w-[820px] px-4 py-6 sm:px-6 lg:py-10">
      <Marca />
      <div className="rise mt-8 flex flex-col items-center text-center">
        {r.dominado && (
          <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-accent text-on-accent">
            <PartyPopper size={22} />
          </span>
        )}
        <Anillo valor={r.puntaje} tam={150} grosor={13} etiqueta="Resultado" />
        <p className="mt-2 text-[14px] font-medium text-ink-2">
          {TITULO_INTENTO[r.tipo]} · {r.aciertos} de {r.total} correctas
        </p>
        <h1 className="mt-4 text-[30px] font-semibold tracking-[-0.04em] text-ink sm:text-[36px]">{titulo}</h1>
        <p className="mt-2 max-w-[54ch] text-[16px] leading-relaxed text-ink-2">{texto}</p>
      </div>

      {r.tipo === 'simulacro' && <PuntajeIneval porcentaje={r.puntaje} titulo="Con este resultado, tu puntaje en el Ineval sería" className="mt-8" />}

      {hayAvance && r.avance && (
        <section className="card mt-8 p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-[17px] font-semibold text-ink">
            <TrendingUp size={19} className="text-accent" /> Tu avance
          </h2>
          <ul className="mt-4 flex flex-col gap-4">
            {temasQueCambiaron.map((t) => (
              <FilaAvance key={t.id} nombre={`Tu nivel en ${t.nombre}`} antes={t.antes} despues={t.despues} />
            ))}
            {difPrep !== 0 && <FilaAvance nombre="Tu preparación para el examen" antes={r.avance.preparacionAntes} despues={r.avance.preparacionDespues} />}
          </ul>
        </section>
      )}

      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href={destino} className={`${btn.primary} w-full rounded-full px-7 sm:w-auto`}>
          {textoDestino} <ArrowRight size={18} />
        </Link>
        {r.tipo === 'diagnostico-tema' && r.puedeSaltar && ref && <SaltarBoton temaId={ref} />}
        {r.tipo === 'prueba-tema' && !r.dominado && ref && (
          <BotonIniciar tipo="prueba-tema" referencia={ref} texto="Intentar de nuevo" variante="secondary" className="w-full rounded-full sm:w-auto" />
        )}
        {volverLeccion && (
          <Link href={volverLeccion} className={`${btn.secondary} w-full rounded-full sm:w-auto`}>
            <RotateCcw size={17} /> Volver a la lección
          </Link>
        )}
      </div>

      {r.tipo === 'simulacro' && r.porUnidad.length > 0 && (
        <section className="card mt-10 p-5 sm:p-6">
          <h2 className="text-[17px] font-semibold text-ink">Por unidad</h2>
          <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
            {r.porUnidad.map((g) => (
              <li key={g.id} className="flex items-center justify-between gap-3 rounded-ctl bg-surface-2 px-3.5 py-2.5 text-[14.5px]">
                <span className="min-w-0 truncate text-ink">{g.nombre}</span>
                <span className="num shrink-0 font-semibold text-ink-2">
                  {g.aciertos}/{g.total}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {r.correccion && <RevisionRespuestas correccion={r.correccion} />}
    </div>
  );
}

function FilaAvance({nombre, antes, despues}: {nombre: string; antes: number; despues: number}) {
  const dif = despues - antes;
  return (
    <li>
      <div className="flex items-baseline justify-between gap-3">
        <span className="min-w-0 truncate text-[15px] font-medium text-ink">{nombre}</span>
        <span className="num shrink-0 text-[14.5px] text-ink-2">
          {antes} % → <strong className="text-ink">{despues} %</strong>{' '}
          <span className={`ml-1 rounded-full px-2 py-0.5 text-[12px] font-bold ${dif > 0 ? 'bg-ok-soft text-ok' : 'bg-bad-soft text-bad'}`}>
            {dif > 0 ? '+' : ''}
            {dif}
          </span>
        </span>
      </div>
      <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-line-2" role="img" aria-label={`${nombre}: de ${antes} a ${despues} %`}>
        <div className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{width: `${Math.max(antes, despues)}%`}} />
        <div className="absolute inset-y-0 left-0 rounded-full bg-dom-2" style={{width: `${Math.min(antes, despues)}%`}} />
      </div>
    </li>
  );
}
