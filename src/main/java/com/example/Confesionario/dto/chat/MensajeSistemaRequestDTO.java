package com.example.Confesionario.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MensajeSistemaRequestDTO {
    private String contenido;
    private String nombreSistema;
}