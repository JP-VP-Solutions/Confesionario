package com.example.Confesionario.repositories;

import com.example.Confesionario.entities.MensajeChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MensajeChatRepository extends JpaRepository<MensajeChat, Long> {

    // Traer los últimos 100 mensajes ordenados por fecha descendente
    List<MensajeChat> findTop100ByOrderByFechaHoraDesc();
    List<MensajeChat> findByFechaHoraAfterOrderByFechaHoraAsc(LocalDateTime fechaHora);

}