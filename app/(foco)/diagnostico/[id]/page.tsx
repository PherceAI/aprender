import {notFound, redirect} from 'next/navigation';
import {requerirUsuario} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {ErrorAcademia} from '@/lib/intentos';
import {intentoParaPantalla} from '@/lib/vista';
import {Runner} from '@/components/preguntas/runner';

export default async function DiagnosticoEnCurso({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const u = await requerirUsuario();
  try {
    const {ui, terminado} = await intentoParaPantalla(await getDb(), u.id, id);
    if (terminado) redirect(`/diagnostico/${id}/resultado`);
    return <Runner intento={ui} titulo="Diagnóstico" salir={{href: '/diagnostico', texto: 'Salir (sigues después donde quedaste)'}} />;
  } catch (e) {
    if (e instanceof ErrorAcademia) notFound();
    throw e;
  }
}
