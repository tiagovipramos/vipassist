#!/bin/bash

# ============================================
# Script de Diagnóstico de Login
# VIP ASSIST - conectiva24h.com.br
# ============================================

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}DIAGNÓSTICO DE LOGIN - VIP ASSIST${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# 1. Verificar variáveis de ambiente
echo -e "${YELLOW}[1/10] Verificando variáveis de ambiente...${NC}"
cd /opt/vipassist

echo -e "${GREEN}NEXTAUTH_URL:${NC}"
grep "NEXTAUTH_URL" .env || echo -e "${RED}❌ NEXTAUTH_URL não encontrado!${NC}"

echo -e "${GREEN}NEXTAUTH_SECRET:${NC}"
if grep -q "NEXTAUTH_SECRET" .env; then
    echo "✓ NEXTAUTH_SECRET configurado"
else
    echo -e "${RED}❌ NEXTAUTH_SECRET não encontrado!${NC}"
fi

echo -e "${GREEN}DATABASE_URL:${NC}"
if grep -q "DATABASE_URL" .env; then
    echo "✓ DATABASE_URL configurado"
else
    echo -e "${RED}❌ DATABASE_URL não encontrado!${NC}"
fi
echo ""

# 2. Verificar containers
echo -e "${YELLOW}[2/10] Verificando containers Docker...${NC}"
docker compose -f docker-compose.full.yml ps
echo ""

# 3. Verificar conexão com banco de dados
echo -e "${YELLOW}[3/10] Testando conexão com PostgreSQL...${NC}"
docker compose -f docker-compose.full.yml exec -T postgres pg_isready -U vipassist
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ PostgreSQL está respondendo${NC}"
else
    echo -e "${RED}❌ PostgreSQL não está respondendo!${NC}"
fi
echo ""

# 4. Verificar tabela de usuários
echo -e "${YELLOW}[4/10] Verificando tabela de usuários...${NC}"
docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -c "\dt" | grep -i usuario
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Tabela de usuários existe${NC}"
    
    # Contar usuários
    echo -e "${GREEN}Contando usuários:${NC}"
    docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -c "SELECT COUNT(*) as total_usuarios FROM \"Usuario\";"
    
    # Verificar usuário admin
    echo -e "${GREEN}Verificando usuário admin:${NC}"
    docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -c "SELECT email, nome, role FROM \"Usuario\" WHERE email = 'admin@vipassist.com';"
else
    echo -e "${RED}❌ Tabela de usuários não encontrada!${NC}"
fi
echo ""

# 5. Verificar logs da aplicação
echo -e "${YELLOW}[5/10] Verificando logs da aplicação (últimas 20 linhas)...${NC}"
docker compose -f docker-compose.full.yml logs --tail=20 app
echo ""

# 6. Testar endpoint de autenticação
echo -e "${YELLOW}[6/10] Testando endpoint /api/auth/session...${NC}"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://localhost/api/auth/session -k)
echo "Status Code: $RESPONSE"
if [ "$RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ Endpoint respondendo${NC}"
else
    echo -e "${RED}❌ Endpoint com problema (código: $RESPONSE)${NC}"
fi
echo ""

# 7. Testar endpoint de providers
echo -e "${YELLOW}[7/10] Testando endpoint /api/auth/providers...${NC}"
curl -s https://localhost/api/auth/providers -k | jq . || echo "Resposta não é JSON válido"
echo ""

# 8. Verificar configuração do NextAuth
echo -e "${YELLOW}[8/10] Verificando arquivo de configuração do NextAuth...${NC}"
if [ -f "src/app/api/auth/[...nextauth]/route.ts" ]; then
    echo -e "${GREEN}✓ Arquivo de configuração existe${NC}"
    echo "Verificando providers configurados:"
    grep -A 5 "providers:" src/app/api/auth/[...nextauth]/route.ts | head -10
else
    echo -e "${RED}❌ Arquivo de configuração não encontrado!${NC}"
fi
echo ""

# 9. Verificar cookies e sessão
echo -e "${YELLOW}[9/10] Testando criação de sessão...${NC}"
echo "Fazendo requisição de login de teste..."
CSRF_TOKEN=$(curl -s https://localhost/api/auth/csrf -k | jq -r '.csrfToken')
echo "CSRF Token obtido: ${CSRF_TOKEN:0:20}..."

LOGIN_RESPONSE=$(curl -s -X POST https://localhost/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@vipassist.com\",\"password\":\"admin123\",\"csrfToken\":\"$CSRF_TOKEN\"}" \
  -k -i)

echo "Resposta do login:"
echo "$LOGIN_RESPONSE" | head -20
echo ""

# 10. Verificar middleware
echo -e "${YELLOW}[10/10] Verificando middleware...${NC}"
if [ -f "middleware.ts" ]; then
    echo -e "${GREEN}✓ Middleware existe${NC}"
    echo "Rotas protegidas:"
    grep -A 10 "matcher" middleware.ts || echo "Matcher não encontrado"
else
    echo -e "${RED}❌ Middleware não encontrado!${NC}"
fi
echo ""

# Resumo
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}RESUMO DO DIAGNÓSTICO${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Verificações críticas
CRITICAL_ISSUES=0

# Check NEXTAUTH_URL
if ! grep -q "NEXTAUTH_URL=https://conectiva24h.com.br" .env; then
    echo -e "${RED}❌ NEXTAUTH_URL não está configurado corretamente${NC}"
    ((CRITICAL_ISSUES++))
fi

# Check NEXTAUTH_SECRET
if ! grep -q "NEXTAUTH_SECRET" .env; then
    echo -e "${RED}❌ NEXTAUTH_SECRET não está configurado${NC}"
    ((CRITICAL_ISSUES++))
fi

# Check containers
if ! docker compose -f docker-compose.full.yml ps | grep -q "Up"; then
    echo -e "${RED}❌ Containers não estão rodando${NC}"
    ((CRITICAL_ISSUES++))
fi

if [ $CRITICAL_ISSUES -eq 0 ]; then
    echo -e "${GREEN}✓ Nenhum problema crítico encontrado${NC}"
    echo ""
    echo -e "${YELLOW}Possíveis causas do problema de login:${NC}"
    echo "1. Cookies não estão sendo aceitos pelo navegador"
    echo "2. Senha incorreta (tente: admin123)"
    echo "3. Problema de CORS ou SameSite cookies"
    echo "4. Cache do navegador"
    echo ""
    echo -e "${YELLOW}Soluções recomendadas:${NC}"
    echo "1. Limpar cookies do navegador para conectiva24h.com.br"
    echo "2. Tentar em modo anônimo/privado"
    echo "3. Verificar console do navegador (F12) para erros"
    echo "4. Tentar com outro navegador"
else
    echo -e "${RED}❌ Encontrados $CRITICAL_ISSUES problemas críticos${NC}"
    echo "Corrija os problemas acima e tente novamente"
fi

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}Diagnóstico concluído!${NC}"
echo -e "${BLUE}============================================${NC}"
