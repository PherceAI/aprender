// Service worker de Pragma: guarda lo básico para abrir la app instalada y muestra un aviso si no hay conexión.
// Las páginas siempre se piden a la red (los datos del docente cambian); solo sin conexión se usa lo guardado.
const CACHE = 'pragma-v2';
const BASICO = ['/sin-conexion', '/marca/pragma-simbolo.png', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BASICO)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const url = new URL(r.url);
  if (url.origin !== location.origin) return;
  // La API (comprobantes, QR, videos) siempre va a la red: no se guarda en el teléfono.
  if (url.pathname.startsWith('/api/')) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).catch(() => caches.match('/sin-conexion')));
    return;
  }
  // Recursos estáticos con huella (_next/static, íconos, imágenes): primero lo guardado.
  if (url.pathname.startsWith('/_next/static/') || /\.(png|svg|jpg|webp|woff2?)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(r).then(
        (g) =>
          g ||
          fetch(r).then((resp) => {
            if (resp.ok) {
              const copia = resp.clone();
              caches.open(CACHE).then((c) => c.put(r, copia));
            }
            return resp;
          })
      )
    );
  }
});
