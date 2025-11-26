// Tipos para IA & Automações

export interface StatusGeralIA {
  agentesAtivos: number;
  agentesTotal: number;
  taxaAcerto: number;
  taxaAcertoVariacao: number;
  taxaEscalacao: number;
  taxaEscalacaoVariacao: number;
  automacoesAtivas: number;
  automacoesTotal: number;
  economia: number;
  tempoMedioResposta: number;
  csatIA: number;
  csatIAVariacao: number;
  artigosBase: number;
  artigosNovos: number;
}

export interface SaudeIA {
  pontuacaoGeral: number;
  performance: number;
  coberturaTópicos: number;
  satisfacao: number;
  taxaEscalacao: number;
  confiancaMedia: number;
  recomendacoes: string[];
}

export interface AtividadeRecente {
  id: string;
  tipo: 'resolucao' | 'escalacao' | 'falha' | 'treinamento';
  timestamp: Date;
  agente: string;
  descricao: string;
  cliente?: string;
  confianca?: number;
  satisfacao?: number;
  motivo?: string;
  atribuidoPara?: string;
  detalhes?: string;
}

export interface GapDetectado {
  id: string;
  prioridade: 'critico' | 'medio' | 'baixo';
  topico: string;
  quantidadePerguntas: number;
  taxaEscalacao: number;
  periodo: string;
}

export interface AgenteIA {
  id: string;
  nome: string;
  setor: string;
  tipo: string;
  status: 'ativo' | 'pausado' | 'inativo';
  performance: number;
  atendimentosMes: number;
  taxaEscalacao: number;
  csat: number;
  cor: string;
}

export interface ConfiguracaoAgente {
  id: string;
  nome: string;
  descricao: string;
  setor: string;
  idioma: string;
  statusAtivacao: 'sempre' | 'comercial' | 'pausado';
  ativarQuando: {
    novosClientes: boolean;
    foraExpediente: boolean;
    atendentesOcupados: boolean;
    priorizarIA: boolean;
  };
  personalidade: {
    tom: 'profissional' | 'formal' | 'casual' | 'personalizado';
    empatia: number;
    formalidade: number;
    entusiasmo: number;
    concisao: number;
    emojis: number;
  };
  frases: {
    saudacao: string;
    clienteIrritado: string;
    transferencia: string;
    despedida: string;
  };
  comportamento: {
    confiancaMinima: number;
    maxMensagens: number;
    escalarQuando: {
      palavrasChave: boolean;
      sentimentoNegativo: boolean;
      foraDaBase: boolean;
      clienteVIP: boolean;
      palavrasLegais: boolean;
      conversaLonga: boolean;
      semResposta: boolean;
    };
    palavrasChaveEscalacao: string[];
    permissoes: {
      buscarBase: boolean;
      consultarPedidos: boolean;
      agendarCallbacks: boolean;
      coletarFeedback: boolean;
      oferecerDescontos: boolean;
      cancelarPedidos: boolean;
      processarReembolsos: boolean;
    };
    fontesConhecimento: {
      baseInterna: boolean;
      faqs: boolean;
      conversasAnteriores: boolean;
      documentacao: boolean;
      apiExterna: boolean;
    };
  };
  integracoes: {
    sistemaPedidos: boolean;
    sistemaEstoque: boolean;
    sistemaFinanceiro: boolean;
    calendario: boolean;
  };
  acoesAutomatizadas: {
    posResolucao: {
      solicitarAvaliacao: boolean;
      perguntarMaisAlguma: boolean;
      criarTicket: boolean;
    };
    posEscalacao: {
      enviarResumo: boolean;
      marcarTag: boolean;
      notificarSupervisor: boolean;
    };
  };
}

export interface Automacao {
  id: string;
  nome: string;
  categoria: 'mensagens' | 'tickets' | 'crm' | 'notificacoes' | 'workflow';
  status: 'ativa' | 'pausada';
  criadaEm: Date;
  gatilho: string;
  acao: string;
  execucoesMes: number;
  taxaSucesso?: number;
  taxaResposta?: number;
  observacao?: string;
}

export interface ArtigoBase {
  id: string;
  titulo: string;
  categoria: string;
  atualizadoEm: Date;
  acessos: number;
  usosIA: number;
  resolutividade: number;
  feedback: number;
  avaliacoes: number;
  preview: string;
  precisaAtualizacao?: boolean;
  motivoAtualizacao?: string;
}

export interface ConversaTreinamento {
  id: string;
  titulo: string;
  data: Date;
  agente: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
  escalada: boolean;
  conversa: {
    cliente: string;
    ia: string;
  }[];
  resultado: string;
  csat?: number;
  confianciaIA: number;
  sugestaoIA?: string;
}

export interface AnalyticsIA {
  evolucaoPerformance: {
    labels: string[];
    taxaAcerto: number[];
    taxaEscalacao: number[];
  };
  resolucaoPorAgente: {
    agente: string;
    taxa: number;
  }[];
  roi: {
    economiaMes: number;
    custoIA: number;
    roi: number;
    atendimentosIA: number;
    custoHumano: number;
  };
  artigosMaisUsados: {
    titulo: string;
    usos: number;
  }[];
  automacoesExecutadas: {
    nome: string;
    execucoes: number;
  }[];
}

export interface ConfiguracoesGerais {
  modeloIA: 'sonnet' | 'opus';
  confiancaMinima: number;
  temperatura: number;
  maxTokens: number;
  permitirEmojis: boolean;
  permitirPerguntas: boolean;
  permitirOfertas: boolean;
  logs: {
    registrarDecisoes: boolean;
    salvarConversas: boolean;
    monitorarTempo: boolean;
    retencaoDias: number;
  };
  seguranca: {
    naoCompartilharSensiveis: boolean;
    naoFazerPromessas: boolean;
    revisarPalavrasChave: boolean;
    palavrasBloqueadas: string[];
  };
  custos: {
    custoPorAtendimento: number;
    gastoMes: number;
    limiteMensal: number;
    alertar80: boolean;
    pausarSeEstourar: boolean;
  };
}
