package co.edu.uniamazonia.artmatrix.application.service;

import co.edu.uniamazonia.artmatrix.application.model.ConfiguracionDesafio;
import co.edu.uniamazonia.artmatrix.application.model.Vistas;
import co.edu.uniamazonia.artmatrix.domain.exception.RecursoNoEncontradoException;
import co.edu.uniamazonia.artmatrix.domain.model.EstadoNivel;
import co.edu.uniamazonia.artmatrix.domain.rule.CalculadoraRecompensas;
import co.edu.uniamazonia.artmatrix.domain.rule.ReglaDesbloqueo;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.DesafioEntity;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.EstudianteEntity;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.EstudianteRecompensaEntity;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.IntentoDesafioEntity;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.NivelEntity;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.ProgresoNivelEntity;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.RecompensaEntity;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository.EstudianteRecompensaRepository;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository.EstudianteRepository;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository.IntentoDesafioRepository;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository.NivelRepository;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository.ProgresoNivelRepository;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository.RecompensaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/** Servicio de progreso y recompensas: avance, estrellas, insignias y resultados (RF-12, RF-13). */
@Service
public class ProgresoRecompensaService {

    private final ProgresoNivelRepository progresos;
    private final NivelRepository niveles;
    private final IntentoDesafioRepository intentos;
    private final RecompensaRepository recompensas;
    private final EstudianteRecompensaRepository obtenidas;
    private final EstudianteRepository estudiantes;

    public ProgresoRecompensaService(ProgresoNivelRepository progresos, NivelRepository niveles,
                                     IntentoDesafioRepository intentos, RecompensaRepository recompensas,
                                     EstudianteRecompensaRepository obtenidas, EstudianteRepository estudiantes) {
        this.progresos = progresos;
        this.niveles = niveles;
        this.intentos = intentos;
        this.recompensas = recompensas;
        this.obtenidas = obtenidas;
        this.estudiantes = estudiantes;
    }

    /** Crea el progreso inicial: todas las salas disponibles. */
    @Transactional
    public void inicializar(Integer idEstudiante) {
        for (NivelEntity n : niveles.findAllByOrderByOrdenAsc()) {
            String estado = ReglaDesbloqueo.disponibleAlInicio(n.getOrden())
                    ? EstadoNivel.DISPONIBLE.name() : EstadoNivel.BLOQUEADO.name();
            progresos.save(new ProgresoNivelEntity(idEstudiante, n, estado));
        }
    }

    public record AvanceNivel(boolean nivelCompletadoAhora, Integer siguienteNivel) {
    }

    /** Recalcula el progreso de la sala tras superar un desafío y desbloquea la siguiente (RF-04). */
    @Transactional
    public AvanceNivel registrarDesafioSuperado(Integer idEstudiante, DesafioEntity desafio) {
        NivelEntity nivel = desafio.getNivel();
        ProgresoNivelEntity p = progresos.findByIdEstudianteAndNivel_Id(idEstudiante, nivel.getId())
                .orElseGet(() -> progresos.save(new ProgresoNivelEntity(idEstudiante, nivel, EstadoNivel.DISPONIBLE.name())));
        boolean yaCompletado = EstadoNivel.COMPLETADO.name().equals(p.getEstado());

        Map<Integer, Integer> mejores = mejoresEstrellas(idEstudiante);
        List<DesafioEntity> delNivel = nivel.getDesafios();
        long superados = delNivel.stream().filter(d -> mejores.containsKey(d.getId())).count();
        int estrellas = 0;
        int puntos = 0;
        for (DesafioEntity d : delNivel) {
            Integer e = mejores.get(d.getId());
            if (e != null) {
                estrellas += e;
                puntos += CalculadoraRecompensas.puntos(ConfiguracionDesafio.leer(d.getConfiguracion()).puntosBase(), e);
            }
        }
        p.setPorcentaje(BigDecimal.valueOf(superados * 100.0 / delNivel.size()).setScale(2, RoundingMode.HALF_UP));
        p.setPuntos(puntos);
        p.setEstrellas(superados == 0 ? 0 : Math.round((float) estrellas / delNivel.size()));
        p.setFechaActualizacion(LocalDateTime.now());

        Integer siguiente = null;
        boolean completadoAhora = false;
        if (superados == delNivel.size()) {
            p.setEstado(EstadoNivel.COMPLETADO.name());
            completadoAhora = !yaCompletado;
            var sig = niveles.findByOrden(nivel.getOrden() + 1);
            if (sig.isPresent()) {
                siguiente = sig.get().getId();
                progresos.findByIdEstudianteAndNivel_Id(idEstudiante, siguiente)
                        .filter(ps -> EstadoNivel.BLOQUEADO.name().equals(ps.getEstado()))
                        .ifPresent(ps -> {
                            ps.setEstado(EstadoNivel.DISPONIBLE.name());
                            ps.setFechaActualizacion(LocalDateTime.now());
                        });
            }
        }
        return new AvanceNivel(completadoAhora, siguiente);
    }

