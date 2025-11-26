/**
 * Extensão dos tipos do NextAuth.js
 * Adiciona campos customizados ao User e Session
 */

import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    role: string
    avatar?: string
    telefone?: string
    setorId?: string
    ativo: boolean
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
      avatar?: string
      telefone?: string
      setorId?: string
      ativo: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    avatar?: string
    telefone?: string
    setorId?: string
    ativo: boolean
  }
}
