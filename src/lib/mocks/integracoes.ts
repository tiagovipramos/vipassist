import { 
  Integracao, 
  StatusIntegracao, 
  CategoriaIntegracao,
  ColecaoIntegracoes,
  EstatisticasGeraisIntegracoes,
  ReviewIntegracao,
  LogIntegracao,
  RecursoIntegracao,
  PrecoIntegracao,
  DocumentacaoIntegracao,
  BadgeIntegracao
} from '@/tipos/integracoes'

// =============================================================================
// HELPERS
// =============================================================================

const criarPrecoGratis = (): PrecoIntegracao => ({
  tipo: 'gratis'
})

const criarRecurso = (nome: string, descricao: string): RecursoIntegracao => ({
  id: nome.toLowerCase().replace(/\s+/g, '-'),
  nome,
  descricao,
  disponivel: true
})

const criarDocumentacao = (integracaoSlug: string): DocumentacaoIntegracao => ({
  guiaInicio: `https://docs.kortex.com/integracoes/${integracaoSlug}`,
  suporte: {
    email: 'suporte@kortex.com',
    chat: true
  }
})

// =============================================================================
// CATEGORIA: COMUNICAÇÃO
// =============================================================================

export const whatsappBusiness: Integracao = {
  id: 'whatsapp-business',
  slug: 'whatsapp-business',
  nome: 'WhatsApp Business',
  logo: '💬',
  cor: '#25D366',
  categoria: 'comunicacao',
  status: 'conectada',
  badges: ['popular', 'oficial'],
  descricao: 'Integração oficial com WhatsApp Business API para atendimento profissional',
  preco: criarPrecoGratis(),
  popularidade: 5,
  numeroUsuarios: 45230,
  numeroAvaliacoes: 1245,
  notaMedia: 4.9,
  recursos: [
    criarRecurso('Mensagens de texto e multimídia', 'Envie textos, imagens, vídeos e documentos'),
    criarRecurso('Modelos de mensagens aprovados', 'Use templates pré-aprovados'),
    criarRecurso('Chatbots integrados', 'Automação inteligente'),
    criarRecurso('Múltiplos atendentes', 'Equipe colaborativa'),
    criarRecurso('Métricas em tempo real', 'Acompanhe performance')
  ],
  documentacao: criarDocumentacao('whatsapp-business'),
  oficial: true
}

export const instagram: Integracao = {
  id: 'instagram',
  slug: 'instagram',
  nome: 'Instagram',
  logo: '📸',
  cor: '#E4405F',
  categoria: 'comunicacao',
  status: 'conectada',
  badges: ['popular'],
  descricao: 'Gerencie mensagens diretas e comentários do Instagram',
  preco: criarPrecoGratis(),
  popularidade: 5,
  numeroUsuarios: 38420,
  numeroAvaliacoes: 982,
  notaMedia: 4.8,
  recursos: [
    criarRecurso('Direct Messages', 'Responda DMs rapidamente'),
    criarRecurso('Gerenciamento de comentários', 'Modere comentários'),
    criarRecurso('Stories e Reels', 'Interaja com stories'),
    criarRecurso('Respostas rápidas', 'Templates de resposta'),
    criarRecurso('Análise de engajamento', 'Métricas detalhadas')
  ],
  documentacao: criarDocumentacao('instagram'),
  oficial: true
}

export const facebookMessenger: Integracao = {
  id: 'facebook-messenger',
  slug: 'facebook-messenger',
  nome: 'Facebook Messenger',
  logo: '💙',
  cor: '#0084FF',
  categoria: 'comunicacao',
  status: 'conectada',
  badges: ['popular'],
  descricao: 'Atenda clientes via Facebook Messenger com automação inteligente',
  preco: criarPrecoGratis(),
  popularidade: 5,
  numeroUsuarios: 35120,
  numeroAvaliacoes: 876,
  notaMedia: 4.7,
  recursos: [
    criarRecurso('Chat em tempo real', 'Conversas instantâneas'),
    criarRecurso('Respostas automáticas', 'Automação de atendimento'),
    criarRecurso('Botões interativos', 'Menus e botões'),
    criarRecurso('Quick Replies', 'Respostas rápidas'),
    criarRecurso('Integração com Facebook Ads', 'Conecte com anúncios')
  ],
  documentacao: criarDocumentacao('facebook-messenger'),
  oficial: true
}

