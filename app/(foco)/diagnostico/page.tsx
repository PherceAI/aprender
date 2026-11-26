import type {Metadata} from 'next';
import {redirect} from 'next/navigation';
import {FileText, Hand, Pause, ShieldCheck} from 'lucide-react';
import {requerirUsuario} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {diagnosticoHecho} from '@/lib/ruta';
import {resumenCurso} from '@/lib/evaluacion';
import {Marca} from '@/components/ui';
import {TemaToggle} from '@/components/tema-toggle';
import {BotonIniciar} from '@/components/boton-iniciar';

export const metadata: Metadata = {title: 'Diagnóstico'};

const puntos = (temas: number) => [
  {icono: ShieldCheck, texto: 'No es un examen: no se aprueba ni se reprueba. Es para saber qué temas ya dominas.'},
  {icono: FileText, texto: `Toca los ${temas} temas de la ficha oficial del Ineval, en los mismos formatos del examen.`},
  {icono: Pause, texto: 'Si te interrumpen, sales y al volver sigues donde te quedaste.'},
  {icono: Hand, texto: 'Al final ves tu puntaje estimado del Ineval, tu resultado tema por tema y por dónde empezar.'},
];

export default async function Diagnostico() {
  const u = await requerirUsuario();
  if (!u.especialidadId) redirect('/bienvenida');
  if (await diagnosticoHecho(await getDb(), u.id)) redirect('/inicio');
  const r = resumenCurso(u.especialidadId);
  return (
    <div className="mx-auto flex min-h-dvh max-w-[640px] flex-col px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between">
        <Marca />
        <TemaToggle compacto />
      </div>
      <div className="rise flex flex-1 flex-col justify-center py-10">
        <h1 className="text-[32px] leading-[1.1] font-medium tracking-[-0.04em] text-ink sm:text-[40px]">Primero, veamos dónde estás.</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-ink-2">{r.preguntasDiagnostico} preguntas, unos {r.minutosDiagnostico} minutos. Con esto armamos tu ruta.</p>
        <ul className="mt-8 flex flex-col gap-4">
          {puntos(r.temas).map((p) => (
            <li key={p.texto} className="flex gap-3.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-ctl bg-accent-soft text-accent-ink">
                <p.icono size={19} />
              </span>
              <p className="pt-2 text-[15.5px] leading-relaxed text-ink">{p.texto}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <BotonIniciar tipo="diagnostico" texto="Empezar el diagnóstico" className="w-full sm:w-auto sm:px-8" />
        </div>
      </div>
    </div>
  );
}
