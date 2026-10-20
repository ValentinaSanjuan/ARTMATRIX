package co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository;

import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.PistaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PistaRepository extends JpaRepository<PistaEntity, Integer> {
    Optional<PistaEntity> findByIdDesafioAndOrden(Integer idDesafio, int orden);
    long countByIdDesafio(Integer idDesafio);
}
