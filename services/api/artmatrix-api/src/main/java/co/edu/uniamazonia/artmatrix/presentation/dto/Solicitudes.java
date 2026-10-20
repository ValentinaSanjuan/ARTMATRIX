package co.edu.uniamazonia.artmatrix.presentation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

/** Cuerpos de las peticiones HTTP, con sus validaciones (RF-01: campos obligatorios y datos válidos). */
public final class Solicitudes {

    private Solicitudes() {
    }

    public record Registro(
            @NotBlank(message = "El nombre es obligatorio") @Size(max = 100) String nombre,
            @NotBlank(message = "El usuario es obligatorio") @Size(min = 3, max = 60, message = "El usuario debe tener entre 3 y 60 caracteres") String usuario,
            @NotBlank(message = "El correo es obligatorio") @Email(message = "El correo no es válido") @Size(max = 120) String correo,
            @NotBlank(message = "La contraseña es obligatoria") @Size(min = 6, max = 72, message = "La contraseña debe tener al menos 6 caracteres") String contrasena,
            @Size(max = 30) String telefono,
            @Size(max = 120) String programa,
            @Size(max = 60) String curso) {
    }

    public record Login(
            @NotBlank(message = "Escribe tu usuario o correo") String usuario,
            @NotBlank(message = "Escribe tu contraseña") String contrasena) {
    }

    public record Paso(@Min(-1000) @Max(1000) int fila, @Min(-1000) @Max(1000) int columna) {
    }

    public record Evaluacion(
            @NotNull @Size(max = 500, message = "El recorrido es demasiado largo") List<@Valid Paso> recorrido,
            @Size(max = 20000, message = "El código es demasiado largo") String codigo,
            String salida,
            @Min(0) @Max(20) int pistasUsadas,
            LocalDateTime iniciadoEn) {
    }
}
