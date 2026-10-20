package co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository;

import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.EstudianteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EstudianteRepository extends JpaRepository<EstudianteEntity, Integer> {
    Optional<EstudianteEntity> findByUsuarioIgnoreCaseOrCorreoIgnoreCase(String usuario, String correo);
    boolean existsByUsuarioIgnoreCase(String usuario);
    boolean existsByCorreoIgnoreCase(String correo);
}
