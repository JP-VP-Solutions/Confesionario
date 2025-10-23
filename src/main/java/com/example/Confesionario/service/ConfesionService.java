package com.example.Confesionario.service;

import com.example.Confesionario.dto.comentario.ComentarioDTO;
import com.example.Confesionario.dto.confesion.ConfesionPublicaDTO;
import com.example.Confesionario.dto.confesion.ConfesionRequest;
import com.example.Confesionario.entities.Confesion;
import com.example.Confesionario.entities.Reaccion;
import com.example.Confesionario.entities.Usuario;
import com.example.Confesionario.repository.ComentarioRepository;
import com.example.Confesionario.repository.ConfesionRepository;
import com.example.Confesionario.repository.ReaccionRepository;
import com.example.Confesionario.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ConfesionService {

    @Autowired
    private ConfesionRepository confesionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private ReaccionRepository reaccionRepository;

    // Obtener preview (primeras 5 confesiones para landing sin login)
    public List<ConfesionPublicaDTO> getPreview() {
        List<Confesion> confesiones = confesionRepository.findTop5ByEliminadaFalseOrderByFechaDesc();

        return confesiones.stream()
                .map(c -> {
                    // Cargar los comentarios para esta confesión
                    List<ComentarioDTO> comentarios = comentarioRepository.findByConfesionIdOrderByFechaAsc(c.getId())
                            .stream()
                            .map(comentario -> new ComentarioDTO(
                                    comentario.getId(),
                                    comentario.getContenido(),
                                    comentario.getFecha()
                            ))
                            .collect(Collectors.toList());

                    // Crear el DTO con los comentarios
                    return new ConfesionPublicaDTO(
                            c,
                            comentarios.size(),
                            comentarios
                    );
                })
                .collect(Collectors.toList());
    }

    // Obtener todas las confesiones (usuarios logueados)
    // Modificar el método getTodasLasConfesiones
    public List<ConfesionPublicaDTO> getTodasLasConfesiones() {
        List<Confesion> confesiones = confesionRepository.findByEliminadaFalseOrderByFechaDesc();

        return confesiones.stream()
                .map(c -> {
                    // Cargar los comentarios para esta confesión
                    List<ComentarioDTO> comentarios = comentarioRepository.findByConfesionIdOrderByFechaAsc(c.getId())
                            .stream()
                            .map(comentario -> new ComentarioDTO(
                                    comentario.getId(),
                                    comentario.getContenido(),
                                    comentario.getFecha()
                            ))
                            .collect(Collectors.toList());

                    // Crear el DTO con los comentarios
                    return new ConfesionPublicaDTO(
                            c,
                            comentarios.size(),
                            comentarios
                    );
                })
                .collect(Collectors.toList());
    }

    // Crear nueva confesión
    @Transactional
    public ConfesionPublicaDTO crearConfesion(Long usuarioId, ConfesionRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getBaneado()) {
            throw new RuntimeException("Usuario baneado");
        }

        Confesion confesion = new Confesion();
        confesion.setContenido(request.getContenido());
        confesion.setAutor(usuario);

        Confesion guardada = confesionRepository.save(confesion);

        return new ConfesionPublicaDTO(guardada, 0);
    }

    // Dar like a una confesión
    @Transactional
    public void darLike(Long confesionId, Long usuarioId) {
        Confesion confesion = confesionRepository.findById(confesionId)
                .orElseThrow(() -> new RuntimeException("Confesión no encontrada"));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar si ya dio like
        if (reaccionRepository.existsByConfesionIdAndUsuarioId(confesionId, usuarioId)) {
            throw new RuntimeException("Ya diste like a esta confesión");
        }

        // Crear reacción
        Reaccion reaccion = new Reaccion();
        reaccion.setConfesion(confesion);
        reaccion.setUsuario(usuario);
        reaccion.setTipo("like");
        reaccionRepository.save(reaccion);

        // Incrementar contador de likes
        confesion.setLikes(confesion.getLikes() + 1);
        confesionRepository.save(confesion);
    }

    // Quitar like
    @Transactional
    public void quitarLike(Long confesionId, Long usuarioId) {
        Confesion confesion = confesionRepository.findById(confesionId)
                .orElseThrow(() -> new RuntimeException("Confesión no encontrada"));

        Reaccion reaccion = reaccionRepository.findByConfesionIdAndUsuarioId(confesionId, usuarioId)
                .orElseThrow(() -> new RuntimeException("No has dado like a esta confesión"));

        reaccionRepository.delete(reaccion);

        // Decrementar contador
        confesion.setLikes(Math.max(0, confesion.getLikes() - 1));
        confesionRepository.save(confesion);
    }

    // Obtener estadísticas para landing
    public Map<String, Object> getEstadisticas() {
        long totalConfesiones = confesionRepository.count();
        long totalUsuarios = usuarioRepository.count();
        long confesionesHoy = confesionRepository.countByFechaAfter(
                LocalDateTime.now().minusDays(1)
        );

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalConfesiones", totalConfesiones);
        stats.put("totalUsuarios", totalUsuarios);
        stats.put("confesionesHoy", confesionesHoy);

        return stats;
    }
}