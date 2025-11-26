'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/componentes/ui/card'
import { Button } from '@/componentes/ui/button'
import { Badge } from '@/componentes/ui/badge'
import { Input } from '@/componentes/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/componentes/ui/dialog'
import { 
  Shield, 
  Smartphone, 
  Monitor, 
  Tablet,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  Key,
  QrCode as QrCodeIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { TOTP } from 'otpauth'
import QRCode from 'qrcode'

interface Dispositivo {
  id: string
  nome: string
  tipo: 'desktop' | 'mobile' | 'tablet'
  navegador: string
  localizacao: string
  ultimoAcesso: string
  atual: boolean
}

// Função para detectar o tipo de dispositivo
const detectDeviceType = (): 'desktop' | 'mobile' | 'tablet' => {
  if (typeof window === 'undefined') return 'desktop'
  
  const ua = navigator.userAgent
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet'
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile'
  }
  return 'desktop'
}

// Função para detectar o sistema operacional
const detectOS = (): string => {
  if (typeof window === 'undefined') return 'Unknown'
  
  const ua = navigator.userAgent
  if (ua.indexOf('Win') !== -1) return 'Windows'
  if (ua.indexOf('Mac') !== -1) return 'macOS'
  if (ua.indexOf('Linux') !== -1) return 'Linux'
  if (ua.indexOf('Android') !== -1) return 'Android'
  if (ua.indexOf('like Mac') !== -1) return 'iOS'
  return 'Unknown'
}

// Função para detectar o navegador
const detectBrowser = (): string => {
  if (typeof window === 'undefined') return 'Unknown'
  
  const ua = navigator.userAgent
  let browserName = 'Unknown'
  let version = ''

  if (ua.indexOf('Firefox') > -1) {
    browserName = 'Firefox'
    version = ua.match(/Firefox\/(\d+)/)?.[1] || ''
  } else if (ua.indexOf('SamsungBrowser') > -1) {
    browserName = 'Samsung Internet'
    version = ua.match(/SamsungBrowser\/(\d+)/)?.[1] || ''
  } else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
    browserName = 'Opera'
    version = ua.match(/(?:Opera|OPR)\/(\d+)/)?.[1] || ''
  } else if (ua.indexOf('Trident') > -1) {
    browserName = 'Internet Explorer'
    version = ua.match(/rv:(\d+)/)?.[1] || ''
  } else if (ua.indexOf('Edge') > -1) {
    browserName = 'Edge (Legacy)'
    version = ua.match(/Edge\/(\d+)/)?.[1] || ''
  } else if (ua.indexOf('Edg') > -1) {
    browserName = 'Edge'
    version = ua.match(/Edg\/(\d+)/)?.[1] || ''
  } else if (ua.indexOf('Chrome') > -1) {
    browserName = 'Chrome'
    version = ua.match(/Chrome\/(\d+)/)?.[1] || ''
  } else if (ua.indexOf('Safari') > -1) {
    browserName = 'Safari'
    version = ua.match(/Version\/(\d+)/)?.[1] || ''
  }

  return version ? `${browserName} ${version}` : browserName
}

// Função para gerar nome do dispositivo
const generateDeviceName = (os: string, tipo: string): string => {
  if (tipo === 'mobile') {
    if (os === 'iOS') return 'iPhone'
    if (os === 'Android') return 'Android Phone'
    return 'Mobile Device'
  }
  if (tipo === 'tablet') {
    if (os === 'iOS') return 'iPad'
    if (os === 'Android') return 'Android Tablet'
    return 'Tablet'
  }
  return `${os} PC`
}

