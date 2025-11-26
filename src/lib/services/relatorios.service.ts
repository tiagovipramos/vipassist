import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, subMonths, format, differenceInMinutes, differenceInSeconds } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// ==========================================
// TIPOS
// ==========================================

export interface PeriodoRelatorio {
  inicio: Date
  fim: Date
  tipo: 'hoje' | 'ontem' | '7dias' | '30dias' | 'mes_atual' | 'mes_passado' | 'personalizado'
}

export interface FiltrosRelatorio {
  tiposServico?: string[]
  status?: string[]
  prestadores?: string[]
  cidades?: string[]
}

// ==========================================
// UTILITÁRIOS
// ==========================================

function calcularPeriodo(tipo: PeriodoRelatorio['tipo'], dataInicio?: Date, dataFim?: Date): { inicio: Date; fim: Date } {
  const agora = new Date()
  
  switch (tipo) {
    case 'hoje':
      return {
        inicio: startOfDay(agora),
        fim: endOfDay(agora)
      }
    case 'ontem':
      const ontem = subDays(agora, 1)
      return {
        inicio: startOfDay(ontem),
        fim: endOfDay(ontem)
      }
    case '7dias':
      return {
        inicio: startOfDay(subDays(agora, 7)),
        fim: endOfDay(agora)
      }
    case '30dias':
      return {
        inicio: startOfDay(subDays(agora, 30)),
        fim: endOfDay(agora)
      }
    case 'mes_atual':
      return {
        inicio: startOfMonth(agora),
        fim: endOfMonth(agora)
      }
    case 'mes_passado':
      const mesPassado = subMonths(agora, 1)
      return {
        inicio: startOfMonth(mesPassado),
        fim: endOfMonth(mesPassado)
      }
    case 'personalizado':
      if (!dataInicio || !dataFim) {
        throw new Error('Datas de início e fim são obrigatórias para período personalizado')
      }
      return {
        inicio: startOfDay(dataInicio),
        fim: endOfDay(dataFim)
      }
    default:
      return {
        inicio: startOfDay(subDays(agora, 30)),
        fim: endOfDay(agora)
      }
  }
}

function calcularPeriodoAnterior(periodo: { inicio: Date; fim: Date }): { inicio: Date; fim: Date } {
  const duracao = periodo.fim.getTime() - periodo.inicio.getTime()
  return {
    inicio: new Date(periodo.inicio.getTime() - duracao),
    fim: new Date(periodo.fim.getTime() - duracao)
  }
}

function formatarTempo(segundos: number): string {
  if (segundos < 60) {
    return `${Math.round(segundos)}s`
  }
  const minutos = Math.floor(segundos / 60)
  const segsRestantes = Math.round(segundos % 60)
  if (minutos < 60) {
    return segsRestantes > 0 ? `${minutos}m ${segsRestantes}s` : `${minutos}m`
  }
  const horas = Math.floor(minutos / 60)
  const minsRestantes = minutos % 60
  return `${horas}h ${minsRestantes}m`
}

// ==========================================
// RELATÓRIO: VISÃO GERAL
// ==========================================

