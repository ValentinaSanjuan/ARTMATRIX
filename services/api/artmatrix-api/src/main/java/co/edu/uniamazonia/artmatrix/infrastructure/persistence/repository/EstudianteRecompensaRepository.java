package co.edu.uniamazonia.artmatrix.infrastructure.persistence.repository;

import co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity.EstudianteRecompensaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EstudianteRecompensaRepository
        extends JpaRepository<EstudianteRecompensaEntity, EstudianteRecompensaEntity.Clave> {
    List<EstudianteRecompensaEntity> findByIdEstudiante(Integer idEstudiante);
}
