import { DadosPagamentos, RecursoPlano, Pagamento } from '@/tipos/pagamentos';

const recursos: RecursoPlano[] = [
  { id: '1', nome: 'Até 15 usuários', incluido: true, tipo: 'incluso' },
  { id: '2', nome: '5.000 conversas/mês', incluido: true, tipo: 'incluso' },
  { id: '3', nome: '100.000 requisições IA/mês', incluido: true, tipo: 'incluso' },
  { id: '4', nome: 'Todos os canais (WhatsApp, Instagram, Telegram, Email, Chat Web)', incluido: true, tipo: 'incluso' },
  { id: '5', nome: 'IA & Automações ilimitadas', incluido: true, tipo: 'incluso' },
  { id: '6', nome: 'CRM completo', incluido: true, tipo: 'incluso' },
  { id: '7', nome: 'Relatórios avançados', incluido: true, tipo: 'incluso' },
  { id: '8', nome: 'Integrações ilimitadas', incluido: true, tipo: 'incluso' },
  { id: '9', nome: 'API completa', incluido: true, tipo: 'incluso' },
  { id: '10', nome: 'Webhooks ilimitados', incluido: true, tipo: 'incluso' },
  { id: '11', nome: 'Suporte prioritário (resposta em até 4h)', incluido: true, tipo: 'incluso' },
  { id: '12', nome: 'Armazenamento: 50GB', incluido: true, tipo: 'incluso' },
  { id: '13', nome: 'Backup diário', incluido: true, tipo: 'incluso' },
  { id: '14', nome: 'White-label (disponível no Enterprise)', incluido: false, tipo: 'nao-disponivel' },
  { id: '15', nome: 'Gerente de conta dedicado (disponível no Enterprise)', incluido: false, tipo: 'nao-disponivel' },
  { id: '16', nome: 'SLA de 99.9% (disponível no Enterprise)', incluido: false, tipo: 'nao-disponivel' },
];

