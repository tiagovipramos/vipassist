#!/bin/bash

# ============================================
# SCRIPT COMPLETO DE DEBUG DE LOGIN
# VIP ASSIST - Sistema de Diagnóstico Avançado
# ============================================

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Variáveis
LOG_FILE="/tmp/debug-login-$(date +%Y%m%d_%H%M%S).log"
DOMAIN="conectiva24h.com.br"
APP_DIR="/opt/vipassist"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🔍 DEBUG COMPLETO DE LOGIN - VIP ASSIST${NC}"
echo -e "${BLUE}============================================${NC}"
echo -e "${CYAN}Log será salvo em: $LOG_FILE${NC}"
echo ""

# Função para log
log() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

# Função para executar comando e logar
run_cmd() {
    local cmd="$1"
    local desc="$2"
    log "${YELLOW}Executando: $desc${NC}"
    log "${CYAN}Comando: $cmd${NC}"
    eval "$cmd" 2>&1 | tee -a "$LOG_FILE"
    log ""
}

# Navegar para diretório da aplicação
cd "$APP_DIR" || {
    log "${RED}❌ Erro: Não foi possível acessar $APP_DIR${NC}"
    exit 1
}

log "${GREEN}📍 Diretório atual: $(pwd)${NC}"
log ""

# ============================================
# 1. VERIFICAÇÕES DE AMBIENTE
# ============================================
log "${PURPLE}[1/15] 🔧 VERIFICAÇÕES DE AMBIENTE${NC}"

# Verificar se está em produção
log "${YELLOW}NODE_ENV:${NC}"
grep "NODE_ENV" .env || log "${RED}NODE_ENV não definido${NC}"

# Verificar todas as variáveis críticas
log "${YELLOW}Variáveis críticas do NextAuth:${NC}"
for var in NEXTAUTH_URL NEXTAUTH_SECRET DATABASE_URL; do
    if grep -q "^$var=" .env; then
        if [ "$var" = "NEXTAUTH_SECRET" ]; then
            log "${GREEN}✓ $var está configurado (oculto por segurança)${NC}"
        else
            log "${GREEN}✓ $var:${NC} $(grep "^$var=" .env | cut -d'=' -f2-)"
        fi
    else
        log "${RED}❌ $var não encontrado!${NC}"
    fi
done
log ""

# ============================================
# 2. STATUS DOS CONTAINERS
# ============================================
log "${PURPLE}[2/15] 🐳 STATUS DOS CONTAINERS${NC}"
run_cmd "docker compose -f docker-compose.full.yml ps" "Status dos containers"

# Verificar se todos os containers estão UP
CONTAINERS_DOWN=$(docker compose -f docker-compose.full.yml ps --format "table {{.Name}}\t{{.Status}}" | grep -v "Up" | wc -l)
if [ "$CONTAINERS_DOWN" -gt 1 ]; then
    log "${RED}❌ Alguns containers não estão rodando!${NC}"
    run_cmd "docker compose -f docker-compose.full.yml up -d" "Tentando subir containers"
else
    log "${GREEN}✓ Todos os containers estão rodando${NC}"
fi
log ""

# ============================================
# 3. TESTE DE CONECTIVIDADE DO BANCO
# ============================================
log "${PURPLE}[3/15] 🗄️ TESTE DE CONECTIVIDADE DO BANCO${NC}"
run_cmd "docker compose -f docker-compose.full.yml exec -T postgres pg_isready -U vipassist" "Teste de conectividade PostgreSQL"

# Testar conexão com query simples
run_cmd "docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -c 'SELECT version();'" "Versão do PostgreSQL"
log ""

# ============================================
# 4. VERIFICAÇÃO DA ESTRUTURA DO BANCO
# ============================================
log "${PURPLE}[4/15] 🏗️ VERIFICAÇÃO DA ESTRUTURA DO BANCO${NC}"

# Listar tabelas
run_cmd "docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -c '\dt'" "Listando tabelas"

# Verificar estrutura da tabela Usuario
run_cmd "docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -c '\d \"Usuario\"'" "Estrutura da tabela Usuario"

# Contar usuários
run_cmd "docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -c 'SELECT COUNT(*) as total_usuarios FROM \"Usuario\";'" "Total de usuários"

# Verificar usuários ativos
run_cmd "docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -c 'SELECT email, nome, role, ativo FROM \"Usuario\" LIMIT 5;'" "Primeiros 5 usuários"
log ""

# ============================================
# 5. TESTE ESPECÍFICO DO USUÁRIO ADMIN
# ============================================
log "${PURPLE}[5/15] 👤 TESTE ESPECÍFICO DO USUÁRIO ADMIN${NC}"

