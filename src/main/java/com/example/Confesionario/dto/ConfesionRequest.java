package com.example.Confesionario.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfesionRequest {

    @NotBlank(message = "El contenido de la confesión es obligatorio")
    @Size(min = 10, max = 5000, message = "La confesión debe tener entre 10 y 5000 caracteres")
    private String contenido;
}