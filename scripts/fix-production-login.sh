#!/bin/bash

# Script para corrigir problemas de login em produção
# VIP ASSIST - Diagnóstico e Correção

set -e

echo "=========================================="
echo "VIP ASSIST - Correção de Login em Produção"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para log
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Verificar se os containers estão rodando
log_info "Verificando containers..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# 2. Verificar logs do container app
log_info "Verificando logs do container app (últimas 50 linhas)..."
docker logs --tail 50 vipassist-app 2>&1 | tail -20
echo ""

# 3. Verificar se o Next.js foi buildado corretamente
log_info "Verificando build do Next.js..."
if docker exec vipassist-app test -d /app/.next; then
    log_info "Diretório .next existe"
    docker exec vipassist-app ls -lah /app/.next/
else
    log_error "Diretório .next NÃO existe! Next.js não foi buildado."
fi
echo ""

# 4. Verificar variáveis de ambiente críticas
log_info "Verificando variáveis de ambiente..."
docker exec vipassist-app printenv | grep -E "NODE_ENV|NEXTAUTH_URL|NEXTAUTH_SECRET|DATABASE_URL" || log_warn "Variáveis não encontradas"
echo ""

# 5. Verificar conexão com banco de dados
log_info "Testando conexão com PostgreSQL..."
docker exec vipassist-postgres pg_isready -U vipassist && log_info "PostgreSQL está respondendo" || log_error "PostgreSQL não está respondendo"
echo ""

# 6. Verificar se há usuários no banco
log_info "Verificando usuários no banco de dados..."
docker exec vipassist-postgres psql -U vipassist -d vipassist -c "SELECT id, nome, email, role, ativo FROM \"Usuario\" LIMIT 5;" 2>&1 || log_warn "Erro ao consultar usuários"
echo ""

# 7. Verificar logs do nginx
log_info "Verificando logs do nginx (últimas 20 linhas)..."
docker logs --tail 20 vipassist-nginx 2>&1
echo ""

# 8. Testar endpoint de health
log_info "Testando endpoint de health..."
curl -s http://localhost:3000/api/health || log_error "Endpoint de health não está respondendo"
echo ""

# 9. Verificar se o Next.js está em modo produção
log_info "Verificando modo do Next.js..."
docker exec vipassist-app node -e "console.log('NODE_ENV:', process.env.NODE_ENV)"
echo ""

echo "=========================================="
echo "DIAGNÓSTICO COMPLETO"
echo "=========================================="
echo ""
echo "Próximos passos sugeridos:"
echo ""
echo "1. Se o .next não existe, rebuild a aplicação:"
echo "   docker-compose -f docker-compose.full.yml down"
echo "   docker-compose -f docker-compose.full.yml build --no-cache app"
echo "   docker-compose -f docker-compose.full.yml up -d"
echo ""
echo "2. Se NEXTAUTH_URL está incorreto, atualize o .env:"
echo "   NEXTAUTH_URL=http://185.215.167.39"
echo "   Depois: docker-compose -f docker-compose.full.yml restart app"
echo ""
echo "3. Se não há usuários no banco, crie um usuário admin:"
echo "   docker exec -it vipassist-app npm run prisma:seed"
echo ""
echo "4. Para ver logs em tempo real:"
echo "   docker logs -f vipassist-app"
echo ""
