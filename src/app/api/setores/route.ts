import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar todos os setores
export async function GET() {
  try {
    const setores = await prisma.setor.findMany({
      where: {
        ativo: true
      },
      include: {
        _count: {
          select: {
            usuarios: true
          }
        }
      },
      orderBy: {
        nome: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: setores
    });
  } catch (error) {
    console.error('Erro ao buscar setores:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar setores' },
      { status: 500 }
    );
  }
}

// POST - Criar novo setor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, descricao, icone, cor } = body;

    // Validações
    if (!nome || nome.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Nome do setor é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se já existe um setor com esse nome
    const setorExistente = await prisma.setor.findUnique({
      where: { nome }
    });

    if (setorExistente) {
      return NextResponse.json(
        { success: false, error: 'Já existe um setor com este nome' },
        { status: 400 }
      );
    }

    // Criar setor
    const novoSetor = await prisma.setor.create({
      data: {
        nome,
        descricao: descricao || null,
        icone: icone || null,
        cor: cor || null,
        ativo: true
      }
    });

    return NextResponse.json({
      success: true,
      data: novoSetor
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar setor:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar setor' },
      { status: 500 }
    );
  }
}
