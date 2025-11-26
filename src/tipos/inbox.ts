export type StatusConversa = 'online' | 'ausente' | 'ocupado' | 'offline'
export type PrioridadeConversa = 'urgente' | 'alta' | 'normal' | 'baixa'
export type StatusMensagem = 'enviando' | 'enviado' | 'entregue' | 'lido' | 'erro'
export type TipoMensagem = 'texto' | 'imagem' | 'video' | 'audio' | 'arquivo' | 'localizacao' | 'sistema'
export type CanalMensagem = 'whatsapp' | 'instagram' | 'telegram' | 'email' | 'chat_web'
export type StatusAtendimento = 'aberto' | 'em_andamento' | 'aguardando_cliente' | 'pausado' | 'resolvido' | 'arquivado'

export interface Tag {
  id: string
  nome: string
  cor: string
  icone?: string
}

export interface MensagemChat {
  id: string
  conversaId: string
  tipo: TipoMensagem
  conteudo: string
  remetente: 'cliente' | 'atendente' | 'bot' | 'sistema'
  remetenteId?: string
  remetenteNome?: string
  timestamp: Date
  status: StatusMensagem
  anexos?: {
    tipo: string
    url: string
    nome: string
    tamanho?: number
  }[]
  metadados?: {
    confiancaIA?: number
    motivoTransferencia?: string
    traducaoOriginal?: string
    idiomaOriginal?: string
  }
}

export interface NotaInterna {
  id: string
  conversaId: string
  atendenteId: string
  atendenteNome: string
  conteudo: string
  timestamp: Date
  mencoes?: string[]
}

export interface ConversaChat {
  id: string
  clienteId: string
  clienteNome: string
  clienteFoto?: string
  canal: CanalMensagem
  status: StatusAtendimento
  prioridade: PrioridadeConversa
  statusCliente: StatusConversa
  tags: Tag[]
  ultimaMensagem: string
  ultimaMensagemTipo: 'enviada' | 'recebida'
  timestampUltimaMensagem: Date
  mensagensNaoLidas: number
  atendenteId?: string
  atendenteNome?: string
  slaRestante?: number // em minutos
  csatScore?: number
  conversaNumero: number
  ltv: number
  estaDigitando: boolean
  mensagens: MensagemChat[]
  notasInternas: NotaInterna[]
  clienteInfo: ClienteInfo
}

export interface ClienteInfo {
  id: string
  nome: string
  foto?: string
  email: string
  telefone: string
  whatsapp?: string
  instagram?: string
  telegram?: string
  localizacao: {
    cidade: string
    estado: string
    pais: string
    cep: string
  }
  aniversario?: Date
  cpf?: string
  empresa?: {
    nome: string
    cnpj: string
  }
  tags: Tag[]
  resumo: {
    ltv: number
    totalPedidos: number
    csatMedio: number
    ultimoPedido: Date
    ticketsAbertos: number
  }
  historico: {
    conversas: ConversaHistorico[]
    pedidos: PedidoHistorico[]
    pagamentos: PagamentoHistorico[]
  }
  notasInternas: NotaInterna[]
  insightsIA: {
    tipo: 'risco_churn' | 'oportunidade_upsell' | 'cliente_satisfeito' | 'aniversario'
    titulo: string
    descricao: string
    acoes?: string[]
  }[]
}

export interface ConversaHistorico {
  id: string
  data: Date
  canal: CanalMensagem
  assunto: string
  status: StatusAtendimento
  atendenteNome: string
  csatScore?: number
}

export interface PedidoHistorico {
  id: string
  numero: string
  valor: number
  produtos: string
  data: Date
  dataPrevista?: Date
  status: string
  rastreio?: string
}

export interface PagamentoHistorico {
  id: string
  valor: number
  metodo: string
  status: string
  data: Date
}

export interface RespostaRapida {
  id: string
  atalho: string
  titulo: string
  conteudo: string
  categoria: string
  variaveis?: string[]
}

export interface SugestaoIA {
  id: string
  tipo: 'resposta' | 'acao' | 'insight'
  conteudo: string
  confianca: number
  contexto?: string
}

export interface FiltroConversa {
  status?: StatusAtendimento[]
  canal?: CanalMensagem[]
  atendente?: string[]
  tag?: string[]
  prioridade?: PrioridadeConversa[]
  naoLidas?: boolean
  busca?: string
}

export interface EstatisticasAtendente {
  id: string
  nome: string
  foto?: string
  status: StatusConversa
  conversasAtivas: number
  tempoMedioResposta: number // em minutos
  csatMedio: number
  mensagemStatus?: string
}

export interface ConfiguracaoChat {
  respostasRapidas: RespostaRapida[]
  templatesMsg: {
    id: string
    nome: string
    categoria: string
    conteudo: string
    variaveis: string[]
  }[]
  atalhosTeclado: {
    acao: string
    atalho: string
    descricao: string
  }[]
  notificacoes: {
    som: boolean
    desktop: boolean
    badge: boolean
  }
  aparencia: {
    temaEscuro: boolean
    modoFoco: boolean
  }
}
