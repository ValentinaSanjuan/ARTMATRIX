package co.edu.uniamazonia.artmatrix.application.model;

import co.edu.uniamazonia.artmatrix.domain.model.Celda;
import co.edu.uniamazonia.artmatrix.domain.model.Matriz;
import co.edu.uniamazonia.artmatrix.domain.model.ModoValidacion;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

/**
 * Contenido de la columna desafio.configuracion (JSON, RFC 8259).
 * La solución nunca se envía al frontend.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record ConfiguracionDesafio(
        int filas,
        int columnas,
        ModoValidacion modo,
        List<List<Integer>> solucion,
        String obraMovil,
        List<List<Integer>> baldosas,
        String codigoInicial,
        Integer puntos,
        Boolean nocturno,
        /** Objeto que aparece en las celdas marcadas: pergaminos, mapas, libros o libros-abiertos. */
        String marcador) {

    private static final ObjectMapper JSON = new ObjectMapper();

    public static ConfiguracionDesafio leer(String json) {
        try {
            return JSON.readValue(json, ConfiguracionDesafio.class);
        } catch (Exception e) {
            throw new IllegalStateException("Configuración de desafío inválida", e);
        }
    }

    public Matriz matriz() {
        return new Matriz(filas, columnas);
    }

    public List<Celda> celdasSolucion() {
        return solucion.stream().map(p -> new Celda(p.get(0), p.get(1))).toList();
    }

    public int puntosBase() {
        return puntos == null ? 100 : puntos;
    }
}
