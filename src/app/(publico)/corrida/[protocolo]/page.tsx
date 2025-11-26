import { CorridaClient } from './corrida.client'

export default function CorridaPage({ params }: { params: { protocolo: string } }) {
  return <CorridaClient protocolo={params.protocolo} />
}
