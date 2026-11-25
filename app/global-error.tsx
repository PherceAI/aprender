'use client';

// Último recurso si falla hasta el diseño de la página: HTML simple, sin depender de nada más.
export default function ErrorGlobal({reset}: {error: Error; reset: () => void}) {
  return (
    <html lang="es">
      <body style={{fontFamily: 'system-ui, sans-serif', display: 'grid', placeItems: 'center', minHeight: '100dvh', margin: 0, padding: 16, textAlign: 'center'}}>
        <div>
          <h1 style={{fontSize: 24}}>Algo no salió bien</h1>
          <p style={{color: '#525252'}}>Tu avance está guardado. Intenta de nuevo en un momento.</p>
          <button type="button" onClick={reset} style={{marginTop: 16, height: 48, padding: '0 24px', borderRadius: 999, border: 0, background: '#f0360a', color: '#fff', fontSize: 15, fontWeight: 600}}>
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
