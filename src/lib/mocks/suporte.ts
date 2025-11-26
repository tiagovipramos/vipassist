import { 
  Ticket, 
  ArtigoBase, 
  CategoriaBase, 
  TopicoPopular, 
  Tutorial,
  Novidade,
  StatusServico,
  Incidente,
  ManutencaoProgramada,
  AcaoRapida,
  SugestaoAjuda,
  ContatoSuporte
} from '@/tipos/suporte';

// Ações Rápidas
export const acoesRapidas: AcaoRapida[] = [
  {
    id: '1',
    titulo: 'CHAT AO VIVO',
    icone: '💬',
    descricao: 'Fale com nosso time agora',
    tempo: 'Online agora',
    disponivel: true,
    acao: 'Iniciar Chat'
  },
  {
    id: '2',
    titulo: 'ABRIR TICKET',
    icone: '🎫',
    descricao: 'Registre seu problema',
    tempo: 'Resposta em 4h',
    disponivel: true,
    acao: 'Criar Ticket'
  },
  {
    id: '3',
    titulo: 'ENVIAR EMAIL',
    icone: '📧',
    descricao: 'Envie detalhes por email',
    tempo: 'Resposta em 24h',
    disponivel: true,
    acao: 'Enviar Email'
  },
  {
    id: '4',
    titulo: 'AGENDAR CALL',
    icone: '📞',
    descricao: 'Conversa com especialista',
    tempo: 'Disponível',
    disponivel: true,
    acao: 'Agendar'
  }
];

// Sugestões de Ajuda
export const sugestoesAjuda: SugestaoAjuda[] = [
  {
    id: '1',
    titulo: 'Como conectar Instagram Direct ao Kortex',
    icone: '📱',
    categoria: 'Canais'
  },
  {
    id: '2',
    titulo: 'Melhorando a taxa de acerto da sua IA',
    icone: '🤖',
    categoria: 'IA'
  },
  {
    id: '3',
    titulo: 'Exportando relatórios personalizados',
    icone: '📊',
    categoria: 'Relatórios'
  }
];

// Tópicos Populares
export const topicosPopulares: TopicoPopular[] = [
  {
    id: '1',
    titulo: 'PRIMEIROS PASSOS',
    icone: '📱',
    visualizacoes: 1200,
    itens: [
      'Como conectar o WhatsApp Business',
      'Convidar membros da equipe',
      'Configurar horário de atendimento',
      'Personalizar mensagens automáticas'
    ]
  },
  {
    id: '2',
    titulo: 'INTELIGÊNCIA ARTIFICIAL',
    icone: '🤖',
    visualizacoes: 890,
    itens: [
      'Como treinar a IA',
      'Melhorar taxa de acerto',
      'Quando a IA escala para humano',
      'Adicionar artigos à base de conhecimento'
    ]
  },
  {
    id: '3',
    titulo: 'AUTOMAÇÕES',
    icone: '⚡',
    visualizacoes: 756,
    itens: [
      'Criar automação de mensagem de boas-vindas',
      'Configurar roteamento inteligente',
      'Enviar mensagens automáticas fora do horário',
      'Criar fluxos de atendimento'
    ]
  },
  {
    id: '4',
    titulo: 'INTEGRAÇÕES',
    icone: '🔗',
    visualizacoes: 645,
    itens: [
      'Conectar Google Sheets',
      'Integrar com Zapier',
      'Configurar webhooks',
      'Usar API do Kortex'
    ]
  },
  {
    id: '5',
    titulo: 'SOLUÇÃO DE PROBLEMAS',
    icone: '🐛',
    visualizacoes: 512,
    itens: [
      'WhatsApp desconectou - como reconectar',
      'Mensagens não estão sendo entregues',
      'IA não está respondendo corretamente',
      'Erro ao carregar conversas'
    ]
  }
];

