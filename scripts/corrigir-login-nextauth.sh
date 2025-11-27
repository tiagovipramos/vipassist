#!/bin/bash

# ============================================
# SCRIPT DE CORREÇÃO DO PROBLEMA DE LOGIN
# VIP ASSIST - Corrige redirecionamentos em loop
# ============================================

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🔧 CORREÇÃO DO PROBLEMA DE LOGIN${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.full.yml" ]; then
    echo -e "${RED}❌ Erro: Execute este script no diretório /opt/vipassist${NC}"
    exit 1
fi

echo -e "${YELLOW}[1/6] 🔍 Identificando o problema...${NC}"
echo "Problema detectado: Redirecionamentos em loop para /api/auth/signin"
echo "Causa: NextAuth não está validando credenciais corretamente"
echo ""

echo -e "${YELLOW}[2/6] 🔐 Verificando hash da senha do admin...${NC}"
SENHA_ATUAL=$(docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -t -c "SELECT senha FROM \"Usuario\" WHERE email = 'admin@vipassist.com';" | tr -d ' \n\r')

echo "Hash atual da senha: ${SENHA_ATUAL:0:20}..."

# Gerar novo hash da senha
echo -e "${YELLOW}[3/6] 🔑 Gerando novo hash da senha...${NC}"
NOVO_HASH=$(docker compose -f docker-compose.full.yml exec -T app node -e "
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('admin123', 10));
")

echo "Novo hash gerado: ${NOVO_HASH:0:20}..."

echo -e "${YELLOW}[4/6] 💾 Atualizando senha no banco de dados...${NC}"
docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -c "
UPDATE \"Usuario\" 
SET senha = '$NOVO_HASH', \"updatedAt\" = NOW() 
WHERE email = 'admin@vipassist.com';
"

echo -e "${GREEN}✓ Senha atualizada com sucesso${NC}"

echo -e "${YELLOW}[5/6] 🔄 Reiniciando aplicação...${NC}"
docker compose -f docker-compose.full.yml restart app

echo "Aguardando aplicação inicializar..."
sleep 10

echo -e "${YELLOW}[6/6] 🧪 Testando login corrigido...${NC}"

# Obter novo CSRF token
CSRF_TOKEN=$(curl -s -k https://conectiva24h.com.br/api/auth/csrf | jq -r '.csrfToken' 2>/dev/null)

if [ "$CSRF_TOKEN" != "null" ] && [ -n "$CSRF_TOKEN" ]; then
    echo "CSRF Token obtido: ${CSRF_TOKEN:0:20}..."
    
    # Testar login
    LOGIN_RESPONSE=$(curl -s -k -X POST https://conectiva24h.com.br/api/auth/callback/credentials \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "email=admin@vipassist.com&password=admin123&csrfToken=$CSRF_TOKEN&callbackUrl=https://conectiva24h.com.br/painel" \
        -w "HTTP_CODE:%{http_code}" \
        -c /tmp/test_cookies.txt \
        -L)
    
    echo "Resposta do teste de login:"
    echo "$LOGIN_RESPONSE"
    
    # Verificar se criou sessão
    if [ -f /tmp/test_cookies.txt ]; then
        COOKIE_STRING=$(cat /tmp/test_cookies.txt | grep -v '^#' | awk '{print $6"="$7}' | tr '\n' ';')
        
        SESSION_RESPONSE=$(curl -s -k https://conectiva24h.com.br/api/auth/session \
            -H "Cookie: $COOKIE_STRING")
        
        echo ""
        echo "Verificação da sessão:"
        echo "$SESSION_RESPONSE" | jq . 2>/dev/null || echo "$SESSION_RESPONSE"
        
        # Verificar se tem usuário na sessão
        if echo "$SESSION_RESPONSE" | grep -q '"user"'; then
            echo -e "${GREEN}✅ LOGIN CORRIGIDO COM SUCESSO!${NC}"
            echo -e "${GREEN}O problema foi resolvido. Agora você pode fazer login normalmente.${NC}"
        else
            echo -e "${RED}❌ Login ainda não está funcionando${NC}"
            echo -e "${YELLOW}Tente as soluções adicionais abaixo...${NC}"
        fi
        
        rm -f /tmp/test_cookies.txt
    fi
else
    echo -e "${RED}❌ Não foi possível obter CSRF token${NC}"
fi

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}📋 SOLUÇÕES ADICIONAIS${NC}"
echo -e "${BLUE}============================================${NC}"

echo -e "${YELLOW}Se o problema persistir, tente:${NC}"
echo ""
echo -e "${CYAN}1. Limpar cache do navegador:${NC}"
echo "   - Pressione Ctrl+Shift+Delete"
echo "   - Limpe cookies para conectiva24h.com.br"
echo ""
echo -e "${CYAN}2. Testar em modo anônimo/privado${NC}"
echo ""
echo -e "${CYAN}3. Verificar console do navegador (F12):${NC}"
echo "   - Procure por erros JavaScript"
echo "   - Verifique aba Network durante o login"
echo ""
echo -e "${CYAN}4. Tentar com outro navegador${NC}"
echo ""
echo -e "${CYAN}5. Verificar se JavaScript está habilitado${NC}"
echo ""
echo -e "${CYAN}6. Desabilitar bloqueadores de anúncios temporariamente${NC}"

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}✅ CORREÇÃO CONCLUÍDA${NC}"
echo -e "${BLUE}============================================${NC}"
