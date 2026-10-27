-- Más misiones por nivel. Desde el nivel 4 el editor empieza vacío y el
-- nivel 5 trae retos más complejos con menos pistas.

-- Nivel 4 y 5: sin código inicial (el estudiante escribe todo el programa).
UPDATE desafio SET configuracion = JSON_REMOVE(configuracion, '$.codigoInicial') WHERE id_nivel IN (4, 5);

-- Nivel 5: menos ayuda en el reto de los múltiplos (se quita la pista que daba la respuesta).
DELETE FROM pista WHERE id_desafio = 8 AND orden_pista = 3;

INSERT INTO desafio (id_desafio, id_nivel, nombre, descripcion, tipo_desafio, instrucciones, orden, configuracion) VALUES
  -- Nivel 1: ubicar
  (9, 1, 'El beso en la esquina', 'Ubica una obra usando el tamaño de la matriz.', 'UBICAR',
   'La galería tiene 7 filas y 7 columnas. Lleva "El beso" a la primera fila y a la última columna. ¿Qué índices son esos?', 3,
   '{"filas": 7, "columnas": 7, "modo": "ORDEN", "solucion": [[0, 6]], "obraMovil": "beso", "baldosas": [[1, 1], [2, 5], [3, 3], [4, 0], [5, 4], [6, 2]], "puntos": 120}'),
  -- Nivel 2: recorridos
  (10, 2, 'La fila al revés', 'Recorre una fila de derecha a izquierda.', 'RECORRIDO',
   'Los restauradores trabajan de derecha a izquierda. Recorre la fila 5 empezando en la última columna y terminando en la columna 0.', 3,
   '{"filas": 7, "columnas": 7, "modo": "ORDEN", "solucion": [[5, 6], [5, 5], [5, 4], [5, 3], [5, 2], [5, 1], [5, 0]], "baldosas": [[0, 3], [1, 2], [2, 4], [3, 0], [4, 4]], "puntos": 120}'),
  (11, 2, 'La diagonal dorada', 'Recorre la diagonal principal de la matriz.', 'RECORRIDO',
   'Marca la diagonal principal en orden, desde la esquina superior izquierda hasta la inferior derecha. En la diagonal, la fila y la columna son iguales.', 4,
   '{"filas": 7, "columnas": 7, "modo": "ORDEN", "solucion": [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]], "baldosas": [[0, 4], [2, 6], [4, 1], [6, 3]], "puntos": 140}'),
  -- Nivel 3: código con ayuda inicial
  (12, 3, 'Columnas impares', 'Usa el operador módulo para elegir columnas impares.', 'CODIGO',
   'En la fila 1 solo hay ganchos en las columnas impares. Coloca una obra en cada columna impar de la fila 1.', 3,
   '{"filas": 5, "columnas": 6, "modo": "CONJUNTO", "solucion": [[1, 1], [1, 3], [1, 5]], "puntos": 160, "codigoInicial": "public class Galeria {\\n    public static void main(String[] args) {\\n        int fila = 1;\\n        for (int columna = 0; columna < matriz[0].length; columna++) {\\n            // ¿Cuándo una columna es impar?\\n        }\\n    }\\n}"}'),
  -- Nivel 4: código, editor vacío
  (13, 4, 'Las cuatro esquinas', 'Ubica obras solo en las esquinas de la matriz.', 'CODIGO',
   'El ladrón siempre entra por las esquinas. Coloca una obra en cada una de las cuatro esquinas de la estantería. Tu código debe funcionar sin escribir los números 4 ni 6: usa matriz.length y matriz[0].length.', 2,
   '{"filas": 5, "columnas": 7, "modo": "CONJUNTO", "solucion": [[0, 0], [0, 6], [4, 0], [4, 6]], "puntos": 200, "nocturno": true}'),
  (14, 4, 'El centro protegido', 'Recorre solo el interior de la matriz.', 'CODIGO',
   'Ahora protege el interior: coloca obras en todas las celdas que NO están en el borde de la estantería.', 3,
   '{"filas": 5, "columnas": 6, "modo": "CONJUNTO", "solucion": [[1, 1], [1, 2], [1, 3], [1, 4], [2, 1], [2, 2], [2, 3], [2, 4], [3, 1], [3, 2], [3, 3], [3, 4]], "puntos": 220, "nocturno": true}'),
  -- Nivel 5: retos avanzados, editor vacío y una sola pista
  (15, 5, 'Recorrido en serpiente', 'Recorre las filas alternando la dirección.', 'CODIGO',
   'Coloca obras en TODA la matriz siguiendo una serpiente: la fila 0 de izquierda a derecha, la fila 1 de derecha a izquierda, la fila 2 otra vez de izquierda a derecha, y así. El orden importa.', 2,
   '{"filas": 4, "columnas": 5, "modo": "ORDEN", "solucion": [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 4], [1, 3], [1, 2], [1, 1], [1, 0], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [3, 4], [3, 3], [3, 2], [3, 1], [3, 0]], "puntos": 300, "nocturno": true}'),
  (16, 5, 'Diagonales cruzadas', 'Ubica obras en las dos diagonales de una matriz cuadrada.', 'CODIGO',
   'Forma una X en la sala: coloca obras en la diagonal principal y en la diagonal secundaria de la matriz cuadrada.', 3,
   '{"filas": 5, "columnas": 5, "modo": "CONJUNTO", "solucion": [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [0, 4], [1, 3], [3, 1], [4, 0]], "puntos": 300, "nocturno": true}'),
  (17, 5, 'La ronda del vigilante', 'Recorre el perímetro en el sentido de las agujas del reloj.', 'CODIGO',
   'El vigilante hace su ronda: empieza en matriz[0][0] y recorre el borde en el sentido de las agujas del reloj (arriba, lado derecho, abajo y lado izquierdo) sin repetir celdas. El orden importa.', 4,
   '{"filas": 4, "columnas": 5, "modo": "ORDEN", "solucion": [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 4], [2, 4], [3, 4], [3, 3], [3, 2], [3, 1], [3, 0], [2, 0], [1, 0]], "puntos": 350, "nocturno": true}'),
  (18, 5, 'Llena los huecos', 'Lee la matriz y coloca obras solo en las celdas vacías.', 'CODIGO',
   'Algunas obras ya están colgadas. Coloca una obra en cada celda VACÍA de la estantería, sin tocar las que ya tienen obra. Recuerda: matriz[fila][columna] vale "V" cuando la celda está vacía.', 5,
   '{"filas": 4, "columnas": 6, "modo": "CONJUNTO", "solucion": [[0, 0], [0, 2], [0, 3], [0, 4], [0, 5], [1, 0], [1, 1], [1, 2], [1, 3], [1, 5], [2, 0], [2, 1], [2, 3], [2, 4], [2, 5], [3, 1], [3, 2], [3, 3], [3, 4]], "puntos": 400, "nocturno": true}');

