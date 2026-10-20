package co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "obra")
public class ObraEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_obra")
    private Integer id;

    private String nombre;
    private String autor;
    private BigDecimal valor;

    @Column(name = "recurso_url")
    private String recursoUrl;

    public Integer getId() { return id; }
    public String getNombre() { return nombre; }
    public String getAutor() { return autor; }
    public BigDecimal getValor() { return valor; }
    public String getRecursoUrl() { return recursoUrl; }
}
