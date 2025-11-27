#!/bin/bash

# ============================================
# MIGRAÇÃO: NextAuth → Lucia Auth
# VIP ASSIST - Migração completa e automática
# ============================================

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🔄 MIGRAÇÃO: NextAuth → Lucia Auth${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script no diretório raiz do projeto${NC}"
    exit 1
fi

echo -e "${YELLOW}[1/10] 🎯 Por que migrar para Lucia Auth?${NC}"
echo "✅ Simples e direto - Menos abstrações"
echo "✅ TypeScript nativo - Melhor tipagem"
echo "✅ Controle total sobre sessões e cookies"
echo "✅ Menor bundle size - Mais performático"
echo "✅ Debugging fácil - Código mais transparente"
echo "✅ Resolve problemas de loop de login definitivamente"
echo ""

read -p "Deseja continuar com a migração? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Migração cancelada."
    exit 1
fi

echo -e "${YELLOW}[2/10] 📦 Instalando Lucia Auth...${NC}"

# Backup do package.json
cp package.json package.json.backup.$(date +%Y%m%d_%H%M%S)

# Instalar Lucia Auth
npm install lucia @lucia-auth/adapter-prisma

echo -e "${YELLOW}[3/10] 🗄️ Atualizando schema Prisma...${NC}"

# Backup do schema
cp prisma/schema.prisma prisma/schema.prisma.backup.$(date +%Y%m%d_%H%M%S)

# Adicionar modelo Session ao schema
cat >> prisma/schema.prisma << 'EOF'

model Session {
  id        String   @id
  userId    String
  expiresAt DateTime
  user      Usuario  @relation(references: [id], fields: [userId], onDelete: Cascade)

  @@map("sessions")
}
EOF

# Adicionar sessions ao modelo Usuario
sed -i '/model Usuario {/,/^}/ s/^}/  sessions Session[]\n}/' prisma/schema.prisma

echo "✅ Schema Prisma atualizado"

echo -e "${YELLOW}[4/10] 🔧 Criando configuração Lucia...${NC}"

# Criar diretório se não existir
mkdir -p src/lib/auth

# Criar configuração do Lucia
cat > src/lib/auth/lucia.ts << 'EOF'
/**
 * Configuração do Lucia Auth
 * Sistema de autenticação moderno e simples
 */

import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "@/lib/prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.usuario);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
      domain: process.env.NODE_ENV === "production" ? ".conectiva24h.com.br" : undefined,
      sameSite: "lax"
    }
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      email: attributes.email,
      nome: attributes.nome,
      role: attributes.role,
      ativo: attributes.ativo,
      avatar: attributes.avatar,
      telefone: attributes.telefone,
      setorId: attributes.setorId
    };
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: string;
      email: string;
      nome: string;
      role: string;
      ativo: boolean;
      avatar?: string;
      telefone?: string;
      setorId?: string;
    };
  }
}

export type DatabaseUser = typeof lucia.getUserAttributes;
EOF

echo "✅ Configuração Lucia criada"

echo -e "${YELLOW}[5/10] 🌐 Criando endpoints de autenticação...${NC}"

# Criar diretório de auth
mkdir -p src/app/api/auth/login
mkdir -p src/app/api/auth/logout
mkdir -p src/app/api/auth/session

# Endpoint de login
cat > src/app/api/auth/login/route.ts << 'EOF'
/**
 * Endpoint de Login - Lucia Auth
 */

import { lucia } from "@/lib/auth/lucia";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
    }

    // Buscar usuário no banco
    const user = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return Response.json({ error: "Credenciais inválidas" }, { status: 400 });
    }

    if (!user.ativo) {
      return Response.json({ error: "Usuário inativo. Entre em contato com o administrador." }, { status: 400 });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.senha);
    if (!validPassword) {
      return Response.json({ error: "Credenciais inválidas" }, { status: 400 });
    }

    // Criar sessão
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return Response.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        role: user.role
      }
    });

  } catch (error) {
    console.error('[Auth] Erro no login:', error);
    return Response.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
EOF

# Endpoint de logout
cat > src/app/api/auth/logout/route.ts << 'EOF'
/**
 * Endpoint de Logout - Lucia Auth
 */

import { lucia } from "@/lib/auth/lucia";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    
    if (sessionId) {
      await lucia.invalidateSession(sessionId);
    }
    
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('[Auth] Erro no logout:', error);
    return Response.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
EOF

# Endpoint de sessão
cat > src/app/api/auth/session/route.ts << 'EOF'
/**
 * Endpoint de Sessão - Lucia Auth
 */

import { lucia } from "@/lib/auth/lucia";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    
    if (!sessionId) {
      return Response.json({ user: null, session: null });
    }

    const { session, user } = await lucia.validateSession(sessionId);
    
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      return Response.json({ user: null, session: null });
    }

    if (session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }

    return Response.json({ 
      user: user ? {
        id: user.id,
        email: user.email,
        nome: user.nome,
        role: user.role,
        ativo: user.ativo,
        avatar: user.avatar,
        telefone: user.telefone,
        setorId: user.setorId
      } : null,
      session: session ? {
        id: session.id,
        expiresAt: session.expiresAt
      } : null
    });

  } catch (error) {
    console.error('[Auth] Erro ao verificar sessão:', error);
    return Response.json({ user: null, session: null });
  }
}
EOF

echo "✅ Endpoints de autenticação criados"

echo -e "${YELLOW}[6/10] 🔒 Criando hook de autenticação...${NC}"

# Criar hook useAuth
cat > src/hooks/useAuth.ts << 'EOF'
/**
 * Hook de Autenticação - Lucia Auth
 */

