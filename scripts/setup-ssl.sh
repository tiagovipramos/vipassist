#!/bin/bash

# ============================================
# Script de Instalação SSL/HTTPS com Certbot
# Domínio: conectiva24h.com.br
# ============================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}Instalação SSL/HTTPS - VIP ASSIST${NC}"
echo -e "${GREEN}Domínio: conectiva24h.com.br${NC}"
echo -e "${GREEN}============================================${NC}"

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Por favor, execute como root (sudo)${NC}"
    exit 1
fi

# Variáveis
DOMAIN="conectiva24h.com.br"
EMAIL="admin@conectiva24h.com.br"  # Altere para seu email
PROJECT_DIR="/opt/vipassist"
NGINX_CONF="${PROJECT_DIR}/nginx/nginx.conf"
SSL_DIR="${PROJECT_DIR}/nginx/ssl"

echo -e "${YELLOW}Verificando pré-requisitos...${NC}"

# 1. Verificar se o domínio está apontando para o servidor
echo -e "${YELLOW}Verificando DNS do domínio...${NC}"
SERVER_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)

echo "IP do Servidor: $SERVER_IP"
echo "IP do Domínio: $DOMAIN_IP"

if [ "$SERVER_IP" != "$DOMAIN_IP" ]; then
    echo -e "${RED}ATENÇÃO: O domínio $DOMAIN não está apontando para este servidor!${NC}"
    echo -e "${YELLOW}Configure o DNS antes de continuar.${NC}"
    read -p "Deseja continuar mesmo assim? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# 2. Instalar Certbot
echo -e "${YELLOW}Instalando Certbot...${NC}"
apt-get update
apt-get install -y certbot python3-certbot-nginx

# 3. Parar containers temporariamente para liberar porta 80
echo -e "${YELLOW}Parando containers Docker...${NC}"
cd ${PROJECT_DIR}
docker-compose -f docker-compose.full.yml down

# 4. Obter certificado SSL
echo -e "${YELLOW}Obtendo certificado SSL do Let's Encrypt...${NC}"
certbot certonly --standalone \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --domains $DOMAIN \
    --domains www.$DOMAIN

# 5. Criar diretório SSL se não existir
echo -e "${YELLOW}Configurando certificados...${NC}"
mkdir -p $SSL_DIR

# 6. Copiar certificados para o diretório do projeto
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $SSL_DIR/cert.pem
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $SSL_DIR/key.pem
chmod 644 $SSL_DIR/cert.pem
chmod 600 $SSL_DIR/key.pem

# 7. Criar configuração Nginx com SSL
echo -e "${YELLOW}Atualizando configuração do Nginx...${NC}"
cat > $NGINX_CONF << 'EOF'
# Configuração do Nginx para VIP ASSIST com SSL/HTTPS
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;

    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;
    limit_conn_zone $binary_remote_addr zone=addr:10m;

    resolver 127.0.0.11 valid=30s ipv6=off;

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        listen [::]:80;
        server_name conectiva24h.com.br www.conectiva24h.com.br;

        # Allow Let's Encrypt challenges
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        # Redirect all other traffic to HTTPS
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name conectiva24h.com.br www.conectiva24h.com.br;

        # SSL Certificates
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # SSL Configuration (Mozilla Intermediate)
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;
        ssl_session_tickets off;

        # OCSP Stapling
        ssl_stapling on;
        ssl_stapling_verify on;
        ssl_trusted_certificate /etc/nginx/ssl/cert.pem;

        # Security Headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Main application
        location / {
            set $backend "app:3000";
            proxy_pass http://$backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # API routes with rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            limit_conn addr 10;

            set $backend "app:3000";
            proxy_pass http://$backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            proxy_connect_timeout 120s;
            proxy_send_timeout 120s;
            proxy_read_timeout 120s;
        }

        # Static files caching
        location /_next/static/ {
            set $backend "app:3000";
            proxy_pass http://$backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            add_header Cache-Control "public, max-age=31536000, immutable";
        }

        # Next.js chunks
        location /_next/ {
            set $backend "app:3000";
            proxy_pass http://$backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Images caching
        location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
            set $backend "app:3000";
            proxy_pass http://$backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            add_header Cache-Control "public, max-age=2592000";
        }
    }
}
EOF

# 8. Configurar renovação automática
echo -e "${YELLOW}Configurando renovação automática...${NC}"
cat > /etc/cron.d/certbot-renew << 'EOF'
# Renovar certificados SSL automaticamente
0 3 * * * root certbot renew --quiet --deploy-hook "cp /etc/letsencrypt/live/conectiva24h.com.br/fullchain.pem /opt/vipassist/nginx/ssl/cert.pem && cp /etc/letsencrypt/live/conectiva24h.com.br/privkey.pem /opt/vipassist/nginx/ssl/key.pem && cd /opt/vipassist && docker-compose -f docker-compose.full.yml restart nginx"
EOF

chmod 644 /etc/cron.d/certbot-renew

# 9. Atualizar .env com HTTPS
echo -e "${YELLOW}Atualizando variáveis de ambiente...${NC}"
cd ${PROJECT_DIR}
if grep -q "NEXTAUTH_URL=" .env; then
    sed -i 's|NEXTAUTH_URL=.*|NEXTAUTH_URL=https://conectiva24h.com.br|' .env
else
    echo "NEXTAUTH_URL=https://conectiva24h.com.br" >> .env
fi

# 10. Reiniciar containers
echo -e "${YELLOW}Iniciando containers com SSL...${NC}"
docker-compose -f docker-compose.full.yml up -d

# 11. Aguardar containers iniciarem
echo -e "${YELLOW}Aguardando containers iniciarem...${NC}"
sleep 10

# 12. Verificar status
echo -e "${YELLOW}Verificando status dos containers...${NC}"
docker-compose -f docker-compose.full.yml ps

# 13. Testar configuração SSL
echo -e "${YELLOW}Testando configuração SSL...${NC}"
sleep 5

if curl -k -s -o /dev/null -w "%{http_code}" https://localhost | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✓ Servidor HTTPS respondendo corretamente!${NC}"
else
    echo -e "${YELLOW}⚠ Servidor pode estar iniciando ainda...${NC}"
fi

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✓ Instalação SSL concluída com sucesso!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${GREEN}Seu site agora está disponível em:${NC}"
echo -e "${GREEN}https://conectiva24h.com.br${NC}"
echo -e "${GREEN}https://www.conectiva24h.com.br${NC}"
echo ""
echo -e "${YELLOW}Informações importantes:${NC}"
echo "- Certificado válido por 90 dias"
echo "- Renovação automática configurada (diariamente às 3h)"
echo "- HTTP redireciona automaticamente para HTTPS"
echo "- Headers de segurança configurados"
echo ""
echo -e "${YELLOW}Para verificar o certificado:${NC}"
echo "certbot certificates"
echo ""
echo -e "${YELLOW}Para renovar manualmente:${NC}"
echo "certbot renew"
echo ""
echo -e "${YELLOW}Para testar a renovação:${NC}"
echo "certbot renew --dry-run"
echo ""
echo -e "${GREEN}Logs do Nginx:${NC}"
echo "docker-compose -f docker-compose.full.yml logs -f nginx"
