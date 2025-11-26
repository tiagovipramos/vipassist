/**
 * API Routes para Clientes
 * Delega a lógica para o controller com validação automática
 */

import { NextRequest } from 'next/server'
import { listClientes, createCliente } from '@/lib/controllers/clientes.controller'

// GET /api/clientes - Listar clientes com filtros e paginação
export async function GET(request: NextRequest) {
  return listClientes(request)
}

// POST /api/clientes - Criar novo cliente
export async function POST(request: NextRequest) {
  return createCliente(request)
}
