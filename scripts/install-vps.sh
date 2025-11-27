#!/bin/bash

# ============================================
# Script de Instalação Automática - VIP ASSIST
# Para Ubuntu 20.04+ / Debian 11+
# ============================================

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções de log
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Banner
echo -e "${BLUE}"
echo "============================================"
echo "  VIP ASSIST - Instalação Automática VPS"
echo "============================================"
echo -e "${NC}"

# Verificar se é root
if [ "$EUID" -ne 0 ]; then 
    log_error "Este script precisa ser executado como root"
    log_info "Execute: sudo bash install-vps.sh"
    exit 1
fi

log_success "Executando como root"

# ============================================
# 1. ATUALIZAR SISTEMA
# ============================================
log_info "Atualizando sistema..."
apt update && apt upgrade -y
log_success "Sistema atualizado"

# ============================================
# 2. INSTALAR DEPENDÊNCIAS BÁSICAS
# ============================================
log_info "Instalando dependências básicas..."
apt install -y \
    curl \
    git \
    wget \
    nano \
    ufw \
    ca-certificates \
    gnupg \
    lsb-release \
    software-properties-common \
    apt-transport-https
log_success "Dependências básicas instaladas"

# ============================================
# 3. INSTALAR DOCKER
# ============================================
log_info "Instalando Docker..."

# Remover versões antigas
apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# Adicionar repositório Docker
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Iniciar Docker
systemctl start docker
systemctl enable docker

# Verificar instalação
docker --version
log_success "Docker instalado: $(docker --version)"

# ============================================
# 4. CONFIGURAR FIREWALL
# ============================================
log_info "Configurando firewall..."

# Permitir SSH
ufw allow 22/tcp

# Permitir HTTP e HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Habilitar firewall
ufw --force enable

log_success "Firewall configurado"

# ============================================
# 5. CRIAR DIRETÓRIO DO PROJETO
# ============================================
log_info "Criando diretório do projeto..."

PROJECT_DIR="/opt/vipassist"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

log_success "Diretório criado: $PROJECT_DIR"

# ============================================
# 6. CLONAR REPOSITÓRIO
# ============================================
log_info "Clonando repositório do GitHub..."

if [ -d ".git" ]; then
    log_warning "Repositório já existe, atualizando..."
    git pull
else
    git clone https://github.com/tiagovipramos/vipassist.git .
fi

log_success "Repositório clonado"

# ============================================
# 7. GERAR SENHAS SEGURAS
# ============================================
log_info "Gerando senhas seguras..."

# Gerar senha do PostgreSQL (sem caracteres especiais problemáticos)
POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d '\n' | tr -d '/+=' | head -c 32)
NEXTAUTH_SECRET=$(openssl rand -base64 32 | tr -d '\n' | tr -d '/+=' | head -c 32)
BACKUP_ENCRYPTION_KEY=$(openssl rand -base64 32 | tr -d '\n' | tr -d '/+=' | head -c 32)

log_success "Senhas geradas"

# ============================================
# 8. CONFIGURAR VARIÁVEIS DE AMBIENTE
# ============================================
log_info "Configurando variáveis de ambiente..."

# Copiar exemplo para arquivo temporário
cp .env.production.example .env.tmp

# Atualizar arquivo temporário com as senhas geradas
sed -i "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=\"$POSTGRES_PASSWORD\"|" .env.tmp
sed -i "s|^NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=\"$NEXTAUTH_SECRET\"|" .env.tmp
sed -i "s|^BACKUP_ENCRYPTION_KEY=.*|BACKUP_ENCRYPTION_KEY=\"$BACKUP_ENCRYPTION_KEY\"|" .env.tmp
sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"postgresql://vipassist:$POSTGRES_PASSWORD@postgres:5432/vipassist?schema=public\"|" .env.tmp

# Mover arquivo temporário para .env (sobrescreve se existir)
mv .env.tmp .env

log_success "Arquivo .env configurado com senhas geradas"

# Salvar senhas em arquivo seguro
cat > /root/vipassist-credentials.txt << EOF
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

chmod 600 /root/vipassist-credentials.txt
log_success "Credenciais salvas em: /root/vipassist-credentials.txt"

# ============================================
# 9. BUILD E DEPLOY COM DOCKER
# ============================================
log_info "Fazendo build e deploy com Docker..."

# Parar containers antigos se existirem
docker compose -f docker-compose.full.yml down 2>/dev/null || true

# Build das imagens
docker compose -f docker-compose.full.yml build

# Iniciar serviços
docker compose -f docker-compose.full.yml up -d

