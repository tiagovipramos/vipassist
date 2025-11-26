/**
 * Tipos para o Sistema de Integrações do Kortex
 * 
 * Este arquivo define todos os tipos relacionados ao marketplace de integrações,
 * incluindo canais de comunicação, IA, pagamentos, e-commerce, etc.
 */

// ===== CATEGORIAS =====

export type CategoriaIntegracao =
  | 'comunicacao'          // WhatsApp, Instagram, Email, SMS, etc.
  | 'ia'                   // GPT-4, Claude, Sentiment Analysis, etc.
  | 'telefonia'            // VoIP, Gravação, Telefonia, etc.

// ===== STATUS =====

export type StatusIntegracao =
  | 'conectada'        // Integração ativa e funcionando
  | 'disponivel'       // Disponível para conectar
  | 'desconectada'     // Foi conectada mas está offline
  | 'em_breve'         // Em desenvolvimento
  | 'beta'             // Em fase de testes

// ===== PREÇO =====

export interface PrecoIntegracao {
  tipo: 'gratis' | 'incluido' | 'addon' | 'enterprise'
  valor?: number
  periodo?: 'mes' | 'ano' | 'uso'
  trial?: {
    dias: number
    descricao: string
  }
  limites?: {
    descricao: string
    valorExtra?: number
  }
}

// ===== CONFIGURAÇÃO =====

export interface ConfiguracaoIntegracao {
  conectadoEm?: string
  conectadoPor?: string // ID do usuário
  ultimaSync?: string
  proximaSync?: string
  intervaloSync?: number // em minutos
  
  credenciais?: {
    tipo: 'api_key' | 'oauth' | 'webhook' | 'manual'
    campos?: CampoCredencial[]
    valida?: boolean
    expiraEm?: string
  }
  
  webhookUrl?: string
  webhookSecret?: string
  
  configuracoes?: Record<string, any>
  permissoes?: string[]
}

export interface CampoCredencial {
  nome: string
  label: string
  tipo: 'text' | 'password' | 'url' | 'select'
  obrigatorio: boolean
  placeholder?: string
  ajuda?: string
  opcoes?: { valor: string; label: string }[]
}

// ===== ESTATÍSTICAS =====

export interface EstatisticasIntegracao {
  requisicoes24h: number
  requisicoes7d: number
  requisicoes30d: number
  ultimaRequisicao?: string
  proximaRequisicao?: string
  taxaSucesso: number
  taxaErro: number
  tempoResposta: number // ms
  dadosSincronizados?: {
    tipo: string
    quantidade: number
  }[]
  usoAPI?: {
    limite: number
    usado: number
    resetaEm: string
  }
}

// ===== RECURSOS =====

export interface RecursoIntegracao {
  id: string
  nome: string
  descricao: string
  disponivel: boolean
  premium?: boolean
}

// ===== DOCUMENTAÇÃO =====

export interface DocumentacaoIntegracao {
  guiaInicio: string
  apiDocs?: string
  videoTutorial?: string
  exemplos?: ExemploIntegracao[]
  faq?: { pergunta: string; resposta: string }[]
  suporte: {
    email?: string
    chat?: boolean
    telefone?: string
    horario?: string
  }
}

export interface ExemploIntegracao {
  titulo: string
  descricao: string
  codigo?: string
  linguagem?: string
}

// ===== BADGES =====

export type BadgeIntegracao =
  | 'novo'             // Lançada nos últimos 30 dias
  | 'popular'          // >80% dos usuários usam
  | 'oficial'          // Desenvolvida pela Kortex ou parceiro certificado
  | 'recomendado'      // Recomendada pela equipe
  | 'gratis'           // Totalmente gratuita
  | 'premium'          // Recurso premium
  | 'beta'             // Em fase de testes
  | 'verificado'       // Segurança verificada

// ===== REVIEWS =====

export interface ReviewIntegracao {
  id: string
  integracaoId: string
  usuarioId: string
  usuarioNome: string
  usuarioAvatar?: string
  nota: number // 1-5
  titulo: string
  comentario: string
  dataPublicacao: string
  util: number // quantas pessoas acharam útil
  resposta?: {
    texto: string
    data: string
    autor: string
  }
}

// ===== INTEGRAÇÃO PRINCIPAL =====

export interface Integracao {
  // Identificação
  id: string
  slug: string
  nome: string
  nomeCompleto?: string
  logo: string
  logoUrl?: string
  cor?: string
  
  // Classificação
  categoria: CategoriaIntegracao
  subcategorias?: string[]
  tags?: string[]
  
