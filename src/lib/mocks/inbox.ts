import { ConversaChat, ClienteInfo, RespostaRapida, SugestaoIA } from '@/tipos/inbox'

export const respostasRapidas: RespostaRapida[] = [
  {
    id: '1',
    atalho: '/ola',
    titulo: 'Saudação',
    conteudo: 'Olá! Como posso te ajudar hoje? 😊',
    categoria: 'Saudações'
  },
  {
    id: '2',
    atalho: '/boasvindas',
    titulo: 'Boas-vindas',
    conteudo: 'Bem-vindo à Kortex! Estou aqui para ajudar. O que você precisa?',
    categoria: 'Saudações'
  },
  {
    id: '3',
    atalho: '/status',
    titulo: 'Verificar Status',
    conteudo: 'Vou verificar o status do seu pedido. Qual o número do pedido?',
    categoria: 'Pedidos'
  },
  {
    id: '4',
    atalho: '/prazo',
    titulo: 'Prazo de Entrega',
    conteudo: 'Nosso prazo de entrega é de 7 a 15 dias úteis após a confirmação do pagamento.',
    categoria: 'Pedidos'
  },
  {
    id: '5',
    atalho: '/rastreio',
    titulo: 'Rastreamento',
    conteudo: 'Para rastrear seu pedido, acesse: https://rastreio.kortex.com',
    categoria: 'Pedidos'
  },
  {
    id: '6',
    atalho: '/pix',
    titulo: 'Pagamento PIX',
    conteudo: 'Ótimo! Vou gerar o código PIX para você agora mesmo.',
    categoria: 'Pagamentos'
  },
  {
    id: '7',
    atalho: '/obrigado',
    titulo: 'Agradecimento',
    conteudo: 'Por nada! Precisando, estamos aqui para ajudar 😊',
    categoria: 'Despedidas'
  },
  {
    id: '8',
    atalho: '/tchau',
    titulo: 'Despedida',
    conteudo: 'Até logo! Tenha um ótimo dia! 👋',
    categoria: 'Despedidas'
  }
]

