'use client';

import type {KeyboardEvent, ReactNode} from 'react';
import type {LabId} from '@/contenido/tipos';

// Célula animal y vegetal en SVG con zonas tocables. Es contenido interactivo (no decoración):
// el docente toca una parte para ver qué es, o para responder una pregunta sobre el dibujo.

export type EstadoZona = 'normal' | 'activa' | 'apagada' | 'correcta' | 'incorrecta' | 'hallada';

interface Props {
  lab: LabId;
  /** Estado visual de cada zona (por defecto «normal»). */
  estados?: Record<string, EstadoZona>;
  /** Zonas que se pueden tocar. Si no se da, todas. */
  tocables?: Set<string>;
  onToque?: (zona: string) => void;
  etiquetas?: Record<string, string>;
  className?: string;
}

const PALETA = `
.lab{--cito:#eef3ff;--membrana:#6f8cff;--pared:#86bf93;--nucleo:#c3ceff;--nucleolo:#5b6fd6;--mito:#f2a65a;--mito-in:#c9772c;--cloro:#5dbb72;--cloro-in:#2f8a48;--vacuola:#d3eaf8;--ret:#9c8ce0;--golgi:#e58fb0;--liso:#f0c24b;--ribo:#3a4256;--centriolo:#9a7b66;--plasmo:#4f8a5d}
[data-tema='oscuro'] .lab{--cito:#1a2234;--membrana:#8aa2ff;--pared:#3f7a50;--nucleo:#34479a;--nucleolo:#9fb2ff;--mito:#c7792f;--mito-in:#f2b67a;--cloro:#3e9b57;--cloro-in:#9be0ad;--vacuola:#1e3a4e;--ret:#8a7bd6;--golgi:#b8607f;--liso:#c39b2f;--ribo:#c7cede;--centriolo:#b79a86;--plasmo:#9be0ad}
.lab .zona[data-estado='apagada']{opacity:.28}
.lab .zona[data-estado='activa'] > *{stroke:var(--accent-ink);stroke-width:3}
.lab .zona[data-estado='correcta'] > *{stroke:var(--ok);stroke-width:3.5}
.lab .zona[data-estado='incorrecta'] > *{stroke:var(--bad);stroke-width:3.5}
.lab .zona[data-estado='hallada'] > *{stroke:var(--accent-ink);stroke-width:3}
`;

function Zona({id, nombre, estado = 'normal', tocable, onToque, children}: {id: string; nombre: string; estado?: EstadoZona; tocable: boolean; onToque?: (z: string) => void; children: ReactNode}) {
  const tecla = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToque?.(id);
    }
  };
  return (
    <g
      className={tocable ? 'zona' : undefined}
      data-zona={id}
      data-estado={estado}
      role={tocable ? 'button' : undefined}
      tabIndex={tocable ? 0 : undefined}
      aria-label={tocable ? nombre : undefined}
      onClick={tocable ? (e) => (e.stopPropagation(), onToque?.(id)) : undefined}
      onKeyDown={tocable ? tecla : undefined}
      style={tocable ? undefined : {pointerEvents: 'none'}}
    >
      {children}
    </g>
  );
}

function Mito({x, y, rot = 0, s = 1}: {x: number; y: number; rot?: number; s?: number}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse rx="26" ry="13" fill="var(--mito)" />
      <path d="M-18 0 q4 -8 8 0 t8 0 t8 0 t8 0" fill="none" stroke="var(--mito-in)" strokeWidth="2.2" strokeLinecap="round" />
    </g>
  );
}

function Cloro({x, y, rot = 0}: {x: number; y: number; rot?: number}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <ellipse rx="22" ry="11" fill="var(--cloro)" />
      {[-11, -3, 5, 13].map((dx) => (
        <rect key={dx} x={dx - 2.5} y="-5" width="5" height="10" rx="1.5" fill="var(--cloro-in)" />
      ))}
    </g>
  );
}

function Golgi({x, y, rot = 0}: {x: number; y: number; rot?: number}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} fill="none" stroke="var(--golgi)" strokeWidth="5" strokeLinecap="round">
      <path d="M-26 -12 q26 -14 52 0" />
      <path d="M-24 -3 q24 -13 48 0" />
      <path d="M-21 6 q21 -12 42 0" />
      <path d="M-17 15 q17 -10 34 0" />
      <circle cx="31" cy="-6" r="3.5" fill="var(--golgi)" stroke="none" />
      <circle cx="27" cy="12" r="3" fill="var(--golgi)" stroke="none" />
    </g>
  );
}

