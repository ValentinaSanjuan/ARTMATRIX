package co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "nivel")
public class NivelEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nivel")
    private Integer id;

    private String nombre;
    private String descripcion;
    private String dificultad;

    @Column(name = "orden_referencial")
    private int orden;

    @OneToMany(mappedBy = "nivel")
    @OrderBy("orden ASC")
    private List<DesafioEntity> desafios = new ArrayList<>();

    public Integer getId() { return id; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public String getDificultad() { return dificultad; }
    public int getOrden() { return orden; }
    public List<DesafioEntity> getDesafios() { return desafios; }
}
