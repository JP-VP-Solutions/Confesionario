import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {ConfesionesService} from '../../../services/confesiones.service';
import {ConfesionPublicaDTO} from '../../../models/confesiones.dtos';
import {LoginRequest} from '../../../models/login-register.dtos';
import {Skeleton} from 'primeng/skeleton';
import {Card} from 'primeng/card';
import {Message} from 'primeng/message';
import {Password} from 'primeng/password';
import {Button} from 'primeng/button';
import {Divider} from 'primeng/divider';
import {CommonModule} from '@angular/common';
import {InputText} from 'primeng/inputtext';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    Skeleton,
    Card,
    CommonModule,
    InputText,
    RouterLink,
    Message,
    ReactiveFormsModule,
    Password,
    Button,
    Divider
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMensaje = '';
  serverStarting = false;

  // Stats
  stats: any = null;
  loadingStats = true;

  // Confesiones (ahora 2)
  confesiones: ConfesionPublicaDTO[] = [];
  loadingConfesiones = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private confesionesService: ConfesionesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Cargar stats
    this.loadStats();

    // Cargar últimas 2 confesiones
    this.loadUltimasConfesiones();
  }

  /**
   * Cargar estadísticas generales
   */
  loadStats(): void {
    this.loadingStats = true;
    this.confesionesService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loadingStats = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.loadingStats = false;
        // Valores por defecto en caso de error
        this.stats = {
          totalConfesiones: 0,
          totalUsuarios: 0,
          confesionesHoy: 0
        };
      }
    });
  }

  /**
   * Cargar últimas 2 confesiones
   */
  loadUltimasConfesiones(): void {
    this.loadingConfesiones = true;
    this.confesionesService.getPreview().subscribe({
      next: (data) => {
        // Ajusta según tu estructura de respuesta real
        // Tomar solo las últimas 2 confesiones del array
        this.confesiones = Array.isArray(data) ? data.slice(-2) : [];
        this.loadingConfesiones = false;
      },
      error: (error) => {
        console.error('Error al cargar confesiones:', error);
        this.loadingConfesiones = false;
        this.confesiones = [];
      }
    });
  }

  /**
   * Submit del formulario de login
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMensaje = '';
    this.serverStarting = false;

    const { username, password } = this.loginForm.value;

    const loginRequest: LoginRequest = {
      username,
      password
    }

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        this.loading = false;

        // Redirigir según el rol
        if (this.authService.esAdmin()) {
          this.router.navigate(['/admin/confesiones']);
        } else {
          this.router.navigate(['/confesiones']);
        }
      },
      error: (error) => {
        this.loading = false;

        // Detectar si el servidor está iniciando (código 503)
        if (error.status === 503) {
          this.serverStarting = true;
          this.errorMensaje = '';
        } else {
          this.serverStarting = false;
          this.errorMensaje = error.error?.message || 'Usuario o contraseña incorrectos';
        }
      }
    });
  }

  /**
   * Validar si un campo es inválido
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtener mensaje de error para un campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (field.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }

    return 'Campo inválido';
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
      month: 'short'
    });
  }

  /**
   * Truncar texto largo
   */
  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  /**
   * Getters para facilitar acceso a los campos
   */
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
