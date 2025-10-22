import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ConfesionesService } from '../../services/confesiones.service';
import { ConfesionPublicaDTO, ConfesionRequest } from '../../models/confesiones.dtos';
import {Message} from 'primeng/message';
import {Button} from 'primeng/button';
import {Textarea} from 'primeng/textarea';
import {CommonModule} from '@angular/common';
import {InputTextarea} from 'primeng/inputtextarea';

@Component({
  selector: 'app-crear-confesion',
  templateUrl: './crear-confesion.component.html',
  standalone: true,
  imports: [
    Message,
    CommonModule,
    ReactiveFormsModule,
    Button,
    Textarea,
    InputTextarea
  ],
  styleUrls: ['./crear-confesion.component.css']
})
export class CrearConfesionComponent implements OnInit, OnDestroy {
  @Input() usuarioId: number | null = null;
  @Output() confesionCreada = new EventEmitter<ConfesionPublicaDTO>();
  @Output() cancelar = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  confesionForm: FormGroup;
  enviando = false;
  errorMessage = '';

  // Límites de caracteres
  MIN_CHARS = 10;
  MAX_CHARS = 2000;

  constructor(
    private fb: FormBuilder,
    private confesionesService: ConfesionesService
  ) {
    this.confesionForm = this.fb.group({
      contenido: ['', [
        Validators.required,
        Validators.minLength(this.MIN_CHARS),
        Validators.maxLength(this.MAX_CHARS)
      ]]
    });
  }

  ngOnInit(): void {
    // Opcional: puedes agregar lógica adicional aquí
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Enviar nueva confesión
   */
  enviarConfesion(): void {
    if (this.confesionForm.invalid || !this.usuarioId) {
      this.confesionForm.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.errorMessage = '';

    const request: ConfesionRequest = {
      contenido: this.confesionForm.get('contenido')?.value.trim()
    };

    this.confesionesService.create(this.usuarioId, request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (nuevaConfesion) => {
          this.enviando = false;
          this.confesionCreada.emit(nuevaConfesion);
          this.confesionForm.reset();
        },
        error: (error) => {
          console.error('Error al crear confesión:', error);
          this.enviando = false;
          this.errorMessage = error.error?.message || 'Error al crear la confesión. Intenta nuevamente.';
        }
      });
  }

  /**
   * Cancelar creación
   */
  cancelarCreacion(): void {
    this.cancelar.emit();
  }

  /**
   * Obtener longitud actual del contenido
   */
  get longitudContenido(): number {
    return this.contenido?.value?.length || 0;
  }

  /**
   * Verificar si está cerca del límite
   */
  get cercaDelLimite(): boolean {
    return this.longitudContenido > this.MAX_CHARS * 0.9;
  }

  /**
   * Verificar si superó el límite
   */
  get sobrePasaLimite(): boolean {
    return this.longitudContenido > this.MAX_CHARS;
  }

  /**
   * Getter para el campo de contenido
   */
  get contenido() {
    return this.confesionForm.get('contenido');
  }

  /**
   * Obtener mensaje de error del campo
   */
  getErrorMessage(): string {
    if (this.contenido?.hasError('required')) {
      return 'La confesión no puede estar vacía';
    }
    if (this.contenido?.hasError('minlength')) {
      return `La confesión debe tener al menos ${this.MIN_CHARS} caracteres`;
    }
    if (this.contenido?.hasError('maxlength')) {
      return `La confesión no puede exceder ${this.MAX_CHARS} caracteres`;
    }
    return '';
  }
}
