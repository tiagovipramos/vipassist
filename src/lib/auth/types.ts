/**
 * Tipos para autenticação JWT
 */

export interface LoginCredentials {
  email: string
  senha: string
}

export interface LoginResponse {
  success: boolean
  usuario?: {
    id: string
    nome: string
    email: string
    role: 'admin' | 'supervisor' | 'atendente'
    avatar?: string
    permissoes: string[]
  }
  error?: string
}

export interface RefreshTokenResponse {
  success: boolean
  error?: string
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

export interface AuthError {
  message: string
  code: 'INVALID_CREDENTIALS' | 'TOKEN_EXPIRED' | 'UNAUTHORIZED' | 'SERVER_ERROR'
}
