import { Metadata } from 'next'
import { CampanhasClient } from './campanhas.client'

export const metadata: Metadata = {
  title: 'Campanhas | Kortex',
  description: 'Gerencie suas campanhas de marketing em massa via WhatsApp, Email e SMS',
  keywords: ['campanhas', 'marketing', 'whatsapp', 'email', 'sms', 'massa'],
}

export default function CampanhasPage() {
  return <CampanhasClient />
}
