package com.example.Confesionario.repository;

import com.example.Confesionario.entities.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {

    List<Comentario> findByConfesionIdOrderByFechaAsc(Long confesionId);

    long countByConfesionId(Long confesionId);
}