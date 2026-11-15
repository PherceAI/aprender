import {count} from 'drizzle-orm';
import {CONTENIDO} from '../../contenido';
import type {Contenido} from '../../contenido/tipos';
import {validarContenido} from '../../contenido/validar';
import type {Db} from './index';
import {bloques, especialidadBloques, especialidades, lecciones, preguntas, temas, unidades} from './schema';

/**
 * Carga (o actualiza) el contenido en la base. Valida primero: si hay un solo error, no toca nada.
 * Actualiza por id, así que se puede correr cada vez que cambia el contenido. No borra nada
 * (borrar un tema se llevaría el avance de los docentes) y no pisa el video subido de cada tema.
 */
export async function sembrar(db: Db, c: Contenido = CONTENIDO) {
  const errores = validarContenido(c);
  if (errores.length) throw new Error(`El contenido tiene ${errores.length} errores:\n- ${errores.join('\n- ')}`);

  await db.transaction(async (tx) => {
    for (const e of c.especialidades) {
      const fila = {id: e.id, nombre: e.nombre, nivel: e.nivel, estado: e.estado, orden: e.orden};
      await tx.insert(especialidades).values(fila).onConflictDoUpdate({target: especialidades.id, set: fila});
    }
    for (const b of c.bloques) {
      const fila = {
        id: b.id, nombre: b.nombre, descripcion: b.descripcion, compartido: b.compartido,
        preguntasExamen: b.preguntasExamen, minutosExamen: b.minutosExamen,
      };
      await tx.insert(bloques).values(fila).onConflictDoUpdate({target: bloques.id, set: fila});
      for (const [ui, u] of b.unidades.entries()) {
        const filaU = {id: u.id, bloqueId: b.id, nombre: u.nombre, orden: ui + 1};
        await tx.insert(unidades).values(filaU).onConflictDoUpdate({target: unidades.id, set: filaU});
        for (const [ti, t] of u.temas.entries()) {
          const filaT = {id: t.id, unidadId: u.id, nombre: t.nombre, orden: ti + 1, abierto: Boolean(t.abierto)};
          await tx.insert(temas).values(filaT).onConflictDoUpdate({target: temas.id, set: filaT});
          for (const [li, l] of t.lecciones.entries()) {
            const filaL = {
              id: l.id, temaId: t.id, titulo: l.titulo, objetivo: l.objetivo,
              minutos: l.minutos ?? 6, orden: li + 1, contenido: l.contenido ?? null,
            };
            await tx.insert(lecciones).values(filaL).onConflictDoUpdate({target: lecciones.id, set: filaL});
          }
        }
      }
    }
    for (const e of c.especialidades) {
      for (const [i, bloqueId] of e.bloques.entries()) {
        await tx
          .insert(especialidadBloques)
          .values({especialidadId: e.id, bloqueId, orden: i + 1})
          .onConflictDoUpdate({target: [especialidadBloques.especialidadId, especialidadBloques.bloqueId], set: {orden: i + 1}});
      }
    }
    for (const p of c.preguntas) {
      const fila = {
        id: p.id, temaId: p.temaId, leccionId: p.leccionId ?? null, formato: p.formato, enunciado: p.enunciado,
        elementos: p.elementos ?? null, solucion: p.solucion ?? null, opciones: p.opciones, correcta: p.correcta,
        explicaciones: p.explicaciones, usos: p.usos, dificultad: p.dificultad, dibujo: p.dibujo ?? null,
      };
      await tx.insert(preguntas).values(fila).onConflictDoUpdate({target: preguntas.id, set: fila});
    }
  });

  const [[t], [l], [p]] = await Promise.all([
    db.select({n: count()}).from(temas),
    db.select({n: count()}).from(lecciones),
    db.select({n: count()}).from(preguntas),
  ]);
  return {temas: t.n, lecciones: l.n, preguntas: p.n};
}