export const telegram: Integracao = {
  id: 'telegram',
  slug: 'telegram',
  nome: 'Telegram',
  logo: '✈️',
  cor: '#0088CC',
  categoria: 'comunicacao',
  status: 'disponivel',
  descricao: 'Conecte seu bot do Telegram para atendimento rápido e seguro',
  preco: criarPrecoGratis(),
  popularidade: 4,
  numeroUsuarios: 28450,
  numeroAvaliacoes: 654,
  notaMedia: 4.8,
  recursos: [
    criarRecurso('Bot API completa', 'API robusta do Telegram'),
    criarRecurso('Grupos e canais', 'Suporte a grupos'),
    criarRecurso('Comandos personalizados', 'Crie comandos'),
    criarRecurso('Inline keyboards', 'Teclados personalizados'),
    criarRecurso('Notificações push', 'Alertas em tempo real')
  ],
  documentacao: criarDocumentacao('telegram'),
  oficial: false
}

export const email: Integracao = {
  id: 'email',
  slug: 'email',
  nome: 'E-mail',
  logo: '📧',
  cor: '#EA4335',
  categoria: 'comunicacao',
  status: 'conectada',
  descricao: 'Integração completa com serviços de e-mail para suporte profissional',
  preco: criarPrecoGratis(),
  popularidade: 4,
  numeroUsuarios: 32100,
  numeroAvaliacoes: 789,
  notaMedia: 4.6,
  recursos: [
    criarRecurso('IMAP/SMTP', 'Protocolos padrão'),
    criarRecurso('Templates de e-mail', 'Modelos prontos'),
    criarRecurso('Assinaturas personalizadas', 'Personalize assinaturas'),
    criarRecurso('Rastreamento de abertura', 'Saiba quando abriram'),
    criarRecurso('Anexos e formatação', 'Envie arquivos')
  ],
  documentacao: criarDocumentacao('email'),
  oficial: true
}

export const smsMms: Integracao = {
  id: 'sms-mms',
  slug: 'sms-mms',
  nome: 'SMS/MMS',
  logo: '📱',
  cor: '#34B7F1',
  categoria: 'comunicacao',
  status: 'disponivel',
  descricao: 'Envie mensagens SMS e MMS para alcance universal',
  preco: {
    tipo: 'addon',
    valor: 29.90,
    periodo: 'mes'
  },
  popularidade: 4,
  numeroUsuarios: 18900,
  numeroAvaliacoes: 432,
  notaMedia: 4.5,
  recursos: [
    criarRecurso('SMS em massa', 'Envios em lote'),
    criarRecurso('MMS com imagens', 'Envie multimídia'),
    criarRecurso('Agendamento de envios', 'Programe mensagens'),
    criarRecurso('Relatórios de entrega', 'Acompanhe entregas'),
    criarRecurso('Respostas automáticas', 'Automação de SMS')
  ],
  documentacao: criarDocumentacao('sms-mms'),
  oficial: false
}

export const webChatWidget: Integracao = {
  id: 'webchat-widget',
  slug: 'webchat-widget',
  nome: 'WebChat Widget',
  logo: '💬',
  cor: '#7C3AED',
  categoria: 'comunicacao',
  status: 'conectada',
  badges: ['popular', 'recomendado'],
  descricao: 'Chat ao vivo para seu website com interface personalizável',
  preco: criarPrecoGratis(),
  popularidade: 5,
  numeroUsuarios: 41200,
  numeroAvaliacoes: 1089,
  notaMedia: 4.8,
  recursos: [
    criarRecurso('Chat em tempo real', 'Conversas instantâneas'),
    criarRecurso('Personalização completa', 'Customize cores e estilo'),
    criarRecurso('Typing indicators', 'Indicador de digitação'),
    criarRecurso('Transferência de arquivos', 'Envie e receba arquivos'),
    criarRecurso('Histórico de conversas', 'Mantenha histórico')
  ],
  documentacao: criarDocumentacao('webchat-widget'),
  oficial: true
}

