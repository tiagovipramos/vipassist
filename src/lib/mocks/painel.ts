import {
  MetricasDashboard,
  AlertaCritico,
  OportunidadeIA,
  AtividadeRecente,
  TopAtendente,
  DistribuicaoCanal,
  EvolucaoSentimento,
} from '@/tipos/dashboard';

export const metricasDashboardMockadas: MetricasDashboard = {
  conversasAtivas: 12,
  variacaoConversas: 3,
  ticketsAbertos: 47,
  ticketsUrgentes: 5,
  atendentesOnline: 8,
  totalAtendentes: 12,
  iasAtivas: 2,
  tmrHoje: '2min 34s',
  variacaoTmr: -15,
  satisfacaoHoje: 4.7,
  nps: 72,
  alertasCriticos: 3,
  vendasHoje: 2450,
  variacaoVendas: 12,
  taxaResolucao: 94,
  variacaoTaxaResolucao: 3,
};

export const alertasCriticosMockados: AlertaCritico[] = [
  {
    id: 'alert-d1',
    tipo: 'sla_estourado',
    severidade: 'critica',
    titulo: 'SLA ESTOURADO',
    descricao: 'Ticket #1238 - Cliente VIP Ana Costa sem resposta há 6h',
    tempo: 'há 25min',
    acoes: [
      { label: 'INTERVIR AGORA', tipo: 'primaria', acao: 'intervir' },
      { label: 'ATRIBUIR', tipo: 'secundaria', acao: 'atribuir' },
      { label: 'VER TICKET', tipo: 'terciaria', acao: 'ver' },
    ],
    icone: '🔴',
    cor: 'red',
  },
  {
    id: 'alert-d2',
    tipo: 'cliente_irritado',
    severidade: 'critica',
    titulo: 'CLIENTE MUITO IRRITADO',
    descricao: 'Carlos Silva está em atendimento com Maria - Sentimento 10% negativo',
    tempo: 'agora mesmo',
    acoes: [
      { label: 'OUVIR CONVERSA', tipo: 'primaria', acao: 'ouvir' },
      { label: 'ENVIAR ORIENTAÇÃO', tipo: 'secundaria', acao: 'orientar' },
      { label: 'ASSUMIR', tipo: 'terciaria', acao: 'assumir' },
    ],
    icone: '😠',
    cor: 'orange',
  },
  {
    id: 'alert-d3',
    tipo: 'padrao_detectado',
    severidade: 'alta',
    titulo: 'PADRÃO DETECTADO',
    descricao: '5 tickets sobre "bug no checkout" - Possível problema sistêmico',
    tempo: 'há 2h',
    acoes: [
      { label: 'INVESTIGAR', tipo: 'primaria', acao: 'investigar' },
      { label: 'NOTIFICAR TI', tipo: 'secundaria', acao: 'notificar' },
      { label: 'VER TICKETS', tipo: 'terciaria', acao: 'ver' },
    ],
    icone: '⚠️',
    cor: 'yellow',
  },
];

export const oportunidadesIAMockadas: OportunidadeIA[] = [
  {
    id: 'op-1',
    tipo: 'upgrade',
    titulo: '34 CLIENTES PRONTOS PARA UPGRADE',
    descricao: 'Clientes com alto engajamento no plano básico',
    quantidade: 34,
    valor: 12800,
    acoes: [
      { label: 'CRIAR CAMPANHA', acao: 'campanha' },
      { label: 'VER LISTA', acao: 'lista' },
    ],
    icone: '💰',
    cor: 'green',
  },
  {
    id: 'op-2',
    tipo: 'churn',
    titulo: '15 CLIENTES EM RISCO DE CHURN',
    descricao: 'Sem compra há >30 dias + queda no sentimento',
    quantidade: 15,
    valor: 8500,
    acoes: [
      { label: 'CRIAR CAMPANHA DE RETENÇÃO', acao: 'retencao' },
      { label: 'VER LISTA', acao: 'lista' },
    ],
    icone: '🎯',
    cor: 'red',
  },
  {
    id: 'op-3',
    tipo: 'reengajamento',
    titulo: '23 CLIENTES VIP SEM CONTATO HÁ 15+ DIAS',
    descricao: 'Oportunidade de fortalecer relacionamento',
    quantidade: 23,
    valor: 0,
    acoes: [
      { label: 'ENVIAR MENSAGEM PERSONALIZADA', acao: 'mensagem' },
      { label: 'VER LISTA', acao: 'lista' },
    ],
    icone: '🔥',
    cor: 'purple',
  },
];

