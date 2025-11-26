import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/notificacoes - Listar notificações
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const usuarioId = searchParams.get('usuarioId')
    const apenasNaoLidas = searchParams.get('apenasNaoLidas') === 'true'
    const limite = parseInt(searchParams.get('limite') || '50')

    const where: any = {}
    
    if (usuarioId) {
      where.usuarioId = usuarioId
    }
    
    if (apenasNaoLidas) {
      where.lida = false
    }

    const notificacoes = await prisma.notificacao.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: limite
    })

    // Formatar datas para exibição
    const notificacoesFormatadas = notificacoes.map(notif => {
      const agora = new Date()
      const diff = agora.getTime() - new Date(notif.createdAt).getTime()
      const minutos = Math.floor(diff / 60000)
      const horas = Math.floor(diff / 3600000)
      const dias = Math.floor(diff / 86400000)

      let dataHora = ''
      if (minutos < 1) {
        dataHora = 'Agora'
      } else if (minutos < 60) {
        dataHora = `Há ${minutos} minuto${minutos > 1 ? 's' : ''}`
      } else if (horas < 24) {
        dataHora = `Há ${horas} hora${horas > 1 ? 's' : ''}`
      } else if (dias === 1) {
        dataHora = 'Ontem'
      } else if (dias < 7) {
        dataHora = `Há ${dias} dias`
      } else {
        dataHora = new Date(notif.createdAt).toLocaleDateString('pt-BR')
      }

      return {
        id: notif.id,
        tipo: notif.tipo,
        titulo: notif.titulo,
        descricao: notif.descricao,
        icone: notif.icone,
        link: notif.link,
        lida: notif.lida,
        dataHora,
        createdAt: notif.createdAt
      }
    })

    return NextResponse.json(notificacoesFormatadas)
  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar notificações' },
      { status: 500 }
    )
  }
}

// POST /api/notificacoes - Criar notificação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { usuarioId, tipo, titulo, descricao, icone, link } = body

    if (!tipo || !titulo || !descricao || !icone) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: tipo, titulo, descricao, icone' },
        { status: 400 }
      )
    }

    const notificacao = await prisma.notificacao.create({
      data: {
        usuarioId,
        tipo,
        titulo,
        descricao,
        icone,
        link,
        lida: false
      }
    })

    return NextResponse.json(notificacao, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar notificação:', error)
    return NextResponse.json(
      { error: 'Erro ao criar notificação' },
      { status: 500 }
    )
  }
}
