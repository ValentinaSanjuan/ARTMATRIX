import axios from 'axios';
import { env } from '../config/env';

export const CLAVE_SESION = 'artmatrix-sesion';

export const clienteAxios = axios.create({
  baseURL: `${env.apiUrl}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

/** Lee el token que guarda el store de sesión (zustand persist). */
function tokenGuardado(): string | null {
  try {
    const raw = localStorage.getItem(CLAVE_SESION);
    return raw ? JSON.parse(raw)?.state?.sesion?.token ?? null : null;
  } catch {
    return null;
  }
}

clienteAxios.interceptors.request.use((config) => {
  const token = tokenGuardado();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let alExpirar: (() => void) | null = null;
export function registrarSesionExpirada(fn: () => void) {
  alExpirar = fn;
}

clienteAxios.interceptors.response.use(
  (r) => r,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
      alExpirar?.();
    }
    return Promise.reject(error);
  },
);

/** Mensaje legible de un error de la API (ProblemDetail de Spring). */
export function mensajeDeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'No pude conectarme con la galería. ¿Está encendido el servidor (backend)?';
    const detalle = (error.response.data as { detail?: string } | undefined)?.detail;
    return detalle ?? `Ocurrió un error (${error.response.status}).`;
  }
  return 'Ocurrió un error inesperado.';
}
