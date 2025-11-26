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

function AbaVisaoGeral() {
  return (
    <div className="space-y-6">
      {/* CARDS DE MÉTRICAS */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Campanhas Ativas</p>
            <Send className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold">{resumoCampanhas.campanhasAtivas}</p>
          <p className="mt-2 flex items-center text-xs text-green-600">
            <TrendingUp className="mr-1 h-3 w-3" />
            +{resumoCampanhas.tendencias.campanhasAtivas} este mês
          </p>
        </Card>

        <Card className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Mensagens Enviadas</p>
            <MessageCircle className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold">{resumoCampanhas.mensagensEnviadas.toLocaleString()}</p>
          <p className="mt-2 flex items-center text-xs text-green-600">
            <TrendingUp className="mr-1 h-3 w-3" />
            ↑ {resumoCampanhas.tendencias.mensagensEnviadas}% vs mês anterior
          </p>
        </Card>

        <Card className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Taxa Entrega</p>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold">{resumoCampanhas.taxaEntrega}%</p>
          <p className="mt-2 text-xs text-gray-600">🟢 Meta: &gt;95%</p>
        </Card>

        <Card className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Taxa Abertura</p>
            <Eye className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold">{resumoCampanhas.taxaAbertura}%</p>
          <p className="mt-2 flex items-center text-xs text-green-600">
            <TrendingUp className="mr-1 h-3 w-3" />
            ↑ {resumoCampanhas.tendencias.taxaAbertura}% vs mês anterior
          </p>
        </Card>

        <Card className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Taxa Resposta</p>
            <MessageCircle className="h-5 w-5 text-cyan-500" />
          </div>
          <p className="text-3xl font-bold">{resumoCampanhas.taxaResposta}%</p>
          <p className="mt-2 flex items-center text-xs text-green-600">
            <TrendingUp className="mr-1 h-3 w-3" />
            ↑ {resumoCampanhas.tendencias.taxaResposta}% vs mês anterior
          </p>
        </Card>

        <Card className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Taxa Conversão</p>
            <Target className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold">{resumoCampanhas.taxaConversao}%</p>
          <p className="mt-2 flex items-center text-xs text-green-600">
            <TrendingUp className="mr-1 h-3 w-3" />
            ↑ {resumoCampanhas.tendencias.taxaConversao}% vs mês anterior
          </p>
        </Card>

        <Card className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Receita Gerada</p>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold">R$ {resumoCampanhas.receitaGerada.toLocaleString()}</p>
          <p className="mt-2 flex items-center text-xs text-green-600">
            <TrendingUp className="mr-1 h-3 w-3" />
            ↑ R$ {resumoCampanhas.tendencias.receitaGerada.toLocaleString()} vs mês anterior
          </p>
        </Card>

        <Card className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Custo por Envio</p>
            <DollarSign className="h-5 w-5 text-gray-500" />
          </div>
          <p className="text-3xl font-bold">R$ {resumoCampanhas.custoPorEnvio.toFixed(2)}</p>
          <p className="mt-2 text-xs text-gray-600">Estável</p>
        </Card>
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">💬 Engajamento por Canal</h3>
          <div className="space-y-4">
            {engajamentoCanais.map((canal) => (
              <div key={canal.canal}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    {canal.canal === 'whatsapp' && <span className="text-green-600">💚 WhatsApp</span>}
                    {canal.canal === 'email' && <span className="text-blue-600">📧 Email</span>}
                    {canal.canal === 'sms' && <span className="text-purple-600">📱 SMS</span>}
                  </span>
                  <span className="font-semibold">{canal.taxaAbertura}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full ${
                      canal.canal === 'whatsapp'
                        ? 'bg-green-500'
                        : canal.canal === 'email'
                        ? 'bg-blue-500'
                        : 'bg-purple-500'
                    }`}
                    style={{ width: `${canal.taxaAbertura}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  {canal.envios.toLocaleString()} envios
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-blue-50 p-3">
            <p className="text-sm text-blue-700">💡 WhatsApp tem melhor engajamento</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">🎯 Top 5 Campanhas</h3>
            <span className="text-sm text-gray-600">(Por conversão)</span>
          </div>
          <div className="space-y-3">
            {topCampanhas.map((camp, idx) => (
              <div key={camp.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-medium">{camp.nome}</p>
                    <p className="text-xs text-gray-600">
                      Conversão: {camp.conversao}% | ROI: {camp.roi}%
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-green-600">
                  R$ {camp.receita.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4 w-full">
            Ver Ranking Completo
          </Button>
        </Card>
      </div>

      {/* ALERTAS E ATIVIDADES */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">⚠️ Alertas e Pendências</h3>
          <div className="space-y-3">
            {alertas.map((alerta) => (
              <div
                key={alerta.id}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  alerta.tipo === 'error'
                    ? 'border-red-200 bg-red-50'
                    : alerta.tipo === 'warning'
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full p-1 ${
                      alerta.tipo === 'error'
                        ? 'bg-red-100 text-red-600'
                        : alerta.tipo === 'warning'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {alerta.quantidade} {alerta.mensagem}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  {alerta.acao}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">📋 Atividade Recente</h3>
            <Button variant="ghost" size="sm">
              Ver Todas
            </Button>
          </div>
          <div className="space-y-4">
            {atividadesRecentes.map((ativ) => (
              <div key={ativ.id} className="border-l-4 border-purple-500 pl-4">
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      ativ.tipo === 'enviada'
                        ? 'bg-green-500'
                        : ativ.tipo === 'agendada'
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <span className="text-xs text-gray-600">{ativ.data}</span>
                  <span className="text-sm font-semibold">"{ativ.campanhaNome}"</span>
                </div>
                <p className="text-sm text-gray-600">
                  {ativ.tipo === 'agendada' ? 'Será enviada para' : 'Enviada para'} {ativ.destinatarios.toLocaleString()} clientes
                </p>
                {ativ.metricas && (
                  <p className="mt-1 text-xs text-gray-600">
                    📊 Entrega: {ativ.metricas.entrega}% | Abertura: {ativ.metricas.abertura}% | Conversão: {ativ.metricas.conversao}%
                    {ativ.metricas.receita && ` | 💰 R$ ${ativ.metricas.receita.toLocaleString()}`}
                  </p>
                )}
                <Button variant="link" size="sm" className="mt-1 p-0">
                  {ativ.tipo === 'agendada' ? 'Editar' : 'Ver Resultados'}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export { AbaVisaoGeral };
