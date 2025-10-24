package com.example.Confesionario.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "confesiones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Confesion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contenido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "autor_id", nullable = false)
    private Usuario autor;

    @OneToMany(mappedBy = "confesion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comentario> comentarios = new ArrayList<>();

    @Column(name = "fecha")
    private LocalDateTime fecha;

    @Column(name = "revelada")
    private Boolean revelada = false;

    @Column(name = "eliminada")
    private Boolean eliminada = false;

    @Column(name = "likes")
    private Integer likes = 0;

    @Column(name = "reportes")
    private Integer reportes = 0;

    // Métodos de conveniencia para la relación bidireccional
    public void agregarComentario(Comentario comentario) {
        comentarios.add(comentario);
        comentario.setConfesion(this);
    }

    public void eliminarComentario(Comentario comentario) {
        comentarios.remove(comentario);
        comentario.setConfesion(null);
    }

    @PrePersist
    protected void onCreate() {
        fecha = LocalDateTime.now(ZoneId.of("America/Argentina/Cordoba"));
        if (revelada == null) {
            revelada = false;
        }
        if (eliminada == null) {
            eliminada = false;
        }
        if (likes == null) {
            likes = 0;
        }
        if (reportes == null) {
            reportes = 0;
        }
    }
}