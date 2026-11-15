import {notFound, redirect} from 'next/navigation';
import {requerirUsuario} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {ErrorAcademia} from '@/lib/intentos';
import {intentoParaPantalla, TITULO_INTENTO} from '@/lib/vista';
import {Runner} from '@/components/preguntas/runner';

export default async function Practicar({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;
  const u = await requerirUsuario();
  try {
    const {ui, terminado} = await intentoParaPantalla(await getDb(), u.id, id);
    if (terminado) redirect(`/practicar/${id}/resultado`);
    const salir = ui.tipo === 'simulacro' ? '/simulacro' : '/inicio';
    return <Runner intento={ui} titulo={TITULO_INTENTO[ui.tipo]} salir={{href: salir, texto: 'Salir'}} />;
  } catch (e) {
    if (e instanceof ErrorAcademia) notFound();
    throw e;
  }
}
