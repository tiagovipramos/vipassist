// ⚠️ TODO: Esta página precisa ser refatorada para o pattern Server + Client Component
// para adicionar metadata SEO. Ver exemplo em src/app/(autenticado)/chat/page.tsx
// Use: generatePageMetadata('ia') de src/lib/metadata/pages.ts

'use client';

import { useState } from 'react';
import { Card } from '@/componentes/ui/card';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import {
  statusGeralIA,
  saudeIA,
  atividadesRecentesIA,
  gapsDetectados,
  agentesIA,
  automacoes,
  artigosBase,
  conversasTreinamento,
  analyticsIA,
  configuracoesGerais,
} from '@/lib/mocks/ia';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Aba =
  | 'visao-geral'
  | 'agentes'
  | 'automacoes'
  | 'base-conhecimento'
  | 'treinamento'
  | 'analytics'
  | 'configuracoes';

export function IAClient() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('visao-geral');

  return (
    <div className="h-full flex flex-col">
      {/* Abas */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex gap-1 overflow-x-auto">
          {[
            { id: 'visao-geral', label: '🎯 Visão Geral' },
            { id: 'agentes', label: '🤖 Agentes IA' },
            { id: 'automacoes', label: '⚡ Automações' },
            { id: 'base-conhecimento', label: '📚 Base Conhecimento' },
            { id: 'treinamento', label: '🎓 Treinamento' },
            { id: 'analytics', label: '📊 Analytics' },
            { id: 'configuracoes', label: '⚙️ Configurações' },
          ].map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id as Aba)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                abaAtiva === aba.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {aba.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-6">
        {abaAtiva === 'visao-geral' && <AbaVisaoGeral />}
        {abaAtiva === 'agentes' && <AbaAgentes />}
        {abaAtiva === 'automacoes' && <AbaAutomacoes />}
        {abaAtiva === 'base-conhecimento' && <AbaBaseConhecimento />}
        {abaAtiva === 'treinamento' && <AbaTreinamento />}
        {abaAtiva === 'analytics' && <AbaAnalytics />}
        {abaAtiva === 'configuracoes' && <AbaConfiguracoes />}
      </div>
    </div>
  );
}

// Aba: Visão Geral
function AbaVisaoGeral() {
  const status = statusGeralIA;
  const saude = saudeIA;

  return (
    <div className="space-y-6">
      {/* Status Geral */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">📊 Status Geral da IA</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">🤖 Agentes Ativos</div>
            <div className="text-3xl font-bold text-gray-900">
              {status.agentesAtivos} / {status.agentesTotal}
            </div>
            <div className="text-xs text-gray-500 mt-1">{status.agentesTotal - status.agentesAtivos} pausado</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">✅ Taxa Acerto</div>
            <div className="text-3xl font-bold text-gray-900">{status.taxaAcerto}%</div>
            <div className="text-xs text-green-600 mt-1">
              ↑ {status.taxaAcertoVariacao}% vs semana
            </div>
            <div className="text-xs text-gray-500">🟢 Meta: &gt;80%</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">🔄 Taxa Escalação</div>
            <div className="text-3xl font-bold text-gray-900">{status.taxaEscalacao}%</div>
            <div className="text-xs text-green-600 mt-1">
              ↓ {Math.abs(status.taxaEscalacaoVariacao)}% vs semana
            </div>
            <div className="text-xs text-gray-500">🟢 Meta: &lt;25%</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">⚡ Automações Ativas</div>
            <div className="text-3xl font-bold text-gray-900">
              {status.automacoesAtivas} / {status.automacoesTotal}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {status.automacoesTotal - status.automacoesAtivas} desativadas
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">💰 Economia</div>
            <div className="text-2xl font-bold text-gray-900">R$ {status.economia.toLocaleString()}/mês</div>
            <div className="text-xs text-gray-500 mt-1">vs humano</div>
            <div className="text-xs text-gray-500">R$ 8,35/atend</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">⏱️ Tempo Médio</div>
            <div className="text-2xl font-bold text-gray-900">{status.tempoMedioResposta}s</div>
            <div className="text-xs text-gray-500 mt-1">Instantâneo</div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">😊 CSAT IA</div>
            <div className="text-2xl font-bold text-gray-900">{status.csatIA}/5.0</div>
            <div className="text-xs text-green-600 mt-1">↑ {status.csatIAVariacao} vs mês</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">📚 Artigos na Base</div>
            <div className="text-2xl font-bold text-gray-900">{status.artigosBase}</div>
            <div className="text-xs text-gray-500 mt-1">+{status.artigosNovos} este mês</div>
          </div>
        </div>
      </Card>

      {/* Saúde da IA */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">💚 Saúde Geral da IA: {saude.pontuacaoGeral}/100 (EXCELENTE)</h2>
        </div>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full"
                style={{ width: `${saude.pontuacaoGeral}%` }}
              />
            </div>
            <span className="text-sm font-medium">{saude.pontuacaoGeral}%</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {[
            { label: '✅ Performance', valor: saude.performance, cor: 'bg-green-500' },
            { label: '✅ Cobertura de Tópicos', valor: saude.coberturaTópicos, cor: 'bg-blue-500' },
            { label: '✅ Satisfação', valor: saude.satisfacao, cor: 'bg-purple-500' },
            { label: '⚠️ Taxa de Escalação', valor: saude.taxaEscalacao, cor: 'bg-orange-500' },
            { label: '✅ Confiança Média', valor: saude.confiancaMedia, cor: 'bg-cyan-500' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-48 text-sm text-gray-700">{item.label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className={`${item.cor} h-full rounded-full`} style={{ width: `${item.valor}%` }} />
              </div>
              <div className="w-12 text-sm text-gray-600 text-right">{item.valor}%</div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="font-medium text-gray-900 mb-2">💡 Recomendações:</div>
          <ul className="space-y-1">
            {saude.recomendacoes.map((rec, i) => (
              <li key={i} className="text-sm text-gray-700">
                • {rec}
              </li>
            ))}
          </ul>
          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="outline">
              Ver Detalhes
            </Button>
            <Button size="sm">Aplicar Recomendações</Button>
          </div>
        </div>
      </Card>

      {/* Atividade Recente */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">📋 Atividade Recente</h2>
          <Button variant="outline" size="sm">
            Ver Todas
          </Button>
        </div>
        <div className="space-y-3">
          {atividadesRecentesIA.map((ativ) => (
            <div key={ativ.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {ativ.tipo === 'resolucao' && '✅'}
                    {ativ.tipo === 'escalacao' && '🔄'}
                    {ativ.tipo === 'falha' && '⚠️'}
                    {ativ.tipo === 'treinamento' && '🎓'}
                  </span>
                  <span className="text-sm text-gray-500">
                    há {formatDistanceToNow(ativ.timestamp, { locale: ptBR })}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-900 mb-1">
                <span className="font-medium">{ativ.agente}</span> {ativ.descricao}
              </div>
              {ativ.cliente && (
                <div className="text-xs text-gray-600">
                  Cliente: {ativ.cliente} | Confiança: {ativ.confianca}% | Satisfação: {ativ.satisfacao}/5
                </div>
              )}
              {ativ.motivo && <div className="text-xs text-gray-600">Motivo: {ativ.motivo}</div>}
              {ativ.atribuidoPara && (
                <div className="text-xs text-gray-600">Atribuído para: {ativ.atribuidoPara}</div>
              )}
              {ativ.detalhes && <div className="text-xs text-gray-600">{ativ.detalhes}</div>}
              <Button variant="outline" size="sm" className="mt-2">
                Ver Conversa
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Gaps Detectados */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">⚠️ Gaps Detectados pela IA ({gapsDetectados.length})</h2>
          <Button variant="outline" size="sm">
            Ver Todos
          </Button>
        </div>
        <div className="space-y-3">
          {gapsDetectados.map((gap) => (
            <div
              key={gap.id}
              className={`border rounded-lg p-4 ${
                gap.prioridade === 'critico'
                  ? 'border-red-300 bg-red-50'
                  : gap.prioridade === 'medio'
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      gap.prioridade === 'critico'
                        ? 'bg-red-600 text-white'
                        : gap.prioridade === 'medio'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-600 text-white'
                    }`}
                  >
                    {gap.prioridade.toUpperCase()}
                  </span>
                  <span className="font-medium text-gray-900">
                    {gap.quantidadePerguntas} perguntas sem resposta sobre "{gap.topico}"
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                {gap.periodo} | Taxa de escalação: {gap.taxaEscalacao}%
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Criar Artigo Agora
                </Button>
                <Button size="sm" variant="outline">
                  Ver Perguntas
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Aba: Agentes IA
function AbaAgentes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">🤖 Meus Agentes de IA</h2>
        <Button>+ Criar Novo Agente</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agentesIA.map((agente) => (
          <Card key={agente.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 rounded-full ${agente.cor} flex items-center justify-center text-white text-xl`}>
                🤖
              </div>
              <div
                className={`w-3 h-3 rounded-full ${
                  agente.status === 'ativo' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>

            <h3 className="font-bold text-gray-900 mb-1">{agente.nome}</h3>
            <div className="text-sm text-gray-600 mb-3">🤖 {agente.tipo}</div>

            <div className="text-xs text-gray-600 mb-2">
              <div className="mb-1">🏢 Setor: {agente.setor}</div>
            </div>

            <div className="mb-3">
              <div className="text-xs text-gray-600 mb-1">📊 Performance:</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: `${agente.performance}%` }} />
                </div>
                <span className="text-xs font-medium">{agente.performance}%</span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-gray-600 mb-3">
              <div>💬 Atendimentos: {agente.atendimentosMes} este mês</div>
              <div>
                🔄 Taxa Escalação: {agente.taxaEscalacao}%{' '}
                {agente.taxaEscalacao < 20 ? '🟢 Ótimo' : agente.taxaEscalacao < 30 ? '🟡 Bom' : '🔴 Alto'}
              </div>
              <div>😊 CSAT: {agente.csat}/5.0</div>
            </div>

            <div className="text-xs font-medium mb-3">
              ⚡ Status: {agente.status === 'ativo' ? '🟢 Ativo 24/7' : '🔴 PAUSADO'}
            </div>

            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                Configurar
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                🎓 Treinar
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                📊 Analytics
              </Button>
              <Button
                variant={agente.status === 'ativo' ? 'outline' : 'default'}
                size="sm"
                className="w-full"
              >
                {agente.status === 'ativo' ? '⏸️ Pausar' : '▶️ Ativar'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Aba: Automações
function AbaAutomacoes() {
  const ativas = automacoes.filter((a) => a.status === 'ativa');
  const pausadas = automacoes.filter((a) => a.status === 'pausada');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">⚡ Minhas Automações</h2>
        <Button>+ Criar Automação</Button>
      </div>

      <div className="flex gap-2">
        {['TODAS', 'MENSAGENS', 'TICKETS', 'CRM', 'NOTIFICAÇÕES', 'WORKFLOWS'].map((cat) => (
          <Button key={cat} variant="outline" size="sm">
            {cat}
          </Button>
        ))}
      </div>

      {/* Automações Ativas */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">🟢 ATIVAS ({ativas.length})</h3>
        <div className="space-y-4">
          {ativas.map((auto) => (
            <div key={auto.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <h4 className="font-bold text-gray-900">{auto.nome}</h4>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    ✏️
                  </Button>
                  <Button variant="ghost" size="sm">
                    ⏸️
                  </Button>
                  <Button variant="ghost" size="sm">
                    •••
                  </Button>
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-3">
                Categoria: {auto.categoria.charAt(0).toUpperCase() + auto.categoria.slice(1)} | Criada há{' '}
                {formatDistanceToNow(auto.criadaEm, { locale: ptBR })}
              </div>
              <div className="bg-gray-50 rounded p-3 mb-3 space-y-1 text-sm">
                <div>
                  <span className="font-medium">QUANDO:</span> {auto.gatilho}
                </div>
                <div>
                  <span className="font-medium">ENTÃO:</span> {auto.acao}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div>📊 Executada {auto.execucoesMes} vezes este mês</div>
                {auto.taxaSucesso && <div>✅ Taxa de sucesso: {auto.taxaSucesso}%</div>}
                {auto.taxaResposta && <div>✅ Taxa de resposta: {auto.taxaResposta}%</div>}
              </div>
              {auto.observacao && (
                <div className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  ⚠️ {auto.observacao}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Automações Pausadas */}
      {pausadas.length > 0 && (
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">🔴 PAUSADAS ({pausadas.length})</h3>
          <div className="space-y-4">
            {pausadas.map((auto) => (
              <div key={auto.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <h4 className="font-bold text-gray-900">{auto.nome}</h4>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      ✏️
                    </Button>
                    <Button variant="ghost" size="sm">
                      ▶️
                    </Button>
                    <Button variant="ghost" size="sm">
                      •••
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  Categoria: {auto.categoria.charAt(0).toUpperCase() + auto.categoria.slice(1)} | Pausada há{' '}
                  {formatDistanceToNow(auto.criadaEm, { locale: ptBR })}
                </div>
                <div className="bg-white rounded p-3 mb-3 space-y-1 text-sm">
                  <div>
                    <span className="font-medium">QUANDO:</span> {auto.gatilho}
                  </div>
                  <div>
                    <span className="font-medium">ENTÃO:</span> {auto.acao}
                  </div>
                </div>
                <div className="text-xs text-gray-600">⏸️ Pausada temporariamente</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// Aba: Base de Conhecimento
function AbaBaseConhecimento() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">📚 Base de Conhecimento</h2>
        <Button>+ Novo Artigo</Button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">📄 Total Artigos</div>
          <div className="text-3xl font-bold">{statusGeralIA.artigosBase}</div>
          <div className="text-xs text-gray-500 mt-1">+{statusGeralIA.artigosNovos} este mês</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">📊 Mais Acessado</div>
          <div className="text-lg font-bold">"Prazo Entrega"</div>
          <div className="text-xs text-gray-500 mt-1">(234 acessos)</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">⚠️ Gaps Detectados</div>
          <div className="text-3xl font-bold">{gapsDetectados.length}</div>
          <div className="text-xs text-red-600 mt-1">Crítico: 2</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">✅ Taxa Cobertura</div>
          <div className="text-3xl font-bold">78%</div>
          <div className="text-xs text-green-600 mt-1">↑ 12% vs mês</div>
        </Card>
      </div>

      {/* Busca e Filtros */}
      <Card className="p-4">
        <div className="flex gap-3">
          <Input placeholder="🔍 Buscar artigos..." className="flex-1" />
          <Button variant="outline">▼ Categoria</Button>
          <Button variant="outline">Status</Button>
        </div>
      </Card>

      {/* Categorias */}
      <div className="flex gap-2 flex-wrap">
        {['Todas (156)', 'Produtos (45)', 'Entrega (32)', 'Pagamento (28)', 'Política (23)', 'Técnico (18)', 'Outros (10)'].map(
          (cat) => (
            <Button key={cat} variant="outline" size="sm">
              {cat}
            </Button>
          )
        )}
      </div>

      {/* Artigos */}
      <div className="space-y-3">
        {artigosBase.map((artigo) => (
          <Card
            key={artigo.id}
            className={`p-4 ${artigo.precisaAtualizacao ? 'border-orange-300 bg-orange-50' : ''}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">📄 {artigo.titulo}</h3>
                  {artigo.precisaAtualizacao && (
                    <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">⚠️ PRECISA ATUALIZAÇÃO</span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Categoria: {artigo.categoria} | Atualizado há{' '}
                  {formatDistanceToNow(artigo.atualizadoEm, { locale: ptBR })}
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm">
                  ✏️
                </Button>
                <Button variant="ghost" size="sm">
                  🗑️
                </Button>
                <Button variant="ghost" size="sm">
                  •••
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
              <div>📊 {artigo.acessos} acessos</div>
              <div>🤖 Usada pela IA {artigo.usosIA}x</div>
              <div>✅ {artigo.resolutividade}% resolutividade</div>
              <div>
                😊 Feedback: {artigo.feedback}/5.0 ({artigo.avaliacoes} avaliações)
              </div>
            </div>

            <div className="text-sm text-gray-700 mb-3 bg-gray-50 p-2 rounded">
              Preview: {artigo.preview}
            </div>

            {artigo.precisaAtualizacao && artigo.motivoAtualizacao && (
              <div className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded mb-2">
                ⚠️ {artigo.motivoAtualizacao}
              </div>
            )}

            <Button variant="outline" size="sm">
              {artigo.precisaAtualizacao ? 'Melhorar Artigo Agora' : 'Ver Artigo Completo'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Aba: Treinamento
function AbaTreinamento() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">🎓 Treinamento da IA</h2>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">📚 Conversas para Treinar</div>
          <div className="text-3xl font-bold">87</div>
          <div className="text-xs text-gray-500 mt-1">Última semana</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">✅ Aprovadas</div>
          <div className="text-3xl font-bold">234</div>
          <div className="text-xs text-gray-500 mt-1">Total histórico</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">⚠️ Pendentes Revisão</div>
          <div className="text-3xl font-bold">45</div>
          <div className="text-xs text-gray-500 mt-1">Precisam atenção</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">❌ Rejeitadas</div>
          <div className="text-3xl font-bold">12</div>
          <div className="text-xs text-gray-500 mt-1">Não usar</div>
        </Card>
      </div>

      {/* Método de Treinamento */}
      <Card className="p-6">
        <h3 className="font-bold mb-4">🎯 Método de Treinamento</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input type="radio" name="metodo" defaultChecked />
            <span>● Automático (IA aprende com conversas bem avaliadas)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="metodo" />
            <span>○ Manual (revisar cada conversa antes de treinar)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="metodo" />
            <span>○ Híbrido (automático + revisão semanal)</span>
          </label>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
          <div className="font-medium mb-2">Critérios para treino automático:</div>
          <div className="space-y-1 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span>☑ CSAT ≥ 4.5 estrelas</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span>☑ Resolvido sem escalonamento</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span>☑ Sem reclamações do cliente</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Conversas Pendentes */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">📋 Conversas Pendentes de Revisão (45)</h3>
          <Button>Revisar Todas</Button>
        </div>
        <div className="space-y-4">
          {conversasTreinamento.map((conv) => (
            <div key={conv.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gray-900">
                    📄 Conversa #{conv.id} - "{conv.titulo}"
                  </h4>
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(conv.data, { locale: ptBR })} atrás | {conv.agente} |{' '}
                    {conv.escalada ? '⚠️ Escalada para humano' : '✅ Resolvida'}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded p-3 mb-3 space-y-2 text-sm">
                {conv.conversa.map((msg, i) => (
                  <div key={i}>
                    {msg.cliente && (
                      <div>
                        <span className="font-medium">Cliente:</span> "{msg.cliente}"
                      </div>
                    )}
                    {msg.ia && (
                      <div>
                        <span className="font-medium">IA:</span> "{msg.ia}"
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-600 mb-3">
                Resultado: {conv.resultado} | {conv.csat && `CSAT: ${conv.csat}/5`} | Confiança IA:{' '}
                {conv.confianciaIA}%
              </div>

              {conv.sugestaoIA && (
                <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3 text-sm">
                  💡 IA SUGERE: {conv.sugestaoIA}
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  ✅ Aprovar
                </Button>
                <Button size="sm" variant="outline">
                  ❌ Rejeitar
                </Button>
                <Button size="sm" variant="outline">
                  ✏️ Editar e Aprovar
                </Button>
                <Button size="sm" variant="outline">
                  ⏭️ Próxima
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Aba: Analytics
function AbaAnalytics() {
  const analytics = analyticsIA;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">📊 Analytics de IA e Automação</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Evolução da Performance */}
        <Card className="p-6">
          <h3 className="font-bold mb-4">📈 Evolução da Performance (Últimos 30 dias)</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-2">Taxa de Acerto</div>
              <div className="flex items-center gap-2">
                {analytics.evolucaoPerformance.taxaAcerto.map((val, i) => (
                  <div key={i} className="flex-1">
                    <div className="text-center mb-1 text-xs font-medium">{val}%</div>
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{ width: `${val}%` }} />
                    </div>
                    <div className="text-center mt-1 text-xs text-gray-500">
                      {analytics.evolucaoPerformance.labels[i]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-sm text-green-600">Taxa de acerto subiu de 82% para 87% (+5%)</div>
          </div>
        </Card>

        {/* Taxa de Resolução por Agente */}
        <Card className="p-6">
          <h3 className="font-bold mb-4">🎯 Taxa de Resolução por Agente</h3>
          <div className="space-y-3">
            {analytics.resolucaoPorAgente.map((agente) => (
              <div key={agente.agente}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{agente.agente}:</span>
                  <span className="text-sm font-medium">{agente.taxa}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${agente.taxa}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded">
            💡 Bot Técnico precisa mais treinamento
          </div>
        </Card>

        {/* ROI das Automações */}
        <Card className="p-6">
          <h3 className="font-bold mb-4">💰 ROI das Automações</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Economia total:</span>
              <span className="font-bold text-green-600">R$ {analytics.roi.economiaMes.toLocaleString()}/mês</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Custo da IA:</span>
              <span className="font-bold">R$ {analytics.roi.custoIA.toLocaleString()}/mês</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">ROI:</span>
              <span className="font-bold text-purple-600">{analytics.roi.roi.toLocaleString()}%</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Atendimentos IA:</span>
                <span>{analytics.roi.atendimentosIA}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">vs Custo humano:</span>
                <span>R$ {analytics.roi.custoHumano.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4">
            Ver Detalhamento
          </Button>
        </Card>

        {/* Artigos Mais Usados */}
        <Card className="p-6">
          <h3 className="font-bold mb-4">📚 Artigos Mais Usados</h3>
          <div className="space-y-2">
            {analytics.artigosMaisUsados.map((artigo, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  {i + 1}. "{artigo.titulo}"
                </span>
                <span className="font-medium">({artigo.usos}x)</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded">
            💡 Esses artigos economizam 67% do tempo
          </div>
        </Card>
      </div>

      {/* Automações Mais Executadas */}
      <Card className="p-6">
        <h3 className="font-bold mb-4">⚡ Automações Mais Executadas</h3>
        <div className="space-y-2">
          {analytics.automacoesExecutadas.map((auto, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-700">
                {i + 1}. {auto.nome}
              </span>
              <span className="font-bold text-purple-600">{auto.execucoes} execuções</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Aba: Configurações
function AbaConfiguracoes() {
  const config = configuracoesGerais;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">⚙️ Configurações Gerais de IA</h2>

      {/* Modelo de IA */}
      <Card className="p-6">
        <h3 className="font-bold mb-4">🤖 Modelo de IA</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="radio" name="modelo" defaultChecked={config.modeloIA === 'sonnet'} />
            <span>● Claude Sonnet 4.5 (Recomendado - Melhor custo-benefício)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="modelo" defaultChecked={config.modeloIA === 'opus'} />
            <span>○ Claude Opus 4 (Mais inteligente, mais caro)</span>
          </label>
        </div>
      </Card>

      {/* Configurações Globais */}
      <Card className="p-6">
        <h3 className="font-bold mb-4">🎯 Configurações Globais</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 block mb-2">
              Confiança mínima padrão: {config.confiancaMinima}% (0-100)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue={config.confiancaMinima}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700 block mb-2">
              Temperatura (criatividade): {config.temperatura} (0-1)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue={config.temperatura}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700 block mb-2">Máximo de tokens por resposta:</label>
            <Input type="number" defaultValue={config.maxTokens} />
          </div>
          <div className="space-y-2 pt-4 border-t">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={config.permitirEmojis} />
              <span>☑ Permitir IA usar emojis</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={config.permitirPerguntas} />
              <span>☑ Permitir IA fazer perguntas de esclarecimento</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={config.permitirOfertas} />
              <span>☐ Permitir IA oferecer produtos/serviços</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Logs e Auditoria */}
      <Card className="p-6">
        <h3 className="font-bold mb-4">📊 Logs e Auditoria</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked={config.logs.registrarDecisoes} />
            <span>☑ Registrar todas as decisões da IA</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked={config.logs.salvarConversas} />
            <span>☑ Salvar conversas completas</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked={config.logs.monitorarTempo} />
            <span>☑ Monitorar performance em tempo real</span>
          </label>
        </div>
        <div className="mt-4">
          <label className="text-sm text-gray-700 block mb-2">Retenção de logs:</label>
          <Input type="number" defaultValue={config.logs.retencaoDias} className="w-32" /> dias
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm">
            Ver Logs
          </Button>
          <Button variant="outline" size="sm">
            Exportar Dados
          </Button>
        </div>
      </Card>

      {/* Segurança */}
      <Card className="p-6">
        <h3 className="font-bold mb-4">🔐 Segurança</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked={config.seguranca.naoCompartilharSensiveis} />
            <span>☑ IA não pode compartilhar dados sensíveis (CPF, senhas, etc)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked={config.seguranca.naoFazerPromessas} />
            <span>☑ IA não pode fazer promessas financeiras sem aprovação</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked={config.seguranca.revisarPalavrasChave} />
            <span>☑ Revisar mensagens com palavras-chave sensíveis</span>
          </label>
        </div>
        <div className="mt-4">
          <label className="text-sm text-gray-700 block mb-2">Palavras bloqueadas:</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {config.seguranca.palavrasBloqueadas.map((palavra, i) => (
              <span key={i} className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                {palavra}
              </span>
            ))}
          </div>
          <Button variant="outline" size="sm">
            Gerenciar Lista
          </Button>
        </div>
      </Card>

      {/* Custos */}
      <Card className="p-6">
        <h3 className="font-bold mb-4">💰 Custos</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Custo médio por atendimento IA:</span>
            <span className="font-bold">R$ {config.custos.custoPorAtendimento.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Gasto total este mês:</span>
            <span className="font-bold text-orange-600">R$ {config.custos.gastoMes.toLocaleString()},00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Limite mensal:</span>
            <span className="font-bold">R$ {config.custos.limiteMensal.toLocaleString()},00</span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked={config.custos.alertar80} />
            <span>☑ Alertar quando atingir 80% do limite</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked={config.custos.pausarSeEstourar} />
            <span>☑ Pausar IA automaticamente se estourar limite</span>
          </label>
        </div>
        <Button variant="outline" size="sm" className="w-full mt-4">
          Ver Faturamento Detalhado
        </Button>
      </Card>

      <div className="flex justify-end">
        <Button size="lg">Salvar Configurações</Button>
      </div>
    </div>
  );
}
