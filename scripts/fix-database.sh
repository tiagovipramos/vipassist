#!/bin/bash

# ============================================
# Script de Diagnóstico e Correção - VIP ASSIST
# Corrige problema de autenticação PostgreSQL
# ============================================

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[!]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} $1"; }

echo -e "${BLUE}"
echo "============================================"
echo "  VIP ASSIST - Diagnóstico e Correção"
echo "============================================"
echo -e "${NC}"

cd /opt/vipassist

# ============================================
# 1. DIAGNÓSTICO INICIAL
# ============================================
log_info "Iniciando diagnóstico..."

echo ""
echo "=== 1. Verificando .env atual ==="
if [ -f ".env" ]; then
    log_success "Arquivo .env existe"
    echo ""
    echo "DATABASE_URL:"
    grep "^DATABASE_URL=" .env || echo "  [NÃO ENCONTRADO]"
    echo ""
    echo "POSTGRES_PASSWORD:"
    grep "^POSTGRES_PASSWORD=" .env || echo "  [NÃO ENCONTRADO]"
else
    log_error "Arquivo .env NÃO existe!"
fi

echo ""
echo "=== 2. Verificando credenciais geradas ==="
if [ -f "/root/vipassist-credentials.txt" ]; then
    log_success "Arquivo de credenciais existe"
    cat /root/vipassist-credentials.txt
else
    log_warning "Arquivo de credenciais NÃO existe"
fi

echo ""
echo "=== 3. Verificando containers ==="
docker compose -f docker-compose.full.yml ps

echo ""
echo "=== 4. Verificando variáveis no container app ==="
docker compose -f docker-compose.full.yml exec -T app env | grep -E "(DATABASE_URL|POSTGRES)" || echo "  [Container não está rodando]"

echo ""
echo "=== 5. Verificando variáveis no container postgres ==="
docker compose -f docker-compose.full.yml exec -T postgres env | grep POSTGRES || echo "  [Container não está rodando]"

echo ""
echo "=== 6. Logs do PostgreSQL (últimas 20 linhas) ==="
docker compose -f docker-compose.full.yml logs postgres | tail -20

# ============================================
# 2. CORREÇÃO
# ============================================
echo ""
echo -e "${YELLOW}============================================${NC}"
echo -e "${YELLOW}  Iniciando Correção${NC}"
echo -e "${YELLOW}============================================${NC}"
echo ""

read -p "Deseja continuar com a correção? (s/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    log_warning "Correção cancelada pelo usuário"
    exit 0
fi

# ============================================
# 3. PARAR E LIMPAR TUDO
# ============================================
log_info "Parando containers e removendo volumes..."
docker compose -f docker-compose.full.yml down -v
log_success "Containers parados e volumes removidos"

# ============================================
# 4. GERAR NOVA SENHA SIMPLES (SEM CARACTERES ESPECIAIS)
# ============================================
log_info "Gerando novas senhas (apenas letras e números)..."

# Senha com apenas letras e números (mais seguro para PostgreSQL)
POSTGRES_PASSWORD=$(openssl rand -hex 16)
NEXTAUTH_SECRET=$(openssl rand -hex 32)
BACKUP_ENCRYPTION_KEY=$(openssl rand -hex 32)

log_success "Senhas geradas:"
echo "  PostgreSQL: $POSTGRES_PASSWORD"
echo "  NextAuth: $NEXTAUTH_SECRET"
echo "  Backup: $BACKUP_ENCRYPTION_KEY"

# ============================================
# 5. CRIAR .ENV DO ZERO
# ============================================
log_info "Criando novo arquivo .env..."

cat > .env << EOF
# ==========================================
# CONFIGURAÇÃO DE PRODUÇÃO - VIP ASSIST
# ==========================================
# Gerado automaticamente em: $(date)

# ==========================================
# DATABASE
# ==========================================
DATABASE_URL="postgresql://vipassist:${POSTGRES_PASSWORD}@postgres:5432/vipassist?schema=public"

# Variáveis para Docker Compose
POSTGRES_USER=vipassist
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=vipassist

# ==========================================
# NEXT.JS
# ==========================================
NODE_ENV=production
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=https://seu-dominio.com

# ==========================================
# GOOGLE MAPS API
# ==========================================
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# ==========================================
# MAPBOX API
# ==========================================
NEXT_PUBLIC_MAPBOX_TOKEN=

# ==========================================
# BACKUP
# ==========================================
BACKUP_KEEP_DAYS=7
BACKUP_KEEP_WEEKS=4
BACKUP_KEEP_MONTHS=6
BACKUP_ENCRYPTION_KEY=${BACKUP_ENCRYPTION_KEY}
EOF

log_success "Arquivo .env criado"

