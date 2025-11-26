export interface TicketCreateData {
  clienteId: string
  veiculoId?: string
  tipoServico: string
  descricaoProblema: string
  origemCep?: string
  origemEndereco: string
  origemCidade: string
  origemLatitude?: number
  origemLongitude?: number
  destinoCep?: string
  destinoEndereco?: string
  destinoCidade?: string
  destinoLatitude?: number
  destinoLongitude?: number
  distanciaKm?: number
  prioridade?: 'critica' | 'alta' | 'media'
  status?: string
  dataConclusao?: string
  dataInicio?: string
  prestadorId?: string | null
}

export const ticketsService = {
  async listar(status?: string) {
    try {
      const url = status 
        ? `/api/tickets?status=${status}`
        : '/api/tickets'
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Erro ao buscar tickets')
      }
      
      return data.data
    } catch (error) {
      console.error('Erro ao buscar tickets:', error)
      throw error
    }
  },

  async criar(ticketData: TicketCreateData) {
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Erro ao criar ticket')
      }
      
      return data.data
    } catch (error) {
      console.error('Erro ao criar ticket:', error)
      throw error
    }
  },

  async atualizar(id: string, updates: Partial<TicketCreateData>) {
    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Erro ao atualizar ticket')
      }
      
      return data.data
    } catch (error) {
      console.error('Erro ao atualizar ticket:', error)
      throw error
    }
  },
}
