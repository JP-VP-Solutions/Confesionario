package repository;

import entities.Confesion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConfesionRepository extends JpaRepository<Confesion, Long> {

    // Obtener confesiones no eliminadas, ordenadas por fecha descendente
    List<Confesion> findByEliminadaFalseOrderByFechaDesc();

    // Obtener top N confesiones (para preview sin login)
    List<Confesion> findTop5ByEliminadaFalseOrderByFechaDesc();

    // Contar confesiones de hoy
    @Query("SELECT COUNT(c) FROM Confesion c WHERE c.fecha >= :fechaInicio AND c.eliminada = false")
    long countByFechaAfter(@Param("fechaInicio") LocalDateTime fechaInicio);

    // Obtener confesiones por usuario (para admin)
    List<Confesion> findByAutorIdAndEliminadaFalseOrderByFechaDesc(Long autorId);

    // Top confesiones por likes
    List<Confesion> findTop10ByEliminadaFalseOrderByLikesDesc();
}