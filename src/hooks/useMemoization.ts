/**
 * Hooks para memoização e otimização de performance
 */

'use client'

import { useRef, useCallback, useMemo, useEffect, useState } from 'react'

/**
 * Hook para criar callbacks memoizados de forma segura
 * Garante que a referência não muda a menos que as dependências mudem
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, deps) as T
}

/**
 * Hook para memoizar valores computacionalmente caros
 */
export function useComputedValue<T>(
  compute: () => T,
  deps: React.DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(compute, deps)
}

/**
 * Hook para detectar se as props mudaram (útil para debug)
 */
export function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
  const previousProps = useRef<Record<string, any>>()

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props })
      const changedProps: Record<string, { from: any; to: any }> = {}

      allKeys.forEach((key) => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key]
          }
        }
      })

      if (Object.keys(changedProps).length > 0) {
        console.log('[why-did-you-update]', name, changedProps)
      }
    }

    previousProps.current = props
  })
}

/**
 * Hook para memoizar arrays de objetos baseado em IDs
 * Útil para listas onde apenas alguns itens mudaram
 */
export function useMemoizedArray<T extends { id: string | number }>(
  array: T[]
): T[] {
  const previousArray = useRef<T[]>([])
  const previousIds = useRef<Set<string | number>>(new Set())

  return useMemo(() => {
    // Se array está vazio, retornar vazio
    if (array.length === 0) {
      previousArray.current = []
      previousIds.current = new Set()
      return []
    }

    const currentIds = new Set(array.map(item => item.id))

    // Se IDs são os mesmos, verificar se conteúdo mudou
    const sameIds = 
      currentIds.size === previousIds.current.size &&
      Array.from(currentIds).every(id => previousIds.current.has(id))

    if (sameIds) {
      // Verificar se algum item mudou
      const hasChanges = array.some((item, index) => {
        const prevItem = previousArray.current[index]
        return !prevItem || JSON.stringify(item) !== JSON.stringify(prevItem)
      })

      if (!hasChanges) {
        return previousArray.current
      }
    }

    // Atualizar referências
    previousArray.current = array
    previousIds.current = currentIds
    return array
  }, [array])
}

/**
 * Hook para memoizar objetos profundamente
 * Compara conteúdo ao invés de referência
 */
export function useDeepMemo<T>(value: T): T {
  const ref = useRef<T>()
  const signatureRef = useRef<string>()

  const signature = JSON.stringify(value)

  if (signature !== signatureRef.current) {
    ref.current = value
    signatureRef.current = signature
  }

  return ref.current as T
}

/**
 * Hook para criar uma função de comparação personalizada
 * para React.memo
 */
export function useShallowCompare<T extends Record<string, any>>(
  props: T,
  keysToCompare?: (keyof T)[]
): boolean {
  const prevProps = useRef<T>(props)

  const areEqual = useMemo(() => {
    const keys = keysToCompare || Object.keys(props) as (keyof T)[]
    
    for (const key of keys) {
      if (prevProps.current[key] !== props[key]) {
        return false
      }
    }
    
    return true
  }, [props, keysToCompare])

  prevProps.current = props
  return areEqual
}

/**
 * Hook para memoizar handlers de eventos
 */
export function useEventHandler<T extends (...args: any[]) => any>(
  handler: T | undefined
): T | undefined {
  const handlerRef = useRef<T>()

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(((...args) => {
    return handlerRef.current?.(...args)
  }) as T, [])
}

/**
 * Hook para memoizar seletores de state
 */
export function useSelector<T, R>(
  state: T,
  selector: (state: T) => R,
  equalityFn?: (a: R, b: R) => boolean
): R {
  const selectedValue = selector(state)
  const prevSelectedValue = useRef<R>(selectedValue)

  const areEqual = equalityFn
    ? equalityFn(prevSelectedValue.current, selectedValue)
    : prevSelectedValue.current === selectedValue

  if (!areEqual) {
    prevSelectedValue.current = selectedValue
  }

  return prevSelectedValue.current
}

/**
 * Hook para throttle (limitar frequência de execução)
 */
export function useThrottle<T>(value: T, delay: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastRun = useRef(Date.now())

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRun.current >= delay) {
        setThrottledValue(value)
        lastRun.current = Date.now()
      }
    }, delay - (Date.now() - lastRun.current))

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return throttledValue
}

/**
 * Hook para debounce (atrasar execução)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
