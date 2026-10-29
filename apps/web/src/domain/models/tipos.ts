// Modelos del dominio de ArtMatrix (coinciden con las vistas de la API).

export type EstadoNivel = 'BLOQUEADO' | 'DISPONIBLE' | 'COMPLETADO';
export type TipoDesafio = 'UBICAR' | 'RECORRIDO' | 'CODIGO';
export type ModoValidacion = 'ORDEN' | 'CONJUNTO';

export interface Celda {
  fila: number;
  columna: number;
}

export interface Estudiante {
  id: number;
  nombre: string;
  usuario: string;
  correo: string;
  telefono: string | null;
  programa: string | null;
  curso: string | null;
  tutorialCompletado: boolean;
}

export interface Sesion {
  token: string;
  estudiante: Estudiante;
}

export interface NivelResumen {
  id: number;
  orden: number;
  nombre: string;
  descripcion: string;
  dificultad: string;
  estado: EstadoNivel;
  estrellas: number;
  puntos: number;
  porcentaje: number;
  totalDesafios: number;
  requisito: string | null;
}

export interface ObraEnMatriz {
  idObra: number;
  nombre: string;
  autor: string;
  imagen: string;
  fila: number;
  columna: number;
}

export interface MensajeCuri {
  tipo: 'INTRO' | 'EXITO' | 'ERROR' | string;
  contenido: string;
  condicion: string | null;
}

export interface Desafio {
  id: number;
  orden: number;
  nombre: string;
  descripcion: string;
  tipo: TipoDesafio;
  instrucciones: string;
  filas: number;
  columnas: number;
  modo: ModoValidacion;
  obraMovil: string | null;
  baldosas: number[][];
  codigoInicial: string | null;
  nocturno: boolean;
  totalPistas: number;
  superado: boolean;
  obras: ObraEnMatriz[];
  mensajes: MensajeCuri[];
  /** Objeto que aparece en las celdas marcadas de un recorrido (pergaminos, mapas, libros…). */
  marcador?: 'pergaminos' | 'mapas' | 'libros' | 'libros-abiertos' | null;
}

export interface NivelDetalle {
  nivel: NivelResumen;
  desafios: Desafio[];
}

export interface Pista {
  orden: number;
  total: number;
  contenido: string;
  hayMas: boolean;
}

export interface Recompensa {
  id: number;
  nombre: string;
  tipo: 'INSIGNIA' | 'LOGRO' | string;
  descripcion: string;
  obtenida: boolean;
  fechaObtencion: string | null;
}

export type MotivoResultado =
  | 'CORRECTO' | 'VACIO' | 'FUERA_DE_MATRIZ' | 'POSICION_INCORRECTA'
  | 'ORDEN_INCORRECTO' | 'FALTAN_CELDAS' | 'CELDAS_DE_MAS';

export interface ResultadoEvaluacion {
  correcto: boolean;
  motivo: MotivoResultado;
  indiceError: number | null;
  mensajeCuri: string;
  estrellas: number;
  puntos: number;
  nivelCompletado: boolean;
  siguienteNivel: number | null;
  recompensasNuevas: Recompensa[];
}

export interface Progreso {
  estudiante: Estudiante;
  nivelesCompletados: number;
  totalNiveles: number;
  desafiosSuperados: number;
  totalDesafios: number;
  puntos: number;
  estrellas: number;
  intentos: number;
  nivelActual: number | null;
  niveles: NivelResumen[];
  recompensas: Recompensa[];
}
