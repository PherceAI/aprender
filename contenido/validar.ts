import {LABORATORIOS, zonasDe} from './laboratorios';
import type {Contenido, Pregunta} from './tipos';

// Revisa que el contenido de una especialidad esté completo y coherente antes de sembrarlo.
// Si devuelve errores, no se siembra nada: una pregunta mal armada no llega a un docente.

const LETRAS = 'abcdefghij';

/** «1, 3 y 4»: así escribe el Ineval las opciones de selección de elementos. */
export function listaNumeros(indices: number[]): string {
  const n = indices.map((i) => String(i + 1));
  return n.length <= 1 ? n.join('') : `${n.slice(0, -1).join(', ')} y ${n[n.length - 1]}`;
}

/** «2, 1, 4, 3»: una secuencia de ordenamiento. */
export function listaOrden(indices: number[]): string {
  return indices.map((i) => String(i + 1)).join(', ');
}

/** «1b, 2a, 3c»: parejas de emparejamiento. */
export function listaParejas(derechaPorFila: number[]): string {
  return derechaPorFila.map((d, i) => `${i + 1}${LETRAS[d]}`).join(', ');
}

const MIN_DIAGNOSTICO_TEMA = 3;
const MIN_PRUEBA_TEMA = 8;

export function validarContenido(c: Contenido): string[] {
  const errores: string[] = [];
  const err = (m: string) => errores.push(m);

  // Ids únicos por tipo
  const repetidos = (tipo: string, ids: string[]) => {
    const vistos = new Set<string>();
    for (const id of ids) {
      if (vistos.has(id)) err(`${tipo} «${id}»: id repetido`);
      vistos.add(id);
    }
  };
  const unidades = c.bloques.flatMap((b) => b.unidades);
  const temas = unidades.flatMap((u) => u.temas);
  const lecciones = temas.flatMap((t) => t.lecciones.map((l) => ({...l, temaId: t.id})));
  repetidos('Bloque', c.bloques.map((b) => b.id));
  repetidos('Unidad', unidades.map((u) => u.id));
  repetidos('Tema', temas.map((t) => t.id));
  repetidos('Lección', lecciones.map((l) => l.id));
  repetidos('Pregunta', c.preguntas.map((p) => p.id));

  const bloqueIds = new Set(c.bloques.map((b) => b.id));
  for (const e of c.especialidades) {
    for (const b of e.bloques) if (!bloqueIds.has(b)) err(`Especialidad «${e.id}»: el bloque «${b}» no existe`);
  }

  const temaIds = new Set(temas.map((t) => t.id));
  const leccionTema = new Map(lecciones.map((l) => [l.id, l.temaId]));
  for (const l of lecciones) {
    for (const s of l.contenido ?? []) {
      if (s.tipo === 'laboratorio' && !(s.lab in LABORATORIOS)) err(`Lección «${l.id}»: laboratorio «${s.lab}» desconocido`);
      if (s.tipo === 'ejemplo' && (!s.situacion.trim() || !s.explicacion.trim())) err(`Lección «${l.id}»: un ejemplo necesita la situación y su explicación`);
    }
  }

  for (const p of c.preguntas) validarPregunta(p, temaIds, leccionTema, err);

  // Un bloque que mezcla asignaturas (EGB 2.º a 7.º) las dice en todas sus unidades, o en ninguna.
  for (const b of c.bloques) {
    const con = b.unidades.filter((u) => u.asignatura?.trim()).length;
    if (con && con < b.unidades.length) err(`Bloque «${b.id}»: si una unidad tiene asignatura, todas deben tenerla`);
  }

  // Diagnóstico de entrada: al menos una pregunta por cada tema de las especialidades activas, para ubicar
  // al docente tema por tema. Una especialidad «próximamente» puede cargar su temario antes que sus preguntas.
  const bloquesActivos = new Set(c.especialidades.filter((e) => e.estado === 'activa').flatMap((e) => e.bloques));
  const diagPorTema = new Map<string, number>(
    c.bloques.filter((b) => bloquesActivos.has(b.id)).flatMap((b) => b.unidades.flatMap((u) => u.temas.map((t) => [t.id, 0] as const)))
  );
  for (const p of c.preguntas) {
    if (p.usos.includes('diagnostico') && diagPorTema.has(p.temaId)) diagPorTema.set(p.temaId, diagPorTema.get(p.temaId)! + 1);
  }
  for (const [t, n] of diagPorTema) {
    if (n < 1) err(`Tema «${t}»: el diagnóstico necesita al menos una pregunta`);
  }

  // Temas abiertos: lecciones con contenido y preguntas propias suficientes
  for (const t of temas.filter((x) => x.abierto)) {
    for (const l of t.lecciones) {
      if (!l.contenido?.length) err(`Lección «${l.id}»: el tema «${t.id}» está abierto pero la lección no tiene contenido`);
    }
    const propias = c.preguntas.filter((p) => p.temaId === t.id);
    const diag = propias.filter((p) => p.usos.includes('diagnostico-tema')).length;
    const prueba = propias.filter((p) => p.usos.includes('prueba')).length;
    if (diag < MIN_DIAGNOSTICO_TEMA) err(`Tema «${t.id}»: necesita al menos ${MIN_DIAGNOSTICO_TEMA} preguntas de diagnostico-tema y tiene ${diag}`);
    if (prueba < MIN_PRUEBA_TEMA) err(`Tema «${t.id}»: necesita al menos ${MIN_PRUEBA_TEMA} preguntas de prueba y tiene ${prueba}`);
  }

  return errores;
}

