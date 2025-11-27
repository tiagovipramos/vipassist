# Correção para Instalação SSL na VPS

## Problema Identificado

O script ainda tem uma referência ao caminho antigo `/root/vipassist` e há conflito no git pull.

## Solução Rápida

Execute estes comandos na VPS:

```bash
# 1. Descartar mudanças locais e fazer pull
cd /opt/vipassist
git reset --hard HEAD
git pull origin master

# 2. Executar o script corrigido
chmod +x scripts/setup-ssl.sh
sudo bash scripts/setup-ssl.sh
```

## Se ainda der erro

Se o script ainda apresentar erro na linha 60, execute manualmente:

```bash
cd /opt/vipassist

# Parar containers
docker-compose -f docker-compose.full.yml down

# Obter certificado SSL
sudo certbot certonly --standalone \
    --non-interactive \
    --agree-tos \
    --email admin@conectiva24h.com.br \
    --domains conectiva24h.com.br \
    --domains www.conectiva24h.com.br

# Criar diretório SSL
sudo mkdir -p nginx/ssl

# Copiar certificados
sudo cp /etc/letsencrypt/live/conectiva24h.com.br/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/conectiva24h.com.br/privkey.pem nginx/ssl/key.pem
sudo chmod 644 nginx/ssl/cert.pem
sudo chmod 600 nginx/ssl/key.pem

# Atualizar configuração do Nginx
sudo tee nginx/nginx.conf > /dev/null << 'EOF'
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

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name conectiva24h.com.br www.conectiva24h.com.br;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;
        ssl_session_tickets off;

        ssl_stapling on;
        ssl_stapling_verify on;
        ssl_trusted_certificate /etc/nginx/ssl/cert.pem;

        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

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

        location /_next/ {
            set $backend "app:3000";
            proxy_pass http://$backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

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

# Configurar renovação automática
sudo tee /etc/cron.d/certbot-renew > /dev/null << 'EOF'
0 3 * * * root certbot renew --quiet --deploy-hook "cp /etc/letsencrypt/live/conectiva24h.com.br/fullchain.pem /opt/vipassist/nginx/ssl/cert.pem && cp /etc/letsencrypt/live/conectiva24h.com.br/privkey.pem /opt/vipassist/nginx/ssl/key.pem && cd /opt/vipassist && docker-compose -f docker-compose.full.yml restart nginx"
EOF

sudo chmod 644 /etc/cron.d/certbot-renew

# Atualizar .env
if grep -q "NEXTAUTH_URL=" .env; then
    sed -i 's|NEXTAUTH_URL=.*|NEXTAUTH_URL=https://conectiva24h.com.br|' .env
else
    echo "NEXTAUTH_URL=https://conectiva24h.com.br" >> .env
fi

# Iniciar containers
docker-compose -f docker-compose.full.yml up -d

# Aguardar e verificar
sleep 10
docker-compose -f docker-compose.full.yml ps

echo "✓ Instalação SSL concluída!"
echo "Acesse: https://conectiva24h.com.br"
```

## Verificação

```bash
# Ver certificado
certbot certificates

# Testar HTTPS
curl -I https://conectiva24h.com.br

# Ver logs
docker-compose -f docker-compose.full.yml logs -f nginx