# Verificar se usuário admin existe
ADMIN_EXISTS=$(docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -t -c "SELECT COUNT(*) FROM \"Usuario\" WHERE email = 'admin@vipassist.com';" | tr -d ' ')

if [ "$ADMIN_EXISTS" -eq 1 ]; then
    log "${GREEN}✓ Usuário admin existe${NC}"
    
    # Verificar detalhes do admin
    run_cmd "docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -c \"SELECT email, nome, role, ativo, LENGTH(senha) as senha_length, LEFT(senha, 7) as senha_prefix FROM \\\"Usuario\\\" WHERE email = 'admin@vipassist.com';\"" "Detalhes do usuário admin"
    
    # Verificar se a senha está hasheada corretamente
    SENHA_PREFIX=$(docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -t -c "SELECT LEFT(senha, 7) FROM \"Usuario\" WHERE email = 'admin@vipassist.com';" | tr -d ' ')
    if [[ "$SENHA_PREFIX" == "\$2b\$10\$" ]] || [[ "$SENHA_PREFIX" == "\$2a\$10\$" ]]; then
        log "${GREEN}✓ Senha está hasheada corretamente (bcrypt)${NC}"
    else
        log "${RED}❌ Senha não parece estar hasheada corretamente!${NC}"
        log "${YELLOW}Prefixo encontrado: $SENHA_PREFIX${NC}"
    fi
