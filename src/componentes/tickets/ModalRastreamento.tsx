'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/componentes/ui/dialog'
import { Button } from '@/componentes/ui/button'
import { MapPin, Navigation, X, Clock, User, Phone, Car } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = 'pk.eyJ1IjoidGlhZ29yYW1vc3ZpcCIsImEiOiJjbWk1OXR3czgyZm0xMmtvbGN6aDBod2V5In0.mqwL3FAW88bjj_FlVsb7ug'

interface ModalRastreamentoProps {
  isOpen: boolean
  onClose: () => void
  chamado: {
    protocolo: string
    clienteNome: string
    clienteTelefone: string
    veiculoPlaca: string
    prestadorNome: string
    prestadorTelefone: string
    origemEndereco: string
    origemCidade: string
    origemLatitude?: number
    origemLongitude?: number
    destinoEndereco?: string
    destinoCidade?: string
    destinoLatitude?: number
    destinoLongitude?: number
    tipoServico: string
    status: string
  }
}

export function ModalRastreamento({ isOpen, onClose, chamado }: ModalRastreamentoProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const prestadorMarker = useRef<mapboxgl.Marker | null>(null)
  const origemMarker = useRef<mapboxgl.Marker | null>(null)
  const destinoMarker = useRef<mapboxgl.Marker | null>(null)
  const routeLayer = useRef<string | null>(null)
  
  const [mapLoaded, setMapLoaded] = useState(false)
  const [tempoAteOrigem, setTempoAteOrigem] = useState<number | null>(null)
  const [tempoOrigemDestino, setTempoOrigemDestino] = useState<number | null>(null)
  const [distanciaTotal, setDistanciaTotal] = useState<number | null>(null)
  const [coordenadasCount, setCoordenadasCount] = useState(0)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)
  const [ultimaAtualizacaoGPS, setUltimaAtualizacaoGPS] = useState<number | null>(null)
  const [gpsInativo, setGpsInativo] = useState(false)

  // Função para buscar coordenadas do prestador do localStorage (GPS real)
  const buscarCoordenadasPrestador = (): [number, number] | null => {
    const chave = `coordenadas_${chamado.protocolo}`
    const coordenadasSalvas = localStorage.getItem(chave)
    
    if (coordenadasSalvas) {
      try {
        const coordenadas = JSON.parse(coordenadasSalvas)
        if (coordenadas.length > 0) {
          const ultimaCoordenada = coordenadas[coordenadas.length - 1]
          
          // Verificar se a última coordenada tem timestamp
          if (ultimaCoordenada.timestamp) {
            const agora = Date.now()
            const tempoDecorrido = agora - ultimaCoordenada.timestamp
            
            // Se passou mais de 20 segundos desde a última coordenada, GPS está inativo
            if (tempoDecorrido > 20000) {
              setGpsInativo(true)
            } else {
              setGpsInativo(false)
              setUltimaAtualizacaoGPS(agora)
            }
          }
          
          setCoordenadasCount(coordenadas.length)
          return [ultimaCoordenada.lng, ultimaCoordenada.lat]
        }
      } catch (error) {
        console.error('Erro ao parsear coordenadas:', error)
      }
    }
    return null
  }

  // Verificar se GPS está inativo (sem atualização por mais de 20 segundos)
  useEffect(() => {
    if (!isOpen || coordenadasCount === 0) return

    const intervalo = setInterval(() => {
      if (ultimaAtualizacaoGPS) {
        const tempoDecorrido = Date.now() - ultimaAtualizacaoGPS
        const segundos = Math.floor(tempoDecorrido / 1000)
        
        // Se passou mais de 20 segundos sem atualização, marcar como inativo
        if (segundos > 20) {
          setGpsInativo(true)
        }
      }
    }, 1000) // Verifica a cada segundo

    return () => clearInterval(intervalo)
  }, [isOpen, ultimaAtualizacaoGPS, coordenadasCount])

  // Função para buscar coordenadas da corrida do localStorage
  const buscarCoordenadasCorrida = () => {
    const corridaKey = `corrida_${chamado.protocolo}`
    const corridaData = localStorage.getItem(corridaKey)
    
    if (corridaData) {
      try {
        const corrida = JSON.parse(corridaData)
        return {
          origem: corrida.origemCoordenadas || null,
          destino: corrida.destinoCoordenadas || null
        }
      } catch (e) {
        console.error('Erro ao parsear dados da corrida:', e)
      }
    }
    return { origem: null, destino: null }
  }

  // Função para calcular e desenhar rota
  const calcularRota = async (prestadorCoords: [number, number]) => {
    if (!map.current) return

    setIsLoadingRoute(true)

    try {
      // Buscar coordenadas da corrida
      const { origem, destino } = buscarCoordenadasCorrida()
      
      // Usar coordenadas do localStorage ou fallback para as do chamado
      const origemCoords: [number, number] = origem 
        ? [origem.lng, origem.lat]
        : chamado.origemLatitude && chamado.origemLongitude
        ? [chamado.origemLongitude, chamado.origemLatitude]
        : [-46.633308, -23.550520] // Fallback São Paulo

      const destinoCoords: [number, number] | null = destino
        ? [destino.lng, destino.lat]
        : chamado.destinoLatitude && chamado.destinoLongitude
        ? [chamado.destinoLongitude, chamado.destinoLatitude]
        : null

      // Se tem destino, calcular rota completa: Prestador -> Origem -> Destino
      if (destinoCoords) {
        // Rota completa com 3 pontos
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${prestadorCoords[0]},${prestadorCoords[1]};${origemCoords[0]},${origemCoords[1]};${destinoCoords[0]},${destinoCoords[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
        )
        const data = await response.json()

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0]
          
          // Remover rota anterior
          if (routeLayer.current && map.current.getLayer(routeLayer.current)) {
            map.current.removeLayer(routeLayer.current)
            map.current.removeSource(routeLayer.current)
          }

          // Adicionar nova rota
          const layerId = `route-${chamado.protocolo}`
          routeLayer.current = layerId

          map.current.addSource(layerId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route.geometry,
            },
          })

          map.current.addLayer({
            id: layerId,
            type: 'line',
            source: layerId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 4,
              'line-opacity': 0.8,
            },
          })

          // Calcular tempos separados
          // Tempo até origem
          const responseOrigem = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${prestadorCoords[0]},${prestadorCoords[1]};${origemCoords[0]},${origemCoords[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
          )
          const dataOrigem = await responseOrigem.json()
          if (dataOrigem.routes && dataOrigem.routes.length > 0) {
            setTempoAteOrigem(Math.round(dataOrigem.routes[0].duration / 60))
          }

          // Tempo da origem ao destino
          const responseDestino = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${origemCoords[0]},${origemCoords[1]};${destinoCoords[0]},${destinoCoords[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
          )
          const dataDestino = await responseDestino.json()
          if (dataDestino.routes && dataDestino.routes.length > 0) {
            setTempoOrigemDestino(Math.round(dataDestino.routes[0].duration / 60))
          }

          setDistanciaTotal(Math.round(route.distance / 1000))

          // Ajustar visualização
          const bounds = new mapboxgl.LngLatBounds()
          bounds.extend(prestadorCoords)
          bounds.extend(origemCoords)
          bounds.extend(destinoCoords)
          map.current.fitBounds(bounds, { padding: 100 })
        }
      } else {
        // Sem destino, apenas rota até origem
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${prestadorCoords[0]},${prestadorCoords[1]};${origemCoords[0]},${origemCoords[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
        )
        const data = await response.json()

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0]
          
          // Remover rota anterior
          if (routeLayer.current && map.current.getLayer(routeLayer.current)) {
            map.current.removeLayer(routeLayer.current)
            map.current.removeSource(routeLayer.current)
          }

          // Adicionar nova rota
          const layerId = `route-${chamado.protocolo}`
          routeLayer.current = layerId

          map.current.addSource(layerId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route.geometry,
            },
          })

          map.current.addLayer({
            id: layerId,
            type: 'line',
            source: layerId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 4,
              'line-opacity': 0.8,
            },
          })

          setTempoAteOrigem(Math.round(route.duration / 60))
          setDistanciaTotal(Math.round(route.distance / 1000))

          // Ajustar visualização
          const bounds = new mapboxgl.LngLatBounds()
          bounds.extend(prestadorCoords)
          bounds.extend(origemCoords)
          map.current.fitBounds(bounds, { padding: 100 })
        }
      }
    } catch (error) {
      console.error('Erro ao calcular rota:', error)
    } finally {
      setIsLoadingRoute(false)
    }
  }

  // Atualizar apenas coordenadas do prestador a cada 5 segundos (SEM recalcular rota)
  useEffect(() => {
    if (!isOpen || !mapLoaded) return

    const atualizarCoordenadas = () => {
      const novasCoordenadas = buscarCoordenadasPrestador()
      if (novasCoordenadas && prestadorMarker.current) {
        // Apenas atualizar marcador do prestador
        prestadorMarker.current.setLngLat(novasCoordenadas)
        // NÃO recalcular rota automaticamente - igual ao MapaAoVivo
      }
    }

    // Configurar intervalo de atualização
    const intervalo = setInterval(atualizarCoordenadas, 5000)

    return () => clearInterval(intervalo)
  }, [isOpen, mapLoaded, chamado.protocolo])

  // Calcular rota apenas uma vez quando o mapa carregar
  useEffect(() => {
    if (!mapLoaded || !map.current) return

    const inicializarMapa = async () => {
      const { origem, destino } = buscarCoordenadasCorrida()
      
      // Coordenadas de origem
      const origemCoords: [number, number] = origem 
        ? [origem.lng, origem.lat]
        : chamado.origemLatitude && chamado.origemLongitude
        ? [chamado.origemLongitude, chamado.origemLatitude]
        : [-46.633308, -23.550520]

      // Coordenadas de destino (se houver)
      const destinoCoords: [number, number] | null = destino
        ? [destino.lng, destino.lat]
        : chamado.destinoLatitude && chamado.destinoLongitude
        ? [chamado.destinoLongitude, chamado.destinoLatitude]
        : null

      // Coordenadas do prestador - usar GPS real ou simular próximo à origem
      let prestadorCoords = buscarCoordenadasPrestador()
      
      // Se não houver GPS real, simular prestador próximo à origem (2km de distância)
      if (!prestadorCoords && chamado.origemLatitude && chamado.origemLongitude) {
        const offset = 0.02 // aproximadamente 2km
        prestadorCoords = [
          chamado.origemLongitude - offset,
          chamado.origemLatitude - offset
        ]
      } else if (!prestadorCoords) {
        // Último fallback apenas se não houver nenhuma coordenada
        prestadorCoords = [-46.643308, -23.560520]
      }

      // Marcador de Origem (verde) - primeira parada
      const origemEl = document.createElement('div')
      origemEl.style.width = '35px'
      origemEl.style.height = '35px'
      origemEl.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          background-color: #22c55e;
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          📍
        </div>
      `
      origemMarker.current = new mapboxgl.Marker(origemEl)
        .setLngLat(origemCoords)
        .addTo(map.current!)

      // Marcador do Prestador (azul) - caminhão de reboque
      const prestadorEl = document.createElement('div')
      prestadorEl.style.width = '40px'
      prestadorEl.style.height = '40px'
      prestadorEl.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          background-color: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          animation: pulse 2s infinite;
        ">
          🚛
        </div>
      `
      prestadorMarker.current = new mapboxgl.Marker(prestadorEl)
        .setLngLat(prestadorCoords)
        .addTo(map.current!)

      // Marcador de Destino (vermelho) - segunda parada (se houver)
      if (destinoCoords) {
        const destinoEl = document.createElement('div')
        destinoEl.style.width = '35px'
        destinoEl.style.height = '35px'
        destinoEl.innerHTML = `
          <div style="
            width: 100%;
            height: 100%;
            background-color: #ef4444;
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            🎯
          </div>
        `
        destinoMarker.current = new mapboxgl.Marker(destinoEl)
          .setLngLat(destinoCoords)
          .addTo(map.current!)
      }

      // Calcular rota inicial apenas uma vez
      await calcularRota(prestadorCoords)
    }

    inicializarMapa()
  }, [mapLoaded])

  // Inicializar mapa quando o modal abrir
  useEffect(() => {
    if (!isOpen || !mapContainer.current || map.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    // Usar coordenadas reais do chamado como centro inicial
    const centerCoords: [number, number] = chamado.origemLatitude && chamado.origemLongitude
      ? [chamado.origemLongitude, chamado.origemLatitude]
      : [-46.633308, -23.550520] // Fallback apenas se não houver coordenadas

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: centerCoords,
      zoom: 13,
    })

    map.current.on('load', () => {
      setMapLoaded(true)
    })

    // Adicionar controles de navegação
    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'top-right'
    )

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
        setMapLoaded(false)
      }
    }
  }, [isOpen])

  // Redimensionar mapa quando modal abrir ou janela redimensionar
  useEffect(() => {
    if (!isOpen || !map.current) return

    // Função para redimensionar o mapa
    const resizeMap = () => {
      if (map.current) {
        // Pequeno delay para garantir que o DOM foi atualizado
        setTimeout(() => {
          map.current?.resize()
        }, 100)
      }
    }

    // Redimensionar quando o modal abrir
    resizeMap()

    // Adicionar listener para redimensionamento da janela
    window.addEventListener('resize', resizeMap)

    return () => {
      window.removeEventListener('resize', resizeMap)
    }
  }, [isOpen, mapLoaded])

  // Adicionar marcadores quando o mapa carregar
  useEffect(() => {
    if (!mapLoaded || !map.current) return

    const { origem, destino } = buscarCoordenadasCorrida()
    
    // Coordenadas de origem
    const origemCoords: [number, number] = origem 
      ? [origem.lng, origem.lat]
      : chamado.origemLatitude && chamado.origemLongitude
      ? [chamado.origemLongitude, chamado.origemLatitude]
      : [-46.633308, -23.550520]

    // Coordenadas de destino (se houver)
    const destinoCoords: [number, number] | null = destino
      ? [destino.lng, destino.lat]
      : chamado.destinoLatitude && chamado.destinoLongitude
      ? [chamado.destinoLongitude, chamado.destinoLatitude]
      : null

    // Coordenadas do prestador - usar GPS real ou simular próximo à origem
    let prestadorCoords = buscarCoordenadasPrestador()
    
    // Se não houver GPS real, simular prestador próximo à origem (2km de distância)
    if (!prestadorCoords && chamado.origemLatitude && chamado.origemLongitude) {
      const offset = 0.02 // aproximadamente 2km
      prestadorCoords = [
        chamado.origemLongitude - offset,
        chamado.origemLatitude - offset
      ]
    } else if (!prestadorCoords) {
      // Último fallback apenas se não houver nenhuma coordenada
      prestadorCoords = [-46.643308, -23.560520]
    }

    // Marcador de Origem (verde) - primeira parada
    const origemEl = document.createElement('div')
    origemEl.style.width = '35px'
    origemEl.style.height = '35px'
    origemEl.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        background-color: #22c55e;
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        📍
      </div>
    `
    origemMarker.current = new mapboxgl.Marker(origemEl)
      .setLngLat(origemCoords)
      .addTo(map.current)

    // Marcador do Prestador (azul) - caminhão de reboque
    const prestadorEl = document.createElement('div')
    prestadorEl.style.width = '40px'
    prestadorEl.style.height = '40px'
    prestadorEl.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        background-color: #3b82f6;
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
      ">
        🚛
      </div>
    `
    prestadorMarker.current = new mapboxgl.Marker(prestadorEl)
      .setLngLat(prestadorCoords)
      .addTo(map.current)

    // Marcador de Destino (vermelho) - segunda parada (se houver)
    if (destinoCoords) {
      const destinoEl = document.createElement('div')
      destinoEl.style.width = '35px'
      destinoEl.style.height = '35px'
      destinoEl.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          background-color: #ef4444;
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          🎯
        </div>
      `
      destinoMarker.current = new mapboxgl.Marker(destinoEl)
        .setLngLat(destinoCoords)
        .addTo(map.current)
    }

    // Calcular rota inicial
    calcularRota(prestadorCoords)
  }, [mapLoaded])

  const getTipoEmoji = (tipo: string) => {
    const emojiMap: Record<string, string> = {
      reboque: '🚗',
      pneu: '🛞',
      bateria: '🔋',
      combustivel: '⛽',
      chaveiro: '🔑',
      mecanica: '⚙️',
      acidente: '🚙',
      taxi: '🚕',
      fluidos: '💧',
      residencial: '🏠',
      viagem: '🛣️',
      reparos: '🔩',
    }
    return emojiMap[tipo] || '🔧'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[85vh] overflow-hidden">
        <DialogHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{getTipoEmoji(chamado.tipoServico)}</div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Rastreamento em Tempo Real
              </DialogTitle>
              <p className="text-sm text-gray-600">Protocolo: {chamado.protocolo}</p>
            </div>
          </div>
          <Button onClick={onClose} variant="outline" size="sm" className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Fechar
          </Button>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Mapa */}
          <div className="rounded-t-lg border-2 border-b-0 border-gray-300 overflow-hidden bg-gray-100 relative" style={{ height: '65%' }}>
            <div ref={mapContainer} className="w-full h-full" />
            

            {/* Loading de rota */}
            {isLoadingRoute && (
              <div className="absolute top-4 right-4 rounded-lg bg-blue-50 border-2 border-blue-200 p-3 shadow-lg">
                <p className="text-xs font-medium text-blue-700">Calculando rota...</p>
              </div>
            )}

            {/* Status GPS */}
            {coordenadasCount > 0 && (
              <div className={`absolute top-4 left-4 rounded-lg p-3 shadow-lg border-2 ${
                gpsInativo 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    gpsInativo ? 'bg-red-500' : 'bg-green-500 animate-pulse'
                  }`}></div>
                  <p className={`text-xs font-bold ${
                    gpsInativo ? 'text-red-700' : 'text-green-700'
                  }`}>
                    GPS {gpsInativo ? 'INATIVO' : 'ATIVO'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Rota e Tempos - Timeline Intuitiva */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg border-2 border-slate-200 p-6 flex-shrink-0">
            {/* Timeline Visual */}
            <div className="flex items-center justify-between gap-4">
              {/* Ponto 1: Origem */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-xl border-4 border-white flex-shrink-0">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-xs font-bold text-green-700 uppercase mb-1">1ª Parada</p>
                    <p className="text-base font-bold text-gray-900">{chamado.origemEndereco}</p>
                    <p className="text-sm text-gray-600">{chamado.origemCidade}</p>
                  </div>
                  {/* Tempo da Origem - ao lado do endereço */}
                  {tempoAteOrigem !== null && (
                    <div className="bg-blue-500 text-white rounded-lg px-3 py-1.5 shadow-md flex-shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-bold">{tempoAteOrigem} min</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Seta Central - Maior */}
              <div className="flex items-center justify-center px-4">
                <div className="text-6xl text-blue-600">→</div>
              </div>

              {/* Ponto 2: Destino (se houver) */}
              {chamado.destinoEndereco ? (
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-xl border-4 border-white flex-shrink-0">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-xs font-bold text-red-700 uppercase mb-1">2ª Parada</p>
                      <p className="text-base font-bold text-gray-900">{chamado.destinoEndereco}</p>
                      <p className="text-sm text-gray-600">{chamado.destinoCidade}</p>
                    </div>
                    {/* Tempo adicional do Destino */}
                    {tempoOrigemDestino !== null && (
                      <div className="bg-orange-500 text-white rounded-lg px-3 py-1.5 shadow-md flex-shrink-0">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm font-bold">+{tempoOrigemDestino} min</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </div>
        </div>

        {/* Estilos para animação */}
        <style jsx global>{`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}
