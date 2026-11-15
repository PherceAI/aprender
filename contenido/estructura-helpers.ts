import type {Leccion, Seccion, Tema} from './tipos';

/** Escribe un tema en una línea por lección: [título, objetivo (el subtema de la ficha)]. */
export function tema(
  id: string,
  nombre: string,
  lecciones: [titulo: string, objetivo: string][],
  extra: {abierto?: boolean; contenido?: Record<number, Seccion[]>; minutos?: Record<number, number>} = {}
): Tema {
  return {
    id,
    nombre,
    abierto: extra.abierto,
    lecciones: lecciones.map(
      ([titulo, objetivo], i): Leccion => ({
        id: `${id}-${i + 1}`,
        titulo,
        objetivo,
        minutos: extra.minutos?.[i + 1] ?? 6,
        contenido: extra.contenido?.[i + 1],
      })
    ),
  };
}
