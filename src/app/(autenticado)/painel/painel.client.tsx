'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/componentes/ui/card'
import { Button } from '@/componentes/ui/button'
import { Badge } from '@/componentes/ui/badge'
import {
  Truck,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Star,
  MapPin,
  Phone,
  Navigation,
  Activity,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Eye,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react'
import {
  MetricasAssistenciaVeicular,
  ChamadoUrgente,
  AlertaOperacional,
  DistribuicaoServico,
  PerformancePrestador,
  RegiaoAtendimento,
  HorarioPico,
  TendenciaSemanal,
} from '@/tipos/assistenciaVeicular'
import { cn } from '@/lib/utils'

// Importar MapaAoVivo dinamicamente sem SSR
const MapaAoVivo = dynamic(
  () => import('@/componentes/mapa/MapaAoVivo').then((mod) => mod.MapaAoVivo),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    ),
  }
)

export function PainelClient() {
  const [loading, setLoading] = useState(true)
  const [metricas, setMetricas] = useState<MetricasAssistenciaVeicular | null>(null)
  const [chamadosUrgentes, setChamadosUrgentes] = useState<ChamadoUrgente[]>([])
  const [alertasOperacionais, setAlertasOperacionais] = useState<AlertaOperacional[]>([])
  const [distribuicaoServicos, setDistribuicaoServicos] = useState<DistribuicaoServico[]>([])
  const [topPrestadores, setTopPrestadores] = useState<PerformancePrestador[]>([])
  const [regioesAtendimento, setRegioesAtendimento] = useState<RegiaoAtendimento[]>([])
  const [horariosPico, setHorariosPico] = useState<HorarioPico[]>([])
  const [tendenciaSemanal, setTendenciaSemanal] = useState<TendenciaSemanal[]>([])
  
  const [alertasExpandido, setAlertasExpandido] = useState(false)
  const [chamadosExpandido, setChamadosExpandido] = useState(false)
  const [linkCopiado, setLinkCopiado] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard')
      if (!response.ok) throw new Error('Erro ao buscar dados')
      
      const data = await response.json()
      setMetricas(data.metricas)
      setChamadosUrgentes(data.chamadosUrgentes)
      setAlertasOperacionais(data.alertas)
      setDistribuicaoServicos(data.distribuicaoServicos)
      setTopPrestadores(data.topPrestadores)
      setRegioesAtendimento(data.regioesAtendimento)
      setHorariosPico(data.horariosPico)
      setTendenciaSemanal(data.tendenciaSemanal)
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor)
  }

  const renderVariacao = (valor: number) => {
    const isPositivo = valor > 0
    const Icon = isPositivo ? TrendingUp : TrendingDown
    const cor = isPositivo ? 'text-green-600' : 'text-red-600'

    return (
      <span className={`flex items-center gap-1 text-sm font-medium ${cor}`}>
        <Icon className="h-4 w-4" />
        {Math.abs(valor)}%
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      aguardando: { label: 'Aguardando', variant: 'destructive' },
      aberto: { label: 'Aberto', variant: 'destructive' },
      em_atendimento: { label: 'Em Atendimento', variant: 'default' },
      em_andamento: { label: 'Em Andamento', variant: 'default' },
      prestador_a_caminho: { label: 'A Caminho', variant: 'secondary' },
      em_execucao: { label: 'Em Execução', variant: 'outline' },
    }
    const config = statusMap[status] || { label: status, variant: 'outline' }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getTipoIcon = (tipo: string) => {
    const iconMap: Record<string, string> = {
      reboque: '🚗',
      pane: '⚙️',
      pane_eletrica: '⚡',
      pane_motor: '🔧',
      acidente: '💥',
      chaveiro: '🔑',
      pneu: '🛞',
    }
    return iconMap[tipo] || '🔧'
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

  if (loading || !metricas) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8 pt-5">
      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Chamados Abertos</CardTitle>
            <Truck className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{metricas.chamadosAbertos}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-600">{metricas.chamadosEmAndamento} em andamento</p>
              {renderVariacao(metricas.variacaoChamados)}
            </div>
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Urgentes:</span>
                <span className="font-bold text-red-600">{metricas.chamadosUrgentes}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tempo Médio Chegada</CardTitle>
            <Clock className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{metricas.tempoMedioChegada}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-600">Meta: 30min</p>
              {renderVariacao(metricas.variacaoTempo)}
            </div>
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Atendimento:</span>
                <span className="font-bold text-gray-900">{metricas.tempoMedioAtendimento}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Prestadores Ativos</CardTitle>
            <Users className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {metricas.prestadoresAtivos}/{metricas.totalPrestadores}
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-600">{metricas.prestadoresDisponiveis} disponíveis</p>
              <span className="text-sm font-medium text-purple-600">{metricas.taxaOcupacao}% ocupação</span>
            </div>
            <div className="mt-3 pt-3 border-t">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{ width: `${metricas.taxaOcupacao}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Satisfação (NPS)</CardTitle>
            <Star className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{metricas.nps}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-600">Avaliação: {metricas.avaliacaoMedia}/5.0 ⭐</p>
            </div>
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">1º Atendimento:</span>
                <span className="font-bold text-green-600">{metricas.taxaResolucaoPrimeiroAtendimento}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Financeiras */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Despesa Hoje</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatarMoeda(metricas.receitaDia)}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-600">Ticket médio: {formatarMoeda(metricas.ticketMedio)}</p>
              {renderVariacao(metricas.variacaoReceita)}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Despesa Mês</CardTitle>
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatarMoeda(metricas.receitaMes)}</div>
            <p className="text-sm text-gray-600 mt-2">{metricas.chamadosFinalizados} chamados finalizados</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Distribuição de Serviços</CardTitle>
            <Activity className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>🚗 Reboques</span>
                <span className="font-bold">{metricas.reboques}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>🛞 Pneus</span>
                <span className="font-bold">{metricas.trocaPneu}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Operacionais */}
      <Card className="border-red-200 bg-red-50/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <CardTitle className="text-base font-semibold text-red-900">
                  Alertas Críticos ({alertasOperacionais.length})
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAlertasExpandido(!alertasExpandido)}
                className="text-red-600 hover:text-red-700"
              >
                {alertasExpandido ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Recolher
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Expandir
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          {alertasExpandido && (
            <CardContent className="space-y-3">
              {alertasOperacionais.map((alerta) => (
                <div
                  key={alerta.id}
                  className="rounded-lg border border-red-200 bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive" className="text-xs">
                          {alerta.severidade.toUpperCase()}
                        </Badge>
                        <h3 className="font-bold text-red-900">{alerta.titulo}</h3>
                        <span className="text-sm text-gray-500">{alerta.tempo}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{alerta.descricao}</p>
                      <div className="flex flex-wrap gap-2">
                        {alerta.acoes.map((acao, idx) => (
                          <Button
                            key={idx}
                            size="sm"
                            variant={acao.tipo === 'primaria' ? 'default' : 'outline'}
                            className={acao.tipo === 'primaria' ? 'bg-red-600 hover:bg-red-700' : ''}
                          >
                            {acao.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

      {/* Chamados Urgentes */}
      <Card className="border-orange-200 bg-orange-50/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-base font-semibold text-orange-900">
                  Chamados Urgentes ({chamadosUrgentes.length})
                </CardTitle>
                {chamadosUrgentes.filter(c => c.status === 'em_execucao').length > 0 && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                    {chamadosUrgentes.filter(c => c.status === 'em_execucao').length} Em Execução
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChamadosExpandido(!chamadosExpandido)}
                className="text-orange-600 hover:text-orange-700"
              >
                {chamadosExpandido ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Recolher
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Expandir
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          {chamadosExpandido && (
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {chamadosUrgentes.map((chamado) => (
                  <div
                    key={chamado.id}
                    className={cn(
                      'rounded-lg border bg-white p-4 transition-shadow hover:shadow-md flex flex-col',
                      chamado.prioridade === 'critica' && 'border-red-300',
                      chamado.prioridade === 'alta' && 'border-orange-300'
                    )}
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{getTipoIcon(chamado.tipo)}</div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-900">{chamado.protocolo}</span>
                              {getStatusBadge(chamado.status)}
                              <Badge variant="outline" className="text-xs">{chamado.tempoEspera}</Badge>
                            </div>
                            <p className="text-sm font-medium text-gray-700">{chamado.cliente.nome}</p>
                            <p className="text-xs text-gray-600">{chamado.cliente.plano}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium text-gray-700">{chamado.localizacao.endereco}</p>
                            <p className="text-gray-600">{chamado.localizacao.cidade}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium text-gray-700">{chamado.cliente.telefone}</p>
                            {chamado.prestadorDesignado && (
                              <p className="text-green-600 flex items-center gap-1 mt-1">
                                <Navigation className="h-3 w-3" />
                                {chamado.prestadorDesignado.nome} - {chamado.prestadorDesignado.tempoChegada}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Link do Prestador - Apenas para chamados em execução */}
                      {chamado.status === 'em_execucao' && (
                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Navigation className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-900">Link prestador:</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copiarLinkPrestador(chamado.protocolo)}
                              className="h-8 gap-2 border-blue-300 hover:bg-blue-100"
                            >
                              {linkCopiado === chamado.protocolo ? (
                                <>
                                  <Check className="h-4 w-4 text-green-600" />
                                  <span className="text-green-600">Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 text-blue-600" />
                                  <span className="text-blue-600">Copiar Link</span>
                                </>
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-blue-700 mt-2 font-mono bg-white px-2 py-1 rounded border border-blue-200 truncate">
                            {window.location.origin}/corrida/{chamado.protocolo}
                          </p>
                        </div>
                      )}

                      {chamado.observacoes && (
                        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                          <strong>Obs:</strong> {chamado.observacoes}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <Button size="sm" className="col-span-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalhes
                      </Button>
                      {chamado.status === 'aguardando' ? (
                        <Button size="sm" variant="outline" className="col-span-1">
                          <Users className="h-4 w-4 mr-1" />
                          Designar
                        </Button>
                      ) : (
                        <div className="col-span-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {distribuicaoServicos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Distribuição de Serviços (Hoje)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {distribuicaoServicos.map((servico) => (
                  <div key={servico.tipo} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{servico.tipo}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600">{servico.quantidade} chamados</span>
                        <span className="font-bold text-green-600">{formatarMoeda(servico.receita)}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${servico.percentual}%`, backgroundColor: servico.cor }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {horariosPico.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Clock className="h-5 w-5 text-orange-600" />
                Horários de Pico (Últimas 24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-end justify-between gap-1">
                {horariosPico.map((horario, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <div
                      className={cn(
                        'w-full rounded-t transition-all',
                        horario.tipo === 'pico' && 'bg-red-500 hover:bg-red-600',
                        horario.tipo === 'normal' && 'bg-blue-500 hover:bg-blue-600',
                        horario.tipo === 'baixo' && 'bg-gray-400 hover:bg-gray-500'
                      )}
                      style={{ height: `${Math.max((horario.chamados / 22) * 100, 5)}%` }}
                      title={`${horario.hora}: ${horario.chamados} chamados`}
                    />
                    <span className="text-xs text-gray-500 mt-1">{horario.hora}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded" />
                  Pico
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded" />
                  Normal
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-400 rounded" />
                  Baixo
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {regioesAtendimento.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <MapPin className="h-5 w-5 text-purple-600" />
                Regiões de Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {regioesAtendimento.map((regiao) => (
                <div key={regiao.regiao} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: regiao.cor }} />
                    <div>
                      <p className="font-medium text-gray-900">{regiao.regiao}</p>
                      <p className="text-sm text-gray-600">{regiao.chamados} chamados • {regiao.tempoMedio} tempo médio</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{regiao.prestadoresAtivos} prestadores</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {topPrestadores.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Users className="h-5 w-5 text-green-600" />
                Top 3 Prestadores (Esta Semana)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topPrestadores.map((prestador) => (
                <div key={prestador.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-bold text-sm">
                      {prestador.posicao === 1 && '🥇'}
                      {prestador.posicao === 2 && '🥈'}
                      {prestador.posicao === 3 && '🥉'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{prestador.nome}</p>
                      <p className="text-sm text-gray-600">{prestador.atendimentos} atendimentos • ⭐ {prestador.avaliacaoMedia}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">{prestador.taxaConclusao}% conclusão</p>
                    <p className="text-xs text-gray-600">{prestador.tempoMedioAtendimento}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tendência Semanal */}
      {tendenciaSemanal.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Activity className="h-5 w-5 text-blue-600" />
              Tendência Semanal de Chamados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-3">
              {tendenciaSemanal.map((dia, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div className="w-full flex flex-col-reverse gap-1">
                    <div
                      className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                      style={{ height: `${Math.max((dia.chamados / 180) * 100, 5)}%` }}
                      title={`${dia.dia}: ${dia.chamados} chamados`}
                    />
                    <div
                      className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                      style={{ height: `${Math.max((dia.finalizados / 180) * 100, 5)}%` }}
                      title={`Finalizados: ${dia.finalizados}`}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 mt-2">{dia.dia}</span>
                  <span className="text-xs text-gray-500">{dia.chamados}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                Total de Chamados
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                Finalizados
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
