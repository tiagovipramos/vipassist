// ==========================================
// TIPOS PARA RELATÓRIOS
// ==========================================

export interface PeriodoRelatorio {
  inicio: string;
  fim: string;
  tipo: 'hoje' | 'ontem' | '7dias' | '30dias' | 'mes_atual' | 'mes_passado' | '3meses' | 'ano' | 'personalizado';
  compararComAnterior: boolean;
}

export interface FiltrosRelatorio {
  canais: string[];
  atendentes: string[];
  setores: string[];
  tags: string[];
}

// Métricas Gerais
export interface MetricasVisaoGeral {
  atendimentos: {
    total: number;
    variacao: number;
  };
  tmr: {
    valor: string;
    segundos: number;
    variacao: number;
  };
  csat: {
    valor: number;
    variacao: number;
  };
  taxaResolucao: {
    valor: number;
    variacao: number;
  };
  tickets: {
    total: number;
    abertos: number;
  };
  clientesAtivos: {
    total: number;
    variacao: number;
  };
  receita: {
    valor: number;
    variacao: number;
  };
  churn: {
    valor: number;
    variacao: number;
  };
}

// Evolução de Atendimentos
export interface EvolucaoAtendimentos {
  labels: string[];
  periodoAtual: number[];
  periodoAnterior: number[];
  insight: string;
}

// Distribuição por Canal
export interface DistribuicaoPorCanal {
  canal: string;
  percentual: number;
  total: number;
  cor: string;
}

// Distribuição por Horário (Heatmap)
export interface HeatmapHorario {
  dia: string;
  horas: number[]; // 24 posições, uma para cada hora
}

// Principais Assuntos
export interface PrincipalAssunto {
  assunto: string;
  percentual: number;
  total: number;
}

// Distribuição de Sentimento
export interface DistribuicaoSentimento {
  labels: string[];
  positivo: number[];
  neutro: number[];
  negativo: number[];
}

// Métricas de Atendimento
export interface MetricasAtendimento {
  tmr: {
    valor: string;
    segundos: number;
    meta: number;
    status: 'excelente' | 'bom' | 'atencao' | 'critico';
  };
  tma: {
    valor: string;
    minutos: number;
    meta: number;
    status: 'excelente' | 'bom' | 'atencao' | 'critico';
  };
  primeiraResposta: {
    valor: string;
    segundos: number;
    meta: number;
    status: 'excelente' | 'bom' | 'atencao' | 'critico';
  };
  taxaEscalonamento: {
    valor: number;
    meta: number;
    status: 'excelente' | 'bom' | 'atencao' | 'critico';
  };
}

// Funil de Atendimento
export interface FunilAtendimento {
  etapa: string;
  total: number;
  percentual: number;
}

// Volume por Dia da Semana
export interface VolumeDiaSemana {
  dia: string;
  total: number;
}

// Tempo de Resolução por Tipo
export interface TempoResolucaoTipo {
  tipo: string;
  tempoMedio: number;
  cor: string;
}

// Análise de Tickets
export interface AnaliseTickets {
  total: number;
  abertos: number;
  emAndamento: number;
  resolvidos: number;
  slaEstourado: number;
  percentualSLA: number;
}

// Tickets por Prioridade
export interface TicketsPrioridade {
  prioridade: string;
  total: number;
  cor: string;
  icone: string;
}

// Métricas da Equipe
export interface MetricasEquipeRelatorio {
  totalAtendentes: number;
  tmrMedio: string;
  csatMedio: number;
  resolucaoMedia: number;
}

// Ranking de Atendentes
export interface RankingAtendenteRelatorio {
  posicao: number;
  nome: string;
  avatar: string;
  tipo: 'humano' | 'ia';
  status: 'online' | 'offline' | 'ausente';
  atendimentos: number;
  tmr: string;
  csat: number;
  resolucao: number;
  eficiencia: number;
}

// Detalhes do Atendente
export interface DetalhesAtendenteRelatorio {
  id: string;
  nome: string;
  avatar: string;
  tipo: 'humano' | 'ia';
  metricas: {
    atendimentos: number;
    tmr: string;
    tma: string;
    csat: number;
    taxaResolucao: number;
    taxaEscalonamento: number;
  };
  evolucao: {
    labels: string[];
    atendimentos: number[];
    csat: number[];
    resolucao: number[];
  };
  pontosFortes: string[];
  pontosAtencao: string[];
  recomendacoes: string[];
}

// Comparação Humanos vs IAs
export interface ComparacaoHumanosIA {
  humanos: {
    total: number;
    volumePercentual: number;
    tmr: string;
    csat: number;
    resolucao: number;
    custoAtendimento: number;
  };
  ias: {
    total: number;
    volumePercentual: number;
    tmr: string;
    csat: number;
    resolucao: number;
    custoAtendimento: number;
  };
  insights: string[];
}

// Métricas de Satisfação
export interface MetricasSatisfacao {
  csat: {
    valor: number;
    variacao: number;
  };
  nps: {
    valor: number;
    variacao: number;
  };
  taxaResposta: {
    valor: number;
    variacao: number;
  };
  promotores: {
    valor: number;
    neutros: number;
    detratores: number;
  };
}

// Evolução do CSAT
export interface EvolucaoCSAT {
  labels: string[];
  valores: number[];
  inicio: number;
  fim: number;
  crescimento: number;
  insight: string;
}

