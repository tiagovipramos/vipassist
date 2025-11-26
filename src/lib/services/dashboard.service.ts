import { prisma } from '@/lib/prisma'
import {
  MetricasAssistenciaVeicular,
  ChamadoUrgente,
  AlertaOperacional,
  DistribuicaoServico,
  PerformancePrestador,
  RegiaoAtendimento,
  HorarioPico,
  TendenciaSemanal,
} from '@/tipos/assistenciaVeicular'

export class DashboardService {
  // ==========================================
  // MÉTRICAS PRINCIPAIS
  // ==========================================
  static async getMetricasPrincipais(): Promise<MetricasAssistenciaVeicular> {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const ontem = new Date(hoje)
    ontem.setDate(ontem.getDate() - 1)

    // Chamados
    const [
      chamadosAbertos,
      chamadosEmAndamento,
      chamadosFinalizadosMes,
      chamadosUrgentes,
      chamadosOntem,
    ] = await Promise.all([
      prisma.ticket.count({
        where: { status: { in: ['aberto', 'em_andamento'] } },
      }),
      prisma.ticket.count({
        where: { status: 'em_andamento' },
      }),
      prisma.ticket.count({
        where: {
          status: 'concluido',
          dataConclusao: { gte: inicioMes },
        },
      }),
      prisma.ticket.count({
        where: {
          status: { in: ['aberto', 'em_andamento'] },
          prioridade: { in: ['critica', 'alta'] },
        },
      }),
      prisma.ticket.count({
        where: {
          dataAbertura: {
            gte: ontem,
            lt: hoje,
          },
        },
      }),
    ])

    // Calcular variação de chamados
    const variacaoChamados = chamadosOntem > 0 
      ? Math.round(((chamadosAbertos - chamadosOntem) / chamadosOntem) * 100)
      : 0

    // Tempos médios
    const ticketsComTempo = await prisma.ticket.findMany({
      where: {
        status: 'concluido',
        tempoEspera: { not: null },
        tempoAtendimento: { not: null },
        dataConclusao: { gte: inicioMes },
      },
      select: {
        tempoEspera: true,
        tempoAtendimento: true,
      },
    })

    const tempoMedioEspera = ticketsComTempo.length > 0
      ? Math.round(
          ticketsComTempo.reduce((acc: number, t: { tempoEspera: number | null; tempoAtendimento: number | null }) => acc + (t.tempoEspera || 0), 0) /
            ticketsComTempo.length
        )
      : 0

    const tempoMedioAtend = ticketsComTempo.length > 0
      ? Math.round(
          ticketsComTempo.reduce((acc: number, t: { tempoEspera: number | null; tempoAtendimento: number | null }) => acc + (t.tempoAtendimento || 0), 0) /
            ticketsComTempo.length
        )
      : 0

    // Prestadores
    const [prestadoresAtivos, totalPrestadores, prestadoresDisponiveis] = await Promise.all([
      prisma.prestador.count({
        where: { status: 'ativo' },
      }),
      prisma.prestador.count(),
      prisma.prestador.count({
        where: { status: 'ativo', disponivel: true },
      }),
    ])

    const taxaOcupacao = prestadoresAtivos > 0
      ? Math.round(((prestadoresAtivos - prestadoresDisponiveis) / prestadoresAtivos) * 100)
      : 0

    // Avaliações
    const avaliacoes = await prisma.avaliacaoPrestador.findMany({
      where: {
        createdAt: { gte: inicioMes },
      },
      select: { nota: true },
    })

    const avaliacaoMedia = avaliacoes.length > 0
      ? avaliacoes.reduce((acc: number, a: { nota: number }) => acc + a.nota, 0) / avaliacoes.length
      : 0

    // NPS simplificado (% de notas 4-5)
    const notasAltas = avaliacoes.filter((a: { nota: number }) => a.nota >= 4).length
    const nps = avaliacoes.length > 0
      ? Math.round((notasAltas / avaliacoes.length) * 100)
      : 0

    // Financeiro
    const [pagamentosHoje, pagamentosMes] = await Promise.all([
      prisma.pagamento.findMany({
        where: {
          status: 'pago',
          dataPagamento: { gte: hoje },
        },
        select: { valor: true },
      }),
      prisma.pagamento.findMany({
        where: {
          status: 'pago',
          dataPagamento: { gte: inicioMes },
        },
        select: { valor: true },
      }),
    ])

    const receitaDia = pagamentosHoje.reduce((acc: number, p: { valor: number }) => acc + p.valor, 0)
    const receitaMes = pagamentosMes.reduce((acc: number, p: { valor: number }) => acc + p.valor, 0)
    const ticketMedio = chamadosFinalizadosMes > 0
      ? Math.round(receitaMes / chamadosFinalizadosMes)
      : 0

    // Tipos de serviço
    const servicosHoje = await prisma.ticket.groupBy({
      by: ['tipoServico'],
      where: {
        dataAbertura: { gte: hoje },
      },
      _count: true,
    })

    const getCountByTipo = (tipo: string) =>
      servicosHoje.find((s: { tipoServico: string; _count: number }) => s.tipoServico === tipo)?._count || 0

    return {
      chamadosAbertos,
      chamadosEmAndamento,
      chamadosFinalizados: chamadosFinalizadosMes,
      chamadosUrgentes,
      variacaoChamados,
      tempoMedioAtendimento: `${tempoMedioAtend}min`,
      tempoMedioChegada: `${tempoMedioEspera}min`,
      tempoMedioResolucao: `${Math.floor((tempoMedioEspera + tempoMedioAtend) / 60)}h ${(tempoMedioEspera + tempoMedioAtend) % 60}min`,
      variacaoTempo: -5, // Placeholder - calcular com dados históricos
      prestadoresAtivos,
      totalPrestadores,
      prestadoresDisponiveis,
      taxaOcupacao,
      nps,
      avaliacaoMedia: Math.round(avaliacaoMedia * 10) / 10,
      taxaResolucaoPrimeiroAtendimento: 85, // Placeholder - implementar lógica
      receitaDia,
      receitaMes,
      ticketMedio,
      variacaoReceita: 10, // Placeholder - calcular com dados históricos
      reboques: getCountByTipo('reboque'),
      trocaPneu: getCountByTipo('pneu'),
      chaveiro: getCountByTipo('chaveiro'),
      paneEletrica: getCountByTipo('pane_eletrica'),
      paneMotor: getCountByTipo('pane_motor'),
      outros: servicosHoje.filter((s: { tipoServico: string; _count: number }) => !['reboque', 'pneu', 'chaveiro', 'pane_eletrica', 'pane_motor'].includes(s.tipoServico)).reduce((acc: number, s: { tipoServico: string; _count: number }) => acc + s._count, 0),
    }
  }

