package controller;

import com.confesiones.service.AdminService;
import dto.ConfesionAdminDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*") // Cambiar después
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Obtener todas las confesiones CON autor real (solo admin)
    @GetMapping("/confesiones")
    public ResponseEntity<?> getConfesionesConAutor(
            @RequestHeader("Usuario-Id") Long usuarioId) {

        // Verificar que sea admin
        if (!adminService.esAdmin(usuarioId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse("No tienes permisos de administrador"));
        }

        List<ConfesionAdminDTO> confesiones = adminService.getConfesionesConAutor();
        return ResponseEntity.ok(confesiones);
    }

    // Eliminar confesión (soft delete)
    @DeleteMapping("/confesiones/{id}")
    public ResponseEntity<?> eliminarConfesion(
            @PathVariable Long id,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        if (!adminService.esAdmin(usuarioId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse("No tienes permisos"));
        }

        try {
            adminService.eliminarConfesion(id);
            return ResponseEntity.ok(new MensajeResponse("Confesión eliminada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    // Revelar autor de una confesión
    @PutMapping("/confesiones/{id}/revelar")
    public ResponseEntity<?> revelarAutor(
            @PathVariable Long id,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        if (!adminService.esAdmin(usuarioId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse("No tienes permisos"));
        }

        try {
            adminService.revelarAutor(id);
            return ResponseEntity.ok(new MensajeResponse("Autor revelado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    // Banear usuario
    @PutMapping("/usuarios/{id}/banear")
    public ResponseEntity<?> banearUsuario(
            @PathVariable Long id,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        if (!adminService.esAdmin(usuarioId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse("No tienes permisos"));
        }

        try {
            adminService.banearUsuario(id);
            return ResponseEntity.ok(new MensajeResponse("Usuario baneado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    // Desbanear usuario
    @PutMapping("/usuarios/{id}/desbanear")
    public ResponseEntity<?> desbanearUsuario(
            @PathVariable Long id,
            @RequestHeader("Usuario-Id") Long usuarioId) {

        if (!adminService.esAdmin(usuarioId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ErrorResponse("No tienes permisos"));
        }

        try {
            adminService.desbanearUsuario(id);
            return ResponseEntity.ok(new MensajeResponse("Usuario desbaneado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse(e.getMessage())
            );
        }
    }

    // Clases internas
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