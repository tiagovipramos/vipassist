import {
  MetricasAssistenciaVeicular,
  ChamadoUrgente,
  PrestadorStatus,
  AlertaOperacional,
  DistribuicaoServico,
  PerformancePrestador,
  RegiaoAtendimento,
  HorarioPico,
  TendenciaSemanal,
  IndicadorFinanceiro,
  PrestadorProximo,
} from '@/tipos/assistenciaVeicular'

// ==========================================
// MÉTRICAS PRINCIPAIS
// ==========================================
export const metricasAssistenciaVeicular: MetricasAssistenciaVeicular = {
  // Chamados
  chamadosAbertos: 23,
  chamadosEmAndamento: 15,
  chamadosFinalizados: 142,
  chamadosUrgentes: 5,
  variacaoChamados: 12,
  
  // Tempos
  tempoMedioAtendimento: '8min',
  tempoMedioChegada: '28min',
  tempoMedioResolucao: '1h 32min',
  variacaoTempo: -8,
  
  // Prestadores
  prestadoresAtivos: 34,
  totalPrestadores: 45,
  prestadoresDisponiveis: 19,
  taxaOcupacao: 75,
  
  // Satisfação
  nps: 82,
  avaliacaoMedia: 4.6,
  taxaResolucaoPrimeiroAtendimento: 89,
  
  // Financeiro
  receitaDia: 45800,
  receitaMes: 892500,
  ticketMedio: 285,
  variacaoReceita: 15,
  
  // Tipos de Serviço
  reboques: 89,
  trocaPneu: 32,
  chaveiro: 18,
  paneEletrica: 15,
  paneMotor: 12,
  outros: 14,
}

// ==========================================
// CHAMADOS URGENTES
// ==========================================
export const chamadosUrgentes: ChamadoUrgente[] = [
  {
    id: '1',
    protocolo: 'CH-2024-001234',
    tipo: 'reboque',
    cliente: {
      nome: 'Maria Silva Santos',
      telefone: '(11) 98765-4321',
      plano: 'Premium - Porto Seguro',
    },
    localizacao: {
      endereco: 'Av. Paulista, 1578 - Bela Vista',
      cidade: 'São Paulo - SP',
      coordenadas: { lat: -23.561684, lng: -46.656139 },
    },
    status: 'prestador_a_caminho',
    tempoEspera: '42min',
    prioridade: 'critica',
    prestadorDesignado: {
      nome: 'Reboque VIP - João',
      telefone: '(11) 99876-5432',
      distancia: '3.2 km',
      tempoChegada: '8min',
    },
    observacoes: 'Cliente gestante, veículo parado em local de risco',
  },
  {
    id: '2',
    protocolo: 'CH-2024-001235',
    tipo: 'acidente',
    cliente: {
      nome: 'João Pedro Oliveira',
      telefone: '(11) 97654-3210',
      plano: 'Básico - Mapfre',
    },
    localizacao: {
      endereco: 'Rod. Anhanguera, Km 23 - Sentido Interior',
      cidade: 'São Paulo - SP',
      coordenadas: { lat: -23.489234, lng: -46.723456 },
    },
    destino: {
      endereco: 'Oficina AutoMaster - Av. Mutinga, 1234',
      cidade: 'São Paulo - SP',
      coordenadas: { lat: -23.523456, lng: -46.756789 },
    },
    status: 'em_execucao',
    tempoEspera: '28min',
    prioridade: 'critica',
    prestadorDesignado: {
      nome: 'Reboque Rápido - Carlos',
      telefone: '(11) 98765-4321',
      distancia: '8.5 km',
      tempoChegada: '15min até destino',
    },
    observacoes: 'Colisão traseira, veículo não liga. Prestador já com o cliente, indo para oficina',
  },
  {
    id: '3',
    protocolo: 'CH-2024-001236',
    tipo: 'pane',
    cliente: {
      nome: 'Ana Carolina Ferreira',
      telefone: '(11) 96543-2109',
      plano: 'Premium - Allianz',
    },
    localizacao: {
      endereco: 'Av. Faria Lima, 3477 - Itaim Bibi',
      cidade: 'São Paulo - SP',
      coordenadas: { lat: -23.587416, lng: -46.685629 },
    },
    status: 'em_atendimento',
    tempoEspera: '15min',
    prioridade: 'alta',
    prestadorDesignado: {
      nome: 'Auto Socorro 24h - Roberto',
      telefone: '(11) 97654-3210',
      distancia: '2.1 km',
      tempoChegada: '5min',
    },
  },
  {
    id: '4',
    protocolo: 'CH-2024-001237',
    tipo: 'chaveiro',
    cliente: {
      nome: 'Ricardo Almeida Costa',
      telefone: '(11) 95432-1098',
      plano: 'Básico - Bradesco Seguros',
    },
    localizacao: {
      endereco: 'Rua Augusta, 2690 - Cerqueira César',
      cidade: 'São Paulo - SP',
      coordenadas: { lat: -23.558899, lng: -46.662644 },
    },
    status: 'prestador_a_caminho',
    tempoEspera: '35min',
    prioridade: 'alta',
    prestadorDesignado: {
      nome: 'Chaveiro Express - Anderson',
      telefone: '(11) 96543-2109',
      distancia: '1.8 km',
      tempoChegada: '6min',
    },
    observacoes: 'Chave trancada dentro do veículo',
  },
  {
    id: '5',
    protocolo: 'CH-2024-001238',
    tipo: 'pneu',
    cliente: {
      nome: 'Fernanda Lima Souza',
      telefone: '(11) 94321-0987',
      plano: 'Premium - SulAmérica',
    },
    localizacao: {
      endereco: 'Av. Rebouças, 3970 - Pinheiros',
      cidade: 'São Paulo - SP',
      coordenadas: { lat: -23.567123, lng: -46.672345 },
    },
    status: 'em_execucao',
    tempoEspera: '8min',
    prioridade: 'media',
    prestadorDesignado: {
      nome: 'Pneu Express - Marcos',
      telefone: '(11) 95432-1098',
      distancia: '0.5 km',
      tempoChegada: 'No local',
    },
  },
]

