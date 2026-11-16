import {TrendingUp} from 'lucide-react';

// La preparación día a día. Dibujado en SVG desde el servidor: sin librerías y liviano en el teléfono.

function fechaCorta(dia: string) {
  const [a, m, d] = dia.split('-').map(Number);
  return new Intl.DateTimeFormat('es-EC', {day: 'numeric', month: 'short', timeZone: 'UTC'}).format(new Date(Date.UTC(a, m - 1, d)));
}

export function GraficoPreparacion({puntos}: {puntos: {dia: string; preparacion: number}[]}) {
  if (puntos.length < 2) {
    return (
      <div className="grid h-[180px] place-items-center rounded-[16px] bg-surface-2 px-6 text-center">
        <div>
          <TrendingUp size={24} className="mx-auto text-accent" />
          <p className="mt-2 text-[15px] font-semibold text-ink">Tu evolución aparece desde tu segundo día de estudio</p>
          <p className="mt-1 text-[13.5px] text-ink-2">Cada día que estudias anotamos tu preparación.</p>
        </div>
      </div>
    );
  }

  const W = 600;
  const H = 180;
  const pad = {x: 8, arriba: 14, abajo: 26};
  const x = (i: number) => pad.x + (i * (W - pad.x * 2)) / (puntos.length - 1);
  const y = (v: number) => pad.arriba + ((100 - v) * (H - pad.arriba - pad.abajo)) / 100;
  const linea = puntos.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.preparacion).toFixed(1)}`).join(' ');
  const area = `${linea} L${x(puntos.length - 1).toFixed(1)},${H - pad.abajo} L${x(0).toFixed(1)},${H - pad.abajo} Z`;
  const ultimo = puntos[puntos.length - 1];
  const primero = puntos[0];

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Tu preparación pasó de ${primero.preparacion} % a ${ultimo.preparacion} %`}>
        <defs>
          <linearGradient id="relleno-prep" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 50, 75].map((g) => (
          <line key={g} x1={pad.x} x2={W - pad.x} y1={y(g)} y2={y(g)} stroke="var(--line)" strokeDasharray="4 6" />
        ))}
        <path d={area} fill="url(#relleno-prep)" />
        <path d={linea} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {puntos.map((p, i) => (
          <circle key={p.dia} cx={x(i)} cy={y(p.preparacion)} r={i === puntos.length - 1 ? 6 : 3.5} fill={i === puntos.length - 1 ? 'var(--accent)' : 'var(--surface)'} stroke="var(--accent)" strokeWidth="2.5" />
        ))}
        <text x={pad.x} y={H - 6} fontSize="13" fill="var(--ink-3)">
          {fechaCorta(primero.dia)}
        </text>
        <text x={W - pad.x} y={H - 6} fontSize="13" fill="var(--ink-3)" textAnchor="end">
          {fechaCorta(ultimo.dia)}
        </text>
      </svg>
      <figcaption className="mt-2 text-[13.5px] text-ink-2">
        De {primero.preparacion} % a <strong className="text-ink">{ultimo.preparacion} %</strong> en {puntos.length} días de estudio.
      </figcaption>
    </figure>
  );
}
