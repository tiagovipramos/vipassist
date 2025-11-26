import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/permissoes - Retorna permissões
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const email = searchParams.get('email');

    // Se for busca por email, buscar usuário e suas permissões
    if (email) {
      const usuario = await prisma.usuario.findUnique({
        where: { email }
      });

      if (!usuario) {
        return NextResponse.json({
          success: false,
          error: 'Usuário não encontrado'
        }, { status: 404 });
      }

      // Buscar permissões ativas do role do usuário
      const permissoes = await prisma.permissao.findMany({
        where: {
          role: usuario.role,
          ativo: true
        }
      });

      // Retornar array de permissões no formato modulo.permissao
      const permissoesArray = permissoes.map(p => `${p.modulo}.${p.permissao}`);

      return NextResponse.json({
        success: true,
        permissoes: permissoesArray
      });
    }

    // Busca normal por role ou todas
    let permissoes;

    if (role) {
      // Buscar permissões de um role específico
      permissoes = await prisma.permissao.findMany({
        where: { role },
        orderBy: [
          { modulo: 'asc' },
          { permissao: 'asc' }
        ]
      });
    } else {
      // Buscar todas as permissões
      permissoes = await prisma.permissao.findMany({
        orderBy: [
          { role: 'asc' },
          { modulo: 'asc' },
          { permissao: 'asc' }
        ]
      });
    }

    // Agrupar por role
    const permissoesAgrupadas: Record<string, Record<string, boolean>> = {};

    permissoes.forEach((perm) => {
      if (!permissoesAgrupadas[perm.role]) {
        permissoesAgrupadas[perm.role] = {};
      }
      const chave = `${perm.modulo}.${perm.permissao}`;
      permissoesAgrupadas[perm.role][chave] = perm.ativo;
    });

    return NextResponse.json({
      success: true,
      data: permissoesAgrupadas
    });
  } catch (error) {
    console.error('Erro ao buscar permissões:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar permissões'
      },
      { status: 500 }
    );
  }
}

// PUT /api/permissoes - Atualiza uma permissão
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, chave, ativo } = body;

    if (!role || !chave || typeof ativo !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados inválidos. Necessário: role, chave, ativo'
        },
        { status: 400 }
      );
    }

    // Separar módulo e permissão da chave
    const [modulo, permissao] = chave.split('.');

    if (!modulo || !permissao) {
      return NextResponse.json(
        {
          success: false,
          error: 'Chave inválida. Formato esperado: modulo.permissao'
        },
        { status: 400 }
      );
    }

    // Atualizar ou criar permissão
    const permissaoAtualizada = await prisma.permissao.upsert({
      where: {
        role_modulo_permissao: {
          role,
          modulo,
          permissao
        }
      },
      update: {
        ativo
      },
      create: {
        role,
        modulo,
        permissao,
        ativo
      }
    });

    return NextResponse.json({
      success: true,
      data: permissaoAtualizada
    });
  } catch (error) {
    console.error('Erro ao atualizar permissão:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao atualizar permissão'
      },
      { status: 500 }
    );
  }
}