// Mock de pagamentos para a nova estrutura
export const pagamentosMock: Pagamento[] = [
  {
    id: '1',
    protocolo: 'PAG-2025-001',
    prestadorNome: 'Carlos Silva Reboque',
    prestadorTelefone: '(11) 98765-4321',
    servicoTipo: 'reboque',
    servicoDescricao: 'Reboque de veículo',
    valor: 350.00,
    status: 'pendente',
    dataCriacao: '2024-01-20T14:30:00',
    dataVencimento: '2024-01-25T23:59:59',
    ticketProtocolo: 'AST123456001',
    clienteNome: 'João Silva',
    metodoPagamento: 'pix',
    observacoes: 'Aguardando confirmação do prestador'
  },
  {
    id: '2',
    protocolo: 'PAG-2025-002',
    prestadorNome: 'Maria Santos Mecânica',
    prestadorTelefone: '(11) 97654-3210',
    servicoTipo: 'pneu',
    servicoDescricao: 'Troca de pneu',
    valor: 180.00,
    status: 'pendente',
    dataCriacao: '2024-01-20T13:15:00',
    dataVencimento: '2024-01-23T23:59:59',
    ticketProtocolo: 'AST123456002',
    clienteNome: 'Maria Santos',
    metodoPagamento: 'transferencia',
    observacoes: 'Serviço concluído, aguardando pagamento'
  },
  {
    id: '3',
    protocolo: 'PAG-2025-003',
    prestadorNome: 'Pedro Auto Socorro',
    prestadorTelefone: '(11) 96543-2109',
    servicoTipo: 'combustivel',
    servicoDescricao: 'Abastecimento emergencial',
    valor: 120.00,
    status: 'pendente',
    dataCriacao: '2024-01-20T14:45:00',
    dataVencimento: '2024-01-22T23:59:59',
    ticketProtocolo: 'AST123456003',
    clienteNome: 'Pedro Oliveira',
    metodoPagamento: 'pix',
    observacoes: 'Pagamento urgente'
  },
  {
    id: '4',
    protocolo: 'PAG-2025-004',
    prestadorNome: 'José Chaveiro 24h',
    prestadorTelefone: '(11) 98888-7777',
    servicoTipo: 'chaveiro',
    servicoDescricao: 'Abertura de veículo',
    valor: 150.00,
    status: 'finalizado',
    dataCriacao: '2024-01-20T10:00:00',
    dataVencimento: '2024-01-25T23:59:59',
    dataPagamento: '2024-01-20T15:30:00',
    ticketProtocolo: 'AST123456004',
    clienteNome: 'Ana Costa',
    metodoPagamento: 'pix',
    comprovante: 'COMP-20240120-001.pdf'
  },
  {
    id: '5',
    protocolo: 'PAG-2025-005',
    prestadorNome: 'Roberto Mecânica Express',
    prestadorTelefone: '(11) 94321-0987',
    servicoTipo: 'mecanica',
    servicoDescricao: 'Reparo mecânico',
    valor: 450.00,
    status: 'finalizado',
    dataCriacao: '2024-01-19T16:00:00',
    dataVencimento: '2024-01-24T23:59:59',
    dataPagamento: '2024-01-19T18:45:00',
    ticketProtocolo: 'AST123456005',
    clienteNome: 'Roberto Lima',
    metodoPagamento: 'transferencia',
    comprovante: 'COMP-20240119-002.pdf'
  },
  {
    id: '6',
    protocolo: 'PAG-2025-006',
    prestadorNome: 'Fernanda Reboque Rápido',
    prestadorTelefone: '(11) 93210-9876',
    servicoTipo: 'reboque',
    servicoDescricao: 'Reboque longa distância',
    valor: 580.00,
    status: 'finalizado',
    dataCriacao: '2024-01-19T14:30:00',
    dataVencimento: '2024-01-24T23:59:59',
    dataPagamento: '2024-01-19T16:20:00',
    ticketProtocolo: 'AST123456006',
    clienteNome: 'Fernanda Souza',
    metodoPagamento: 'pix',
    comprovante: 'COMP-20240119-003.pdf'
  },
  {
    id: '7',
    protocolo: 'PAG-2025-007',
    prestadorNome: 'Lucas Bateria Express',
    prestadorTelefone: '(11) 99876-5432',
    servicoTipo: 'bateria',
    servicoDescricao: 'Troca de bateria',
    valor: 280.00,
    status: 'finalizado',
    dataCriacao: '2024-01-18T11:20:00',
    dataVencimento: '2024-01-23T23:59:59',
    dataPagamento: '2024-01-18T14:10:00',
    ticketProtocolo: 'AST123456007',
    clienteNome: 'Lucas Mendes',
    metodoPagamento: 'pix',
    comprovante: 'COMP-20240118-001.pdf'
  },
  {
    id: '8',
    protocolo: 'PAG-2025-008',
    prestadorNome: 'Amanda Auto Elétrica',
    prestadorTelefone: '(11) 98765-1234',
    servicoTipo: 'bateria',
    servicoDescricao: 'Reparo elétrico',
    valor: 320.00,
    status: 'finalizado',
    dataCriacao: '2024-01-17T09:45:00',
    dataVencimento: '2024-01-22T23:59:59',
    dataPagamento: '2024-01-17T12:30:00',
    ticketProtocolo: 'AST123456008',
    clienteNome: 'Amanda Rodrigues',
    metodoPagamento: 'transferencia',
    comprovante: 'COMP-20240117-001.pdf'
  }
];