// Novidades
export const novidades: Novidade[] = [
  {
    id: '1',
    versao: '2.5.0',
    data: '09/11/2025',
    tipo: 'feature',
    titulo: 'Versão 2.5.0',
    itens: [
      { tipo: 'novo', descricao: 'Nova interface de IA & Automações' },
      { tipo: 'novo', descricao: 'Suporte a Instagram Reels' },
      { tipo: 'novo', descricao: 'Relatórios personalizáveis' },
      { tipo: 'corrigido', descricao: 'Correção de bugs no chat web' }
    ]
  },
  {
    id: '2',
    versao: '2.4.8',
    data: '01/11/2025',
    tipo: 'melhoria',
    titulo: 'Versão 2.4.8',
    itens: [
      { tipo: 'melhorado', descricao: 'Integração com Telegram aprimorada' },
      { tipo: 'novo', descricao: 'Novos templates de mensagens' },
      { tipo: 'melhorado', descricao: 'Performance melhorada em 30%' }
    ]
  }
];

// Contatos de Suporte
export const contatosSuporte: ContatoSuporte[] = [
  {
    tipo: 'chat',
    titulo: 'CHAT AO VIVO',
    info: 'Tempo médio de resposta: 2 minutos',
    disponibilidade: 'Seg-Sex 8h-18h',
    status: 'online',
    acao: 'Iniciar Chat Agora'
  },
  {
    tipo: 'email',
    titulo: 'EMAIL',
    info: 'suporte@kortex.com',
    disponibilidade: 'Resposta em até 4 horas (Professional)',
    acao: 'Enviar Email'
  },
  {
    tipo: 'telefone',
    titulo: 'TELEFONE',
    info: '+55 85 3456-7890',
    disponibilidade: 'Seg-Sex: 8h às 18h',
    acao: 'Ligar Agora'
  },
  {
    tipo: 'whatsapp',
    titulo: 'WHATSAPP EMPRESARIAL',
    info: '+55 85 99999-0000',
    disponibilidade: 'Para clientes Enterprise',
    acao: 'Abrir WhatsApp'
  }
];

// Categorias da Base de Conhecimento
export const categoriasBase: CategoriaBase[] = [
  {
    id: '1',
    nome: 'COMEÇANDO',
    icone: '🚀',
    totalArtigos: 45,
    descricao: 'Primeiros passos com o sistema',
    subtopicos: ['Primeiros passos', 'Configuração inicial', 'Tour guiado']
  },
  {
    id: '2',
    nome: 'CANAIS',
    icone: '📱',
    totalArtigos: 67,
    descricao: 'Conectar e gerenciar canais',
    subtopicos: ['WhatsApp', 'Instagram', 'Telegram', 'Email', 'Chat Web']
  },
  {
    id: '3',
    nome: 'IA & AUTOMAÇÃO',
    icone: '🤖',
    totalArtigos: 89,
    descricao: 'Inteligência artificial e automações',
    subtopicos: ['Configurar IA', 'Automações', 'Treinamento', 'Webhooks']
  },
  {
    id: '4',
    nome: 'GESTÃO EQUIPE',
    icone: '👥',
    totalArtigos: 34,
    descricao: 'Gerenciar equipe e permissões',
    subtopicos: ['Adicionar usuários', 'Permissões', 'Departamentos']
  },
  {
    id: '5',
    nome: 'ATENDIMENTO',
    icone: '💬',
    totalArtigos: 56,
    descricao: 'Gestão de atendimento',
    subtopicos: ['Inbox', 'Roteamento', 'Priorização', 'Canned']
  },
  {
    id: '6',
    nome: 'RELATÓRIOS',
    icone: '📊',
    totalArtigos: 23,
    descricao: 'Relatórios e analytics',
    subtopicos: ['Dashboards', 'Exportar', 'Métricas', 'Analytics']
  },
  {
    id: '7',
    nome: 'INTEGRAÇÕES',
    icone: '🔗',
    totalArtigos: 45,
    descricao: 'Integrações externas',
    subtopicos: ['Zapier', 'API', 'Google Sheets', 'Webhooks']
  },
  {
    id: '8',
    nome: 'FATURAMENTO',
    icone: '💳',
    totalArtigos: 12,
    descricao: 'Planos e pagamentos',
    subtopicos: ['Planos', 'Upgrade', 'Faturas', 'Pagamento']
  }
];

