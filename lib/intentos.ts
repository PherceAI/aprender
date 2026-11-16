import {and, arrayOverlaps, asc, eq, inArray, isNull} from 'drizzle-orm';
import {listaNumeros, listaOrden, listaParejas} from '../contenido/validar';
import type {Db} from './db';
import {planDe, puedeVerLeccion} from './acceso';
import {
  bloques,
  especialidadBloques,
  intentos,
  lecciones,
  preguntas,
  respuestas,
  temas,
  unidades,
  usuarios,
  TIPOS_INTENTO,
} from './db/schema';
import {
  categoriaDe,
  fijarDominio,
  dominioDe,
  marcarAprendiendo,
  nivelesDe,
  preparacion,
  NIVEL_MAX_DIAGNOSTICO,
  UMBRAL_DOMINIO,
  valorDiagnostico,
  type Categoria,
} from './dominio';
import {actualizarRepaso, pendientesDeRepaso} from './repaso';
import {anotarPreparacion, type Avance} from './avance';
import {barajar, newId} from './util';

// El motor de preguntas: diagnóstico, práctica, prueba del tema, repaso y simulacro.
// Al docente nunca le llega la respuesta correcta antes de responder.

export type TipoIntento = (typeof TIPOS_INTENTO)[number];
export type Pregunta = typeof preguntas.$inferSelect;
type Seguridad = 'lo-se' | 'creo' | 'adivine';

export const SIMULACRO_CORTO = {preguntas: 15, minutos: 20};
export const GRACIA_SEG = 5;
const PRACTICA_POR_LECCION = 3;
const PREGUNTAS_PRUEBA_TEMA = 10;

/** Cuándo ve el docente si acertó. */
export const RETROALIMENTACION: Record<TipoIntento, 'inmediata' | 'al-final' | 'ninguna'> = {
  diagnostico: 'ninguna',
  'diagnostico-tema': 'ninguna',
  practica: 'inmediata',
  'prueba-tema': 'inmediata',
  repaso: 'inmediata',
  simulacro: 'al-final',
};

export class ErrorAcademia extends Error {
  constructor(
    public codigo: 'no-encontrado' | 'terminado' | 'tiempo' | 'repetida' | 'ajena' | 'tema-cerrado' | 'sin-preguntas' | 'sin-especialidad' | 'invalida' | 'bloqueado',
    mensaje: string
  ) {
    super(mensaje);
  }
}

export type PreguntaPublica = Pick<Pregunta, 'id' | 'temaId' | 'formato' | 'enunciado' | 'elementos' | 'opciones' | 'dibujo'>;

export function preguntaPublica(p: Pregunta): PreguntaPublica {
  return {id: p.id, temaId: p.temaId, formato: p.formato, enunciado: p.enunciado, elementos: p.elementos, opciones: p.opciones, dibujo: p.dibujo};
}

// ───────────── Elegir las preguntas de cada tipo ─────────────

async function temaAbierto(db: Db, temaId: string) {
  const [t] = await db.select().from(temas).where(eq(temas.id, temaId));
  if (!t) throw new ErrorAcademia('no-encontrado', 'Ese tema no existe');
  if (!t.abierto) throw new ErrorAcademia('tema-cerrado', 'Este tema estará disponible próximamente');
  return t;
}

async function especialidadDe(db: Db, usuarioId: string): Promise<string> {
  const [u] = await db.select({e: usuarios.especialidadId}).from(usuarios).where(eq(usuarios.id, usuarioId));
  if (!u) throw new ErrorAcademia('no-encontrado', 'Usuario no encontrado');
  if (!u.e) throw new ErrorAcademia('sin-especialidad', 'Primero elige tu especialidad');
  return u.e;
}

/** Temas (y su unidad) de los bloques que rinde la especialidad, en orden. */
async function temasDeEspecialidad(db: Db, especialidadId: string) {
  return db
    .select({temaId: temas.id, unidadId: unidades.id})
    .from(especialidadBloques)
    .innerJoin(bloques, eq(bloques.id, especialidadBloques.bloqueId))
    .innerJoin(unidades, eq(unidades.bloqueId, bloques.id))
    .innerJoin(temas, eq(temas.unidadId, unidades.id))
    .where(eq(especialidadBloques.especialidadId, especialidadId))
    .orderBy(asc(especialidadBloques.orden), asc(unidades.orden), asc(temas.orden));
}

