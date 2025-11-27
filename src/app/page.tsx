import { redirect } from 'next/navigation'

export default function Home() {
  // Redirecionamento server-side (mais confiável em produção)
  redirect('/entrar')
}
