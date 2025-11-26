import {
  GoogleMapsPlace,
  GoogleMapsTextSearchResponse,
  GoogleMapsNearbySearchResponse,
  GoogleMapsPlaceDetailsResponse,
  PrestadorGoogleMaps,
} from '@/tipos/googleMaps'

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

class GoogleMapsService {
  private baseUrl = 'https://maps.googleapis.com/maps/api/place'

  /**
   * Busca prestadores de reboque/guincho usando Text Search
   * @param query Cidade e estado (ex: "São Paulo, SP")
   * @returns Lista de prestadores encontrados
   */
  async buscarPrestadoresTexto(query: string): Promise<PrestadorGoogleMaps[]> {
    try {
      if (!API_KEY) {
        throw new Error('Google Maps API Key não configurada')
      }

      // Adicionar termos de busca específicos para reboque/guincho
      const searchQuery = `reboque guincho ${query}`

      const url = `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(
        searchQuery
      )}&key=${API_KEY}&language=pt-BR`

      const response = await fetch(url)
      const data: GoogleMapsTextSearchResponse = await response.json()

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(data.error_message || `Erro na busca: ${data.status}`)
      }

      if (data.status === 'ZERO_RESULTS') {
        return []
      }

      // Converter resultados para formato do sistema
      return data.results.map((place) => this.converterParaPrestador(place))
    } catch (error) {
      console.error('Erro ao buscar prestadores via texto:', error)
      throw error
    }
  }

  /**
   * Busca prestadores próximos a uma localização usando Nearby Search
   * @param latitude Latitude da localização
   * @param longitude Longitude da localização
   * @param raio Raio de busca em metros (padrão: 50000 = 50km)
   * @returns Lista de prestadores encontrados
   */
  async buscarPrestadoresProximos(
    latitude: number,
    longitude: number,
    raio: number = 50000
  ): Promise<PrestadorGoogleMaps[]> {
    try {
      if (!API_KEY) {
        throw new Error('Google Maps API Key não configurada')
      }

      const url = `${this.baseUrl}/nearbysearch/json?location=${latitude},${longitude}&radius=${raio}&keyword=reboque+guincho&key=${API_KEY}&language=pt-BR`

      const response = await fetch(url)
      const data: GoogleMapsNearbySearchResponse = await response.json()

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(data.error_message || `Erro na busca: ${data.status}`)
      }

      if (data.status === 'ZERO_RESULTS') {
        return []
      }

      // Converter resultados para formato do sistema
      return data.results.map((place) => this.converterParaPrestador(place))
    } catch (error) {
      console.error('Erro ao buscar prestadores próximos:', error)
      throw error
    }
  }

  /**
   * Busca detalhes de um prestador específico
   * @param placeId ID do lugar no Google Maps
   * @returns Detalhes do prestador
   */
  async buscarDetalhesPrestador(placeId: string): Promise<PrestadorGoogleMaps> {
    try {
      if (!API_KEY) {
        throw new Error('Google Maps API Key não configurada')
      }

      const url = `${this.baseUrl}/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,international_phone_number,geometry,address_components,rating,user_ratings_total,opening_hours,website&key=${API_KEY}&language=pt-BR`

      const response = await fetch(url)
      const data: GoogleMapsPlaceDetailsResponse = await response.json()

      if (data.status !== 'OK') {
        throw new Error(data.error_message || `Erro ao buscar detalhes: ${data.status}`)
      }

      return this.converterParaPrestador(data.result)
    } catch (error) {
      console.error('Erro ao buscar detalhes do prestador:', error)
      throw error
    }
  }

  /**
   * Geocodifica um endereço (cidade/estado) para obter coordenadas
   * @param endereco Endereço para geocodificar (ex: "São Paulo, SP")
   * @returns Coordenadas (latitude e longitude)
   */
  async geocodificarEndereco(endereco: string): Promise<{ lat: number; lng: number } | null> {
    try {
      if (!API_KEY) {
        throw new Error('Google Maps API Key não configurada')
      }

      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        endereco
      )}&key=${API_KEY}&language=pt-BR`

      const response = await fetch(url)
      const data = await response.json()

      if (data.status !== 'OK') {
        console.error('Erro ao geocodificar:', data.status)
        return null
      }

      if (data.results.length === 0) {
        return null
      }

      return data.results[0].geometry.location
    } catch (error) {
      console.error('Erro ao geocodificar endereço:', error)
      return null
    }
  }

  /**
   * Converte um GoogleMapsPlace para PrestadorGoogleMaps
   */
  private converterParaPrestador(place: GoogleMapsPlace): PrestadorGoogleMaps {
    // Extrair cidade e estado dos address_components
    let cidade = ''
    let estado = ''

    place.address_components.forEach((component) => {
      if (component.types.includes('administrative_area_level_2') || component.types.includes('locality')) {
        cidade = component.long_name
      }
      if (component.types.includes('administrative_area_level_1')) {
        estado = component.short_name
      }
    })

    return {
      placeId: place.place_id,
      nome: place.name,
      endereco: place.formatted_address,
      telefone: place.formatted_phone_number || place.international_phone_number,
      cidade: cidade || 'Não informado',
      estado: estado || 'Não informado',
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      avaliacao: place.rating,
      totalAvaliacoes: place.user_ratings_total,
      website: place.website,
      horarioFuncionamento: place.opening_hours?.weekday_text,
    }
  }
}

export const googleMapsService = new GoogleMapsService()
