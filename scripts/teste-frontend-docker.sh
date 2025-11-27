#!/bin/bash

# ============================================
# SCRIPT DE TESTE FRONTEND VIA DOCKER
# VIP ASSIST - Executa teste Node.js no container
# ============================================

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🔍 TESTE FRONTEND LOGIN VIA DOCKER${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.full.yml" ]; then
    echo -e "${RED}❌ Erro: Execute este script no diretório /opt/vipassist${NC}"
    exit 1
fi

echo -e "${YELLOW}Executando teste Node.js dentro do container...${NC}"
echo ""

# Executar o script Node.js dentro do container da aplicação
docker compose -f docker-compose.full.yml exec -T app node scripts/teste-frontend-login.js

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}✅ TESTE CONCLUÍDO${NC}"
echo -e "${BLUE}============================================${NC}"
