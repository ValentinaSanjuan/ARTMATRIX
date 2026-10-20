package co.edu.uniamazonia.artmatrix.application.service;

import co.edu.uniamazonia.artmatrix.application.model.ConfiguracionDesafio;
import co.edu.uniamazonia.artmatrix.application.model.Vistas;
import co.edu.uniamazonia.artmatrix.domain.model.Celda;
import co.edu.uniamazonia.artmatrix.domain.model.ResultadoValidacion;
import co.edu.uniamazonia.artmatrix.domain.model.TipoDesafio;
import co.edu.uniamazonia.artmatrix.domain.rule.CalculadoraRecompensas;
import co.edu.uniamazonia.artmatrix.domain.rule.ValidadorRecorrido;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.DesafioEntity;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.DetalleRecorridoEntity;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.IntentoDesafioEntity;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.SolucionCodigoEntity;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository.DetalleRecorridoRepository;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository.IntentoDesafioRepository;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository.SolucionCodigoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Servicio de evaluación: valida respuestas, recorridos y resultados (RF-06, RF-07, RF-08, RF-11)
 * y registra cada intento para el seguimiento del progreso.
 */
@Service
public class EvaluacionService {

    private static final int MAX_SALIDA = 10_000;

    private final NivelDesafioService nivelDesafio;
    private final OrientacionService orientacion;
    private final ProgresoRecompensaService progreso;
    private final IntentoDesafioRepository intentos;
    private final DetalleRecorridoRepository detalles;
    private final SolucionCodigoRepository soluciones;
    private final ValidadorRecorrido validador = new ValidadorRecorrido();

    public EvaluacionService(NivelDesafioService nivelDesafio, OrientacionService orientacion,
                             ProgresoRecompensaService progreso, IntentoDesafioRepository intentos,
                             DetalleRecorridoRepository detalles, SolucionCodigoRepository soluciones) {
        this.nivelDesafio = nivelDesafio;
        this.orientacion = orientacion;
        this.progreso = progreso;
        this.intentos = intentos;
        this.detalles = detalles;
        this.soluciones = soluciones;
    }

    public record Solicitud(List<Celda> recorrido, String codigo, String salida, int pistasUsadas,
                            LocalDateTime iniciadoEn) {
    }

    @Transactional
    public Vistas.ResultadoEvaluacion evaluar(Integer idEstudiante, Integer idDesafio, Solicitud s) {
        DesafioEntity desafio = nivelDesafio.desafio(idDesafio);
        nivelDesafio.verificarAcceso(idEstudiante, desafio);
        ConfiguracionDesafio config = ConfiguracionDesafio.leer(desafio.getConfiguracion());
        TipoDesafio tipo = TipoDesafio.valueOf(desafio.getTipo());

        ResultadoValidacion r = validador.validar(config.matriz(), s.recorrido(), config.celdasSolucion(),
                config.modo(), tipo);

        long fallidos = intentos.countByIdEstudianteAndIdDesafioAndEstado(idEstudiante, idDesafio, "INCORRECTO");
        int estrellas = r.correcto() ? CalculadoraRecompensas.estrellas(s.pistasUsadas(), fallidos) : 0;
        int puntos = r.correcto() ? CalculadoraRecompensas.puntos(config.puntosBase(), estrellas) : 0;

        IntentoDesafioEntity intento = new IntentoDesafioEntity();
        intento.setIdEstudiante(idEstudiante);
        intento.setIdDesafio(idDesafio);
        LocalDateTime ahora = LocalDateTime.now();
        intento.setFechaInicio(s.iniciadoEn() != null && s.iniciadoEn().isBefore(ahora) ? s.iniciadoEn() : ahora);
        intento.setFechaFin(ahora);
        intento.setEstado(r.correcto() ? "CORRECTO" : "INCORRECTO");
        intento.setResultado(BigDecimal.valueOf(estrellas));
        intento.setPistasUsadas(Math.max(0, s.pistasUsadas()));
        intento = intentos.save(intento);

        List<Celda> recorrido = s.recorrido() == null ? List.of() : s.recorrido();
        for (int i = 0; i < recorrido.size(); i++) {
            detalles.save(new DetalleRecorridoEntity(intento.getId(), i + 1, recorrido.get(i).fila(), recorrido.get(i).columna()));
        }
        if (tipo == TipoDesafio.CODIGO && s.codigo() != null) {
            String salida = s.salida() == null ? "" : s.salida();
            if (salida.length() > MAX_SALIDA) salida = salida.substring(0, MAX_SALIDA);
            soluciones.save(new SolucionCodigoEntity(intento.getId(), "Java", s.codigo(), salida, r.correcto()));
        }

        boolean nivelCompletado = false;
        Integer siguiente = null;
        List<Vistas.Recompensa> nuevas = List.of();
        if (r.correcto()) {
            var avance = progreso.registrarDesafioSuperado(idEstudiante, desafio);
            nivelCompletado = avance.nivelCompletadoAhora();
            siguiente = avance.siguienteNivel();
            nuevas = progreso.otorgarRecompensas(idEstudiante, s.pistasUsadas() == 0, tipo == TipoDesafio.CODIGO);
        }
        return new Vistas.ResultadoEvaluacion(r.correcto(), r.motivo().name(), r.indiceError(),
                orientacion.retroalimentacion(idDesafio, r), estrellas, puntos, nivelCompletado, siguiente, nuevas);
    }
}
