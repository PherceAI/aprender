import path from 'node:path';
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Fija la raíz del proyecto: hay otros package-lock.json en carpetas superiores de este PC.
  outputFileTracingRoot: path.resolve(__dirname),
  devIndicators: false,
  // PGlite (Postgres en WASM, solo en local) no se empaqueta: se carga tal cual desde node_modules.
  serverExternalPackages: ['@electric-sql/pglite', 'pg'],
  eslint: {ignoreDuringBuilds: true},
  // Fotos de comprobantes y el QR de Deuna (hasta 6 MB) llegan por acciones del servidor.
  experimental: {serverActions: {bodySizeLimit: '7mb'}},
  poweredByHeader: false,
  // Los metadatos (manifiesto, ícono de iPhone, título, vista previa) van siempre en el <head>.
  // Desde 15.2, en páginas dinámicas Next los manda al <body> y ahí Chrome y Safari no ven el manifiesto:
  // la app deja de poder instalarse. El layout raíz lee cookies (modo revisión), así que todo es dinámico.
  htmlLimitedBots: /.*/,
  // Encabezados de seguridad básicos para todo el sitio.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains'},
          {key: 'X-Content-Type-Options', value: 'nosniff'},
          {key: 'X-Frame-Options', value: 'SAMEORIGIN'},
          {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
          {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()'},
        ],
      },
    ];
  },
};

export default nextConfig;
