#!/bin/bash

# ============================================
# INVESTIGAÇÃO PROFUNDA DO PROBLEMA DE LOGIN
# VIP ASSIST - Análise detalhada e correções avançadas
# ============================================

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m'

LOG_FILE="/tmp/investigacao-login-$(date +%Y%m%d_%H%M%S).log"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🔍 INVESTIGAÇÃO PROFUNDA - PROBLEMA DE LOGIN${NC}"
echo -e "${BLUE}============================================${NC}"
echo -e "${CYAN}Log detalhado: $LOG_FILE${NC}"
echo ""

# Função para log
log() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.full.yml" ]; then
    log "${RED}❌ Erro: Execute este script no diretório /opt/vipassist${NC}"
    exit 1
fi

# ============================================
# 1. ANÁLISE DETALHADA DO FRONTEND
# ============================================
log "${PURPLE}[1/12] 🌐 ANÁLISE DETALHADA DO FRONTEND${NC}"

# Verificar se a página de login está acessível
log "${YELLOW}Testando acesso à página de login...${NC}"
PAGINA_LOGIN=$(curl -s -k -w "%{http_code}" https://conectiva24h.com.br/entrar -o /dev/null)
log "Status da página de login: $PAGINA_LOGIN"

# Verificar se há erros JavaScript na página
log "${YELLOW}Verificando estrutura da página de login...${NC}"
curl -s -k https://conectiva24h.com.br/entrar | grep -i "error\|erro\|exception" | head -5 | tee -a "$LOG_FILE"

# ============================================
# 2. ANÁLISE DOS LOGS EM TEMPO REAL
# ============================================
log "${PURPLE}[2/12] 📋 ANÁLISE DOS LOGS EM TEMPO REAL${NC}"

log "${YELLOW}Logs da aplicação (últimos 100 linhas):${NC}"
docker compose -f docker-compose.full.yml logs --tail=100 app | tee -a "$LOG_FILE"

log "${YELLOW}Procurando por erros específicos de autenticação:${NC}"
docker compose -f docker-compose.full.yml logs app | grep -i "nextauth\|signin\|session\|credential" | tail -20 | tee -a "$LOG_FILE"

# ============================================
# 3. TESTE DETALHADO DOS ENDPOINTS
# ============================================
log "${PURPLE}[3/12] 🔗 TESTE DETALHADO DOS ENDPOINTS${NC}"

# Testar cada endpoint individualmente
ENDPOINTS=(
    "/api/auth/session"
    "/api/auth/csrf"
    "/api/auth/providers"
    "/api/auth/signin"
    "/api/health"
)

for endpoint in "${ENDPOINTS[@]}"; do
    log "${YELLOW}Testando $endpoint:${NC}"
    RESPONSE=$(curl -s -k -w "Status: %{http_code}\nTime: %{time_total}s\n" "https://conectiva24h.com.br$endpoint")
    echo "$RESPONSE" | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"
done

# ============================================
# 4. VERIFICAÇÃO DETALHADA DO BANCO
# ============================================
log "${PURPLE}[4/12] 🗄️ VERIFICAÇÃO DETALHADA DO BANCO${NC}"

# Verificar se o usuário admin realmente existe e está correto
log "${YELLOW}Verificando usuário admin em detalhes:${NC}"
docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -c "
SELECT 
    id,
    nome,
    email,
    role,
    ativo,
    LENGTH(senha) as senha_length,
    LEFT(senha, 10) as senha_prefix,
    \"createdAt\",
    \"updatedAt\"
FROM \"Usuario\" 
WHERE email = 'admin@vipassist.com';
" | tee -a "$LOG_FILE"

# Verificar se há outros usuários que podem estar interferindo
log "${YELLOW}Verificando todos os usuários:${NC}"
docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -c "
SELECT email, nome, role, ativo FROM \"Usuario\" ORDER BY \"createdAt\";
" | tee -a "$LOG_FILE"

# ============================================
# 5. TESTE DE AUTENTICAÇÃO MANUAL
# ============================================
log "${PURPLE}[5/12] 🔐 TESTE DE AUTENTICAÇÃO MANUAL${NC}"

# Testar hash da senha manualmente
log "${YELLOW}Testando validação de senha manualmente:${NC}"
SENHA_HASH=$(docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -t -c "SELECT senha FROM \"Usuario\" WHERE email = 'admin@vipassist.com';" | tr -d ' \n\r')

docker compose -f docker-compose.full.yml exec -T app node -e "
const bcrypt = require('bcryptjs');
const senhaDigitada = 'admin123';
const hashBanco = '$SENHA_HASH';
console.log('Senha digitada:', senhaDigitada);
console.log('Hash do banco:', hashBanco.substring(0, 20) + '...');
console.log('Validação:', bcrypt.compareSync(senhaDigitada, hashBanco));
" | tee -a "$LOG_FILE"

# ============================================
# 6. VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE
# ============================================
log "${PURPLE}[6/12] 🔧 VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE${NC}"

log "${YELLOW}Verificando variáveis críticas:${NC}"
echo "NEXTAUTH_URL: $(grep NEXTAUTH_URL .env | cut -d'=' -f2-)" | tee -a "$LOG_FILE"
echo "NODE_ENV: $(grep NODE_ENV .env | cut -d'=' -f2-)" | tee -a "$LOG_FILE"

# Verificar se NEXTAUTH_SECRET está definido
if grep -q "NEXTAUTH_SECRET" .env; then
    echo "NEXTAUTH_SECRET: Configurado ($(grep NEXTAUTH_SECRET .env | cut -d'=' -f2- | wc -c) caracteres)" | tee -a "$LOG_FILE"
else
    echo "NEXTAUTH_SECRET: NÃO CONFIGURADO!" | tee -a "$LOG_FILE"
fi

# ============================================
# 7. TESTE DE CONECTIVIDADE INTERNA
# ============================================
log "${PURPLE}[7/12] 🔗 TESTE DE CONECTIVIDADE INTERNA${NC}"

log "${YELLOW}Testando conectividade interna da aplicação:${NC}"
docker compose -f docker-compose.full.yml exec -T app node -e "
console.log('=== TESTE DE CONECTIVIDADE INTERNA ===');
console.log('Node.js version:', process.version);
console.log('Environment:', process.env.NODE_ENV);

// Testar Prisma
try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    prisma.usuario.findFirst({
        where: { email: 'admin@vipassist.com' }
    }).then(user => {
        console.log('Usuário encontrado via Prisma:', user ? 'SIM' : 'NÃO');
        if (user) {
            console.log('Email:', user.email);
            console.log('Role:', user.role);
            console.log('Ativo:', user.ativo);
        }
        process.exit(0);
    }).catch(err => {
        console.error('Erro no Prisma:', err.message);
        process.exit(1);
    });
} catch (err) {
    console.error('Erro ao carregar Prisma:', err.message);
    process.exit(1);
}
" | tee -a "$LOG_FILE"