  // Status
  status: StatusIntegracao
  badges?: BadgeIntegracao[]
  
  // Descrição
  descricao: string
  descricaoDetalhada?: string
  beneficios?: string[]
  casoDeUso?: string[]
  
  // Preço
  preco: PrecoIntegracao
  
  // Popularidade
  popularidade: number // 1-5 estrelas
  numeroUsuarios?: number
  numeroAvaliacoes?: number
  notaMedia?: number
  
  // Recursos
  recursos: RecursoIntegracao[]
  recursosDestaque?: string[]
  
  // Requisitos
  requisitos?: {
    plano?: string[]
    outras_integracoes?: string[]
    configuracao?: string
  }
  
  // Configuração
  configuracao?: ConfiguracaoIntegracao
  
  // Estatísticas (apenas para conectadas)
  estatisticas?: EstatisticasIntegracao
  
  // Documentação
  documentacao: DocumentacaoIntegracao
  
  // Metadata
  desenvolvedorNome?: string
  desenvolvedorUrl?: string
  versao?: string
  ultimaAtualizacao?: string
  dataLancamento?: string
  
  // Flags
  oficial: boolean
  ativa?: boolean
  manutencao?: boolean
  descontinuada?: boolean
}

// ===== FILTROS =====

export interface FiltrosIntegracoes {
  busca?: string
  categorias?: CategoriaIntegracao[]
  status?: StatusIntegracao[]
  preco?: ('gratis' | 'pago')[]
  badges?: BadgeIntegracao[]
  notaMinima?: number
  ordenacao?: 'popularidade' | 'alfabetica' | 'recentes' | 'nota'
}

// ===== COLEÇÕES =====

export interface ColecaoIntegracoes {
  id: string
  nome: string
  descricao: string
  icone: string
  integracoes: string[] // IDs das integrações
  destaque?: boolean
}

// ===== ESTATÍSTICAS GERAIS =====

export interface EstatisticasGeraisIntegracoes {
  totalIntegracoes: number
  integracoesConectadas: number
  integracoesDisponiveis: number
  categorias: {
    categoria: CategoriaIntegracao
    quantidade: number
    conectadas: number
  }[]
  maisPopulares: string[] // IDs
  maisRecentes: string[] // IDs
  recomendadas: string[] // IDs
}

// ===== EVENTOS =====

export type EventoIntegracao =
  | 'integracao.conectada'
  | 'integracao.desconectada'
  | 'integracao.erro'
  | 'integracao.sync.iniciada'
  | 'integracao.sync.concluida'
  | 'integracao.sync.falha'
  | 'integracao.configuracao.alterada'

export interface LogIntegracao {
  id: string
  integracaoId: string
  integracaoNome: string
  evento: EventoIntegracao
  descricao: string
  detalhes?: Record<string, any>
  nivel: 'info' | 'warning' | 'error' | 'success'
  timestamp: string
  usuarioId?: string
}

// ===== WEBHOOK =====

export interface WebhookIntegracao {
  id: string
  integracaoId: string
  url: string
  eventos: EventoIntegracao[]
  ativo: boolean
  secret?: string
  headers?: Record<string, string>
  tentativas: number
  ultimaTentativa?: {
    data: string
    statusCode: number
    sucesso: boolean
    erro?: string
  }
}

// ===== EXPORTAR TIPO UNIÃO =====

export type TipoIntegracao = Integracao

// ===== HELPERS =====

export const CATEGORIAS_INTEGRACAO: Record<CategoriaIntegracao, { nome: string; icone: string; cor: string }> = {
  comunicacao: { nome: 'Comunicação', icone: '📱', cor: 'blue' },
  ia: { nome: 'Inteligência Artificial', icone: '🤖', cor: 'purple' },
  telefonia: { nome: 'Telefonia & VoIP', icone: '📞', cor: 'rose' },
}

export const BADGES_INTEGRACAO: Record<BadgeIntegracao, { label: string; cor: string }> = {
  novo: { label: 'Novo', cor: 'green' },
  popular: { label: 'Popular', cor: 'orange' },
  oficial: { label: 'Oficial', cor: 'blue' },
  recomendado: { label: 'Recomendado', cor: 'purple' },
  gratis: { label: 'Grátis', cor: 'emerald' },
  premium: { label: 'Premium', cor: 'amber' },
  beta: { label: 'Beta', cor: 'yellow' },
  verificado: { label: 'Verificado', cor: 'cyan' },
}
