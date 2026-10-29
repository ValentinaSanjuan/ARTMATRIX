-- Niveles 4 y 5: el editor empieza solo con la clase y el main; el estudiante escribe el resto.
UPDATE desafio
   SET configuracion = JSON_SET(configuracion, '$.codigoInicial',
       'public class Galeria {\n    public static void main(String[] args) {\n        \n    }\n}')
 WHERE id_nivel IN (4, 5);
