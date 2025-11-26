export type StatusCliente = 'lead' | 'prospect' | 'cliente' | 'vip' | 'inativo' | 'em_risco'

export type CanalPreferido = 'whatsapp' | 'instagram' | 'telegram' | 'email' | 'chat_web'

export type OrigemCliente = 'whatsapp' | 'instagram' | 'site' | 'indicacao' | 'anuncio' | 'outro'

export interface EnderecoCliente {
  cep: string
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
}

export interface HistoricoCompra {
  id: string
  data: string
  valor: number
  produto: string
  status: 'concluida' | 'pendente' | 'cancelada'
}

export interface ClienteCRM {
  id: string
  nome: string
  email?: string
  telefone: string
  whatsapp?: string
  instagram?: string
  telegram?: string
  empresa?: string
  cpfCnpj?: string
  
  // Foto e visual
  fotoUrl?: string
  iniciais: string
  corAvatar: string
  
  // Categorização
  status: StatusCliente
  tags: string[]
  origem: OrigemCliente
  canalPreferido: CanalPreferido
  
  // Endereço
  endereco?: EnderecoCliente
  
  // Métricas
  csat: number // 0 a 5
  satisfacao: 'muito_satisfeito' | 'satisfeito' | 'neutro' | 'insatisfeito' | 'muito_insatisfeito'
  ltv: number // Lifetime Value
  totalCompras: number
  historicoCompras: HistoricoCompra[]
  
  // Datas
  clienteDesde: string
  ultimaInteracao: string
  ultimaCompra?: string
  
  // Relacionamento
  responsavel?: string
  observacoes?: string
  
  // Segmentação
  segmento?: string
  
  // Alertas
  emRisco?: boolean
  motivoRisco?: string
}

export interface FiltrosCRM {
  busca?: string
  status?: StatusCliente[]
  tags?: string[]
  canalPreferido?: CanalPreferido[]
  ltvMin?: number
  ltvMax?: number
  csatMin?: number
  csatMax?: number
  ultimaInteracao?: {
    tipo: 'hoje' | 'ultimos_7_dias' | 'ultimos_30_dias' | 'mais_30_dias' | 'personalizado'
    dataInicio?: string
    dataFim?: string
  }
  totalCompras?: {
    min?: number
    max?: number
  }
  origem?: OrigemCliente[]
  estado?: string[]
  cidade?: string[]
  idadeMin?: number
  idadeMax?: number
  dataCadastro?: {
    inicio?: string
    fim?: string
  }
}

export interface SegmentoCRM {
  id: string
  nome: string
  descricao?: string
  filtros: FiltrosCRM
  totalClientes: number
  cor?: string
  icone?: string
}

export type VisualizacaoCRM = 'cards' | 'lista' | 'kanban'

export interface MetricasCRM {
  totalClientes: number
  novosEsteMes: number
  ltvMedio: number
  csatMedio: number
  clientesVIP: number
  clientesEmRisco: number
  clientesInativos: number
  totalLTV: number
}
