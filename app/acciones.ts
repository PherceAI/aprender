'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {headers} from 'next/headers';
import {cerrarSesion, iniciarSesion, requerirAdmin, requerirUsuario} from '@/lib/auth/cookies';
import {bloqueado, limpiarFallos, registrarFallo} from '@/lib/auth/clave';
import {getDb} from '@/lib/db';
import {completarLeccion, guardarNota} from '@/lib/curso';
import {saltarTema} from '@/lib/dominio';
import {ErrorAcademia, iniciarIntento, responder, terminarIntento, type Respuesta, type Retro, type TipoIntento} from '@/lib/intentos';
import {porQueMeEquivoque, preguntarTutor, type RespuestaTutor} from '@/lib/tutor';
import {elegirEspecialidad, ingresar, registrar} from '@/lib/usuarios';
import {cambiarPlan, type Plan} from '@/lib/acceso';
import {crearDocente} from '@/lib/admin';
import {quitarVideo} from '@/lib/videos';

// Las acciones que llaman las pantallas. La lógica vive en lib/ (parte 2, con pruebas).

export type Estado = {error?: string; ok?: string} | undefined;

export async function accionIngresar(_: Estado, form: FormData): Promise<Estado> {
  const correo = String(form.get('correo') ?? '').trim();
  const clave = String(form.get('clave') ?? '');
  if (!correo || !clave) return {error: 'Escribe tu correo y tu contraseña'};
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  const llave = `${correo.toLowerCase()}|${ip}`;
  if (bloqueado(llave)) return {error: 'Demasiados intentos. Espera 15 minutos y vuelve a probar.'};
  const u = await ingresar(await getDb(), correo, clave);
  if (!u) {
    registrarFallo(llave);
    return {error: 'El correo o la contraseña no coinciden'};
  }
  limpiarFallos(llave);
  await iniciarSesion({uid: u.id, rol: u.rol});
  redirect(u.rol === 'admin' ? '/admin' : '/inicio');
}

/** Registro abierto desde la portada: cuenta gratis y directo a elegir la especialidad. */
export async function accionRegistrar(_: Estado, form: FormData): Promise<Estado> {
  const nombre = String(form.get('nombre') ?? '').trim().slice(0, 80);
  const correo = String(form.get('correo') ?? '').trim();
  const clave = String(form.get('clave') ?? '');
  if (!nombre || !correo || !clave) return {error: 'Completa tu nombre, tu correo y una contraseña'};
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  const llave = `registro|${ip}`;
  if (bloqueado(llave)) return {error: 'Se crearon muchas cuentas desde esta conexión. Espera 15 minutos.'};
  let u;
  try {
    u = await registrar(await getDb(), {nombre, correo, clave});
  } catch (e) {
    return {error: e instanceof Error ? e.message : 'No pudimos crear tu cuenta'};
  }
  registrarFallo(llave);
  await iniciarSesion({uid: u.id, rol: u.rol});
  redirect('/bienvenida');
}

export async function accionCambiarPlan(usuarioId: string, plan: Plan) {
  await requerirAdmin();
  await cambiarPlan(await getDb(), usuarioId, plan);
  revalidatePath('/admin');
}

export async function accionSalir() {
  await cerrarSesion();
  redirect('/');
}

export async function accionElegirEspecialidad(especialidadId: string) {
  const u = await requerirUsuario();
  await elegirEspecialidad(await getDb(), u.id, especialidadId);
  redirect('/diagnostico');
}

/** Empieza (o retoma) un intento y lleva a la pantalla de preguntas. */
export async function accionIniciar(tipo: TipoIntento, referencia: string | null = null): Promise<{error: string} | void> {
  const u = await requerirUsuario();
  let id: string;
  try {
    id = (await iniciarIntento(await getDb(), u.id, tipo, referencia)).id;
  } catch (e) {
    if (e instanceof ErrorAcademia) return {error: e.message};
    throw e;
  }
  redirect(tipo === 'diagnostico' ? `/diagnostico/${id}` : `/practicar/${id}`);
}

export async function accionResponder(intentoId: string, preguntaId: string, r: Respuesta): Promise<Retro | {error: string; codigo: string}> {
  const u = await requerirUsuario();
  try {
    return await responder(await getDb(), u.id, intentoId, preguntaId, r);
  } catch (e) {
    if (e instanceof ErrorAcademia) return {error: e.message, codigo: e.codigo};
    throw e;
  }
}

export async function accionTerminar(intentoId: string, destino: 'diagnostico' | 'practicar') {
  const u = await requerirUsuario();
  await terminarIntento(await getDb(), u.id, intentoId);
  revalidatePath('/', 'layout');
  redirect(destino === 'diagnostico' ? `/diagnostico/${intentoId}/resultado` : `/practicar/${intentoId}/resultado`);
}

/** Al llegar a la última pantalla de la lección: la marca vista sin salir de la pantalla. */
export async function accionMarcarLeccion(leccionId: string): Promise<{ok: true} | {error: string}> {
  const u = await requerirUsuario();
  try {
    await completarLeccion(await getDb(), u.id, leccionId);
  } catch (e) {
    if (e instanceof ErrorAcademia) return {error: e.message};
    throw e;
  }
  revalidatePath('/', 'layout');
  return {ok: true};
}

export async function accionGuardarNota(leccionId: string, texto: string) {
  const u = await requerirUsuario();
  await guardarNota(await getDb(), u.id, leccionId, texto);
}

export async function accionSaltarTema(temaId: string): Promise<{error: string} | void> {
  const u = await requerirUsuario();
  try {
    await saltarTema(await getDb(), u.id, temaId);
  } catch (e) {
    return {error: (e as Error).message};
  }
  revalidatePath('/', 'layout');
  redirect(`/curso/${temaId}`);
}

export async function accionTutor(leccionId: string, texto: string): Promise<RespuestaTutor | {error: string}> {
  const u = await requerirUsuario();
  try {
    return await preguntarTutor(await getDb(), u.id, leccionId, texto);
  } catch (e) {
    return {error: (e as Error).message};
  }
}

export async function accionPorQue(preguntaId: string, elegida: number): Promise<RespuestaTutor | {error: string}> {
  const u = await requerirUsuario();
  try {
    return await porQueMeEquivoque(await getDb(), u.id, preguntaId, elegida);
  } catch (e) {
    return {error: (e as Error).message};
  }
}

// ───────────── Administración ─────────────

export async function accionCrearDocente(_: Estado, form: FormData): Promise<Estado> {
  await requerirAdmin();
  try {
    await crearDocente(await getDb(), {
      nombre: String(form.get('nombre') ?? ''),
      correo: String(form.get('correo') ?? ''),
      clave: String(form.get('clave') ?? ''),
    });
  } catch (e) {
    return {error: (e as Error).message};
  }
  revalidatePath('/admin');
  return {ok: 'Cuenta creada. Comparte el correo y la contraseña con el docente.'};
}

export async function accionQuitarVideo(temaId: string) {
  await requerirAdmin();
  await quitarVideo(await getDb(), temaId);
  revalidatePath('/admin');
}
