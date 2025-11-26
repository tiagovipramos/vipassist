import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthenticatedLayoutClient } from './layout.client'

export default async function AutenticadoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ✅ Server Component - Verificação de auth no servidor
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')
  
  // Se não há token, redireciona imediatamente (mais rápido que client-side)
  if (!accessToken) {
    redirect('/entrar')
  }

  // ✅ Renderiza o Client Component com a lógica interativa
  return <AuthenticatedLayoutClient>{children}</AuthenticatedLayoutClient>
}
