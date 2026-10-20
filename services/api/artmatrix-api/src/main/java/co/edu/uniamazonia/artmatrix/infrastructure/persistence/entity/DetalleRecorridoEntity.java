package co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "detalle_recorrido")
public class DetalleRecorridoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle")
    private Integer id;

    @Column(name = "id_intento")
    private Integer idIntento;

    @Column(name = "orden_visita")
    private int ordenVisita;

    private int fila;
    private int columna;

    public DetalleRecorridoEntity() {
    }

    public DetalleRecorridoEntity(Integer idIntento, int ordenVisita, int fila, int columna) {
        this.idIntento = idIntento;
        this.ordenVisita = ordenVisita;
        this.fila = fila;
        this.columna = columna;
    }

    public Integer getId() { return id; }
}
