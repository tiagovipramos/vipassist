'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/componentes/ui/dialog'
import { Button } from '@/componentes/ui/button'
import { Input } from '@/componentes/ui/input'
import { Badge } from '@/componentes/ui/badge'
import { Map, Navigation, Save, Eye, EyeOff, ExternalLink, CheckCircle2, XCircle, Copy, Check, HelpCircle, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

interface ModalConfiguracoesAPIProps {
  isOpen: boolean
  onClose: () => void
}

export function ModalConfiguracoesAPI({ isOpen, onClose }: ModalConfiguracoesAPIProps) {
  const [googleMapsKey, setGoogleMapsKey] = useState(
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  )
  const [mapboxToken, setMapboxToken] = useState(
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
  )
  const [searchRadius, setSearchRadius] = useState(50) // Raio em km
  const [showGoogleKey, setShowGoogleKey] = useState(false)
  const [showMapboxToken, setShowMapboxToken] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [copiedGoogle, setCopiedGoogle] = useState(false)
  const [copiedMapbox, setCopiedMapbox] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      const response = await fetch('/api/configuracoes/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleMapsKey,
          mapboxToken,
          searchRadius: searchRadius * 1000, // Converter km para metros
        }),
      })

      // Verificar se a resposta é JSON válido
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Resposta inválida do servidor. Verifique se a API está configurada corretamente.')
      }

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Configurações salvas com sucesso!')
        setIsSaving(false)
        onClose()
        
        // Mostrar aviso que precisa reiniciar o servidor para aplicar
        setTimeout(() => {
          toast('⚠️ Reinicie o servidor para aplicar as novas chaves', {
            duration: 5000,
          })
        }, 1000)
      } else {
        const errorMessage = data.error || data.details || 'Erro ao salvar configurações'
        toast.error(errorMessage)
        setIsSaving(false)
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro ao conectar com o servidor'
      toast.error(errorMessage)
      setIsSaving(false)
    }
  }

  const handleCopy = async (text: string, type: 'google' | 'mapbox') => {
    await navigator.clipboard.writeText(text)
    if (type === 'google') {
      setCopiedGoogle(true)
      setTimeout(() => setCopiedGoogle(false), 2000)
    } else {
      setCopiedMapbox(true)
      setTimeout(() => setCopiedMapbox(false), 2000)
    }
    toast.success('Chave copiada!')
  }

  const isGoogleConfigured = googleMapsKey.length > 0
  const isMapboxConfigured = mapboxToken.length > 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Configurações de API</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Google Maps API */}
          <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Map className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Google Maps Places API</h3>
                  <p className="text-xs text-gray-500">Busca de lugares e geocodificação</p>
                </div>
              </div>
              <Badge
                variant={isGoogleConfigured ? 'default' : 'secondary'}
                className="flex items-center gap-1.5"
              >
                {isGoogleConfigured ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    Ativa
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    Inativa
                  </>
                )}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">API Key</label>
                <div className="flex items-center gap-2">
                  <div className="relative group">
                    <button
                      type="button"
                      className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1 cursor-help"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      Como obter
                    </button>
                    <div className="absolute right-0 top-6 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                      <div className="space-y-2">
                        <p className="font-semibold">Passos para obter a chave:</p>
                        <ol className="list-decimal list-inside space-y-1 text-gray-200">
                          <li>Acesse o Google Cloud Console</li>
                          <li>Crie ou selecione um projeto</li>
                          <li>Ative a Places API</li>
                          <li>Vá em "Credenciais"</li>
                          <li>Clique em "Criar credenciais" → "Chave de API"</li>
                          <li>Copie a chave gerada</li>
                        </ol>
                      </div>
                      <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                    </div>
                  </div>
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Obter chave
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showGoogleKey ? 'text' : 'password'}
                    value={googleMapsKey}
                    onChange={(e) => setGoogleMapsKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="pr-20 font-mono text-sm"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(googleMapsKey, 'google')}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                      title="Copiar"
                    >
                      {copiedGoogle ? (
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGoogleKey(!showGoogleKey)}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                      title={showGoogleKey ? 'Ocultar' : 'Mostrar'}
                    >
                      {showGoogleKey ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mapbox API */}
          <div className="rounded-lg border bg-gradient-to-br from-green-50 to-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Navigation className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mapbox</h3>
                  <p className="text-xs text-gray-500">Mapas interativos e rotas</p>
                </div>
              </div>
              <Badge
                variant={isMapboxConfigured ? 'default' : 'secondary'}
                className="flex items-center gap-1.5"
              >
                {isMapboxConfigured ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    Ativa
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    Inativa
                  </>
                )}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Access Token</label>
                <div className="flex items-center gap-2">
                  <div className="relative group">
                    <button
                      type="button"
                      className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1 cursor-help"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      Como obter
                    </button>
                    <div className="absolute right-0 top-6 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                      <div className="space-y-2">
                        <p className="font-semibold">Passos para obter o token:</p>
                        <ol className="list-decimal list-inside space-y-1 text-gray-200">
                          <li>Acesse sua conta Mapbox</li>
                          <li>Vá em "Access tokens"</li>
                          <li>Clique em "Create a token"</li>
                          <li>Dê um nome ao token</li>
                          <li>Selecione os escopos necessários</li>
                          <li>Clique em "Create token"</li>
                          <li>Copie o token gerado</li>
                        </ol>
                      </div>
                      <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                    </div>
                  </div>
                  <a
                    href="https://account.mapbox.com/access-tokens/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    Obter token
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showMapboxToken ? 'text' : 'password'}
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                    placeholder="pk.eyJ1..."
                    className="pr-20 font-mono text-sm"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(mapboxToken, 'mapbox')}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                      title="Copiar"
                    >
                      {copiedMapbox ? (
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMapboxToken(!showMapboxToken)}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                      title={showMapboxToken ? 'Ocultar' : 'Mostrar'}
                    >
                      {showMapboxToken ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuração de Raio de Busca */}
          <div className="rounded-lg border bg-gradient-to-br from-purple-50 to-white p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Raio de Busca</h3>
                <p className="text-xs text-gray-500">Distância máxima para buscar prestadores</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Raio: <span className="text-purple-600 font-bold">{searchRadius} km</span>
                </label>
                <div className="text-xs text-gray-500">
                  {searchRadius < 30 && '🏙️ Área urbana'}
                  {searchRadius >= 30 && searchRadius < 80 && '🌆 Região metropolitana'}
                  {searchRadius >= 80 && '🌄 Área ampla'}
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />

              {/* Valores de referência */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>10 km</span>
                <span>50 km</span>
                <span>100 km</span>
                <span>150 km</span>
              </div>

              {/* Input numérico */}
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="10"
                  max="150"
                  step="5"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className="w-24 text-center"
                />
                <span className="text-sm text-gray-600">km</span>
                <div className="flex-1 text-xs text-gray-500">
                  {searchRadius <= 20 && 'Ideal para cidades pequenas'}
                  {searchRadius > 20 && searchRadius <= 50 && 'Recomendado para cidades médias'}
                  {searchRadius > 50 && searchRadius <= 100 && 'Bom para regiões metropolitanas'}
                  {searchRadius > 100 && 'Máximo alcance - áreas rurais'}
                </div>
              </div>
            </div>
          </div>

          {/* Aviso de segurança compacto */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              💡 <strong>Dica:</strong> Mantenha suas chaves em segurança e configure restrições de domínio nas plataformas.
            </p>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="min-w-[100px]">
            {isSaving ? (
              'Salvando...'
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
