import type {MetadataRoute} from 'next';

// Para instalar la plataforma como app en el teléfono («Agregar a pantalla de inicio»).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ruta Docente',
    short_name: 'Ruta Docente',
    description: 'Prepárate para la Evaluación del Desempeño Docente con un método que se adapta a ti.',
    lang: 'es-EC',
    start_url: '/inicio',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#eceee6',
    theme_color: '#eceee6',
    icons: [
      {src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png'},
      {src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png'},
      {src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'},
    ],
  };
}
