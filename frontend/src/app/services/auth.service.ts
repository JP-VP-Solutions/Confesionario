import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../enviroments/environment';
import { LoginRequest, RegistroRequest, UsuarioResponse } from '../models/login-register.dtos';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private usuarioActualSubject: BehaviorSubject<UsuarioResponse | null>;
  public usuarioActual$: Observable<UsuarioResponse | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Inicializar con el usuario del localStorage si existe
    const usuarioAlmacenado = localStorage.getItem('usuarioActual');
    this.usuarioActualSubject = new BehaviorSubject<UsuarioResponse | null>(
      usuarioAlmacenado ? JSON.parse(usuarioAlmacenado) : null
    );
    this.usuarioActual$ = this.usuarioActualSubject.asObservable();
  }

  // Obtener el valor actual del usuario
  public get usuarioActualValue(): UsuarioResponse | null {
    return this.usuarioActualSubject.value;
  }

  // Iniciar sesión
  login(credenciales: LoginRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.apiUrl}/auth/login`, credenciales)
      .pipe(
        tap(usuario => {
          // Almacenar usuario en localStorage
          localStorage.setItem('usuarioActual', JSON.stringify(usuario));
          this.usuarioActualSubject.next(usuario);
        })
      );
  }

  // Registrar nuevo usuario
  registrar(datos: RegistroRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.apiUrl}/auth/registro`, datos)
      .pipe(
        tap(usuario => {
          // Almacenar usuario en localStorage
          localStorage.setItem('usuarioActual', JSON.stringify(usuario));
          this.usuarioActualSubject.next(usuario);
        })
      );
  }

  // Cerrar sesión
  logout(): void {
    // Eliminar usuario del almacenamiento local
    localStorage.removeItem('usuarioActual');
    this.usuarioActualSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Verificar si el usuario está autenticado
  estaAutenticado(): boolean {
    return this.usuarioActualValue !== null;
  }

  // Verificar si el usuario es administrador
  esAdmin(): boolean {
    return this.usuarioActualValue?.esAdmin || false;
  }

  // Obtener ID del usuario actual
  obtenerUsuarioId(): number | null {
    return this.usuarioActualValue?.id || null;
  }
}
