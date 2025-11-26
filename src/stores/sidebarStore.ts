import { create } from 'zustand'

interface SidebarStore {
  isCollapsed: boolean
  showHeader: boolean
  headerActionButton: React.ReactNode | null
  toggleSidebar: () => void
  collapseSidebar: () => void
  expandSidebar: () => void
  hideHeader: () => void
  showHeaderFn: () => void
  setHeaderActionButton: (button: React.ReactNode | null) => void
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isCollapsed: false,
  showHeader: true,
  headerActionButton: null,
  toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  collapseSidebar: () => set({ isCollapsed: true }),
  expandSidebar: () => set({ isCollapsed: false }),
  hideHeader: () => set({ showHeader: false }),
  showHeaderFn: () => set({ showHeader: true }),
  setHeaderActionButton: (button) => set({ headerActionButton: button }),
}))

// ========================================
// ✅ SELECTORS OTIMIZADOS (Performance++)
// ========================================

/**
 * Selector otimizado: retorna apenas isCollapsed
 * Re-renderiza APENAS quando isCollapsed mudar
 */
export const useIsCollapsed = () => useSidebarStore(state => state.isCollapsed)

/**
 * Selector otimizado: retorna apenas showHeader
 * Re-renderiza APENAS quando showHeader mudar
 */
export const useShowHeader = () => useSidebarStore(state => state.showHeader)

/**
 * Selector otimizado: retorna apenas headerActionButton
 * Re-renderiza APENAS quando headerActionButton mudar
 */
export const useHeaderActionButton = () => useSidebarStore(state => state.headerActionButton)

/**
 * Selector otimizado: retorna apenas as actions
 * NUNCA re-renderiza (actions são estáveis)
 */
export const useSidebarActions = () => useSidebarStore(state => ({
  toggleSidebar: state.toggleSidebar,
  collapseSidebar: state.collapseSidebar,
  expandSidebar: state.expandSidebar,
  hideHeader: state.hideHeader,
  showHeaderFn: state.showHeaderFn,
  setHeaderActionButton: state.setHeaderActionButton,
}))
