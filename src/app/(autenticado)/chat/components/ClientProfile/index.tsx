'use client'

import { useState } from 'react'
import { useInboxStore } from '@/stores/inboxStore'
import { Button } from '@/componentes/ui/button'
import { format } from 'date-fns'
import { ChevronDown } from 'lucide-react'

/**
 * ClientProfile - Perfil do Cliente (Sidebar direita)
 * 
 * Responsabilidades:
 * - Exibir informações do cliente
 * - Mostrar insights de IA
 * - Gerenciar histórico de anotações
 */
export function ClientProfile() {
  const { conversaSelecionada, mostrarPerfilCliente, togglePerfilCliente } = useInboxStore()
  const [novaAnotacao, setNovaAnotacao] = useState('')
  const [mostrarInsights, setMostrarInsights] = useState(false)
  const [mostrarHistorico, setMostrarHistorico] = useState(false)
  const [historico, setHistorico] = useState<Array<{
    id: number
    texto: string
    data: Date
    atendente: string
  }>>([
    {
      id: 1,
      texto: 'Cliente demonstrou interesse em produtos premium. Agendada reunião para próxima semana.',
      data: new Date('2024-01-15T10:30:00'),
      atendente: 'Maria Silva'
    },
    {
      id: 2,
      texto: 'Solicitou desconto de 15%. Aprovado pelo supervisor.',
      data: new Date('2024-01-10T14:20:00'),
      atendente: 'João Santos'
    }
  ])

  // Adicionar nova anotação
  const handleAddAnotacao = () => {
    if (!novaAnotacao.trim()) return

    setHistorico(prev => [
      {
        id: prev.length + 1,
        texto: novaAnotacao,
        data: new Date(),
        atendente: 'JP (Você)'
      },
      ...prev
    ])
    setNovaAnotacao('')
  }

  if (!mostrarPerfilCliente || !conversaSelecionada) return null

  return (
    <aside className="w-[384px] bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">👤 PERFIL</h2>
          <Button size="sm" variant="outline" onClick={togglePerfilCliente}>
            ›
          </Button>
        </div>

        <div className="space-y-4">
          {/* Informações Básicas */}
          <InfoSection>
            <InfoRow label="👤 Nome" value={conversaSelecionada.clienteNome} />
            <InfoRow label="📧 Email" value={conversaSelecionada.clienteInfo.email} />
          </InfoSection>

          <InfoSection>
            <InfoRow label="📱 Telefone" value={conversaSelecionada.clienteInfo.telefone} />
            <InfoRow 
              label="📍 Localização" 
              value={`${conversaSelecionada.clienteInfo.localizacao.cidade}, ${conversaSelecionada.clienteInfo.localizacao.estado}`} 
            />
          </InfoSection>

          {/* Insights de IA */}
          {conversaSelecionada.clienteInfo.insightsIA.length > 0 && (
            <div>
              <button
                onClick={() => setMostrarInsights(!mostrarInsights)}
                className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase mb-2 hover:text-gray-700 transition-all group"
              >
                <span>🤖 Insights IA</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    mostrarInsights ? 'rotate-0' : '-rotate-90'
                  }`}
                />
              </button>
              {mostrarInsights && conversaSelecionada.clienteInfo.insightsIA.map((insight, idx) => (
                <div 
                  key={idx} 
                  className="bg-purple-50 border border-purple-200 rounded p-3 mb-2"
                >
                  <p className="text-sm font-medium text-purple-900 mb-1">
                    {insight.titulo}
                  </p>
                  <p className="text-xs text-purple-700">{insight.descricao}</p>
                </div>
              ))}
            </div>
          )}

          {/* Histórico de Anotações */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setMostrarHistorico(!mostrarHistorico)}
              className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase mb-3 hover:text-gray-700 transition-all group"
            >
              <span>📝 Histórico de Atendimento</span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-200 ${
                  mostrarHistorico ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>
            
            {mostrarHistorico && (
              <>
                {/* Lista de histórico */}
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {historico.map((item) => (
                    <HistoryItem key={item.id} item={item} />
                  ))}
                </div>

                {/* Nova anotação */}
                <div>
                  <textarea
                    value={novaAnotacao}
                    onChange={(e) => setNovaAnotacao(e.target.value)}
                    placeholder="Escreva uma nova anotação sobre o atendimento..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    rows={3}
                  />
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={handleAddAnotacao}
                    disabled={!novaAnotacao.trim()}
                  >
                    💾 Salvar Anotação
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

/**
 * InfoSection - Seção de informações
 */
function InfoSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {children}
    </div>
  )
}

/**
 * InfoRow - Linha de informação
 */
interface InfoRowProps {
  label: string
  value: string
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase">
        {label}
      </label>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  )
}

/**
 * HistoryItem - Item do histórico
 */
interface HistoryItemProps {
  item: {
    id: number
    texto: string
    data: Date
    atendente: string
  }
}

function HistoryItem({ item }: HistoryItemProps) {
  return (
    <div className="bg-gray-50 rounded p-3 border border-gray-200">
      <p className="text-sm text-gray-900 mb-2">{item.texto}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>👤 {item.atendente}</span>
        <span>{format(item.data, 'dd/MM/yyyy HH:mm')}</span>
      </div>
    </div>
  )
}
