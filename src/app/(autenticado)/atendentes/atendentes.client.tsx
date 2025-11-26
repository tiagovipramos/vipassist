// ⚠️ TODO: Esta página precisa ser refatorada para o pattern Server + Client Component
// para adicionar metadata SEO. Ver exemplo em src/app/(autenticado)/chat/page.tsx
// Use: generatePageMetadata('atendentes') de src/lib/metadata/pages.ts

'use client';

import { useState } from 'react';
import { Card } from '@/componentes/ui/card';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/componentes/ui/avatar';
import {
  atendentesMockados,
  metricasEquipe,
  rankingAtendentes,
  alertasAtendentes,
} from '@/lib/dadosMockados';
import {
  Atendente,
  FiltrosAtendentes,
  OrdenacaoAtendentes,
} from '@/tipos/atendente';
import {
  Users,
  Clock,
  CheckCircle2,
  MessageSquare,
  Timer,
  Smile,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  MessageCircle,
  BarChart3,
  Mail,
  PauseCircle,
  Trophy,
  Medal,
  AlertTriangle,
  Circle,
  Phone,
  MapPin,
  Monitor,
  Smartphone,
  Bot,
  Star,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from 'lucide-react';

export function AtendentesClient() {
  const [filtros, setFiltros] = useState<FiltrosAtendentes>({
    busca: '',
    status: 'todos',
    setor: 'todos',
    performance: 'todos',
    tipo: 'todos',
    periodo: 'hoje',
  });

  const [ordenacao, setOrdenacao] = useState<OrdenacaoAtendentes>('status');
  const [atendentesFiltrados, setAtendentesFiltrados] =
    useState<Atendente[]>(atendentesMockados);

  // Função para formatar tempo em segundos para string legível
  const formatarTempo = (segundos: number): string => {
    if (segundos < 60) return `${segundos}s`;
    const minutos = Math.floor(segundos / 60);
    const segsRestantes = segundos % 60;
    return `${minutos}min ${segsRestantes}s`;
  };

  // Função para formatar tempo de "online há"
  const formatarTempoOnline = (minutos?: number): string => {
    if (!minutos) return '';
    if (minutos < 60) return `${minutos}min`;
    const horas = Math.floor(minutos / 60);
    const minsRestantes = minutos % 60;
    return `${horas}h ${minsRestantes}min`;
  };

  // Função para obter cor do status
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'offline':
        return 'text-gray-400';
      case 'ocupado':
        return 'text-yellow-500';
      case 'pausa':
        return 'text-purple-500';
      case 'ausente':
        return 'text-gray-300';
      default:
        return 'text-gray-400';
    }
  };

  // Função para obter ícone do status
  const getStatusIcon = (status: string, tipo: string) => {
    if (tipo === 'ia') {
      return <Bot className="w-4 h-4" />;
    }
    return <Circle className="w-4 h-4 fill-current" />;
  };

  // Função para obter cor do TMR
  const getTMRColor = (tmr: number): string => {
    if (tmr < 120) return 'text-green-500'; // < 2min
    if (tmr < 300) return 'text-yellow-500'; // 2-5min
    return 'text-red-500'; // > 5min
  };

  return (
    <div className="pl-[2px] pr-8 pt-[2px] pb-8 space-y-6">
      {/* Cards de Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Equipe Online */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-2">
                <Users className="w-4 h-4" />
                <span>EQUIPE ONLINE</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {metricasEquipe.atendentesOnline}/{metricasEquipe.totalAtendentes}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {metricasEquipe.iasAtivas} IAs ativas
              </div>
            </div>
            <div className="text-green-500">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </Card>

        {/* TMR Hoje */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-2">
                <Clock className="w-4 h-4" />
                <span>TMR HOJE</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatarTempo(metricasEquipe.tmrHoje)}
              </div>
              <div
                className={`text-sm mt-1 flex items-center gap-1 ${
                  metricasEquipe.variacaoTmr < 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {metricasEquipe.variacaoTmr < 0 ? (
                  <TrendingDown className="w-4 h-4" />
                ) : (
                  <TrendingUp className="w-4 h-4" />
                )}
                {Math.abs(metricasEquipe.variacaoTmr)}% vs ontem
              </div>
            </div>
            <div className="text-blue-500">
              <Timer className="w-8 h-8" />
            </div>
          </div>
        </Card>

        {/* Taxa de Resolução */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>TAXA RESOLUÇÃO</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {metricasEquipe.taxaResolucao}%
              </div>
              <div className="text-sm text-green-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {metricasEquipe.variacaoTaxaResolucao}% vs ontem
              </div>
            </div>
            <div className="text-green-500">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          </div>
        </Card>

        {/* Atendimentos Hoje */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-2">
                <MessageSquare className="w-4 h-4" />
                <span>ATENDIMENTOS HOJE</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {metricasEquipe.atendimentosHoje}
              </div>
              <div className="text-sm text-green-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {metricasEquipe.variacaoAtendimentos}% vs ontem
              </div>
            </div>
            <div className="text-purple-500">
              <MessageSquare className="w-8 h-8" />
            </div>
          </div>
        </Card>

        {/* Fila de Espera */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-2">
                <Timer className="w-4 h-4" />
                <span>FILA DE ESPERA</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {metricasEquipe.filaEspera}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Tempo médio: {formatarTempo(metricasEquipe.tempoMedioEspera)}
              </div>
            </div>
            <div className="text-orange-500">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </Card>

        {/* Satisfação */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-2">
                <Smile className="w-4 h-4" />
                <span>SATISFAÇÃO</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {metricasEquipe.satisfacao.toFixed(1)}/5.0
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                NPS: {metricasEquipe.nps}
              </div>
            </div>
            <div className="text-yellow-500">
              <Star className="w-8 h-8 fill-current" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar atendente..."
              className="pl-10"
              value={filtros.busca}
              onChange={(e) =>
                setFiltros({ ...filtros, busca: e.target.value })
              }
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={filtros.status}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                status: e.target.value as FiltrosAtendentes['status'],
              })
            }
          >
            <option value="todos">Todos os Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="ocupado">Ocupado</option>
            <option value="pausa">Em Pausa</option>
            <option value="ausente">Ausente</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={filtros.setor}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                setor: e.target.value as FiltrosAtendentes['setor'],
              })
            }
          >
            <option value="todos">Todos os Setores</option>
            <option value="vendas">Vendas</option>
            <option value="suporte">Suporte</option>
            <option value="financeiro">Financeiro</option>
            <option value="geral">Geral</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={filtros.tipo}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                tipo: e.target.value as FiltrosAtendentes['tipo'],
              })
            }
          >
            <option value="todos">Todos os Tipos</option>
            <option value="humano">Humanos</option>
            <option value="ia">IA</option>
          </select>
        </div>
      </Card>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabela de Atendentes (3 colunas) */}
        <div className="lg:col-span-3 space-y-4">
          {atendentesMockados.map((atendente) => (
            <Card key={atendente.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Linha 1: Avatar, Nome, Status, Ações */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={atendente.avatar} alt={atendente.nome} />
                        <AvatarFallback>{atendente.nome.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 ${getStatusColor(
                          atendente.status
                        )}`}
                      >
                        {getStatusIcon(atendente.status, atendente.tipo)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {atendente.nome}
                        </h3>
                        {atendente.tipo === 'ia' && (
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                            IA
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <span className="capitalize">{atendente.cargo}</span>
                        <span>•</span>
                        <span className="capitalize">{atendente.setor}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-500">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {atendente.email}
                        </div>
                        {atendente.telefone && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {atendente.telefone}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-500">
                        {atendente.dispositivo && (
                          <div className="flex items-center gap-1">
                            {atendente.dispositivo === 'mobile' ? (
                              <Smartphone className="w-3 h-3" />
                            ) : (
                              <Monitor className="w-3 h-3" />
                            )}
                            {atendente.dispositivo}
                          </div>
                        )}
                        {atendente.localizacao && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {atendente.localizacao}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        atendente.status
                      )} bg-opacity-10 capitalize`}
                    >
                      {atendente.status}
                    </span>
                    {atendente.status === 'online' && atendente.onlineHa && (
                      <span className="text-xs text-gray-500">
                        Online há {formatarTempoOnline(atendente.onlineHa)}
                      </span>
                    )}
                    {atendente.status === 'pausa' && atendente.pausaHa && (
                      <span className="text-xs text-gray-500">
                        Em pausa há {formatarTempoOnline(atendente.pausaHa)}
                      </span>
                    )}
                    {atendente.status === 'offline' &&
                      atendente.ultimaAtividade && (
                        <span className="text-xs text-gray-500">
                          Última atividade:{' '}
                          {new Date(atendente.ultimaAtividade).toLocaleString(
                            'pt-BR',
                            {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </span>
                      )}
                  </div>
                </div>

                {/* Linha 2: Conversas Ativas */}
                {atendente.conversasAtivas.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      💬 {atendente.conversasAtivas.length} conversa(s) ativa(s):
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {atendente.conversasAtivas.slice(0, 3).map((conversa) => (
                        <div
                          key={conversa.id}
                          className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs"
                        >
                          <div className="font-medium text-gray-900 dark:text-white">
                            {conversa.clienteNome}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {conversa.canal} •{' '}
                            {formatarTempo(conversa.tempoConversa)}
                          </div>
                        </div>
                      ))}
                      {atendente.conversasAtivas.length > 3 && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs flex items-center justify-center text-gray-600 dark:text-gray-400">
                          +{atendente.conversasAtivas.length - 3} mais
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Linha 3: Métricas */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Atend. Hoje
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {atendente.metricas.atendimentosHoje}
                    </div>
                    <div className="text-xs text-gray-500">
                      Meta: {atendente.metricas.metaDiaria}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      TMR
                    </div>
                    <div
                      className={`text-lg font-semibold ${getTMRColor(
                        atendente.metricas.tempoMedioResposta
                      )}`}
                    >
                      {formatarTempo(atendente.metricas.tempoMedioResposta)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {atendente.metricas.tempoMedioResposta < 120
                        ? '🟢 Excelente'
                        : atendente.metricas.tempoMedioResposta < 300
                        ? '🟡 Bom'
                        : '🔴 Atenção'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      TMA
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatarTempo(atendente.metricas.tempoMedioAtendimento)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Resolução
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {atendente.metricas.taxaResolucao}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Satisfação
                    </div>
                    <div className="text-lg font-semibold text-yellow-500 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      {atendente.metricas.satisfacao.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">
                      ({atendente.metricas.numeroAvaliacoes} aval.)
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Sentimento
                    </div>
                    <div className="flex gap-1">
                      <div
                        className="flex items-center gap-1 text-xs"
                        title={`Positivo: ${atendente.metricas.sentimentoClientes.positivo}%`}
                      >
                        <ThumbsUp className="w-3 h-3 text-green-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {atendente.metricas.sentimentoClientes.positivo}%
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-1 text-xs"
                        title={`Neutro: ${atendente.metricas.sentimentoClientes.neutro}%`}
                      >
                        <Minus className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {atendente.metricas.sentimentoClientes.neutro}%
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-1 text-xs"
                        title={`Negativo: ${atendente.metricas.sentimentoClientes.negativo}%`}
                      >
                        <ThumbsDown className="w-3 h-3 text-red-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {atendente.metricas.sentimentoClientes.negativo}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Linha 4: Ações */}
                <div className="flex gap-2 flex-wrap border-t border-gray-200 dark:border-gray-700 pt-3">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                  {atendente.conversasAtivas.length > 0 && (
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Ver Conversas
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Relatório
                  </Button>
                  {atendente.status === 'online' && (
                    <Button variant="outline" size="sm">
                      <PauseCircle className="w-4 h-4 mr-2" />
                      Forçar Pausa
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Painel Lateral (1 coluna) */}
        <div className="space-y-6">
          {/* Top 3 da Semana */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              TOP 3 DA SEMANA
            </h3>
            <div className="space-y-4">
              {rankingAtendentes.map((ranking, index) => (
                <div
                  key={ranking.atendenteId}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={ranking.atendenteAvatar} alt={ranking.atendenteNome} />
                    <AvatarFallback>{ranking.atendenteNome.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      {ranking.atendenteNome}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {ranking.atendimentos} atend. | CSAT{' '}
                      {ranking.satisfacao.toFixed(1)} | TMR{' '}
                      {formatarTempo(ranking.tmr)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Alertas */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              PRECISA DE ATENÇÃO
            </h3>
            <div className="space-y-3">
              {alertasAtendentes
                .filter((alerta) => !alerta.resolvido)
                .map((alerta) => (
                  <div
                    key={alerta.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      alerta.severidade === 'alta'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                        : alerta.severidade === 'media'
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                    }`}
                  >
                    <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                      {alerta.atendenteNome}
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-300">
                      {alerta.mensagem}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(alerta.data).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
