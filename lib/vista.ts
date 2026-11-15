import {eq, inArray} from 'drizzle-orm';
import type {IntentoUI} from '@/components/preguntas/tipos';
import type {Db} from './db';
import {intentos, temas} from './db/schema';
import {vistaIntento} from './intentos';

// Prepara un intento para la pantalla (fechas como texto, nombre del tema en cada pregunta).

export async function intentoParaPantalla(db: Db, usuarioId: string, intentoId: string): Promise<{ui: IntentoUI; terminado: boolean}> {
  const v = await vistaIntento(db, usuarioId, intentoId);
  const [i] = await db.select({terminado: intentos.terminado}).from(intentos).where(eq(intentos.id, intentoId));
  const ids = [...new Set(v.preguntas.map((p) => p.temaId))];
  const ts = ids.length ? await db.select({id: temas.id, nombre: temas.nombre}).from(temas).where(inArray(temas.id, ids)) : [];
  const nombre = new Map(ts.map((t) => [t.id, t.nombre]));
  return {
    terminado: Boolean(i?.terminado),
    ui: {
      id: v.id,
      tipo: v.tipo,
      retroalimentacion: v.retroalimentacion,
      terminaEn: v.terminaEn ? v.terminaEn.toISOString() : null,
      respondidas: v.respondidas,
      preguntas: v.preguntas.map((p) => ({
        id: p.id,
        formato: p.formato,
        enunciado: p.enunciado,
        elementos: (p.elementos as IntentoUI['preguntas'][number]['elementos']) ?? null,
        opciones: p.opciones,
        dibujo: (p.dibujo as IntentoUI['preguntas'][number]['dibujo']) ?? null,
        tema: nombre.get(p.temaId) ?? '',
      })),
    },
  };
}

export const TITULO_INTENTO: Record<IntentoUI['tipo'], string> = {
  diagnostico: 'Diagnóstico',
  'diagnostico-tema': 'Diagnóstico del tema',
  practica: 'Práctica',
  'prueba-tema': 'Prueba del tema',
  repaso: 'Repaso de hoy',
  simulacro: 'Simulacro',
};
