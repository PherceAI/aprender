// El núcleo para cualquier materia: una especialidad es solo datos con esta forma.
// Agregar Matemática o Lengua = escribir su carpeta en contenido/ con estos tipos; el motor no cambia.

export type Formato = 'simple' | 'completamiento' | 'seleccion' | 'ordenamiento' | 'emparejamiento';
export type Uso = 'diagnostico' | 'diagnostico-tema' | 'practica' | 'prueba' | 'simulacro';
export type Cuatro<T> = [T, T, T, T];

export interface Especialidad {
  id: string;
  nombre: string;
  nivel: string;
  estado: 'activa' | 'proximamente';
  orden: number;
  /** Ids de los bloques que rinde, en orden. «generales» lo comparten todas. */
  bloques: string[];
}

export interface Bloque {
  id: string;
  nombre: string;
  descripcion: string;
  compartido: boolean;
  preguntasExamen: number;
  minutosExamen: number;
  unidades: Unidad[];
}

export interface Unidad {
  id: string;
  nombre: string;
  temas: Tema[];
}

export interface Tema {
  id: string;
  nombre: string;
  /** Su contenido está listo para estudiar. */
  abierto?: boolean;
  lecciones: Leccion[];
}

export interface Leccion {
  id: string;
  titulo: string;
  /** El subtema de la ficha, dicho como lo que el docente va a lograr. */
  objetivo: string;
  minutos?: number;
  contenido?: Seccion[];
}

/** Piezas con las que se arma una lección. La interfaz decide cómo se ve cada una. */
export type Seccion =
  | {tipo: 'texto'; titulo?: string; texto: string}
  | {tipo: 'puntos'; titulo?: string; puntos: string[]}
  | {tipo: 'comparacion'; titulo?: string; columnas: [string, string]; filas: {aspecto: string; a: string; b: string}[]}
  | {tipo: 'laboratorio'; lab: LabId; consigna: string}
  | {tipo: 'aula'; texto: string}
  | {tipo: 'clave'; texto: string}
  /** Un caso de la vida diaria o del aula: el docente piensa por qué pasa y luego ve la explicación. */
  | {tipo: 'ejemplo'; titulo?: string; situacion: string; explicacion: string};

export type LabId = 'celula-animal' | 'celula-vegetal';

export interface Pregunta {
  id: string;
  temaId: string;
  leccionId?: string;
  formato: Formato;
  /** En «completamiento» el espacio en blanco se escribe ____ (cuatro guiones bajos). */
  enunciado: string;
  /** Selección y ordenamiento: lista numerada. Emparejamiento: dos columnas. */
  elementos?: string[] | {izquierda: string[]; derecha: string[]};
  /**
   * La respuesta en forma interactiva, con índices desde 0:
   * selección = los elementos correctos; ordenamiento = los elementos en su orden;
   * emparejamiento = para cada fila de la izquierda, su pareja de la derecha.
   */
  solucion?: number[];
  opciones: Cuatro<string>;
  correcta: 0 | 1 | 2 | 3;
  /** Por qué es correcta la buena, y qué confunde cada distractor. */
  explicaciones: Cuatro<string>;
  usos: Uso[];
  dificultad: 1 | 2 | 3;
  /** Pregunta sobre un dibujo: la opción i es la zona i del laboratorio. */
  dibujo?: {lab: LabId; zonas: Cuatro<string>};
}

export interface Contenido {
  especialidades: Especialidad[];
  bloques: Bloque[];
  preguntas: Pregunta[];
}
