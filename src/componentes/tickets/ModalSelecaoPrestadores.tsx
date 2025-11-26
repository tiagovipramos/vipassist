'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/componentes/ui/button'
import { Card } from '@/componentes/ui/card'
import {
  X,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  Navigation,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { PrestadorProximo, DadosCotacao } from '@/tipos/assistenciaVeicular'
import {
  gerarMensagemCotacao,
  gerarLinkWhatsApp,
} from '@/lib/utils/prestadores'
import { cn } from '@/lib/utils'
import { prestadoresService } from '@/lib/services/prestadores.service'

interface ModalSelecaoPrestadoresProps {
  isOpen: boolean
  onClose: () => void
  chamado: {
    id: string
    protocolo: string
    tipoServico: string
    prioridade: 'critica' | 'alta' | 'media'
    origemCidade: string
    destinoCidade?: string
    distanciaKm?: number
    clienteNome: string
    clienteTelefone: string
    veiculoPlaca: string
    veiculoMarca?: string
    veiculoModelo?: string
    descricaoProblema: string
    origemCoordenadas?: { lat: number; lng: number }
    destinoCoordenadas?: { lat: number; lng: number }
  }
}

export function ModalSelecaoPrestadores({
  isOpen,
  onClose,
  chamado,
}: ModalSelecaoPrestadoresProps) {
  const [prestadoresEncontrados, setPrestadoresEncontrados] = useState<PrestadorProximo[]>([])
  const [raioUtilizado, setRaioUtilizado] = useState<number>(10)
  const [raioManual, setRaioManual] = useState<number>(10)
  const [carregando, setCarregando] = useState(true)
  const [prestadoresEnviados, setPrestadoresEnviados] = useState<Set<string>>(new Set())
  const [enviandoTodos, setEnviandoTodos] = useState(false)

  // Carrega cotações enviadas do localStorage ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      buscarPrestadores()
      carregarCotacoesEnviadas()
    }
  }, [isOpen])

  // Função para carregar cotações enviadas do localStorage
  const carregarCotacoesEnviadas = () => {
    const chave = `cotacoes_${chamado.id}`
    const cotacoesSalvas = localStorage.getItem(chave)
    if (cotacoesSalvas) {
      setPrestadoresEnviados(new Set(JSON.parse(cotacoesSalvas)))
    }
  }

  // Função para salvar cotações enviadas no localStorage
  const salvarCotacoesEnviadas = (prestadoresIds: Set<string>) => {
    const chave = `cotacoes_${chamado.id}`
    localStorage.setItem(chave, JSON.stringify(Array.from(prestadoresIds)))
  }

  const buscarPrestadores = async (raioCustomizado?: number) => {
    setCarregando(true)

    try {
      // Coordenadas de origem
      const origemLat = chamado.origemCoordenadas?.lat || -23.550520
      const origemLng = chamado.origemCoordenadas?.lng || -46.633308

      // Define o raio a ser usado
      let raioAtual = raioCustomizado || 10

      // Busca prestadores próximos usando a nova API com filtro de raio
      let prestadoresEncontradosAPI = await prestadoresService.buscarProximos(
        origemLat,
        origemLng,
        raioAtual,
        chamado.tipoServico
      )

      // Se não encontrou prestadores e não foi especificado um raio customizado,
      // tenta expandir automaticamente
      if (prestadoresEncontradosAPI.length === 0 && !raioCustomizado) {
        const raiosParaTestar = [20, 30, 50, 75, 100]
        
        for (const raioTeste of raiosParaTestar) {
          prestadoresEncontradosAPI = await prestadoresService.buscarProximos(
            origemLat,
            origemLng,
            raioTeste,
            chamado.tipoServico
          )
          
          if (prestadoresEncontradosAPI.length > 0) {
            raioAtual = raioTeste
            break
          }
        }
      }

      setPrestadoresEncontrados(prestadoresEncontradosAPI)
      setRaioUtilizado(raioAtual)
      setRaioManual(raioAtual)
    } catch (error) {
      console.error('Erro ao buscar prestadores:', error)
      setPrestadoresEncontrados([])
    } finally {
      setCarregando(false)
    }
  }

  const ajustarRaio = (novoRaio: number) => {
    if (novoRaio >= 5 && novoRaio <= 100) {
      buscarPrestadores(novoRaio)
    }
  }

  const enviarCotacao = (prestador: PrestadorProximo) => {
    // Prepara dados da cotação
    const dadosCotacao: DadosCotacao = {
      protocolo: chamado.protocolo,
      tipoServico: chamado.tipoServico,
      origem: {
        endereco: chamado.origemCidade,
        cidade: chamado.origemCidade,
        coordenadas: {
          lat: chamado.origemCoordenadas?.lat || -23.550520,
          lng: chamado.origemCoordenadas?.lng || -46.633308,
        },
      },
      destino: chamado.destinoCidade
        ? {
            endereco: chamado.destinoCidade,
            cidade: chamado.destinoCidade,
            coordenadas: {
              lat: chamado.destinoCoordenadas?.lat || -23.550520,
              lng: chamado.destinoCoordenadas?.lng || -46.633308,
            },
          }
        : undefined,
      distanciaKm: chamado.distanciaKm,
      clienteNome: chamado.clienteNome,
      clienteTelefone: chamado.clienteTelefone,
      veiculoPlaca: chamado.veiculoPlaca,
      veiculoMarca: chamado.veiculoMarca,
      veiculoModelo: chamado.veiculoModelo,
      descricaoProblema: chamado.descricaoProblema,
      prioridade: chamado.prioridade,
    }

    // Gera mensagem e link do WhatsApp
    const mensagem = gerarMensagemCotacao(dadosCotacao)
    const linkWhatsApp = gerarLinkWhatsApp(prestador.whatsapp, mensagem)

    // Marca como enviado e salva no localStorage
    const novosEnviados = new Set(prestadoresEnviados).add(prestador.id)
    setPrestadoresEnviados(novosEnviados)
    salvarCotacoesEnviadas(novosEnviados)

    // Tenta abrir WhatsApp Web - se falhar, o usuário pode copiar o link manualmente
    try {
      // Cria um elemento <a> temporário para forçar navegação
      const link = document.createElement('a')
      link.href = linkWhatsApp
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      // Se falhar, copia o link para área de transferência
      navigator.clipboard.writeText(linkWhatsApp)
      alert('Link copiado! Cole no navegador para abrir o WhatsApp Web.')
    }
  }

  const selecionarPrestador = async (prestador: PrestadorProximo) => {
    try {
      // Atualizar ticket no banco de dados
      const { ticketsService } = await import('@/lib/services/tickets.service')
      
      await ticketsService.atualizar(chamado.id, {
        status: 'em_execucao',
        prestadorId: prestador.id,
        dataInicio: new Date().toISOString(),
      })

      // Gera token único para a corrida
      const token = `${chamado.protocolo}_${prestador.id}_${Date.now()}`
      
      // Prepara dados da corrida com coordenadas
      const dadosCorrida = {
        protocolo: chamado.protocolo,
        clienteNome: chamado.clienteNome,
        clienteTelefone: chamado.clienteTelefone,
        veiculoPlaca: chamado.veiculoPlaca,
        veiculoMarca: chamado.veiculoMarca,
        veiculoModelo: chamado.veiculoModelo,
        origemEndereco: chamado.origemCidade,
        origemCoordenadas: chamado.origemCoordenadas,
        destinoEndereco: chamado.destinoCidade,
        destinoCoordenadas: chamado.destinoCoordenadas,
        tipoServico: chamado.tipoServico,
        descricaoProblema: chamado.descricaoProblema,
        prestadorNome: prestador.nome,
        prestadorTelefone: prestador.telefone,
        token: token,
      }

      // Salva dados da corrida no localStorage
      const chave = `corrida_${chamado.protocolo}`
      localStorage.setItem(chave, JSON.stringify(dadosCorrida))

      // Gera URL da corrida
      const urlBase = window.location.origin
      const urlCorrida = `${urlBase}/corrida/${chamado.protocolo}?token=${token}`

      // Gera mensagem para WhatsApp
      const mensagem = `🚗 *Nova Corrida Disponível!*

📋 *Protocolo:* ${chamado.protocolo}

👤 *Cliente:* ${chamado.clienteNome}
📞 *Telefone:* ${chamado.clienteTelefone}

🚙 *Veículo:* ${chamado.veiculoPlaca}
${chamado.veiculoMarca ? `*Modelo:* ${chamado.veiculoMarca} ${chamado.veiculoModelo}` : ''}

📍 *Origem:* ${chamado.origemCidade}
${chamado.destinoCidade ? `🎯 *Destino:* ${chamado.destinoCidade}` : ''}

⚠️ *Problema:* ${chamado.descricaoProblema}

---

👉 *Clique no link abaixo para aceitar a corrida:*
${urlCorrida}

⚠️ *IMPORTANTE:* Após aceitar, o rastreamento GPS será iniciado automaticamente. Mantenha a aba aberta durante todo o atendimento.`

      // Gera link do WhatsApp
      const linkWhatsApp = gerarLinkWhatsApp(prestador.whatsapp, mensagem)

      // Abre WhatsApp
      const link = document.createElement('a')
      link.href = linkWhatsApp
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Mostra confirmação
      alert(`Prestador ${prestador.nome} selecionado!\n\nO ticket foi movido para "Em Execução" e o link foi enviado via WhatsApp.`)
      
      // Fecha o modal
      onClose()
    } catch (error) {
      console.error('Erro ao selecionar prestador:', error)
      alert('Erro ao selecionar prestador. Tente novamente.')
    }
  }

  const enviarParaTodos = () => {
    setEnviandoTodos(true)

    // Prepara dados da cotação
    const dadosCotacao: DadosCotacao = {
      protocolo: chamado.protocolo,
      tipoServico: chamado.tipoServico,
      origem: {
        endereco: chamado.origemCidade,
        cidade: chamado.origemCidade,
        coordenadas: {
          lat: chamado.origemCoordenadas?.lat || -23.550520,
          lng: chamado.origemCoordenadas?.lng || -46.633308,
        },
      },
      destino: chamado.destinoCidade
        ? {
            endereco: chamado.destinoCidade,
            cidade: chamado.destinoCidade,
            coordenadas: {
              lat: chamado.destinoCoordenadas?.lat || -23.550520,
              lng: chamado.destinoCoordenadas?.lng || -46.633308,
            },
          }
        : undefined,
      distanciaKm: chamado.distanciaKm,
      clienteNome: chamado.clienteNome,
      clienteTelefone: chamado.clienteTelefone,
      veiculoPlaca: chamado.veiculoPlaca,
      veiculoMarca: chamado.veiculoMarca,
      veiculoModelo: chamado.veiculoModelo,
      descricaoProblema: chamado.descricaoProblema,
      prioridade: chamado.prioridade,
    }

    const mensagem = gerarMensagemCotacao(dadosCotacao)

    // Filtra apenas prestadores que ainda não receberam cotação
    const prestadoresParaEnviar = prestadoresEncontrados.filter(
      (p) => !prestadoresEnviados.has(p.id)
    )

    // Cria novo Set com todos os IDs que serão marcados como enviados
    const novosEnviados = new Set(prestadoresEnviados)
    
    // Abre todas as abas de uma vez
    prestadoresParaEnviar.forEach((prestador) => {
      const linkWhatsApp = gerarLinkWhatsApp(prestador.whatsapp, mensagem)
      
      // Abre WhatsApp Web em nova aba
      window.open(linkWhatsApp, '_blank')
      
      // Adiciona ao Set (mas não atualiza o estado ainda)
      novosEnviados.add(prestador.id)
    })

    // Atualiza o estado apenas uma vez com todos os IDs
    setPrestadoresEnviados(novosEnviados)
    salvarCotacoesEnviadas(novosEnviados)
    
    setEnviandoTodos(false)
  }

  const tiposPrestador: Record<string, { label: string; color: string }> = {
    reboque: { label: 'Reboque', color: 'bg-blue-100 text-blue-700' },
    mecanico: { label: 'Mecânico', color: 'bg-green-100 text-green-700' },
    chaveiro: { label: 'Chaveiro', color: 'bg-yellow-100 text-yellow-700' },
    multiplo: { label: 'Múltiplos Serviços', color: 'bg-purple-100 text-purple-700' },
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-xl pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
            <div>
              <h2 className="text-2xl font-bold">Selecionar Prestadores</h2>
              <p className="text-sm text-blue-100">
                Protocolo: {chamado.protocolo} • {chamado.origemCidade}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            {carregando ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="mt-4 text-gray-600">Buscando prestadores próximos...</p>
              </div>
            ) : prestadoresEncontrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-16 w-16 text-orange-500" />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  Nenhum prestador encontrado
                </h3>
                <p className="mt-2 text-center text-gray-600">
                  Não encontramos prestadores disponíveis em um raio de {raioUtilizado} km.
                </p>
                
                {/* Botões para expandir o raio */}
                <div className="mt-6 flex flex-col items-center gap-3">
                  <p className="text-sm font-medium text-gray-700">
                    Expandir raio de busca:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[20, 30, 50, 75, 100].map((novoRaio) => (
                      novoRaio > raioUtilizado && (
                        <Button
                          key={novoRaio}
                          onClick={() => ajustarRaio(novoRaio)}
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          Buscar em {novoRaio} km
                        </Button>
                      )
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Info Banner com Controle de Raio e Botão Enviar Todos */}
                <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <Navigation className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-blue-900">
                          {prestadoresEncontrados.length} prestador(es) encontrado(s)
                        </p>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-medium text-blue-700 uppercase">
                            Raio de Busca
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => ajustarRaio(raioManual - 5)}
                              disabled={raioManual <= 5}
                              className="flex h-6 w-6 items-center justify-center rounded border border-blue-300 bg-white text-blue-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              title="Diminuir raio"
                            >
                              <span className="text-sm font-bold">−</span>
                            </button>
                            <span className="text-sm font-medium text-blue-900 min-w-[60px] text-center">
                              {raioUtilizado} km
                            </span>
                            <button
                              onClick={() => ajustarRaio(raioManual + 5)}
                              disabled={raioManual >= 100}
                              className="flex h-6 w-6 items-center justify-center rounded border border-blue-300 bg-white text-blue-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              title="Aumentar raio"
                            >
                              <span className="text-sm font-bold">+</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-blue-700">
                          Clique em "Pedir Cotação" para solicitar orçamento via WhatsApp
                        </p>
                        {prestadoresEncontrados.filter((p) => !prestadoresEnviados.has(p.id)).length > 0 && (
                          <Button
                            onClick={enviarParaTodos}
                            disabled={enviandoTodos}
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            {enviandoTodos ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enviando...
                              </>
                            ) : (
                              <>
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Enviar para Todos ({prestadoresEncontrados.filter((p) => !prestadoresEnviados.has(p.id)).length})
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lista de Prestadores */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {prestadoresEncontrados.map((prestador) => {
                    const tipoInfo = tiposPrestador[prestador.tipo]
                    const foiEnviado = prestadoresEnviados.has(prestador.id)

                    return (
                      <Card
                        key={prestador.id}
                        className={cn(
                          'p-5 transition-all hover:shadow-lg',
                          foiEnviado && 'border-green-300 bg-green-50'
                        )}
                      >
                        <div className="space-y-4">
                          {/* Header do Card */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {prestador.nome}
                              </h3>
                              <span
                                className={cn(
                                  'mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium',
                                  tipoInfo.color
                                )}
                              >
                                {tipoInfo.label}
                              </span>
                            </div>
                            {foiEnviado && (
                              <CheckCircle2 className="h-6 w-6 text-green-600" />
                            )}
                          </div>

                          {/* Avaliação */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-gray-900">
                                {prestador.avaliacaoMedia.toFixed(1)}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              ({prestador.totalAvaliacoes} avaliações)
                            </span>
                          </div>

                          {/* Distância e Tempo */}
                          <div className="space-y-2 rounded-lg bg-gray-50 p-3">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-gray-700">
                                {prestador.distanciaKm} km de distância
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Navigation className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">
                                Tempo estimado: {prestador.tempoEstimadoChegada}
                              </span>
                            </div>
                          </div>

                          {/* Especialidades */}
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-2">
                              ESPECIALIDADES:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {prestador.especialidades.map((esp, idx) => (
                                <span
                                  key={idx}
                                  className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700"
                                >
                                  {esp}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Estatísticas */}
                          <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                            <span>{prestador.atendimentosRealizados} atendimentos</span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {prestador.telefone}
                            </span>
                          </div>

                          {/* Botões de Ação */}
                          <div className="flex gap-2">
                            <Button
                              onClick={() => enviarCotacao(prestador)}
                              disabled={foiEnviado}
                              className={cn(
                                'flex-1 bg-green-600 hover:bg-green-700',
                                foiEnviado && 'opacity-75'
                              )}
                            >
                              <MessageCircle className="mr-2 h-4 w-4" />
                              {foiEnviado ? 'Cotação Enviada' : 'Pedir Cotação'}
                            </Button>
                            <Button
                              onClick={() => selecionarPrestador(prestador)}
                              variant="outline"
                              className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Selecionar este Prestador
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {prestadoresEnviados.size > 0 && (
                  <span className="font-medium text-green-600">
                    {prestadoresEnviados.size} cotação(ões) enviada(s)
                  </span>
                )}
              </p>
              <Button onClick={onClose} variant="outline">
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
