#!/bin/bash

# Script para corrigir nome da tabela Usuario no banco de dados
# VIP ASSIST - Correção de nome de tabela

echo "=========================================="
echo "VIP ASSIST - Correção de Nome de Tabela"
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

log_info "Verificando tabelas existentes no banco..."
docker exec vipassist-postgres psql -U vipassist -d vipassist -c "\dt"

echo ""
log_warn "Este script irá renomear a tabela 'usuarios' para 'Usuario'"
log_warn "Isso é necessário porque o Prisma espera 'Usuario' (com U maiúsculo)"
echo ""
read -p "Deseja continuar? (s/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    log_info "Operação cancelada."
    exit 0
fi

echo ""
log_info "Renomeando tabela 'usuarios' para 'Usuario'..."
docker exec vipassist-postgres psql -U vipassist -d vipassist -c 'ALTER TABLE IF EXISTS usuarios RENAME TO "Usuario";'

echo ""
log_info "Verificando se a tabela foi renomeada..."
docker exec vipassist-postgres psql -U vipassist -d vipassist -c "\dt"

echo ""
log_info "Verificando usuários na tabela..."
docker exec vipassist-postgres psql -U vipassist -d vipassist -c 'SELECT id, nome, email, role, ativo FROM "Usuario" LIMIT 5;'

echo ""
log_info "Reiniciando aplicação para aplicar mudanças..."
docker compose -f docker-compose.full.yml restart app

echo ""
log_info "Aguardando aplicação reiniciar (10 segundos)..."
sleep 10

echo ""
echo "=========================================="
echo "CORREÇÃO COMPLETA!"
echo "=========================================="
echo ""
log_info "Teste o login agora em: http://185.215.167.39"
echo ""
