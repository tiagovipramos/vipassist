'use client'

import { useState } from 'react'
import { BarChart3, Send, Plus } from 'lucide-react'
import { AbaVisaoGeral } from './components/AbaVisaoGeral'
import { AbaMinhasCampanhas } from './components/AbaMinhasCampanhas'
import { AbaCriarCampanha } from './components/AbaCriarCampanha'

type AbaAtiva = 'visao-geral' | 'minhas-campanhas' | 'criar-campanha'

export function CampanhasClient() {
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('visao-geral')

  return (
    <div className="-mx-8 -mt-8 min-h-screen bg-gray-50 px-8 pt-8 pb-6">
      {/* ABAS */}
      <div className="mb-4">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setAbaAtiva('visao-geral')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              abaAtiva === 'visao-geral'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Visão Geral
          </button>
          <button
            onClick={() => setAbaAtiva('minhas-campanhas')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              abaAtiva === 'minhas-campanhas'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Send className="h-4 w-4" />
            Minhas Campanhas
          </button>
          <button
            onClick={() => setAbaAtiva('criar-campanha')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              abaAtiva === 'criar-campanha'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plus className="h-4 w-4" />
            Criar Campanha
          </button>
        </div>
      </div>

      {/* CONTEÚDO DAS ABAS */}
      {abaAtiva === 'visao-geral' && <AbaVisaoGeral />}
      {abaAtiva === 'minhas-campanhas' && <AbaMinhasCampanhas />}
      {abaAtiva === 'criar-campanha' && <AbaCriarCampanha />}
    </div>
  )
}
