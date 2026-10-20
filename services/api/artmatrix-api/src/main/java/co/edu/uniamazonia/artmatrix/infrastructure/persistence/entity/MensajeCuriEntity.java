package co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "mensaje_curi")
public class MensajeCuriEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mensaje")
    private Integer id;

    @Column(name = "id_desafio")
    private Integer idDesafio;

    private String tipo;
    private String contenido;

    @Column(name = "condicion_activacion")
    private String condicionActivacion;

    public Integer getId() { return id; }
    public Integer getIdDesafio() { return idDesafio; }
    public String getTipo() { return tipo; }
    public String getContenido() { return contenido; }
    public String getCondicionActivacion() { return condicionActivacion; }
}
