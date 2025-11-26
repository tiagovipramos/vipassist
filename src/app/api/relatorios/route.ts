import { NextRequest, NextResponse } from 'next/server'
import { obterRelatorioVisaoGeral } from '@/lib/services/relatorios.service'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const periodo = searchParams.get('periodo') as any || '30dias'
    const compararComAnterior = searchParams.get('comparar') !== 'false'
    
    // Filtros
    const tiposServico = searchParams.get('tiposServico')?.split(',').filter(Boolean)
    const status = searchParams.get('status')?.split(',').filter(Boolean)
    const cidades = searchParams.get('cidades')?.split(',').filter(Boolean)

    const filtros = {
      tiposServico,
      status,
      cidades
    }

    const relatorio = await obterRelatorioVisaoGeral(periodo, filtros, compararComAnterior)

    return NextResponse.json(relatorio)
  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar relatório' },
      { status: 500 }
    )
  }
}
