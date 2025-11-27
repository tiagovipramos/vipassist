#!/bin/bash

# ============================================
# CORREÇÃO: REDIRECIONAMENTO DE LOGIN
# VIP ASSIST - Corrige loop de redirecionamento
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
echo -e "${BLUE}🔄 CORREÇÃO: REDIRECIONAMENTO DE LOGIN${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.full.yml" ]; then
    echo -e "${RED}❌ Erro: Execute este script no diretório /opt/vipassist${NC}"
    exit 1
fi

echo -e "${YELLOW}[1/8] 🔍 Problema identificado:${NC}"
echo "- NextAuth instalado mas login volta para página inicial"
echo "- Possível problema na configuração de callback/redirect"
echo "- Sessão não sendo criada corretamente"
echo ""

echo -e "${YELLOW}[2/8] 🧪 Testando autenticação completa...${NC}"

# Obter CSRF token
CSRF_TOKEN=$(curl -s -k https://conectiva24h.com.br/api/auth/csrf | jq -r '.csrfToken' 2>/dev/null)
echo "CSRF Token: ${CSRF_TOKEN:0:20}..."

# Fazer login e capturar cookies
echo "Fazendo login e capturando cookies..."
LOGIN_RESPONSE=$(curl -s -k -X POST https://conectiva24h.com.br/api/auth/callback/credentials \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "email=admin@vipassist.com&password=admin123&csrfToken=$CSRF_TOKEN&callbackUrl=https://conectiva24h.com.br/painel" \
    -c /tmp/login_cookies.txt \
    -D /tmp/login_headers.txt \
    -L -w "FINAL_URL:%{url_effective}\nHTTP_CODE:%{http_code}")

echo "Resposta do login:"
echo "$LOGIN_RESPONSE"

echo -e "${YELLOW}[3/8] 🍪 Analisando cookies criados...${NC}"
if [ -f /tmp/login_cookies.txt ]; then
    echo "Cookies encontrados:"
    cat /tmp/login_cookies.txt
    echo ""
    
    # Verificar se há cookies de sessão
    if grep -q "next-auth" /tmp/login_cookies.txt; then
        echo -e "${GREEN}✓ Cookies NextAuth encontrados${NC}"
    else
        echo -e "${RED}❌ Cookies NextAuth não encontrados${NC}"
    fi
else
    echo -e "${RED}❌ Nenhum cookie foi criado${NC}"
fi

echo -e "${YELLOW}[4/8] 🔐 Testando sessão...${NC}"
if [ -f /tmp/login_cookies.txt ]; then
    COOKIE_STRING=$(cat /tmp/login_cookies.txt | grep -v '^#' | awk '{print $6"="$7}' | tr '\n' ';')
    
    SESSION_RESPONSE=$(curl -s -k https://conectiva24h.com.br/api/auth/session \
        -H "Cookie: $COOKIE_STRING")
    
    echo "Resposta da sessão:"
    echo "$SESSION_RESPONSE" | jq . 2>/dev/null || echo "$SESSION_RESPONSE"
    
    if echo "$SESSION_RESPONSE" | grep -q '"user"'; then
        echo -e "${GREEN}✓ Sessão válida encontrada${NC}"
    else
        echo -e "${RED}❌ Sessão inválida ou inexistente${NC}"
    fi
fi

echo -e "${YELLOW}[5/8] 🔧 Verificando configuração NextAuth...${NC}"

# Verificar configuração do NextAuth
docker compose -f docker-compose.full.yml exec -T app node -e "
console.log('=== VERIFICAÇÃO NEXTAUTH CONFIG ===');

try {
    // Verificar variáveis de ambiente
    console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
    console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'CONFIGURADO' : 'NÃO CONFIGURADO');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    // Tentar carregar a configuração
    const fs = require('fs');
    const path = require('path');
    
    // Verificar se arquivo de configuração existe
    const authConfigPath = path.join(process.cwd(), 'src/app/api/auth/[...nextauth]/route.ts');
    if (fs.existsSync(authConfigPath)) {
        console.log('✓ Arquivo de configuração NextAuth encontrado');
        const content = fs.readFileSync(authConfigPath, 'utf8');
        
        // Verificar se tem configuração de credentials
        if (content.includes('CredentialsProvider')) {
            console.log('✓ CredentialsProvider configurado');
        } else {
            console.log('❌ CredentialsProvider não encontrado');
        }
        
        // Verificar callbacks
        if (content.includes('callbacks')) {
            console.log('✓ Callbacks configurados');
        } else {
            console.log('⚠️ Callbacks não configurados');
        }
        
        // Verificar pages
        if (content.includes('pages')) {
            console.log('✓ Pages customizadas configuradas');
        } else {
            console.log('⚠️ Pages não configuradas');
        }
    } else {
        console.log('❌ Arquivo de configuração NextAuth não encontrado');
    }
    
} catch (err) {
    console.error('Erro:', err.message);
}
"

