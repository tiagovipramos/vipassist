#!/bin/bash

# Script para regenerar Prisma Client após mudança no banco
# VIP ASSIST - Correção do Prisma Client

echo "=========================================="
echo "VIP ASSIST - Regenerar Prisma Client"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_info "Regenerando Prisma Client dentro do container..."
docker exec vipassist-app npx prisma generate

echo ""
log_info "Reiniciando aplicação para aplicar mudanças..."
docker compose -f docker-compose.full.yml restart app

echo ""
log_info "Aguardando aplicação reiniciar (15 segundos)..."
sleep 15

echo ""
log_info "Verificando logs da aplicação..."
docker logs --tail 20 vipassist-app

echo ""
echo "=========================================="
echo "PRISMA CLIENT REGENERADO!"
echo "=========================================="
echo ""
log_info "Teste o login agora em: http://185.215.167.39"
echo ""
log_info "Se ainda houver erro, verifique os logs:"
echo "   docker logs -f vipassist-app"
echo ""
