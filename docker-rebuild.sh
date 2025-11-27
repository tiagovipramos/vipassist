#!/bin/bash

echo "🧹 Limpando cache do Docker..."

# Parar e remover containers
docker-compose down

# Remover imagens antigas do projeto
docker rmi vipassist_app 2>/dev/null || true

# Limpar cache de build
docker builder prune -f

# Limpar volumes órfãos
docker volume prune -f

echo "🔨 Reconstruindo containers..."

# Rebuild sem cache
docker-compose build --no-cache

echo "🚀 Iniciando containers..."

# Subir containers
docker-compose up -d

echo "✅ Pronto! Aguardando containers iniciarem..."

# Aguardar 10 segundos
sleep 10

# Mostrar status
docker-compose ps

echo ""
echo "📋 Para ver os logs:"
echo "docker-compose logs -f app"
