/**
 * Utilitários de Autenticação e Autorização
 * Helpers para proteger rotas de API
 */

import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth/auth.config'
import { createLogger } from './logger'

const logger = createLogger('Auth')

/**
 * Verifica se o usuário está autenticado
 */
export async function requireAuth(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    logger.warn('Tentativa de acesso não autenticado', undefined, {
      url: request.url,
      method: request.method,
    })
    
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Não autorizado. Faça login para continuar.' },
        { status: 401 }
      )
    }
  }
  
  return {
    authorized: true,
    session,
    user: session.user
  }
}

/**
 * Verifica se o usuário tem uma role específica
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: string[]
) {
  const authResult = await requireAuth(request)
  
  if (!authResult.authorized) {
    return authResult
  }
  
  const { user } = authResult
  
  if (!user || !allowedRoles.includes(user.role)) {
    logger.warn('Acesso negado - role insuficiente', undefined, {
      userId: user?.id,
      userRole: user?.role,
      requiredRoles: allowedRoles,
      url: request.url,
    })
    
    return {
      authorized: false,
      response: NextResponse.json(
        { 
          success: false, 
          error: 'Acesso negado. Você não tem permissão para acessar este recurso.' 
        },
        { status: 403 }
      )
    }
  }
  
  return {
    authorized: true,
    session: authResult.session,
    user
  }
}

/**
 * Verifica se o usuário é admin
 */
export async function requireAdmin(request: NextRequest) {
  return requireRole(request, ['admin'])
}

/**
 * Verifica se o usuário é admin ou supervisor
 */
export async function requireAdminOrSupervisor(request: NextRequest) {
  return requireRole(request, ['admin', 'supervisor'])
}

/**
 * Wrapper para handlers de API com autenticação
 */
export function withAuth<T extends any[]>(
  handler: (request: NextRequest, session: any, ...args: T) => Promise<NextResponse>,
  options?: {
    roles?: string[]
  }
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    // Verificar autenticação
    const authResult = options?.roles
      ? await requireRole(request, options.roles)
      : await requireAuth(request)
    
    if (!authResult.authorized) {
      return authResult.response as NextResponse
    }
    
    // Executar handler com sessão
    return handler(request, authResult.session, ...args)
  }
}

/**
 * Verifica se o usuário pode acessar um recurso específico
 */
export function canAccessResource(
  user: any,
  resource: {
    ownerId?: string
    clienteId?: string
    prestadorId?: string
  }
): boolean {
  // Admin pode acessar tudo
  if (user.role === 'admin') {
    return true
  }
  
  // Supervisor pode acessar tudo
  if (user.role === 'supervisor') {
    return true
  }
  
  // Atendente só pode acessar seus próprios recursos
  if (user.role === 'atendente') {
    return resource.ownerId === user.id
  }
  
  return false
}

/**
 * Extrai informações do usuário da sessão
 */
export function getUserFromSession(session: any) {
  return {
    id: session.user.id,
    nome: session.user.name,
    email: session.user.email,
    role: session.user.role,
    avatar: session.user.avatar,
    telefone: session.user.telefone,
    setorId: session.user.setorId,
    ativo: session.user.ativo,
  }
}
