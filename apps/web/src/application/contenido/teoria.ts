// Apartado de teoría (opcional): conceptos de matrices y recorridos en Java
// que el estudiante puede repasar antes o durante los niveles.
import type { Celda } from '../../domain/models/tipos';
import type { AnimoCuri } from '../../infrastructure/recursos';

export interface TemaTeoria {
  clave: string;
  titulo: string;
  /** Nivel del juego donde se aplica el tema (si aplica). */
  nivel?: number;
  texto: string;
  codigo: string;
  /** Consejo corto de Curi. */
  consejo: string;
  animo: AnimoCuri;
  demo: {
    filas: number;
    columnas: number;
    /** Celdas en el orden en que se recorren (se numeran en el tablero). */
    recorrido: Celda[];
    destino?: Celda;
    leyenda: string;
  };
}

const celdas = (filas: number, columnas: number, incluir: (f: number, c: number) => boolean, porColumnas = false) => {
  const r: Celda[] = [];
  if (porColumnas) {
    for (let c = 0; c < columnas; c++) for (let f = 0; f < filas; f++) if (incluir(f, c)) r.push({ fila: f, columna: c });
  } else {
    for (let f = 0; f < filas; f++) for (let c = 0; c < columnas; c++) if (incluir(f, c)) r.push({ fila: f, columna: c });
  }
  return r;
};