export async function obterRelatorioVisaoGeral(
  tipoPeriodo: PeriodoRelatorio['tipo'] = '30dias',
  filtros: FiltrosRelatorio = {},
  compararComAnterior: boolean = true
) {
  const periodo = calcularPeriodo(tipoPeriodo)
  const periodoAnterior = compararComAnterior ? calcularPeriodoAnterior(periodo) : null

  // Construir filtros WHERE
  const whereClause: any = {
    createdAt: {
      gte: periodo.inicio,
      lte: periodo.fim
    }
  }

  if (filtros.tiposServico?.length) {
    whereClause.tipoServico = { in: filtros.tiposServico }
  }
  if (filtros.status?.length) {
    whereClause.status = { in: filtros.status }
  }
  if (filtros.cidades?.length) {
    whereClause.origemCidade = { in: filtros.cidades }
  }

  // Buscar tickets do período atual
  const tickets = await prisma.ticket.findMany({
    where: whereClause,
    include: {
      cliente: true,
      prestador: true,
      veiculo: true
    }
  })

  // Buscar tickets do período anterior (se comparação ativada)
  let ticketsAnterior: any[] = []
  if (periodoAnterior) {
    ticketsAnterior = await prisma.ticket.findMany({
      where: {
        ...whereClause,
        createdAt: {
          gte: periodoAnterior.inicio,
          lte: periodoAnterior.fim
        }
      }
    })
  }

  // Calcular métricas
  const totalTickets = tickets.length
  const totalTicketsAnterior = ticketsAnterior.length
  const variacaoTickets = totalTicketsAnterior > 0 
    ? ((totalTickets - totalTicketsAnterior) / totalTicketsAnterior) * 100 
    : 0

  // Tickets por status
  const ticketsAbertos = tickets.filter(t => t.status === 'aberto').length
  const ticketsConcluidos = tickets.filter(t => t.status === 'concluido').length
  const ticketsEmAndamento = tickets.filter(t => t.status === 'em_andamento').length
  const ticketsCancelados = tickets.filter(t => t.status === 'cancelado').length

  // Taxa de resolução
  const taxaResolucao = totalTickets > 0 
    ? (ticketsConcluidos / totalTickets) * 100 
    : 0
  const taxaResolucaoAnterior = totalTicketsAnterior > 0
    ? (ticketsAnterior.filter(t => t.status === 'concluido').length / totalTicketsAnterior) * 100
    : 0
  const variacaoTaxaResolucao = taxaResolucaoAnterior > 0
    ? taxaResolucao - taxaResolucaoAnterior
    : 0

  // Tempo médio de atendimento (TMR)
  const ticketsComTempo = tickets.filter(t => t.tempoAtendimento !== null)
  const tempoMedioMinutos = ticketsComTempo.length > 0
    ? ticketsComTempo.reduce((acc, t) => acc + (t.tempoAtendimento || 0), 0) / ticketsComTempo.length
    : 0
  const tempoMedioSegundos = tempoMedioMinutos * 60

  const ticketsComTempoAnterior = ticketsAnterior.filter(t => t.tempoAtendimento !== null)
  const tempoMedioMinutosAnterior = ticketsComTempoAnterior.length > 0
    ? ticketsComTempoAnterior.reduce((acc, t) => acc + (t.tempoAtendimento || 0), 0) / ticketsComTempoAnterior.length
    : 0
  const variacaoTMR = tempoMedioMinutosAnterior > 0
    ? ((tempoMedioMinutos - tempoMedioMinutosAnterior) / tempoMedioMinutosAnterior) * 100
    : 0

  // Avaliação média (CSAT)
  const ticketsAvaliados = tickets.filter(t => t.avaliacaoCliente !== null)
  const avaliacaoMedia = ticketsAvaliados.length > 0
    ? ticketsAvaliados.reduce((acc, t) => acc + (t.avaliacaoCliente || 0), 0) / ticketsAvaliados.length
    : 0

  const ticketsAvaliadosAnterior = ticketsAnterior.filter(t => t.avaliacaoCliente !== null)
  const avaliacaoMediaAnterior = ticketsAvaliadosAnterior.length > 0
    ? ticketsAvaliadosAnterior.reduce((acc, t) => acc + (t.avaliacaoCliente || 0), 0) / ticketsAvaliadosAnterior.length
    : 0
  const variacaoCSAT = avaliacaoMediaAnterior > 0
    ? ((avaliacaoMedia - avaliacaoMediaAnterior) / avaliacaoMediaAnterior) * 100
    : 0

  // Clientes únicos
  const clientesUnicos = new Set(tickets.map(t => t.clienteId)).size
  const clientesUnicosAnterior = new Set(ticketsAnterior.map(t => t.clienteId)).size
  const variacaoClientes = clientesUnicosAnterior > 0
    ? ((clientesUnicos - clientesUnicosAnterior) / clientesUnicosAnterior) * 100
    : 0

  // Receita
  const receita = tickets
    .filter(t => t.valorFinal !== null)
    .reduce((acc, t) => acc + (t.valorFinal || 0), 0)
  const receitaAnterior = ticketsAnterior
    .filter(t => t.valorFinal !== null)
    .reduce((acc, t) => acc + (t.valorFinal || 0), 0)
  const variacaoReceita = receitaAnterior > 0
    ? ((receita - receitaAnterior) / receitaAnterior) * 100
    : 0

  // Distribuição por tipo de serviço
  const distribuicaoServicos = tickets.reduce((acc, ticket) => {
    const tipo = ticket.tipoServico
    if (!acc[tipo]) {
      acc[tipo] = 0
    }
    acc[tipo]++
    return acc
  }, {} as Record<string, number>)

  const distribuicaoServicosArray = Object.entries(distribuicaoServicos)
    .map(([servico, total]) => ({
      servico,
      total,
      percentual: (total / totalTickets) * 100
    }))
    .sort((a, b) => b.total - a.total)

  // Distribuição por cidade
  const distribuicaoCidades = tickets.reduce((acc, ticket) => {
    const cidade = ticket.origemCidade
    if (!acc[cidade]) {
      acc[cidade] = 0
    }
    acc[cidade]++
    return acc
  }, {} as Record<string, number>)

  const distribuicaoCidadesArray = Object.entries(distribuicaoCidades)
    .map(([cidade, total]) => ({
      cidade,
      total,
      percentual: (total / totalTickets) * 100
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10) // Top 10 cidades

  return {
    periodo: {
      inicio: periodo.inicio,
      fim: periodo.fim,
      tipo: tipoPeriodo
    },
    metricas: {
      tickets: {
        total: totalTickets,
        abertos: ticketsAbertos,
        emAndamento: ticketsEmAndamento,
        concluidos: ticketsConcluidos,
        cancelados: ticketsCancelados,
        variacao: variacaoTickets
      },
      taxaResolucao: {
        valor: taxaResolucao,
        variacao: variacaoTaxaResolucao
      },
      tempoMedio: {
        valor: formatarTempo(tempoMedioSegundos),
        minutos: tempoMedioMinutos,
        segundos: tempoMedioSegundos,
        variacao: variacaoTMR
      },
      avaliacaoMedia: {
        valor: avaliacaoMedia,
        variacao: variacaoCSAT
      },
      clientesAtivos: {
        total: clientesUnicos,
        variacao: variacaoClientes
      },
      receita: {
        valor: receita,
        variacao: variacaoReceita
      }
    },
    distribuicaoServicos: distribuicaoServicosArray,
    distribuicaoCidades: distribuicaoCidadesArray
  }
}

// ==========================================
// RELATÓRIO: TICKETS DETALHADO
// ==========================================

export async function obterRelatorioTickets(
  tipoPeriodo: PeriodoRelatorio['tipo'] = '30dias',
  filtros: FiltrosRelatorio = {}
) {
  const periodo = calcularPeriodo(tipoPeriodo)

  const whereClause: any = {
    createdAt: {
      gte: periodo.inicio,
      lte: periodo.fim
    }
  }

  if (filtros.tiposServico?.length) {
    whereClause.tipoServico = { in: filtros.tiposServico }
  }
  if (filtros.status?.length) {
    whereClause.status = { in: filtros.status }
  }
  if (filtros.cidades?.length) {
    whereClause.origemCidade = { in: filtros.cidades }
  }

  const tickets = await prisma.ticket.findMany({
    where: whereClause,
    include: {
      cliente: true,
      prestador: true,
      veiculo: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Tickets por prioridade
  const ticketsPorPrioridade = tickets.reduce((acc, ticket) => {
    const prioridade = ticket.prioridade
    if (!acc[prioridade]) {
      acc[prioridade] = 0
    }
    acc[prioridade]++
    return acc
  }, {} as Record<string, number>)

  // Tickets por status
  const ticketsPorStatus = tickets.reduce((acc, ticket) => {
    const status = ticket.status
    if (!acc[status]) {
      acc[status] = 0
    }
    acc[status]++
    return acc
  }, {} as Record<string, number>)

  // Tempo médio por tipo de serviço
  const temposPorServico = tickets.reduce((acc, ticket) => {
    if (ticket.tempoAtendimento) {
      if (!acc[ticket.tipoServico]) {
        acc[ticket.tipoServico] = { total: 0, count: 0 }
      }
      acc[ticket.tipoServico].total += ticket.tempoAtendimento
      acc[ticket.tipoServico].count++
    }
    return acc
  }, {} as Record<string, { total: number; count: number }>)

  const tempoMedioPorServico = Object.entries(temposPorServico).map(([servico, data]) => ({
    servico,
    tempoMedio: data.total / data.count,
    tempoMedioFormatado: formatarTempo((data.total / data.count) * 60)
  }))

  return {
    periodo: {
      inicio: periodo.inicio,
      fim: periodo.fim,
      tipo: tipoPeriodo
    },
    total: tickets.length,
    ticketsPorPrioridade,
    ticketsPorStatus,
    tempoMedioPorServico,
    tickets: tickets.map(ticket => ({
      id: ticket.id,
      protocolo: ticket.protocolo,
      cliente: ticket.cliente.nome,
      tipoServico: ticket.tipoServico,
      status: ticket.status,
      prioridade: ticket.prioridade,
      origem: ticket.origemCidade,
      destino: ticket.destinoCidade,
      prestador: ticket.prestador?.nome || 'Não atribuído',
      valorFinal: ticket.valorFinal,
      tempoAtendimento: ticket.tempoAtendimento,
      avaliacaoCliente: ticket.avaliacaoCliente,
      dataAbertura: ticket.dataAbertura,
      dataConclusao: ticket.dataConclusao
    }))
  }
}

// ==========================================
// RELATÓRIO: PRESTADORES
// ==========================================

export async function obterRelatorioPrestadores(
  tipoPeriodo: PeriodoRelatorio['tipo'] = '30dias',
  filtros: FiltrosRelatorio = {}
) {
  const periodo = calcularPeriodo(tipoPeriodo)

  // Buscar todos os prestadores ativos
  const prestadores = await prisma.prestador.findMany({
    where: {
      status: 'ativo'
    },
    include: {
      tickets: {
        where: {
          createdAt: {
            gte: periodo.inicio,
            lte: periodo.fim
          },
          ...(filtros.tiposServico?.length && { tipoServico: { in: filtros.tiposServico } }),
          ...(filtros.status?.length && { status: { in: filtros.status } })
        }
      }
    }
  })

  const ranking = prestadores
    .map(prestador => {
      const tickets = prestador.tickets
      const ticketsConcluidos = tickets.filter(t => t.status === 'concluido')
      
      const tempoMedio = ticketsConcluidos.length > 0
        ? ticketsConcluidos.reduce((acc, t) => acc + (t.tempoAtendimento || 0), 0) / ticketsConcluidos.length
        : 0

      const avaliacaoMedia = ticketsConcluidos.filter(t => t.avaliacaoCliente).length > 0
        ? ticketsConcluidos
            .filter(t => t.avaliacaoCliente)
            .reduce((acc, t) => acc + (t.avaliacaoCliente || 0), 0) / 
          ticketsConcluidos.filter(t => t.avaliacaoCliente).length
        : 0

      const receitaTotal = ticketsConcluidos.reduce((acc, t) => acc + (t.valorFinal || 0), 0)

      return {
        id: prestador.id,
        nome: prestador.nome,
        totalAtendimentos: tickets.length,
        atendimentosConcluidos: ticketsConcluidos.length,
        tempoMedio: formatarTempo(tempoMedio * 60),
        avaliacaoMedia,
        receitaTotal,
        taxaConclusao: tickets.length > 0 ? (ticketsConcluidos.length / tickets.length) * 100 : 0,
        servicos: prestador.servicos ? JSON.parse(prestador.servicos as string) : [],
        cidade: prestador.cidade,
        disponivel: prestador.disponivel
      }
    })
    .sort((a, b) => b.totalAtendimentos - a.totalAtendimentos)

  return {
    periodo: {
      inicio: periodo.inicio,
      fim: periodo.fim,
      tipo: tipoPeriodo
    },
    totalPrestadores: prestadores.length,
    prestadoresAtivos: prestadores.filter(p => p.disponivel).length,
    ranking
  }
}

// ==========================================
// RELATÓRIO: FINANCEIRO
// ==========================================

export async function obterRelatorioFinanceiro(
  tipoPeriodo: PeriodoRelatorio['tipo'] = '30dias',
  filtros: FiltrosRelatorio = {}
) {
  const periodo = calcularPeriodo(tipoPeriodo)
  const periodoAnterior = calcularPeriodoAnterior(periodo)

  const whereClause: any = {
    createdAt: {
      gte: periodo.inicio,
      lte: periodo.fim
    },
    status: 'concluido',
    valorFinal: { not: null }
  }

  if (filtros.tiposServico?.length) {
    whereClause.tipoServico = { in: filtros.tiposServico }
  }

  // Tickets do período atual
  const tickets = await prisma.ticket.findMany({
    where: whereClause,
    include: {
      cliente: true,
      prestador: true
    }
  })

  // Tickets do período anterior
  const ticketsAnterior = await prisma.ticket.findMany({
    where: {
      ...whereClause,
      createdAt: {
        gte: periodoAnterior.inicio,
        lte: periodoAnterior.fim
      }
    }
  })

  // Receita total
  const receitaTotal = tickets.reduce((acc, t) => acc + (t.valorFinal || 0), 0)
  const receitaTotalAnterior = ticketsAnterior.reduce((acc, t) => acc + (t.valorFinal || 0), 0)
  const variacaoReceita = receitaTotalAnterior > 0
    ? ((receitaTotal - receitaTotalAnterior) / receitaTotalAnterior) * 100
    : 0

  // Ticket médio
  const ticketMedio = tickets.length > 0 ? receitaTotal / tickets.length : 0
  const ticketMedioAnterior = ticketsAnterior.length > 0 
    ? receitaTotalAnterior / ticketsAnterior.length 
    : 0
  const variacaoTicketMedio = ticketMedioAnterior > 0
    ? ((ticketMedio - ticketMedioAnterior) / ticketMedioAnterior) * 100
    : 0

  // Receita por tipo de serviço
  const receitaPorServico = tickets.reduce((acc, ticket) => {
    const tipo = ticket.tipoServico
    if (!acc[tipo]) {
      acc[tipo] = { receita: 0, quantidade: 0 }
    }
    acc[tipo].receita += ticket.valorFinal || 0
    acc[tipo].quantidade++
    return acc
  }, {} as Record<string, { receita: number; quantidade: number }>)

  const receitaPorServicoArray = Object.entries(receitaPorServico)
    .map(([servico, data]) => ({
      servico,
      receita: data.receita,
      quantidade: data.quantidade,
      ticketMedio: data.receita / data.quantidade,
      percentual: (data.receita / receitaTotal) * 100
    }))
    .sort((a, b) => b.receita - a.receita)

  // Top prestadores por receita
  const receitaPorPrestador = tickets.reduce((acc, ticket) => {
    if (ticket.prestadorId) {
      if (!acc[ticket.prestadorId]) {
        acc[ticket.prestadorId] = {
          nome: ticket.prestador?.nome || 'Desconhecido',
          receita: 0,
          quantidade: 0
        }
      }
      acc[ticket.prestadorId].receita += ticket.valorFinal || 0
      acc[ticket.prestadorId].quantidade++
    }
    return acc
  }, {} as Record<string, { nome: string; receita: number; quantidade: number }>)

  const topPrestadores = Object.values(receitaPorPrestador)
    .sort((a, b) => b.receita - a.receita)
    .slice(0, 10)

  return {
    periodo: {
      inicio: periodo.inicio,
      fim: periodo.fim,
      tipo: tipoPeriodo
    },
    metricas: {
      receitaTotal: {
        valor: receitaTotal,
        variacao: variacaoReceita
      },
      ticketMedio: {
        valor: ticketMedio,
        variacao: variacaoTicketMedio
      },
      totalTransacoes: tickets.length
    },
    receitaPorServico: receitaPorServicoArray,
    topPrestadores
  }
}

// ==========================================
// RELATÓRIO: CLIENTES
// ==========================================

export async function obterRelatorioClientes(
  tipoPeriodo: PeriodoRelatorio['tipo'] = '30dias'
) {
  const periodo = calcularPeriodo(tipoPeriodo)

  // Clientes com tickets no período
  const tickets = await prisma.ticket.findMany({
    where: {
      createdAt: {
        gte: periodo.inicio,
        lte: periodo.fim
      }
    },
    include: {
      cliente: true
    }
  })

  // Agrupar por cliente
  const clientesMap = tickets.reduce((acc, ticket) => {
    const clienteId = ticket.clienteId
    if (!acc[clienteId]) {
      acc[clienteId] = {
        id: clienteId,
        nome: ticket.cliente.nome,
        email: ticket.cliente.email,
        telefone: ticket.cliente.telefone,
        totalTickets: 0,
        ticketsConcluidos: 0,
        valorTotal: 0,
        avaliacaoMedia: 0,
        avaliacoes: []
      }
    }
    acc[clienteId].totalTickets++
    if (ticket.status === 'concluido') {
      acc[clienteId].ticketsConcluidos++
      acc[clienteId].valorTotal += ticket.valorFinal || 0
    }
    if (ticket.avaliacaoCliente) {
      acc[clienteId].avaliacoes.push(ticket.avaliacaoCliente)
    }
    return acc
  }, {} as Record<string, any>)

  // Calcular avaliação média e ordenar
  const clientes = Object.values(clientesMap)
    .map(cliente => ({
      ...cliente,
      avaliacaoMedia: cliente.avaliacoes.length > 0
        ? cliente.avaliacoes.reduce((a: number, b: number) => a + b, 0) / cliente.avaliacoes.length
        : 0,
      ticketMedio: cliente.ticketsConcluidos > 0
        ? cliente.valorTotal / cliente.ticketsConcluidos
        : 0
    }))
    .sort((a, b) => b.totalTickets - a.totalTickets)

  const totalClientes = clientes.length
  const clientesAtivos = clientes.filter(c => c.totalTickets > 0).length

  return {
    periodo: {
      inicio: periodo.inicio,
      fim: periodo.fim,
      tipo: tipoPeriodo
    },
    metricas: {
      totalClientes,
      clientesAtivos,
      ticketMedioPorCliente: totalClientes > 0
        ? tickets.length / totalClientes
        : 0
    },
    clientes: clientes.slice(0, 50) // Top 50 clientes
  }
}