// ==========================================
// ALERTAS OPERACIONAIS
// ==========================================
export const alertasOperacionais: AlertaOperacional[] = [
  {
    id: '1',
    tipo: 'sla_risco',
    severidade: 'critica',
    titulo: 'SLA em Risco - 3 Chamados',
    descricao: '3 chamados estão próximos de estourar o SLA de atendimento (45min). Ação imediata necessária.',
    tempo: 'Há 5 minutos',
    acoes: [
      { label: 'Ver Chamados', tipo: 'primaria', acao: 'ver_chamados' },
      { label: 'Realocar Prestadores', tipo: 'secundaria', acao: 'realocar' },
    ],
  },
  {
    id: '2',
    tipo: 'sem_prestador',
    severidade: 'critica',
    titulo: 'Região Sem Cobertura',
    descricao: 'Zona Leste de São Paulo está sem prestadores disponíveis. 2 chamados aguardando.',
    chamadoId: 'CH-2024-001234',
    tempo: 'Há 12 minutos',
    acoes: [
      { label: 'Buscar Prestador', tipo: 'primaria', acao: 'buscar_prestador' },
      { label: 'Contatar Cliente', tipo: 'secundaria', acao: 'contatar_cliente' },
    ],
  },
  {
    id: '3',
    tipo: 'cliente_insatisfeito',
    severidade: 'alta',
    titulo: 'Cliente Insatisfeito Detectado',
    descricao: 'Cliente Maria Silva (CH-001234) demonstrou insatisfação no último contato. Tempo de espera: 42min.',
    chamadoId: 'CH-2024-001234',
    tempo: 'Há 8 minutos',
    acoes: [
      { label: 'Priorizar Atendimento', tipo: 'primaria', acao: 'priorizar' },
      { label: 'Ligar para Cliente', tipo: 'secundaria', acao: 'ligar' },
    ],
  },
  {
    id: '4',
    tipo: 'atraso',
    severidade: 'alta',
    titulo: 'Prestador Atrasado',
    descricao: 'Reboque Rápido - Carlos está 15min atrasado para o chamado CH-001235. Cliente aguardando.',
    chamadoId: 'CH-2024-001235',
    tempo: 'Há 3 minutos',
    acoes: [
      { label: 'Contatar Prestador', tipo: 'primaria', acao: 'contatar_prestador' },
      { label: 'Substituir Prestador', tipo: 'secundaria', acao: 'substituir' },
    ],
  },
]

