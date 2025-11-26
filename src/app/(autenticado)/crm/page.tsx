import { Metadata } from 'next'
import CRMPageClient from './crm.client'

export const metadata: Metadata = {
  title: 'CRM Pipeline | Kortex',
  description: 'Gerencie relacionamento com clientes',
}

export default function CRMPage() {
  return <CRMPageClient />
}
