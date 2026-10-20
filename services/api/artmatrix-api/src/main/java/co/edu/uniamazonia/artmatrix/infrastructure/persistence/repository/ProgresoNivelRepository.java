package co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository;

import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.ProgresoNivelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProgresoNivelRepository extends JpaRepository<ProgresoNivelEntity, Integer> {
    List<ProgresoNivelEntity> findByIdEstudiante(Integer idEstudiante);
    Optional<ProgresoNivelEntity> findByIdEstudianteAndNivel_Id(Integer idEstudiante, Integer idNivel);
}
