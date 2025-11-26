'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/componentes/ui/dialog'
import { Badge } from '@/componentes/ui/badge'
import { Button } from '@/componentes/ui/button'
import { 
  User, 
  Phone, 
  Car, 
  MapPin, 
  Clock, 
  FileText,
  AlertCircle,
  CheckCircle,
  Calendar,
  X,
  Navigation,
  Route,
  Upload,
  Loader2,
  DollarSign
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Chamado {
  id: string
  protocolo: string
  clienteNome: string
  clienteTelefone: string
  veiculoPlaca: string
  veiculoMarca?: string
  veiculoModelo?: string
  veiculoCor?: string
  tipoServico: string
  prioridade: 'critica' | 'alta' | 'media'
  status: 'aguardando' | 'em_execucao' | 'finalizado' | 'arquivado'
  origemCep?: string
  origemEndereco: string
  origemNumero?: string
  origemBairro?: string
  origemCidade: string
  origemEstado?: string
  origemReferencia?: string
  destinoCep?: string
  destinoEndereco?: string
  destinoNumero?: string
  destinoBairro?: string
  destinoCidade?: string
  destinoEstado?: string
  destinoReferencia?: string
  distanciaKm?: number
  tempoPrevisto?: string
  condicaoTransito?: string
  prestadorNome?: string
  prestadorTelefone?: string
  prestadorCpfCnpj?: string
  prestadorPix?: string
  valorCotado?: number
  valorFinal?: number
  dataCriacao: string
  dataInicio?: string
  dataFinalizacao?: string
  descricaoProblema: string
  observacoes?: string
  fotoConclusao?: string
  conclusaoCep?: string
  conclusaoEndereco?: string
  conclusaoCidade?: string
  conclusaoLatitude?: number
  conclusaoLongitude?: number
  comprovantePagamento?: string
}

interface ModalDetalhesChamadoProps {
  isOpen: boolean
  onClose: () => void
  chamado: Chamado
}

export function ModalDetalhesChamado({ isOpen, onClose, chamado }: ModalDetalhesChamadoProps) {
  const [comprovante, setComprovante] = useState<string | null>(chamado.comprovantePagamento || null)
  const [enviandoComprovante, setEnviandoComprovante] = useState(false)

  const handleUploadComprovante = async () => {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'

      input.onchange = async (e: any) => {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onloadend = async () => {
            const base64 = reader.result as string
            setEnviandoComprovante(true)

            try {
              // Atualiza o ticket no banco de dados
              const response = await fetch(`/api/tickets/${chamado.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  comprovantePagamento: base64,
                }),
              })

              const data = await response.json()

              if (response.ok) {
                setComprovante(base64)
                alert('Comprovante enviado com sucesso!')
              } else {
                console.error('Erro na resposta:', data)
                alert(`Erro ao enviar comprovante: ${data.error || 'Erro desconhecido'}`)
              }
            } catch (error) {
              console.error('Erro ao enviar comprovante:', error)
              alert(`Erro ao enviar comprovante: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
            } finally {
              setEnviandoComprovante(false)
            }
          }
          reader.readAsDataURL(file)
        }
      }

      input.click()
    } catch (error) {
      console.error('Erro ao selecionar arquivo:', error)
    }
  }

  const tiposServico: Record<string, { label: string; icon: string }> = {
    reboque: { label: 'Reboque', icon: '🚛' },
    pneu: { label: 'Troca de Pneu', icon: '🔧' },
    bateria: { label: 'Pane Elétrica', icon: '🔋' },
    combustivel: { label: 'Combustível', icon: '⛽' },
    chaveiro: { label: 'Chaveiro', icon: '🔑' },
    mecanica: { label: 'Pane Mecânica', icon: '⚙️' },
    acidente: { label: 'Acidente/Colisão', icon: '🚙' },
    taxi: { label: 'Táxi/Transporte', icon: '🚕' },
    fluidos: { label: 'Problemas Fluidos', icon: '💧' },
    residencial: { label: 'Assist. Residencial', icon: '🏠' },
    viagem: { label: 'Assist. em Viagem', icon: '🛣️' },
    reparos: { label: 'Pequenos Reparos', icon: '🔩' },
  }

  const prioridadeConfig = {
    critica: { label: 'Crítica', color: 'bg-red-500 text-white', icon: '🔴' },
    alta: { label: 'Alta', color: 'bg-orange-500 text-white', icon: '🟠' },
    media: { label: 'Média', color: 'bg-yellow-500 text-white', icon: '🟡' },
  }

  const statusConfig = {
    aguardando: { label: 'Aguardando', color: 'bg-orange-500 text-white' },
    em_execucao: { label: 'Em Execução', color: 'bg-blue-500 text-white' },
    finalizado: { label: 'Finalizado', color: 'bg-green-500 text-white' },
    arquivado: { label: 'Arquivado', color: 'bg-gray-500 text-white' },
  }

  const tipoInfo = tiposServico[chamado.tipoServico] || { label: chamado.tipoServico, icon: '📋' }
  const prioridadeInfo = prioridadeConfig[chamado.prioridade]
  const statusInfo = statusConfig[chamado.status]

  // Extrair número e bairro do endereço se não estiverem separados
  const extrairDetalhesEndereco = (endereco: string) => {
    const partes = endereco.split(',')
    return {
      logradouro: partes[0]?.trim() || endereco,
      numero: partes[1]?.trim() || ''
    }
  }

  const origemDetalhes = extrairDetalhesEndereco(chamado.origemEndereco)
  const destinoDetalhes = chamado.destinoEndereco ? extrairDetalhesEndereco(chamado.destinoEndereco) : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{tipoInfo.icon}</div>
              <div>
                <h2 className="text-2xl font-bold">{tipoInfo.label}</h2>
                <p className="text-blue-100 text-sm mt-1">Protocolo: {chamado.protocolo}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Badges de Status e Prioridade */}
          <div className="flex gap-2 mt-4">
            <Badge className={cn('px-3 py-1 text-sm font-semibold', statusInfo.color)}>
              {statusInfo.label}
            </Badge>
            <Badge className={cn('px-3 py-1 text-sm font-semibold', prioridadeInfo.color)}>
              {prioridadeInfo.icon} {prioridadeInfo.label}
            </Badge>
            {chamado.prestadorNome === 'NEGADO' && (
              <Badge className="px-3 py-1 text-sm font-semibold bg-red-600 text-white border-2 border-red-700">
                ❌ SERVIÇO NEGADO
              </Badge>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Grid de 2 colunas para informações principais */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Cliente */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Cliente</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Nome Completo</p>
                  <p className="text-gray-900 font-semibold">{chamado.clienteNome}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Telefone</p>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    {chamado.clienteTelefone}
                  </p>
                </div>
              </div>
            </div>

            {/* Veículo */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <Car className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Veículo</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Placa</p>
                  <p className="text-gray-900 font-bold text-xl">{chamado.veiculoPlaca}</p>
                </div>
                {chamado.veiculoMarca && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Marca</p>
                      <p className="text-gray-900 font-semibold">{chamado.veiculoMarca}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Modelo</p>
                      <p className="text-gray-900 font-semibold">{chamado.veiculoModelo}</p>
                    </div>
                  </div>
                )}
                {chamado.veiculoCor && (
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Cor</p>
                    <p className="text-gray-900">{chamado.veiculoCor}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Localização Detalhada */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Localização Completa</h3>
            </div>
            
            {/* Grid de 2 colunas: Origem e Destino lado a lado */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Origem */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    A
                  </div>
                  <h4 className="font-bold text-gray-900">ORIGEM</h4>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Logradouro</p>
                    <p className="text-gray-900 font-semibold">{origemDetalhes.logradouro}</p>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-2 items-baseline">
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Número</p>
                      <p className="text-gray-900 font-semibold">{chamado.origemNumero || origemDetalhes.numero || 'S/N'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Cidade</p>
                      <p className="text-gray-900 font-semibold">{chamado.origemCidade}</p>
                    </div>
                  </div>
                  {chamado.origemCep && (
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">CEP</p>
                      <p className="text-gray-900">{chamado.origemCep}</p>
                    </div>
                  )}
                  {chamado.origemBairro && (
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Bairro</p>
                      <p className="text-gray-900">{chamado.origemBairro}</p>
                    </div>
                  )}
                  {chamado.origemReferencia && (
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Referência</p>
                      <p className="text-gray-900">{chamado.origemReferencia}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Destino */}
              {chamado.destinoEndereco && destinoDetalhes ? (
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      B
                    </div>
                    <h4 className="font-bold text-gray-900">DESTINO</h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Logradouro</p>
                      <p className="text-gray-900 font-semibold">{destinoDetalhes.logradouro}</p>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] gap-2 items-baseline">
                      <div>
                        <p className="text-xs text-gray-600 uppercase font-semibold">Número</p>
                        <p className="text-gray-900 font-semibold">{chamado.destinoNumero || destinoDetalhes.numero || 'S/N'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase font-semibold">Cidade</p>
                        <p className="text-gray-900 font-semibold">{chamado.destinoCidade}</p>
                      </div>
                    </div>
                    {chamado.destinoCep && (
                      <div>
                        <p className="text-xs text-gray-600 uppercase font-semibold">CEP</p>
                        <p className="text-gray-900">{chamado.destinoCep}</p>
                      </div>
                    )}
                    {chamado.destinoBairro && (
                      <div>
                        <p className="text-xs text-gray-600 uppercase font-semibold">Bairro</p>
                        <p className="text-gray-900">{chamado.destinoBairro}</p>
                      </div>
                    )}
                    {chamado.destinoReferencia && (
                      <div>
                        <p className="text-xs text-gray-600 uppercase font-semibold">Referência</p>
                        <p className="text-gray-900">{chamado.destinoReferencia}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Sem destino definido</p>
                </div>
              )}
            </div>

            {/* Distância, Tempo e Valores */}
            <div className="grid md:grid-cols-4 gap-3 mt-4">
              {chamado.distanciaKm && (
                <div className="bg-blue-100 rounded-lg p-3">
                  <p className="text-xs text-blue-900 uppercase font-semibold mb-1">Distância Total</p>
                  <p className="text-blue-900 font-bold text-xl">📏 {chamado.distanciaKm} km</p>
                </div>
              )}
              {chamado.tempoPrevisto && (
                <div className="bg-purple-100 rounded-lg p-3">
                  <p className="text-xs text-purple-900 uppercase font-semibold mb-1">Tempo Previsto</p>
                  <p className="text-purple-900 font-bold text-xl">⏱️ {chamado.tempoPrevisto}</p>
                </div>
              )}
              <div className="bg-orange-100 rounded-lg p-3">
                <p className="text-xs text-orange-900 uppercase font-semibold mb-1">Valor Cotado</p>
                <p className="text-orange-900 font-bold text-xl">
                  {chamado.valorCotado 
                    ? new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(chamado.valorCotado)
                    : 'Não Informado'
                  }
                </p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <p className="text-xs text-green-900 uppercase font-semibold mb-1">Valor Final</p>
                <p className={cn("font-bold text-xl", chamado.valorFinal ? "text-green-900" : "text-gray-600")}>
                  {chamado.valorFinal 
                    ? new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(chamado.valorFinal)
                    : 'Não Informado'
                  }
                </p>
              </div>
            </div>

            {/* Condição de Trânsito */}
            {chamado.condicaoTransito && (
              <div className={cn(
                "rounded-lg p-3 mt-3",
                chamado.condicaoTransito === 'leve' && 'bg-green-100',
                chamado.condicaoTransito === 'moderado' && 'bg-yellow-100',
                chamado.condicaoTransito === 'intenso' && 'bg-red-100'
              )}>
                <p className="text-xs uppercase font-semibold mb-1">Condição de Trânsito</p>
                <p className="font-bold">
                  {chamado.condicaoTransito === 'leve' && '🟢 Leve - Fluxo normal'}
                  {chamado.condicaoTransito === 'moderado' && '🟡 Moderado - Fluxo lento'}
                  {chamado.condicaoTransito === 'intenso' && '🔴 Intenso - Congestionamento'}
                </p>
              </div>
            )}
          </div>

          {/* Prestador */}
          {chamado.prestadorNome && (
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-indigo-500 p-2 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Prestador Designado</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Nome</p>
                  <p className="text-gray-900 font-semibold">{chamado.prestadorNome}</p>
                </div>
                {chamado.prestadorTelefone && (
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Telefone</p>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-indigo-600" />
                      {chamado.prestadorTelefone}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1">CPF/CNPJ</p>
                  <p className="text-gray-900 font-semibold">{chamado.prestadorCpfCnpj || 'Não Informado'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Chave PIX</p>
                  <p className="text-gray-900 font-semibold">{chamado.prestadorPix || 'Não Informado'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Descrição */}
          {chamado.descricaoProblema && (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-yellow-500 p-2 rounded-lg">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Descrição do Problema</h3>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{chamado.descricaoProblema}</p>
            </div>
          )}

          {/* Observações */}
          {chamado.observacoes && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-gray-500 p-2 rounded-lg">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Observações Adicionais</h3>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{chamado.observacoes}</p>
            </div>
          )}

          {/* Foto de Conclusão do Serviço */}
          {chamado.status === 'finalizado' && chamado.fotoConclusao && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Foto de Conclusão do Serviço</h3>
              </div>

              <div className="bg-white rounded-lg p-4">
                <a 
                  href={chamado.fotoConclusao} 
                  download="foto-conclusao.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img 
                    src={chamado.fotoConclusao} 
                    alt="Foto de conclusão do serviço" 
                    className="w-1/4 h-auto rounded-lg shadow-lg mx-auto"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%236b7280" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImagem não disponível%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </a>
                <p className="text-xs text-gray-500 mt-2 text-center italic">
                  💡 Clique na foto para visualizar em tamanho real ou fazer download
                </p>
              </div>
            </div>
          )}

          {/* Comprovante de Pagamento */}
          {chamado.status === 'finalizado' && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-500 p-2 rounded-lg">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Comprovante de Pagamento</h3>
                </div>
                <Button
                  onClick={handleUploadComprovante}
                  disabled={enviandoComprovante}
                  variant="outline"
                  size="sm"
                >
                  {enviandoComprovante ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      {comprovante ? 'Atualizar' : 'Upload'}
                    </>
                  )}
                </Button>
              </div>
              
              {comprovante && (
                <div className="bg-white rounded-lg p-4">
                  <img 
                    src={comprovante} 
                    alt="Comprovante de pagamento" 
                    className="w-full h-auto rounded-lg shadow-lg max-h-60 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%236b7280" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImagem não disponível%3C/text%3E%3C/svg%3E'
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    💳 Comprovante de pagamento ao prestador
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Histórico */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gray-500 p-2 rounded-lg">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Histórico do Chamado</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Criado em</p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(chamado.dataCriacao).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              {chamado.dataInicio && (
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Iniciado em</p>
                    <p className="text-gray-900 font-semibold">
                      {new Date(chamado.dataInicio).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}
              
              {chamado.dataFinalizacao && (
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 uppercase font-semibold">Finalizado em</p>
                    <p className="text-gray-900 font-semibold">
                      {new Date(chamado.dataFinalizacao).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {(chamado.conclusaoEndereco || chamado.conclusaoCidade) && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-600 uppercase font-semibold mb-1">📍 Local da Conclusão</p>
                        <p className="text-gray-900 font-medium">
                          {chamado.conclusaoEndereco && chamado.conclusaoEndereco}
                          {chamado.conclusaoEndereco && chamado.conclusaoCidade && ', '}
                          {chamado.conclusaoCidade && chamado.conclusaoCidade}
                        </p>
                        {chamado.conclusaoCep && (
                          <p className="text-gray-600 text-sm mt-1">CEP: {chamado.conclusaoCep}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
