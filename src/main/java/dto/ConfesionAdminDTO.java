package dto;

import entities.Confesion;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfesionAdminDTO {

    private Long id;
    private String contenido;
    private AutorInfo autor; // Información real del autor
    private LocalDateTime fecha;
    private Integer likes;
    private Integer comentarios;
    private Integer reportes;
    private Boolean revelada;
    private Boolean eliminada;

    // Constructor desde Entity
    public ConfesionAdminDTO(Confesion confesion, Integer cantidadComentarios) {
        this.id = confesion.getId();
        this.contenido = confesion.getContenido();
        this.autor = new AutorInfo(
                confesion.getAutor().getId(),
                confesion.getAutor().getUsername(),
                confesion.getAutor().getEmail()
        );
        this.fecha = confesion.getFecha();
        this.likes = confesion.getLikes();
        this.comentarios = cantidadComentarios;
        this.reportes = confesion.getReportes();
        this.revelada = confesion.getRevelada();
        this.eliminada = confesion.getEliminada();
    }

    // Clase interna para info del autor
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AutorInfo {
        private Long id;
        private String username;
        private String email;
    }
}