// Distribuição de Notas
export interface DistribuicaoNotas {
  nota: number;
  total: number;
  percentual: number;
}

// Análise de Feedback
export interface AnaliseFeedback {
  totalComentarios: number;
  positivos: {
    total: number;
    percentual: number;
    palavrasChave: string[];
  };
  neutros: {
    total: number;
    percentual: number;
    palavrasChave: string[];
  };
  negativos: {
    total: number;
    percentual: number;
    palavrasChave: string[];
  };
}

// Avaliações Negativas
export interface AvaliacoesNegativas {
  total: number;
  percentual: number;
  motivos: {
    motivo: string;
    percentual: number;
  }[];
  acoesCorretivas: string[];
}

// Métricas de Vendas
export interface MetricasVendas {
  receitaTotal: {
    valor: number;
    variacao: number;
  };
  conversoes: {
    total: number;
    variacao: number;
  };
  ticketMedio: {
    valor: number;
    variacao: number;
  };
  taxaConversao: {
    valor: number;
    variacao: number;
  };
}

// Receita por Dia
export interface ReceitaPorDia {
  dia: string;
  valor: number;
}

// Top Vendedores
export interface TopVendedor {
  id: string;
  nome: string;
  receita: number;
  vendas: number;
  taxaConversao: number;
}

// Previsão de Volume
export interface PrevisaoVolume {
  labels: string[];
  historico: number[];
  previsao: number[];
  volumePrevisto: number;
  crescimentoPercentual: number;
  confianca: number;
  alertas: string[];
}

// Crescimento Mensal
export interface CrescimentoMensal {
  mes: string;
  valor: number;
}

// Métricas em Evolução
export interface MetricasEmEvolucao {
  labels: string[];
  csat: number[];
  tmr: number[];
  resolucao: number[];
  churn: number[];
  insights: string[];
}

// Métricas de IA
export interface MetricasIA {
  atendimentosIA: {
    total: number;
    percentualTotal: number;
  };
  resolvidosIA: {
    total: number;
    percentual: number;
    variacao: number;
  };
  escaladosHumano: {
    total: number;
    percentual: number;
    variacao: number;
  };
  tempoMedio: {
    valor: string;
    segundos: number;
  };
}

// Tipos de Atendimento da IA
export interface TiposAtendimentoIA {
  resolvidoCompleto: {
    total: number;
    percentual: number;
    categorias: {
      categoria: string;
      total: number;
      percentual: number;
    }[];
  };
  escalado: {
    total: number;
    percentual: number;
    motivos: {
      motivo: string;
      total: number;
      percentual: number;
    }[];
  };
}

// Economia com IA
export interface EconomiaIA {
  custoHumano: number;
  custoIA: number;
  economiaPorAtendimento: number;
  economiaTotal: number;
  roi: number;
}

// Gaps na Base de Conhecimento
export interface GapsBaseConhecimento {
  total: number;
  top5: {
    pergunta: string;
    ocorrencias: number;
  }[];
}

// Relatório Personalizado
export interface RelatorioPersonalizado {
  id: string;
  nome: string;
  descricao?: string;
  metricas: string[];
  filtros: FiltrosRelatorio;
  periodo: PeriodoRelatorio;
  formato: 'dashboard' | 'pdf' | 'excel' | 'email';
  agendamento?: {
    frequencia: 'diaria' | 'semanal' | 'mensal';
    dia?: string;
    hora?: string;
    destinatarios?: string[];
  };
  dataCriacao: string;
  dataAtualizacao: string;
}

// Dados Completos de Relatórios
export interface DadosRelatorios {
  visaoGeral: {
    metricas: MetricasVisaoGeral;
    evolucaoAtendimentos: EvolucaoAtendimentos;
    distribuicaoCanais: DistribuicaoPorCanal[];
    heatmapHorario: HeatmapHorario[];
    principaisAssuntos: PrincipalAssunto[];
    distribuicaoSentimento: DistribuicaoSentimento;
  };
  atendimento: {
    metricas: MetricasAtendimento;
    funil: FunilAtendimento[];
    volumeDiaSemana: VolumeDiaSemana[];
    tempoResolucaoTipo: TempoResolucaoTipo[];
    analiseTickets: AnaliseTickets;
    ticketsPrioridade: TicketsPrioridade[];
  };
  equipe: {
    metricas: MetricasEquipeRelatorio;
    ranking: RankingAtendenteRelatorio[];
    comparacaoHumanosIA: ComparacaoHumanosIA;
  };
  satisfacao: {
    metricas: MetricasSatisfacao;
    evolucaoCSAT: EvolucaoCSAT;
    distribuicaoNotas: DistribuicaoNotas[];
    analiseFeedback: AnaliseFeedback;
    avaliacoesNegativas: AvaliacoesNegativas;
  };
  vendas: {
    metricas: MetricasVendas;
    receitaPorDia: ReceitaPorDia[];
    topVendedores: TopVendedor[];
  };
  tendencias: {
    previsaoVolume: PrevisaoVolume;
    crescimentoMensal: CrescimentoMensal[];
    metricasEmEvolucao: MetricasEmEvolucao;
  };
  ia: {
    metricas: MetricasIA;
    tiposAtendimento: TiposAtendimentoIA;
    economia: EconomiaIA;
    gaps: GapsBaseConhecimento;
  };
}
