package entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reacciones",
        uniqueConstraints = @UniqueConstraint(columnNames = {"confesion_id", "usuario_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "confesion_id", nullable = false)
    private Confesion confesion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(length = 20)
    private String tipo = "like";

    @PrePersist
    protected void onCreate() {
        if (tipo == null) {
            tipo = "like";
        }
    }
}