function Ribos({puntos}: {puntos: [number, number][]}) {
  return (
    <g fill="var(--ribo)">
      {puntos.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.4" />
      ))}
    </g>
  );
}

const NOMBRES: Record<string, string> = {
  pared: 'Pared celular',
  membrana: 'Membrana plasmática',
  citoplasma: 'Citoplasma',
  nucleo: 'Núcleo',
  nucleolo: 'Nucléolo',
  mitocondria: 'Mitocondria',
  ribosomas: 'Ribosomas',
  'reticulo-rugoso': 'Retículo endoplasmático rugoso',
  'reticulo-liso': 'Retículo endoplasmático liso',
  golgi: 'Aparato de Golgi',
  cloroplasto: 'Cloroplasto',
  vacuola: 'Vacuola central',
  plasmodesmos: 'Plasmodesmos',
  lisosoma: 'Lisosoma',
  centriolos: 'Centriolos',
};

export function Celula({lab, estados = {}, tocables, onToque, className = ''}: Props) {
  const z = (id: string) => ({id, nombre: NOMBRES[id], estado: estados[id], tocable: tocables ? tocables.has(id) : Boolean(onToque), onToque});
  const vegetal = lab === 'celula-vegetal';
  return (
    <div className={`lab ${className}`}>
      <style>{PALETA}</style>
      <svg viewBox="0 0 420 300" className="h-auto w-full" role="group" aria-label={vegetal ? 'Célula vegetal' : 'Célula animal'}>
        {vegetal ? (
          <>
            <Zona {...z('pared')}>
              <path
                fillRule="evenodd"
                fill="var(--pared)"
                d="M36 8 H384 A28 28 0 0 1 412 36 V264 A28 28 0 0 1 384 292 H36 A28 28 0 0 1 8 264 V36 A28 28 0 0 1 36 8 Z M40 22 H380 A18 18 0 0 1 398 40 V260 A18 18 0 0 1 380 278 H40 A18 18 0 0 1 22 260 V40 A18 18 0 0 1 40 22 Z"
              />
            </Zona>
            <Zona {...z('plasmodesmos')}>
              {[100, 200, 300].map((x) => (
                <rect key={`t${x}`} x={x - 3} y="7" width="6" height="17" rx="2" fill="var(--plasmo)" />
              ))}
              {[110, 190].map((y) => (
                <rect key={`l${y}`} x="7" y={y - 3} width="17" height="6" rx="2" fill="var(--plasmo)" />
              ))}
              <rect x="0" y="0" width="0" height="0" fill="none" />
            </Zona>
            <Zona {...z('citoplasma')}>
              <rect x="25" y="25" width="370" height="250" rx="16" fill="var(--cito)" />
            </Zona>
            <Zona {...z('membrana')}>
              <rect x="25" y="25" width="370" height="250" rx="16" fill="none" stroke="var(--membrana)" strokeWidth="3.5" />
              <rect x="25" y="25" width="370" height="250" rx="16" fill="none" stroke="transparent" strokeWidth="12" pointerEvents="stroke" />
            </Zona>
            <Zona {...z('vacuola')}>
              <path d="M178 78 C230 62 300 70 322 104 C342 138 330 188 292 206 C246 228 182 220 164 186 C148 154 140 92 178 78 Z" fill="var(--vacuola)" stroke="#9cc6e3" strokeWidth="1.5" />
            </Zona>
            <Zona {...z('nucleo')}>
              <circle cx="92" cy="112" r="42" fill="var(--nucleo)" />
            </Zona>
            <Zona {...z('nucleolo')}>
              <circle cx="100" cy="106" r="13" fill="var(--nucleolo)" />
            </Zona>
            <Zona {...z('reticulo-rugoso')}>
              <path d="M60 170 q10 -9 20 0 t20 0 t20 0 M64 182 q9 -8 18 0 t18 0 t18 0" fill="none" stroke="var(--ret)" strokeWidth="4.5" strokeLinecap="round" />
              <Ribos puntos={[[66, 165], [86, 165], [106, 165], [70, 189], [90, 189], [108, 189]]} />
            </Zona>
            <Zona {...z('reticulo-liso')}>
              <path d="M52 232 q14 -14 28 0 t28 0 M58 246 q12 -12 24 0 t24 0" fill="none" stroke="var(--ret)" strokeWidth="6" strokeLinecap="round" opacity=".8" />
            </Zona>
            <Zona {...z('golgi')}>
              <Golgi x={350} y={232} rot={-12} />
            </Zona>
            <Zona {...z('mitocondria')}>
              <Mito x={352} y={66} rot={28} />
              <Mito x={160} y={252} rot={-8} s={0.9} />
            </Zona>
            <Zona {...z('cloroplasto')}>
              <Cloro x={170} y={50} rot={-6} />
              <Cloro x={250} y={46} rot={4} />
              <Cloro x={356} y={150} rot={84} />
              <Cloro x={240} y={252} rot={-4} />
              <Cloro x={150} y={150} rot={70} />
            </Zona>
            <Zona {...z('ribosomas')}>
              <Ribos puntos={[[130, 70], [138, 82], [300, 236], [292, 250], [60, 64], [330, 120], [205, 238]]} />
            </Zona>
          </>
        ) : (
          <>
            <Zona {...z('citoplasma')}>
              <path d="M40 140 C30 70 110 18 210 20 C320 22 400 70 396 150 C392 230 316 284 206 282 C98 280 48 222 40 140 Z" fill="var(--cito)" />
            </Zona>
            <Zona {...z('membrana')}>
              <path d="M40 140 C30 70 110 18 210 20 C320 22 400 70 396 150 C392 230 316 284 206 282 C98 280 48 222 40 140 Z" fill="none" stroke="var(--membrana)" strokeWidth="3.5" />
              <path d="M40 140 C30 70 110 18 210 20 C320 22 400 70 396 150 C392 230 316 284 206 282 C98 280 48 222 40 140 Z" fill="none" stroke="transparent" strokeWidth="14" pointerEvents="stroke" />
            </Zona>
            <Zona {...z('nucleo')}>
              <circle cx="178" cy="144" r="48" fill="var(--nucleo)" />
            </Zona>
            <Zona {...z('nucleolo')}>
              <circle cx="188" cy="136" r="14" fill="var(--nucleolo)" />
            </Zona>
            <Zona {...z('reticulo-rugoso')}>
              <path d="M240 112 q8 12 0 24 t0 24 t0 24 M254 108 q8 14 0 28 t0 28 t0 28" fill="none" stroke="var(--ret)" strokeWidth="4.5" strokeLinecap="round" />
              <Ribos puntos={[[246, 118], [246, 142], [246, 166], [261, 116], [261, 146], [261, 176]]} />
            </Zona>
            <Zona {...z('reticulo-liso')}>
              <path d="M128 226 q14 -14 28 0 t28 0 M136 240 q12 -12 24 0 t24 0" fill="none" stroke="var(--ret)" strokeWidth="6" strokeLinecap="round" opacity=".8" />
            </Zona>
            <Zona {...z('golgi')}>
              <Golgi x={312} y={186} rot={-70} />
            </Zona>
            <Zona {...z('mitocondria')}>
              <Mito x={306} y={84} rot={22} />
              <Mito x={98} y={206} rot={-30} s={0.9} />
              <Mito x={262} y={246} rot={-10} s={0.85} />
            </Zona>
            <Zona {...z('lisosoma')}>
              {[
                [350, 140, 10],
                [96, 104, 9],
                [214, 222, 8],
              ].map(([x, y, r]) => (
                <g key={`${x}`}>
                  <circle cx={x} cy={y} r={r} fill="var(--liso)" />
                  <circle cx={x - 3} cy={y - 2} r="1.8" fill="var(--mito-in)" />
                  <circle cx={x + 3} cy={y + 2} r="1.6" fill="var(--mito-in)" />
                </g>
              ))}
            </Zona>
            <Zona {...z('centriolos')}>
              <g transform="translate(248 62)">
                <rect x="-14" y="-5" width="28" height="10" rx="3" fill="var(--centriolo)" />
                <rect x="-5" y="-14" width="10" height="28" rx="3" fill="var(--centriolo)" transform="translate(16 6)" />
              </g>
            </Zona>
            <Zona {...z('ribosomas')}>
              <Ribos puntos={[[120, 70], [132, 60], [330, 230], [96, 160], [350, 100], [180, 250], [290, 140]]} />
            </Zona>
          </>
        )}
      </svg>
    </div>
  );
}

export {NOMBRES as NOMBRES_ZONAS};
