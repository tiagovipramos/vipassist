export interface PlanoAtual {
  id: string;
  nome: string;
  valor: number;
  status: 'ativo' | 'suspenso' | 'cancelado';
  proximaCobranca: string;
  cartaoFinal: string;
  statusPagamento: 'em-dia' | 'pendente' | 'atrasado';
}

export interface UsoPlano {
  usuarios: {
    usado: number;
    total: number;
    disponivel: number;
  };
  conversas: {
    usado: number;
    total: number;
    disponivel: number;
  };
  receitaChat: {
    valor: number;
    ilimitado: boolean;
  };
  requisicoesIA: {
    usado: number;
    total: number;
    disponivel: number;
  };
  percentualUso: number;
}

export interface RecursoPlano {
  id: string;
  nome: string;
  incluido: boolean;
  tipo: 'incluso' | 'nao-disponivel';
  descricao?: string;
}

export interface HistoricoAssinatura {
  id: string;
  data: string;
  tipo: 'pagamento' | 'upgrade' | 'downgrade' | 'inicio' | 'cancelamento';
  descricao: string;
  valor?: number;
  status: 'confirmado' | 'pendente' | 'falhou';
  detalhes?: string;
}

export interface Fatura {
  id: string;
  numero: string;
  periodo: string;
  valor: number;
  status: 'paga' | 'pendente' | 'vencida' | 'trial';
  vencimento: string;
  pagamento?: string;
  itens: ItemFatura[];
  cliente: ClienteFatura;
}

export interface ItemFatura {
  descricao: string;
  valor: number;
}

export interface ClienteFatura {
  nome: string;
  cnpj: string;
  email: string;
}

export interface MetodoPagamento {
  id: string;
  tipo: 'credito' | 'debito';
  bandeira: 'Visa' | 'Mastercard' | 'Elo' | 'Amex';
  numeroFinal: string;
  vencimento: string;
  titular: string;
  principal: boolean;
  cadastradoEm: string;
}

export interface NotificacaoCobranca {
  seteDias: boolean;
  tresDias: boolean;
  diaVencimento: boolean;
  pagamentoConfirmado: boolean;
  pagamentoFalhou: boolean;
  emails: string[];
}

export interface ConfiguracaoFalha {
  tentarNovamente: boolean;
  usarBackup: boolean;
  notificarApenasManual: boolean;
}

export interface Plano {
  id: string;
  nome: string;
  valor: number;
  valorCustom?: boolean;
  descricao: string;
  usuarios: number | 'ilimitado';
  conversas: number | 'ilimitado';
  requisicoesIA: number | 'ilimitado';
  recursos: RecursoPlano[];
  popular?: boolean;
  atual?: boolean;
}

export interface Pagamento {
  id: string;
  protocolo: string;
  prestadorNome: string;
  prestadorTelefone: string;
  servicoTipo: 'reboque' | 'pneu' | 'bateria' | 'combustivel' | 'chaveiro' | 'mecanica';
  servicoDescricao: string;
  valor: number;
  status: 'pendente' | 'finalizado' | 'cancelado';
  dataCriacao: string;
  dataVencimento: string;
  dataPagamento?: string;
  ticketProtocolo: string;
  clienteNome: string;
  clienteTelefone?: string;
  metodoPagamento: 'pix' | 'transferencia' | 'boleto' | 'cartao';
  comprovante?: string;
  observacoes?: string;
}

export interface DadosPagamentos {
  planoAtual: PlanoAtual;
  usoPlano: UsoPlano;
  recursos: RecursoPlano[];
  historicoAssinatura: HistoricoAssinatura[];
  faturas: Fatura[];
  metodosPagamento: MetodoPagamento[];
  notificacoes: NotificacaoCobranca;
  configuracaoFalha: ConfiguracaoFalha;
  planos: Plano[];
}
