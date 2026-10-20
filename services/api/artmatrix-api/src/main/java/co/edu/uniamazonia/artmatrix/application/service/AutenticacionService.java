package co.edu.uniamazonia.artmatrix.application.service;

import co.edu.uniamazonia.artmatrix.application.model.Vistas;
import co.edu.uniamazonia.artmatrix.application.port.GeneradorTokenPort;
import co.edu.uniamazonia.artmatrix.domain.exception.ReglaNegocioException;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.EstudianteEntity;
import co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository.EstudianteRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/** Servicio de usuarios y autenticación (RF-01, RF-02). */
@Service
public class AutenticacionService {

    private final EstudianteRepository estudiantes;
    private final PasswordEncoder passwordEncoder;
    private final GeneradorTokenPort tokens;
    private final ProgresoRecompensaService progreso;

    public AutenticacionService(EstudianteRepository estudiantes, PasswordEncoder passwordEncoder,
                                GeneradorTokenPort tokens, ProgresoRecompensaService progreso) {
        this.estudiantes = estudiantes;
        this.passwordEncoder = passwordEncoder;
        this.tokens = tokens;
        this.progreso = progreso;
    }

    public record DatosRegistro(String nombre, String usuario, String correo, String contrasena,
                                String telefono, String programa, String curso) {
    }

    @Transactional
    public Vistas.Sesion registrar(DatosRegistro datos) {
        String usuario = datos.usuario().trim();
        String correo = datos.correo().trim().toLowerCase();
        if (estudiantes.existsByUsuarioIgnoreCase(usuario)) {
            throw new ReglaNegocioException("El usuario \"" + usuario + "\" ya está registrado.");
        }
        if (estudiantes.existsByCorreoIgnoreCase(correo)) {
            throw new ReglaNegocioException("Ya existe una cuenta con ese correo.");
        }
        EstudianteEntity e = new EstudianteEntity();
        e.setNombre(datos.nombre().trim());
        e.setUsuario(usuario);
        e.setCorreo(correo);
        e.setContrasenaHash(passwordEncoder.encode(datos.contrasena()));
        e.setTelefono(vacioANulo(datos.telefono()));
        e.setPrograma(vacioANulo(datos.programa()));
        e.setCurso(vacioANulo(datos.curso()));
        e.setFechaRegistro(LocalDateTime.now());
        e = estudiantes.save(e);
        progreso.inicializar(e.getId());
        return new Vistas.Sesion(tokens.generar(e.getId(), e.getUsuario()), vista(e));
    }

    @Transactional(readOnly = true)
    public Vistas.Sesion iniciarSesion(String identificador, String contrasena) {
        String id = identificador.trim();
        EstudianteEntity e = estudiantes.findByUsuarioIgnoreCaseOrCorreoIgnoreCase(id, id)
                .filter(est -> passwordEncoder.matches(contrasena, est.getContrasenaHash()))
                .orElseThrow(() -> new BadCredentialsException("Usuario o contraseña incorrectos."));
        return new Vistas.Sesion(tokens.generar(e.getId(), e.getUsuario()), vista(e));
    }

    static Vistas.Estudiante vista(EstudianteEntity e) {
        return new Vistas.Estudiante(e.getId(), e.getNombre(), e.getUsuario(), e.getCorreo(),
                e.getTelefono(), e.getPrograma(), e.getCurso(), e.isTutorialCompletado());
    }

    private static String vacioANulo(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
