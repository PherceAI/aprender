// La Dimensión 1 (saberes disciplinares): la única que les falta rendir a los docentes, en el examen de 2027.
// Las dimensiones 2, 3 y 4 ya se aplicaron (dato del dueño, 16 nov). Cifras de la ficha técnica oficial del
// Ineval (fuentes/, págs. 2 a 7; el PDF se titula «Evaluación del Desempeño Docente 2026 - Fase 1»).

export const AÑO_EXAMEN = 2027;

export type Prueba = {
  nombre: string;
  detalle: string;
  preguntas: number;
  minutos: number;
  partes: {nombre: string; temas: number}[];
};

export const PRUEBAS: Prueba[] = [
  {
    nombre: 'Conocimientos generales',
    detalle: 'Comunes a todas las especialidades.',
    preguntas: 39,
    minutos: 45,
    partes: [
      {nombre: 'Pedagógicos', temas: 6},
      {nombre: 'Digitales', temas: 4},
    ],
  },
  {
    nombre: 'Conocimientos de tu especialidad',
    detalle: 'Ciencias Naturales, EGB Superior.',
    preguntas: 60,
    minutos: 120,
    partes: [
      {nombre: 'Los seres vivos y su ambiente', temas: 9},
      {nombre: 'Cuerpo humano y salud', temas: 5},
      {nombre: 'Materia y energía', temas: 2},
      {nombre: 'La Tierra y el Universo', temas: 5},
    ],
  },
];

export const FORMATOS = ['Simple', 'Completamiento', 'Selección de elementos', 'Ordenamiento', 'Emparejamiento'];
