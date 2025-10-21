package com.example.Confesionario.service;

import com.example.Confesionario.dto.LoginRequest;
import com.example.Confesionario.dto.RegistroRequest;
import com.example.Confesionario.dto.UsuarioResponse;

import com.example.Confesionario.entities.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.Confesionario.repository.UsuarioRepository;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public UsuarioResponse registrar(RegistroRequest request, String ip) {
        // Validar que no exista el username
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El username ya está en uso");
        }

        // Validar que no exista el email
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        // Crear nuevo usuario
        Usuario usuario = new Usuario();
        usuario.setUsername(request.getUsername());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(request.getPassword());
        usuario.setEsAdmin(false);
        usuario.setIpRegistro(ip);
        usuario.setBaneado(false);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        return new UsuarioResponse(usuarioGuardado);
    }

    public UsuarioResponse login(LoginRequest request) {
        // Buscar usuario por username
        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar que no esté baneado
        if (usuario.getBaneado()) {
            throw new RuntimeException("Este usuario ha sido baneado");
        }

        // Validar contraseña
        if (!usuario.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        return new UsuarioResponse(usuario);
    }
}