async function elegirPreguntas(
  db: Db,
  usuarioId: string,
  tipo: TipoIntento,
  referencia: string | null,
  ahora: Date,
  azar: () => number
): Promise<{ids: string[]; limiteSeg: number | null}> {
  const aprobadas = eq(preguntas.estado, 'aprobada');
  switch (tipo) {
    case 'diagnostico': {
      const lista = await temasDeEspecialidad(db, referencia!);
      const ordenTema = new Map(lista.map((t, i) => [t.temaId, i]));
      const ps = await db
        .select()
        .from(preguntas)
        .where(and(aprobadas, arrayOverlaps(preguntas.usos, ['diagnostico']), inArray(preguntas.temaId, [...ordenTema.keys()])))
        .orderBy(asc(preguntas.id));
      ps.sort((a, b) => ordenTema.get(a.temaId)! - ordenTema.get(b.temaId)!);
      return {ids: ps.map((p) => p.id), limiteSeg: null};
    }
    case 'diagnostico-tema': {
      await temaAbierto(db, referencia!);
      const ps = await db
        .select({id: preguntas.id})
        .from(preguntas)
        .where(and(aprobadas, eq(preguntas.temaId, referencia!), arrayOverlaps(preguntas.usos, ['diagnostico-tema'])))
        .orderBy(asc(preguntas.id));
      return {ids: ps.map((p) => p.id), limiteSeg: null};
    }
    case 'practica': {
      const [l] = await db.select().from(lecciones).where(eq(lecciones.id, referencia!));
      if (!l) throw new ErrorAcademia('no-encontrado', 'Esa lección no existe');
      await temaAbierto(db, l.temaId);
      const ps = await db
        .select()
        .from(preguntas)
        .where(and(aprobadas, eq(preguntas.leccionId, l.id), arrayOverlaps(preguntas.usos, ['practica', 'prueba'])));
      const depractica = barajar(ps.filter((p) => p.usos.includes('practica')), azar);
      const resto = barajar(ps.filter((p) => !p.usos.includes('practica')), azar);
      return {ids: [...depractica, ...resto].slice(0, PRACTICA_POR_LECCION).map((p) => p.id), limiteSeg: null};
    }
    case 'prueba-tema': {
      await temaAbierto(db, referencia!);
      const ps = await db
        .select({id: preguntas.id})
        .from(preguntas)
        .where(and(aprobadas, eq(preguntas.temaId, referencia!), arrayOverlaps(preguntas.usos, ['prueba'])));
      const falladas = new Set(
        (
          await db
            .select({id: respuestas.preguntaId})
            .from(respuestas)
            .where(and(eq(respuestas.usuarioId, usuarioId), eq(respuestas.correcta, false)))
        ).map((r) => r.id)
      );
      const primero = barajar(ps.filter((p) => falladas.has(p.id)), azar);
      const despues = barajar(ps.filter((p) => !falladas.has(p.id)), azar);
      return {ids: [...primero, ...despues].slice(0, PREGUNTAS_PRUEBA_TEMA).map((p) => p.id), limiteSeg: null};
    }
    case 'repaso':
      return {ids: await pendientesDeRepaso(db, usuarioId, ahora), limiteSeg: null};
    case 'simulacro': {
      const lista = await temasDeEspecialidad(db, referencia!);
      const ps = await db
        .select({id: preguntas.id})
        .from(preguntas)
        .where(
          and(
            aprobadas,
            arrayOverlaps(preguntas.usos, ['simulacro', 'prueba', 'practica']),
            inArray(preguntas.temaId, lista.map((t) => t.temaId))
          )
        );
      const ids = barajar(ps, azar).slice(0, SIMULACRO_CORTO.preguntas).map((p) => p.id);
      const limiteSeg = Math.round((SIMULACRO_CORTO.minutos * 60 * ids.length) / SIMULACRO_CORTO.preguntas);
      return {ids, limiteSeg};
    }
  }
}

// ───────────── Iniciar, ver, responder, terminar ─────────────

