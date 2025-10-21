// Crear ComentarioRequest.java
package com.example.Confesionario.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ComentarioRequest {
    @NotBlank(message = "El contenido del comentario es obligatorio")
    @Size(min = 1, max = 1000, message = "El comentario debe tener entre 1 y 1000 caracteres")
    private String contenido;

    // No necesitamos el ID de la confesión aquí, vendrá en la URL
}