package co.edu.uniamazonia.artmatrix.presentation.handler;

import co.edu.uniamazonia.artmatrix.domain.exception.RecursoNoEncontradoException;
import co.edu.uniamazonia.artmatrix.domain.exception.ReglaNegocioException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

/** Traduce las excepciones a mensajes claros para el estudiante. */
@RestControllerAdvice
public class ManejadorErrores {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail validacion(MethodArgumentNotValidException e) {
        String detalle = e.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getDefaultMessage()).distinct().collect(Collectors.joining(". "));
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, detalle);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ProblemDetail credenciales(BadCredentialsException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, e.getMessage());
    }

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ProblemDetail noEncontrado(RecursoNoEncontradoException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(ReglaNegocioException.class)
    public ProblemDetail regla(ReglaNegocioException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.getMessage());
    }
}
