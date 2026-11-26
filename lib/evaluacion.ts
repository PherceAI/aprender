import {CONTENIDO} from '../contenido';

// La Dimensión 1 (saberes disciplinares): la única que les falta rendir a los docentes, en el examen de 2027.
// Las dimensiones 2, 3 y 4 ya se aplicaron (dato del dueño, 16 nov). Las cifras salen de las fichas técnicas
// oficiales del Ineval (fuentes/) y de la nota técnica de calificación (docs/investigacion-ineval.md).

export const AÑO_EXAMEN = 2027;

export type Prueba = {
  nombre: string;
  detalle: string;
  preguntas: number;
  minutos: number;
  partes: {nombre: string; temas: number}[];
};

/** Unidades del bloque general que son de conocimientos digitales (18 preguntas); las demás son pedagógicas (21). */
const UNIDADES_DIGITALES = new Set(['gen-digitales', 'gen-internet']);

/** Nombre y nivel de una especialidad, para mostrarlos sin consultar la base. */
export function especialidadInfo(especialidadId: string | null | undefined) {
  const e = CONTENIDO.especialidades.find((x) => x.id === especialidadId);
  return e ? {id: e.id, nombre: e.nombre, nivel: e.nivel} : null;
}

/** Las dos pruebas que rinde el docente de una especialidad, sacadas del mismo contenido que estudia. */
export function pruebasDe(especialidadId: string): Prueba[] {
  const e = CONTENIDO.especialidades.find((x) => x.id === especialidadId) ?? CONTENIDO.especialidades[0];
  return e.bloques.map((id) => {
    const b = CONTENIDO.bloques.find((x) => x.id === id)!;
    const partes: Prueba['partes'] = [];
    const sumar = (nombre: string, temas: number) => {
      const p = partes.find((x) => x.nombre === nombre);
      if (p) p.temas += temas;
      else partes.push({nombre, temas});
    };
    for (const u of b.unidades) {
      if (b.compartido) sumar(UNIDADES_DIGITALES.has(u.id) ? 'Digitales' : 'Pedagógicos', u.temas.length);
      else sumar(u.asignatura ?? u.nombre, u.temas.length);
    }
    return b.compartido
      ? {nombre: 'Conocimientos generales', detalle: 'Pedagógicos y digitales. Comunes a todas las especialidades.', preguntas: b.preguntasExamen, minutos: b.minutosExamen, partes}
      : {nombre: 'Conocimientos de tu especialidad', detalle: `${e.nombre} · ${e.nivel}`, preguntas: b.preguntasExamen, minutos: b.minutosExamen, partes};
  });
}

/** Cuántos temas tiene el curso y cuánto dura su diagnóstico (una pregunta o más por tema). */
export function resumenCurso(especialidadId: string) {
  const e = CONTENIDO.especialidades.find((x) => x.id === especialidadId);
  const temaIds = new Set(
    (e?.bloques ?? []).flatMap((id) => CONTENIDO.bloques.find((b) => b.id === id)?.unidades.flatMap((u) => u.temas.map((t) => t.id)) ?? [])
  );
  const diagnostico = CONTENIDO.preguntas.filter((p) => p.usos.includes('diagnostico') && temaIds.has(p.temaId)).length;
  return {temas: temaIds.size, preguntasDiagnostico: diagnostico, minutosDiagnostico: Math.round((diagnostico * 0.75) / 5) * 5};
}

export const FORMATOS = ['Simple', 'Completamiento', 'Selección de elementos', 'Ordenamiento', 'Emparejamiento'];