// =============================================================================
// CATEGORIA: INTELIGÊNCIA ARTIFICIAL
// =============================================================================

export const gpt4: Integracao = {
  id: 'gpt-4',
  slug: 'gpt-4',
  nome: 'GPT-4',
  logo: '🤖',
  cor: '#10A37F',
  categoria: 'ia',
  status: 'conectada',
  badges: ['popular', 'recomendado'],
  descricao: 'Modelo de linguagem avançado da OpenAI para respostas inteligentes',
  preco: {
    tipo: 'addon',
    valor: 99.90,
    periodo: 'mes'
  },
  popularidade: 5,
  numeroUsuarios: 52300,
  numeroAvaliacoes: 1567,
  notaMedia: 4.9,
  recursos: [
    criarRecurso('Respostas contextuais', 'IA que entende contexto'),
    criarRecurso('Suporte multilíngue', '50+ idiomas'),
    criarRecurso('Análise de sentimento', 'Detecta emoções'),
    criarRecurso('Sugestões inteligentes', 'Respostas sugeridas'),
    criarRecurso('Aprendizado contínuo', 'Melhora com uso')
  ],
  documentacao: criarDocumentacao('gpt-4'),
  oficial: false
}

export const claude: Integracao = {
  id: 'claude',
  slug: 'claude',
  nome: 'Claude',
  logo: '🧠',
  cor: '#D97757',
  categoria: 'ia',
  status: 'disponivel',
  descricao: 'Assistente de IA da Anthropic focado em segurança e precisão',
  preco: {
    tipo: 'addon',
    valor: 89.90,
    periodo: 'mes'
  },
  popularidade: 4,
  numeroUsuarios: 31200,
  numeroAvaliacoes: 892,
  notaMedia: 4.8,
  recursos: [
    criarRecurso('Respostas longas e detalhadas', 'Respostas completas'),
    criarRecurso('Análise de contexto', 'Compreensão profunda'),
    criarRecurso('Constitutional AI', 'IA ética e segura'),
    criarRecurso('Múltiplos idiomas', 'Suporte global'),
    criarRecurso('Integração via API', 'API robusta')
  ],
  documentacao: criarDocumentacao('claude'),
  oficial: false
}

export const googleGemini: Integracao = {
  id: 'google-gemini',
  slug: 'google-gemini',
  nome: 'Google Gemini',
  logo: '✨',
  cor: '#4285F4',
  categoria: 'ia',
  status: 'beta',
  badges: ['novo', 'beta'],
  descricao: 'IA multimodal do Google para análise de texto, imagem e mais',
  preco: {
    tipo: 'addon',
    valor: 79.90,
    periodo: 'mes'
  },
  popularidade: 5,
  numeroUsuarios: 38700,
  numeroAvaliacoes: 1034,
  notaMedia: 4.8,
  recursos: [
    criarRecurso('Análise multimodal', 'Texto, imagem e voz'),
    criarRecurso('Processamento de imagens', 'Entende imagens'),
    criarRecurso('Respostas contextuais', 'Contexto avançado'),
    criarRecurso('Integração com Google Cloud', 'Ecossistema Google'),
    criarRecurso('Alta performance', 'Respostas rápidas')
  ],
  documentacao: criarDocumentacao('google-gemini'),
  oficial: false
}

export const sentimentAnalysis: Integracao = {
  id: 'sentiment-analysis',
  slug: 'sentiment-analysis',
  nome: 'Sentiment Analysis',
  logo: '😊',
  cor: '#F59E0B',
  categoria: 'ia',
  status: 'conectada',
  descricao: 'Análise de sentimento em tempo real para melhor compreensão do cliente',
  preco: criarPrecoGratis(),
  popularidade: 4,
  numeroUsuarios: 24500,
  numeroAvaliacoes: 567,
  notaMedia: 4.7,
  recursos: [
    criarRecurso('Detecção de emoções', 'Identifica emoções'),
    criarRecurso('Análise em tempo real', 'Análise instantânea'),
    criarRecurso('Scores de sentimento', 'Pontuação de sentimento'),
    criarRecurso('Alertas de negatividade', 'Notificações de risco'),
    criarRecurso('Relatórios detalhados', 'Insights profundos')
  ],
  documentacao: criarDocumentacao('sentiment-analysis'),
  oficial: true
}

