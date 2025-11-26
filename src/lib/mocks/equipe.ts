import {
  Membro,
  Setor,
  FuncaoPermissoes,
  AtividadeMembro,
  ConfiguracoesEquipe,
  EstatisticasEquipe,
} from '@/tipos/equipe';

export const membrosMockados: Membro[] = [
  {
    id: 'm1',
    tipo: 'humano',
    nome: 'Maria Silva',
    email: 'maria.silva@kortex.com',
    telefone: '+55 85 99999-1234',
    cpf: '123.456.789-00',
    dataNascimento: '15/05/1990',
    endereco: 'Fortaleza, CE',
    avatar: 'https://i.pravatar.cc/150?img=1',
    cargo: 'admin',
    setor: 'Suporte',
    setorId: 'setor1',
    status: 'online',
    dataContratacao: '15/03/2024',
    registro: 'EMP-00234',
    tags: ['lider', 'senior', 'top-performer'],
    stats: {
      atendimentos: 187,
      tmr: '1min 45s',
      csat: 4.9,
      taxaResolucao: 96,
      horasTrabalhadas: 176,
      metaBatida: 156,
    },
    tempoOnline: 'há 2h',
    performance: 98,
  },
  {
    id: 'm2',
    tipo: 'humano',
    nome: 'João Santos',
    email: 'joao.santos@kortex.com',
    telefone: '+55 85 98888-5678',
    cpf: '987.654.321-00',
    avatar: 'https://i.pravatar.cc/150?img=13',
    cargo: 'atendente',
    setor: 'Vendas',
    setorId: 'setor2',
    status: 'online',
    dataContratacao: '10/06/2024',
    tags: ['pleno'],
    stats: {
      atendimentos: 165,
      tmr: '2min 10s',
      csat: 4.5,
      taxaResolucao: 85,
      horasTrabalhadas: 180,
      metaBatida: 110,
    },
    tempoOnline: 'há 45m',
    performance: 85,
  },
];

export const setoresMockados: Setor[] = [
  {
    id: 'setor1',
    nome: 'Suporte',
    descricao: 'Atendimento e suporte técnico aos clientes',
    cor: '#3b82f6',
    supervisor: 'Maria Silva',
    supervisorId: 'm1',
    membrosIds: ['m1'],
    iasIds: [],
    totalMembros: 1,
    totalIAs: 0,
    volumePercentual: 45,
    csat: 4.7,
    ativo: true,
    permiteRoteamento: true,
    setorPadrao: false,
  },
];

export const funcoesPermissoesMockadas: FuncaoPermissoes[] = [
  {
    id: 'func-admin',
    nome: 'Admin',
    icone: '👑',
    totalUsuarios: 3,
    descricao: 'Acesso total ao sistema',
    permissoes: [
      {
        categoria: 'Todas',
        icone: '🌟',
        permissoes: [
          { id: 'all', nome: 'Acesso Total ao Sistema', descricao: '', ativo: true },
        ],
      },
    ],
    permissoesCustomizadas: [],
  },
  {
    id: 'func-atendente',
    nome: 'Atendente',
    icone: '👤',
    descricao: 'Atendimento básico e gestão de tickets próprios',
    totalUsuarios: 10,
    permissoes: [
      {
        categoria: 'Painel',
        icone: '📊',
        permissoes: [
          { id: 'painel-ver', nome: 'Visualizar painel completo', descricao: '', ativo: false },
          { id: 'painel-metricas-proprias', nome: 'Ver apenas métricas próprias', descricao: '', ativo: true },
        ],
      },
      {
        categoria: 'Conversas',
        icone: '💬',
        permissoes: [
          { id: 'conversas-atender', nome: 'Atender conversas', descricao: '', ativo: true },
          { id: 'conversas-transferir', nome: 'Transferir conversas', descricao: '', ativo: true },
        ],
      },
    ],
    permissoesCustomizadas: [],
  },
];

export const atividadesMembrosMockadas: AtividadeMembro[] = [
  {
    id: 'ativ-1',
    membroId: 'm1',
    tipo: 'login',
    descricao: 'Login no sistema',
    data: 'Hoje',
    hora: '08:00',
  },
];

export const configuracoesEquipeMockadas: ConfiguracoesEquipe = {
  seguranca: {
    obrigar2FA: true,
    expirarSessao: true,
    tempoExpiracao: 12,
    limitarLoginSimultaneo: true,
    maxDispositivos: 2,
    restricaoIP: false,
    logAuditoria: true,
    complexidadeSenha: 'alta',
  },
  onboarding: {
    emailBoasVindas: true,
    trocarSenhaLogin: true,
    tutorialInterativo: true,
    atribuirMentor: true,
  },
  monitoramento: {
    rastrearAtividade: true,
    monitorarPausas: true,
    tempoMinutosInatividade: 15,
    capturarScreenshots: false,
    alertarSupervisor: true,
    tempoOfflineAlerta: 30,
  },
  metas: {
    atendimentosDiario: 30,
    csatMinimo: 4.0,
    taxaResolucaoMinima: 85,
    tmrMaximo: 5,
    relatorioSemanal: true,
    rankingPublico: true,
    bonusAutomatico: false,
  },
};

export const estatisticasEquipeMockadas: EstatisticasEquipe = {
  totalMembros: 15,
  totalHumanos: 12,
  totalIAs: 3,
  onlineAgora: 8,
  percentualOnline: 53,
  cargos: {
    admins: 3,
    gestores: 2,
    atendentes: 10,
  },
  novosMes: 2,
  variacao: 'aumento',
};
