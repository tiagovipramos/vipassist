import {
  DadosRelatorios,
  RelatorioPersonalizado,
} from '@/tipos/relatorios';

export const dadosRelatoriosMockados: DadosRelatorios = {
  visaoGeral: { 
    metricas: {
      atendimentos: { total: 1234, variacao: 15 },
      tmr: { valor: '2min 45s', segundos: 165, variacao: -30 },
      csat: { valor: 4.6, variacao: 0.3 },
      taxaResolucao: { valor: 92, variacao: 4 },
      tickets: { total: 456, abertos: 78 },
      clientesAtivos: { total: 890, variacao: 23 },
      receita: { valor: 45678, variacao: 12 },
      churn: { valor: 3.2, variacao: -0.8 },
    },
    evolucaoAtendimentos: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      periodoAtual: [250, 180, 175, 200, 230, 120, 79],
      periodoAnterior: [210, 165, 160, 180, 200, 110, 70],
      insight: 'Volume cresceu 15% este período',
    },
    distribuicaoCanais: [],
    heatmapHorario: [],
    principaisAssuntos: [],
    distribuicaoSentimento: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      positivo: [65, 68, 62, 70, 72, 75, 70],
      neutro: [28, 25, 30, 24, 23, 20, 25],
      negativo: [7, 7, 8, 6, 5, 5, 5],
    },
  },
  atendimento: { 
    metricas: {
      tmr: { valor: '2min 45s', segundos: 165, meta: 300, status: 'excelente' },
      tma: { valor: '8min 30s', minutos: 8.5, meta: 15, status: 'excelente' },
      primeiraResposta: { valor: '45s', segundos: 45, meta: 120, status: 'excelente' },
      taxaEscalonamento: { valor: 12, meta: 20, status: 'excelente' },
    },
    funil: [],
    volumeDiaSemana: [],
    tempoResolucaoTipo: [],
    analiseTickets: {
      total: 456,
      abertos: 78,
      emAndamento: 134,
      resolvidos: 244,
      slaEstourado: 12,
      percentualSLA: 2.6,
    },
    ticketsPrioridade: [],
  },
  equipe: { 
    metricas: {
      totalAtendentes: 12,
      tmrMedio: '2min 45s',
      csatMedio: 4.6,
      resolucaoMedia: 92,
    },
    ranking: [],
    comparacaoHumanosIA: {
      humanos: {
        total: 8,
        volumePercentual: 63,
        tmr: '2min 30s',
        csat: 4.7,
        resolucao: 93,
        custoAtendimento: 8.50,
      },
      ias: {
        total: 4,
        volumePercentual: 37,
        tmr: '0.8s',
        csat: 4.5,
        resolucao: 82,
        custoAtendimento: 0.15,
      },
      insights: [],
    },
  },
  satisfacao: { 
    metricas: {
      csat: { valor: 4.6, variacao: 0.3 },
      nps: { valor: 72, variacao: 8 },
      taxaResposta: { valor: 87, variacao: 5 },
      promotores: { valor: 78, neutros: 15, detratores: 7 },
    },
    evolucaoCSAT: {
      labels: ['01', '05', '10', '15', '20', '25', '30'],
      valores: [4.3, 4.35, 4.4, 4.45, 4.5, 4.55, 4.6],
      inicio: 4.3,
      fim: 4.6,
      crescimento: 7,
      insight: 'Melhoria consistente',
    },
    distribuicaoNotas: [],
    analiseFeedback: {
      totalComentarios: 487,
      positivos: { total: 385, percentual: 79, palavrasChave: [] },
      neutros: { total: 67, percentual: 14, palavrasChave: [] },
      negativos: { total: 35, percentual: 7, palavrasChave: [] },
    },
    avaliacoesNegativas: {
      total: 166,
      percentual: 18,
      motivos: [],
      acoesCorretivas: [],
    },
  },
  vendas: { 
    metricas: {
      receitaTotal: { valor: 45678, variacao: 12 },
      conversoes: { total: 234, variacao: 28 },
      ticketMedio: { valor: 195, variacao: -12 },
      taxaConversao: { valor: 18.9, variacao: 3.2 },
    },
    receitaPorDia: [],
    topVendedores: [],
  },
  tendencias: { 
    previsaoVolume: {
      labels: [],
      historico: [],
      previsao: [],
      volumePrevisto: 1450,
      crescimentoPercentual: 17,
      confianca: 87,
      alertas: [],
    },
    crescimentoMensal: [],
    metricasEmEvolucao: {
      labels: [],
      csat: [],
      tmr: [],
      resolucao: [],
      churn: [],
      insights: [],
    },
  },
  ia: { 
    metricas: {
      atendimentosIA: { total: 456, percentualTotal: 37 },
      resolvidosIA: { total: 374, percentual: 82, variacao: 5 },
      escaladosHumano: { total: 82, percentual: 18, variacao: -3 },
      tempoMedio: { valor: '0.8s', segundos: 0.8 },
    },
    tiposAtendimento: {
      resolvidoCompleto: { total: 374, percentual: 82, categorias: [] },
      escalado: { total: 82, percentual: 18, motivos: [] },
    },
    economia: {
      custoHumano: 8.50,
      custoIA: 0.15,
      economiaPorAtendimento: 8.35,
      economiaTotal: 3807.60,
      roi: 4580,
    },
    gaps: {
      total: 19,
      top5: [],
    },
  },
};

export const relatoriosPersonalizadosMockados: RelatorioPersonalizado[] = [];
