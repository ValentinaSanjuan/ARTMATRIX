package co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository;

import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.MensajeCuriEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MensajeCuriRepository extends JpaRepository<MensajeCuriEntity, Integer> {
    List<MensajeCuriEntity> findByIdDesafio(Integer idDesafio);
}
