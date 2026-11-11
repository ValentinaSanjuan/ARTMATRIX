// Mejora de usabilidad (USR-02): saber si el servidor ya despertó para avisarle al estudiante
// mientras espera, y visitarlo periódicamente para que no se vuelva a dormir mientras usa la app.
import { useSyncExternalStore } from 'react';
import { env } from '../../infrastructure/config/env';

export type EstadoServidor = 'despertando' | 'listo';

let estado: EstadoServidor = 'despertando';
let iniciado = false;
const oyentes = new Set<() => void>();

const cambiar = (e: EstadoServidor) => {
  if (e === estado) return;
  estado = e;
  oyentes.forEach((o) => o());
};

const consultar = async (): Promise<boolean> => {
  const control = new AbortController();
  const limite = setTimeout(() => control.abort(), 90_000);
  try {
    const r = await fetch(`${env.apiUrl}/actuator/health`, { cache: 'no-store', signal: control.signal });
    return r.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(limite);
  }
};

/** Empieza a despertar el servidor apenas carga la página (se llama una sola vez). */
export function despertarServidor() {
  if (iniciado) return;
  iniciado = true;
  const intentar = async () => {
    if (await consultar()) cambiar('listo');
    else setTimeout(intentar, 3_000);
  };
  intentar();
  // Mientras la página está abierta, se visita cada 10 minutos para que no se suspenda.
  setInterval(async () => cambiar((await consultar()) ? 'listo' : 'despertando'), 10 * 60_000);
}

export function useEstadoServidor(): EstadoServidor {
  return useSyncExternalStore(
    (o) => { oyentes.add(o); return () => oyentes.delete(o); },
    () => estado,
  );
}
