import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { desafiosApi, nivelesApi, progresoApi, type SolicitudEvaluacion } from '../services/api';

export const claves = {
  niveles: ['niveles'] as const,
  nivel: (id: number) => ['nivel', id] as const,
  progreso: ['progreso'] as const,
};

export function useNiveles() {
  return useQuery({ queryKey: claves.niveles, queryFn: nivelesApi.listar });
}

export function useNivel(id: number) {
  return useQuery({ queryKey: claves.nivel(id), queryFn: () => nivelesApi.detalle(id), retry: false });
}

export function useProgreso() {
  return useQuery({ queryKey: claves.progreso, queryFn: progresoApi.resumen });
}

export function useEvaluar(idNivel: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ idDesafio, solicitud }: { idDesafio: number; solicitud: SolicitudEvaluacion }) =>
      desafiosApi.evaluar(idDesafio, solicitud),
    onSuccess: (r) => {
      if (r.correcto) {
        qc.invalidateQueries({ queryKey: claves.niveles });
        qc.invalidateQueries({ queryKey: claves.progreso });
        qc.invalidateQueries({ queryKey: claves.nivel(idNivel) });
      }
    },
  });
}

export function useCompletarTutorial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: progresoApi.completarTutorial,
    onSuccess: () => qc.invalidateQueries({ queryKey: claves.progreso }),
  });
}
