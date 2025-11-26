'use client'

import { useEffect } from 'react'
import { ConversaChat } from '@/tipos/inbox'
import { useSidebarStore } from '@/stores/sidebarStore'
import { useInboxStore } from '@/stores/inboxStore'
import { ConversationList } from './components/ConversationList'
import { ChatArea } from './components/ChatArea'
import { ClientProfile } from './components/ClientProfile'
import { AICopilot } from './components/AICopilot'

interface ChatClientProps {
  initialConversas: ConversaChat[]
}

/**
 * ChatClient - Client Component Coordenador
 * 
 * Responsabilidades:
 * - Coordenar os 3 componentes principais (ConversationList, ChatArea, ClientProfile)
 * - Gerenciar layout responsivo
 * - Integrar com sidebar store para controle de UI
 * 
 * O que NÃO faz:
 * - Gerenciar estado de conversas (delegado para React Query no futuro)
 * - Renderizar UI complexa (delegado para componentes específicos)
 * - Lógica de negócio (delegado para hooks/stores)
 */
export function ChatClient({ initialConversas }: ChatClientProps) {
  const { collapseSidebar, hideHeader, showHeaderFn } = useSidebarStore()
  const { mostrarCopilotIA } = useInboxStore()
  
  // Ao abrir a página, recolhe o sidebar e esconde o header para maximizar espaço
  useEffect(() => {
    collapseSidebar()
    hideHeader()
    
    // Quando sair da página, mostra o header novamente
    return () => {
      showHeaderFn()
    }
  }, [collapseSidebar, hideHeader, showHeaderFn])

  return (
    <div className="h-full bg-gray-50 flex overflow-hidden">
      {/* 
        Layout de 3 colunas:
        1. Lista de Conversas (esquerda)
        2. Área de Chat (centro - principal)
        3. Perfil do Cliente OU Copilot de IA (direita)
      */}
      <ConversationList initialConversas={initialConversas} />
      <ChatArea />
      {mostrarCopilotIA ? <AICopilot /> : <ClientProfile />}
    </div>
  )
}
