import type {Metadata} from 'next';
import Link from 'next/link';
import {BookCheck, Flame, ListChecks, Target} from 'lucide-react';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {gruposDeTemas, perfilDe} from '@/lib/perfil';
import {hoyEc} from '@/lib/util';
import {mapaCurso} from '@/lib/curso';
import {conHoy, historialPreparacion} from '@/lib/avance';
import {Anillo} from '@/components/ui';
import {GraficoPreparacion} from '@/components/grafico-preparacion';

export const metadata: Metadata = {title: 'Mi progreso'};

// Mi progreso: cuánto está preparado, cómo ha ido cambiando y qué temas tiene listos, en camino y por empezar.

function fecha(d: Date) {
  return new Intl.DateTimeFormat('es-EC', {day: 'numeric', month: 'short', timeZone: 'America/Guayaquil'}).format(d);
}

export default async function MiProgreso() {
  const u = await requerirDocente();
  const db = await getDb();
  const [p, mapa, historia] = await Promise.all([perfilDe(db, u.id), mapaCurso(db, u.id), historialPreparacion(db, u.id, 30)]);
  const {dominados, enCamino, porEmpezar} = gruposDeTemas(p.temas);
  const evolucion = conHoy(historia, hoyEc(new Date()), p.preparacion);
  const nombreTema = new Map(p.temas.map((t) => [t.temaId, t.nombre]));
  const historial = [
    ...p.pruebas.map((x) => ({tipo: 'Prueba del tema', nombre: nombreTema.get(x.temaId) ?? x.temaId, puntaje: x.puntaje, fecha: x.fecha})),
    ...p.simulacros.map((x) => ({tipo: 'Simulacro', nombre: `${x.preguntas} preguntas`, puntaje: x.puntaje, fecha: x.fecha})),
  ]
    .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
    .slice(0, 6);

  const datos = [
    {icono: Target, valor: `${dominados.length} de ${p.temas.length}`, texto: 'temas dominados'},
    {icono: ListChecks, valor: `${p.totales.respondidas}`, texto: `preguntas · ${p.totales.acierto} % bien`},
    {icono: Flame, valor: `${p.racha.dias}`, texto: p.racha.dias === 1 ? 'día de racha' : 'días de racha'},
    {icono: BookCheck, valor: `${p.totales.lecciones}`, texto: 'lecciones vistas'},
  ];

  return (
    <div className="rise flex flex-col gap-6">
      <div>
        <h1 className="text-[30px] font-semibold tracking-[-0.04em] text-ink sm:text-[36px]">Mi progreso</h1>
        <p className="mt-1.5 text-[16px] text-ink-2">Así vas en tu preparación para la evaluación docente.</p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <section className="card flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left xl:flex-col xl:text-center">
          <Anillo valor={p.preparacion} tam={150} grosor={13} etiqueta="Preparación" />
          <div>
            <p className="text-[18px] font-semibold text-ink">Tu preparación</p>
            <p className="mt-1 max-w-[36ch] text-[14.5px] leading-relaxed text-ink-2">
              Es tu dominio de los {p.temas.length} temas de la ficha, con el peso que cada prueba tiene en el examen. Sube cada vez que dominas un tema.
            </p>
          </div>
        </section>
        <section className="card p-5 sm:p-6">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Tu evolución</h2>
          <p className="mb-4 text-[14px] text-ink-2">Tu preparación en los últimos 30 días.</p>
          <GraficoPreparacion puntos={evolucion} />
        </section>
      </div>

      <section className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
        {datos.map((d) => (
          <div key={d.texto} className="card p-4">
            <d.icono size={20} className="text-accent" />
            <p className="mt-2 text-[22px] leading-none font-semibold tracking-[-0.03em] text-ink">{d.valor}</p>
            <p className="mt-1 text-[13px] text-ink-2">{d.texto}</p>
          </div>
        ))}
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Por prueba</h2>
        <ul className="mt-4 flex flex-col gap-4">
          {mapa.bloques.map((b) => (
            <li key={b.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-[15px] font-medium text-ink">{b.nombre}</span>
                <span className="text-[14.5px] font-semibold text-ink">{b.nivel} %</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-line-2">
                <div className="h-full rounded-full bg-accent" style={{width: `${b.nivel}%`}} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-3">
        {[
          {titulo: 'Dominados', lista: dominados, vacio: 'Aún ninguno. Con 80 % en la prueba de un tema, queda aquí.', punto: 'bg-ok'},
          {titulo: 'En camino', lista: enCamino, vacio: 'Los temas que vas estudiando aparecen aquí.', punto: 'bg-accent'},
          {titulo: 'Por empezar', lista: porEmpezar, vacio: '¡Ya empezaste todos!', punto: 'bg-ink-3'},
        ].map((g) => (
          <div key={g.titulo} className="card p-5">
            <h2 className="flex items-center justify-between text-[16px] font-semibold text-ink">
              <span className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${g.punto}`} /> {g.titulo}
              </span>
              <span className="text-[14px] text-ink-2">{g.lista.length}</span>
            </h2>
            {g.lista.length ? (
              <ul className="mt-3 flex flex-col">
                {g.lista.slice(0, 8).map((t) => (
                  <li key={t.temaId}>
                    <Link href={`/curso/${t.temaId}`} className="flex items-center justify-between gap-3 rounded-[10px] px-2 py-2 text-[14.5px] hover:bg-surface-2">
                      <span className="min-w-0 truncate text-ink">{t.nombre}</span>
                      <span className="shrink-0 text-[13px] text-ink-2">{t.nivel} %</span>
                    </Link>
                  </li>
                ))}
                {g.lista.length > 8 && (
                  <li>
                    <Link href="/curso" className="block px-2 py-2 text-[13.5px] font-semibold text-accent-ink">
                      y {g.lista.length - 8} más en Mi ruta
                    </Link>
                  </li>
                )}
              </ul>
            ) : (
              <p className="mt-3 text-[14px] text-ink-2">{g.vacio}</p>
            )}
          </div>
        ))}
      </section>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-2">
        <section className="card p-5 sm:p-6">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Lo que más se te complica</h2>
          {p.errores.length ? (
            <ul className="mt-4 flex flex-col gap-3">
              {p.errores.slice(0, 5).map((e) => (
                <li key={e.preguntaId} className="rounded-[14px] bg-surface-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[14.5px] leading-snug font-medium text-ink">{e.enunciado.replace('____', '___')}</p>
                    <span className="shrink-0 rounded-full bg-bad-soft px-2 py-0.5 text-[12px] font-bold text-bad">{e.veces}×</span>
                  </div>
                  <p className="mt-1.5 text-[13.5px] text-ink">
                    <span className="font-semibold text-ok">Respuesta: </span>
                    {e.respuesta}
                  </p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{e.porQue.replace(/^Correcto:\s*/, '')}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[14.5px] text-ink-2">Todavía no hay preguntas falladas en tus prácticas y pruebas.</p>
          )}
        </section>

        <section className="card p-5 sm:p-6">
          <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink">Tus pruebas y simulacros</h2>
          {historial.length ? (
            <ul className="mt-3 flex flex-col divide-y divide-line">
              {historial.map((h, i) => (
                <li key={i} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14.5px] font-medium text-ink">{h.nombre}</p>
                    <p className="text-[12.5px] text-ink-2">
                      {h.tipo} · {fecha(h.fecha)}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[13px] font-bold ${h.puntaje >= 80 ? 'bg-ok-soft text-ok' : 'bg-accent-soft text-accent-ink'}`}>{h.puntaje} %</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[14.5px] text-ink-2">Cuando hagas la prueba de un tema o un simulacro, tus resultados aparecen aquí.</p>
          )}
        </section>
      </div>
    </div>
  );
}
