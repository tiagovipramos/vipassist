import { Suspense } from 'react';
import { generatePageMetadata } from '@/lib/metadata/pages';
import { LogsClient } from './logs.client';

export const metadata = generatePageMetadata('logs');

/**
 * Logs Page - Server Component
 * 
 * Responsabilidades:
 * - Metadata SEO (gerada no servidor)
 * - Loading state com Suspense
 * - Renderizar Client Component
 */
export default function LogsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <LogsClient />
    </Suspense>
  );
}

/**
 * Skeleton Loading State
 */
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white p-4 rounded-lg border animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/6 mb-4"></div>
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded w-32"></div>
          ))}
        </div>
      </div>

      {/* Logs List Skeleton */}
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-gray-300 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
