package com.example.Confesionario.dto;

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
public class ConfesionPublicaDTO {
    private Long id;
    private String contenido;
    private String autor = "Anónimo"; // Siempre anónimo para usuarios normales
    private LocalDateTime fecha;
    private Integer likes;
    private Integer comentarios; // Cantidad total de comentarios
    private Boolean revelada;
    private List<ComentarioDTO> listaComentarios; // Lista de comentarios

    // Constructor desde Entity
    public ConfesionPublicaDTO(Confesion confesion, Integer cantidadComentarios) {
        this(confesion, cantidadComentarios, null);
    }

    // Constructor que incluye la lista de comentarios
    public ConfesionPublicaDTO(Confesion confesion, Integer cantidadComentarios, List<ComentarioDTO> comentarios) {
        this.id = confesion.getId();
        this.contenido = confesion.getContenido();
        this.autor = "Anónimo"; // Siempre anónimo
        this.fecha = confesion.getFecha();
        this.likes = confesion.getLikes() != null ? confesion.getLikes() : 0;
        this.comentarios = cantidadComentarios != null ? cantidadComentarios : 0;
        this.revelada = Boolean.TRUE.equals(confesion.getRevelada());
        this.listaComentarios = comentarios != null ? comentarios : List.of();
    }

    // Método de fábrica estático para crear DTO con comentarios
    public static ConfesionPublicaDTO conComentarios(Confesion confesion) {
        if (confesion == null) {
            return null;
        }

        List<ComentarioDTO> comentariosDTO = confesion.getComentarios() != null ?
                confesion.getComentarios().stream()
                        .map(comentario -> new ComentarioDTO(
                                comentario.getId(),
                                comentario.getContenido(),
                                comentario.getFecha()
                        ))
                        .collect(Collectors.toList()) :
                List.of();

        return new ConfesionPublicaDTO(
                confesion,
                confesion.getComentarios() != null ? confesion.getComentarios().size() : 0,
                comentariosDTO
        );
    }
}