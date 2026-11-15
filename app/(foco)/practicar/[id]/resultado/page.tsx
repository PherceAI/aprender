import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowRight, Check, PartyPopper, RotateCcw, X} from 'lucide-react';
import {requerirUsuario} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {ErrorAcademia, terminarIntento} from '@/lib/intentos';
import {siguientePaso} from '@/lib/ruta';
import {TITULO_INTENTO} from '@/lib/vista';
import {Anillo, Marca, btn} from '@/components/ui';
import {BotonIniciar} from '@/components/boton-iniciar';
import {SaltarBoton} from './saltar';

export const metadata: Metadata = {title: 'Resultado'};

const LETRAS = 'ABCD';

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
        ? 'Sacaste 80 % o más. El tema queda dominado y sale de tu ruta. Lo que fallaste vuelve en tu repaso.'
        : 'Necesitas 80 % para dominarlo. Repasa lo que fallaste y vuelve a intentarlo: la próxima prueba empieza por esas preguntas.'
      : r.tipo === 'diagnostico-tema'
        ? r.puedeSaltar
          ? 'Con 80 % o más puedes marcarlo como sabido y seguir con otro tema.'
          : 'Las lecciones de este tema son para ti. Empieza por la primera.'
        : r.tipo === 'simulacro'
          ? 'Revisa cada pregunta abajo. Las que fallaste vuelven mañana en tu repaso.'
          : 'Lo que fallaste vuelve mañana en tu repaso, para que se quede.';

  const ref = r.referencia;
  const volverLeccion = r.tipo === 'practica' && ref ? `/leccion/${ref}` : null;

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
        <p className="mt-2 text-[14px] font-medium text-ink-3">
          {TITULO_INTENTO[r.tipo]} · {r.aciertos} de {r.total} correctas
        </p>
        <h1 className="mt-4 text-[30px] font-medium tracking-[-0.04em] text-ink sm:text-[36px]">{titulo}</h1>
        <p className="mt-2 max-w-[52ch] text-[16px] leading-relaxed text-ink-2">{texto}</p>
      </div>

      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        {r.tipo === 'diagnostico-tema' && r.puedeSaltar && ref && <SaltarBoton temaId={ref} />}
        {r.tipo === 'prueba-tema' && !r.dominado && ref && <BotonIniciar tipo="prueba-tema" referencia={ref} texto="Intentar de nuevo" variante="secondary" className="w-full sm:w-auto" />}
        {volverLeccion && (
          <Link href={volverLeccion} className={`${btn.secondary} w-full sm:w-auto`}>
            <RotateCcw size={17} /> Volver a la lección
          </Link>
        )}
        <Link
          href={
            sig.tipo === 'leccion' ? `/leccion/${sig.leccionId}` : sig.tipo === 'prueba-tema' ? `/curso/${sig.temaId}` : ref && r.tipo !== 'simulacro' && r.tipo !== 'repaso' ? `/curso/${r.porTema[0]?.id ?? ''}` : '/inicio'
          }
          className={`${btn.primary} w-full px-7 sm:w-auto`}
        >
          {sig.tipo === 'leccion' ? `Seguir: ${sig.titulo}` : 'Continuar'} <ArrowRight size={18} />
        </Link>
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

      {r.correccion && (
        <section className="mt-8">
          <h2 className="mb-3 text-[17px] font-semibold text-ink">Pregunta por pregunta</h2>
          <div className="flex flex-col gap-2.5">
            {r.correccion.map(({pregunta: p, elegida, correcta}, i) => (
              <details key={p.id} className="card group p-4 open:pb-5" open={!correcta && i < 3}>
                <summary className="flex cursor-pointer list-none items-start gap-3">
                  <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${correcta ? 'bg-ok-soft text-ok' : 'bg-bad-soft text-bad'}`}>
                    {correcta ? <Check size={15} strokeWidth={3} /> : <X size={15} strokeWidth={3} />}
                  </span>
                  <span className="text-[15px] leading-snug font-medium text-ink">{p.enunciado.replace('____', '___')}</span>
                </summary>
                <div className="mt-3 pl-10 text-[14.5px] leading-relaxed">
                  <p className="text-ink">
                    <span className="font-semibold text-ok">Correcta: </span>
                    {LETRAS[p.correcta]}) {p.opciones[p.correcta]}
                  </p>
                  {!correcta && elegida !== null && (
                    <p className="mt-1 text-ink-2">
                      <span className="font-semibold text-bad">Elegiste: </span>
                      {LETRAS[elegida]}) {p.opciones[elegida]}
                    </p>
                  )}
                  <p className="mt-2 text-ink-2">{p.explicaciones[p.correcta].replace(/^Correcto:\s*/, '')}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

