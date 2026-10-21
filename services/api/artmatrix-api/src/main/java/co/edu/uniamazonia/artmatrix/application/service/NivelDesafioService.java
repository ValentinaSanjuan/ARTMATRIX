package co.edu.uniamazonia.artmatrix.application.service;

import co.edu.uniamazonia.artmatrix.application.model.ConfiguracionDesafio;
import co.edu.uniamazonia.artmatrix.application.model.Vistas;
import co.edu.uniamazonia.artmatrix.domain.exception.RecursoNoEncontradoException;
import co.edu.uniamazonia.artmatrix.domain.model.EstadoNivel;
import co.edu.uniamazonia.artmatrix.domain.rule.ReglaDesbloqueo;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.DesafioEntity;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.IntentoDesafioEntity;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.NivelEntity;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.ProgresoNivelEntity;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository.DesafioRepository;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository.IntentoDesafioRepository;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository.NivelRepository;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository.ProgresoNivelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/** Servicio de niveles y desafíos: contenido, reglas y configuración de actividades (RF-04, RF-05, RF-08). */
@Service
@Transactional(readOnly = true)
public class NivelDesafioService {

    private final NivelRepository niveles;
    private final DesafioRepository desafios;
    private final ProgresoNivelRepository progresos;
    private final IntentoDesafioRepository intentos;
    private final OrientacionService orientacion;

    public NivelDesafioService(NivelRepository niveles, DesafioRepository desafios,
                               ProgresoNivelRepository progresos, IntentoDesafioRepository intentos,
                               OrientacionService orientacion) {
        this.niveles = niveles;
        this.desafios = desafios;
        this.progresos = progresos;
        this.intentos = intentos;
        this.orientacion = orientacion;
    }

    public List<Vistas.NivelResumen> listar(Integer idEstudiante) {
        Map<Integer, ProgresoNivelEntity> porNivel = progresos.findByIdEstudiante(idEstudiante).stream()
                .collect(Collectors.toMap(p -> p.getNivel().getId(), Function.identity()));
        List<NivelEntity> todos = niveles.findAllByOrderByOrdenAsc();
        return todos.stream().map(n -> resumen(n, porNivel.get(n.getId()), todos)).toList();
    }

    public Vistas.NivelDetalle detalle(Integer idEstudiante, Integer idNivel) {
        NivelEntity nivel = niveles.findById(idNivel)
                .orElseThrow(() -> new RecursoNoEncontradoException("La sala solicitada no existe."));
        List<NivelEntity> todos = niveles.findAllByOrderByOrdenAsc();
        ProgresoNivelEntity progreso = progresos.findByIdEstudianteAndNivel_Id(idEstudiante, idNivel).orElse(null);
        Vistas.NivelResumen resumen = resumen(nivel, progreso, todos);
        Set<Integer> superados = desafiosSuperados(idEstudiante);
        List<Vistas.Desafio> lista = nivel.getDesafios().stream()
                .map(d -> vistaDesafio(d, superados.contains(d.getId())))
                .toList();
        return new Vistas.NivelDetalle(resumen, lista);
    }

    public DesafioEntity desafio(Integer idDesafio) {
        return desafios.findById(idDesafio)
                .orElseThrow(() -> new RecursoNoEncontradoException("El desafío solicitado no existe."));
    }

    /** Verifica que el estudiante pueda trabajar en el desafío (su sala no está bloqueada). */
    public void verificarAcceso(Integer idEstudiante, DesafioEntity desafio) {
        NivelEntity nivel = desafio.getNivel();
        ProgresoNivelEntity p = progresos.findByIdEstudianteAndNivel_Id(idEstudiante, nivel.getId()).orElse(null);
        // Todas las salas están abiertas: solo se normaliza un progreso antiguo marcado como bloqueado.
        if (p != null && EstadoNivel.BLOQUEADO.name().equals(p.getEstado())) {
            p.setEstado(EstadoNivel.DISPONIBLE.name());
            progresos.save(p);
        }
    }

    Set<Integer> desafiosSuperados(Integer idEstudiante) {
        return intentos.findByIdEstudianteAndEstado(idEstudiante, "CORRECTO").stream()
                .map(IntentoDesafioEntity::getIdDesafio).collect(Collectors.toSet());
    }

    Vistas.NivelResumen resumen(NivelEntity n, ProgresoNivelEntity p, List<NivelEntity> todos) {
        String estado = p != null ? p.getEstado()
                : (ReglaDesbloqueo.disponibleAlInicio(n.getOrden()) ? EstadoNivel.DISPONIBLE : EstadoNivel.BLOQUEADO).name();
        if (EstadoNivel.BLOQUEADO.name().equals(estado) && ReglaDesbloqueo.disponibleAlInicio(n.getOrden())) {
            estado = EstadoNivel.DISPONIBLE.name();
        }
        String requisito = null;
        if (EstadoNivel.BLOQUEADO.name().equals(estado)) {
            String anterior = todos.stream().filter(x -> x.getOrden() == n.getOrden() - 1)
                    .map(NivelEntity::getNombre).findFirst().orElse("");
            requisito = ReglaDesbloqueo.requisito(n.getOrden(), anterior);
        }
        return new Vistas.NivelResumen(n.getId(), n.getOrden(), n.getNombre(), n.getDescripcion(),
                n.getDificultad(), estado,
                p == null ? 0 : p.getEstrellas(), p == null ? 0 : p.getPuntos(),
                p == null ? BigDecimal.ZERO : p.getPorcentaje(),
                n.getDesafios().size(), requisito);
    }

    private Vistas.Desafio vistaDesafio(DesafioEntity d, boolean superado) {
        ConfiguracionDesafio c = ConfiguracionDesafio.leer(d.getConfiguracion());
        List<Vistas.ObraEnMatriz> obras = d.getObras().stream()
                .map(o -> new Vistas.ObraEnMatriz(o.getObra().getId(), o.getObra().getNombre(),
                        o.getObra().getAutor(), o.getObra().getRecursoUrl(), o.getFilaInicial(), o.getColumnaInicial()))
                .toList();
        return new Vistas.Desafio(d.getId(), d.getOrden(), d.getNombre(), d.getDescripcion(), d.getTipo(),
                d.getInstrucciones(), c.filas(), c.columnas(), c.modo().name(), c.obraMovil(),
                c.baldosas() == null ? List.of() : c.baldosas(), c.codigoInicial(),
                Boolean.TRUE.equals(c.nocturno()), orientacion.totalPistas(d.getId()), superado,
                obras, orientacion.mensajes(d.getId()));
    }
}