// POST /api/permissoes - Popular permissões padrão
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action !== 'seed') {
      return NextResponse.json(
        {
          success: false,
          error: 'Ação inválida. Use ?action=seed para popular permissões'
        },
        { status: 400 }
      );
    }

    // Definir permissões padrão
    const permissoesDefault = [
      // ADMIN - Acesso total
      { role: 'admin', modulo: 'geral', permissao: 'dashboard', ativo: true },
      { role: 'admin', modulo: 'operacional', permissao: 'chamados', ativo: true },
      { role: 'admin', modulo: 'operacional', permissao: 'criar_chamado', ativo: true },
      { role: 'admin', modulo: 'operacional', permissao: 'lista_chamados', ativo: true },
      { role: 'admin', modulo: 'operacional', permissao: 'mapa', ativo: true },
      { role: 'admin', modulo: 'operacional', permissao: 'prestadores', ativo: true },
      { role: 'admin', modulo: 'operacional', permissao: 'clientes', ativo: true },
      { role: 'admin', modulo: 'gestao', permissao: 'financeiro', ativo: true },
      { role: 'admin', modulo: 'gestao', permissao: 'relatorios', ativo: true },
      { role: 'admin', modulo: 'administrativo', permissao: 'usuarios', ativo: true },
      { role: 'admin', modulo: 'administrativo', permissao: 'logs', ativo: true },
      { role: 'admin', modulo: 'administrativo', permissao: 'seguranca', ativo: true },
      { role: 'admin', modulo: 'suporte', permissao: 'ajuda', ativo: true },
      { role: 'admin', modulo: 'suporte', permissao: 'api', ativo: true },

      // GESTOR - Sem gerenciamento de usuários
      { role: 'gestor', modulo: 'geral', permissao: 'dashboard', ativo: true },
      { role: 'gestor', modulo: 'operacional', permissao: 'chamados', ativo: true },
      { role: 'gestor', modulo: 'operacional', permissao: 'criar_chamado', ativo: true },
      { role: 'gestor', modulo: 'operacional', permissao: 'lista_chamados', ativo: true },
      { role: 'gestor', modulo: 'operacional', permissao: 'mapa', ativo: true },
      { role: 'gestor', modulo: 'operacional', permissao: 'prestadores', ativo: true },
      { role: 'gestor', modulo: 'operacional', permissao: 'clientes', ativo: true },
      { role: 'gestor', modulo: 'gestao', permissao: 'financeiro', ativo: true },
      { role: 'gestor', modulo: 'gestao', permissao: 'relatorios', ativo: true },
      { role: 'gestor', modulo: 'administrativo', permissao: 'usuarios', ativo: false },
      { role: 'gestor', modulo: 'administrativo', permissao: 'logs', ativo: true },
      { role: 'gestor', modulo: 'administrativo', permissao: 'seguranca', ativo: true },
      { role: 'gestor', modulo: 'suporte', permissao: 'ajuda', ativo: true },
      { role: 'gestor', modulo: 'suporte', permissao: 'api', ativo: true },

      // ATENDENTE - Apenas operacional básico
      { role: 'atendente', modulo: 'geral', permissao: 'dashboard', ativo: true },
      { role: 'atendente', modulo: 'operacional', permissao: 'chamados', ativo: true },
      { role: 'atendente', modulo: 'operacional', permissao: 'criar_chamado', ativo: true },
      { role: 'atendente', modulo: 'operacional', permissao: 'lista_chamados', ativo: true },
      { role: 'atendente', modulo: 'operacional', permissao: 'mapa', ativo: true },
      { role: 'atendente', modulo: 'operacional', permissao: 'prestadores', ativo: true },
      { role: 'atendente', modulo: 'operacional', permissao: 'clientes', ativo: true },
      { role: 'atendente', modulo: 'gestao', permissao: 'financeiro', ativo: false },
      { role: 'atendente', modulo: 'gestao', permissao: 'relatorios', ativo: false },
      { role: 'atendente', modulo: 'administrativo', permissao: 'usuarios', ativo: false },
      { role: 'atendente', modulo: 'administrativo', permissao: 'logs', ativo: false },
      { role: 'atendente', modulo: 'administrativo', permissao: 'seguranca', ativo: false },
      { role: 'atendente', modulo: 'suporte', permissao: 'ajuda', ativo: true },
      { role: 'atendente', modulo: 'suporte', permissao: 'api', ativo: false },
    ];

    // Inserir permissões (ignorar duplicatas)
    const resultados = await Promise.allSettled(
      permissoesDefault.map((perm) =>
        prisma.permissao.upsert({
          where: {
            role_modulo_permissao: {
              role: perm.role,
              modulo: perm.modulo,
              permissao: perm.permissao
            }
          },
          update: {
            ativo: perm.ativo
          },
          create: perm
        })
      )
    );

    const sucesso = resultados.filter((r) => r.status === 'fulfilled').length;
    const falhas = resultados.filter((r) => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      message: `Permissões populadas: ${sucesso} sucesso, ${falhas} falhas`,
      data: {
        sucesso,
        falhas,
        total: permissoesDefault.length
      }
    });
  } catch (error) {
    console.error('Erro ao popular permissões:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao popular permissões'
      },
      { status: 500 }
    );
  }
}