  // ==========================================
  // CHAMADOS URGENTES
  // ==========================================
  static async getChamadosUrgentes(): Promise<ChamadoUrgente[]> {
    const tickets = await prisma.ticket.findMany({
      where: {
        status: { in: ['aberto', 'em_andamento'] },
        prioridade: { in: ['critica', 'alta'] },
      },
      include: {
        cliente: true,
        veiculo: true,
        prestador: true,
      },
      orderBy: [
        { prioridade: 'desc' },
        { dataAbertura: 'asc' },
      ],
      take: 10,
    })

    return tickets.map((ticket: any) => {
      const tempoEspera = ticket.dataAbertura
        ? Math.floor((Date.now() - ticket.dataAbertura.getTime()) / 60000)
        : 0

      return {
        id: ticket.id,
        protocolo: ticket.protocolo,
        tipo: ticket.tipoServico,
        cliente: {
          nome: ticket.cliente.nome,
          telefone: ticket.cliente.telefone,
          plano: ticket.cliente.plano || 'Sem plano',
        },
        localizacao: {
          endereco: ticket.origemEndereco,
          cidade: ticket.origemCidade,
          coordenadas: ticket.origemLatitude && ticket.origemLongitude
            ? { lat: ticket.origemLatitude, lng: ticket.origemLongitude }
            : undefined,
        },
        destino: ticket.destinoEndereco
          ? {
              endereco: ticket.destinoEndereco,
              cidade: ticket.destinoCidade || '',
              coordenadas: ticket.destinoLatitude && ticket.destinoLongitude
                ? { lat: ticket.destinoLatitude, lng: ticket.destinoLongitude }
                : undefined,
            }
          : undefined,
        status: ticket.status,
        tempoEspera: `${tempoEspera}min`,
        prioridade: ticket.prioridade,
        prestadorDesignado: ticket.prestador
          ? {
              nome: ticket.prestador.nome,
              telefone: ticket.prestador.telefone,
              distancia: '0 km', // Calcular com coordenadas
              tempoChegada: '0min', // Calcular com coordenadas
            }
          : undefined,
        observacoes: ticket.observacoes || undefined,
      }
    })
  }

