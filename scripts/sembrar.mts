import {getDb} from '../lib/db/index.ts';
import {sembrar} from '../lib/db/sembrar.ts';

// npm run sembrar: crea/migra la base (PGlite local o DATABASE_URL) y carga el contenido.
const db = await getDb();
const r = await sembrar(db);
console.log(`Listo: ${r.temas} temas, ${r.lecciones} lecciones y ${r.preguntas} preguntas.`);
process.exit(0);
