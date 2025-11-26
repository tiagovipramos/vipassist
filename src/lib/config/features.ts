/**
 * Feature Flags e Configurações de Ambiente
 * Controla quais features estão ativas em cada ambiente
 */

// Detectar ambiente
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_TEST = process.env.NODE_ENV === 'test'

/**
 * ⚠️ CRÍTICO: Mocks NUNCA devem ser usados em produção
 * Esta flag garante que dados falsos não sejam usados em produção
 */
export const USE_MOCKS = IS_DEVELOPMENT && process.env.NEXT_PUBLIC_USE_MOCKS === 'true'

/**
 * Validação de segurança: Impede uso de mocks em produção
 */
if (IS_PRODUCTION && USE_MOCKS) {
  throw new Error(
    '🚨 ERRO CRÍTICO: Tentativa de usar MOCKS em PRODUÇÃO! ' +
    'Mocks devem estar desabilitados em produção. ' +
    'Verifique NEXT_PUBLIC_USE_MOCKS no .env'
  )
}

/**
 * Log de aviso em desenvolvimento
 */
if (USE_MOCKS && IS_DEVELOPMENT) {
  console.warn(
    '⚠️ AVISO: Sistema rodando com MOCKS habilitados. ' +
    'Dados são simulados e não refletem o banco de dados real.'
  )
}

/**
 * Outras feature flags
 */
export const FEATURES = {
  // Mocks
  USE_MOCKS,
  
  // Debug
  ENABLE_DEBUG_LOGS: IS_DEVELOPMENT,
  
  // Performance
  ENABLE_CACHE: IS_PRODUCTION,
  
  // Segurança
  ENABLE_RATE_LIMITING: IS_PRODUCTION,
  ENABLE_CSRF_PROTECTION: IS_PRODUCTION,
  
  // Monitoramento
  ENABLE_SENTRY: IS_PRODUCTION,
  ENABLE_ANALYTICS: IS_PRODUCTION,
} as const

/**
 * Configurações de ambiente
 */
export const CONFIG = {
  // API
  API_TIMEOUT: IS_PRODUCTION ? 30000 : 60000, // 30s prod, 60s dev
  
  // Cache
  CACHE_TTL: IS_PRODUCTION ? 300 : 60, // 5min prod, 1min dev
  
  // Paginação
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
} as const

/**
 * URLs de ambiente
 */
export const URLS = {
  API_BASE: process.env.NEXT_PUBLIC_API_URL || '',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const
