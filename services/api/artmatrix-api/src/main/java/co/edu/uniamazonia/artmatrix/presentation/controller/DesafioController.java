package co.edu.uniamazonia.artmatrix.presentation.controller;

import co.edu.uniamazonia.artmatrix.application.model.Vistas;
import co.edu.uniamazonia.artmatrix.application.service.EvaluacionService;
import co.edu.uniamazonia.artmatrix.application.service.NivelDesafioService;
import co.edu.uniamazonia.artmatrix.application.service.OrientacionService;
import co.edu.uniamazonia.artmatrix.domain.model.Celda;
import co.edu.uniamazonia.artmatrix.presentation.dto.Solicitudes;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

/** RF-06/07/08/11 evaluación de desafíos y RF-09 pistas. */
@RestController
@RequestMapping("/api/desafios/{idDesafio}")
public class DesafioController {

    private final EvaluacionService evaluacion;
    private final OrientacionService orientacion;
    private final NivelDesafioService niveles;

    public DesafioController(EvaluacionService evaluacion, OrientacionService orientacion, NivelDesafioService niveles) {
        this.evaluacion = evaluacion;
        this.orientacion = orientacion;
        this.niveles = niveles;
    }

    @PostMapping("/evaluar")
    public Vistas.ResultadoEvaluacion evaluar(@AuthenticationPrincipal Jwt jwt, @PathVariable Integer idDesafio,
                                              @Valid @RequestBody Solicitudes.Evaluacion e) {
        var recorrido = e.recorrido().stream().map(p -> new Celda(p.fila(), p.columna())).toList();
        return evaluacion.evaluar(Sesion.id(jwt), idDesafio,
                new EvaluacionService.Solicitud(recorrido, e.codigo(), e.salida(), e.pistasUsadas(), e.iniciadoEn()));
    }

    @GetMapping("/pistas/{orden}")
    public Vistas.Pista pista(@AuthenticationPrincipal Jwt jwt, @PathVariable Integer idDesafio, @PathVariable int orden) {
        niveles.verificarAcceso(Sesion.id(jwt), niveles.desafio(idDesafio));
        return orientacion.pista(idDesafio, orden);
    }
}
