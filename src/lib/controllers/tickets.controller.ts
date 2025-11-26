/**
 * Controller de Tickets
 * Camada de abstração entre as rotas de API e os services
 * Responsável por validação, transformação de dados e orquestração
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  createTicketSchema, 
  updateTicketSchema,
  listTicketsQuerySchema,
  CreateTicketDTO,
  UpdateTicketDTO
} from '@/lib/validators/ticket.validator'
import { validateData, validateQueryParams, ValidationError, validationErrorResponse } from '@/lib/utils/validation'
import { withCache, createCacheKey, CACHE_CONFIG, invalidateCacheByTag } from '@/lib/utils/cache'

/**
 * Lista todos os tickets com filtros e paginação
 */
export async function listTickets(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Validar query params
    const query = validateQueryParams(listTicketsQuerySchema, searchParams)
    
    // Criar chave de cache baseada nos parâmetros
    const cacheKey = createCacheKey('tickets:list', {
      status: query.status,
      prioridade: query.prioridade,
      clienteId: query.clienteId,
      prestadorId: query.prestadorId,
      dataInicio: query.dataInicio,
      dataFim: query.dataFim,
      page: query.page,
      limit: query.limit,
    })
    
    // Tentar buscar do cache
    const result = await withCache(
      cacheKey,
      async () => {
        // Construir filtros
    const where: any = {}
    if (query.status) where.status = query.status
    if (query.prioridade) where.prioridade = query.prioridade
    if (query.clienteId) where.clienteId = query.clienteId
    if (query.prestadorId) where.prestadorId = query.prestadorId
    
    // Filtros de data
    if (query.dataInicio || query.dataFim) {
      where.dataAbertura = {}
      if (query.dataInicio) where.dataAbertura.gte = new Date(query.dataInicio)
      if (query.dataFim) where.dataAbertura.lte = new Date(query.dataFim)
    }
    
    // Calcular paginação
    const skip = (query.page - 1) * query.limit
    
        // Buscar tickets e total
        const [tickets, total] = await Promise.all([
          prisma.ticket.findMany({
            where,
            include: {
              cliente: {
                select: {
                  id: true,
                  nome: true,
                  telefone: true,
                  email: true,
                },
              },
              veiculo: {
                select: {
                  id: true,
                  placa: true,
                  marca: true,
                  modelo: true,
                },
              },
              prestador: {
                select: {
                  id: true,
                  nome: true,
                  telefone: true,
                  avaliacaoMedia: true,
                },
              },
              atendente: {
                select: {
                  id: true,
                  nome: true,
                },
              },
            },
            skip,
            take: query.limit,
            orderBy: {
              dataAbertura: 'desc',
            },
          }),
          prisma.ticket.count({ where }),
        ])
        
        return {
          success: true,
          data: tickets,
          pagination: {
            page: query.page,
            limit: query.limit,
            total,
            totalPages: Math.ceil(total / query.limit),
          },
        }
      },
      CACHE_CONFIG.tickets
    )
    
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof ValidationError) {
      return validationErrorResponse(error)
    }
    
    console.error('[Tickets Controller] Erro ao listar tickets:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao listar tickets' },
      { status: 500 }
    )
  }
}

/**
 * Cria um novo ticket
 */
export async function createTicket(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados de entrada
    const validatedData: CreateTicketDTO = validateData(createTicketSchema, body)
    
    // Gerar protocolo único
    const protocolo = `TKT-${Date.now()}`
    
    // Criar ticket no banco
    const ticket = await prisma.ticket.create({
      data: {
        protocolo,
        ...validatedData,
        status: 'aguardando',
        dataAbertura: new Date(),
      },
      include: {
        cliente: true,
        veiculo: true,
      },
    })
    
    // Invalidar cache de tickets
    invalidateCacheByTag('tickets')
    
    // TODO: Enviar notificação para atendentes
    // TODO: Registrar log de criação
    
    return NextResponse.json({
      success: true,
      data: ticket,
      message: 'Ticket criado com sucesso',
    }, { status: 201 })
  } catch (error) {
    if (error instanceof ValidationError) {
      return validationErrorResponse(error)
    }
    
    console.error('[Tickets Controller] Erro ao criar ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar ticket' },
      { status: 500 }
    )
  }
}

/**
 * Busca um ticket por ID
 */
export async function getTicketById(ticketId: string) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        cliente: true,
        veiculo: true,
        prestador: true,
        atendente: true,
        mensagens: {
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        historico: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })
    
    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket não encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: ticket,
    })
  } catch (error) {
    console.error('[Tickets Controller] Erro ao buscar ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar ticket' },
      { status: 500 }
    )
  }
}

/**
 * Atualiza um ticket
 */
export async function updateTicket(ticketId: string, request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados de entrada
    const validatedData: UpdateTicketDTO = validateData(updateTicketSchema, body)
    
    // Verificar se ticket existe
    const ticketExistente = await prisma.ticket.findUnique({
      where: { id: ticketId },
    })
    
    if (!ticketExistente) {
      return NextResponse.json(
        { success: false, error: 'Ticket não encontrado' },
        { status: 404 }
      )
    }
    
    // Atualizar ticket
    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data: validatedData,
      include: {
        cliente: true,
        veiculo: true,
        prestador: true,
      },
    })
    
    // Invalidar cache de tickets
    invalidateCacheByTag('tickets')
    
    // TODO: Registrar histórico de alteração
    // TODO: Enviar notificações se status mudou
    
    return NextResponse.json({
      success: true,
      data: ticket,
      message: 'Ticket atualizado com sucesso',
    })
  } catch (error) {
    if (error instanceof ValidationError) {
      return validationErrorResponse(error)
    }
    
    console.error('[Tickets Controller] Erro ao atualizar ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar ticket' },
      { status: 500 }
    )
  }
}