# ============================================
# 8. ANÁLISE DO NEXTAUTH
# ============================================
log "${PURPLE}[8/12] 🔒 ANÁLISE DO NEXTAUTH${NC}"

log "${YELLOW}Verificando configuração do NextAuth:${NC}"
docker compose -f docker-compose.full.yml exec -T app node -e "
console.log('=== ANÁLISE DO NEXTAUTH ===');

try {
    // Verificar se NextAuth está carregando
    const NextAuth = require('next-auth');
    console.log('NextAuth carregado:', typeof NextAuth);
    
    // Verificar bcrypt
    const bcrypt = require('bcryptjs');
    console.log('bcrypt carregado:', typeof bcrypt);
    
    // Testar hash
    const testHash = bcrypt.hashSync('test', 10);
    console.log('bcrypt funcionando:', bcrypt.compareSync('test', testHash));
    
} catch (err) {
    console.error('Erro:', err.message);
}
" | tee -a "$LOG_FILE"

# ============================================
# 9. TESTE DE LOGIN COMPLETO COM DEBUG
# ============================================
log "${PURPLE}[9/12] 🧪 TESTE DE LOGIN COMPLETO COM DEBUG${NC}"

# Obter CSRF token
log "${YELLOW}Obtendo CSRF token:${NC}"
CSRF_RESPONSE=$(curl -s -k https://conectiva24h.com.br/api/auth/csrf)
echo "Resposta CSRF: $CSRF_RESPONSE" | tee -a "$LOG_FILE"

CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | jq -r '.csrfToken' 2>/dev/null)
if [ "$CSRF_TOKEN" != "null" ] && [ -n "$CSRF_TOKEN" ]; then
    log "${GREEN}CSRF Token obtido: ${CSRF_TOKEN:0:20}...${NC}"
    
    # Fazer login com debug completo
    log "${YELLOW}Fazendo login com debug completo:${NC}"
    curl -s -k -X POST https://conectiva24h.com.br/api/auth/callback/credentials \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -H "Accept: application/json" \
        -d "email=admin@vipassist.com&password=admin123&csrfToken=$CSRF_TOKEN&json=true" \
        -v -c /tmp/debug_cookies.txt -D /tmp/debug_headers.txt 2>&1 | tee -a "$LOG_FILE"
    
    log "${YELLOW}Headers da resposta:${NC}"
    cat /tmp/debug_headers.txt | tee -a "$LOG_FILE"
    
    log "${YELLOW}Cookies criados:${NC}"
    cat /tmp/debug_cookies.txt | tee -a "$LOG_FILE"
