export interface MensajeChatDTO {
  id: number,
  contenido: string,
  fechaHora: string,
  usuario: UsuarioSimpleDTO,
  esDelSistema: boolean
}

export interface UsuarioSimpleDTO {
  id: number,
  username: string
}

export interface MensajeSistemaRequestDTO {
  contenido: string,
  nombreSistema: string
}

export interface MensajeUsuarioRequestDTO {
  contenido: string,
  usuarioId: number
}