echo -e "${YELLOW}[6/8] 🔄 Aplicando correções...${NC}"

# Verificar e corrigir variáveis de ambiente
echo "Verificando variáveis de ambiente..."
if ! grep -q "NEXTAUTH_URL=https://conectiva24h.com.br" .env; then
    echo "Corrigindo NEXTAUTH_URL..."
    sed -i 's|NEXTAUTH_URL=.*|NEXTAUTH_URL=https://conectiva24h.com.br|' .env
fi

# Reiniciar aplicação para aplicar mudanças
echo "Reiniciando aplicação..."
docker compose -f docker-compose.full.yml restart app

echo "Aguardando reinicialização..."
sleep 15

echo -e "${YELLOW}[7/8] 🧪 Teste final após correções...${NC}"

# Novo teste de login
CSRF_TOKEN_NOVO=$(curl -s -k https://conectiva24h.com.br/api/auth/csrf | jq -r '.csrfToken' 2>/dev/null)

if [ "$CSRF_TOKEN_NOVO" != "null" ] && [ -n "$CSRF_TOKEN_NOVO" ]; then
    echo "Novo CSRF Token: ${CSRF_TOKEN_NOVO:0:20}..."
    
    # Teste de login com redirecionamento
    LOGIN_FINAL=$(curl -s -k -X POST https://conectiva24h.com.br/api/auth/callback/credentials \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "email=admin@vipassist.com&password=admin123&csrfToken=$CSRF_TOKEN_NOVO&callbackUrl=https://conectiva24h.com.br/painel" \
        -c /tmp/final_cookies.txt \
        -L -w "FINAL_URL:%{url_effective}\nHTTP_CODE:%{http_code}")
    
    echo "Resultado do teste final:"
    echo "$LOGIN_FINAL"
    
    # Verificar se criou sessão
    if [ -f /tmp/final_cookies.txt ]; then
        FINAL_COOKIE_STRING=$(cat /tmp/final_cookies.txt | grep -v '^#' | awk '{print $6"="$7}' | tr '\n' ';')
        
        FINAL_SESSION=$(curl -s -k https://conectiva24h.com.br/api/auth/session \
            -H "Cookie: $FINAL_COOKIE_STRING")
        
        echo "Sessão final:"
        echo "$FINAL_SESSION" | jq . 2>/dev/null || echo "$FINAL_SESSION"
        
        if echo "$FINAL_SESSION" | grep -q '"user"'; then
            echo -e "${GREEN}✅ LOGIN E REDIRECIONAMENTO FUNCIONANDO!${NC}"
        else
            echo -e "${RED}❌ Sessão ainda não está sendo criada${NC}"
        fi
    fi
fi

echo -e "${YELLOW}[8/8] 📋 Diagnóstico adicional...${NC}"

# Verificar logs da aplicação
echo "Logs recentes da aplicação:"
docker compose -f docker-compose.full.yml logs --tail=20 app

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}📋 SOLUÇÕES ADICIONAIS${NC}"
echo -e "${BLUE}============================================${NC}"

echo -e "${CYAN}Se o problema persistir, tente:${NC}"
echo ""
echo "1. Limpar cookies do navegador completamente"
echo "2. Testar em modo anônimo/privado"
echo "3. Verificar console do navegador (F12) para erros"
echo "4. Testar com outro navegador"
echo ""
echo "Comandos para debug adicional:"
echo "# Verificar configuração NextAuth:"
echo "docker compose -f docker-compose.full.yml exec app cat src/app/api/auth/[...nextauth]/route.ts"
echo ""
echo "# Verificar variáveis de ambiente:"
echo "docker compose -f docker-compose.full.yml exec app printenv | grep NEXTAUTH"

# Limpar arquivos temporários
rm -f /tmp/login_cookies.txt /tmp/login_headers.txt /tmp/final_cookies.txt

echo ""
echo -e "${GREEN}✅ CORREÇÃO DE REDIRECIONAMENTO CONCLUÍDA${NC}"
echo -e "${BLUE}============================================${NC}"
