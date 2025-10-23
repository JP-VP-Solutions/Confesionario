package com.example.Confesionario.service;


import com.example.Confesionario.repository.ComentarioRepository;
import com.example.Confesionario.repository.ConfesionRepository;

import com.example.Confesionario.dto.confesion.ConfesionAdminDTO;
import com.example.Confesionario.entities.Confesion;
import com.example.Confesionario.entities.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.Confesionario.repository.UsuarioRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private ConfesionRepository confesionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ComentarioRepository comentarioRepository;

    // Verificar si un usuario es admin
    public boolean esAdmin(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .map(Usuario::getEsAdmin)
                .orElse(false);
    }

    // Obtener todas las confesiones CON información del autor real
    public List<ConfesionAdminDTO> getConfesionesConAutor() {
        List<Confesion> confesiones = confesionRepository.findAll();

        return confesiones.stream()
                .map(c -> {
                    int comentarios = (int) comentarioRepository.countByConfesionId(c.getId());
                    return new ConfesionAdminDTO(c);
                })
                .collect(Collectors.toList());
    }

    // Eliminar confesión (soft delete)
    @Transactional
    public void eliminarConfesion(Long confesionId) {
        Confesion confesion = confesionRepository.findById(confesionId)
                .orElseThrow(() -> new RuntimeException("Confesión no encontrada"));

        confesion.setEliminada(true);
        confesionRepository.save(confesion);
    }

    // Revelar autor de una confesión
    @Transactional
    public void revelarAutor(Long confesionId) {
        Confesion confesion = confesionRepository.findById(confesionId)
                .orElseThrow(() -> new RuntimeException("Confesión no encontrada"));

        confesion.setRevelada(true);
        confesionRepository.save(confesion);
    }

    // Banear usuario
    @Transactional
    public void banearUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setBaneado(true);
        usuarioRepository.save(usuario);
    }

    // Desbanear usuario
    @Transactional
    public void desbanearUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setBaneado(false);
        usuarioRepository.save(usuario);
    }
}