import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  nome: string;
  role: string;
  ativo: boolean;
  avatar?: string;
  telefone?: string;
  setorId?: string;
}

interface Session {
  id: string;
  expiresAt: Date;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      setUser(data.user);
      setSession(data.session);
    } catch (error) {
      console.error('Erro ao buscar sessão:', error);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      await fetchSession();
      return { success: true };
    } else {
      throw new Error(data.error || 'Erro no login');
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return { 
    user, 
    session, 
    loading, 
    login, 
    logout,
    isAuthenticated: !!user && !!session
  };
}
EOF

echo "✅ Hook useAuth criado"

echo -e "${YELLOW}[7/10] 🛡️ Atualizando middleware...${NC}"

# Backup do middleware atual
cp middleware.ts middleware.ts.backup.$(date +%Y%m%d_%H%M%S)

# Criar novo middleware
cat > middleware.ts << 'EOF'
/**
 * Middleware Global - Lucia Auth
 * Autenticação e proteção de rotas
 */

import { lucia } from "@/lib/auth/lucia";
import { NextRequest, NextResponse } from "next/server";

// Rotas que requerem autenticação
const PROTECTED_ROUTES = [
  '/painel',
  '/clientes',
  '/prestadores',
  '/tickets',
  '/equipe',
  '/relatorios',
  '/logs',
  '/seguranca',
  '/pagamentos'
];

// Rotas públicas
const PUBLIC_ROUTES = [
  '/entrar',
  '/corrida',
  '/api/auth',
  '/_next',
  '/favicon.ico'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Permitir rotas públicas
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Verificar se é rota protegida
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    const sessionId = request.cookies.get(lucia.sessionCookieName)?.value ?? null;
    
    if (!sessionId) {
      return NextResponse.redirect(new URL('/entrar', request.url));
    }

    try {
      const { session, user } = await lucia.validateSession(sessionId);
      
      if (!session || !user || !user.ativo) {
        return NextResponse.redirect(new URL('/entrar', request.url));
      }

      // Usuário autenticado, continuar
      const response = NextResponse.next();
      
      // Renovar cookie se necessário
      if (session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
      
      return response;
      
    } catch (error) {
      console.error('[Middleware] Erro na validação:', error);
      return NextResponse.redirect(new URL('/entrar', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
EOF

echo "✅ Middleware atualizado"

echo -e "${YELLOW}[8/10] 📄 Atualizando página de login...${NC}"

# Backup da página de login
cp src/app/\(publico\)/entrar/page.tsx src/app/\(publico\)/entrar/page.tsx.backup.$(date +%Y%m%d_%H%M%S)

# Atualizar página de login para usar Lucia
cat > src/app/\(publico\)/entrar/page.tsx << 'EOF'
/**
 * Página de Login - Lucia Auth
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      router.push('/painel')
    } catch (err: any) {
      setError(err.message || 'Erro no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            VIP Assist
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Faça login em sua conta
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="sr-only">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Senha"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
EOF

echo "✅ Página de login atualizada"

echo -e "${YELLOW}[9/10] 🗄️ Executando migração do banco...${NC}"

# Gerar e aplicar migração
npx prisma migrate dev --name "add_lucia_sessions"

echo "✅ Migração do banco executada"

echo -e "${YELLOW}[10/10] 🧹 Removendo NextAuth...${NC}"

# Remover NextAuth
npm uninstall next-auth

# Remover arquivos do NextAuth
rm -rf src/app/api/auth/\[...nextauth\]
rm -f src/lib/auth/auth.config.ts
rm -f src/types/next-auth.d.ts

# Remover SessionProvider se existir
if [ -f "src/lib/providers/SessionProvider.tsx" ]; then
    rm src/lib/providers/SessionProvider.tsx
fi

echo "✅ NextAuth removido"

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!${NC}"
echo -e "${BLUE}============================================${NC}"

echo -e "${GREEN}✅ Lucia Auth instalado e configurado${NC}"
echo -e "${GREEN}✅ Endpoints de autenticação criados${NC}"
echo -e "${GREEN}✅ Hook useAuth implementado${NC}"
echo -e "${GREEN}✅ Middleware atualizado${NC}"
echo -e "${GREEN}✅ Página de login migrada${NC}"
echo -e "${GREEN}✅ Banco de dados migrado${NC}"
echo -e "${GREEN}✅ NextAuth removido${NC}"

echo ""
echo -e "${CYAN}📋 Próximos passos:${NC}"
echo "1. Teste o login: npm run dev"
echo "2. Acesse: http://localhost:3000/entrar"
echo "3. Use: admin@vipassist.com / admin123"
echo "4. Verifique se redireciona para /painel"

echo ""
echo -e "${CYAN}🔧 Para produção:${NC}"
echo "1. Faça build: npm run build"
echo "2. Execute migração: npx prisma migrate deploy"
echo "3. Reinicie aplicação"

echo ""
echo -e "${YELLOW}⚠️ Backups criados:${NC}"
echo "- package.json.backup.*"
echo "- prisma/schema.prisma.backup.*"
echo "- middleware.ts.backup.*"
echo "- src/app/(publico)/entrar/page.tsx.backup.*"

echo ""
echo -e "${GREEN}🎯 Benefícios da migração:${NC}"
echo "✅ Sem mais loops de login"
echo "✅ Código mais simples e limpo"
echo "✅ Melhor performance"
echo "✅ Controle total sobre autenticação"
echo "✅ TypeScript nativo"

echo -e "${BLUE}============================================${NC}"
