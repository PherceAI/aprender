import {randomBytes} from 'node:crypto';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';

// npm run cuentas: genera claves para la cuenta de administrador y la del docente de demo, en local.
// Las deja en .env.local (Next las lee al arrancar y crea las cuentas) y en data-local/credenciales-demo.txt.
// Ninguno de los dos archivos se sube al repositorio.

const clave = () => randomBytes(9).toString('base64url');
const env: Record<string, string> = {};
if (existsSync('.env.local')) {
  for (const linea of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const m = linea.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  }
}
env.SESSION_SECRET ||= randomBytes(32).toString('hex');
env.ADMIN_CORREO ||= 'admin@rutadocente.local';
env.ADMIN_CLAVE ||= clave();
env.DEMO_CORREO ||= 'docente@rutadocente.local';
env.DEMO_CLAVE ||= clave();
env.DEMO_NOMBRE ||= 'Docente de prueba';

writeFileSync('.env.local', Object.entries(env).map(([k, v]) => `${k}=${v}`).join('\n') + '\n');
writeFileSync(
  'data-local/credenciales-demo.txt',
  `Cuentas locales de Ruta Docente (no subir)\n\nAdministrador: ${env.ADMIN_CORREO} / ${env.ADMIN_CLAVE}\nDocente de demo: ${env.DEMO_CORREO} / ${env.DEMO_CLAVE}\n`
);
console.log('Cuentas listas en .env.local y data-local/credenciales-demo.txt (se crean al arrancar el servidor).');
