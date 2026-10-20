package co.edu.uniamazonia.artmatrix.presentation.controller;

import co.edu.uniamazonia.artmatrix.application.model.Vistas;
import co.edu.uniamazonia.artmatrix.application.service.AutenticacionService;
import co.edu.uniamazonia.artmatrix.presentation.dto.Solicitudes;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/** RF-01 Registrar estudiante, RF-02 Iniciar sesión. */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AutenticacionService auth;

    public AuthController(AutenticacionService auth) {
        this.auth = auth;
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public Vistas.Sesion registrar(@Valid @RequestBody Solicitudes.Registro r) {
        return auth.registrar(new AutenticacionService.DatosRegistro(r.nombre(), r.usuario(), r.correo(),
                r.contrasena(), r.telefono(), r.programa(), r.curso()));
    }

    @PostMapping("/login")
    public Vistas.Sesion login(@Valid @RequestBody Solicitudes.Login l) {
        return auth.iniciarSesion(l.usuario(), l.contrasena());
    }
}
