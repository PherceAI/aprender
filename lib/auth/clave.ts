import {randomBytes, scryptSync, timingSafeEqual} from 'node:crypto';

export function iguales(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** scrypt con sal propia: «sal:hash». */
export function hashClave(clave: string): string {
  const sal = randomBytes(16).toString('hex');
  return `${sal}:${scryptSync(clave, sal, 64).toString('hex')}`;
}

export function verificarClave(clave: string, guardada: string): boolean {
  const [sal, hash] = guardada.split(':');
  if (!sal || !hash) return false;
  return iguales(scryptSync(clave, sal, 64).toString('hex'), hash);
}

// Límite simple de intentos fallidos por clave (en memoria del proceso): 6 en 15 minutos.
const fallidos = new Map<string, {n: number; desde: number}>();
const VENTANA = 15 * 60_000;

export function bloqueado(llave: string, ahora = Date.now()): boolean {
  const f = fallidos.get(llave);
  if (!f) return false;
  if (ahora - f.desde > VENTANA) {
    fallidos.delete(llave);
    return false;
  }
  return f.n >= 6;
}

export function registrarFallo(llave: string, ahora = Date.now()) {
  const f = fallidos.get(llave);
  if (!f || ahora - f.desde > VENTANA) fallidos.set(llave, {n: 1, desde: ahora});
  else f.n += 1;
}

export function limpiarFallos(llave: string) {
  fallidos.delete(llave);
}
