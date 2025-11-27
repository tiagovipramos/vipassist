#!/bin/bash

# Script para rebuild completo da aplicação em produção
# VIP ASSIST - Correção de problemas de build

set -e

echo "=========================================="
echo "VIP ASSIST - Rebuild Completo em Produção"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Verificar se está no diretório correto
if [ ! -f "docker-compose.full.yml" ]; then
    log_error "Arquivo docker-compose.full.yml não encontrado!"
    log_error "Execute este script no diretório raiz do projeto."
    exit 1
fi

# Verificar se o .env existe
if [ ! -f ".env" ]; then
    log_error "Arquivo .env não encontrado!"
    log_error "Crie o arquivo .env com as variáveis necessárias."
    exit 1
fi

# Confirmar ação
echo ""
log_warn "Este script irá:"
log_warn "1. Parar todos os containers"
log_warn "2. Remover o container da aplicação"
log_warn "3. Fazer rebuild completo (sem cache)"
log_warn "4. Reiniciar todos os serviços"
echo ""
read -p "Deseja continuar? (s/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    log_info "Operação cancelada."
    exit 0
fi

echo ""
log_step "1/6 - Parando containers..."
docker-compose -f docker-compose.full.yml down

echo ""
log_step "2/6 - Removendo imagem antiga da aplicação..."
docker rmi vipassist-app 2>/dev/null || log_info "Imagem não existe, continuando..."

echo ""
log_step "3/6 - Limpando cache do Docker..."
docker builder prune -f

echo ""
log_step "4/6 - Fazendo rebuild da aplicação (isso pode levar alguns minutos)..."
docker-compose -f docker-compose.full.yml build --no-cache app

echo ""
log_step "5/6 - Iniciando serviços..."
docker-compose -f docker-compose.full.yml up -d

echo ""
log_step "6/6 - Aguardando containers iniciarem (30 segundos)..."
sleep 30

echo ""
log_info "Verificando status dos containers..."
docker-compose -f docker-compose.full.yml ps

echo ""
log_info "Verificando logs da aplicação..."
docker logs --tail 30 vipassist-app

echo ""
echo "=========================================="
echo "REBUILD COMPLETO!"
echo "=========================================="
echo ""
log_info "Próximos passos:"
echo ""
echo "1. Verifique se a aplicação está rodando:"
echo "   curl http://localhost:3000/api/health"
echo ""
echo "2. Acesse a aplicação no navegador:"
echo "   http://185.215.167.39"
echo ""
echo "3. Se ainda houver problemas, verifique os logs:"
echo "   docker logs -f vipassist-app"
echo ""
echo "4. Para verificar variáveis de ambiente:"
echo "   docker exec vipassist-app printenv | grep NEXTAUTH"
echo ""
