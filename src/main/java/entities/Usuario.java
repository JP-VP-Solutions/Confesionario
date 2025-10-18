package entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "es_admin")
    private Boolean esAdmin = false;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @Column(name = "ip_registro", length = 50)
    private String ipRegistro;

    @Column(name = "baneado")
    private Boolean baneado = false;

    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
        if (esAdmin == null) {
            esAdmin = false;
        }
        if (baneado == null) {
            baneado = false;
        }
    }
}