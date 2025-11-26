import { ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  id: string
  titulo: string
  cor: string
  icone: string
  count: number
  children: ReactNode
}

export function KanbanColumn({
  id,
  titulo,
  cor,
  icone,
  count,
  children,
}: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  })

  return (
    <div className="flex w-64 flex-shrink-0 flex-col">
      {/* Header da Coluna - Ultra Compacto */}
      <div
        className="mb-2 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 shadow-sm"
        style={{ borderTopColor: cor, borderTopWidth: '2px' }}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-sm leading-none">{icone}</span>
          <h3 className="text-sm font-semibold text-gray-900">{titulo}</h3>
        </div>
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-100 px-1.5 text-xs font-semibold text-gray-700">
          {count}
        </span>
      </div>

      {/* Área de Cards - Compacta */}
      <div
        ref={setNodeRef}
        className={cn(
          'rounded-lg border-2 border-dashed p-1.5 transition-colors min-h-[100px]',
          isOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-200 bg-gray-50/30'
        )}
      >
        {children}

        {/* Empty State Compacto */}
        {count === 0 && (
          <div className="py-6 text-center">
            <p className="text-xs text-gray-400">Arraste cards aqui</p>
          </div>
        )}
      </div>
    </div>
  )
}
