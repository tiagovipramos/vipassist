/**
 * API Routes para Cliente específico
 * Delega a lógica para o controller com validação automática
 */

import { NextRequest } from 'next/server'
import { getClienteById, updateCliente, deleteCliente } from '@/lib/controllers/clientes.controller'

// GET /api/clientes/[id] - Buscar cliente por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return getClienteById(params.id)
}

// PUT /api/clientes/[id] - Atualizar cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return updateCliente(params.id, request)
}

// DELETE /api/clientes/[id] - Deletar cliente (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return deleteCliente(params.id)
}
