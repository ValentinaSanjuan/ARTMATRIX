-- Nivel 4 con otra historia: Curi se volvió ladrón y le pide ayuda al estudiante
-- para "El gran golpe". colocar(fila, columna) deja una réplica falsa en el lugar
-- de la obra original, para que nadie note el cambio.

UPDATE nivel
   SET nombre = 'El gran golpe: recorrido perimetral',
       descripcion = 'Curi, convertido en ladrón, te pide ayuda: cambia las obras originales por réplicas usando recorridos con ciclos anidados.'
 WHERE id_nivel = 4;

UPDATE desafio
   SET nombre = 'Ronda por los bordes',
       descripcion = 'Recorre solo los bordes de una matriz con ciclos anidados.',
       instrucciones = 'Psst... soy yo, Curi. Esta noche vamos a llevarnos las obras de los bordes de la estantería. Programa un recorrido que deje una réplica en cada celda del borde (la fila 0, la última fila, la columna 0 y la última columna). ¡No toques el centro o sonará la alarma!'
 WHERE id_desafio = 7;

UPDATE desafio
   SET nombre = 'Las cuatro esquinas',
       descripcion = 'Ubica réplicas solo en las esquinas de la matriz.',
       instrucciones = 'Las cámaras no alcanzan a ver las esquinas. Ayúdame a cambiar solo las cuatro obras de las esquinas por réplicas. Tu código debe funcionar sin escribir los números 4 ni 6: usa matriz.length y matriz[0].length.'
 WHERE id_desafio = 13;

UPDATE desafio
   SET nombre = 'El tesoro del centro',
       descripcion = 'Recorre solo el interior de la matriz.',
       instrucciones = 'El último golpe: las obras más valiosas están en el interior. Deja una réplica en todas las celdas que NO están en el borde, sin tocar los bordes, que es por donde pasa el vigilante.'
 WHERE id_desafio = 14;

UPDATE mensaje_curi SET contenido = 'Psst... ¿me ayudas? Si recorremos los bordes, nadie notará que cambiamos las obras.' WHERE id_desafio = 7 AND tipo = 'INTRO';
UPDATE mensaje_curi SET contenido = '¡Lo logramos, socio! Las réplicas quedaron perfectas en todo el perímetro.' WHERE id_desafio = 7 AND tipo = 'EXITO';
UPDATE mensaje_curi SET contenido = '¡Cuidado! Quedaron huecos en el borde o tocaste el centro. Revisa antes de que llegue el vigilante.' WHERE id_desafio = 7 AND tipo = 'ERROR';

UPDATE mensaje_curi SET contenido = 'Desde aquí escribes tú todo el plan: la clase, el main y los ciclos. Empecemos por las esquinas.' WHERE id_desafio = 13 AND tipo = 'INTRO';
UPDATE mensaje_curi SET contenido = '¡Perfecto! Cuatro esquinas, cuatro réplicas, y nadie se dio cuenta.' WHERE id_desafio = 13 AND tipo = 'EXITO';
UPDATE mensaje_curi SET contenido = 'Uy, faltan esquinas o pusiste réplicas donde no debías. ¡Las cámaras nos van a ver!' WHERE id_desafio = 13 AND tipo = 'ERROR';

UPDATE mensaje_curi SET contenido = 'El gran final: el tesoro está en el centro. Los bordes se quedan quietos.' WHERE id_desafio = 14 AND tipo = 'INTRO';
UPDATE mensaje_curi SET contenido = '¡El golpe perfecto! Ya tengo el tesoro del centro... gracias, socio.' WHERE id_desafio = 14 AND tipo = 'EXITO';
UPDATE mensaje_curi SET contenido = 'Tocaste el borde o faltan celdas del interior. ¡Rápido, corrígelo!' WHERE id_desafio = 14 AND tipo = 'ERROR';

UPDATE recompensa
   SET nombre = 'Cómplice del perímetro',
       descripcion = 'Ayudaste a Curi con el gran golpe usando recorridos con ciclos anidados.'
 WHERE id_recompensa = 4;
