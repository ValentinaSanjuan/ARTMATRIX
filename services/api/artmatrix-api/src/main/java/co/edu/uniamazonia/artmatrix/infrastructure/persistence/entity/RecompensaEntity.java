package co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "recompensa")
public class RecompensaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_recompensa")
    private Integer id;

    private String nombre;
    private String tipo;
    private String descripcion;
    private String criterio;

    public Integer getId() { return id; }
    public String getNombre() { return nombre; }
    public String getTipo() { return tipo; }
    public String getDescripcion() { return descripcion; }
    public String getCriterio() { return criterio; }
}