INSERT INTO desafio_obra (id_desafio, id_obra, fila_inicial, columna_inicial) VALUES
  (9, 14, 6, 3),
  (9, 10, 0, 0),
  (9, 22, 3, 3),
  (9, 19, 6, 6),
  (10, 6, 2, 2),
  (10, 21, 0, 6),
  (11, 5, 0, 6),
  (11, 15, 6, 0),
  (12, 11, 3, 2),
  (13, 12, 2, 3),
  (14, 13, 0, 0),
  (16, 18, 2, 0),
  (18, 2, 0, 1),
  (18, 7, 1, 4),
  (18, 20, 2, 2),
  (18, 3, 3, 0),
  (18, 16, 3, 5);

INSERT INTO pista (id_desafio, orden_pista, contenido) VALUES
  (9, 1, 'La primera fila es la fila 0.'),
  (9, 2, 'Si hay 7 columnas, la última es la 6 (7 - 1).'),
  (9, 3, 'La posición es matriz[0][6]: arriba a la derecha.'),
  (10, 1, 'La fila 5 no cambia; la columna va bajando: 6, 5, 4...'),
  (10, 2, 'Empieza en matriz[5][6] y termina en matriz[5][0].'),
  (11, 1, 'En la diagonal principal la fila y la columna tienen el mismo número.'),
  (11, 2, 'Son 7 celdas: [0][0], [1][1], [2][2] ... [6][6].'),
  (12, 1, 'Un número es impar cuando su residuo al dividirlo entre 2 NO es cero.'),
  (12, 2, 'La condición es: if (columna % 2 != 0)'),
  (13, 1, 'Las esquinas combinan la fila 0 o la última fila con la columna 0 o la última columna.'),
  (13, 2, 'Puedes usar && y || juntos: (fila == 0 || fila == ultimaFila) && (columna == 0 || columna == ultimaColumna).'),
  (14, 1, 'El interior empieza en la fila 1 y termina en la penúltima fila (matriz.length - 2).'),
  (14, 2, 'Puedes empezar los ciclos en 1 y terminar antes del último índice: fila < matriz.length - 1.'),
  (15, 1, 'Revisa si la fila es par o impar para decidir si la columna sube o baja.'),
  (16, 1, 'En la diagonal secundaria se cumple que fila + columna es igual a la última posición (matriz.length - 1).'),
  (17, 1, 'Divide la ronda en cuatro ciclos, uno por cada lado, y cuida no repetir las esquinas.'),
  (18, 1, 'Compara el texto de la celda con .equals("V") antes de colocar.');

