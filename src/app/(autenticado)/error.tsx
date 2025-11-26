'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Error Boundary]', error)
  }, [error])

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-md text-center p-6">
        <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Algo deu errado!
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {error.message || 'Ocorreu um erro inesperado.'}
        </p>
        {error.digest && (
          <p className="text-xs text-gray-500 mb-6">
            ID do erro: {error.digest}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
          <button
            onClick={() => window.location.href = '/painel'}
            className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    </div>
  )
}
