import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ConfesionesService } from '../../services/confesiones.service';
import { ConfesionPublicaDTO } from '../../models/confesiones.dtos';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { Message } from 'primeng/message';
import { Dialog } from 'primeng/dialog';
import { ConfesionDetalleComponent } from '../confesion-detalle/confesion-detalle.component';
import { CrearConfesionComponent } from '../crear-confesion-modal/crear-confesion.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confesiones-list',
  templateUrl: './confesiones-list.component.html',
  imports: [
    Button,
    Skeleton,
    Message,
    Dialog,
    CommonModule,
    ConfesionDetalleComponent,
    CrearConfesionComponent
  ],
  styleUrls: ['./confesiones-list.component.css']
})
export class ConfesionesListComponent implements OnInit, OnDestroy {
  // Control de suscripciones
  private destroy$ = new Subject<void>();

  // Usuario actual
  usuarioId: number | null = null;

  // Confesiones
  confesiones: ConfesionPublicaDTO[] = [];
  loadingConfesiones = true;
  errorMessage = '';

  // Modal de confesión completa
  showModalConfesion = false;
  confesionSeleccionada: ConfesionPublicaDTO | null = null;

  // Modal de crear confesión
  showModalCrear = false;

  // Límite de caracteres para preview
  CHAR_LIMIT = 280;

  constructor(
    private authService: AuthService,
    private confesionesService: ConfesionesService
  ) {}

  ngOnInit(): void {
    // Obtener usuario actual del subject
    this.authService.usuarioActual$
      .pipe(takeUntil(this.destroy$))
      .subscribe(usuario => {
        if (usuario) {
          this.usuarioId = usuario.id;

          // Cargar confesiones
          this.cargarConfesiones();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar confesiones públicas (anónimas)
   */
  cargarConfesiones(): void {
    if (!this.usuarioId) {
      this.errorMessage = 'Usuario no autenticado';
      this.loadingConfesiones = false;
      return;
    }

    this.loadingConfesiones = true;
    this.errorMessage = '';

    this.confesionesService.getAll(this.usuarioId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.confesiones = data;
          this.loadingConfesiones = false;
        },
        error: (error) => {
          console.error('Error al cargar confesiones:', error);
          this.errorMessage = 'Error al cargar las confesiones';
          this.loadingConfesiones = false;
        }
      });
  }

  /**
   * Dar/quitar like a una confesión
   */
  darLike(confesion: ConfesionPublicaDTO): void {
    if (!this.usuarioId) return;

    if (confesion.likeadoPorUsuario) {
      // Ya tiene like, hacer unlike
      this.confesionesService.unlike(confesion.id, this.usuarioId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            confesion.likeadoPorUsuario = false;
            confesion.likes = Math.max(0, (confesion.likes || 0) - 1);
          },
          error: (error) => {
            console.error('Error al quitar like:', error);
          }
        });
    } else {
      // No tiene like, dar like
      this.confesionesService.like(confesion.id, this.usuarioId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            confesion.likeadoPorUsuario = true;
            confesion.likes = (confesion.likes || 0) + 1;
          },
          error: (error) => {
            console.error('Error al dar like:', error);
          }
        });
    }
  }

  /**
   * Abrir modal de confesión completa
   */
  verConfesionCompleta(confesion: ConfesionPublicaDTO): void {
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
  onConfesionCreada(nuevaConfesion: ConfesionPublicaDTO): void {
    // Agregar la nueva confesión al principio de la lista
    this.confesiones.unshift(nuevaConfesion);
    this.cerrarModalCrear();
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
    this.cargarConfesiones()
  }
}
