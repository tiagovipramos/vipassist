import { DadosCanaisIntegracoes } from '@/tipos/canais';

export const dadosCanaisIntegracoesMock: DadosCanaisIntegracoes = {
  canais: [
    {
      id: 'whatsapp-1',
      nome: 'WhatsApp Business',
      tipo: 'whatsapp',
      logo: '💬',
      status: 'online',
      identificador: '+55 85 99999-1234',
      volumeMensagens: 756,
      percentualTotal: 65,
      uptime: 99.8,
      ultimaSync: 'há 2 min',
      mensagensHoje: 756,
      conectadoDesde: '15/08/2024'
    },
    {
      id: 'telegram-1',
      nome: 'Telegram',
      tipo: 'telegram',
      logo: '✈️',
      status: 'online',
      identificador: '@epicbot',
      volumeMensagens: 89,
      percentualTotal: 8,
      uptime: 99.5,
      ultimaSync: 'há 5 min',
      mensagensHoje: 89,
      conectadoDesde: '20/08/2024'
    },
    {
      id: 'chat-web-1',
      nome: 'Chat Web',
      tipo: 'chat-web',
      logo: '💻',
      status: 'online',
      identificador: 'epic.com',
      volumeMensagens: 234,
      percentualTotal: 20,
      uptime: 100,
      ultimaSync: 'Tempo real',
      mensagensHoje: 234,
      conectadoDesde: '01/08/2024'
    },
    {
      id: 'email-1',
      nome: 'Email',
      tipo: 'email',
      logo: '📧',
      status: 'online',
      identificador: 'SMTP',
      volumeMensagens: 45,
      percentualTotal: 4,
      uptime: 98.9,
      ultimaSync: 'há 1 min',
      mensagensHoje: 45,
      conectadoDesde: '01/08/2024'
    },
    {
      id: 'instagram-1',
      nome: 'Instagram Direct',
      tipo: 'instagram',
      logo: '📷',
      status: 'desconectado',
      identificador: '@epicatendimento',
      volumeMensagens: 0,
      percentualTotal: 0,
      uptime: 85.2,
      ultimaSync: 'há 3h',
      mensagensHoje: 0,
      problemas: 'Token expirado',
      offlineHa: '3 horas',
      mensagensPerdidas: 12
    },
    {
      id: 'sms-1',
      nome: 'SMS',
      tipo: 'sms',
      logo: '📱',
      status: 'disponivel',
      volumeMensagens: 0,
      percentualTotal: 0,
      uptime: 0,
      ultimaSync: '',
      mensagensHoje: 0,
      descricao: 'Envie e receba SMS no Brasil',
      preco: 'A partir de R$ 0,15/SMS'
    },
    {
      id: 'messenger-1',
      nome: 'Messenger (Facebook)',
      tipo: 'messenger',
      logo: '📘',
      status: 'disponivel',
      volumeMensagens: 0,
      percentualTotal: 0,
      uptime: 0,
      ultimaSync: '',
      mensagensHoje: 0,
      descricao: 'Integre com Facebook Pages',
      preco: 'Gratuito'
    }
  ],

  integracoes: [
    {
      id: 'sheets-1',
      nome: 'Google Sheets',
      tipo: 'produtividade',
      logo: '📊',
      status: 'conectada',
      descricao: 'Exporta dados automaticamente',
      conectadaDesde: '01/09/2024',
      ultimaSync: 'há 10 min',
      detalhes: 'Sincronização automática de contatos e relatórios'
    },
    {
      id: 'zapier-1',
      nome: 'Zapier',
      tipo: 'produtividade',
      logo: '⚡',
      status: 'conectada',
      descricao: '3 zaps ativos',
      conectadaDesde: '15/08/2024',
      ultimaSync: 'há 5 min',
      detalhes: 'Automatize workflows entre aplicativos'
    },
    {
      id: 'asaas-1',
      nome: 'Asaas (Pagamentos)',
      tipo: 'pagamento',
      logo: '💰',
      status: 'conectada',
      descricao: 'PIX + Boleto',
      conectadaDesde: '10/09/2024',
      ultimaSync: 'há 2 min',
      detalhes: 'Gateway de pagamentos integrado'
    },
    {
      id: 'pipedrive-1',
      nome: 'Pipedrive',
      tipo: 'crm',
      logo: '🏪',
      status: 'desconectada',
      descricao: 'CRM de vendas completo',
      preco: 'Planos a partir de $14.90/mês'
    },
    {
      id: 'hubspot-1',
      nome: 'HubSpot',
      tipo: 'crm',
      logo: '🎯',
      status: 'desconectada',
      descricao: 'Marketing e vendas integrados',
      preco: 'Versão gratuita disponível'
    },
    {
      id: 'shopify-1',
      nome: 'Shopify',
      tipo: 'ecommerce',
      logo: '🛒',
      status: 'desconectada',
      descricao: 'Plataforma de e-commerce',
      preco: 'Planos a partir de $29/mês'
    },
    {
      id: 'stripe-1',
      nome: 'Stripe',
      tipo: 'pagamento',
      logo: '💳',
      status: 'desconectada',
      descricao: 'Processamento de pagamentos',
      preco: '2.9% + R$0.30 por transação'
    },
    {
      id: 'mailchimp-1',
      nome: 'Mailchimp',
      tipo: 'marketing',
      logo: '📧',
      status: 'desconectada',
      descricao: 'Email marketing profissional',
      preco: 'Grátis até 500 contatos'
    }
  ],

  webhooks: [
    {
      id: 'webhook-1',
      nome: 'Notificar Sistema Externo',
      url: 'https://meu-sistema.com/webhook/epic',
      eventos: ['Nova mensagem', 'Ticket criado', 'Pagamento confirmado'],
      status: 'ativo',
      estatisticas: {
        requisicoesHoje: 234,
        sucessos: 232,
        falhas: 2,
        taxaSucesso: 99.1
      },
      ultimaChamada: {
        quando: 'há 2 min',
        statusCode: 200
      }
    },
    {
      id: 'webhook-2',
      nome: 'Integração Zapier',
      url: 'https://hooks.zapier.com/hooks/catch/123456/xyz',
      eventos: ['Cliente novo', 'Ticket resolvido'],
      status: 'ativo',
      estatisticas: {
        requisicoesHoje: 45,
        sucessos: 45,
        falhas: 0,
        taxaSucesso: 100
      },
      ultimaChamada: {
        quando: 'há 15 min',
        statusCode: 200
      }
    },
    {
      id: 'webhook-3',
      nome: 'Notificação Slack',
      url: 'https://hooks.slack.com/services/T00/B00/xxx',
      eventos: ['Ticket urgente', 'Cliente irritado'],
      status: 'erro',
      estatisticas: {
        requisicoesHoje: 0,
        sucessos: 0,
        falhas: 5,
        taxaSucesso: 0
      },
      ultimaChamada: {
        quando: 'há 3h',
        statusCode: 500
      },
      erro: 'Webhook está falhando. Verifique a URL.'
    }
  ],

  chavesAPI: [
    {
      id: 'key-1',
      nome: 'Produção',
      chave: 'epic_live_sk_abc123def456ghi789jkl012mno345pqr678',
      tipo: 'producao',
      criadaEm: '15/08/2024',
      ultimoUso: 'há 2 minutos',
      requisicoesHoje: 1234,
      permissoes: {
        leitura: true,
        escrita: true
      }
    },
    {
      id: 'key-2',
      nome: 'Desenvolvimento',
      chave: 'epic_test_sk_test123test456test789test012test345',
      tipo: 'desenvolvimento',
      criadaEm: '01/09/2024',
      ultimoUso: 'há 3 horas',
      requisicoesHoje: 45,
      permissoes: {
        leitura: true,
        escrita: false
      }
    }
  ],

  endpointsAPI: {
    mensagens: [
      { metodo: 'POST', caminho: '/messages/send', descricao: 'Enviar mensagem' },
      { metodo: 'GET', caminho: '/messages', descricao: 'Listar mensagens' },
      { metodo: 'GET', caminho: '/messages/:id', descricao: 'Buscar mensagem' }
    ],
    tickets: [
      { metodo: 'POST', caminho: '/tickets', descricao: 'Criar ticket' },
      { metodo: 'GET', caminho: '/tickets', descricao: 'Listar tickets' },
      { metodo: 'GET', caminho: '/tickets/:id', descricao: 'Buscar ticket' },
      { metodo: 'PATCH', caminho: '/tickets/:id', descricao: 'Atualizar ticket' },
      { metodo: 'DELETE', caminho: '/tickets/:id', descricao: 'Excluir ticket' }
    ],
    clientes: [
      { metodo: 'POST', caminho: '/customers', descricao: 'Criar cliente' },
      { metodo: 'GET', caminho: '/customers', descricao: 'Listar clientes' },
      { metodo: 'GET', caminho: '/customers/:id', descricao: 'Buscar cliente' },
      { metodo: 'PATCH', caminho: '/customers/:id', descricao: 'Atualizar cliente' }
    ]
  },

  usoAPI: {
    totalRequisicoes: 34567,
    sucessos: 33890,
    erros: 677,
    endpointMaisUsado: {
      endpoint: 'POST /messages/send',
      requisicoes: 15234
    },
    latenciaMedia: 120
  },

  statusSistema: {
    canal: [
      {
        nome: 'WhatsApp',
        tipo: '💬',
        status: 'online',
        uptime: 99.8,
        latencia: '120ms',
        ultimaAtividade: 'há 2 min'
      },
      {
        nome: 'Instagram',
        tipo: '📷',
        status: 'offline',
        uptime: 85.2,
        latencia: '—',
        ultimaAtividade: 'há 3h'
      },
      {
        nome: 'Telegram',
        tipo: '✈️',
        status: 'online',
        uptime: 99.5,
        latencia: '95ms',
        ultimaAtividade: 'há 5 min'
      },
      {
        nome: 'Email',
        tipo: '📧',
        status: 'online',
        uptime: 98.9,
        latencia: '180ms',
        ultimaAtividade: 'há 1 min'
      },
      {
        nome: 'Chat Web',
        tipo: '💻',
        status: 'online',
        uptime: 100,
        latencia: '50ms',
        ultimaAtividade: 'há 10 seg'
      }
    ],
    integracoes: [
      {
        nome: 'Google Sheets',
        status: 'online',
        syncRate: 99.1,
        ultimaSync: 'há 10 min'
      },
      {
        nome: 'Zapier',
        status: 'online',
        syncRate: 100,
        ultimaSync: 'há 5 min'
      },
      {
        nome: 'Asaas',
        status: 'online',
        syncRate: 98.5,
        ultimaSync: 'há 2 min'
      }
    ],
    webhooks: [
      {
        nome: 'Sistema Externo',
        status: 'online',
        taxaSucesso: 99.1,
        ultimaChamada: 'há 2 min'
      },
      {
        nome: 'Zapier Hook',
        status: 'online',
        taxaSucesso: 100,
        ultimaChamada: 'há 15 min'
      },
      {
        nome: 'Slack Notif.',
        status: 'erro',
        taxaSucesso: 0,
        ultimaChamada: 'há 3h (500)'
      }
    ]
  },

  incidentes: [
    {
      id: 'inc-1',
      data: '09/11/2025 11:00',
      servico: 'Instagram Direct',
      tipo: 'incidente',
      descricao: 'Token de autenticação expirado',
      duracao: '3h (ainda em andamento)',
      resolvido: false
    },
    {
      id: 'inc-2',
      data: '05/11/2025 14:30',
      servico: 'WhatsApp',
      tipo: 'degradacao',
      descricao: 'Latência alta',
      duracao: '15min',
      resolvido: true
    },
    {
      id: 'inc-3',
      data: '01/11/2025 09:00',
      servico: 'Email SMTP',
      tipo: 'incidente',
      descricao: 'Servidor SMTP indisponível',
      duracao: '45min',
      resolvido: true
    }
  ],

  configuracoes: {
    'whatsapp-1': {
      id: 'config-whatsapp-1',
      canalId: 'whatsapp-1',
      nomeExibicao: 'EPIC Atendimento',
      bio: 'Atendimento inteligente 24/7 🤖',
      fotoPerfil: '/logo-epic.png',
      atendimentoAutomatico: {
        responderAutomaticamente: true,
        mensagemAusencia: true,
        iaComoPrimeiro: false
      },
      horarioComercial: {
        semana: { inicio: '09:00', fim: '18:00' },
        sabado: { inicio: '09:00', fim: '13:00' },
        domingo: 'Fechado'
      },
      mensagensAutomaticas: {
        boasVindas: {
          texto: 'Olá! 👋 Bem-vindo à EPIC. Como posso te ajudar?',
          ativa: true
        },
        ausencia: {
          texto: 'Estamos fora do horário. Retornaremos em breve!',
          ativa: true
        }
      },
      notificacoes: {
        novaMensagem: true,
        mensagemNaoEntregue: true,
        mensagemLida: false
      },
      roteamento: 'distribuir',
      limites: {
        maxMensagensHora: 300,
        intervaloMinimo: 2,
        detectarSpam: true,
        limitarMassivo: true
      }
    }
  },

  configuracoesMsg: {
    'whatsapp-1': {
      respostasRapidas: [
        {
          id: 'rr-1',
          comando: '/ola',
          texto: 'Olá! Como posso te ajudar hoje?'
        },
        {
          id: 'rr-2',
          comando: '/prazo',
          texto: 'Nosso prazo de entrega é de 7 a 15 dias úteis'
        },
        {
          id: 'rr-3',
          comando: '/rastreio',
          texto: 'Para rastrear seu pedido, acesse: link.com/rastreio'
        }
      ],
      midias: {
        imagens: true,
        videos: true,
        documentos: true,
        audios: true,
        localizacao: true
      },
      tamanhoMaximoArquivo: 16,
      links: {
        botoesInterativos: true,
        encurtarLinks: true,
        previewLinks: true
      },
      statusLeitura: {
        marcarComoLida: true,
        enviarDigitando: false
      }
    }
  },

  webhooksConfig: {
    'whatsapp-1': {
      id: 'webhook-config-1',
      canalId: 'whatsapp-1',
      url: 'https://seu-sistema.com/webhook/whatsapp',
      token: '••••••••••••••••••••••••••••',
      eventos: [
        'Nova mensagem recebida',
        'Mensagem enviada',
        'Mensagem lida',
        'Status de entrega'
      ],
      ativo: true,
      ultimoTeste: {
        data: '09/11/2025 10:30',
        status: 200
      },
      estatisticas: {
        total: 1234,
        sucessos: 1220,
        falhas: 14
      }
    }
  }
};
