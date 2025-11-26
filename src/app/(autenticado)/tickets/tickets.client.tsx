'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/componentes/ui/card'
import { Button } from '@/componentes/ui/button'
import {
  Clock,
  MapPin,
  User,
  Phone,
  Car,
  CheckCircle,
  PlayCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Users,
  Archive,
  X,
  Loader2,
  Copy,
  Check,
  Navigation,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ModalSelecaoPrestadores } from '@/componentes/tickets/ModalSelecaoPrestadores'
import { ModalRastreamento } from '@/componentes/tickets/ModalRastreamento'
import { ModalDetalhesChamado } from '@/componentes/tickets/ModalDetalhesChamado'
import { ticketsService } from '@/lib/services/tickets.service'

interface Chamado {
  id: string
  protocolo: string
  clienteNome: string
  clienteTelefone: string
  veiculoPlaca: string
  veiculoMarca?: string
  veiculoModelo?: string
  veiculoCor?: string
  tipoServico: string
  prioridade: 'critica' | 'alta' | 'media'
  status: 'aguardando' | 'em_execucao' | 'finalizado' | 'arquivado'
  origemEndereco: string
  origemCidade: string
  origemLatitude?: number
  origemLongitude?: number
  destinoEndereco?: string
  destinoCidade?: string
  destinoLatitude?: number
  destinoLongitude?: number
  distanciaKm?: number
  tempoPrevisto?: string
  prestadorNome?: string
  prestadorTelefone?: string
  dataCriacao: string
  dataInicio?: string
  dataFinalizacao?: string
  descricaoProblema: string
}


