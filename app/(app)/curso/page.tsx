import {redirect} from 'next/navigation';

// «Mi ruta» ahora vive en Inicio (decisión del dueño, 22 nov): la dirección vieja lleva allá.
export default function MiRuta() {
  redirect('/inicio#ruta');
}
