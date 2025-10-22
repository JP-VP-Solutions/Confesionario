import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { ConfesionAdminDTO } from '../models/confesiones.dtos';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  private getHeaders(usuarioId: number): HttpHeaders {
    return new HttpHeaders({
      'Usuario-Id': usuarioId.toString()
    });
  }

  // Obtener todas las confesiones con autor (solo admin)
  getConfesionesConAutor(usuarioId: number): Observable<ConfesionAdminDTO[]> {
    return this.http.get<ConfesionAdminDTO[]>(`${this.apiUrl}/confesiones`, {
      headers: this.getHeaders(usuarioId)
    });
  }

  // Eliminar confesión (soft delete)
  eliminarConfesion(usuarioId: number, confesionId: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/confesiones/${confesionId}`,
      { headers: this.getHeaders(usuarioId) }
    );
  }

  // Revelar autor de una confesión
  revelarAutor(usuarioId: number, confesionId: number): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/confesiones/${confesionId}/revelar`,
      {},
      { headers: this.getHeaders(usuarioId) }
    );
  }

  // Banear usuario
  banearUsuario(usuarioId: number, usuarioABanearId: number): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/usuarios/${usuarioABanearId}/banear`,
      {},
      { headers: this.getHeaders(usuarioId) }
    );
  }

  // Desbanear usuario
  desbanearUsuario(usuarioId: number, usuarioADesbanearId: number): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/usuarios/${usuarioADesbanearId}/desbanear`,
      {},
      { headers: this.getHeaders(usuarioId) }
    );
  }

}
