package com.example.Confesionario.dto;

import com.example.Confesionario.entities.Confesion;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfesionPublicaDTO {

    private Long id;
    private String contenido;
    private String autor = "Anónimo"; // Siempre anónimo para usuarios
    private LocalDateTime fecha;
    private Integer likes;
    private Integer comentarios;
    private Boolean revelada;

    // Constructor desde Entity
    public ConfesionPublicaDTO(Confesion confesion, Integer cantidadComentarios) {
        this.id = confesion.getId();
        this.contenido = confesion.getContenido();
        this.autor = "Anónimo";
        this.fecha = confesion.getFecha();
        this.likes = confesion.getLikes();
        this.comentarios = cantidadComentarios;
        this.revelada = confesion.getRevelada();
    }
}