else
    log "${RED}❌ Não foi possível obter CSRF token${NC}"
fi

# ============================================
# 10. VERIFICAÇÃO DE MIDDLEWARE
# ============================================
log "${PURPLE}[10/12] 🛡️ VERIFICAÇÃO DE MIDDLEWARE${NC}"

log "${YELLOW}Analisando middleware:${NC}"
if [ -f "middleware.ts" ]; then
    echo "Middleware existe. Conteúdo:" | tee -a "$LOG_FILE"
    cat middleware.ts | tee -a "$LOG_FILE"
else
    echo "Middleware não encontrado!" | tee -a "$LOG_FILE"
fi

# ============================================
# 11. CORREÇÕES AVANÇADAS
# ============================================
log "${PURPLE}[11/12] 🔧 APLICANDO CORREÇÕES AVANÇADAS${NC}"

# Regenerar senha com salt mais forte
log "${YELLOW}Regenerando senha com configurações avançadas:${NC}"
NOVO_HASH_AVANCADO=$(docker compose -f docker-compose.full.yml exec -T app node -e "
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(12);
const hash = bcrypt.hashSync('admin123', salt);
console.log(hash);
")

log "Novo hash gerado: ${NOVO_HASH_AVANCADO:0:20}..."

# Atualizar no banco
docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -c "
UPDATE \"Usuario\" 
SET 
    senha = '$NOVO_HASH_AVANCADO',
    \"updatedAt\" = NOW(),
    ativo = true,
    role = 'admin'
WHERE email = 'admin@vipassist.com';
" | tee -a "$LOG_FILE"

# Limpar possíveis sessões antigas
log "${YELLOW}Limpando cache e sessões:${NC}"
docker compose -f docker-compose.full.yml restart app

# Aguardar reinicialização
log "${YELLOW}Aguardando reinicialização da aplicação...${NC}"
sleep 15

# ============================================
# 12. TESTE FINAL AVANÇADO
# ============================================
log "${PURPLE}[12/12] 🎯 TESTE FINAL AVANÇADO${NC}"

# Testar novamente após correções
log "${YELLOW}Testando login após correções avançadas:${NC}"

# Novo CSRF token
CSRF_TOKEN_NOVO=$(curl -s -k https://conectiva24h.com.br/api/auth/csrf | jq -r '.csrfToken' 2>/dev/null)

if [ "$CSRF_TOKEN_NOVO" != "null" ] && [ -n "$CSRF_TOKEN_NOVO" ]; then
    # Teste de login final
    LOGIN_FINAL=$(curl -s -k -X POST https://conectiva24h.com.br/api/auth/callback/credentials \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "email=admin@vipassist.com&password=admin123&csrfToken=$CSRF_TOKEN_NOVO&callbackUrl=https://conectiva24h.com.br/painel" \
        -w "HTTP_CODE:%{http_code}" \
        -c /tmp/final_cookies.txt \
        -L)
    
    log "Resultado do login final: $LOGIN_FINAL"
    
    # Verificar se criou sessão válida
    if [ -f /tmp/final_cookies.txt ]; then
        COOKIE_STRING=$(cat /tmp/final_cookies.txt | grep -v '^#' | awk '{print $6"="$7}' | tr '\n' ';')
        
        SESSION_FINAL=$(curl -s -k https://conectiva24h.com.br/api/auth/session \
            -H "Cookie: $COOKIE_STRING")
        
        log "${YELLOW}Sessão final:${NC}"
        echo "$SESSION_FINAL" | jq . 2>/dev/null || echo "$SESSION_FINAL" | tee -a "$LOG_FILE"
        
        if echo "$SESSION_FINAL" | grep -q '"user"'; then
            log "${GREEN}✅ LOGIN FUNCIONANDO APÓS CORREÇÕES AVANÇADAS!${NC}"
        else
            log "${RED}❌ Login ainda não está funcionando${NC}"
        fi
    fi
fi

# ============================================
# RESUMO E PRÓXIMOS PASSOS
# ============================================
log ""
log "${BLUE}============================================${NC}"
log "${BLUE}📊 RESUMO DA INVESTIGAÇÃO${NC}"
log "${BLUE}============================================${NC}"

log "${YELLOW}Próximos passos se ainda não funcionar:${NC}"
log "1. Verificar console do navegador (F12) para erros JavaScript"
log "2. Limpar completamente cookies e cache do navegador"
log "3. Testar em modo anônimo/privado"
log "4. Verificar se há bloqueadores de anúncios interferindo"
log "5. Testar com credenciais diferentes"

log ""
log "${CYAN}Log completo salvo em: $LOG_FILE${NC}"
log "${BLUE}============================================${NC}"

# Limpar arquivos temporários
rm -f /tmp/debug_cookies.txt /tmp/debug_headers.txt /tmp/final_cookies.txt