// Artigo Exemplo
export const artigoWhatsApp: ArtigoBase = {
  id: '1',
  titulo: 'Como Conectar o WhatsApp Business',
  slug: 'como-conectar-whatsapp-business',
  categoria: 'Canais',
  subcategoria: 'WhatsApp',
  resumo: 'Aprenda a conectar sua conta do WhatsApp Business ao Kortex em poucos minutos.',
  conteudo: `# Como Conectar o WhatsApp Business

Neste guia, você aprenderá a conectar sua conta do WhatsApp Business ao Kortex em poucos minutos.

## 1. Pré-requisitos

Antes de começar, você precisa:
- ✅ Ter uma conta WhatsApp Business ativa
- ✅ Ter acesso ao celular com WhatsApp instalado
- ✅ Estar logado no Kortex como administrador

⚠️ **Importante:** Use apenas WhatsApp Business, não funciona com WhatsApp pessoal comum.

## 2. Passo a passo da conexão

### Passo 1: Acesse Canais & Integrações
No menu lateral, clique em **Canais & Integrações**

### Passo 2: Clique em "Conectar WhatsApp"
Na seção de canais, localize o card do WhatsApp e clique no botão **[+ CONECTAR]**

### Passo 3: Escaneie o QR Code
Um QR Code será exibido. Abra o WhatsApp no seu celular e:
1. Vá em **Configurações** (⚙️)
2. Toque em **Aparelhos conectados**
3. Toque em **Conectar um aparelho**
4. Aponte a câmera para o QR Code na tela

### Passo 4: Aguarde a confirmação
Após escanear, aguarde alguns segundos. Você verá uma mensagem de **"Conectado com sucesso! ✅"**

## 3. Verificando a conexão

Para verificar se está tudo funcionando:
1. Envie uma mensagem de teste pelo WhatsApp
2. Veja se ela aparece na sua Inbox do Kortex
3. Responda pela plataforma e confira no celular

🟢 **Tudo certo?** Seu WhatsApp está conectado!

## 4. Solução de problemas

### QR Code não aparece
- Limpe o cache do navegador
- Tente em modo anônimo
- Use navegador Chrome atualizado

### Conexão cai frequentemente
- Mantenha o celular com internet estável
- Não deslogue do WhatsApp no celular
- Evite conectar o mesmo número em múltiplas plataformas

### Mensagens não chegam
- Verifique se o número não está bloqueado
- Confirme que o WhatsApp está ativo
- Reconecte o canal

💡 **Ainda com problemas?** Abra um ticket de suporte.

## 5. Próximos passos

Agora que seu WhatsApp está conectado, você pode:
- Configurar mensagens automáticas
- Criar automações de boas-vindas
- Configurar IA para atendimento
- Personalizar horário de atendimento`,
  visualizacoes: 1245,
  avaliacao: {
    media: 4.8,
    total: 89,
    positivos: 87,
    negativos: 2
  },
  atualizado: '05/11/2025',
  tags: ['whatsapp', 'conexão', 'primeiros-passos', 'canais'],
  artigosRelacionados: [
    'como-configurar-mensagens-automaticas-whatsapp',
    'conectando-multiplos-numeros-whatsapp',
    'diferencas-whatsapp-pessoal-business',
    'troubleshooting-whatsapp-desconectou'
  ]
};

