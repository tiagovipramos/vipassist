// Tipos de canal de comunicação com cliente
export type CanalCliente = 'whatsapp' | 'telegram' | 'email' | 'sms' | 'chat' | 'telefone' | 'instagram' | 'chat_web';

export interface Cliente {
  id: string
  nome: string
  razaoSocial?: string
  nomeFantasia?: string
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
  
  // Contrato
  tipoContrato: 'mensal' | 'anual' | 'avulso'
  plano?: string
  dataInicioContrato?: string
  dataFimContrato?: string
  valorMensal?: number
  
  // Limites e Benefícios
  limiteAtendimentos?: number // por mês
  atendimentosUtilizados: number
  servicosContratados: string[] // IDs dos tipos de serviço
  
  // Contato Responsável
  contatoResponsavel?: {
    nome: string
    cargo?: string
    email: string
    telefone: string
  }
  
  // Financeiro
  formaPagamento?: 'boleto' | 'cartao' | 'pix' | 'transferencia'
  diaVencimento?: number
  
  // Status
  status: 'ativo' | 'inativo' | 'inadimplente' | 'suspenso'
  
  // Histórico
  totalAtendimentos: number
  ultimoAtendimento?: string
  
  // Datas
  dataCadastro: string
  dataAtualizacao: string
  
  // Observações
  observacoes?: string
}

export interface ContratoCliente {
  id: string
  clienteId: string
  tipo: 'mensal' | 'anual' | 'avulso'
  plano: string
  dataInicio: string
  dataFim?: string
  valor: number
  servicosInclusos: string[]
  limiteAtendimentos?: number
  status: 'ativo' | 'cancelado' | 'expirado'
}

export interface HistoricoCliente {
  id: string
  clienteId: string
  tipo: 'atendimento' | 'pagamento' | 'contrato' | 'suspensao' | 'reativacao'
  descricao: string
  data: string
  valor?: number
  usuarioId?: string
}
