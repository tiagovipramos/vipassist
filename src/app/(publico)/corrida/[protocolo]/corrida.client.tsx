'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/componentes/ui/card'
import { Button } from '@/componentes/ui/button'
import {
  MapPin,
  Navigation,
  CheckCircle,
  AlertCircle,
  Camera,
  Loader2,
  Phone,
  User,
  Car,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CorridaClientProps {
  protocolo: string
}

interface DadosCorrida {
  protocolo: string
  clienteNome: string
  clienteTelefone: string
  veiculoPlaca: string
  veiculoMarca?: string
  veiculoModelo?: string
  origemEndereco: string
  destinoEndereco?: string
  tipoServico: string
  descricaoProblema: string
  prestadorNome: string
  prestadorTelefone: string
  token: string
}

interface Coordenada {
  lat: number
  lng: number
  timestamp: number
}

export function CorridaClient({ protocolo }: CorridaClientProps) {
  const [carregando, setCarregando] = useState(true)
  const [corrida, setCorrida] = useState<DadosCorrida | null>(null)
  const [corridaAceita, setCorridaAceita] = useState(false)
  const [rastreamentoAtivo, setRastreamentoAtivo] = useState(false)
  const [coordenadasEnviadas, setCoordenadasEnviadas] = useState(0)
  const [ultimaCoordenada, setUltimaCoordenada] = useState<Coordenada | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [fotoFinal, setFotoFinal] = useState<string | null>(null)
  const [enviandoFoto, setEnviandoFoto] = useState(false)

  const watchIdRef = useRef<number | null>(null)
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null)
  const wakeLockRef = useRef<any>(null)

  // Carrega dados da corrida
  useEffect(() => {
    carregarDadosCorrida()
  }, [protocolo])

  // Solicita Wake Lock para manter tela ativa
  useEffect(() => {
    if (rastreamentoAtivo && 'wakeLock' in navigator) {
      solicitarWakeLock()
    }

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release()
        wakeLockRef.current = null
      }
    }
  }, [rastreamentoAtivo])

  const solicitarWakeLock = async () => {
    try {
      // @ts-ignore - Wake Lock API ainda não está totalmente tipada
      wakeLockRef.current = await navigator.wakeLock.request('screen')
      console.log('Wake Lock ativado - tela permanecerá ativa')
    } catch (err) {
      console.error('Erro ao solicitar Wake Lock:', err)
    }
  }

  const carregarDadosCorrida = () => {
    setCarregando(true)

    // Busca dados da corrida no localStorage
    const chave = `corrida_${protocolo}`
    const dadosSalvos = localStorage.getItem(chave)

    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos)
      setCorrida(dados)

      // Verifica se já foi aceita
      const corridaAceitaKey = `corrida_aceita_${protocolo}`
      const jaAceita = localStorage.getItem(corridaAceitaKey) === 'true'
      setCorridaAceita(jaAceita)

      if (jaAceita) {
        iniciarRastreamento()
      }
    } else {
      setErro('Corrida não encontrada. Verifique o link.')
    }

    setCarregando(false)
  }

  const aceitarCorrida = () => {
    if (!corrida) return

    // Marca como aceita no localStorage
    const corridaAceitaKey = `corrida_aceita_${protocolo}`
    localStorage.setItem(corridaAceitaKey, 'true')
    setCorridaAceita(true)

    // Atualiza status do chamado para "em_execucao"
    atualizarStatusChamado('em_execucao')

    // Envia notificação para o sistema
    enviarNotificacaoAceitacao()

    // Inicia rastreamento
    iniciarRastreamento()
  }

  const enviarNotificacaoAceitacao = () => {
    // Salva evento de aceitação no localStorage para ser detectado pelo sistema
    const notificacao = {
      tipo: 'corrida_aceita',
      protocolo: protocolo,
      prestadorNome: corrida?.prestadorNome,
      timestamp: Date.now(),
    }
    
    const chave = `notificacao_${protocolo}`
    localStorage.setItem(chave, JSON.stringify(notificacao))
    
    // Dispara evento customizado para notificar outras abas
    window.dispatchEvent(new CustomEvent('corridaAceita', { 
      detail: notificacao 
    }))
  }

  const atualizarStatusChamado = (novoStatus: string) => {
    // Busca todos os chamados
    const chamados = JSON.parse(localStorage.getItem('chamados') || '[]')
    
    // Atualiza o status do chamado específico
    const chamadosAtualizados = chamados.map((chamado: any) => {
      if (chamado.protocolo === protocolo) {
        return {
          ...chamado,
          status: novoStatus,
          prestadorNome: corrida?.prestadorNome,
          prestadorTelefone: corrida?.prestadorTelefone,
          dataInicio: novoStatus === 'em_execucao' ? new Date().toISOString() : chamado.dataInicio,
          dataFinalizacao: novoStatus === 'finalizado' ? new Date().toISOString() : chamado.dataFinalizacao,
        }
      }
      return chamado
    })

    localStorage.setItem('chamados', JSON.stringify(chamadosAtualizados))
  }

  const iniciarRastreamento = () => {
    if (!navigator.geolocation) {
      setErro('Geolocalização não suportada neste dispositivo')
      return
    }

    setRastreamentoAtivo(true)

    // Solicita permissão e inicia rastreamento contínuo
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }

    // Usa watchPosition para rastreamento contínuo
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const coordenada: Coordenada = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now(),
        }

        setUltimaCoordenada(coordenada)
        salvarCoordenada(coordenada)
      },
      (error) => {
        console.error('Erro ao obter localização:', error)
        setErro('Erro ao obter localização. Verifique as permissões.')
      },
      options
    )

    // Também configura um intervalo de backup para garantir envio a cada 5 segundos
    intervalIdRef.current = setInterval(() => {
      if (ultimaCoordenada) {
        salvarCoordenada(ultimaCoordenada)
      }
    }, 5000)
  }

  const salvarCoordenada = (coordenada: Coordenada) => {
    const chave = `coordenadas_${protocolo}`
    const coordenadasSalvas = JSON.parse(localStorage.getItem(chave) || '[]')

    // Adiciona nova coordenada
    coordenadasSalvas.push(coordenada)

    // Remove coordenadas antigas (mais de 24 horas)
    const agora = Date.now()
    const coordenadasRecentes = coordenadasSalvas.filter(
      (c: Coordenada) => agora - c.timestamp < 24 * 60 * 60 * 1000
    )

    localStorage.setItem(chave, JSON.stringify(coordenadasRecentes))
    setCoordenadasEnviadas(coordenadasRecentes.length)

    console.log('Coordenada salva:', coordenada)
  }

  const pararRastreamento = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current)
      intervalIdRef.current = null
    }

    if (wakeLockRef.current) {
      wakeLockRef.current.release()
      wakeLockRef.current = null
    }

    setRastreamentoAtivo(false)
  }

  const comprimirImagem = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          // Define tamanho máximo (400x300) - menor para caber no banco
          let width = img.width
          let height = img.height
          const maxWidth = 400
          const maxHeight = 300
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height
              height = maxHeight
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          ctx?.drawImage(img, 0, 0, width, height)
          
          // Comprime para JPEG com qualidade 0.5 (mais compressão)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5)
          resolve(compressedDataUrl)
        }
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const capturarFoto = async () => {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.capture = 'environment'

      input.onchange = async (e: any) => {
        const file = e.target.files[0]
        if (file) {
          try {
            console.log('Tamanho original:', (file.size / 1024).toFixed(2), 'KB')
            const compressedImage = await comprimirImagem(file)
            console.log('Tamanho comprimido:', (compressedImage.length / 1024).toFixed(2), 'KB')
            setFotoFinal(compressedImage)
          } catch (error) {
            console.error('Erro ao comprimir imagem:', error)
            setErro('Erro ao processar foto')
          }
        }
      }

      input.click()
    } catch (error) {
      console.error('Erro ao capturar foto:', error)
      setErro('Erro ao capturar foto')
    }
  }

  const finalizarCorrida = async () => {
    if (!fotoFinal) {
      alert('Por favor, tire uma foto do veículo antes de finalizar')
      return
    }

    setEnviandoFoto(true)

    try {
      // Captura localização atual
      let localizacao = null
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          })
        })

        localizacao = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }

        console.log('Localização capturada:', localizacao)
      } catch (geoError) {
        console.error('Erro ao capturar localização:', geoError)
        // Continua mesmo sem localização
      }

      // Faz geocoding reverso para obter endereço
      let endereco = null
      if (localizacao) {
        try {
          const geocodeResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${localizacao.latitude}&lon=${localizacao.longitude}&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'VIP-ASSIST-App'
              }
            }
          )
          
          if (geocodeResponse.ok) {
            const geocodeData = await geocodeResponse.json()
            endereco = {
              logradouro: geocodeData.address.road || geocodeData.address.suburb || '',
              cidade: geocodeData.address.city || geocodeData.address.town || geocodeData.address.village || '',
              cep: geocodeData.address.postcode || '',
              enderecoCompleto: geocodeData.display_name || ''
            }
            console.log('Endereço obtido:', endereco)
          }
        } catch (geocodeError) {
          console.error('Erro ao fazer geocoding:', geocodeError)
          // Continua mesmo sem endereço
        }
      }

      // Faz upload da foto para o servidor
      console.log('Fazendo upload da foto...')
      let fotoUrl = null
      
      try {
        const uploadResponse = await fetch('/api/upload-foto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            protocolo: protocolo,
            foto: fotoFinal
          })
        })

        const uploadData = await uploadResponse.json()
        
        if (uploadData.success) {
          fotoUrl = uploadData.fotoUrl
          console.log('Foto salva no servidor:', fotoUrl)
        } else {
          console.error('Erro ao fazer upload da foto:', uploadData.error)
          alert('Erro ao salvar foto. Tente novamente.')
          return
        }
      } catch (uploadError) {
        console.error('Erro ao fazer upload:', uploadError)
        alert('Erro ao enviar foto para o servidor.')
        return
      }

      // Busca o ticket diretamente do banco de dados pelo protocolo
      console.log('Buscando ticket no banco de dados pelo protocolo:', protocolo)
      
      try {
        const buscarResponse = await fetch(`/api/tickets?protocolo=${protocolo}`)
        const buscarData = await buscarResponse.json()
        
        console.log('Resposta da busca:', buscarData)
        
        if (buscarData.success && buscarData.data && buscarData.data.length > 0) {
          const chamado = buscarData.data[0]
          console.log('Ticket encontrado no banco:', chamado)
          console.log('ID do ticket:', chamado.id)
          
          // Prepara dados para atualização
        const dadosAtualizacao: any = {
          status: 'finalizado',
          dataConclusao: new Date().toISOString(),
          fotoConclusao: fotoUrl, // URL da foto no servidor
        }

        // Adiciona localização se disponível
        if (localizacao) {
          dadosAtualizacao.conclusaoLatitude = localizacao.latitude
          dadosAtualizacao.conclusaoLongitude = localizacao.longitude
        }

        // Adiciona endereço se disponível
        if (endereco) {
          dadosAtualizacao.conclusaoEndereco = endereco.enderecoCompleto
          dadosAtualizacao.conclusaoCidade = endereco.cidade
          dadosAtualizacao.conclusaoCep = endereco.cep
        }

        console.log('Enviando dados de conclusão:', dadosAtualizacao)

        // Atualiza o ticket no banco de dados
        try {
          const response = await fetch(`/api/tickets/${chamado.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosAtualizacao),
          })

          const responseData = await response.json()

          if (!response.ok) {
            console.error('Erro ao atualizar ticket no banco:', responseData)
            alert(`Erro ao finalizar: ${responseData.error || 'Erro desconhecido'}`)
            return
          }

          console.log('Ticket atualizado com sucesso:', responseData)
        } catch (apiError) {
          console.error('Erro ao chamar API de atualização:', apiError)
          alert('Erro ao conectar com o servidor. Verifique sua conexão.')
          return
        }
      } else {
        console.error('Ticket não encontrado no banco de dados')
        alert('Erro: Ticket não encontrado. Entre em contato com o suporte.')
        return
      }
    } catch (buscarError) {
      console.error('Erro ao buscar ticket:', buscarError)
      alert('Erro ao buscar ticket. Verifique sua conexão.')
      return
    }

      // Para rastreamento
      pararRastreamento()

      // Atualiza status para finalizado no localStorage
      atualizarStatusChamado('finalizado')

      alert('✅ Corrida finalizada com sucesso!\n\n📍 Localização registrada\n📸 Foto salva\n\nVocê pode fechar esta aba agora.')
    } catch (error) {
      console.error('Erro ao finalizar corrida:', error)
      setErro('Erro ao finalizar corrida')
      alert('Erro ao finalizar corrida. Tente novamente.')
    } finally {
      setEnviandoFoto(false)
    }
  }

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Carregando dados da corrida...</p>
        </div>
      </div>
    )
  }

  if (erro || !corrida) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Erro</h2>
          <p className="mt-2 text-gray-600">{erro || 'Corrida não encontrada'}</p>
        </Card>
      </div>
    )
  }

  if (!corridaAceita) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <div className="mx-auto max-w-2xl py-8">
          <Card className="overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
              <h1 className="text-3xl font-bold">Nova Corrida Disponível</h1>
              <p className="mt-2 text-blue-100">Protocolo: {corrida.protocolo}</p>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-6">
              {/* Dados do Cliente */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <User className="h-5 w-5" />
                  Dados do Cliente
                </h3>
                <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm">
                    <span className="font-medium">Nome:</span> {corrida.clienteNome}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Telefone:</span> {corrida.clienteTelefone}
                  </p>
                </div>
              </div>

              {/* Dados do Veículo */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Car className="h-5 w-5" />
                  Veículo
                </h3>
                <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm">
                    <span className="font-medium">Placa:</span> {corrida.veiculoPlaca}
                  </p>
                  {corrida.veiculoMarca && (
                    <p className="text-sm">
                      <span className="font-medium">Modelo:</span> {corrida.veiculoMarca} {corrida.veiculoModelo}
                    </p>
                  )}
                </div>
              </div>

              {/* Localização */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <MapPin className="h-5 w-5" />
                  Localização
                </h3>
                <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm">
                    <span className="font-medium">Origem:</span> {corrida.origemEndereco}
                  </p>
                  {corrida.destinoEndereco && (
                    <p className="text-sm">
                      <span className="font-medium">Destino:</span> {corrida.destinoEndereco}
                    </p>
                  )}
                </div>
              </div>

              {/* Problema */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Descrição do Problema</h3>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-700">{corrida.descricaoProblema}</p>
                </div>
              </div>

              {/* Botão Aceitar */}
              <Button
                onClick={aceitarCorrida}
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
              >
                <CheckCircle className="mr-2 h-6 w-6" />
                Aceitar Corrida
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl py-8 space-y-6">
        {/* Status Card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-white">
            <h1 className="text-2xl font-bold">Corrida em Andamento</h1>
            <p className="text-green-100">Protocolo: {corrida.protocolo}</p>
          </div>

          <div className="p-6 space-y-4">
            {/* Aviso Importante */}
            <div className="rounded-lg bg-yellow-50 border-2 border-yellow-200 p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-900">⚠️ Importante</h3>
                  <p className="mt-1 text-sm text-yellow-800">
                    NÃO feche esta aba! O rastreamento continuará mesmo com a tela bloqueada.
                    Ao finalizar, você precisará tirar uma foto do veículo.
                  </p>
                </div>
              </div>
            </div>

            {/* Status do Rastreamento */}
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Navigation className="h-6 w-6 text-green-600" />
                    <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">Rastreamento Ativo</p>
                    <p className="text-sm text-green-700">
                      {coordenadasEnviadas} coordenadas registradas
                    </p>
                  </div>
                </div>
                <Clock className="h-5 w-5 text-green-600 animate-pulse" />
              </div>
            </div>

            {/* Última Coordenada */}
            {ultimaCoordenada && (
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <p className="text-sm font-medium text-blue-900 mb-2">Última Localização:</p>
                <p className="text-xs text-blue-700 font-mono">
                  Lat: {ultimaCoordenada.lat.toFixed(6)}, Lng: {ultimaCoordenada.lng.toFixed(6)}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {new Date(ultimaCoordenada.timestamp).toLocaleTimeString('pt-BR')}
                </p>
              </div>
            )}

            {/* Dados da Corrida */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{corrida.clienteNome}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <a href={`tel:${corrida.clienteTelefone}`} className="text-blue-600 hover:underline">
                  {corrida.clienteTelefone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Car className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{corrida.veiculoPlaca}</span>
              </div>
            </div>

            {/* Foto Final */}
            {!fotoFinal ? (
              <Button
                onClick={capturarFoto}
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Camera className="mr-2 h-5 w-5" />
                Tirar Foto do Veículo
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="rounded-lg border-2 border-green-500 overflow-hidden">
                  <img src={fotoFinal} alt="Foto do veículo" className="w-full" />
                </div>
                <Button
                  onClick={capturarFoto}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Tirar Nova Foto
                </Button>
              </div>
            )}

            {/* Botão Finalizar */}
            <Button
              onClick={finalizarCorrida}
              disabled={!fotoFinal || enviandoFoto}
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
            >
              {enviandoFoto ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Finalizando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-6 w-6" />
                  Finalizar Corrida
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
