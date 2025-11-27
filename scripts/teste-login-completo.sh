#!/bin/bash

# ============================================
# Teste Completo de Login - Simulação Real
# VIP ASSIST - conectiva24h.com.br
# ============================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}TESTE COMPLETO DE LOGIN${NC}"
echo -e "${BLUE}Simulando exatamente o que o navegador faz${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

DOMAIN="https://conectiva24h.com.br"
COOKIE_JAR="/tmp/cookies.txt"
rm -f $COOKIE_JAR

# Passo 1: Acessar página de login
echo -e "${YELLOW}[1/7] Acessando página de login...${NC}"
LOGIN_PAGE=$(curl -s -c $COOKIE_JAR -k "$DOMAIN/entrar")
echo "✓ Página carregada"
echo ""

# Passo 2: Obter CSRF Token
echo -e "${YELLOW}[2/7] Obtendo CSRF Token...${NC}"
CSRF_RESPONSE=$(curl -s -b $COOKIE_JAR -c $COOKIE_JAR -k "$DOMAIN/api/auth/csrf")
CSRF_TOKEN=$(echo $CSRF_RESPONSE | jq -r '.csrfToken')
echo "CSRF Token: ${CSRF_TOKEN:0:30}..."
echo "Resposta completa:"
echo "$CSRF_RESPONSE" | jq .
echo ""

# Passo 3: Verificar cookies atuais
echo -e "${YELLOW}[3/7] Verificando cookies salvos...${NC}"
if [ -f $COOKIE_JAR ]; then
    echo "Cookies:"
    cat $COOKIE_JAR | grep -v "^#"
else
    echo -e "${RED}❌ Nenhum cookie salvo!${NC}"
fi
echo ""

# Passo 4: Fazer login (POST)
echo -e "${YELLOW}[4/7] Enviando credenciais de login...${NC}"
echo "Email: admin@vipassist.com"
echo "Password: admin123"
echo "CSRF Token: ${CSRF_TOKEN:0:30}..."
echo ""

