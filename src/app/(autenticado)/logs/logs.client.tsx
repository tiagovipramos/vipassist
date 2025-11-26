'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/componentes/ui/card';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import type { Log, TipoLog, AcaoLog, NivelLog, EstatisticasLog } from '@/tipos/log';

export function LogsClient() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [stats, setStats] = useState<EstatisticasLog | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Filtros
  const [filtroTipo, setFiltroTipo] = useState<TipoLog | 'todos'>('todos');
  const [filtroAcao, setFiltroAcao] = useState<AcaoLog | 'todos'>('todos');
  const [filtroNivel, setFiltroNivel] = useState<NivelLog | 'todos'>('todos');
  const [busca, setBusca] = useState('');

  // Paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal de detalhes
  const [logSelecionado, setLogSelecionado] = useState<Log | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  // Carregar logs
  useEffect(() => {
    carregarLogs();
  }, [filtroTipo, filtroAcao, filtroNivel, busca, page]);

  const carregarLogs = async () => {
    try {
      setCarregando(true);
      setErro(null);

      const params = new URLSearchParams({
        tipo: filtroTipo,
        acao: filtroAcao,
        nivel: filtroNivel,
        page: page.toString(),
        limit: '50',
      });

      if (busca) {
        params.append('busca', busca);
      }

      const response = await fetch(`/api/logs?${params}`);
      const result = await response.json();

      if (result.success) {
        setLogs(result.data.logs);
        setTotal(result.data.total);
        setTotalPages(result.data.totalPages);
        setStats(result.data.estatisticas);
      } else {
        setErro(result.error || 'Erro ao carregar logs');
      }
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      setErro('Erro ao conectar com o servidor');
    } finally {
      setCarregando(false);
    }
  };

  const limparFiltros = () => {
    setFiltroTipo('todos');
    setFiltroAcao('todos');
    setFiltroNivel('todos');
    setBusca('');
    setPage(1);
  };

  // Traduzir termos técnicos para linguagem simples
  const getTipoNome = (tipo: TipoLog) => {
    switch (tipo) {
      case 'sistema':
        return 'Sistema';
      case 'usuario':
        return 'Usuário';
      case 'ticket':
        return 'Chamado';
      case 'prestador':
        return 'Prestador';
      case 'cliente':
        return 'Cliente';
      case 'pagamento':
        return 'Pagamento';
      case 'erro':
        return 'Erro';
      default:
        return tipo;
    }
  };

  const getAcaoNome = (acao: string) => {
    switch (acao) {
      case 'criar':
        return 'Criou';
      case 'editar':
        return 'Editou';
      case 'deletar':
        return 'Excluiu';
      case 'login':
        return 'Entrou no sistema';
      case 'logout':
        return 'Saiu do sistema';
      case 'visualizar':
        return 'Visualizou';
      case 'exportar':
        return 'Exportou';
      case 'importar':
        return 'Importou';
      case 'aprovar':
        return 'Aprovou';
      case 'rejeitar':
        return 'Rejeitou';
      case 'cancelar':
        return 'Cancelou';
      case 'concluir':
        return 'Concluiu';
      case 'erro':
        return 'Erro';
      default:
        return acao;
    }
  };

  const getNivelNome = (nivel: NivelLog) => {
    switch (nivel) {
      case 'debug':
        return 'Depuração';
      case 'info':
        return 'Informação';
      case 'warning':
        return 'Aviso';
      case 'error':
        return 'Erro';
      case 'critical':
        return 'Crítico';
      default:
        return nivel;
    }
  };

  const getNivelDescricao = (nivel: NivelLog) => {
    switch (nivel) {
      case 'debug':
        return 'Informação técnica para desenvolvedores';
      case 'info':
        return 'Atividade normal do sistema';
      case 'warning':
        return 'Situação que requer atenção';
      case 'error':
        return 'Erro que precisa ser corrigido';
      case 'critical':
        return 'Problema grave que requer ação imediata';
      default:
        return '';
    }
  };

  // Criar descrição amigável do log
  const getDescricaoAmigavel = (log: Log) => {
    const tipo = getTipoNome(log.tipo as TipoLog);
    const acao = getAcaoNome(log.acao);
    const usuario = log.usuarioNome || 'Sistema';
    
    return `${usuario} ${acao.toLowerCase()} ${tipo.toLowerCase()}`;
  };

  const getNivelIcon = (nivel: NivelLog) => {
    switch (nivel) {
      case 'debug':
        return '🐛';
      case 'info':
        return 'ℹ️';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'critical':
        return '🔥';
      default:
        return 'ℹ️';
    }
  };

  const getNivelColor = (nivel: NivelLog) => {
    switch (nivel) {
      case 'debug':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'info':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'error':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'critical':
        return 'bg-red-200 text-red-900 border-red-500';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTipoIcon = (tipo: TipoLog) => {
    switch (tipo) {
      case 'sistema':
        return '⚙️';
      case 'usuario':
        return '👤';
      case 'ticket':
        return '🎫';
      case 'prestador':
        return '🚗';
      case 'cliente':
        return '👥';
      case 'pagamento':
        return '💰';
      case 'erro':
        return '❌';
      default:
        return '📝';
    }
  };

  const formatarData = (data: Date) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (carregando && logs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="text-red-700">
            <h3 className="font-bold mb-2">❌ Erro ao carregar logs</h3>
            <p>{erro}</p>
            <Button onClick={carregarLogs} className="mt-4 bg-red-600 hover:bg-red-700">
              🔄 Tentar Novamente
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-5 gap-4">
          <Card className="p-6 border-l-4 border-blue-500 text-center">
            <div className="text-sm text-gray-600 mb-2">📊 TOTAL DE REGISTROS</div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalLogs.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-2">Todas as atividades registradas</div>
          </Card>

          <Card className="p-6 border-l-4 border-green-500 text-center">
            <div className="text-sm text-gray-600 mb-2">🕐 ATIVIDADES HOJE</div>
            <div className="text-3xl font-bold text-gray-900">{stats.ultimasHoras.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-2">Nas últimas 24 horas</div>
          </Card>

          <Card className="p-6 border-l-4 border-red-500 text-center">
            <div className="text-sm text-gray-600 mb-2">🔥 PROBLEMAS HOJE</div>
            <div className="text-3xl font-bold text-red-600">{stats.errosRecentes.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-2">Erros nas últimas 24h</div>
          </Card>

          <Card className="p-6 border-l-4 border-purple-500 text-center">
            <div className="text-sm text-gray-600 mb-2">👤 AÇÕES DE USUÁRIOS</div>
            <div className="text-3xl font-bold text-gray-900">{stats.porTipo.usuario.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-2">Login, logout, edições, etc</div>
          </Card>

          <Card className="p-6 border-l-4 border-yellow-500 text-center">
            <div className="text-sm text-gray-600 mb-2">🎫 AÇÕES EM CHAMADOS</div>
            <div className="text-3xl font-bold text-gray-900">{stats.porTipo.ticket.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-2">Criação, edição, conclusão</div>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">🔍 FILTROS</h3>
            <Button variant="outline" onClick={limparFiltros} className="text-sm">
              🗑️ Limpar Filtros
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {/* Busca */}
            <div className="col-span-4">
              <label className="text-xs text-gray-600 block mb-2">🔍 Buscar por palavra-chave:</label>
              <Input
                type="text"
                placeholder="Digite o nome de um usuário, descrição ou qualquer palavra..."
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setPage(1);
                }}
                className="w-full"
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="text-xs text-gray-600 block mb-2">📂 Filtrar por categoria:</label>
              <select
                value={filtroTipo}
                onChange={(e) => {
                  setFiltroTipo(e.target.value as TipoLog | 'todos');
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todas as categorias</option>
                <option value="sistema">⚙️ Sistema</option>
                <option value="usuario">👤 Usuário</option>
                <option value="ticket">🎫 Chamado</option>
                <option value="prestador">🚗 Prestador</option>
                <option value="cliente">👥 Cliente</option>
                <option value="pagamento">💰 Pagamento</option>
                <option value="erro">❌ Erro</option>
              </select>
            </div>

            {/* Ação */}
            <div>
              <label className="text-xs text-gray-600 block mb-2">⚡ Filtrar por ação:</label>
              <select
                value={filtroAcao}
                onChange={(e) => {
                  setFiltroAcao(e.target.value as AcaoLog | 'todos');
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todas as ações</option>
                <option value="criar">➕ Criou algo</option>
                <option value="editar">✏️ Editou algo</option>
                <option value="deletar">🗑️ Excluiu algo</option>
                <option value="login">🔐 Entrou no sistema</option>
                <option value="logout">🚪 Saiu do sistema</option>
                <option value="visualizar">👁️ Visualizou</option>
                <option value="exportar">📤 Exportou</option>
                <option value="importar">📥 Importou</option>
                <option value="aprovar">✅ Aprovou</option>
                <option value="rejeitar">❌ Rejeitou</option>
                <option value="cancelar">🚫 Cancelou</option>
                <option value="concluir">✔️ Concluiu</option>
                <option value="erro">⚠️ Erro</option>
              </select>
            </div>

            {/* Nível */}
            <div>
              <label className="text-xs text-gray-600 block mb-2">🎯 Filtrar por importância:</label>
              <select
                value={filtroNivel}
                onChange={(e) => {
                  setFiltroNivel(e.target.value as NivelLog | 'todos');
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos os níveis</option>
                <option value="debug">🐛 Depuração (técnico)</option>
                <option value="info">ℹ️ Informação (normal)</option>
                <option value="warning">⚠️ Aviso (atenção)</option>
                <option value="error">❌ Erro (problema)</option>
                <option value="critical">🔥 Crítico (urgente)</option>
              </select>
            </div>

            {/* Resultados */}
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">{total.toLocaleString()}</span> resultados encontrados
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Lista de Logs */}
      <div className="space-y-2">
        {logs.map((log) => (
          <Card
            key={log.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4"
            style={{
              borderLeftColor:
                log.nivel === 'critical'
                  ? '#dc2626'
                  : log.nivel === 'error'
                  ? '#ef4444'
                  : log.nivel === 'warning'
                  ? '#f59e0b'
                  : log.nivel === 'info'
                  ? '#3b82f6'
                  : '#6b7280',
            }}
            onClick={() => {
              setLogSelecionado(log);
              setModalAberto(true);
            }}
          >
            <div className="flex items-start gap-4">
              {/* Ícone do Tipo */}
              <div className="text-3xl">{getTipoIcon(log.tipo as TipoLog)}</div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  {/* Nível */}
                  <span
                    className={`text-xs px-2 py-1 rounded-full border font-medium ${getNivelColor(
                      log.nivel as NivelLog
                    )}`}
                    title={getNivelDescricao(log.nivel as NivelLog)}
                  >
                    {getNivelIcon(log.nivel as NivelLog)} {getNivelNome(log.nivel as NivelLog)}
                  </span>

                  {/* Tipo */}
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-300 font-medium">
                    {getTipoNome(log.tipo as TipoLog)}
                  </span>

                  {/* Ação */}
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-300 font-medium">
                    {getAcaoNome(log.acao)}
                  </span>

                  {/* Data */}
                  <span className="text-xs text-gray-500 ml-auto">{formatarData(log.createdAt)}</span>
                </div>

                {/* Descrição Amigável */}
                <p className="text-base text-gray-900 font-semibold mb-1">{getDescricaoAmigavel(log)}</p>
                
                {/* Descrição Original (menor) */}
                {log.descricao && (
                  <p className="text-xs text-gray-600 mb-1">{log.descricao}</p>
                )}

                {/* Informações Adicionais */}
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  {log.usuarioNome && (
                    <span>
                      👤 <span className="font-medium">{log.usuarioNome}</span>
                    </span>
                  )}
                  {log.entidade && (
                    <span>
                      📦 <span className="font-medium">{log.entidade}</span>
                      {log.entidadeId && <span className="text-gray-400"> #{log.entidadeId.slice(0, 8)}</span>}
                    </span>
                  )}
                  {log.ip && (
                    <span>
                      🌐 <span className="font-medium">{log.ip}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {logs.length === 0 && (
          <Card className="p-12 text-center text-gray-500">
            <div className="text-6xl mb-4">🔍</div>
            <div className="font-medium text-lg">Nenhum log encontrado</div>
            <div className="text-sm mt-2">Tente ajustar os filtros ou realizar uma nova busca</div>
          </Card>
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Página {page} de {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="text-sm"
              >
                ← Anterior
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="text-sm"
              >
                Próxima →
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Modal de Detalhes */}
      {modalAberto && logSelecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-white border-b p-6 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{getTipoIcon(logSelecionado.tipo as TipoLog)}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Detalhes do Log</h2>
                  <p className="text-sm text-gray-600">{formatarData(logSelecionado.createdAt)}</p>
                </div>
              </div>
              <button
                onClick={() => setModalAberto(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span
                  className={`text-sm px-3 py-1.5 rounded-full border font-medium ${getNivelColor(
                    logSelecionado.nivel as NivelLog
                  )}`}
                  title={getNivelDescricao(logSelecionado.nivel as NivelLog)}
                >
                  {getNivelIcon(logSelecionado.nivel as NivelLog)} {getNivelNome(logSelecionado.nivel as NivelLog)}
                </span>
                <span className="text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 border border-gray-300 font-medium">
                  {getTipoNome(logSelecionado.tipo as TipoLog)}
                </span>
                <span className="text-sm px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 border border-purple-300 font-medium">
                  {getAcaoNome(logSelecionado.acao)}
                </span>
              </div>

              {/* Resumo Amigável */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-sm text-blue-900 mb-2">📝 O QUE ACONTECEU:</h3>
                <p className="text-blue-900 text-lg font-semibold">{getDescricaoAmigavel(logSelecionado)}</p>
                <p className="text-blue-700 text-sm mt-2">{getNivelDescricao(logSelecionado.nivel as NivelLog)}</p>
              </div>

              {/* Descrição Técnica */}
              {logSelecionado.descricao && (
                <div>
                  <h3 className="font-bold text-sm text-gray-600 mb-2">DETALHES TÉCNICOS:</h3>
                  <p className="text-gray-900 text-sm">{logSelecionado.descricao}</p>
                </div>
              )}

              {/* Informações Principais */}
              <div className="grid grid-cols-2 gap-4">
                {logSelecionado.usuarioNome && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-bold text-sm text-gray-600 mb-1">👤 QUEM FEZ:</h3>
                    <p className="text-gray-900 font-semibold">{logSelecionado.usuarioNome}</p>
                    {logSelecionado.usuarioEmail && (
                      <p className="text-sm text-gray-600">{logSelecionado.usuarioEmail}</p>
                    )}
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-bold text-sm text-gray-600 mb-1">🕐 QUANDO:</h3>
                  <p className="text-gray-900 font-semibold">{formatarData(logSelecionado.createdAt)}</p>
                </div>

                {logSelecionado.entidade && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-bold text-sm text-gray-600 mb-1">📦 O QUE FOI AFETADO:</h3>
                    <p className="text-gray-900 font-semibold">{logSelecionado.entidade}</p>
                    {logSelecionado.entidadeId && (
                      <p className="text-xs text-gray-600 font-mono mt-1">ID: {logSelecionado.entidadeId.slice(0, 12)}...</p>
                    )}
                  </div>
                )}

                {logSelecionado.ip && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-bold text-sm text-gray-600 mb-1">🌐 DE ONDE:</h3>
                    <p className="text-gray-900 font-mono text-sm">{logSelecionado.ip}</p>
                    <p className="text-xs text-gray-500 mt-1">Endereço IP do computador</p>
                  </div>
                )}
              </div>

              {/* Informações Técnicas (Colapsável) */}
              {(logSelecionado.userAgent && logSelecionado.userAgent !== 'unknown') || logSelecionado.metadados ? (
                <details className="bg-gray-50 rounded-lg border">
                  <summary className="cursor-pointer p-4 font-bold text-sm text-gray-700 hover:bg-gray-100">
                    🔧 Informações Técnicas (clique para expandir)
                  </summary>
                  <div className="p-4 pt-0 space-y-4">
                    {logSelecionado.userAgent && logSelecionado.userAgent !== 'unknown' && (
                      <div>
                        <h3 className="font-bold text-sm text-gray-600 mb-2">Navegador e Sistema:</h3>
                        <p className="text-xs text-gray-600 bg-white p-3 rounded border">
                          {logSelecionado.userAgent}
                        </p>
                      </div>
                    )}

                    {logSelecionado.metadados && (
                      <div>
                        <h3 className="font-bold text-sm text-gray-600 mb-2">Dados Adicionais:</h3>
                        <pre className="text-xs text-gray-900 bg-white p-4 rounded border overflow-x-auto">
                          {JSON.stringify(JSON.parse(logSelecionado.metadados), null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              ) : null}
            </div>

            {/* Footer */}
            <div className="bg-white border-t p-6 flex justify-end sticky bottom-0">
              <Button variant="outline" onClick={() => setModalAberto(false)}>
                FECHAR
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
