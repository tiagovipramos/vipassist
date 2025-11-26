import { NextRequest, NextResponse } from 'next/server'
import { obterRelatorioClientes } from '@/lib/services/relatorios.service'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const periodo = searchParams.get('periodo') as any || '30dias'

    const relatorio = await obterRelatorioClientes(periodo)

    return NextResponse.json(relatorio)
  } catch (error) {
    console.error('Erro ao gerar relatório de clientes:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar relatório de clientes' },
      { status: 500 }
    )
  }
}
