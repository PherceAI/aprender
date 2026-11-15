import type {Metadata} from 'next';
import {redirect} from 'next/navigation';
import {Gauge, Hand, ShieldCheck} from 'lucide-react';
import {requerirUsuario} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {diagnosticoHecho} from '@/lib/ruta';
import {Marca} from '@/components/ui';
import {TemaToggle} from '@/components/tema-toggle';
import {BotonIniciar} from '@/components/boton-iniciar';

export const metadata: Metadata = {title: 'Diagnóstico'};

const PUNTOS = [
  {icono: ShieldCheck, texto: 'No es un examen. No hay nota ni se aprueba o reprueba: es para conocerte.'},
  {icono: Hand, texto: 'Vas a tocar, ordenar y unir, como en la plataforma entera.'},
  {icono: Gauge, texto: 'Después de cada respuesta dinos qué tan seguro estás. Así sabemos qué dominas de verdad.'},
];

export default async function Diagnostico() {
  const u = await requerirUsuario();
  if (!u.especialidadId) redirect('/bienvenida');
  if (await diagnosticoHecho(await getDb(), u.id)) redirect('/inicio');
  return (
    <div className="mx-auto flex min-h-dvh max-w-[640px] flex-col px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between">
        <Marca />
        <TemaToggle compacto />
      </div>
      <div className="rise flex flex-1 flex-col justify-center py-10">
        <h1 className="text-[32px] leading-[1.1] font-semibold tracking-[-0.03em] text-ink sm:text-[40px]">Primero, veamos dónde estás.</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-ink-2">18 preguntas, 2 de cada unidad. Unos 15 minutos. Con esto armamos tu ruta.</p>
        <ul className="mt-8 flex flex-col gap-4">
          {PUNTOS.map((p) => (
            <li key={p.texto} className="flex gap-3.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-ctl bg-accent text-on-accent">
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
