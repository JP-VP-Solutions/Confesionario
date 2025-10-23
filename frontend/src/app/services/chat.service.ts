import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  MensajeChatDTO,
  MensajeUsuarioRequestDTO,
  MensajeSistemaRequestDTO
} from '../models/chat.model';
import { environment } from '../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient) { }

  // Obtener últimos mensajes
  obtenerMensajes(): Observable<MensajeChatDTO[]> {
    return this.http.get<MensajeChatDTO[]>(`${this.apiUrl}/mensajes`);
  }

  // Enviar mensaje de usuario
  enviarMensaje(request: MensajeUsuarioRequestDTO): Observable<MensajeChatDTO> {
    return this.http.post<MensajeChatDTO>(`${this.apiUrl}/mensaje`, request);
  }

  // Enviar mensaje del sistema
  enviarMensajeSistema(request: MensajeSistemaRequestDTO): Observable<MensajeChatDTO> {
    return this.http.post<MensajeChatDTO>(`${this.apiUrl}/mensaje-sistema`, request);
  }
}