INSERT INTO mensaje_curi (id_desafio, tipo, contenido, condicion_activacion) VALUES
  (9, 'INTRO', 'Ahora sin coordenadas directas: piensa en el tamaño de la galería.', NULL),
  (9, 'EXITO', '¡Exacto! La última columna de una matriz de 7 columnas es la 6.', NULL),
  (9, 'ERROR', 'No es ahí. Primera fila = 0. Última columna = número de columnas - 1.', 'POSICION_INCORRECTA'),
  (10, 'INTRO', 'Los recorridos también pueden ir hacia atrás.', NULL),
  (10, 'EXITO', '¡Muy bien! En código sería un for que va restando: columna--.', NULL),
  (10, 'ERROR', 'Ese paso no sigue la fila 5 de derecha a izquierda. Revisa la celda en rojo.', 'ORDEN_INCORRECTO'),
  (11, 'INTRO', 'La diagonal es especial: la fila y la columna avanzan juntas.', NULL),
  (11, 'EXITO', '¡Diagonal completa! Fíjate que siempre era matriz[i][i].', NULL),
  (11, 'ERROR', 'Te saliste de la diagonal. En cada paso, fila y columna deben ser iguales.', 'ORDEN_INCORRECTO'),
  (12, 'INTRO', 'Pares ya conoces. ¿Y los impares?', NULL),
  (12, 'EXITO', '¡Bien! El operador != también sirve con el módulo.', NULL),
  (12, 'ERROR', 'Revisa la condición: solo las columnas 1, 3 y 5 de la fila 1.', 'RESULTADO_INCORRECTO'),
  (13, 'INTRO', 'Desde este nivel escribes el programa completo. ¡Empieza con la clase y el main!', NULL),
  (13, 'EXITO', '¡Esquinas protegidas! El ladrón no sabe por dónde entrar.', NULL),
  (13, 'ERROR', 'Faltan esquinas o colocaste obras fuera de ellas.', 'RESULTADO_INCORRECTO'),
  (14, 'INTRO', 'Esta vez el borde queda libre y el centro se llena.', NULL),
  (14, 'EXITO', '¡El tesoro del centro está a salvo!', NULL),
  (14, 'ERROR', 'Pusiste obras en el borde o faltan celdas del interior.', 'RESULTADO_INCORRECTO'),
  (15, 'INTRO', 'Reto avanzado: el orden de tus colocar() importa.', NULL),
  (15, 'EXITO', '¡Serpiente perfecta! Combinaste ciclos y condiciones como un experto.', NULL),
  (15, 'ERROR', 'La serpiente se desordenó. Revisa la dirección de cada fila.', 'ORDEN_INCORRECTO'),
  (16, 'INTRO', 'Reto avanzado: dos diagonales, una sola condición.', NULL),
  (16, 'EXITO', '¡Una X perfecta en la sala!', NULL),
  (16, 'ERROR', 'Alguna obra quedó fuera de las diagonales o faltó una.', 'RESULTADO_INCORRECTO'),
  (17, 'INTRO', 'Reto avanzado: una ronda completa, en orden y sin repetir.', NULL),
  (17, 'EXITO', '¡Ronda impecable! El vigilante está orgulloso.', NULL),
  (17, 'ERROR', 'La ronda se salió del orden o repitió una celda.', 'ORDEN_INCORRECTO'),
  (18, 'INTRO', 'Reto final: lee la matriz antes de actuar.', NULL),
  (18, 'EXITO', '¡Colección completa! Eres un verdadero maestro de las matrices.', NULL),
  (18, 'ERROR', 'Colocaste una obra sobre otra o dejaste huecos vacíos.', 'RESULTADO_INCORRECTO');

-- Las salas ganaron misiones nuevas: el avance guardado se reescala y una sala
-- que estaba completa vuelve a quedar disponible hasta superar las nuevas misiones.
UPDATE progreso_nivel
SET porcentaje = ROUND(porcentaje * CASE id_nivel
                                      WHEN 1 THEN 2 / 3
                                      WHEN 2 THEN 2 / 4
                                      WHEN 3 THEN 2 / 3
                                      WHEN 4 THEN 1 / 3
                                      WHEN 5 THEN 1 / 5
                                      ELSE 1 END, 2),
    estado = CASE WHEN estado = 'COMPLETADO' THEN 'DISPONIBLE' ELSE estado END;
