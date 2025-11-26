// ==========================================
// TIPOS PARA O DASHBOARD DO GESTOR
// ==========================================

export interface MetricaCard {
  valor: number | string;
  label: string;
  variacao: number;
  variacaoLabel: string;
  icone: string;
  cor: string;
  acao?: string;
  detalhes?: string;
}

export interface AlertaCritico {
  id: string;
  tipo: 'sla_estourado' | 'cliente_irritado' | 'padrao_detectado' | 'sistema';
  severidade: 'critica' | 'alta' | 'media';
  titulo: string;
  descricao: string;
  tempo: string;
  acoes: {
    label: string;
    tipo: 'primaria' | 'secundaria' | 'terciaria';
    acao: string;
  }[];
  icone: string;
  cor: string;
}

export interface OportunidadeIA {
  id: string;
  tipo: 'upgrade' | 'churn' | 'reengajamento' | 'upsell';
  titulo: string;
  descricao: string;
  quantidade: number;
  valor: number;
  acoes: {
    label: string;
    acao: string;
  }[];
  icone: string;
  cor: string;
}

export interface AtividadeRecente {
  id: string;
  tipo: 'conversa' | 'ticket' | 'venda' | 'cliente' | 'alerta';
  titulo: string;
  subtitulo?: string;
  tempo: string;
  icone: string;
  cor: string;
  acao?: string;
}

export interface DadosGrafico {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    tension?: number;
  }[];
}

export interface TopAtendente {
  id: string;
  nome: string;
  avatar: string;
  atendimentos: number;
  csat: number;
  posicao: number;
}

export interface MetricasDashboard {
  conversasAtivas: number;
  variacaoConversas: number;
  ticketsAbertos: number;
  ticketsUrgentes: number;
  atendentesOnline: number;
  totalAtendentes: number;
  iasAtivas: number;
  tmrHoje: string;
  variacaoTmr: number;
  satisfacaoHoje: number;
  nps: number;
  alertasCriticos: number;
  vendasHoje: number;
  variacaoVendas: number;
  taxaResolucao: number;
  variacaoTaxaResolucao: number;
}

export interface DistribuicaoCanal {
  canal: string;
  percentual: number;
  cor: string;
}

export interface EvolucaoSentimento {
  dia: string;
  positivo: number;
  neutro: number;
  negativo: number;
}
