'use client'

import { useState, useMemo } from 'react'
import { ConversaChat } from '@/tipos/inbox'
import { useInboxStore } from '@/stores/inboxStore'
import { Button } from '@/componentes/ui/button'
import { format } from 'date-fns'

interface ConversationListProps {
  initialConversas: ConversaChat[]
}

/**
 * ConversationList - Lista de Conversas
 * 
 * Responsabilidades:
 * - Exibir lista de conversas
 * - Filtrar conversas
 * - Selecionar conversa ativa
 * - Mostrar badges de não lidas
 */
export function ConversationList({ initialConversas }: ConversationListProps) {
  const [filtroAtivo, setFiltroAtivo] = useState('todas')
  const { mostrarListaConversas, setConversaSelecionada } = useInboxStore()

  // Filtrar conversas baseado no filtro ativo
  const conversas = useMemo(() => {
    switch (filtroAtivo) {
      case 'minhas':
        return initialConversas.filter(c => c.atendenteNome === 'Você')
      case 'nao_lidas':
        return initialConversas.filter(c => c.mensagensNaoLidas > 0)
      case 'urgente':
        return initialConversas.filter(c => c.prioridade === 'alta')
      case 'vip':
        return initialConversas.filter(c => c.tags?.some(tag => tag.nome === 'VIP'))
      default:
        return initialConversas
    }
  }, [filtroAtivo, initialConversas])

  // Calcular estatísticas para badges
  const stats = useMemo(() => ({
    todas: initialConversas.length,
    minhas: initialConversas.filter(c => c.atendenteNome === 'Você').length,
    naoLidas: initialConversas.filter(c => c.mensagensNaoLidas > 0).length,
    urgente: initialConversas.filter(c => c.prioridade === 'alta').length,
    vip: initialConversas.filter(c => c.tags?.some(tag => tag.nome === 'VIP')).length,
  }), [initialConversas])

  // Selecionar conversa
  const handleSelectConversation = (conversa: ConversaChat) => {
    setConversaSelecionada(conversa)
  }

  // Formatar tempo relativo
  const formatarTempo = (data: Date) => {
    const diffMinutos = Math.floor((Date.now() - data.getTime()) / (1000 * 60))
    if (diffMinutos < 1) return 'agora'
    if (diffMinutos < 60) return `há ${diffMinutos}min`
    if (diffMinutos < 1440) return `há ${Math.floor(diffMinutos / 60)}h`
    return format(data, 'dd/MM')
  }

  if (!mostrarListaConversas) return null

  return (
    <aside className="w-[380px] bg-white border-r border-gray-200 flex flex-col">
      {/* Filtros Rápidos */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          <FilterButton
            active={filtroAtivo === 'todas'}
            onClick={() => setFiltroAtivo('todas')}
            label={`Todas (${stats.todas})`}
          />
          <FilterButton
            active={filtroAtivo === 'minhas'}
            onClick={() => setFiltroAtivo('minhas')}
            label={`Minhas (${stats.minhas})`}
          />
          <FilterButton
            active={filtroAtivo === 'nao_lidas'}
            onClick={() => setFiltroAtivo('nao_lidas')}
            label={`Não lidas (${stats.naoLidas})`}
          />
          <FilterButton
            active={filtroAtivo === 'urgente'}
            onClick={() => setFiltroAtivo('urgente')}
            label={`Urgente (${stats.urgente})`}
          />
          <FilterButton
            active={filtroAtivo === 'vip'}
            onClick={() => setFiltroAtivo('vip')}
            label={`🔥 VIP (${stats.vip})`}
          />
        </div>
      </div>

      {/* Lista de Conversas */}
      <div className="flex-1 overflow-y-auto">
        {/* Lista de conversas */}
        {conversas.map((conversa) => (
          <ConversationItem
            key={conversa.id}
            conversa={conversa}
            onClick={() => handleSelectConversation(conversa)}
            formatarTempo={formatarTempo}
          />
        ))}

        {/* Empty state */}
        {conversas.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-center">Nenhuma conversa encontrada</p>
          </div>
        )}
      </div>
    </aside>
  )
}

/**
 * FilterButton - Botão de filtro reutilizável
 */
interface FilterButtonProps {
  active: boolean
  onClick: () => void
  label: string
}

function FilterButton({ active, onClick, label }: FilterButtonProps) {
  return (
    <Button 
      size="sm" 
      variant={active ? 'default' : 'outline'} 
      onClick={onClick}
    >
      {label}
    </Button>
  )
}

/**
 * ConversationItem - Item individual da lista
 */
interface ConversationItemProps {
  conversa: ConversaChat
  onClick: () => void
  formatarTempo: (data: Date) => string
}

function ConversationItem({ conversa, onClick, formatarTempo }: ConversationItemProps) {
  const { conversaSelecionada } = useInboxStore()
  const isActive = conversaSelecionada?.id === conversa.id

  // Cores dos canais
  const coresCanal = {
    whatsapp: { bg: 'bg-green-100', text: 'text-green-700', nome: 'WhatsApp' },
    instagram: { bg: 'bg-pink-100', text: 'text-pink-700', nome: 'Instagram' },
    telegram: { bg: 'bg-blue-100', text: 'text-blue-700', nome: 'Telegram' },
    email: { bg: 'bg-purple-100', text: 'text-purple-700', nome: 'Email' },
    chat_web: { bg: 'bg-gray-100', text: 'text-gray-700', nome: 'Chat Web' }
  }

  return (
    <div
      onClick={onClick}
      className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
        isActive ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Nome e Badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 truncate">{conversa.clienteNome}</span>
            {conversa.mensagensNaoLidas > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                {conversa.mensagensNaoLidas}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">
            {conversa.ultimaMensagemTipo === 'enviada' && 'Você: '}
            {conversa.ultimaMensagem}
          </p>
        </div>

        {/* Tempo e Canal */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-xs text-gray-500">
            {formatarTempo(conversa.timestampUltimaMensagem)}
          </span>
          
          {/* Etiqueta do Canal */}
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${coresCanal[conversa.canal].bg} ${coresCanal[conversa.canal].text} font-medium`}>
            {coresCanal[conversa.canal].nome}
          </span>
        </div>
      </div>
    </div>
  )
}
