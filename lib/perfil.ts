import {and, asc, count, desc, eq, isNotNull, sql} from 'drizzle-orm';
import type {Db} from './db';
import {especialidades, intentos, preguntas, progresoLecciones, respuestas, temas, usuarios} from './db/schema';
import {especialidadDelUsuario} from './curso';
import {nivelesDe, preparacion, temasConPeso} from './dominio';
import {rachaDe} from './ruta';

// El perfil del docente: cómo va, en qué falla y su historial.

export async function perfilDe(db: Db, usuarioId: string, ahora: Date = new Date()) {
  const especialidadId = await especialidadDelUsuario(db, usuarioId);
  const [u] = await db
    .select({nombre: usuarios.nombre, correo: usuarios.correo, creado: usuarios.creado, especialidad: especialidades.nombre})
    .from(usuarios)
    .leftJoin(especialidades, eq(especialidades.id, usuarios.especialidadId))
    .where(eq(usuarios.id, usuarioId));

  const lista = await temasConPeso(db, especialidadId);
  const niveles = await nivelesDe(db, usuarioId, lista.map((t) => t.temaId));

  const simulacros = await db
    .select({id: intentos.id, puntaje: intentos.puntaje, fecha: intentos.terminado, preguntas: sql<number>`jsonb_array_length(${intentos.preguntaIds})`})
    .from(intentos)
    .where(and(eq(intentos.usuarioId, usuarioId), eq(intentos.tipo, 'simulacro'), isNotNull(intentos.terminado)))
    .orderBy(asc(intentos.terminado));

  const pruebas = await db
    .select({temaId: intentos.referencia, puntaje: intentos.puntaje, fecha: intentos.terminado})
    .from(intentos)
    .where(and(eq(intentos.usuarioId, usuarioId), eq(intentos.tipo, 'prueba-tema'), isNotNull(intentos.terminado)))
    .orderBy(asc(intentos.terminado));

  const fallos = await db
    .select({preguntaId: respuestas.preguntaId, n: count()})
    .from(respuestas)
    .where(and(eq(respuestas.usuarioId, usuarioId), eq(respuestas.correcta, false)))
    .groupBy(respuestas.preguntaId)
    .orderBy(desc(count()))
    .limit(5);
  const errores = [];
  for (const f of fallos) {
    const [p] = await db
      .select({enunciado: preguntas.enunciado, opciones: preguntas.opciones, correcta: preguntas.correcta, explicaciones: preguntas.explicaciones, tema: temas.nombre})
      .from(preguntas)
      .innerJoin(temas, eq(temas.id, preguntas.temaId))
      .where(eq(preguntas.id, f.preguntaId));
    errores.push({
      preguntaId: f.preguntaId,
      veces: f.n,
      tema: p.tema,
      enunciado: p.enunciado,
      respuesta: p.opciones[p.correcta],
      porQue: p.explicaciones[p.correcta],
    });
  }

  const [tot] = await db
    .select({
      respondidas: count(),
      aciertos: sql<number>`count(*) filter (where ${respuestas.correcta})`.mapWith(Number),
      segundos: sql<number>`coalesce(sum(${respuestas.segundos}), 0)`.mapWith(Number),
    })
    .from(respuestas)
    .where(eq(respuestas.usuarioId, usuarioId));
  const [lec] = await db.select({n: count()}).from(progresoLecciones).where(eq(progresoLecciones.usuarioId, usuarioId));

  return {
    nombre: u.nombre,
    correo: u.correo,
    desde: u.creado,
    especialidad: u.especialidad,
    preparacion: await preparacion(db, usuarioId, especialidadId),
    racha: await rachaDe(db, usuarioId, ahora),
    temas: lista.map((t) => ({
      temaId: t.temaId,
      nombre: t.temaNombre,
      unidadNombre: t.unidadNombre,
      bloqueNombre: t.bloqueNombre,
      abierto: t.abierto,
      nivel: niveles.get(t.temaId)?.nivel ?? 0,
      estado: niveles.get(t.temaId)?.estado ?? 'sin-empezar',
    })),
    simulacros: simulacros.map((s) => ({id: s.id, puntaje: s.puntaje ?? 0, fecha: s.fecha!, preguntas: s.preguntas})),
    pruebas: pruebas.map((p) => ({temaId: p.temaId!, puntaje: p.puntaje ?? 0, fecha: p.fecha!})),
    errores,
    totales: {
      respondidas: tot.respondidas,
      acierto: tot.respondidas ? Math.round((tot.aciertos / tot.respondidas) * 100) : 0,
      minutos: Math.round(tot.segundos / 60),
      lecciones: lec.n,
    },
  };
}
