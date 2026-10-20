// Reglas de presentación de la galería que dependen solo del dominio.
import type { Celda } from '../models/tipos';

export const claveCelda = (c: Celda) => `${c.fila}-${c.columna}`;

export const mismaCelda = (a: Celda, b: Celda) => a.fila === b.fila && a.columna === b.columna;

/** Escenario visual de cada nivel según los mockups: salas 1–2 con baldosas, 3–5 con estantería. */
export function escenarioDeNivel(orden: number): { fondo: 'sala' | 'casa'; tablero: 'sala' | 'estanteria' } {
  return orden <= 2 ? { fondo: 'sala', tablero: 'sala' } : { fondo: 'casa', tablero: 'estanteria' };
}

/** Mueve una posición dentro de los límites de la matriz (controles de flechas). */
export function mover(c: Celda, df: number, dc: number, filas: number, columnas: number): Celda {
  return {
    fila: Math.min(filas - 1, Math.max(0, c.fila + df)),
    columna: Math.min(columnas - 1, Math.max(0, c.columna + dc)),
  };
}
