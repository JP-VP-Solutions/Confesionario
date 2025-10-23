package com.example.Confesionario.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MensajeChatDTO {
    private Long id;
    private String contenido;
    private LocalDateTime fechaHora;
    private UsuarioSimpleDTO usuario; // puede ser null si es del sistema
    private Boolean esDelSistema;
}