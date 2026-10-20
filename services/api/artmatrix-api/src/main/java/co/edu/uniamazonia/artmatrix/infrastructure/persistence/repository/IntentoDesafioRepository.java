package co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository;

import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.IntentoDesafioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IntentoDesafioRepository extends JpaRepository<IntentoDesafioEntity, Integer> {
    long countByIdEstudianteAndIdDesafioAndEstado(Integer idEstudiante, Integer idDesafio, String estado);
    List<IntentoDesafioEntity> findByIdEstudianteAndEstado(Integer idEstudiante, String estado);
    long countByIdEstudiante(Integer idEstudiante);
}