  // ==========================================
  // ALERTAS OPERACIONAIS
  // ==========================================
  static async getAlertasOperacionais(): Promise<AlertaOperacional[]> {
    const alertas: AlertaOperacional[] = []

    // Verificar chamados em risco de SLA (mais de 40min aguardando)
    const chamadosEmRisco = await prisma.ticket.count({
      where: {
        status: { in: ['aberto', 'em_andamento'] },
        dataAbertura: {
          lte: new Date(Date.now() - 40 * 60 * 1000),
        },
      },
    })

    if (chamadosEmRisco > 0) {
      alertas.push({
        id: 'sla-risco',
        tipo: 'sla_risco',
        severidade: 'critica',
        titulo: `SLA em Risco - ${chamadosEmRisco} Chamados`,
        descricao: `${chamadosEmRisco} chamados estão próximos de estourar o SLA de atendimento (45min). Ação imediata necessária.`,
        tempo: 'Agora',
        acoes: [
          { label: 'Ver Chamados', tipo: 'primaria', acao: 'ver_chamados' },
          { label: 'Realocar Prestadores', tipo: 'secundaria', acao: 'realocar' },
        ],
      })
    }

    // Verificar chamados sem prestador
    const chamadosSemPrestador = await prisma.ticket.count({
      where: {
        status: 'aberto',
        prestadorId: null,
        dataAbertura: {
          lte: new Date(Date.now() - 15 * 60 * 1000),
        },
      },
    })

    if (chamadosSemPrestador > 0) {
      alertas.push({
        id: 'sem-prestador',
        tipo: 'sem_prestador',
        severidade: 'critica',
        titulo: 'Chamados Sem Prestador',
        descricao: `${chamadosSemPrestador} chamados aguardando designação de prestador há mais de 15 minutos.`,
        tempo: 'Agora',
        acoes: [
          { label: 'Buscar Prestadores', tipo: 'primaria', acao: 'buscar_prestador' },
          { label: 'Ver Chamados', tipo: 'secundaria', acao: 'ver_chamados' },
        ],
      })
    }

    return alertas
  }

