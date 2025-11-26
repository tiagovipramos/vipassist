export type StatusTicket = 'aberto' | 'em_andamento' | 'aguardando_cliente' | 'aguardando_equipe' | 'resolvido' | 'fechado' | 'cancelado';

export type PrioridadeTicket = 'baixa' | 'media' | 'alta' | 'urgente';

export type TipoTicket = 'duvida' | 'problema' | 'solicitacao' | 'reclamacao' | 'elogio' | 'sugestao';

export interface Ticket {
  id: string;
  numero: string;
  clienteId: string;
  usuarioId?: string;
  titulo: string;
  descricao: string;
  status: StatusTicket;
  prioridade: PrioridadeTicket;
  tipo: TipoTicket;
  categoria?: string;
  subcategoria?: string;
  tags: string[];
  dataCriacao: string;
  dataAtualizacao: string;
  dataResolucao?: string;
  dataFechamento?: string;
  tempoResposta?: number; // em minutos
  tempoResolucao?: number; // em minutos
  sla?: {
    tempoLimite: number;
    tempoDecorrido: number;
    percentual: number;
    vencido: boolean;
  };
  satisfacao?: {
    nota: number; // 1-5
    comentario?: string;
    data: string;
  };
  conversaId?: string;
  anexos?: string[];
  customFields?: Record<string, any>;
}

export interface ComentarioTicket {
  id: string;
  ticketId: string;
  usuarioId: string;
  conteudo: string;
  tipo: 'comentario' | 'nota_interna' | 'resolucao';
  anexos?: string[];
  dataCriacao: string;
  editado: boolean;
  dataEdicao?: string;
}

export interface HistoricoTicket {
  id: string;
  ticketId: string;
  usuarioId?: string;
  usuarioNome?: string;
  acao: string;
  descricao: string;
  campoAlterado?: string;
  valorAnterior?: any;
  valorNovo?: any;
  data: string;
  tipo: 'sistema' | 'usuario' | 'ia';
}

// Métricas gerais de tickets
export interface MetricasTickets {
  ticketsAbertos: number;
  variacaoAbertos: number;
  ticketsUrgentes: number;
  variacaoUrgentes: number;
  tempoMedioResolucao: number; // em minutos
  variacaoTempoMedio: number;
  resolvidosHoje: number;
  variacaoResolvidosHoje: number;
  taxaResolucao: number; // percentual
  variacaoTaxaResolucao: number;
  satisfacaoMedia: number; // 0-5
  nps: number;
  distribuicaoPorStatus: {
    aberto: number;
    em_andamento: number;
    aguardando_cliente: number;
    aguardando_equipe: number;
    resolvido: number;
    fechado: number;
  };
}

// Análise de tickets por categoria
export interface AnaliseCategoria {
  categoria: string;
  total: number;
  percentual: number;
  tempoMedioResolucao: number;
  satisfacaoMedia: number;
}

// Performance por atendente em tickets
export interface PerformanceAtendenteTickets {
  atendenteId: string;
  atendenteNome: string;
  atendenteAvatar?: string;
  ticketsAtribuidos: number;
  ticketsResolvidos: number;
  taxaResolucao: number;
  satisfacaoMedia: number;
  tempoMedioResolucao: number;
}

// Alerta de ticket
export interface AlertaTicket {
  id: string;
  tipo: 'sla_estourado' | 'sla_proximo' | 'padrao_detectado' | 'carga_desbalanceada' | 'cliente_irritado';
  severidade: 'baixa' | 'media' | 'alta' | 'critica';
  ticketId?: string;
  ticketNumero?: string;
  titulo: string;
  descricao: string;
  acao?: string;
  data: string;
  lido: boolean;
  resolvido: boolean;
}

// Sugestão da IA
export interface SugestaoIA {
  id: string;
  ticketId: string;
  tipo: 'solucao_similar' | 'escalacao' | 'priorizacao' | 'automacao';
  confianca: number; // 0-100
  titulo: string;
  descricao: string;
  ticketSimilarId?: string;
  ticketSimilarNumero?: string;
  acaoSugerida?: string;
  data: string;
  aplicada: boolean;
}

// Regra de automação
export interface RegraAutomacao {
  id: string;
  nome: string;
  descricao: string;
  ativa: boolean;
  condicao: {
    tipo: 'tempo' | 'status' | 'palavra_chave' | 'prioridade' | 'cliente' | 'satisfacao';
    operador: 'igual' | 'contem' | 'maior_que' | 'menor_que';
    valor: any;
  };
  acao: {
    tipo: 'atribuir' | 'escalar' | 'mudar_status' | 'mudar_prioridade' | 'notificar' | 'tag';
    valor: any;
  };
  ticketsAfetados: number;
  ultimaExecucao?: string;
  dataCriacao: string;
}

// Ticket com detalhes expandidos para visão do gestor
export interface TicketDetalhado extends Ticket {
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone?: string;
  clienteAvatar?: string;
  clienteTags: string[];
  clienteVip: boolean;
  usuarioNome?: string;
  usuarioAvatar?: string;
  usuarioSetor?: string;
  comentarios: ComentarioTicket[];
  historico: HistoricoTicket[];
  analiseIA?: {
    nivelUrgencia: number; // 0-10
    sentimentoCliente: 'positivo' | 'neutro' | 'negativo' | 'muito_negativo';
    probabilidadeEscalacao: number; // 0-100
    ticketsSimilares: number;
    sugestoes: string[];
    alertas: string[];
  };
  tempoAbertoMinutos: number;
  tempoUltimaAtualizacaoMinutos: number;
}

// Insights e análises
export interface InsightsTickets {
  ticketsCriticos: {
    id: string;
    numero: string;
    titulo: string;
    tempoAberto: number;
    slaRestante: number;
    clienteNome: string;
  }[];
  tendencias: {
    periodo: string;
    volumeMedio: number;
    picoHorario: string;
    diaPico: string;
    variacaoSemanal: number;
  };
  distribuicaoPorTipo: AnaliseCategoria[];
  tempoResolucaoPorTipo: {
    tipo: string;
    tempoMedio: number;
    meta: number;
    dentroMeta: boolean;
  }[];
  padroes: {
    tipo: string;
    descricao: string;
    ocorrencias: number;
    impacto: 'baixo' | 'medio' | 'alto';
    recomendacao: string;
  }[];
}
