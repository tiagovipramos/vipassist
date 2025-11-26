// ====================================
// DADOS MOCKADOS: CAMPANHAS EM MASSA
// ====================================

import { 
  Campanha, 
  ResumoCampanhas, 
  EngajamentoCanal, 
  TopCampanha,
  AtividadeRecente,
  Alerta
} from '@/tipos/campanhas';

// ==================== RESUMO ====================
export const resumoCampanhas: ResumoCampanhas = {
  periodo: 'Últimos 30 dias',
  campanhasAtivas: 3,
  mensagensEnviadas: 12456,
  taxaEntrega: 98.5,
  taxaAbertura: 65.3,
  taxaResposta: 12.4,
  taxaConversao: 3.2,
  receitaGerada: 45890,
  custoPorEnvio: 0.15,
  tendencias: {
    campanhasAtivas: 1,
    mensagensEnviadas: 23,
    taxaEntrega: 0,
    taxaAbertura: 8,
    taxaResposta: 2,
    taxaConversao: 0.8,
    receitaGerada: 12450
  }
};

// ==================== ENGAJAMENTO POR CANAL ====================
export const engajamentoCanais: EngajamentoCanal[] = [
  {
    canal: 'whatsapp',
    envios: 8234,
    taxaAbertura: 78.5,
    taxaResposta: 15.2,
    taxaConversao: 4.1
  },
  {
    canal: 'email',
    envios: 3122,
    taxaAbertura: 45.8,
    taxaResposta: 8.3,
    taxaConversao: 1.9
  },
  {
    canal: 'sms',
    envios: 1100,
    taxaAbertura: 92.1,
    taxaResposta: 5.6,
    taxaConversao: 2.3
  }
];

// ==================== TOP 5 CAMPANHAS ====================
export const topCampanhas: TopCampanha[] = [
  {
    id: '1',
    nome: 'Black Friday 2024',
    conversao: 8.2,
    roi: 450,
    receita: 28500
  },
  {
    id: '2',
    nome: 'Lançamento Produto Premium',
    conversao: 6.7,
    roi: 380,
    receita: 19200
  },
  {
    id: '3',
    nome: 'Recuperação Carrinho Abandonado',
    conversao: 5.4,
    roi: 320,
    receita: 15600
  },
  {
    id: '4',
    nome: 'Promoção Dia das Mães',
    conversao: 4.8,
    roi: 290,
    receita: 12800
  },
  {
    id: '5',
    nome: 'Newsletter Mensal - Junho',
    conversao: 3.1,
    roi: 210,
    receita: 8900
  }
];

// ==================== ALERTAS ====================
export const alertas: Alerta[] = [
  {
    id: '1',
    tipo: 'warning',
    mensagem: 'campanhas aguardando revisão',
    quantidade: 2,
    acao: 'Revisar'
  },
  {
    id: '2',
    tipo: 'info',
    mensagem: 'respostas de clientes não lidas',
    quantidade: 47,
    acao: 'Ver Respostas'
  },
  {
    id: '3',
    tipo: 'error',
    mensagem: 'campanhas pausadas por erro',
    quantidade: 1,
    acao: 'Resolver'
  }
];

// ==================== ATIVIDADES RECENTES ====================
export const atividadesRecentes: AtividadeRecente[] = [
  {
    id: '1',
    tipo: 'enviada',
    campanhaNome: 'Promoção Fim de Semana',
    data: 'Hoje às 14:30',
    destinatarios: 1234,
    canais: ['whatsapp'],
    metricas: {
      entrega: 98.2,
      abertura: 67.4,
      conversao: 3.8,
      receita: 4200
    }
  },
  {
    id: '2',
    tipo: 'agendada',
    campanhaNome: 'Newsletter Semanal',
    data: 'Amanhã às 09:00',
    destinatarios: 5678,
    canais: ['email']
  },
  {
    id: '3',
    tipo: 'concluida',
    campanhaNome: 'Flash Sale Terça',
    data: 'Ontem às 18:00',
    destinatarios: 892,
    canais: ['whatsapp', 'sms'],
    metricas: {
      entrega: 99.1,
      abertura: 82.3,
      conversao: 5.6,
      receita: 7850
    }
  }
];

