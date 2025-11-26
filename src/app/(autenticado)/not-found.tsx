import Link from 'next/link'
import { Button } from '@/componentes/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Página não encontrada
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button asChild className="mt-6">
          <Link href="/painel">
            Voltar ao painel
          </Link>
        </Button>
      </div>
    </div>
  )
}