// ==========================================
// PRESTADORES DISPONÍVEIS
// ==========================================
export const prestadoresDisponiveis: PrestadorStatus[] = [
  {
    id: '1',
    nome: 'Auto Socorro 24h - Roberto',
    tipo: 'multiplo',
    status: 'disponivel',
    localizacao: {
      cidade: 'São Paulo - SP',
      coordenadas: { lat: -23.550520, lng: -46.633308 },
    },
    atendimentosHoje: 8,
    avaliacaoMedia: 4.9,
    tempoMedioAtendimento: '22min',
    distanciaProxima: '3.2 km',
  },
  {
    id: '2',
    nome: 'Reboque Rápido - Carlos',
    tipo: 'reboque',
    status: 'em_atendimento',
    localizacao: {
      cidade: 'São Paulo - SP',
      coordenadas: { lat: -23.489234, lng: -46.723456 },
    },
    atendimentosHoje: 12,
    avaliacaoMedia: 4.7,
    tempoMedioAtendimento: '28min',
  },
  {
    id: '3',
    nome: 'Pneu Express - Marcos',
    tipo: 'mecanico',
    status: 'em_atendimento',
    localizacao: {
      cidade: 'São Paulo - SP',
      coordenadas: { lat: -23.567123, lng: -46.672345 },
    },
    atendimentosHoje: 6,
    avaliacaoMedia: 4.8,
    tempoMedioAtendimento: '18min',
  },
  {
    id: '4',
    nome: 'Chaveiro Express - Anderson',
    tipo: 'chaveiro',
    status: 'disponivel',
    localizacao: {
      cidade: 'São Paulo - SP',
      coordenadas: { lat: -23.558899, lng: -46.662644 },
    },
    atendimentosHoje: 5,
    avaliacaoMedia: 4.6,
    tempoMedioAtendimento: '15min',
    distanciaProxima: '1.8 km',
  },
]

// ==========================================
// DISTRIBUIÇÃO DE SERVIÇOS
// ==========================================
export const distribuicaoServicos: DistribuicaoServico[] = [
  {
    tipo: 'Reboque',
    quantidade: 89,
    percentual: 49.4,
    cor: '#3b82f6',
    receita: 25350,
  },
  {
    tipo: 'Troca de Pneu',
    quantidade: 32,
    percentual: 17.8,
    cor: '#10b981',
    receita: 6400,
  },
  {
    tipo: 'Chaveiro',
    quantidade: 18,
    percentual: 10.0,
    cor: '#f59e0b',
    receita: 3600,
  },
  {
    tipo: 'Pane Elétrica',
    quantidade: 15,
    percentual: 8.3,
    cor: '#8b5cf6',
    receita: 4500,
  },
  {
    tipo: 'Pane Motor',
    quantidade: 12,
    percentual: 6.7,
    cor: '#ef4444',
    receita: 4800,
  },
  {
    tipo: 'Outros',
    quantidade: 14,
    percentual: 7.8,
    cor: '#6b7280',
    receita: 3500,
  },
]

// ==========================================
// PERFORMANCE DOS PRESTADORES
// ==========================================
export const topPrestadores: PerformancePrestador[] = [
  {
    id: '1',
    nome: 'Reboque Rápido - Carlos',
    avatar: '/avatars/prestador1.jpg',
    atendimentos: 156,
    avaliacaoMedia: 4.9,
    tempoMedioAtendimento: '24min',
    taxaConclusao: 98,
    posicao: 1,
  },
  {
    id: '2',
    nome: 'Auto Socorro 24h - Roberto',
    avatar: '/avatars/prestador2.jpg',
    atendimentos: 142,
    avaliacaoMedia: 4.8,
    tempoMedioAtendimento: '26min',
    taxaConclusao: 96,
    posicao: 2,
  },
  {
    id: '3',
    nome: 'Pneu Express - Marcos',
    avatar: '/avatars/prestador3.jpg',
    atendimentos: 128,
    avaliacaoMedia: 4.7,
    tempoMedioAtendimento: '18min',
    taxaConclusao: 97,
    posicao: 3,
  },
]