export const TEMAS_TEORIA: TemaTeoria[] = [
  {
    clave: 'matriz',
    titulo: '¿Qué es una matriz?',
    texto:
      'Una matriz es una tabla de datos organizada en FILAS (horizontales) y COLUMNAS (verticales). '
      + 'En Java se declara como un arreglo de arreglos: primero se indica cuántas filas tiene y luego cuántas columnas.\n\n'
      + 'En ArtMatrix, la galería es una matriz: cada espacio de exhibición es una celda donde puede ir una obra.',
    codigo: `// Matriz de 3 filas y 4 columnas
String[][] galeria = new String[3][4];

// También se puede crear con valores
int[][] numeros = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12}
};`,
    consejo: 'Piensa en la matriz como la estantería de la galería: 3 filas de estantes con 4 espacios cada una.',
    animo: 'saludo_izq',
    demo: { filas: 3, columnas: 4, recorrido: [], leyenda: 'Una matriz de 3 x 4 tiene 12 celdas.' },
  },
  {
    clave: 'indices',
    titulo: 'Índices y tamaño',
    nivel: 1,
    texto:
      'Cada celda se identifica con dos índices: matriz[fila][columna]. Siempre va primero la fila y luego la columna.\n\n'
      + 'Los índices empiezan en 0. En una matriz de 3 filas, las filas válidas son 0, 1 y 2.\n\n'
      + 'Para saber el tamaño usamos length: matriz.length es el número de filas y matriz[0].length el número de columnas.',
    codigo: `String[][] galeria = new String[3][4];

galeria[1][2] = "La noche estrellada"; // fila 1, columna 2

int filas    = galeria.length;     // 3
int columnas = galeria[0].length;  // 4

// La última celda es galeria[filas - 1][columnas - 1]`,
    consejo: 'Si te pierdes, cuenta desde 0: la primera fila es la fila 0, no la fila 1.',
    animo: 'pregunta',
    demo: { filas: 3, columnas: 4, recorrido: [], destino: { fila: 1, columna: 2 }, leyenda: 'La celda dorada es galeria[1][2].' },
  },
  {
    clave: 'filas',
    titulo: 'Recorrido por filas',
    nivel: 2,
    texto:
      'Recorrer una matriz es visitar sus celdas en un orden. El recorrido más común es por filas: '
      + 'se recorre la fila 0 de izquierda a derecha, luego la fila 1, y así sucesivamente.\n\n'
      + 'Se usan dos ciclos for anidados: el ciclo de afuera cambia la fila y el de adentro cambia la columna.',
    codigo: `for (int fila = 0; fila < matriz.length; fila++) {
    for (int col = 0; col < matriz[0].length; col++) {
        colocar(fila, col);
    }
}

// Solo una fila (por ejemplo, la fila 1):
for (int col = 0; col < matriz[0].length; col++) {
    colocar(1, col);
}`,
    consejo: 'El ciclo de adentro termina toda una fila antes de que el de afuera pase a la siguiente.',
    animo: 'indica',
    demo: { filas: 3, columnas: 4, recorrido: celdas(3, 4, () => true), leyenda: 'Los números muestran el orden de visita.' },
  },
  {
    clave: 'columnas',
    titulo: 'Recorrido por columnas',
    nivel: 2,
    texto:
      'En el recorrido por columnas se baja por la columna 0 de arriba hacia abajo, luego por la columna 1, etc.\n\n'
      + 'Es igual que el recorrido por filas, pero se intercambian los ciclos: ahora el de afuera cambia la columna '
      + 'y el de adentro cambia la fila. Los índices siguen escribiéndose como [fila][columna].',
    codigo: `for (int col = 0; col < matriz[0].length; col++) {
    for (int fila = 0; fila < matriz.length; fila++) {
        colocar(fila, col);
    }
}

// Solo una columna (por ejemplo, la columna 3):
for (int fila = 0; fila < matriz.length; fila++) {
    colocar(fila, 3);
}`,
    consejo: 'Cambiar el orden de los ciclos cambia el orden del recorrido, pero no la forma de escribir matriz[fila][col].',
    animo: 'piensa',
    demo: { filas: 3, columnas: 4, recorrido: celdas(3, 4, () => true, true), leyenda: 'Primero baja por cada columna.' },
  },
  {
    clave: 'condiciones',
    titulo: 'Condiciones y el operador %',
    nivel: 3,
    texto:
      'Dentro de un recorrido podemos decidir qué celdas usar con un if.\n\n'
      + 'El operador módulo (%) devuelve el residuo de una división. Un número es PAR si numero % 2 == 0 '
      + 'y es IMPAR si numero % 2 != 0.\n\n'
      + 'Así podemos visitar, por ejemplo, solo las filas pares de una columna.',
    codigo: `// Solo las filas pares de la columna 1
for (int fila = 0; fila < matriz.length; fila++) {
    if (fila % 2 == 0) {
        colocar(fila, 1);
    }
}

// 7 % 2 == 1  -> impar
// 6 % 2 == 0  -> par`,
    consejo: 'Otra forma de lograrlo es avanzar de 2 en 2: for (int fila = 0; fila < n; fila += 2).',
    animo: 'guino',
    demo: { filas: 5, columnas: 4, recorrido: celdas(5, 4, (f, c) => c === 1 && f % 2 === 0), leyenda: 'Filas 0, 2 y 4 de la columna 1.' },
  },
  {
    clave: 'perimetro',
    titulo: 'Recorrido perimetral',
    nivel: 4,
    texto:
      'El perímetro son las celdas del borde: la primera fila, la última fila, la primera columna y la última columna.\n\n'
      + 'Se recorre toda la matriz con dos ciclos anidados y se usa el operador || (o) para preguntar si la celda '
      + 'está en alguno de los cuatro bordes.',
    codigo: `int ultimaFila = matriz.length - 1;
int ultimaCol  = matriz[0].length - 1;

for (int fila = 0; fila < matriz.length; fila++) {
    for (int col = 0; col < matriz[0].length; col++) {
        if (fila == 0 || fila == ultimaFila
                || col == 0 || col == ultimaCol) {
            colocar(fila, col);
        }
    }
}`,
    consejo: 'Con || basta con que UNA de las condiciones sea verdadera para que se cumpla el if.',
    animo: 'indica',
    demo: { filas: 4, columnas: 5, recorrido: celdas(4, 5, (f, c) => f === 0 || f === 3 || c === 0 || c === 4), leyenda: 'Solo los bordes de la matriz.' },
  },
  {
    clave: 'multiplos',
    titulo: 'Dos condiciones a la vez',
    nivel: 5,
    texto:
      'El operador && (y) exige que TODAS las condiciones sean verdaderas.\n\n'
      + 'Combinándolo con %, podemos elegir celdas cuya fila y columna cumplan una regla al mismo tiempo, '
      + 'por ejemplo que ambas sean múltiplos de 3 (numero % 3 == 0).',
    codigo: `for (int fila = 0; fila < matriz.length; fila++) {
    for (int col = 0; col < matriz[0].length; col++) {
        if (fila % 3 == 0 && col % 3 == 0) {
            colocar(fila, col);
        }
    }
}`,
    consejo: 'Con && las dos partes deben cumplirse; si una falla, la celda se salta.',
    animo: 'celebra',
    demo: { filas: 4, columnas: 7, recorrido: celdas(4, 7, (f, c) => f % 3 === 0 && c % 3 === 0), leyenda: 'Fila y columna múltiplos de 3.' },
  },
  {
    clave: 'errores',
    titulo: 'Errores comunes',
    texto:
      '1. Salirse de la matriz: usar <= en lugar de < en el for. Si la matriz tiene 4 columnas, '
      + 'el índice 4 no existe y Java lanza ArrayIndexOutOfBoundsException.\n\n'
      + '2. Invertir los índices: escribir matriz[col][fila] en vez de matriz[fila][col].\n\n'
      + '3. Confundir = con ==: un solo = asigna un valor; == compara.\n\n'
      + '4. Olvidar el punto y coma (;) al final de cada instrucción.',
    codigo: `// ✗ Incorrecto: se sale de la matriz
for (int col = 0; col <= matriz[0].length; col++) { ... }

// ✓ Correcto
for (int col = 0; col < matriz[0].length; col++) { ... }

// ✗ if (fila % 2 = 0)    ✓ if (fila % 2 == 0)`,
    consejo: 'Cuando algo falle, lee el mensaje de la consola: te dice la línea donde está el problema.',
    animo: 'rasca',
    demo: { filas: 3, columnas: 4, recorrido: [], destino: { fila: 2, columna: 3 }, leyenda: 'La última celda válida es [2][3], no [3][4].' },
  },
];

/** Tema de teoría recomendado para cada nivel. */
export const temaDeNivel = (ordenNivel: number) =>
  TEMAS_TEORIA.find((t) => t.nivel === ordenNivel)?.clave ?? 'matriz';
