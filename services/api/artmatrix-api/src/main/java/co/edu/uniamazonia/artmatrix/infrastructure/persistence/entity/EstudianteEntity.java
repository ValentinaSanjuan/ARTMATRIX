package co.edu.uniamazonia.artmatrix.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "estudiante")
public class EstudianteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estudiante")
    private Integer id;

    private String nombre;
    private String correo;
    private String usuario;

    @Column(name = "contrasena_hash")
    private String contrasenaHash;

    private String telefono;
    private String programa;
    private String curso;

    @Column(name = "tutorial_completado")
    private boolean tutorialCompletado;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    public Integer getId() { return id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }
    public String getContrasenaHash() { return contrasenaHash; }
    public void setContrasenaHash(String contrasenaHash) { this.contrasenaHash = contrasenaHash; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getPrograma() { return programa; }
    public void setPrograma(String programa) { this.programa = programa; }
    public String getCurso() { return curso; }
    public void setCurso(String curso) { this.curso = curso; }
    public boolean isTutorialCompletado() { return tutorialCompletado; }
    public void setTutorialCompletado(boolean tutorialCompletado) { this.tutorialCompletado = tutorialCompletado; }
    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
}
