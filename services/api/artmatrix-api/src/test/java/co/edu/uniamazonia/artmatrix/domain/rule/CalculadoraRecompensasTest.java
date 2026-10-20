package co.edu.uniamazonia.artmatrix.domain.rule;

import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class CalculadoraRecompensasTest {

    @Test
    void estrellasSegunDesempeno() {
        assertEquals(3, CalculadoraRecompensas.estrellas(0, 0));
        assertEquals(2, CalculadoraRecompensas.estrellas(1, 2));
        assertEquals(1, CalculadoraRecompensas.estrellas(3, 0));
        assertEquals(1, CalculadoraRecompensas.estrellas(0, 5));
    }

    @Test
    void puntosProporcionales() {
        assertEquals(150, CalculadoraRecompensas.puntos(150, 3));
        assertEquals(100, CalculadoraRecompensas.puntos(150, 2));
    }

    @Test
    void criteriosDeInsignias() {
        var ctx = new CalculadoraRecompensas.Contexto(Set.of(1, 2), 5, true, true, false, false);
        assertTrue(CalculadoraRecompensas.cumple("NIVEL_COMPLETADO:2", ctx));
        assertFalse(CalculadoraRecompensas.cumple("NIVEL_COMPLETADO:3", ctx));
        assertTrue(CalculadoraRecompensas.cumple("TUTORIAL_COMPLETADO", ctx));
        assertTrue(CalculadoraRecompensas.cumple("SIN_PISTAS", ctx));
        assertFalse(CalculadoraRecompensas.cumple("PRIMER_CODIGO", ctx));
        assertFalse(CalculadoraRecompensas.cumple("TRES_ESTRELLAS_TODOS", ctx));
        assertFalse(CalculadoraRecompensas.cumple("DESCONOCIDO", ctx));
    }
}
