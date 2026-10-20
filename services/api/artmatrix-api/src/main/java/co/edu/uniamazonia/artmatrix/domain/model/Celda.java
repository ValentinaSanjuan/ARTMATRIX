package co.edu.uniamazonia.artmatrix.domain.model;

/** Una posición de la matriz: matriz[fila][columna]. */
public record Celda(int fila, int columna) {

    @Override
    public String toString() {
        return "[" + fila + "][" + columna + "]";
    }
}
