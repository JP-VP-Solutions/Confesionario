import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ComentarioService } from '../../services/comentario.service';
import { ConfesionesService } from '../../services/confesiones.service';
import { ConfesionPublicaDTO, ConfesionAdminDTO } from '../../models/confesiones.dtos';
import { ComentarioAdminDTO, ComentarioDTO } from '../../models/comentarios';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Divider } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { InputTextarea } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-confesion-detalle',
  templateUrl: './confesion-detalle.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Textarea,
    Button,
    CommonModule,
    InputTextarea,
    ProgressSpinner,
    Divider,
    TooltipModule
  ],
  styleUrls: ['./confesion-detalle.component.css']
})
export class ConfesionDetalleComponent implements OnInit, OnDestroy {
  @Input() confesion!: ConfesionPublicaDTO | ConfesionAdminDTO | null;
  @Input() usuarioId: number | null = null;
  @Input() esAdmin = false;
  @Output() cerrar = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  // Comentarios - CORREGIDO
  comentarios: (ComentarioDTO | ComentarioAdminDTO)[] = [];
  loadingComentarios = true;

  // Formulario de comentario
  comentarioForm: FormGroup;
  enviandoComentario = false;

  constructor(
    private fb: FormBuilder,
    private comentarioService: ComentarioService,
    private confesionesService: ConfesionesService
  ) {
    this.comentarioForm = this.fb.group({
      contenido: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.cargarComentarios();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar comentarios de la confesión
   */
  cargarComentarios(): void {
    if (!this.confesion) return;

    this.loadingComentarios = true;
    this.comentarioService.obtenerComentarios(this.confesion.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.comentarios = data;
          this.loadingComentarios = false;
        },
        error: (error) => {
          console.error('Error al cargar comentarios:', error);
          this.loadingComentarios = false;
        }
      });
  }

  /**
   * Enviar nuevo comentario
   */
  enviarComentario(): void {
    if (this.comentarioForm.invalid || !this.usuarioId || !this.confesion) {
      this.comentarioForm.markAllAsTouched();
      return;
    }

    this.enviandoComentario = true;
    const contenido = this.comentarioForm.get('contenido')?.value;

    this.comentarioService.crearComentario(this.confesion.id, this.usuarioId, contenido)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (nuevoComentario) => {
          this.comentarios.push(nuevoComentario);
          this.comentarioForm.reset();
          this.enviandoComentario = false;

          // Actualizar contador de comentarios en la confesión
          if (this.confesion) {
            this.confesion.comentarios = (this.confesion.comentarios || 0) + 1;
          }
        },
        error: (error) => {
          console.error('Error al enviar comentario:', error);
          this.enviandoComentario = false;
          alert('Error al enviar el comentario');
        }
      });
  }

  /**
   * Eliminar comentario
   */
  eliminarComentario(comentario: ComentarioDTO | ComentarioAdminDTO): void {
    if (!this.usuarioId || !this.confesion) return;

    // Verificar si el comentario es de tipo Admin para acceder a autorId
    const comentarioAdmin = this.esComentarioAdmin(comentario);

    // Verificar si el usuario puede eliminar (es su comentario o es admin)
    const puedeEliminar = this.esAdmin || (comentarioAdmin && comentario.id === this.usuarioId);

    if (!puedeEliminar) {
      alert('No tienes permisos para eliminar este comentario');
      return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      this.comentarioService.eliminarComentario(this.confesion.id, comentario.id, this.usuarioId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.comentarios = this.comentarios.filter(c => c.id !== comentario.id);
            // Actualizar contador
            if (this.confesion) {
              this.confesion.comentarios = Math.max(0, (this.confesion.comentarios || 0) - 1);
            }
          },
          error: (error) => {
            console.error('Error al eliminar comentario:', error);
            alert('Error al eliminar el comentario');
          }
        });
    }
  }

  /**
   * Type guard: Verificar si es una confesión de admin
   */
  esConfesionAdmin(confesion: any): confesion is ConfesionAdminDTO {
    return confesion && 'autorId' in confesion;
  }

  /**
   * Type guard: Verificar si es un comentario de admin
   */
  esComentarioAdmin(comentario: ComentarioDTO | ComentarioAdminDTO): comentario is ComentarioAdminDTO {
    return 'autor' in comentario && 'autorId' in comentario;
  }

  /**
   * Formatear fecha
   */
  formatearFecha(fecha: string | Date): string {
    const fechaObj = new Date(fecha);
    const ahora = new Date();
    const diferencia = ahora.getTime() - fechaObj.getTime();
    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(diferencia / 3600000);
    const dias = Math.floor(diferencia / 86400000);

    if (minutos < 1) return 'Justo ahora';
    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas}h`;
    if (dias === 1) return 'Ayer';
    if (dias < 7) return `Hace ${dias} días`;

    return fechaObj.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Cerrar modal
   */
  cerrarModal(): void {
    this.cerrar.emit();
  }

  /**
   * Getter para el campo de contenido
   */
  get contenido() {
    return this.comentarioForm.get('contenido');
  }

  /**
   * Obtener el nombre del autor de un comentario (solo para admin)
   */
  obtenerAutorComentario(comentario: ComentarioDTO | ComentarioAdminDTO): string {
    if (this.esAdmin && this.esComentarioAdmin(comentario)) {
      return comentario.autor || 'Anónimo';
    }
    return 'Anónimo';
  }
}
