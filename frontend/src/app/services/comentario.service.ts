import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import {ComentarioDTO, ComentarioRequest} from '../models/comentarios';


@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(usuarioId: number): HttpHeaders {
    return new HttpHeaders({
      'Usuario-Id': usuarioId.toString()
    });
  }

  /**
   * Obtiene todos los comentarios de una confesión
   * @param confesionId ID de la confesión
   * @returns Observable con la lista de comentarios
   */
  obtenerComentarios(confesionId: number): Observable<ComentarioDTO[]> {
    return this.http.get<ComentarioDTO[]>(
      `${this.apiUrl}/confesiones/${confesionId}/comentarios`
    );
  }

  /**
   * Crea un nuevo comentario en una confesión
   * @param confesionId ID de la confesión (va en el path)
   * @param usuarioId ID del usuario que comenta (va en el header)
   * @param contenido Contenido del comentario (va en el body)
   * @returns Observable con el comentario creado
   */
  crearComentario(
    confesionId: number,
    usuarioId: number,
    contenido: string
  ): Observable<ComentarioDTO> {
    const request: ComentarioRequest = { contenido };

    return this.http.post<ComentarioDTO>(
      `${this.apiUrl}/confesiones/${confesionId}/comentarios`,
      request,
      { headers: this.getHeaders(usuarioId) }
    );
  }

  /**
   * Elimina un comentario
   * @param confesionId ID de la confesión (path)
   * @param comentarioId ID del comentario a eliminar (path)
   * @param usuarioId ID del usuario que realiza la acción (header)
   * @returns Observable vacío
   */
  eliminarComentario(
    confesionId: number,
    comentarioId: number,
    usuarioId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/confesiones/${confesionId}/comentarios/${comentarioId}`,
      { headers: this.getHeaders(usuarioId) }
    );
  }
}
