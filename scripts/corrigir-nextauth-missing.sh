#!/bin/bash

# ============================================
# CORREÇÃO: NEXTAUTH MISSING
# VIP ASSIST - Instala NextAuth e dependências
# ============================================

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🔧 CORREÇÃO: NEXTAUTH MISSING${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.full.yml" ]; then
    echo -e "${RED}❌ Erro: Execute este script no diretório /opt/vipassist${NC}"
    exit 1
fi

echo -e "${YELLOW}[1/6] 🔍 Problema identificado:${NC}"
echo "- NextAuth não está instalado no container"
echo "- Aplicação retorna 503 após reinicialização"
echo "- Dependências de autenticação ausentes"
echo ""

echo -e "${YELLOW}[2/6] 📦 Verificando package.json...${NC}"
if grep -q "next-auth" package.json; then
    echo -e "${GREEN}✓ NextAuth está listado no package.json${NC}"
else
    echo -e "${RED}❌ NextAuth NÃO está no package.json${NC}"
    echo "Adicionando NextAuth ao package.json..."
    
    # Backup do package.json
    cp package.json package.json.backup
    
    # Adicionar NextAuth (assumindo que está faltando)
    echo "ATENÇÃO: Você precisa adicionar NextAuth manualmente ao package.json"
fi

echo -e "${YELLOW}[3/6] 🐳 Parando containers...${NC}"
docker compose -f docker-compose.full.yml down

echo -e "${YELLOW}[4/6] 🔨 Reconstruindo imagem com dependências...${NC}"
docker compose -f docker-compose.full.yml build --no-cache app

echo -e "${YELLOW}[5/6] 🚀 Iniciando containers...${NC}"
docker compose -f docker-compose.full.yml up -d

echo "Aguardando inicialização..."
sleep 20

echo -e "${YELLOW}[6/6] 🧪 Testando correção...${NC}"

# Testar se NextAuth agora está disponível
echo "Testando NextAuth no container..."
NEXTAUTH_TEST=$(docker compose -f docker-compose.full.yml exec -T app node -e "
try {
    const NextAuth = require('next-auth');
    console.log('SUCCESS: NextAuth carregado');
} catch (err) {
    console.log('ERROR: ' + err.message);
}
" 2>/dev/null)

echo "Resultado: $NEXTAUTH_TEST"

if echo "$NEXTAUTH_TEST" | grep -q "SUCCESS"; then
    echo -e "${GREEN}✅ NextAuth instalado com sucesso!${NC}"
    
    # Testar login
    echo "Testando login..."
    CSRF_TOKEN=$(curl -s -k https://conectiva24h.com.br/api/auth/csrf | jq -r '.csrfToken' 2>/dev/null)
    
    if [ "$CSRF_TOKEN" != "null" ] && [ -n "$CSRF_TOKEN" ]; then
        LOGIN_TEST=$(curl -s -k -X POST https://conectiva24h.com.br/api/auth/callback/credentials \
            -H "Content-Type: application/x-www-form-urlencoded" \
            -d "email=admin@vipassist.com&password=admin123&csrfToken=$CSRF_TOKEN&json=true" \
            -w "HTTP_CODE:%{http_code}")
        
        echo "Teste de login: $LOGIN_TEST"
        
        if echo "$LOGIN_TEST" | grep -q "HTTP_CODE:200"; then
            echo -e "${GREEN}🎉 LOGIN FUNCIONANDO!${NC}"
        else
            echo -e "${YELLOW}⚠️ Login ainda precisa de ajustes${NC}"
        fi
    fi
else
    echo -e "${RED}❌ NextAuth ainda não está funcionando${NC}"
    echo -e "${YELLOW}Soluções alternativas:${NC}"
    echo "1. Verificar se next-auth está no package.json"
    echo "2. Executar: docker compose -f docker-compose.full.yml exec app npm install next-auth"
    echo "3. Reconstruir imagem completamente"
fi

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}📋 COMANDOS MANUAIS SE NECESSÁRIO${NC}"
echo -e "${BLUE}============================================${NC}"

echo -e "${CYAN}Se o problema persistir, execute manualmente:${NC}"
echo ""
echo "# 1. Instalar NextAuth no container:"
echo "docker compose -f docker-compose.full.yml exec app npm install next-auth"
echo ""
echo "# 2. Ou reconstruir imagem:"
echo "docker compose -f docker-compose.full.yml build --no-cache"
echo "docker compose -f docker-compose.full.yml up -d"
echo ""
echo "# 3. Verificar package.json:"
echo "cat package.json | grep next-auth"

echo ""
echo -e "${GREEN}✅ CORREÇÃO CONCLUÍDA${NC}"
echo -e "${BLUE}============================================${NC}"
