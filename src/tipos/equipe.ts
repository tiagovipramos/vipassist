export type TipoMembro = 'humano' | 'ia';
export type CargoMembro = 'admin' | 'gestor' | 'atendente' | 'ia';
export type StatusMembro = 'online' | 'offline' | 'pausado' | 'inativo';

export interface Membro {
  id: string;
  tipo: TipoMembro;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  endereco?: string;
  avatar?: string;
  cargo: CargoMembro;
  setor: string;
  setorId: string;
  status: StatusMembro;
  dataContratacao: string;
  registro?: string;
  tags: string[];
  
  // Estatísticas
  stats: {
    atendimentos: number;
    tmr: string;
    csat: number;
    taxaResolucao: number;
    horasTrabalhadas: number;
    metaBatida: number;
  };
  
  // Status e tempo
  tempoOnline?: string;
  ultimoAcesso?: string;
  
  // Performance
  performance: number;
  
  // Para IAs
  taxaAcerto?: number;
  ativo247?: boolean;
}

export interface Setor {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  supervisor: string;
  supervisorId: string;
  membrosIds: string[];
  iasIds: string[];
  totalMembros: number;
  totalIAs: number;
  volumePercentual: number;
  csat: number;
  ativo: boolean;
  permiteRoteamento: boolean;
  setorPadrao: boolean;
}

export interface PermissaoCategoria {
  categoria: string;
  icone: string;
  permissoes: {
    id: string;
    nome: string;
    descricao: string;
    ativo: boolean;
  }[];
}

export interface FuncaoPermissoes {
  id: string;
  nome: string;
  icone: string;
  totalUsuarios: number;
  descricao: string;
  permissoes: PermissaoCategoria[];
  permissoesCustomizadas: {
    id: string;
    nome: string;
    ativo: boolean;
  }[];
}

export interface AtividadeMembro {
  id: string;
  membroId: string;
  tipo: 'login' | 'logout' | 'atendimento' | 'ticket' | 'edicao' | 'relatorio' | 'promocao';
  descricao: string;
  data: string;
  hora: string;
  detalhes?: string;
}

export interface ConfiguracoesEquipe {
  seguranca: {
    obrigar2FA: boolean;
    expirarSessao: boolean;
    tempoExpiracao: number;
    limitarLoginSimultaneo: boolean;
    maxDispositivos: number;
    restricaoIP: boolean;
    logAuditoria: boolean;
    complexidadeSenha: 'baixa' | 'media' | 'alta';
  };
  onboarding: {
    emailBoasVindas: boolean;
    trocarSenhaLogin: boolean;
    tutorialInterativo: boolean;
    atribuirMentor: boolean;
  };
  monitoramento: {
    rastrearAtividade: boolean;
    monitorarPausas: boolean;
    tempoMinutosInatividade: number;
    capturarScreenshots: boolean;
    alertarSupervisor: boolean;
    tempoOfflineAlerta: number;
  };
  metas: {
    atendimentosDiario: number;
    csatMinimo: number;
    taxaResolucaoMinima: number;
    tmrMaximo: number;
    relatorioSemanal: boolean;
    rankingPublico: boolean;
    bonusAutomatico: boolean;
  };
}

export interface NovoMembroForm {
  tipo: TipoMembro;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  cargo: CargoMembro;
  setorId: string;
  dataContratacao: string;
  tags: string[];
  senha?: string;
  enviarEmail: boolean;
  forcarTrocaSenha: boolean;
}

export interface EstatisticasEquipe {
  totalMembros: number;
  totalHumanos: number;
  totalIAs: number;
  onlineAgora: number;
  percentualOnline: number;
  cargos: {
    admins: number;
    gestores: number;
    atendentes: number;
  };
  novosMes: number;
  variacao: 'aumento' | 'reducao' | 'neutro';
}
