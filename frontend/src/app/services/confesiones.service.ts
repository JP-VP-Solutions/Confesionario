import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../enviroments/environment';
import {ConfesionPublicaDTO, ConfesionRequest} from '../models/confesiones.dtos';


@Injectable({
  providedIn: 'root'
})
export class ConfesionesService {
  private apiUrl = `${environment.apiUrl}/confesiones`;

  constructor(private http: HttpClient) {}

  getPreview(): Observable<ConfesionPublicaDTO[]> {
    return this.http.get<ConfesionPublicaDTO[]>(`${this.apiUrl}/preview`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  getAll(usuarioId: number): Observable<ConfesionPublicaDTO[]> {
    const headers = new HttpHeaders().set('Usuario-Id', usuarioId.toString());
    return this.http.get<ConfesionPublicaDTO[]>(this.apiUrl, { headers });
  }

  create(usuarioId: number, data: ConfesionRequest): Observable<ConfesionPublicaDTO> {
    const headers = new HttpHeaders().set('Usuario-Id', usuarioId.toString());
    return this.http.post<ConfesionPublicaDTO>(this.apiUrl, data, { headers });
  }

  like(idConfesion: number, usuarioId: number): Observable<any> {
    const headers = new HttpHeaders().set('Usuario-Id', usuarioId.toString());
    return this.http.post(`${this.apiUrl}/${idConfesion}/like`, {}, { headers });
  }

  unlike(idConfesion: number, usuarioId: number): Observable<any> {
    const headers = new HttpHeaders().set('Usuario-Id', usuarioId.toString());
    return this.http.delete(`${this.apiUrl}/${idConfesion}/like`, { headers });
  }
}
