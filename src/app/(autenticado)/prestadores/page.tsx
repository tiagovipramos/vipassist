import { Metadata } from 'next'
import { PrestadoresClient } from './prestadores.client'

export const metadata: Metadata = {
  title: 'Prestadores | VIP Assist',
  description: 'Gerenciamento de prestadores de serviço',
}

export default function PrestadoresPage() {
  return <PrestadoresClient />
}
