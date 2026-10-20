package co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository;

import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.DetalleRecorridoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetalleRecorridoRepository extends JpaRepository<DetalleRecorridoEntity, Integer> {
}
