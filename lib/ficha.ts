import {WHATSAPP_NUMERO} from '@/components/whatsapp';
// Las fichas técnicas oficiales del Ineval 2026 (públicas), una por especialidad, servidas desde /public.
// Cada referencia apunta a la página exacta del PDF para que el docente compruebe de dónde sale el contenido.

type Ficha = {url: string; paginas: {componentes: number; temario: number; generales: number; disciplinares: number}; temas: Record<string, number>};

const GENERALES_PEDAGOGICOS = ['teorias-aprendizaje', 'dua', 'planificacion-curricular', 'evaluacion-educativa', 'metodologias', 'tecnicas'];
const de = (ids: string[], pagina: number) => Object.fromEntries(ids.map((id) => [id, pagina]));

const FICHAS: Record<string, Ficha> = {
  // Ciencias Naturales EGB Superior (revisado contra el PDF el 15 nov).
  'ccnn-egb-superior': {
    url: '/ficha-tecnica-ccnn.pdf',
    paginas: {componentes: 2, temario: 3, generales: 4, disciplinares: 5},
    temas: {
      ...de(GENERALES_PEDAGOGICOS, 4),
      rea: 4, 'medios-digitales': 4, 'herramientas-digitales': 5, 'riesgos-digitales': 5,
      'propiedades-seres-vivos': 5, 'organizacion-materia-viva': 5,
      'anatomia-celular': 6, 'fisiologia-celular': 6, histologia: 6, 'clasificacion-seres-vivos': 6, 'flujos-energia': 6,
      evolucion: 6, 'ambientes-interaccion': 6, 'reproduccion-humana': 6, 'aparatos-sistemas': 6,
      'sistema-inmunologico': 7, 'salud-sexual': 7, patogenos: 7, 'carbono-biomoleculas': 7, 'movimiento-fuerza': 7,
      'origen-universo': 7, 'ciclos-biogeoquimicos': 7, 'efectos-antropicos': 7, 'origen-vida': 7, 'cambios-geologicos': 7,
    },
  },
  // Educación General Básica 2.º a 7.º (revisado contra el PDF el 26 nov).
  'egb-elemental-media': {
    url: '/ficha-tecnica-egb.pdf',
    paginas: {componentes: 2, temario: 3, generales: 4, disciplinares: 6},
    temas: {
      ...de(GENERALES_PEDAGOGICOS, 4),
      ...de(['rea', 'medios-digitales', 'herramientas-digitales', 'riesgos-digitales'], 5),
      ...de(['egb-conjuntos-numericos', 'egb-proporcionalidad', 'egb-figuras-geometricas', 'egb-cuerpos-geometricos', 'egb-recta-plano', 'egb-medidas', 'egb-estadistica-datos', 'egb-combinaciones'], 6),
      ...de(['egb-probabilidad', 'egb-variedades-linguisticas', 'egb-cultura-escrita', 'egb-lengua-interaccion', 'egb-expresion-oral', 'egb-comprension-textos', 'egb-uso-recursos', 'egb-produccion-textos', 'egb-literatura-contexto'], 7),
      ...de(['egb-clasificacion-animales', 'egb-plantas', 'egb-ecosistemas', 'egb-sistemas-cuerpo', 'egb-organos-sentidos', 'egb-materia-estados', 'egb-atmosfera-clima-suelo', 'egb-epoca-aborigen', 'egb-epoca-colonial'], 8),
      ...de(['egb-independencia', 'egb-periodo-republicano', 'egb-recursos-economicos', 'egb-geografia', 'egb-division-politica', 'egb-estado', 'egb-derechos', 'egb-diversidad-cultural'], 9),
    },
  },
};

/** La ficha de la especialidad (la de Ciencias Naturales si aún no eligió o no tiene una propia). */
export function fichaDe(especialidadId?: string | null): Ficha {
  return (especialidadId && FICHAS[especialidadId]) || FICHAS['ccnn-egb-superior'];
}

export function tieneFicha(especialidadId: string): boolean {
  return especialidadId in FICHAS;
}

export function enlaceFicha(pagina: number, especialidadId?: string | null): string {
  return `${fichaDe(especialidadId).url}#page=${pagina}`;
}

export function paginaDeTema(temaId: string, especialidadId?: string | null): number | null {
  return fichaDe(especialidadId).temas[temaId] ?? null;
}

/** Enlace a WhatsApp para pedir acceso. Se configura con CONTACTO_WHATSAPP (solo dígitos, con código de país). */
export function enlaceAcceso(): string | null {
  const n = (process.env.CONTACTO_WHATSAPP || WHATSAPP_NUMERO).replace(/\D/g, '');
  return n ? `https://wa.me/${n}?text=${encodeURIComponent('Hola, quiero mi acceso a Pragma.')}` : null;
}
