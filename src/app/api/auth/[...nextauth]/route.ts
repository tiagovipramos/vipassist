/**
 * API Route do NextAuth.js
 * Gerencia todas as rotas de autenticação
 */

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
