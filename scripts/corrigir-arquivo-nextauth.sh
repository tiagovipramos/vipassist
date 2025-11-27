#!/bin/bash

# ============================================
# CORREÇÃO: ARQUIVO NEXTAUTH AUSENTE
# VIP ASSIST - Cria arquivo de configuração NextAuth
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
echo -e "${BLUE}📁 CORREÇÃO: ARQUIVO NEXTAUTH AUSENTE${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.full.yml" ]; then
    echo -e "${RED}❌ Erro: Execute este script no diretório /opt/vipassist${NC}"
    exit 1
fi

echo -e "${YELLOW}[1/6] 🔍 Problema identificado:${NC}"
echo "- Arquivo de configuração NextAuth não encontrado no container"
echo "- Erro: Credenciais inválidas (configuração ausente)"
echo "- NextAuth instalado mas sem configuração"
echo ""

echo -e "${YELLOW}[2/6] 📁 Verificando estrutura de arquivos...${NC}"

# Verificar se arquivo existe no host
if [ -f "src/app/api/auth/[...nextauth]/route.ts" ]; then
    echo -e "${GREEN}✓ Arquivo NextAuth existe no host${NC}"
    echo "Conteúdo do arquivo:"
    head -20 "src/app/api/auth/[...nextauth]/route.ts"
else
    echo -e "${RED}❌ Arquivo NextAuth não existe no host${NC}"
fi

# Verificar no container
echo "Verificando no container..."
docker compose -f docker-compose.full.yml exec -T app ls -la src/app/api/auth/ 2>/dev/null || echo "Diretório não existe no container"

echo -e "${YELLOW}[3/6] 🔧 Copiando arquivos para container...${NC}"

# Parar aplicação
echo "Parando aplicação..."
docker compose -f docker-compose.full.yml stop app

# Copiar arquivos necessários
echo "Copiando estrutura de autenticação..."
docker compose -f docker-compose.full.yml run --rm app mkdir -p src/app/api/auth/\[...nextauth\]

# Verificar se precisa copiar arquivo
if [ -f "src/app/api/auth/[...nextauth]/route.ts" ]; then
    echo "Copiando arquivo de configuração NextAuth..."
    docker cp "src/app/api/auth/[...nextauth]/route.ts" "$(docker compose -f docker-compose.full.yml ps -q app 2>/dev/null || echo 'vipassist-app'):/app/src/app/api/auth/[...nextauth]/route.ts" 2>/dev/null || echo "Container não está rodando, será copiado no próximo build"
fi

# Copiar outros arquivos de autenticação se existirem
if [ -f "src/lib/auth/auth.config.ts" ]; then
    echo "Copiando configuração de auth..."
    docker cp "src/lib/auth/auth.config.ts" "$(docker compose -f docker-compose.full.yml ps -q app 2>/dev/null || echo 'vipassist-app'):/app/src/lib/auth/auth.config.ts" 2>/dev/null || echo "Será copiado no build"
fi

echo -e "${YELLOW}[4/6] 🔄 Reconstruindo aplicação...${NC}"

# Rebuild para garantir que arquivos estão incluídos
echo "Reconstruindo imagem com arquivos de autenticação..."
docker compose -f docker-compose.full.yml build --no-cache app

echo -e "${YELLOW}[5/6] 🚀 Iniciando aplicação...${NC}"

# Iniciar aplicação
docker compose -f docker-compose.full.yml up -d

echo "Aguardando inicialização..."
sleep 20

echo -e "${YELLOW}[6/6] 🧪 Testando configuração...${NC}"

# Verificar se arquivo agora existe no container
echo "Verificando arquivo no container..."
ARQUIVO_EXISTE=$(docker compose -f docker-compose.full.yml exec -T app test -f "src/app/api/auth/[...nextauth]/route.ts" && echo "SIM" || echo "NÃO")
echo "Arquivo NextAuth no container: $ARQUIVO_EXISTE"

