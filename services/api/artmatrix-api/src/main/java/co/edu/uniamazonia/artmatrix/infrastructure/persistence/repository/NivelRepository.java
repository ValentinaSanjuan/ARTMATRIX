package co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository;

import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.NivelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface NivelRepository extends JpaRepository<NivelEntity, Integer> {
    List<NivelEntity> findAllByOrderByOrdenAsc();
    Optional<NivelEntity> findByOrden(int orden);
}