// Tickets
export const ticketsSuporte: Ticket[] = [
  {
    id: '1',
    numero: '#1234',
    assunto: 'WhatsApp desconectou',
    categoria: 'problema_tecnico',
    status: 'aberto',
    prioridade: 'alta',
    criado: 'Hoje 10:30',
    atualizado: 'Hoje 11:00',
    atribuidoPara: {
      nome: 'Carlos Mendes',
      cargo: 'Suporte Técnico',
      avatar: 'CM'
    },
    emailNotificacao: 'joe@kortex.com',
    mensagens: [
      {
        id: '1',
        remetente: {
          nome: 'Você',
          tipo: 'usuario'
        },
        mensagem: 'Meu WhatsApp desconectou do nada e não consigo reconectar. Já tentei escanear o QR Code várias vezes mas não funciona. Mensagens estão acumulando e clientes reclamando.',
        dataHora: '09/11/2025 10:30',
        anexos: [
          {
            nome: 'screenshot-erro.png',
            tamanho: '234 KB',
            url: '#'
          }
        ]
      },
      {
        id: '2',
        remetente: {
          nome: 'Carlos Mendes',
          tipo: 'suporte',
          avatar: 'CM'
        },
        mensagem: 'Olá! Obrigado por abrir o ticket. Já estou analisando.\n\nVi o screenshot. Parece que o token de autenticação expirou. Vou precisar de algumas informações:\n\n1. Quando foi a última vez que funcionou?\n2. O WhatsApp no celular está ativo?\n3. Você deslogou do WhatsApp recentemente?',
        dataHora: '09/11/2025 10:45'
      },
      {
        id: '3',
        remetente: {
          nome: 'Você',
          tipo: 'usuario'
        },
        mensagem: '1. Funcionou até ontem à noite\n2. Sim, WhatsApp está normal no celular\n3. Não desloguei',
        dataHora: '09/11/2025 10:50'
      },
      {
        id: '4',
        remetente: {
          nome: 'Carlos Mendes',
          tipo: 'suporte',
          avatar: 'CM'
        },
        mensagem: 'Perfeito! Identifiquei o problema.\n\nHouve uma atualização do WhatsApp que requer nova autenticação. Vou te passar o passo a passo para reconectar:\n\n**PASSO 1:** Vá em Canais > WhatsApp\n**PASSO 2:** Clique em "Desconectar"\n**PASSO 3:** Aguarde 30 segundos\n**PASSO 4:** Clique em "Conectar novamente"\n**PASSO 5:** Escaneie o novo QR Code\n\nMe avise quando conseguir! 👍',
        dataHora: '09/11/2025 11:00'
      }
    ]
  },
  {
    id: '2',
    numero: '#1233',
    assunto: 'Dúvida sobre automações',
    categoria: 'duvida_funcionalidade',
    status: 'em_andamento',
    prioridade: 'media',
    criado: 'Ontem 14:20',
    atualizado: 'Hoje 09:15',
    atribuidoPara: {
      nome: 'Ana Silva',
      cargo: 'Consultora de Sucesso',
      avatar: 'AS'
    },
    emailNotificacao: 'joe@kortex.com',
    mensagens: [
      {
        id: '1',
        remetente: {
          nome: 'Você',
          tipo: 'usuario'
        },
        mensagem: 'Como faço para criar uma automação que responde automaticamente apenas fora do horário de atendimento?',
        dataHora: '08/11/2025 14:20'
      },
      {
        id: '2',
        remetente: {
          nome: 'Ana Silva',
          tipo: 'suporte',
          avatar: 'AS'
        },
        mensagem: 'Olá! Ótima pergunta! Vou te guiar:\n\n1. Vá em IA & Automações\n2. Clique em "Nova Automação"\n3. Escolha o gatilho "Fora do Horário"\n4. Configure a mensagem desejada\n\nVou preparar um vídeo tutorial para você. Aguarde alguns minutos!',
        dataHora: '09/11/2025 09:15'
      }
    ]
  },
  {
    id: '3',
    numero: '#1232',
    assunto: 'Erro ao exportar relatório',
    categoria: 'problema_tecnico',
    status: 'resolvido',
    prioridade: 'baixa',
    criado: '05/11 16:45',
    atualizado: '06/11 10:30',
    emailNotificacao: 'joe@kortex.com',
    mensagens: []
  },
  {
    id: '4',
    numero: '#1231',
    assunto: 'Como integrar com Zapier',
    categoria: 'duvida_funcionalidade',
    status: 'resolvido',
    prioridade: 'media',
    criado: '03/11 09:15',
    atualizado: '03/11 15:20',
    emailNotificacao: 'joe@kortex.com',
    mensagens: []
  }
];

