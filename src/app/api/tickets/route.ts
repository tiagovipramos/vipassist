/**
 * API Routes para Tickets
 * Delega a lógica para o controller
 */

import { NextRequest } from 'next/server'
import { listTickets, createTicket } from '@/lib/controllers/tickets.controller'

// GET /api/tickets - Listar tickets com filtros e paginação
export async function GET(request: NextRequest) {
  return listTickets(request)
}

// POST /api/tickets - Criar novo ticket
export async function POST(request: NextRequest) {
  return createTicket(request)
}
