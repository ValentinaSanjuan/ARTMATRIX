package co.edu.uniamazonia.artmatrix.application.port;

/** Emite el token de sesión del estudiante. Lo implementa infrastructure/security. */
public interface GeneradorTokenPort {
    String generar(Integer idEstudiante, String usuario);
}
