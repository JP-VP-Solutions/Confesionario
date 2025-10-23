package com.example.Confesionario.service;

import com.example.Confesionario.dto.chat.MensajeChatDTO;
import com.example.Confesionario.dto.chat.UsuarioSimpleDTO;
import com.example.Confesionario.entities.MensajeChat;
import com.example.Confesionario.entities.Usuario;
import com.example.Confesionario.repositories.MensajeChatRepository;
import com.example.Confesionario.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MensajeChatService {

    @Autowired
    private MensajeChatRepository mensajeChatRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Crear mensaje de usuario
    public MensajeChatDTO crearMensajeUsuario(String contenido, Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        MensajeChat mensaje = new MensajeChat();
        mensaje.setContenido(contenido);
        mensaje.setUsuario(usuario);
        mensaje.setEsDelSistema(false);

        MensajeChat guardado = mensajeChatRepository.save(mensaje);
        return convertirADTO(guardado);
    }

    // Crear mensaje del sistema
    public MensajeChatDTO crearMensajeSistema(String contenido, String nombreSistema) {
        MensajeChat mensaje = new MensajeChat();
        mensaje.setContenido(contenido);
        mensaje.setUsuario(null);
        mensaje.setEsDelSistema(true);
        mensaje.setNombreSistema(nombreSistema); // Guardar el nombre del sistema

        MensajeChat guardado = mensajeChatRepository.save(mensaje);
        return convertirADTO(guardado);
    }

    // Obtener últimos mensajes
    public List<MensajeChatDTO> obtenerUltimosMensajes() {
        List<MensajeChat> mensajes = mensajeChatRepository.findTop100ByOrderByFechaHoraDesc();

        // Invertir para que los más recientes queden al final
        Collections.reverse(mensajes);

        return mensajes.stream()
                .map(m -> convertirADTO(m))
                .collect(Collectors.toList());
    }

    // NUEVO: Obtener mensajes después de una fecha
    public List<MensajeChatDTO> obtenerMensajesNuevos(LocalDateTime despuesDe) {
        List<MensajeChat> mensajes = mensajeChatRepository.findByFechaHoraAfterOrderByFechaHoraAsc(despuesDe);

        return mensajes.stream()
                .map(m -> convertirADTO(m))
                .collect(Collectors.toList());
    }

    // Convertir entidad a DTO
    private MensajeChatDTO convertirADTO(MensajeChat mensaje) {
        MensajeChatDTO dto = new MensajeChatDTO();
        dto.setId(mensaje.getId());
        dto.setContenido(mensaje.getContenido());
        dto.setFechaHora(mensaje.getFechaHora());
        dto.setEsDelSistema(mensaje.getEsDelSistema());

        if (mensaje.getUsuario() != null) {
            UsuarioSimpleDTO usuarioDTO = new UsuarioSimpleDTO();
            usuarioDTO.setId(mensaje.getUsuario().getId());
            usuarioDTO.setUsername(mensaje.getUsuario().getUsername());
            dto.setUsuario(usuarioDTO);
        } else if (mensaje.getEsDelSistema() && mensaje.getNombreSistema() != null) {
            // Si es del sistema y viene nombre desde el front
            UsuarioSimpleDTO usuarioDTO = new UsuarioSimpleDTO();
            usuarioDTO.setId(null);
            usuarioDTO.setUsername(mensaje.getNombreSistema());
            dto.setUsuario(usuarioDTO);
        }

        return dto;
    }
}