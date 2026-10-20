import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Estudiante, Sesion } from '../../domain/models/tipos';
import { CLAVE_SESION } from '../../infrastructure/api/clienteAxios';

interface EstadoSesion {
  sesion: Sesion | null;
  /** Página del tutorial donde quedó el estudiante (RF-03: retomarlo después). */
  paginaTutorial: number;
  iniciar: (s: Sesion) => void;
  actualizarEstudiante: (e: Partial<Estudiante>) => void;
  guardarPaginaTutorial: (p: number) => void;
  cerrar: () => void;
}

export const useSesion = create<EstadoSesion>()(
  persist(
    (set) => ({
      sesion: null,
      paginaTutorial: 0,
      iniciar: (sesion) => set({ sesion }),
      actualizarEstudiante: (e) =>
        set((s) => (s.sesion ? { sesion: { ...s.sesion, estudiante: { ...s.sesion.estudiante, ...e } } } : s)),
      guardarPaginaTutorial: (paginaTutorial) => set({ paginaTutorial }),
      cerrar: () => set({ sesion: null, paginaTutorial: 0 }),
    }),
    { name: CLAVE_SESION },
  ),
);
