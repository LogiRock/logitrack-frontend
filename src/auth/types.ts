export interface User {
  id: string
  username: string
  rol: 'ADMIN' | 'CLIENTE' | 'REPARTIDOR'
}

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface JwtPayload {
  sub?: string
  userId?: string
  roles?: string[]
  exp?: number
}