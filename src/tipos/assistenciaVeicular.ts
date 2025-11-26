// ==========================================
// TIPOS PARA SISTEMA DE ASSISTÊNCIA VEICULAR
// ==========================================

export interface MetricasAssistenciaVeicular {
  // Chamados
  chamadosAbertos: number;
  chamadosEmAndamento: number;
  chamadosFinalizados: number;
  chamadosUrgentes: number;
  variacaoChamados: number;
  
  // Tempos
  tempoMedioAtendimento: string; // Ex: "15min"
  tempoMedioChegada: string; // Ex: "32min"
  tempoMedioResolucao: string; // Ex: "1h 45min"
  variacaoTempo: number;
  
  // Prestadores
  prestadoresAtivos: number;
  totalPrestadores: number;
  prestadoresDisponiveis: number;
  taxaOcupacao: number; // Percentual
  
  // Satisfação
  nps: number;
  avaliacaoMedia: number;
  taxaResolucaoPrimeiroAtendimento: number;
  
  // Financeiro
  receitaDia: number;
  receitaMes: number;
  ticketMedio: number;
  variacaoReceita: number;
  
  // Tipos de Serviço
  reboques: number;
  trocaPneu: number;
  chaveiro: number;
  paneEletrica: number;
  paneMotor: number;
  outros: number;
}

export interface ChamadoUrgente {
  id: string;
  protocolo: string;
  tipo: 'reboque' | 'pane' | 'acidente' | 'chaveiro' | 'pneu';
  cliente: {
    nome: string;
    telefone: string;
    plano: string;
  };
  localizacao: {
    endereco: string;
    cidade: string;
    coordenadas?: {
      lat: number;
      lng: number;
    };
  };
  destino?: {
    endereco: string;
    cidade: string;
    coordenadas?: {
      lat: number;
      lng: number;
    };
  };
  status: 'aguardando' | 'em_atendimento' | 'prestador_a_caminho' | 'em_execucao';
  tempoEspera: string;
  prioridade: 'critica' | 'alta' | 'media';
  prestadorDesignado?: {
    nome: string;
    telefone: string;
    distancia: string;
    tempoChegada: string;
  };
  observacoes?: string;
}

export interface PrestadorStatus {
  id: string;
  nome: string;
  tipo: 'reboque' | 'mecanico' | 'chaveiro' | 'multiplo';
  status: 'disponivel' | 'em_atendimento' | 'offline';
  localizacao: {
    cidade: string;
    coordenadas: {
      lat: number;
      lng: number;
    };
  };
  atendimentosHoje: number;
  avaliacaoMedia: number;
  tempoMedioAtendimento: string;
  distanciaProxima?: string;
}

export interface AlertaOperacional {
  id: string;
  tipo: 'sla_risco' | 'sem_prestador' | 'cliente_insatisfeito' | 'atraso' | 'sistema';
  severidade: 'critica' | 'alta' | 'media';
  titulo: string;
  descricao: string;
  chamadoId?: string;
  tempo: string;
  acoes: {
    label: string;
    tipo: 'primaria' | 'secundaria';
    acao: string;
  }[];
}

export interface DistribuicaoServico {
  tipo: string;
  quantidade: number;
  percentual: number;
  cor: string;
  receita: number;
}

export interface PerformancePrestador {
  id: string;
  nome: string;
  avatar?: string;
  atendimentos: number;
  avaliacaoMedia: number;
  tempoMedioAtendimento: string;
  taxaConclusao: number;
  posicao: number;
}

export interface RegiaoAtendimento {
  regiao: string;
  chamados: number;
  tempoMedio: string;
  prestadoresAtivos: number;
  cor: string;
}

export interface HorarioPico {
  hora: string;
  chamados: number;
  tipo: 'pico' | 'normal' | 'baixo';
}

export interface TendenciaSemanal {
  dia: string;
  chamados: number;
  finalizados: number;
  cancelados: number;
}

export interface IndicadorFinanceiro {
  periodo: string;
  receita: number;
  custos: number;
  lucro: number;
  ticketMedio: number;
}

// ==========================================
// TIPOS PARA SISTEMA DE COTAÇÃO DE PRESTADORES
// ==========================================

export interface PrestadorProximo {
  id: string;
  nome: string;
  telefone: string;
  whatsapp: string;
  tipo: 'reboque' | 'mecanico' | 'chaveiro' | 'multiplo';
  especialidades: string[];
  localizacao: {
    endereco: string;
    cidade: string;
    coordenadas: {
      lat: number;
      lng: number;
    };
  };
  distanciaKm: number;
  tempoEstimadoChegada: string;
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  atendimentosRealizados: number;
  disponivel: boolean;
  cotacaoEnviada?: boolean;
  cotacaoRespondida?: boolean;
  valorCotado?: number;
  prazoChegada?: string;
  observacoes?: string;
}

export interface CotacaoPrestador {
  id: string;
  chamadoId: string;
  prestadorId: string;
  prestadorNome: string;
  prestadorTelefone: string;
  valorCotado: number;
  prazoChegada: string;
  observacoes?: string;
  dataEnvio: string;
  dataResposta?: string;
  status: 'aguardando' | 'respondida' | 'aceita' | 'recusada' | 'expirada';
}

export interface DadosCotacao {
  protocolo: string;
  tipoServico: string;
  origem: {
    endereco: string;
    cidade: string;
    coordenadas: {
      lat: number;
      lng: number;
    };
  };
  destino?: {
    endereco: string;
    cidade: string;
    coordenadas: {
      lat: number;
      lng: number;
    };
  };
  distanciaKm?: number;
  clienteNome: string;
  clienteTelefone: string;
  veiculoPlaca: string;
  veiculoMarca?: string;
  veiculoModelo?: string;
  descricaoProblema: string;
  prioridade: 'critica' | 'alta' | 'media';
}
