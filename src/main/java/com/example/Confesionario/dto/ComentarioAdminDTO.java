package com.example.Confesionario.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComentarioAdminDTO {
    private Long id;
    private String contenido;
    private String autor;  // En el DTO de admin mostramos el autor real
    private Long autorId;  // ID del autor para referencia
    private LocalDateTime fecha;
}
