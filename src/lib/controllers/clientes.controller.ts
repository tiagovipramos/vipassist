/**
 * Controller de Clientes
 * Camada de abstração entre as rotas de API e os services
 * Responsável por validação, transformação de dados e orquestração
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  createClienteSchema, 
  updateClienteSchema,
  listClientesQuerySchema,
  CreateClienteDTO,
  UpdateClienteDTO
} from '@/lib/validators/cliente.validator'
import { validateData, validateQueryParams, ValidationError, validationErrorResponse } from '@/lib/utils/validation'

/**
 * Lista todos os clientes com filtros e paginação
 */
export async function listClientes(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Validar query params
    const query = validateQueryParams(listClientesQuerySchema, searchParams)
    
    // Construir filtros
    const where: any = {}
    
    if (query.ativo !== undefined) {
      where.ativo = query.ativo
    }
    
    if (query.search) {
      where.OR = [
        { nome: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { telefone: { contains: query.search } },
        { cpf: { contains: query.search } },
      ]
    }
    
    // Calcular paginação
    const skip = (query.page - 1) * query.limit
    
    // Buscar clientes e total
    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          cpf: true,
          cidade: true,
          estado: true,
          plano: true,
          ativo: true,
          createdAt: true,
        },
        skip,
        take: query.limit,
        orderBy: {
          nome: 'asc',
        },
      }),
      prisma.cliente.count({ where }),
    ])
    
    return NextResponse.json({
      success: true,
      data: clientes,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    })
  } catch (error) {
    if (error instanceof ValidationError) {
      return validationErrorResponse(error)
    }
    
    console.error('[Clientes Controller] Erro ao listar clientes:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao listar clientes' },
      { status: 500 }
    )
  }
}

/**
 * Cria um novo cliente
 */
export async function createCliente(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados de entrada
    const validatedData: CreateClienteDTO = validateData(createClienteSchema, body)
    
    // Verificar se CPF já existe (se fornecido)
    if (validatedData.cpf) {
      const clienteExistente = await prisma.cliente.findUnique({
        where: { cpf: validatedData.cpf },
      })
      
      if (clienteExistente) {
        return NextResponse.json(
          { success: false, error: 'CPF já cadastrado' },
          { status: 400 }
        )
      }
    }
    
    // Criar cliente no banco
    const cliente = await prisma.cliente.create({
      data: validatedData,
    })
    
    // TODO: Registrar log de criação
    
    return NextResponse.json({
      success: true,
      data: cliente,
      message: 'Cliente criado com sucesso',
    }, { status: 201 })
  } catch (error) {
    if (error instanceof ValidationError) {
      return validationErrorResponse(error)
    }
    
    console.error('[Clientes Controller] Erro ao criar cliente:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar cliente' },
      { status: 500 }
    )
  }
}

/**
 * Busca um cliente por ID
 */
export async function getClienteById(clienteId: string) {
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
      include: {
        veiculos: true,
        tickets: {
          select: {
            id: true,
            protocolo: true,
            tipoServico: true,
            status: true,
            dataAbertura: true,
          },
          orderBy: {
            dataAbertura: 'desc',
          },
          take: 10,
        },
      },
    })
    
    if (!cliente) {
      return NextResponse.json(
        { success: false, error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: cliente,
    })
  } catch (error) {
    console.error('[Clientes Controller] Erro ao buscar cliente:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar cliente' },
      { status: 500 }
    )
  }
}

/**
 * Atualiza um cliente
 */
export async function updateCliente(clienteId: string, request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados de entrada
    const validatedData: UpdateClienteDTO = validateData(updateClienteSchema, body)
    
    // Verificar se cliente existe
    const clienteExistente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    })
    
    if (!clienteExistente) {
      return NextResponse.json(
        { success: false, error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }
    
    // Se está atualizando CPF, verificar se não está duplicado
    if (validatedData.cpf && validatedData.cpf !== clienteExistente.cpf) {
      const cpfDuplicado = await prisma.cliente.findUnique({
        where: { cpf: validatedData.cpf },
      })
      
      if (cpfDuplicado) {
        return NextResponse.json(
          { success: false, error: 'CPF já cadastrado para outro cliente' },
          { status: 400 }
        )
      }
    }
    
    // Atualizar cliente
    const cliente = await prisma.cliente.update({
      where: { id: clienteId },
      data: validatedData,
    })
    
    // TODO: Registrar histórico de alteração
    
    return NextResponse.json({
      success: true,
      data: cliente,
      message: 'Cliente atualizado com sucesso',
    })
  } catch (error) {
    if (error instanceof ValidationError) {
      return validationErrorResponse(error)
    }
    
    console.error('[Clientes Controller] Erro ao atualizar cliente:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar cliente' },
      { status: 500 }
    )
  }
}

/**
 * Deleta um cliente (soft delete)
 */
export async function deleteCliente(clienteId: string) {
  try {
    // Verificar se cliente existe
    const clienteExistente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    })
    
    if (!clienteExistente) {
      return NextResponse.json(
        { success: false, error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }
    
    // Soft delete (marcar como inativo)
    await prisma.cliente.update({
      where: { id: clienteId },
      data: { ativo: false },
    })
    
    // TODO: Registrar log de exclusão
    
    return NextResponse.json({
      success: true,
      message: 'Cliente desativado com sucesso',
    })
  } catch (error) {
    console.error('[Clientes Controller] Erro ao deletar cliente:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar cliente' },
      { status: 500 }
    )
  }
}
