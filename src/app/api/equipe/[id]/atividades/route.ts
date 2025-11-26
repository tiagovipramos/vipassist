import { NextResponse } from 'next/server';
import { EquipeService } from '@/lib/services/equipe.service';

/**
 * GET /api/equipe/[id]/atividades
 * Busca atividades recentes de um membro
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limite = parseInt(searchParams.get('limite') || '20');

    const atividades = await EquipeService.buscarAtividades(params.id, limite);

    return NextResponse.json({
      success: true,
      data: atividades,
    });
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar atividades do membro',
      },
      { status: 500 }
    );
  }
}
