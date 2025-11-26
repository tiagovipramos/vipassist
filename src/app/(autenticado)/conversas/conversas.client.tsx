// ⚠️ TODO: Esta página precisa ser refatorada para o pattern Server + Client Component
// para adicionar metadata SEO. Ver exemplo em src/app/(autenticado)/chat/page.tsx
// Use: generatePageMetadata('conversas') de src/lib/metadata/pages.ts

'use client';

import { useState } from 'react';
import { Card } from '@/componentes/ui/card';
import { Button } from '@/componentes/ui/button';
import { Avatar } from '@/componentes/ui/avatar';
import { 
  conversasSupervisaoMockadas, 
  metricasConversasMockadas,
  atendentesMockados 
} from '@/lib/dadosMockados';
import { 
  ConversaSupervisao, 
  FiltrosConversaSupervisao,
  StatusConversaSupervisao,
  NivelAlerta
} from '@/tipos/conversaSupervisao';
import { EmocaoDetectada } from '@/tipos/mensagem';
import { CanalCliente } from '@/tipos/cliente';
import { useSidebarStore } from '@/stores/sidebarStore';

// Ícones de emoção
const emojiEmocao: Record<EmocaoDetectada, string> = {
  irritado: '😠',
  frustrado: '😤',
  confuso: '😕',
  neutro: '😐',
  feliz: '😊',
  triste: '😢',
};

// Cores de status
const coresStatus: Record<StatusConversaSupervisao, string> = {
  urgente: 'bg-red-500',
  em_andamento: 'bg-yellow-500',
  normal: 'bg-green-500',
  resolvida: 'bg-gray-500',
};

// Cores de prioridade
const coresPrioridade: Record<NivelAlerta, string> = {
  critico: 'border-red-500 bg-red-50',
  alto: 'border-orange-500 bg-orange-50',
  medio: 'border-yellow-500 bg-yellow-50',
  baixo: 'border-blue-500 bg-blue-50',
};

