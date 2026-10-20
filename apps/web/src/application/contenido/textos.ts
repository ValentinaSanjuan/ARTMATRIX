// Textos de Curi y del panel de información (Fig. 10 y Fig. 17).

export const PAGINAS_TUTORIAL = [
  {
    titulo: '¡Hola, mundo!',
    texto:
      '¡Hola, mundo! Soy Curi, tu guía virtual en la galería ArtMatrix.\n\nMi trabajo es acompañarte durante tu aprendizaje, explicarte las misiones y darte pistas cuando el código se ponga difícil.',
    animo: 'saludo_izq',
  },
  {
    titulo: 'La galería es una matriz',
    texto:
      'En esta galería, las obras de arte se organizan usando matrices.\n\nImagina que este salón es una gran cuadrícula: las líneas horizontales son las FILAS y las verticales son las COLUMNAS.',
    animo: 'indica',
    demo: 'filas-columnas',
  },
  {
    titulo: 'Índices',
    texto:
      'Cada espacio es una celda y se identifica con dos índices: primero la fila y luego la columna.\n\nEn Java se escribe matriz[fila][columna]. ¡Ojo! Los índices empiezan en 0.',
    animo: 'pregunta',
    demo: 'indices',
  },
  {
    titulo: 'Las obras',
    texto:
      'Cada obra es un elemento guardado en una celda. La obra resaltada está en matriz[2][1]: fila 2, columna 1.',
    animo: 'feliz',
    demo: 'obra',
  },
  {
    titulo: '¡Tu turno!',
    texto: 'Toca la celda matriz[1][2] para demostrar que ya sabes ubicar posiciones.',
    animo: 'guino',
    demo: 'interaccion',
  },
] as const;

export const INFORMACION = `Versión: 1.0.0
Desarrollo y Diseño: Karen Sophya Castillo Quiñonez, Valentina Sanjuan Ramos
Docente Asesora: Dra. Denis Lorena Alvarez Guayara
Institución: Universidad de la Amazonia — Facultad de Ingeniería
Programa: Ingeniería de Sistemas — Proyectos Software
Año: 2026-2

Propósito educativo: ArtMatrix es un software educativo gamificado diseñado para fortalecer la comprensión lógica y espacial de los recorridos en matrices aplicados a la programación competitiva. A través de escenarios interactivos guiados por Curi, los estudiantes pueden visualizar y programar algoritmos estructurados utilizando el lenguaje Java.

Aviso legal: © 2026 ArtMatrix. Todos los derechos reservados. Este proyecto tiene fines estrictamente académicos y educativos.`;

export const AYUDA_CODIGO = `Instrucciones disponibles en el editor:
  colocar(fila, columna);   // coloca una obra en esa posición
  matriz.length             // número de filas
  matriz[0].length          // número de columnas
  matriz[fila][columna]     // nombre de la obra o "V" si está vacía
  System.out.println(...);  // escribe en la consola`;
