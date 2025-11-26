'use client'

import { Plus, Download, Search } from 'lucide-react'
import { Button } from '@/componentes/ui/button'
import { Header } from '@/componentes/layout/Header'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogBody,
} from '@/componentes/ui/dialog'

export function PrestadoresHeader() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  const handleCreate = () => {
    // Será implementado
    console.log('Criar prestador')
  }

  const handleExport = () => {
    console.log('Exportar')
  }

  const handleSearch = () => {
    setIsSearchModalOpen(true)
  }

  const actionButtons = (
    <div className="flex gap-3">
      <Button variant="outline" className="gap-2" onClick={handleExport}>
        <Download className="h-4 w-4" />
        Exportar
      </Button>
      <Button variant="outline" className="gap-2" onClick={handleSearch}>
        <Search className="h-4 w-4" />
        Buscar
      </Button>
      <Button onClick={handleCreate} className="gap-2">
        <Plus className="h-4 w-4" />
        Novo Prestador
      </Button>
    </div>
  )

  return (
    <>
      <Header actionButton={actionButtons} />
      
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buscar Prestadores</DialogTitle>
            <DialogClose onClick={() => setIsSearchModalOpen(false)} />
          </DialogHeader>
          <DialogBody>
            <div className="text-center py-8">
              <p className="text-lg text-gray-700">
                Google Maps Places API (Search + Nearby + Text Search)
              </p>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  )
}
