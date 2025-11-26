'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirecionar para o login
    router.push('/entrar')
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-pulse text-lg text-muted-foreground">
        Carregando...
      </div>
    </div>
  )
}
