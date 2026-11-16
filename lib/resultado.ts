import type {TipoIntento} from './intentos';
import type {Siguiente} from './ruta';

/** El botón principal del resultado: a dónde lleva y con un texto que dice exactamente eso. */
export function destinoResultado(sig: Siguiente, tipo: TipoIntento, referencia: string | null): {href: string; texto: string} {
  if (sig.tipo === 'leccion') return {href: `/leccion/${sig.leccionId}`, texto: `Seguir: lección ${sig.numero} de ${sig.temaNombre}`};
  if (sig.tipo === 'prueba-tema') return {href: `/curso/${sig.temaId}`, texto: `Ir a la prueba de ${sig.temaNombre}`};
  const temaId = tipo === 'prueba-tema' || tipo === 'diagnostico-tema' ? referencia : tipo === 'practica' && referencia ? referencia.replace(/-\d+$/, '') : null;
  if (temaId) return {href: `/curso/${temaId}`, texto: 'Ver el tema'};
  return {href: '/inicio', texto: 'Volver al inicio'};
}
