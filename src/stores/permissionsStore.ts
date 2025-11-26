import { create } from 'zustand'

interface PermissionsState {
  permissoes: string[]
  carregando: boolean
  erro: string | null
  
  // Actions
  carregarPermissoes: (email: string) => Promise<void>
  temPermissao: (permissao: string) => boolean
  limpar: () => void
}

export const usePermissionsStore = create<PermissionsState>((set, get) => ({
  permissoes: [],
  carregando: false,
  erro: null,

  carregarPermissoes: async (email: string) => {
    set({ carregando: true, erro: null })
    try {
      const response = await fetch(`/api/permissoes?email=${encodeURIComponent(email)}`)
      if (response.ok) {
        const data = await response.json()
        set({ 
          permissoes: data.permissoes || [],
          carregando: false 
        })
      } else {
        set({ 
          permissoes: [],
          carregando: false,
          erro: 'Erro ao carregar permissões'
        })
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error)
      set({ 
        permissoes: [],
        carregando: false,
        erro: 'Erro ao carregar permissões'
      })
    }
  },

  temPermissao: (permissao: string) => {
    const state = get()
    return state.permissoes.includes(permissao)
  },

  limpar: () => {
    set({ 
      permissoes: [],
      carregando: false,
      erro: null
    })
  }
}))

export const usePermissoes = () => usePermissionsStore(state => state.permissoes)
export const useTemPermissao = () => usePermissionsStore(state => state.temPermissao)
