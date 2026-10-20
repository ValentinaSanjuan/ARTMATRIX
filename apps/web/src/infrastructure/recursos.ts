// Rutas de las imágenes de ImagenesArtMatrix ya recortadas en public/img.

export type AnimoCuri =
  | 'frente' | 'feliz' | 'pregunta' | 'guino' | 'enojado' | 'triste' | 'indica' | 'piensa'
  | 'rasca' | 'alegre' | 'error' | 'celebra' | 'brazos_arriba' | 'saludo_izq' | 'camina'
  | 'perfil' | 'dormido' | 'senala_abajo' | 'espalda' | 'perfil_dormido';

/** Curi normal o su versión ladrón (nivel 4: "Ha ocurrido un robo"). */
export const imgCuri = (animo: AnimoCuri, ladron = false) => `/img/${ladron ? 'curi-ladron' : 'curi'}/${animo}.png`;

export type IconoBoton =
  | 'atras' | 'siguiente' | 'menu' | 'completado' | 'reproducir' | 'pausa' | 'detener'
  | 'configuracion' | 'informacion' | 'ayuda' | 'guardar' | 'cargar' | 'salir' | 'reintentar' | 'aceptar';

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
