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
  Truck,
  Wrench,
  Zap,
  Circle,
  Key,
  Fuel,
  List,
  Grid3x3
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
import { tiposServico } from '@/lib/mocks/prestadores'
import { Prestador } from '@/tipos/prestador'
import { cn } from '@/lib/utils'
import { prestadoresService } from '@/lib/services/prestadores.service'
import { PrestadorGoogleMaps } from '@/tipos/googleMaps'

type StatusFilter = 'todos' | 'ativo' | 'inativo' | 'pendente' | 'bloqueado'
type TipoPessoaFilter = 'todos' | 'fisica' | 'juridica'

export function PrestadoresClient() {
  const { setHeaderActionButton } = useSidebarActions()
  const [prestadores, setPrestadores] = useState<Prestador[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos')
  const [tipoPessoaFilter, setTipoPessoaFilter] = useState<TipoPessoaFilter>('todos')
  const [estadoFilter, setEstadoFilter] = useState('todos')
  const [cidadeFilter, setCidadeFilter] = useState('todos')
  const [selectedPrestador, setSelectedPrestador] = useState<Prestador | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [formData, setFormData] = useState<Partial<Prestador>>({})

  // Estado para modal de busca Google Maps
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'texto' | 'proximo'>('texto')
  const [searchRadius, setSearchRadius] = useState(5) // Raio em km
  const [searchResults, setSearchResults] = useState<PrestadorGoogleMaps[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [viewMode, setViewMode] = useState<'lista' | 'grade'>('grade')

  // Carregar prestadores ao montar o componente
  useEffect(() => {
    carregarPrestadores()
  }, [])

  const carregarPrestadores = async () => {
    try {
      setIsLoading(true)
      const data = await prestadoresService.listar()
      setPrestadores(data)
    } catch (error) {
      console.error('Erro ao carregar prestadores:', error)
      alert('Erro ao carregar prestadores. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para buscar prestadores via Google Maps
  const handleGoogleMapsSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError('Digite uma cidade ou endereço para buscar')
      return
    }

    setIsSearching(true)
    setSearchError('')
    setSearchResults([])

    try {
      if (searchType === 'texto') {
        // Busca por texto
        const response = await fetch('/api/google-maps/buscar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipo: 'texto',
            query: searchQuery,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao buscar prestadores')
        }

        setSearchResults(data.prestadores || [])
      } else {
        // Busca por proximidade - primeiro geocodificar o endereço
        const geocodeResponse = await fetch('/api/google-maps/buscar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipo: 'geocode',
            query: searchQuery,
          }),
        })

        const geocodeData = await geocodeResponse.json()

        if (!geocodeResponse.ok) {
          throw new Error(geocodeData.error || 'Erro ao geocodificar endereço')
        }

        if (!geocodeData.coordenadas) {
          throw new Error('Não foi possível encontrar as coordenadas do endereço')
        }

        // Agora buscar prestadores próximos
        const nearbyResponse = await fetch('/api/google-maps/buscar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipo: 'proximo',
            latitude: geocodeData.coordenadas.lat,
            longitude: geocodeData.coordenadas.lng,
            raio: searchRadius * 1000, // Converter km para metros
          }),
        })

        const nearbyData = await nearbyResponse.json()

        if (!nearbyResponse.ok) {
          throw new Error(nearbyData.error || 'Erro ao buscar prestadores próximos')
        }

        setSearchResults(nearbyData.prestadores || [])
      }
    } catch (error: any) {
      console.error('Erro na busca:', error)
      setSearchError(error.message || 'Erro ao buscar prestadores. Tente novamente.')
    } finally {
      setIsSearching(false)
    }
  }

  // Configurar botões do Header
  useEffect(() => {
    const actionButtons = (
      <div className="flex gap-3">
        <Button variant="outline" className="gap-2" onClick={() => console.log('Exportar')}>
          <Download className="h-4 w-4" />
          Exportar
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => setIsSearchModalOpen(true)}>
          <Search className="h-4 w-4" />
          Buscar
        </Button>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Prestador
        </Button>
      </div>
    )
    
    setHeaderActionButton(actionButtons)
    
    return () => setHeaderActionButton(null)
  }, [setHeaderActionButton])

  // Obter estados e cidades únicos
  const estados = useMemo(() => {
    const uniqueEstados = [...new Set(prestadores.map(p => p.endereco.estado))].sort()
    return uniqueEstados
  }, [prestadores])

  const cidades = useMemo(() => {
    if (estadoFilter === 'todos') {
      return [...new Set(prestadores.map(p => p.endereco.cidade))].sort()
    }
    return [...new Set(
      prestadores
        .filter(p => p.endereco.estado === estadoFilter)
        .map(p => p.endereco.cidade)
    )].sort()
  }, [prestadores, estadoFilter])

  // Filtrar prestadores
  const filteredPrestadores = useMemo(() => {
    return prestadores.filter(prestador => {
      const matchesSearch = 
        prestador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prestador.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prestador.telefone.includes(searchTerm) ||
        (prestador.cpf && prestador.cpf.includes(searchTerm)) ||
        (prestador.cnpj && prestador.cnpj.includes(searchTerm))

      const matchesStatus = statusFilter === 'todos' || prestador.status === statusFilter
      const matchesTipoPessoa = tipoPessoaFilter === 'todos' || prestador.tipoPessoa === tipoPessoaFilter
      const matchesEstado = estadoFilter === 'todos' || prestador.endereco.estado === estadoFilter
      const matchesCidade = cidadeFilter === 'todos' || prestador.endereco.cidade === cidadeFilter

      return matchesSearch && matchesStatus && matchesTipoPessoa && matchesEstado && matchesCidade
    })
  }, [prestadores, searchTerm, statusFilter, tipoPessoaFilter, estadoFilter, cidadeFilter])

  // Calcular paginação
  const totalPages = Math.ceil(filteredPrestadores.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPrestadores = filteredPrestadores.slice(startIndex, endIndex)

  // Reset para página 1 quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, tipoPessoaFilter, estadoFilter, cidadeFilter])

  // Estatísticas
  const stats = useMemo(() => {
    return {
      total: prestadores.length,
      ativos: prestadores.filter(p => p.status === 'ativo').length,
      pendentes: prestadores.filter(p => p.status === 'pendente').length,
      bloqueados: prestadores.filter(p => p.status === 'bloqueado').length,
      disponiveis: prestadores.filter(p => p.disponivel).length,
    }
  }, [prestadores])

  const handleView = (prestador: Prestador) => {
    setSelectedPrestador(prestador)
    setIsViewModalOpen(true)
  }

  const handleEdit = (prestador: Prestador) => {
    setSelectedPrestador(prestador)
    setIsEditModalOpen(true)
  }

  const handleDelete = (prestador: Prestador) => {
    setSelectedPrestador(prestador)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedPrestador) {
      try {
        await prestadoresService.excluir(selectedPrestador.id)
        await carregarPrestadores()
        setIsDeleteModalOpen(false)
        setSelectedPrestador(null)
        alert('Prestador excluído com sucesso!')
      } catch (error) {
        console.error('Erro ao excluir prestador:', error)
        alert('Erro ao excluir prestador. Tente novamente.')
      }
    }
  }

  const handleCreate = () => {
    setFormData({})
    setIsCreateModalOpen(true)
  }

  const handleToggleBlock = async (prestador: Prestador) => {
    try {
      const novoStatus = prestador.status === 'bloqueado' ? 'ativo' : 'bloqueado'
      await prestadoresService.alterarStatus(prestador.id, novoStatus)
      await carregarPrestadores()
      alert(`Prestador ${novoStatus === 'bloqueado' ? 'bloqueado' : 'desbloqueado'} com sucesso!`)
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      alert('Erro ao alterar status do prestador. Tente novamente.')
    }
  }

  const handleSave = async () => {
    try {
      // Coletar dados do formulário
      const form = document.querySelector('form') as HTMLFormElement
      if (!form) {
        alert('Formulário não encontrado')
        return
      }

      const formElements = form.elements as any
      
      // Validações básicas
      if (!formElements.nome?.value || !formElements.email?.value || !formElements.telefone?.value) {
        alert('Preencha todos os campos obrigatórios')
        return
      }

      // Coletar serviços selecionados
      const servicosSelecionados: string[] = []
      const servicosCheckboxes = document.querySelectorAll('input[type="checkbox"][data-servico]')
      servicosCheckboxes.forEach((checkbox: any) => {
        if (checkbox.checked) {
          servicosSelecionados.push(checkbox.dataset.servico)
        }
      })

      if (servicosSelecionados.length === 0) {
        alert('Selecione pelo menos um serviço')
        return
      }

      const dadosPrestador: Partial<Prestador> = {
        nome: formElements.nome.value,
        tipoPessoa: formElements.tipoPessoa.value,
        email: formElements.email.value,
        telefone: formElements.telefone.value,
        celular: formElements.whatsapp?.value || formElements.telefone.value,
        endereco: {
          cep: formElements.cep.value,
          logradouro: formElements.logradouro.value,
          numero: formElements.numero.value,
          complemento: formElements.complemento?.value,
          bairro: formElements.bairro.value,
          cidade: formElements.cidade.value,
          estado: formElements.estado.value,
        },
        servicos: servicosSelecionados,
        raioAtuacao: parseInt(formElements.raioAtuacao?.value || '50'),
        status: formElements.status?.value || 'ativo',
        observacoes: formElements.observacoes?.value,
        dadosBancarios: {
          pix: formElements.pix?.value,
          banco: '',
          agencia: '',
          conta: '',
          tipoConta: 'corrente',
        },
        documentos: [],
      }

      // Adicionar CPF ou CNPJ
      if (dadosPrestador.tipoPessoa === 'fisica') {
        dadosPrestador.cpf = formElements.cpfCnpj.value
      } else {
        dadosPrestador.cnpj = formElements.cpfCnpj.value
        dadosPrestador.razaoSocial = formElements.razaoSocial?.value
      }

      if (isEditModalOpen && selectedPrestador) {
        // Atualizar
        await prestadoresService.atualizar(selectedPrestador.id, dadosPrestador)
        alert('Prestador atualizado com sucesso!')
      } else {
        // Criar
        await prestadoresService.criar(dadosPrestador)
        alert('Prestador criado com sucesso!')
      }

      await carregarPrestadores()
      setIsCreateModalOpen(false)
      setIsEditModalOpen(false)
      setSelectedPrestador(null)
    } catch (error: any) {
      console.error('Erro ao salvar prestador:', error)
      alert(error.message || 'Erro ao salvar prestador. Tente novamente.')
    }
  }

  const getStatusBadge = (status: Prestador['status']) => {
    const variants = {
      ativo: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inativo: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
      pendente: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      bloqueado: { color: 'bg-red-100 text-red-800', icon: Ban },
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

  const getServicosNomes = (servicosIds: string[]) => {
    return servicosIds
      .map(id => tiposServico.find(s => s.id === id)?.nome)
      .filter(Boolean)
      .join(', ')
  }

  // Mapear ícones dos serviços
  const getServicoIcon = (iconeName: string | undefined) => {
    if (!iconeName) return Circle
    
    const icons: Record<string, any> = {
      Truck,
      Wrench,
      Zap,
      Circle,
      Key,
      Fuel
    }
    return icons[iconeName] || Circle
  }

  return (
    <div className="flex h-full flex-col">
      {/* Stats */}
      <div className="border-b bg-white px-8 py-6">
        <div className="grid grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-500">Total</div>
            <div className="mt-1 text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Ativos</div>
            <div className="mt-1 text-2xl font-bold text-green-600">{stats.ativos}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Pendentes</div>
            <div className="mt-1 text-2xl font-bold text-yellow-600">{stats.pendentes}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Bloqueados</div>
            <div className="mt-1 text-2xl font-bold text-red-600">{stats.bloqueados}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Disponíveis</div>
            <div className="mt-1 text-2xl font-bold text-blue-600">{stats.disponiveis}</div>
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
              <option value="pendente">Pendentes</option>
              <option value="bloqueado">Bloqueados</option>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Prestador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Serviços
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
                {paginatedPrestadores.map((prestador) => (
                  <tr key={prestador.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {prestador.tipoPessoa === 'fisica' ? (
                            <UserCheck className="h-5 w-5" />
                          ) : (
                            <Building2 className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{prestador.nome}</div>
                          <div className="text-sm text-gray-500">
                            {prestador.tipoPessoa === 'fisica' ? prestador.cpf : prestador.cnpj}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">
                        {prestador.tipoPessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-3 w-3" />
                          {prestador.telefone}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-3 w-3" />
                          {prestador.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate text-sm text-gray-600">
                        {getServicosNomes(prestador.servicos)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(prestador.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {prestador.status === 'bloqueado' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleBlock(prestador)}
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                            title="Desbloquear prestador"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleBlock(prestador)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            title="Bloquear prestador"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(prestador)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(prestador)}
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

            {filteredPrestadores.length === 0 && (
              <div className="py-12 text-center">
                <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Nenhum prestador encontrado
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tente ajustar os filtros ou adicione um novo prestador.
                </p>
              </div>
            )}
          </div>

          {/* Paginação */}
          {filteredPrestadores.length > 0 && (
            <div className="flex items-center justify-between border-t bg-white px-6 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredPrestadores.length)} de {filteredPrestadores.length} prestadores
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
            <DialogTitle>Detalhes do Prestador</DialogTitle>
            <DialogDescription>
              Informações completas do prestador
            </DialogDescription>
          </DialogHeader>
          
          {selectedPrestador && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div>
                <h3 className="mb-3 font-semibold">Informações Básicas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Nome</label>
                    <p className="font-medium">{selectedPrestador.nome}</p>
                  </div>
                  {selectedPrestador.razaoSocial && (
                    <div>
                      <label className="text-sm text-gray-500">Razão Social</label>
                      <p className="font-medium">{selectedPrestador.razaoSocial}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-500">Tipo</label>
                    <p className="font-medium">
                      {selectedPrestador.tipoPessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      {selectedPrestador.tipoPessoa === 'fisica' ? 'CPF' : 'CNPJ'}
                    </label>
                    <p className="font-medium">
                      {selectedPrestador.tipoPessoa === 'fisica' ? selectedPrestador.cpf : selectedPrestador.cnpj}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{selectedPrestador.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Telefone</label>
                    <p className="font-medium">{selectedPrestador.telefone}</p>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="mb-3 font-semibold">Endereço</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">CEP</label>
                    <p className="font-medium">{selectedPrestador.endereco.cep}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Logradouro</label>
                    <p className="font-medium">{selectedPrestador.endereco.logradouro}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Número</label>
                    <p className="font-medium">{selectedPrestador.endereco.numero}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Bairro</label>
                    <p className="font-medium">{selectedPrestador.endereco.bairro}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Cidade</label>
                    <p className="font-medium">{selectedPrestador.endereco.cidade}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Estado</label>
                    <p className="font-medium">{selectedPrestador.endereco.estado}</p>
                  </div>
                </div>
              </div>

              {/* Serviços */}
              <div>
                <h3 className="mb-3 font-semibold">Serviços</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPrestador.servicos.map(servicoId => {
                    const servico = tiposServico.find(s => s.id === servicoId)
                    return servico ? (
                      <Badge key={servicoId} variant="outline">
                        {servico.nome}
                      </Badge>
                    ) : null
                  })}
                </div>
                <div className="mt-3">
                  <label className="text-sm text-gray-500">Raio de Atuação</label>
                  <p className="font-medium">{selectedPrestador.raioAtuacao} km</p>
                </div>
              </div>

              {/* Status e Avaliação */}
              <div>
                <h3 className="mb-3 font-semibold">Status e Avaliação</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedPrestador.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Disponível</label>
                    <p className="font-medium">{selectedPrestador.disponivel ? 'Sim' : 'Não'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Avaliação Média</label>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedPrestador.avaliacaoMedia.toFixed(1)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Total de Atendimentos</label>
                    <p className="font-medium">{selectedPrestador.totalAtendimentos}</p>
                  </div>
                </div>
              </div>

              {/* Observações */}
              {selectedPrestador.observacoes && (
                <div>
                  <h3 className="mb-3 font-semibold">Observações</h3>
                  <p className="text-sm text-gray-600">{selectedPrestador.observacoes}</p>
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
              if (selectedPrestador) handleEdit(selectedPrestador)
            }}>
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o prestador <strong>{selectedPrestador?.nome}</strong>?
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

      {/* Search Modal - Google Maps */}
      <Dialog open={isSearchModalOpen} onOpenChange={(open) => {
        setIsSearchModalOpen(open)
        if (!open) {
          setSearchQuery('')
          setSearchResults([])
          setSearchError('')
        }
      }}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 gap-0">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5 rounded-t-lg">
            <DialogTitle className="text-center text-white text-xl font-semibold">
              🔍 Buscar Prestadores Próximos
            </DialogTitle>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Campo de Busca - Design melhorado */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                📍 Localização
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Ex: São Paulo, SP ou Av. Paulista, 1000"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleGoogleMapsSearch()
                      }
                    }}
                    className="pl-10 h-11 bg-white border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </div>
                {searchType === 'proximo' && (
                  <div className="relative w-28">
                    <Input
                      type="number"
                      min="1"
                      max="200"
                      value={searchRadius}
                      onChange={(e) => setSearchRadius(Number(e.target.value))}
                      className="pr-10 text-center h-11 bg-white border-gray-300"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 pointer-events-none">
                      km
                    </span>
                  </div>
                )}
                <Button
                  onClick={handleGoogleMapsSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="h-11 px-6 bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  {isSearching ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-gray-400"></span>
                Busque prestadores digitando endereço, CEP ou cidade
              </p>
            </div>

            {/* Erro - Design melhorado */}
            {searchError && (
              <div className="rounded-lg bg-red-50 border-l-4 border-red-500 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-800">Erro na busca</h4>
                    <p className="text-sm text-red-700 mt-1">{searchError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Resultados - Design melhorado */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                {/* Header dos resultados */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {searchResults.length} {searchResults.length === 1 ? 'Prestador Encontrado' : 'Prestadores Encontrados'}
                      </h3>
                      <p className="text-xs text-gray-500">Resultados da busca</p>
                    </div>
                  </div>
                </div>

                {/* Lista de resultados */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((prestador, index) => (
                    <Card
                      key={prestador.placeId}
                      className="p-5 hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary bg-gradient-to-r from-white to-gray-50/30"
                    >
                      <div className="space-y-4">
                        {/* Cabeçalho do card */}
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                            <Truck className="h-4 w-4" />
                          </div>
                          <h4 className="font-semibold text-gray-900 text-base truncate">
                            {prestador.nome}
                          </h4>
                        </div>

                        {/* Endereço completo */}
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {prestador.endereco}
                          </p>
                        </div>

                        {/* Informações de contato */}
                        {prestador.telefone && (
                          <div className="flex flex-wrap gap-3">
                            <a
                              href={`tel:${prestador.telefone}`}
                              className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg border border-green-200 transition-colors text-sm font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone className="h-4 w-4" />
                              {prestador.telefone}
                            </a>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Estado vazio - Design melhorado */}
            {!isSearching && searchResults.length === 0 && !searchError && (
              <div className="text-center py-16">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 mb-4">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Pronto para buscar?
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Digite uma cidade ou endereço no campo acima e clique em <strong>Buscar</strong> para encontrar prestadores de reboque e guincho na região
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-6 py-4 rounded-b-lg">
            <div className="flex items-center justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsSearchModalOpen(false)
                  setSearchQuery('')
                  setSearchResults([])
                  setSearchError('')
                }}
                className="hover:bg-gray-100"
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
