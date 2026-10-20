package co.edu.uniamazonia.artmatrix.domain.model;

public enum ModoValidacion {
    /** La secuencia debe coincidir paso a paso con la solución. */
    ORDEN,
    /** Importan las celdas visitadas, no el orden (útil en desafíos de código). */
    CONJUNTO
}
