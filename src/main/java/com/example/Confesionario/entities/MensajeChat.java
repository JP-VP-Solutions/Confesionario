package com.example.Confesionario.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes_chat")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MensajeChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = true)
    private Usuario usuario; // NULL si es mensaje del sistema

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contenido;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;

    @Column(name = "es_del_sistema", nullable = false)
    private Boolean esDelSistema = false;

    @PrePersist
    protected void onCreate() {
        fechaHora = LocalDateTime.now();
    }
}