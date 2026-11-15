import type {LabId} from './tipos';

// Laboratorios interactivos: cada uno es un dibujo con zonas que se tocan.
// La interfaz (parte 3) dibuja las zonas; aquí está qué es cada una y para qué sirve.

export interface Zona {
  id: string;
  nombre: string;
  funcion: string;
}

const COMUNES: Zona[] = [
  {id: 'membrana', nombre: 'Membrana plasmática', funcion: 'Rodea la célula y controla qué entra y qué sale (permeabilidad selectiva).'},
  {id: 'citoplasma', nombre: 'Citoplasma', funcion: 'Medio acuoso donde están los organelos y ocurren muchas reacciones del metabolismo.'},
  {id: 'nucleo', nombre: 'Núcleo', funcion: 'Guarda el ADN y dirige la actividad de la célula.'},
  {id: 'nucleolo', nombre: 'Nucléolo', funcion: 'Dentro del núcleo; fabrica las subunidades de los ribosomas.'},
  {id: 'mitocondria', nombre: 'Mitocondria', funcion: 'Hace la respiración celular: obtiene energía (ATP) de la glucosa.'},
  {id: 'ribosomas', nombre: 'Ribosomas', funcion: 'Fabrican proteínas a partir de las instrucciones del ARN.'},
  {id: 'reticulo-rugoso', nombre: 'Retículo endoplasmático rugoso', funcion: 'Tiene ribosomas pegados; fabrica y transporta proteínas.'},
  {id: 'reticulo-liso', nombre: 'Retículo endoplasmático liso', funcion: 'Sin ribosomas; fabrica lípidos y ayuda a eliminar tóxicos.'},
  {id: 'golgi', nombre: 'Aparato de Golgi', funcion: 'Modifica, empaca y envía proteínas y lípidos a su destino.'},
];

export const LABORATORIOS: Record<LabId, {nombre: string; zonas: Zona[]}> = {
  'celula-animal': {
    nombre: 'Célula animal',
    zonas: [
      ...COMUNES,
      {id: 'lisosoma', nombre: 'Lisosoma', funcion: 'Contiene enzimas que digieren sustancias y organelos viejos.'},
      {id: 'centriolos', nombre: 'Centriolos', funcion: 'Organizan los microtúbulos que separan los cromosomas al dividirse la célula.'},
    ],
  },
  'celula-vegetal': {
    nombre: 'Célula vegetal',
    zonas: [
      ...COMUNES,
      {id: 'pared', nombre: 'Pared celular', funcion: 'Capa rígida de celulosa por fuera de la membrana: da forma y protección.'},
      {id: 'cloroplasto', nombre: 'Cloroplasto', funcion: 'Hace la fotosíntesis: con luz, agua y CO₂ fabrica glucosa y libera oxígeno.'},
      {id: 'vacuola', nombre: 'Vacuola central', funcion: 'Gran bolsa de agua y sustancias; mantiene la turgencia de la célula.'},
      {id: 'plasmodesmos', nombre: 'Plasmodesmos', funcion: 'Canales que atraviesan la pared y comunican células vecinas.'},
    ],
  },
};

export function zonasDe(lab: LabId): Set<string> {
  return new Set(LABORATORIOS[lab].zonas.map((z) => z.id));
}
