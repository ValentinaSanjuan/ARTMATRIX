package co.edu.uniamazonia.artmatrix.presentation.controller;

import co.edu.uniamazonia.artmatrix.application.model.Vistas;
import co.edu.uniamazonia.artmatrix.application.service.NivelDesafioService;
import co.edu.uniamazonia.artmatrix.application.service.ProgresoRecompensaService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** RF-13 Seguimiento del progreso, RF-12 recompensas y RF-03 tutorial. */
@RestController
@RequestMapping("/api/progreso")
public class ProgresoController {

    private final ProgresoRecompensaService progreso;
    private final NivelDesafioService niveles;

    public ProgresoController(ProgresoRecompensaService progreso, NivelDesafioService niveles) {
        this.progreso = progreso;
        this.niveles = niveles;
    }

    @GetMapping
    public Vistas.Progreso resumen(@AuthenticationPrincipal Jwt jwt) {
        Integer id = Sesion.id(jwt);
        return progreso.resumen(id, niveles.listar(id));
    }

    @PostMapping("/tutorial")
    public List<Vistas.Recompensa> completarTutorial(@AuthenticationPrincipal Jwt jwt) {
        return progreso.completarTutorial(Sesion.id(jwt));
    }
}
