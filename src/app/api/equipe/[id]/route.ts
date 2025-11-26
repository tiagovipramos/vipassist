import { NextResponse } from 'next/server';
import { EquipeService } from '@/lib/services/equipe.service';

/**
 * GET /api/equipe/[id]
 * Busca um membro específico por ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const membro = await EquipeService.buscarMembroPorId(params.id);

    if (!membro) {
      return NextResponse.json(
        {
          success: false,
          error: 'Membro não encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: membro,
    });
  } catch (error) {
    console.error('Erro ao buscar membro:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar membro',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/equipe/[id]
 * Atualiza um membro
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dados = await request.json();

    const membroAtualizado = await EquipeService.atualizarMembro(
      params.id,
      dados
    );

    return NextResponse.json({
      success: true,
      data: membroAtualizado,
      message: 'Membro atualizado com sucesso',
    });
  } catch (error: any) {
    console.error('Erro ao atualizar membro:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          error: 'Membro não encontrado',
        },
        { status: 404 }
      );
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          error: 'Este email já está em uso',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao atualizar membro',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/equipe/[id]
 * Remove um membro
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await EquipeService.removerMembro(params.id);

    return NextResponse.json({
      success: true,
      message: 'Membro removido com sucesso',
    });
  } catch (error: any) {
    console.error('Erro ao remover membro:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          error: 'Membro não encontrado',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao remover membro',
      },
      { status: 500 }
    );
  }
}
