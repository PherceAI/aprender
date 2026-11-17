import type {Metadata, Viewport} from 'next';
import {Instrument_Sans} from 'next/font/google';
import './globals.css';
import {cookies} from 'next/headers';
import {RegistrarSW} from '@/components/instalar';
import {ModoRevision} from '@/components/modo-revision';
import {COOKIE_REVISION, puedeComentar} from '@/lib/revision';

const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {default: 'Pragma', template: '%s · Pragma'},
  description: 'Prepárate para la Evaluación del Desempeño Docente con un método que se adapta a ti.',
  applicationName: 'Pragma',
  appleWebApp: {capable: true, title: 'Pragma', statusBarStyle: 'default'},
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

// Pone el tema antes de pintar (sin parpadeo): lo elegido por el docente; si no eligió, claro (decisión del dueño).
const TEMA = `try{var t=localStorage.getItem('tema');if(t!=='oscuro'){t='claro'}document.documentElement.dataset.tema=t}catch(e){document.documentElement.dataset.tema='claro'}`;

export default async function RootLayout({children}: {children: React.ReactNode}) {
  // Modo revisión: solo en el navegador que abrió el enlace del revisor y mientras exista REVISION_CLAVE.
  const revision = puedeComentar((await cookies()).get(COOKIE_REVISION)?.value);
  return (
    <html lang="es" className={instrument.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: TEMA}} />
      </head>
      <body className="min-h-dvh font-sans">
        {children}
        <RegistrarSW />
        {revision && <ModoRevision />}
      </body>
    </html>
  );
}
