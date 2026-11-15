import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sql} from 'drizzle-orm';
import {crearDbPrueba} from '../lib/db/index.ts';
import {intentos, respuestas, usuarios, temas, unidades, bloques, preguntas} from '../lib/db/schema.ts';

const TABLAS = [
  'especialidades', 'bloques', 'especialidad_bloques', 'unidades', 'temas', 'lecciones', 'preguntas',
  'usuarios', 'intentos', 'respuestas', 'dominio', 'repaso', 'progreso_lecciones', 'notas', 'tutor_mensajes',
];

test('después de migrar existen las 15 tablas', async () => {
  const db = await crearDbPrueba();
  const res = await db.execute(
    sql`select table_name from information_schema.tables where table_schema = 'public'`
  );
  const nombres = new Set((res.rows as {table_name: string}[]).map((r) => r.table_name));
  for (const t of TABLAS) assert.ok(nombres.has(t), `falta la tabla ${t}`);
});

test('el correo es único aunque cambien las mayúsculas', async () => {
  const db = await crearDbPrueba();
  await db.insert(usuarios).values({id: 'u1', nombre: 'Ana', correo: 'Ana@Correo.com', claveHash: 'x'});
  await assert.rejects(
    db.insert(usuarios).values({id: 'u2', nombre: 'Ana 2', correo: 'ana@correo.com', claveHash: 'x'})
  );
});

test('una pregunta tiene una sola respuesta por intento', async () => {
  const db = await crearDbPrueba();
  await db.insert(bloques).values({id: 'b', nombre: 'B', compartido: false, preguntasExamen: 1, minutosExamen: 1});
  await db.insert(unidades).values({id: 'un', bloqueId: 'b', nombre: 'U', orden: 1});
  await db.insert(temas).values({id: 't', unidadId: 'un', nombre: 'T', orden: 1});
  await db.insert(preguntas).values({
    id: 'p', temaId: 't', formato: 'simple', enunciado: '¿?', opciones: ['a', 'b', 'c', 'd'], correcta: 0,
    explicaciones: ['1', '2', '3', '4'], usos: ['practica'], dificultad: 1,
  });
  await db.insert(usuarios).values({id: 'u', nombre: 'U', correo: 'u@x.com', claveHash: 'x'});
  await db.insert(intentos).values({id: 'i', usuarioId: 'u', tipo: 'practica', preguntaIds: ['p']});
  await db.insert(respuestas).values({intentoId: 'i', usuarioId: 'u', preguntaId: 'p', elegida: 0, correcta: true});
  await assert.rejects(
    db.insert(respuestas).values({intentoId: 'i', usuarioId: 'u', preguntaId: 'p', elegida: 1, correcta: false})
  );
});
