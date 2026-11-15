import {requerirUsuario} from '@/lib/auth/cookies';

// Pantallas de concentración (elegir materia, diagnóstico, preguntas): sin menú, solo la tarea.
export default async function LayoutFoco({children}: {children: React.ReactNode}) {
  await requerirUsuario();
  return <div className="min-h-dvh">{children}</div>;
}
