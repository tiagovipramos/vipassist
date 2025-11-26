import { create } from 'zustand'
import { ConversaChat } from '@/tipos/inbox'

interface InboxStore {
  conversaSelecionada: ConversaChat | null
  modoFoco: boolean
  mostrarPerfilCliente: boolean
  mostrarCopilotIA: boolean
  mostrarListaConversas: boolean
  filtroAtivo: string
  setConversaSelecionada: (conversa: ConversaChat | null) => void
  toggleModoFoco: () => void
  togglePerfilCliente: () => void
  toggleCopilotIA: () => void
  toggleListaConversas: () => void
  setFiltroAtivo: (filtro: string) => void
  ativarModoCompleto: () => void
}

export const useInboxStore = create<InboxStore>((set) => ({
  conversaSelecionada: null,
  modoFoco: false,
  mostrarPerfilCliente: true,
  mostrarCopilotIA: false,
  mostrarListaConversas: true,
  filtroAtivo: 'todas',
  
  setConversaSelecionada: (conversa) => set({ conversaSelecionada: conversa }),
  
  toggleModoFoco: () => set((state) => ({ 
    modoFoco: !state.modoFoco,
    mostrarPerfilCliente: state.modoFoco,
    mostrarCopilotIA: false,
    mostrarListaConversas: state.modoFoco
  })),
  
  togglePerfilCliente: () => set((state) => ({ 
    mostrarPerfilCliente: !state.mostrarPerfilCliente,
    mostrarCopilotIA: false
  })),
  
  toggleCopilotIA: () => set((state) => ({ 
    mostrarCopilotIA: !state.mostrarCopilotIA,
    mostrarPerfilCliente: false
  })),
  
  toggleListaConversas: () => set((state) => ({ 
    mostrarListaConversas: !state.mostrarListaConversas 
  })),
  
  setFiltroAtivo: (filtro) => set({ filtroAtivo: filtro }),
  
  ativarModoCompleto: () => set({
    modoFoco: true,
    mostrarPerfilCliente: false,
    mostrarCopilotIA: false,
    mostrarListaConversas: false
  })
}))

// ========================================
// ✅ SELECTORS OTIMIZADOS (Performance++)
// ========================================

/**
 * Selector otimizado: retorna apenas a conversa selecionada
 * Re-renderiza APENAS quando a conversa selecionada mudar
 */
export const useConversaSelecionada = () => useInboxStore(state => state.conversaSelecionada)

/**
 * Selector otimizado: retorna apenas o modo foco
 * Re-renderiza APENAS quando o modo foco mudar
 */
export const useModoFoco = () => useInboxStore(state => state.modoFoco)

/**
 * Selector otimizado: retorna apenas o estado do perfil do cliente
 * Re-renderiza APENAS quando mostrarPerfilCliente mudar
 */
export const useMostrarPerfilCliente = () => useInboxStore(state => state.mostrarPerfilCliente)

/**
 * Selector otimizado: retorna apenas o estado da lista de conversas
 * Re-renderiza APENAS quando mostrarListaConversas mudar
 */
export const useMostrarListaConversas = () => useInboxStore(state => state.mostrarListaConversas)

/**
 * Selector otimizado: retorna apenas o filtro ativo
 * Re-renderiza APENAS quando o filtro mudar
 */
export const useFiltroAtivo = () => useInboxStore(state => state.filtroAtivo)

/**
 * Selector otimizado: retorna apenas as actions
 * NUNCA re-renderiza (actions são estáveis)
 */
export const useInboxActions = () => useInboxStore(state => ({
  setConversaSelecionada: state.setConversaSelecionada,
  toggleModoFoco: state.toggleModoFoco,
  togglePerfilCliente: state.togglePerfilCliente,
  toggleListaConversas: state.toggleListaConversas,
  setFiltroAtivo: state.setFiltroAtivo,
  ativarModoCompleto: state.ativarModoCompleto
}))
