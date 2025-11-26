import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API para atualizar heartbeat do usuário (status online)
 * POST /api/heartbeat
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { usuarioId } = body;

    if (!usuarioId) {
      return NextResponse.json(
        { success: false, error: 'usuarioId é obrigatório' },
        { status: 400 }
      );
    }

    // Atualizar ultimoHeartbeat do usuário
    await prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        ultimoHeartbeat: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('Erro ao atualizar heartbeat:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar heartbeat' },
      { status: 500 }
    );
  }
}
