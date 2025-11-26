import { NextResponse } from 'next/server';
import { EquipeService } from '@/lib/services/equipe.service';

/**
 * GET /api/equipe
 * Lista todos os membros da equipe com suas estatísticas
 */
export async function GET() {
  try {
    const membros = await EquipeService.listarMembros();
    const estatisticas = await EquipeService.obterEstatisticas();

    return NextResponse.json({
      success: true,
      data: {
        membros,
        estatisticas,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar equipe:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar dados da equipe',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/equipe
 * Cria um novo membro da equipe
 */
export async function POST(request: Request) {
  try {
    const dados = await request.json();

    // Validações básicas
    if (!dados.nome || !dados.email || !dados.senha || !dados.role) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados incompletos. Nome, email, senha e role são obrigatórios.',
        },
        { status: 400 }
      );
    }

    const novoMembro = await EquipeService.criarMembro(dados);

    return NextResponse.json({
      success: true,
      data: novoMembro,
      message: 'Membro criado com sucesso',
    });
  } catch (error: any) {
    console.error('Erro ao criar membro:', error);
    
    // Tratar erro de email duplicado
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
        error: 'Erro ao criar membro',
      },
      { status: 500 }
    );
  }
}
