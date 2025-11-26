'use client'

import { Plus, Download, Upload } from 'lucide-react'
import { Button } from '@/componentes/ui/button'
import { Header } from '@/componentes/layout/Header'

export function ClientesHeader() {
  const handleCreate = () => {
    // Será implementado
    console.log('Criar cliente')
  }

  const handleExport = () => {
    console.log('Exportar')
  }

  const handleImport = () => {
    console.log('Importar')
  }

  const actionButtons = (
    <div className="flex gap-3">
      <Button variant="outline" className="gap-2" onClick={handleExport}>
        <Download className="h-4 w-4" />
        Exportar
      </Button>
      <Button variant="outline" className="gap-2" onClick={handleImport}>
        <Upload className="h-4 w-4" />
        Importar
      </Button>
      <Button onClick={handleCreate} className="gap-2">
        <Plus className="h-4 w-4" />
        Novo Cliente
      </Button>
    </div>
  )

  return <Header actionButton={actionButtons} />
}
