package co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "desafio_obra")
public class DesafioObraEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_desafio_obra")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_desafio")
    private DesafioEntity desafio;

    @ManyToOne
    @JoinColumn(name = "id_obra")
    private ObraEntity obra;

    @Column(name = "fila_inicial")
    private int filaInicial;

    @Column(name = "columna_inicial")
    private int columnaInicial;

    public Integer getId() { return id; }
    public ObraEntity getObra() { return obra; }
    public int getFilaInicial() { return filaInicial; }
    public int getColumnaInicial() { return columnaInicial; }
}
