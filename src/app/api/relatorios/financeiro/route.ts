import { NextRequest, NextResponse } from 'next/server'
import { obterRelatorioFinanceiro } from '@/lib/services/relatorios.service'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const periodo = searchParams.get('periodo') as any || '30dias'
    
    // Filtros
    const tiposServico = searchParams.get('tiposServico')?.split(',').filter(Boolean)

    const filtros = {
      tiposServico
    }

    const relatorio = await obterRelatorioFinanceiro(periodo, filtros)

    return NextResponse.json(relatorio)
  } catch (error) {
    console.error('Erro ao gerar relatório financeiro:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar relatório financeiro' },
      { status: 500 }
    )
  }
}
