// Tipos para Google Maps Places API

export interface GoogleMapsPlace {
  place_id: string
  name: string
  formatted_address: string
  formatted_phone_number?: string
  international_phone_number?: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  address_components: Array<{
    long_name: string
    short_name: string
    types: string[]
  }>
  rating?: number
  user_ratings_total?: number
  opening_hours?: {
    open_now: boolean
    weekday_text: string[]
  }
  website?: string
  business_status?: string
  types: string[]
}

export interface GoogleMapsTextSearchResponse {
  results: GoogleMapsPlace[]
  status: string
  error_message?: string
  next_page_token?: string
}

export interface GoogleMapsNearbySearchResponse {
  results: GoogleMapsPlace[]
  status: string
  error_message?: string
  next_page_token?: string
}

export interface GoogleMapsPlaceDetailsResponse {
  result: GoogleMapsPlace
  status: string
  error_message?: string
}

export interface PrestadorGoogleMaps {
  placeId: string
  nome: string
  endereco: string
  telefone?: string
  cidade: string
  estado: string
  latitude: number
  longitude: number
  avaliacao?: number
  totalAvaliacoes?: number
  website?: string
  horarioFuncionamento?: string[]
}