export interface VistaIntento {
  id: string;
  tipo: TipoIntento;
  referencia: string | null;
  iniciado: Date;
  /** Hasta cuándo se puede responder (simulacro). */
  terminaEn: Date | null;
  retroalimentacion: (typeof RETROALIMENTACION)[TipoIntento];
  preguntas: PreguntaPublica[];
  /** Lo ya respondido (si se retoma). «correcta» solo cuando la retroalimentación es inmediata. */
  respondidas: Record<string, {elegida: number | null; correcta?: boolean}>;
}

/**
 * Crea un intento o retoma el que quedó abierto del mismo tipo y referencia.
 * Diagnóstico y simulacro usan la especialidad del docente; los demás reciben tema o lección.
 */
export async function iniciarIntento(
  db: Db,
  usuarioId: string,
  tipo: TipoIntento,
  referencia: string | null = null,
  ahora: Date = new Date(),
  azar: () => number = Math.random
): Promise<VistaIntento> {
  if (tipo === 'diagnostico' || tipo === 'simulacro') referencia = await especialidadDe(db, usuarioId);
  if (tipo === 'repaso') referencia = null;
  if ((tipo === 'prueba-tema' || tipo === 'simulacro') && (await planDe(db, usuarioId)) === 'gratis') {
    throw new ErrorAcademia('bloqueado', tipo === 'simulacro' ? 'Los simulacros son parte del acceso completo' : 'La prueba del tema es parte del acceso completo');
  }
  if (tipo === 'practica' && referencia && !(await puedeVerLeccion(db, usuarioId, referencia))) {
    throw new ErrorAcademia('bloqueado', 'Esta lección es parte del acceso completo');
  }

  const abiertos = await db
    .select()
    .from(intentos)
    .where(
      and(
        eq(intentos.usuarioId, usuarioId),
        eq(intentos.tipo, tipo),
        referencia === null ? isNull(intentos.referencia) : eq(intentos.referencia, referencia),
        isNull(intentos.terminado)
      )
    );
  for (const a of abiertos) {
    if (vencido(a, ahora)) await terminarIntento(db, usuarioId, a.id, ahora);
    else return vistaIntento(db, usuarioId, a.id);
  }

  const {ids, limiteSeg} = await elegirPreguntas(db, usuarioId, tipo, referencia, ahora, azar);
  if (!ids.length) {
    throw new ErrorAcademia('sin-preguntas', tipo === 'repaso' ? 'Hoy no tienes preguntas por repasar' : 'Aún no hay preguntas para esto');
  }
  const id = newId('i');
  await db.insert(intentos).values({id, usuarioId, tipo, referencia, preguntaIds: ids, limiteSeg, iniciado: ahora});
  return vistaIntento(db, usuarioId, id);
}

function vencido(i: typeof intentos.$inferSelect, ahora: Date): boolean {
  return i.limiteSeg !== null && ahora.getTime() > i.iniciado.getTime() + (i.limiteSeg + GRACIA_SEG) * 1000;
}

async function intentoPropio(db: Db, usuarioId: string, intentoId: string) {
  const [i] = await db.select().from(intentos).where(eq(intentos.id, intentoId));
  if (!i) throw new ErrorAcademia('no-encontrado', 'No encontramos ese intento');
  if (i.usuarioId !== usuarioId) throw new ErrorAcademia('ajena', 'No encontramos ese intento');
  return i;
}

async function preguntasEnOrden(db: Db, ids: string[]): Promise<Pregunta[]> {
  if (!ids.length) return [];
  const ps = await db.select().from(preguntas).where(inArray(preguntas.id, ids));
  const porId = new Map(ps.map((p) => [p.id, p]));
  return ids.map((id) => porId.get(id)).filter((p): p is Pregunta => Boolean(p));
}

export async function vistaIntento(db: Db, usuarioId: string, intentoId: string): Promise<VistaIntento> {
  const i = await intentoPropio(db, usuarioId, intentoId);
  const ps = await preguntasEnOrden(db, i.preguntaIds);
  const rs = await db.select().from(respuestas).where(eq(respuestas.intentoId, i.id));
  const ret = RETROALIMENTACION[i.tipo];
  return {
    id: i.id,
    tipo: i.tipo,
    referencia: i.referencia,
    iniciado: i.iniciado,
    terminaEn: i.limiteSeg === null ? null : new Date(i.iniciado.getTime() + i.limiteSeg * 1000),
    retroalimentacion: ret,
    preguntas: ps.map(preguntaPublica),
    respondidas: Object.fromEntries(
      rs.map((r) => [r.preguntaId, ret === 'inmediata' ? {elegida: r.elegida, correcta: r.correcta} : {elegida: r.elegida}])
    ),
  };
}

