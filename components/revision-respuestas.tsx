import {Check, X} from 'lucide-react';
type Pregunta = {id: string; enunciado: string; opciones: unknown; correcta: number; explicaciones: unknown};

// Pregunta por pregunta: la correcta, lo que eligió el docente y por qué. Se usa al terminar una práctica,
// una prueba, un simulacro y el diagnóstico. Con «falladasPrimero», las falladas van arriba y abiertas.

const LETRAS = 'ABCD';
type Item = {pregunta: Pick<Pregunta, 'id' | 'enunciado' | 'opciones' | 'correcta' | 'explicaciones'>; elegida: number | null; correcta: boolean};

export function RevisionRespuestas({correccion, falladasPrimero = false, titulo = 'Pregunta por pregunta'}: {correccion: Item[]; falladasPrimero?: boolean; titulo?: string}) {
  const lista = falladasPrimero ? [...correccion.filter((c) => !c.correcta), ...correccion.filter((c) => c.correcta)] : correccion;
  const falladas = correccion.filter((c) => !c.correcta).length;
  return (
    <section className="mt-8">
      <h2 className="mb-1 text-[17px] font-semibold text-ink">{titulo}</h2>
      <p className="mb-3 text-[14px] text-ink-2">
        {falladas ? `Fallaste ${falladas} de ${correccion.length}. ` : '¡Acertaste todas! '}Toca una pregunta para ver la respuesta correcta y por qué.
      </p>
      <div className="flex flex-col gap-2.5">
        {lista.map(({pregunta: p, elegida, correcta}, i) => {
          const opciones = p.opciones as string[];
          const explicaciones = p.explicaciones as string[];
          return (
            <details key={p.id} className="card group p-4 open:pb-5" open={!correcta && i < 3}>
              <summary className="flex cursor-pointer list-none items-start gap-3 [&::-webkit-details-marker]:hidden">
                <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${correcta ? 'bg-ok-soft text-ok' : 'bg-bad-soft text-bad'}`}>
                  {correcta ? <Check size={15} strokeWidth={3} /> : <X size={15} strokeWidth={3} />}
                </span>
                <span className="text-[15px] leading-snug font-medium text-ink">{p.enunciado.replace('____', '___')}</span>
              </summary>
              <div className="mt-3 pl-10 text-[14.5px] leading-relaxed">
                <p className="text-ink">
                  <span className="font-semibold text-ok">Correcta: </span>
                  {LETRAS[p.correcta]}) {opciones[p.correcta]}
                </p>
                {!correcta && elegida !== null && (
                  <p className="mt-1 text-ink-2">
                    <span className="font-semibold text-bad">Elegiste: </span>
                    {LETRAS[elegida]}) {opciones[elegida]}
                  </p>
                )}
                <p className="mt-2 text-ink-2">
                  <span className="font-semibold text-ink">Por qué: </span>
                  {explicaciones[p.correcta].replace(/^Correcto:\s*/, '')}
                </p>
                {!correcta && elegida !== null && <p className="mt-1.5 text-ink-2">Tu opción: {explicaciones[elegida]}</p>}
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
