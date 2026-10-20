package co.edu.uniamazonia.artmatrix.domain.rule;

/**
 * RF-04 (ajustado): todas las salas están disponibles desde el inicio,
 * así el estudiante puede practicar cualquier recorrido sin terminar el anterior.
 */
public final class ReglaDesbloqueo {

    private ReglaDesbloqueo() {
    }

    public static boolean disponibleAlInicio(int ordenNivel) {
        return true;
    }

    public static String requisito(int ordenNivel, String nombreNivelAnterior) {
        return "Para entrar a esta sala primero completa el nivel " + (ordenNivel - 1)
                + ": " + nombreNivelAnterior + ".";
    }
}
