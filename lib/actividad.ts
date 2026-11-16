import {and, eq, gte, isNotNull, sql} from 'drizzle-orm';
import type {Db} from './db';
import {intentos, progresoLecciones, respuestas} from './db/schema';
import {contarPendientes} from './repaso';
import {hoyEc, sumarDias} from './util';

// La actividad del docente: lo que hizo hoy (para su meta del día) y en la semana (lunes a domingo, hora de Ecuador).

const ETIQUETAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const diaEc = (col: unknown) => sql<string>`to_char((${col} at time zone 'UTC') - interval '5 hours', 'YYYY-MM-DD')`;

function lunesDe(dia: string): string {
  const [a, m, d] = dia.split('-').map(Number);
  const dow = new Date(Date.UTC(a, m - 1, d)).getUTCDay(); // 0 = domingo
  return sumarDias(dia, -((dow + 6) % 7));
}

export async function actividadSemana(db: Db, usuarioId: string, ahora: Date = new Date()) {
  const hoy = hoyEc(ahora);
  const lunes = lunesDe(hoy);
  const desde = new Date(`${lunes}T05:00:00Z`);
  const porDia = await db
    .select({dia: diaEc(respuestas.creado), n: sql<number>`count(*)`.mapWith(Number)})
    .from(respuestas)
    .where(and(eq(respuestas.usuarioId, usuarioId), gte(respuestas.creado, desde)))
    .groupBy(diaEc(respuestas.creado));
  const lecciones = await db
    .select({dia: diaEc(progresoLecciones.completada)})
    .from(progresoLecciones)
    .where(and(eq(progresoLecciones.usuarioId, usuarioId), gte(progresoLecciones.completada, desde)));
  const conteo = new Map(porDia.map((r) => [r.dia, r.n]));
  const conLeccion = new Set(lecciones.map((r) => r.dia));
  return ETIQUETAS.map((etiqueta, i) => {
    const dia = sumarDias(lunes, i);
    const n = conteo.get(dia) ?? 0;
    return {dia, etiqueta, respuestas: n, activo: n > 0 || conLeccion.has(dia), esHoy: dia === hoy};
  });
}

export async function metaDeHoy(db: Db, usuarioId: string, ahora: Date = new Date()) {
  const hoy = hoyEc(ahora);
  const desde = new Date(`${hoy}T05:00:00Z`);
  const [[r], [l], [rep], pendientes] = await Promise.all([
    db
      .select({n: sql<number>`count(*)`.mapWith(Number)})
      .from(respuestas)
      .where(and(eq(respuestas.usuarioId, usuarioId), gte(respuestas.creado, desde))),
    db
      .select({n: sql<number>`count(*)`.mapWith(Number)})
      .from(progresoLecciones)
      .where(and(eq(progresoLecciones.usuarioId, usuarioId), gte(progresoLecciones.completada, desde))),
    db
      .select({n: sql<number>`count(*)`.mapWith(Number)})
      .from(intentos)
      .where(and(eq(intentos.usuarioId, usuarioId), eq(intentos.tipo, 'repaso'), isNotNull(intentos.terminado), gte(intentos.terminado, desde))),
    contarPendientes(db, usuarioId, ahora),
  ]);
  return {leccionHoy: l.n > 0, respuestasHoy: r.n, repasoHoy: rep.n > 0, repasoPendiente: pendientes};
}