export interface Respuesta {
  /** Índice de la opción (0–3). */
  elegida?: number;
  /** Respuesta interactiva: los índices seleccionados, el orden, o la pareja de cada fila (desde 0). */
  interactiva?: number[];
  seguridad?: Seguridad;
  segundos?: number;
}

export type Retro =
  | {registrada: true}
  | {
      registrada: true;
      correcta: boolean;
      correctaIndex: number;
      solucion: number[] | null;
      /** Por qué su opción está bien o mal. */
      explicacion: string;
      /** Por qué la correcta es la correcta. */
      explicacionCorrecta: string;
    };

/** Califica una respuesta interactiva contra la solución y la traduce a la opción equivalente. */
export function calificarInteractiva(p: Pregunta, r: number[]): {correcta: boolean; elegida: number | null} {
  const sol = (p.solucion as number[] | null) ?? [];
  let texto: string;
  let correcta: boolean;
  if (p.formato === 'seleccion') {
    const orden = [...new Set(r)].sort((a, b) => a - b);
    texto = listaNumeros(orden);
    correcta = orden.length === sol.length && orden.every((x, k) => x === [...sol].sort((a, b) => a - b)[k]);
  } else if (p.formato === 'ordenamiento') {
    texto = listaOrden(r);
    correcta = r.length === sol.length && r.every((x, k) => x === sol[k]);
  } else if (p.formato === 'emparejamiento') {
    texto = listaParejas(r);
    correcta = r.length === sol.length && r.every((x, k) => x === sol[k]);
  } else {
    throw new ErrorAcademia('invalida', 'Esta pregunta se responde eligiendo una opción');
  }
  const idx = p.opciones.findIndex((o) => o.trim() === texto);
  return {correcta, elegida: idx === -1 ? null : idx};
}

export async function responder(
  db: Db,
  usuarioId: string,
  intentoId: string,
  preguntaId: string,
  r: Respuesta,
  ahora: Date = new Date()
): Promise<Retro> {
  const i = await intentoPropio(db, usuarioId, intentoId);
  if (i.terminado) throw new ErrorAcademia('terminado', 'Este intento ya terminó');
  if (vencido(i, ahora)) {
    await terminarIntento(db, usuarioId, intentoId, ahora);
    throw new ErrorAcademia('tiempo', 'Se acabó el tiempo del simulacro');
  }
  if (!i.preguntaIds.includes(preguntaId)) throw new ErrorAcademia('invalida', 'Esa pregunta no es de este intento');
  const [ya] = await db
    .select({id: respuestas.id})
    .from(respuestas)
    .where(and(eq(respuestas.intentoId, intentoId), eq(respuestas.preguntaId, preguntaId)));
  if (ya) throw new ErrorAcademia('repetida', 'Ya respondiste esta pregunta');

  const [p] = await db.select().from(preguntas).where(eq(preguntas.id, preguntaId));
  let correcta: boolean;
  let elegida: number | null;
  if (r.interactiva) {
    ({correcta, elegida} = calificarInteractiva(p, r.interactiva));
  } else {
    if (r.elegida === undefined || !Number.isInteger(r.elegida) || r.elegida < 0 || r.elegida > 3) {
      throw new ErrorAcademia('invalida', 'Elige una opción');
    }
    elegida = r.elegida;
    correcta = r.elegida === p.correcta;
  }

  await db.insert(respuestas).values({
    intentoId,
    usuarioId,
    preguntaId,
    elegida,
    correcta,
    seguridad: i.tipo === 'diagnostico' ? (r.seguridad ?? 'lo-se') : (r.seguridad ?? null),
    segundos: r.segundos === undefined ? null : Math.max(0, Math.round(r.segundos)),
    creado: ahora,
  });

  if (RETROALIMENTACION[i.tipo] !== 'inmediata') return {registrada: true};
  await actualizarRepaso(db, usuarioId, preguntaId, correcta, ahora);
  return {
    registrada: true,
    correcta,
    correctaIndex: p.correcta,
    solucion: (p.solucion as number[] | null) ?? null,
    explicacion: p.explicaciones[elegida ?? p.correcta],
    explicacionCorrecta: p.explicaciones[p.correcta],
  };
}

