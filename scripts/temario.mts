import {writeFileSync} from 'node:fs';
import {CONTENIDO} from '../contenido/index.ts';

// npm run temario: escribe docs/temario.md con el mapa del curso que está cargado (para revisarlo sin abrir código).
const L: string[] = ['# Temario cargado', '', 'Generado desde `contenido/` con `npm run temario`. Para revisar, no para editar.', ''];
for (const e of CONTENIDO.especialidades) L.push(`- **${e.nombre}** (${e.nivel}): ${e.estado === 'activa' ? 'activa' : 'próximamente'}`);
L.push('');
for (const b of CONTENIDO.bloques) {
  L.push(`## ${b.nombre} · ${b.preguntasExamen} preguntas en ${b.minutosExamen} min${b.compartido ? ' · compartido por todas las especialidades' : ''}`, '');
  for (const [ui, u] of b.unidades.entries()) {
    L.push(`### ${u.nombre}`, '');
    for (const t of u.temas) {
      const n = CONTENIDO.preguntas.filter((p) => p.temaId === t.id).length;
      L.push(`- **${t.nombre}**${t.abierto ? ' · ✅ abierto en la demo' : ''}${n ? ` · ${n} preguntas` : ''}`);
      for (const l of t.lecciones) L.push(`  - ${l.titulo}: ${l.objetivo}`);
    }
    L.push('');
  }
}
const usos = ['diagnostico', 'diagnostico-tema', 'practica', 'prueba', 'simulacro'] as const;
L.push('## Banco de preguntas', '', `${CONTENIDO.preguntas.length} preguntas en total.`, '');
for (const u of usos) L.push(`- ${u}: ${CONTENIDO.preguntas.filter((p) => p.usos.includes(u)).length}`);
writeFileSync('docs/temario.md', L.join('\n') + '\n');
console.log('docs/temario.md listo');
