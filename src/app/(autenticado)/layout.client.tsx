'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/componentes/layout/Sidebar'
import { Header } from '@/componentes/layout/Header'
import { NotificacoesPush } from '@/componentes/notificacoes/NotificacoesPush'
import { useIsAutenticado, useIsCarregando, useAuthActions, useUsuario } from '@/stores/authStore'
import { useIsCollapsed, useShowHeader } from '@/stores/sidebarStore'
import { useHeartbeat } from '@/hooks/useHeartbeat'
import { cn } from '@/lib/utils'

export function AuthenticatedLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const usuario = useUsuario()
  const isCollapsed = useIsCollapsed()
  const showHeader = useShowHeader()
  
  // Enviar heartbeat para manter status online
  useHeartbeat(usuario?.id || null)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div 
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300",
          isCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
      <NotificacoesPush />
    </div>
  )
}