export function TicketsClient() {
  const router = useRouter()
  const [busca, setBusca] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [buscaFinalizados, setBuscaFinalizados] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [modalPrestadoresAberto, setModalPrestadoresAberto] = useState(false)
  const [modalRastreamentoAberto, setModalRastreamentoAberto] = useState(false)
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false)
  const [chamadoSelecionado, setChamadoSelecionado] = useState<Chamado | null>(null)
  const [chamadoRastreamento, setChamadoRastreamento] = useState<Chamado | null>(null)
  const [chamadoDetalhes, setChamadoDetalhes] = useState<Chamado | null>(null)
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [carregando, setCarregando] = useState(true)
  const [linkCopiado, setLinkCopiado] = useState<string | null>(null)
  const scrollPositionRef = useRef<number>(0)

  // Carregar chamados do banco de dados
  useEffect(() => {
    const carregarChamados = async () => {
      try {
        setCarregando(true)
        
        const tickets = await ticketsService.listar()
        
        // Transformar dados do banco para o formato do componente
        const chamadosFormatados = tickets.map((ticket: any) => ({
          id: ticket.id,
          protocolo: ticket.protocolo,
          clienteNome: ticket.cliente?.nome || 'Cliente não informado',
          clienteTelefone: ticket.cliente?.telefone || '',
          veiculoPlaca: ticket.veiculo?.placa || 'Não informado',
          veiculoMarca: ticket.veiculo?.marca,
          veiculoModelo: ticket.veiculo?.modelo,
          veiculoCor: ticket.veiculo?.cor,
          tipoServico: ticket.tipoServico,
          prioridade: ticket.prioridade,
          status: ticket.status,
          origemCep: ticket.origemCep,
          origemEndereco: ticket.origemEndereco,
          origemCidade: ticket.origemCidade,
          origemLatitude: ticket.origemLatitude,
          origemLongitude: ticket.origemLongitude,
          destinoCep: ticket.destinoCep,
          destinoEndereco: ticket.destinoEndereco,
          destinoCidade: ticket.destinoCidade,
          destinoLatitude: ticket.destinoLatitude,
          destinoLongitude: ticket.destinoLongitude,
          distanciaKm: ticket.distanciaKm,
          prestadorNome: ticket.prestador?.nome,
          prestadorTelefone: ticket.prestador?.telefone,
          prestadorCpfCnpj: ticket.prestador?.cpfCnpj,
          prestadorPix: ticket.prestador?.chavePix,
          valorCotado: ticket.valorCotado,
          valorFinal: ticket.valorFinal,
          dataCriacao: ticket.dataAbertura,
          dataInicio: ticket.dataInicio,
          dataFinalizacao: ticket.dataConclusao,
          descricaoProblema: ticket.descricaoProblema,
          observacoes: ticket.observacoes,
          fotoConclusao: ticket.fotoConclusao,
          conclusaoCep: ticket.conclusaoCep,
          conclusaoEndereco: ticket.conclusaoEndereco,
          conclusaoCidade: ticket.conclusaoCidade,
          conclusaoLatitude: ticket.conclusaoLatitude,
          conclusaoLongitude: ticket.conclusaoLongitude,
          comprovantePagamento: ticket.comprovantePagamento,
        }))
        
        setChamados(chamadosFormatados)
      } catch (error) {
        console.error('Erro ao carregar tickets:', error)
      } finally {
        setCarregando(false)
      }
    }

    carregarChamados()
  }, [])

  // Scroll automático para seção aguardando quando vindo de criação de chamado
  useEffect(() => {
    if (window.location.hash === '#aguardando') {
      setTimeout(() => {
        const element = document.getElementById('aguardando')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [])

  const negarServico = async (chamadoId: string) => {
    try {
      // Buscar o prestador NEGADO
      const response = await fetch('/api/prestadores?email=negado@sistema.interno')
      const data = await response.json()
      
      let prestadorNegadoId = null
      if (data.success && data.data.length > 0) {
        prestadorNegadoId = data.data[0].id
      }
      
      // Atualizar no banco de dados
      await ticketsService.atualizar(chamadoId, {
        status: 'finalizado',
        dataConclusao: new Date().toISOString(),
        prestadorId: prestadorNegadoId,
      })
      
      // Atualizar estado local imediatamente para feedback visual
      setChamados(prevChamados =>
        prevChamados.map(chamado =>
          chamado.id === chamadoId
            ? { 
                ...chamado, 
                status: 'finalizado' as const, 
                dataFinalizacao: new Date().toISOString(),
                prestadorNome: 'NEGADO',
                prestadorTelefone: undefined
              }
            : chamado
        )
      )
    } catch (error) {
      console.error('Erro ao negar serviço:', error)
      alert('Erro ao negar serviço. Tente novamente.')
    }
  }

  const executarChamado = async (chamadoId: string) => {
    try {
      // Atualizar no banco de dados
      await ticketsService.atualizar(chamadoId, {
        status: 'aguardando',
      })
      
      // Atualizar estado local imediatamente para feedback visual
      setChamados(prevChamados =>
        prevChamados.map(chamado =>
          chamado.id === chamadoId
            ? { ...chamado, status: 'aguardando' as const }
            : chamado
        )
      )
    } catch (error) {
      console.error('Erro ao executar chamado:', error)
      alert('Erro ao executar chamado. Tente novamente.')
    }
  }

  const chamadosAguardando = chamados.filter((c) => c.status === 'aguardando')
  const chamadosEmExecucao = chamados.filter((c) => c.status === 'em_execucao')
  const chamadosArquivados = chamados.filter((c) => c.status === 'arquivado')
  
  // Filtrar finalizados com busca e data
  let chamadosFinalizados = chamados.filter((c) => c.status === 'finalizado')
  
  // Aplicar busca
  if (buscaFinalizados) {
    chamadosFinalizados = chamadosFinalizados.filter((c) =>
      c.protocolo.toLowerCase().includes(buscaFinalizados.toLowerCase()) ||
      c.clienteNome.toLowerCase().includes(buscaFinalizados.toLowerCase()) ||
      c.veiculoPlaca.toLowerCase().includes(buscaFinalizados.toLowerCase())
    )
  }
  
  // Aplicar filtro de data
  if (dataInicio) {
    chamadosFinalizados = chamadosFinalizados.filter((c) => 
      new Date(c.dataFinalizacao || c.dataCriacao) >= new Date(dataInicio)
    )
  }
  if (dataFim) {
    chamadosFinalizados = chamadosFinalizados.filter((c) => 
      new Date(c.dataFinalizacao || c.dataCriacao) <= new Date(dataFim)
    )
  }
  
  // Ordenar por data de finalização (mais recente primeiro) e limitar a 20
  const chamadosFinalizadosLimitados = chamadosFinalizados
    .sort((a, b) => {
      const dateA = new Date(a.dataFinalizacao || a.dataCriacao).getTime()
      const dateB = new Date(b.dataFinalizacao || b.dataCriacao).getTime()
      return dateB - dateA
    })
    .slice(0, 20)

  const tiposServico: Record<string, { label: string; icon: string }> = {
    reboque: { label: 'Reboque', icon: '🚛' },
    pneu: { label: 'Troca de Pneu', icon: '🔧' },
    bateria: { label: 'Pane Elétrica', icon: '🔋' },
    combustivel: { label: 'Combustível', icon: '⛽' },
    chaveiro: { label: 'Chaveiro', icon: '🔑' },
    mecanica: { label: 'Pane Mecânica', icon: '⚙️' },
  }

  const prioridadeConfig = {
    critica: { label: 'Crítica', color: 'bg-red-100 text-red-700 border-red-200', icon: '🔴' },
    alta: { label: 'Alta', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '🟠' },
    media: { label: 'Média', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '🟡' },
  }

  const abrirModalPrestadores = (chamado: Chamado) => {
    setChamadoSelecionado(chamado)
    setModalPrestadoresAberto(true)
  }

  const fecharModalPrestadores = () => {
    setModalPrestadoresAberto(false)
    setChamadoSelecionado(null)
  }

  const abrirModalRastreamento = (chamado: Chamado) => {
    setChamadoRastreamento(chamado)
    setModalRastreamentoAberto(true)
  }

  const fecharModalRastreamento = () => {
    setModalRastreamentoAberto(false)
    setChamadoRastreamento(null)
  }

  const abrirModalDetalhes = (chamado: Chamado) => {
    setChamadoDetalhes(chamado)
    setModalDetalhesAberto(true)
  }

  const fecharModalDetalhes = () => {
    setModalDetalhesAberto(false)
    setChamadoDetalhes(null)
  }

  const copiarLinkPrestador = async (protocolo: string) => {
    const link = `${window.location.origin}/corrida/${protocolo}`
    try {
      await navigator.clipboard.writeText(link)
      setLinkCopiado(protocolo)
      setTimeout(() => setLinkCopiado(null), 2000)
    } catch (error) {
      console.error('Erro ao copiar link:', error)
    }
  }

  const renderChamadoCard = (chamado: Chamado) => {
    const tipoInfo = tiposServico[chamado.tipoServico]
    const prioridadeInfo = prioridadeConfig[chamado.prioridade]

    return (
      <Card key={chamado.id} className="p-6 hover:shadow-lg transition-shadow">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{tipoInfo.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{tipoInfo.label}</h3>
                  <p 
                    className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer hover:underline transition-colors"
                    onClick={() => abrirModalDetalhes(chamado)}
                  >
                    Protocolo: {chamado.protocolo}
                  </p>
                </div>
              </div>
            </div>
            <span
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-semibold',
                prioridadeInfo.color
              )}
            >
              {prioridadeInfo.icon} {prioridadeInfo.label}
            </span>
          </div>

          {/* Cliente e Veículo */}
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-gray-400" />
            <span className="font-medium text-gray-700">{chamado.clienteNome}</span>
          </div>

          {/* Localização */}
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">{chamado.origemEndereco}</div>
                </div>
              </div>
              {chamado.destinoEndereco && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">{chamado.destinoEndereco}</div>
                  </div>
                </div>
              )}
              {chamado.tempoPrevisto && (
                <div className="text-xs text-gray-500 mt-1 ml-6">
                  ⏱️ {chamado.tempoPrevisto}
                </div>
              )}
            </div>
          </div>

          {/* Descrição */}
          {chamado.descricaoProblema && chamado.descricaoProblema !== 'asd' && (
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-700">Problema:</p>
              <p>{chamado.descricaoProblema}</p>
            </div>
          )}

          {/* Footer com horários - sempre na mesma posição */}
          <div className="border-t pt-3 mt-4">
            {/* Prestador (se houver) - dentro do footer */}
            {chamado.prestadorNome && (
              <div className="rounded-lg bg-blue-50 p-3 mb-3">
                <p className="text-xs font-medium text-blue-900 mb-2">
                  Prestador Designado: <span className="text-blue-700">{chamado.prestadorNome}</span> ({chamado.prestadorTelefone})
                </p>
                {/* Botões - Apenas para chamados em execução */}
                {chamado.status === 'em_execucao' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => abrirModalRastreamento(chamado)}
                      className="gap-2 border-blue-300 hover:bg-blue-100"
                    >
                      <PlayCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-600">Em tempo real</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copiarLinkPrestador(chamado.protocolo)}
                      className="gap-2 border-blue-300 hover:bg-blue-100"
                    >
                      {linkCopiado === chamado.protocolo ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-600">Link Prestador</span>
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Criado: {new Date(chamado.dataCriacao).toLocaleString('pt-BR')}
              </div>
              {chamado.status === 'finalizado' && chamado.dataFinalizacao && (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  Finalizado: {new Date(chamado.dataFinalizacao).toLocaleTimeString('pt-BR')}
                </span>
              )}
            </div>
            {chamado.status === 'aguardando' && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => negarServico(chamado.id)}
                  className="flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Negar Serviço
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 flex items-center justify-center gap-2" 
                  onClick={() => abrirModalPrestadores(chamado)}
                >
                  <Users className="h-4 w-4" />
                  Buscar Prestadores
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8" style={{ paddingTop: '15px' }}>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Estatísticas Rápidas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{chamadosAguardando.length}</p>
                <p className="text-sm text-gray-600">Aguardando Prestador</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <PlayCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{chamadosEmExecucao.length}</p>
                <p className="text-sm text-gray-600">Em Execução</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{chamadosFinalizados.length}</p>
                <p className="text-sm text-gray-600">Finalizados</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Archive className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{chamadosArquivados.length}</p>
                <p className="text-sm text-gray-600">Arquivados</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Seção 1: Aguardando Prestador */}
        <div id="aguardando">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Aguardando Prestador ({chamadosAguardando.length})
              </h2>
            </div>
            <Button
              onClick={() => {
                // Limpa todas as cotações do localStorage
                chamadosAguardando.forEach((chamado) => {
                  localStorage.removeItem(`cotacoes_${chamado.id}`)
                })
                alert('Cotações resetadas! Recarregue a página.')
                window.location.reload()
              }}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              🔄 Resetar Cotações (DEV)
            </Button>
          </div>
          {chamadosAguardando.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Nenhum chamado aguardando prestador</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {chamadosAguardando.map(renderChamadoCard)}
            </div>
          )}
        </div>

        {/* Seção 2: Em Execução */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Em Execução ({chamadosEmExecucao.length})
            </h2>
          </div>
          {chamadosEmExecucao.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Nenhum chamado em execução</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {chamadosEmExecucao.map(renderChamadoCard)}
            </div>
          )}
        </div>

        {/* Seção 3: Chamados Arquivados */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Archive className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Chamados Arquivados ({chamadosArquivados.length})
            </h2>
          </div>
          {chamadosArquivados.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Nenhum chamado arquivado</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {chamadosArquivados.map((chamado) => {
                const tipoInfo = tiposServico[chamado.tipoServico]
                const prioridadeInfo = prioridadeConfig[chamado.prioridade]

                return (
                  <Card key={chamado.id} className="p-6 hover:shadow-lg transition-shadow bg-gray-50">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl opacity-60">{tipoInfo.icon}</span>
                            <div>
                              <h3 className="font-semibold text-gray-900">{tipoInfo.label}</h3>
                              <p className="text-sm text-gray-500">Protocolo: {chamado.protocolo}</p>
                            </div>
                          </div>
                        </div>
                        <span
                          className={cn(
                            'rounded-full border px-3 py-1 text-xs font-semibold',
                            prioridadeInfo.color
                          )}
                        >
                          {prioridadeInfo.icon} {prioridadeInfo.label}
                        </span>
                      </div>

                      {/* Cliente e Veículo */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-700">{chamado.clienteNome}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{chamado.clienteTelefone}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Car className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-700">{chamado.veiculoPlaca}</span>
                          </div>
                          {chamado.veiculoMarca && (
                            <div className="text-sm text-gray-600">
                              {chamado.veiculoMarca} {chamado.veiculoModelo} - {chamado.veiculoCor}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Localização */}
                      <div className="rounded-lg bg-white p-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">{chamado.origemEndereco}</span>
                              {chamado.destinoEndereco && (
                                <>
                                  <span className="text-gray-400 mx-2">→</span>
                                  <span className="text-gray-600">{chamado.destinoEndereco}</span>
                                </>
                              )}
                            </div>
                            {chamado.tempoPrevisto && (
                              <div className="text-xs text-gray-500 mt-1">
                                ⏱️ {chamado.tempoPrevisto}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Descrição */}
                      <div className="text-sm text-gray-600">
                        <p className="font-medium text-gray-700">Motivo do Arquivamento:</p>
                        <p>{chamado.descricaoProblema}</p>
                      </div>

                      {/* Footer com botões */}
                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Arquivado: {new Date(chamado.dataCriacao).toLocaleString('pt-BR')}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => negarServico(chamado.id)}
                            className="flex items-center gap-1"
                          >
                            <X className="h-3 w-3" />
                            Negar Serviço
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 flex items-center justify-center gap-2"
                            onClick={() => executarChamado(chamado.id)}
                          >
                            <PlayCircle className="h-3 w-3" />
                            Executar Agora
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Seção 4: Finalizados - Tabela Compacta */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Finalizados ({chamadosFinalizados.length})
            </h2>
          </div>

          <Card className="overflow-hidden">
            {/* Filtros para Finalizados */}
            <div className="border-b bg-gray-50 p-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar protocolo, cliente, placa..."
                    value={buscaFinalizados}
                    onChange={(e) => setBuscaFinalizados(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    placeholder="Data início"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    placeholder="Data fim"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Mostrando últimos 20 chamados finalizados {buscaFinalizados || dataInicio || dataFim ? '(filtrados)' : ''}
              </div>
            </div>

            {/* Tabela */}
            {chamadosFinalizadosLimitados.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">Nenhum chamado finalizado encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Protocolo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Serviço
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Cliente
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Veículo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Prestador
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Finalizado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {chamadosFinalizadosLimitados.map((chamado) => {
                      const tipoInfo = tiposServico[chamado.tipoServico]
                      return (
                        <tr key={chamado.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-4 py-3">
                            <div 
                              className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer hover:underline transition-colors"
                              onClick={() => abrirModalDetalhes(chamado)}
                            >
                              {chamado.protocolo}
                            </div>
                            <div className="text-xs text-gray-500">{chamado.origemCidade}</div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{tipoInfo.icon}</span>
                              <span className="text-sm text-gray-900">{tipoInfo.label}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">{chamado.clienteNome}</div>
                            <div className="text-xs text-gray-500">{chamado.clienteTelefone}</div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">{chamado.veiculoPlaca}</div>
                            {chamado.veiculoMarca && (
                              <div className="text-xs text-gray-500">
                                {chamado.veiculoMarca} {chamado.veiculoModelo}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {chamado.prestadorNome === 'NEGADO' ? (
                              <div className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 border border-red-200">
                                <X className="h-3 w-3 text-red-600" />
                                <span className="text-sm font-semibold text-red-700">NEGADO</span>
                              </div>
                            ) : (
                              <>
                                <div className="text-sm text-gray-900">{chamado.prestadorNome}</div>
                                <div className="text-xs text-gray-500">{chamado.prestadorTelefone}</div>
                              </>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="flex items-center gap-1 text-sm text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              {chamado.dataFinalizacao && (
                                <span>{new Date(chamado.dataFinalizacao).toLocaleString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Modal de Seleção de Prestadores */}
      {chamadoSelecionado && (
        <ModalSelecaoPrestadores
          isOpen={modalPrestadoresAberto}
          onClose={fecharModalPrestadores}
          chamado={{
            id: chamadoSelecionado.id,
            protocolo: chamadoSelecionado.protocolo,
            tipoServico: chamadoSelecionado.tipoServico,
            prioridade: chamadoSelecionado.prioridade,
            origemCidade: `${chamadoSelecionado.origemEndereco}, ${chamadoSelecionado.origemCidade}`,
            destinoCidade: chamadoSelecionado.destinoEndereco 
              ? `${chamadoSelecionado.destinoEndereco}, ${chamadoSelecionado.destinoCidade}`
              : undefined,
            distanciaKm: chamadoSelecionado.distanciaKm,
            clienteNome: chamadoSelecionado.clienteNome,
            clienteTelefone: chamadoSelecionado.clienteTelefone,
            veiculoPlaca: chamadoSelecionado.veiculoPlaca,
            veiculoMarca: chamadoSelecionado.veiculoMarca,
            veiculoModelo: chamadoSelecionado.veiculoModelo,
            descricaoProblema: chamadoSelecionado.descricaoProblema,
            origemCoordenadas: chamadoSelecionado.origemLatitude && chamadoSelecionado.origemLongitude
              ? { lat: chamadoSelecionado.origemLatitude, lng: chamadoSelecionado.origemLongitude }
              : undefined,
            destinoCoordenadas: chamadoSelecionado.destinoLatitude && chamadoSelecionado.destinoLongitude
              ? { lat: chamadoSelecionado.destinoLatitude, lng: chamadoSelecionado.destinoLongitude }
              : undefined,
          }}
        />
      )}

      {/* Modal de Rastreamento */}
      {chamadoRastreamento && (
        <ModalRastreamento
          isOpen={modalRastreamentoAberto}
          onClose={fecharModalRastreamento}
          chamado={{
            protocolo: chamadoRastreamento.protocolo,
            clienteNome: chamadoRastreamento.clienteNome,
            clienteTelefone: chamadoRastreamento.clienteTelefone,
            veiculoPlaca: chamadoRastreamento.veiculoPlaca,
            prestadorNome: chamadoRastreamento.prestadorNome || '',
            prestadorTelefone: chamadoRastreamento.prestadorTelefone || '',
            origemEndereco: chamadoRastreamento.origemEndereco,
            origemCidade: chamadoRastreamento.origemCidade,
            origemLatitude: chamadoRastreamento.origemLatitude,
            origemLongitude: chamadoRastreamento.origemLongitude,
            destinoEndereco: chamadoRastreamento.destinoEndereco,
            destinoCidade: chamadoRastreamento.destinoCidade,
            destinoLatitude: chamadoRastreamento.destinoLatitude,
            destinoLongitude: chamadoRastreamento.destinoLongitude,
            tipoServico: chamadoRastreamento.tipoServico,
            status: chamadoRastreamento.status,
          }}
        />
      )}

      {/* Modal de Detalhes do Chamado */}
      {chamadoDetalhes && (
        <ModalDetalhesChamado
          isOpen={modalDetalhesAberto}
          onClose={fecharModalDetalhes}
          chamado={chamadoDetalhes}
        />
      )}
    </div>
  )
}
