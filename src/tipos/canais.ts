// Tipos para Canais & Integrações

export type StatusCanal = 'online' | 'offline' | 'desconectado' | 'disponivel';
export type StatusIntegracao = 'conectada' | 'desconectada' | 'erro';
export type StatusWebhook = 'ativo' | 'erro' | 'inativo';

export interface Canal {
  id: string;
  nome: string;
  tipo: 'whatsapp' | 'telegram' | 'instagram' | 'email' | 'chat-web' | 'sms' | 'messenger';
  logo: string;
  status: StatusCanal;
  identificador?: string; // Ex: número, @username, email
  volumeMensagens: number;
  percentualTotal: number;
  uptime: number; // Porcentagem
  ultimaSync: string;
  mensagensHoje: number;
  conectadoDesde?: string;
  problemas?: string;
  offlineHa?: string;
  mensagensPerdidas?: number;
  descricao?: string;
  preco?: string;
}

export interface ConfiguracaoCanal {
  id: string;
  canalId: string;
  nomeExibicao: string;
  bio?: string;
  fotoPerfil?: string;
  atendimentoAutomatico: {
    responderAutomaticamente: boolean;
    mensagemAusencia: boolean;
    iaComoPrimeiro: boolean;
  };
  horarioComercial: {
    semana: { inicio: string; fim: string };
    sabado: { inicio: string; fim: string };
    domingo: 'Fechado' | { inicio: string; fim: string };
  };
  mensagensAutomaticas: {
    boasVindas: { texto: string; ativa: boolean };
    ausencia: { texto: string; ativa: boolean };
  };
  notificacoes: {
    novaMensagem: boolean;
    mensagemNaoEntregue: boolean;
    mensagemLida: boolean;
  };
  roteamento: 'distribuir' | 'menos-conversas' | 'ultimo-atendente' | 'setor-especifico';
  setorEspecifico?: string;
  limites: {
    maxMensagensHora: number;
    intervaloMinimo: number;
    detectarSpam: boolean;
    limitarMassivo: boolean;
  };
}

export interface RespostaRapida {
  id: string;
  comando: string;
  texto: string;
}

export interface ConfiguracaoMensagens {
  respostasRapidas: RespostaRapida[];
  midias: {
    imagens: boolean;
    videos: boolean;
    documentos: boolean;
    audios: boolean;
    localizacao: boolean;
  };
  tamanhoMaximoArquivo: number; // MB
  links: {
    botoesInterativos: boolean;
    encurtarLinks: boolean;
    previewLinks: boolean;
  };
  statusLeitura: {
    marcarComoLida: boolean;
    enviarDigitando: boolean;
  };
}

export interface WebhookConfig {
  id: string;
  canalId: string;
  url: string;
  token: string;
  eventos: string[];
  ativo: boolean;
  ultimoTeste?: { data: string; status: number };
  estatisticas: {
    total: number;
    sucessos: number;
    falhas: number;
  };
}

export interface Integracao {
  id: string;
  nome: string;
  tipo: 'crm' | 'ecommerce' | 'pagamento' | 'produtividade' | 'marketing';
  logo: string;
  status: StatusIntegracao;
  descricao: string;
  conectadaDesde?: string;
  ultimaSync?: string;
  detalhes?: string;
  preco?: string;
}

export interface Webhook {
  id: string;
  nome: string;
  url: string;
  eventos: string[];
  status: StatusWebhook;
  estatisticas: {
    requisicoesHoje: number;
    sucessos: number;
    falhas: number;
    taxaSucesso: number;
  };
  ultimaChamada?: {
    quando: string;
    statusCode: number;
  };
  erro?: string;
}

export interface ChaveAPI {
  id: string;
  nome: string;
  chave: string;
  tipo: 'producao' | 'desenvolvimento';
  criadaEm: string;
  ultimoUso: string;
  requisicoesHoje: number;
  permissoes: {
    leitura: boolean;
    escrita: boolean;
  };
}

export interface EndpointAPI {
  metodo: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  caminho: string;
  descricao: string;
}

export interface UsoAPI {
  totalRequisicoes: number;
  sucessos: number;
  erros: number;
  endpointMaisUsado: { endpoint: string; requisicoes: number };
  latenciaMedia: number;
}

export interface StatusSistema {
  canal: {
    nome: string;
    tipo: string;
    status: 'online' | 'offline';
    uptime: number;
    latencia: string;
    ultimaAtividade: string;
  }[];
  integracoes: {
    nome: string;
    status: 'online' | 'offline';
    syncRate: number;
    ultimaSync: string;
  }[];
  webhooks: {
    nome: string;
    status: 'online' | 'erro';
    taxaSucesso: number;
    ultimaChamada: string;
  }[];
}

export interface Incidente {
  id: string;
  data: string;
  servico: string;
  tipo: 'incidente' | 'degradacao';
  descricao: string;
  duracao: string;
  resolvido: boolean;
}

export interface DadosCanaisIntegracoes {
  canais: Canal[];
  integracoes: Integracao[];
  webhooks: Webhook[];
  chavesAPI: ChaveAPI[];
  endpointsAPI: {
    mensagens: EndpointAPI[];
    tickets: EndpointAPI[];
    clientes: EndpointAPI[];
  };
  usoAPI: UsoAPI;
  statusSistema: StatusSistema;
  incidentes: Incidente[];
  configuracoes: {
    [canalId: string]: ConfiguracaoCanal;
  };
  configuracoesMsg: {
    [canalId: string]: ConfiguracaoMensagens;
  };
  webhooksConfig: {
    [canalId: string]: WebhookConfig;
  };
}
