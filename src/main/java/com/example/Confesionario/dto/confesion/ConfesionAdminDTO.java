package com.example.Confesionario.dto.confesion;

import com.example.Confesionario.dto.comentario.ComentarioAdminDTO;
import com.example.Confesionario.entities.Confesion;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfesionAdminDTO {
    private Long id;
    private String contenido;
    private String autor;
    private Long autorId;
    private LocalDateTime fecha;
    private Integer likes;
    private Integer comentarios;
    private Boolean revelada;
    private Boolean eliminada;
    private Integer reportes;
    private List<ComentarioAdminDTO> listaComentarios;

    // Constructor desde Entity
    public ConfesionAdminDTO(Confesion confesion) {
        this.id = confesion.getId();
        this.contenido = confesion.getContenido();
        this.autor = confesion.getAutor().getUsername();
        this.autorId = confesion.getAutor().getId();
        this.fecha = confesion.getFecha();
        this.likes = confesion.getLikes();
        this.comentarios = confesion.getComentarios() != null ? confesion.getComentarios().size() : 0;
        this.revelada = confesion.getRevelada();
        this.eliminada = confesion.getEliminada();
        this.reportes = confesion.getReportes();

        if (confesion.getComentarios() != null) {
            this.listaComentarios = confesion.getComentarios().stream()
                    .map(comentario -> new ComentarioAdminDTO(
                            comentario.getId(),
                            comentario.getContenido(),
                            comentario.getAutor().getUsername(),
                            comentario.getAutor().getId(),
                            comentario.getFecha()
                    ))
                    .collect(Collectors.toList());
        }
    }
}