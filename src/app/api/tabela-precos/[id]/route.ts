import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar preço por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const preco = await prisma.tabelaPreco.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!preco) {
      return NextResponse.json(
        { success: false, error: 'Preço não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: preco,
    })
  } catch (error) {
    console.error('Erro ao buscar preço:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar preço' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar preço
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const preco = await prisma.tabelaPreco.update({
      where: {
        id: params.id,
      },
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: preco,
      message: 'Preço atualizado com sucesso',
    })
  } catch (error) {
    console.error('Erro ao atualizar preço:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar preço' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar preço
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.tabelaPreco.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Preço deletado com sucesso',
    })
  } catch (error) {
    console.error('Erro ao deletar preço:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar preço' },
      { status: 500 }
    )
  }
}
