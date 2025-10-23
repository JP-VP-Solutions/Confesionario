// ComentarioController.java
package com.example.Confesionario.controller;

import com.example.Confesionario.dto.comentario.ComentarioDTO;
import com.example.Confesionario.dto.comentario.ComentarioRequest;
import com.example.Confesionario.service.ComentarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/confesiones/{confesionId}/comentarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ComentarioController {

    private final ComentarioService comentarioService;

    // Obtener todos los comentarios de una confesión (público)
    @GetMapping
    public ResponseEntity<List<ComentarioDTO>> obtenerComentarios(
            @PathVariable Long confesionId) {
        return ResponseEntity.ok(comentarioService.obtenerComentariosPorConfesion(confesionId));
    }

    // Crear un nuevo comentario (requiere autenticación)
    @PostMapping
    public ResponseEntity<ComentarioDTO> crearComentario(
            @PathVariable Long confesionId,
            @RequestHeader("Usuario-Id") Long usuarioId,
            @Valid @RequestBody ComentarioRequest request) {
        return ResponseEntity.ok(comentarioService.crearComentario(confesionId, usuarioId, request));
    }

    // Eliminar un comentario (solo admin o el dueño del comentario)
    @DeleteMapping("/{comentarioId}")
    public ResponseEntity<Void> eliminarComentario(
            @PathVariable Long confesionId,
            @PathVariable Long comentarioId,
            @RequestHeader("Usuario-Id") Long usuarioId) {
        comentarioService.eliminarComentario(confesionId, comentarioId, usuarioId);
        return ResponseEntity.noContent().build();
    }
}