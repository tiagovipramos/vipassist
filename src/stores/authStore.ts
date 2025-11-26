/**
 * Store de autenticação usando Zustand + NextAuth
 * Gerencia estado de autenticação com validação real de credenciais
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Usuario } from '@/tipos/usuario'
import { usePermissionsStore } from './permissionsStore'
import { signIn, signOut, useSession } from 'next-auth/react'

interface AuthState {
  usuario: Usuario | null
  isAutenticado: boolean
  isCarregando: boolean
  erro: string | null
  
  // Actions
  login: (email: string, senha: string) => Promise<boolean>
  logout: () => Promise<void>
  verificarAutenticacao: () => Promise<void>
  limparErro: () => void
  setUsuario: (usuario: Usuario | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario: null,
      isAutenticado: false,
      isCarregando: false,
      erro: null,

      /**
       * Fazer login com NextAuth (autenticação real)
       */
      login: async (email: string, senha: string) => {
        set({ isCarregando: true, erro: null })
        
        try {
          // Autenticar com NextAuth
          const result = await signIn('credentials', {
            email,
            senha,
            redirect: false
          })

          if (result?.error) {
            set({
              erro: result.error === 'CredentialsSignin' 
                ? 'Email ou senha inválidos' 
                : result.error,
              isCarregando: false
            })
            return false
          }

          if (result?.ok) {
            // Buscar dados do usuário da sessão
            const response = await fetch('/api/auth/session')
            const session = await response.json()
            
            if (session?.user) {
              const usuarioAutenticado: Usuario = {
                id: session.user.id,
                nome: session.user.name || '',
                email: session.user.email || '',
                avatar: session.user.avatar || session.user.image || `https://i.pravatar.cc/150?u=${session.user.email}`,
                perfil: session.user.role,
                role: session.user.role,
                status: 'online',
                dataCriacao: new Date().toISOString(),
                ultimoAcesso: new Date().toISOString(),
                ativo: session.user.ativo
              }

              set({
                usuario: usuarioAutenticado,
                isAutenticado: true,
                isCarregando: false,
                erro: null
              })

              // Carregar permissões do usuário
              const permissionsStore = usePermissionsStore.getState()
              await permissionsStore.carregarPermissoes(session.user.email)
              
              return true
            }
          }

          set({
            erro: 'Erro ao fazer login. Tente novamente.',
            isCarregando: false
          })
          return false

        } catch (error) {
          set({
            erro: 'Erro ao fazer login. Tente novamente.',
            isCarregando: false
          })
          return false
        }
      },

      /**
       * Fazer logout com NextAuth
       */
      logout: async () => {
        set({ isCarregando: true })

        try {
          // Limpar permissões
          const permissionsStore = usePermissionsStore.getState()
          permissionsStore.limpar()
          
          // Fazer logout no NextAuth
          await signOut({ redirect: false })
        } catch (error) {
          console.error('[Auth] Erro no logout:', error)
        } finally {
          // Limpar estado
          set({
            usuario: null,
            isAutenticado: false,
            isCarregando: false,
            erro: null
          })
        }
      },

      /**
       * Verificar se está autenticado (ao carregar app)
       */
      verificarAutenticacao: async () => {
        try {
          const response = await fetch('/api/auth/session')
          const session = await response.json()
          
          if (session?.user) {
            const usuarioAutenticado: Usuario = {
              id: session.user.id,
              nome: session.user.name || '',
              email: session.user.email || '',
              avatar: session.user.avatar || session.user.image || `https://i.pravatar.cc/150?u=${session.user.email}`,
              perfil: session.user.role,
              role: session.user.role,
              status: 'online',
              dataCriacao: new Date().toISOString(),
              ultimoAcesso: new Date().toISOString(),
              ativo: session.user.ativo
            }

            set({
              usuario: usuarioAutenticado,
              isAutenticado: true,
              isCarregando: false
            })
            
            // Carregar permissões
            const permissionsStore = usePermissionsStore.getState()
            await permissionsStore.carregarPermissoes(session.user.email)
          } else {
            set({
              usuario: null,
              isAutenticado: false,
              isCarregando: false
            })
          }
        } catch (error) {
          console.error('[Auth] Erro ao verificar autenticação:', error)
          set({
            usuario: null,
            isAutenticado: false,
            isCarregando: false
          })
        }
      },

      /**
       * Limpar mensagem de erro
       */
      limparErro: () => set({ erro: null }),

      /**
       * Definir usuário manualmente (usado pelo SessionProvider)
       */
      setUsuario: (usuario: Usuario | null) => {
        set({
          usuario,
          isAutenticado: !!usuario
        })
      }
    }),
    {
      name: 'auth-storage',
      // Apenas persistir dados básicos (não o token)
      partialize: (state) => ({
        usuario: state.usuario,
        isAutenticado: state.isAutenticado
      })
    }
  )
)

// ========================================
// ✅ SELECTORS OTIMIZADOS (Performance++)
// ========================================

/**
 * Selector otimizado: retorna apenas o usuário
 * Re-renderiza APENAS quando o usuário mudar
 */
export const useUsuario = () => useAuthStore(state => state.usuario)

/**
 * Selector otimizado: retorna apenas status de autenticação
 * Re-renderiza APENAS quando isAutenticado mudar
 */
export const useIsAutenticado = () => useAuthStore(state => state.isAutenticado)

/**
 * Selector otimizado: retorna apenas status de carregamento
 * Re-renderiza APENAS quando isCarregando mudar
 */
export const useIsCarregando = () => useAuthStore(state => state.isCarregando)

/**
 * Selector otimizado: retorna apenas o erro
 * Re-renderiza APENAS quando erro mudar
 */
export const useAuthErro = () => useAuthStore(state => state.erro)

/**
 * Selector otimizado: retorna apenas as actions
 * NUNCA re-renderiza (actions são estáveis)
 */
export const useAuthActions = () => useAuthStore(state => ({
  login: state.login,
  logout: state.logout,
  verificarAutenticacao: state.verificarAutenticacao,
  limparErro: state.limparErro,
  setUsuario: state.setUsuario
}))
