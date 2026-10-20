package co.edu.uniamazonia.artmatrix.domain.rule;

import java.util.Set;

/**
 * Reglas de gamificación (RF-12): estrellas, puntos y criterios de insignias.
 */
public final class CalculadoraRecompensas {

    private CalculadoraRecompensas() {
    }

    /** 3 estrellas: sin pistas ni errores; 2: hasta 1 pista y 2 errores; 1: en otro caso. */
    public static int estrellas(int pistasUsadas, long intentosFallidos) {
        if (pistasUsadas == 0 && intentosFallidos == 0) return 3;
        if (pistasUsadas <= 1 && intentosFallidos <= 2) return 2;
        return 1;
    }

    public static int puntos(int puntosBase, int estrellas) {
        return Math.round(puntosBase * estrellas / 3f);
    }

    /** Datos del estudiante con los que se evalúan los criterios de la tabla recompensa. */
    public record Contexto(
            Set<Integer> nivelesCompletados,   // por orden_referencial
            int totalNiveles,
            boolean tutorialCompletado,
            boolean desafioActualSinPistas,
            boolean desafioActualEsCodigo,
            boolean tresEstrellasEnTodos) {
    }

    /**
     * Evalúa un criterio como "NIVEL_COMPLETADO:3", "SIN_PISTAS", "PRIMER_CODIGO",
     * "TUTORIAL_COMPLETADO" o "TRES_ESTRELLAS_TODOS".
     */
    public static boolean cumple(String criterio, Contexto ctx) {
        String[] partes = criterio.trim().split(":");
        return switch (partes[0]) {
            case "NIVEL_COMPLETADO" -> partes.length > 1 && ctx.nivelesCompletados().contains(Integer.parseInt(partes[1]));
            case "TUTORIAL_COMPLETADO" -> ctx.tutorialCompletado();
            case "SIN_PISTAS" -> ctx.desafioActualSinPistas();
            case "PRIMER_CODIGO" -> ctx.desafioActualEsCodigo();
            case "TRES_ESTRELLAS_TODOS" -> ctx.tresEstrellasEnTodos()
                    && ctx.nivelesCompletados().size() == ctx.totalNiveles();
            default -> false;
        };
    }
}
