import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar todos os prestadores
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const tipoPessoa = searchParams.get('tipoPessoa')
    const estado = searchParams.get('estado')
    const cidade = searchParams.get('cidade')
    const search = searchParams.get('search')

    // Construir filtros do Prisma
    const where: any = {}

    if (status && status !== 'todos') {
      where.status = status
    }

    if (tipoPessoa && tipoPessoa !== 'todos') {
      where.tipoPessoa = tipoPessoa
    }

    if (estado && estado !== 'todos') {
      where.estado = estado
    }

    if (cidade && cidade !== 'todos') {
      where.cidade = cidade
    }

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { telefone: { contains: search } },
        { cpf: { contains: search } },
        { cnpj: { contains: search } },
      ]
    }

    const prestadores = await prisma.prestador.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Converter para o formato esperado pelo frontend
    const prestadoresFormatados = prestadores.map(p => ({
      id: p.id,
      nome: p.nome,
      razaoSocial: p.razaoSocial,
      tipoPessoa: p.tipoPessoa,
      cpf: p.cpf,
      cnpj: p.cnpj,
      email: p.email,
      telefone: p.telefone,
      celular: p.celular,
      endereco: {
        cep: p.cep,
        logradouro: p.logradouro,
        numero: p.numero,
        complemento: p.complemento,
        bairro: p.bairro,
        cidade: p.cidade,
        estado: p.estado,
      },
      servicos: Array.isArray(p.servicos) ? p.servicos : JSON.parse(p.servicos as string),
      raioAtuacao: p.raioAtuacao,
      dadosBancarios: p.pixChave ? {
        pixChave: p.pixChave,
        banco: p.banco,
        agencia: p.agencia,
        conta: p.conta,
        tipoConta: p.tipoConta,
      } : undefined,
      status: p.status,
      disponivel: p.disponivel,
      avaliacaoMedia: p.avaliacaoMedia,
      totalAtendimentos: p.totalAtendimentos,
      ultimaLocalizacao: p.latitude && p.longitude ? {
        latitude: p.latitude,
        longitude: p.longitude,
        dataAtualizacao: p.ultimaAtualizacaoLocalizacao?.toISOString(),
      } : undefined,
      dataCadastro: p.createdAt.toISOString(),
      dataAtualizacao: p.updatedAt.toISOString(),
      observacoes: p.observacoes,
      documentos: [],
    }))

    return NextResponse.json({
      success: true,
      data: prestadoresFormatados,
      total: prestadoresFormatados.length
    })
  } catch (error) {
    console.error('Erro ao listar prestadores:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao listar prestadores' },
      { status: 500 }
    )
  }
}

// POST - Criar novo prestador
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validações básicas
    if (!body.nome || !body.email || !body.telefone) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const emailExists = await prisma.prestador.findUnique({
      where: { email: body.email }
    })
    if (emailExists) {
      return NextResponse.json(
        { success: false, error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Verificar CPF/CNPJ duplicado
    if (body.cpf) {
      const cpfExists = await prisma.prestador.findUnique({
        where: { cpf: body.cpf }
      })
      if (cpfExists) {
        return NextResponse.json(
          { success: false, error: 'CPF já cadastrado' },
          { status: 400 }
        )
      }
    }

    if (body.cnpj) {
      const cnpjExists = await prisma.prestador.findUnique({
        where: { cnpj: body.cnpj }
      })
      if (cnpjExists) {
        return NextResponse.json(
          { success: false, error: 'CNPJ já cadastrado' },
          { status: 400 }
        )
      }
    }

    // Criar prestador no banco
    const novoPrestador = await prisma.prestador.create({
      data: {
        nome: body.nome,
        razaoSocial: body.razaoSocial,
        tipoPessoa: body.tipoPessoa || 'fisica',
        cpf: body.cpf,
        cnpj: body.cnpj,
        email: body.email,
        telefone: body.telefone,
        celular: body.celular || body.telefone,
        cep: body.endereco.cep,
        logradouro: body.endereco.logradouro,
        numero: body.endereco.numero,
        complemento: body.endereco.complemento,
        bairro: body.endereco.bairro,
        cidade: body.endereco.cidade,
        estado: body.endereco.estado,
        servicos: body.servicos || [],
        raioAtuacao: body.raioAtuacao || 50,
        pixChave: body.dadosBancarios?.pixChave,
        banco: body.dadosBancarios?.banco,
        agencia: body.dadosBancarios?.agencia,
        conta: body.dadosBancarios?.conta,
        tipoConta: body.dadosBancarios?.tipoConta,
        status: body.status || 'pendente',
        disponivel: body.disponivel !== undefined ? body.disponivel : true,
        observacoes: body.observacoes,
      }
    })

    // Formatar resposta
    const prestadorFormatado = {
      id: novoPrestador.id,
      nome: novoPrestador.nome,
      razaoSocial: novoPrestador.razaoSocial,
      tipoPessoa: novoPrestador.tipoPessoa,
      cpf: novoPrestador.cpf,
      cnpj: novoPrestador.cnpj,
      email: novoPrestador.email,
      telefone: novoPrestador.telefone,
      celular: novoPrestador.celular,
      endereco: {
        cep: novoPrestador.cep,
        logradouro: novoPrestador.logradouro,
        numero: novoPrestador.numero,
        complemento: novoPrestador.complemento,
        bairro: novoPrestador.bairro,
        cidade: novoPrestador.cidade,
        estado: novoPrestador.estado,
      },
      servicos: Array.isArray(novoPrestador.servicos) ? novoPrestador.servicos : JSON.parse(novoPrestador.servicos as string),
      raioAtuacao: novoPrestador.raioAtuacao,
      dadosBancarios: novoPrestador.pixChave ? {
        pixChave: novoPrestador.pixChave,
        banco: novoPrestador.banco,
        agencia: novoPrestador.agencia,
        conta: novoPrestador.conta,
        tipoConta: novoPrestador.tipoConta,
      } : undefined,
      status: novoPrestador.status,
      disponivel: novoPrestador.disponivel,
      avaliacaoMedia: novoPrestador.avaliacaoMedia,
      totalAtendimentos: novoPrestador.totalAtendimentos,
      dataCadastro: novoPrestador.createdAt.toISOString(),
      dataAtualizacao: novoPrestador.updatedAt.toISOString(),
      observacoes: novoPrestador.observacoes,
      documentos: [],
    }

    return NextResponse.json({
      success: true,
      data: prestadorFormatado,
      message: 'Prestador criado com sucesso'
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar prestador:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao criar prestador' },
      { status: 500 }
    )
  }
}
