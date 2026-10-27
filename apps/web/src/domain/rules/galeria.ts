// Reglas de presentación de la galería que dependen solo del dominio.
import type { Celda } from '../models/tipos';

export const claveCelda = (c: Celda) => `${c.fila}-${c.columna}`;

export const mismaCelda = (a: Celda, b: Celda) => a.fila === b.fila && a.columna === b.columna;

/** Escenario visual de cada nivel según los mockups: salas 1–2 con baldosas, 3–5 con estantería. */
export type FondoNivel = 'nivel1' | 'nivel2' | 'nivel3' | 'nivel4' | 'nivel5';

/** Cada nivel tiene su propia sala (fondos generados para ArtMatrix). */
export function escenarioDeNivel(orden: number): { fondo: FondoNivel; tablero: 'sala' | 'estanteria' } {
  const n = Math.min(5, Math.max(1, orden));
  return { fondo: `nivel${n}` as FondoNivel, tablero: n <= 2 ? 'sala' : 'estanteria' };
}

/** Mueve una posición dentro de los límites de la matriz (controles de flechas). */
export function mover(c: Celda, df: number, dc: number, filas: number, columnas: number): Celda {
  return {
    fila: Math.min(filas - 1, Math.max(0, c.fila + df)),
    columna: Math.min(columnas - 1, Math.max(0, c.columna + dc)),
  };
}
