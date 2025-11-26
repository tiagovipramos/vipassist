import { Prestador } from '@/tipos/prestador'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  total?: number
}

interface FiltrosPrestadores {
  status?: string
  tipoPessoa?: string
  estado?: string
  cidade?: string
  search?: string
}

class PrestadoresService {
  private baseUrl = '/api/prestadores'

  async listar(filtros?: FiltrosPrestadores): Promise<Prestador[]> {
    try {
      const params = new URLSearchParams()
      
      if (filtros) {
        Object.entries(filtros).forEach(([key, value]) => {
          if (value && value !== 'todos') {
            params.append(key, value)
          }
        })
      }

      const url = `${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Erro ao listar prestadores')
      }

      const result: ApiResponse<Prestador[]> = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Erro ao listar prestadores')
      }

      return result.data
    } catch (error) {
      console.error('Erro ao listar prestadores:', error)
      throw error
    }
  }

  async buscarPorId(id: string): Promise<Prestador> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar prestador')
      }

      const result: ApiResponse<Prestador> = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Erro ao buscar prestador')
      }

      return result.data
    } catch (error) {
      console.error('Erro ao buscar prestador:', error)
      throw error
    }
  }

  async criar(prestador: Partial<Prestador>): Promise<Prestador> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prestador),
      })

      const result: ApiResponse<Prestador> = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao criar prestador')
      }

      if (!result.data) {
        throw new Error('Erro ao criar prestador')
      }

      return result.data
    } catch (error) {
      console.error('Erro ao criar prestador:', error)
      throw error
    }
  }

  async atualizar(id: string, prestador: Partial<Prestador>): Promise<Prestador> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prestador),
      })

      const result: ApiResponse<Prestador> = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao atualizar prestador')
      }

      if (!result.data) {
        throw new Error('Erro ao atualizar prestador')
      }

      return result.data
    } catch (error) {
      console.error('Erro ao atualizar prestador:', error)
      throw error
    }
  }

  async excluir(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      })

      const result: ApiResponse<void> = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao excluir prestador')
      }
    } catch (error) {
      console.error('Erro ao excluir prestador:', error)
      throw error
    }
  }

  async alterarStatus(id: string, novoStatus: Prestador['status']): Promise<Prestador> {
    try {
      const prestador = await this.buscarPorId(id)
      return await this.atualizar(id, { ...prestador, status: novoStatus })
    } catch (error) {
      console.error('Erro ao alterar status do prestador:', error)
      throw error
    }
  }

  async buscarProximos(
    latitude: number,
    longitude: number,
    raio: number,
    tipoServico?: string
  ): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        raio: raio.toString(),
      })

      if (tipoServico) {
        params.append('tipoServico', tipoServico)
      }

      const url = `${this.baseUrl}/proximos?${params.toString()}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Erro ao buscar prestadores próximos')
      }

      const result: ApiResponse<any[]> = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Erro ao buscar prestadores próximos')
      }

      return result.data
    } catch (error) {
      console.error('Erro ao buscar prestadores próximos:', error)
      throw error
    }
  }
}

export const prestadoresService = new PrestadoresService()
