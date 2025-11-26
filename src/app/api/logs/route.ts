import { NextRequest, NextResponse } from 'next/server';
import { LogsService } from '@/lib/services/logs.service';

/**
 * GET /api/logs
 * Listar logs com filtros e paginação
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extrair filtros
    const filtros: any = {
      tipo: searchParams.get('tipo') || 'todos',
      acao: searchParams.get('acao') || 'todos',
      nivel: searchParams.get('nivel') || 'todos',
      usuarioId: searchParams.get('usuarioId') || undefined,
      busca: searchParams.get('busca') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
    };

    // Filtros de data
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');

    if (dataInicio) {
      filtros.dataInicio = new Date(dataInicio);
    }

    if (dataFim) {
      filtros.dataFim = new Date(dataFim);
    }

    // Buscar logs
    const resultado = await LogsService.listarLogs(filtros);

    // Buscar estatísticas
    const estatisticas = await LogsService.obterEstatisticas();

    return NextResponse.json({
      success: true,
      data: {
        logs: resultado.logs,
        total: resultado.total,
        page: resultado.page,
        limit: resultado.limit,
        totalPages: resultado.totalPages,
        estatisticas,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar logs',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/logs
 * Criar um novo log
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extrair IP e User Agent
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Criar log
    const log = await LogsService.criarLog({
      ...body,
      ip,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      data: log,
    });
  } catch (error) {
    console.error('Erro ao criar log:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao criar log',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/logs
 * Limpar logs antigos
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dias = parseInt(searchParams.get('dias') || '90');

    const count = await LogsService.limparLogsAntigos(dias);

    return NextResponse.json({
      success: true,
      data: {
        message: `${count} logs removidos com sucesso`,
        count,
      },
    });
  } catch (error) {
    console.error('Erro ao limpar logs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao limpar logs',
      },
      { status: 500 }
    );
  }
}
