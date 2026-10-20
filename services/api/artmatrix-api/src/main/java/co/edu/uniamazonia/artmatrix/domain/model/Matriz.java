package co.edu.uniamazonia.artmatrix.domain.model;

/** Dimensiones de la galería representada como matriz (RF-05). */
public record Matriz(int filas, int columnas) {

    public Matriz {
        if (filas <= 0 || columnas <= 0) {
            throw new IllegalArgumentException("La matriz debe tener al menos 1 fila y 1 columna");
        }
    }

    public boolean contiene(Celda celda) {
        return celda.fila() >= 0 && celda.fila() < filas
                && celda.columna() >= 0 && celda.columna() < columnas;
    }
}
