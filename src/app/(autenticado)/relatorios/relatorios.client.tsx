'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/componentes/ui/card'
import { Button } from '@/componentes/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  FileText,
  DollarSign,
  Users,
  Ticket,
  AlertCircle
} from 'lucide-react'

type AbaRelatorio = 'visao_geral' | 'tickets' | 'prestadores' | 'financeiro'
type TipoPeriodo = 'hoje' | 'ontem' | '7dias' | '30dias' | 'mes_atual' | 'mes_passado'

export function RelatoriosClient() {
  const [abaAtiva, setAbaAtiva] = useState<AbaRelatorio>('visao_geral')
  const [periodoSelecionado, setPeriodoSelecionado] = useState<TipoPeriodo>('30dias')
  const [compararPeriodo, setCompararPeriodo] = useState(true)
  const [carregando, setCarregando] = useState(false)
  const [dados, setDados] = useState<any>(null)
  const [erro, setErro] = useState<string | null>(null)

  // Filtros
  const [filtrosTiposServico, setFiltrosTiposServico] = useState<string[]>([])
  const [filtrosStatus, setFiltrosStatus] = useState<string[]>([])
  const [filtrosCidades, setFiltrosCidades] = useState<string[]>([])

  // Carregar dados
  useEffect(() => {
    carregarDados()
  }, [abaAtiva, periodoSelecionado, compararPeriodo, filtrosTiposServico, filtrosStatus, filtrosCidades])

  async function carregarDados() {
    setCarregando(true)
    setErro(null)

    try {
      let url = ''
      const params = new URLSearchParams({
        periodo: periodoSelecionado,
        comparar: compararPeriodo.toString()
      })

      if (filtrosTiposServico.length > 0) {
        params.append('tiposServico', filtrosTiposServico.join(','))
      }
      if (filtrosStatus.length > 0) {
        params.append('status', filtrosStatus.join(','))
      }
      if (filtrosCidades.length > 0) {
        params.append('cidades', filtrosCidades.join(','))
      }

      switch (abaAtiva) {
        case 'visao_geral':
          url = `/api/relatorios?${params}`
          break
        case 'tickets':
          url = `/api/relatorios/tickets?${params}`
          break
        case 'prestadores':
          url = `/api/relatorios/prestadores?${params}`
          break
        case 'financeiro':
          url = `/api/relatorios/financeiro?${params}`
          break
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Erro ao carregar relatório')
      }

      const data = await response.json()
      setDados(data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setErro('Erro ao carregar relatório. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  function limparFiltros() {
    setFiltrosTiposServico([])
    setFiltrosStatus([])
    setFiltrosCidades([])
  }

  async function exportarPDF() {
    if (!dados) {
      alert('Nenhum dado disponível para exportar')
      return
    }

    try {
      // Criar conteúdo HTML para o PDF
      const conteudoHTML = gerarConteudoHTML(dados, abaAtiva, periodoSelecionado)
      
      // Abrir em nova janela para impressão
      const janelaImpressao = window.open('', '_blank')
      if (janelaImpressao) {
        janelaImpressao.document.write(conteudoHTML)
        janelaImpressao.document.close()
        janelaImpressao.focus()
        
        // Aguardar carregamento e imprimir
        setTimeout(() => {
          janelaImpressao.print()
        }, 250)
      }
    } catch (error) {
      console.error('Erro ao exportar PDF:', error)
      alert('Erro ao exportar PDF. Tente novamente.')
    }
  }

  async function exportarExcel() {
    if (!dados) {
      alert('Nenhum dado disponível para exportar')
      return
    }

    try {
      let csvContent = ''
      const dataAtual = new Date().toLocaleDateString('pt-BR')
      
      // Gerar CSV baseado na aba ativa
      switch (abaAtiva) {
        case 'tickets':
          csvContent = gerarCSVTickets(dados)
          break
        case 'prestadores':
          csvContent = gerarCSVPrestadores(dados)
          break
        case 'financeiro':
          csvContent = gerarCSVFinanceiro(dados)
          break
        default:
          csvContent = gerarCSVVisaoGeral(dados)
      }

      // Criar e baixar arquivo
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `relatorio_${abaAtiva}_${dataAtual.replace(/\//g, '-')}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Erro ao exportar Excel:', error)
      alert('Erro ao exportar Excel. Tente novamente.')
    }
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Abas de Navegação */}
      <div className="border-b border-gray-200">
        <div className="flex items-center gap-4 overflow-x-auto pb-px">
          <button
            onClick={() => setAbaAtiva('visao_geral')}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              abaAtiva === 'visao_geral'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Visão Geral
          </button>
          
          <button
            onClick={() => setAbaAtiva('tickets')}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              abaAtiva === 'tickets'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Ticket className="h-4 w-4" />
            Tickets
          </button>
          
          <button
            onClick={() => setAbaAtiva('prestadores')}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              abaAtiva === 'prestadores'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="h-4 w-4" />
            Prestadores
          </button>
          
          <button
            onClick={() => setAbaAtiva('financeiro')}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              abaAtiva === 'financeiro'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            Financeiro
          </button>
        </div>
      </div>

      {/* Layout com Conteúdo e Sidebar */}
      <div className={`grid grid-cols-1 gap-6 ${abaAtiva === 'visao_geral' ? '' : 'lg:grid-cols-4'}`}>
        {/* Conteúdo Principal */}
        <div className={abaAtiva === 'visao_geral' ? '' : 'lg:col-span-3'}>
          <div className="space-y-6">
          {erro && (
            <Card className="p-6 bg-red-50 border-red-200">
              <div className="flex items-center gap-3 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <p className="font-medium">{erro}</p>
              </div>
            </Card>
          )}

          {carregando ? (
            <LoadingSkeleton />
          ) : dados ? (
            <>
              {abaAtiva === 'visao_geral' && <AbaVisaoGeral dados={dados} />}
              {abaAtiva === 'tickets' && <AbaTickets dados={dados} />}
              {abaAtiva === 'prestadores' && <AbaPrestadores dados={dados} />}
              {abaAtiva === 'financeiro' && <AbaFinanceiro dados={dados} />}
            </>
          ) : null}
          </div>
        </div>

        {/* Sidebar de Controles - Não mostrar na Visão Geral */}
        {abaAtiva !== 'visao_geral' && (
          <div className="space-y-4">
            <SidebarControles 
              abaAtiva={abaAtiva}
              periodoSelecionado={periodoSelecionado}
              setPeriodoSelecionado={setPeriodoSelecionado}
              compararPeriodo={compararPeriodo}
              setCompararPeriodo={setCompararPeriodo}
              filtrosTiposServico={filtrosTiposServico}
              setFiltrosTiposServico={setFiltrosTiposServico}
              filtrosStatus={filtrosStatus}
              setFiltrosStatus={setFiltrosStatus}
              filtrosCidades={filtrosCidades}
              setFiltrosCidades={setFiltrosCidades}
              limparFiltros={limparFiltros}
              carregarDados={carregarDados}
              exportarPDF={exportarPDF}
              exportarExcel={exportarExcel}
              carregando={carregando}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Componente de Métrica
function MetricaCard({ 
  titulo, 
  valor, 
  variacao, 
  icone,
  destaque
}: { 
  titulo: string
  valor: string | number
  variacao?: number
  icone?: React.ReactNode
  destaque?: string
}) {
  const positivo = variacao !== undefined && variacao > 0
  
  return (
    <Card className="p-4">
      <div className="flex flex-col items-center text-center">
        <p className="text-sm text-gray-600 font-medium">{titulo}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{valor}</p>
        {destaque && (
          <p className="text-xs text-gray-500 mt-1">{destaque}</p>
        )}
      </div>
      {variacao !== undefined && (
        <div className={`flex items-center justify-center gap-1 mt-2 text-sm font-medium ${
          positivo ? 'text-green-600' : 'text-red-600'
        }`}>
          {positivo ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          <span>{Math.abs(variacao).toFixed(1)}% vs período anterior</span>
        </div>
      )}
    </Card>
  )
}

// Aba Visão Geral
function AbaVisaoGeral({ dados }: { dados: any }) {
  if (!dados || !dados.metricas) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-semibold text-gray-900 mb-2">Nenhum dado encontrado</p>
        <p className="text-gray-600">Não existem dados para o período e filtros selecionados.</p>
      </Card>
    )
  }

  const { metricas, distribuicaoServicos = [], distribuicaoCidades = [] } = dados

  return (
    <div className="space-y-6">
      {/* Cards Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricaCard
          titulo="🎫 TICKETS TOTAL"
          valor={metricas.tickets.total.toLocaleString()}
          variacao={metricas.tickets.variacao}
          destaque={`${metricas.tickets.abertos} abertos, ${metricas.tickets.concluidos} concluídos`}
        />
        <MetricaCard
          titulo="⏱️ TEMPO MÉDIO"
          valor={metricas.tempoMedio.valor}
          variacao={metricas.tempoMedio.variacao}
        />
        <MetricaCard
          titulo="✅ TAXA RESOLUÇÃO"
          valor={`${metricas.taxaResolucao.valor.toFixed(1)}%`}
          variacao={metricas.taxaResolucao.variacao}
        />
        <MetricaCard
          titulo="⭐ AVALIAÇÃO MÉDIA"
          valor={metricas.avaliacaoMedia.valor > 0 ? `${metricas.avaliacaoMedia.valor.toFixed(1)}/5.0` : 'N/A'}
          variacao={metricas.avaliacaoMedia.variacao}
        />
        <MetricaCard
          titulo="👥 CLIENTES ATIVOS"
          valor={metricas.clientesAtivos.total}
          variacao={metricas.clientesAtivos.variacao}
        />
        <MetricaCard
          titulo="💰 RECEITA"
          valor={`R$ ${metricas.receita.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          variacao={metricas.receita.variacao}
        />
      </div>

      {/* Grid de Análises */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribuição por Serviço */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 DISTRIBUIÇÃO POR SERVIÇO</h3>
          <div className="space-y-3">
            {distribuicaoServicos.slice(0, 5).map((item: any) => (
              <div key={item.servico} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 capitalize">{item.servico}</span>
                  <span className="font-bold text-gray-900">{item.percentual.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all"
                    style={{ width: `${item.percentual}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{item.total} tickets</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Cidades */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📍 TOP CIDADES</h3>
          <div className="space-y-3">
            {distribuicaoCidades.slice(0, 5).map((item: any, index: number) => (
              <div key={item.cidade} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    {index + 1}. {item.cidade}
                  </span>
                  <span className="font-bold text-gray-900">{item.percentual.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                    style={{ width: `${item.percentual}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{item.total} tickets</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// Aba Tickets
function AbaTickets({ dados }: { dados: any }) {
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [busca, setBusca] = useState('')
  const itensPorPagina = 20

  if (!dados || dados.total === 0) {
    return (
      <Card className="p-6 text-center">
        <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-semibold text-gray-900 mb-2">Nenhum ticket encontrado</p>
        <p className="text-gray-600">Não existem tickets para o período e filtros selecionados.</p>
        <p className="text-sm text-gray-500 mt-2">Tente ajustar os filtros ou selecionar outro período.</p>
      </Card>
    )
  }

  const { total, ticketsPorStatus = {}, ticketsPorPrioridade = {}, tempoMedioPorServico = [], tickets = [] } = dados

  // Filtrar tickets pela busca
  const ticketsFiltrados = tickets.filter((ticket: any) => {
    const termoBusca = busca.toLowerCase()
    return (
      ticket.protocolo?.toLowerCase().includes(termoBusca) ||
      ticket.cliente?.toLowerCase().includes(termoBusca) ||
      ticket.prestador?.toLowerCase().includes(termoBusca) ||
      ticket.origem?.toLowerCase().includes(termoBusca)
    )
  })

  // Paginação
  const totalPaginas = Math.ceil(ticketsFiltrados.length / itensPorPagina)
  const inicio = (paginaAtual - 1) * itensPorPagina
  const ticketsPaginados = ticketsFiltrados.slice(inicio, inicio + itensPorPagina)

  const formatarData = (data: string) => {
    if (!data) return '-'
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const cores: Record<string, string> = {
      aberto: 'bg-yellow-100 text-yellow-800',
      em_andamento: 'bg-blue-100 text-blue-800',
      concluido: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800'
    }
    return cores[status] || 'bg-gray-100 text-gray-800'
  }

  // Calcular métricas adicionais
  const receitaTotal = tickets.reduce((acc: number, t: any) => acc + (t.valorFinal || 0), 0)
  const ticketMedio = tickets.length > 0 ? receitaTotal / tickets.length : 0
  const ticketsComAvaliacao = tickets.filter((t: any) => t.avaliacaoCliente).length
  const avaliacaoMedia = ticketsComAvaliacao > 0
    ? tickets.filter((t: any) => t.avaliacaoCliente).reduce((acc: number, t: any) => acc + t.avaliacaoCliente, 0) / ticketsComAvaliacao
    : 0
  const tempoMedioGeral = tickets.filter((t: any) => t.tempoAtendimento).length > 0
    ? tickets.filter((t: any) => t.tempoAtendimento).reduce((acc: number, t: any) => acc + (t.tempoAtendimento || 0), 0) / tickets.filter((t: any) => t.tempoAtendimento).length
    : 0

  return (
    <div className="space-y-4">
      {/* Todos os Cards em Uma Única Linha - Flex para ocupar toda largura */}
      <Card className="p-4">
        <div className="flex gap-3">
        {/* Cards de Status */}
        {ticketsPorStatus && Object.entries(ticketsPorStatus).map(([status, count]: [string, any]) => {
          const percentual = total > 0 ? (count / total) * 100 : 0
          
          // Mapeamento de status para exibição
          const statusMap: Record<string, { bg: string; text: string; border: string; label: string; mostrarBarra: boolean }> = {
            aberto: { 
              bg: 'bg-yellow-50', 
              text: 'text-yellow-900', 
              border: 'border-yellow-200', 
              label: 'Abertos',
              mostrarBarra: true
            },
            em_andamento: { 
              bg: 'bg-blue-50', 
              text: 'text-blue-900', 
              border: 'border-blue-200', 
              label: 'Em Andamento',
              mostrarBarra: true
            },
            concluido: { 
              bg: 'bg-green-50', 
              text: 'text-green-900', 
              border: 'border-green-200', 
              label: 'Tickets Finalizados',
              mostrarBarra: false
            },
            cancelado: { 
              bg: 'bg-red-50', 
              text: 'text-red-900', 
              border: 'border-red-200', 
              label: 'Cancelados',
              mostrarBarra: true
            }
          }
          
          const cor = statusMap[status] || { 
            bg: 'bg-gray-50', 
            text: 'text-gray-900', 
            border: 'border-gray-200', 
            label: status,
            mostrarBarra: true
          }
          
          return (
            <Card key={status} className={`flex-1 p-4 border-2 ${cor.bg} ${cor.border}`}>
              <div className="flex flex-col h-full items-center text-center justify-center">
                <p className="text-xs font-medium text-gray-700 mb-2">{cor.label}</p>
                <p className={`text-2xl font-bold ${cor.text}`}>{count}</p>
                {cor.mostrarBarra && (
                  <div className="mt-auto w-full pt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                      <div
                        className={`h-1.5 rounded-full ${status === 'em_andamento' ? 'bg-blue-500' : status === 'aberto' ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${percentual}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600">{percentual.toFixed(1)}%</p>
                  </div>
                )}
              </div>
            </Card>
          )
        })}

        {/* Cards de Métricas Melhorados - Layout Horizontal */}
        <Card className="flex-1 p-4 bg-gradient-to-br from-purple-500 to-purple-600 border-purple-600 shadow-lg">
          <div className="flex flex-col justify-center items-center text-center h-full">
            <p className="text-xs font-medium text-purple-100">Total de Tickets</p>
            <p className="text-2xl font-bold text-white mt-1">{total}</p>
          </div>
        </Card>

        <Card className="flex-1 p-4 bg-gradient-to-br from-red-500 to-red-600 border-red-600 shadow-lg">
          <div className="flex flex-col justify-center items-center text-center h-full">
            <p className="text-xs font-medium text-red-100">Despesa Total</p>
            <p className="text-2xl font-bold text-white mt-1">R$ {(receitaTotal / 1000).toFixed(0)}k</p>
          </div>
        </Card>

        <Card className="flex-1 p-4 bg-gradient-to-br from-blue-500 to-blue-600 border-blue-600 shadow-lg">
          <div className="flex flex-col justify-center items-center text-center h-full">
            <p className="text-xs font-medium text-blue-100">Tempo Médio</p>
            <p className="text-2xl font-bold text-white mt-1">
              {tempoMedioGeral > 0 ? `${Math.round(tempoMedioGeral)} min` : '-'}
            </p>
          </div>
        </Card>

        <Card className="flex-1 p-4 bg-gradient-to-br from-amber-500 to-amber-600 border-amber-600 shadow-lg">
          <div className="flex flex-col justify-center items-center text-center h-full">
            <p className="text-xs font-medium text-amber-100">Avaliação Média</p>
            <p className="text-2xl font-bold text-white mt-1">
              {avaliacaoMedia > 0 ? `${avaliacaoMedia.toFixed(1)}/5` : '-'}
            </p>
          </div>
        </Card>
        </div>
      </Card>

      {/* Tabela Detalhada */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">📋 DETALHAMENTO DE TICKETS</h3>
          <input
            type="text"
            placeholder="Buscar por protocolo, cliente, prestador..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value)
              setPaginaAtual(1)
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Protocolo</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Data/Hora</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Cliente</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Serviço</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Origem</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Prestador</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Valor</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Tempo</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Aval.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ticketsPaginados.map((ticket: any) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-semibold text-purple-600">
                      {ticket.protocolo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {formatarData(ticket.dataAbertura)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{ticket.cliente}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-gray-700">{ticket.tipoServico}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{ticket.origem}</td>
                  <td className="px-4 py-3">
                    <span className="text-gray-700">{ticket.prestador}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-green-600">
                      {ticket.valorFinal ? `R$ ${ticket.valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {ticket.tempoAtendimento ? `${ticket.tempoAtendimento}min` : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {ticket.avaliacaoCliente ? (
                      <span className="text-yellow-500 font-semibold">
                        ⭐ {ticket.avaliacaoCliente.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Mostrando {inicio + 1} a {Math.min(inicio + itensPorPagina, ticketsFiltrados.length)} de {ticketsFiltrados.length} tickets
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                disabled={paginaAtual === 1}
              >
                Anterior
              </Button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                Página {paginaAtual} de {totalPaginas}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                disabled={paginaAtual === totalPaginas}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

// Aba Prestadores
function AbaPrestadores({ dados }: { dados: any }) {
  if (!dados || !dados.ranking || dados.ranking.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-semibold text-gray-900 mb-2">Nenhum prestador encontrado</p>
        <p className="text-gray-600">Não existem dados de prestadores para o período e filtros selecionados.</p>
      </Card>
    )
  }

  const { totalPrestadores, prestadoresAtivos, ranking = [] } = dados

  // Calcular taxa de ativação
  const taxaAtivacao = totalPrestadores > 0 ? (prestadoresAtivos / totalPrestadores) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Cards de Métricas Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 border-purple-600 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100">Total de Prestadores</p>
              <p className="text-3xl font-bold text-white mt-2">{totalPrestadores}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 border-green-600 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-100">Prestadores Ativos</p>
              <p className="text-3xl font-bold text-white mt-2">{prestadoresAtivos}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 border-blue-600 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Taxa de Ativação</p>
              <p className="text-3xl font-bold text-white mt-2">{taxaAtivacao.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Ranking de Prestadores */}
      <Card className="p-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              RANKING DE PRESTADORES
            </h3>
            <p className="text-sm text-gray-600 mt-1">Desempenho dos melhores prestadores do período</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-gray-500">Top {ranking.length}</span>
            <p className="text-xs text-gray-400">prestadores</p>
          </div>
        </div>

        {/* Pódio - Top 3 em Destaque */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {ranking.slice(0, 3).map((prestador: any, index: number) => {
            const podiumConfig = [
              { 
                gradient: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600',
                shadow: 'shadow-xl shadow-yellow-200',
                medal: '🥇',
                label: '1º LUGAR',
                height: 'min-h-[320px] md:min-h-[360px]'
              },
              { 
                gradient: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500',
                shadow: 'shadow-xl shadow-gray-200',
                medal: '🥈',
                label: '2º LUGAR',
                height: 'min-h-[320px] md:min-h-[340px]'
              },
              { 
                gradient: 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600',
                shadow: 'shadow-xl shadow-orange-200',
                medal: '🥉',
                label: '3º LUGAR',
                height: 'min-h-[320px] md:min-h-[340px]'
              }
            ]
            
            const config = podiumConfig[index]
            
            return (
              <div 
                key={prestador.id}
                className={`relative ${config.gradient} rounded-2xl p-6 text-white ${config.shadow} transform transition-all hover:scale-105 ${config.height} flex flex-col justify-between`}
              >
                {/* Badge de Medalha */}
                <div className="absolute -top-3 -right-3">
                  <div className="bg-white text-gray-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <span className="text-lg">{config.medal}</span>
                    {config.label}
                  </div>
                </div>

                {/* Posição */}
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-3xl font-black">#{index + 1}</span>
                  </div>
                </div>

                {/* Nome e Cidade */}
                <div className="text-center mb-4">
                  <h4 className="text-xl font-bold mb-1">{prestador.nome}</h4>
                  <p className="text-sm opacity-90 flex items-center justify-center gap-1">
                    📍 {prestador.cidade}
                  </p>
                </div>

                {/* Total Atendimentos */}
                <div className="text-center mb-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-5xl font-black mb-1">{prestador.totalAtendimentos}</p>
                    <p className="text-xs opacity-90 uppercase tracking-wider">Atendimentos</p>
                  </div>
                </div>

                {/* Métricas */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-lg p-2">
                    <span className="text-xs font-medium">⏱️ Tempo</span>
                    <span className="text-sm font-bold">{prestador.tempoMedio}</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-lg p-2">
                    <span className="text-xs font-medium">⭐ Nota</span>
                    <span className="text-sm font-bold">
                      {prestador.avaliacaoMedia > 0 ? `${prestador.avaliacaoMedia.toFixed(1)}/5` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-lg p-2">
                    <span className="text-xs font-medium">✅ Conclusão</span>
                    <span className="text-sm font-bold">{prestador.taxaConclusao.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Demais Posições - Lista Simples */}
        {ranking.length > 3 && (
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-purple-600">📊</span>
              Demais Posições
            </h4>
            
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Prestador</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Atendimentos</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Tempo</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Nota</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Taxa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ranking.slice(3, 10).map((prestador: any, index: number) => {
                    const position = index + 4
                    
                    return (
                      <tr key={prestador.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-bold text-sm">
                            {position}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-semibold text-gray-900">{prestador.nome}</p>
                            <p className="text-xs text-gray-500">📍 {prestador.cidade}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-bold text-purple-600">{prestador.totalAtendimentos}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm text-gray-700">{prestador.tempoMedio}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm text-gray-700">
                            {prestador.avaliacaoMedia > 0 ? `${prestador.avaliacaoMedia.toFixed(1)}/5` : 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm text-gray-700">{prestador.taxaConclusao.toFixed(1)}%</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

// Aba Financeiro
function AbaFinanceiro({ dados }: { dados: any }) {
  if (!dados || !dados.metricas || dados.metricas.totalTransacoes === 0) {
    return (
      <Card className="p-6 text-center">
        <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-semibold text-gray-900 mb-2">Nenhuma transação encontrada</p>
        <p className="text-gray-600">Não existem dados financeiros para o período e filtros selecionados.</p>
      </Card>
    )
  }

  const { metricas, receitaPorServico = [], topPrestadores = [] } = dados

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricaCard
          titulo="💰 RECEITA TOTAL"
          valor={`R$ ${metricas.receitaTotal.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          variacao={metricas.receitaTotal.variacao}
        />
        <MetricaCard
          titulo="🎫 TICKET MÉDIO"
          valor={`R$ ${metricas.ticketMedio.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          variacao={metricas.ticketMedio.variacao}
        />
        <MetricaCard
          titulo="📊 TRANSAÇÕES"
          valor={metricas.totalTransacoes}
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💵 RECEITA POR SERVIÇO</h3>
        <div className="space-y-4">
          {receitaPorServico.map((item: any) => (
            <div key={item.servico} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 capitalize">{item.servico}</span>
                <span className="font-bold text-gray-900">
                  R$ {item.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600"
                  style={{ width: `${item.percentual}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{item.quantidade} tickets</span>
                <span>Ticket médio: R$ {item.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 TOP PRESTADORES POR RECEITA</h3>
        <div className="space-y-3">
          {topPrestadores.map((prestador: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                <div>
                  <p className="font-semibold text-gray-900">{prestador.nome}</p>
                  <p className="text-xs text-gray-500">{prestador.quantidade} atendimentos</p>
                </div>
              </div>
              <p className="text-lg font-bold text-green-600">
                R$ {prestador.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// Aba Clientes
function AbaClientes({ dados }: { dados: any }) {
  if (!dados || !dados.metricas || dados.metricas.totalClientes === 0) {
    return (
      <Card className="p-6 text-center">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-semibold text-gray-900 mb-2">Nenhum cliente encontrado</p>
        <p className="text-gray-600">Não existem dados de clientes para o período selecionado.</p>
      </Card>
    )
  }

  const { metricas, clientes = [] } = dados

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricaCard
          titulo="👥 TOTAL CLIENTES"
          valor={metricas.totalClientes || 0}
        />
        <MetricaCard
          titulo="✅ CLIENTES ATIVOS"
          valor={metricas.clientesAtivos || 0}
        />
        <MetricaCard
          titulo="📊 TICKETS/CLIENTE"
          valor={(metricas.ticketMedioPorCliente || 0).toFixed(1)}
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 TOP CLIENTES</h3>
        <div className="space-y-3">
          {clientes.slice(0, 20).map((cliente: any, index: number) => (
            <div key={cliente.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{cliente.nome}</h4>
                  <p className="text-sm text-gray-600">{cliente.telefone}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-600">{cliente.totalTickets}</p>
                  <p className="text-xs text-gray-500">tickets</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Concluídos</p>
                  <p className="text-sm font-semibold text-gray-900">{cliente.ticketsConcluidos}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Valor Total</p>
                  <p className="text-sm font-semibold text-gray-900">
                    R$ {cliente.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avaliação</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {cliente.avaliacaoMedia > 0 ? `${cliente.avaliacaoMedia.toFixed(1)}/5` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// Sidebar de Controles
function SidebarControles({
  abaAtiva,
  periodoSelecionado,
  setPeriodoSelecionado,
  compararPeriodo,
  setCompararPeriodo,
  filtrosTiposServico,
  setFiltrosTiposServico,
  filtrosStatus,
  setFiltrosStatus,
  filtrosCidades,
  setFiltrosCidades,
  limparFiltros,
  carregarDados,
  exportarPDF,
  exportarExcel,
  carregando
}: any) {
  const tiposServico = ['reboque', 'pneu', 'chaveiro', 'bateria', 'combustivel', 'mecanica']
  const statusOptions = ['aberto', 'em_andamento', 'concluido', 'cancelado']

  function toggleFiltro(lista: string[], setLista: Function, valor: string) {
    if (lista.includes(valor)) {
      setLista(lista.filter(item => item !== valor))
    } else {
      setLista([...lista, valor])
    }
  }

  return (
    <div className="space-y-4">
      {/* Controles de Período */}
      <Card className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Período
        </h3>
        <div className="space-y-2">
          {[
            { value: 'hoje', label: 'Hoje' },
            { value: 'ontem', label: 'Ontem' },
            { value: '7dias', label: 'Últimos 7 dias' },
            { value: '30dias', label: 'Últimos 30 dias' },
            { value: 'mes_atual', label: 'Este mês' },
            { value: 'mes_passado', label: 'Mês passado' },
          ].map((periodo) => (
            <label key={periodo.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name="periodo"
                value={periodo.value}
                checked={periodoSelecionado === periodo.value}
                onChange={(e) => setPeriodoSelecionado(e.target.value as TipoPeriodo)}
                className="text-purple-600"
              />
              <span className="text-sm text-gray-700">{periodo.label}</span>
            </label>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={compararPeriodo}
              onChange={(e) => setCompararPeriodo(e.target.checked)}
              className="rounded text-purple-600"
            />
            <span className="text-sm text-gray-700">Comparar com período anterior</span>
          </label>
        </div>
      </Card>

      {/* Filtros - Não mostrar na Visão Geral */}
      {abaAtiva !== 'visao_geral' && (
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </h3>
        
        <div className="space-y-4">
          {/* Tipos de Serviço */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Tipos de Serviço:</label>
            <div className="space-y-2">
              {tiposServico.map((tipo) => (
                <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtrosTiposServico.includes(tipo)}
                    onChange={() => toggleFiltro(filtrosTiposServico, setFiltrosTiposServico, tipo)}
                    className="rounded text-purple-600"
                  />
                  <span className="text-sm text-gray-600 capitalize">{tipo}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Status:</label>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtrosStatus.includes(status)}
                    onChange={() => toggleFiltro(filtrosStatus, setFiltrosStatus, status)}
                    className="rounded text-purple-600"
                  />
                  <span className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-4"
            onClick={limparFiltros}
          >
            Limpar Filtros
          </Button>
        </Card>
      )}

      {/* Ações */}
      <Card className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Ações</h3>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={exportarPDF}
            disabled={carregando}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={exportarExcel}
            disabled={carregando}
          >
            <FileText className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={carregarDados}
            disabled={carregando}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${carregando ? 'animate-spin' : ''}`} />
            Atualizar Dados
          </Button>
        </div>
      </Card>
    </div>
  )
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, j) => (
                <div key={j}>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-2 bg-gray-300 rounded w-full"></div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// FUNÇÕES DE EXPORTAÇÃO
// ==========================================

function gerarConteudoHTML(dados: any, aba: AbaRelatorio, periodo: TipoPeriodo): string {
  const dataAtual = new Date().toLocaleDateString('pt-BR')
  const periodoLabel = {
    'hoje': 'Hoje',
    'ontem': 'Ontem',
    '7dias': 'Últimos 7 dias',
    '30dias': 'Últimos 30 dias',
    'mes_atual': 'Este mês',
    'mes_passado': 'Mês passado'
  }[periodo]

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Relatório - ${aba}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #7c3aed; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #7c3aed; color: white; }
        .header { margin-bottom: 20px; }
        .metric { display: inline-block; margin: 10px 20px 10px 0; }
        @media print { button { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Relatório de ${aba.replace('_', ' ').toUpperCase()}</h1>
        <p><strong>Período:</strong> ${periodoLabel}</p>
        <p><strong>Data de Geração:</strong> ${dataAtual}</p>
      </div>
      ${gerarConteudoHTMLPorAba(dados, aba)}
    </body>
    </html>
  `
}

function gerarConteudoHTMLPorAba(dados: any, aba: AbaRelatorio): string {
  switch (aba) {
    case 'tickets':
      return `
        <h2>Resumo</h2>
        <div class="metric"><strong>Total:</strong> ${dados.total}</div>
        <h2>Tickets</h2>
        <table>
          <thead>
            <tr>
              <th>Protocolo</th>
              <th>Cliente</th>
              <th>Serviço</th>
              <th>Status</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            ${dados.tickets?.map((t: any) => `
              <tr>
                <td>${t.protocolo}</td>
                <td>${t.cliente}</td>
                <td>${t.tipoServico}</td>
                <td>${t.status}</td>
                <td>R$ ${(t.valorFinal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      `
    default:
      return '<p>Dados do relatório</p>'
  }
}

function gerarCSVTickets(dados: any): string {
  let csv = 'Protocolo;Data/Hora;Cliente;Serviço;Origem;Prestador;Status;Valor;Tempo (min);Avaliação\n'
  
  dados.tickets?.forEach((ticket: any) => {
    const dataFormatada = ticket.dataAbertura ? new Date(ticket.dataAbertura).toLocaleString('pt-BR') : '-'
    const valor = ticket.valorFinal ? ticket.valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '-'
    const tempo = ticket.tempoAtendimento || '-'
    const avaliacao = ticket.avaliacaoCliente || '-'
    
    csv += `${ticket.protocolo};${dataFormatada};${ticket.cliente};${ticket.tipoServico};${ticket.origem};${ticket.prestador};${ticket.status};R$ ${valor};${tempo};${avaliacao}\n`
  })
  
  return csv
}

function gerarCSVPrestadores(dados: any): string {
  let csv = 'Posição;Nome;Cidade;Total Atendimentos;Tempo Médio;Avaliação;Taxa Conclusão (%)\n'
  
  dados.ranking?.forEach((prestador: any, index: number) => {
    csv += `${index + 1};${prestador.nome};${prestador.cidade};${prestador.totalAtendimentos};${prestador.tempoMedio};${prestador.avaliacaoMedia.toFixed(1)};${prestador.taxaConclusao.toFixed(1)}\n`
  })
  
  return csv
}

function gerarCSVFinanceiro(dados: any): string {
  let csv = 'Serviço;Receita;Quantidade;Ticket Médio;Percentual (%)\n'
  
  dados.receitaPorServico?.forEach((item: any) => {
    const receita = item.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    const ticketMedio = item.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    
    csv += `${item.servico};R$ ${receita};${item.quantidade};R$ ${ticketMedio};${item.percentual.toFixed(1)}\n`
  })
  
  return csv
}

function gerarCSVClientes(dados: any): string {
  let csv = 'Nome;Telefone;Total Tickets;Tickets Concluídos;Valor Total;Avaliação Média\n'
  
  dados.clientes?.forEach((cliente: any) => {
    const valorTotal = cliente.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    const avaliacao = cliente.avaliacaoMedia > 0 ? cliente.avaliacaoMedia.toFixed(1) : 'N/A'
    
    csv += `${cliente.nome};${cliente.telefone};${cliente.totalTickets};${cliente.ticketsConcluidos};R$ ${valorTotal};${avaliacao}\n`
  })
  
  return csv
}

function gerarCSVVisaoGeral(dados: any): string {
  let csv = 'Métrica;Valor\n'
  
  if (dados.metricas) {
    csv += `Total de Tickets;${dados.metricas.tickets?.total || 0}\n`
    csv += `Tickets Abertos;${dados.metricas.tickets?.abertos || 0}\n`
    csv += `Tickets Concluídos;${dados.metricas.tickets?.concluidos || 0}\n`
    csv += `Taxa de Resolução;${dados.metricas.taxaResolucao?.valor.toFixed(1) || 0}%\n`
    csv += `Tempo Médio;${dados.metricas.tempoMedio?.valor || '-'}\n`
    csv += `Avaliação Média;${dados.metricas.avaliacaoMedia?.valor.toFixed(1) || 0}/5.0\n`
    csv += `Clientes Ativos;${dados.metricas.clientesAtivos?.total || 0}\n`
    csv += `Receita Total;R$ ${(dados.metricas.receita?.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`
  }
  
  return csv
}
