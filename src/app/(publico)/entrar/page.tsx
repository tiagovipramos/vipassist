'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/componentes/ui/button'
import { Input } from '@/componentes/ui/input'
import { Card } from '@/componentes/ui/card'
import { useAuthStore } from '@/stores/authStore'
import { Mail, Lock, ArrowRight, Sparkles, MapPin, Truck, BarChart3, Shield, Check, Users, Clock, TrendingUp } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login, isCarregando, erro, limparErro } = useAuthStore()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    limparErro()
    
    if (!email.trim()) {
      alert('Por favor, preencha o email')
      return
    }
    
    if (!senha.trim()) {
      alert('Por favor, preencha a senha')
      return
    }
    
    const sucesso = await login(email, senha)
    
    if (sucesso) {
      router.push('/painel')
    }
  }

  const features = [
    {
      icon: MapPin,
      title: 'Rastreamento em Tempo Real',
      description: 'Acompanhe prestadores ao vivo no mapa'
    },
    {
      icon: Truck,
      title: 'Gestão de Prestadores',
      description: 'Controle completo de sua rede'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Completos',
      description: 'Análises operacionais e financeiras'
    },
    {
      icon: Shield,
      title: 'Sistema Seguro',
      description: 'Dados protegidos e auditoria completa'
    }
  ]

  const stats = [
    { value: '24/7', label: 'Disponibilidade' },
    { value: '100%', label: 'Rastreável' },
    { value: '<5min', label: 'Tempo Resposta' }
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Lado Esquerdo - Formulário */}
      <div className="flex w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:w-1/2">
        <div className="w-full max-w-md space-y-4">
          {/* Logo e Título */}
          <div className="animate-fade-in text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-accent shadow-2xl transition-transform hover:scale-105">
              <span className="text-3xl font-bold text-white">K</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Bem-vindo de volta!</h1>
            <p className="mt-2 text-gray-600">Entre com sua conta para acessar o painel</p>
          </div>

          {/* Formulário */}
          <Card className="animate-slide-up border-0 bg-white p-8 shadow-2xl backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo de Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Campo de Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Sua senha"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Mensagem de erro */}
              {erro && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  {erro}
                </div>
              )}

              {/* Botão de Login */}
              <Button
                type="submit"
                className="group relative w-full overflow-hidden bg-gradient-to-r from-secondary to-accent text-base font-semibold shadow-lg transition-all hover:shadow-xl hover:from-secondary/90 hover:to-accent/90"
                disabled={isCarregando}
              >
                <span className="flex items-center justify-center gap-2">
                  {isCarregando ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar no Dashboard
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Lado Direito - Banner */}
      <div className="hidden lg:flex lg:w-1/2">
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-secondary via-primary to-accent p-12">
          {/* Pattern de fundo animado */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute inset-0 animate-pulse" 
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }} 
            />
          </div>

          {/* Círculos decorativos flutuantes */}
          <div className="absolute -right-20 -top-20 h-64 w-64 animate-float rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 animate-float-delayed rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-1/4 top-1/4 h-40 w-40 animate-float-slow rounded-full bg-white/5 blur-2xl" />

          {/* Conteúdo */}
          <div className="relative z-10 w-full max-w-lg space-y-6 text-white">
            <div className="space-y-3">
              <h2 className="text-4xl font-bold leading-tight">
                Assistência Veicular 24h Inteligente
              </h2>
              <p className="text-lg text-white/90">
                Gerencie chamados, prestadores e rastreamento em tempo real em uma única plataforma.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="mt-1 text-xs text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group rounded-xl bg-white/10 p-3 backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold">{feature.title}</h3>
                  <p className="text-xs text-white/80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-5deg);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, -20px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