log_success "Serviços iniciados"

# ============================================
# 10. AGUARDAR SERVIÇOS INICIAREM
# ============================================
log_info "Aguardando serviços iniciarem (30 segundos)..."
sleep 30

# ============================================
# 11. APLICAR MIGRATIONS DO BANCO
# ============================================
log_info "Aplicando migrations do banco de dados..."

docker compose -f docker-compose.full.yml exec -T app npm run prisma:migrate || {
    log_warning "Erro ao aplicar migrations. Tentando novamente em 10 segundos..."
    sleep 10
    docker compose -f docker-compose.full.yml exec -T app npm run prisma:migrate
}

log_success "Migrations aplicadas"

# ============================================
# 12. VERIFICAR STATUS DOS SERVIÇOS
# ============================================
log_info "Verificando status dos serviços..."

docker compose -f docker-compose.full.yml ps

# ============================================
# 13. TESTAR HEALTH CHECK
# ============================================
log_info "Testando health check..."

sleep 5
HEALTH_STATUS=$(curl -s http://localhost:3000/api/health | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

if [ "$HEALTH_STATUS" = "healthy" ]; then
    log_success "Health check: OK"
else
    log_warning "Health check: $HEALTH_STATUS"
fi

# ============================================
# 14. CONFIGURAR BACKUP AUTOMÁTICO
# ============================================
log_info "Configurando backup automático..."

# Tornar scripts executáveis
chmod +x scripts/backup.sh
chmod +x scripts/restore.sh

# Adicionar ao crontab (backup diário às 3h)
(crontab -l 2>/dev/null; echo "0 3 * * * cd /opt/vipassist && ./scripts/backup.sh") | crontab -

log_success "Backup automático configurado (diário às 3h)"

# ============================================
# 15. CONFIGURAR LOGROTATE
# ============================================
log_info "Configurando rotação de logs..."

chmod +x scripts/setup-logrotate.sh
./scripts/setup-logrotate.sh

log_success "Rotação de logs configurada"

# ============================================
# 16. OBTER IP DO SERVIDOR
# ============================================
SERVER_IP=$(curl -s ifconfig.me)

# ============================================
# RESUMO FINAL
# ============================================
echo ""
echo -e "${GREEN}============================================"
echo "  ✓ INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
echo "============================================${NC}"
echo ""
echo -e "${BLUE}Informações do Sistema:${NC}"
echo "  • Diretório: $PROJECT_DIR"
echo "  • IP do Servidor: $SERVER_IP"
echo "  • URL: http://$SERVER_IP:3000"
echo ""
echo -e "${BLUE}Serviços Rodando:${NC}"
docker compose -f docker-compose.full.yml ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo -e "${BLUE}Credenciais:${NC}"
echo "  • Arquivo: /root/vipassist-credentials.txt"
echo "  • PostgreSQL Password: $POSTGRES_PASSWORD"
echo ""
echo -e "${YELLOW}⚠️  PRÓXIMOS PASSOS IMPORTANTES:${NC}"
echo ""
echo "1. Configure as variáveis de ambiente:"
echo "   ${BLUE}nano /opt/vipassist/.env${NC}"
echo ""
echo "2. Adicione suas chaves de API:"
echo "   • NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"
echo "   • NEXT_PUBLIC_MAPBOX_TOKEN"
echo ""
echo "3. Configure o domínio (se tiver):"
echo "   • Aponte o DNS para: $SERVER_IP"
echo "   • Configure SSL com Certbot"
echo ""
echo "4. Reinicie os serviços após configurar:"
echo "   ${BLUE}cd /opt/vipassist${NC}"
echo "   ${BLUE}docker compose -f docker-compose.full.yml restart${NC}"
echo ""
echo "5. Acesse o sistema:"
echo "   ${BLUE}http://$SERVER_IP:3000${NC}"
echo ""
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${BLUE}Comandos Úteis:${NC}"
echo "  • Ver logs: ${BLUE}docker compose -f docker-compose.full.yml logs -f${NC}"
echo "  • Parar: ${BLUE}docker compose -f docker-compose.full.yml stop${NC}"
echo "  • Iniciar: ${BLUE}docker compose -f docker-compose.full.yml start${NC}"
echo "  • Reiniciar: ${BLUE}docker compose -f docker-compose.full.yml restart${NC}"
echo "  • Status: ${BLUE}docker compose -f docker-compose.full.yml ps${NC}"
echo ""
echo -e "${GREEN}Instalação finalizada!${NC}"
echo ""
