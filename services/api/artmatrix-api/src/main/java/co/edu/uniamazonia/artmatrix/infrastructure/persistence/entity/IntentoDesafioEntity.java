package co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "intento_desafio")
public class IntentoDesafioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_intento")
    private Integer id;

    @Column(name = "id_estudiante")
    private Integer idEstudiante;

    @Column(name = "id_desafio")
    private Integer idDesafio;

    @Column(name = "fecha_inicio")
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    /** CORRECTO | INCORRECTO */
    private String estado;

    /** Estrellas obtenidas (0 a 3). */
    private BigDecimal resultado = BigDecimal.ZERO;

    @Column(name = "pistas_usadas")
    private int pistasUsadas;

    public Integer getId() { return id; }
    public Integer getIdEstudiante() { return idEstudiante; }
    public void setIdEstudiante(Integer idEstudiante) { this.idEstudiante = idEstudiante; }
    public Integer getIdDesafio() { return idDesafio; }
    public void setIdDesafio(Integer idDesafio) { this.idDesafio = idDesafio; }
    public LocalDateTime getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDateTime getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public BigDecimal getResultado() { return resultado; }
    public void setResultado(BigDecimal resultado) { this.resultado = resultado; }
    public int getPistasUsadas() { return pistasUsadas; }
    public void setPistasUsadas(int pistasUsadas) { this.pistasUsadas = pistasUsadas; }
}
