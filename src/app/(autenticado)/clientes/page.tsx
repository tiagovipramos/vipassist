import { Metadata } from 'next'
import { ClientesClient } from './clientes.client'

export const metadata: Metadata = {
  title: 'Clientes | VIP Assist',
  description: 'Gerenciamento de clientes',
}

export default function ClientesPage() {
  return <ClientesClient />
}