export const speechToText: Integracao = {
  id: 'speech-to-text',
  slug: 'speech-to-text',
  nome: 'Speech-to-Text',
  logo: '🎤',
  cor: '#8B5CF6',
  categoria: 'ia',
  status: 'disponivel',
  descricao: 'Transcrição automática de áudio para texto com alta precisão',
  preco: {
    tipo: 'addon',
    valor: 49.90,
    periodo: 'mes'
  },
  popularidade: 4,
  numeroUsuarios: 27800,
  numeroAvaliacoes: 678,
  notaMedia: 4.7,
  recursos: [
    criarRecurso('Transcrição em tempo real', 'Transcrição ao vivo'),
    criarRecurso('Múltiplos idiomas', '30+ idiomas'),
    criarRecurso('Pontuação automática', 'Texto formatado'),
    criarRecurso('Identificação de falantes', 'Quem falou o quê'),
    criarRecurso('Alta precisão', '95%+ de acurácia')
  ],
  documentacao: criarDocumentacao('speech-to-text'),
  oficial: false
}

export const autoTraducao: Integracao = {
  id: 'auto-traducao',
  slug: 'auto-traducao',
  nome: 'Auto-tradução',
  logo: '🌐',
  cor: '#06B6D4',
  categoria: 'ia',
  status: 'conectada',
  badges: ['popular'],
  descricao: 'Tradução automática de mensagens para atendimento multilíngue',
  preco: criarPrecoGratis(),
  popularidade: 4,
  numeroUsuarios: 33400,
  numeroAvaliacoes: 823,
  notaMedia: 4.8,
  recursos: [
    criarRecurso('100+ idiomas', 'Cobertura global'),
    criarRecurso('Tradução em tempo real', 'Instantânea'),
    criarRecurso('Detecção automática de idioma', 'Auto-detecta'),
    criarRecurso('Contexto preservado', 'Mantém significado'),
    criarRecurso('Alta qualidade', 'Tradução profissional')
  ],
  documentacao: criarDocumentacao('auto-traducao'),
  oficial: true
}

export const metaAi: Integracao = {
  id: 'meta-ai',
  slug: 'meta-ai',
  nome: 'Meta AI',
  logo: '🔷',
  cor: '#0668E1',
  categoria: 'ia',
  status: 'disponivel',
  descricao: 'Assistente de IA da Meta com integração nativa para suas plataformas',
  preco: {
    tipo: 'addon',
    valor: 69.90,
    periodo: 'mes'
  },
  popularidade: 4,
  numeroUsuarios: 29100,
  numeroAvaliacoes: 701,
  notaMedia: 4.6,
  recursos: [
    criarRecurso('Integração com WhatsApp/Instagram', 'Nativo Meta'),
    criarRecurso('Respostas automáticas', 'Automação inteligente'),
    criarRecurso('Análise de conversas', 'Insights de conversas'),
    criarRecurso('Sugestões contextuais', 'IA contextual'),
    criarRecurso('Aprendizado de marca', 'Personalização')
  ],
  documentacao: criarDocumentacao('meta-ai'),
  oficial: false
}

// =============================================================================
// CATEGORIA: TELEFONIA & VOIP
// =============================================================================

export const gravacaoChamadas: Integracao = {
  id: 'gravacao-chamadas',
  slug: 'gravacao-chamadas',
  nome: 'Gravação de Chamadas',
  logo: '📞',
  cor: '#EF4444',
  categoria: 'telefonia',
  status: 'disponivel',
  descricao: 'Sistema completo de gravação e análise de chamadas telefônicas',
  preco: {
    tipo: 'addon',
    valor: 39.90,
    periodo: 'mes'
  },
  popularidade: 4,
  numeroUsuarios: 21300,
  numeroAvaliacoes: 489,
  notaMedia: 4.6,
  recursos: [
    criarRecurso('Gravação automática', 'Grava todas as chamadas'),
    criarRecurso('Armazenamento seguro', 'Cloud seguro'),
    criarRecurso('Transcrição de chamadas', 'Texto das chamadas'),
    criarRecurso('Análise de qualidade', 'QA automático'),
    criarRecurso('Conformidade legal', 'LGPD compliant')
  ],
  documentacao: criarDocumentacao('gravacao-chamadas'),
  oficial: true
}

