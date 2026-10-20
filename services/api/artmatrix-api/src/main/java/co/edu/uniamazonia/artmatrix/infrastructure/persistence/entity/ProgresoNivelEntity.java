package co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "progreso_nivel")
public class ProgresoNivelEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_progreso")
    private Integer id;

    @Column(name = "id_estudiante")
    private Integer idEstudiante;

    @ManyToOne
    @JoinColumn(name = "id_nivel")
    private NivelEntity nivel;

    /** BLOQUEADO | DISPONIBLE | COMPLETADO */
    private String estado;

    private BigDecimal porcentaje = BigDecimal.ZERO;
    private int estrellas;
    private int puntos;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    public ProgresoNivelEntity() {
    }

    public ProgresoNivelEntity(Integer idEstudiante, NivelEntity nivel, String estado) {
        this.idEstudiante = idEstudiante;
        this.nivel = nivel;
        this.estado = estado;
        this.fechaActualizacion = LocalDateTime.now();
    }

    public Integer getId() { return id; }
    public Integer getIdEstudiante() { return idEstudiante; }
    public NivelEntity getNivel() { return nivel; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public BigDecimal getPorcentaje() { return porcentaje; }
    public void setPorcentaje(BigDecimal porcentaje) { this.porcentaje = porcentaje; }
    public int getEstrellas() { return estrellas; }
    public void setEstrellas(int estrellas) { this.estrellas = estrellas; }
    public int getPuntos() { return puntos; }
    public void setPuntos(int puntos) { this.puntos = puntos; }
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}
