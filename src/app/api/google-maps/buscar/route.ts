import { NextRequest, NextResponse } from 'next/server'
import { PrestadorGoogleMaps } from '@/tipos/googleMaps'
import fs from 'fs'
import path from 'path'

// Função para ler a API key do arquivo .env em runtime
function getApiKey(): string | undefined {
  try {
    const envPath = path.join(process.cwd(), '.env')
    const envContent = fs.readFileSync(envPath, 'utf-8')
    const lines = envContent.split('\n')
    
    for (const line of lines) {
      if (line.startsWith('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=')) {
        return line.split('=')[1].trim()
      }
    }
  } catch (error) {
    console.error('Erro ao ler .env:', error)
  }
  
  // Fallback para variável de ambiente
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
}

// Função para ler o raio de busca do arquivo .env em runtime
function getSearchRadius(): number {
  try {
    const envPath = path.join(process.cwd(), '.env')
    const envContent = fs.readFileSync(envPath, 'utf-8')
    const lines = envContent.split('\n')
    
    for (const line of lines) {
      if (line.startsWith('GOOGLE_MAPS_SEARCH_RADIUS=')) {
        const radius = parseInt(line.split('=')[1].trim())
        return isNaN(radius) ? 50000 : radius // Padrão 50km se inválido
      }
    }
  } catch (error) {
    console.error('Erro ao ler raio de busca do .env:', error)
  }
  
  // Fallback para 50km (50000 metros)
  return 50000
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tipo, query, latitude, longitude, raio } = body

    const API_KEY = getApiKey()

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'Google Maps API Key não configurada' },
        { status: 500 }
      )
    }

    let url = ''
    const baseUrl = 'https://maps.googleapis.com/maps/api/place'

    if (tipo === 'texto') {
      // Text Search
      if (!query) {
        return NextResponse.json(
          { error: 'Query é obrigatório para busca por texto' },
          { status: 400 }
        )
      }

      const searchQuery = `reboque guincho ${query}`
      url = `${baseUrl}/textsearch/json?query=${encodeURIComponent(
        searchQuery
      )}&key=${API_KEY}&language=pt-BR`
    } else if (tipo === 'proximo') {
      // Nearby Search
      if (!latitude || !longitude) {
        return NextResponse.json(
          { error: 'Latitude e longitude são obrigatórios para busca por proximidade' },
          { status: 400 }
        )
      }

      // Usar raio configurado ou o fornecido na requisição
      const configuredRadius = getSearchRadius()
      const searchRadius = raio || configuredRadius
      url = `${baseUrl}/nearbysearch/json?location=${latitude},${longitude}&radius=${searchRadius}&keyword=reboque+guincho&key=${API_KEY}&language=pt-BR`
    } else if (tipo === 'geocode') {
      // Geocoding
      if (!query) {
        return NextResponse.json(
          { error: 'Query é obrigatório para geocodificação' },
          { status: 400 }
        )
      }

      url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        query
      )}&key=${API_KEY}&language=pt-BR`

      const response = await fetch(url)
      const data = await response.json()

      if (data.status !== 'OK') {
        return NextResponse.json(
          { error: `Erro ao geocodificar: ${data.status}` },
          { status: 400 }
        )
      }

      if (data.results.length === 0) {
        return NextResponse.json({ coordenadas: null })
      }

      return NextResponse.json({
        coordenadas: data.results[0].geometry.location,
      })
    } else {
      return NextResponse.json(
        { error: 'Tipo de busca inválido' },
        { status: 400 }
      )
    }

    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return NextResponse.json(
        { error: data.error_message || `Erro na busca: ${data.status}` },
        { status: 400 }
      )
    }

    if (data.status === 'ZERO_RESULTS') {
      return NextResponse.json({ prestadores: [] })
    }

    // Buscar detalhes de cada lugar para obter telefone
    const prestadoresComDetalhes = await Promise.all(
      data.results.map(async (place: any) => {
        // Buscar detalhes do lugar para obter telefone
        const detailsUrl = `${baseUrl}/details/json?place_id=${place.place_id}&fields=formatted_phone_number,international_phone_number,website&key=${API_KEY}&language=pt-BR`
        
        let telefone = null
        let website = null
        
        try {
          const detailsResponse = await fetch(detailsUrl)
          const detailsData = await detailsResponse.json()
          
          if (detailsData.status === 'OK' && detailsData.result) {
            telefone = detailsData.result.formatted_phone_number || detailsData.result.international_phone_number
            website = detailsData.result.website
          }
        } catch (error) {
          console.error('Erro ao buscar detalhes do lugar:', error)
        }

        let cidade = ''
        let estado = ''

        place.address_components?.forEach((component: any) => {
          if (
            component.types.includes('administrative_area_level_2') ||
            component.types.includes('locality')
          ) {
            cidade = component.long_name
          }
          if (component.types.includes('administrative_area_level_1')) {
            estado = component.short_name
          }
        })

        return {
          placeId: place.place_id,
          nome: place.name,
          endereco: place.formatted_address || place.vicinity,
          telefone: telefone,
          cidade: cidade || '',
          estado: estado || '',
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          avaliacao: place.rating,
          totalAvaliacoes: place.user_ratings_total,
          website: website,
          horarioFuncionamento: place.opening_hours?.weekday_text,
        }
      })
    )

    return NextResponse.json({ prestadores: prestadoresComDetalhes })
  } catch (error: any) {
    console.error('Erro na API do Google Maps:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar prestadores' },
      { status: 500 }
    )
  }
}
