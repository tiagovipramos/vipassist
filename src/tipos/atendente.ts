export type StatusAtendente = 'online' | 'offline' | 'ocupado' | 'pausa' | 'ausente';
export type TipoAtendente = 'humano' | 'ia';
export type CargoAtendente = 'atendente' | 'supervisor' | 'ia';
export type SetorAtendente = 'vendas' | 'suporte' | 'financeiro' | 'geral';

export interface MetricasAtendente {
  atendimentosAtivos: number;
  atendimentosHoje: number;
  metaDiaria: number;
  tempoMedioResposta: number; // em segundos
  tempoMedioAtendimento: number; // em segundos
  taxaResolucao: number; // percentual
  satisfacao: number; // 0-5
  numeroAvaliacoes: number;
  sentimentoClientes: {
    positivo: number; // percentual
    neutro: number; // percentual
    negativo: number; // percentual
  };
}

export interface ConversaAtiva {
  id: string;
  clienteNome: string;
  clienteAvatar?: string;
  canal: string;
  tempoConversa: number; // em segundos
  ultimaMensagem: string;
}

export interface Atendente {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  avatar?: string;
  cargo: CargoAtendente;
  setor: SetorAtendente;
  tipo: TipoAtendente;
  status: StatusAtendente;
  metricas: MetricasAtendente;
  conversasAtivas: ConversaAtiva[];
  onlineHa?: number; // em minutos (se online)
  ultimaAtividade?: string; // timestamp (se offline)
  pausaHa?: number; // em minutos (se em pausa)
  dataEntrada: string;
  dispositivo?: string; // 'web' | 'mobile'
  localizacao?: string;
}

export interface MetricasEquipe {
  atendentesOnline: number;
  totalAtendentes: number;
  iasAtivas: number;
  tmrHoje: number; // em segundos
  variacaoTmr: number; // percentual vs ontem
  taxaResolucao: number; // percentual
  variacaoTaxaResolucao: number; // percentual vs ontem
  atendimentosHoje: number;
  variacaoAtendimentos: number; // percentual vs ontem
  filaEspera: number;
  tempoMedioEspera: number; // em segundos
  satisfacao: number; // 0-5
  nps: number;
}

export interface DesempenhoAtendente {
  periodo: string; // data
  atendimentos: number;
  satisfacao: number;
  tmr: number;
  tma: number;
  taxaResolucao: number;
}

export interface AvaliacaoCliente {
  id: string;
  clienteNome: string;
  nota: number; // 1-5
  comentario: string;
  data: string;
}

export interface FeedbackInterno {
  id: string;
  supervisorNome: string;
  tipo: 'elogio' | 'advertencia' | 'sugestao';
  comentario: string;
  data: string;
}

export interface InsightIA {
  pontoFortes: string[];
  pontosAtencao: string[];
  sugestoesMelhoria: string[];
  frasesMaisUsadas: { frase: string; quantidade: number }[];
  padroes: { descricao: string; tipo: 'positivo' | 'neutro' | 'negativo' }[];
}

export interface MetricasIA {
  atendimentosAutonomos: number;
  metaAutonomos: number;
  taxaEscalacao: number; // percentual
  numeroEscalacoes: number;
  tempoMedioResposta: number; // em segundos
  taxaResolucaoCompleta: number; // percentual
  satisfacao: number; // 0-5
  certezaMedia: number; // percentual
  motivosEscalacao: {
    frustracaoAlta: number; // percentual
    foraDaBase: number; // percentual
    clienteSolicitou: number; // percentual
    conversaLonga: number; // percentual
  };
  principaisTopicos: { topico: string; quantidade: number }[];
  falhasBase: { topico: string; perguntasSemResposta: number }[];
}

export interface PerfilCompletoAtendente extends Atendente {
  desempenhoHistorico: DesempenhoAtendente[];
  avaliacoes: AvaliacaoCliente[];
  feedbacksInternos: FeedbackInterno[];
  insightsIA: InsightIA;
  distribuicaoCanais: { canal: string; percentual: number }[];
  horariosProducao: { hora: number; produtividade: number }[];
  rankingEquipe: {
    posicao: number;
    total: number;
    atendimentos: number;
    satisfacao: number;
    tmr: number;
    resolucao: number;
  };
  registroPonto?: {
    entrada: string;
    saida?: string;
    horasTrabalhadas: number;
    pausas: { tipo: string; duracao: number; horario: string }[];
  }[];
  tempoAtividade: {
    emAtendimento: number; // percentual
    disponivel: number; // percentual
    emPausa: number; // percentual
  };
  metricasIA?: MetricasIA; // apenas para IAs
}

export type FiltroStatus = 'todos' | StatusAtendente;
export type FiltroSetor = 'todos' | SetorAtendente;
export type FiltroPerformance = 'todos' | 'alta' | 'media' | 'baixa';
export type FiltroTipo = 'todos' | TipoAtendente;
export type FiltroPeriodo = 'hoje' | 'ultimos7dias' | 'ultimos30dias' | 'personalizado';

export interface FiltrosAtendentes {
  busca: string;
  status: FiltroStatus;
  setor: FiltroSetor;
  performance: FiltroPerformance;
  tipo: FiltroTipo;
  periodo: FiltroPeriodo;
  dataInicio?: string;
  dataFim?: string;
}

export type OrdenacaoAtendentes = 'status' | 'atendimentos' | 'satisfacao' | 'tmr' | 'nome';

export interface RankingAtendente {
  atendenteId: string;
  atendenteNome: string;
  atendenteAvatar?: string;
  atendimentos: number;
  satisfacao: number;
  tmr: number;
  posicao: number;
}

export interface AlertaAtendente {
  id: string;
  atendenteId: string;
  atendenteNome: string;
  tipo: 'desempenho' | 'operacional' | 'bem-estar';
  severidade: 'baixa' | 'media' | 'alta';
  mensagem: string;
  data: string;
  resolvido: boolean;
}
