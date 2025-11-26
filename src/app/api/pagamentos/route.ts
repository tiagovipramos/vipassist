import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar todos os pagamentos com informações dos tickets
export async function GET(request: NextRequest) {
  try {
    // Buscar todos os pagamentos
    const pagamentos = await prisma.pagamento.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Para cada pagamento, buscar informações do ticket relacionado
    const pagamentosComDetalhes = await Promise.all(
      pagamentos.map(async (pagamento) => {
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

        if (!ticket) {
          return null
        }

        return {
          id: pagamento.id,
          protocolo: `PAG-${pagamento.id.slice(-8)}`,
          ticketProtocolo: pagamento.ticketProtocolo,
          ticketId: ticket.id,
          
          // Informações do serviço
          servicoTipo: ticket.tipoServico,
          servicoDescricao: ticket.descricaoProblema,
          
          // Informações do cliente
          clienteId: ticket.clienteId,
          clienteNome: ticket.cliente.nome,
          clienteTelefone: ticket.cliente.telefone,
          
          // Informações do prestador
          prestadorId: ticket.prestadorId,
          prestadorNome: ticket.prestador?.nome || 'Não atribuído',
          prestadorTelefone: ticket.prestador?.telefone || '',
          
          // Informações do pagamento
          valor: pagamento.valor,
          metodoPagamento: pagamento.metodoPagamento,
          status: pagamento.status === 'pago' ? 'finalizado' : pagamento.status, // Converter 'pago' para 'finalizado'
          dataPagamento: pagamento.dataPagamento,
          comprovante: pagamento.comprovante,
          observacoes: pagamento.observacoes,
          
          // Datas
          dataCriacao: pagamento.createdAt,
          dataVencimento: pagamento.createdAt, // Pode ajustar a lógica de vencimento
          
          // Informações adicionais do ticket
          ticketStatus: ticket.status,
          ticketDataConclusao: ticket.dataConclusao,
        }
      })
    )

    // Filtrar pagamentos que não encontraram ticket (null)
    const pagamentosValidos = pagamentosComDetalhes.filter((p) => p !== null)

    return NextResponse.json({
      success: true,
      data: pagamentosValidos,
      total: pagamentosValidos.length,
    })
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar pagamentos' },
      { status: 500 }
    )
  }
}

// POST - Criar novo pagamento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const pagamento = await prisma.pagamento.create({
      data: body,
    })

    return NextResponse.json({
      success: true,
      data: pagamento,
      message: 'Pagamento criado com sucesso',
    })
  } catch (error) {
    console.error('Erro ao criar pagamento:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar pagamento' },
      { status: 500 }
    )
  }
}
