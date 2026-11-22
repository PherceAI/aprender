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
};

export default nextConfig;
