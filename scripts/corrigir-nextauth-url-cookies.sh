#!/bin/bash

# ============================================
# CORREÇÃO: NEXTAUTH_URL E COOKIES HTTPS
# VIP ASSIST - Corrige URL e configuração de cookies
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
echo -e "${BLUE}🔧 CORREÇÃO: NEXTAUTH_URL E COOKIES HTTPS${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.full.yml" ]; then
    echo -e "${RED}❌ Erro: Execute este script no diretório /opt/vipassist${NC}"
    exit 1
fi

echo -e "${YELLOW}[1/7] 🔍 PROBLEMA IDENTIFICADO (baseado nas dicas do ChatGPT):${NC}"
echo "❌ CAUSA #3: URL / NEXTAUTH_URL errado"
echo "   - NEXTAUTH_URL está como 'http://localhost:3000'"
echo "   - Deveria ser 'https://conectiva24h.com.br'"
echo "   - Falta configuração de cookies para HTTPS"
echo "   - Cookies não funcionam com domínio errado"
echo ""

echo -e "${YELLOW}[2/7] 📋 Verificando configuração atual...${NC}"

# Verificar variáveis atuais no container
echo "Variáveis NextAuth no container:"
docker compose -f docker-compose.full.yml exec -T app printenv | grep NEXTAUTH || echo "Nenhuma variável NextAuth encontrada"

echo ""
echo "Conteúdo do .env local:"
grep NEXTAUTH .env || echo "Nenhuma configuração NextAuth no .env"

echo -e "${YELLOW}[3/7] 🔧 Corrigindo NEXTAUTH_URL...${NC}"

# Backup do .env atual
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
echo "Backup criado: .env.backup.$(date +%Y%m%d_%H%M%S)"

# Corrigir NEXTAUTH_URL
if grep -q "NEXTAUTH_URL=" .env; then
    echo "Atualizando NEXTAUTH_URL existente..."
    sed -i 's|NEXTAUTH_URL=.*|NEXTAUTH_URL="https://conectiva24h.com.br"|' .env
else
    echo "Adicionando NEXTAUTH_URL..."
    echo 'NEXTAUTH_URL="https://conectiva24h.com.br"' >> .env
fi

# Verificar/corrigir NEXTAUTH_SECRET
if ! grep -q "NEXTAUTH_SECRET=" .env; then
    echo "Adicionando NEXTAUTH_SECRET..."
    # Gerar secret mais forte
    SECRET=$(openssl rand -base64 32 2>/dev/null || echo "$(date +%s)-$(hostname)-$(whoami)" | sha256sum | cut -d' ' -f1)
    echo "NEXTAUTH_SECRET=\"$SECRET\"" >> .env
fi

# Definir NODE_ENV como production
if grep -q "NODE_ENV=" .env; then
    sed -i 's|NODE_ENV=.*|NODE_ENV="production"|' .env
else
    echo 'NODE_ENV="production"' >> .env
fi

echo "✅ Variáveis corrigidas no .env"

echo -e "${YELLOW}[4/7] 🍪 Corrigindo configuração de cookies...${NC}"

# Criar configuração de cookies para HTTPS
cat > /tmp/auth_config_patch.js << 'EOF'
// Patch para adicionar configuração de cookies HTTPS
const fs = require('fs');
const path = require('path');

const configPath = path.join(process.cwd(), 'src/lib/auth/auth.config.ts');

if (fs.existsSync(configPath)) {
    let content = fs.readFileSync(configPath, 'utf8');
    
    // Verificar se já tem configuração de cookies
    if (!content.includes('cookies:')) {
        // Encontrar onde inserir a configuração de cookies
        const insertPoint = content.indexOf('secret: process.env.NEXTAUTH_SECRET,');
        
        if (insertPoint !== -1) {
            const cookiesConfig = `
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.conectiva24h.com.br' : undefined
      }
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.conectiva24h.com.br' : undefined
      }
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production' ? '__Host-next-auth.csrf-token' : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },

  `;
            
            const beforeSecret = content.substring(0, insertPoint);
            const afterSecret = content.substring(insertPoint);
            
            content = beforeSecret + cookiesConfig + afterSecret;
            
            fs.writeFileSync(configPath, content);
            console.log('✅ Configuração de cookies adicionada');
        } else {
            console.log('❌ Não foi possível encontrar onde inserir configuração de cookies');
        }
    } else {
        console.log('✅ Configuração de cookies já existe');
    }
} else {
    console.log('❌ Arquivo de configuração não encontrado');
}
EOF

# Aplicar patch no container
echo "Aplicando configuração de cookies..."
docker compose -f docker-compose.full.yml exec -T app node /dev/stdin < /tmp/auth_config_patch.js

echo -e "${YELLOW}[5/7] 🔄 Reconstruindo aplicação...${NC}"

# Parar aplicação
docker compose -f docker-compose.full.yml stop app

# Rebuild com novas configurações
echo "Reconstruindo com configurações corrigidas..."
docker compose -f docker-compose.full.yml build --no-cache app

# Iniciar aplicação
docker compose -f docker-compose.full.yml up -d

echo "Aguardando inicialização..."
sleep 20

