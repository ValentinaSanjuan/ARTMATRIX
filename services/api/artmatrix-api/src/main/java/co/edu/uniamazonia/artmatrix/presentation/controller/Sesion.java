package co.edu.uniamazonia.artmatrix.presentation.controller;

import org.springframework.security.oauth2.jwt.Jwt;

/** Obtiene el id del estudiante autenticado desde el token. */
final class Sesion {

    private Sesion() {
    }

    static Integer id(Jwt jwt) {
        return Integer.valueOf(jwt.getSubject());
    }
}
