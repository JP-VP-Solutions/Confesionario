export interface ComentarioAdminDTO {
  id: number,
  contenido: string,
  autor: string,
  autorId: number,
  fecha: string
}

export interface ComentarioDTO {
  id: number,
  contenido: string,
  fecha: string
}

export interface ComentarioRequest{
  contenido: string
}
