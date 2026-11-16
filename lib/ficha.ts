// La ficha técnica oficial del Ineval 2026 (pública) servida desde /public.
// Cada referencia apunta a la página exacta del PDF para que el docente compruebe de dónde sale el contenido.

export const FICHA_URL = '/ficha-tecnica-ccnn.pdf';

export function enlaceFicha(pagina: number): string {
  return `${FICHA_URL}#page=${pagina}`;
}

/** Páginas de la ficha de Ciencias Naturales EGB Superior. */
export const PAGINAS_FICHA = {
  componentes: 2,
  generales: 4,
  disciplinares: 5,
} as const;

/** Página de la ficha donde aparece cada tema (revisado contra el PDF el 15 nov). */
const PAGINA_TEMA: Record<string, number> = {
  'teorias-aprendizaje': 4, dua: 4, 'planificacion-curricular': 4, 'evaluacion-educativa': 4, metodologias: 4, tecnicas: 4,
  rea: 4, 'medios-digitales': 4, 'herramientas-digitales': 5, 'riesgos-digitales': 5,
  'propiedades-seres-vivos': 5, 'organizacion-materia-viva': 5,
  'anatomia-celular': 6, 'fisiologia-celular': 6, histologia: 6, 'clasificacion-seres-vivos': 6, 'flujos-energia': 6,
  evolucion: 6, 'ambientes-interaccion': 6, 'reproduccion-humana': 6, 'aparatos-sistemas': 6,
  'sistema-inmunologico': 7, 'salud-sexual': 7, patogenos: 7, 'carbono-biomoleculas': 7, 'movimiento-fuerza': 7,
  'origen-universo': 7, 'ciclos-biogeoquimicos': 7, 'efectos-antropicos': 7, 'origen-vida': 7, 'cambios-geologicos': 7,
};

export function paginaDeTema(temaId: string): number | null {
  return PAGINA_TEMA[temaId] ?? null;
}

/** Enlace a WhatsApp para pedir acceso. Se configura con CONTACTO_WHATSAPP (solo dígitos, con código de país). */
export function enlaceAcceso(): string | null {
  const n = (process.env.CONTACTO_WHATSAPP ?? '').replace(/\D/g, '');
  return n ? `https://wa.me/${n}?text=${encodeURIComponent('Hola, quiero mi acceso a Pragma.')}` : null;
}
