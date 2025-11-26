/**
 * Sistema de Rate Limiting em Memória
 * Protege contra ataques de força bruta e DDoS
 */

import { createLogger } from './logger'

const logger = createLogger('RateLimit')

interface RateLimitEntry {
  count: number
  resetAt: number
  blockedUntil?: number
}

// Armazenamento em memória (usar Redis em produção para múltiplas instâncias)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Configurações
const RATE_LIMIT_CONFIG = {
  // Login: 5 tentativas por 15 minutos
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutos
    blockDurationMs: 30 * 60 * 1000, // 30 minutos de bloqueio
  },
  // API geral: 100 requisições por minuto
  api: {
    maxAttempts: 100,
    windowMs: 60 * 1000, // 1 minuto
    blockDurationMs: 5 * 60 * 1000, // 5 minutos de bloqueio
  },
  // Upload: 10 uploads por hora
  upload: {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1 hora
    blockDurationMs: 60 * 60 * 1000, // 1 hora de bloqueio
  },
}

/**
 * Limpa entradas expiradas periodicamente
 */
function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now && (!entry.blockedUntil || entry.blockedUntil < now)) {
      rateLimitStore.delete(key)
    }
  }
}

// Limpar a cada 5 minutos
setInterval(cleanupExpiredEntries, 5 * 60 * 1000)

/**
 * Verifica se uma requisição deve ser bloqueada
 */
export function checkRateLimit(
  identifier: string,
  type: keyof typeof RATE_LIMIT_CONFIG = 'api'
): {
  allowed: boolean
  remaining: number
  resetAt: number
  blockedUntil?: number
} {
  const config = RATE_LIMIT_CONFIG[type]
  const key = `${type}:${identifier}`
  const now = Date.now()

  let entry = rateLimitStore.get(key)

  // Se não existe ou expirou, criar nova entrada
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + config.windowMs,
    }
    rateLimitStore.set(key, entry)
  }

  // Verificar se está bloqueado
  if (entry.blockedUntil && entry.blockedUntil > now) {
    logger.warn('Requisição bloqueada por rate limit', {
      identifier,
      type,
    }, {
      blockedUntil: new Date(entry.blockedUntil).toISOString(),
    })

    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      blockedUntil: entry.blockedUntil,
    }
  }

  // Incrementar contador
  entry.count++

  // Verificar se excedeu o limite
  if (entry.count > config.maxAttempts) {
    entry.blockedUntil = now + config.blockDurationMs
    rateLimitStore.set(key, entry)

    logger.warn('Rate limit excedido - bloqueando', {
      identifier,
      type,
    }, {
      attempts: entry.count,
      blockedUntil: new Date(entry.blockedUntil).toISOString(),
    })

    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      blockedUntil: entry.blockedUntil,
    }
  }

  // Salvar entrada atualizada
  rateLimitStore.set(key, entry)

  return {
    allowed: true,
    remaining: config.maxAttempts - entry.count,
    resetAt: entry.resetAt,
  }
}

/**
 * Reseta o contador para um identificador
 * Útil após login bem-sucedido
 */
export function resetRateLimit(
  identifier: string,
  type: keyof typeof RATE_LIMIT_CONFIG = 'api'
) {
  const key = `${type}:${identifier}`
  rateLimitStore.delete(key)
  
  logger.debug('Rate limit resetado', {
    identifier,
    type,
  })
}

/**
 * Middleware para Next.js API Routes
 */
export function withRateLimit(
  type: keyof typeof RATE_LIMIT_CONFIG = 'api'
) {
  return function (identifier: string) {
    const result = checkRateLimit(identifier, type)

    if (!result.allowed) {
      const retryAfter = result.blockedUntil
        ? Math.ceil((result.blockedUntil - Date.now()) / 1000)
        : Math.ceil((result.resetAt - Date.now()) / 1000)

      throw new RateLimitError(
        'Muitas requisições. Tente novamente mais tarde.',
        retryAfter,
        result.resetAt
      )
    }

    return result
  }
}

/**
 * Erro de rate limit
 */
export class RateLimitError extends Error {
  constructor(
    message: string,
    public retryAfter: number,
    public resetAt: number
  ) {
    super(message)
    this.name = 'RateLimitError'
  }
}

/**
 * Extrai identificador da requisição
 * Usa IP ou user ID se autenticado
 */
export function getRequestIdentifier(request: Request): string {
  // Tentar pegar IP real (considerando proxies)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'
  
  // TODO: Se tiver sessão, usar userId ao invés de IP
  // const session = await getSession(request)
  // if (session?.user?.id) return session.user.id
  
  return ip
}
