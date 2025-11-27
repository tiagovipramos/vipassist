import { AuthenticatedLayoutClient } from './layout.client'

export default async function AutenticadoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Sem verificação de autenticação - acesso direto
  return <AuthenticatedLayoutClient>{children}</AuthenticatedLayoutClient>
}
