'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Ticket, 
  Users, 
  BarChart3, 
  Settings,
  LogOut,
  UserCog,
  Link2,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Building2,
  MapPin,
  DollarSign,
  FileText,
  Shield,
  ClipboardList,
  Plus,
  List,
  Truck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthActions } from '@/stores/authStore'
import { useIsCollapsed, useSidebarActions } from '@/stores/sidebarStore'
import { usePermissoes } from '@/stores/permissionsStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface MenuItem {
  icon: any
  label: string
  href: string
  badge?: number
  badgeVariant?: 'default' | 'urgent'
  permissao?: string
  submenu?: {
    label: string
    href: string
  }[]
}

interface MenuSection {
  title?: string
  items: MenuItem[]
}

const menuSections: MenuSection[] = [
  {
    items: [
      {
        icon: Home,
        label: 'Dashboard',
        href: '/painel',
        permissao: 'geral.dashboard'
      },
    ]
  },
  {
    title: 'OPERACIONAL',
    items: [
      {
        icon: Ticket,
        label: 'Chamados',
        href: '/tickets',
        permissao: 'operacional.chamados',
        submenu: [
          { label: 'Criar Chamado', href: '/tickets/criar' },
          { label: 'Lista de Chamados', href: '/tickets' },
        ]
      },
      {
        icon: MapPin,
        label: 'Mapa ao Vivo',
        href: '/tickets/mapa',
        permissao: 'operacional.mapa'
      },
    ]
  },
  {
    title: 'CADASTROS',
    items: [
      {
        icon: UserCheck,
        label: 'Prestadores',
        href: '/prestadores',
        permissao: 'operacional.prestadores'
      },
      {
        icon: Building2,
        label: 'Clientes',
        href: '/clientes',
        permissao: 'operacional.clientes'
      },
    ]
  },
  {
    title: 'FINANCEIRO',
    items: [
      {
        icon: DollarSign,
        label: 'Financeiro',
        href: '/pagamentos',
        permissao: 'gestao.financeiro'
      },
    ]
  },
  {
    title: 'GESTÃO',
    items: [
      {
        icon: BarChart3,
        label: 'Relatórios',
        href: '/relatorios',
        permissao: 'gestao.relatorios'
      },
      {
        icon: UserCog,
        label: 'Usuários & Permissões',
        href: '/equipe',
        permissao: 'administrativo.usuarios'
      },
      {
        icon: FileText,
        label: 'Logs & Auditoria',
        href: '/logs',
        permissao: 'administrativo.logs'
      },
    ]
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuthActions()
  const isCollapsed = useIsCollapsed()
  const { toggleSidebar } = useSidebarActions()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const permissoes = usePermissoes()

  // Função para verificar se o item deve ser exibido
  const podeExibir = (item: MenuItem) => {
    // Se não tem permissão definida, exibe para todos
    if (!item.permissao) return true
    // Se tem permissão, verifica se está na lista
    return permissoes.includes(item.permissao)
  }

  const handleLogout = () => {
    logout()
    router.push('/entrar')
  }

  const toggleSubmenu = (href: string) => {
    setExpandedMenus(prev => 
      prev.includes(href) 
        ? [] // Fecha o menu se já estiver aberto
        : [href] // Abre apenas este menu, fechando todos os outros
    )
  }

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-white transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-lg font-bold text-white">
              V
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">VIP Assist</span>
                <span className="text-xs text-gray-500">Sistema</span>
              </div>
            )}
          </div>
          
          <button
            onClick={toggleSidebar}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-2 scrollbar-hide">
          <div className="space-y-4">
            {menuSections.map((section, sectionIndex) => {
              // Filtrar itens visíveis da seção
              const itensVisiveis = section.items.filter(podeExibir)
              
              // Se não há itens visíveis, não renderizar a seção
              if (itensVisiveis.length === 0) return null
              
              return (
              <div key={sectionIndex}>
                {section.title && !isCollapsed && (
                  <div className="mb-2 px-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {section.title}
                    </h3>
                  </div>
                )}
                
                <div className={cn("space-y-1", isCollapsed ? "px-3" : "px-2")}>
                  {itensVisiveis.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                    const hasSubmenu = item.submenu && item.submenu.length > 0
                    const isExpanded = expandedMenus.includes(item.href)
                    
                    return (
                      <div key={item.href}>
                        {/* Item Principal */}
                        {hasSubmenu && !isCollapsed ? (
                          <button
                            onClick={() => toggleSubmenu(item.href)}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-primary text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            )}
                          >
                            <Icon className="h-5 w-5 shrink-0" />
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge !== undefined && (
                              <span
                                className={cn(
                                  'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                                  item.badgeVariant === 'urgent'
                                    ? 'bg-red-500 text-white'
                                    : isActive 
                                    ? 'bg-white/20 text-white'
                                    : 'bg-primary text-white'
                                )}
                              >
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight className={cn(
                              "h-4 w-4 transition-transform",
                              isExpanded && "rotate-90"
                            )} />
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-primary text-white'
                                : 'text-gray-700 hover:bg-gray-100',
                              isCollapsed && 'justify-center'
                            )}
                            title={isCollapsed ? item.label : undefined}
                          >
                            <Icon className="h-5 w-5 shrink-0" />
                            {!isCollapsed && (
                              <>
                                <span className="flex-1">{item.label}</span>
                                {item.badge !== undefined && (
                                  <span
                                    className={cn(
                                      'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                                      item.badgeVariant === 'urgent'
                                        ? 'bg-red-500 text-white'
                                        : isActive 
                                        ? 'bg-white/20 text-white'
                                        : 'bg-primary text-white'
                                    )}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </>
                            )}
                          </Link>
                        )}

                        {/* Submenu */}
                        {hasSubmenu && !isCollapsed && isExpanded && (
                          <div className="ml-8 mt-1 space-y-1">
                            {item.submenu!.map((subitem) => {
                              const isSubActive = pathname === subitem.href
                              return (
                                <Link
                                  key={subitem.href}
                                  href={subitem.href}
                                  className={cn(
                                    'block rounded-lg px-3 py-2 text-sm transition-colors',
                                    isSubActive
                                      ? 'bg-primary/10 text-primary font-medium'
                                      : 'text-gray-600 hover:bg-gray-100'
                                  )}
                                >
                                  {subitem.label}
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )})}
          </div>
        </nav>
      </div>
    </aside>
  )
}
