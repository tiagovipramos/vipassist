/**
 * Indicador visual de digitação
 * Mostra quando alguém está digitando em tempo real
 */

'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TypingIndicatorProps {
  /** Nome de quem está digitando */
  nome?: string
  /** Se deve mostrar o indicador */
  isTyping: boolean
  /** Classe CSS adicional */
  className?: string
  /** Variante do estilo */
  variant?: 'default' | 'minimal' | 'bubble'
}

export function TypingIndicator({
  nome,
  isTyping,
  className,
  variant = 'default'
}: TypingIndicatorProps) {
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    if (isTyping) {
      setShowIndicator(true)
    } else {
      // Delay para suavizar a saída
      const timeout = setTimeout(() => setShowIndicator(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [isTyping])

  if (!showIndicator) return null

  // Variante minimal - apenas os pontos
  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        </div>
      </div>
    )
  }

  // Variante bubble - em uma bolha de chat
  if (variant === 'bubble') {
    return (
      <div className={cn('flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-300', className)}>
        <div className="flex-1">
          {nome && (
            <p className="text-xs text-gray-500 mb-1 ml-1">{nome}</p>
          )}
          <div className="inline-flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-2xl rounded-bl-none">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Variante default - texto + pontos
  return (
    <div className={cn(
      'flex items-center gap-2 text-sm text-gray-600 animate-in fade-in slide-in-from-bottom-2 duration-300',
      className
    )}>
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
      </div>
      <span className="font-medium">
        {nome ? `${nome} está digitando...` : 'Digitando...'}
      </span>
    </div>
  )
}

/**
 * Hook para gerenciar múltiplos indicadores de digitação
 */
export function useTypingIndicators() {
  const [typingUsers, setTypingUsers] = useState<Map<string, { nome: string; timeout: NodeJS.Timeout }>>(new Map())

  const addTypingUser = (userId: string, nome: string) => {
    setTypingUsers(prev => {
      const newMap = new Map(prev)
      
      // Limpar timeout anterior se existir
      const existing = newMap.get(userId)
      if (existing?.timeout) {
        clearTimeout(existing.timeout)
      }

      // Adicionar com novo timeout de 3 segundos
      const timeout = setTimeout(() => {
        removeTypingUser(userId)
      }, 3000)

      newMap.set(userId, { nome, timeout })
      return newMap
    })
  }

  const removeTypingUser = (userId: string) => {
    setTypingUsers(prev => {
      const newMap = new Map(prev)
      const existing = newMap.get(userId)
      if (existing?.timeout) {
        clearTimeout(existing.timeout)
      }
      newMap.delete(userId)
      return newMap
    })
  }

  const clearAll = () => {
    typingUsers.forEach(user => {
      if (user.timeout) {
        clearTimeout(user.timeout)
      }
    })
    setTypingUsers(new Map())
  }

  // Limpar todos os timeouts ao desmontar
  useEffect(() => {
    return () => clearAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const typingUsersList = Array.from(typingUsers.values()).map(u => u.nome)
  const isAnyoneTyping = typingUsers.size > 0
  const typingText = typingUsersList.length === 1
    ? `${typingUsersList[0]} está digitando...`
    : typingUsersList.length === 2
    ? `${typingUsersList[0]} e ${typingUsersList[1]} estão digitando...`
    : typingUsersList.length > 2
    ? `${typingUsersList[0]} e mais ${typingUsersList.length - 1} pessoas estão digitando...`
    : ''

  return {
    addTypingUser,
    removeTypingUser,
    clearAll,
    typingUsersList,
    isAnyoneTyping,
    typingText,
    typingCount: typingUsers.size
  }
}
