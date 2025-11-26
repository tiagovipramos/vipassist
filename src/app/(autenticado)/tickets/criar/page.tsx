import { Metadata } from 'next'
import { CriarTicketClient } from './criar-ticket.client'

export const metadata: Metadata = {
  title: 'Criar Chamado | VIP Assist',
  description: 'Criar novo chamado de suporte',
}

export default function CriarTicketPage() {
  return <CriarTicketClient />
}
