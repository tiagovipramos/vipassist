import { Metadata } from 'next'
import { MapaClient } from './mapa.client'

export const metadata: Metadata = {
  title: 'Mapa Ao Vivo | VIP Assist',
  description: 'Visualização em tempo real dos atendimentos em andamento',
}

export default function MapaPage() {
  return <MapaClient />
}