else
    log "${RED}❌ Usuário admin não existe!${NC}"
    log "${YELLOW}Criando usuário admin...${NC}"
    
    # Criar usuário admin
    HASHED_PASSWORD=$(node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin123', 10));")
    run_cmd "docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -c \"INSERT INTO \\\"Usuario\\\" (id, nome, email, senha, role, ativo, \\\"createdAt\\\", \\\"updatedAt\\\") VALUES (gen_random_uuid(), 'Administrador', 'admin@vipassist.com', '$HASHED_PASSWORD', 'ADMIN', true, NOW(), NOW()) ON CONFLICT (email) DO NOTHING;\"" "Criando usuário admin"
fi
log ""

# ============================================
# 6. LOGS DA APLICAÇÃO
# ============================================
log "${PURPLE}[6/15] 📋 LOGS DA APLICAÇÃO${NC}"
run_cmd "docker compose -f docker-compose.full.yml logs --tail=50 app" "Últimos 50 logs da aplicação"
log ""

# ============================================
# 7. TESTE DOS ENDPOINTS DE AUTENTICAÇÃO
# ============================================
log "${PURPLE}[7/15] 🌐 TESTE DOS ENDPOINTS DE AUTENTICAÇÃO${NC}"

# Testar endpoint de saúde
run_cmd "curl -s -k -w 'Status: %{http_code}\nTime: %{time_total}s\n' https://$DOMAIN/api/health" "Endpoint de saúde"

# Testar endpoint de sessão
run_cmd "curl -s -k -w 'Status: %{http_code}\nTime: %{time_total}s\n' https://$DOMAIN/api/auth/session" "Endpoint de sessão"

# Testar endpoint de providers
run_cmd "curl -s -k https://$DOMAIN/api/auth/providers | jq ." "Endpoint de providers"

# Testar endpoint de CSRF
run_cmd "curl -s -k https://$DOMAIN/api/auth/csrf | jq ." "Endpoint de CSRF"
log ""

# ============================================
# 8. TESTE DE LOGIN SIMULADO
# ============================================
log "${PURPLE}[8/15] 🔐 TESTE DE LOGIN SIMULADO${NC}"

# Obter CSRF token
CSRF_TOKEN=$(curl -s -k https://$DOMAIN/api/auth/csrf | jq -r '.csrfToken' 2>/dev/null)
if [ "$CSRF_TOKEN" != "null" ] && [ -n "$CSRF_TOKEN" ]; then
    log "${GREEN}✓ CSRF Token obtido: ${CSRF_TOKEN:0:20}...${NC}"
    
    # Tentar fazer login
    log "${YELLOW}Tentando login com admin@vipassist.com...${NC}"
    LOGIN_RESPONSE=$(curl -s -k -X POST https://$DOMAIN/api/auth/callback/credentials \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "email=admin@vipassist.com&password=admin123&csrfToken=$CSRF_TOKEN" \
        -w "HTTP_CODE:%{http_code}" \
        -c /tmp/cookies.txt)
    
    log "${CYAN}Resposta do login:${NC}"
    echo "$LOGIN_RESPONSE" | tee -a "$LOG_FILE"
    
    # Verificar cookies
    if [ -f /tmp/cookies.txt ]; then
        log "${YELLOW}Cookies criados:${NC}"
        cat /tmp/cookies.txt | tee -a "$LOG_FILE"
    fi
else
    log "${RED}❌ Não foi possível obter CSRF token${NC}"
fi
log ""

# ============================================
# 9. VERIFICAÇÃO DE ARQUIVOS CRÍTICOS
# ============================================
log "${PURPLE}[9/15] 📁 VERIFICAÇÃO DE ARQUIVOS CRÍTICOS${NC}"

CRITICAL_FILES=(
    "src/app/api/auth/[...nextauth]/route.ts"
    "src/lib/auth/auth.config.ts"
    "src/stores/authStore.ts"
    "src/app/(publico)/entrar/page.tsx"
    "middleware.ts"
    ".env"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        log "${GREEN}✓ $file existe${NC}"
    else
        log "${RED}❌ $file não encontrado!${NC}"
    fi
done
log ""

# ============================================
# 10. VERIFICAÇÃO DO MIDDLEWARE
# ============================================
log "${PURPLE}[10/15] 🛡️ VERIFICAÇÃO DO MIDDLEWARE${NC}"
if [ -f "middleware.ts" ]; then
    log "${GREEN}✓ Middleware existe${NC}"
    log "${YELLOW}Conteúdo do matcher:${NC}"
    grep -A 10 -B 2 "matcher" middleware.ts | tee -a "$LOG_FILE"
else
    log "${RED}❌ Middleware não encontrado!${NC}"
fi
log ""

# ============================================
# 11. VERIFICAÇÃO DE DEPENDÊNCIAS
# ============================================
log "${PURPLE}[11/15] 📦 VERIFICAÇÃO DE DEPENDÊNCIAS${NC}"
run_cmd "docker compose -f docker-compose.full.yml exec -T app npm list next-auth bcryptjs @prisma/client" "Dependências críticas"
log ""

# ============================================
# 12. TESTE DE CONECTIVIDADE INTERNA
# ============================================
log "${PURPLE}[12/15] 🔗 TESTE DE CONECTIVIDADE INTERNA${NC}"

# Testar se a aplicação consegue acessar o banco internamente
run_cmd "docker compose -f docker-compose.full.yml exec -T app node -e \"
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.usuario.count().then(count => {
    console.log('Usuários no banco:', count);
    process.exit(0);
}).catch(err => {
    console.error('Erro ao conectar:', err.message);
    process.exit(1);
});
\"" "Teste de conexão Prisma"
log ""

# ============================================
# 13. VERIFICAÇÃO DE LOGS DE ERRO
# ============================================
log "${PURPLE}[13/15] 🚨 VERIFICAÇÃO DE LOGS DE ERRO${NC}"

# Procurar por erros nos logs
run_cmd "docker compose -f docker-compose.full.yml logs app | grep -i error | tail -20" "Erros nos logs da aplicação"

# Procurar por erros de autenticação
run_cmd "docker compose -f docker-compose.full.yml logs app | grep -i 'auth\\|login\\|session' | tail -20" "Logs relacionados à autenticação"
log ""

# ============================================
# 14. TESTE DE HASH DE SENHA
# ============================================
log "${PURPLE}[14/15] 🔑 TESTE DE HASH DE SENHA${NC}"

# Testar se o bcrypt está funcionando
run_cmd "docker compose -f docker-compose.full.yml exec -T app node -e \"
const bcrypt = require('bcryptjs');
const senha = 'admin123';
const hash = bcrypt.hashSync(senha, 10);
console.log('Hash gerado:', hash);
console.log('Verificação:', bcrypt.compareSync(senha, hash));
\"" "Teste de hash bcrypt"
log ""

# ============================================
# 15. TESTE FINAL E RECOMENDAÇÕES
# ============================================
log "${PURPLE}[15/15] 🎯 TESTE FINAL E RECOMENDAÇÕES${NC}"

# Fazer um teste completo de login via API
log "${YELLOW}Fazendo teste completo de autenticação...${NC}"

# Primeiro, obter um novo CSRF token
CSRF_TOKEN=$(curl -s -k https://$DOMAIN/api/auth/csrf | jq -r '.csrfToken' 2>/dev/null)

if [ "$CSRF_TOKEN" != "null" ] && [ -n "$CSRF_TOKEN" ]; then
    # Tentar autenticação completa
    curl -s -k -X POST https://$DOMAIN/api/auth/callback/credentials \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "email=admin@vipassist.com&password=admin123&csrfToken=$CSRF_TOKEN&callbackUrl=https://$DOMAIN/painel" \
        -c /tmp/final_cookies.txt \
        -D /tmp/final_headers.txt \
        -L > /tmp/final_response.txt
    
    log "${YELLOW}Headers da resposta:${NC}"
    cat /tmp/final_headers.txt | tee -a "$LOG_FILE"
    
    log "${YELLOW}Cookies finais:${NC}"
    cat /tmp/final_cookies.txt | tee -a "$LOG_FILE"
    
    # Verificar se foi redirecionado
    if grep -q "Location:" /tmp/final_headers.txt; then
        log "${GREEN}✓ Redirecionamento detectado - Login pode estar funcionando${NC}"
    else
        log "${RED}❌ Nenhum redirecionamento - Possível problema no login${NC}"
    fi
fi

# ============================================
# RESUMO E RECOMENDAÇÕES
# ============================================
log ""
log "${BLUE}============================================${NC}"
log "${BLUE}📊 RESUMO E RECOMENDAÇÕES${NC}"
log "${BLUE}============================================${NC}"

# Contar problemas encontrados
PROBLEMS=0

# Verificar problemas críticos
if ! grep -q "NEXTAUTH_URL=https://$DOMAIN" .env; then
    log "${RED}❌ NEXTAUTH_URL não está configurado corretamente${NC}"
    ((PROBLEMS++))
fi

if ! grep -q "NEXTAUTH_SECRET" .env; then
    log "${RED}❌ NEXTAUTH_SECRET não está configurado${NC}"
    ((PROBLEMS++))
fi

if [ "$CONTAINERS_DOWN" -gt 1 ]; then
    log "${RED}❌ Containers não estão rodando${NC}"
    ((PROBLEMS++))
fi

if [ "$ADMIN_EXISTS" -ne 1 ]; then
    log "${RED}❌ Usuário admin não existe${NC}"
    ((PROBLEMS++))
fi

# Recomendações baseadas nos problemas encontrados
log ""
if [ $PROBLEMS -eq 0 ]; then
    log "${GREEN}✅ DIAGNÓSTICO: Nenhum problema crítico encontrado!${NC}"
    log ""
    log "${YELLOW}🔍 POSSÍVEIS CAUSAS DO PROBLEMA DE LOGIN:${NC}"
    log "1. 🍪 Cookies bloqueados pelo navegador"
    log "2. 🔒 Problema de CORS ou SameSite cookies"
    log "3. 💾 Cache do navegador interferindo"
    log "4. 🌐 Problema de rede/proxy"
    log "5. 🔐 Senha incorreta (tente: admin123)"
    log ""
    log "${CYAN}🛠️ SOLUÇÕES RECOMENDADAS:${NC}"
    log "1. Abrir DevTools (F12) e verificar Console e Network"
    log "2. Limpar cookies para $DOMAIN"
    log "3. Tentar em modo anônimo/privado"
    log "4. Verificar se JavaScript está habilitado"
    log "5. Tentar com outro navegador"
    log "6. Verificar se não há bloqueador de anúncios interferindo"
else
    log "${RED}❌ DIAGNÓSTICO: Encontrados $PROBLEMS problemas críticos${NC}"
    log ""
    log "${YELLOW}🔧 AÇÕES NECESSÁRIAS:${NC}"
    log "1. Corrigir as variáveis de ambiente listadas acima"
    log "2. Reiniciar os containers: docker compose -f docker-compose.full.yml restart"
    log "3. Verificar logs: docker compose -f docker-compose.full.yml logs -f app"
    log "4. Executar este script novamente após as correções"
fi

log ""
log "${CYAN}📋 COMANDOS ÚTEIS PARA DEBUG MANUAL:${NC}"
log "# Ver logs em tempo real:"
log "docker compose -f docker-compose.full.yml logs -f app"
log ""
log "# Reiniciar aplicação:"
log "docker compose -f docker-compose.full.yml restart app"
log ""
log "# Acessar container da aplicação:"
log "docker compose -f docker-compose.full.yml exec app bash"
log ""
log "# Verificar usuários no banco:"
log "docker compose -f docker-compose.full.yml exec postgres psql -U vipassist -d vipassist -c 'SELECT * FROM \"Usuario\";'"

log ""
log "${BLUE}============================================${NC}"
log "${GREEN}✅ DIAGNÓSTICO COMPLETO FINALIZADO!${NC}"
log "${CYAN}📄 Log salvo em: $LOG_FILE${NC}"
log "${BLUE}============================================${NC}"

# Limpar arquivos temporários
rm -f /tmp/cookies.txt /tmp/final_cookies.txt /tmp/final_headers.txt /tmp/final_response.txt

echo ""
echo -e "${YELLOW}Para executar este script:${NC}"
echo -e "${CYAN}chmod +x scripts/debug-login-completo.sh${NC}"
echo -e "${CYAN}./scripts/debug-login-completo.sh${NC}"
