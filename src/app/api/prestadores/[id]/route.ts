import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar prestador por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prestador = await prisma.prestador.findUnique({
      where: { id: params.id }
    })

    if (!prestador) {
      return NextResponse.json(
        { success: false, error: 'Prestador não encontrado' },
        { status: 404 }
      )
    }

    // Formatar resposta
    const prestadorFormatado = {
      id: prestador.id,
      nome: prestador.nome,
      razaoSocial: prestador.razaoSocial,
      tipoPessoa: prestador.tipoPessoa,
      cpf: prestador.cpf,
      cnpj: prestador.cnpj,
      email: prestador.email,
      telefone: prestador.telefone,
      celular: prestador.celular,
      endereco: {
        cep: prestador.cep,
        logradouro: prestador.logradouro,
        numero: prestador.numero,
        complemento: prestador.complemento,
        bairro: prestador.bairro,
        cidade: prestador.cidade,
        estado: prestador.estado,
      },
      servicos: Array.isArray(prestador.servicos) ? prestador.servicos : JSON.parse(prestador.servicos as string),
      raioAtuacao: prestador.raioAtuacao,
      dadosBancarios: prestador.pixChave ? {
        pixChave: prestador.pixChave,
        banco: prestador.banco,
        agencia: prestador.agencia,
        conta: prestador.conta,
        tipoConta: prestador.tipoConta,
      } : undefined,
      status: prestador.status,
      disponivel: prestador.disponivel,
      avaliacaoMedia: prestador.avaliacaoMedia,
      totalAtendimentos: prestador.totalAtendimentos,
      ultimaLocalizacao: prestador.latitude && prestador.longitude ? {
        latitude: prestador.latitude,
        longitude: prestador.longitude,
        dataAtualizacao: prestador.ultimaAtualizacaoLocalizacao?.toISOString(),
      } : undefined,
      dataCadastro: prestador.createdAt.toISOString(),
      dataAtualizacao: prestador.updatedAt.toISOString(),
      observacoes: prestador.observacoes,
      documentos: [],
    }

    return NextResponse.json({
      success: true,
      data: prestadorFormatado
    })
  } catch (error) {
    console.error('Erro ao buscar prestador:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar prestador' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar prestador
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Verificar se prestador existe
    const prestadorExistente = await prisma.prestador.findUnique({
      where: { id: params.id }
    })

    if (!prestadorExistente) {
      return NextResponse.json(
        { success: false, error: 'Prestador não encontrado' },
        { status: 404 }
      )
    }

    // Verificar email duplicado (se mudou)
    if (body.email && body.email !== prestadorExistente.email) {
      const emailExists = await prisma.prestador.findUnique({
        where: { email: body.email }
      })
      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'Email já cadastrado' },
          { status: 400 }
        )
      }
    }

    // Verificar CPF duplicado (se mudou)
    if (body.cpf && body.cpf !== prestadorExistente.cpf) {
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

    // Verificar CNPJ duplicado (se mudou)
    if (body.cnpj && body.cnpj !== prestadorExistente.cnpj) {
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

    // Atualizar prestador
    const prestadorAtualizado = await prisma.prestador.update({
      where: { id: params.id },
      data: {
        nome: body.nome,
        razaoSocial: body.razaoSocial,
        tipoPessoa: body.tipoPessoa,
        cpf: body.cpf,
        cnpj: body.cnpj,
        email: body.email,
        telefone: body.telefone,
        celular: body.celular,
        cep: body.endereco?.cep,
        logradouro: body.endereco?.logradouro,
        numero: body.endereco?.numero,
        complemento: body.endereco?.complemento,
        bairro: body.endereco?.bairro,
        cidade: body.endereco?.cidade,
        estado: body.endereco?.estado,
        servicos: body.servicos,
        raioAtuacao: body.raioAtuacao,
        pixChave: body.dadosBancarios?.pixChave,
        banco: body.dadosBancarios?.banco,
        agencia: body.dadosBancarios?.agencia,
        conta: body.dadosBancarios?.conta,
        tipoConta: body.dadosBancarios?.tipoConta,
        status: body.status,
        disponivel: body.disponivel,
        observacoes: body.observacoes,
      }
    })

    // Formatar resposta
    const prestadorFormatado = {
      id: prestadorAtualizado.id,
      nome: prestadorAtualizado.nome,
      razaoSocial: prestadorAtualizado.razaoSocial,
      tipoPessoa: prestadorAtualizado.tipoPessoa,
      cpf: prestadorAtualizado.cpf,
      cnpj: prestadorAtualizado.cnpj,
      email: prestadorAtualizado.email,
      telefone: prestadorAtualizado.telefone,
      celular: prestadorAtualizado.celular,
      endereco: {
        cep: prestadorAtualizado.cep,
        logradouro: prestadorAtualizado.logradouro,
        numero: prestadorAtualizado.numero,
        complemento: prestadorAtualizado.complemento,
        bairro: prestadorAtualizado.bairro,
        cidade: prestadorAtualizado.cidade,
        estado: prestadorAtualizado.estado,
      },
      servicos: Array.isArray(prestadorAtualizado.servicos) ? prestadorAtualizado.servicos : JSON.parse(prestadorAtualizado.servicos as string),
      raioAtuacao: prestadorAtualizado.raioAtuacao,
      dadosBancarios: prestadorAtualizado.pixChave ? {
        pixChave: prestadorAtualizado.pixChave,
        banco: prestadorAtualizado.banco,
        agencia: prestadorAtualizado.agencia,
        conta: prestadorAtualizado.conta,
        tipoConta: prestadorAtualizado.tipoConta,
      } : undefined,
      status: prestadorAtualizado.status,
      disponivel: prestadorAtualizado.disponivel,
      avaliacaoMedia: prestadorAtualizado.avaliacaoMedia,
      totalAtendimentos: prestadorAtualizado.totalAtendimentos,
      dataCadastro: prestadorAtualizado.createdAt.toISOString(),
      dataAtualizacao: prestadorAtualizado.updatedAt.toISOString(),
      observacoes: prestadorAtualizado.observacoes,
      documentos: [],
    }

    return NextResponse.json({
      success: true,
      data: prestadorFormatado,
      message: 'Prestador atualizado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao atualizar prestador:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar prestador' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir prestador
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se prestador existe
    const prestador = await prisma.prestador.findUnique({
      where: { id: params.id }
    })

    if (!prestador) {
      return NextResponse.json(
        { success: false, error: 'Prestador não encontrado' },
        { status: 404 }
      )
    }

    // Excluir prestador
    await prisma.prestador.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Prestador excluído com sucesso'
    })
  } catch (error) {
    console.error('Erro ao excluir prestador:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir prestador' },
      { status: 500 }
    )
  }
}