export const dadosPagamentosMock: DadosPagamentos = {
  planoAtual: {
    id: '1',
    nome: 'Professional',
    valor: 497,
    status: 'ativo',
    proximaCobranca: '15/12/2025',
    cartaoFinal: '1234',
    statusPagamento: 'em-dia'
  },
  usoPlano: {
    usuarios: {
      usado: 12,
      total: 15,
      disponivel: 3
    },
    conversas: {
      usado: 1234,
      total: 5000,
      disponivel: 3766
    },
    receitaChat: {
      valor: 45678,
      ilimitado: true
    },
    requisicoesIA: {
      usado: 34567,
      total: 100000,
      disponivel: 65433
    },
    percentualUso: 35
  },
  recursos,
  historicoAssinatura: [
    {
      id: '1',
      data: '15/11/2025',
      tipo: 'pagamento',
      descricao: 'Pagamento confirmado',
      valor: 497,
      status: 'confirmado',
      detalhes: 'R$ 497,00 | Cartão final •••• 1234\nRef: Período 15/11 a 15/12'
    },
    {
      id: '2',
      data: '15/10/2025',
      tipo: 'pagamento',
      descricao: 'Pagamento confirmado',
      valor: 497,
      status: 'confirmado',
      detalhes: 'R$ 497,00 | Cartão final •••• 1234\nRef: Período 15/10 a 15/11'
    },
    {
      id: '3',
      data: '01/10/2025',
      tipo: 'upgrade',
      descricao: 'Upgrade para Professional',
      valor: 150,
      status: 'confirmado',
      detalhes: 'De: Starter (R$ 197/mês) → Professional (R$ 497/mês)\nCobrado valor proporcional: R$ 150,00'
    },
    {
      id: '4',
      data: '15/09/2025',
      tipo: 'pagamento',
      descricao: 'Pagamento confirmado',
      valor: 197,
      status: 'confirmado',
      detalhes: 'R$ 197,00 | Plano Starter'
    },
    {
      id: '5',
      data: '15/08/2025',
      tipo: 'inicio',
      descricao: 'Assinatura iniciada',
      status: 'confirmado',
      detalhes: 'Plano: Starter | Trial de 14 dias grátis'
    }
  ],
  faturas: [
    {
      id: '1',
      numero: '1024',
      periodo: '15/11-15/12',
      valor: 497,
      status: 'paga',
      vencimento: '15/11/25',
      pagamento: '15/11/25 08:30',
      itens: [
        { descricao: 'Plano Professional - Período: 15/11/2025 a 15/12/2025', valor: 497 },
        { descricao: 'Usuários adicionais: 0', valor: 0 },
        { descricao: 'Conversas extras: 0', valor: 0 }
      ],
      cliente: {
        nome: 'EPIC Clientes LTDA',
        cnpj: '98.765.432/0001-00',
        email: 'joe@epic.com'
      }
    },
    {
      id: '2',
      numero: '1023',
      periodo: '15/10-15/11',
      valor: 497,
      status: 'paga',
      vencimento: '15/10/25',
      pagamento: '15/10/25 07:15',
      itens: [
        { descricao: 'Plano Professional - Período: 15/10/2025 a 15/11/2025', valor: 497 }
      ],
      cliente: {
        nome: 'EPIC Clientes LTDA',
        cnpj: '98.765.432/0001-00',
        email: 'joe@epic.com'
      }
    },
    {
      id: '3',
      numero: '1022',
      periodo: 'Upgrade Proporcional',
      valor: 150,
      status: 'paga',
      vencimento: '01/10/25',
      pagamento: '01/10/25 14:45',
      itens: [
        { descricao: 'Upgrade para Professional - Valor proporcional (15 dias)', valor: 150 }
      ],
      cliente: {
        nome: 'EPIC Clientes LTDA',
        cnpj: '98.765.432/0001-00',
        email: 'joe@epic.com'
      }
    },
    {
      id: '4',
      numero: '1021',
      periodo: '15/09-15/10 (Starter)',
      valor: 197,
      status: 'paga',
      vencimento: '15/09/25',
      pagamento: '15/09/25 09:20',
      itens: [
        { descricao: 'Plano Starter - Período: 15/09/2025 a 15/10/2025', valor: 197 }
      ],
      cliente: {
        nome: 'EPIC Clientes LTDA',
        cnpj: '98.765.432/0001-00',
        email: 'joe@epic.com'
      }
    },
    {
      id: '5',
      numero: '1020',
      periodo: '15/08-15/09 (14 dias)',
      valor: 0,
      status: 'trial',
      vencimento: '-',
      itens: [
        { descricao: 'Trial gratuito - 14 dias', valor: 0 }
      ],
      cliente: {
        nome: 'EPIC Clientes LTDA',
        cnpj: '98.765.432/0001-00',
        email: 'joe@epic.com'
      }
    }
  ],
  metodosPagamento: [
    {
      id: '1',
      tipo: 'credito',
      bandeira: 'Visa',
      numeroFinal: '1234',
      vencimento: '08/2027',
      titular: 'JOE SILVA',
      principal: true,
      cadastradoEm: '15/08/2024'
    },
    {
      id: '2',
      tipo: 'credito',
      bandeira: 'Mastercard',
      numeroFinal: '5678',
      vencimento: '12/2026',
      titular: 'EPIC LTDA',
      principal: false,
      cadastradoEm: '20/09/2024'
    }
  ],
  notificacoes: {
    seteDias: true,
    tresDias: true,
    diaVencimento: true,
    pagamentoConfirmado: true,
    pagamentoFalhou: true,
    emails: ['joe@epic.com', 'financeiro@epic.com']
  },
  configuracaoFalha: {
    tentarNovamente: true,
    usarBackup: false,
    notificarApenasManual: false
  },
  planos: [
    {
      id: '1',
      nome: 'Starter',
      valor: 197,
      descricao: 'Ideal para pequenas empresas',
      usuarios: 5,
      conversas: 1000,
      requisicoesIA: 20000,
      recursos: [
        { id: '1', nome: 'Todos os canais', incluido: true, tipo: 'incluso' },
        { id: '2', nome: 'IA básica', incluido: true, tipo: 'incluso' },
        { id: '3', nome: 'CRM básico', incluido: true, tipo: 'incluso' },
        { id: '4', nome: 'Relatórios', incluido: true, tipo: 'incluso' },
        { id: '5', nome: 'Integrações limitadas', incluido: true, tipo: 'incluso' },
        { id: '6', nome: 'API básica', incluido: true, tipo: 'incluso' },
        { id: '7', nome: 'Suporte email', incluido: true, tipo: 'incluso' },
        { id: '8', nome: '10GB storage', incluido: true, tipo: 'incluso' },
        { id: '9', nome: 'White-label', incluido: false, tipo: 'nao-disponivel' },
        { id: '10', nome: 'SLA garantido', incluido: false, tipo: 'nao-disponivel' }
      ]
    },
    {
      id: '2',
      nome: 'Professional',
      valor: 497,
      descricao: 'Ideal para médias empresas',
      usuarios: 15,
      conversas: 5000,
      requisicoesIA: 100000,
      recursos: [
        { id: '1', nome: 'Todos os canais', incluido: true, tipo: 'incluso' },
        { id: '2', nome: 'IA avançada', incluido: true, tipo: 'incluso' },
        { id: '3', nome: 'CRM completo', incluido: true, tipo: 'incluso' },
        { id: '4', nome: 'Relatórios+', incluido: true, tipo: 'incluso' },
        { id: '5', nome: 'Integrações ilimitadas', incluido: true, tipo: 'incluso' },
        { id: '6', nome: 'API completa', incluido: true, tipo: 'incluso' },
        { id: '7', nome: 'Suporte 4h', incluido: true, tipo: 'incluso' },
        { id: '8', nome: '50GB storage', incluido: true, tipo: 'incluso' },
        { id: '9', nome: 'White-label', incluido: false, tipo: 'nao-disponivel' },
        { id: '10', nome: 'SLA garantido', incluido: false, tipo: 'nao-disponivel' }
      ],
      popular: true,
      atual: true
    },
    {
      id: '3',
      nome: 'Enterprise',
      valor: 997,
      descricao: 'Ideal para grandes empresas',
      usuarios: 50,
      conversas: 20000,
      requisicoesIA: 500000,
      recursos: [
        { id: '1', nome: 'Todos os canais', incluido: true, tipo: 'incluso' },
        { id: '2', nome: 'IA premium', incluido: true, tipo: 'incluso' },
        { id: '3', nome: 'CRM avançado', incluido: true, tipo: 'incluso' },
        { id: '4', nome: 'Analytics', incluido: true, tipo: 'incluso' },
        { id: '5', nome: 'Integrações prioritárias', incluido: true, tipo: 'incluso' },
        { id: '6', nome: 'API premium', incluido: true, tipo: 'incluso' },
        { id: '7', nome: 'Suporte 1h', incluido: true, tipo: 'incluso' },
        { id: '8', nome: '200GB storage', incluido: true, tipo: 'incluso' },
        { id: '9', nome: 'White-label', incluido: true, tipo: 'incluso' },
        { id: '10', nome: 'SLA 99.9%', incluido: true, tipo: 'incluso' }
      ]
    },
    {
      id: '4',
      nome: 'Custom',
      valor: 0,
      valorCustom: true,
      descricao: 'Ideal para corporações',
      usuarios: 'ilimitado',
      conversas: 'ilimitado',
      requisicoesIA: 'ilimitado',
      recursos: [
        { id: '1', nome: 'Todos os canais', incluido: true, tipo: 'incluso' },
        { id: '2', nome: 'IA custom', incluido: true, tipo: 'incluso' },
        { id: '3', nome: 'CRM enterprise', incluido: true, tipo: 'incluso' },
        { id: '4', nome: 'BI completo', incluido: true, tipo: 'incluso' },
        { id: '5', nome: 'Integrações dedicadas', incluido: true, tipo: 'incluso' },
        { id: '6', nome: 'API enterprise', incluido: true, tipo: 'incluso' },
        { id: '7', nome: 'Suporte 24/7', incluido: true, tipo: 'incluso' },
        { id: '8', nome: 'Storage custom', incluido: true, tipo: 'incluso' },
        { id: '9', nome: 'White-label', incluido: true, tipo: 'incluso' },
        { id: '10', nome: 'SLA 99.99%', incluido: true, tipo: 'incluso' },
        { id: '11', nome: 'Gerente de conta', incluido: true, tipo: 'incluso' }
      ]
    }
  ]
};
