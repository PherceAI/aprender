import {writeFileSync} from 'node:fs';
import {Resvg} from '@resvg/resvg-js';

// npm run iconos: genera los íconos de la app (PWA) desde la marca: cuadro lima con el ícono «ruta» (Lucide).
const glifo = (escala: number, dx: number, dy: number) =>
  `<g transform="translate(${dx} ${dy}) scale(${escala})" fill="none" stroke="#16181a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></g>`;
const svg = (lado: number, radio: number, enmascarable = false) => {
  const g = enmascarable ? lado * 0.5 : lado * 0.62;
  const esc = g / 24;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="0 0 ${lado} ${lado}"><rect width="${lado}" height="${lado}" rx="${radio}" fill="#d9f26b"/>${glifo(esc, (lado - g) / 2, (lado - g) / 2)}</svg>`;
};
const png = (s: string) => new Resvg(s).render().asPng();
writeFileSync('public/icons/icon-192.png', png(svg(192, 44)));
writeFileSync('public/icons/icon-512.png', png(svg(512, 116)));
writeFileSync('public/icons/maskable-512.png', png(svg(512, 0, true)));
writeFileSync('app/apple-icon.png', png(svg(180, 0)));
writeFileSync('app/icon.svg', svg(64, 15));
console.log('íconos listos');
