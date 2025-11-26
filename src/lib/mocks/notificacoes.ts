import { Notificacao } from '@/tipos/notificacao';

export const notificacoes: Notificacao[] = [
  {
    id: '1',
    tipo: 'mensagem',
    titulo: 'Nova mensagem de Maria Silva',
    descricao: 'Olá, gostaria de saber sobre o produto...',
    lida: false,
    dataHora: 'Há 2 minutos',
    icone: '💬',
    link: '/conversas'
  },
  {
    id: '2',
    tipo: 'ticket',
    titulo: 'Ticket #1245 foi atualizado',
    descricao: 'O suporte respondeu seu ticket sobre conexão WhatsApp',
    lida: false,
    dataHora: 'Há 15 minutos',
    icone: '🎫',
    link: '/tickets'
  },
  {
    id: '3',
    tipo: 'sistema',
    titulo: 'Atualização do sistema',
    descricao: 'Nova versão 2.5.0 disponível com melhorias',
    lida: false,
    dataHora: 'Há 1 hora',
    icone: '🔔',
    link: '/suporte'
  },
  {
    id: '4',
    tipo: 'atendente',
    titulo: 'Carlos está offline',
    descricao: 'O atendente Carlos Mendes saiu do sistema',
    lida: true,
    dataHora: 'Há 2 horas',
    icone: '👤',
    link: '/atendentes'
  },
  {
    id: '5',
    tipo: 'mensagem',
    titulo: 'Nova mensagem de João Pedro',
    descricao: 'Obrigado pelo atendimento!',
    lida: true,
    dataHora: 'Há 3 horas',
    icone: '💬',
    link: '/conversas'
  },
  {
    id: '6',
    tipo: 'pagamento',
    titulo: 'Pagamento aprovado',
    descricao: 'Sua fatura de R$ 299,00 foi aprovada',
    lida: true,
    dataHora: 'Ontem',
    icone: '💳',
    link: '/pagamentos'
  },
  {
    id: '7',
    tipo: 'sistema',
    titulo: 'Backup concluído',
    descricao: 'Backup automático realizado com sucesso',
    lida: true,
    dataHora: 'Ontem',
    icone: '💾'
  }
];
