# Lista de lanzamiento de Pragma

Lo que se revisa antes de abrir la plataforma a docentes reales, y antes de cada publicación importante.
✅ = hecho y comprobado · ⬜ = pendiente (del dueño o de una próxima tanda).

## 1. Antes de publicar (en la computadora)
- ✅ `npm test`: 81 pruebas (cuentas, acceso gratis/pago, diagnóstico, prueba de tema, repaso, simulacro, pagos, Google, modo revisión, doble envío).
- ✅ `npx next build` compila sin errores. JavaScript por página: 103 a 119 KB.
- ✅ `npx tsc --noEmit` sin errores de tipos.
- ✅ El contenido se valida al arrancar (`contenido/validar.ts`): si una pregunta está mal armada, el servidor no carga nada a medias.

## 2. Después de publicar
- ✅ `npm run verificar`: páginas públicas, páginas privadas que piden sesión, comprobantes protegidos, encabezados de seguridad, 404, robots y sitemap. Sale con error si algo falla.
- ✅ Registros de Coolify al arrancar: `[arranque] 31 temas, 70 lecciones, 108 preguntas` y sin errores.

## 3. Datos y dinero
- ✅ Idempotencia: terminar un intento, responder, avisar un pago, registrarse, entrar con Google y elegir lecciones gratis no se duplican con doble toque, dos pestañas o recarga.
- ✅ Un solo pago en revisión por docente (índice único en la base). Aprobar dos veces no hace nada.
- ✅ Las migraciones corren solas al arrancar; la de pagos limpia duplicados antes de crear su índice.
- ✅ Respaldo diario de Postgres en Coolify: 3:00 a. m. de Ecuador, guarda los últimos 14 (probado el 25 nov).
- ⬜ Probar un pago real de punta a punta: aviso del docente → aprobar en Panel → se abre todo.

## 4. Seguridad
- ✅ Todas las acciones de administrador exigen la cuenta de administrador; las fotos de comprobantes solo las ve el administrador.
- ✅ Sesión firmada con `SESSION_SECRET` (sin valor por defecto en producción). Límite de intentos en ingreso y registro.
- ✅ Encabezados: HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy; sin `X-Powered-By`.
- ✅ HTTP redirige a HTTPS.
- ⬜ Cambiar el secreto de Google (quedó escrito en un chat).
- ✅ Cuenta demo bloqueada: queda `DEMO_CORREO` sin `DEMO_CLAVE` y al arrancar se le pone una contraseña al azar.
- ✅ Modo revisión apagado (sin `REVISION_CLAVE` ni `REVISION_PUBLICA`).

## 5. Experiencia del docente
- ✅ Páginas de error y 404 en español, con «Intentar de nuevo» e «Ir al inicio».
- ✅ Sin scroll horizontal en el teléfono (portada, Inicio, lecciones, pagos).
- ✅ La app instalable no guarda páginas ni la API: siempre muestra datos frescos.
- ⬜ «¿Olvidaste tu contraseña?»: hoy no existe (solo Google o pedir ayuda).
- ✅ Botón de WhatsApp en la portada, el ingreso, el registro y la plataforma (`components/whatsapp.tsx`).
- ⬜ Aviso de privacidad y términos (la Ley Orgánica de Protección de Datos Personales pide informar qué datos se guardan y para qué).

## 6. Buscadores y difusión
- ✅ `robots.txt` deja indexar la portada, el registro y el ingreso; la plataforma por dentro no.
- ✅ `sitemap.xml`.
- ✅ Imagen para compartir en WhatsApp y redes (`app/opengraph-image.tsx`).

## 7. Contenido
- ✅ Abiertos con lecciones y preguntas: Anatomía celular y los 4 temas de Conocimientos digitales.
- ⬜ Faltan 6 temas pedagógicos y 20 de Ciencias Naturales. Todo el contenido escrito lo debe revisar el docente experto.
