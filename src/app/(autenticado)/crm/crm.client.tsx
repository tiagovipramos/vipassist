'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSidebarActions } from '@/stores/sidebarStore'
import {
  Search, 
  Plus,
  X,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import { 
  DndContext, 
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { Button } from '@/componentes/ui/button'
import { Input } from '@/componentes/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogBody,
  DialogFooter,
} from '@/componentes/ui/dialog'
import { 
  clientesCRMMockados, 
} from '@/lib/dadosMockados'
import { ClienteCRM, StatusCliente } from '@/tipos/crm'
import { KanbanCard } from './components/KanbanCard'
import { KanbanColumn } from './components/KanbanColumn'

// Configuração das colunas do Kanban
const COLUNAS_CONFIG = [
  {
    id: 'lead' as StatusCliente,
    titulo: 'Leads',
    cor: '#3B82F6',
    icone: '🌟',
  },
  {
    id: 'prospect' as StatusCliente,
    titulo: 'Prospects',
    cor: '#8B5CF6',
    icone: '🤝',
  },
  {
    id: 'cliente' as StatusCliente,
    titulo: 'Clientes',
    cor: '#10B981',
    icone: '💰',
  },
  {
    id: 'vip' as StatusCliente,
    titulo: 'VIP',
    cor: '#F59E0B',
    icone: '👑',
  },
  {
    id: 'inativo' as StatusCliente,
    titulo: 'Inativos',
    cor: '#6B7280',
    icone: '😴',
  },
]

export default function CRMPageClient() {
  const [busca, setBusca] = useState('')
  const [clientes, setClientes] = useState<ClienteCRM[]>(clientesCRMMockados)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [modalNovoCliente, setModalNovoCliente] = useState(false)
  const [isCompactMode, setIsCompactMode] = useState(true)
  const { collapseSidebar, setHeaderActionButton } = useSidebarActions()

  // Recolher sidebar e configurar botão + busca do header ao montar
  useEffect(() => {
    collapseSidebar()
    setHeaderActionButton(
      <div className="flex items-center gap-2">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar clientes..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 h-9 text-sm"
          />
          {busca && (
            <button
              onClick={() => setBusca('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 h-9"
          onClick={() => setIsCompactMode(!isCompactMode)}
          title={isCompactMode ? 'Modo Normal' : 'Modo Compacto'}
        >
          {isCompactMode ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </Button>
        
        <Button 
          size="sm"
          className="gap-1.5 h-9"
          onClick={() => setModalNovoCliente(true)}
        >
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>
    )
    
    // Limpar ao desmontar
    return () => {
      setHeaderActionButton(null)
    }
  }, [collapseSidebar, setHeaderActionButton, busca, setBusca, isCompactMode])

  // Configuração dos sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Filtrar clientes por busca
  const clientesFiltrados = useMemo(() => {
    if (!busca) return clientes
    
    const buscaLower = busca.toLowerCase()
    return clientes.filter(cliente => 
      cliente.nome.toLowerCase().includes(buscaLower) ||
      cliente.email?.toLowerCase().includes(buscaLower) ||
      cliente.telefone.includes(busca) ||
      cliente.empresa?.toLowerCase().includes(buscaLower) ||
      cliente.tags.some(tag => tag.toLowerCase().includes(buscaLower))
    )
  }, [clientes, busca])

  // Agrupar clientes por status
  const clientesPorStatus = useMemo(() => {
    const grupos: Record<StatusCliente, ClienteCRM[]> = {
      lead: [],
      prospect: [],
      cliente: [],
      vip: [],
      inativo: [],
      em_risco: [],
    }

    clientesFiltrados.forEach(cliente => {
      grupos[cliente.status].push(cliente)
    })

    return grupos
  }, [clientesFiltrados])

  // Handlers para drag & drop
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) {
      setActiveId(null)
      return
    }

    const activeClienteId = active.id as string
    const overId = over.id as string

    // Encontrar o cliente ativo
    const activeCliente = clientes.find(c => c.id === activeClienteId)
    if (!activeCliente) {
      setActiveId(null)
      return
    }

    // Encontrar o cliente sobre o qual foi solto (se houver)
    const overCliente = clientes.find(c => c.id === overId)
    
    // Determinar a coluna de destino
    let targetColumnId: StatusCliente
    if (overCliente) {
      // Solto sobre um card
      targetColumnId = overCliente.status
    } else {
      // Solto sobre uma coluna vazia
      targetColumnId = overId as StatusCliente
    }

    // Verificar se é uma coluna válida
    if (!COLUNAS_CONFIG.some(col => col.id === targetColumnId)) {
      setActiveId(null)
      return
    }

    setClientes(prev => {
      const activeIndex = prev.findIndex(c => c.id === activeClienteId)
      const overIndex = overCliente ? prev.findIndex(c => c.id === overId) : -1

      // Se for a mesma coluna e houver um card sobre o qual foi solto
      if (activeCliente.status === targetColumnId && overIndex !== -1) {
        // Reordenar dentro da mesma coluna
        return arrayMove(prev, activeIndex, overIndex)
      }

      // Mover para outra coluna
      return prev.map(cliente => 
        cliente.id === activeClienteId
          ? { ...cliente, status: targetColumnId }
          : cliente
      )
    })

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const activeCliente = activeId 
    ? clientes.find(c => c.id === activeId)
    : null

  return (
    <div className="h-full bg-gray-50 overflow-hidden">
        {/* Kanban Board com Scroll Horizontal Suave */}
        <div className="h-full overflow-x-auto overflow-y-hidden px-3 pb-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div className="flex gap-2 min-h-full pb-2">
              {COLUNAS_CONFIG.map((coluna) => {
                const clientesColuna = clientesPorStatus[coluna.id] || []

                return (
                  <KanbanColumn
                    key={coluna.id}
                    id={coluna.id}
                    titulo={coluna.titulo}
                    cor={coluna.cor}
                    icone={coluna.icone}
                    count={clientesColuna.length}
                  >
                    <SortableContext
                      items={clientesColuna.map(c => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className={isCompactMode ? "space-y-2" : "space-y-2.5"}>
                        {clientesColuna.map((cliente) => (
                          <KanbanCard
                            key={cliente.id}
                            cliente={cliente}
                            isCompact={isCompactMode}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </KanbanColumn>
                )
              })}
            </div>

            <DragOverlay>
              {activeCliente ? (
                <div className="rotate-2 opacity-80">
                  <KanbanCard cliente={activeCliente} isDragging isCompact={isCompactMode} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Modal Novo Cliente */}
        <Dialog open={modalNovoCliente} onOpenChange={setModalNovoCliente}>
          <DialogContent>
            <DialogHeader>
              <div>
                <DialogTitle>Novo Cliente</DialogTitle>
                <p className="mt-1 text-sm text-gray-500">Preencha os dados do cliente</p>
              </div>
              <DialogClose onClick={() => setModalNovoCliente(false)} />
            </DialogHeader>

            <DialogBody>
              <form className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <Input placeholder="Digite o nome completo" required />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input type="email" placeholder="email@exemplo.com" />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Telefone <span className="text-red-500">*</span>
                  </label>
                  <Input placeholder="(00) 00000-0000" required />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Empresa
                  </label>
                  <Input placeholder="Nome da empresa" />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 px-3 py-2">
                    <option value="lead">Lead</option>
                    <option value="prospect">Prospect</option>
                    <option value="cliente">Cliente</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
              </form>
            </DialogBody>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setModalNovoCliente(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => {
                alert('Cliente salvo com sucesso!')
                setModalNovoCliente(false)
              }}>
                Salvar Cliente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  )
}