export interface Parcial {
  id: string;
  nombre: string;
  aciertos: number;
  total: number;
}

export interface Resultado {
  intentoId: string;
  tipo: TipoIntento;
  referencia: string | null;
  puntaje: number;
  aciertos: number;
  total: number;
  porUnidad: Parcial[];
  porTema: Parcial[];
  /** Diagnóstico de entrada: dónde quedó ubicado en cada unidad. */
  ubicacion?: {unidadId: string; nombre: string; nivel: number; categoria: Categoria}[];
  /** Prueba del tema: si quedó dominado. */
  dominado?: boolean;
  /** Diagnóstico del tema: si puede saltarlo («Ya lo sé»). */
  puedeSaltar?: boolean;
  /** Cuánto subió: preparación y nivel de cada tema, antes y después (se guarda la primera vez). */
  avance?: Avance;
  /** Corrección pregunta por pregunta (no en los diagnósticos). */
  correccion?: {pregunta: Pregunta; elegida: number | null; correcta: boolean}[];
}

/** Cierra el intento (si no estaba cerrado), aplica sus efectos y devuelve el resultado. Se puede llamar varias veces. */
export async function terminarIntento(db: Db, usuarioId: string, intentoId: string, ahora: Date = new Date()): Promise<Resultado> {
  const i = await intentoPropio(db, usuarioId, intentoId);
  const ps = await preguntasEnOrden(db, i.preguntaIds);
  const rs = await db.select().from(respuestas).where(eq(respuestas.intentoId, i.id));
  const porPregunta = new Map(rs.map((r) => [r.preguntaId, r]));
  const aciertos = rs.filter((r) => r.correcta).length;
  const total = ps.length;
  const puntaje = total ? Math.round((aciertos / total) * 100) : 0;

  const temaIds = [...new Set(ps.map((p) => p.temaId))];
  const info = temaIds.length
    ? await db
        .select({temaId: temas.id, temaNombre: temas.nombre, unidadId: unidades.id, unidadNombre: unidades.nombre, unidadOrden: unidades.orden})
        .from(temas)
        .innerJoin(unidades, eq(unidades.id, temas.unidadId))
        .where(inArray(temas.id, temaIds))
    : [];
  const infoTema = new Map(info.map((t) => [t.temaId, t]));

  const agrupar = (clave: (p: Pregunta) => {id: string; nombre: string}) => {
    const m = new Map<string, Parcial>();
    for (const p of ps) {
      const {id, nombre} = clave(p);
      const g = m.get(id) ?? {id, nombre, aciertos: 0, total: 0};
      g.total += 1;
      if (porPregunta.get(p.id)?.correcta) g.aciertos += 1;
      m.set(id, g);
    }
    return [...m.values()];
  };
  const porUnidad = agrupar((p) => ({id: infoTema.get(p.temaId)!.unidadId, nombre: infoTema.get(p.temaId)!.unidadNombre}));
  const porTema = agrupar((p) => ({id: p.temaId, nombre: infoTema.get(p.temaId)!.temaNombre}));

  const res: Resultado = {intentoId: i.id, tipo: i.tipo, referencia: i.referencia, puntaje, aciertos, total, porUnidad, porTema};

  const primeraVez = !i.terminado;
  // Foto de antes: preparación y nivel de los temas que toca (para mostrar cuánto subió).
  const especialidadId = primeraVez ? await especialidadDe(db, usuarioId) : null;
  const prepAntes = especialidadId ? await preparacion(db, usuarioId, especialidadId) : 0;
  const nivelesAntes = primeraVez ? await nivelesDe(db, usuarioId, temaIds) : null;
  if (primeraVez) {
    await db.update(intentos).set({terminado: ahora, puntaje}).where(eq(intentos.id, i.id));
  }

  switch (i.tipo) {
    case 'diagnostico': {
      // Ubicación tema por tema: cada tema de la ficha tiene al menos una pregunta en el diagnóstico.
      // El valor de cada respuesta pesa la seguridad con que se dio. Un tema sin preguntas toma el promedio de su unidad.
      const valorDe = (p: (typeof ps)[number]) => {
        const r = porPregunta.get(p.id);
        return r ? valorDiagnostico(r.correcta, r.seguridad) : 0;
      };
      const promedio = (xs: number[]) => xs.reduce((s, v) => s + v, 0) / (xs.length || 1);
      const ubicacion = [];
      for (const u of porUnidad) {
        const delaUnidad = ps.filter((p) => infoTema.get(p.temaId)!.unidadId === u.id);
        const promUnidad = promedio(delaUnidad.map(valorDe));
        ubicacion.push({unidadId: u.id, nombre: u.nombre, nivel: Math.round(promUnidad * NIVEL_MAX_DIAGNOSTICO), categoria: categoriaDe(promUnidad)});
        if (primeraVez) {
          const temasDeUnidad = await db.select({id: temas.id}).from(temas).where(eq(temas.unidadId, u.id));
          for (const t of temasDeUnidad) {
            const delTema = delaUnidad.filter((p) => p.temaId === t.id);
            const nivel = Math.round((delTema.length ? promedio(delTema.map(valorDe)) : promUnidad) * NIVEL_MAX_DIAGNOSTICO);
            const d = await dominioDe(db, usuarioId, t.id);
            if (!d || d.estado === 'sin-empezar') await fijarDominio(db, usuarioId, t.id, {nivel});
          }
        }
      }
      res.ubicacion = ubicacion;
      // Lo que falló en el diagnóstico vuelve al día siguiente en su repaso, ya con la explicación.
      if (primeraVez) {
        for (const p of ps) if (!porPregunta.get(p.id)?.correcta) await actualizarRepaso(db, usuarioId, p.id, false, ahora);
      }
      break;
    }
    case 'diagnostico-tema': {
      res.puedeSaltar = puntaje >= UMBRAL_DOMINIO;
      if (primeraVez) {
        const d = await dominioDe(db, usuarioId, i.referencia!);
        await fijarDominio(db, usuarioId, i.referencia!, {
          nivel: Math.max(d?.nivel ?? 0, Math.round((puntaje * NIVEL_MAX_DIAGNOSTICO) / 100)),
          estado: d?.estado === 'dominado' ? 'dominado' : 'aprendiendo',
        });
      }
      break;
    }
    case 'prueba-tema': {
      res.dominado = puntaje >= UMBRAL_DOMINIO;
      if (primeraVez) {
        await fijarDominio(db, usuarioId, i.referencia!, {nivel: puntaje, estado: res.dominado ? 'dominado' : 'aprendiendo'});
      }
      break;
    }
    case 'practica': {
      if (primeraVez) for (const t of temaIds) await marcarAprendiendo(db, usuarioId, t);
      break;
    }
    case 'repaso': {
      if (primeraVez) {
        for (const p of ps) {
          const d = await dominioDe(db, usuarioId, p.temaId);
          if (d?.estado === 'dominado' && porPregunta.get(p.id)?.correcta === false) {
            await fijarDominio(db, usuarioId, p.temaId, {estado: 'repasar'});
          }
        }
      }
      break;
    }
    case 'simulacro': {
      if (primeraVez) {
        for (const p of ps) await actualizarRepaso(db, usuarioId, p.id, porPregunta.get(p.id)?.correcta ?? false, ahora);
      }
      break;
    }
  }

  if (primeraVez && especialidadId && nivelesAntes) {
    const nivelesDespues = await nivelesDe(db, usuarioId, temaIds);
    const cambios = porTema.map((t) => ({id: t.id, nombre: t.nombre, antes: nivelesAntes.get(t.id)?.nivel ?? 0, despues: nivelesDespues.get(t.id)?.nivel ?? 0}));
    const prepDespues = await anotarPreparacion(db, usuarioId, especialidadId, ahora);
    await db.update(intentos).set({prepAntes, prepDespues, cambios}).where(eq(intentos.id, i.id));
    res.avance = {preparacionAntes: prepAntes, preparacionDespues: prepDespues, temas: cambios};
  } else if (i.prepAntes !== null && i.prepDespues !== null && i.cambios) {
    res.avance = {preparacionAntes: i.prepAntes, preparacionDespues: i.prepDespues, temas: i.cambios};
  }

  if (RETROALIMENTACION[i.tipo] !== 'ninguna') {
    res.correccion = ps.map((p) => ({pregunta: p, elegida: porPregunta.get(p.id)?.elegida ?? null, correcta: porPregunta.get(p.id)?.correcta ?? false}));
  }
  return res;
}
