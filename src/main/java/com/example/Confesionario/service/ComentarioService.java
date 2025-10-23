// ComentarioService.java
package com.example.Confesionario.service;

import com.example.Confesionario.dto.comentario.ComentarioDTO;
import com.example.Confesionario.dto.comentario.ComentarioRequest;
import com.example.Confesionario.entities.Comentario;
import com.example.Confesionario.entities.Confesion;
import com.example.Confesionario.entities.Usuario;
import com.example.Confesionario.repository.ComentarioRepository;
import com.example.Confesionario.repository.ConfesionRepository;
import com.example.Confesionario.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComentarioService {

    private final ComentarioRepository comentarioRepository;
    private final ConfesionRepository confesionRepository;
    private final UsuarioRepository usuarioRepository;

    public List<ComentarioDTO> obtenerComentariosPorConfesion(Long confesionId) {
        return comentarioRepository.findByConfesionIdOrderByFechaAsc(confesionId).stream()
                .map(comentario -> new ComentarioDTO(
                        comentario.getId(),
                        comentario.getContenido(),
                        comentario.getFecha()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public ComentarioDTO crearComentario(Long confesionId, Long usuarioId, ComentarioRequest request) {
        Confesion confesion = confesionRepository.findById(confesionId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Confesión no encontrada"));

        if (Boolean.TRUE.equals(confesion.getEliminada())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "No se puede comentar en una confesión eliminada");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (Boolean.TRUE.equals(usuario.getBaneado())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Usuario baneado");
        }

        Comentario comentario = new Comentario();
        comentario.setContenido(request.getContenido());
        comentario.setConfesion(confesion);
        comentario.setAutor(usuario);

        Comentario comentarioGuardado = comentarioRepository.save(comentario);

        return new ComentarioDTO(
                comentarioGuardado.getId(),
                comentarioGuardado.getContenido(),
                comentarioGuardado.getFecha()
        );
    }

    @Transactional
    public void eliminarComentario(Long confesionId, Long comentarioId, Long usuarioId) {
        Comentario comentario = comentarioRepository.findById(comentarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Comentario no encontrado"));

        // Verificar que el comentario pertenezca a la confesión
        if (!comentario.getConfesion().getId().equals(confesionId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "El comentario no pertenece a esta confesión");
        }

        // Solo el autor del comentario o un admin pueden eliminarlo
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        boolean esAutor = comentario.getAutor().getId().equals(usuarioId);
        boolean esAdmin = Boolean.TRUE.equals(usuario.getEsAdmin());

        if (!esAutor && !esAdmin) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "No tienes permiso para eliminar este comentario");
        }

        comentarioRepository.delete(comentario);
    }
}