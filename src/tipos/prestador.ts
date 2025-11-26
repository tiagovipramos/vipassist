export interface Prestador {
  id: string
  nome: string
  razaoSocial?: string
  cnpj?: string
  cpf?: string
  tipoPessoa: 'fisica' | 'juridica'
  email: string
  telefone: string
  celular?: string
  
  // Endereço
  endereco: {
    cep: string
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
  }
  
  // Serviços
  servicos: string[] // IDs dos tipos de serviço que presta
  raioAtuacao: number // em km
  
  // Documentação
  documentos: {
    tipo: string
    numero: string
    validade?: string
    arquivo?: string
  }[]
  
  // Financeiro
  dadosBancarios?: {
    banco: string
    agencia: string
    conta: string
    tipoConta: 'corrente' | 'poupanca'
    pix?: string
  }
  
  // Status e Avaliação
  status: 'ativo' | 'inativo' | 'pendente' | 'bloqueado'
  avaliacaoMedia: number
  totalAtendimentos: number
  
  // Disponibilidade
  disponivel: boolean
  ultimaLocalizacao?: {
    latitude: number
    longitude: number
    dataHora: string
  }
  
  // Datas
  dataCadastro: string
  dataAtualizacao: string
  
  // Observações
  observacoes?: string
}

export interface TipoServico {
  id: string
  nome: string
  descricao?: string
  icone?: string
  ativo: boolean
}

export interface AvaliacaoPrestador {
  id: string
  prestadorId: string
  ticketId: string
  clienteId: string
  nota: number // 1-5
  comentario?: string
  data: string
}

export interface HistoricoPrestador {
  id: string
  prestadorId: string
  tipo: 'atendimento' | 'avaliacao' | 'bloqueio' | 'desbloqueio' | 'atualizacao'
  descricao: string
  data: string
  usuarioId?: string
}
