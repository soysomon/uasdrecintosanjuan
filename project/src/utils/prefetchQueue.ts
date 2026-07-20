/**
 * prefetchQueue — precarga en segundo plano, por lotes, los chunks de rutas
 * que el visitante probablemente va a pedir a continuación.
 *
 * Cómo funciona:
 * 1. El bundle crítico (index + vendor-react + vendor-motion + la página actual)
 *    termina de cargar y pintar primero — eso no cambia.
 * 2. Recién entonces, en cada "hueco" de inactividad del navegador
 *    (`requestIdleCallback`), se dispara el siguiente `import()` de la cola.
 * 3. Si el usuario navega a algo ANTES de que le toque su turno en la cola,
 *    esa navegación real siempre gana: React Router dispara su propio
 *    `import()` de inmediato y el navegador da prioridad a la petición activa
 *    sobre cualquier prefetch en curso. Si el chunk ya se había precargado,
 *    la navegación es instantánea.
 */

type Importer = () => Promise<unknown>;

function idle(cb: () => void): void {
  const w = window as unknown as {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };
  if (typeof w.requestIdleCallback === 'function') {
    w.requestIdleCallback(cb, { timeout: 2000 });
  } else {
    // Safari no tiene requestIdleCallback — fallback razonable.
    setTimeout(cb, 300);
  }
}

/** Encola importadores dinámicos y los va disparando uno a uno en tiempos muertos. */
export function prefetchInBackground(importers: Importer[]): void {
  let i = 0;
  const step = () => {
    if (i >= importers.length) return;
    const run = importers[i++];
    run()
      .catch(() => {
        /* si falla el prefetch (offline, etc.) no es crítico — se reintentará al navegar */
      })
      .finally(() => idle(step));
  };
  idle(step);
}
