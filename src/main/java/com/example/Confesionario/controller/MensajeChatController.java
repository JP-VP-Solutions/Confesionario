package com.example.Confesionario.controller;

import com.example.Confesionario.dto.chat.MensajeChatDTO;
import com.example.Confesionario.dto.chat.MensajeSistemaRequestDTO;
import com.example.Confesionario.dto.chat.MensajeUsuarioRequestDTO;
import com.example.Confesionario.service.MensajeChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class MensajeChatController {

    @Autowired
    private MensajeChatService mensajeChatService;

    // POST: Crear mensaje de usuario
    @PostMapping("/mensaje")
    public ResponseEntity<MensajeChatDTO> enviarMensaje(
            @RequestBody MensajeUsuarioRequestDTO request) {

        if (request.getContenido() == null || request.getContenido().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (request.getContenido().length() > 1000) {
            return ResponseEntity.badRequest().build();
        }

        if (request.getUsuarioId() == null) {
            return ResponseEntity.badRequest().build();
        }

        MensajeChatDTO mensaje = mensajeChatService.crearMensajeUsuario(
                request.getContenido().trim(),
                request.getUsuarioId()
        );

        return ResponseEntity.ok(mensaje);
    }

    // POST: Crear mensaje del sistema
    @PostMapping("/mensaje-sistema")
    public ResponseEntity<MensajeChatDTO> enviarMensajeSistema(
            @RequestBody MensajeSistemaRequestDTO request) {

        if (request.getContenido() == null || request.getContenido().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String nombreSistema = request.getNombreSistema();
        if (nombreSistema == null || nombreSistema.trim().isEmpty()) {
            nombreSistema = "Sistema"; // fallback
        }

        MensajeChatDTO mensaje = mensajeChatService.crearMensajeSistema(
                request.getContenido().trim(),
                nombreSistema.trim()
        );

        return ResponseEntity.ok(mensaje);
    }

    // GET: Obtener últimos mensajes
    @GetMapping("/mensajes")
    public ResponseEntity<List<MensajeChatDTO>> obtenerMensajes() {
        List<MensajeChatDTO> mensajes = mensajeChatService.obtenerUltimosMensajes();
        return ResponseEntity.ok(mensajes);
    }

    // NUEVO: GET: Obtener mensajes nuevos después de una fecha
    @GetMapping("/mensajes/nuevos")
    public ResponseEntity<List<MensajeChatDTO>> obtenerMensajesNuevos(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime despuesDe) {
        List<MensajeChatDTO> mensajes = mensajeChatService.obtenerMensajesNuevos(despuesDe);
        return ResponseEntity.ok(mensajes);
    }

}