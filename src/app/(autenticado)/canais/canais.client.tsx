// ⚠️ TODO: Esta página precisa ser refatorada para o pattern Server + Client Component
// para adicionar metadata SEO. Ver exemplo em src/app/(autenticado)/chat/page.tsx
// Use: generatePageMetadata('canais') de src/lib/metadata/pages.ts

'use client';

import { useState } from 'react';
import { Card } from '@/componentes/ui/card';
import { Button } from '@/componentes/ui/button';
import { dadosCanaisIntegracoesMock } from '@/lib/mocks/canais';
import type { Canal, Integracao, Webhook, StatusSistema, Incidente } from '@/tipos/canais';

type AbaAtiva = 'canais' | 'integracoes' | 'webhooks' | 'api' | 'status';

export function CanaisClient() {
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('canais');
  const dados = dadosCanaisIntegracoesMock;

  // Filtrar canais
  const canaisAtivos = dados.canais.filter(c => c.status === 'online');
  const canaisDesconectados = dados.canais.filter(c => c.status === 'desconectado');
  const canaisDisponiveis = dados.canais.filter(c => c.status === 'disponivel');

  // Estatísticas gerais
  const totalMensagensHoje = dados.canais
    .filter(c => c.status === 'online')
    .reduce((acc, c) => acc + c.mensagensHoje, 0);
  const uptimeMedio = dados.canais
    .filter(c => c.status === 'online')
    .reduce((acc, c) => acc + c.uptime, 0) / canaisAtivos.length;
  const problemasCount = canaisDesconectados.length;

  return (
    <div className="h-full flex flex-col">
      {/* Abas */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex gap-1 overflow-x-auto">
          <button
            onClick={() => setAbaAtiva('canais')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              abaAtiva === 'canais'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📱 Canais
          </button>
          <button
            onClick={() => setAbaAtiva('integracoes')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              abaAtiva === 'integracoes'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🔗 Integrações
          </button>
          <button
            onClick={() => setAbaAtiva('webhooks')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              abaAtiva === 'webhooks'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🛠️ Webhooks
          </button>
          <button
            onClick={() => setAbaAtiva('api')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              abaAtiva === 'api'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            ⚙️ API
          </button>
          <button
            onClick={() => setAbaAtiva('status')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              abaAtiva === 'status'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📊 Status
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-auto p-6">
        {abaAtiva === 'canais' && (
        <AbaCanais
          canaisAtivos={canaisAtivos}
          canaisDesconectados={canaisDesconectados}
          canaisDisponiveis={canaisDisponiveis}
          totalMensagensHoje={totalMensagensHoje}
          uptimeMedio={uptimeMedio}
          problemasCount={problemasCount}
        />
      )}

      {abaAtiva === 'integracoes' && (
        <AbaIntegracoes integracoes={dados.integracoes} />
      )}

      {abaAtiva === 'webhooks' && (
        <AbaWebhooks webhooks={dados.webhooks} />
      )}

      {abaAtiva === 'api' && (
        <AbaAPI
          chavesAPI={dados.chavesAPI}
          endpoints={dados.endpointsAPI}
          usoAPI={dados.usoAPI}
        />
      )}

      {abaAtiva === 'status' && (
        <AbaStatus
          statusSistema={dados.statusSistema}
          incidentes={dados.incidentes}
        />
      )}
      </div>
    </div>
  );
}

// ===== ABA: CANAIS =====
function AbaCanais({
  canaisAtivos,
  canaisDesconectados,
  canaisDisponiveis,
  totalMensagensHoje,
  uptimeMedio,
  problemasCount,
}: {
  canaisAtivos: Canal[];
  canaisDesconectados: Canal[];
  canaisDisponiveis: Canal[];
  totalMensagensHoje: number;
  uptimeMedio: number;
  problemasCount: number;
}) {
  return (
    <div className="space-y-6">
      {/* Status Geral */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">📊 STATUS DOS CANAIS</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">📱 CANAIS ATIVOS</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">
              {canaisAtivos.length} / {canaisAtivos.length + canaisDesconectados.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">{problemasCount} desconectado</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600">💬 MENSAGENS HOJE</div>
            <div className="text-3xl font-bold text-green-600 mt-2">
              {totalMensagensHoje.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">↑ 15% vs ontem</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600">⚡ UPTIME MÉDIO</div>
            <div className="text-3xl font-bold text-purple-600 mt-2">
              {uptimeMedio.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Últimos 30 dias</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-sm text-gray-600">⚠️ PROBLEMAS</div>
            <div className="text-3xl font-bold text-red-600 mt-2">{problemasCount}</div>
            <div className="text-xs text-gray-500 mt-1">Instagram offline</div>
          </div>
        </div>
      </Card>

      {/* Canais Conectados */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-green-600">🟢 CONECTADOS ({canaisAtivos.length})</h2>
        <div className="grid grid-cols-4 gap-4">
          {canaisAtivos.map(canal => (
            <CardCanal key={canal.id} canal={canal} />
          ))}
        </div>
      </div>

      {/* Canais Desconectados */}
      {canaisDesconectados.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-red-600">
            🔴 DESCONECTADOS ({canaisDesconectados.length})
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {canaisDesconectados.map(canal => (
              <CardCanal key={canal.id} canal={canal} />
            ))}
          </div>
        </div>
      )}

      {/* Canais Disponíveis */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-600">
          ⚪ DISPONÍVEIS ({canaisDisponiveis.length})
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {canaisDisponiveis.map(canal => (
            <CardCanal key={canal.id} canal={canal} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CardCanal({ canal }: { canal: Canal }) {
  const statusColor = {
    online: 'bg-green-500',
    desconectado: 'bg-red-500',
    offline: 'bg-red-500',
    disponivel: 'bg-gray-400',
  };

  const statusTexto = {
    online: '✅ Conectado',
    desconectado: '❌ Desconectado',
    offline: '❌ Offline',
    disponivel: '📱 Não conectado',
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="text-3xl">{canal.logo}</div>
        <div className={`w-3 h-3 rounded-full ${statusColor[canal.status]}`} />
      </div>

      <h3 className="font-semibold text-gray-900 mb-1">{canal.nome}</h3>
      <div className="text-sm text-gray-600 mb-3">{statusTexto[canal.status]}</div>

      {canal.identificador && (
        <div className="text-sm text-gray-600 mb-2">📱 {canal.identificador}</div>
      )}

      {canal.status === 'online' && (
        <>
          <div className="text-sm text-gray-600 mb-1">
            💬 Volume: {canal.mensagensHoje} msgs/dia
          </div>
          <div className="text-xs text-gray-500 mb-2">({canal.percentualTotal}% do total)</div>

          <div className="text-sm text-gray-600 mb-1">
            ⏱️ Uptime: {canal.uptime}% (30d)
          </div>

          <div className="text-sm text-gray-600 mb-3">🔄 Última sync: {canal.ultimaSync}</div>

          <div className="space-y-1">
            <Button size="sm" className="w-full text-xs">⚙️ CONFIGURAR</Button>
            <Button size="sm" variant="outline" className="w-full text-xs">📊 ANALYTICS</Button>
          </div>
        </>
      )}

      {canal.status === 'desconectado' && (
        <>
          <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
            <div className="text-sm text-red-700">⚠️ Problema: {canal.problemas}</div>
            <div className="text-xs text-red-600 mt-1">🕐 Offline há: {canal.offlineHa}</div>
            <div className="text-xs text-red-600">💬 Msgs perdidas: ~{canal.mensagensPerdidas}</div>
          </div>

          <div className="space-y-1">
            <Button size="sm" className="w-full text-xs bg-red-600 hover:bg-red-700">
              🔗 RECONECTAR
            </Button>
            <Button size="sm" variant="outline" className="w-full text-xs">📋 VER GUIA</Button>
          </div>
        </>
      )}

      {canal.status === 'disponivel' && (
        <>
          <div className="text-sm text-gray-600 mb-2">{canal.descricao}</div>
          {canal.preco && (
            <div className="text-sm font-medium text-blue-600 mb-3">{canal.preco}</div>
          )}

          <div className="space-y-1">
            <Button size="sm" className="w-full text-xs">+ CONECTAR</Button>
            <Button size="sm" variant="outline" className="w-full text-xs">📋 SAIBA MAIS</Button>
          </div>
        </>
      )}
    </Card>
  );
}

// ===== ABA: INTEGRAÇÕES =====
function AbaIntegracoes({ integracoes }: { integracoes: Integracao[] }) {
  const conectadas = integracoes.filter(i => i.status === 'conectada');
  const disponiveis = integracoes.filter(i => i.status === 'desconectada');

  const porTipo = {
    crm: disponiveis.filter(i => i.tipo === 'crm'),
    ecommerce: disponiveis.filter(i => i.tipo === 'ecommerce'),
    pagamento: disponiveis.filter(i => i.tipo === 'pagamento'),
    produtividade: disponiveis.filter(i => i.tipo === 'produtividade'),
    marketing: disponiveis.filter(i => i.tipo === 'marketing'),
  };

  return (
    <div className="space-y-6">
      {/* Conectadas */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-green-600">
          🟢 CONECTADAS ({conectadas.length})
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {conectadas.map(integracao => (
            <CardIntegracao key={integracao.id} integracao={integracao} />
          ))}
        </div>
      </div>

      {/* Disponíveis por Categoria */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-600">⚪ DISPONÍVEIS</h2>

        {/* CRM */}
        {porTipo.crm.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-medium mb-3 text-gray-700">🏪 CRM & VENDAS</h3>
            <div className="grid grid-cols-3 gap-4">
              {porTipo.crm.map(int => (
                <CardIntegracao key={int.id} integracao={int} />
              ))}
            </div>
          </div>
        )}

        {/* E-commerce */}
        {porTipo.ecommerce.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-medium mb-3 text-gray-700">🛒 E-COMMERCE</h3>
            <div className="grid grid-cols-3 gap-4">
              {porTipo.ecommerce.map(int => (
                <CardIntegracao key={int.id} integracao={int} />
              ))}
            </div>
          </div>
        )}

        {/* Pagamentos */}
        {porTipo.pagamento.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-medium mb-3 text-gray-700">💳 PAGAMENTOS</h3>
            <div className="grid grid-cols-3 gap-4">
              {porTipo.pagamento.map(int => (
                <CardIntegracao key={int.id} integracao={int} />
              ))}
            </div>
          </div>
        )}

        {/* Marketing */}
        {porTipo.marketing.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-medium mb-3 text-gray-700">📧 MARKETING</h3>
            <div className="grid grid-cols-3 gap-4">
              {porTipo.marketing.map(int => (
                <CardIntegracao key={int.id} integracao={int} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CardIntegracao({ integracao }: { integracao: Integracao }) {
  const statusColor = integracao.status === 'conectada' ? 'bg-green-500' : 'bg-gray-400';
  const isConectada = integracao.status === 'conectada';

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="text-3xl">{integracao.logo}</div>
        <div className={`w-3 h-3 rounded-full ${statusColor}`} />
      </div>

      <h3 className="font-semibold text-gray-900 mb-1">{integracao.nome}</h3>
      <div className="text-sm text-gray-600 mb-3">
        {isConectada ? '✅ Conectado' : '📱 Não conectado'}
      </div>

      <div className="text-sm text-gray-600 mb-3">{integracao.descricao}</div>

      {isConectada && integracao.ultimaSync && (
        <div className="text-sm text-gray-600 mb-3">🔄 Última sync: {integracao.ultimaSync}</div>
      )}

      {!isConectada && integracao.preco && (
        <div className="text-sm text-blue-600 mb-3">{integracao.preco}</div>
      )}

      <div className="space-y-1">
        {isConectada ? (
          <>
            <Button size="sm" className="w-full text-xs">⚙️ CONFIGURAR</Button>
            <Button size="sm" variant="outline" className="w-full text-xs text-red-600">
              🗑️ DESCONECTAR
            </Button>
          </>
        ) : (
          <Button size="sm" className="w-full text-xs">+ CONECTAR</Button>
        )}
      </div>
    </Card>
  );
}

// ===== ABA: WEBHOOKS =====
function AbaWebhooks({ webhooks }: { webhooks: Webhook[] }) {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold mb-2">💡 O QUE SÃO WEBHOOKS?</h2>
        <p className="text-sm text-gray-700 mb-3">
          Webhooks permitem que você receba notificações em tempo real quando eventos acontecem no
          EPIC (nova mensagem, ticket criado, etc).
        </p>
        <p className="text-sm text-gray-700 mb-4">
          Use para integrar o EPIC com sistemas externos ou criar automações personalizadas.
        </p>
        <Button size="sm" variant="outline">📚 VER DOCUMENTAÇÃO</Button>
      </Card>

      {/* Lista de Webhooks */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">📋 WEBHOOKS ATIVOS ({webhooks.length})</h2>
          <Button size="sm">+ CRIAR WEBHOOK</Button>
        </div>

        <div className="space-y-4">
          {webhooks.map(webhook => (
            <CardWebhook key={webhook.id} webhook={webhook} />
          ))}
        </div>
      </Card>
    </div>
  );
}

function CardWebhook({ webhook }: { webhook: Webhook }) {
  const statusColor = webhook.status === 'ativo' ? 'bg-green-500' : 'bg-red-500';

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${statusColor}`} />
            <h3 className="font-semibold text-gray-900">{webhook.nome}</h3>
          </div>
          <div className="text-sm text-gray-600 mb-2 font-mono">{webhook.url}</div>
          <div className="text-sm text-gray-600 mb-2">
            Eventos: {webhook.eventos.join(', ')}
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">✏️</Button>
          <Button size="sm" variant="outline">🗑️</Button>
        </div>
      </div>

      <div className="bg-gray-50 rounded p-3 mb-3">
        <div className="text-sm font-medium mb-2">📊 Status:</div>
        {webhook.status === 'ativo' ? (
          <>
            <div className="text-sm text-gray-700">
              ✅ Ativo | {webhook.estatisticas.requisicoesHoje} requisições hoje |{' '}
              {webhook.estatisticas.taxaSucesso}% sucesso
            </div>
            {webhook.ultimaChamada && (
              <div className="text-sm text-gray-600">
                Última chamada: {webhook.ultimaChamada.quando} ({webhook.ultimaChamada.statusCode}{' '}
                OK)
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-sm text-red-700">
              ❌ Falha | {webhook.estatisticas.requisicoesHoje} requisições hoje
            </div>
            {webhook.ultimaChamada && (
              <div className="text-sm text-red-600">
                Última chamada: {webhook.ultimaChamada.quando} ({webhook.ultimaChamada.statusCode}{' '}
                Internal Server Error)
              </div>
            )}
            {webhook.erro && (
              <div className="text-sm text-red-600 mt-2">⚠️ {webhook.erro}</div>
            )}
          </>
        )}
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="text-xs">🧪 TESTAR</Button>
        <Button size="sm" variant="outline" className="text-xs">📊 VER LOGS</Button>
        {webhook.status === 'erro' && (
          <Button size="sm" variant="outline" className="text-xs text-orange-600">
            🔄 REATIVAR
          </Button>
        )}
      </div>
    </Card>
  );
}

// ===== ABA: API =====
function AbaAPI({
  chavesAPI,
  endpoints,
  usoAPI,
}: {
  chavesAPI: any[];
  endpoints: any;
  usoAPI: any;
}) {
  return (
    <div className="space-y-6">
      {/* Chaves de API */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">🔑 SUAS CHAVES DE API</h2>
          <Button size="sm">+ GERAR NOVA CHAVE</Button>
        </div>

        <div className="space-y-4">
          {chavesAPI.map(chave => (
            <Card key={chave.id} className="p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">🔑 {chave.nome}</h3>
                  <div className="text-sm text-gray-600 font-mono mb-2">{chave.chave}</div>
                  <div className="text-sm text-gray-600">
                    Criada em: {chave.criadaEm} | Último uso: {chave.ultimoUso}
                  </div>
                  <div className="text-sm text-gray-600">
                    Requisições hoje: {chave.requisicoesHoje}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    Permissões: {chave.permissoes.leitura ? '✅ Leitura' : '❌ Leitura'} |{' '}
                    {chave.permissoes.escrita ? '✅ Escrita' : '❌ Escrita'}
                  </div>
                </div>
                <Button size="sm" variant="outline">🗑️</Button>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs">📋 COPIAR</Button>
                <Button size="sm" variant="outline" className="text-xs">🔄 REGENERAR</Button>
                <Button size="sm" variant="outline" className="text-xs">⚙️ EDITAR PERMISSÕES</Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Documentação */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">📚 DOCUMENTAÇÃO DA API</h2>

        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Base URL:</div>
          <div className="font-mono text-sm bg-gray-100 p-2 rounded">
            https://api.epic.com/v1
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">💬 MENSAGENS:</h3>
            <div className="space-y-1">
              {endpoints.mensagens.map((ep: any, idx: number) => (
                <div key={idx} className="text-sm text-gray-700 flex gap-2">
                  <span className="font-mono font-semibold text-blue-600">{ep.metodo}</span>
                  <span className="font-mono">{ep.caminho}</span>
                  <span className="text-gray-500">- {ep.descricao}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">🎫 TICKETS:</h3>
            <div className="space-y-1">
              {endpoints.tickets.map((ep: any, idx: number) => (
                <div key={idx} className="text-sm text-gray-700 flex gap-2">
                  <span className="font-mono font-semibold text-blue-600">{ep.metodo}</span>
                  <span className="font-mono">{ep.caminho}</span>
                  <span className="text-gray-500">- {ep.descricao}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">👥 CLIENTES:</h3>
            <div className="space-y-1">
              {endpoints.clientes.map((ep: any, idx: number) => (
                <div key={idx} className="text-sm text-gray-700 flex gap-2">
                  <span className="font-mono font-semibold text-blue-600">{ep.metodo}</span>
                  <span className="font-mono">{ep.caminho}</span>
                  <span className="text-gray-500">- {ep.descricao}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button size="sm">📖 VER DOCUMENTAÇÃO COMPLETA</Button>
          <Button size="sm" variant="outline">🧪 TESTAR NO POSTMAN</Button>
        </div>
      </Card>

      {/* Uso da API */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">📊 USO DA API (Últimos 30 dias)</h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">Total de requisições</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {usoAPI.totalRequisicoes.toLocaleString()}
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-600">✅ Sucessos</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {usoAPI.sucessos.toLocaleString()}
            </div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-sm text-gray-600">❌ Erros</div>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {usoAPI.erros.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="text-sm text-gray-700">
            Endpoint mais usado: <span className="font-mono">{usoAPI.endpointMaisUsado.endpoint}</span>
          </div>
          <div className="text-sm text-gray-700">
            Latência média: {usoAPI.latenciaMedia}ms
          </div>
        </div>

        <Button size="sm">VER ANALYTICS COMPLETOS</Button>
      </Card>
    </div>
  );
}

// ===== ABA: STATUS =====
function AbaStatus({
  statusSistema,
  incidentes,
}: {
  statusSistema: StatusSistema;
  incidentes: Incidente[];
}) {
  return (
    <div className="space-y-6">
      {/* Status Geral */}
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-green-900">🌐 STATUS GERAL DO SISTEMA</h2>
            <p className="text-sm text-green-700 mt-1">✅ Todos os sistemas operacionais</p>
          </div>
          <Button size="sm" variant="outline">🔄 ATUALIZAR</Button>
        </div>
        <div className="text-xs text-green-600 mt-3">
          Última atualização: há 30 segundos
        </div>
      </Card>

      {/* Canais */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">📱 CANAIS DE COMUNICAÇÃO</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">CANAL</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">STATUS</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">UPTIME (30D)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">LATÊNCIA</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ÚLTIMA ATIV.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statusSistema.canal.map((canal, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 text-sm">
                    {canal.tipo} {canal.nome}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {canal.status === 'online' ? (
                      <span className="text-green-600">🟢 Online</span>
                    ) : (
                      <span className="text-red-600">🔴 Offline</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{canal.uptime}%</td>
                  <td className="px-4 py-3 text-sm">{canal.latencia}</td>
                  <td className="px-4 py-3 text-sm">{canal.ultimaAtividade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {statusSistema.canal.some(c => c.status === 'offline') && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-700">
              ⚠️ Instagram está offline há 3 horas.{' '}
              <button className="font-semibold underline">RECONECTAR AGORA</button>
            </p>
          </div>
        )}
      </Card>

      {/* Integrações */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">🔗 INTEGRAÇÕES EXTERNAS</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">INTEGRAÇÃO</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">STATUS</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">SYNC (30D)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ÚLTIMA SYNC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statusSistema.integracoes.map((int, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 text-sm">{int.nome}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="text-green-600">🟢 Online</span>
                  </td>
                  <td className="px-4 py-3 text-sm">{int.syncRate}%</td>
                  <td className="px-4 py-3 text-sm">{int.ultimaSync}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Webhooks */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">🛠️ WEBHOOKS</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">WEBHOOK</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">STATUS</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">SUCESSO</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ÚLTIMA CHAMA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {statusSistema.webhooks.map((wh, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 text-sm">{wh.nome}</td>
                  <td className="px-4 py-3 text-sm">
                    {wh.status === 'online' ? (
                      <span className="text-green-600">🟢 Online</span>
                    ) : (
                      <span className="text-red-600">🔴 Erro</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{wh.taxaSucesso}%</td>
                  <td className="px-4 py-3 text-sm">{wh.ultimaChamada}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Histórico de Incidentes */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">📊 HISTÓRICO DE INCIDENTES</h2>
        <div className="space-y-4">
          {incidentes.map((inc) => (
            <div
              key={inc.id}
              className={`p-4 rounded-lg border ${
                inc.resolvido ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {inc.tipo === 'incidente' ? (
                    <span className="text-red-600">🔴</span>
                  ) : (
                    <span className="text-yellow-600">🟡</span>
                  )}
                  <div>
                    <div className="font-semibold text-gray-900">{inc.servico}</div>
                    <div className="text-sm text-gray-600">{inc.data}</div>
                  </div>
                </div>
                {!inc.resolvido && (
                  <Button size="sm" variant="outline">RESOLVER</Button>
                )}
              </div>
              <div className="text-sm text-gray-700 mb-1">
                {inc.tipo === 'incidente' ? '🔴 Incidente' : '🟡 Degradação'}: {inc.descricao}
              </div>
              <div className="text-sm text-gray-600">
                Duração: {inc.duracao} {inc.resolvido && '(resolvido)'}
              </div>
              {!inc.resolvido && (
                <div className="mt-2">
                  <Button size="sm" variant="outline" className="text-xs">VER DETALHES</Button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button size="sm" variant="outline">VER HISTÓRICO COMPLETO (30 DIAS)</Button>
        </div>
      </Card>
    </div>
  );
}