const clientesMockados: ClienteInfo[] = [
  {
    id: '1',
    nome: 'Maria Silva Santos',
    foto: '👩',
    email: 'maria.silva@email.com',
    telefone: '+55 85 99999-1234',
    whatsapp: '+55 85 99999-1234',
    instagram: '@mariasilva',
    localizacao: {
      cidade: 'Fortaleza',
      estado: 'CE',
      pais: 'Brasil',
      cep: '60000-000'
    },
    aniversario: new Date('1990-03-15'),
    cpf: '123.456.789-00',
    empresa: {
      nome: 'ACME Comércio LTDA',
      cnpj: '12.345.678/0001-00'
    },
    tags: [
      { id: '1', nome: 'VIP', cor: 'red', icone: '🔥' },
      { id: '2', nome: 'Cliente fiel', cor: 'blue' }
    ],
    resumo: {
      ltv: 8450,
      totalPedidos: 15,
      csatMedio: 4.8,
      ultimoPedido: new Date('2025-10-25'),
      ticketsAbertos: 0
    },
    historico: {
      conversas: [
        {
          id: '1',
          data: new Date('2025-11-09'),
          canal: 'whatsapp',
          assunto: 'Pedido atrasado',
          status: 'em_andamento',
          atendenteNome: 'JP',
          csatScore: 5
        },
        {
          id: '2',
          data: new Date('2025-10-25'),
          canal: 'instagram',
          assunto: 'Dúvida sobre produto',
          status: 'resolvido',
          atendenteNome: 'João Santos',
          csatScore: 5
        }
      ],
      pedidos: [
        {
          id: '1',
          numero: '#98765',
          valor: 350,
          produtos: 'Produto X - Modelo Premium',
          data: new Date('2025-11-01'),
          dataPrevista: new Date('2025-11-10'),
          status: 'Em trânsito',
          rastreio: 'BR123456789BR'
        },
        {
          id: '2',
          numero: '#98650',
          valor: 280,
          produtos: 'Produto Y - Standard',
          data: new Date('2025-10-01'),
          status: 'Entregue'
        }
      ],
      pagamentos: [
        {
          id: '1',
          valor: 350,
          metodo: 'PIX',
          status: 'Aprovado',
          data: new Date('2025-11-01')
        }
      ]
    },
    notasInternas: [
      {
        id: '1',
        conversaId: '1',
        atendenteId: '2',
        atendenteNome: 'João Santos',
        conteudo: 'Cliente prefere atendimento rápido. Muito exigente com prazos.',
        timestamp: new Date('2025-10-25')
      }
    ],
    insightsIA: [
      {
        tipo: 'risco_churn',
        titulo: 'Cliente em risco de churn',
        descricao: 'Não compra há 15 dias (acima da média de 10 dias)',
        acoes: ['Enviar cupom', 'Criar campanha']
      },
      {
        tipo: 'oportunidade_upsell',
        titulo: 'Oportunidade de upsell',
        descricao: 'Cliente comprou Produto X 3x. Oferecer Produto X Premium?',
        acoes: ['Enviar oferta']
      }
    ]
  },
  {
    id: '2',
    nome: 'João Santos',
    foto: '👨',
    email: 'joao.santos@email.com',
    telefone: '+55 11 98888-5678',
    instagram: '@joaosantos',
    localizacao: {
      cidade: 'São Paulo',
      estado: 'SP',
      pais: 'Brasil',
      cep: '01000-000'
    },
    tags: [
      { id: '3', nome: 'Vendas', cor: 'green', icone: '🛒' }
    ],
    resumo: {
      ltv: 1200,
      totalPedidos: 3,
      csatMedio: 4.5,
      ultimoPedido: new Date('2025-11-08'),
      ticketsAbertos: 0
    },
    historico: {
      conversas: [],
      pedidos: [],
      pagamentos: []
    },
    notasInternas: [],
    insightsIA: []
  },
  {
    id: '3',
    nome: 'Ana Costa',
    foto: '👩‍💼',
    email: 'ana.costa@email.com',
    telefone: '+55 21 97777-9999',
    localizacao: {
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      pais: 'Brasil',
      cep: '20000-000'
    },
    tags: [
      { id: '4', nome: 'Suporte', cor: 'orange', icone: '🆘' }
    ],
    resumo: {
      ltv: 450,
      totalPedidos: 1,
      csatMedio: 4.0,
      ultimoPedido: new Date('2025-11-05'),
      ticketsAbertos: 1
    },
    historico: {
      conversas: [],
      pedidos: [],
      pagamentos: []
    },
    notasInternas: [],
    insightsIA: []
  },
  {
    id: '4',
    nome: 'Pedro Rocha',
    foto: '👨‍💻',
    email: 'pedro.rocha@email.com',
    telefone: '+55 85 96666-4444',
    telegram: '@pedro_rocha',
    localizacao: {
      cidade: 'Fortaleza',
      estado: 'CE',
      pais: 'Brasil',
      cep: '60000-000'
    },
    tags: [
      { id: '5', nome: 'Cliente novo', cor: 'purple' }
    ],
    resumo: {
      ltv: 0,
      totalPedidos: 0,
      csatMedio: 0,
      ultimoPedido: new Date(),
      ticketsAbertos: 0
    },
    historico: {
      conversas: [],
      pedidos: [],
      pagamentos: []
    },
    notasInternas: [],
    insightsIA: []
  },
  {
    id: '5',
    nome: 'Carlos Oliveira',
    foto: '👨‍🏫',
    email: 'carlos.oliveira@email.com',
    telefone: '+55 31 95555-3333',
    localizacao: {
      cidade: 'Belo Horizonte',
      estado: 'MG',
      pais: 'Brasil',
      cep: '30000-000'
    },
    tags: [
      { id: '6', nome: 'Financeiro', cor: 'yellow', icone: '💰' }
    ],
    resumo: {
      ltv: 2500,
      totalPedidos: 5,
      csatMedio: 4.6,
      ultimoPedido: new Date('2025-10-30'),
      ticketsAbertos: 0
    },
    historico: {
      conversas: [],
      pedidos: [],
      pagamentos: []
    },
    notasInternas: [],
    insightsIA: []
  }
]