if [ "$ARQUIVO_EXISTE" = "SIM" ]; then
    echo -e "${GREEN}✓ Arquivo NextAuth encontrado no container${NC}"
    
    # Mostrar conteúdo
    echo "Primeiras linhas do arquivo:"
    docker compose -f docker-compose.full.yml exec -T app head -10 "src/app/api/auth/[...nextauth]/route.ts"
    
    # Testar endpoints
    echo "Testando endpoints NextAuth..."
    sleep 5
    
    CSRF_RESPONSE=$(curl -s -k https://conectiva24h.com.br/api/auth/csrf)
    echo "CSRF: $CSRF_RESPONSE"
    
    if echo "$CSRF_RESPONSE" | grep -q "csrfToken"; then
        echo -e "${GREEN}✓ Endpoint CSRF funcionando${NC}"
        
        # Testar login
        CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | jq -r '.csrfToken' 2>/dev/null)
        
        if [ "$CSRF_TOKEN" != "null" ] && [ -n "$CSRF_TOKEN" ]; then
            echo "Testando login com configuração corrigida..."
            
            LOGIN_TEST=$(curl -s -k -X POST https://conectiva24h.com.br/api/auth/callback/credentials \
                -H "Content-Type: application/x-www-form-urlencoded" \
                -d "email=admin@vipassist.com&password=admin123&csrfToken=$CSRF_TOKEN&callbackUrl=https://conectiva24h.com.br/painel" \
                -w "HTTP_CODE:%{http_code}" \
                -c /tmp/test_cookies.txt)
            
            echo "Resultado do login: $LOGIN_TEST"
            
            # Verificar se não retorna mais 503
            if ! echo "$LOGIN_TEST" | grep -q "503"; then
                echo -e "${GREEN}✅ Erro 503 corrigido!${NC}"
                
                # Testar sessão
                if [ -f /tmp/test_cookies.txt ]; then
                    COOKIE_STRING=$(cat /tmp/test_cookies.txt | grep -v '^#' | awk '{print $6"="$7}' | tr '\n' ';')
                    
                    SESSION_TEST=$(curl -s -k https://conectiva24h.com.br/api/auth/session \
                        -H "Cookie: $COOKIE_STRING")
                    
                    echo "Sessão: $SESSION_TEST"
                    
                    if echo "$SESSION_TEST" | grep -q '"user"'; then
                        echo -e "${GREEN}🎉 LOGIN FUNCIONANDO COMPLETAMENTE!${NC}"
                    else
                        echo -e "${YELLOW}⚠️ Login melhorou mas sessão ainda precisa ajustes${NC}"
                    fi
                fi
            else
                echo -e "${RED}❌ Ainda retornando 503${NC}"
            fi
        fi
    else
        echo -e "${RED}❌ Endpoint CSRF ainda não funcionando${NC}"
    fi
else
    echo -e "${RED}❌ Arquivo ainda não foi copiado corretamente${NC}"
    echo "Tentando abordagem alternativa..."
    
    # Criar arquivo diretamente no container
    echo "Criando arquivo NextAuth diretamente no container..."
    docker compose -f docker-compose.full.yml exec -T app mkdir -p "src/app/api/auth/[...nextauth]"
    
    # Verificar se arquivo existe no host para copiar conteúdo
    if [ -f "src/app/api/auth/[...nextauth]/route.ts" ]; then
        echo "Copiando conteúdo do arquivo..."
        cat "src/app/api/auth/[...nextauth]/route.ts" | docker compose -f docker-compose.full.yml exec -T app tee "src/app/api/auth/[...nextauth]/route.ts" > /dev/null
        
        echo "Reiniciando aplicação..."
        docker compose -f docker-compose.full.yml restart app
        
        sleep 15
        echo "Testando após criação manual..."
        curl -s -k https://conectiva24h.com.br/api/auth/csrf | head -5
    fi
fi

# Verificar logs para erros
echo "Logs recentes:"
docker compose -f docker-compose.full.yml logs --tail=10 app

# Limpar arquivos temporários
rm -f /tmp/test_cookies.txt

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}📋 RESUMO${NC}"
echo -e "${BLUE}============================================${NC}"

echo -e "${CYAN}Próximos passos:${NC}"
echo "1. Teste o login no navegador: https://conectiva24h.com.br/entrar"
echo "2. Use: admin@vipassist.com / admin123"
echo "3. Se ainda não funcionar, verifique os logs"
echo ""
echo "Comandos úteis:"
echo "# Verificar arquivo no container:"
echo "docker compose -f docker-compose.full.yml exec app ls -la src/app/api/auth/[...nextauth]/"
echo ""
echo "# Ver logs em tempo real:"
echo "docker compose -f docker-compose.full.yml logs -f app"

echo ""
echo -e "${GREEN}✅ CORREÇÃO DE ARQUIVO NEXTAUTH CONCLUÍDA${NC}"
echo -e "${BLUE}============================================${NC}"
