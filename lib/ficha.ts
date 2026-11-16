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

/** Enlace a WhatsApp para pedir acceso. Se configura con CONTACTO_WHATSAPP (solo dígitos, con código de país). */
export function enlaceAcceso(): string | null {
  const n = (process.env.CONTACTO_WHATSAPP ?? '').replace(/\D/g, '');
  return n ? `https://wa.me/${n}?text=${encodeURIComponent('Hola, quiero mi acceso a Ruta Docente.')}` : null;
}
