import { prisma } from '@/lib/prisma';
import type { Membro, EstatisticasEquipe } from '@/tipos/equipe';

/**
 * Service para gerenciamento de equipe
 */
export class EquipeService {
  /**
   * Busca todos os membros da equipe
   */
  static async listarMembros(): Promise<Membro[]> {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { nome: 'asc' },
      include: {
        tickets: {
          where: {
            status: { in: ['concluido'] },
          },
          select: {
            id: true,
            avaliacaoCliente: true,
            tempoAtendimento: true,
            dataAbertura: true,
            dataConclusao: true,
          },
        },
      },
    });

    return usuarios.map((usuario) => {
      // Calcular estatísticas baseadas nos tickets
      const ticketsConcluidos = usuario.tickets || [];
      const totalAtendimentos = ticketsConcluidos.length;
      
      // Calcular TMR (Tempo Médio de Resposta)
      const temposAtendimento = ticketsConcluidos
        .filter(t => t.tempoAtendimento)
        .map(t => t.tempoAtendimento!);
      const tmrMinutos = temposAtendimento.length > 0
        ? Math.round(temposAtendimento.reduce((a, b) => a + b, 0) / temposAtendimento.length)
        : 0;
      const tmr = `${tmrMinutos}min`;

      // Calcular CSAT (Customer Satisfaction)
      const avaliacoes = ticketsConcluidos
        .filter(t => t.avaliacaoCliente)
        .map(t => t.avaliacaoCliente!);
      const csat = avaliacoes.length > 0
        ? Number((avaliacoes.reduce((a, b) => a + b, 0) / avaliacoes.length).toFixed(1))
        : 0;

      // Taxa de resolução (assumindo que todos os tickets concluídos foram resolvidos)
      const taxaResolucao = totalAtendimentos > 0 ? 100 : 0;

      // Calcular horas trabalhadas (baseado nos tickets do último mês)
      const umMesAtras = new Date();
      umMesAtras.setMonth(umMesAtras.getMonth() - 1);
      const ticketsUltimoMes = ticketsConcluidos.filter(
        t => new Date(t.dataAbertura) >= umMesAtras
      );
      const horasTrabalhadas = Math.round(
        ticketsUltimoMes.reduce((total, t) => total + (t.tempoAtendimento || 0), 0) / 60
      );

      // Performance baseada em múltiplos fatores
      const performance = Math.min(
        100,
        Math.round(
          (csat / 5) * 40 + // 40% baseado em CSAT
          (taxaResolucao / 100) * 30 + // 30% baseado em taxa de resolução
          (totalAtendimentos > 0 ? 30 : 0) // 30% por ter atendimentos
        )
      );

      // Meta batida (baseado em performance)
      const metaBatida = performance;

      // Determinar status baseado em heartbeat em tempo real
      let status: 'online' | 'offline' | 'pausado' | 'inativo' = 'offline';
      
      if (!usuario.ativo) {
        status = 'inativo';
      } else if ((usuario as any).ultimoHeartbeat) {
        // Considera online se heartbeat foi nos últimos 2 minutos
        const minutosDesdeHeartbeat = 
          (Date.now() - new Date((usuario as any).ultimoHeartbeat).getTime()) / (1000 * 60);
        
        if (minutosDesdeHeartbeat < 2) {
          status = 'online';
        } else {
          status = 'offline';
        }
      } else {
        // Sem heartbeat = offline
        status = 'offline';
      }

      // Mapear role para cargo
      const cargoMap: Record<string, 'admin' | 'gestor' | 'atendente'> = {
        admin: 'admin',
        supervisor: 'gestor',
        atendente: 'atendente',
      };
      const cargo = cargoMap[usuario.role] || 'atendente';

      return {
        id: usuario.id,
        tipo: 'humano' as const,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone || undefined,
        avatar: usuario.avatar || undefined,
        cargo,
        setor: usuario.role === 'admin' ? 'Administração' : 
               usuario.role === 'supervisor' ? 'Supervisão' : 'Atendimento',
        setorId: usuario.role === 'admin' ? 'setor-admin' : 
                 usuario.role === 'supervisor' ? 'setor-supervisao' : 'setor-atendimento',
        status,
        dataContratacao: new Date(usuario.createdAt).toLocaleDateString('pt-BR'),
        tags: [],
        stats: {
          atendimentos: totalAtendimentos,
          tmr,
          csat,
          taxaResolucao,
          horasTrabalhadas,
          metaBatida,
        },
        ultimoAcesso: (usuario as any).ultimoHeartbeat 
          ? new Date((usuario as any).ultimoHeartbeat).toLocaleString('pt-BR')
          : new Date(usuario.updatedAt).toLocaleString('pt-BR'),
        performance,
      };
    });
  }

  /**
   * Busca um membro específico por ID
   */
  static async buscarMembroPorId(id: string): Promise<Membro | null> {
    const membros = await this.listarMembros();
    return membros.find(m => m.id === id) || null;
  }

  /**
   * Busca estatísticas gerais da equipe
   */
  static async obterEstatisticas(): Promise<EstatisticasEquipe> {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        role: true,
        ativo: true,
        createdAt: true,
        updatedAt: true,
      },
    }) as any[];

    const totalMembros = usuarios.length;
    const totalHumanos = usuarios.length; // Todos são humanos por enquanto
    const totalIAs = 0; // Não temos IAs no banco ainda

    // Calcular online baseado em heartbeat (últimos 2 minutos)
    const doisMinutosAtras = new Date(Date.now() - 2 * 60 * 1000);
    const onlineAgora = usuarios.filter(
      u => u.ativo && u.ultimoHeartbeat && new Date(u.ultimoHeartbeat as any) >= doisMinutosAtras
    ).length;
    const percentualOnline = totalMembros > 0 
      ? Math.round((onlineAgora / totalMembros) * 100) 
      : 0;

    // Contar por cargo
    const admins = usuarios.filter(u => u.role === 'admin').length;
    const gestores = usuarios.filter(u => u.role === 'supervisor').length;
    const atendentes = usuarios.filter(u => u.role === 'atendente').length;

    // Novos membros no último mês
    const umMesAtras = new Date();
    umMesAtras.setMonth(umMesAtras.getMonth() - 1);
    const novosMes = usuarios.filter(
      u => new Date(u.createdAt) >= umMesAtras
    ).length;

    return {
      totalMembros,
      totalHumanos,
      totalIAs,
      onlineAgora,
      percentualOnline,
      cargos: {
        admins,
        gestores,
        atendentes,
      },
      novosMes,
      variacao: novosMes > 0 ? 'aumento' : 'neutro',
    };
  }

  /**
   * Cria um novo membro
   */
  static async criarMembro(dados: {
    nome: string;
    email: string;
    senha: string;
    role: string;
    telefone?: string;
    avatar?: string;
  }) {
    return await prisma.usuario.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha, // Em produção, deve ser hasheada
        role: dados.role,
        telefone: dados.telefone,
        avatar: dados.avatar,
        ativo: true,
      },
    });
  }

  /**
   * Atualiza um membro
   */
  static async atualizarMembro(
    id: string,
    dados: {
      nome?: string;
      email?: string;
      telefone?: string;
      avatar?: string;
      role?: string;
      ativo?: boolean;
    }
  ) {
    return await prisma.usuario.update({
      where: { id },
      data: dados,
    });
  }

  /**
   * Remove um membro
   */
  static async removerMembro(id: string) {
    return await prisma.usuario.delete({
      where: { id },
    });
  }

  /**
   * Busca atividades recentes de um membro
   */
  static async buscarAtividades(membroId: string, limite: number = 20) {
    const tickets = await prisma.ticket.findMany({
      where: { atendenteId: membroId },
      orderBy: { createdAt: 'desc' },
      take: limite,
      select: {
        id: true,
        protocolo: true,
        status: true,
        tipoServico: true,
        dataAbertura: true,
        dataAtribuicao: true,
        dataInicio: true,
        dataConclusao: true,
        dataCancelamento: true,
      },
    });

    return tickets.map(ticket => {
      let tipo: 'atendimento' | 'ticket' = 'ticket';
      let descricao = '';
      let data = '';
      let hora = '';

      if (ticket.dataConclusao) {
        tipo = 'atendimento';
        descricao = `Concluiu atendimento ${ticket.protocolo} - ${ticket.tipoServico}`;
        const dt = new Date(ticket.dataConclusao);
        data = dt.toLocaleDateString('pt-BR');
        hora = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      } else if (ticket.dataInicio) {
        tipo = 'atendimento';
        descricao = `Iniciou atendimento ${ticket.protocolo} - ${ticket.tipoServico}`;
        const dt = new Date(ticket.dataInicio);
        data = dt.toLocaleDateString('pt-BR');
        hora = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      } else if (ticket.dataAtribuicao) {
        tipo = 'ticket';
        descricao = `Recebeu ticket ${ticket.protocolo} - ${ticket.tipoServico}`;
        const dt = new Date(ticket.dataAtribuicao);
        data = dt.toLocaleDateString('pt-BR');
        hora = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      } else {
        tipo = 'ticket';
        descricao = `Ticket ${ticket.protocolo} criado - ${ticket.tipoServico}`;
        const dt = new Date(ticket.dataAbertura);
        data = dt.toLocaleDateString('pt-BR');
        hora = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      }

      return {
        id: ticket.id,
        membroId,
        tipo,
        descricao,
        data,
        hora,
      };
    });
  }
}
