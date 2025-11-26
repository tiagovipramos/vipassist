/**
 * Sistema de Feature Flags
 * Permite ativar/desativar funcionalidades sem deploy
 */

'use client'

import React from 'react'

export interface FeatureFlag {
  key: string
  enabled: boolean
  description: string
  rolloutPercentage?: number // 0-100
  enabledForUserIds?: string[]
  enabledForEmails?: string[]
  environment?: ('development' | 'staging' | 'production')[]
}

// Configuração de feature flags
const featureFlags: Record<string, FeatureFlag> = {
  // Exemplo: Nova funcionalidade de chat com IA
  'chat-ia-v2': {
    key: 'chat-ia-v2',
    enabled: false,
    description: 'Nova versão do chat com IA melhorada',
    rolloutPercentage: 0, // Inicialmente 0%
    environment: ['development', 'staging'], // Apenas dev e staging
  },

  // Exemplo: Novo sistema de notificações
  'notifications-v2': {
    key: 'notifications-v2',
    enabled: false,
    description: 'Sistema de notificações refatorado',
    rolloutPercentage: 10, // 10% dos usuários
  },

  // Exemplo: Dashboard redesenhado
  'new-dashboard': {
    key: 'new-dashboard',
    enabled: false,
    description: 'Dashboard com nova interface',
    enabledForUserIds: ['admin-user-1', 'admin-user-2'], // Apenas admins específicos
  },

  // Exemplo: Feature em produção gradual
  'advanced-analytics': {
    key: 'advanced-analytics',
    enabled: true,
    description: 'Analytics avançado com gráficos interativos',
    rolloutPercentage: 50, // 50% dos usuários
    environment: ['production'],
  },

  // Exemplo: A/B Testing
  'checkout-flow-v2': {
    key: 'checkout-flow-v2',
    enabled: true,
    description: 'Novo fluxo de checkout (A/B Test)',
    rolloutPercentage: 25, // 25% para teste A/B
  },

  // Exemplo: Kill switch de emergência
  'real-time-updates': {
    key: 'real-time-updates',
    enabled: true,
    description: 'Atualizações em tempo real via WebSocket',
    // Pode ser desativado rapidamente se causar problemas
  },
}

/**
 * Verifica se uma feature flag está habilitada para um usuário
 */
export function isFeatureEnabled(
  flagKey: string,
  userId?: string,
  userEmail?: string
): boolean {
  const flag = featureFlags[flagKey]

  // Feature não existe = desabilitada
  if (!flag) {
    console.warn(`[FeatureFlags] Flag "${flagKey}" não encontrada`)
    return false
  }

  // Verifica se está habilitada globalmente
  if (!flag.enabled) {
    return false
  }

  // Verifica ambiente
  if (flag.environment && flag.environment.length > 0) {
    const currentEnv = process.env.NODE_ENV as 'development' | 'staging' | 'production'
    if (!flag.environment.includes(currentEnv)) {
      return false
    }
  }

  // Verifica lista de usuários específicos
  if (flag.enabledForUserIds && flag.enabledForUserIds.length > 0) {
    if (!userId || !flag.enabledForUserIds.includes(userId)) {
      return false
    }
    return true
  }

  // Verifica lista de emails específicos
  if (flag.enabledForEmails && flag.enabledForEmails.length > 0) {
    if (!userEmail || !flag.enabledForEmails.includes(userEmail)) {
      return false
    }
    return true
  }

  // Verifica rollout percentage (baseado em hash do userId)
  if (flag.rolloutPercentage !== undefined && userId) {
    const userHash = simpleHash(userId + flagKey)
    const userPercentage = userHash % 100
    return userPercentage < flag.rolloutPercentage
  }

  // Se chegou aqui e está enabled, retorna true
  return true
}

/**
 * Hash simples para determinar rollout percentage
 */
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Obtém todas as feature flags
 */
export function getAllFeatureFlags(): Record<string, FeatureFlag> {
  return featureFlags
}

/**
 * Obtém uma feature flag específica
 */
export function getFeatureFlag(flagKey: string): FeatureFlag | undefined {
  return featureFlags[flagKey]
}

/**
 * Hook para React (use no client-side)
 */
export function useFeatureFlag(flagKey: string): boolean {
  // No client-side, pegar userId do contexto/store de auth
  // Por enquanto, exemplo simples
  if (typeof window === 'undefined') {
    return false
  }

  const userStr = localStorage.getItem('user')
  let userId: string | undefined
  let userEmail: string | undefined

  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      userId = user.id
      userEmail = user.email
    } catch (e) {
      // Ignorar
    }
  }

  return isFeatureEnabled(flagKey, userId, userEmail)
}

/**
 * Componente wrapper para feature flags
 */
export function FeatureFlag({
  flag,
  children,
  fallback = null,
}: {
  flag: string
  children: React.ReactNode
  fallback?: React.ReactNode
}): JSX.Element {
  const enabled = useFeatureFlag(flag)

  if (enabled) {
    return <>{children}</> as JSX.Element
  }

  return <>{fallback}</> as JSX.Element
}

/**
 * Atualizar feature flag em runtime (admin only)
 * Em produção real, isso viria de um serviço externo (LaunchDarkly, Unleash, etc)
 */
export function updateFeatureFlag(
  flagKey: string,
  updates: Partial<FeatureFlag>
): boolean {
  const flag = featureFlags[flagKey]

  if (!flag) {
    console.error(`[FeatureFlags] Flag "${flagKey}" não encontrada`)
    return false
  }

  Object.assign(flag, updates)

  console.log(`[FeatureFlags] Flag "${flagKey}" atualizada:`, flag)

  return true
}

/**
 * Gradualmente aumentar rollout percentage
 */
export function increaseRollout(flagKey: string, increment: number = 10): boolean {
  const flag = featureFlags[flagKey]

  if (!flag) {
    return false
  }

  const currentRollout = flag.rolloutPercentage || 0
  const newRollout = Math.min(100, currentRollout + increment)

  flag.rolloutPercentage = newRollout

  console.log(
    `[FeatureFlags] Rollout de ${flagKey} aumentado: ${currentRollout}% -> ${newRollout}%`
  )

  return true
}

/**
 * Kill switch - desabilita feature imediatamente
 */
export function disableFeature(flagKey: string, reason?: string): boolean {
  const flag = featureFlags[flagKey]

  if (!flag) {
    return false
  }

  flag.enabled = false

  console.warn(
    `[FeatureFlags] KILL SWITCH: Feature ${flagKey} desabilitada.`,
    reason ? `Motivo: ${reason}` : ''
  )

  return true
}
