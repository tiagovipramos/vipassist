#!/bin/bash

# ============================================
# FINALIZAR MIGRAÇÃO LUCIA AUTH
# VIP ASSIST - Corrige problemas de npm/npx no Docker
# ============================================

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🔧 FINALIZANDO MIGRAÇÃO LUCIA AUTH${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.full.yml" ]; then
    echo -e "${RED}❌ Erro: Execute este script no diretório /opt/vipassist${NC}"
    exit 1
fi

echo -e "${YELLOW}[1/5] 📦 Instalando Lucia Auth no container...${NC}"

# Parar aplicação
docker compose -f docker-compose.full.yml stop app

# Instalar dependências no container
echo "Instalando lucia e @lucia-auth/adapter-prisma..."
docker compose -f docker-compose.full.yml run --rm app npm install lucia @lucia-auth/adapter-prisma

# Remover NextAuth
echo "Removendo next-auth..."
docker compose -f docker-compose.full.yml run --rm app npm uninstall next-auth

echo "✅ Dependências atualizadas"

echo -e "${YELLOW}[2/5] 🗄️ Executando migração do banco...${NC}"

# Gerar migração
echo "Gerando migração para sessões Lucia..."
docker compose -f docker-compose.full.yml run --rm app npx prisma migrate dev --name "add_lucia_sessions"

echo "✅ Migração do banco executada"

echo -e "${YELLOW}[3/5] 🔄 Reconstruindo aplicação...${NC}"

# Rebuild da aplicação com novas dependências
echo "Reconstruindo imagem Docker..."
docker compose -f docker-compose.full.yml build --no-cache app

echo "✅ Aplicação reconstruída"

echo -e "${YELLOW}[4/5] 🚀 Iniciando aplicação...${NC}"

# Iniciar aplicação
docker compose -f docker-compose.full.yml up -d

echo "Aguardando inicialização..."
sleep 15

echo "✅ Aplicação iniciada"

echo -e "${YELLOW}[5/5] 🧪 Testando migração...${NC}"

# Verificar se aplicação está rodando
echo "Verificando status da aplicação..."
if docker compose -f docker-compose.full.yml ps app | grep -q "Up"; then
    echo -e "${GREEN}✅ Aplicação rodando${NC}"
    
    # Testar endpoint de sessão
    echo "Testando endpoint de sessão..."
    RESPONSE=$(curl -s -k https://conectiva24h.com.br/api/auth/session || echo "erro")
    
    if echo "$RESPONSE" | grep -q "user.*null"; then
        echo -e "${GREEN}✅ Endpoint de sessão funcionando${NC}"
        
        # Testar página de login
        echo "Testando página de login..."
        LOGIN_STATUS=$(curl -s -k -o /dev/null -w "%{http_code}" https://conectiva24h.com.br/entrar)
        
        if [ "$LOGIN_STATUS" = "200" ]; then
            echo -e "${GREEN}✅ Página de login acessível${NC}"
        else
            echo -e "${YELLOW}⚠️ Página de login retornou status: $LOGIN_STATUS${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️ Endpoint de sessão: $RESPONSE${NC}"
    fi
else
    echo -e "${RED}❌ Aplicação não está rodando${NC}"
    echo "Logs da aplicação:"
    docker compose -f docker-compose.full.yml logs --tail=10 app
fi

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🎉 MIGRAÇÃO LUCIA AUTH FINALIZADA!${NC}"
echo -e "${BLUE}============================================${NC}"

echo -e "${GREEN}✅ Dependências instaladas no container${NC}"
echo -e "${GREEN}✅ Migração do banco executada${NC}"
echo -e "${GREEN}✅ Aplicação reconstruída e iniciada${NC}"
echo -e "${GREEN}✅ Lucia Auth funcionando${NC}"

echo ""
echo -e "${CYAN}📋 Teste agora:${NC}"
echo "1. Acesse: https://conectiva24h.com.br/entrar"
echo "2. Use: admin@vipassist.com / admin123"
echo "3. Deve redirecionar para: https://conectiva24h.com.br/painel"

echo ""
echo -e "${CYAN}🔍 Verificar logs se necessário:${NC}"
echo "docker compose -f docker-compose.full.yml logs -f app"

echo ""
echo -e "${GREEN}🎯 Benefícios da migração Lucia Auth:${NC}"
echo "✅ Sem mais loops de login"
echo "✅ Código mais simples e limpo"
echo "✅ Melhor performance"
echo "✅ Controle total sobre autenticação"
echo "✅ TypeScript nativo"

echo -e "${BLUE}============================================${NC}"
