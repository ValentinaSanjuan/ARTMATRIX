// Rutas de las imágenes de ImagenesArtMatrix ya recortadas en public/img.

export type AnimoCuri =
  | 'frente' | 'feliz' | 'pregunta' | 'guino' | 'enojado' | 'triste' | 'indica' | 'piensa'
  | 'rasca' | 'alegre' | 'error' | 'celebra' | 'brazos_arriba' | 'saludo_izq' | 'camina'
  | 'perfil' | 'dormido' | 'senala_abajo' | 'espalda' | 'perfil_dormido';

/** Curi normal o su versión ladrón (nivel 4: "El gran golpe", Curi pide ayuda para robar). */
export const imgCuri = (animo: AnimoCuri, ladron = false) => `/img/${ladron ? 'curi-ladron' : 'curi'}/${animo}.png`;

export type IconoBoton =
  | 'atras' | 'siguiente' | 'menu' | 'completado' | 'detener'
  | 'informacion' | 'ayuda' | 'cargar' | 'reintentar' | 'aceptar';

export const imgBoton = (icono: IconoBoton) => `/img/ui/btn-${icono}.png`;
export const imgFlecha = (dir: 'arriba' | 'abajo' | 'izquierda' | 'derecha') => `/img/ui/flecha-${dir}.png`;

/** Obras disponibles para los cuadros que coloca el código del estudiante. */
export const OBRAS_GALERIA = [
  'noche-estrellada', 'grito', 'gran-ola', 'beso', 'nenufares', 'joven-perla', 'trigal-cuervos',
  'terraza-cafe', 'nacimiento-venus', 'meninas', 'gotico-americano', 'persistencia-memoria',
  'grande-jatte', 'catrina', 'autorretrato-espinas', 'hombre-bombin', 'nighthawks', 'columpio',
  'jardin-delicias', 'guernica', 'creacion-adan', 'lady-jane-grey', 'creacion-adan-2',
].map((clave) => `/img/obras/${clave}.png`);

export const imgObra = (clave: string) => `/img/obras/${clave}.png`;

/** Objetos que aparecen en las celdas al marcar un recorrido (nivel 2: pergaminos, mapas, libros). */
const MARCADORES = {
  pergaminos: [1, 2, 3, 4, 5, 6].map((i) => `/img/marcadores/pergamino-${i}.png`),
  mapas: [1, 2, 3, 4].map((i) => `/img/marcadores/pergamino-${i}.png`),
  libros: [1, 2, 3, 4, 5, 6, 7].map((i) => `/img/marcadores/libros-${i}.png`),
  'libros-abiertos': [1, 2, 3, 4, 5, 6, 7].map((i) => `/img/marcadores/libro-abierto-${i}.png`),
} as const;

export type TipoMarcador = keyof typeof MARCADORES;

export const imgMarcador = (tipo: TipoMarcador, i: number) => MARCADORES[tipo][i % MARCADORES[tipo].length];
