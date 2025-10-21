import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/login-register.dtos';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    DividerModule,
    MessageModule,
    ProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMensaje = '';
  serverStarting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Si ya está logueado, redirigir al feed
    if (this.authService.estaAutenticado()) {
      this.router.navigate(['/confesiones']);
    }
  }

  // Getters para acceder fácilmente a los controles del formulario
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    // Limpiar error anterior
    this.errorMensaje = '';

    // Validar formulario
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const credenciales: LoginRequest = this.loginForm.value;

    this.authService.login(credenciales)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          // Redirigir al feed de confesiones
          this.router.navigate(['/confesiones']);
        },
        error: (error) => {
          console.error('Error en login:', error);

          // Detectar si el servidor está iniciando (demora)
          if (error.status === 0 || error.status === 503 || error.status === 504) {
            this.serverStarting = true;
            this.errorMensaje = '⏳ El servidor está iniciando, por favor espera 1-2 minutos e intenta nuevamente';
          } else if (error.status === 400) {
            this.errorMensaje = error.error?.mensaje || 'Usuario o contraseña incorrectos';
          } else {
            this.errorMensaje = 'Error al iniciar sesión. Intenta nuevamente';
          }
        }
      });
  }

  // Validación visual para mostrar errores
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Obtener mensaje de error específico
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);

    if (field?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    return '';
  }
}
