-- Nivel 2: al marcar el recorrido aparecen los objetos de los que habla cada misión.
UPDATE desafio SET configuracion = JSON_SET(configuracion, '$.marcador', 'pergaminos') WHERE id_desafio = 3;
UPDATE desafio SET configuracion = JSON_SET(configuracion, '$.marcador', 'mapas') WHERE id_desafio = 4;
UPDATE desafio SET configuracion = JSON_SET(configuracion, '$.marcador', 'libros') WHERE id_desafio = 10;
UPDATE desafio SET configuracion = JSON_SET(configuracion, '$.marcador', 'libros-abiertos') WHERE id_desafio = 11;

UPDATE desafio
   SET instrucciones = 'Los restauradores trabajan de derecha a izquierda. Acomoda los libros recorriendo la fila 5: empieza en la última columna y termina en la columna 0.'
 WHERE id_desafio = 10;
UPDATE desafio
   SET instrucciones = 'Abre los libros dorados de la colección sobre la diagonal principal, en orden, desde la esquina superior izquierda hasta la inferior derecha. En la diagonal, la fila y la columna son iguales.'
 WHERE id_desafio = 11;
