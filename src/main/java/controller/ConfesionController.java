package controller;

import dto.ConfesionPublicaDTO;
import com.confesiones.dto.ConfesionRequest;
import service.ConfesionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/confesiones")
@CrossOrigin(origins = "*") // Cambiar después
public class ConfesionController {

    @Autowired
    private ConfesionService confesionService;

    // Endpoint PÚBLICO - Preview para landing (sin login)
    @GetMapping("/preview")
    public ResponseEntity<List<ConfesionPublicaDTO>> getPreview() {
        return ResponseEntity.ok(confesionService.getPreview());
    }

    // Endpoint PÚBLICO - Estadísticas para landing
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getEstadisticas() {
        return ResponseEntity.ok(confesionService.getEstadisticas());
    }

    // Obtener todas las confesiones (requiere login)
    @GetMapping
    public ResponseEntity<List<ConfesionPublicaDTO>> getTodasLasConfesiones() {
        return ResponseEntity.ok(confesionService.getTodasLasConfesiones());
    }

    // Crear nueva confesión (requiere login)
    @PostMapping
    public ResponseEntity<?> crearConfesion(
            @RequestHeader("Usuario-Id") Long usuarioId,
            @Valid @RequestBody ConfesionRequest request) {
        try {
            ConfesionPublicaDTO confesion = confesionService.crearConfesion(usuarioId, request);
            return ResponseEntity.ok(confesion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    // Dar like a una confesión
    @PostMapping("/{id}/like")
    public ResponseEntity<?> darLike(
            @PathVariable Long id,
            @RequestHeader("Usuario-Id") Long usuarioId) {
        try {
            confesionService.darLike(id, usuarioId);
            return ResponseEntity.ok(new MensajeResponse("Like agregado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    // Quitar like
    @DeleteMapping("/{id}/like")
    public ResponseEntity<?> quitarLike(
            @PathVariable Long id,
            @RequestHeader("Usuario-Id") Long usuarioId) {
        try {
            confesionService.quitarLike(id, usuarioId);
            return ResponseEntity.ok(new MensajeResponse("Like removido"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    // Clases internas para respuestas
    static class ErrorResponse {
        private String mensaje;
        public ErrorResponse(String mensaje) { this.mensaje = mensaje; }
        public String getMensaje() { return mensaje; }
    }

    static class MensajeResponse {
        private String mensaje;
        public MensajeResponse(String mensaje) { this.mensaje = mensaje; }
        public String getMensaje() { return mensaje; }
    }
}