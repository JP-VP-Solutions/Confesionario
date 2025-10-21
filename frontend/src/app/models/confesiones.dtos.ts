export interface ConfesionRequest {
  contenido: string
}

export interface ConfesionPublicaDTO {
  id: number,
  contenido: string,
  autor: string,
  fecha: string,
  likes: number,
  comentarios: number,
  revelada: boolean,
  listaComentarios: ComentarioDTO[]
}

export interface ConfesionAdminDTO {
  id: number,
  contenido: string,
  autor: string,
  autorId: number,
  fecha: string,
  likes: number,
  comentarios: number,
  revelada: boolean,
  eliminada: boolean,
  reportes: number,
  listaComentarios: ComentarioAdminDTO[]
}
