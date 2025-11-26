'use client'

import { useEffect, useState } from 'react'
import { Bell, CheckCircle, X } from 'lucide-react'
import { Card } from '@/componentes/ui/card'
import { Button } from '@/componentes/ui/button'

interface Notificacao {
  id: string
  tipo: string
  protocolo: string
  prestadorNome?: string
  timestamp: number
  lida: boolean
}

export function NotificacoesPush() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [permissaoNotificacao, setPermissaoNotificacao] = useState<NotificationPermission>('default')

  useEffect(() => {
    // Solicitar permissão para notificações
    if ('Notification' in window) {
      setPermissaoNotificacao(Notification.permission)
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
          setPermissaoNotificacao(permission)
        })
      }
    }

    // Listener para eventos de corrida aceita
    const handleCorridaAceita = (event: any) => {
      const { protocolo, prestadorNome, timestamp } = event.detail
      
      // Adicionar notificação à lista
      const novaNotificacao: Notificacao = {
        id: `${protocolo}_${timestamp}`,
        tipo: 'corrida_aceita',
        protocolo,
        prestadorNome,
        timestamp,
        lida: false,
      }
      
      setNotificacoes((prev) => [novaNotificacao, ...prev])
      
      // Mostrar notificação do navegador
      mostrarNotificacaoNavegador(novaNotificacao)
      
      // Tocar som (opcional)
      tocarSomNotificacao()
    }

    // Verificar localStorage periodicamente para notificações de outras abas
    const verificarNotificacoes = () => {
      const protocolos = Object.keys(localStorage)
        .filter((key) => key.startsWith('notificacao_'))
        .map((key) => key.replace('notificacao_', ''))

      protocolos.forEach((protocolo) => {
        const chave = `notificacao_${protocolo}`
        const notificacaoSalva = localStorage.getItem(chave)
        
        if (notificacaoSalva) {
          try {
            const dados = JSON.parse(notificacaoSalva)
            
            // Verificar se já foi processada
            const jaProcessada = notificacoes.some((n) => n.protocolo === protocolo)
            
            if (!jaProcessada && Date.now() - dados.timestamp < 60000) { // Últimos 60 segundos
              const novaNotificacao: Notificacao = {
                id: `${protocolo}_${dados.timestamp}`,
                tipo: dados.tipo,
                protocolo: dados.protocolo,
                prestadorNome: dados.prestadorNome,
                timestamp: dados.timestamp,
                lida: false,
              }
              
              setNotificacoes((prev) => [novaNotificacao, ...prev])
              mostrarNotificacaoNavegador(novaNotificacao)
              tocarSomNotificacao()
              
              // Remover do localStorage após processar
              localStorage.removeItem(chave)
            }
          } catch (error) {
            console.error('Erro ao processar notificação:', error)
          }
        }
      })
    }

    // Adicionar listener de evento
    window.addEventListener('corridaAceita', handleCorridaAceita)
    
    // Verificar imediatamente ao montar
    verificarNotificacoes()

    return () => {
      window.removeEventListener('corridaAceita', handleCorridaAceita)
    }
  }, [notificacoes])

  const mostrarNotificacaoNavegador = (notificacao: Notificacao) => {
    if (permissaoNotificacao === 'granted' && 'Notification' in window) {
      const notification = new Notification('🚗 Corrida Aceita!', {
        body: `${notificacao.prestadorNome} aceitou a corrida ${notificacao.protocolo}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notificacao.protocolo,
        requireInteraction: true,
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
        marcarComoLida(notificacao.id)
      }
    }
  }

  const tocarSomNotificacao = () => {
    // Criar um som de notificação simples usando Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.error('Erro ao tocar som:', error)
    }
  }

  const marcarComoLida = (id: string) => {
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    )
  }

  const removerNotificacao = (id: string) => {
    setNotificacoes((prev) => prev.filter((n) => n.id !== id))
  }

  const notificacoesNaoLidas = notificacoes.filter((n) => !n.lida)

  if (notificacoesNaoLidas.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {notificacoesNaoLidas.slice(0, 3).map((notificacao) => (
        <Card
          key={notificacao.id}
          className="p-4 shadow-lg border-l-4 border-l-green-500 bg-white animate-in slide-in-from-right"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    🚗 Corrida Aceita!
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">{notificacao.prestadorNome}</span> aceitou a corrida{' '}
                    <span className="font-medium">{notificacao.protocolo}</span>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(notificacao.timestamp).toLocaleTimeString('pt-BR')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removerNotificacao(notificacao.id)}
                  className="flex-shrink-0 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    marcarComoLida(notificacao.id)
                    // Redirecionar para a página de tickets
                    window.location.href = '/tickets#aguardando'
                  }}
                  className="text-xs"
                >
                  Ver Chamado
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => marcarComoLida(notificacao.id)}
                  className="text-xs"
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
