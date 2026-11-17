import {and, asc, count, desc, eq, gte} from 'drizzle-orm';
import type {Seccion} from '../contenido/tipos';
import type {Db} from './db';
import {preguntas, temas, tutorMensajes} from './db/schema';
import {leccion} from './curso';
import {ErrorAcademia} from './intentos';
import {hoyEc} from './util';

// El tutor con IA. Responde solo con el contenido de la lección y del temario de la ficha.
// Nunca califica (la nota sale de la clave de respuestas). Sin GEMINI_API_KEY, no está disponible.

export const MAX_MENSAJES_DIA = 30;
const HISTORIAL = 10;

export type Mensaje = {rol: 'docente' | 'tutor'; texto: string};
export type Llamador = (sistema: string, mensajes: Mensaje[]) => Promise<string>;

export function tutorDisponible(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

/** Llamada a Gemini por su API REST. El modelo se puede cambiar con GEMINI_MODEL. */
export function llamarGemini(clave = process.env.GEMINI_API_KEY ?? '', modelo = process.env.GEMINI_MODEL || 'gemini-3.8-flash'): Llamador {
  return async (sistema, mensajes) => {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`, {
      method: 'POST',
      headers: {'content-type': 'application/json', 'x-goog-api-key': clave},
      body: JSON.stringify({
        systemInstruction: {parts: [{text: sistema}]},
        contents: mensajes.map((m) => ({role: m.rol === 'tutor' ? 'model' : 'user', parts: [{text: m.texto}]})),
        generationConfig: {temperature: 0.4, maxOutputTokens: 700, thinkingConfig: {thinkingBudget: 0}},
      }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) throw new Error(`El tutor no respondió (${res.status})`);
    const j = (await res.json()) as {candidates?: {content?: {parts?: {text?: string; thought?: boolean}[]}}[]};
    const texto = j.candidates?.[0]?.content?.parts?.filter((p) => !p.thought).map((p) => p.text ?? '').join('').trim();
    if (!texto) throw new Error('El tutor no respondió');
    return texto;
  };
}

const BASE = `Eres el tutor de Pragma, una plataforma donde docentes de Ecuador se preparan para la Evaluación del Desempeño Docente del Ineval (Dimensión 1: saberes disciplinares).
Hablas con un docente en ejercicio: trátalo de tú, con respeto y calidez, como un colega que sabe del tema.
Reglas:
- Responde en español sencillo, en 120 palabras o menos, sin títulos. Usa listas cortas solo si ayudan.
- Si la duda es amplia, primero haz una pregunta corta para saber qué entiende; si pide la respuesta, dásela y explica por qué.
- Cuando sirva, conecta con un ejemplo del aula o de la vida en Ecuador.
- Cíñete al tema de la lección y al temario del Ineval. Si te preguntan otra cosa, di amablemente que aquí solo ayudas con la preparación y vuelve al tema.
- No inventes datos, fechas ni normas. Si no estás seguro, dilo.
- No eres el Ineval ni hablas en su nombre.`;

function textoDeSecciones(secciones: Seccion[]): string {
  return secciones
    .map((s) => {
      switch (s.tipo) {
        case 'texto':
          return `${s.titulo ? `${s.titulo}: ` : ''}${s.texto}`;
        case 'puntos':
          return `${s.titulo ?? ''}\n${s.puntos.map((p) => `- ${p}`).join('\n')}`;
        case 'comparacion':
          return `${s.titulo ?? ''} (${s.columnas.join(' / ')})\n${s.filas.map((f) => `- ${f.aspecto}: ${f.a} / ${f.b}`).join('\n')}`;
        case 'aula':
          return `En el aula: ${s.texto}`;
        case 'clave':
          return `Idea clave: ${s.texto}`;
        case 'ejemplo':
          return `Ejemplo: ${s.situacion} Explicación: ${s.explicacion}`;
        case 'laboratorio':
          return `(Laboratorio interactivo: ${s.consigna})`;
      }
    })
    .join('\n\n');
}

export function instruccionesLeccion(l: {titulo: string; objetivo: string; tema: {nombre: string}; contenido: Seccion[]}): string {
  return `${BASE}\n\nTema: ${l.tema.nombre}. Lección: ${l.titulo}.\nObjetivo (de la ficha técnica): ${l.objetivo}\n\nContenido de la lección:\n${textoDeSecciones(l.contenido)}`;
}

async function usadosHoy(db: Db, usuarioId: string, ahora: Date): Promise<number> {
  const inicioDia = new Date(`${hoyEc(ahora)}T05:00:00Z`); // 00:00 en Ecuador
  const [{n}] = await db
    .select({n: count()})
    .from(tutorMensajes)
    .where(and(eq(tutorMensajes.usuarioId, usuarioId), eq(tutorMensajes.rol, 'docente'), gte(tutorMensajes.creado, inicioDia)));
  return n;
}

export type RespuestaTutor = {disponible: false} | {disponible: true; respuesta: string; restantes: number};

async function conLimite(db: Db, usuarioId: string, ahora: Date) {
  const usados = await usadosHoy(db, usuarioId, ahora);
  if (usados >= MAX_MENSAJES_DIA) {
    throw new ErrorAcademia('invalida', `Ya usaste tus ${MAX_MENSAJES_DIA} preguntas al tutor de hoy. Mañana sigues.`);
  }
  return MAX_MENSAJES_DIA - usados - 1;
}

export async function preguntarTutor(
  db: Db,
  usuarioId: string,
  leccionId: string,
  texto: string,
  op: {ahora?: Date; llamar?: Llamador} = {}
): Promise<RespuestaTutor> {
  const llamar = op.llamar ?? (tutorDisponible() ? llamarGemini() : null);
  if (!llamar) return {disponible: false};
  const ahora = op.ahora ?? new Date();
  const pregunta = texto.trim().slice(0, 1000);
  if (!pregunta) throw new ErrorAcademia('invalida', 'Escribe tu pregunta');
  const l = await leccion(db, usuarioId, leccionId);
  if (l === 'tema-cerrado') throw new ErrorAcademia('tema-cerrado', 'Este tema estará disponible próximamente');
  if (l === 'bloqueada' || l === 'por-elegir') throw new ErrorAcademia('bloqueado', 'Esta lección es parte del acceso completo');
  const restantes = await conLimite(db, usuarioId, ahora);

  const previos = await db
    .select({rol: tutorMensajes.rol, texto: tutorMensajes.texto})
    .from(tutorMensajes)
    .where(and(eq(tutorMensajes.usuarioId, usuarioId), eq(tutorMensajes.leccionId, leccionId)))
    .orderBy(desc(tutorMensajes.id))
    .limit(HISTORIAL);
  const respuesta = await llamar(instruccionesLeccion(l), [...previos.reverse(), {rol: 'docente', texto: pregunta}]);
  await db.insert(tutorMensajes).values([
    {usuarioId, leccionId, rol: 'docente', texto: pregunta, creado: ahora},
    {usuarioId, leccionId, rol: 'tutor', texto: respuesta, creado: new Date(ahora.getTime() + 1)},
  ]);
  return {disponible: true, respuesta, restantes};
}

export async function historialTutor(db: Db, usuarioId: string, leccionId: string): Promise<Mensaje[]> {
  return db
    .select({rol: tutorMensajes.rol, texto: tutorMensajes.texto})
    .from(tutorMensajes)
    .where(and(eq(tutorMensajes.usuarioId, usuarioId), eq(tutorMensajes.leccionId, leccionId)))
    .orderBy(asc(tutorMensajes.id));
}

/** «¿Por qué me equivoqué?»: explica a partir de la opción que eligió, sin repetir solo la explicación escrita. */
export async function porQueMeEquivoque(
  db: Db,
  usuarioId: string,
  preguntaId: string,
  elegida: number,
  op: {ahora?: Date; llamar?: Llamador} = {}
): Promise<RespuestaTutor> {
  const llamar = op.llamar ?? (tutorDisponible() ? llamarGemini() : null);
  if (!llamar) return {disponible: false};
  const ahora = op.ahora ?? new Date();
  const [p] = await db
    .select({pregunta: preguntas, tema: temas.nombre})
    .from(preguntas)
    .innerJoin(temas, eq(temas.id, preguntas.temaId))
    .where(eq(preguntas.id, preguntaId));
  if (!p) throw new ErrorAcademia('no-encontrado', 'Esa pregunta no existe');
  const restantes = await conLimite(db, usuarioId, ahora);
  const q = p.pregunta;
  const letras = 'ABCD';
  const sistema = `${BASE}\n\nTema: ${p.tema}. El docente respondió mal una pregunta de práctica. Explícale en 100 palabras o menos qué confusión hay detrás de la opción que eligió y cómo reconocer la correcta la próxima vez. Termina con un truco corto para recordarlo.`;
  const consulta = [
    `Pregunta: ${q.enunciado}`,
    q.elementos ? `Elementos: ${JSON.stringify(q.elementos)}` : '',
    ...q.opciones.map((o, i) => `${letras[i]}) ${o}`),
    `Elegí: ${letras[elegida] ?? '(sin responder)'}. La correcta es ${letras[q.correcta]}.`,
    `Explicación escrita de la correcta: ${q.explicaciones[q.correcta]}`,
    elegida >= 0 && elegida <= 3 ? `Explicación escrita de mi opción: ${q.explicaciones[elegida]}` : '',
  ]
    .filter(Boolean)
    .join('\n');
  const respuesta = await llamar(sistema, [{rol: 'docente', texto: consulta}]);
  await db.insert(tutorMensajes).values([
    {usuarioId, leccionId: null, rol: 'docente', texto: `¿Por qué me equivoqué? (${preguntaId})`, creado: ahora},
    {usuarioId, leccionId: null, rol: 'tutor', texto: respuesta, creado: new Date(ahora.getTime() + 1)},
  ]);
  return {disponible: true, respuesta, restantes};
}
