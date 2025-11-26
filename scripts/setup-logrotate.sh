#!/bin/bash
set -e

# ==========================================
# SCRIPT DE INSTALAÇÃO DO LOGROTATE
# ==========================================
# Este script instala e configura o logrotate
# para gerenciar a rotação automática de logs
# ==========================================

echo "=========================================="
echo "INSTALAÇÃO DO LOGROTATE - VIP ASSIST"
echo "=========================================="

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
    echo "ERRO: Este script deve ser executado como root"
    echo "Use: sudo $0"
    exit 1
fi

# Detectar sistema operacional
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo "ERRO: Não foi possível detectar o sistema operacional"
    exit 1
fi

echo "Sistema operacional detectado: $OS"
echo ""

# Instalar logrotate se não estiver instalado
echo "Verificando instalação do logrotate..."
if ! command -v logrotate &> /dev/null; then
    echo "Logrotate não encontrado. Instalando..."
    
    case $OS in
        ubuntu|debian)
            apt-get update
            apt-get install -y logrotate
            ;;
        centos|rhel|fedora)
            yum install -y logrotate
            ;;
        alpine)
            apk add --no-cache logrotate
            ;;
        *)
            echo "ERRO: Sistema operacional não suportado: $OS"
            exit 1
            ;;
    esac
    
    echo "✓ Logrotate instalado com sucesso"
else
    echo "✓ Logrotate já está instalado"
fi

# Verificar versão
LOGROTATE_VERSION=$(logrotate --version | head -n1)
echo "Versão: $LOGROTATE_VERSION"
echo ""

# Criar diretórios de logs se não existirem
echo "Criando diretórios de logs..."
mkdir -p /var/log/vipassist
mkdir -p /var/log/postgresql
mkdir -p /var/log/nginx
mkdir -p /backups

# Definir permissões
chown -R www-data:www-data /var/log/vipassist 2>/dev/null || chown -R nginx:nginx /var/log/vipassist 2>/dev/null || true
chown -R postgres:postgres /var/log/postgresql 2>/dev/null || true
chown -R nginx:nginx /var/log/nginx 2>/dev/null || true

echo "✓ Diretórios criados"
echo ""

# Copiar configuração do logrotate
echo "Instalando configuração do logrotate..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_SOURCE="$SCRIPT_DIR/logrotate.conf"
CONFIG_DEST="/etc/logrotate.d/vipassist"

if [ ! -f "$CONFIG_SOURCE" ]; then
    echo "ERRO: Arquivo de configuração não encontrado: $CONFIG_SOURCE"
    exit 1
fi

# Fazer backup da configuração existente
if [ -f "$CONFIG_DEST" ]; then
    echo "Fazendo backup da configuração existente..."
    cp "$CONFIG_DEST" "$CONFIG_DEST.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Copiar nova configuração
cp "$CONFIG_SOURCE" "$CONFIG_DEST"
chmod 644 "$CONFIG_DEST"

echo "✓ Configuração instalada em: $CONFIG_DEST"
echo ""

# Testar configuração
echo "Testando configuração..."
if logrotate -d "$CONFIG_DEST" 2>&1 | grep -i "error"; then
    echo "✗ ERRO na configuração do logrotate!"
    echo "Execute manualmente para ver detalhes: logrotate -d $CONFIG_DEST"
    exit 1
else
    echo "✓ Configuração válida"
fi
echo ""

# Configurar cron para executar logrotate diariamente
echo "Configurando execução automática..."

# Verificar se já existe entrada no cron
if ! grep -q "logrotate" /etc/crontab 2>/dev/null; then
    echo "Adicionando entrada no crontab..."
    
    # Adicionar ao crontab do sistema
    echo "# Rotação de logs do VIP ASSIST" >> /etc/crontab
    echo "0 0 * * * root /usr/sbin/logrotate /etc/logrotate.d/vipassist" >> /etc/crontab
    
    echo "✓ Cron configurado"