  // ==========================================
  // DISTRIBUIÇÃO DE SERVIÇOS
  // ==========================================
  static async getDistribuicaoServicos(): Promise<DistribuicaoServico[]> {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const servicos = await prisma.ticket.groupBy({
      by: ['tipoServico'],
      where: {
        dataAbertura: { gte: hoje },
      },
      _count: true,
    })

    const pagamentos = await prisma.pagamento.findMany({
      where: {
        status: 'pago',
        dataPagamento: { gte: hoje },
      },
      select: {
        valor: true,
        ticketProtocolo: true,
      },
    })

    const tickets = await prisma.ticket.findMany({
      where: {
        dataAbertura: { gte: hoje },
      },
      select: {
        protocolo: true,
        tipoServico: true,
      },
    })

    const total = servicos.reduce((acc: number, s: { tipoServico: string; _count: number }) => acc + s._count, 0)

    const cores: Record<string, string> = {
      reboque: '#3b82f6',
      pneu: '#10b981',
      chaveiro: '#f59e0b',
      pane_eletrica: '#8b5cf6',
      pane_motor: '#ef4444',
    }

    const nomes: Record<string, string> = {
      reboque: 'Reboque',
      pneu: 'Troca de Pneu',
      chaveiro: 'Chaveiro',
      pane_eletrica: 'Pane Elétrica',
      pane_motor: 'Pane Motor',
    }

    return servicos.map((servico: { tipoServico: string; _count: number }) => {
      const receitaServico = tickets
        .filter((t: { protocolo: string; tipoServico: string }) => t.tipoServico === servico.tipoServico)
        .reduce((acc: number, t: { protocolo: string; tipoServico: string }) => {
          const pag = pagamentos.find((p: { valor: number; ticketProtocolo: string }) => p.ticketProtocolo === t.protocolo)
          return acc + (pag?.valor || 0)
        }, 0)

      return {
        tipo: nomes[servico.tipoServico] || servico.tipoServico,
        quantidade: servico._count,
        percentual: total > 0 ? Math.round((servico._count / total) * 1000) / 10 : 0,
        cor: cores[servico.tipoServico] || '#6b7280',
        receita: receitaServico,
      }
    })
  }

  // ==========================================
  // TOP PRESTADORES
  // ==========================================
  static async getTopPrestadores(): Promise<PerformancePrestador[]> {
    const inicioSemana = new Date()
    inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay())
    inicioSemana.setHours(0, 0, 0, 0)

    const prestadores = await prisma.prestador.findMany({
      where: {
        status: 'ativo',
      },
      include: {
        tickets: {
          where: {
            dataAbertura: { gte: inicioSemana },
            status: 'concluido',
          },
        },
        avaliacoes: {
          where: {
            createdAt: { gte: inicioSemana },
          },
        },
      },
      take: 50,
    })

    const prestadoresComMetricas = prestadores
      .map((prestador: any) => {
        const atendimentos = prestador.tickets.length
        const avaliacaoMedia = prestador.avaliacoes.length > 0
          ? prestador.avaliacoes.reduce((acc: number, a: { nota: number }) => acc + a.nota, 0) / prestador.avaliacoes.length
          : 0

        const tempoMedio = prestador.tickets.length > 0
          ? Math.round(
              prestador.tickets.reduce((acc: number, t: { tempoAtendimento: number | null }) => acc + (t.tempoAtendimento || 0), 0) /
                prestador.tickets.length
            )
          : 0

        const taxaConclusao = atendimentos > 0 ? 100 : 0 // Simplificado

        return {
          id: prestador.id,
          nome: prestador.nome,
          avatar: `/avatars/prestador-${prestador.id}.jpg`,
          atendimentos,
          avaliacaoMedia: Math.round(avaliacaoMedia * 10) / 10,
          tempoMedioAtendimento: `${tempoMedio}min`,
          taxaConclusao,
          posicao: 0,
        }
      })
      .filter((p: { atendimentos: number }) => p.atendimentos > 0)
      .sort((a, b) => b.atendimentos - a.atendimentos)
      .slice(0, 3)
      .map((p, index) => ({ ...p, posicao: index + 1 }))

