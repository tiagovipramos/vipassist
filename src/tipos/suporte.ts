// Tipos para o sistema de suporte

export type StatusTicket = 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';
export type PrioridadeTicket = 'baixa' | 'media' | 'alta';
export type CategoriaTicket = 
  | 'problema_tecnico' 
  | 'duvida_funcionalidade' 
  | 'solicitacao_feature' 
  | 'problema_faturamento' 
  | 'outro';

export interface MensagemTicket {
  id: string;
  remetente: {
    nome: string;
    tipo: 'usuario' | 'suporte' | 'bot';
    avatar?: string;
  };
  mensagem: string;
  dataHora: string;
  anexos?: {
    nome: string;
    tamanho: string;
    url: string;
  }[];
}

export interface Ticket {
  id: string;
  numero: string;
  assunto: string;
  categoria: CategoriaTicket;
  status: StatusTicket;
  prioridade: PrioridadeTicket;
  criado: string;
  atualizado: string;
  atribuidoPara?: {
    nome: string;
    cargo: string;
    avatar?: string;
  };
  mensagens: MensagemTicket[];
  emailNotificacao: string;
}

export interface ArtigoBase {
  id: string;
  titulo: string;
  slug: string;
  categoria: string;
  subcategoria?: string;
  resumo: string;
  conteudo: string;
  visualizacoes: number;
  avaliacao: {
    media: number;
    total: number;
    positivos: number;
    negativos: number;
  };
  atualizado: string;
  tags: string[];
  artigosRelacionados: string[];
}

export interface CategoriaBase {
  id: string;
  nome: string;
  icone: string;
  totalArtigos: number;
  descricao: string;
  subtopicos: string[];
}

export interface TopicoPopular {
  id: string;
  titulo: string;
  icone: string;
  visualizacoes: number;
  itens: string[];
}

export interface Tutorial {
  id: string;
  titulo: string;
  descricao: string;
  duracao: string;
  visualizacoes: number;
  thumbnail: string;
  url: string;
  categoria: string;
}

export interface Novidade {
  id: string;
  versao: string;
  data: string;
  tipo: 'feature' | 'melhoria' | 'correcao';
  titulo: string;
  itens: {
    tipo: 'novo' | 'melhorado' | 'corrigido';
    descricao: string;
  }[];
}

export interface StatusServico {
  nome: string;
  icone: string;
  status: 'online' | 'degradado' | 'offline';
  uptime: string;
}

export interface Incidente {
  id: string;
  titulo: string;
  data: string;
  duracao: string;
  resolvido: boolean;
  descricao: string;
  impacto: 'minimo' | 'moderado' | 'alto';
}

export interface ManutencaoProgramada {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  impacto: 'minimo' | 'moderado' | 'alto';
  servicos: string[];
}

export interface AcaoRapida {
  id: string;
  titulo: string;
  icone: string;
  descricao: string;
  tempo: string;
  disponivel: boolean;
  acao: string;
}

export interface SugestaoAjuda {
  id: string;
  titulo: string;
  icone: string;
  categoria: string;
}

export interface ContatoSuporte {
  tipo: 'chat' | 'email' | 'telefone' | 'whatsapp';
  titulo: string;
  info: string;
  disponibilidade: string;
  tempoResposta?: string;
  status?: 'online' | 'offline';
  acao: string;
}
