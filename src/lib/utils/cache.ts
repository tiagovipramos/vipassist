/**
 * Sistema de Cache para Otimização de Performance
 * Reduz carga no banco de dados e melhora latência
 */

import { createLogger } from './logger'

const logger = createLogger('Cache')

interface CacheEntry<T> {
  data: T
  expiresAt: number
  tags: string[]
}

// Armazenamento em memória (usar Redis em produção para múltiplas instâncias)
const cacheStore = new Map<string, CacheEntry<any>>()

// Configurações de cache por tipo
export const CACHE_CONFIG = {
  // Listas que mudam pouco
  tickets: {
    ttl: 60, // 1 minuto
    tags: ['tickets'],
  },
  clientes: {
    ttl: 300, // 5 minutos
    tags: ['clientes'],
  },
  prestadores: {
    ttl: 300, // 5 minutos
    tags: ['prestadores'],
  },
  // Dados estáticos
  tabelaPrecos: {
    ttl: 3600, // 1 hora
    tags: ['tabela-precos'],
  },
  configuracoes: {
    ttl: 3600, // 1 hora
    tags: ['configuracoes'],
  },
  // Dados dinâmicos
  dashboard: {
    ttl: 30, // 30 segundos
    tags: ['dashboard'],
  },
  relatorios: {
    ttl: 120, // 2 minutos
    tags: ['relatorios'],
  },
}

/**
 * Gera chave de cache
 */
function generateCacheKey(prefix: string, params?: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) {
    return prefix
  }
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${JSON.stringify(params[key])}`)
    .join('|')
  
  return `${prefix}:${sortedParams}`
}

/**
 * Busca valor no cache
 */
export function getCached<T>(key: string): T | null {
  const entry = cacheStore.get(key)
  
  if (!entry) {
    logger.debug('Cache miss', undefined, { key })
    return null
  }
  
  // Verificar se expirou
  if (entry.expiresAt < Date.now()) {
    cacheStore.delete(key)
    logger.debug('Cache expired', undefined, { key })
    return null
  }
  
  logger.debug('Cache hit', undefined, { key })
  return entry.data as T
}

/**
 * Armazena valor no cache
 */
export function setCached<T>(
  key: string,
  data: T,
  ttlSeconds: number,
  tags: string[] = []
): void {
  const expiresAt = Date.now() + (ttlSeconds * 1000)
  
  cacheStore.set(key, {
    data,
    expiresAt,
    tags,
  })
  
  logger.debug('Cache set', undefined, {
    key,
    ttl: ttlSeconds,
    tags,
    expiresAt: new Date(expiresAt).toISOString(),
  })
}

/**
 * Invalida cache por chave
 */
export function invalidateCache(key: string): void {
  cacheStore.delete(key)
  logger.debug('Cache invalidated', undefined, { key })
}

/**
 * Invalida cache por tag
 */
export function invalidateCacheByTag(tag: string): void {
  let count = 0
  
  for (const [key, entry] of cacheStore.entries()) {
    if (entry.tags.includes(tag)) {
      cacheStore.delete(key)
      count++
    }
  }
  
  logger.info('Cache invalidated by tag', undefined, { tag, count })
}

/**
 * Invalida cache por múltiplas tags
 */
export function invalidateCacheByTags(tags: string[]): void {
  for (const tag of tags) {
    invalidateCacheByTag(tag)
  }
}

/**
 * Limpa todo o cache
 */
export function clearCache(): void {
  const size = cacheStore.size
  cacheStore.clear()
  logger.info('Cache cleared', undefined, { entriesRemoved: size })
}

/**
 * Limpa entradas expiradas
 */
export function cleanupExpiredCache(): void {
  const now = Date.now()
  let count = 0
  
  for (const [key, entry] of cacheStore.entries()) {
    if (entry.expiresAt < now) {
      cacheStore.delete(key)
      count++
    }
  }
  
  if (count > 0) {
    logger.debug('Expired cache cleaned', undefined, { entriesRemoved: count })
  }
}

// Limpar cache expirado a cada 5 minutos
setInterval(cleanupExpiredCache, 5 * 60 * 1000)

/**
 * Wrapper para funções com cache automático
 */
export async function withCache<T>(
  cacheKey: string,
  fn: () => Promise<T>,
  options: {
    ttl: number
    tags?: string[]
  }
): Promise<T> {
  // Tentar buscar do cache
  const cached = getCached<T>(cacheKey)
  if (cached !== null) {
    return cached
  }
  
  // Executar função
  const result = await fn()
  
  // Armazenar no cache
  setCached(cacheKey, result, options.ttl, options.tags || [])
  
  return result
}

/**
 * Helper para criar chave de cache com parâmetros
 */
export function createCacheKey(
  prefix: string,
  params?: Record<string, any>
): string {
  return generateCacheKey(prefix, params)
}

/**
 * Estatísticas do cache
 */
export function getCacheStats() {
  const now = Date.now()
  let active = 0
  let expired = 0
  
  for (const entry of cacheStore.values()) {
    if (entry.expiresAt >= now) {
      active++
    } else {
      expired++
    }
  }
  
  return {
    total: cacheStore.size,
    active,
    expired,
  }
}
