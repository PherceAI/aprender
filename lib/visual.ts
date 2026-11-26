// La identidad visual de cada unidad: una ilustración 3D (Fluent, MIT) y su color.
// Así cada unidad se reconoce igual en Inicio, Mi ruta, el tema y Mi progreso.

export type Visual = {img: string; color: string; suave: string; degradado: string};

const V = (img: string, color: string, suave: string, degradado: string): Visual => ({img: `/ilustraciones/${img}.png`, color, suave, degradado});

type Tinta = [color: string, suave: string, degradado: string];
const MATEMATICA: Tinta = ['#2563eb', '#ecf2ff', 'linear-gradient(135deg,#d4e2ff,#93b4fb)'];
const LENGUA: Tinta = ['#c0267a', '#fdf0f6', 'linear-gradient(135deg,#ffd6ea,#f39ac6)'];
const NATURALES: Tinta = ['#15803d', '#e9f8ef', 'linear-gradient(135deg,#ccf3dc,#7fd8a4)'];
const SOCIALES: Tinta = ['#b45309', '#fff6e5', 'linear-gradient(135deg,#ffe9c2,#f8c26b)'];
const asignatura = ([color, suave, degradado]: Tinta, imgs: Record<string, string>) =>
  Object.fromEntries(Object.entries(imgs).map(([id, img]) => [id, V(img, color, suave, degradado)]));

const UNIDAD: Record<string, Visual> = {
  'gen-fundamentos': V('brain', '#c0267a', '#fdf0f6', 'linear-gradient(135deg,#ffd6ea,#f39ac6)'),
  'gen-curriculo': V('clipboard', '#b45309', '#fff6e5', 'linear-gradient(135deg,#ffe9c2,#f8c26b)'),
  'gen-ensenanza': V('light_bulb', '#a16207', '#fef9e3', 'linear-gradient(135deg,#fff2b8,#f6d55c)'),
  'gen-digitales': V('laptop', '#2563eb', '#ecf2ff', 'linear-gradient(135deg,#d4e2ff,#93b4fb)'),
  'gen-internet': V('shield', '#4f46e5', '#eef0ff', 'linear-gradient(135deg,#dcdcff,#a5a8f6)'),
  'cn-seres-vivos': V('microbe', '#15803d', '#e9f8ef', 'linear-gradient(135deg,#ccf3dc,#7fd8a4)'),
  'cn-cuerpo-humano': V('anatomical_heart', '#c81e1e', '#fdeeee', 'linear-gradient(135deg,#ffd9d9,#f59a9a)'),
  'cn-materia-energia': V('atom_symbol', '#7c3aed', '#f4efff', 'linear-gradient(135deg,#e6dcff,#b79cf7)'),
  'cn-tierra-universo': V('ringed_planet', '#c2410c', '#fff1eb', 'linear-gradient(135deg,#ffe0cf,#fbab83)'),
  // EGB 2.º a 7.º: un color por asignatura y una ilustración por unidad.
  ...asignatura(MATEMATICA, {'egb-algebra': 'abacus', 'egb-geometria': 'triangular_ruler', 'egb-estadistica': 'bar_chart'}),
  ...asignatura(LENGUA, {
    'egb-lengua-cultura': 'globe_showing_americas', 'egb-comunicacion-oral': 'speech_balloon', 'egb-lectura': 'open_book',
    'egb-escritura': 'memo', 'egb-literatura': 'scroll',
  }),
  ...asignatura(NATURALES, {'egb-seres-vivos': 'seedling', 'egb-cuerpo-humano': 'anatomical_heart', 'egb-materia': 'atom_symbol', 'egb-tierra': 'volcano'}),
  ...asignatura(SOCIALES, {'egb-historia': 'classical_building', 'egb-espacio': 'world_map', 'egb-convivencia': 'balance_scale'}),
};

const POR_DEFECTO = V('books', '#f0360a', '#fff1eb', 'linear-gradient(135deg,#ffd9c8,#ff9d77)');

export function visualDeUnidad(unidadId: string): Visual {
  return UNIDAD[unidadId] ?? POR_DEFECTO;
}

/** Ilustraciones sueltas para las pantallas. */
export const ILUSTRACION = {
  leccion: '/ilustraciones/microscope.png',
  ruta: '/ilustraciones/books.png',
  trofeo: '/ilustraciones/trophy.png',
  reloj: '/ilustraciones/stopwatch.png',
  fuego: '/ilustraciones/fire.png',
  diana: '/ilustraciones/diana.png',
  repaso: '/ilustraciones/brain.png',
  graduacion: '/ilustraciones/graduation_cap.png',
  adn: '/ilustraciones/dna.png',
};
