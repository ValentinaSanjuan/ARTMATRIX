package co.edu.uniamazonia.artmatrix.domain.rule;

import co.edu.uniamazonia.artmatrix.domain.model.Celda;
import co.edu.uniamazonia.artmatrix.domain.model.Matriz;
import co.edu.uniamazonia.artmatrix.domain.model.ModoValidacion;
import co.edu.uniamazonia.artmatrix.domain.model.ResultadoValidacion.Motivo;
import co.edu.uniamazonia.artmatrix.domain.model.TipoDesafio;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ValidadorRecorridoTest {

    private final ValidadorRecorrido v = new ValidadorRecorrido();
    private final Matriz m = new Matriz(7, 7);
    private final List<Celda> fila1 = List.of(new Celda(1, 0), new Celda(1, 1), new Celda(1, 2));

    @Test
    void recorridoEnOrdenCorrecto() {
        assertTrue(v.validar(m, fila1, fila1, ModoValidacion.ORDEN, TipoDesafio.RECORRIDO).correcto());
    }

    @Test
    void senalaElPasoDondeSeDesvio() {
        var r = v.validar(m, List.of(new Celda(1, 0), new Celda(2, 1)), fila1, ModoValidacion.ORDEN, TipoDesafio.RECORRIDO);
        assertFalse(r.correcto());
        assertEquals(Motivo.ORDEN_INCORRECTO, r.motivo());
        assertEquals(1, r.indiceError());
    }

    @Test
    void detectaRecorridoIncompleto() {
        var r = v.validar(m, fila1.subList(0, 2), fila1, ModoValidacion.ORDEN, TipoDesafio.RECORRIDO);
        assertEquals(Motivo.FALTAN_CELDAS, r.motivo());
    }

    @Test
    void ubicarEnPosicionIncorrecta() {
        var r = v.validar(m, List.of(new Celda(3, 2)), List.of(new Celda(2, 3)), ModoValidacion.ORDEN, TipoDesafio.UBICAR);
        assertEquals(Motivo.POSICION_INCORRECTA, r.motivo());
    }

    @Test
    void posicionFueraDeLaMatriz() {
        var r = v.validar(m, List.of(new Celda(7, 0)), fila1, ModoValidacion.ORDEN, TipoDesafio.RECORRIDO);
        assertEquals(Motivo.FUERA_DE_MATRIZ, r.motivo());
    }

    @Test
    void conjuntoAceptaCualquierOrden() {
        var invertido = new ArrayList<>(fila1);
        java.util.Collections.reverse(invertido);
        assertTrue(v.validar(m, invertido, fila1, ModoValidacion.CONJUNTO, TipoDesafio.CODIGO).correcto());
    }

    @Test
    void conjuntoRechazaCeldasDeMas() {
        var extra = new ArrayList<>(fila1);
        extra.add(new Celda(4, 4));
        var r = v.validar(m, extra, fila1, ModoValidacion.CONJUNTO, TipoDesafio.CODIGO);
        assertEquals(Motivo.CELDAS_DE_MAS, r.motivo());
        assertEquals(3, r.indiceError());
    }

    @Test
    void perimetroDelNivel4() {
        Matriz est = new Matriz(4, 6);
        List<Celda> borde = new ArrayList<>();
        for (int f = 0; f < 4; f++)
            for (int c = 0; c < 6; c++)
                if (f == 0 || f == 3 || c == 0 || c == 5) borde.add(new Celda(f, c));
        assertEquals(16, borde.size());
        assertTrue(v.validar(est, borde, borde, ModoValidacion.CONJUNTO, TipoDesafio.CODIGO).correcto());
    }
}
