import {getDb} from './db';
import {sembrar} from './db/sembrar';
import {asegurarUsuario} from './usuarios';

// Al arrancar el servidor: migra la base, carga el contenido y deja listas las cuentas del entorno.
// En Coolify las cuentas salen de variables: ADMIN_CORREO/ADMIN_CLAVE y DEMO_CORREO/DEMO_CLAVE.

export async function arrancar() {
  const db = await getDb();
  const r = await sembrar(db);
  const cuentas: string[] = [];
  const env = process.env;
  if (env.ADMIN_CORREO && env.ADMIN_CLAVE) {
    await asegurarUsuario(db, {nombre: env.ADMIN_NOMBRE || 'Administración', correo: env.ADMIN_CORREO, clave: env.ADMIN_CLAVE, rol: 'admin'});
    cuentas.push('administrador');
  }
  if (env.DEMO_CORREO && env.DEMO_CLAVE) {
    await asegurarUsuario(db, {nombre: env.DEMO_NOMBRE || 'Docente de prueba', correo: env.DEMO_CORREO, clave: env.DEMO_CLAVE, rol: 'docente'});
    cuentas.push('docente de demo');
  }
  console.log(`[arranque] ${r.temas} temas, ${r.lecciones} lecciones, ${r.preguntas} preguntas${cuentas.length ? `; cuentas: ${cuentas.join(', ')}` : ''}`);
}
