/**
 * Utilitários para Lazy Loading e Code Splitting
 * Melhora performance inicial reduzindo bundle size
 */

import { lazy, Suspense, ComponentType } from 'react'
import { PageLoadingSkeleton } from '@/componentes/loading/LoadingSkeleton'

/**
 * Wrapper para lazy loading com Suspense automático
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc)

  return function LazyLoadedComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback || <PageLoadingSkeleton />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

/**
 * Lazy load com skeleton específico
 */
export function lazyLoadWithSkeleton<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  Skeleton: ComponentType
) {
  const LazyComponent = lazy(importFunc)

  return function LazyLoadedComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={<Skeleton />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

/**
 * Preload de componente lazy
 * Útil para precarregar ao hover ou antes de navegar
 */
export function preloadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return importFunc()
}

/**
 * HOC para adicionar Suspense a qualquer componente
 */
export function withSuspense<P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function ComponentWithSuspense(props: P) {
    return (
      <Suspense fallback={fallback || <PageLoadingSkeleton />}>
        <Component {...props} />
      </Suspense>
    )
  }
}

/**
 * Lazy load condicional
 * Carrega componente apenas quando condição é verdadeira
 */
export function lazyLoadIf<T extends ComponentType<any>>(
  condition: boolean,
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  if (!condition) {
    return null
  }

  const LazyComponent = lazy(importFunc)

  return function ConditionalLazyComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback || <PageLoadingSkeleton />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

/**
 * Exemplo de uso:
 * 
 * // Simples
 * const ChatPage = lazyLoad(() => import('./pages/ChatPage'))
 * 
 * // Com skeleton customizado
 * const CRMPage = lazyLoadWithSkeleton(
 *   () => import('./pages/CRMPage'),
 *   DashboardLoadingSkeleton
 * )
 * 
 * // Preload ao hover
 * <button 
 *   onMouseEnter={() => preloadComponent(() => import('./HeavyComponent'))}
 * >
 *   Ver Detalhes
 * </button>
 * 
 * // Com HOC
 * export default withSuspense(MeuComponente, <CustomSkeleton />)
 */