else
    echo "✓ Cron já configurado"
fi
echo ""

# Criar script de monitoramento
echo "Criando script de monitoramento..."
cat > /usr/local/bin/vipassist-log-monitor << 'EOF'
#!/bin/bash
# Script de monitoramento de logs do VIP ASSIST

LOG_DIR="/var/log/vipassist"
ALERT_THRESHOLD_MB=500
ALERT_LOG="/var/log/vipassist/alerts.log"

# Verificar tamanho total dos logs
TOTAL_SIZE=$(du -sm "$LOG_DIR" 2>/dev/null | cut -f1)

if [ -z "$TOTAL_SIZE" ]; then
    echo "$(date): ERRO - Não foi possível verificar tamanho dos logs" >> "$ALERT_LOG"
    exit 1
fi

echo "$(date): Tamanho total dos logs: ${TOTAL_SIZE}MB"

if [ "$TOTAL_SIZE" -gt "$ALERT_THRESHOLD_MB" ]; then
    echo "$(date): ALERTA - Logs ocupando ${TOTAL_SIZE}MB (limite: ${ALERT_THRESHOLD_MB}MB)" >> "$ALERT_LOG"
    
    # Listar maiores arquivos
    echo "$(date): Maiores arquivos:" >> "$ALERT_LOG"
    du -h "$LOG_DIR"/* 2>/dev/null | sort -rh | head -10 >> "$ALERT_LOG"
fi

# Verificar logs não rotacionados há mais de 7 dias
find "$LOG_DIR" -name "*.log" -type f -mtime +7 -exec echo "$(date): AVISO - Log não rotacionado: {}" \; >> "$ALERT_LOG"

# Limpar alertas antigos (mais de 30 dias)
find "$LOG_DIR" -name "alerts.log" -type f -mtime +30 -delete 2>/dev/null || true
EOF

chmod +x /usr/local/bin/vipassist-log-monitor

echo "✓ Script de monitoramento criado: /usr/local/bin/vipassist-log-monitor"
echo ""

# Adicionar monitoramento ao cron (executar a cada 6 horas)
if ! grep -q "vipassist-log-monitor" /etc/crontab 2>/dev/null; then
    echo "Configurando monitoramento automático..."
    echo "0 */6 * * * root /usr/local/bin/vipassist-log-monitor" >> /etc/crontab
    echo "✓ Monitoramento configurado"
else
    echo "✓ Monitoramento já configurado"
fi
echo ""

# Forçar primeira rotação (teste)
echo "Executando primeira rotação de teste..."
logrotate -f "$CONFIG_DEST" 2>&1 | head -20

echo ""
echo "=========================================="
echo "INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
echo "=========================================="
echo ""
echo "Configurações:"
echo "  - Arquivo de configuração: $CONFIG_DEST"
echo "  - Logs da aplicação: /var/log/vipassist/"
echo "  - Logs do PostgreSQL: /var/log/postgresql/"
echo "  - Logs de backup: /backups/"
echo ""
echo "Rotação configurada:"
echo "  - Logs da aplicação: Diário (30 dias)"
echo "  - Logs de erro: Diário (60 dias)"
echo "  - Logs do Docker: Diário (7 dias)"
echo "  - Logs do PostgreSQL: Diário (14 dias)"
echo "  - Logs de backup: Semanal (12 semanas)"
echo ""
echo "Comandos úteis:"
echo "  - Testar configuração: logrotate -d $CONFIG_DEST"
echo "  - Forçar rotação: logrotate -f $CONFIG_DEST"
echo "  - Ver status: cat /var/lib/logrotate/status"
echo "  - Monitorar logs: /usr/local/bin/vipassist-log-monitor"
echo ""
echo "Monitoramento automático:"
echo "  - Rotação: Diariamente às 00:00"
echo "  - Verificação: A cada 6 horas"
echo "  - Alertas: /var/log/vipassist/alerts.log"
echo ""
echo "=========================================="