export const conversasMockadas: ConversaChat[] = [
  {
    id: '1',
    clienteId: '1',
    clienteNome: 'Maria Silva Santos',
    clienteFoto: '👩',
    canal: 'whatsapp',
    status: 'em_andamento',
    prioridade: 'urgente',
    statusCliente: 'online',
    tags: [
      { id: '1', nome: 'VIP', cor: 'red', icone: '🔥' },
      { id: '7', nome: 'Urgente', cor: 'red' }
    ],
    ultimaMensagem: 'Meu pedido não chegou ainda...',
    ultimaMensagemTipo: 'recebida',
    timestampUltimaMensagem: new Date(Date.now() - 2 * 60 * 1000),
    mensagensNaoLidas: 3,
    atendenteId: '1',
    atendenteNome: 'JP (Você)',
    slaRestante: 18,
    csatScore: 4.8,
    conversaNumero: 12,
    ltv: 8450,
    estaDigitando: false,
    clienteInfo: clientesMockados[0],
    mensagens: [
      {
        id: '1',
        conversaId: '1',
        tipo: 'texto',
        conteudo: 'Olá Maria! 👋\nSou o assistente virtual da Kortex. Como posso ajudar?',
        remetente: 'bot',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'entregue'
      },
      {
        id: '2',
        conversaId: '1',
        tipo: 'texto',
        conteudo: 'Meu pedido #98765 não chegou ainda\nJá passou do prazo',
        remetente: 'cliente',
        timestamp: new Date(Date.now() - 28 * 60 * 1000),
        status: 'lido'
      },
      {
        id: '3',
        conversaId: '1',
        tipo: 'texto',
        conteudo: 'Entendo sua preocupação. Vou verificar o status do pedido.\nUm momento... 🔍',
        remetente: 'bot',
        timestamp: new Date(Date.now() - 28 * 60 * 1000),
        status: 'lido',
        metadados: {
          confiancaIA: 45
        }
      },
      {
        id: '4',
        conversaId: '1',
        tipo: 'sistema',
        conteudo: '🔄 Conversa transferida de IA para JP (Você)\nMotivo: Cliente solicitou atendimento humano',
        remetente: 'sistema',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        status: 'lido',
        metadados: {
          motivoTransferencia: 'Cliente solicitou atendimento humano'
        }
      },
      {
        id: '5',
        conversaId: '1',
        tipo: 'texto',
        conteudo: 'Olá Maria! Sou JP, vou te ajudar agora 😊\nDeixa eu verificar seu pedido #98765',
        remetente: 'atendente',
        remetenteId: '1',
        remetenteNome: 'JP',
        timestamp: new Date(Date.now() - 24 * 60 * 1000),
        status: 'lido'
      },
      {
        id: '6',
        conversaId: '1',
        tipo: 'texto',
        conteudo: 'Obrigada! Estou preocupada\nPreciso urgente',
        remetente: 'cliente',
        timestamp: new Date(Date.now() - 23 * 60 * 1000),
        status: 'lido'
      },
      {
        id: '7',
        conversaId: '1',
        tipo: 'texto',
        conteudo: 'Entendo perfeitamente! Já localizei:\n\n📦 Pedido #98765\nStatus: Em trânsito\nPrevisão: Chega amanhã (10/11) até 18h\n\nRastreio: BR123456789BR\n[VER RASTREAMENTO COMPLETO]',
        remetente: 'atendente',
        remetenteId: '1',
        remetenteNome: 'JP',
        timestamp: new Date(Date.now() - 22 * 60 * 1000),
        status: 'enviando'
      }
    ],
    notasInternas: [
      {
        id: '1',
        conversaId: '1',
        atendenteId: '2',
        atendenteNome: 'João Santos',
        conteudo: '@JP essa cliente é VIP, pode oferecer frete grátis na próxima',
        timestamp: new Date(Date.now() - 21 * 60 * 1000),
        mencoes: ['JP']
      }
    ]
  },
  {
    id: '2',
    clienteId: '2',
    clienteNome: 'João Santos',
    clienteFoto: '👨',
    canal: 'instagram',
    status: 'aberto',
    prioridade: 'normal',
    statusCliente: 'online',
    tags: [
      { id: '3', nome: 'Vendas', cor: 'green', icone: '🛒' }
    ],
    ultimaMensagem: 'Quanto custa o produto X?',
    ultimaMensagemTipo: 'recebida',
    timestampUltimaMensagem: new Date(Date.now() - 5 * 60 * 1000),
    mensagensNaoLidas: 1,
    slaRestante: 55,
    conversaNumero: 1,
    ltv: 1200,
    estaDigitando: false,
    clienteInfo: clientesMockados[1],
    mensagens: [
      {
        id: '1',
        conversaId: '2',
        tipo: 'texto',
        conteudo: 'Quanto custa o produto X?',
        remetente: 'cliente',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'entregue'
      },
      {
        id: '2',
        conversaId: '2',
        tipo: 'texto',
        conteudo: '🤖 IA respondendo...',
        remetente: 'bot',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'enviando'
      }
    ],
    notasInternas: []
  },
  {
    id: '3',
    clienteId: '3',
    clienteNome: 'Ana Costa',
    clienteFoto: '👩‍💼',
    canal: 'chat_web',
    status: 'aguardando_cliente',
    prioridade: 'normal',
    statusCliente: 'ausente',
    tags: [
      { id: '4', nome: 'Suporte', cor: 'orange', icone: '🆘' }
    ],
    ultimaMensagem: 'Você: "Vou verificar isso para você"',
    ultimaMensagemTipo: 'enviada',
    timestampUltimaMensagem: new Date(Date.now() - 15 * 60 * 1000),
    mensagensNaoLidas: 0,
    atendenteId: '1',
    atendenteNome: 'JP (Você)',
    conversaNumero: 8,
    ltv: 450,
    estaDigitando: false,
    clienteInfo: clientesMockados[2],
    mensagens: [
      {
        id: '1',
        conversaId: '3',
        tipo: 'texto',
        conteudo: 'Preciso de ajuda com o sistema',
        remetente: 'cliente',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        status: 'lido'
      },
      {
        id: '2',
        conversaId: '3',
        tipo: 'texto',
        conteudo: 'Vou verificar isso para você',
        remetente: 'atendente',
        remetenteId: '1',
        remetenteNome: 'JP',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: 'lido'
      }
    ],
    notasInternas: []
  },
  {
    id: '4',
    clienteId: '4',
    clienteNome: 'Pedro Rocha',
    clienteFoto: '👨‍💻',
    canal: 'telegram',
    status: 'aberto',
    prioridade: 'normal',
    statusCliente: 'online',
    tags: [
      { id: '5', nome: 'Cliente novo', cor: 'purple' }
    ],
    ultimaMensagem: 'Olá, gostaria de saber...',
    ultimaMensagemTipo: 'recebida',
    timestampUltimaMensagem: new Date(Date.now() - 60 * 60 * 1000),
    mensagensNaoLidas: 0,
    atendenteId: '3',
    atendenteNome: 'Maria Silva',
    conversaNumero: 1,
    ltv: 0,
    estaDigitando: false,
    clienteInfo: clientesMockados[3],
    mensagens: [
      {
        id: '1',
        conversaId: '4',
        tipo: 'texto',
        conteudo: 'Olá, gostaria de saber mais sobre os produtos',
        remetente: 'cliente',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        status: 'lido'
      }
    ],
    notasInternas: []
  },
  {
    id: '5',
    clienteId: '5',
    clienteNome: 'Carlos Oliveira',
    clienteFoto: '👨‍🏫',
    canal: 'email',
    status: 'aberto',
    prioridade: 'normal',
    statusCliente: 'offline',
    tags: [
      { id: '6', nome: 'Financeiro', cor: 'yellow', icone: '💰' }
    ],
    ultimaMensagem: 'Sobre a fatura #1234...',
    ultimaMensagemTipo: 'recebida',
    timestampUltimaMensagem: new Date(Date.now() - 3 * 60 * 60 * 1000),
    mensagensNaoLidas: 0,
    atendenteId: '2',
    atendenteNome: 'João Santos',
    conversaNumero: 5,
    ltv: 2500,
    estaDigitando: false,
    clienteInfo: clientesMockados[4],
    mensagens: [
      {
        id: '1',
        conversaId: '5',
        tipo: 'texto',
        conteudo: 'Sobre a fatura #1234, gostaria de esclarecimentos',
        remetente: 'cliente',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        status: 'lido'
      }
    ],
    notasInternas: []
  }
]

export const sugestoesIA: SugestaoIA[] = [
  {
    id: '1',
    tipo: 'resposta',
    conteudo: 'Vou monitorar pessoalmente e te aviso quando sair para entrega amanhã 😊',
    confianca: 85,
    contexto: 'Cliente VIP preocupado com prazo'
  },
  {
    id: '2',
    tipo: 'resposta',
    conteudo: 'Como cortesia pelo atraso, vou te enviar um cupom de 10% OFF na próxima compra!',
    confianca: 90,
    contexto: 'Cliente VIP com pedido atrasado'
  },
  {
    id: '3',
    tipo: 'resposta',
    conteudo: 'Gostaria que eu te enviasse o link de rastreamento por SMS?',
    confianca: 80
  },
  {
    id: '4',
    tipo: 'acao',
    conteudo: 'Gerar cupom de desconto',
    confianca: 85,
    contexto: 'Cliente VIP insatisfeito'
  },
  {
    id: '5',
    tipo: 'acao',
    conteudo: 'Criar lembrete para acompanhar entrega amanhã',
    confianca: 75
  },
  {
    id: '6',
    tipo: 'insight',
    conteudo: 'Cliente parece ansioso. Ofereça acompanhamento proativo.',
    confianca: 70
  }
]
