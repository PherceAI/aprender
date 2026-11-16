import {and, asc, count, countDistinct, desc, eq, gte, isNotNull, sql} from 'drizzle-orm';
import type {Db} from './db';
import {especialidades, intentos, preguntas, progresoLecciones, respuestas, temas, unidades, usuarios} from './db/schema';
import {preparacion} from './dominio';
import {crearUsuario, elegirEspecialidad} from './usuarios';
import {hashClave} from './auth/clave';

// Panel de administración: cómo van los docentes, qué temas cuestan más, cuentas y contenido.

export async function resumenAdmin(db: Db, ahora: Date = new Date()) {
  const hace7 = new Date(ahora.getTime() - 7 * 86400_000);
  const [[docentes], [activos], [diagnosticos], [simulacros], [respondidas]] = await Promise.all([
    db.select({n: count()}).from(usuarios).where(eq(usuarios.rol, 'docente')),
    db.select({n: countDistinct(respuestas.usuarioId)}).from(respuestas).where(gte(respuestas.creado, hace7)),
    db.select({n: count()}).from(intentos).where(and(eq(intentos.tipo, 'diagnostico'), isNotNull(intentos.terminado))),
    db.select({n: count()}).from(intentos).where(and(eq(intentos.tipo, 'simulacro'), isNotNull(intentos.terminado))),
    db.select({n: count()}).from(respuestas),
  ]);
  const porTema = await db
    .select({
      temaId: temas.id,
      tema: temas.nombre,
      unidad: unidades.nombre,
      total: count(),
      errores: sql<number>`count(*) filter (where not ${respuestas.correcta})`.mapWith(Number),
    })
    .from(respuestas)
    .innerJoin(preguntas, eq(preguntas.id, respuestas.preguntaId))
    .innerJoin(temas, eq(temas.id, preguntas.temaId))
    .innerJoin(unidades, eq(unidades.id, temas.unidadId))
    .groupBy(temas.id, temas.nombre, unidades.nombre);
  const masFallados = porTema
    .filter((t) => t.total >= 3)
    .map((t) => ({...t, error: Math.round((t.errores / t.total) * 100)}))
    .sort((a, b) => b.error - a.error || b.total - a.total)
    .slice(0, 6);
  return {
    docentes: docentes.n,
    activos7: activos.n,
    diagnosticos: diagnosticos.n,
    simulacros: simulacros.n,
    respondidas: respondidas.n,
    masFallados,
  };
}

export async function docentesConAvance(db: Db) {
  const lista = await db
    .select({
      id: usuarios.id,
      nombre: usuarios.nombre,
      correo: usuarios.correo,
      plan: usuarios.plan,
      especialidadId: usuarios.especialidadId,
      especialidad: especialidades.nombre,
      creado: usuarios.creado,
      ultimoIngreso: usuarios.ultimoIngreso,
    })
    .from(usuarios)
    .leftJoin(especialidades, eq(especialidades.id, usuarios.especialidadId))
    .where(eq(usuarios.rol, 'docente'))
    .orderBy(desc(usuarios.creado));
  const lecciones = await db.select({uid: progresoLecciones.usuarioId, n: count()}).from(progresoLecciones).groupBy(progresoLecciones.usuarioId);
  const diag = await db
    .select({uid: intentos.usuarioId})
    .from(intentos)
    .where(and(eq(intentos.tipo, 'diagnostico'), isNotNull(intentos.terminado)));
  const conDiag = new Set(diag.map((d) => d.uid));
  const lec = new Map(lecciones.map((l) => [l.uid, l.n]));
  return Promise.all(
    lista.map(async (d) => ({
      ...d,
      preparacion: d.especialidadId ? await preparacion(db, d.id, d.especialidadId) : 0,
      lecciones: lec.get(d.id) ?? 0,
      diagnosticoHecho: conDiag.has(d.id),
    }))
  );
}

/** El administrador crea la cuenta del docente (en la demo no hay registro abierto). */
export async function crearDocente(db: Db, d: {nombre: string; correo: string; clave: string; especialidadId?: string}) {
  const u = await crearUsuario(db, {nombre: d.nombre, correo: d.correo, clave: d.clave, rol: 'docente'});
  if (d.especialidadId) await elegirEspecialidad(db, u.id, d.especialidadId);
  return u;
}

export async function cambiarClave(db: Db, usuarioId: string, clave: string) {
  if (clave.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres');
  await db.update(usuarios).set({claveHash: hashClave(clave)}).where(eq(usuarios.id, usuarioId));
}

/** El banco de preguntas con cómo le va a cada una (veces respondida y % de acierto). */
export async function preguntasConUso(db: Db, temaId?: string) {
  const stats = await db
    .select({
      id: respuestas.preguntaId,
      veces: count(),
      aciertos: sql<number>`count(*) filter (where ${respuestas.correcta})`.mapWith(Number),
    })
    .from(respuestas)
    .groupBy(respuestas.preguntaId);
  const s = new Map(stats.map((x) => [x.id, x]));
  const ps = await db
    .select({pregunta: preguntas, tema: temas.nombre})
    .from(preguntas)
    .innerJoin(temas, eq(temas.id, preguntas.temaId))
    .where(temaId ? eq(preguntas.temaId, temaId) : undefined)
    .orderBy(asc(temas.orden), asc(preguntas.id));
  return ps.map(({pregunta, tema}) => {
    const x = s.get(pregunta.id);
    return {...pregunta, tema, veces: x?.veces ?? 0, acierto: x?.veces ? Math.round((x.aciertos / x.veces) * 100) : null};
  });
}

/** Temas con su video (para la pantalla de videos del panel). */
export async function temasYVideos(db: Db) {
  return db
    .select({id: temas.id, nombre: temas.nombre, unidad: unidades.nombre, abierto: temas.abierto, videoUrl: temas.videoUrl, videoTitulo: temas.videoTitulo})
    .from(temas)
    .innerJoin(unidades, eq(unidades.id, temas.unidadId))
    .orderBy(asc(unidades.bloqueId), asc(unidades.orden), asc(temas.orden));
}
