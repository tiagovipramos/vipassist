'use client'

import { useState, useRef, useEffect } from 'react'
import { useInboxStore } from '@/stores/inboxStore'
import { Button } from '@/componentes/ui/button'
import { format } from 'date-fns'
import { respostasRapidas } from '@/lib/mocks/inbox'
import { atendentesMockados } from '@/lib/mocks/atendentes'

/**
 * ChatArea - Área Principal de Chat
 * 
 * Responsabilidades:
 * - Exibir header da conversa
 * - Renderizar mensagens
 * - Input para enviar mensagens
 * - Respostas rápidas
 */
export function ChatArea() {
  const { conversaSelecionada, togglePerfilCliente, toggleCopilotIA, mostrarPerfilCliente } = useInboxStore()
  const [mensagemDigitando, setMensagemDigitando] = useState('')
  const [mostrarRespostasRapidas, setMostrarRespostasRapidas] = useState(false)
  const [mostrarEmojiPicker, setMostrarEmojiPicker] = useState(false)
  const [mostrarAnexos, setMostrarAnexos] = useState(false)
  const [mostrarAgendar, setMostrarAgendar] = useState(false)
  const [mostrarFinalizar, setMostrarFinalizar] = useState(false)
  const [mostrarTransferir, setMostrarTransferir] = useState(false)
  const [timerFinalizar, setTimerFinalizar] = useState(5)
  const [buscaAtendente, setBuscaAtendente] = useState('')
  const [atendenteSelecionado, setAtendenteSelecionado] = useState<string | null>(null)
  const [observacoesTransferencia, setObservacoesTransferencia] = useState('')
  const [formAgendamento, setFormAgendamento] = useState({
    data: '',
    hora: '',
    tipo: 'follow-up',
    observacoes: ''
  })
  const mensagensEndRef = useRef<HTMLDivElement>(null)
  const emojiButtonRef = useRef<HTMLButtonElement>(null)
  const respostasButtonRef = useRef<HTMLDivElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const respostasPickerRef = useRef<HTMLDivElement>(null)
  const anexosButtonRef = useRef<HTMLDivElement>(null)
  const anexosPickerRef = useRef<HTMLDivElement>(null)

  // Lista de emojis populares
  const emojis = [
    '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊',
    '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘',
    '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪',
    '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒',
    '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖',
    '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡',
    '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰',
    '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶',
    '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮',
    '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴',
    '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠',
    '👍', '👎', '👏', '🙌', '👋', '🤝', '🙏', '💪',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
    '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘',
    '✨', '⭐', '🌟', '💫', '🔥', '💯', '✅', '🎉',
    '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉', '⚽'
  ]

  // Scroll automático para a última mensagem
  useEffect(() => {
    mensagensEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversaSelecionada?.mensagens])

  // Timer para o botão de finalizar
  useEffect(() => {
    if (mostrarFinalizar) {
      setTimerFinalizar(5)
      const interval = setInterval(() => {
        setTimerFinalizar((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [mostrarFinalizar])

  // Fechar modais ao clicar fora deles
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Verificar se clicou fora do emoji picker
      if (mostrarEmojiPicker && 
          emojiPickerRef.current && 
          !emojiPickerRef.current.contains(target) &&
          emojiButtonRef.current &&
          !emojiButtonRef.current.contains(target)) {
        setMostrarEmojiPicker(false)
      }

      // Verificar se clicou fora do respostas picker
      if (mostrarRespostasRapidas && 
          respostasPickerRef.current && 
          !respostasPickerRef.current.contains(target) &&
          respostasButtonRef.current &&
          !respostasButtonRef.current.contains(target)) {
        setMostrarRespostasRapidas(false)
      }

      // Verificar se clicou fora do anexos picker
      if (mostrarAnexos && 
          anexosPickerRef.current && 
          !anexosPickerRef.current.contains(target) &&
          anexosButtonRef.current &&
          !anexosButtonRef.current.contains(target)) {
        setMostrarAnexos(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mostrarEmojiPicker, mostrarRespostasRapidas, mostrarAnexos])

  // Enviar mensagem
  const enviarMensagem = () => {
    if (!mensagemDigitando.trim() || !conversaSelecionada) return
    console.log('Enviando mensagem:', mensagemDigitando)
    // TODO: Integrar com backend/React Query
    setMensagemDigitando('')
  }

  // Adicionar emoji na mensagem
  const adicionarEmoji = (emoji: string) => {
    setMensagemDigitando(prev => prev + emoji)
    setMostrarEmojiPicker(false)
  }

  // Ícones de canal
  const iconesCanal = {
    whatsapp: '💚',
    instagram: '📷',
    telegram: '✈️',
    email: '📧',
    chat_web: '💻'
  }

  // Estado vazio
  if (!conversaSelecionada) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-xl">Selecione uma conversa para começar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header do Chat */}
      <header className="bg-white border-b border-gray-200 p-3">
        <div className="flex items-center justify-between gap-4">
          {/* Informações do Cliente */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="text-2xl flex-shrink-0">
              {conversaSelecionada.clienteFoto || '👤'}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-gray-900 truncate">
                {conversaSelecionada.clienteNome}
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  conversaSelecionada.statusCliente === 'online' ? 'bg-green-500' : 'bg-gray-300'
                }`}></span>
                <span className="truncate">
                  {conversaSelecionada.statusCliente === 'online' ? 'Online' : 'Offline'}
                </span>
                <span className="flex-shrink-0">
                  {iconesCanal[conversaSelecionada.canal]}
                </span>
                <span className="truncate">{conversaSelecionada.clienteInfo.telefone}</span>
              </div>
            </div>
          </div>
          
          {/* Botões de Ação */}
          <div className="flex gap-2 flex-shrink-0">
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-1"
              onClick={() => setMostrarAgendar(true)}
            >
              📅 Agendar
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-1"
              onClick={() => setMostrarTransferir(true)}
            >
              👤 Transferir
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-1"
              onClick={() => setMostrarFinalizar(true)}
            >
              ✓ Finalizar
            </Button>
            {!mostrarPerfilCliente && (
              <Button size="sm" variant="outline" onClick={togglePerfilCliente}>
                ‹ Perfil
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Divisor de Data */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-500 font-medium">📅 HOJE</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Mensagens */}
        {conversaSelecionada.mensagens.map((mensagem) => (
          <MessageBubble 
            key={mensagem.id} 
            mensagem={mensagem}
            clienteNome={conversaSelecionada.clienteNome}
          />
        ))}
        
        {/* Elemento para scroll automático */}
        <div ref={mensagensEndRef} />
      </div>

      {/* Área de Digitação */}
      <footer className="bg-white border-t border-gray-200 p-4">
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
          <div className="flex gap-2 relative">
            <div className="relative" ref={respostasButtonRef}>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setMostrarRespostasRapidas(!mostrarRespostasRapidas)}
              >
                💬 Respostas
              </Button>
              
              {/* Modal Respostas Rápidas - Próximo ao botão */}
              {mostrarRespostasRapidas && (
                <div ref={respostasPickerRef} className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-96 max-h-96 overflow-y-auto z-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">⚡ RESPOSTAS RÁPIDAS</h3>
                    <button 
                      onClick={() => setMostrarRespostasRapidas(false)} 
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
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
                        <p className="text-xs text-gray-600">
                          {resposta.conteudo.substring(0, 50)}...
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative" ref={anexosButtonRef}>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setMostrarAnexos(!mostrarAnexos)}
              >
                📎 Anexar
              </Button>
              
              {/* Modal Anexos - Próximo ao botão */}
              {mostrarAnexos && (
                <div ref={anexosPickerRef} className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-xl p-3 w-64 z-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">📎 ANEXAR</h3>
                    <button 
                      onClick={() => setMostrarAnexos(false)} 
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-1">
                    <button 
                      onClick={() => {
                        console.log('Anexar imagem')
                        setMostrarAnexos(false)
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded flex items-center gap-3 transition-colors"
                    >
                      <span className="text-2xl">🖼️</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Imagem</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => {
                        console.log('Anexar documento')
                        setMostrarAnexos(false)
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded flex items-center gap-3 transition-colors"
                    >
                      <span className="text-2xl">📄</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Documento</p>
                        <p className="text-xs text-gray-500">PDF, DOC, XLS</p>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => {
                        console.log('Anexar vídeo')
                        setMostrarAnexos(false)
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded flex items-center gap-3 transition-colors"
                    >
                      <span className="text-2xl">🎥</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Vídeo</p>
                        <p className="text-xs text-gray-500">MP4, MOV, AVI</p>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => {
                        console.log('Anexar áudio')
                        setMostrarAnexos(false)
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded flex items-center gap-3 transition-colors"
                    >
                      <span className="text-2xl">🎵</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Áudio</p>
                        <p className="text-xs text-gray-500">MP3, WAV, OGG</p>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => {
                        console.log('Anexar contato')
                        setMostrarAnexos(false)
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded flex items-center gap-3 transition-colors"
                    >
                      <span className="text-2xl">👤</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Contato</p>
                        <p className="text-xs text-gray-500">VCF</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <Button 
                ref={emojiButtonRef}
                size="sm" 
                variant="outline"
                onClick={() => setMostrarEmojiPicker(!mostrarEmojiPicker)}
              >
                😊
              </Button>
              
              {/* Modal Emoji Picker - Próximo ao botão */}
              {mostrarEmojiPicker && (
                <div ref={emojiPickerRef} className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto z-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">😊 EMOJIS</h3>
                    <button 
                      onClick={() => setMostrarEmojiPicker(false)} 
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-8 gap-1">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => adicionarEmoji(emoji)}
                        className="text-2xl p-2 hover:bg-gray-100 rounded transition-colors"
                        title={emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={toggleCopilotIA}
            >
              🤖 IA
            </Button>
          </div>

          <Button onClick={enviarMensagem} className="bg-blue-600 hover:bg-blue-700">
            ENVIAR
          </Button>
        </div>
      </footer>

      {/* Modal de Agendamento */}
      {mostrarAgendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Agendar Retorno</h2>
                  <p className="text-xs text-gray-500">Follow-up com {conversaSelecionada.clienteNome}</p>
                </div>
              </div>
              <button
                onClick={() => setMostrarAgendar(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            {/* Formulário */}
            <div className="space-y-4">
              {/* Tipo de Agendamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Agendamento
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFormAgendamento({ ...formAgendamento, tipo: 'follow-up' })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formAgendamento.tipo === 'follow-up'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-lg mb-1">🔄</p>
                    <p className="text-sm font-medium">Follow-up</p>
                  </button>
                  <button
                    onClick={() => setFormAgendamento({ ...formAgendamento, tipo: 'reuniao' })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formAgendamento.tipo === 'reuniao'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-lg mb-1">👥</p>
                    <p className="text-sm font-medium">Reunião</p>
                  </button>
                  <button
                    onClick={() => setFormAgendamento({ ...formAgendamento, tipo: 'ligacao' })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formAgendamento.tipo === 'ligacao'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-lg mb-1">📞</p>
                    <p className="text-sm font-medium">Ligação</p>
                  </button>
                  <button
                    onClick={() => setFormAgendamento({ ...formAgendamento, tipo: 'proposta' })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formAgendamento.tipo === 'proposta'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-lg mb-1">📋</p>
                    <p className="text-sm font-medium">Proposta</p>
                  </button>
                </div>
              </div>

              {/* Data e Hora */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Data
                  </label>
                  <input
                    type="date"
                    value={formAgendamento.data}
                    onChange={(e) => setFormAgendamento({ ...formAgendamento, data: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ⏰ Hora
                  </label>
                  <input
                    type="time"
                    value={formAgendamento.hora}
                    onChange={(e) => setFormAgendamento({ ...formAgendamento, hora: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Observações (opcional)
                </label>
                <textarea
                  value={formAgendamento.observacoes}
                  onChange={(e) => setFormAgendamento({ ...formAgendamento, observacoes: e.target.value })}
                  placeholder="Adicione detalhes sobre o agendamento..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Ações */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setMostrarAgendar(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    console.log('Agendamento criado:', formAgendamento)
                    // TODO: Integrar com backend
                    setMostrarAgendar(false)
                    setFormAgendamento({ data: '', hora: '', tipo: 'follow-up', observacoes: '' })
                  }}
                  disabled={!formAgendamento.data || !formAgendamento.hora}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Agendar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Transferir Atendimento */}
      {mostrarTransferir && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 m-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Transferir Atendimento</h2>
                  <p className="text-xs text-gray-500">Selecione um atendente para {conversaSelecionada.clienteNome}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMostrarTransferir(false)
                  setBuscaAtendente('')
                  setAtendenteSelecionado(null)
                  setObservacoesTransferencia('')
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            {/* Campo de Busca */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={buscaAtendente}
                  onChange={(e) => setBuscaAtendente(e.target.value)}
                  placeholder="Buscar atendente..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>

            {/* Lista de Atendentes */}
            <div className="mb-4 max-h-64 overflow-y-auto space-y-2">
              {buscaAtendente === '' ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-sm font-medium">Digite para buscar atendentes</p>
                  <p className="text-xs mt-1">Pesquise por nome ou setor</p>
                </div>
              ) : (
                <>
                  {atendentesMockados
                    .filter(atendente => 
                      atendente.tipo === 'humano' && 
                      atendente.status === 'online' &&
                      (atendente.nome.toLowerCase().includes(buscaAtendente.toLowerCase()) ||
                       atendente.setor.toLowerCase().includes(buscaAtendente.toLowerCase()))
                    )
                    .map((atendente) => (
                      <button
                        key={atendente.id}
                        onClick={() => setAtendenteSelecionado(atendente.id)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          atendenteSelecionado === atendente.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                {atendente.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </div>
                              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                atendente.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                              }`}></span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{atendente.nome}</p>
                              <p className="text-xs text-gray-500 capitalize">
                                {atendente.cargo} • {atendente.setor}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-gray-700">
                              {atendente.metricas.atendimentosAtivos} ativos
                            </p>
                            <p className="text-xs text-gray-500">
                              ⭐ {atendente.metricas.satisfacao.toFixed(1)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
              
                  {atendentesMockados.filter(atendente => 
                    atendente.tipo === 'humano' && 
                    atendente.status === 'online' &&
                    (atendente.nome.toLowerCase().includes(buscaAtendente.toLowerCase()) ||
                     atendente.setor.toLowerCase().includes(buscaAtendente.toLowerCase()))
                  ).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">😔 Nenhum atendente disponível</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Observações */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 Observações (opcional)
              </label>
              <textarea
                value={observacoesTransferencia}
                onChange={(e) => setObservacoesTransferencia(e.target.value)}
                placeholder="Adicione contexto para o novo atendente..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Ações */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setMostrarTransferir(false)
                  setBuscaAtendente('')
                  setAtendenteSelecionado(null)
                  setObservacoesTransferencia('')
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  const atendente = atendentesMockados.find(a => a.id === atendenteSelecionado)
                  console.log('Transferindo para:', atendente?.nome, observacoesTransferencia)
                  // TODO: Integrar com backend
                  setMostrarTransferir(false)
                  setBuscaAtendente('')
                  setAtendenteSelecionado(null)
                  setObservacoesTransferencia('')
                }}
                disabled={!atendenteSelecionado}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Transferir
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Finalizar Atendimento */}
      {mostrarFinalizar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Finalizar Atendimento</h2>
                  <p className="text-xs text-gray-500">Conversa com {conversaSelecionada.clienteNome}</p>
                </div>
              </div>
              <button
                onClick={() => setMostrarFinalizar(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            {/* Conteúdo */}
            <div className="mb-6">
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-4">
                <div className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">⚠️</span>
                  <div>
                    <p className="text-sm font-bold text-red-900 mb-1">
                      ⚠️ Atenção!
                    </p>
                    <p className="text-xs text-red-700 font-medium">
                      Ao finalizar este atendimento, a conversa será arquivada e fechada.
                      Você não poderá mais enviar mensagens por este canal.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg text-center">
                  <span className="text-2xl">👤</span>
                  <div>
                    <p className="text-xs font-medium text-gray-900">Cliente</p>
                    <p className="text-xs text-gray-600 font-semibold">{conversaSelecionada.clienteNome}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg text-center">
                  <span className="text-2xl">{iconesCanal[conversaSelecionada.canal]}</span>
                  <div>
                    <p className="text-xs font-medium text-gray-900">Canal</p>
                    <p className="text-xs text-gray-600 font-semibold capitalize">{conversaSelecionada.canal.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg text-center">
                  <span className="text-2xl">💬</span>
                  <div>
                    <p className="text-xs font-medium text-gray-900">Mensagens</p>
                    <p className="text-xs text-gray-600 font-semibold">{conversaSelecionada.mensagens.length} trocadas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setMostrarFinalizar(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  console.log('Atendimento finalizado:', conversaSelecionada.id)
                  // TODO: Integrar com backend para finalizar atendimento
                  setMostrarFinalizar(false)
                }}
                disabled={timerFinalizar > 0}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {timerFinalizar > 0 ? timerFinalizar : 'Confirmar e Fechar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * MessageBubble - Bolha de mensagem individual
 */
interface MessageBubbleProps {
  mensagem: any
  clienteNome: string
}

function MessageBubble({ mensagem, clienteNome }: MessageBubbleProps) {
  // Mensagem do sistema
  if (mensagem.remetente === 'sistema') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center text-sm">
        <p className="text-yellow-800 font-medium">{mensagem.conteudo}</p>
      </div>
    )
  }

  // Mensagem normal
  const isCliente = mensagem.remetente === 'cliente'
  const isBot = mensagem.remetente === 'bot'
  const isAtendente = mensagem.remetente === 'atendente'

  return (
    <div className={`flex ${isCliente ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[70%] ${
        isCliente
          ? 'bg-white border border-gray-200'
          : isBot
          ? 'bg-blue-100 border border-blue-200'
          : 'bg-blue-600 text-white'
      } rounded-lg p-3`}>
        <div className="flex items-center gap-2 mb-1">
          {isBot && <span>🤖</span>}
          <span className={`text-xs font-semibold ${
            isAtendente ? 'text-white' : 'text-gray-600'
          }`}>
            {isCliente ? clienteNome : isBot ? 'BOT' : 'Você'}
          </span>
          <span className={`text-xs ${
            isAtendente ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {format(mensagem.timestamp, 'HH:mm')}
          </span>
        </div>
        <p className={`text-sm whitespace-pre-wrap ${
          isAtendente ? 'text-white' : 'text-gray-900'
        }`}>
          {mensagem.conteudo}
        </p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className={`text-xs ${
            isAtendente ? 'text-blue-100' : 'text-gray-400'
          }`}>
            {mensagem.status === 'lido' && '✓✓ Lido'}
            {mensagem.status === 'entregue' && '✓✓ Entregue'}
            {mensagem.status === 'enviando' && '⏳ Enviando...'}
          </span>
        </div>
      </div>
    </div>
  )
}
