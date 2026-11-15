// Next.js llama a register() una vez al arrancar el servidor.
// La condición va así (no con un return temprano) para que Next deje fuera del runtime «edge» el código de Node.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const {arrancar} = await import('./lib/arranque');
    await arrancar();
  }
}
