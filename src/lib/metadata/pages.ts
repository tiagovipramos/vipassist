/**
 * Configuração de metadata para todas as páginas do sistema
 * Centraliza títulos, descrições e OG images para SEO
 */

import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vipassist.app'

export const pagesMetadata = {
  // Páginas autenticadas
  painel: {
    title: 'Dashboard Operacional | VIP Assist - Assistência Veicular 24 Horas',
    description: 'Dashboard completo para gestão de assistência veicular com métricas em tempo real, chamados urgentes, prestadores ativos e indicadores financeiros.',
    keywords: 'dashboard, assistência veicular, reboque, chamados, prestadores, métricas, tempo real, KPIs',
    ogImage: `${baseUrl}/og/painel.png`,
  },
  conversas: {
    title: 'Conversas | VIP Assist - Gerenciamento de atendimento',
    description: 'Gerencie todas as conversas ativas, arquivadas e aguardando atendimento em um só lugar com filtros avançados.',
    keywords: 'conversas, chat, atendimento, mensagens, histórico',
    ogImage: `${baseUrl}/og/conversas.png`,
  },
  tickets: {
    title: 'Lista de Chamados | VIP Assist - Assistência Veicular 24h',
    description: 'Gerencie todos os chamados de assistência veicular com acompanhamento em tempo real, designação de prestadores e controle completo.',
    keywords: 'chamados, assistência veicular, reboque, prestadores, atendimento 24h, emergência',
    ogImage: `${baseUrl}/og/tickets.png`,
  },
  atendentes: {
    title: 'Atendentes | VIP Assist - Gestão de equipe',
    description: 'Monitore performance, disponibilidade e métricas individuais dos atendentes da sua equipe.',
    keywords: 'atendentes, equipe, performance, métricas, gestão',
    ogImage: `${baseUrl}/og/atendentes.png`,
  },
  crm: {
    title: 'CRM | VIP Assist - Gestão de clientes',
    description: 'CRM integrado com histórico completo de interações, segmentação e automação de marketing.',
    keywords: 'CRM, clientes, relacionamento, vendas, pipeline',
    ogImage: `${baseUrl}/og/crm.png`,
  },
  campanhas: {
    title: 'Campanhas | VIP Assist - Envio em massa',
    description: 'Crie e gerencie campanhas de marketing em massa para WhatsApp, SMS e e-mail com segmentação avançada.',
    keywords: 'campanhas, marketing, envio em massa, whatsapp, automação',
    ogImage: `${baseUrl}/og/campanhas.png`,
  },
  relatorios: {
    title: 'Relatórios | VIP Assist - Análises e insights',
    description: 'Relatórios avançados com análises de performance, satisfação, vendas e métricas customizadas.',
    keywords: 'relatórios, análises, métricas, insights, BI',
    ogImage: `${baseUrl}/og/relatorios.png`,
  },
  equipe: {
    title: 'Equipe | VIP Assist - Gestão de colaboradores',
    description: 'Gerencie permissões, horários, metas e performance da sua equipe de atendimento.',
    keywords: 'equipe, colaboradores, permissões, metas, gestão',
    ogImage: `${baseUrl}/og/equipe.png`,
  },
  ia: {
    title: 'IA & Automações | VIP Assist - Inteligência artificial',
    description: 'Configure chatbots inteligentes, automações e fluxos de atendimento com IA generativa.',
    keywords: 'IA, inteligência artificial, chatbot, automação, GPT',
    ogImage: `${baseUrl}/og/ia.png`,
  },
  canais: {
    title: 'Canais | VIP Assist - Integrações multicanal',
    description: 'Integre WhatsApp, Telegram, Instagram, Facebook e mais em uma única plataforma.',
    keywords: 'canais, integrações, whatsapp, telegram, omnichannel',
    ogImage: `${baseUrl}/og/canais.png`,
  },
  pagamentos: {
    title: 'Pagamentos | VIP Assist - Gestão financeira',
    description: 'Gerencie pagamentos pendentes e finalizados',
    keywords: 'pagamentos, faturas, cobrança, plano, financeiro',
    ogImage: `${baseUrl}/og/pagamentos.png`,
  },
  suporte: {
    title: 'Suporte | VIP Assist - Central de ajuda',
    description: 'Acesse documentação, tutoriais e suporte técnico para tirar dúvidas sobre a plataforma.',
    keywords: 'suporte, ajuda, documentação, tutoriais, FAQ',
    ogImage: `${baseUrl}/og/suporte.png`,
  },
  inbox: {
    title: 'Inbox | VIP Assist - Central de mensagens',
    description: 'Central unificada de todas as suas conversas e notificações em tempo real.',
    keywords: 'inbox, mensagens, notificações, central, unificado',
    ogImage: `${baseUrl}/og/inbox.png`,
  },
  chat: {
    title: 'Chat | VIP Assist - Atendimento em tempo real',
    description: 'Interface de chat profissional com recursos avançados para atendimento rápido e eficiente.',
    keywords: 'chat, atendimento, tempo real, mensagens, conversa',
    ogImage: `${baseUrl}/og/chat.png`,
  },
  logs: {
    title: '📋 Logs do Sistema | VIP Assist - Monitoramento e Auditoria',
    description: 'Visualize e monitore todas as atividades do sistema em tempo real',
    keywords: 'logs, auditoria, monitoramento, sistema, atividades, rastreamento',
    ogImage: `${baseUrl}/og/logs.png`,
  },

  // Páginas públicas
  entrar: {
    title: 'Entrar | VIP Assist - Login',
    description: 'Acesse sua conta VIP Assist e gerencie seu atendimento de forma profissional.',
    keywords: 'login, entrar, acesso, conta',
    ogImage: `${baseUrl}/og/entrar.png`,
  },
  novoTicket: {
    title: 'Abrir Ticket | VIP Assist - Suporte',
    description: 'Abra um ticket de suporte e receba atendimento especializado da nossa equipe.',
    keywords: 'ticket, suporte, atendimento, ajuda',
    ogImage: `${baseUrl}/og/ticket.png`,
  },
}

/**
 * Gera metadata completa para uma página
 */
export function generatePageMetadata(pageKey: keyof typeof pagesMetadata): Metadata {
  const pageData = pagesMetadata[pageKey]

  return {
    title: pageData.title,
    description: pageData.description,
    keywords: pageData.keywords,
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      url: baseUrl,
      siteName: 'VIP Assist',
      images: [
        {
          url: pageData.ogImage,
          width: 1200,
          height: 630,
          alt: pageData.title,
        },
      ],
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData.title,
      description: pageData.description,
      images: [pageData.ogImage],
      creator: '@vipassist',
    },
    robots: {
      index: pageKey !== 'entrar', // Apenas login é indexável em páginas públicas
      follow: true,
    },
    alternates: {
      canonical: `${baseUrl}/${pageKey === 'painel' ? '' : pageKey}`,
    },
  }
}
