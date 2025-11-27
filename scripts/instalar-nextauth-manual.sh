#!/bin/bash

# ============================================
# INSTALAÇÃO MANUAL DO NEXTAUTH
# VIP ASSIST - Força instalação no container
# ============================================

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🔧 INSTALAÇÃO MANUAL DO NEXTAUTH${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.full.yml" ]; then
    echo -e "${RED}❌ Erro: Execute este script no diretório /opt/vipassist${NC}"
    exit 1
fi

echo -e "${YELLOW}[1/5] 📦 Instalando NextAuth diretamente no container...${NC}"
docker compose -f docker-compose.full.yml exec app npm install next-auth

echo -e "${YELLOW}[2/5] 🔧 Verificando instalação...${NC}"
NEXTAUTH_CHECK=$(docker compose -f docker-compose.full.yml exec -T app node -e "
try {
    const NextAuth = require('next-auth');
    console.log('SUCCESS: NextAuth instalado');
} catch (err) {
    console.log('ERROR: ' + err.message);
}
" 2>/dev/null)

echo "Resultado: $NEXTAUTH_CHECK"

if echo "$NEXTAUTH_CHECK" | grep -q "SUCCESS"; then
    echo -e "${GREEN}✅ NextAuth instalado com sucesso!${NC}"
    
    echo -e "${YELLOW}[3/5] 🔄 Reiniciando aplicação...${NC}"
    docker compose -f docker-compose.full.yml restart app
    
    echo "Aguardando reinicialização..."
    sleep 15
    
    echo -e "${YELLOW}[4/5] 🧪 Testando login...${NC}"
    
    # Testar endpoints
    echo "Testando endpoint de CSRF..."
    CSRF_RESPONSE=$(curl -s -k https://conectiva24h.com.br/api/auth/csrf)
    echo "CSRF: $CSRF_RESPONSE"
    
    CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | jq -r '.csrfToken' 2>/dev/null)
    
    if [ "$CSRF_TOKEN" != "null" ] && [ -n "$CSRF_TOKEN" ]; then
        echo -e "${GREEN}✓ CSRF Token obtido: ${CSRF_TOKEN:0:20}...${NC}"
        
        # Testar login
        echo "Testando login..."
        LOGIN_RESPONSE=$(curl -s -k -X POST https://conectiva24h.com.br/api/auth/callback/credentials \
            -H "Content-Type: application/x-www-form-urlencoded" \
            -d "email=admin@vipassist.com&password=admin123&csrfToken=$CSRF_TOKEN&json=true" \
            -w "HTTP_CODE:%{http_code}")
        
        echo "Resposta do login: $LOGIN_RESPONSE"
        
        if echo "$LOGIN_RESPONSE" | grep -q "HTTP_CODE:200"; then
            echo -e "${GREEN}🎉 LOGIN FUNCIONANDO!${NC}"
            
            echo -e "${YELLOW}[5/5] ✅ Testando no navegador...${NC}"
            echo "Agora teste no navegador:"
            echo "1. Acesse: https://conectiva24h.com.br/entrar"
            echo "2. Use: admin@vipassist.com / admin123"
            echo "3. Deve redirecionar para o painel"
            
        else
            echo -e "${YELLOW}⚠️ Login precisa de mais ajustes${NC}"
            echo "Mas NextAuth está instalado, teste no navegador"
        fi
    else
        echo -e "${RED}❌ Problema com CSRF token${NC}"
    fi
    
else
    echo -e "${RED}❌ Falha na instalação do NextAuth${NC}"
    echo -e "${YELLOW}Tentando solução alternativa...${NC}"
    
    # Tentar instalar versão específica
    echo "Instalando versão específica do NextAuth..."
    docker compose -f docker-compose.full.yml exec app npm install next-auth@4.24.5
    
    # Verificar novamente
    NEXTAUTH_CHECK2=$(docker compose -f docker-compose.full.yml exec -T app node -e "
    try {
        const NextAuth = require('next-auth');
        console.log('SUCCESS: NextAuth versão específica instalada');
    } catch (err) {
        console.log('ERROR: ' + err.message);
    }
    " 2>/dev/null)
    
    echo "Resultado da versão específica: $NEXTAUTH_CHECK2"
fi

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}📋 COMANDOS ADICIONAIS SE NECESSÁRIO${NC}"
echo -e "${BLUE}============================================${NC}"

echo -e "${CYAN}Se ainda não funcionar:${NC}"
echo ""
echo "# 1. Verificar package.json no container:"
echo "docker compose -f docker-compose.full.yml exec app cat package.json | grep next-auth"
echo ""
echo "# 2. Listar dependências instaladas:"
echo "docker compose -f docker-compose.full.yml exec app npm list | grep next-auth"
echo ""
echo "# 3. Instalar todas as dependências novamente:"
echo "docker compose -f docker-compose.full.yml exec app npm install"
echo ""
echo "# 4. Verificar logs da aplicação:"
echo "docker compose -f docker-compose.full.yml logs -f app"

echo ""
echo -e "${GREEN}✅ INSTALAÇÃO MANUAL CONCLUÍDA${NC}"
echo -e "${BLUE}============================================${NC}"
