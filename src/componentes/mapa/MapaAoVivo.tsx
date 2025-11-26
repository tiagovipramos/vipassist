'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { ChamadoUrgente } from '@/tipos/assistenciaVeicular'
import { Card, CardContent, CardHeader, CardTitle } from '@/componentes/ui/card'
import { Badge } from '@/componentes/ui/badge'
import { Button } from '@/componentes/ui/button'
import { Input } from '@/componentes/ui/input'
import { MapPin, Navigation, Clock, X, Maximize, Minimize, Search } from 'lucide-react'

// Token do Mapbox
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoidGlhZ29yYW1vc3ZpcCIsImEiOiJjbWk1OXR3czgyZm0xMmtvbGN6aDBod2V5In0.mqwL3FAW88bjj_FlVsb7ug'

interface MapaAoVivoProps {
  chamados: ChamadoUrgente[]
}

export function MapaAoVivo({ chamados }: MapaAoVivoProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({})
  const routeLayer = useRef<string | null>(null)
  const [selectedChamado, setSelectedChamado] = useState<ChamadoUrgente | null>(null)
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number; description?: string } | null>(null)
  const [tempoAteOrigem, setTempoAteOrigem] = useState<number | null>(null)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredChamados, setFilteredChamados] = useState<ChamadoUrgente[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Inicializar o mapa apenas uma vez
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-38.5267, -3.7319], // Fortaleza como padrão
      zoom: 11,
    })

    // Adicionar controles de navegação (sem bússola)
    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }), 
      'top-right'
    )

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, []) // Sem dependências - inicializa apenas uma vez

  // Atualização automática a cada 5 segundos para coordenadas GPS em tempo real
  useEffect(() => {
    if (!map.current) return

    const intervalo = setInterval(() => {
      // Atualizar posição dos prestadores com coordenadas do localStorage
      chamados.forEach((chamado) => {
        if (chamado.prestadorDesignado) {
          const prestadorMarkerId = `prestador-${chamado.id}`
          const marker = markers.current[prestadorMarkerId]
          
          if (marker) {
            const novasCoordenadas = getPrestadorCoordinates(chamado)
            marker.setLngLat(novasCoordenadas)
            
            // NÃO atualizar a rota automaticamente - apenas quando o usuário clicar
          }
        }
      })
    }, 5000) // Atualiza a cada 5 segundos

    return () => clearInterval(intervalo)
  }, [chamados])

  // Atualizar marcadores quando os chamados mudarem
  useEffect(() => {
    if (!map.current) return

    // Remover marcadores de chamados que não existem mais
    Object.keys(markers.current).forEach((id) => {
      if (!chamados.find((c) => c.id === id)) {
        markers.current[id].remove()
        delete markers.current[id]
        // Remover também o marcador do prestador se existir
        const prestadorMarkerId = `prestador-${id}`
        if (markers.current[prestadorMarkerId]) {
          markers.current[prestadorMarkerId].remove()
          delete markers.current[prestadorMarkerId]
        }
      }
    })

    // Adicionar ou atualizar marcadores
    chamados.forEach((chamado) => {
      // Verificar se coordenadas existem
      if (!chamado.localizacao.coordenadas) return
      
      const { lat, lng } = chamado.localizacao.coordenadas

      if (markers.current[chamado.id]) {
        // Atualizar posição se necessário
        markers.current[chamado.id].setLngLat([lng, lat])
      } else {
        // Criar novo marcador do cliente
        const el = document.createElement('div')
        el.className = 'custom-marker'
        el.style.width = '40px'
        el.style.height = '40px'
        el.style.cursor = 'pointer'
        
        // Definir cor baseada na prioridade
        let bgColor = '#3b82f6' // azul padrão
        if (chamado.prioridade === 'critica') bgColor = '#ef4444' // vermelho
        else if (chamado.prioridade === 'alta') bgColor = '#f59e0b' // laranja

        el.innerHTML = `
          <div style="
            width: 100%;
            height: 100%;
            background-color: ${bgColor};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            animation: pulse 2s infinite;
          ">
            ${getTipoEmoji(chamado.tipo)}
          </div>
        `

        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .addTo(map.current!)

        // Adicionar evento de clique
        el.addEventListener('click', () => {
          handleMarkerClick(chamado)
        })

        markers.current[chamado.id] = marker
      }

      // Adicionar ou atualizar marcador do prestador
      if (chamado.prestadorDesignado) {
        const prestadorCoords = getPrestadorCoordinates(chamado)
        const prestadorMarkerId = `prestador-${chamado.id}`
        
        if (markers.current[prestadorMarkerId]) {
          // Atualizar posição do prestador se necessário
          markers.current[prestadorMarkerId].setLngLat(prestadorCoords)
        } else {
          // Criar novo marcador do prestador
          const prestadorEl = document.createElement('div')
          prestadorEl.className = 'prestador-marker'
          prestadorEl.style.cursor = 'pointer'
          
          prestadorEl.innerHTML = `
            <div style="
              width: 35px;
              height: 35px;
              background-color: #10b981;
              border: 3px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              🚙
            </div>
          `

          const prestadorMarker = new mapboxgl.Marker(prestadorEl)
            .setLngLat(prestadorCoords)
            .addTo(map.current!)

          // Adicionar evento de clique no prestador também
          prestadorEl.addEventListener('click', () => {
            handleMarkerClick(chamado)
          })

          markers.current[prestadorMarkerId] = prestadorMarker
        }

        // Adicionar marcador de ORIGEM (verde) - primeira parada
        const origemMarkerId = `origem-${chamado.id}`
        if (!markers.current[origemMarkerId]) {
          const origemEl = document.createElement('div')
          origemEl.className = 'origem-marker'
          
          origemEl.innerHTML = `
            <div style="
              width: 30px;
              height: 30px;
              background-color: #22c55e;
              border: 3px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              📍
            </div>
          `

          const origemMarker = new mapboxgl.Marker(origemEl)
            .setLngLat([lng, lat])
            .addTo(map.current!)

          markers.current[origemMarkerId] = origemMarker
        }

        // Adicionar marcador de DESTINO (vermelho) - segunda parada (se existir)
        if (chamado.destino && chamado.destino.coordenadas) {
          const destinoMarkerId = `destino-${chamado.id}`
          const destinoLat = chamado.destino.coordenadas.lat
          const destinoLng = chamado.destino.coordenadas.lng

          if (!markers.current[destinoMarkerId]) {
            const destinoEl = document.createElement('div')
            destinoEl.className = 'destino-marker'
            
            destinoEl.innerHTML = `
              <div style="
                width: 30px;
                height: 30px;
                background-color: #ef4444;
                border: 3px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              ">
                🎯
              </div>
            `

            const destinoMarker = new mapboxgl.Marker(destinoEl)
              .setLngLat([destinoLng, destinoLat])
              .addTo(map.current!)

            markers.current[destinoMarkerId] = destinoMarker
          }
        }
      }
    })

    // Ajustar o mapa para mostrar todos os marcadores apenas na primeira vez
    if (chamados.length > 0 && Object.keys(markers.current).length === chamados.length) {
      // Só ajusta se for a primeira renderização (todos os marcadores foram criados agora)
      const isFirstRender = chamados.every(chamado => {
        const marker = markers.current[chamado.id]
        return marker && marker.getLngLat()
      })
      
      if (isFirstRender && Object.keys(markers.current).filter(k => !k.includes('prestador-') && !k.includes('origem-') && !k.includes('destino-')).length === chamados.length) {
        const bounds = new mapboxgl.LngLatBounds()
        chamados.forEach((chamado) => {
          if (chamado.localizacao.coordenadas) {
            bounds.extend([
              chamado.localizacao.coordenadas.lng,
              chamado.localizacao.coordenadas.lat,
            ])
          }
        })
        // Só ajusta uma vez, não em toda atualização
        if (map.current && !map.current.isMoving()) {
          map.current.fitBounds(bounds, { padding: 50, maxZoom: 14, duration: 0 })
        }
      }
    }
  }, [chamados])

  // Função para obter emoji do tipo de serviço
  const getTipoEmoji = (tipo: string) => {
    const emojiMap: Record<string, string> = {
      reboque: '🚗',
      pane: '⚙️',
      acidente: '💥',
      chaveiro: '🔑',
      pneu: '🛞',
    }
    return emojiMap[tipo] || '🔧'
  }

  // Função para lidar com clique no marcador
  const handleMarkerClick = async (chamado: ChamadoUrgente) => {
    setSelectedChamado(chamado)
    setIsLoadingRoute(true)
    setRouteInfo(null)
    setTempoAteOrigem(null)

    // Se o chamado tem prestador designado, mostrar a rota
    if (chamado.prestadorDesignado && map.current) {
      try {
        let startCoords: [number, number]
        let endCoords: [number, number]
        let routeDescription = ''
        let tempoOrigem: number | null = null

        // Buscar coordenadas reais do localStorage
        const corridaKey = `corrida_${chamado.protocolo}`
        const corridaData = localStorage.getItem(corridaKey)
        
        // Verificar se coordenadas existem
        if (!chamado.localizacao.coordenadas) return
        
        let origemCoords = [chamado.localizacao.coordenadas.lng, chamado.localizacao.coordenadas.lat]
        let destinoCoords = chamado.destino && chamado.destino.coordenadas ? [chamado.destino.coordenadas.lng, chamado.destino.coordenadas.lat] : null
        
        if (corridaData) {
          try {
            const corrida = JSON.parse(corridaData)
            if (corrida.origemCoordenadas) {
              origemCoords = [corrida.origemCoordenadas.lng, corrida.origemCoordenadas.lat]
            }
            if (corrida.destinoCoordenadas) {
              destinoCoords = [corrida.destinoCoordenadas.lng, corrida.destinoCoordenadas.lat]
            }
          } catch (e) {
            console.error('Erro ao parsear dados da corrida:', e)
          }
        }

        const prestadorCoords = getPrestadorCoordinates(chamado)

        // Se tem destino, buscar rota completa: Prestador -> Origem -> Destino
        if (destinoCoords) {
          // Buscar rota completa com 3 pontos (waypoints)
          const response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${prestadorCoords[0]},${prestadorCoords[1]};${origemCoords[0]},${origemCoords[1]};${destinoCoords[0]},${destinoCoords[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
          )
          const data = await response.json()

          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0]
            
            // Remover rotas anteriores se existirem
            if (routeLayer.current && map.current.getLayer(routeLayer.current)) {
              map.current.removeLayer(routeLayer.current)
              map.current.removeSource(routeLayer.current)
            }

            // Adicionar rota completa
            const layerId = `route-${chamado.id}`
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

            // Ajustar visualização para mostrar toda a rota
            const bounds = new mapboxgl.LngLatBounds()
            bounds.extend(prestadorCoords)
            bounds.extend(origemCoords as [number, number])
            bounds.extend(destinoCoords as [number, number])
            map.current.fitBounds(bounds, { padding: 100 })

            // Calcular tempos separados
            // Tempo até origem
            const responseOrigem = await fetch(
              `https://api.mapbox.com/directions/v5/mapbox/driving/${prestadorCoords[0]},${prestadorCoords[1]};${origemCoords[0]},${origemCoords[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
            )
            const dataOrigem = await responseOrigem.json()
            if (dataOrigem.routes && dataOrigem.routes.length > 0) {
              tempoOrigem = dataOrigem.routes[0].duration / 60
              setTempoAteOrigem(tempoOrigem)
            }

            // Tempo da origem ao destino
            const responseDestino = await fetch(
              `https://api.mapbox.com/directions/v5/mapbox/driving/${origemCoords[0]},${origemCoords[1]};${destinoCoords[0]},${destinoCoords[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
            )
            const dataDestino = await responseDestino.json()
            let tempoOrigemDestino = 0
            if (dataDestino.routes && dataDestino.routes.length > 0) {
              tempoOrigemDestino = dataDestino.routes[0].duration / 60
            }

            setRouteInfo({
              distance: route.distance / 1000,
              duration: tempoOrigemDestino,
              description: 'rota completa',
            })
          }
        } else {
          // Sem destino, apenas rota até origem
          startCoords = prestadorCoords
          endCoords = origemCoords as [number, number]

          const response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
          )
          const data = await response.json()

          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0]
            
            // Remover rota anterior se existir
            if (routeLayer.current && map.current.getLayer(routeLayer.current)) {
              map.current.removeLayer(routeLayer.current)
              map.current.removeSource(routeLayer.current)
            }

            // Adicionar nova rota
            const layerId = `route-${chamado.id}`
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

            // Ajustar visualização
            const bounds = new mapboxgl.LngLatBounds()
            bounds.extend(startCoords)
            bounds.extend(endCoords)
            map.current.fitBounds(bounds, { padding: 100 })

            setRouteInfo({
              distance: route.distance / 1000,
              duration: route.duration / 60,
              description: 'até origem',
            })
          }
        }
      } catch (error) {
        console.error('Erro ao buscar rota:', error)
      }
    }

    setIsLoadingRoute(false)
  }

  // Função para obter coordenadas do prestador do localStorage (rastreamento GPS real)
  const getPrestadorCoordinates = (chamado: ChamadoUrgente): [number, number] => {
    // Busca coordenadas do rastreamento GPS no localStorage
    const chave = `coordenadas_${chamado.protocolo}`
    const coordenadasSalvas = localStorage.getItem(chave)
    
    if (coordenadasSalvas) {
      try {
        const coordenadas = JSON.parse(coordenadasSalvas)
        if (coordenadas.length > 0) {
          // Pega a última coordenada registrada
          const ultimaCoordenada = coordenadas[coordenadas.length - 1]
          return [ultimaCoordenada.lng, ultimaCoordenada.lat]
        }
      } catch (error) {
        console.error('Erro ao parsear coordenadas:', error)
      }
    }
    
    // Fallback: se não houver coordenadas, simula uma posição próxima
    const offset = 0.02 // aproximadamente 2km
    if (chamado.localizacao.coordenadas) {
      return [
        chamado.localizacao.coordenadas.lng - offset,
        chamado.localizacao.coordenadas.lat - offset,
      ]
    }
    // Fallback final: retorna coordenadas padrão de Fortaleza
    return [-38.5267, -3.7319]
  }

  // Função para fechar detalhes
  const handleClose = () => {
    setSelectedChamado(null)
    setRouteInfo(null)

    // Remover rota do mapa
    if (routeLayer.current && map.current) {
      if (map.current.getLayer(routeLayer.current)) {
        map.current.removeLayer(routeLayer.current)
      }
      if (map.current.getSource(routeLayer.current)) {
        map.current.removeSource(routeLayer.current)
      }
      routeLayer.current = null
    }
  }

  // Função para alternar tela cheia
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainer.current?.parentElement?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Detectar mudanças no estado de tela cheia
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // Função de busca
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredChamados([])
      setShowSearchResults(false)
      return
    }

    const term = searchTerm.toLowerCase()
    const results = chamados.filter((chamado) => {
      return (
        chamado.protocolo.toLowerCase().includes(term) ||
        chamado.cliente.nome.toLowerCase().includes(term) ||
        chamado.cliente.telefone.includes(term) ||
        (chamado.prestadorDesignado?.nome.toLowerCase().includes(term)) ||
        (chamado.prestadorDesignado?.telefone.includes(term)) ||
        chamado.localizacao.endereco.toLowerCase().includes(term) ||
        chamado.localizacao.cidade.toLowerCase().includes(term)
      )
    })

    setFilteredChamados(results)
    setShowSearchResults(true)
  }, [searchTerm, chamados])

  // Função para selecionar um chamado da busca
  const handleSelectFromSearch = (chamado: ChamadoUrgente) => {
    // Centralizar no marcador
    if (map.current && chamado.localizacao.coordenadas) {
      map.current.flyTo({
        center: [chamado.localizacao.coordenadas.lng, chamado.localizacao.coordenadas.lat],
        zoom: 15,
        duration: 1500,
      })
    }
    // Abrir detalhes
    handleMarkerClick(chamado)
    // Fechar resultados de busca
    setShowSearchResults(false)
    setSearchTerm('')
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
    > = {
      aguardando: { label: 'Aguardando', variant: 'destructive' },
      em_atendimento: { label: 'Em Atendimento', variant: 'default' },
      prestador_a_caminho: { label: 'A Caminho', variant: 'secondary' },
      em_execucao: { label: 'Em Execução', variant: 'outline' },
    }
    const config = statusMap[status] || { label: status, variant: 'outline' }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="relative w-full h-full">
      {/* Container do Mapa */}
      <div ref={mapContainer} className="w-full h-full rounded-lg" />

      {/* Botão de Tela Cheia (ao lado do +) */}
      <Button
        onClick={toggleFullscreen}
        className="absolute top-[10px] right-[44px] shadow-md z-20 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-sm"
        size="icon"
        title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
      >
        {isFullscreen ? (
          <Minimize className="h-4 w-4" />
        ) : (
          <Maximize className="h-4 w-4" />
        )}
      </Button>

      {/* Campo de Busca */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 z-20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por protocolo, cliente, prestador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-white shadow-lg border-gray-300"
          />
        </div>

        {/* Resultados da Busca */}
        {showSearchResults && filteredChamados.length > 0 && (
          <Card className="mt-2 shadow-xl max-h-96 overflow-auto">
            <CardContent className="p-2">
              {filteredChamados.map((chamado) => (
                <div
                  key={chamado.id}
                  onClick={() => handleSelectFromSearch(chamado)}
                  className="p-3 hover:bg-gray-100 cursor-pointer rounded-lg border-b last:border-b-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{chamado.protocolo}</span>
                    {getStatusBadge(chamado.status)}
                  </div>
                  <p className="text-xs text-gray-600">{chamado.cliente.nome}</p>
                  <p className="text-xs text-gray-500">{chamado.localizacao.cidade}</p>
                  {chamado.prestadorDesignado && (
                    <p className="text-xs text-green-600 mt-1">
                      Prestador: {chamado.prestadorDesignado.nome}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Nenhum resultado */}
        {showSearchResults && filteredChamados.length === 0 && (
          <Card className="mt-2 shadow-xl">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Nenhum atendimento encontrado</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Painel de Detalhes do Chamado Selecionado */}
      {selectedChamado && (
        <Card className="absolute bottom-4 right-4 w-80 shadow-xl z-10">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getTipoEmoji(selectedChamado.tipo)}</span>
                  <div>
                    <CardTitle className="text-sm font-bold">
                      {selectedChamado.protocolo}
                    </CardTitle>
                    <p className="text-xs text-gray-600">
                      {selectedChamado.status === 'prestador_a_caminho' && 'A caminho origem'}
                      {selectedChamado.status === 'em_execucao' && selectedChamado.destino && 'A caminho destino'}
                      {selectedChamado.status === 'em_execucao' && !selectedChamado.destino && 'Em execução'}
                      {selectedChamado.status === 'em_atendimento' && 'Em atendimento'}
                      {selectedChamado.status === 'aguardando' && 'Aguardando'}
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClose} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {/* Cliente */}
            <p>
              <span className="font-semibold">Cliente</span> {selectedChamado.cliente.nome} {selectedChamado.cliente.telefone}
            </p>

            {/* Origem */}
            <p>
              <span className="font-semibold">Origem</span> {selectedChamado.localizacao.endereco} {selectedChamado.localizacao.cidade}
            </p>

            {/* Destino */}
            {selectedChamado.destino && (
              <p>
                <span className="font-semibold">Destino</span> {selectedChamado.destino.endereco} {selectedChamado.destino.cidade}
              </p>
            )}

            {/* Prestador */}
            {selectedChamado.prestadorDesignado && (
              <p>
                <span className="font-semibold">Prestador</span> {selectedChamado.prestadorDesignado.nome} {selectedChamado.prestadorDesignado.telefone}
              </p>
            )}

            {/* Tempos */}
            {isLoadingRoute && (
              <p className="text-blue-600">Calculando tempos...</p>
            )}

            {routeInfo && !isLoadingRoute && selectedChamado.prestadorDesignado && (
              <>
                {/* Se tem destino, mostra ambos os tempos */}
                {selectedChamado.destino ? (
                  <>
                    {tempoAteOrigem !== null && (
                      <p>
                        <span className="font-semibold">Tempo até Origem:</span> {Math.round(tempoAteOrigem)} min
                      </p>
                    )}
                    <p>
                      <span className="font-semibold">Tempo até Destino:</span> {Math.round(routeInfo.duration)} min
                    </p>
                  </>
                ) : (
                  /* Se não tem destino, mostra apenas tempo até origem */
                  <p>
                    <span className="font-semibold">Tempo até Origem:</span> {Math.round(routeInfo.duration)} min
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Legenda */}
      <Card className="absolute bottom-4 left-4 shadow-lg z-10">
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm mb-3">Legenda</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white" />
              <span>Prioridade Crítica</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white" />
              <span>Prioridade Alta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />
              <span>Prioridade Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
              <span>Prestador</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contador de Chamados */}
      <Card className="absolute top-4 left-4 shadow-lg z-10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{chamados.length}</p>
              <p className="text-sm text-gray-600">Atendimentos Ativos</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
    </div>
  )
}
