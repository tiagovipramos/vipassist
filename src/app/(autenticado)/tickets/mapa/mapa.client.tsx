'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/componentes/ui/card'
import { Map } from 'lucide-react'
import { ChamadoUrgente } from '@/tipos/assistenciaVeicular'

// Importar MapaAoVivo dinamicamente sem SSR
const MapaAoVivo = dynamic(
  () => import('@/componentes/mapa/MapaAoVivo').then((mod) => mod.MapaAoVivo),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    ),
  }
)

// Mapeamento de tipos de serviço
const mapearTipoServico = (tipo: string): 'reboque' | 'pane' | 'acidente' | 'chaveiro' | 'pneu' => {
  const mapeamento: Record<string, 'reboque' | 'pane' | 'acidente' | 'chaveiro' | 'pneu'> = {
    'reboque': 'reboque',
    'pneu': 'pneu',
    'chaveiro': 'chaveiro',
    'bateria': 'pane',
    'combustivel': 'pane',
    'mecanica': 'pane',
  }
  return mapeamento[tipo] || 'pane'
}

export function MapaClient() {
  const [chamados, setChamados] = useState<ChamadoUrgente[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const carregarChamados = async () => {
      try {
        // Buscar tickets do banco de dados
        const response = await fetch('/api/tickets')
        const data = await response.json()
        
        if (!data.success) {
          console.error('Erro ao buscar tickets:', data.error)
          return
        }

        // Filtrar apenas tickets em execução ou aguardando
        const ticketsAtivos = data.data.filter(
          (t: any) => t.status === 'aguardando' || t.status === 'em_execucao'
        )

        // Converter tickets para o formato esperado pelo mapa
        const chamadosFormatados: ChamadoUrgente[] = ticketsAtivos.map((ticket: any) => ({
          id: ticket.id,
          protocolo: ticket.protocolo,
          tipo: mapearTipoServico(ticket.tipoServico),
          cliente: {
            nome: ticket.cliente?.nome || 'Cliente',
            telefone: ticket.cliente?.telefone || '',
            plano: 'Plano Padrão',
          },
          localizacao: {
            endereco: ticket.origemEndereco,
            cidade: ticket.origemCidade,
            coordenadas: {
              lat: ticket.origemLatitude || -3.7319,
              lng: ticket.origemLongitude || -38.5267,
            },
          },
          destino: ticket.destinoEndereco ? {
            endereco: ticket.destinoEndereco,
            cidade: ticket.destinoCidade,
            coordenadas: {
              lat: ticket.destinoLatitude || -3.7319,
              lng: ticket.destinoLongitude || -38.5267,
            },
          } : undefined,
          status: ticket.status === 'em_execucao' ? 'em_atendimento' : 'aguardando',
          tempoEspera: 'Calculando...',
          prioridade: ticket.prioridade as 'critica' | 'alta' | 'media',
          prestadorDesignado: ticket.prestador ? {
            nome: ticket.prestador.nome,
            telefone: ticket.prestador.telefone,
            distancia: '0 km',
            tempoChegada: 'Calculando...',
          } : undefined,
          observacoes: ticket.descricaoProblema,
        }))
        
        setChamados(chamadosFormatados)
        setCarregando(false)
      } catch (error) {
        console.error('Erro ao carregar chamados:', error)
        setCarregando(false)
      }
    }

    // Carregar inicialmente
    carregarChamados()

    // Atualizar a cada 5 segundos
    const intervalo = setInterval(carregarChamados, 5000)

    return () => {
      clearInterval(intervalo)
    }
  }, [])

  return (
    <div className="fixed inset-0 top-16">
      {/* Mapa em Tela Cheia */}
      <div className="w-full h-full">
        <MapaAoVivo chamados={chamados} />
      </div>
    </div>
  )
}
