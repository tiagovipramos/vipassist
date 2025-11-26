'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/componentes/ui/card'
import { Button } from '@/componentes/ui/button'
import { Input } from '@/componentes/ui/input'
import {
  Save,
  Send,
  AlertCircle,
  CheckCircle,
  User,
  Phone,
  MapPin,
  Car,
  FileText,
  Clock,
  Navigation,
  Route,
  Search,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormData {
  clienteNome: string
  clienteTelefone: string
  veiculoMarca: string
  veiculoModelo: string
  veiculoPlaca: string
  veiculoCor: string
  origemCep: string
  origemLogradouro: string
  origemNumero: string
  origemBairro: string
  origemCidade: string
  origemEstado: string
  origemReferencia: string
  destinoCep: string
  destinoLogradouro: string
  destinoNumero: string
  destinoBairro: string
  destinoCidade: string
  destinoEstado: string
  destinoReferencia: string
  tipoServico: string
  prioridade: string
  descricaoProblema: string
  observacoes: string
}

interface FormErrors {
  clienteNome?: string
  clienteTelefone?: string
  veiculoPlaca?: string
  origemCep?: string
  origemNumero?: string
  tipoServico?: string
  prioridade?: string
  descricaoProblema?: string
}

interface ValidacaoSistema {
  associadoAtivo: boolean | null
  pagamentoAdimplente: boolean | null
  coberturaVigente: boolean | null
  tipoServicoContratado: boolean | null
}

export function CriarTicketClient() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [protocolo, setProtocolo] = useState('')
  const [distanciaKm, setDistanciaKm] = useState<number | null>(null)
  const [tempoPrevisto, setTempoPrevisto] = useState<string | null>(null)
  const [condicaoTransito, setCondicaoTransito] = useState<'leve' | 'moderado' | 'intenso' | null>(null)
  const [buscandoCepOrigem, setBuscandoCepOrigem] = useState(false)
  const [buscandoCepDestino, setBuscandoCepDestino] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [validacaoSistema, setValidacaoSistema] = useState<ValidacaoSistema>({
    associadoAtivo: null,
    pagamentoAdimplente: null,
    coberturaVigente: null,
    tipoServicoContratado: null,
  })
  const [validacaoCompleta, setValidacaoCompleta] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    clienteNome: '',
    clienteTelefone: '',
    veiculoMarca: '',
    veiculoModelo: '',
    veiculoPlaca: '',
    veiculoCor: '',
    origemCep: '',
    origemLogradouro: '',
    origemNumero: '',
    origemBairro: '',
    origemCidade: '',
    origemEstado: '',
    origemReferencia: '',
    destinoCep: '',
    destinoLogradouro: '',
    destinoNumero: '',
    destinoBairro: '',
    destinoCidade: '',
    destinoEstado: '',
    destinoReferencia: '',
    tipoServico: '',
    prioridade: '',
    descricaoProblema: '',
    observacoes: '',
  })

  const tiposServico = [
    { value: 'pneu', label: '🔧 Troca de Pneu', desc: 'Troca de pneu furado' },
    { value: 'bateria', label: '🔋 Pane Elétrica', desc: 'Problemas elétricos' },
    { value: 'combustivel', label: '⛽ Falta de Combustível', desc: 'Abastecimento emergencial' },
    { value: 'chaveiro', label: '🔑 Chaveiro', desc: 'Abertura de veículo' },
    { value: 'mecanica', label: '⚙️ Pane Mecânica', desc: 'Problemas no motor' },
    { value: 'acidente', label: '🚙 Acidente/Colisão', desc: 'Remoção de acidentado' },
    { value: 'taxi', label: '🚕 Táxi/Transporte', desc: 'Transporte alternativo' },
    { value: 'residencial', label: '🏠 Assist. Residencial', desc: 'Serviço em casa' },
    { value: 'viagem', label: '🛣️ Assist. em Viagem', desc: 'Cobertura rodovias' },
    { value: 'reparos', label: '🔩 Pequenos Reparos', desc: 'Ajustes emergenciais' },
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleValidacaoChange = (campo: keyof ValidacaoSistema, valor: boolean) => {
    setValidacaoSistema((prev) => {
      const novaValidacao = { ...prev, [campo]: valor }
      
      // Verificar se todas as validações foram respondidas e são verdadeiras
      const todasRespondidas = Object.values(novaValidacao).every(v => v !== null)
      const todasPositivas = Object.values(novaValidacao).every(v => v === true)
      
      setValidacaoCompleta(todasRespondidas && todasPositivas)
      
      return novaValidacao
    })
  }

  const buscarCep = async (cep: string, tipo: 'origem' | 'destino') => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return

    if (tipo === 'origem') setBuscandoCepOrigem(true)
    else setBuscandoCepDestino(true)

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()

      if (!data.erro) {
        let cidadeOrigem = formData.origemCidade
        let cidadeDestino = formData.destinoCidade

        if (tipo === 'origem') {
          cidadeOrigem = data.localidade || ''
          setFormData((prev) => ({
            ...prev,
            origemLogradouro: data.logradouro || '',
            origemBairro: data.bairro || '',
            origemCidade: cidadeOrigem,
            origemEstado: data.uf || '',
          }))
        } else {
          cidadeDestino = data.localidade || ''
          setFormData((prev) => ({
            ...prev,
            destinoLogradouro: data.logradouro || '',
            destinoBairro: data.bairro || '',
            destinoCidade: cidadeDestino,
            destinoEstado: data.uf || '',
          }))
        }
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
    } finally {
      if (tipo === 'origem') setBuscandoCepOrigem(false)
      else setBuscandoCepDestino(false)
    }
  }

  const calcularDistanciaETempo = async () => {
    if (!formData.origemCep || !formData.destinoCep) return

    // Token do Mapbox para cálculo de rotas e trânsito
    const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoidGlhZ29yYW1vc3ZpcCIsImEiOiJjbWk1OXR3czgyZm0xMmtvbGN6aDBod2V5In0.mqwL3FAW88bjj_FlVsb7ug'

    try {
      // 1. Geocodificar origem usando Mapbox Geocoding API
      const origemQuery = `${formData.origemLogradouro} ${formData.origemNumero}, ${formData.origemCidade}, ${formData.origemEstado}, Brazil`
      const origemGeoResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(origemQuery)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=BR&limit=1`
      )
      const origemGeoData = await origemGeoResponse.json()

      // 2. Geocodificar destino usando Mapbox Geocoding API
      const destinoQuery = `${formData.destinoLogradouro} ${formData.destinoNumero || ''}, ${formData.destinoCidade}, ${formData.destinoEstado}, Brazil`
      const destinoGeoResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destinoQuery)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=BR&limit=1`
      )
      const destinoGeoData = await destinoGeoResponse.json()

      if (!origemGeoData.features || origemGeoData.features.length === 0 ||
          !destinoGeoData.features || destinoGeoData.features.length === 0) {
        alert('Não foi possível encontrar as coordenadas dos endereços. Verifique os dados informados.')
        return
      }

      const origemCoords = origemGeoData.features[0].center // [longitude, latitude]
      const destinoCoords = destinoGeoData.features[0].center // [longitude, latitude]

      // 3. Calcular rota usando Mapbox Directions API com perfil de trânsito
      // Usando 'driving-traffic' para considerar condições de trânsito em tempo real
      const directionsResponse = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${origemCoords[0]},${origemCoords[1]};${destinoCoords[0]},${destinoCoords[1]}?access_token=${MAPBOX_ACCESS_TOKEN}&geometries=geojson&overview=full&steps=false`
      )

      if (!directionsResponse.ok) {
        throw new Error('Erro ao calcular rota')
      }

      const directionsData = await directionsResponse.json()

      if (!directionsData.routes || directionsData.routes.length === 0) {
        alert('Não foi possível calcular a rota entre os endereços.')
        return
      }

      const route = directionsData.routes[0]

      // 4. Extrair informações da rota
      // Distância em km (Mapbox retorna em metros)
      const distanciaKm = Math.round(route.distance / 1000)
      setDistanciaKm(distanciaKm)

      // Tempo em minutos (Mapbox retorna em segundos, já considerando trânsito)
      const tempoSegundos = route.duration
      const tempoMinutos = Math.round(tempoSegundos / 60)
      const horas = Math.floor(tempoMinutos / 60)
      const minutos = tempoMinutos % 60

      if (horas > 0) {
        setTempoPrevisto(`${horas}h ${minutos}min`)
      } else {
        setTempoPrevisto(`${minutos} minutos`)
      }

      // 5. Determinar condição de trânsito baseado na velocidade média
      const velocidadeMedia = (distanciaKm / (tempoSegundos / 3600)) // km/h
      
      // Ajustado para refletir melhor as condições de trânsito urbano no Brasil
      if (velocidadeMedia >= 40) {
        setCondicaoTransito('leve')
      } else if (velocidadeMedia >= 20) {
        setCondicaoTransito('moderado')
      } else {
        setCondicaoTransito('intenso')
      }

      console.log('Rota calculada:', {
        distancia: distanciaKm,
        tempo: tempoMinutos,
        velocidadeMedia: velocidadeMedia.toFixed(1),
        condicaoTransito: velocidadeMedia >= 40 ? 'leve' : velocidadeMedia >= 20 ? 'moderado' : 'intenso',
        origem: origemCoords,
        destino: destinoCoords
      })

    } catch (error) {
      console.error('Erro ao calcular distância:', error)
      alert('Erro ao calcular distância e tempo. Verifique sua conexão e tente novamente.')
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.clienteNome.trim()) newErrors.clienteNome = 'Nome do cliente é obrigatório'
    if (!formData.clienteTelefone.trim()) newErrors.clienteTelefone = 'Telefone é obrigatório'
    if (!formData.veiculoPlaca.trim()) newErrors.veiculoPlaca = 'Placa do veículo é obrigatória'
    if (!formData.origemCep.trim()) newErrors.origemCep = 'CEP de origem é obrigatório'
    if (!formData.origemNumero.trim()) newErrors.origemNumero = 'Número é obrigatório'
    if (!formData.tipoServico) newErrors.tipoServico = 'Tipo de serviço é obrigatório'
    if (!formData.prioridade) newErrors.prioridade = 'Prioridade é obrigatória'
    if (!formData.descricaoProblema.trim()) newErrors.descricaoProblema = 'Descrição do problema é obrigatória'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const gerarProtocolo = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `AST${timestamp}${random}`
  }

  // useEffect para calcular automaticamente quando os endereços mudarem
  useEffect(() => {
    // Verificar se temos todos os dados necessários
    const temDadosCompletos = 
      formData.origemCep &&
      formData.origemLogradouro &&
      formData.origemNumero &&
      formData.origemCidade &&
      formData.destinoCep &&
      formData.destinoLogradouro &&
      formData.destinoCidade

    if (temDadosCompletos) {
      // Debounce: aguardar 1 segundo após a última mudança antes de calcular
      const timer = setTimeout(() => {
        calcularDistanciaETempo()
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      // Limpar resultados se os dados não estiverem completos
      setDistanciaKm(null)
      setTempoPrevisto(null)
      setCondicaoTransito(null)
    }
  }, [
    formData.origemCep,
    formData.origemLogradouro,
    formData.origemNumero,
    formData.origemCidade,
    formData.destinoCep,
    formData.destinoLogradouro,
    formData.destinoNumero,
    formData.destinoCidade,
  ])

  const handleSubmit = async (asDraft: boolean = false) => {
    // Verificar validação do sistema (exceto para rascunhos)
    if (!asDraft && !validacaoCompleta) {
      alert('Por favor, complete a validação de liberação de serviço antes de criar o chamado.')
      return
    }

    if (!asDraft && !validateForm()) return

    setIsSubmitting(true)

    try {
      // Primeiro, buscar ou criar cliente
      const responseClientes = await fetch('/api/clientes')
      const dataClientes = await responseClientes.json()
      
      let clienteId = null
      if (dataClientes.success && dataClientes.data.length > 0) {
        // Usar o primeiro cliente por enquanto
        clienteId = dataClientes.data[0].id
      }
      
      if (!clienteId) {
        alert('Erro: Nenhum cliente encontrado no sistema. Por favor, cadastre um cliente primeiro.')
        return
      }

      // Geocodificar endereço de origem para obter coordenadas
      const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoidGlhZ29yYW1vc3ZpcCIsImEiOiJjbWk1OXR3czgyZm0xMmtvbGN6aDBod2V5In0.mqwL3FAW88bjj_FlVsb7ug'
      const origemQuery = `${formData.origemLogradouro} ${formData.origemNumero}, ${formData.origemCidade}, ${formData.origemEstado}, Brazil`
      const origemGeoResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(origemQuery)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=BR&limit=1`
      )
      const origemGeoData = await origemGeoResponse.json()
      
      let origemLatitude = null
      let origemLongitude = null
      if (origemGeoData.features && origemGeoData.features.length > 0) {
        origemLongitude = origemGeoData.features[0].center[0]
        origemLatitude = origemGeoData.features[0].center[1]
      }

      // Geocodificar destino se houver
      let destinoLatitude = null
      let destinoLongitude = null
      if (formData.destinoCep && formData.destinoLogradouro) {
        const destinoQuery = `${formData.destinoLogradouro} ${formData.destinoNumero || ''}, ${formData.destinoCidade}, ${formData.destinoEstado}, Brazil`
        const destinoGeoResponse = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destinoQuery)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=BR&limit=1`
        )
        const destinoGeoData = await destinoGeoResponse.json()
        
        if (destinoGeoData.features && destinoGeoData.features.length > 0) {
          destinoLongitude = destinoGeoData.features[0].center[0]
          destinoLatitude = destinoGeoData.features[0].center[1]
        }
      }

      // Criar ticket no banco de dados usando o service
      const { ticketsService } = await import('@/lib/services/tickets.service')
      
      const ticketData = {
        clienteId,
        tipoServico: formData.tipoServico,
        descricaoProblema: formData.descricaoProblema,
        origemCep: formData.origemCep,
        origemEndereco: `${formData.origemLogradouro}, ${formData.origemNumero}`,
        origemCidade: `${formData.origemCidade} - ${formData.origemEstado}`,
        origemLatitude,
        origemLongitude,
        destinoCep: formData.destinoCep || undefined,
        destinoEndereco: formData.destinoLogradouro ? `${formData.destinoLogradouro}, ${formData.destinoNumero || ''}` : undefined,
        destinoCidade: formData.destinoCidade ? `${formData.destinoCidade} - ${formData.destinoEstado}` : undefined,
        destinoLatitude,
        destinoLongitude,
        distanciaKm: distanciaKm || undefined,
        prioridade: formData.prioridade as 'critica' | 'alta' | 'media',
      }

      const ticket = await ticketsService.criar(ticketData)
      
      setProtocolo(ticket.protocolo)
      setShowSuccess(true)
      setTimeout(() => router.push('/tickets#aguardando'), 2000)
    } catch (error) {
      console.error('Erro ao criar chamado:', error)
      alert('Erro ao criar chamado. Verifique os dados e tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Chamado Criado com Sucesso!</h2>
          <div className="mb-4 rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-gray-600">Protocolo:</p>
            <p className="text-2xl font-bold text-blue-600">{protocolo}</p>
          </div>
          <p className="mb-6 text-gray-600">
            Um prestador será designado em breve. O cliente receberá atualizações por SMS.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => router.push('/tickets')} className="flex-1">
              Ver Chamados
            </Button>
            <Button
              onClick={() => {
                setShowSuccess(false)
                setFormData({
                  clienteNome: '',
                  clienteTelefone: '',
                  veiculoMarca: '',
                  veiculoModelo: '',
                  veiculoPlaca: '',
                  veiculoCor: '',
                  origemCep: '',
                  origemLogradouro: '',
                  origemNumero: '',
                  origemBairro: '',
                  origemCidade: '',
                  origemEstado: '',
                  origemReferencia: '',
                  destinoCep: '',
                  destinoLogradouro: '',
                  destinoNumero: '',
                  destinoBairro: '',
                  destinoCidade: '',
                  destinoEstado: '',
                  destinoReferencia: '',
                  tipoServico: '',
                  prioridade: '',
                  descricaoProblema: '',
                  observacoes: '',
                })
                setDistanciaKm(null)
              }}
              variant="outline"
              className="flex-1"
            >
              Novo Chamado
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const mostrarDestino = false

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8" style={{ paddingTop: '20px' }}>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Dados do Cliente e Veículo lado a lado */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Dados do Cliente */}
          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <User className="h-5 w-5" />
              Dados do Cliente
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Nome Completo *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    value={formData.clienteNome}
                    onChange={(e) => handleInputChange('clienteNome', e.target.value)}
                    placeholder="Ex: João Silva"
                    className={cn('pl-10', errors.clienteNome && 'border-red-500')}
                  />
                </div>
                {errors.clienteNome && <p className="mt-1 text-xs text-red-600">{errors.clienteNome}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Telefone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="tel"
                    value={formData.clienteTelefone}
                    onChange={(e) => handleInputChange('clienteTelefone', e.target.value)}
                    placeholder="(11) 98765-4321"
                    className={cn('pl-10', errors.clienteTelefone && 'border-red-500')}
                  />
                </div>
                {errors.clienteTelefone && <p className="mt-1 text-xs text-red-600">{errors.clienteTelefone}</p>}
              </div>
            </div>
          </Card>

          {/* Dados do Veículo */}
          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Car className="h-5 w-5" />
              Dados do Veículo
            </h2>
            <div className="grid gap-4 grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Placa *</label>
                <Input
                  type="text"
                  value={formData.veiculoPlaca}
                  onChange={(e) => handleInputChange('veiculoPlaca', e.target.value.toUpperCase())}
                  placeholder="ABC-1234"
                  maxLength={8}
                  className={errors.veiculoPlaca ? 'border-red-500' : ''}
                />
                {errors.veiculoPlaca && <p className="mt-1 text-xs text-red-600">{errors.veiculoPlaca}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Cor</label>
                <Input
                  type="text"
                  value={formData.veiculoCor}
                  onChange={(e) => handleInputChange('veiculoCor', e.target.value)}
                  placeholder="Ex: Prata"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Marca</label>
                <Input
                  type="text"
                  value={formData.veiculoMarca}
                  onChange={(e) => handleInputChange('veiculoMarca', e.target.value)}
                  placeholder="Ex: Volkswagen"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Modelo</label>
                <Input
                  type="text"
                  value={formData.veiculoModelo}
                  onChange={(e) => handleInputChange('veiculoModelo', e.target.value)}
                  placeholder="Ex: Gol"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Validação de Liberação de Serviço */}
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Shield className="h-5 w-5" />
            Validar Liberação de Serviço
          </h2>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Selecione as opções abaixo para validar a elegibilidade do serviço:
            </p>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Associado Ativo */}
              <div className="rounded-lg border border-gray-200 p-4">
                <label className="block mb-2">
                  <span className="block font-medium text-gray-900 mb-1">Associado ativo</span>
                  <span className="text-sm text-gray-600 block mb-3">Verificar se o cliente possui cadastro ativo no sistema</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleValidacaoChange('associadoAtivo', true)}
                    className={cn(
                      'flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-all',
                      validacaoSistema.associadoAtivo === true
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    )}
                  >
                    ✓ Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => handleValidacaoChange('associadoAtivo', false)}
                    className={cn(
                      'flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-all',
                      validacaoSistema.associadoAtivo === false
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    )}
                  >
                    ✗ Não
                  </button>
                </div>
              </div>

              {/* Pagamento Adimplente */}
              <div className="rounded-lg border border-gray-200 p-4">
                <label className="block mb-2">
                  <span className="block font-medium text-gray-900 mb-1">Pagamento adimplente</span>
                  <span className="text-sm text-gray-600 block mb-3">Confirmar que não há pendências financeiras</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleValidacaoChange('pagamentoAdimplente', true)}
                    className={cn(
                      'flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-all',
                      validacaoSistema.pagamentoAdimplente === true
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    )}
                  >
                    ✓ Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => handleValidacaoChange('pagamentoAdimplente', false)}
                    className={cn(
                      'flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-all',
                      validacaoSistema.pagamentoAdimplente === false
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    )}
                  >
                    ✗ Não
                  </button>
                </div>
              </div>

              {/* Cobertura Vigente */}
              <div className="rounded-lg border border-gray-200 p-4">
                <label className="block mb-2">
                  <span className="block font-medium text-gray-900 mb-1">Cobertura vigente</span>
                  <span className="text-sm text-gray-600 block mb-3">Validar que o plano está dentro da vigência</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleValidacaoChange('coberturaVigente', true)}
                    className={cn(
                      'flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-all',
                      validacaoSistema.coberturaVigente === true
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    )}
                  >
                    ✓ Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => handleValidacaoChange('coberturaVigente', false)}
                    className={cn(
                      'flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-all',
                      validacaoSistema.coberturaVigente === false
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    )}
                  >
                    ✗ Não
                  </button>
                </div>
              </div>

              {/* Tipo de Serviço Contratado */}
              <div className="rounded-lg border border-gray-200 p-4">
                <label className="block mb-2">
                  <span className="block font-medium text-gray-900 mb-1">Tipo de serviço contratado</span>
                  <span className="text-sm text-gray-600 block mb-3">Confirmar que o serviço solicitado está incluído no plano</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleValidacaoChange('tipoServicoContratado', true)}
                    className={cn(
                      'flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-all',
                      validacaoSistema.tipoServicoContratado === true
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    )}
                  >
                    ✓ Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => handleValidacaoChange('tipoServicoContratado', false)}
                    className={cn(
                      'flex-1 px-4 py-2 rounded-lg border-2 font-medium transition-all',
                      validacaoSistema.tipoServicoContratado === false
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    )}
                  >
                    ✗ Não
                  </button>
                </div>
              </div>
            </div>

            {/* Status da Validação */}
            {validacaoCompleta ? (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-4 border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                <div>
                  <p className="font-medium text-green-900">Validação completa</p>
                  <p className="text-sm text-green-700">Todos os requisitos foram atendidos. Você pode prosseguir com a criação do chamado.</p>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-yellow-50 p-4 border border-yellow-200">
                <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
                <div>
                  <p className="font-medium text-yellow-900">Validação pendente</p>
                  <p className="text-sm text-yellow-700">Selecione "Sim" em todos os itens acima para liberar a criação do chamado.</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Tipo de Serviço */}
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <FileText className="h-5 w-5" />
            Tipo de Serviço
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Selecione o serviço necessário *</label>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {tiposServico.map((servico) => (
                  <button
                    key={servico.value}
                    type="button"
                    onClick={() => handleInputChange('tipoServico', servico.value)}
                    className={cn(
                      'flex flex-col items-start rounded-lg border-2 p-4 text-left transition-all',
                      formData.tipoServico === servico.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300',
                      errors.tipoServico && !formData.tipoServico && 'border-red-300'
                    )}
                  >
                    <span className="text-lg font-semibold">{servico.label}</span>
                    <span className="text-xs text-gray-600">{servico.desc}</span>
                  </button>
                ))}
              </div>
              {errors.tipoServico && <p className="mt-1 text-xs text-red-600">{errors.tipoServico}</p>}
            </div>

            {/* Perguntas de Triagem por Tipo de Serviço */}
            {formData.tipoServico === 'pneu' && (
              <div className="rounded-lg border-2 border-teal-200 bg-teal-50 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-teal-900">
                  <AlertCircle className="h-5 w-5" />
                  Perguntas de Triagem - Troca de Pneu
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-teal-900">
                      Possui estepe em bom estado?
                    </label>
                    <select className="w-full rounded-lg border border-teal-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, estepe em bom estado</option>
                      <option value="nao">Não possui estepe</option>
                      <option value="ruim">Estepe em mau estado</option>
                      <option value="nao_sabe">Não sabe/Não verificou</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-teal-900">
                      Possui macaco e chave de roda?
                    </label>
                    <select className="w-full rounded-lg border border-teal-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, possui ambos</option>
                      <option value="nao">Não possui</option>
                      <option value="parcial">Possui apenas um deles</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-teal-900">
                      Qual pneu está furado?
                    </label>
                    <select className="w-full rounded-lg border border-teal-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20">
                      <option value="">Selecione...</option>
                      <option value="dianteiro_esq">Dianteiro esquerdo</option>
                      <option value="dianteiro_dir">Dianteiro direito</option>
                      <option value="traseiro_esq">Traseiro esquerdo</option>
                      <option value="traseiro_dir">Traseiro direito</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-teal-900">
                      Sabe trocar o pneu?
                    </label>
                    <select className="w-full rounded-lg border border-teal-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim_nao_tentou">Sim, mas não tentou</option>
                      <option value="tentou_nao_conseguiu">Tentou mas não conseguiu</option>
                      <option value="nao_sabe">Não sabe trocar</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-teal-900">
                      Local seguro para troca?
                    </label>
                    <select className="w-full rounded-lg border border-teal-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20">
                      <option value="">Selecione...</option>
                      <option value="seguro">Local seguro</option>
                      <option value="perigoso">Local perigoso (rodovia/curva)</option>
                      <option value="medio">Razoavelmente seguro</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-teal-900">
                      Estado do pneu?
                    </label>
                    <select className="w-full rounded-lg border border-teal-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20">
                      <option value="">Selecione...</option>
                      <option value="vazio">Completamente vazio</option>
                      <option value="murcho">Apenas murcho</option>
                      <option value="rasgado">Rasgado/Estourado</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {formData.tipoServico === 'bateria' && (
              <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-yellow-900">
                  <AlertCircle className="h-5 w-5" />
                  Perguntas de Triagem - Pane Elétrica
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-yellow-900">
                      O veículo dá algum sinal ao girar a chave?
                    </label>
                    <select className="w-full rounded-lg border border-yellow-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20">
                      <option value="">Selecione...</option>
                      <option value="painel_acende">Painel acende</option>
                      <option value="motor_gira">Motor gira mas não pega</option>
                      <option value="nenhum_sinal">Nenhum sinal</option>
                      <option value="clique">Apenas um clique</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-yellow-900">
                      Alguma luz ficou acesa no veículo?
                    </label>
                    <select className="w-full rounded-lg border border-yellow-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, luz ficou acesa</option>
                      <option value="nao">Não</option>
                      <option value="nao_sabe">Não sabe</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-yellow-900">
                      Há quanto tempo a bateria foi trocada?
                    </label>
                    <select className="w-full rounded-lg border border-yellow-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20">
                      <option value="">Selecione...</option>
                      <option value="menos_1ano">Menos de 1 ano</option>
                      <option value="1_2anos">1 a 2 anos</option>
                      <option value="2_3anos">2 a 3 anos</option>
                      <option value="mais_3anos">Mais de 3 anos</option>
                      <option value="nunca">Nunca trocou</option>
                      <option value="nao_sabe">Não sabe</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-yellow-900">
                      Tem alguém próximo para tentar chupeta?
                    </label>
                    <select className="w-full rounded-lg border border-yellow-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, tem alguém disponível</option>
                      <option value="nao">Não tem ninguém</option>
                      <option value="tentou">Já tentou e não funcionou</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-yellow-900">
                      Apresentou problema elétrico antes?
                    </label>
                    <select className="w-full rounded-lg border border-yellow-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, luzes piscando</option>
                      <option value="radio">Sim, rádio falhando</option>
                      <option value="varios">Sim, vários problemas</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-yellow-900">
                      Há cheiro de queimado ou fumaça?
                    </label>
                    <select className="w-full rounded-lg border border-yellow-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, há cheiro/fumaça</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {formData.tipoServico === 'chaveiro' && (
              <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-blue-900">
                  <AlertCircle className="h-5 w-5" />
                  Perguntas de Triagem - Chaveiro
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-blue-900">
                      Situação da chave?
                    </label>
                    <select className="w-full rounded-lg border border-blue-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option value="">Selecione...</option>
                      <option value="presa_dentro">Presa dentro do veículo</option>
                      <option value="perdida">Perdida</option>
                      <option value="quebrada">Quebrada</option>
                      <option value="nao_funciona">Não funciona</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-blue-900">
                      O carro está trancado?
                    </label>
                    <select className="w-full rounded-lg border border-blue-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, totalmente trancado</option>
                      <option value="nao">Não</option>
                      <option value="parcial">Parcialmente (vidro aberto)</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-blue-900">
                      Tem chave reserva?
                    </label>
                    <select className="w-full rounded-lg border border-blue-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim_longe">Sim, mas está longe</option>
                      <option value="sim_perto">Sim, alguém pode trazer</option>
                      <option value="nao">Não possui</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-blue-900">
                      Onde está o veículo?
                    </label>
                    <select className="w-full rounded-lg border border-blue-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option value="">Selecione...</option>
                      <option value="residencia">Na residência</option>
                      <option value="trabalho">No trabalho</option>
                      <option value="estacionamento">Em estacionamento</option>
                      <option value="rua">Na rua</option>
                      <option value="rodovia">Em rodovia</option>
                      <option value="outro">Outro local</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 rounded-lg bg-yellow-50 border border-yellow-300 p-3">
                    <p className="text-sm font-medium text-yellow-900">
                      ⚠️ Obs: Não confeccionamos outra chave, somente abertura do veículo.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formData.tipoServico === 'combustivel' && (
              <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-orange-900">
                  <AlertCircle className="h-5 w-5" />
                  Perguntas de Triagem - Pane Seca
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-orange-900">
                      Marcador de combustível está em zero?
                    </label>
                    <select className="w-full rounded-lg border border-orange-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, marcador em zero</option>
                      <option value="nao">Não, outro problema</option>
                      <option value="nao_sabe">Não verificou o marcador</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-orange-900">
                      Tem posto de combustível próximo?
                    </label>
                    <select className="w-full rounded-lg border border-orange-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20">
                      <option value="">Selecione...</option>
                      <option value="perto">Sim, menos de 1 km</option>
                      <option value="medio">Sim, entre 1-3 km</option>
                      <option value="longe">Sim, mais de 3 km</option>
                      <option value="nao">Não tem próximo</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-orange-900">
                      Cliente pode ir buscar combustível?
                    </label>
                    <select className="w-full rounded-lg border border-orange-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, pode ir</option>
                      <option value="nao_distancia">Não, muito longe</option>
                      <option value="nao_condicao">Não, sem condições</option>
                      <option value="nao_seguranca">Não, local perigoso</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-orange-900">
                      Há algum risco adicional?
                    </label>
                    <select className="w-full rounded-lg border border-orange-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20">
                      <option value="">Selecione...</option>
                      <option value="nao">Não há riscos</option>
                      <option value="vazamento">Sim, vazamento</option>
                      <option value="fumaca">Sim, fumaça</option>
                      <option value="queimado">Sim, cheiro de queimado</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-orange-900">
                      Funcionava normalmente antes de parar?
                    </label>
                    <select className="w-full rounded-lg border border-orange-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, funcionando normal</option>
                      <option value="nao">Não, apresentava problemas</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-orange-900">
                      Há quanto tempo está sem combustível?
                    </label>
                    <select className="w-full rounded-lg border border-orange-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20">
                      <option value="">Selecione...</option>
                      <option value="pouco">Menos de 30 minutos</option>
                      <option value="medio">30 minutos a 1 hora</option>
                      <option value="muito">Mais de 1 hora</option>
                      <option value="tentou_muito">Mais de 1 hora, tentou partida várias vezes</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {formData.tipoServico === 'mecanica' && (
              <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                  <AlertCircle className="h-5 w-5" />
                  Perguntas de Triagem - Pane Mecânica
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                      Qual o sintoma principal?
                    </label>
                    <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                      <option value="">Selecione...</option>
                      <option value="barulho">Barulho estranho</option>
                      <option value="fumaca">Fumaça</option>
                      <option value="vazamento">Vazamento</option>
                      <option value="superaquecimento">Superaquecimento</option>
                      <option value="nao_liga">Não liga</option>
                      <option value="perda_potencia">Perda de potência</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                      O motor liga?
                    </label>
                    <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim_normal">Sim, funciona normal</option>
                      <option value="sim_barulho">Sim, mas com barulho</option>
                      <option value="sim_falha">Sim, mas falhando</option>
                      <option value="nao">Não liga</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                      Quando o problema começou?
                    </label>
                    <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                      <option value="">Selecione...</option>
                      <option value="agora">Agora mesmo</option>
                      <option value="hoje">Hoje</option>
                      <option value="dias">Há alguns dias</option>
                      <option value="gradual">Foi gradual</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                      Há vazamento embaixo do veículo?
                    </label>
                    <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim_oleo">Sim, óleo</option>
                      <option value="sim_agua">Sim, água</option>
                      <option value="sim_outro">Sim, outro fluido</option>
                      <option value="nao">Não há vazamento</option>
                      <option value="nao_verificou">Não verificou</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                      Última revisão/manutenção?
                    </label>
                    <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                      <option value="">Selecione...</option>
                      <option value="recente">Menos de 3 meses</option>
                      <option value="medio">3 a 6 meses</option>
                      <option value="antigo">Mais de 6 meses</option>
                      <option value="nunca">Nunca fez</option>
                      <option value="nao_sabe">Não sabe</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-900">
                      Está em local seguro?
                    </label>
                    <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, local seguro</option>
                      <option value="nao">Não, local perigoso</option>
                      <option value="pode_empurrar">Pode empurrar para local seguro</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {formData.tipoServico === 'taxi' && (
              <div className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-indigo-900">
                  <AlertCircle className="h-5 w-5" />
                  Perguntas de Triagem - Táxi/Transporte
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-indigo-900">
                      Motivo do transporte alternativo?
                    </label>
                    <select className="w-full rounded-lg border border-indigo-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                      <option value="">Selecione...</option>
                      <option value="veiculo_inoperante">Veículo inoperante</option>
                      <option value="acidente">Após acidente</option>
                      <option value="reboque">Veículo sendo rebocado</option>
                      <option value="manutencao">Veículo em manutenção</option>
                      <option value="outro">Outro motivo</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-indigo-900">
                      Quantas pessoas precisam de transporte?
                    </label>
                    <select className="w-full rounded-lg border border-indigo-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                      <option value="">Selecione...</option>
                      <option value="1">1 pessoa</option>
                      <option value="2">2 pessoas</option>
                      <option value="3">3 pessoas</option>
                      <option value="4">4 pessoas</option>
                      <option value="5+">5 ou mais pessoas</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-indigo-900">
                      Aplicativo de transporte disponível na região?
                    </label>
                    <select className="w-full rounded-lg border border-indigo-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, tem disponível</option>
                      <option value="nao">Não tem na região</option>
                      <option value="tentou">Tentou mas não conseguiu</option>
                      <option value="caro">Muito caro</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-indigo-900">
                      Há bagagens ou itens especiais?
                    </label>
                    <select className="w-full rounded-lg border border-indigo-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                      <option value="">Selecione...</option>
                      <option value="nao">Não</option>
                      <option value="bagagem">Sim, bagagens</option>
                      <option value="crianca">Sim, criança pequena</option>
                      <option value="idoso">Sim, idoso/mobilidade reduzida</option>
                      <option value="pet">Sim, animal de estimação</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {formData.tipoServico === 'residencial' && (
              <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-green-900">
                  <AlertCircle className="h-5 w-5" />
                  Perguntas de Triagem - Assistência Residencial
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-green-900">
                      Tipo de problema na residência?
                    </label>
                    <select className="w-full rounded-lg border border-green-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
                      <option value="">Selecione...</option>
                      <option value="eletrico">Elétrico</option>
                      <option value="hidraulico">Hidráulico</option>
                      <option value="chaveiro">Chaveiro</option>
                      <option value="vidraceiro">Vidraceiro</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-green-900">
                      Relacionado ao veículo ou problema doméstico?
                    </label>
                    <select className="w-full rounded-lg border border-green-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
                      <option value="">Selecione...</option>
                      <option value="veiculo">Relacionado ao veículo</option>
                      <option value="domestico">Problema doméstico</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-green-900">
                      Há risco de segurança ou emergência?
                    </label>
                    <select className="w-full rounded-lg border border-green-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim_vazamento_gas">Sim, vazamento de gás</option>
                      <option value="sim_curto">Sim, curto-circuito</option>
                      <option value="sim_vazamento_agua">Sim, vazamento de água</option>
                      <option value="nao">Não há risco</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-green-900">
                      Já tentou resolver por conta própria?
                    </label>
                    <select className="w-full rounded-lg border border-green-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim_resolveu">Sim, mas não resolveu</option>
                      <option value="sim_piorou">Sim, e piorou</option>
                      <option value="nao">Não tentou</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-green-900">
                      Tem profissional de confiança disponível?
                    </label>
                    <select className="w-full rounded-lg border border-green-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
                      <option value="">Selecione...</option>
                      <option value="nao_tem">Não tem</option>
                      <option value="indisponivel">Tem mas está indisponível</option>
                      <option value="nao_atende">Não atende/Não responde</option>
                      <option value="muito_caro">Muito caro</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-green-900">
                      Urgência do problema?
                    </label>
                    <select className="w-full rounded-lg border border-green-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
                      <option value="">Selecione...</option>
                      <option value="emergencial">Emergencial - Risco imediato</option>
                      <option value="urgente">Urgente - Precisa hoje</option>
                      <option value="pode_aguardar">Pode aguardar</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {formData.tipoServico === 'viagem' && (
              <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-amber-900">
                  <AlertCircle className="h-5 w-5" />
                  Perguntas de Triagem - Assistência em Viagem
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-amber-900">
                      Distância da cidade de origem?
                    </label>
                    <select className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20">
                      <option value="">Selecione...</option>
                      <option value="ate_100km">Até 100 km</option>
                      <option value="100_200km">100 a 200 km</option>
                      <option value="200_300km">200 a 300 km</option>
                      <option value="mais_300km">Mais de 300 km</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-amber-900">
                      Tipo de problema com o veículo?
                    </label>
                    <select className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20">
                      <option value="">Selecione...</option>
                      <option value="pneu">Pneu furado</option>
                      <option value="bateria">Bateria</option>
                      <option value="combustivel">Sem combustível</option>
                      <option value="mecanico">Problema mecânico</option>
                      <option value="acidente">Acidente</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-amber-900">
                      Está em local seguro?
                    </label>
                    <select className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20">
                      <option value="">Selecione...</option>
                      <option value="seguro">Sim, local seguro (posto/cidade)</option>
                      <option value="acostamento">Acostamento de rodovia</option>
                      <option value="perigoso">Local perigoso</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-amber-900">
                      Tem oficina mecânica próxima?
                    </label>
                    <select className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim_perto">Sim, menos de 5 km</option>
                      <option value="sim_longe">Sim, mais de 5 km</option>
                      <option value="nao">Não tem próxima</option>
                      <option value="tentou">Tentou mas não atende</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-amber-900">
                      Quantas pessoas no veículo?
                    </label>
                    <select className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20">
                      <option value="">Selecione...</option>
                      <option value="1">1 pessoa</option>
                      <option value="2">2 pessoas</option>
                      <option value="3_4">3 a 4 pessoas</option>
                      <option value="5+">5 ou mais pessoas</option>
                      <option value="criancas">Há crianças</option>
                      <option value="idosos">Há idosos</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-amber-900">
                      Preferência de destino?
                    </label>
                    <select className="w-full rounded-lg border border-amber-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20">
                      <option value="">Selecione...</option>
                      <option value="retornar">Retornar para origem</option>
                      <option value="seguir">Seguir para destino</option>
                      <option value="mais_proximo">O mais próximo</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {formData.tipoServico === 'reparos' && (
              <div className="rounded-lg border-2 border-pink-200 bg-pink-50 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-pink-900">
                  <AlertCircle className="h-5 w-5" />
                  Perguntas de Triagem - Pequenos Reparos
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-pink-900">
                      Tipo de reparo necessário?
                    </label>
                    <select className="w-full rounded-lg border border-pink-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                      <option value="">Selecione...</option>
                      <option value="correia">Correia</option>
                      <option value="mangueira">Mangueira</option>
                      <option value="fusivel">Fusível</option>
                      <option value="lampada">Lâmpada</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-pink-900">
                      O veículo está funcionando?
                    </label>
                    <select className="w-full rounded-lg border border-pink-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, funcionando</option>
                      <option value="nao">Não, parado</option>
                      <option value="parcial">Funcionando parcialmente</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-pink-900">
                      É emergencial ou pode aguardar?
                    </label>
                    <select className="w-full rounded-lg border border-pink-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                      <option value="">Selecione...</option>
                      <option value="emergencial">Emergencial</option>
                      <option value="urgente">Urgente</option>
                      <option value="pode_aguardar">Pode aguardar</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-pink-900">
                      Já tentou fazer o reparo?
                    </label>
                    <select className="w-full rounded-lg border border-pink-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                      <option value="">Selecione...</option>
                      <option value="nao">Não tentou</option>
                      <option value="sim_nao_conseguiu">Sim, mas não conseguiu</option>
                      <option value="sem_ferramentas">Não tem ferramentas</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-pink-900">
                      Pode ser feito no local?
                    </label>
                    <select className="w-full rounded-lg border border-pink-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, no local</option>
                      <option value="nao">Não, precisa oficina</option>
                      <option value="nao_sabe">Não sabe</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-pink-900">
                      Está impedindo o uso do veículo?
                    </label>
                    <select className="w-full rounded-lg border border-pink-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, não pode usar</option>
                      <option value="nao">Não, pode usar</option>
                      <option value="parcial">Pode usar com restrições</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {formData.tipoServico === 'acidente' && (
              <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-red-900">
                  <AlertCircle className="h-5 w-5" />
                  Perguntas de Triagem - Colisão/Acidente
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-red-900">
                      Gravidade dos danos visíveis?
                    </label>
                    <select className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20">
                      <option value="">Selecione...</option>
                      <option value="leve">Leve (amassados, arranhões)</option>
                      <option value="moderado">Moderado (lataria, faróis)</option>
                      <option value="grave">Grave (estrutura, motor)</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-red-900">
                      Houve feridos?
                    </label>
                    <select className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20">
                      <option value="">Selecione...</option>
                      <option value="nao">Não houve feridos</option>
                      <option value="sim_leve">Sim, ferimentos leves</option>
                      <option value="sim_grave">Sim, ferimentos graves</option>
                      <option value="samu">SAMU foi acionado</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-red-900">
                      Polícia foi acionada?
                    </label>
                    <select className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, PM no local</option>
                      <option value="nao">Não foi acionada</option>
                      <option value="a_caminho">Sim, a caminho</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-red-900">
                      Condutor estava habilitado?
                    </label>
                    <select className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, CNH válida</option>
                      <option value="nao">Não possui CNH</option>
                      <option value="vencida">CNH vencida</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-red-900">
                      Houve uso de álcool?
                    </label>
                    <select className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20">
                      <option value="">Selecione...</option>
                      <option value="nao">Não</option>
                      <option value="sim">Sim</option>
                      <option value="nao_informado">Não informado</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-red-900">
                      Veículo obstruindo via?
                    </label>
                    <select className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, obstruindo</option>
                      <option value="nao">Não, fora da via</option>
                      <option value="parcial">Parcialmente</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-red-900">
                      Quantas pessoas no veículo?
                    </label>
                    <select className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20">
                      <option value="">Selecione...</option>
                      <option value="1">1 pessoa</option>
                      <option value="2">2 pessoas</option>
                      <option value="3">3 pessoas</option>
                      <option value="4">4 pessoas</option>
                      <option value="5+">5 ou mais</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-red-900">
                      Veículo tem condições de rodar?
                    </label>
                    <select className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20">
                      <option value="">Selecione...</option>
                      <option value="sim">Sim, liga e anda</option>
                      <option value="nao">Não, precisa reboque</option>
                      <option value="nao_sabe">Não sabe</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Prioridade *</label>
                <select
                  value={formData.prioridade}
                  onChange={(e) => handleInputChange('prioridade', e.target.value)}
                  className={cn(
                    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
                    errors.prioridade && 'border-red-500'
                  )}
                >
                  <option value="">Selecione a prioridade</option>
                  <option value="critica">🔴 Crítica - Situação de risco</option>
                  <option value="alta">🟠 Alta - Urgente</option>
                  <option value="media">🟡 Média - Normal</option>
                </select>
                {errors.prioridade && <p className="mt-1 text-xs text-red-600">{errors.prioridade}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Descrição do Problema *</label>
                <textarea
                  value={formData.descricaoProblema}
                  onChange={(e) => handleInputChange('descricaoProblema', e.target.value)}
                  placeholder="Descreva o problema com o veículo..."
                  rows={4}
                  className={cn(
                    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
                    errors.descricaoProblema && 'border-red-500'
                  )}
                />
                {errors.descricaoProblema && <p className="mt-1 text-xs text-red-600">{errors.descricaoProblema}</p>}
              </div>
            </div>
          </div>
        </Card>

        {/* Origem e Destino */}
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Route className="h-5 w-5" />
            Origem e Destino
          </h2>
          <div className="space-y-6">
            {/* Origem */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MapPin className="h-4 w-4" />
                Origem (Localização do Veículo) *
              </h3>
              <div className="space-y-3">
                {/* CEP LOGRADOURO NUMERO */}
                <div className="grid gap-3 sm:grid-cols-12">
                  <div className="sm:col-span-3">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          type="text"
                          value={formData.origemCep}
                          onChange={(e) => handleInputChange('origemCep', e.target.value)}
                          onBlur={(e) => buscarCep(e.target.value, 'origem')}
                          placeholder="CEP *"
                          maxLength={9}
                          className={errors.origemCep ? 'border-red-500' : ''}
                        />
                        {errors.origemCep && <p className="mt-1 text-xs text-red-600">{errors.origemCep}</p>}
                      </div>
                      {buscandoCepOrigem && (
                        <div className="flex items-center">
                          <Search className="h-5 w-5 animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-7">
                    <Input
                      type="text"
                      value={formData.origemLogradouro}
                      readOnly
                      placeholder="Logradouro"
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      type="text"
                      value={formData.origemNumero}
                      onChange={(e) => handleInputChange('origemNumero', e.target.value)}
                      placeholder="Número *"
                      className={errors.origemNumero ? 'border-red-500' : ''}
                    />
                    {errors.origemNumero && <p className="mt-1 text-xs text-red-600">{errors.origemNumero}</p>}
                  </div>
                </div>

                {/* BAIRRO CIDADE ESTADO */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input
                    type="text"
                    value={formData.origemBairro}
                    readOnly
                    placeholder="Bairro"
                    className="bg-gray-50"
                  />
                  <Input
                    type="text"
                    value={formData.origemCidade}
                    readOnly
                    placeholder="Cidade"
                    className="bg-gray-50"
                  />
                  <Input
                    type="text"
                    value={formData.origemEstado}
                    readOnly
                    placeholder="Estado"
                    className="bg-gray-50"
                  />
                </div>

                {/* REFERENCIA */}
                <Input
                  type="text"
                  value={formData.origemReferencia}
                  onChange={(e) => handleInputChange('origemReferencia', e.target.value)}
                  placeholder="Referência"
                />
              </div>
            </div>

            {/* Destino */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Navigation className="h-4 w-4" />
                Destino {mostrarDestino && '(Reboque)'}
              </h3>
              <div className="space-y-3">
                {/* CEP LOGRADOURO NUMERO */}
                <div className="grid gap-3 sm:grid-cols-12">
                  <div className="sm:col-span-3">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          type="text"
                          value={formData.destinoCep}
                          onChange={(e) => handleInputChange('destinoCep', e.target.value)}
                          onBlur={(e) => buscarCep(e.target.value, 'destino')}
                          placeholder="CEP"
                          maxLength={9}
                        />
                      </div>
                      {buscandoCepDestino && (
                        <div className="flex items-center">
                          <Search className="h-5 w-5 animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-7">
                    <Input
                      type="text"
                      value={formData.destinoLogradouro}
                      readOnly
                      placeholder="Logradouro"
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      type="text"
                      value={formData.destinoNumero}
                      onChange={(e) => handleInputChange('destinoNumero', e.target.value)}
                      placeholder="Número"
                    />
                  </div>
                </div>

                {/* BAIRRO CIDADE ESTADO */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input
                    type="text"
                    value={formData.destinoBairro}
                    readOnly
                    placeholder="Bairro"
                    className="bg-gray-50"
                  />
                  <Input
                    type="text"
                    value={formData.destinoCidade}
                    readOnly
                    placeholder="Cidade"
                    className="bg-gray-50"
                  />
                  <Input
                    type="text"
                    value={formData.destinoEstado}
                    readOnly
                    placeholder="Estado"
                    className="bg-gray-50"
                  />
                </div>

                {/* REFERENCIA */}
                <Input
                  type="text"
                  value={formData.destinoReferencia}
                  onChange={(e) => handleInputChange('destinoReferencia', e.target.value)}
                  placeholder="Referência"
                />
              </div>
            </div>

            {/* Distância e Tempo Calculados */}
            {distanciaKm && tempoPrevisto && condicaoTransito && (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Distância */}
                  <div className="rounded-lg bg-blue-50 p-4">
                    <div className="flex items-center gap-2">
                      <Route className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Distância</p>
                        <p className="text-2xl font-bold text-blue-600">{distanciaKm} km</p>
                      </div>
                    </div>
                  </div>

                  {/* Tempo Previsto */}
                  <div className="rounded-lg bg-green-50 p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900">Tempo Previsto</p>
                        <p className="text-2xl font-bold text-green-600">{tempoPrevisto}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Condição de Trânsito */}
                <div
                  className={cn(
                    'rounded-lg p-4',
                    condicaoTransito === 'leve' && 'bg-green-50',
                    condicaoTransito === 'moderado' && 'bg-yellow-50',
                    condicaoTransito === 'intenso' && 'bg-red-50'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'h-3 w-3 rounded-full',
                        condicaoTransito === 'leve' && 'bg-green-500',
                        condicaoTransito === 'moderado' && 'bg-yellow-500',
                        condicaoTransito === 'intenso' && 'bg-red-500'
                      )}
                    />
                    <div>
                      <p
                        className={cn(
                          'text-sm font-medium',
                          condicaoTransito === 'leve' && 'text-green-900',
                          condicaoTransito === 'moderado' && 'text-yellow-900',
                          condicaoTransito === 'intenso' && 'text-red-900'
                        )}
                      >
                        Trânsito:{' '}
                        {condicaoTransito === 'leve' && '🟢 Leve - Fluxo normal'}
                        {condicaoTransito === 'moderado' && '🟡 Moderado - Fluxo lento'}
                        {condicaoTransito === 'intenso' && '🔴 Intenso - Congestionamento'}
                      </p>
                      <p
                        className={cn(
                          'text-xs',
                          condicaoTransito === 'leve' && 'text-green-700',
                          condicaoTransito === 'moderado' && 'text-yellow-700',
                          condicaoTransito === 'intenso' && 'text-red-700'
                        )}
                      >
                        Tempo calculado com base nas condições atuais de trânsito
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Observações */}
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <FileText className="h-5 w-5" />
            Observações Adicionais
          </h2>
          <textarea
            value={formData.observacoes}
            onChange={(e) => handleInputChange('observacoes', e.target.value)}
            placeholder="Informações adicionais que possam ajudar no atendimento..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </Card>

        {/* Ações */}
        <Card className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Os campos marcados com * são obrigatórios. Um prestador será designado automaticamente após a criação do chamado.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => handleSubmit(true)}
                variant="outline"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Salvar Rascunho
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting || !validacaoCompleta}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Criar Chamado
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
