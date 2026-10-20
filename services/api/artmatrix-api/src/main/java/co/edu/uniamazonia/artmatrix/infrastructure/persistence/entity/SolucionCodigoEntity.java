package co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "solucion_codigo")
public class SolucionCodigoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solucion")
    private Integer id;

    @Column(name = "id_intento")
    private Integer idIntento;

    /** Valor del ENUM de MySQL: 'Java' o 'C++'. */
    private String lenguaje;

    private String codigo;
    private String salida;

    @Column(name = "es_correcta")
    private boolean esCorrecta;

    public SolucionCodigoEntity() {
    }

    public SolucionCodigoEntity(Integer idIntento, String lenguaje, String codigo, String salida, boolean esCorrecta) {
        this.idIntento = idIntento;
        this.lenguaje = lenguaje;
        this.codigo = codigo;
        this.salida = salida;
        this.esCorrecta = esCorrecta;
    }

    public Integer getId() { return id; }
}
