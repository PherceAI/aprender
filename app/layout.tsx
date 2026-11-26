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
  metadataBase: new URL('https://pragma.automationpherce.cloud'),
  openGraph: {siteName: 'Pragma', locale: 'es_EC', type: 'website', title: 'Pragma: prepárate para tu evaluación docente', description: 'Lecciones, práctica y simulacros para la Dimensión 1 del examen 2027. Empieza gratis.'},
  twitter: {card: 'summary_large_image'},
  title: {default: 'Pragma', template: '%s · Pragma'},
  description: 'Prepárate para la Evaluación del Desempeño Docente con un método que se adapta a ti.',
  applicationName: 'Pragma',
  appleWebApp: {capable: true, title: 'Pragma', statusBarStyle: 'default'},
  // Next solo escribe «mobile-web-app-capable»; los iPhone con iOS anterior al 16.4 necesitan además esta.
  other: {'apple-mobile-web-app-capable': 'yes'},
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

// Pone el tema antes de pintar (sin parpadeo): lo elegido por el docente; si no eligió, claro (decisión del dueño).
// Guarda el aviso de instalación del navegador apenas llega, aunque la página aún no termine de cargar.
const AVISO_INSTALAR = `window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__avisoInstalar=e;window.dispatchEvent(new Event('aviso-instalar'))})`;

const TEMA = `try{var t=localStorage.getItem('tema');if(t!=='oscuro'){t='claro'}document.documentElement.dataset.tema=t}catch(e){document.documentElement.dataset.tema='claro'}`;

export default async function RootLayout({children}: {children: React.ReactNode}) {
  // Modo revisión: solo en el navegador que abrió el enlace del revisor y mientras exista REVISION_CLAVE.
  const revision = puedeComentar((await cookies()).get(COOKIE_REVISION)?.value);
  return (
    <html lang="es" className={instrument.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: TEMA}} />
        <script dangerouslySetInnerHTML={{__html: AVISO_INSTALAR}} />
      </head>
      <body className="min-h-dvh font-sans">
        {children}
        <RegistrarSW />
        {revision && <ModoRevision />}
      </body>
    </html>
  );
}
