#!/bin/bash

# ============================================
# Script para Aplicar Correção do Login
# VIP ASSIST - conectiva24h.com.br
# ============================================

echo "============================================"
echo "APLICANDO CORREÇÃO DO LOGIN"
echo "============================================"
echo ""

# 1. Fazer pull do código
echo "[1/5] Fazendo pull do código..."
git pull origin master
echo ""

# 2. Parar containers
echo "[2/5] Parando containers..."
docker compose -f docker-compose.full.yml down
echo ""

# 3. Rebuild da imagem
echo "[3/5] Fazendo rebuild da imagem (isso pode demorar alguns minutos)..."
docker compose -f docker-compose.full.yml build --no-cache app
echo ""

# 4. Subir containers
echo "[4/5] Subindo containers..."
docker compose -f docker-compose.full.yml up -d
echo ""

# 5. Aguardar aplicação iniciar
echo "[5/5] Aguardando aplicação iniciar..."
sleep 15
echo ""

# Verificar status
echo "============================================"
echo "STATUS DOS CONTAINERS"
echo "============================================"
docker compose -f docker-compose.full.yml ps
echo ""

echo "============================================"
echo "CORREÇÃO APLICADA!"
echo "============================================"
echo ""
echo "Agora teste o login em:"
echo "https://conectiva24h.com.br"
echo ""
echo "Credenciais:"
echo "Email: admin@vipassist.com"
echo "Senha: admin123"
echo ""
echo "============================================"
