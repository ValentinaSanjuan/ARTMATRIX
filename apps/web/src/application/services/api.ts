// Llamadas a la API de ArtMatrix (Controlador de aplicación del diagrama de arquitectura).
import { clienteAxios } from '../../infrastructure/api/clienteAxios';
import type {
  Celda, NivelDetalle, NivelResumen, Pista, Progreso, Recompensa, ResultadoEvaluacion, Sesion,
} from '../../domain/models/tipos';

export interface DatosRegistro {
  nombre: string;
  usuario: string;
  correo: string;
  contrasena: string;
  telefono?: string;
}

export interface SolicitudEvaluacion {
  recorrido: Celda[];
  codigo?: string;
  salida?: string;
  pistasUsadas: number;
  iniciadoEn?: string;
}

const datos = <T>(p: Promise<{ data: T }>) => p.then((r) => r.data);

export const authApi = {
  login: (usuario: string, contrasena: string) =>
    datos(clienteAxios.post<Sesion>('/auth/login', { usuario, contrasena })),
  registrar: (d: DatosRegistro) => datos(clienteAxios.post<Sesion>('/auth/registro', d)),
};

export const nivelesApi = {
  listar: () => datos(clienteAxios.get<NivelResumen[]>('/niveles')),
  detalle: (id: number) => datos(clienteAxios.get<NivelDetalle>(`/niveles/${id}`)),
};

export const desafiosApi = {
  evaluar: (id: number, s: SolicitudEvaluacion) =>
    datos(clienteAxios.post<ResultadoEvaluacion>(`/desafios/${id}/evaluar`, s)),
  pista: (id: number, orden: number) => datos(clienteAxios.get<Pista>(`/desafios/${id}/pistas/${orden}`)),
};

export const progresoApi = {
  resumen: () => datos(clienteAxios.get<Progreso>('/progreso')),
  completarTutorial: () => datos(clienteAxios.post<Recompensa[]>('/progreso/tutorial')),
};
