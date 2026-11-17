import type {Metadata} from 'next';
import {requerirDocente} from '@/lib/auth/cookies';
import {ConoceEvaluacion} from '@/components/conoce-evaluacion';

export const metadata: Metadata = {title: 'Tu evaluación'};

// La evaluación completa según la ficha oficial, dentro de la plataforma.

export default async function Evaluacion() {
  await requerirDocente();
  return (
    <div className="rise card p-5 sm:p-8">
      <ConoceEvaluacion titulo="h1" />
    </div>
  );
}
