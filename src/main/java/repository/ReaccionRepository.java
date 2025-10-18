package repository;

import entities.Reaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReaccionRepository extends JpaRepository<Reaccion, Long> {

    Optional<Reaccion> findByConfesionIdAndUsuarioId(Long confesionId, Long usuarioId);

    boolean existsByConfesionIdAndUsuarioId(Long confesionId, Long usuarioId);

    long countByConfesionId(Long confesionId);
}