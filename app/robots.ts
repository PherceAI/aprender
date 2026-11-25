import type {MetadataRoute} from 'next';
import {URL_PUBLICA} from '@/lib/revision';

// Los buscadores ven la portada, el registro y el ingreso; la plataforma por dentro, no.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {userAgent: '*', allow: ['/', '/registro', '/ingresar'], disallow: ['/api/', '/inicio', '/curso', '/leccion', '/practicar', '/diagnostico', '/repaso', '/simulacro', '/perfil', '/evaluacion', '/acceso', '/admin', '/bienvenida', '/revision']},
    sitemap: `${URL_PUBLICA}/sitemap.xml`,
  };
}