export function ConversasClient() {
  const { isCollapsed } = useSidebarStore();
  const [conversaSelecionada, setConversaSelecionada] = useState<ConversaSupervisao | null>(null);
  const [metricsCollapsed, setMetricsCollapsed] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosConversaSupervisao>({
    status: undefined,
    emocao: undefined,
    atendente: undefined,
    canal: undefined,
    periodo: 'tempo_real',
  });

  // Filtrar conversas
  const conversasFiltradas = conversasSupervisaoMockadas.filter((conv) => {
    if (filtros.status && filtros.status.length > 0 && !filtros.status.includes(conv.status)) {
      return false;
    }
    if (filtros.emocao && filtros.emocao.length > 0 && !filtros.emocao.includes(conv.clienteEmocao)) {
      return false;
    }
    if (filtros.atendente && filtros.atendente.length > 0 && !filtros.atendente.includes(conv.atendenteId)) {
      return false;
    }
    if (filtros.canal && filtros.canal.length > 0 && !filtros.canal.includes(conv.canal)) {
      return false;
    }
    return true;
  });

  // Formatar tempo médio de resposta
  const formatarTMR = (segundos: number): string => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}m${segs}s`;
  };

  // Formatar canal
  const formatarCanal = (canal: CanalCliente): string => {
    const canais: Record<CanalCliente, string> = {
      whatsapp: 'WhatsApp',
      instagram: 'Instagram',
      chat_web: 'Chat Web',
      telegram: 'Telegram',
      email: 'Email',
      telefone: 'Telefone',
      sms: 'SMS',
      chat: 'Chat',
    };
    return canais[canal] || canal;
  };

  return (
    <>
    <div className="flex -mx-8 -mt-8">
      {/* Sidebar - Filtros */}
      <aside className="w-80 bg-gradient-to-b from-gray-50 to-white px-8 pt-8">
        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            {/* Header do Card */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
                <p className="text-xs text-gray-500">Refine sua busca</p>
              </div>
            </div>

          {/* Status */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <span className="text-lg">🔴</span>
              Status
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              onChange={(e) => {
                const value = e.target.value;
                setFiltros({
                  ...filtros,
                  status: value === 'todos' ? undefined : [value as StatusConversaSupervisao]
                });
              }}
            >
              <option value="todos">Todos</option>
              <option value="urgente">🔴 Urgente</option>
              <option value="em_andamento">🟡 Em Andamento</option>
              <option value="normal">🟢 Normal</option>
              <option value="resolvida">⚫ Resolvida</option>
            </select>
          </div>

          {/* Emoção */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <span className="text-lg">😊</span>
              Emoção
            </label>
            <select 
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
              onChange={(e) => {
                const value = e.target.value;
                setFiltros({
                  ...filtros,
                  emocao: value === 'todas' ? undefined : [value as EmocaoDetectada]
                });
              }}
            >
              <option value="todas">Todas</option>
              <option value="irritado">😠 Irritado</option>
              <option value="frustrado">😤 Frustrado</option>
              <option value="confuso">😕 Confuso</option>
              <option value="neutro">😐 Neutro</option>
              <option value="feliz">😊 Feliz</option>
            </select>
          </div>

          {/* Atendente */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <span className="text-lg">👤</span>
              Atendente
            </label>
            <select 
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
              onChange={(e) => {
                const value = e.target.value;
                setFiltros({
                  ...filtros,
                  atendente: value === 'todos' ? undefined : [value]
                });
              }}
            >
              <option value="todos">Todos</option>
              {atendentesMockados.map((atendente) => (
                <option key={atendente.id} value={atendente.id}>
                  {atendente.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Canal */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <span className="text-lg">📱</span>
              Canal
            </label>
            <select 
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
              onChange={(e) => {
                const value = e.target.value;
                setFiltros({
                  ...filtros,
                  canal: value === 'todos' ? undefined : [value as CanalCliente]
                });
              }}
            >
              <option value="todos">Todos</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="chat_web">Chat Web</option>
              <option value="telegram">Telegram</option>
            </select>
          </div>

          {/* Período */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <span className="text-lg">📅</span>
              Período
            </label>
            <select 
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
              value={filtros.periodo}
              onChange={(e) => setFiltros({ ...filtros, periodo: e.target.value as any })}
            >
              <option value="tempo_real">⏱️ Tempo Real</option>
              <option value="ultimas_24h">📅 Últimas 24h</option>
              <option value="ultimos_7d">📅 Últimos 7 dias</option>
              <option value="ultimos_30d">📅 Últimos 30 dias</option>
            </select>
          </div>
          </div>
        </aside>

        {/* Main Content - Listagem de Conversas */}
        <main className="flex-1">
          <div className="p-6 pb-24">
            <div className="grid grid-cols-2 gap-4 auto-rows-fr">
            {conversasFiltradas.map((conversa) => (
              <Card 
                key={conversa.id} 
                className={`p-4 border-l-4 ${coresPrioridade[conversa.prioridade]} hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full`}
              >
                {/* Conteúdo do Card */}
                <div className="flex-1 flex flex-col">
                {/* Status Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${coresStatus[conversa.status]}`}></span>
                    <span className="font-semibold text-gray-900 uppercase text-xs">
                      {conversa.status === 'urgente' && '🔴 URGENTE'}
                      {conversa.status === 'em_andamento' && '🟡 EM ANDAMENTO'}
                      {conversa.status === 'normal' && '🟢 NORMAL'}
                      {conversa.status === 'resolvida' && '⚫ RESOLVIDA'}
                    </span>
                  </div>
                  {conversa.analiseIA.nivelIrritacao >= 7 && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                      ALERTA
                    </span>
                  )}
                </div>

                {/* Cliente Info */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{emojiEmocao[conversa.clienteEmocao]}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{conversa.clienteNome}</span>
                      <span className="text-sm text-gray-500">• {formatarCanal(conversa.canal)}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Atendente: {conversa.atendenteNome} 
                      {conversa.atendenteTipo === 'ia' && ' 🤖'}
                    </div>
                  </div>
                </div>

                {/* Duração */}
                <div className="text-sm text-gray-600 mb-3">
                  Duração: {conversa.duracaoMinutos}min
                  {conversa.digitando && <span className="ml-2 text-blue-600 font-medium">[DIGITANDO...]</span>}
                </div>

                {/* Análise IA - Alertas */}
                {conversa.analiseIA.alertas.length > 0 && (
                  <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                    <div className="font-semibold text-yellow-800 mb-1">⚠️ Alertas:</div>
                    {conversa.analiseIA.alertas.slice(0, 2).map((alerta, idx) => (
                      <div key={idx} className="text-yellow-700">• {alerta}</div>
                    ))}
                  </div>
                )}
                </div>

                {/* Ações - Sempre no final */}
                <div className="mt-auto pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={() => setConversaSelecionada(conversa)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      👂 OUVIR
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      🚨 INTERVIR
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            </div>

            {conversasFiltradas.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-5xl mb-4">💬</div>
                <p className="text-gray-600">Nenhuma conversa encontrada com os filtros selecionados</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Métricas Rápidas - Footer Fixo Compacto */}
      <div className={`fixed right-0 bg-gradient-to-r from-blue-600 to-blue-700 shadow-2xl border-t-2 border-blue-800 z-20 transition-all duration-300 ${
        isCollapsed ? 'left-20' : 'left-64'
      } ${metricsCollapsed ? 'translate-y-full' : 'bottom-0'}`}>
        <div className="flex items-center justify-center gap-1 px-4 py-2">
          {/* Container das métricas */}
          <div className="flex items-center gap-1">
          {/* Métrica 1: Conversas Ativas */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded backdrop-blur-sm hover:bg-white/20 transition-all w-[140px]">
            <div className="text-xl">💬</div>
            <div>
              <div className="text-lg font-bold text-white">{metricasConversasMockadas.totalAtivas}</div>
              <div className="text-[10px] text-blue-100 leading-none">Conversas Ativas</div>
            </div>
          </div>
          
          <div className="h-8 w-px bg-white/20 mx-1"></div>
          
          {/* Métrica 2: TMR */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded backdrop-blur-sm hover:bg-white/20 transition-all w-[140px]">
            <div className="text-xl">⏱️</div>
            <div>
              <div className="text-lg font-bold text-white">{formatarTMR(metricasConversasMockadas.tmr)}</div>
              <div className="text-[10px] text-blue-100 leading-none">TMR Médio</div>
            </div>
          </div>
          
          <div className="h-8 w-px bg-white/20 mx-1"></div>
          
          {/* Métrica 3: Satisfação */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded backdrop-blur-sm hover:bg-white/20 transition-all w-[140px]">
            <div className="text-xl">😊</div>
            <div>
              <div className="text-lg font-bold text-white">{metricasConversasMockadas.satisfacaoPercentual}%</div>
              <div className="text-[10px] text-blue-100 leading-none">Satisfação</div>
            </div>
          </div>
          
          <div className="h-8 w-px bg-white/20 mx-1"></div>
          
          {/* Métrica 4: Urgentes */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded backdrop-blur-sm hover:bg-white/20 transition-all w-[140px]">
            <div className="text-xl">🔴</div>
            <div>
              <div className="text-lg font-bold text-white">
                {conversasSupervisaoMockadas.filter(c => c.status === 'urgente').length}
              </div>
              <div className="text-[10px] text-blue-100 leading-none">Urgentes</div>
            </div>
          </div>
          
          <div className="h-8 w-px bg-white/20 mx-1"></div>
          
          {/* Métrica 5: Clientes Irritados */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded backdrop-blur-sm hover:bg-white/20 transition-all w-[140px]">
            <div className="text-xl">😠</div>
            <div>
              <div className="text-lg font-bold text-white">
                {conversasSupervisaoMockadas.filter(c => c.analiseIA.nivelIrritacao >= 7).length}
              </div>
              <div className="text-[10px] text-blue-100 leading-none">Clientes Irritados</div>
            </div>
          </div>
          
          <div className="h-8 w-px bg-white/20 mx-1"></div>
          
          {/* Métrica 6: Positivos */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded backdrop-blur-sm hover:bg-white/20 transition-all w-[140px]">
            <div className="text-xl">✅</div>
            <div>
              <div className="text-lg font-bold text-white">
                {Math.round((metricasConversasMockadas.distribuicaoEmocoes.positivo / 100) * metricasConversasMockadas.totalAtivas)}
              </div>
              <div className="text-[10px] text-blue-100 leading-none">Clientes Felizes</div>
            </div>
          </div>
          
          <div className="h-8 w-px bg-white/20 mx-1"></div>
          
          {/* Métrica 7: Fila de Espera */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded backdrop-blur-sm hover:bg-white/20 transition-all w-[140px]">
            <div className="text-xl">⏳</div>
            <div>
              <div className="text-lg font-bold text-white">
                {metricasConversasMockadas.filaEspera}
              </div>
              <div className="text-[10px] text-blue-100 leading-none">Fila de Espera</div>
            </div>
          </div>
          </div>

          {/* Botão Toggle Métricas */}
          <button
            onClick={() => setMetricsCollapsed(!metricsCollapsed)}
            className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all ml-2"
            title={metricsCollapsed ? 'Mostrar métricas' : 'Ocultar métricas'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal - Ouvir Conversa */}
      {conversaSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  💬 OUVINDO: {conversaSelecionada.clienteNome}
                </h2>
                <p className="text-sm text-blue-100">
                  Atendente: {conversaSelecionada.atendenteNome} | {formatarCanal(conversaSelecionada.canal)} | {conversaSelecionada.duracaoMinutos}min
                </p>
              </div>
              <button 
                onClick={() => setConversaSelecionada(null)}
                className="text-white hover:bg-blue-700 rounded-full p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Histórico da Conversa */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 uppercase text-sm">Histórico da Conversa</h3>
                <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                  {conversaSelecionada.mensagens.map((msg) => (
                    <div key={msg.id} className={`${msg.direcao === 'entrada' ? 'text-left' : 'text-right'}`}>
                      <div className={`inline-block max-w-[80%] ${
                        msg.direcao === 'entrada' 
                          ? 'bg-white border border-gray-200' 
                          : 'bg-blue-600 text-white'
                      } rounded-lg px-4 py-2`}>
                        <div className="text-xs font-semibold mb-1">
                          {msg.direcao === 'entrada' 
                            ? `Cliente (${new Date(msg.dataEnvio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })})` 
                            : `${conversaSelecionada.atendenteNome} (${new Date(msg.dataEnvio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })})`
                          }
                        </div>
                        <div className="text-sm">{msg.conteudo}</div>
                      </div>
                    </div>
                  ))}
                  {conversaSelecionada.digitando && (
                    <div className="text-left">
                      <div className="inline-block bg-gray-200 rounded-lg px-4 py-2">
                        <div className="text-xs text-gray-600 font-medium">
                          [DIGITANDO...] {conversaSelecionada.atendenteNome} está respondendo agora...
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Análise da IA */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">🤖</span>
                  ANÁLISE DA IA:
                </h3>
                
                {/* Nível de Irritação */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-blue-900">
                      ⚠️ Nível de irritação do cliente:
                    </span>
                    <span className="text-sm font-bold text-blue-900">
                      {conversaSelecionada.analiseIA.nivelIrritacao}/10
                    </span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        conversaSelecionada.analiseIA.nivelIrritacao >= 7 
                          ? 'bg-red-500' 
                          : conversaSelecionada.analiseIA.nivelIrritacao >= 4 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${conversaSelecionada.analiseIA.nivelIrritacao * 10}%` }}
                    ></div>
                  </div>
                </div>

                {/* Sugestões */}
                {conversaSelecionada.analiseIA.sugestoes.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-blue-900 mb-2">💡 Sugestões:</div>
                    <ul className="space-y-1">
                      {conversaSelecionada.analiseIA.sugestoes.map((sugestao, idx) => (
                        <li key={idx} className="text-sm text-blue-800">• {sugestao}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Histórico de Reclamações */}
                {conversaSelecionada.analiseIA.historicoReclamacoes > 0 && (
                  <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
                    📊 {conversaSelecionada.analiseIA.historicoReclamacoes}ª reclamação deste cliente em 30 dias
                  </div>
                )}
              </div>

              {/* Ações do Gestor */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 uppercase text-sm">Ações do Gestor</h3>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white justify-center text-sm py-2">
                    💬 ENVIAR ORIENTAÇÃO
                  </Button>
                  <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white justify-center text-sm py-2">
                    🚨 INTERVIR
                  </Button>
                  <Button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white justify-center text-sm py-2">
                    📊 PERFIL
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
