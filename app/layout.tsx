import type {Metadata, Viewport} from 'next';
import {Instrument_Sans} from 'next/font/google';
import './globals.css';

const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {default: 'Ruta Docente', template: '%s · Ruta Docente'},
  description: 'Prepárate para la Evaluación del Desempeño Docente con un método que se adapta a ti.',
  applicationName: 'Ruta Docente',
  appleWebApp: {capable: true, title: 'Ruta Docente', statusBarStyle: 'default'},
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: '#f2f4f8'},
    {media: '(prefers-color-scheme: dark)', color: '#0d1017'},
  ],
};

// Pone el tema antes de pintar (sin parpadeo): lo elegido por el docente; si no eligió, claro (decisión del dueño).
const TEMA = `try{var t=localStorage.getItem('tema');if(t!=='oscuro'){t='claro'}document.documentElement.dataset.tema=t}catch(e){document.documentElement.dataset.tema='claro'}`;

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={instrument.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: TEMA}} />
      </head>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
