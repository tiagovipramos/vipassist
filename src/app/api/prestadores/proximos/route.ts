import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Função para calcular distância entre dois pontos (Haversine formula)
function calcularDistancia(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Função para estimar tempo de chegada baseado na distância
function estimarTempoChegada(distanciaKm: number): string {
  const velocidadeMedia = 40 // km/h
  const tempoHoras = distanciaKm / velocidadeMedia
  const tempoMinutos = Math.round(tempoHoras * 60)

  if (tempoMinutos < 60) {
    return `${tempoMinutos} min`
  } else {
    const horas = Math.floor(tempoMinutos / 60)
    const minutos = tempoMinutos % 60
    return minutos > 0 ? `${horas}h ${minutos}min` : `${horas}h`
  }
}

// GET - Buscar prestadores próximos com base em coordenadas e raio
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const latitude = parseFloat(searchParams.get('latitude') || '0')
    const longitude = parseFloat(searchParams.get('longitude') || '0')
    const raio = parseInt(searchParams.get('raio') || '10')
    const tipoServico = searchParams.get('tipoServico')

    // Validações
    if (!latitude || !longitude) {
      return NextResponse.json(
        { success: false, error: 'Coordenadas são obrigatórias' },
        { status: 400 }
      )
    }

    if (raio < 5 || raio > 100) {
      return NextResponse.json(
        { success: false, error: 'Raio deve estar entre 5 e 100 km' },
        { status: 400 }
      )
    }

    // Buscar todos os prestadores ativos e disponíveis
    const prestadores = await prisma.prestador.findMany({
      where: {
        status: 'ativo',
        disponivel: true,
        latitude: { not: null },
        longitude: { not: null },
      },
      orderBy: { avaliacaoMedia: 'desc' },
    })

    // Filtrar por distância e tipo de serviço
    const prestadoresProximos = prestadores
      .map((p: any) => {
        const distancia = calcularDistancia(
          latitude,
          longitude,
          p.latitude!,
          p.longitude!
        )

        // Com PostgreSQL, servicos já vem como array (tipo Json)
        const servicos = Array.isArray(p.servicos) ? p.servicos : JSON.parse(p.servicos as string)

        // Verifica se o prestador oferece o serviço solicitado
        const ofereceTipoServico = tipoServico
          ? servicos.includes(tipoServico)
          : true

        // Verifica se está dentro do raio de atuação do prestador
        const dentroRaioPrestador = distancia <= p.raioAtuacao

        return {
          prestador: p,
          distancia,
          servicos,
          ofereceTipoServico,
          dentroRaioPrestador,
        }
      })
      .filter(
        (item: any) =>
          item.distancia <= raio &&
          item.ofereceTipoServico &&
          item.dentroRaioPrestador
      )
      .sort((a: any, b: any) => a.distancia - b.distancia)

    // Formatar resposta
    const prestadoresFormatados = prestadoresProximos.map((item: any) => {
      const p = item.prestador
      const especialidadesMap: Record<string, string> = {
        reboque: 'Reboque',
        pneu: 'Troca de Pneu',
        bateria: 'Pane Elétrica',
        combustivel: 'Falta de Combustível',
        chaveiro: 'Chaveiro',
        mecanica: 'Pane Mecânica',
        acidente: 'Acidente/Colisão',
        taxi: 'Táxi/Transporte',
        fluidos: 'Problemas Fluidos',
        residencial: 'Assist. Residencial',
        viagem: 'Assist. em Viagem',
        reparos: 'Pequenos Reparos',
      }

      const especialidades = item.servicos
        .map((s: string) => especialidadesMap[s])
        .filter(Boolean)

      // Determina o tipo baseado nos serviços
      let tipo: 'reboque' | 'mecanico' | 'chaveiro' | 'multiplo' = 'multiplo'
      if (item.servicos.length === 1) {
        if (item.servicos.includes('reboque')) tipo = 'reboque'
        else if (item.servicos.includes('chaveiro')) tipo = 'chaveiro'
        else tipo = 'mecanico'
      } else if (item.servicos.includes('reboque')) {
        tipo = 'reboque'
      }

      return {
        id: p.id,
        nome: p.nome,
        telefone: p.telefone,
        whatsapp: p.celular?.replace(/\D/g, '') || p.telefone.replace(/\D/g, ''),
        tipo,
        especialidades,
        localizacao: {
          endereco: `${p.logradouro}, ${p.numero} - ${p.bairro}`,
          cidade: `${p.cidade} - ${p.estado}`,
          coordenadas: {
            lat: p.latitude!,
            lng: p.longitude!,
          },
        },
        distanciaKm: parseFloat(item.distancia.toFixed(1)),
        tempoEstimadoChegada: estimarTempoChegada(item.distancia),
        avaliacaoMedia: p.avaliacaoMedia,
        totalAvaliacoes: p.totalAtendimentos,
        atendimentosRealizados: p.totalAtendimentos,
        disponivel: p.disponivel,
        raioAtuacao: p.raioAtuacao,
      }
    })

    return NextResponse.json({
      success: true,
      data: prestadoresFormatados,
      total: prestadoresFormatados.length,
      raioUtilizado: raio,
      coordenadas: { latitude, longitude },
    })
  } catch (error) {
    console.error('Erro ao buscar prestadores próximos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar prestadores próximos' },
      { status: 500 }
    )
  }
}
