package co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "estudiante_recompensa")
@IdClass(EstudianteRecompensaEntity.Clave.class)
public class EstudianteRecompensaEntity {

    @Id
    @Column(name = "id_estudiante")
    private Integer idEstudiante;

    @Id
    @Column(name = "id_recompensa")
    private Integer idRecompensa;

    @Column(name = "fecha_obtencion")
    private LocalDateTime fechaObtencion;

    public EstudianteRecompensaEntity() {
    }

    public EstudianteRecompensaEntity(Integer idEstudiante, Integer idRecompensa) {
        this.idEstudiante = idEstudiante;
        this.idRecompensa = idRecompensa;
        this.fechaObtencion = LocalDateTime.now();
    }

    public Integer getIdEstudiante() { return idEstudiante; }
    public Integer getIdRecompensa() { return idRecompensa; }
    public LocalDateTime getFechaObtencion() { return fechaObtencion; }

    public static class Clave implements Serializable {
        private Integer idEstudiante;
        private Integer idRecompensa;

        public Clave() {
        }

        public Clave(Integer idEstudiante, Integer idRecompensa) {
            this.idEstudiante = idEstudiante;
            this.idRecompensa = idRecompensa;
        }

        @Override
        public boolean equals(Object o) {
            return o instanceof Clave c && Objects.equals(idEstudiante, c.idEstudiante)
                    && Objects.equals(idRecompensa, c.idRecompensa);
        }

        @Override
        public int hashCode() {
            return Objects.hash(idEstudiante, idRecompensa);
        }
    }
}
