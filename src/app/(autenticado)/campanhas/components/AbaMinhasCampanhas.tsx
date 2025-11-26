'use client';

'use client';

import { useState } from 'react';
import { Card } from '@/componentes/ui/card';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/componentes/ui/dialog';
import { 
  resumoCampanhas,
  engajamentoCanais,
  topCampanhas,
  alertas,
  atividadesRecentes,
  campanhasMockadas
} from '@/lib/mocks/campanhas';
import { 
  Search, 
  Settings, 
  Bell, 
  TrendingUp,
  Send,
  CheckCircle2,
  Eye,
  MessageCircle,
  Target,
  DollarSign,
  BarChart3,
  AlertCircle,
  Plus,
  ArrowRight,
  ArrowLeft,
  X,
  Mail,
  Users,
  MessageSquare
} from 'lucide-react';

function AbaMinhasCampanhas() {
  const [campanhaMonitorando, setCampanhaMonitorando] = useState<string | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<'todas' | 'ativa' | 'agendada' | 'pausada' | 'cancelada' | 'concluida'>('todas');
  const [filtroCanal, setFiltroCanal] = useState<'todos' | 'whatsapp' | 'email' | 'sms'>('todos');
  const [ordenacao, setOrdenacao] = useState<'recente' | 'antiga' | 'nome'>('recente');
  const [busca, setBusca] = useState('');

  // Filtrar e ordenar campanhas
  const campanhasFiltradas = campanhasMockadas
    .filter((campanha) => {
      // Filtro de status
      if (filtroStatus !== 'todas' && campanha.status !== filtroStatus) return false;
      
      // Filtro de busca
      if (busca && !campanha.nome.toLowerCase().includes(busca.toLowerCase())) return false;
      
      return true;
    })
    .sort((a, b) => {
      if (ordenacao === 'nome') {
        return a.nome.localeCompare(b.nome);
      }
      // Para data, usamos o campo criadoEm (assumindo formato de string de data)
      if (ordenacao === 'recente') {
        return b.criadoEm.localeCompare(a.criadoEm);
      }
      if (ordenacao === 'antiga') {
        return a.criadoEm.localeCompare(b.criadoEm);
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Modal de Monitoramento */}
      {campanhaMonitorando && (
        <ModalMonitoramentoCampanha
          campanha={campanhasMockadas.find(c => c.id === campanhaMonitorando)!}
          onFechar={() => setCampanhaMonitorando(null)}
        />
      )}

      {/* BARRA DE FILTROS */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="🔍 Buscar campanhas por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3">
            {/* Filtro de Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={filtroStatus === 'todas' ? 'default' : 'outline'}
                  onClick={() => setFiltroStatus('todas')}
                  className={filtroStatus === 'todas' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Todas
                </Button>
                <Button
                  size="sm"
                  variant={filtroStatus === 'ativa' ? 'default' : 'outline'}
                  onClick={() => setFiltroStatus('ativa')}
                  className={filtroStatus === 'ativa' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  🟢 Ativas
                </Button>
                <Button
                  size="sm"
                  variant={filtroStatus === 'agendada' ? 'default' : 'outline'}
                  onClick={() => setFiltroStatus('agendada')}
                  className={filtroStatus === 'agendada' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                >
                  🟡 Agendadas
                </Button>
                <Button
                  size="sm"
                  variant={filtroStatus === 'pausada' ? 'default' : 'outline'}
                  onClick={() => setFiltroStatus('pausada')}
                  className={filtroStatus === 'pausada' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                >
                  ⏸️ Pausadas
                </Button>
                <Button
                  size="sm"
                  variant={filtroStatus === 'cancelada' ? 'default' : 'outline'}
                  onClick={() => setFiltroStatus('cancelada')}
                  className={filtroStatus === 'cancelada' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  ❌ Canceladas
                </Button>
                <Button
                  size="sm"
                  variant={filtroStatus === 'concluida' ? 'default' : 'outline'}
                  onClick={() => setFiltroStatus('concluida')}
                  className={filtroStatus === 'concluida' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  🔵 Concluídas
                </Button>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-300" />

            {/* Filtro de Canal */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Canal:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={filtroCanal === 'todos' ? 'default' : 'outline'}
                  onClick={() => setFiltroCanal('todos')}
                  className={filtroCanal === 'todos' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Todos
                </Button>
                <Button
                  size="sm"
                  variant={filtroCanal === 'whatsapp' ? 'default' : 'outline'}
                  onClick={() => setFiltroCanal('whatsapp')}
                  className={filtroCanal === 'whatsapp' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  💚 WhatsApp
                </Button>
                <Button
                  size="sm"
                  variant={filtroCanal === 'email' ? 'default' : 'outline'}
                  onClick={() => setFiltroCanal('email')}
                  className={filtroCanal === 'email' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  📧 Email
                </Button>
                <Button
                  size="sm"
                  variant={filtroCanal === 'sms' ? 'default' : 'outline'}
                  onClick={() => setFiltroCanal('sms')}
                  className={filtroCanal === 'sms' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  📱 SMS
                </Button>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-300" />

            {/* Ordenação */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Ordenar:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={ordenacao === 'recente' ? 'default' : 'outline'}
                  onClick={() => setOrdenacao('recente')}
                  className={ordenacao === 'recente' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  📅 Mais Recentes
                </Button>
                <Button
                  size="sm"
                  variant={ordenacao === 'antiga' ? 'default' : 'outline'}
                  onClick={() => setOrdenacao('antiga')}
                  className={ordenacao === 'antiga' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  📅 Mais Antigas
                </Button>
                <Button
                  size="sm"
                  variant={ordenacao === 'nome' ? 'default' : 'outline'}
                  onClick={() => setOrdenacao('nome')}
                  className={ordenacao === 'nome' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  🔤 A-Z
                </Button>
              </div>
            </div>
          </div>

          {/* Contador de Resultados */}
          <div className="flex items-center justify-between border-t pt-3">
            <p className="text-sm text-gray-600">
              Exibindo <span className="font-semibold">{campanhasFiltradas.length}</span> de{' '}
              <span className="font-semibold">{campanhasMockadas.length}</span> campanhas
            </p>
            {(filtroStatus !== 'todas' || filtroCanal !== 'todos' || busca) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setFiltroStatus('todas');
                  setFiltroCanal('todos');
                  setBusca('');
                }}
              >
                🔄 Limpar Filtros
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* LISTA DE CAMPANHAS */}
      <div className="space-y-4">
        {campanhasFiltradas.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-gray-100 p-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Nenhuma campanha encontrada</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Tente ajustar os filtros ou fazer uma nova busca
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setFiltroStatus('todas');
                  setFiltroCanal('todos');
                  setBusca('');
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </Card>
        ) : (
          campanhasFiltradas.map((campanha) => (
            <Card key={campanha.id} className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${
                  campanha.status === 'ativa' ? 'bg-green-500' :
                  campanha.status === 'agendada' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <h4 className="text-lg font-semibold">{campanha.nome}</h4>
                {campanha.status === 'concluida' && campanha.metricas.taxaConversao >= 8 && (
                  <span className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 text-xs font-bold text-white">
                    🏆 MELHOR CAMPANHA
                  </span>
                )}
              </div>
            </div>

            <p className="mb-3 text-sm text-gray-600">
              Criada {campanha.criadoEm} | Status: {campanha.status}
            </p>

            {/* ESTRUTURA PADRONIZADA PARA TODOS OS STATUS */}
            <div>
              {/* Barra de Progresso (apenas para ativas) */}
              {campanha.status === 'ativa' && campanha.metricas.enviadas > 0 && (
                <>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium">📊 PROGRESSO:</p>
                    <p className="text-sm">
                      {campanha.metricas.enviadas} / {campanha.segmento.totalClientes} (
                      {Math.round((campanha.metricas.enviadas / campanha.segmento.totalClientes) * 100)}%)
                    </p>
                  </div>
                  <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                      style={{ width: `${(campanha.metricas.enviadas / campanha.segmento.totalClientes) * 100}%` }}
                    />
                  </div>
                </>
              )}

              {/* Informação de Agendamento (apenas para agendadas) */}
              {campanha.status === 'agendada' && (
                <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 p-3">
                  <p className="text-sm font-medium text-amber-800">
                    📅 Campanha agendada - Pronta para envio
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    Será enviada para {campanha.segmento.totalClientes} clientes
                  </p>
                </div>
              )}

              {/* Grid de Métricas (SEMPRE com 4 colunas) */}
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">✅ Entregues:</p>
                  <p className="font-semibold">
                    {campanha.status === 'agendada' ? '-' : `${campanha.metricas.entregues} (${campanha.metricas.taxaEntrega}%)`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">👁️ Abertas:</p>
                  <p className="font-semibold">
                    {campanha.status === 'agendada' ? '-' : `${campanha.metricas.abertas} (${campanha.metricas.taxaAbertura}%)`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">💬 Respostas:</p>
                  <p className="font-semibold">
                    {campanha.status === 'agendada' ? '-' : `${campanha.metricas.respostas} (${campanha.metricas.taxaResposta}%)`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">🎯 Conversões:</p>
                  <p className="font-semibold">
                    {campanha.status === 'agendada' ? '-' : `${campanha.metricas.conversoes} (${campanha.metricas.taxaConversao}%)`}
                  </p>
                </div>
              </div>

              {/* Receita (sempre visível quando houver) */}
              {campanha.metricas.receita > 0 && (
                <div className="mt-3">
                  <p className="text-sm">
                    💰 Receita: <span className="font-semibold text-green-600">R$ {campanha.metricas.receita.toLocaleString()}</span>
                  </p>
                </div>
              )}

              {/* Botões de Ação (diferentes por status) */}
              <div className="mt-4 flex gap-2">
                {campanha.status === 'ativa' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => setCampanhaMonitorando(campanha.id)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      📊 Ver Detalhes em Tempo Real
                    </Button>
                    <Button size="sm" variant="outline">
                      ⏸️ Pausar
                    </Button>
                  </>
                )}
                
                {campanha.status === 'agendada' && (
                  <>
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                      ✏️ Editar
                    </Button>
                    <Button size="sm" variant="outline">
                      🗑️ Cancelar
                    </Button>
                  </>
                )}
                
                {campanha.status === 'concluida' && (
                  <>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      📊 Ver Relatório Completo
                    </Button>
                    <Button size="sm" variant="outline">
                      🔄 Duplicar Campanha
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
          ))
        )}
      </div>
    </div>
  );
}

function ModalMonitoramentoCampanha({ campanha, onFechar }: { campanha: any; onFechar: () => void }) {
  return (
    <Dialog open={true} onOpenChange={onFechar}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              📊 Monitoramento em Tempo Real - {campanha.nome}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onFechar}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 p-6 font-mono text-sm text-green-400">
          <div className="mb-4 flex items-center justify-between border-b border-gray-700 pb-3">
            <span className="text-green-300">🚀 CAMPANHA EM EXECUÇÃO</span>
            <span className="animate-pulse text-yellow-400">● AO VIVO</span>
          </div>

          <div className="max-h-[500px] space-y-1 overflow-y-auto">
            <div className="text-gray-400">[14:30:01] Iniciando envio da campanha...</div>
            <div className="text-gray-400">[14:30:02] Conectando ao servidor WhatsApp...</div>
            <div className="text-green-400">[14:30:03] ✓ Conexão estabelecida</div>
            <div className="text-blue-400">[14:30:04] → Enviando para Maria Silva (+55 85 99999-1234)</div>
            <div className="text-green-400">[14:30:05] ✓ ENVIADO - Maria Silva</div>
            <div className="text-blue-400">[14:30:06] → Enviando para João Santos (+55 85 99999-5678)</div>
            <div className="text-green-400">[14:30:07] ✓ ENVIADO - João Santos</div>
            <div className="text-blue-400">[14:30:08] → Enviando para Ana Costa (+55 85 99999-9012)</div>
            <div className="text-green-400">[14:30:09] ✓ ENVIADO - Ana Costa</div>
            <div className="text-blue-400">[14:30:10] → Enviando para Pedro Oliveira (+55 85 99999-3456)</div>
            <div className="text-red-400">[14:30:11] ✗ FALHA - Pedro Oliveira (Número inválido)</div>
            <div className="text-blue-400">[14:30:12] → Enviando para Carla Mendes (+55 85 99999-7890)</div>
            <div className="text-green-400">[14:30:13] ✓ ENVIADO - Carla Mendes</div>
            <div className="text-gray-400">[14:30:14] Processando lote 1/25...</div>
            <div className="text-blue-400">[14:30:15] → Enviando para Lucas Fernandes (+55 85 99999-2345)</div>
            <div className="text-green-400">[14:30:16] ✓ ENVIADO - Lucas Fernandes</div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-4 border-t border-gray-700 pt-4">
            <div>
              <div className="text-xs text-gray-500">ENVIADAS</div>
              <div className="text-2xl font-bold text-white">856/1234</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">SUCESSO</div>
              <div className="text-2xl font-bold text-green-400">842</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">FALHAS</div>
              <div className="text-2xl font-bold text-red-400">14</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">TAXA</div>
              <div className="text-2xl font-bold text-blue-400">98.4%</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onFechar}>
            Fechar
          </Button>
          <Button variant="destructive">
            ⏸️ Pausar Envio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { AbaMinhasCampanhas };