    /** Evalúa los criterios de la tabla recompensa y otorga las nuevas. */
    @Transactional
    public List<Vistas.Recompensa> otorgarRecompensas(Integer idEstudiante, boolean sinPistas, boolean esCodigo) {
        EstudianteEntity est = estudiantes.findById(idEstudiante).orElseThrow();
        List<ProgresoNivelEntity> lista = progresos.findByIdEstudiante(idEstudiante);
        Set<Integer> completados = lista.stream()
                .filter(p -> EstadoNivel.COMPLETADO.name().equals(p.getEstado()))
                .map(p -> p.getNivel().getOrden()).collect(Collectors.toSet());
        boolean tresEstrellas = !lista.isEmpty() && lista.stream().allMatch(p -> p.getEstrellas() == 3);
        var ctx = new CalculadoraRecompensas.Contexto(completados, (int) niveles.count(),
                est.isTutorialCompletado(), sinPistas, esCodigo, tresEstrellas);

        Set<Integer> yaTiene = obtenidas.findByIdEstudiante(idEstudiante).stream()
                .map(EstudianteRecompensaEntity::getIdRecompensa).collect(Collectors.toSet());
        List<Vistas.Recompensa> nuevas = new ArrayList<>();
        for (var r : recompensas.findAll()) {
            if (!yaTiene.contains(r.getId()) && CalculadoraRecompensas.cumple(r.getCriterio(), ctx)) {
                var er = obtenidas.save(new EstudianteRecompensaEntity(idEstudiante, r.getId()));
                nuevas.add(new Vistas.Recompensa(r.getId(), r.getNombre(), r.getTipo(), r.getDescripcion(),
                        true, er.getFechaObtencion()));
            }
        }
        return nuevas;
    }

    /** RF-03: marca el tutorial como completado. */
    @Transactional
    public List<Vistas.Recompensa> completarTutorial(Integer idEstudiante) {
        EstudianteEntity est = estudiantes.findById(idEstudiante)
                .orElseThrow(() -> new RecursoNoEncontradoException("Estudiante no encontrado."));
        est.setTutorialCompletado(true);
        return otorgarRecompensas(idEstudiante, false, false);
    }

    @Transactional(readOnly = true)
    public Vistas.Progreso resumen(Integer idEstudiante, List<Vistas.NivelResumen> nivelesVista) {
        EstudianteEntity est = estudiantes.findById(idEstudiante)
                .orElseThrow(() -> new RecursoNoEncontradoException("Estudiante no encontrado."));
        Map<Integer, EstudianteRecompensaEntity> mias = obtenidas.findByIdEstudiante(idEstudiante).stream()
                .collect(Collectors.toMap(EstudianteRecompensaEntity::getIdRecompensa, Function.identity()));
        List<Vistas.Recompensa> todas = recompensas.findAll().stream()
                .sorted(Comparator.comparing(RecompensaEntity::getId))
                .map(r -> {
                    var m = mias.get(r.getId());
                    return new Vistas.Recompensa(r.getId(), r.getNombre(), r.getTipo(), r.getDescripcion(),
                            m != null, m == null ? null : m.getFechaObtencion());
                }).toList();
        int completados = (int) nivelesVista.stream().filter(n -> EstadoNivel.COMPLETADO.name().equals(n.estado())).count();
        int totalDesafios = nivelesVista.stream().mapToInt(Vistas.NivelResumen::totalDesafios).sum();
        Integer actual = nivelesVista.stream().filter(n -> EstadoNivel.DISPONIBLE.name().equals(n.estado()))
                .map(Vistas.NivelResumen::orden).findFirst().orElse(null);
        return new Vistas.Progreso(AutenticacionService.vista(est), completados, nivelesVista.size(),
                mejoresEstrellas(idEstudiante).size(), totalDesafios,
                nivelesVista.stream().mapToInt(Vistas.NivelResumen::puntos).sum(),
                nivelesVista.stream().mapToInt(Vistas.NivelResumen::estrellas).sum(),
                intentos.countByIdEstudiante(idEstudiante), actual, nivelesVista, todas);
    }

    /** Mejor resultado (estrellas) por desafío superado. */
    private Map<Integer, Integer> mejoresEstrellas(Integer idEstudiante) {
        Map<Integer, Integer> mejores = new HashMap<>();
        for (IntentoDesafioEntity i : intentos.findByIdEstudianteAndEstado(idEstudiante, "CORRECTO")) {
            mejores.merge(i.getIdDesafio(), i.getResultado().intValue(), Math::max);
        }
        return mejores;
    }
}
