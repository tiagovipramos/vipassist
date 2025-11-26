/**
 * API Routes para Ticket específico
 * Delega a lógica para o controller
 */

import { NextRequest } from 'next/server'
import { getTicketById, updateTicket } from '@/lib/controllers/tickets.controller'

// GET /api/tickets/[id] - Buscar ticket por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return getTicketById(params.id)
}

// PATCH /api/tickets/[id] - Atualizar ticket
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return updateTicket(params.id, request)
}
