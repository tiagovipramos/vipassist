/**
 * Configuração do NextAuth.js
 * Sistema de autenticação real com validação de credenciais
 */

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios')
        }

        try {
          // Buscar usuário no banco de dados
          const usuario = await prisma.usuario.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              nome: true,
              email: true,
              senha: true,
              role: true,
              ativo: true,
              avatar: true,
              telefone: true,
              setorId: true,
              createdAt: true,
              updatedAt: true
            }
          })

          // Verificar se usuário existe
          if (!usuario) {
            throw new Error('Credenciais inválidas')
          }

          // Verificar se usuário está ativo
          if (!usuario.ativo) {
            throw new Error('Usuário inativo. Entre em contato com o administrador.')
          }

          // Verificar senha com logs detalhados
          console.log('[Auth Debug] Senha digitada:', credentials.password)
          console.log('[Auth Debug] Hash no banco:', usuario.senha)
          console.log('[Auth Debug] Hash começa com:', usuario.senha.substring(0, 7))
          
          const senhaValida = await bcrypt.compare(credentials.password, usuario.senha)
          console.log('[Auth Debug] Resultado da comparação:', senhaValida)
          
          if (!senhaValida) {
            throw new Error('Credenciais inválidas')
          }

          // Retornar dados do usuário (sem a senha)
          return {
            id: usuario.id,
            name: usuario.nome,
            email: usuario.email,
            role: usuario.role,
            avatar: usuario.avatar || undefined,
            telefone: usuario.telefone || undefined,
            setorId: usuario.setorId || undefined,
            ativo: usuario.ativo
          }
        } catch (error) {
          console.error('[Auth] Erro na autenticação:', error)
          throw error
        }
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Adicionar dados do usuário ao token na primeira vez
      if (user) {
        token.id = user.id
        token.role = user.role
        token.avatar = user.avatar
        token.telefone = user.telefone
        token.setorId = user.setorId
        token.ativo = user.ativo
      }

      // Atualizar token se houver mudanças na sessão
      if (trigger === 'update' && session) {
        token = { ...token, ...session }
      }

      return token
    },
    
    async session({ session, token }) {
      // Adicionar dados do token à sessão
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.avatar = token.avatar as string | undefined
        session.user.telefone = token.telefone as string | undefined
        session.user.setorId = token.setorId as string | undefined
        session.user.ativo = token.ativo as boolean
      }

      return session
    }
  },

  pages: {
    signIn: '/entrar',
    error: '/entrar'
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 horas
    updateAge: 60 * 60 // Atualizar a cada 1 hora
  },

  jwt: {
    maxAge: 24 * 60 * 60 // 24 horas
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development'
}