// =============================================================================
// ARRAY COM TODAS AS INTEGRAÇÕES
// =============================================================================

export const todasIntegracoes: Integracao[] = [
  // Comunicação (7)
  whatsappBusiness,
  instagram,
  facebookMessenger,
  telegram,
  email,
  smsMms,
  webChatWidget,
  // Inteligência Artificial (7)
  gpt4,
  claude,
  googleGemini,
  sentimentAnalysis,
  speechToText,
  autoTraducao,
  metaAi,
  // Telefonia & VoIP (1)
  gravacaoChamadas
]

// =============================================================================
// COLEÇÕES DE INTEGRAÇÕES
// =============================================================================

export const colecoes: ColecaoIntegracoes[] = [
  {
    id: 'essenciais',
    nome: 'Essenciais para Iniciar',
    descricao: 'As integrações fundamentais para começar seu atendimento',
    icone: '⭐',
    integracoes: ['whatsapp-business', 'webchat-widget', 'email', 'gpt-4']
  },
  {
    id: 'redes-sociais',
    nome: 'Redes Sociais',
    descricao: 'Atenda seus clientes onde eles estão',
    icone: '📱',
    integracoes: ['whatsapp-business', 'instagram', 'facebook-messenger', 'telegram']
  },
  {
    id: 'ia-avancada',
    nome: 'IA Avançada',
    descricao: 'Automação inteligente com as melhores IAs do mercado',
    icone: '🤖',
    integracoes: ['gpt-4', 'claude', 'google-gemini', 'meta-ai']
  },
  {
    id: 'analise-otimizacao',
    nome: 'Análise e Otimização',
    descricao: 'Melhore continuamente seu atendimento',
    icone: '📊',
    integracoes: ['sentiment-analysis', 'speech-to-text', 'auto-traducao', 'gravacao-chamadas']
  }
]

// =============================================================================
// ESTATÍSTICAS GERAIS
// =============================================================================

export const estatisticasGerais: EstatisticasGeraisIntegracoes = {
  totalIntegracoes: todasIntegracoes.length,
  integracoesConectadas: todasIntegracoes.filter(i => i.status === 'conectada').length,
  integracoesDisponiveis: todasIntegracoes.filter(i => i.status === 'disponivel').length,
  categorias: [
    {
      categoria: 'comunicacao',
      quantidade: todasIntegracoes.filter(i => i.categoria === 'comunicacao').length,
      conectadas: todasIntegracoes.filter(i => i.categoria === 'comunicacao' && i.status === 'conectada').length
    },
    {
      categoria: 'ia',
      quantidade: todasIntegracoes.filter(i => i.categoria === 'ia').length,
      conectadas: todasIntegracoes.filter(i => i.categoria === 'ia' && i.status === 'conectada').length
    },
    {
      categoria: 'telefonia',
      quantidade: todasIntegracoes.filter(i => i.categoria === 'telefonia').length,
      conectadas: todasIntegracoes.filter(i => i.categoria === 'telefonia' && i.status === 'conectada').length
    }
  ],
  maisPopulares: ['whatsapp-business', 'gpt-4', 'webchat-widget', 'instagram'],
  maisRecentes: ['google-gemini', 'meta-ai'],
  recomendadas: ['whatsapp-business', 'gpt-4', 'webchat-widget', 'auto-traducao']
}

// =============================================================================
// REVIEWS DE USUÁRIOS
// =============================================================================

