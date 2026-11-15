import {randomBytes} from 'node:crypto';

export function newId(prefijo: string): string {
  return `${prefijo}${Date.now().toString(36)}${randomBytes(4).toString('hex')}`;
}

const ECUADOR_MS = -5 * 3600_000; // Ecuador continental: UTC-5, sin horario de verano

/** El día de hoy en Ecuador, como 'AAAA-MM-DD'. */
export function hoyEc(ahora: Date = new Date()): string {
  return new Date(ahora.getTime() + ECUADOR_MS).toISOString().slice(0, 10);
}

/** Día (Ecuador) de un instante, como 'AAAA-MM-DD'. */
export const diaEc = hoyEc;

export function sumarDias(fecha: string, dias: number): string {
  const d = new Date(`${fecha}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

/** Mezcla una copia del arreglo (Fisher–Yates). */
export function barajar<T>(arr: readonly T[], azar: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function normalizarCorreo(correo: string): string {
  return correo.trim().toLowerCase();
}
