'use client'

import { useState } from 'react'
import { useInboxStore } from '@/stores/inboxStore'
import { Button } from '@/componentes/ui/button'

/**
 * AICopilot - Painel Lateral de IA
 * 
 * Responsabilidades:
 * - Exibir ferramentas de IA
 * - Permitir geração de respostas inteligentes
 * - Análise de sentimento e resumos
 */
export function AICopilot() {
  const { mostrarCopilotIA, toggleCopilotIA, conversaSelecionada } = useInboxStore()
  const [carregandoIA, setCarregandoIA] = useState(false)
  const [resultadoIA, setResultadoIA] = useState<string>('')

  // Não renderiza se estiver oculto
  if (!mostrarCopilotIA) return null

  const executarIA = async (tipo: string, funcao: () => Promise<string>) => {
    setCarregandoIA(true)
    setResultadoIA('')
    try {
      const resultado = await funcao()
      setResultadoIA(resultado)
    } finally {
      setCarregandoIA(false)
    }
  }

  const sugerirResposta = async () => {
    await executarIA('sugerir', async () => {
      await new Promise(resolve => setTimeout(resolve, 1200))
      return `Olá ${conversaSelecionada?.clienteNome}! 👋

Entendi sua questão. Vou te ajudar com isso!

Com base na sua última mensagem, sugiro que façamos o seguinte:
1. Verificar a disponibilidade do produto
2. Enviar uma proposta personalizada
3. Agendar uma demonstração, se necessário

O que acha? Posso prosseguir? 😊`
    })
  }

  const resumirConversa = async () => {
    await executarIA('resumir', async () => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      return `📝 RESUMO DA CONVERSA:
      
Cliente: ${conversaSelecionada?.clienteNome}
Total de mensagens: ${conversaSelecionada?.mensagens.length}
Status: Conversa ativa sobre produtos/serviços

Principais pontos:
• Cliente demonstrou interesse inicial
• Solicitou informações sobre preços
• Aguardando resposta sobre condições de pagamento

Próximos passos sugeridos:
• Enviar proposta comercial
• Agendar follow-up em 24h`
    })
  }

  const analisarSentimento = async () => {
    await executarIA('sentimento', async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return `😊 ANÁLISE DE SENTIMENTO:

Cliente: ${conversaSelecionada?.clienteNome}
Humor detectado: Positivo ✅
Nível de satisfação: Alto (8.5/10)
Tom da conversa: Profissional e cordial

Recomendações:
• Manter o tom atual de atendimento
• Cliente receptivo a propostas
• Boa oportunidade para upsell

Status: Cliente engajado e satisfeito! 🎯`
    })
  }

  const traduzirMensagem = async () => {
    await executarIA('traduzir', async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      const ultimaMsgCliente = conversaSelecionada?.mensagens
        .filter(m => m.remetente === 'cliente')
        .slice(-1)[0]?.conteudo || ''
      return `🌐 Tradução (EN → PT):
"${ultimaMsgCliente}"

→ [Tradução seria inserida aqui]

Idiomas suportados: 100+`
    })
  }

  const copiarParaArea = () => {
    if (resultadoIA) {
      navigator.clipboard.writeText(resultadoIA)
      alert('✅ Copiado para área de transferência!')
    }
  }

  return (
    <aside className="w-96 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Copilot de IA</h2>
            <p className="text-xs text-gray-500">Assistente Inteligente</p>
          </div>
        </div>
        <button
          onClick={toggleCopilotIA}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
      </header>

      {/* Ferramentas de IA */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          <button
            onClick={sugerirResposta}
            disabled={carregandoIA}
            className="w-full text-left p-4 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">✍️</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  Sugerir Resposta
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  IA sugere a melhor resposta baseada no contexto
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={resumirConversa}
            disabled={carregandoIA}
            className="w-full text-left p-4 hover:bg-purple-50 rounded-lg transition-colors border border-gray-200 group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">📝</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600">
                  Resumir Conversa
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Resumo inteligente de toda a conversa
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={analisarSentimento}
            disabled={carregandoIA}
            className="w-full text-left p-4 hover:bg-yellow-50 rounded-lg transition-colors border border-gray-200 group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">😊</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-yellow-600">
                  Analisar Sentimento
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Detecta humor e satisfação do cliente
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={traduzirMensagem}
            disabled={carregandoIA}
            className="w-full text-left p-4 hover:bg-indigo-50 rounded-lg transition-colors border border-gray-200 group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌐</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                  Traduzir Mensagem
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Tradução automática em 100+ idiomas
                </p>
              </div>
            </div>
          </button>

          {/* Resultado da IA */}
          {carregandoIA && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="animate-spin text-2xl">⏳</div>
                <p className="text-sm text-gray-600">Processando com IA...</p>
              </div>
            </div>
          )}

          {resultadoIA && !carregandoIA && (
            <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-blue-700">✨ RESULTADO:</p>
                <Button size="sm" variant="outline" onClick={copiarParaArea}>
                  📋 Copiar
                </Button>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200 max-h-96 overflow-y-auto">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap font-sans">
                  {resultadoIA}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
