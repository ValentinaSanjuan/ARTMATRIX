// Por defecto la API se llama en el mismo origen (/api) y Vite la reenvía al backend.
// Para apuntar a otro servidor, define VITE_API_URL en apps/web/.env
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? '',
} as const;
