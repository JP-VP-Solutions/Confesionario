export interface UsuarioResponse {
  id: number,
  username: string,
  email: string,
  esAdmin: boolean
}

export interface RegistroRequest {
  username: string,
  email: string,
  password: string
}

export interface LoginRequest {
  username: string,
  password: string
}


