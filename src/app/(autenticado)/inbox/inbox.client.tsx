// ⚠️ TODO: Esta página precisa ser refatorada para o pattern Server + Client Component
// para adicionar metadata SEO. Ver exemplo em src/app/(autenticado)/chat/page.tsx
// Use: generatePageMetadata('inbox') de src/lib/metadata/pages.ts

'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/componentes/ui/button'
import { Input } from '@/componentes/ui/input'
import { Avatar } from '@/componentes/ui/avatar'
import { conversasMockadas, respostasRapidas, sugestoesIA } from '@/lib/mocks/inbox'
import { ConversaChat, CanalMensagem } from '@/tipos/inbox'
import { useInboxStore } from '@/stores/inboxStore'
import { useSidebarStore } from '@/stores/sidebarStore'
import { format } from 'date-fns'

// Ícones de canal
const iconesCanal: Record<CanalMensagem, string> = {
  whatsapp: '💚',
  instagram: '📷',
  telegram: '✈️',
  email: '📧',
  chat_web: '💻'
}

// Indicadores de prioridade
const indicadoresPrioridade = {
  urgente: '🔴',
  alta: '🟡',
  normal: '🟢',
  baixa: '⚪'
}

export function InboxClient() {
  const { toggleSidebar } = useSidebarStore()
  const {
    conversaSelecionada,
    setConversaSelecionada,
    mostrarPerfilCliente,
    mostrarListaConversas,
    togglePerfilCliente,
    toggleListaConversas
  } = useInboxStore()

  const [conversas, setConversas] = useState<ConversaChat[]>(conversasMockadas)
  const [filtroAtivo, setFiltroAtivo] = useState('todas')
  const [busca, setBusca] = useState('')
  const [mensagemDigitando, setMensagemDigitando] = useState('')
  const [mostrarRespostasRapidas, setMostrarRespostasRapidas] = useState(false)
  const [abaPerfilCliente, setAbaPerfilCliente] = useState<'info' | 'conversas' | 'pedidos' | 'pagamentos' | 'notas'>('info')

  // Ao abrir a página, esconde header e recolhe sidebar
  useEffect(() => {
    toggleSidebar()
    return () => {
      // Cleanup se necessário
    }
  }, [toggleSidebar])

  // Filtrar conversas
  const conversasFiltradas = conversas.filter(conv => {
    if (filtroAtivo === 'minhas' && conv.atendenteNome !== 'JP (Você)') return false
    if (filtroAtivo === 'nao_lidas' && conv.mensagensNaoLidas === 0) return false
    if (filtroAtivo === 'urgente' && conv.prioridade !== 'urgente') return false
    if (filtroAtivo === 'vip' && !conv.tags.some(t => t.nome === 'VIP')) return false
    
    if (busca) {
      const termo = busca.toLowerCase()
      return conv.clienteNome.toLowerCase().includes(termo) ||
             conv.ultimaMensagem.toLowerCase().includes(termo)
    }
    
    return true
  })

  // Formatar tempo relativo
  const formatarTempo = (data: Date) => {
    const diffMinutos = Math.floor((Date.now() - data.getTime()) / (1000 * 60))
    if (diffMinutos < 1) return 'agora'
    if (diffMinutos < 60) return `há ${diffMinutos}min`
    if (diffMinutos < 1440) return `há ${Math.floor(diffMinutos / 60)}h`
    return format(data, 'dd/MM')
  }

  // Enviar mensagem
  const enviarMensagem = () => {
    if (!mensagemDigitando.trim() || !conversaSelecionada) return
    console.log('Enviando mensagem:', mensagemDigitando)
    setMensagemDigitando('')
  }

  // Selecionar conversa
  const selecionarConversa = (conversa: ConversaChat) => {
    setConversaSelecionada(conversa)
    const conversasAtualizadas = conversas.map(c => 
      c.id === conversa.id ? { ...c, mensagensNaoLidas: 0 } : c
    )
    setConversas(conversasAtualizadas)
  }

  return (
    <div className="fixed inset-0 bg-gray-50 flex flex-col overflow-hidden">
      {/* Header do Inbox */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">💬 INBOX</h1>
          <Input
            type="text"
            placeholder="🔍 Buscar conversa..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-96"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={toggleListaConversas}>
            {mostrarListaConversas ? '◀️' : '▶️'} Lista
          </Button>
          <Button variant="outline" size="sm" onClick={togglePerfilCliente}>
            {mostrarPerfilCliente ? '▶️' : '◀️'} Perfil
          </Button>
          
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <Avatar className="w-8 h-8">JP</Avatar>
            <span className="text-sm font-medium">JP</span>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
          
          <Button variant="outline" size="sm">🔔</Button>
          <Button variant="outline" size="sm">⚙️</Button>
        </div>
      </div>

      {/* Visão Rápida */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">🟢 Minhas</span>
            <span className="bg-white px-2 py-1 rounded-full font-bold text-blue-600">12</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">⏳ Não atribuídas</span>
            <span className="bg-white px-2 py-1 rounded-full font-bold text-orange-600">5</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">⏸️ Aguardando</span>
            <span className="bg-white px-2 py-1 rounded-full font-bold text-gray-600">3</span>
          </div>
        </div>
      </div>

      {/* Layout Principal - 3 Colunas */}
      <div className="flex flex-1 overflow-hidden">
        {/* COLUNA 1: Lista de Conversas */}
        {mostrarListaConversas && (
          <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
            {/* Filtros Rápidos */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant={filtroAtivo === 'todas' ? 'default' : 'outline'} onClick={() => setFiltroAtivo('todas')}>
                  Todas ({conversas.length})
                </Button>
                <Button size="sm" variant={filtroAtivo === 'minhas' ? 'default' : 'outline'} onClick={() => setFiltroAtivo('minhas')}>
                  Minhas (12)
                </Button>
                <Button size="sm" variant={filtroAtivo === 'nao_lidas' ? 'default' : 'outline'} onClick={() => setFiltroAtivo('nao_lidas')}>
                  Não lidas (7)
                </Button>
                <Button size="sm" variant={filtroAtivo === 'urgente' ? 'default' : 'outline'} onClick={() => setFiltroAtivo('urgente')}>
                  Urgente (2)
                </Button>
                <Button size="sm" variant={filtroAtivo === 'vip' ? 'default' : 'outline'} onClick={() => setFiltroAtivo('vip')}>
                  🔥 VIP (3)
                </Button>
              </div>
            </div>

            {/* Lista de Conversas */}
            <div className="flex-1 overflow-y-auto">
              {conversasFiltradas.map((conversa) => (
                <div
                  key={conversa.id}
                  onClick={() => selecionarConversa(conversa)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    conversaSelecionada?.id === conversa.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{indicadoresPrioridade[conversa.prioridade]}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{conversa.clienteNome}</span>
                          {conversa.mensagensNaoLidas > 0 && (
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              {conversa.mensagensNaoLidas}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{iconesCanal[conversa.canal]}</span>
                          <span>{formatarTempo(conversa.timestampUltimaMensagem)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {conversa.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag.id}
                        className={`text-xs px-2 py-0.5 rounded ${
                          tag.cor === 'red' ? 'bg-red-100 text-red-700' :
                          tag.cor === 'blue' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {tag.icone} {tag.nome}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-gray-600 truncate mb-2">
                    {conversa.ultimaMensagemTipo === 'enviada' && 'Você: '}
                    {conversa.ultimaMensagem}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {conversa.slaRestante && (
                      <span className={`font-medium ${conversa.slaRestante < 30 ? 'text-red-600' : 'text-orange-600'}`}>
                        ⏱️ SLA: {conversa.slaRestante} min
                      </span>
                    )}
                    {conversa.atendenteNome && (
                      <span>👤 {conversa.atendenteNome}</span>
                    )}
                  </div>
                </div>
              ))}

              {conversasFiltradas.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
                  <div className="text-5xl mb-4">💬</div>
                  <p className="text-center">Nenhuma conversa encontrada</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* COLUNA 2: Área de Chat */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {conversaSelecionada ? (
            <>
              {/* Header do Chat */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{conversaSelecionada.clienteFoto || '👤'}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-gray-900">{conversaSelecionada.clienteNome}</h2>
                        <span className={`w-2 h-2 rounded-full ${
                          conversaSelecionada.statusCliente === 'online' ? 'bg-green-500' : 'bg-gray-300'
                        }`}></span>
                        <span className="text-sm text-gray-500">
                          {conversaSelecionada.statusCliente === 'online' ? 'Online agora' : 'Offline'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{iconesCanal[conversaSelecionada.canal]} {conversaSelecionada.canal.toUpperCase()}</span>
                        <span>|</span>
                        <span>{conversaSelecionada.clienteInfo.telefone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {conversaSelecionada.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className={`text-xs px-2 py-1 rounded ${
                          tag.cor === 'red' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {tag.icone} {tag.nome}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    {conversaSelecionada.slaRestante && (
                      <span>⏱️ SLA: {conversaSelecionada.slaRestante} min</span>
                    )}
                    <span>💰 LTV: R$ {conversaSelecionada.ltv.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">👤 Transferir</Button>
                  <Button size="sm" variant="outline">⏸️ Pausar</Button>
                  <Button size="sm" variant="outline">✅ Resolver</Button>
                  <Button size="sm" variant="outline">💳 Cobrar</Button>
                </div>
              </div>

              {/* Avisos */}
              {conversaSelecionada.tags.some(t => t.nome === 'VIP') && (
                <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-sm">
                  <p className="text-red-700">⚠️ <strong>CLIENTE VIP</strong> - Prioridade máxima</p>
                </div>
              )}

              {/* Área de Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-xs text-gray-500 font-medium">📅 HOJE</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {conversaSelecionada.mensagens.map((mensagem) => (
                  <div key={mensagem.id}>
                    {mensagem.remetente === 'sistema' ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center text-sm">
                        <p className="text-yellow-800 font-medium">{mensagem.conteudo}</p>
                      </div>
                    ) : (
                      <div className={`flex ${mensagem.remetente === 'cliente' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[70%] ${
                          mensagem.remetente === 'cliente'
                            ? 'bg-white border border-gray-200'
                            : mensagem.remetente === 'bot'
                            ? 'bg-blue-100 border border-blue-200'
                            : 'bg-blue-600 text-white'
                        } rounded-lg p-3`}>
                          <div className="flex items-center gap-2 mb-1">
                            {mensagem.remetente === 'bot' && <span>🤖</span>}
                            <span className={`text-xs font-semibold ${
                              mensagem.remetente === 'atendente' ? 'text-white' : 'text-gray-600'
                            }`}>
                              {mensagem.remetente === 'cliente' ? conversaSelecionada.clienteNome :
                               mensagem.remetente === 'bot' ? 'BOT' :
                               'Você'}
                            </span>
                            <span className={`text-xs ${
                              mensagem.remetente === 'atendente' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {format(mensagem.timestamp, 'HH:mm')}
                            </span>
                          </div>
                          <p className={`text-sm whitespace-pre-wrap ${
                            mensagem.remetente === 'atendente' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {mensagem.conteudo}
                          </p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className={`text-xs ${
                              mensagem.remetente === 'atendente' ? 'text-blue-100' : 'text-gray-400'
                            }`}>
                              {mensagem.status === 'lido' && '✓✓ Lido'}
                              {mensagem.status === 'entregue' && '✓✓ Entregue'}
                              {mensagem.status === 'enviando' && '⏳ Enviando...'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Área de Digitação */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="mb-3">
                  <textarea
                    value={mensagemDigitando}
                    onChange={(e) => setMensagemDigitando(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        enviarMensagem()
                      }
                    }}
                    placeholder="Digite sua mensagem..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setMostrarRespostasRapidas(!mostrarRespostasRapidas)}>
                      💬 Respostas
                    </Button>
                    <Button size="sm" variant="outline">📎 Anexar</Button>
                    <Button size="sm" variant="outline">😊</Button>
                    <Button size="sm" variant="outline">🤖 IA</Button>
                  </div>

                  <Button onClick={enviarMensagem} className="bg-blue-600 hover:bg-blue-700">
                    ENVIAR
                  </Button>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  ⌨️ Shift+Enter para quebra | Enter para enviar
                </p>
              </div>

              {/* Modal Respostas Rápidas */}
              {mostrarRespostasRapidas && (
                <div className="absolute bottom-24 left-4 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-96 max-h-96 overflow-y-auto z-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">⚡ RESPOSTAS RÁPIDAS</h3>
                    <button onClick={() => setMostrarRespostasRapidas(false)} className="text-gray-400">✕</button>
                  </div>
                  <div className="space-y-2">
                    {respostasRapidas.map((resposta) => (
                      <div
                        key={resposta.id}
                        onClick={() => {
                          setMensagemDigitando(resposta.conteudo)
                          setMostrarRespostasRapidas(false)
                        }}
                        className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <p className="text-sm font-medium text-gray-900">{resposta.atalho}</p>
                        <p className="text-xs text-gray-600">{resposta.conteudo.substring(0, 50)}...</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-xl">Selecione uma conversa para começar</p>
              </div>
            </div>
          )}
        </div>

        {/* COLUNA 3: Perfil do Cliente */}
        {mostrarPerfilCliente && conversaSelecionada && (
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">👤 PERFIL</h2>
                <Button size="sm" variant="outline">✏️</Button>
              </div>

              <div className="text-center mb-6">
                <div className="text-6xl mb-3">{conversaSelecionada.clienteFoto || '👤'}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{conversaSelecionada.clienteNome}</h3>
                <p className="text-sm text-gray-500">{conversaSelecionada.statusCliente === 'online' ? '🟢 Online' : '⚪ Offline'}</p>
                <div className="flex justify-center gap-2 mt-3">
                  <Button size="sm" variant="outline">💬</Button>
                  <Button size="sm" variant="outline">📧</Button>
                  <Button size="sm" variant="outline">📱</Button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">R$ {conversaSelecionada.ltv.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">LTV</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{conversaSelecionada.clienteInfo.resumo.totalPedidos}</div>
                    <div className="text-xs text-gray-600">Pedidos</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">📧 Email</label>
                  <p className="text-sm text-gray-900">{conversaSelecionada.clienteInfo.email}</p>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">📱 Telefone</label>
                  <p className="text-sm text-gray-900">{conversaSelecionada.clienteInfo.telefone}</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">📍 Localização</label>
                  <p className="text-sm text-gray-900">
                    {conversaSelecionada.clienteInfo.localizacao.cidade}, {conversaSelecionada.clienteInfo.localizacao.estado}
                  </p>
                </div>

                {conversaSelecionada.clienteInfo.historico.pedidos.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">🛒 Últimos Pedidos</label>
                    {conversaSelecionada.clienteInfo.historico.pedidos.slice(0, 2).map((pedido) => (
                      <div key={pedido.id} className="bg-gray-50 rounded p-3 mb-2">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium">{pedido.numero}</span>
                          <span className="text-sm font-bold text-green-600">R$ {pedido.valor}</span>
                        </div>
                        <p className="text-xs text-gray-600">{pedido.produtos}</p>
                        <p className="text-xs text-gray-500 mt-1">{pedido.status}</p>
                      </div>
                    ))}
                  </div>
                )}

                {conversaSelecionada.clienteInfo.insightsIA.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">🤖 Insights IA</label>
                    {conversaSelecionada.clienteInfo.insightsIA.map((insight, idx) => (
                      <div key={idx} className="bg-purple-50 border border-purple-200 rounded p-3 mb-2">
                        <p className="text-sm font-medium text-purple-900 mb-1">{insight.titulo}</p>
                        <p className="text-xs text-purple-700">{insight.descricao}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
