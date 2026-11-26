import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {ImageResponse} from 'next/og';

// La vista previa que sale al compartir el enlace en WhatsApp, Facebook, etc.
export const alt = 'Pragma: prepárate para la Evaluación del Desempeño Docente 2027';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

const NARANJA = '#f0360a';

async function comoDato(archivo: string, tipo: string) {
  const b = await readFile(path.join(process.cwd(), 'public', archivo));
  return `data:${tipo};base64,${b.toString('base64')}`;
}

export default async function Imagen() {
  const [simbolo, foto] = await Promise.all([comoDato('marca/pragma-simbolo-naranja.png', 'image/png'), comoDato('landing/docente-aula.jpg', 'image/jpeg')]);
  return new ImageResponse(
    (
      <div style={{display: 'flex', width: '100%', height: '100%', background: '#ffffff'}}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 680, padding: '64px 40px 60px 72px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <img src={simbolo} width={56} height={56} alt="" />
            <span style={{fontSize: 40, fontWeight: 700, color: '#171717', letterSpacing: '-0.03em'}}>Pragma</span>
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span style={{fontSize: 60, fontWeight: 700, lineHeight: 1.04, color: '#171717', letterSpacing: '-0.04em'}}>Prepárate para tu</span>
            <span style={{fontSize: 60, fontWeight: 700, lineHeight: 1.04, color: NARANJA, letterSpacing: '-0.04em'}}>evaluación docente</span>
            <span style={{marginTop: 22, fontSize: 30, lineHeight: 1.3, color: '#525252'}}>Lecciones, práctica y simulacros para el examen de 2027.</span>
          </div>
          <div style={{display: 'flex'}}>
            <span style={{display: 'flex', alignItems: 'center', height: 64, padding: '0 32px', borderRadius: 999, background: NARANJA, color: '#ffffff', fontSize: 28, fontWeight: 700}}>
              Empieza gratis
            </span>
          </div>
        </div>
        <div style={{display: 'flex', flex: 1, padding: 24}}>
          <img src={foto} alt="" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 28}} />
        </div>
      </div>
    ),
    size,
  );
}
