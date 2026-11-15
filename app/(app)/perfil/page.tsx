import type {Metadata} from 'next';
import {Clock, Flame, ListChecks, LogOut, Target, BookCheck} from 'lucide-react';
import {accionSalir} from '@/app/acciones';
import {requerirDocente} from '@/lib/auth/cookies';
import {getDb} from '@/lib/db';
import {perfilDe} from '@/lib/perfil';
import {Anillo, btn} from '@/components/ui';
import {LeyendaDominio, MapaDominio, type UnidadMapa} from '@/components/mapa-dominio';

export const metadata: Metadata = {title: 'Perfil'};

export default async function Perfil() {
  const u = await requerirDocente();
  const p = await perfilDe(await getDb(), u.id);
  const unidades: UnidadMapa[] = [];
  for (const t of p.temas) {
    let un = unidades.find((x) => x.nombre === t.unidadNombre);
    if (!un) unidades.push((un = {id: t.unidadNombre, nombre: t.unidadNombre, temas: []}));
    un.temas.push({id: t.temaId, nombre: t.nombre, nivel: t.nivel, estado: t.estado, abierto: t.abierto});
  }
  const dominados = p.temas.filter((t) => t.estado === 'dominado').length;
  const datos = [
    {icono: Flame, valor: `${p.racha.dias}`, texto: p.racha.dias === 1 ? 'día de racha' : 'días de racha'},
    {icono: Target, valor: `${dominados}/31`, texto: 'temas dominados'},
    {icono: ListChecks, valor: `${p.totales.respondidas}`, texto: `preguntas · ${p.totales.acierto} % bien`},
    {icono: BookCheck, valor: `${p.totales.lecciones}`, texto: 'lecciones vistas'},
    {icono: Clock, valor: `${p.totales.minutos}`, texto: 'minutos practicando'},
  ];

  return (
    <div className="rise flex flex-col gap-6">
      <div className="card flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:p-7">
        <Anillo valor={p.preparacion} tam={128} grosor={12} etiqueta="Preparación" />
        <div className="min-w-0 flex-1">
          <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-ink sm:text-[32px]">{p.nombre}</h1>
          <p className="text-[15px] text-ink-2">
            {p.especialidad} · {p.correo}
          </p>
          <p className="mt-2 max-w-[56ch] text-[14px] leading-relaxed text-ink-3">Tu preparación es el dominio de los 31 temas, con el peso que cada bloque tiene en la evaluación.</p>
        </div>
        <form action={accionSalir} className="lg:hidden">
          <button className={`${btn.secondary} w-full`}>
            <LogOut size={17} /> Cerrar sesión
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {datos.map((d) => (
          <div key={d.texto} className="card p-4">
            <d.icono size={19} className="text-accent-ink" />
            <p className="num mt-2 text-[24px] font-semibold tracking-[-0.03em] text-ink">{d.valor}</p>
            <p className="text-[12.5px] leading-snug text-ink-3">{d.texto}</p>
          </div>
        ))}
      </div>

      <section className="card p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-ink">Tu mapa de dominio</h2>
          <LeyendaDominio />
        </div>
        <MapaDominio unidades={unidades} enlazar />
      </section>

      <section className="card p-5 sm:p-6">
        <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-ink">Lo que más se te complica</h2>
        {p.errores.length === 0 ? (
          <p className="mt-2 text-[14.5px] text-ink-3">Aún no hay errores que se repitan. Cuando los haya, aquí verás la explicación de cada uno.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {p.errores.map((e) => (
              <li key={e.preguntaId} className="rounded-ctl bg-surface-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[15px] leading-snug font-medium text-ink">{e.enunciado.replace('____', '___')}</p>
                  <span className="shrink-0 rounded-full bg-bad-soft px-2.5 py-0.5 text-[12px] font-semibold text-bad">{e.veces}×</span>
                </div>
                <p className="mt-2 text-[14px] text-ink-2">
                  <span className="font-semibold text-ok">Respuesta: </span>
                  {e.respuesta}
                </p>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-3">{e.porQue.replace(/^Correcto:\s*/, '')}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
