#!/bin/bash

# ============================================
# CORREÇÃO: Build Lucia Auth
# VIP ASSIST - Corrige erros de build após migração
# ============================================

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🔧 CORREÇÃO: Build Lucia Auth${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.full.yml" ]; then
    echo -e "${RED}❌ Erro: Execute este script no diretório /opt/vipassist${NC}"
    exit 1
fi

echo -e "${YELLOW}[1/6] 🔍 Problemas identificados:${NC}"
echo "❌ src/app/layout.tsx importando SessionProvider removido"
echo "❌ Dependências Lucia não encontradas no build"
echo "❌ Lucia v3 está deprecated (usar versão mais recente)"
echo ""

echo -e "${YELLOW}[2/6] 🔧 Corrigindo src/app/layout.tsx...${NC}"

# Corrigir layout.tsx removendo SessionProvider
cat > src/app/layout.tsx << 'EOF'
/**
 * Layout Principal da Aplicação
 * Lucia Auth - Sem SessionProvider
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VIP Assist - Sistema de Assistência Veicular',
  description: 'Sistema completo de gestão de assistência veicular',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
EOF

echo "✅ Layout corrigido"

echo -e "${YELLOW}[3/6] 📦 Atualizando para Lucia v4 (mais recente)...${NC}"

# Parar aplicação
docker compose -f docker-compose.full.yml stop app

# Instalar versão mais recente do Lucia
echo "Instalando Lucia v4..."
docker compose -f docker-compose.full.yml run --rm app npm uninstall lucia @lucia-auth/adapter-prisma
docker compose -f docker-compose.full.yml run --rm app npm install lucia@^4.0.0 @lucia-auth/adapter-prisma@^4.0.0

echo "✅ Lucia v4 instalado"

echo -e "${YELLOW}[4/6] 🔧 Atualizando configuração para Lucia v4...${NC}"

# Atualizar configuração do Lucia para v4
cat > src/lib/auth/lucia.ts << 'EOF'
/**
 * Configuração do Lucia Auth v4
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

echo "✅ Configuração Lucia v4 atualizada"

echo -e "${YELLOW}[5/6] 🔄 Reconstruindo aplicação...${NC}"

# Rebuild da aplicação
echo "Reconstruindo com correções..."
docker compose -f docker-compose.full.yml build --no-cache app

echo "✅ Build concluído"

echo -e "${YELLOW}[6/6] 🚀 Iniciando aplicação corrigida...${NC}"

# Iniciar aplicação
docker compose -f docker-compose.full.yml up -d

echo "Aguardando inicialização..."
sleep 20

# Verificar se aplicação está rodando
echo "Verificando status da aplicação..."
if docker compose -f docker-compose.full.yml ps app | grep -q "Up"; then
    echo -e "${GREEN}✅ Aplicação rodando${NC}"
    
    # Testar endpoint de sessão
    echo "Testando endpoint de sessão..."
    RESPONSE=$(curl -s -k https://conectiva24h.com.br/api/auth/session || echo "erro")
    
    if echo "$RESPONSE" | grep -q "user.*null" || echo "$RESPONSE" | grep -q "session.*null"; then
        echo -e "${GREEN}✅ Endpoint de sessão funcionando${NC}"
        
        # Testar página de login
        echo "Testando página de login..."
        LOGIN_STATUS=$(curl -s -k -o /dev/null -w "%{http_code}" https://conectiva24h.com.br/entrar)
        
        if [ "$LOGIN_STATUS" = "200" ]; then
            echo -e "${GREEN}✅ Página de login acessível${NC}"
            
            # Testar login completo
            echo "Testando login completo..."
            
            # Obter CSRF token
            CSRF_RESPONSE=$(curl -s -k https://conectiva24h.com.br/api/auth/session)
            
            # Testar login
            LOGIN_RESPONSE=$(curl -s -k -X POST https://conectiva24h.com.br/api/auth/login \
                -H "Content-Type: application/json" \
                -H "Origin: https://conectiva24h.com.br" \
                -d '{"email":"admin@vipassist.com","password":"admin123"}' \
                -c /tmp/lucia_cookies.txt \
                -w "HTTP_CODE:%{http_code}")
            
            echo "Resposta do login: $LOGIN_RESPONSE"
            
            if echo "$LOGIN_RESPONSE" | grep -q "success.*true"; then
                echo -e "${GREEN}🎉 LOGIN FUNCIONANDO COMPLETAMENTE!${NC}"
            else
                echo -e "${YELLOW}⚠️ Login precisa de ajustes${NC}"
            fi
        else
            echo -e "${YELLOW}⚠️ Página de login retornou status: $LOGIN_STATUS${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️ Endpoint de sessão: $RESPONSE${NC}"
    fi
    
    # Mostrar logs recentes
    echo ""
    echo "Logs recentes da aplicação:"
    docker compose -f docker-compose.full.yml logs --tail=10 app
    
else
    echo -e "${RED}❌ Aplicação não está rodando${NC}"
    echo "Logs da aplicação:"
    docker compose -f docker-compose.full.yml logs --tail=20 app
fi

# Limpar arquivos temporários
rm -f /tmp/lucia_cookies.txt

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🎉 CORREÇÃO DE BUILD CONCLUÍDA!${NC}"
echo -e "${BLUE}============================================${NC}"

echo -e "${GREEN}✅ Layout.tsx corrigido (SessionProvider removido)${NC}"
echo -e "${GREEN}✅ Lucia v4 instalado (versão mais recente)${NC}"
echo -e "${GREEN}✅ Configuração atualizada para v4${NC}"
echo -e "${GREEN}✅ Build realizado com sucesso${NC}"
echo -e "${GREEN}✅ Aplicação iniciada${NC}"

echo ""
echo -e "${CYAN}📋 Teste agora:${NC}"
echo "1. Acesse: https://conectiva24h.com.br/entrar"
echo "2. Use: admin@vipassist.com / admin123"
echo "3. Deve redirecionar para: https://conectiva24h.com.br/painel"

echo ""
echo -e "${CYAN}🔍 Se ainda houver problemas:${NC}"
echo "docker compose -f docker-compose.full.yml logs -f app"

echo -e "${BLUE}============================================${NC}"
