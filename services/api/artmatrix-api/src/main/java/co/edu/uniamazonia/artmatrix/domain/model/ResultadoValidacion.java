package co.edu.uniamazonia.artmatrix.domain.model;

/**
 * Resultado de comparar el recorrido del estudiante con la solución.
 *
 * @param indiceError posición (0-based) del primer paso equivocado, o null si no aplica (RF-07: señalar dónde ocurrió el error)
 */
public record ResultadoValidacion(boolean correcto, Motivo motivo, Integer indiceError) {

    public enum Motivo {
        CORRECTO,
        VACIO,
        FUERA_DE_MATRIZ,
        POSICION_INCORRECTA,
        ORDEN_INCORRECTO,
        FALTAN_CELDAS,
        CELDAS_DE_MAS
    }

    public static ResultadoValidacion ok() {
        return new ResultadoValidacion(true, Motivo.CORRECTO, null);
    }

    public static ResultadoValidacion error(Motivo motivo, Integer indice) {
        return new ResultadoValidacion(false, motivo, indice);
    }
}
