package co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "pista")
public class PistaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pista")
    private Integer id;

    @Column(name = "id_desafio")
    private Integer idDesafio;

    @Column(name = "orden_pista")
    private int orden;

    private String contenido;

    public Integer getId() { return id; }
    public Integer getIdDesafio() { return idDesafio; }
    public int getOrden() { return orden; }
    public String getContenido() { return contenido; }
}
