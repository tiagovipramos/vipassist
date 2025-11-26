import { Metadata } from 'next'
import SegurancaClient from './seguranca.client'

export const metadata: Metadata = {
  title: '🔒 Segurança & Privacidade | VIP Assist',
  description: 'Gerencie autenticação de dois fatores e dispositivos conectados',
}

export default function SegurancaPage() {
  return <SegurancaClient />
}
