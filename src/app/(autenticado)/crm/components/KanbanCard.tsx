import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  Phone, 
  Mail, 
  Star,
  AlertTriangle,
  Building2,
} from 'lucide-react'
import { Avatar } from '@/componentes/ui/avatar'
import { Card } from '@/componentes/ui/card'
import { ClienteCRM } from '@/tipos/crm'
import { cn } from '@/lib/utils'

interface KanbanCardProps {
  cliente: ClienteCRM
  isDragging?: boolean
  isCompact?: boolean
}

export function KanbanCard({ cliente, isDragging = false, isCompact = false }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: cliente.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Função para obter emoji de satisfação
  const getEmojiSatisfacao = (satisfacao: ClienteCRM['satisfacao']) => {
    switch (satisfacao) {
      case 'muito_satisfeito': return '😊'
      case 'satisfeito': return '🙂'
      case 'neutro': return '😐'
      case 'insatisfeito': return '😕'
      case 'muito_insatisfeito': return '😠'
      default: return '😐'
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'group cursor-grab border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md active:cursor-grabbing',
        (isDragging || isSortableDragging) && 'opacity-50',
        isCompact ? 'p-2' : 'p-2.5'
      )}
    >
      {/* Header: Nome + Badges */}
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Avatar
              style={{ backgroundColor: cliente.corAvatar }}
              className={cn(
                "flex-shrink-0 font-semibold text-white",
                isCompact ? "h-7 w-7 text-xs" : "h-8 w-8 text-xs"
              )}
            >
              {cliente.iniciais}
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-gray-900 leading-tight">
                {cliente.nome}
              </h3>
              {cliente.empresa && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Building2 className="h-3 w-3 flex-shrink-0 text-gray-400" />
                  <p className="truncate text-xs text-gray-500">{cliente.empresa}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Badges Compactos */}
        <div className="flex flex-col gap-0.5">
          {cliente.status === 'vip' && (
            <span className="flex items-center justify-center rounded bg-amber-100 px-1 py-0.5 text-amber-700" title="VIP">
              <Star className="h-3 w-3" />
            </span>
          )}
          {cliente.emRisco && (
            <span className="flex items-center justify-center rounded bg-orange-100 px-1 py-0.5 text-orange-700" title="Em Risco">
              <AlertTriangle className="h-3 w-3" />
            </span>
          )}
        </div>
      </div>

      {/* Contatos Compactos */}
      <div className="mb-2 space-y-0.5 text-xs text-gray-600">
        {cliente.email && (
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3 flex-shrink-0 text-gray-400" />
            <span className="truncate">{cliente.email}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Phone className="h-3 w-3 flex-shrink-0 text-gray-400" />
          <span>{cliente.telefone}</span>
        </div>
      </div>

      {/* Tags Compactas */}
      {cliente.tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-0.5">
          {cliente.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 leading-tight"
            >
              {tag}
            </span>
          ))}
          {cliente.tags.length > 2 && (
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 leading-tight">
              +{cliente.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Rodapé Compacto com Métricas */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-1.5 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-base leading-none">{getEmojiSatisfacao(cliente.satisfacao)}</span>
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="font-medium text-gray-900">{cliente.csat.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-2 text-right">
          <div className="font-semibold text-gray-900">
            R$ {(cliente.ltv / 1000).toFixed(1)}k
          </div>
          <div className="text-gray-500">{cliente.totalCompras}x</div>
        </div>
      </div>
    </Card>
  )
}
