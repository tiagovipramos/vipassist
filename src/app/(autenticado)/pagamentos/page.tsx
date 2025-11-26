import { Suspense } from 'react'
import { generatePageMetadata } from '@/lib/metadata/pages'
import { PagamentosClient } from './pagamentos.client'

export const metadata = generatePageMetadata('pagamentos')

/**
 * Pagamentos Page - Server Component
 * 
 * Responsabilidades:
 * - Metadata SEO (gerada no servidor)
 * - Loading state com Suspense
 * - Renderizar Client Component
 */
export default function PagamentosPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <PagamentosClient />
    </Suspense>
  )
}

/**
 * Skeleton Loading State
 */
function LoadingSkeleton() {
  return (
    <div className="-mx-8 -mt-8 min-h-screen bg-gray-50 px-8 pt-8">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>

        {/* Content Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
