// Revisión rápida después de cada publicación: npm run verificar  (o: node scripts/verificar-produccion.mjs https://otro-dominio)
// Comprueba que las páginas públicas abren, que las privadas piden sesión, los encabezados de seguridad,
// la página 404, robots y sitemap, y que el servidor responde rápido. Sale con código 1 si algo falla.

const BASE = (process.argv[2] || 'https://pragma.automationpherce.cloud').replace(/\/$/, '');
const fallas = [];
const ok = (msg) => console.log(`  ✓ ${msg}`);
const mal = (msg) => {
  fallas.push(msg);
  console.log(`  ✗ ${msg}`);
};

async function pedir(ruta) {
  const t = Date.now();
  const r = await fetch(BASE + ruta, {redirect: 'manual'});
  return {r, ms: Date.now() - t, texto: r.status === 200 ? await r.text() : ''};
}

console.log(`Revisando ${BASE}\n`);

console.log('Páginas públicas');
for (const [ruta, debeTener] of [['/', 'Empieza gratis'], ['/ingresar', 'Iniciar sesión'], ['/registro', 'Empieza gratis'], ['/api/health', '']]) {
  const {r, ms, texto} = await pedir(ruta);
  if (r.status !== 200) mal(`${ruta} respondió ${r.status}`);
  else if (debeTener && !texto.includes(debeTener)) mal(`${ruta} no muestra «${debeTener}»`);
  else ok(`${ruta} abre (${ms} ms)`);
  if (ms > 3000) mal(`${ruta} tardó ${ms} ms`);
}

console.log('Páginas privadas piden sesión');
for (const ruta of ['/inicio', '/admin', '/admin/pagos', '/acceso', '/simulacro', '/curso/rea']) {
  const {r} = await pedir(ruta);
  const destino = r.headers.get('location') || '';
  if (r.status >= 300 && r.status < 400 && destino.includes('/ingresar')) ok(`${ruta} lleva a ingresar`);
  else mal(`${ruta} respondió ${r.status} sin pedir sesión`);
}
{
  const {r} = await pedir('/api/pagos/comprobante-prueba.jpg');
  if (r.status === 401) ok('los comprobantes de pago piden sesión');
  else mal(`/api/pagos respondió ${r.status} sin sesión`);
}

console.log('Seguridad y buscadores');
{
  const {r} = await pedir('/');
  for (const h of ['strict-transport-security', 'x-content-type-options', 'x-frame-options', 'referrer-policy']) {
    if (r.headers.get(h)) ok(`encabezado ${h}`);
    else mal(`falta el encabezado ${h}`);
  }
  if (r.headers.get('x-powered-by')) mal('se expone x-powered-by');
  else ok('no se expone el framework');
}
{
  const {r, texto} = await pedir('/no-existe-esta-pagina');
  if (r.status === 404) ok('la página 404 responde 404');
  else mal(`una página inexistente respondió ${r.status}`);
  void texto;
}
{
  const {texto} = await pedir('/robots.txt');
  if (/Allow: \/\n/.test(texto) || texto.includes('Allow: /')) ok('robots.txt deja indexar la portada');
  else mal('robots.txt bloquea la portada');
  const s = await pedir('/sitemap.xml');
  if (s.r.status === 200) ok('sitemap.xml existe');
  else mal(`sitemap.xml respondió ${s.r.status}`);
}

console.log(fallas.length ? `\n${fallas.length} problema(s).` : '\nTodo bien.');
process.exit(fallas.length ? 1 : 0);
