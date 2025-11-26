import { NextRequest, NextResponse } from 'next/server'
import { obterRelatorioPrestadores } from '@/lib/services/relatorios.service'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const periodo = searchParams.get('periodo') as any || '30dias'
    
    // Filtros
    const tiposServico = searchParams.get('tiposServico')?.split(',').filter(Boolean)
    const status = searchParams.get('status')?.split(',').filter(Boolean)

    const filtros = {
      tiposServico,
      status
    }

    const relatorio = await obterRelatorioPrestadores(periodo, filtros)

    return NextResponse.json(relatorio)
  } catch (error) {
    console.error('Erro ao gerar relatório de prestadores:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar relatório de prestadores' },
      { status: 500 }
    )
  }
}
