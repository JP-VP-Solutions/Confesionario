import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ComentarioService } from '../../services/comentario.service';
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
  @Output() comentarioAgregado = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  // Comentarios locales (copiados de la confesión)
  comentariosLocales: (ComentarioDTO | ComentarioAdminDTO)[] = [];

  // Formulario de comentario
  comentarioForm: FormGroup;
  enviandoComentario = false;

  constructor(
    private fb: FormBuilder,
    private comentarioService: ComentarioService
  ) {
    this.comentarioForm = this.fb.group({
      contenido: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    // Cargar comentarios desde la confesión
    this.cargarComentariosLocales();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar comentarios desde la confesión (no hace llamada al servicio)
   */
  cargarComentariosLocales(): void {
    if (!this.confesion) {
      this.comentariosLocales = [];
      return;
    }

    // Obtener comentarios según el tipo de confesión
    if (this.esConfesionAdmin(this.confesion)) {
      // ConfesionAdminDTO tiene listaComentarios: ComentarioAdminDTO[]
      this.comentariosLocales = this.confesion.listaComentarios || [];
    } else {
      // ConfesionPublicaDTO tiene listaComentarios: ComentarioDTO[]
      this.comentariosLocales = this.confesion.listaComentarios || [];
    }
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
    const contenido = this.comentarioForm.get('contenido')?.value.trim();

    this.comentarioService.crearComentario(this.confesion.id, this.usuarioId, contenido)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (nuevoComentario) => {
          // Agregar el nuevo comentario a la lista local
          this.comentariosLocales.push(nuevoComentario);

          // Actualizar el contador en la confesión
          if (this.confesion) {
            this.confesion.comentarios = (this.confesion.comentarios || 0) + 1;
          }

          // Limpiar formulario
          this.comentarioForm.reset();
          this.enviandoComentario = false;

          // Notificar al componente padre
          this.comentarioAgregado.emit();
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

    // Verificar permisos
    const puedeEliminar = this.verificarPermisoEliminar(comentario);

    if (!puedeEliminar) {
      alert('No tienes permisos para eliminar este comentario');
      return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      this.comentarioService.eliminarComentario(this.confesion.id, comentario.id, this.usuarioId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            // Remover de la lista local
            this.comentariosLocales = this.comentariosLocales.filter(c => c.id !== comentario.id);

            // Actualizar el contador en la confesión
            if (this.confesion) {
              this.confesion.comentarios = Math.max(0, (this.confesion.comentarios || 0) - 1);
            }

            // Notificar al componente padre
            this.comentarioAgregado.emit();
          },
          error: (error) => {
            console.error('Error al eliminar comentario:', error);
            alert('Error al eliminar el comentario');
          }
        });
    }
  }

  /**
   * Verificar si el usuario puede eliminar un comentario
   */
  verificarPermisoEliminar(comentario: ComentarioDTO | ComentarioAdminDTO): boolean {
    // Admin puede eliminar cualquier comentario
    if (this.esAdmin) {
      return true;
    }

    // Usuario normal solo puede eliminar sus propios comentarios
    if (this.esComentarioAdmin(comentario)) {
      return comentario.autorId === this.usuarioId;
    }

    // Para ComentarioDTO sin autorId, no se puede determinar
    return false;
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
   * Obtener el nombre del autor de un comentario
   */
  obtenerAutorComentario(comentario: ComentarioDTO | ComentarioAdminDTO): string {
    if (this.esAdmin && this.esComentarioAdmin(comentario)) {
      return comentario.autor || 'Anónimo';
    }
    return 'Anónimo';
  }

  /**
   * Verificar si el comentario es del autor de la confesión
   */
  esAutorConfesion(comentario: ComentarioDTO | ComentarioAdminDTO): boolean {
    if (!this.esAdmin || !this.confesion) return false;

    const confesionAdmin = this.esConfesionAdmin(this.confesion);
    const comentarioAdmin = this.esComentarioAdmin(comentario);

    if (confesionAdmin && comentarioAdmin) {
      // Hacé un casting explícito para que TypeScript reconozca el tipo
      const confesionConAutor = this.confesion as ConfesionAdminDTO;
      return comentario.autorId === confesionConAutor.autorId;
    }

    return false;
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
   * Obtener cantidad de comentarios
   */
  get cantidadComentarios(): number {
    return this.comentariosLocales.length;
  }
}
