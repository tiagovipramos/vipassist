import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar pagamento específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pagamento = await prisma.pagamento.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!pagamento) {
      return NextResponse.json(
        { success: false, error: 'Pagamento não encontrado' },
        { status: 404 }
      )
    }

    // Buscar informações do ticket relacionado
    const ticket = await prisma.ticket.findUnique({
      where: {
        protocolo: pagamento.ticketProtocolo,
      },
      include: {
        cliente: true,
        prestador: true,
        veiculo: true,
      },
    })

    const pagamentoComDetalhes = {
      id: pagamento.id,
      protocolo: `PAG-${pagamento.id.slice(-8)}`,
      ticketProtocolo: pagamento.ticketProtocolo,
      ticketId: ticket?.id,
      
      // Informações do serviço
      servicoTipo: ticket?.tipoServico,
      servicoDescricao: ticket?.descricaoProblema,
      
      // Informações do cliente
      clienteId: ticket?.clienteId,
      clienteNome: ticket?.cliente.nome,
      clienteTelefone: ticket?.cliente.telefone,
      
      // Informações do prestador
      prestadorId: ticket?.prestadorId,
      prestadorNome: ticket?.prestador?.nome || 'Não atribuído',
      prestadorTelefone: ticket?.prestador?.telefone || '',
      
      // Informações do pagamento
      valor: pagamento.valor,
      metodoPagamento: pagamento.metodoPagamento,
      status: pagamento.status === 'pago' ? 'finalizado' : pagamento.status,
      dataPagamento: pagamento.dataPagamento,
      comprovante: pagamento.comprovante,
      observacoes: pagamento.observacoes,
      
      // Datas
      dataCriacao: pagamento.createdAt,
      dataVencimento: pagamento.createdAt,
      
      // Informações adicionais do ticket
      ticketStatus: ticket?.status,
      ticketDataConclusao: ticket?.dataConclusao,
    }

    return NextResponse.json({
      success: true,
      data: pagamentoComDetalhes,
    })
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar pagamento' },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar pagamento (confirmar pagamento, adicionar comprovante, etc)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Se está confirmando o pagamento, adicionar data de pagamento
    if (body.status === 'pago' || body.status === 'finalizado') {
      body.status = 'pago'
      if (!body.dataPagamento) {
        body.dataPagamento = new Date()
      }
    }

    const pagamento = await prisma.pagamento.update({
      where: {
        id: params.id,
      },
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: pagamento,
      message: 'Pagamento atualizado com sucesso',
    })
  } catch (error) {
    console.error('Erro ao atualizar pagamento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar pagamento' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar pagamento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.pagamento.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Pagamento deletado com sucesso',
    })
  } catch (error) {
    console.error('Erro ao deletar pagamento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar pagamento' },
      { status: 500 }
    )
  }
}