// ==================== CAMPANHAS ====================
export const campanhasMockadas: Campanha[] = [
  {
    id: '1',
    nome: 'Promoção Fim de Semana',
    descricao: 'Campanha promocional para aumentar vendas no fim de semana',
    status: 'ativa',
    categoria: 'vendas-promocoes',
    tags: ['promocao', 'vendas', 'fim-de-semana'],
    canais: ['whatsapp'],
    segmento: {
      filtros: [
        {
          id: '1',
          campo: 'ultima_compra',
          operador: 'ultimos-dias',
          valor: 30
        }
      ],
      totalClientes: 1234,
      breakdown: {
        whatsapp: 1234,
        email: 0,
        sms: 0
      },
      excluidos: 23,
      motivosExclusao: 'Opt-out ou bloqueados'
    },
    mensagem: {
      texto: 'Olá {{nome}}! 🎉\n\nAproveitando o fim de semana?\n\nTemos 30% OFF em todos os produtos!\n\nUse: WEEKEND30',
      variaveis: ['nome'],
      botoes: [
        {
          id: '1',
          texto: 'Ver Ofertas',
          tipo: 'url',
          valor: 'https://loja.com/ofertas'
        }
      ]
    },
    agendamento: {
      tipo: 'imediato',
      fusoHorario: 'America/Sao_Paulo',
      taxaEnvio: 'padrao',
      respeitarHorarioComercial: true,
      pularRecentementeContatados: true,
      pararSeErroAlto: true
    },
    metricas: {
      enviadas: 856,
      entregues: 841,
      abertas: 577,
      cliques: 234,
      respostas: 89,
      conversoes: 47,
      receita: 4200,
      taxaEntrega: 98.2,
      taxaAbertura: 67.4,
      taxaClique: 27.3,
      taxaResposta: 10.4,
      taxaConversao: 5.5,
      roi: 340
    },
    criadoEm: '08/11/2025 às 10:30',
    criadoPor: 'Maria Silva',
    iniciadaEm: '08/11/2025 às 14:30',
    tempoEstimado: '45 minutos',
    custoEstimado: 185.10
  },
  {
    id: '2',
    nome: 'Newsletter Semanal',
    status: 'agendada',
    categoria: 'newsletter',
    tags: ['newsletter', 'conteudo'],
    canais: ['email'],
    segmento: {
      filtros: [],
      totalClientes: 5678,
      breakdown: {
        whatsapp: 0,
        email: 5678,
        sms: 0
      },
      excluidos: 145,
      motivosExclusao: 'Descadastrados ou bounces'
    },
    mensagem: {
      texto: 'Confira as novidades desta semana!',
      variaveis: ['nome']
    },
    agendamento: {
      tipo: 'agendado',
      data: '09/11/2025',
      hora: '09:00',
      fusoHorario: 'America/Sao_Paulo',
      taxaEnvio: 'rapido',
      respeitarHorarioComercial: true,
      pularRecentementeContatados: false,
      pararSeErroAlto: true
    },
    metricas: {
      enviadas: 0,
      entregues: 0,
      abertas: 0,
      cliques: 0,
      respostas: 0,
      conversoes: 0,
      receita: 0,
      taxaEntrega: 0,
      taxaAbertura: 0,
      taxaClique: 0,
      taxaResposta: 0,
      taxaConversao: 0,
      roi: 0
    },
    criadoEm: '07/11/2025 às 16:20',
    criadoPor: 'João Santos',
    custoEstimado: 852.00,
    projecoes: {
      taxaEntrega: 96.5,
      taxaAbertura: 42.3,
      taxaConversao: 1.8,
      receitaPotencial: 8900,
      roiEstimado: 180
    }
  },
  {
    id: '3',
    nome: 'Black Friday 2024',
    descricao: 'Mega campanha para Black Friday com ofertas especiais',
    status: 'concluida',
    categoria: 'vendas-promocoes',
    tags: ['black-friday', 'mega-promocao', 'vendas'],
    canais: ['whatsapp', 'email', 'sms'],
    segmento: {
      filtros: [],
      totalClientes: 8945,
      breakdown: {
        whatsapp: 6234,
        email: 7890,
        sms: 3456
      },
      excluidos: 234,
      motivosExclusao: 'Bloqueados ou inativos há mais de 1 ano'
    },
    mensagem: {
      texto: '🔥 BLACK FRIDAY CHEGOU!\n\nDescontos de até 70%!\n\nCorra, estoque limitado!',
      variaveis: ['nome'],
      midia: {
        tipo: 'imagem',
        url: 'https://cdn.exemplo.com/blackfriday.jpg',
        nome: 'blackfriday.jpg',
        tamanho: 245000
      },
      botoes: [
        {
          id: '1',
          texto: 'Comprar Agora',
          tipo: 'url',
          valor: 'https://loja.com/blackfriday'
        },
        {
          id: '2',
          texto: 'Falar com Vendedor',
          tipo: 'chat',
          valor: 'Olá! Vi a Black Friday'
        }
      ]
    },
    agendamento: {
      tipo: 'agendado',
      data: '24/11/2024',
      hora: '00:01',
      fusoHorario: 'America/Sao_Paulo',
      taxaEnvio: 'rapido',
      respeitarHorarioComercial: false,
      pularRecentementeContatados: false,
      pararSeErroAlto: true
    },
    metricas: {
      enviadas: 8945,
      entregues: 8801,
      abertas: 7234,
      cliques: 3456,
      respostas: 892,
      conversoes: 734,
      receita: 28500,
      taxaEntrega: 98.4,
      taxaAbertura: 80.9,
      taxaClique: 38.6,
      taxaResposta: 10.0,
      taxaConversao: 8.2,
      roi: 450
    },
    criadoEm: '15/11/2024 às 10:00',
    criadoPor: 'Carlos Oliveira',
    iniciadaEm: '24/11/2024 às 00:01',
    finalizadaEm: '24/11/2024 às 23:59',
    custoEstimado: 1341.75
  }
];
