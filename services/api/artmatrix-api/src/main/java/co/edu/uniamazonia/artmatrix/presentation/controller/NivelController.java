package co.edu.uniamazonia.artmatrix.presentation.controller;

import co.edu.uniamazonia.artmatrix.application.model.Vistas;
import co.edu.uniamazonia.artmatrix.application.service.NivelDesafioService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** RF-04 Avanzar nivel, RF-05 Representar matrices, RF-08 Desafíos. */
@RestController
@RequestMapping("/api/niveles")
public class NivelController {

    private final NivelDesafioService niveles;

    public NivelController(NivelDesafioService niveles) {
        this.niveles = niveles;
    }

    @GetMapping
    public List<Vistas.NivelResumen> listar(@AuthenticationPrincipal Jwt jwt) {
        return niveles.listar(Sesion.id(jwt));
    }

    @GetMapping("/{idNivel}")
    public Vistas.NivelDetalle detalle(@AuthenticationPrincipal Jwt jwt, @PathVariable Integer idNivel) {
        return niveles.detalle(Sesion.id(jwt), idNivel);
    }
}
