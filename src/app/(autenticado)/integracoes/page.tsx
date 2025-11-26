import type { Metadata } from 'next'
import { IntegracoesClient } from './integracoes.client'

export const metadata: Metadata = {
  title: 'Integrações - Kortex',
  description: 'Marketplace de integrações - Conecte WhatsApp, IA, Pagamentos e muito mais',
}

export default function IntegracoesPage() {
  return <IntegracoesClient />
}
