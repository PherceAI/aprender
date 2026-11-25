// Botón flotante de WhatsApp: abre el chat con el número de Pragma y un mensaje ya escrito
// que dice desde dónde escribe la persona (y quién es, si ya tiene cuenta).

// Número en formato internacional, solo dígitos (Ecuador: 593 + número sin el 0 inicial).
// Vacío = el botón no aparece.
export const WHATSAPP_NUMERO = '593999869634';

type Props = {
  /** Si la persona ya entró, va su nombre y correo en el mensaje. */
  usuario?: {nombre: string; correo: string};
  /** En la plataforma el botón sube para no tapar la barra inferior del teléfono. */
  sobreBarra?: boolean;
};

export function enlaceWhatsApp(usuario?: Props['usuario']) {
  const texto = usuario
    ? `Hola, soy ${usuario.nombre} (${usuario.correo}). Les escribo desde la plataforma Pragma.`
    : 'Hola, les escribo desde la página de Pragma. Quisiera información sobre la preparación para la Evaluación Docente.';
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
}

export function BotonWhatsApp({usuario, sobreBarra}: Props) {
  if (!WHATSAPP_NUMERO) return null;
  return (
    <a
      href={enlaceWhatsApp(usuario)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      title="Escríbenos por WhatsApp"
      className={`group fixed right-4 z-40 inline-flex h-14 items-center gap-2.5 rounded-full bg-[#25d366] pr-[18px] pl-[17px] text-[15px] font-semibold text-white shadow-[0_10px_28px_-12px_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:right-6 ${
        sobreBarra ? 'bottom-[calc(80px+env(safe-area-inset-bottom))] lg:bottom-6' : 'bottom-[calc(16px+env(safe-area-inset-bottom))] sm:bottom-6'
      }`}
    >
      <svg viewBox="0 0 32 32" width="24" height="24" aria-hidden fill="currentColor" className="shrink-0">
        <path d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.29.6 4.53 1.74 6.5L3 29l6.68-1.75A12.97 12.97 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.8c-1.98 0-3.92-.53-5.61-1.54l-.4-.24-3.96 1.04 1.06-3.86-.26-.4A10.77 10.77 0 0 1 5.2 16c0-5.97 4.86-10.83 10.84-10.83 5.97 0 10.8 4.86 10.8 10.83 0 5.98-4.83 10.8-10.8 10.8Zm5.94-8.1c-.33-.16-1.93-.95-2.23-1.06-.3-.11-.52-.16-.73.16-.22.33-.84 1.06-1.03 1.28-.19.22-.38.24-.7.08-.33-.16-1.38-.51-2.62-1.62-.97-.86-1.62-1.93-1.81-2.26-.19-.33-.02-.5.14-.67.15-.15.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.16-.73-1.77-1-2.42-.27-.64-.54-.55-.73-.56h-.63c-.22 0-.57.08-.87.41-.3.33-1.14 1.11-1.14 2.72 0 1.6 1.17 3.15 1.33 3.37.16.22 2.3 3.5 5.56 4.91.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.93-.79 2.2-1.55.27-.76.27-1.41.19-1.55-.08-.14-.3-.22-.63-.38Z" />
      </svg>
      <span className="hidden sm:inline">¿Dudas? Escríbenos</span>
    </a>
  );
}
