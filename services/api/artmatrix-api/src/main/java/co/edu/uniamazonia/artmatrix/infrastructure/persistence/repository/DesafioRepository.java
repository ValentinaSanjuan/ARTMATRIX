package co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository;

import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.DesafioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DesafioRepository extends JpaRepository<DesafioEntity, Integer> {
}
