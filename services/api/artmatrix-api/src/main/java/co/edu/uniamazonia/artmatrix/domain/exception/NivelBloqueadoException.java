package co.edu.uniamazonia.artmatrix.domain.exception;

/** RF-04: la sala está bloqueada; el mensaje informa el requisito pendiente. */
public class NivelBloqueadoException extends RuntimeException {
    public NivelBloqueadoException(String requisito) {
        super(requisito);
    }
}