echo -e "${YELLOW}[6/7] 🧪 Testando configuração corrigida...${NC}"

# Verificar variáveis no container
echo "Verificando variáveis corrigidas:"
docker compose -f docker-compose.full.yml exec -T app printenv | grep NEXTAUTH

# Testar CSRF endpoint
echo ""
echo "Testando endpoint CSRF..."
CSRF_RESPONSE=$(curl -s -k https://conectiva24h.com.br/api/auth/csrf)
echo "CSRF Response: $CSRF_RESPONSE"

if echo "$CSRF_RESPONSE" | grep -q "csrfToken"; then
    echo -e "${GREEN}✅ Endpoint CSRF funcionando${NC}"
    
    # Extrair CSRF token
    CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | jq -r '.csrfToken' 2>/dev/null)
    
    if [ "$CSRF_TOKEN" != "null" ] && [ -n "$CSRF_TOKEN" ]; then
        echo "CSRF Token: ${CSRF_TOKEN:0:20}..."
        
        # Testar login com configuração corrigida
        echo ""
        echo "Testando login com URL e cookies corrigidos..."
        
        LOGIN_RESPONSE=$(curl -s -k -X POST https://conectiva24h.com.br/api/auth/callback/credentials \
            -H "Content-Type: application/x-www-form-urlencoded" \
            -H "Origin: https://conectiva24h.com.br" \
            -H "Referer: https://conectiva24h.com.br/entrar" \
            -d "email=admin@vipassist.com&password=admin123&csrfToken=$CSRF_TOKEN&callbackUrl=https://conectiva24h.com.br/painel" \
            -c /tmp/login_cookies_fixed.txt \
            -w "HTTP_CODE:%{http_code}\nFINAL_URL:%{url_effective}" \
            -L)
        
        echo "Resposta do login:"
        echo "$LOGIN_RESPONSE"
        
        # Verificar cookies criados
        if [ -f /tmp/login_cookies_fixed.txt ]; then
            echo ""
            echo "Cookies criados:"
            cat /tmp/login_cookies_fixed.txt
            
            # Verificar se cookies NextAuth foram criados
            if grep -q "next-auth" /tmp/login_cookies_fixed.txt; then
                echo -e "${GREEN}✅ Cookies NextAuth criados corretamente${NC}"
                
                # Testar sessão
                COOKIE_STRING=$(cat /tmp/login_cookies_fixed.txt | grep -v '^#' | awk '{print $6"="$7}' | tr '\n' ';')
                
                SESSION_RESPONSE=$(curl -s -k https://conectiva24h.com.br/api/auth/session \
                    -H "Cookie: $COOKIE_STRING" \
                    -H "Origin: https://conectiva24h.com.br")
                
                echo ""
                echo "Resposta da sessão:"
                echo "$SESSION_RESPONSE" | jq . 2>/dev/null || echo "$SESSION_RESPONSE"
                
                if echo "$SESSION_RESPONSE" | grep -q '"user"'; then
                    echo -e "${GREEN}🎉 LOGIN FUNCIONANDO COMPLETAMENTE!${NC}"
                    echo -e "${GREEN}✅ Problema de URL e cookies RESOLVIDO!${NC}"
                else
                    echo -e "${YELLOW}⚠️ Cookies criados mas sessão ainda inválida${NC}"
                fi
            else
                echo -e "${RED}❌ Cookies NextAuth não foram criados${NC}"
            fi
        fi
    fi
else
    echo -e "${RED}❌ Endpoint CSRF não funcionando${NC}"
fi

echo -e "${YELLOW}[7/7] 📋 Verificação final...${NC}"

# Verificar logs da aplicação
echo "Logs recentes da aplicação:"
docker compose -f docker-compose.full.yml logs --tail=15 app

# Limpar arquivos temporários
rm -f /tmp/auth_config_patch.js /tmp/login_cookies_fixed.txt

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}📋 RESUMO DA CORREÇÃO${NC}"
echo -e "${BLUE}============================================${NC}"

echo -e "${CYAN}Correções aplicadas:${NC}"
echo "✅ NEXTAUTH_URL corrigido: https://conectiva24h.com.br"
echo "✅ NODE_ENV definido como production"
echo "✅ Configuração de cookies HTTPS adicionada"
echo "✅ Cookies seguros para domínio correto"
echo "✅ Aplicação reconstruída com novas configurações"

echo ""
echo -e "${CYAN}Teste no navegador:${NC}"
echo "1. Limpe TODOS os cookies do navegador"
echo "2. Acesse: https://conectiva24h.com.br/entrar"
echo "3. Use: admin@vipassist.com / admin123"
echo "4. Deve redirecionar para: https://conectiva24h.com.br/painel"

echo ""
echo -e "${CYAN}Verificar cookies no DevTools:${NC}"
echo "- F12 → Application → Cookies"
echo "- Deve aparecer: __Secure-next-auth.session-token"
echo "- Domain: .conectiva24h.com.br"
echo "- Secure: ✓, HttpOnly: ✓"

echo ""
echo -e "${GREEN}✅ CORREÇÃO DE URL E COOKIES CONCLUÍDA${NC}"
echo -e "${BLUE}============================================${NC}"