export const atividadesRecentesMockadas: AtividadeRecente[] = [
  {
    id: 'ativ-1',
    tipo: 'conversa',
    titulo: 'Nova conversa iniciada com Pedro Rocha no WhatsApp',
    subtitulo: 'Atribuída para: João Santos',
    tempo: 'há 2 min',
    icone: '💬',
    cor: 'blue',
    acao: 'ver_conversa',
  },
  {
    id: 'ativ-2',
    tipo: 'ticket',
    titulo: 'Ticket #1245 resolvido por Maria Silva',
    subtitulo: 'Cliente avaliou: ⭐⭐⭐⭐⭐ "Excelente atendimento!"',
    tempo: 'há 5 min',
    icone: '✅',
    cor: 'green',
    acao: 'ver_ticket',
  },
  {
    id: 'ativ-3',
    tipo: 'venda',
    titulo: 'Nova venda: R$ 350,00 - Maria Silva (WhatsApp)',
    subtitulo: 'Produto X vendido via chat',
    tempo: 'há 8 min',
    icone: '🛒',
    cor: 'orange',
    acao: 'ver_detalhes',
  },
  {
    id: 'ativ-4',
    tipo: 'cliente',
    titulo: 'Novo cliente cadastrado: Julia Mendes (Instagram)',
    tempo: 'há 15 min',
    icone: '👤',
    cor: 'purple',
    acao: 'ver_perfil',
  },
  {
    id: 'ativ-5',
    tipo: 'alerta',
    titulo: 'Cliente Ana Costa classificado como "Em Risco" pela IA',
    subtitulo: 'Recomendação: Contato proativo',
    tempo: 'há 23 min',
    icone: '⚠️',
    cor: 'red',
    acao: 'tomar_acao',
  },
];

export const topAtendentesMockados: TopAtendente[] = [
  {
    id: 'a1',
    nome: 'Maria Silva',
    avatar: 'https://i.pravatar.cc/150?img=1',
    atendimentos: 87,
    csat: 4.9,
    posicao: 1,
  },
  {
    id: 'a2',
    nome: 'João Santos',
    avatar: 'https://i.pravatar.cc/150?img=13',
    atendimentos: 76,
    csat: 4.7,
    posicao: 2,
  },
  {
    id: 'a3',
    nome: 'Ana Costa',
    avatar: 'https://i.pravatar.cc/150?img=5',
    atendimentos: 65,
    csat: 4.8,
    posicao: 3,
  },
];

export const distribuicaoCanaisMockada: DistribuicaoCanal[] = [
  { canal: 'WhatsApp', percentual: 65, cor: '#25D366' },
  { canal: 'Instagram', percentual: 20, cor: '#E4405F' },
  { canal: 'Chat Web', percentual: 10, cor: '#3b82f6' },
  { canal: 'Email', percentual: 5, cor: '#6366f1' },
];

export const evolucaoSentimentoMockada: EvolucaoSentimento[] = [
  { dia: 'Seg', positivo: 65, neutro: 28, negativo: 7 },
  { dia: 'Ter', positivo: 68, neutro: 25, negativo: 7 },
  { dia: 'Qua', positivo: 62, neutro: 30, negativo: 8 },
  { dia: 'Qui', positivo: 70, neutro: 24, negativo: 6 },
  { dia: 'Sex', positivo: 72, neutro: 23, negativo: 5 },
  { dia: 'Sáb', positivo: 75, neutro: 20, negativo: 5 },
  { dia: 'Dom', positivo: 70, neutro: 25, negativo: 5 },
];

export const volumeAtendimentos24hMockado = {
  labels: ['00h', '02h', '04h', '06h', '08h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'],
  datasets: [
    {
      label: 'Atendimentos',
      data: [3, 2, 1, 5, 12, 25, 35, 45, 42, 30, 18, 8],
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      tension: 0.4,
    },
  ],
};

export const estatisticasDashboard = metricasDashboardMockadas;
