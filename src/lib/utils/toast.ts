/**
 * Utilitários para Toasts
 * Wrapper sobre react-hot-toast com funcionalidades extras
 */

import toast from 'react-hot-toast'

// Tipos de toast customizados
export const showToast = {
  /**
   * Toast de sucesso
   */
  success: (message: string) => {
    return toast.success(message)
  },

  /**
   * Toast de erro
   */
  error: (message: string) => {
    return toast.error(message)
  },

  /**
   * Toast de loading
   */
  loading: (message: string) => {
    return toast.loading(message)
  },

  /**
   * Toast de informação
   */
  info: (message: string) => {
    return toast(message, {
      icon: 'ℹ️',
    })
  },

  /**
   * Toast de aviso
   */
  warning: (message: string) => {
    return toast(message, {
      icon: '⚠️',
      style: {
        background: '#f59e0b',
      },
    })
  },

  /**
   * Promise toast - mostra loading, success ou error automaticamente
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return toast.promise(promise, messages)
  },

  /**
   * Dismiss toast específico
   */
  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId)
    } else {
      toast.dismiss()
    }
  },

  /**
   * Remove todos os toasts
   */
  dismissAll: () => {
    toast.dismiss()
  },
}

// Toast para erros de API
export function showApiError(error: unknown, defaultMessage = 'Erro ao processar requisição') {
  let message = defaultMessage

  if (error instanceof Error) {
    message = error.message
  } else if (typeof error === 'string') {
    message = error
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message)
  }

  return showToast.error(message)
}

// Toast para validação
export function showValidationErrors(errors: Record<string, string>) {
  const messages = Object.values(errors)
  
  if (messages.length === 1) {
    return showToast.error(messages[0])
  }
  
  return showToast.error(
    `Erros de validação:\n${messages.join('\n')}`
  )
}

// Toast para ações assíncronas
export async function withToast<T>(
  promise: Promise<T>,
  messages: {
    loading?: string
    success?: string
    error?: string
  } = {}
): Promise<T> {
  const loadingToast = messages.loading
    ? showToast.loading(messages.loading)
    : null

  try {
    const result = await promise

    if (loadingToast) {
      toast.dismiss(loadingToast)
    }

    if (messages.success) {
      showToast.success(messages.success)
    }

    return result
  } catch (error) {
    if (loadingToast) {
      toast.dismiss(loadingToast)
    }

    if (messages.error) {
      showToast.error(messages.error)
    } else {
      showApiError(error)
    }

    throw error
  }
}

// Toast customizado
export function showCustomToast(
  message: string,
  options: {
    duration?: number
    icon?: string
    style?: React.CSSProperties
  } = {}
) {
  return toast(message, options)
}
