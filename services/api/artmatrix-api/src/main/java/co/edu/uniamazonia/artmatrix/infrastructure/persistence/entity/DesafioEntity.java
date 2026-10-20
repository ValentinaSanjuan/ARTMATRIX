package co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "desafio")
public class DesafioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_desafio")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_nivel")
    private NivelEntity nivel;

    private String nombre;
    private String descripcion;

    @Column(name = "tipo_desafio")
    private String tipo;

    private String instrucciones;
    private int orden;

    /** JSON con filas, columnas, modo, solucion, codigoInicial, etc. */
    @Column(columnDefinition = "json")
    private String configuracion;

    @OneToMany(mappedBy = "desafio")
    private List<DesafioObraEntity> obras = new ArrayList<>();

    public Integer getId() { return id; }
    public NivelEntity getNivel() { return nivel; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public String getTipo() { return tipo; }
    public String getInstrucciones() { return instrucciones; }
    public int getOrden() { return orden; }
    public String getConfiguracion() { return configuracion; }
    public List<DesafioObraEntity> getObras() { return obras; }
}
