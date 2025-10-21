import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../enviroments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConfesionesService {
  private apiUrl = `${environment.apiUrl}/confesiones`;

  constructor(private http: HttpClient) {}

  getPreview(): Observable<Confesion[]> {
    return this.http.get<Confesion[]>(`${this.apiUrl}/preview`);
  }

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.apiUrl}/stats`);
  }

  getAll(usuarioId: number): Observable<Confesion[]> {
    const headers = new HttpHeaders().set('Usuario-Id', usuarioId.toString());
    return this.http.get<Confesion[]>(this.apiUrl, { headers });
  }

  create(usuarioId: number, data: ConfesionRequest): Observable<Confesion> {
    const headers = new HttpHeaders().set('Usuario-Id', usuarioId.toString());
    return this.http.post<Confesion>(this.apiUrl, data, { headers });
  }

  like(id: number, usuarioId: number): Observable<any> {
    const headers = new HttpHeaders().set('Usuario-Id', usuarioId.toString());
    return this.http.post(`${this.apiUrl}/${id}/like`, {}, { headers });
  }

  unlike(id: number, usuarioId: number): Observable<any> {
    const headers = new HttpHeaders().set('Usuario-Id', usuarioId.toString());
    return this.http.delete(`${this.apiUrl}/${id}/like`, { headers });
  }
}