export default function SegurancaClient() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([])
  const [loading, setLoading] = useState(true)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [totpSecret, setTotpSecret] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [totp, setTotp] = useState<TOTP | null>(null)

  useEffect(() => {
    // Detectar dispositivo atual
    const tipo = detectDeviceType()
    const os = detectOS()
    const navegador = detectBrowser()
    const nome = generateDeviceName(os, tipo)

    const dispositivoAtual: Dispositivo = {
      id: '1',
      nome,
      tipo,
      navegador,
      localizacao: 'Localização atual',
      ultimoAcesso: 'Agora',
      atual: true
    }

    setDispositivos([dispositivoAtual])
    setLoading(false)
  }, [])

  const handleToggle2FA = async () => {
    if (!twoFactorEnabled) {
      // Gerar novo TOTP secret
      const newTotp = new TOTP({
        issuer: 'VIP Assist',
        label: 'usuario@example.com',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
      })
      
      setTotp(newTotp)
      setTotpSecret(newTotp.secret.base32)
      
      // Gerar QR Code
      const otpauthUrl = newTotp.toString()
      try {
        const qrUrl = await QRCode.toDataURL(otpauthUrl)
        setQrCodeUrl(qrUrl)
        setShowQRCode(true)
      } catch (error) {
        console.error('Erro ao gerar QR code:', error)
        toast.error('Erro ao gerar QR code')
      }
    } else {
      setTwoFactorEnabled(false)
      setShowQRCode(false)
      setVerificationCode('')
      toast.success('Autenticação de dois fatores desativada')
    }
  }

  const handleConfirm2FA = () => {
    if (!totp || !verificationCode) {
      toast.error('Digite o código de verificação')
      return
    }

    // Validar o código TOTP
    const isValid = totp.validate({ token: verificationCode, window: 1 }) !== null
    
    if (isValid) {
      setTwoFactorEnabled(true)
      setShowQRCode(false)
      setVerificationCode('')
      toast.success('Autenticação de dois fatores ativada com sucesso!')
    } else {
      toast.error('Código inválido. Tente novamente.')
    }
  }

  const handleRemoveDevice = (id: string) => {
    setDispositivos(prev => prev.filter(d => d.id !== id))
    toast.success('Dispositivo removido com sucesso')
  }

  const getDeviceIcon = (tipo: string) => {
    switch (tipo) {
      case 'mobile':
        return Smartphone
      case 'tablet':
        return Tablet
      default:
        return Monitor
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Autenticação de Dois Fatores */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Autenticação de Dois Fatores (2FA)
              </h2>
              <p className="text-sm text-gray-600">
                Adicione uma camada extra de segurança à sua conta
              </p>
            </div>
          </div>
          <Badge
            variant={twoFactorEnabled ? 'default' : 'secondary'}
            className="flex items-center gap-1.5"
          >
            {twoFactorEnabled ? (
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

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Key className="h-4 w-4" />
              Como funciona?
            </h3>
            <ul className="text-sm text-gray-600 space-y-1 ml-6 list-disc">
              <li>Use um aplicativo autenticador (Google Authenticator, Authy, etc.)</li>
              <li>Escaneie o código QR que será exibido</li>
              <li>Digite o código de 6 dígitos para confirmar</li>
              <li>A partir de agora, você precisará do código ao fazer login</li>
            </ul>
          </div>

          <Button
            onClick={handleToggle2FA}
            variant={twoFactorEnabled ? 'outline' : 'default'}
            size="sm"
          >
            {twoFactorEnabled ? 'Desativar 2FA' : 'Ativar 2FA'}
          </Button>
        </div>
      </Card>

      {/* Dispositivos Conectados */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-green-100 rounded-lg">
            <Monitor className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Dispositivos com Acesso
            </h2>
            <p className="text-sm text-gray-600">
              Gerencie os dispositivos que têm acesso à sua conta
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {dispositivos.map((dispositivo) => {
            const DeviceIcon = getDeviceIcon(dispositivo.tipo)
            
            return (
              <div
                key={dispositivo.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-colors",
                  dispositivo.atual
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    dispositivo.atual ? "bg-blue-100" : "bg-gray-100"
                  )}>
                    <DeviceIcon className={cn(
                      "h-5 w-5",
                      dispositivo.atual ? "text-blue-600" : "text-gray-600"
                    )} />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">
                        {dispositivo.nome}
                      </p>
                      {dispositivo.atual && (
                        <Badge variant="default" className="text-xs">
                          Atual
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Monitor className="h-3 w-3" />
                        {dispositivo.navegador}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {dispositivo.localizacao}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {dispositivo.ultimoAcesso}
                      </span>
                    </div>
                  </div>
                </div>

                {!dispositivo.atual && (
                  <Button
                    onClick={() => handleRemoveDevice(dispositivo.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            💡 <strong>Dica:</strong> Se você não reconhece algum dispositivo, remova-o imediatamente e altere sua senha.
          </p>
        </div>
      </Card>

      {/* Modal de Ativação 2FA */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ativar Autenticação de Dois Fatores</DialogTitle>
            <DialogDescription>
              Escaneie o código QR com seu aplicativo autenticador
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-4">
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code 2FA" 
                  className="w-48 h-48 rounded-lg border-2 border-gray-200"
                />
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <QrCodeIcon className="h-40 w-40 text-gray-400" />
                </div>
              )}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Escaneie este código QR
                </p>
                <p className="text-xs text-gray-600">
                  Use Google Authenticator, Authy ou similar
                </p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div>
                <p className="text-xs text-gray-600 mb-2 text-center">Ou digite manualmente:</p>
                <code className="block bg-gray-50 px-3 py-2 rounded border text-sm font-mono text-center break-all">
                  {totpSecret || 'Gerando...'}
                </code>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">
                  Digite o código de 6 dígitos:
                </label>
                <Input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="text-center text-lg font-mono tracking-widest"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                setShowQRCode(false)
                setVerificationCode('')
              }}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm2FA}
              size="sm"
              className="flex-1"
              disabled={verificationCode.length !== 6}
            >
              Confirmar Ativação
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
