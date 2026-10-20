package co.edu.uniamazonia.artmatrix.domain.rule;

import co.edu.uniamazonia.artmatrix.domain.model.Celda;
import co.edu.uniamazonia.artmatrix.domain.model.Matriz;
import co.edu.uniamazonia.artmatrix.domain.model.ModoValidacion;
import co.edu.uniamazonia.artmatrix.domain.model.ResultadoValidacion;
import co.edu.uniamazonia.artmatrix.domain.model.ResultadoValidacion.Motivo;
import co.edu.uniamazonia.artmatrix.domain.model.TipoDesafio;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * Motor de aprendizaje: compara las acciones del estudiante (celdas visitadas o
 * colocadas) con la solución del desafío. Lógica pura, sin dependencias de Spring.
 */
public class ValidadorRecorrido {

    public ResultadoValidacion validar(Matriz matriz, List<Celda> recorrido, List<Celda> solucion,
                                       ModoValidacion modo, TipoDesafio tipo) {
        if (recorrido == null || recorrido.isEmpty()) {
            return ResultadoValidacion.error(Motivo.VACIO, null);
        }
        for (int i = 0; i < recorrido.size(); i++) {
            if (!matriz.contiene(recorrido.get(i))) {
                return ResultadoValidacion.error(Motivo.FUERA_DE_MATRIZ, i);
            }
        }
        return modo == ModoValidacion.ORDEN
                ? validarOrden(recorrido, solucion, tipo)
                : validarConjunto(recorrido, solucion);
    }

    private ResultadoValidacion validarOrden(List<Celda> recorrido, List<Celda> solucion, TipoDesafio tipo) {
        Motivo motivoPaso = tipo == TipoDesafio.UBICAR ? Motivo.POSICION_INCORRECTA : Motivo.ORDEN_INCORRECTO;
        for (int i = 0; i < recorrido.size(); i++) {
            if (i >= solucion.size()) {
                return ResultadoValidacion.error(Motivo.CELDAS_DE_MAS, i);
            }
            if (!recorrido.get(i).equals(solucion.get(i))) {
                return ResultadoValidacion.error(motivoPaso, i);
            }
        }
        if (recorrido.size() < solucion.size()) {
            return ResultadoValidacion.error(Motivo.FALTAN_CELDAS, recorrido.size());
        }
        return ResultadoValidacion.ok();
    }

    private ResultadoValidacion validarConjunto(List<Celda> recorrido, List<Celda> solucion) {
        Set<Celda> esperadas = new HashSet<>(solucion);
        Set<Celda> visitadas = new LinkedHashSet<>();
        for (int i = 0; i < recorrido.size(); i++) {
            Celda c = recorrido.get(i);
            if (!esperadas.contains(c)) {
                return ResultadoValidacion.error(Motivo.CELDAS_DE_MAS, i);
            }
            visitadas.add(c);
        }
        if (!visitadas.containsAll(esperadas)) {
            return ResultadoValidacion.error(Motivo.FALTAN_CELDAS, null);
        }
        return ResultadoValidacion.ok();
    }
}
