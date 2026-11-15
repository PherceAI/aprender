import {createHmac, randomBytes} from 'node:crypto';
import {iguales} from './clave';

// Sesión firmada (HMAC) en una cookie HttpOnly. Sin estado en el servidor.

export type Rol = 'docente' | 'admin';
export interface Sesion {
  uid: string;
  rol: Rol;
}

export const COOKIE_SESION = 'rd_sesion';
export const DURACION_SEG: Record<Rol, number> = {docente: 30 * 86400, admin: 12 * 3600};

let secretoLocal: string | null = null;
function secreto(): string {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (process.env.NODE_ENV === 'production') throw new Error('Falta SESSION_SECRET en producción');
  secretoLocal ??= randomBytes(32).toString('hex');
  return secretoLocal;
}

const firmar = (cuerpo: string) => createHmac('sha256', secreto()).update(cuerpo).digest('base64url');

export function firmarToken(s: Sesion, ahora: Date = new Date()): string {
  const cuerpo = Buffer.from(JSON.stringify({...s, iat: Math.floor(ahora.getTime() / 1000)})).toString('base64url');
  return `${cuerpo}.${firmar(cuerpo)}`;
}

export function leerToken(token: string | undefined, ahora: Date = new Date()): Sesion | null {
  if (!token) return null;
  const [cuerpo, firma] = token.split('.');
  if (!cuerpo || !firma || !iguales(firma, firmar(cuerpo))) return null;
  try {
    const p = JSON.parse(Buffer.from(cuerpo, 'base64url').toString('utf8')) as Sesion & {iat: number};
    if (p.rol !== 'docente' && p.rol !== 'admin') return null;
    if (ahora.getTime() / 1000 - p.iat > DURACION_SEG[p.rol]) return null;
    return {uid: p.uid, rol: p.rol};
  } catch {
    return null;
  }
}
