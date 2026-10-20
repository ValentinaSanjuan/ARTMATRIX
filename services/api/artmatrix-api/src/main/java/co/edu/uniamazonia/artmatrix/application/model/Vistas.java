package co.edu.uniamazonia.artmatrix.application.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/** Vistas de solo lectura que la aplicación entrega a la capa de presentación. */
public final class Vistas {

    private Vistas() {
    }

    public record Estudiante(Integer id, String nombre, String usuario, String correo, String telefono,
                             String programa, String curso, boolean tutorialCompletado) {
    }

    public record Sesion(String token, Estudiante estudiante) {
    }

    public record NivelResumen(Integer id, int orden, String nombre, String descripcion, String dificultad,
                               String estado, int estrellas, int puntos, BigDecimal porcentaje,
                               int totalDesafios, String requisito) {
    }

    public record ObraEnMatriz(Integer idObra, String nombre, String autor, String imagen, int fila, int columna) {
    }

    public record MensajeCuri(String tipo, String contenido, String condicion) {
    }

    public record Desafio(Integer id, int orden, String nombre, String descripcion, String tipo,
                          String instrucciones, int filas, int columnas, String modo, String obraMovil,
                          List<List<Integer>> baldosas, String codigoInicial, boolean nocturno,
                          int totalPistas, boolean superado, List<ObraEnMatriz> obras,
                          List<MensajeCuri> mensajes) {
    }

    public record NivelDetalle(NivelResumen nivel, List<Desafio> desafios) {
    }

    public record Pista(int orden, int total, String contenido, boolean hayMas) {
    }

    public record Recompensa(Integer id, String nombre, String tipo, String descripcion,
                             boolean obtenida, LocalDateTime fechaObtencion) {
    }

    public record ResultadoEvaluacion(boolean correcto, String motivo, Integer indiceError, String mensajeCuri,
                                      int estrellas, int puntos, boolean nivelCompletado,
                                      Integer siguienteNivel, List<Recompensa> recompensasNuevas) {
    }

    public record Progreso(Estudiante estudiante, int nivelesCompletados, int totalNiveles,
                           int desafiosSuperados, int totalDesafios, int puntos, int estrellas,
                           long intentos, Integer nivelActual, List<NivelResumen> niveles,
                           List<Recompensa> recompensas) {
    }
}