export const reviews: ReviewIntegracao[] = [
  {
    id: 'review-1',
    integracaoId: 'whatsapp-business',
    usuarioId: 'user-1',
    usuarioNome: 'Maria Silva',
    usuarioAvatar: '/avatars/maria.jpg',
    nota: 5,
    titulo: 'Essencial para nosso negócio',
    comentario: 'O WhatsApp Business transformou nosso atendimento. Conseguimos responder 3x mais rápido!',
    dataPublicacao: '2024-11-10T10:00:00Z',
    util: 45
  },
  {
    id: 'review-2',
    integracaoId: 'gpt-4',
    usuarioId: 'user-2',
    usuarioNome: 'João Santos',
    usuarioAvatar: '/avatars/joao.jpg',
    nota: 5,
    titulo: 'IA que realmente funciona',
    comentario: 'O GPT-4 economizou horas da nossa equipe com respostas inteligentes e precisas.',
    dataPublicacao: '2024-11-08T14:30:00Z',
    util: 38
  },
  {
    id: 'review-3',
    integracaoId: 'instagram',
    usuarioId: 'user-3',
    usuarioNome: 'Ana Costa',
    usuarioAvatar: '/avatars/ana.jpg',
    nota: 5,
    titulo: 'Perfeito para vendas sociais',
    comentario: 'Gerenciar DMs e comentários nunca foi tão fácil. Nossas vendas aumentaram 40%!',
    dataPublicacao: '2024-11-05T09:15:00Z',
    util: 29
  },
  {
    id: 'review-4',
    integracaoId: 'webchat-widget',
    usuarioId: 'user-4',
    usuarioNome: 'Pedro Lima',
    usuarioAvatar: '/avatars/pedro.jpg',
    nota: 5,
    titulo: 'Chat profissional e fácil',
    comentario: 'Implementação simples e funciona perfeitamente. Nossos clientes adoram!',
    dataPublicacao: '2024-11-03T16:45:00Z',
    util: 31
  },
  {
    id: 'review-5',
    integracaoId: 'auto-traducao',
    usuarioId: 'user-5',
    usuarioNome: 'Sofia Rodrigues',
    usuarioAvatar: '/avatars/sofia.jpg',
    nota: 5,
    titulo: 'Atendimento verdadeiramente global',
    comentario: 'Agora atendemos clientes em 15 idiomas sem contratar tradutores. Incrível!',
    dataPublicacao: '2024-11-01T11:20:00Z',
    util: 27
  }
]

// =============================================================================
// LOGS DE INTEGRAÇÕES
// =============================================================================

export const logsIntegracoes: LogIntegracao[] = [
  {
    id: 'log-1',
    integracaoId: 'whatsapp-business',
    integracaoNome: 'WhatsApp Business',
    evento: 'integracao.sync.concluida',
    descricao: 'Sincronização de mensagens concluída com sucesso',
    detalhes: {
      mensagensSincronizadas: 156,
      tempo: '2.3s'
    },
    nivel: 'success',
    timestamp: '2024-11-16T12:30:00Z',
    usuarioId: 'user-admin'
  },
  {
    id: 'log-2',
    integracaoId: 'gpt-4',
    integracaoNome: 'GPT-4',
    evento: 'integracao.sync.concluida',
    descricao: 'Resposta gerada com sucesso',
    detalhes: {
      tokens: 156,
      tempo: '1.2s',
      modelo: 'gpt-4-turbo'
    },
    nivel: 'success',
    timestamp: '2024-11-16T12:28:00Z'
  },
  {
    id: 'log-3',
    integracaoId: 'instagram',
    integracaoNome: 'Instagram',
    evento: 'integracao.sync.concluida',
    descricao: 'Nova mensagem recebida',
    detalhes: {
      tipo: 'direct_message',
      remetente: '@cliente_exemplo'
    },
    nivel: 'info',
    timestamp: '2024-11-16T12:25:00Z'
  },
  {
    id: 'log-4',
    integracaoId: 'email',
    integracaoNome: 'E-mail',
    evento: 'integracao.sync.iniciada',
    descricao: 'Enviando e-mail',
    detalhes: {
      assunto: 'Confirmação de pedido #12345',
      destinatario: 'cliente@exemplo.com'
    },
    nivel: 'info',
    timestamp: '2024-11-16T12:20:00Z'
  },
  {
    id: 'log-5',
    integracaoId: 'sentiment-analysis',
    integracaoNome: 'Sentiment Analysis',
    evento: 'integracao.sync.concluida',
    descricao: 'Sentimento negativo detectado',
    detalhes: {
      score: -0.75,
      conversa: 'conv_789',
      alerta: true
    },
    nivel: 'warning',
    timestamp: '2024-11-16T12:15:00Z'
  }
]
