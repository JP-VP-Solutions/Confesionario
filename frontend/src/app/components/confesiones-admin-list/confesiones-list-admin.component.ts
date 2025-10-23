import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin-service';
import { ConfesionAdminDTO } from '../../models/confesiones.dtos';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { Message } from 'primeng/message';
import { Dialog } from 'primeng/dialog';
import { Tooltip } from 'primeng/tooltip';
import { ConfesionDetalleComponent } from '../confesion-detalle/confesion-detalle.component';
import { CrearConfesionComponent } from '../crear-confesion-modal/crear-confesion.component';
import { CommonModule } from '@angular/common';
import {ConfesionesService} from '../../services/confesiones.service';

@Component({
  selector: 'app-confesiones-list-admin',
  templateUrl: './confesiones-list-admin.component.html',
  imports: [
    Button,
    Skeleton,
    Message,
    Dialog,
    Tooltip,
    CommonModule,
    ConfesionDetalleComponent,
    CrearConfesionComponent
  ],
  styleUrls: ['./confesiones-list-admin.component.css']
})
export class ConfesionesListAdminComponent implements OnInit, OnDestroy {
  // Control de suscripciones
  private destroy$ = new Subject<void>();

  // Usuario actual (admin)
  usuarioId: number | null = null;

  // Confesiones (con información de autor)
  confesiones: ConfesionAdminDTO[] = [];
  loadingConfesiones = true;
  errorMessage = '';

  // Modal de confesión completa
  showModalConfesion = false;
  confesionSeleccionada: ConfesionAdminDTO | null = null;

  // Modal de crear confesión
  showModalCrear = false;

  // Límite de caracteres para preview
  CHAR_LIMIT = 280;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private confesionesService: ConfesionesService
  ) {}

  ngOnInit(): void {
    // Obtener usuario actual del subject
    this.authService.usuarioActual$
      .pipe(takeUntil(this.destroy$))
      .subscribe(usuario => {
        if (usuario) {
          this.usuarioId = usuario.id;

          // Cargar confesiones con información de autor
          this.cargarConfesiones();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar confesiones con información de autor (admin)
   */
  cargarConfesiones(): void {
    if (!this.usuarioId) {
      this.errorMessage = 'Usuario no autenticado';
      this.loadingConfesiones = false;
      return;
    }

    this.loadingConfesiones = true;
    this.errorMessage = '';

    this.adminService.getConfesionesConAutor(this.usuarioId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.confesiones = data;
          this.loadingConfesiones = false;
        },
        error: (error) => {
          console.error('Error al cargar confesiones (admin):', error);
          this.errorMessage = 'Error al cargar las confesiones';
          this.loadingConfesiones = false;
        }
      });
  }

  /**
   * Dar/quitar like a una confesión
   * (Aunque es admin, puede darle like como usuario normal)
   */
  darLike(confesion: ConfesionAdminDTO): void {
    if (!this.usuarioId) return;

    this.confesionesService.like(confesion.id, this.usuarioId);
    // Nota: Usarías el servicio normal de confesiones para likes
    // Por ahora lo dejamos comentado ya que no está en AdminService
  }

  /**
   * Abrir modal de confesión completa
   */
  verConfesionCompleta(confesion: ConfesionAdminDTO): void {
    this.confesionSeleccionada = confesion;
    this.showModalConfesion = true;
  }

  /**
   * Cerrar modal de confesión completa
   */
  cerrarModalConfesion(): void {
    this.showModalConfesion = false;
    this.confesionSeleccionada = null;
  }

  /**
   * Abrir modal de crear confesión
   */
  abrirModalCrear(): void {
    this.showModalCrear = true;
  }

  /**
   * Cerrar modal de crear confesión
   */
  cerrarModalCrear(): void {
    this.showModalCrear = false;
  }

  /**
   * Callback cuando se crea una nueva confesión
   */
  onConfesionCreada(nuevaConfesion: any): void {
    // Recargar todas las confesiones para obtener la versión admin
    this.cargarConfesiones();
    this.cerrarModalCrear();
  }

  /**
   * Eliminar confesión (solo admin)
   */
  eliminarConfesion(confesion: ConfesionAdminDTO): void {
    if (!this.usuarioId) return;

    if (confirm(`¿Estás seguro de que quieres eliminar esta confesión de "${confesion.autor}"?`)) {
      this.adminService.eliminarConfesion(this.usuarioId, confesion.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log('Confesión eliminada:', response.mensaje);
            // Remover de la lista
            this.confesiones = this.confesiones.filter(c => c.id !== confesion.id);
          },
          error: (error) => {
            console.error('Error al eliminar confesión:', error);
            alert('Error al eliminar la confesión');
          }
        });
    }
  }

  /**
   * Revelar autor públicamente (solo admin)
   */
  revelarAutor(confesion: ConfesionAdminDTO): void {
    if (!this.usuarioId) return;

    if (confirm(`¿Estás seguro de que quieres revelar públicamente que "${confesion.autor}" es el autor de esta confesión?`)) {
      this.adminService.revelarAutor(this.usuarioId, confesion.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log('Autor revelado:', response.mensaje);
            confesion.revelada = true;
          },
          error: (error) => {
            console.error('Error al revelar autor:', error);
            alert('Error al revelar el autor');
          }
        });
    }
  }

  /**
   * Verificar si una confesión necesita "ver más"
   */
  necesitaVerMas(contenido: string): boolean {
    return contenido.length > this.CHAR_LIMIT;
  }

  /**
   * Truncar texto para preview
   */
  truncarTexto(texto: string): string {
    if (texto.length <= this.CHAR_LIMIT) {
      return texto;
    }
    return texto.substring(0, this.CHAR_LIMIT) + '...';
  }

  /**
   * Formatear fecha de forma amigable
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
      year: 'numeric'
    });
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    this.authService.logout();
  }

  onComentarioAgregado() {
    this.cargarConfesiones();
  }
}
