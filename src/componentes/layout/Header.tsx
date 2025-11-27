'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Bell, Settings as SettingsIcon, CreditCard, HelpCircle, User, Code, Shield } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/componentes/ui/avatar'
import { useUsuario } from '@/stores/authStore'
import { useHeaderActionButton } from '@/stores/sidebarStore'
import { usePermissoes } from '@/stores/permissionsStore'
import { getInitials, cn } from '@/lib/utils'
import { ModalConfiguracoesAPI } from '@/componentes/configuracoes/ModalConfiguracoesAPI'

interface Notificacao {
  id: string
  tipo: string
  titulo: string
  descricao: string
  icone: string
  link?: string | null
  lida: boolean
  dataHora: string
}

interface HeaderProps {
  title?: string
  description?: string
  icon?: string
  actionButton?: React.ReactNode
}

// Mapeamento de rotas para títulos e descrições
const routeInfo: Record<string, { title: string; description: string; icon: string }> = {
  '/ia': {
    title: 'IA & Automações',
    description: 'Configure e gerencie inteligência artificial',
    icon: '🤖'
  },
  '/conversas': {
    title: 'Conversas',
    description: 'Gerencie todas as conversas com clientes',
    icon: '💬'
  },
  '/tickets': {
    title: 'Lista de Chamados',
    description: 'Gerencie todos os chamados de assistência veicular',
    icon: '🚗'
  },
  '/tickets/criar': {
    title: 'Criar Novo Chamado',
    description: 'Preencha os dados abaixo para registrar um novo chamado',
    icon: '🎫'
  },
  '/tickets/mapa': {
    title: 'Mapa Ao Vivo',
    description: 'Visualização em tempo real de todos os atendimentos em andamento',
    icon: '🗺️'
  },
  '/atendentes': {
    title: 'Atendentes',
    description: 'Gerencie sua equipe de atendimento',
    icon: '👥'
  },
  '/crm': {
    title: 'CRM Pipeline',
    description: 'Gerencie relacionamento com clientes',
    icon: '🏢'
  },
  '/relatorios': {
    title: 'Relatórios',
    description: 'Análises e métricas do seu negócio',
    icon: '📊'
  },
  '/equipe': {
    title: 'Equipe',
    description: 'Gerencie membros e permissões da equipe',
    icon: '👔'
  },
  '/canais': {
    title: 'Canais & Integrações',
    description: 'Gerencie canais de comunicação e integrações',
    icon: '🔗'
  },
  '/painel': {
    title: 'Dashboard Operacional',
    description: 'Assistência Veicular 24 Horas',
    icon: '📊'
  },
  '/pagamentos': {
    title: 'Pagamentos',
    description: 'Gerencie pagamentos pendentes e finalizados',
    icon: '💳'
  },
  '/suporte': {
    title: 'Ajuda e Suporte',
    description: 'Central de ajuda completa para resolver suas dúvidas',
    icon: '🆘'
  },
  '/campanhas': {
    title: '📢 Campanhas em Massa',
    description: '',
    icon: ''
  },
  '/integracoes': {
    title: 'Integrações',
    description: 'Conecte suas ferramentas favoritas e potencialize seu atendimento',
    icon: '🔗'
  },
  '/prestadores': {
    title: 'Prestadores',
    description: 'Gerencie os prestadores de serviço cadastrados',
    icon: '👷'
  },
  '/clientes': {
    title: 'Clientes',
    description: 'Gerencie os clientes cadastrados no sistema',
    icon: '👥'
  },
  '/logs': {
    title: '📋 Logs do Sistema',
    description: 'Visualize e monitore todas as atividades do sistema em tempo real',
    icon: ''
  },
  '/seguranca': {
    title: '🔒 Segurança & Privacidade',
    description: 'Gerencie autenticação e dispositivos conectados',
    icon: ''
  },
}