// Tutoriais
export const tutoriais: Tutorial[] = [
  {
    id: '1',
    titulo: 'Primeiros passos com Kortex',
    descricao: 'Aprenda o básico da plataforma',
    duracao: '8:45',
    visualizacoes: 2300,
    thumbnail: '/tutoriais/primeiros-passos.jpg',
    url: '#',
    categoria: 'Começando'
  },
  {
    id: '2',
    titulo: 'Configurar IA de atendimento',
    descricao: 'Como treinar sua IA',
    duracao: '12:30',
    visualizacoes: 1800,
    thumbnail: '/tutoriais/configurar-ia.jpg',
    url: '#',
    categoria: 'IA'
  },
  {
    id: '3',
    titulo: 'Criar automações de mensagens',
    descricao: 'Automatize seu atendimento',
    duracao: '15:20',
    visualizacoes: 1200,
    thumbnail: '/tutoriais/automacoes.jpg',
    url: '#',
    categoria: 'Automação'
  },
  {
    id: '4',
    titulo: 'Integrar API',
    descricao: 'Conecte sistemas externos',
    duracao: '18:45',
    visualizacoes: 890,
    thumbnail: '/tutoriais/api.jpg',
    url: '#',
    categoria: 'Desenvolvedores'
  }
];

// Status dos Serviços
export const statusServicos: StatusServico[] = [
  {
    nome: 'Plataforma Web',
    icone: '🌐',
    status: 'online',
    uptime: '99.98%'
  },
  {
    nome: 'API',
    icone: '📱',
    status: 'online',
    uptime: '99.95%'
  },
  {
    nome: 'WhatsApp',
    icone: '💬',
    status: 'online',
    uptime: '99.92%'
  },
  {
    nome: 'Instagram',
    icone: '📷',
    status: 'online',
    uptime: '99.87%'
  },
  {
    nome: 'Telegram',
    icone: '✈️',
    status: 'online',
    uptime: '99.94%'
  },
  {
    nome: 'Email',
    icone: '📧',
    status: 'online',
    uptime: '99.89%'
  },
  {
    nome: 'IA & Automações',
    icone: '🤖',
    status: 'online',
    uptime: '99.96%'
  },
  {
    nome: 'Banco de Dados',
    icone: '💾',
    status: 'online',
    uptime: '99.99%'
  },
  {
    nome: 'Notificações',
    icone: '🔔',
    status: 'online',
    uptime: '99.91%'
  }
];

// Incidentes
export const incidentes: Incidente[] = [
  {
    id: '1',
    titulo: 'Latência alta na API',
    data: '05/10/2025',
    duracao: '15 minutos',
    resolvido: true,
    descricao: 'Latência temporária identificada e resolvida',
    impacto: 'minimo'
  }
];

// Manutenções Programadas
export const manutencoesProgramadas: ManutencaoProgramada[] = [
  {
    id: '1',
    titulo: 'Atualização do sistema',
    descricao: 'Atualização de infraestrutura e melhorias de performance',
    dataInicio: '15/11/2025 02:00',
    dataFim: '15/11/2025 04:00',
    impacto: 'minimo',
    servicos: ['Plataforma Web', 'API']
  }
];
