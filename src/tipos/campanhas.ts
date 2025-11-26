// ====================================
// TIPOS: CAMPANHAS EM MASSA
// ====================================

export type StatusCampanha = 'ativa' | 'agendada' | 'concluida' | 'pausada' | 'rascunho';
export type CanalCampanha = 'whatsapp' | 'email' | 'sms';
export type CategoriaCampanha = 
  | 'vendas-promocoes'
  | 'anuncios-lancamentos'
  | 'pesquisas-feedback'
  | 'eventos-comemoracoes'
  | 'lembretes-avisos'
  | 'recuperacao-carrinho'
  | 'newsletter'
  | 'aniversarios-datas';

export interface MetricasCampanha {
  enviadas: number;
  entregues: number;
  abertas: number;
  cliques: number;
  respostas: number;
  conversoes: number;
  receita: number;
  taxaEntrega: number;
  taxaAbertura: number;
  taxaClique: number;
  taxaResposta: number;
  taxaConversao: number;
  roi: number;
}

export interface BotaoAcao {
  id: string;
  texto: string;
  tipo: 'url' | 'chat' | 'telefone';
  valor: string;
}

export interface MensagemCampanha {
  texto: string;
  variaveis: string[];
  midia?: {
    tipo: 'imagem' | 'video' | 'documento';
    url: string;
    nome: string;
    tamanho: number;
  };
  botoes?: BotaoAcao[];
}

export interface FiltroCampanha {
  id: string;
  campo: string;
  operador: 'e' | 'igual' | 'diferente' | 'contem' | 'nao-contem' | 'maior' | 'menor' | 'ultimos-dias';
  valor: string | number;
}

export interface SegmentoCampanha {
  id?: string;
  nome?: string;
  filtros: FiltroCampanha[];
  totalClientes: number;
  breakdown: {
    whatsapp: number;
    email: number;
    sms: number;
  };
  excluidos: number;
  motivosExclusao: string;
}

export interface AgendamentoCampanha {
  tipo: 'imediato' | 'agendado';
  data?: string;
  hora?: string;
  fusoHorario: string;
  taxaEnvio: 'padrao' | 'rapido' | 'lento' | 'personalizado';
  taxaPersonalizada?: number;
  respeitarHorarioComercial: boolean;
  pularRecentementeContatados: boolean;
  pararSeErroAlto: boolean;
}

export interface Campanha {
  id: string;
  nome: string;
  descricao?: string;
  status: StatusCampanha;
  categoria: CategoriaCampanha;
  tags: string[];
  canais: CanalCampanha[];
  segmento: SegmentoCampanha;
  mensagem: MensagemCampanha;
  agendamento: AgendamentoCampanha;
  metricas: MetricasCampanha;
  criadoEm: string;
  criadoPor: string;
  iniciadaEm?: string;
  finalizadaEm?: string;
  tempoEstimado?: string;
  custoEstimado: number;
  projecoes?: {
    taxaEntrega: number;
    taxaAbertura: number;
    taxaConversao: number;
    receitaPotencial: number;
    roiEstimado: number;
  };
}

export interface ResumoCampanhas {
  periodo: string;
  campanhasAtivas: number;
  mensagensEnviadas: number;
  taxaEntrega: number;
  taxaAbertura: number;
  taxaResposta: number;
  taxaConversao: number;
  receitaGerada: number;
  custoPorEnvio: number;
  tendencias: {
    campanhasAtivas: number;
    mensagensEnviadas: number;
    taxaEntrega: number;
    taxaAbertura: number;
    taxaResposta: number;
    taxaConversao: number;
    receitaGerada: number;
  };
}

export interface EngajamentoCanal {
  canal: CanalCampanha;
  envios: number;
  taxaAbertura: number;
  taxaResposta: number;
  taxaConversao: number;
}

export interface TopCampanha {
  id: string;
  nome: string;
  conversao: number;
  roi: number;
  receita: number;
}

export interface AtividadeRecente {
  id: string;
  tipo: 'enviada' | 'agendada' | 'concluida';
  campanhaNome: string;
  data: string;
  destinatarios: number;
  canais: CanalCampanha[];
  metricas?: {
    entrega: number;
    abertura: number;
    conversao: number;
    receita?: number;
  };
}

export interface Alerta {
  id: string;
  tipo: 'warning' | 'error' | 'info';
  mensagem: string;
  quantidade?: number;
  acao?: string;
  link?: string;
}

export interface RespostaCliente {
  id: string;
  clienteNome: string;
  clienteAvatar?: string;
  mensagem: string;
  tempo: string;
  status: 'nova' | 'lida' | 'respondida';
}

export interface PerformanceCanal {
  canal: CanalCampanha;
  taxaAbertura: number;
  taxaClique: number;
  taxaResposta: number;
  conversao: number;
}

export interface MelhorHorario {
  dia: string;
  horario: string;
  engajamento: 'alto' | 'medio' | 'baixo';
}

export interface FunilConversao {
  enviadas: number;
  entregues: number;
  abertas: number;
  clicaram: number;
  responderam: number;
  converteram: number;
  roi: number;
}

export interface SegmentoSalvo {
  id: string;
  nome: string;
  filtros: FiltroCampanha[];
  totalClientes: number;
  ultimaAtualizacao: string;
}

export interface TemplatesMensagem {
  id: string;
  nome: string;
  categoria: CategoriaCampanha;
  mensagem: MensagemCampanha;
  vezesUsado: number;
  taxaConversaoMedia: number;
}
