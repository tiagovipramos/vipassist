'use client'

import { useState, useMemo, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Phone,
  Mail,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  Download,
  Upload,
  UserCheck,
  Building2,
  Check,
  X,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { useSidebarActions } from '@/stores/sidebarStore'
import { Button } from '@/componentes/ui/button'
import { Input } from '@/componentes/ui/input'
import { Badge } from '@/componentes/ui/badge'
import { Card } from '@/componentes/ui/card'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/componentes/ui/dialog'
import { Cliente } from '@/tipos/cliente'
import { cn } from '@/lib/utils'

type StatusFilter = 'todos' | 'ativo' | 'inativo' | 'inadimplente' | 'suspenso'
type TipoPessoaFilter = 'todos' | 'fisica' | 'juridica'
type TipoContratoFilter = 'todos' | 'mensal' | 'anual' | 'avulso'

// Tipos do banco de dados
interface ClienteDB {
  id: string
  nome: string
  email: string | null
  telefone: string
  cpf: string | null
  dataNascimento: string | null
  cep: string | null
  logradouro: string | null
  numero: string | null
  complemento: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  plano: string | null
  numeroApolice: string | null
  seguradora: string | null
  ativo: boolean
  observacoes: string | null
  createdAt: string
  updatedAt: string
}

export function ClientesClient() {
  const { setHeaderActionButton } = useSidebarActions()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos')
  const [tipoPessoaFilter, setTipoPessoaFilter] = useState<TipoPessoaFilter>('todos')
  const [tipoContratoFilter, setTipoContratoFilter] = useState<TipoContratoFilter>('todos')
  const [estadoFilter, setEstadoFilter] = useState('todos')
  const [cidadeFilter, setCidadeFilter] = useState('todos')
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Buscar clientes da API
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/clientes')
        const result = await response.json()
        
        if (result.success && result.data) {
          // Converter dados do banco para o formato esperado pelo componente
          const clientesFormatados: Cliente[] = result.data.map((c: ClienteDB) => ({
            id: c.id,
            nome: c.nome,
            email: c.email || '',
            telefone: c.telefone,
            cpf: c.cpf || undefined,
            cnpj: undefined,
            tipoPessoa: 'fisica' as const,
            nomeFantasia: undefined,
            razaoSocial: undefined,
            endereco: {
              cep: c.cep || '',
              logradouro: c.logradouro || '',
              numero: c.numero || '',
              complemento: c.complemento || undefined,
              bairro: c.bairro || '',
              cidade: c.cidade || '',
              estado: c.estado || '',
            },
            plano: c.plano || undefined,
            numeroApolice: c.numeroApolice || undefined,
            seguradora: c.seguradora || undefined,
            tipoContrato: 'mensal' as const,
            valorMensal: undefined,
            limiteAtendimentos: undefined,
            atendimentosUtilizados: 0,
            totalAtendimentos: 0,
            status: c.ativo ? 'ativo' as const : 'inativo' as const,
            dataInicioContrato: undefined,
            dataFimContrato: undefined,
            ultimoAtendimento: undefined,
            dataCadastro: c.createdAt,
            observacoes: c.observacoes || undefined,
            contatoResponsavel: undefined,
          }))
          
          setClientes(clientesFormatados)
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClientes()
  }, [])

  // Configurar botões do Header
  useEffect(() => {
    const actionButtons = (
      <div className="flex gap-3">
        <Button variant="outline" className="gap-2" onClick={() => console.log('Sincronizar API')}>
          <TrendingUp className="h-4 w-4" />
          Sincronizar API
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => console.log('Exportar')}>
          <Download className="h-4 w-4" />
          Exportar
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => console.log('Importar')}>
          <Upload className="h-4 w-4" />
          Importar
        </Button>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>
    )
    
    setHeaderActionButton(actionButtons)
    
    return () => setHeaderActionButton(null)
  }, [setHeaderActionButton])

  // Obter estados e cidades únicos
  const estados = useMemo(() => {
    const uniqueEstados = [...new Set(clientes.map(c => c.endereco.estado))].sort()
    return uniqueEstados
  }, [clientes])

  const cidades = useMemo(() => {
    if (estadoFilter === 'todos') {
      return [...new Set(clientes.map(c => c.endereco.cidade))].sort()
    }
    return [...new Set(
      clientes
        .filter(c => c.endereco.estado === estadoFilter)
        .map(c => c.endereco.cidade)
    )].sort()
  }, [clientes, estadoFilter])

  // Filtrar clientes
  const filteredClientes = useMemo(() => {
    return clientes.filter(cliente => {
      const matchesSearch = 
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.telefone.includes(searchTerm) ||
        (cliente.cpf && cliente.cpf.includes(searchTerm)) ||
        (cliente.cnpj && cliente.cnpj.includes(searchTerm)) ||
        (cliente.nomeFantasia && cliente.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = statusFilter === 'todos' || cliente.status === statusFilter
      const matchesTipoPessoa = tipoPessoaFilter === 'todos' || cliente.tipoPessoa === tipoPessoaFilter
      const matchesTipoContrato = tipoContratoFilter === 'todos' || cliente.tipoContrato === tipoContratoFilter
      const matchesEstado = estadoFilter === 'todos' || cliente.endereco.estado === estadoFilter
      const matchesCidade = cidadeFilter === 'todos' || cliente.endereco.cidade === cidadeFilter

      return matchesSearch && matchesStatus && matchesTipoPessoa && matchesTipoContrato && matchesEstado && matchesCidade
    })
  }, [clientes, searchTerm, statusFilter, tipoPessoaFilter, tipoContratoFilter, estadoFilter, cidadeFilter])

  // Calcular paginação
  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedClientes = filteredClientes.slice(startIndex, endIndex)

  // Reset para página 1 quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, tipoPessoaFilter, tipoContratoFilter, estadoFilter, cidadeFilter])

  // Estatísticas
  const stats = useMemo(() => {
    const receitaMensal = clientes
      .filter(c => c.status === 'ativo' && c.valorMensal)
      .reduce((sum, c) => sum + (c.valorMensal || 0), 0)

    return {
      total: clientes.length,
      ativos: clientes.filter(c => c.status === 'ativo').length,
      inadimplentes: clientes.filter(c => c.status === 'inadimplente').length,
      suspensos: clientes.filter(c => c.status === 'suspenso').length,
      receitaMensal,
    }
  }, [clientes])

  const handleView = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setIsViewModalOpen(true)
  }

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setIsEditModalOpen(true)
  }

  const handleDelete = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (selectedCliente) {
      setClientes(prev => prev.filter(c => c.id !== selectedCliente.id))
      setIsDeleteModalOpen(false)
      setSelectedCliente(null)
    }
  }

  const handleCreate = () => {
    setIsCreateModalOpen(true)
  }

  const handleToggleBlock = (cliente: Cliente) => {
    setClientes(prev => prev.map(c => {
      if (c.id === cliente.id) {
        return {
          ...c,
          status: c.status === 'suspenso' ? 'ativo' : 'suspenso'
        }
      }
      return c
    }))
  }

  const getStatusBadge = (status: Cliente['status']) => {
    const variants = {
      ativo: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inativo: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
      inadimplente: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      suspenso: { color: 'bg-yellow-100 text-yellow-800', icon: Ban },
    }
    
    const variant = variants[status]
    const Icon = variant.icon

    return (
      <Badge className={cn('flex items-center gap-1', variant.color)}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="flex h-full flex-col">
      {/* Stats */}
      <div className="border-b bg-white px-8 py-6">
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-sm text-gray-500">Total</div>
            <div className="mt-1 text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-sm text-gray-500">Ativos</div>
            <div className="mt-1 text-2xl font-bold text-green-600">{stats.ativos}</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-sm text-gray-500">Inadimplentes</div>
            <div className="mt-1 text-2xl font-bold text-red-600">{stats.inadimplentes}</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-sm text-gray-500">Suspensos</div>
            <div className="mt-1 text-2xl font-bold text-yellow-600">{stats.suspensos}</div>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b bg-white px-8 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email, telefone, CPF ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="todos">Todos os Status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
              <option value="inadimplente">Inadimplentes</option>
              <option value="suspenso">Suspensos</option>
            </select>

            <select
              value={tipoPessoaFilter}
              onChange={(e) => setTipoPessoaFilter(e.target.value as TipoPessoaFilter)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="todos">Todos os Tipos</option>
              <option value="fisica">Pessoa Física</option>
              <option value="juridica">Pessoa Jurídica</option>
            </select>

            <select
              value={tipoContratoFilter}
              onChange={(e) => setTipoContratoFilter(e.target.value as TipoContratoFilter)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="todos">Todos os Contratos</option>
              <option value="mensal">Mensal</option>
              <option value="anual">Anual</option>
              <option value="avulso">Avulso</option>
            </select>

            <select
              value={estadoFilter}
              onChange={(e) => {
                setEstadoFilter(e.target.value)
                setCidadeFilter('todos')
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="todos">Todos os Estados</option>
              {estados.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>

            <select
              value={cidadeFilter}
              onChange={(e) => setCidadeFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={estadoFilter === 'todos'}
            >
              <option value="todos">Todas as Cidades</option>
              {cidades.map(cidade => (
                <option key={cidade} value={cidade}>{cidade}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 p-8">
        <Card>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-sm text-gray-500">Carregando clientes...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Atendimentos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedClientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {cliente.tipoPessoa === 'fisica' ? (
                            <UserCheck className="h-5 w-5" />
                          ) : (
                            <Building2 className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {cliente.nomeFantasia || cliente.nome}
                          </div>
                          <div className="text-sm text-gray-500">
                            {cliente.tipoPessoa === 'fisica' ? cliente.cpf : cliente.cnpj}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">
                        {cliente.tipoPessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-3 w-3" />
                          {cliente.telefone}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-3 w-3" />
                          {cliente.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {cliente.atendimentosUtilizados}
                          {cliente.limiteAtendimentos && ` / ${cliente.limiteAtendimentos}`}
                        </div>
                        <div className="text-gray-500">
                          Total: {cliente.totalAtendimentos}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(cliente.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {cliente.status === 'suspenso' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleBlock(cliente)}
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                            title="Reativar cliente"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleBlock(cliente)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            title="Suspender cliente"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(cliente)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(cliente)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>

              {filteredClientes.length === 0 && (
                <div className="py-12 text-center">
                  <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Nenhum cliente encontrado
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Tente ajustar os filtros ou adicione um novo cliente.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Paginação */}
          {filteredClientes.length > 0 && (
            <div className="flex items-center justify-between border-t bg-white px-6 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredClientes.length)} de {filteredClientes.length} clientes
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Mostrar apenas algumas páginas ao redor da página atual
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="min-w-[40px]"
                        >
                          {page}
                        </Button>
                      )
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="px-2">...</span>
                    }
                    return null
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
            <DialogDescription>
              Informações completas do cliente
            </DialogDescription>
          </DialogHeader>
          
          {selectedCliente && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div>
                <h3 className="mb-3 font-semibold">Informações Básicas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Nome</label>
                    <p className="font-medium">{selectedCliente.nome}</p>
                  </div>
                  {selectedCliente.nomeFantasia && (
                    <div>
                      <label className="text-sm text-gray-500">Nome Fantasia</label>
                      <p className="font-medium">{selectedCliente.nomeFantasia}</p>
                    </div>
                  )}
                  {selectedCliente.razaoSocial && (
                    <div>
                      <label className="text-sm text-gray-500">Razão Social</label>
                      <p className="font-medium">{selectedCliente.razaoSocial}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-500">Tipo</label>
                    <p className="font-medium">
                      {selectedCliente.tipoPessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      {selectedCliente.tipoPessoa === 'fisica' ? 'CPF' : 'CNPJ'}
                    </label>
                    <p className="font-medium">
                      {selectedCliente.tipoPessoa === 'fisica' ? selectedCliente.cpf : selectedCliente.cnpj}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{selectedCliente.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Telefone</label>
                    <p className="font-medium">{selectedCliente.telefone}</p>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="mb-3 font-semibold">Endereço</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">CEP</label>
                    <p className="font-medium">{selectedCliente.endereco.cep}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Logradouro</label>
                    <p className="font-medium">{selectedCliente.endereco.logradouro}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Número</label>
                    <p className="font-medium">{selectedCliente.endereco.numero}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Bairro</label>
                    <p className="font-medium">{selectedCliente.endereco.bairro}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Cidade</label>
                    <p className="font-medium">{selectedCliente.endereco.cidade}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Estado</label>
                    <p className="font-medium">{selectedCliente.endereco.estado}</p>
                  </div>
                </div>
              </div>

              {/* Contrato */}
              <div>
                <h3 className="mb-3 font-semibold">Contrato</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Tipo de Contrato</label>
                    <p className="font-medium capitalize">{selectedCliente.tipoContrato}</p>
                  </div>
                  {selectedCliente.plano && (
                    <div>
                      <label className="text-sm text-gray-500">Plano</label>
                      <p className="font-medium">{selectedCliente.plano}</p>
                    </div>
                  )}
                  {selectedCliente.valorMensal && (
                    <div>
                      <label className="text-sm text-gray-500">Valor Mensal</label>
                      <p className="font-medium">{formatCurrency(selectedCliente.valorMensal)}</p>
                    </div>
                  )}
                  {selectedCliente.limiteAtendimentos && (
                    <div>
                      <label className="text-sm text-gray-500">Limite de Atendimentos</label>
                      <p className="font-medium">
                        {selectedCliente.atendimentosUtilizados} / {selectedCliente.limiteAtendimentos}
                      </p>
                    </div>
                  )}
                  {selectedCliente.dataInicioContrato && (
                    <div>
                      <label className="text-sm text-gray-500">Início do Contrato</label>
                      <p className="font-medium">{formatDate(selectedCliente.dataInicioContrato)}</p>
                    </div>
                  )}
                  {selectedCliente.dataFimContrato && (
                    <div>
                      <label className="text-sm text-gray-500">Fim do Contrato</label>
                      <p className="font-medium">{formatDate(selectedCliente.dataFimContrato)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contato Responsável */}
              {selectedCliente.contatoResponsavel && (
                <div>
                  <h3 className="mb-3 font-semibold">Contato Responsável</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Nome</label>
                      <p className="font-medium">{selectedCliente.contatoResponsavel.nome}</p>
                    </div>
                    {selectedCliente.contatoResponsavel.cargo && (
                      <div>
                        <label className="text-sm text-gray-500">Cargo</label>
                        <p className="font-medium">{selectedCliente.contatoResponsavel.cargo}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="font-medium">{selectedCliente.contatoResponsavel.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Telefone</label>
                      <p className="font-medium">{selectedCliente.contatoResponsavel.telefone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status e Histórico */}
              <div>
                <h3 className="mb-3 font-semibold">Status e Histórico</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedCliente.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Total de Atendimentos</label>
                    <p className="font-medium">{selectedCliente.totalAtendimentos}</p>
                  </div>
                  {selectedCliente.ultimoAtendimento && (
                    <div>
                      <label className="text-sm text-gray-500">Último Atendimento</label>
                      <p className="font-medium">{formatDate(selectedCliente.ultimoAtendimento)}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-500">Data de Cadastro</label>
                    <p className="font-medium">{formatDate(selectedCliente.dataCadastro)}</p>
                  </div>
                </div>
              </div>

              {/* Observações */}
              {selectedCliente.observacoes && (
                <div>
                  <h3 className="mb-3 font-semibold">Observações</h3>
                  <p className="text-sm text-gray-600">{selectedCliente.observacoes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Fechar
            </Button>
            <Button onClick={() => {
              setIsViewModalOpen(false)
              if (selectedCliente) handleEdit(selectedCliente)
            }}>
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o cliente <strong>{selectedCliente?.nome}</strong>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={(open) => {
        setIsCreateModalOpen(open)
        setIsEditModalOpen(open)
        if (!open) setSelectedCliente(null)
      }}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 flex flex-col overflow-hidden">
          {/* Conteúdo com scroll */}
          <div className="flex-1 overflow-y-auto px-8 py-8 modal-scrollbar">
            {(selectedCliente || isCreateModalOpen) && (
              <div className="space-y-8">
                {/* Informações Básicas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Informações Básicas
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Tipo de Pessoa *
                      </label>
                      <select
                        defaultValue={selectedCliente?.tipoPessoa || 'fisica'}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="fisica">Pessoa Física</option>
                        <option value="juridica">Pessoa Jurídica</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Nome *
                      </label>
                      <Input
                        defaultValue={selectedCliente?.nome}
                        placeholder="Nome do cliente"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        CPF/CNPJ *
                      </label>
                      <Input
                        defaultValue={selectedCliente?.cpf || selectedCliente?.cnpj}
                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Email *
                      </label>
                      <Input
                        type="email"
                        defaultValue={selectedCliente?.email}
                        placeholder="email@exemplo.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Telefone *
                      </label>
                      <Input
                        defaultValue={selectedCliente?.telefone}
                        placeholder="(00) 00000-0000"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Nome Fantasia
                      </label>
                      <Input
                        defaultValue={selectedCliente?.nomeFantasia}
                        placeholder="Nome fantasia (opcional)"
                      />
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Endereço
                  </h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        CEP *
                      </label>
                      <Input
                        id="cep-input"
                        defaultValue={selectedCliente?.endereco?.cep}
                        placeholder="00000-000"
                        maxLength={9}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Número *
                      </label>
                      <Input
                        name="numero"
                        defaultValue={selectedCliente?.endereco?.numero}
                        placeholder="123"
                      />
                    </div>

                    <div className="col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Logradouro *
                      </label>
                      <Input
                        name="logradouro"
                        defaultValue={selectedCliente?.endereco?.logradouro}
                        placeholder="Rua, Avenida, etc."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Complemento
                      </label>
                      <Input
                        defaultValue={selectedCliente?.endereco?.complemento}
                        placeholder="Apto, Sala, etc."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Bairro *
                      </label>
                      <Input
                        name="bairro"
                        defaultValue={selectedCliente?.endereco?.bairro}
                        placeholder="Bairro"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Cidade *
                      </label>
                      <Input
                        name="cidade"
                        defaultValue={selectedCliente?.endereco?.cidade}
                        placeholder="Cidade"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Estado *
                      </label>
                      <Input
                        name="estado"
                        defaultValue={selectedCliente?.endereco?.estado}
                        placeholder="UF"
                        maxLength={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Contrato */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Informações do Contrato
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Tipo de Contrato *
                      </label>
                      <select
                        defaultValue={selectedCliente?.tipoContrato || 'mensal'}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="mensal">Mensal</option>
                        <option value="anual">Anual</option>
                        <option value="avulso">Avulso</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Plano
                      </label>
                      <Input
                        defaultValue={selectedCliente?.plano}
                        placeholder="Nome do plano"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Valor Mensal
                      </label>
                      <Input
                        type="number"
                        defaultValue={selectedCliente?.valorMensal}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Limite de Atendimentos
                      </label>
                      <Input
                        type="number"
                        defaultValue={selectedCliente?.limiteAtendimentos}
                        placeholder="Ilimitado"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Data Início Contrato
                      </label>
                      <Input
                        type="date"
                        defaultValue={selectedCliente?.dataInicioContrato}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Data Fim Contrato
                      </label>
                      <Input
                        type="date"
                        defaultValue={selectedCliente?.dataFimContrato}
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Status e Observações
                  </h3>
                  <div className="space-y-4">
                    <div className="w-48 space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Status *
                      </label>
                      <select
                        defaultValue={selectedCliente?.status || 'ativo'}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                        <option value="inadimplente">Inadimplente</option>
                        <option value="suspenso">Suspenso</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Observações
                      </label>
                      <textarea
                        defaultValue={selectedCliente?.observacoes}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Observações adicionais sobre o cliente..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer fixo */}
          <div className="shrink-0 border-t bg-gray-50 px-8 py-4">
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setIsEditModalOpen(false)
                  setSelectedCliente(null)
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  // TODO: Implementar lógica de salvamento
                  console.log('Salvar cliente')
                  setIsEditModalOpen(false)
                  setIsCreateModalOpen(false)
                  setSelectedCliente(null)
                }}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                {isCreateModalOpen ? 'Criar Cliente' : 'Salvar Alterações'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
