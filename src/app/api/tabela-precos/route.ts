import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar todos os preços
export async function GET(request: NextRequest) {
  try {
    const precos = await prisma.tabelaPreco.findMany({
      orderBy: {
        nome: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: precos,
      total: precos.length,
    })
  } catch (error) {
    console.error('Erro ao buscar preços:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar preços' },
      { status: 500 }
    )
  }
}

// POST - Criar novo preço
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const preco = await prisma.tabelaPreco.create({
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: preco,
      message: 'Preço criado com sucesso',
    })
  } catch (error) {
    console.error('Erro ao criar preço:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar preço' },
      { status: 500 }
    )
  }
}
