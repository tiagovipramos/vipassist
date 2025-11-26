'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/componentes/ui/card'
import { Button } from '@/componentes/ui/button'
import {
  Clock,
  DollarSign,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
  Search,
  FileText,
  CreditCard,
  Download,
  X,
  MapPin,
  Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Pagamento } from '@/tipos/pagamentos'

const tiposServico: Record<string, { label: string; icon: string }> = {
  reboque: { label: 'Reboque', icon: '🚛' },
  pneu: { label: 'Troca de Pneu', icon: '🔧' },
  bateria: { label: 'Pane Elétrica', icon: '🔋' },
  combustivel: { label: 'Combustível', icon: '⛽' },
  chaveiro: { label: 'Chaveiro', icon: '🔑' },
  mecanica: { label: 'Pane Mecânica', icon: '⚙️' },
}

const metodoPagamentoConfig: Record<string, { label: string; icon: string }> = {
  pix: { label: 'PIX', icon: '💳' },
  transferencia: { label: 'Transferência', icon: '🏦' },
  boleto: { label: 'Boleto', icon: '📄' },
  cartao: { label: 'Cartão', icon: '💳' },
}

export function PagamentosClient() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [buscaPendentes, setBuscaPendentes] = useState('')
  const [filtroMetodoPendentes, setFiltroMetodoPendentes] = useState('todos')
  const [buscaFinalizados, setBuscaFinalizados] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [filtroMetodoFinalizados, setFiltroMetodoFinalizados] = useState('todos')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10

  // Estados para modais
  const [modalDetalhes, setModalDetalhes] = useState<Pagamento | null>(null)
  const [modalConfirmacao, setModalConfirmacao] = useState<Pagamento | null>(null)
  const [isConfirmando, setIsConfirmando] = useState(false)

  // Buscar pagamentos da API
  const fetchPagamentos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/pagamentos')
      const result = await response.json()
      
      if (result.success && result.data) {
        setPagamentos(result.data)
      }
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPagamentos()
  }, [])

  // Confirmar pagamento
  const confirmarPagamento = async (pagamento: Pagamento) => {
    try {
      setIsConfirmando(true)
      const response = await fetch(`/api/pagamentos/${pagamento.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'pago',
          dataPagamento: new Date().toISOString(),
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Atualizar lista de pagamentos
        await fetchPagamentos()
        setModalConfirmacao(null)
        alert('Pagamento confirmado com sucesso!')
      } else {
        alert('Erro ao confirmar pagamento: ' + result.error)
      }
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error)
      alert('Erro ao confirmar pagamento')
    } finally {
      setIsConfirmando(false)
    }
  }

  // Baixar comprovante (simulado)
  const baixarComprovante = (pagamento: Pagamento) => {
    // Criar um comprovante simples em texto
    const comprovante = `
COMPROVANTE DE PAGAMENTO
========================

Protocolo: ${pagamento.protocolo}
Ticket: ${pagamento.ticketProtocolo}

PRESTADOR
---------
Nome: ${pagamento.prestadorNome}
Telefone: ${pagamento.prestadorTelefone}

CLIENTE
-------
Nome: ${pagamento.clienteNome}
Telefone: ${pagamento.clienteTelefone}

SERVIÇO
-------
Tipo: ${tiposServico[pagamento.servicoTipo]?.label}
Descrição: ${pagamento.servicoDescricao}

PAGAMENTO
---------
Valor: R$ ${pagamento.valor.toFixed(2)}
Método: ${metodoPagamentoConfig[pagamento.metodoPagamento]?.label}
Status: ${pagamento.status === 'finalizado' ? 'Pago' : 'Pendente'}
Data de Pagamento: ${pagamento.dataPagamento ? new Date(pagamento.dataPagamento).toLocaleString('pt-BR') : 'N/A'}

Data de Emissão: ${new Date().toLocaleString('pt-BR')}
    `.trim()

    // Criar blob e fazer download
    const blob = new Blob([comprovante], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `comprovante-${pagamento.protocolo}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // Filtrar pendentes
  let pagamentosPendentes = pagamentos.filter((p) => p.status === 'pendente')
  
  if (buscaPendentes) {
    pagamentosPendentes = pagamentosPendentes.filter((p) =>
      p.protocolo.toLowerCase().includes(buscaPendentes.toLowerCase()) ||
      p.prestadorNome.toLowerCase().includes(buscaPendentes.toLowerCase()) ||
      p.clienteNome.toLowerCase().includes(buscaPendentes.toLowerCase()) ||
      p.ticketProtocolo.toLowerCase().includes(buscaPendentes.toLowerCase())
    )
  }

  if (filtroMetodoPendentes !== 'todos') {
    pagamentosPendentes = pagamentosPendentes.filter((p) => p.metodoPagamento === filtroMetodoPendentes)
  }

  // Filtrar finalizados
  let pagamentosFinalizados = pagamentos.filter((p) => p.status === 'finalizado')
  
  if (buscaFinalizados) {
    pagamentosFinalizados = pagamentosFinalizados.filter((p) =>
      p.protocolo.toLowerCase().includes(buscaFinalizados.toLowerCase()) ||
      p.prestadorNome.toLowerCase().includes(buscaFinalizados.toLowerCase()) ||
      p.clienteNome.toLowerCase().includes(buscaFinalizados.toLowerCase()) ||
      p.ticketProtocolo.toLowerCase().includes(buscaFinalizados.toLowerCase())
    )
  }

  if (dataInicio) {
    pagamentosFinalizados = pagamentosFinalizados.filter((p) => 
      new Date(p.dataPagamento || p.dataCriacao) >= new Date(dataInicio)
    )
  }

  if (dataFim) {
    pagamentosFinalizados = pagamentosFinalizados.filter((p) => 
      new Date(p.dataPagamento || p.dataCriacao) <= new Date(dataFim)
    )
  }

  if (filtroMetodoFinalizados !== 'todos') {
    pagamentosFinalizados = pagamentosFinalizados.filter((p) => p.metodoPagamento === filtroMetodoFinalizados)
  }

  // Ordenar finalizados por data de pagamento (mais recente primeiro)
  const pagamentosFinalizadosOrdenados = pagamentosFinalizados
    .sort((a, b) => {
      const dateA = new Date(a.dataPagamento || a.dataCriacao).getTime()
      const dateB = new Date(b.dataPagamento || b.dataCriacao).getTime()
      return dateB - dateA
    })

  // Calcular paginação
  const totalPaginas = Math.ceil(pagamentosFinalizadosOrdenados.length / itensPorPagina)
  const indiceInicio = (paginaAtual - 1) * itensPorPagina
  const indiceFim = indiceInicio + itensPorPagina
  const pagamentosFinalizadosLimitados = pagamentosFinalizadosOrdenados.slice(indiceInicio, indiceFim)

  const renderPagamentoCard = (pagamento: Pagamento) => {
    const tipoInfo = tiposServico[pagamento.servicoTipo]
    const metodoInfo = metodoPagamentoConfig[pagamento.metodoPagamento]
    const diasVencimento = Math.ceil((new Date(pagamento.dataVencimento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    const isUrgente = diasVencimento <= 2

    return (
      <Card key={pagamento.id} className="p-6 hover:shadow-lg transition-shadow">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{tipoInfo.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{tipoInfo.label}</h3>
                  <p className="text-sm text-gray-500">Protocolo: {pagamento.protocolo}</p>
                </div>
              </div>
            </div>
            {isUrgente && (
              <span className="rounded-full border px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 border-red-200">
                🔴 Urgente
              </span>
            )}
          </div>

          {/* Valor */}
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor do Serviço</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {pagamento.valor.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          {/* Prestador e Cliente */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase">Prestador</p>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-700">{pagamento.prestadorNome}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{pagamento.prestadorTelefone}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase">Cliente</p>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-700">{pagamento.clienteNome}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Ticket: {pagamento.ticketProtocolo}</span>
              </div>
            </div>
          </div>

          {/* Método de Pagamento */}
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Método de Pagamento</p>
                <p className="text-sm font-medium text-gray-700">
                  {metodoInfo.icon} {metodoInfo.label}
                </p>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium text-gray-700">Serviço:</span> {pagamento.servicoDescricao}
            </p>
            {pagamento.observacoes && (
              <p>
                <span className="font-medium text-gray-700">Observações:</span> {pagamento.observacoes}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="border-t pt-3">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <Clock className="h-3 w-3" />
              Criado: {new Date(pagamento.dataCriacao).toLocaleString('pt-BR')}
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => setModalDetalhes(pagamento)}
              >
                Ver Detalhes
              </Button>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => setModalConfirmacao(pagamento)}
              >
                Confirmar Pagamento
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-gray-500">Carregando pagamentos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8" style={{ paddingTop: '15px' }}>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Estatísticas Rápidas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pagamentosPendentes.length}</p>
                <p className="text-sm text-gray-600">Pagamentos Pendentes</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pagamentosFinalizados.length}</p>
                <p className="text-sm text-gray-600">Pagamentos Finalizados</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {pagamentosPendentes.reduce((acc, p) => acc + p.valor, 0).toFixed(2).replace('.', ',')}
                </p>
                <p className="text-sm text-gray-600">Total Pendente</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Seção 1: Pagamentos Pendentes */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Pagamentos Pendentes ({pagamentosPendentes.length})
            </h2>
          </div>

          {/* Filtros para Pendentes */}
          <Card className="mb-4 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar protocolo, prestador, cliente..."
                  value={buscaPendentes}
                  onChange={(e) => setBuscaPendentes(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <select
                  value={filtroMetodoPendentes}
                  onChange={(e) => setFiltroMetodoPendentes(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="todos">Todos os métodos</option>
                  <option value="pix">PIX</option>
                  <option value="transferencia">Transferência</option>
                  <option value="boleto">Boleto</option>
                  <option value="cartao">Cartão</option>
                </select>
              </div>
            </div>
          </Card>

          {pagamentosPendentes.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Nenhum pagamento pendente</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pagamentosPendentes.map(renderPagamentoCard)}
            </div>
          )}
        </div>

        {/* Seção 2: Pagamentos Finalizados - Tabela Compacta */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Pagamentos Finalizados ({pagamentosFinalizados.length})
            </h2>
          </div>

          <Card className="overflow-hidden">
            {/* Filtros para Finalizados */}
            <div className="border-b bg-gray-50 p-4">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar protocolo, prestador..."
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
                <div>
                  <select
                    value={filtroMetodoFinalizados}
                    onChange={(e) => setFiltroMetodoFinalizados(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="todos">Todos os métodos</option>
                    <option value="pix">PIX</option>
                    <option value="transferencia">Transferência</option>
                    <option value="boleto">Boleto</option>
                    <option value="cartao">Cartão</option>
                  </select>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Mostrando {pagamentosFinalizadosOrdenados.length} pagamento(s) finalizado(s) {buscaFinalizados || dataInicio || dataFim || filtroMetodoFinalizados !== 'todos' ? '(filtrados)' : ''} - {itensPorPagina} por página
              </div>
            </div>

            {/* Tabela */}
            {pagamentosFinalizadosLimitados.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">Nenhum pagamento finalizado encontrado</p>
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
                        Prestador
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Cliente
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Valor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Método
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Pago em
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {pagamentosFinalizadosLimitados.map((pagamento) => {
                      const tipoInfo = tiposServico[pagamento.servicoTipo]
                      const metodoInfo = metodoPagamentoConfig[pagamento.metodoPagamento]
                      return (
                        <tr key={pagamento.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="font-medium text-gray-900">{pagamento.protocolo}</div>
                            <div className="text-xs text-gray-500">Ticket: {pagamento.ticketProtocolo}</div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{tipoInfo.icon}</span>
                              <span className="text-sm text-gray-900">{tipoInfo.label}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">{pagamento.prestadorNome}</div>
                            <div className="text-xs text-gray-500">{pagamento.prestadorTelefone}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{pagamento.clienteNome}</div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="text-sm font-bold text-gray-900">
                              R$ {pagamento.valor.toFixed(2).replace('.', ',')}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="text-sm text-gray-900">
                              {metodoInfo.icon} {metodoInfo.label}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="flex items-center gap-1 text-sm text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              {pagamento.dataPagamento && (
                                <span>{new Date(pagamento.dataPagamento).toLocaleString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}</span>
                              )}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => baixarComprovante(pagamento)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Comprovante
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="border-t bg-gray-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{indiceInicio + 1}</span> a{' '}
                    <span className="font-medium">{Math.min(indiceFim, pagamentosFinalizadosOrdenados.length)}</span> de{' '}
                    <span className="font-medium">{pagamentosFinalizadosOrdenados.length}</span> resultados
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPaginaAtual(paginaAtual - 1)}
                      disabled={paginaAtual === 1}
                    >
                      Anterior
                    </Button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                        <Button
                          key={pagina}
                          size="sm"
                          variant={paginaAtual === pagina ? 'default' : 'outline'}
                          onClick={() => setPaginaAtual(pagina)}
                          className="min-w-[40px]"
                        >
                          {pagina}
                        </Button>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPaginaAtual(paginaAtual + 1)}
                      disabled={paginaAtual === totalPaginas}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Modal de Detalhes - Versão Otimizada */}
      {modalDetalhes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl">
            {/* Header com Gradiente - Compacto */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">Detalhes do Pagamento</h2>
                  <span className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                    modalDetalhes.status === 'finalizado'
                      ? "bg-green-500 text-white"
                      : "bg-orange-500 text-white"
                  )}>
                    {modalDetalhes.status === 'finalizado' ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Confirmado
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3" />
                        Pendente
                      </>
                    )}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setModalDetalhes(null)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Conteúdo - Layout Reorganizado */}
            <div className="p-5">
              <div className="space-y-3">
                {/* Linha 1: Valor em Destaque + Protocolos */}
                <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr]">
                  {/* Valor Principal - Maior Destaque */}
                  <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-4 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium opacity-90 mb-1">Valor do Pagamento</p>
                        <p className="text-3xl font-bold">
                          R$ {modalDetalhes.valor.toFixed(2).replace('.', ',')}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <CreditCard className="h-3.5 w-3.5" />
                          <span className="text-sm font-medium">
                            {metodoPagamentoConfig[modalDetalhes.metodoPagamento]?.label}
                          </span>
                        </div>
                      </div>
                      <DollarSign className="h-12 w-12 opacity-20" />
                    </div>
                  </div>

                  {/* Protocolo Pagamento */}
                  <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <p className="text-[10px] font-bold text-blue-700 uppercase">Protocolo</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 break-all">{modalDetalhes.protocolo}</p>
                  </div>

                  {/* Ticket */}
                  <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <FileText className="h-4 w-4 text-purple-600" />
                      <p className="text-[10px] font-bold text-purple-700 uppercase">Ticket</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 break-all">{modalDetalhes.ticketProtocolo}</p>
                  </div>
                </div>

                {/* Linha 2: Serviço (Full Width) - Layout Horizontal */}
                <div className="rounded-xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4 shadow-md">
                  <div className="mb-3">
                    <p className="text-sm font-bold text-gray-900">
                      <span className="text-indigo-600">Tipo de Serviço Solicitado:</span> {tiposServico[modalDetalhes.servicoTipo]?.label}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 p-3 shadow-lg flex-shrink-0">
                      <span className="text-3xl">{tiposServico[modalDetalhes.servicoTipo]?.icon}</span>
                    </div>
                    <div className="rounded-lg bg-white p-3 border-2 border-indigo-100 shadow-sm flex-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5">Descrição do Serviço</p>
                      <p className="text-sm text-gray-800 leading-relaxed">{modalDetalhes.servicoDescricao}</p>
                    </div>
                  </div>
                </div>

                {/* Linha 3: Prestador e Cliente */}
                <div className="grid gap-3 lg:grid-cols-2">
                  {/* Prestador */}
                  <div className="rounded-lg border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="rounded-full bg-blue-500 p-2">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-blue-700 uppercase">Prestador de Serviço</p>
                        <p className="text-sm font-bold text-gray-900">{modalDetalhes.prestadorNome}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 bg-white rounded-lg p-2 border border-blue-100">
                      <Phone className="h-3.5 w-3.5 text-blue-600" />
                      <span className="font-medium">{modalDetalhes.prestadorTelefone}</span>
                    </div>
                  </div>

                  {/* Cliente */}
                  <div className="rounded-lg border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="rounded-full bg-purple-500 p-2">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-purple-700 uppercase">Cliente</p>
                        <p className="text-sm font-bold text-gray-900">{modalDetalhes.clienteNome}</p>
                      </div>
                    </div>
                    {modalDetalhes.clienteTelefone && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 bg-white rounded-lg p-2 border border-purple-100">
                        <Phone className="h-3.5 w-3.5 text-purple-600" />
                        <span className="font-medium">{modalDetalhes.clienteTelefone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Linha 4: Datas + Observações (se existir) */}
                <div className="grid gap-3 lg:grid-cols-[1fr_2fr]">
                  {/* Datas */}
                  <div className="rounded-lg border-2 border-gray-200 bg-white p-3">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <p className="text-[10px] font-bold text-gray-600 uppercase">Datas Importantes</p>
                    </div>
                    <div className="space-y-2">
                      <div className="rounded-lg bg-gray-50 p-2 border border-gray-200">
                        <p className="text-[10px] text-gray-500 mb-0.5">Criação</p>
                        <p className="text-xs font-bold text-gray-900">
                          {new Date(modalDetalhes.dataCriacao).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {modalDetalhes.dataPagamento && (
                        <div className="rounded-lg bg-green-50 p-2 border-2 border-green-300">
                          <p className="text-[10px] text-green-700 mb-0.5 font-bold">Pagamento</p>
                          <p className="text-xs font-bold text-green-900">
                            {new Date(modalDetalhes.dataPagamento).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Observações */}
                  {modalDetalhes.observacoes && (
                    <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <p className="text-[10px] font-bold text-amber-700 uppercase">Observações</p>
                      </div>
                      <p className="text-xs text-amber-900 leading-relaxed">{modalDetalhes.observacoes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer com Ações - Compacto */}
            <div className="border-t bg-gray-50 p-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-9"
                  onClick={() => setModalDetalhes(null)}
                >
                  <X className="h-3.5 w-3.5 mr-1.5" />
                  Fechar
                </Button>
                {modalDetalhes.status === 'finalizado' && (
                  <Button
                    className="flex-1 h-9 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    onClick={() => {
                      baixarComprovante(modalDetalhes)
                      setModalDetalhes(null)
                    }}
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Baixar Comprovante
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Modal de Confirmação */}
      {modalConfirmacao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Confirmar Pagamento</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModalConfirmacao(null)}
                  disabled={isConfirmando}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  Deseja confirmar o pagamento do serviço abaixo?
                </p>

                <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{tiposServico[modalConfirmacao.servicoTipo]?.icon}</span>
                    <span className="font-medium">{tiposServico[modalConfirmacao.servicoTipo]?.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">Protocolo: {modalConfirmacao.protocolo}</p>
                  <p className="text-sm text-gray-600">Prestador: {modalConfirmacao.prestadorNome}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    R$ {modalConfirmacao.valor.toFixed(2).replace('.', ',')}
                  </p>
                </div>

                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Esta ação não pode ser desfeita. O pagamento será marcado como finalizado.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setModalConfirmacao(null)}
                  disabled={isConfirmando}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => confirmarPagamento(modalConfirmacao)}
                  disabled={isConfirmando}
                >
                  {isConfirmando ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                      Confirmando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmar Pagamento
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