export function Header({ title: propTitle, description: propDescription, icon: propIcon, actionButton }: HeaderProps = {}) {
  const usuario = useUsuario()
  const pathname = usePathname()
  const router = useRouter()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isAPIModalOpen, setIsAPIModalOpen] = useState(false)
  const [notificacoesLista, setNotificacoesLista] = useState<Notificacao[]>([])
  const [loading, setLoading] = useState(true)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const headerActionButtonFromStore = useHeaderActionButton()
  const permissoes = usePermissoes()
  
  const naoLidas = notificacoesLista.filter((n: Notificacao) => !n.lida).length

  // Verificar permissões para itens do menu
  const temPermissaoSeguranca = permissoes.includes('administrativo.seguranca')
  const temPermissaoAjuda = permissoes.includes('suporte.ajuda')
  const temPermissaoAPI = permissoes.includes('suporte.api')

  // Busca informações da rota ou usa as props fornecidas
  const currentRoute = routeInfo[pathname || ''] || {}
  const title = propTitle || currentRoute.title
  const description = propDescription || currentRoute.description
  const icon = propIcon || currentRoute.icon
  const finalActionButton = actionButton || headerActionButtonFromStore

  // Buscar notificações da API
  useEffect(() => {
    const fetchNotificacoes = async () => {
      try {
        const response = await fetch('/api/notificacoes?limite=20')
        if (response.ok) {
          const data = await response.json()
          setNotificacoesLista(data)
        }
      } catch (error) {
        console.error('Erro ao buscar notificações:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotificacoes()
    
    // Atualizar notificações a cada 30 segundos
    const interval = setInterval(fetchNotificacoes, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isNotificationsOpen || isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isNotificationsOpen, isUserMenuOpen])


  const marcarComoLida = (id: string) => {
    setNotificacoesLista(prev => 
      prev.map(n => n.id === id ? { ...n, lida: true } : n)
    )
  }

  const marcarTodasComoLidas = () => {
    setNotificacoesLista(prev => prev.map(n => ({ ...n, lida: true })))
  }

  const handleNotificacaoClick = (notificacao: Notificacao) => {
    marcarComoLida(notificacao.id)
    if (notificacao.link) {
      setIsNotificationsOpen(false)
      router.push(notificacao.link)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white px-8">
      <div className="flex items-center gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <div>
          {title && (
            <>
              <h1 className="text-2xl font-semibold text-gray-900">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Action Button */}
        {finalActionButton && <div>{finalActionButton}</div>}
        
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors",
              isNotificationsOpen ? "bg-gray-100" : "hover:bg-gray-100"
            )}
          >
            <Bell className="h-5 w-5" />
            {naoLidas > 0 && (
              <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {naoLidas}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 w-96 rounded-lg border bg-white shadow-lg max-h-[500px] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b p-4">
                <h3 className="font-semibold text-gray-900">Notificações</h3>
                {naoLidas > 0 && (
                  <button
                    onClick={marcarTodasComoLidas}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Marcar todas como lidas
                  </button>
                )}
              </div>

              {/* Lista de Notificações */}
              <div className="overflow-y-auto flex-1">
                {notificacoesLista.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Nenhuma notificação</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {notificacoesLista.map((notificacao) => (
                      <button
                        key={notificacao.id}
                        onClick={() => handleNotificacaoClick(notificacao)}
                        className={cn(
                          "w-full p-4 text-left transition-colors hover:bg-gray-50",
                          !notificacao.lida && "bg-blue-50"
                        )}
                      >
                        <div className="flex gap-3">
                          <div className="text-2xl flex-shrink-0">{notificacao.icone}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className={cn(
                                "text-sm font-medium text-gray-900",
                                !notificacao.lida && "font-semibold"
                              )}>
                                {notificacao.titulo}
                              </p>
                              {!notificacao.lida && (
                                <span className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                              {notificacao.descricao}
                            </p>
                            <p className="text-xs text-gray-400">
                              {notificacao.dataHora}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notificacoesLista.length > 0 && (
                <div className="border-t p-3">
                  <Link
                    href="/notificacoes"
                    onClick={() => setIsNotificationsOpen(false)}
                    className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ver todas as notificações
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Avatar with Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 rounded-lg transition-colors hover:bg-gray-100 p-2"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={usuario?.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-secondary to-accent text-white">
                {usuario?.nome ? getInitials(usuario.nome) : 'U'}
              </AvatarFallback>
            </Avatar>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-14 w-64 rounded-lg border bg-white shadow-lg">
              {/* User Info */}
              <div className="border-b p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={usuario?.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-secondary to-accent text-white">
                      {usuario?.nome ? getInitials(usuario.nome) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {usuario?.nome || 'Usuário'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {usuario?.email || 'usuario@example.com'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {temPermissaoSeguranca && (
                  <Link
                    href="/seguranca"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <Shield className="h-5 w-5" />
                    <span>Segurança</span>
                  </Link>
                )}

                {temPermissaoAjuda && (
                  <Link
                    href="/suporte"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <HelpCircle className="h-5 w-5" />
                    <span>Ajuda & Suporte</span>
                  </Link>
                )}

                {temPermissaoAPI && (
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      setIsAPIModalOpen(true)
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <Code className="h-5 w-5" />
                    <span>API</span>
                  </button>
                )}
                
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Configurações de API */}
      <ModalConfiguracoesAPI
        isOpen={isAPIModalOpen}
        onClose={() => setIsAPIModalOpen(false)}
      />
    </header>
  )
}
