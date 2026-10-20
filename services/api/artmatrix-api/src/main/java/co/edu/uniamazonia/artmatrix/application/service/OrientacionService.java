package co.edu.uniamazonia.artmatrix.application.service;

import co.edu.uniamazonia.artmatrix.application.model.Vistas;
import co.edu.uniamazonia.artmatrix.domain.exception.ReglaNegocioException;
import co.edu.uniamazonia.artmatrix.domain.model.ResultadoValidacion;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.MensajeCuriEntity;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository.MensajeCuriRepository;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository.PistaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Servicio de orientación: Curi, pistas progresivas y retroalimentación (RF-09, RF-14). */
@Service
@Transactional(readOnly = true)
public class OrientacionService {

    private final PistaRepository pistas;
    private final MensajeCuriRepository mensajes;

    public OrientacionService(PistaRepository pistas, MensajeCuriRepository mensajes) {
        this.pistas = pistas;
        this.mensajes = mensajes;
    }

    public Vistas.Pista pista(Integer idDesafio, int orden) {
        int total = (int) pistas.countByIdDesafio(idDesafio);
        if (total == 0) {
            throw new ReglaNegocioException("Este desafío no tiene pistas disponibles.");
        }
        if (orden < 1 || orden > total) {
            throw new ReglaNegocioException("Ya usaste todas las pistas disponibles para este desafío.");
        }
        var p = pistas.findByIdDesafioAndOrden(idDesafio, orden).orElseThrow();
        return new Vistas.Pista(orden, total, p.getContenido(), orden < total);
    }

    public int totalPistas(Integer idDesafio) {
        return (int) pistas.countByIdDesafio(idDesafio);
    }

    public List<Vistas.MensajeCuri> mensajes(Integer idDesafio) {
        return mensajes.findByIdDesafio(idDesafio).stream()
                .map(m -> new Vistas.MensajeCuri(m.getTipo(), m.getContenido(), m.getCondicionActivacion()))
                .toList();
    }

    /** Elige lo que Curi dice tras una evaluación. */
    public String retroalimentacion(Integer idDesafio, ResultadoValidacion r) {
        List<MensajeCuriEntity> lista = mensajes.findByIdDesafio(idDesafio);
        String tipo = r.correcto() ? "EXITO" : "ERROR";
        return lista.stream().filter(m -> m.getTipo().equals(tipo)).findFirst()
                .map(MensajeCuriEntity::getContenido)
                .map(base -> r.correcto() ? base : base + " " + detalle(r))
                .orElse(r.correcto() ? "¡Muy bien!" : detalle(r));
    }

    static String detalle(ResultadoValidacion r) {
        String paso = r.indiceError() == null ? "" : " (paso " + (r.indiceError() + 1) + ")";
        return switch (r.motivo()) {
            case VACIO -> "Todavía no has realizado ninguna acción.";
            case FUERA_DE_MATRIZ -> "Una posición está fuera de la matriz" + paso + ".";
            case POSICION_INCORRECTA -> "La obra quedó en otra posición" + paso + ".";
            case ORDEN_INCORRECTO -> "El recorrido se desvió" + paso + ".";
            case FALTAN_CELDAS -> "Faltan posiciones por completar.";
            case CELDAS_DE_MAS -> "Hay una obra en una posición que no corresponde" + paso + ".";
            case CORRECTO -> "";
        };
    }
}