function validarPregunta(
  p: Pregunta,
  temaIds: Set<string>,
  leccionTema: Map<string, string>,
  err: (m: string) => void
) {
  const q = `Pregunta «${p.id}»`;
  if (!temaIds.has(p.temaId)) err(`${q}: el tema «${p.temaId}» no existe`);
  if (p.leccionId !== undefined && leccionTema.get(p.leccionId) !== p.temaId) {
    err(`${q}: la lección «${p.leccionId}» no existe o es de otro tema`);
  }
  if (!p.enunciado.trim()) err(`${q}: enunciado vacío`);

  const ops = p.opciones.map((o) => o.trim());
  if (ops.length !== 4 || ops.some((o) => !o) || new Set(ops).size !== 4) {
    err(`${q}: necesita 4 opciones distintas y no vacías`);
  }
  if (p.explicaciones.length !== 4 || p.explicaciones.some((e) => !e.trim())) {
    err(`${q}: necesita 4 explicaciones, una por opción`);
  }
  if (![0, 1, 2, 3].includes(p.correcta)) err(`${q}: la correcta debe ser 0, 1, 2 o 3`);
  if (!p.usos.length) err(`${q}: sin usos`);

  const correcta = ops[p.correcta];
  const sol = p.solucion ?? [];
  switch (p.formato) {
    case 'completamiento':
      if (!p.enunciado.includes('____')) err(`${q}: el completamiento necesita el espacio ____`);
      break;
    case 'seleccion': {
      const els = Array.isArray(p.elementos) ? p.elementos : [];
      const ordenada = [...new Set(sol)].sort((a, b) => a - b);
      if (els.length < 3 || !sol.length || ordenada.length !== sol.length || sol.some((i) => i < 0 || i >= els.length)) {
        err(`${q}: la selección necesita 3 o más elementos y una solución válida`);
      } else if (correcta !== listaNumeros(ordenada)) {
        err(`${q}: la opción correcta «${correcta}» no coincide con la solución «${listaNumeros(ordenada)}»`);
      }
      break;
    }
    case 'ordenamiento': {
      const els = Array.isArray(p.elementos) ? p.elementos : [];
      const esOrdenCompleto = sol.length === els.length && new Set(sol).size === els.length && sol.every((i) => i >= 0 && i < els.length);
      if (els.length < 3 || !esOrdenCompleto) {
        err(`${q}: el ordenamiento necesita 3 o más elementos y una solución con todos ellos`);
      } else if (correcta !== listaOrden(sol)) {
        err(`${q}: la opción correcta «${correcta}» no coincide con la solución «${listaOrden(sol)}»`);
      }
      break;
    }
    case 'emparejamiento': {
      const cols = p.elementos && !Array.isArray(p.elementos) ? p.elementos : null;
      const valida =
        cols &&
        cols.izquierda.length >= 2 &&
        cols.derecha.length >= cols.izquierda.length &&
        sol.length === cols.izquierda.length &&
        new Set(sol).size === sol.length &&
        sol.every((d) => d >= 0 && d < cols.derecha.length);
      if (!valida) {
        err(`${q}: el emparejamiento necesita columnas y una solución con una pareja por fila`);
      } else if (correcta !== listaParejas(sol)) {
        err(`${q}: la opción correcta «${correcta}» no coincide con la solución «${listaParejas(sol)}»`);
      }
      break;
    }
    case 'simple':
      break;
  }

  if (p.dibujo) {
    if (!(p.dibujo.lab in LABORATORIOS)) {
      err(`${q}: laboratorio «${p.dibujo.lab}» desconocido`);
    } else {
      const zonas = zonasDe(p.dibujo.lab);
      for (const z of p.dibujo.zonas) if (!zonas.has(z)) err(`${q}: la zona «${z}» no existe en ${p.dibujo.lab}`);
      if (new Set(p.dibujo.zonas).size !== 4) err(`${q}: las 4 zonas del dibujo deben ser distintas`);
    }
  }
}
