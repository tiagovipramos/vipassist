import { Suspense } from 'react'
import { Metadata } from 'next'
import { ChatClient } from './chat.client'
import { conversasMockadas } from '@/lib/mocks/inbox'

export const metadata: Metadata = {
  title: 'Chat | Kortex',
  description: 'Gerencie suas conversas em tempo real com clientes',
  openGraph: {
    title: 'Chat | Kortex',
    description: 'Gerencie suas conversas em tempo real',
    images: ['/og/chat.png'],
  }
}

/**
 * Chat Page - Server Component
 * 
 * Responsabilidades:
 * - Metadata SEO
 * - Carregar dados iniciais (conversas) no servidor
 * - Renderizar skeleton durante loading
 */
export default async function ChatPage() {
  // ✅ Dados iniciais carregados no servidor
  // TODO: Quando backend estiver pronto, substituir por:
  // const conversasIniciais = await getConversas()
  const conversasIniciais = conversasMockadas
  
  return (
    <Suspense fallback={<ChatSkeleton />}>
      <ChatClient initialConversas={conversasIniciais} />
    </Suspense>
  )
}

/**
 * Skeleton Loading State
 */
function ChatSkeleton() {
  return (
    <div className="h-full bg-gray-50 flex">
      {/* Lista de conversas skeleton */}
      <div className="w-[380px] bg-white border-r border-gray-200 p-4">
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Área de chat skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-white border-b border-gray-200 animate-pulse"></div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              <div className="h-16 w-2/3 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