LOGIN_RESPONSE=$(curl -s -i -b $COOKIE_JAR -c $COOKIE_JAR -k \
  -X POST "$DOMAIN/api/auth/callback/credentials" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Origin: $DOMAIN" \
  -H "Referer: $DOMAIN/entrar" \
  --data-urlencode "email=admin@vipassist.com" \
  --data-urlencode "password=admin123" \
  --data-urlencode "csrfToken=$CSRF_TOKEN" \
  --data-urlencode "callbackUrl=$DOMAIN/painel" \
  --data-urlencode "json=true")

echo "Resposta do servidor:"
echo "$LOGIN_RESPONSE"
echo ""

# Extrair status code e location
STATUS=$(echo "$LOGIN_RESPONSE" | grep "HTTP/" | tail -1 | awk '{print $2}')
LOCATION=$(echo "$LOGIN_RESPONSE" | grep -i "^location:" | cut -d' ' -f2 | tr -d '\r')

echo -e "${GREEN}Status Code: $STATUS${NC}"
echo -e "${GREEN}Redirect Location: $LOCATION${NC}"
echo ""

# Passo 5: Verificar se há erro
if echo "$LOCATION" | grep -q "error"; then
    echo -e "${RED}❌ LOGIN FALHOU - Redirecionado para página de erro${NC}"
    ERROR_TYPE=$(echo "$LOCATION" | grep -oP 'error=\K[^&]+')
    echo -e "${RED}Tipo de erro: $ERROR_TYPE${NC}"
    echo ""
fi

if echo "$LOCATION" | grep -q "csrf"; then
    echo -e "${RED}❌ ERRO DE CSRF TOKEN${NC}"
    echo "O token CSRF não foi aceito pelo servidor"
    echo ""
fi

# Passo 6: Verificar sessão após login
echo -e "${YELLOW}[5/7] Verificando sessão após login...${NC}"
SESSION_RESPONSE=$(curl -s -b $COOKIE_JAR -k "$DOMAIN/api/auth/session")
echo "Sessão:"
echo "$SESSION_RESPONSE" | jq .
echo ""

if echo "$SESSION_RESPONSE" | jq -e '.user' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ SESSÃO CRIADA COM SUCESSO!${NC}"
    echo -e "${GREEN}Usuário logado: $(echo $SESSION_RESPONSE | jq -r '.user.email')${NC}"
else
    echo -e "${RED}❌ SESSÃO NÃO FOI CRIADA${NC}"
    echo "Resposta da sessão não contém dados do usuário"
fi
echo ""

# Passo 7: Tentar acessar página protegida
echo -e "${YELLOW}[6/7] Tentando acessar página protegida (/painel)...${NC}"
PAINEL_RESPONSE=$(curl -s -i -b $COOKIE_JAR -k "$DOMAIN/painel" | head -20)
echo "$PAINEL_RESPONSE"
echo ""

if echo "$PAINEL_RESPONSE" | grep -q "HTTP/2 200"; then
    echo -e "${GREEN}✓ ACESSO PERMITIDO AO PAINEL!${NC}"
elif echo "$PAINEL_RESPONSE" | grep -q "HTTP/2 307\|HTTP/2 302"; then
    echo -e "${RED}❌ REDIRECIONADO - Não autenticado${NC}"
    REDIRECT=$(echo "$PAINEL_RESPONSE" | grep -i "^location:" | cut -d' ' -f2)
    echo "Redirecionado para: $REDIRECT"
fi
echo ""

# Passo 8: Análise detalhada dos cookies
echo -e "${YELLOW}[7/7] Análise detalhada dos cookies...${NC}"
echo "Cookies finais:"
cat $COOKIE_JAR | grep -v "^#" | while read line; do
    if [ ! -z "$line" ]; then
        COOKIE_NAME=$(echo $line | awk '{print $6}')
        COOKIE_VALUE=$(echo $line | awk '{print $7}')
        echo "  - $COOKIE_NAME = ${COOKIE_VALUE:0:50}..."
    fi
done
echo ""

# Verificar cookies específicos do NextAuth
echo "Verificando cookies do NextAuth:"
if grep -q "next-auth.session-token" $COOKIE_JAR; then
    echo -e "${GREEN}✓ Cookie de sessão encontrado${NC}"
else
    echo -e "${RED}❌ Cookie de sessão NÃO encontrado${NC}"
fi

if grep -q "next-auth.csrf-token" $COOKIE_JAR; then
    echo -e "${GREEN}✓ Cookie CSRF encontrado${NC}"
else
    echo -e "${RED}❌ Cookie CSRF NÃO encontrado${NC}"
fi
echo ""

# Resumo Final
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}RESUMO DO TESTE${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

if echo "$SESSION_RESPONSE" | jq -e '.user' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ LOGIN FUNCIONOU!${NC}"
    echo -e "${GREEN}O problema está no FRONTEND (JavaScript/React)${NC}"
    echo ""
    echo "Possíveis causas:"
    echo "1. Erro no código JavaScript da página de login"
    echo "2. Problema no redirecionamento após login"
    echo "3. Estado do React não está atualizando"
    echo "4. Erro no SessionProvider"
    echo ""
    echo "Solução: Verificar console do navegador (F12) para erros JavaScript"
else
    echo -e "${RED}❌ LOGIN NÃO FUNCIONOU${NC}"
    echo ""
    
    if echo "$LOCATION" | grep -q "csrf"; then
        echo "Problema: CSRF Token inválido"
        echo "Solução: Verificar configuração do NextAuth"
    elif echo "$LOCATION" | grep -q "error"; then
        echo "Problema: Credenciais inválidas ou erro no authorize()"
        echo "Solução: Verificar função authorize() no NextAuth"
    else
        echo "Problema: Desconhecido"
        echo "Verificar logs da aplicação:"
        echo "docker compose -f docker-compose.full.yml logs app | tail -50"
    fi
fi

echo ""
echo -e "${BLUE}============================================${NC}"

# Limpar
rm -f $COOKIE_JAR