// ==========================================
// REGIÕES DE ATENDIMENTO
// ==========================================
export const regioesAtendimento: RegiaoAtendimento[] = [
  {
    regiao: 'Centro',
    chamados: 45,
    tempoMedio: '22min',
    prestadoresAtivos: 12,
    cor: '#3b82f6',
  },
  {
    regiao: 'Zona Sul',
    chamados: 38,
    tempoMedio: '28min',
    prestadoresAtivos: 9,
    cor: '#10b981',
  },
  {
    regiao: 'Zona Oeste',
    chamados: 32,
    tempoMedio: '25min',
    prestadoresAtivos: 8,
    cor: '#f59e0b',
  },
  {
    regiao: 'Zona Norte',
    chamados: 28,
    tempoMedio: '32min',
    prestadoresAtivos: 5,
    cor: '#8b5cf6',
  },
  {
    regiao: 'Zona Leste',
    chamados: 22,
    tempoMedio: '38min',
    prestadoresAtivos: 3,
    cor: '#ef4444',
  },
]

// ==========================================
// HORÁRIOS DE PICO
// ==========================================
export const horariosPico: HorarioPico[] = [
  { hora: '00h', chamados: 3, tipo: 'baixo' },
  { hora: '02h', chamados: 2, tipo: 'baixo' },
  { hora: '04h', chamados: 1, tipo: 'baixo' },
  { hora: '06h', chamados: 8, tipo: 'normal' },
  { hora: '08h', chamados: 18, tipo: 'pico' },
  { hora: '10h', chamados: 12, tipo: 'normal' },
  { hora: '12h', chamados: 15, tipo: 'normal' },
  { hora: '14h', chamados: 10, tipo: 'normal' },
  { hora: '16h', chamados: 14, tipo: 'normal' },
  { hora: '18h', chamados: 22, tipo: 'pico' },
  { hora: '20h', chamados: 16, tipo: 'normal' },
  { hora: '22h', chamados: 9, tipo: 'normal' },
]

// ==========================================
// TENDÊNCIA SEMANAL
// ==========================================
export const tendenciaSemanal: TendenciaSemanal[] = [
  { dia: 'Seg', chamados: 142, finalizados: 138, cancelados: 4 },
  { dia: 'Ter', chamados: 156, finalizados: 151, cancelados: 5 },
  { dia: 'Qua', chamados: 148, finalizados: 145, cancelados: 3 },
  { dia: 'Qui', chamados: 165, finalizados: 160, cancelados: 5 },
  { dia: 'Sex', chamados: 178, finalizados: 172, cancelados: 6 },
  { dia: 'Sáb', chamados: 134, finalizados: 131, cancelados: 3 },
  { dia: 'Dom', chamados: 98, finalizados: 96, cancelados: 2 },
]

// ==========================================
// INDICADORES FINANCEIROS
// ==========================================
export const indicadoresFinanceiros: IndicadorFinanceiro[] = [
  {
    periodo: 'Hoje',
    receita: 45800,
    custos: 32060,
    lucro: 13740,
    ticketMedio: 285,
  },
  {
    periodo: 'Esta Semana',
    receita: 312500,
    custos: 218750,
    lucro: 93750,
    ticketMedio: 278,
  },
  {
    periodo: 'Este Mês',
    receita: 892500,
    custos: 624750,
    lucro: 267750,
    ticketMedio: 282,
  },
]

// ==========================================
// PRESTADORES PRÓXIMOS (PARA COTAÇÃO)
// ==========================================
// DADOS MOCKADOS REMOVIDOS - Agora usando API real
// Os prestadores são buscados da API em /api/prestadores
// O componente ModalSelecaoPrestadores agora busca prestadores reais
export const prestadoresProximos: PrestadorProximo[] = []