    return prestadoresComMetricas
  }

  // ==========================================
  // REGIÕES DE ATENDIMENTO
  // ==========================================
  static async getRegioesAtendimento(): Promise<RegiaoAtendimento[]> {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const tickets = await prisma.ticket.findMany({
      where: {
        dataAbertura: { gte: hoje },
      },
      select: {
        origemCidade: true,
        tempoEspera: true,
      },
    })

    const prestadores = await prisma.prestador.findMany({
      where: {
        status: 'ativo',
      },
      select: {
        cidade: true,
      },
    })

    // Agrupar por região (simplificado - usar cidade)
    const regioes = new Map<string, { chamados: number; tempos: number[]; prestadores: number }>()

    tickets.forEach((ticket: { origemCidade: string; tempoEspera: number | null }) => {
      const regiao = ticket.origemCidade
      if (!regioes.has(regiao)) {
        regioes.set(regiao, { chamados: 0, tempos: [], prestadores: 0 })
      }
      const r = regioes.get(regiao)!
      r.chamados++
      if (ticket.tempoEspera) r.tempos.push(ticket.tempoEspera)
    })

    prestadores.forEach((prestador: { cidade: string }) => {
      const regiao = prestador.cidade
      if (regioes.has(regiao)) {
        regioes.get(regiao)!.prestadores++
      }
    })

    const cores = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']

    return Array.from(regioes.entries())
      .map(([regiao, dados], index) => ({
        regiao,
        chamados: dados.chamados,
        tempoMedio: dados.tempos.length > 0
          ? `${Math.round(dados.tempos.reduce((a, b) => a + b, 0) / dados.tempos.length)}min`
          : '0min',
        prestadoresAtivos: dados.prestadores,
        cor: cores[index % cores.length],
      }))
      .sort((a, b) => b.chamados - a.chamados)
      .slice(0, 5)
  }

  // ==========================================
  // HORÁRIOS DE PICO
  // ==========================================
  static async getHorariosPico(): Promise<HorarioPico[]> {
    const ultimas24h = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const tickets = await prisma.ticket.findMany({
      where: {
        dataAbertura: { gte: ultimas24h },
      },
      select: {
        dataAbertura: true,
      },
    })

    const horarios: HorarioPico[] = Array.from({ length: 12 }, (_, i) => ({
      hora: `${i * 2}h`,
      chamados: 0,
      tipo: 'baixo',
    }))

    tickets.forEach((ticket: { dataAbertura: Date }) => {
      const hora = Math.floor(ticket.dataAbertura.getHours() / 2)
      horarios[hora].chamados++
    })

    const maxChamados = Math.max(...horarios.map((h) => h.chamados))
    const mediaChamados = horarios.reduce((acc: number, h) => acc + h.chamados, 0) / horarios.length

    horarios.forEach((h) => {
      if (h.chamados >= mediaChamados * 1.5) {
        h.tipo = 'pico'
      } else if (h.chamados >= mediaChamados * 0.7) {
        h.tipo = 'normal'
      }
    })

    return horarios
  }

  // ==========================================
  // TENDÊNCIA SEMANAL
  // ==========================================
  static async getTendenciaSemanal(): Promise<TendenciaSemanal[]> {
    const hoje = new Date()
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const resultado: TendenciaSemanal[] = []

    for (let i = 6; i >= 0; i--) {
      const dia = new Date(hoje)
      dia.setDate(dia.getDate() - i)
      dia.setHours(0, 0, 0, 0)
      
      const proximoDia = new Date(dia)
      proximoDia.setDate(proximoDia.getDate() + 1)

      const [chamados, finalizados, cancelados] = await Promise.all([
        prisma.ticket.count({
          where: {
            dataAbertura: {
              gte: dia,
              lt: proximoDia,
            },
          },
        }),
        prisma.ticket.count({
          where: {
            dataAbertura: {
              gte: dia,
              lt: proximoDia,
            },
            status: 'concluido',
          },
        }),
        prisma.ticket.count({
          where: {
            dataAbertura: {
              gte: dia,
              lt: proximoDia,
            },
            status: 'cancelado',
          },
        }),
      ])

      resultado.push({
        dia: diasSemana[dia.getDay()],
        chamados,
        finalizados,
        cancelados,
      })
    }

    return resultado
  }
}