# ============================================
# 6. SALVAR CREDENCIAIS
# ============================================
cat > /root/vipassist-credentials-$(date +%Y%m%d-%H%M%S).txt << EOF
============================================
VIP ASSIST - Credenciais
============================================
Data: $(date)

PostgreSQL Password: $POSTGRES_PASSWORD
NextAuth Secret: $NEXTAUTH_SECRET
Backup Encryption Key: $BACKUP_ENCRYPTION_KEY

IMPORTANTE: Guarde este arquivo em local seguro!
============================================
EOF

log_success "Credenciais salvas em: /root/vipassist-credentials-$(date +%Y%m%d-%H%M%S).txt"

# ============================================
# 7. VERIFICAR .ENV CRIADO
# ============================================
log_info "Verificando .env criado..."
echo ""
echo "DATABASE_URL:"
grep "^DATABASE_URL=" .env
echo ""
echo "POSTGRES_PASSWORD:"
grep "^POSTGRES_PASSWORD=" .env
echo ""

# ============================================
# 8. REBUILD COMPLETO
# ============================================
log_info "Fazendo rebuild completo (sem cache)..."
docker compose -f docker-compose.full.yml build --no-cache
log_success "Build concluído"

# ============================================
# 9. INICIAR SERVIÇOS
# ============================================
log_info "Iniciando serviços..."
docker compose -f docker-compose.full.yml up -d
log_success "Serviços iniciados"

# ============================================
# 10. AGUARDAR POSTGRESQL FICAR PRONTO
# ============================================
log_info "Aguardando PostgreSQL ficar pronto (60 segundos)..."
sleep 60

# ============================================
# 11. VERIFICAR STATUS
# ============================================
log_info "Verificando status dos containers..."
docker compose -f docker-compose.full.yml ps

# ============================================
# 12. VERIFICAR VARIÁVEIS NOS CONTAINERS
# ============================================
echo ""
log_info "Verificando variáveis no container app..."
docker compose -f docker-compose.full.yml exec -T app env | grep DATABASE_URL

echo ""
log_info "Verificando variáveis no container postgres..."
docker compose -f docker-compose.full.yml exec -T postgres env | grep POSTGRES_PASSWORD

# ============================================
# 13. APLICAR MIGRATIONS
# ============================================
echo ""
log_info "Aplicando migrations do banco de dados..."

if docker compose -f docker-compose.full.yml exec -T app npm run prisma:migrate; then
    log_success "Migrations aplicadas com sucesso!"
else
    log_error "Erro ao aplicar migrations"
    echo ""
    log_info "Tentando novamente em 10 segundos..."
    sleep 10
    
    if docker compose -f docker-compose.full.yml exec -T app npm run prisma:migrate; then
        log_success "Migrations aplicadas com sucesso na segunda tentativa!"
    else
        log_error "Falha ao aplicar migrations mesmo na segunda tentativa"
        echo ""
        log_info "Logs do container app:"
        docker compose -f docker-compose.full.yml logs app | tail -50
        echo ""
        log_info "Logs do container postgres:"
        docker compose -f docker-compose.full.yml logs postgres | tail -50
        exit 1
    fi
fi

# ============================================
# 14. TESTE FINAL
# ============================================
echo ""
log_info "Testando conexão com o banco..."

if docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -c "SELECT 1;" > /dev/null 2>&1; then
    log_success "Conexão com banco OK!"
else
    log_warning "Não foi possível testar a conexão diretamente"
fi

# ============================================
# 15. HEALTH CHECK
# ============================================
echo ""
log_info "Testando health check da aplicação..."
sleep 5

HEALTH_STATUS=$(curl -s http://localhost:3000/api/health | grep -o '"status":"[^"]*"' | cut -d'"' -f4 || echo "error")

if [ "$HEALTH_STATUS" = "healthy" ]; then
    log_success "Health check: OK"
else
    log_warning "Health check: $HEALTH_STATUS"
fi

# ============================================
# RESUMO FINAL
# ============================================
echo ""
echo -e "${GREEN}============================================"
echo "  ✓ CORREÇÃO CONCLUÍDA!"
echo "============================================${NC}"
echo ""
echo -e "${BLUE}Informações:${NC}"
echo "  • PostgreSQL Password: $POSTGRES_PASSWORD"
echo "  • Credenciais salvas em: /root/vipassist-credentials-$(date +%Y%m%d-%H%M%S).txt"
echo ""
echo -e "${BLUE}Status dos Serviços:${NC}"
docker compose -f docker-compose.full.yml ps
echo ""
echo -e "${BLUE}Comandos Úteis:${NC}"
echo "  • Ver logs: docker compose -f docker-compose.full.yml logs -f"
echo "  • Reiniciar: docker compose -f docker-compose.full.yml restart"
echo "  • Parar: docker compose -f docker-compose.full.yml stop"
echo ""
echo -e "${GREEN}Correção finalizada!${NC}"
echo ""
