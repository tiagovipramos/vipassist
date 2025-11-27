'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/componentes/ui/button'
import { Card } from '@/componentes/ui/card'
import { useAuthStore } from '@/stores/authStore'
import { Shield, Users, Headphones, Crown, MapPin, Truck, BarChart3, Check } from 'lucide-react'
import { Usuario } from '@/tipos/usuario'
import { usePermissionsStore } from '@/stores/permissionsStore'

export default function LoginPage() {
  const router = useRouter()
  const { setUsuario } = useAuthStore()
  const { carregarPermissoes } = usePermissionsStore()

  const handleRoleLogin = async (role: 'admin' | 'gerente' | 'atendente') => {
    // Criar usuário mockado baseado no role
    const usuariosMock: Record<string, Usuario> = {
      admin: {
        id: '1',
        nome: 'Administrador',
        email: 'admin@vipassist.com',
        avatar: 'https://i.pravatar.cc/150?u=admin',
        perfil: 'admin',
        role: 'admin',
        status: 'online',
        dataCriacao: new Date().toISOString(),
        ultimoAcesso: new Date().toISOString(),
        ativo: true
      },
      gerente: {
        id: '2',
        nome: 'Gerente',
        email: 'gerente@vipassist.com',
        avatar: 'https://i.pravatar.cc/150?u=gerente',
        perfil: 'gerente',
        role: 'gerente',
        status: 'online',
        dataCriacao: new Date().toISOString(),
        ultimoAcesso: new Date().toISOString(),
        ativo: true
      },
      atendente: {
        id: '3',
        nome: 'Atendente',
        email: 'atendente@vipassist.com',
        avatar: 'https://i.pravatar.cc/150?u=atendente',
        perfil: 'atendente',
        role: 'atendente',
        status: 'online',
        dataCriacao: new Date().toISOString(),
        ultimoAcesso: new Date().toISOString(),
        ativo: true
      }
    }

    const usuario = usuariosMock[role]
    
    // Definir usuário no store
    setUsuario(usuario)
    
    // Carregar permissões baseadas no role
    await carregarPermissoes(usuario.email)
    
    // Redirecionar para o painel
    router.push('/painel')
  }

  const roles = [
    {
      id: 'admin',
      title: 'Administrador',
      description: 'Acesso total ao sistema',
      icon: Crown,
      color: 'from-purple-500 to-purple-600',
      features: [
        'Gerenciar usuários e permissões',
        'Configurações do sistema',
        'Acesso a todos os módulos',
        'Relatórios completos'
      ]
    },
    {
      id: 'gerente',
      title: 'Gerente',
      description: 'Gerenciamento operacional',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Gerenciar equipe',
        'Visualizar relatórios',
        'Aprovar solicitações',
        'Monitorar operações'
      ]
    },
    {
      id: 'atendente',
      title: 'Atendente',
      description: 'Atendimento ao cliente',
      icon: Headphones,
      color: 'from-green-500 to-green-600',
      features: [
        'Criar chamados',
        'Atender clientes',
        'Visualizar tickets',
        'Registrar atendimentos'
      ]
    }
  ]

  const stats = [
    { value: '24/7', label: 'Disponibilidade' },
    { value: '100%', label: 'Rastreável' },
    { value: '<5min', label: 'Tempo Resposta' }
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Lado Esquerdo - Seleção de Role */}
      <div className="flex w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:w-1/2">
        <div className="w-full max-w-2xl space-y-6">
          {/* Logo e Título */}
          <div className="animate-fade-in text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-accent shadow-2xl transition-transform hover:scale-105">
              <span className="text-3xl font-bold text-white">V</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Bem-vindo ao VIP Assist!</h1>
            <p className="mt-2 text-gray-600">Selecione seu perfil para acessar o sistema</p>
          </div>

          {/* Cards de Role */}
          <div className="grid gap-4 md:grid-cols-3">
            {roles.map((role, index) => (
              <Card 
                key={role.id}
                className="group relative overflow-hidden border-2 border-gray-200 bg-white p-6 shadow-lg transition-all hover:border-gray-300 hover:shadow-xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 transition-opacity group-hover:opacity-5`} />
                
                <div className="relative space-y-4">
                  {/* Icon */}
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${role.color} shadow-lg transition-transform group-hover:scale-110`}>
                    <role.icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Title & Description */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900">{role.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{role.description}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                        <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <Button
                    onClick={() => handleRoleLogin(role.id as 'admin' | 'gerente' | 'atendente')}
                    className={`w-full bg-gradient-to-r ${role.color} font-semibold shadow-md transition-all hover:shadow-lg`}
                  >
                    Entrar como {role.title}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Info adicional */}
          <div className="text-center text-sm text-gray-500">
            <p>💡 Modo de demonstração - Escolha qualquer perfil para explorar o sistema</p>
          </div>
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
              <div className="group rounded-xl bg-white/10 p-3 backdrop-blur-sm transition-all hover:bg-white/20">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-1 text-sm font-semibold">Rastreamento em Tempo Real</h3>
                <p className="text-xs text-white/80">Acompanhe prestadores ao vivo no mapa</p>
              </div>

              <div className="group rounded-xl bg-white/10 p-3 backdrop-blur-sm transition-all hover:bg-white/20">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-1 text-sm font-semibold">Gestão de Prestadores</h3>
                <p className="text-xs text-white/80">Controle completo de sua rede</p>
              </div>

              <div className="group rounded-xl bg-white/10 p-3 backdrop-blur-sm transition-all hover:bg-white/20">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-1 text-sm font-semibold">Relatórios Completos</h3>
                <p className="text-xs text-white/80">Análises operacionais e financeiras</p>
              </div>

              <div className="group rounded-xl bg-white/10 p-3 backdrop-blur-sm transition-all hover:bg-white/20">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-1 text-sm font-semibold">Sistema Seguro</h3>
                <p className="text-xs text-white/80">Dados protegidos e auditoria completa</p>
              </div>
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
