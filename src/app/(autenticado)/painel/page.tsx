import { Suspense } from 'react'
import { generatePageMetadata } from '@/lib/metadata/pages'
import { PainelClient } from './painel.client'

export const metadata = generatePageMetadata('painel')

/**
 * Painel Page - Server Component
 * 
 * Responsabilidades:
 * - Metadata SEO (gerada no servidor)
 * - Loading state com Suspense
 * - Renderizar Client Component
 */
export default function PainelPage() {
  return (
    <Suspense fallback={<PainelSkeleton />}>
      <PainelClient />
    </Suspense>
  )
}

/**
 * Skeleton Loading State para Dashboard
 */
function PainelSkeleton() {
  return (
    <div className="space-y-6 pb-8">
      {/* Cards Skeleton - Linha 1 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>

      {/* Cards Skeleton - Linha 2 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>

      {/* Gráficos Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
