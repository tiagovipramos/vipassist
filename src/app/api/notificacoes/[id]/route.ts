import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/notificacoes/[id] - Marcar notificação como lida
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const notificacao = await prisma.notificacao.update({
      where: { id },
      data: { lida: true }
    })

    return NextResponse.json(notificacao)
  } catch (error) {
    console.error('Erro ao atualizar notificação:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar notificação' },
      { status: 500 }
    )
  }
}

// DELETE /api/notificacoes/[id] - Deletar notificação
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.notificacao.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar notificação:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar notificação' },
      { status: 500 }
    )
  }
}
