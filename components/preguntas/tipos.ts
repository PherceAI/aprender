import type {LabId} from '@/contenido/tipos';

// Lo que la pantalla de preguntas recibe del servidor (sin la respuesta correcta).

export type Formato = 'simple' | 'completamiento' | 'seleccion' | 'ordenamiento' | 'emparejamiento';

export interface PreguntaUI {
  id: string;
  formato: Formato;
  enunciado: string;
  elementos: string[] | {izquierda: string[]; derecha: string[]} | null;
  opciones: string[];
  dibujo: {lab: LabId; zonas: string[]} | null;
  tema: string;
}

export interface IntentoUI {
  id: string;
  tipo: 'diagnostico' | 'diagnostico-tema' | 'practica' | 'prueba-tema' | 'repaso' | 'simulacro';
  retroalimentacion: 'inmediata' | 'al-final' | 'ninguna';
  terminaEn: string | null;
  preguntas: PreguntaUI[];
  respondidas: Record<string, {elegida: number | null; correcta?: boolean}>;
}

/** Lo que el docente marcó: una opción o una respuesta interactiva. */
export type Marcado = {elegida: number} | {interactiva: number[]};
