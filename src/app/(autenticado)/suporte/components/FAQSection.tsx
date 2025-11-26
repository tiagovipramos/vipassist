'use client';

import { Card } from '@/componentes/ui/card';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import {
  acoesRapidas,
  sugestoesAjuda,
  topicosPopulares,
  novidades,
} from '@/lib/mocks/suporte';

export function FAQSection() {
  return (
    <div className="space-y-6">
      {/* Busca Inteligente */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
          💡 COMO PODEMOS AJUDAR VOCÊ HOJE?
        </h2>
        <div className="flex gap-3">
          <Input
            placeholder="Buscar por problema, funcionalidade, erro..."
            className="flex-1 h-12 text-lg"
          />
          <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
            🔍 Buscar
          </Button>
        </div>
        <p className="text-sm text-gray-600 text-center mt-4">
          💡 <strong>Exemplos:</strong> "como conectar whatsapp", "erro ao enviar mensagem", 
          "configurar automação", "mudar senha"
        </p>
      </Card>

      {/* Sugestões para Você */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            🎯 SUGESTÕES PARA VOCÊ
          </h3>
          <span className="text-sm text-gray-500">(baseado no seu uso)</span>
        </div>
        <div className="space-y-3">
          {sugestoesAjuda.map((sugestao) => (
            <button
              key={sugestao.id}
              className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{sugestao.icone}</span>
                <div>
                  <p className="font-medium text-gray-900">{sugestao.titulo}</p>
                  <p className="text-sm text-gray-500">{sugestao.categoria}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Ações Rápidas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ AÇÕES RÁPIDAS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {acoesRapidas.map((acao) => (
            <Card key={acao.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center space-y-3">
                <div className="text-4xl">{acao.icone}</div>
                <h4 className="font-bold text-gray-900">{acao.titulo}</h4>
                <p className="text-sm text-gray-600">{acao.descricao}</p>
                <p className="text-xs text-blue-600 font-medium">⏰ {acao.tempo}</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  {acao.acao}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Tópicos Populares */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            🔥 TÓPICOS MAIS PROCURADOS
          </h3>
          <Button variant="outline" className="text-blue-600">
            VER TODOS
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topicosPopulares.map((topico) => (
            <Card key={topico.id} className="p-6 bg-gray-50 border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{topico.icone}</span>
                  <h4 className="font-bold text-gray-900">{topico.titulo}</h4>
                </div>
                <span className="text-sm text-gray-500">
                  👁️ {topico.visualizacoes.toLocaleString('pt-BR')} views
                </span>
              </div>
              <ul className="space-y-2 mb-4">
                {topico.itens.map((item, idx) => (
                  <li key={idx} className="text-gray-700 hover:text-blue-600 cursor-pointer">
                    • {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">
                VER GUIA COMPLETO
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      {/* Novidades */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            ✨ NOVIDADES E ATUALIZAÇÕES
          </h3>
          <Button variant="outline" className="text-blue-600">
            VER CHANGELOG
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {novidades.map((novidade) => (
            <Card key={novidade.id} className="p-6 bg-gray-50 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                  🆕 {novidade.data}
                </span>
                <h4 className="font-bold text-gray-900">Versão {novidade.versao}</h4>
              </div>
              <ul className="space-y-2 mb-3">
                {novidade.itens.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    {item.tipo === 'novo' && <span className="text-green-600">✅</span>}
                    {item.tipo === 'melhorado' && <span className="text-blue-600">⚡</span>}
                    {item.tipo === 'corrigido' && <span className="text-orange-600">🐛</span>}
                    {item.descricao}
                  </li>
                ))}
              </ul>
              <Button variant="link" className="text-blue-600 p-0 h-auto">
                VER DETALHES →
              </Button>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
