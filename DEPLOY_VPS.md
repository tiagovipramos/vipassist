# 🚀 Guia Completo de Deploy em VPS com Docker

## 📋 Pré-requisitos

- VPS com Ubuntu 20.04+ ou Debian 11+
- Mínimo 2GB RAM, 20GB disco
- Docker e Docker Compose instalados
- Acesso SSH ao servidor
- Domínio configurado (opcional)

## 🔧 Passo 1: Preparar o Servidor

### 1.1 Conectar ao Servidor

```bash
ssh usuario@IP_DO_SERVIDOR
```

### 1.2 Atualizar Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Instalar Docker

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalação
docker --version
docker-compose --version
```

### 1.4 Configurar Firewall

```bash
# Permitir SSH
sudo ufw allow 22/tcp

# Permitir HTTP/HTTPS (se usar Nginx/Caddy)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# PostgreSQL (apenas se necessário acesso externo)
# sudo ufw allow 5432/tcp

# Ativar firewall
sudo ufw enable
```

## 📦 Passo 2: Fazer Deploy do Banco de Dados

### 2.1 Criar Diretório do Projeto

```bash
mkdir -p ~/vipassist
cd ~/vipassist
```

### 2.2 Criar Arquivo .env

```bash
nano .env.production
```

Cole o conteúdo (ajuste os valores):

```env
# Database
POSTGRES_USER=vipassist
POSTGRES_PASSWORD=SuaSenhaForteAqui123!
POSTGRES_DB=vipassist

# Backup
BACKUP_KEEP_DAYS=7
BACKUP_KEEP_WEEKS=4
BACKUP_KEEP_MONTHS=6
```

### 2.3 Criar docker-compose.yml

```bash
nano docker-compose.yml
```

Cole o conteúdo do arquivo `docker-compose.prod.yml` do projeto.

### 2.4 Criar Script de Backup

```bash
mkdir -p scripts
nano scripts/backup.sh
```

Cole o conteúdo do arquivo `scripts/backup.sh` do projeto.

```bash
chmod +x scripts/backup.sh
```

### 2.5 Iniciar PostgreSQL

```bash
# Carregar variáveis de ambiente
export $(cat .env.production | xargs)

# Iniciar containers
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f postgres
```

## 🗄️ Passo 3: Migrar o Banco de Dados

### 3.1 No Seu Computador Local

```bash
# Fazer backup do banco SQLite atual (se tiver dados)
cp prisma/dev.db prisma/dev.db.backup

# Exportar dados (se necessário)
# Você pode usar scripts para exportar dados importantes
```

### 3.2 Configurar Connection String

Atualize o `.env` local temporariamente:

```env
DATABASE_URL="postgresql://vipassist:SuaSenhaForteAqui123!@IP_DO_SERVIDOR:5432/vipassist?schema=public"
```

### 3.3 Executar Migration

```bash
# Executar migration no servidor
npx prisma migrate deploy

# Verificar
npx prisma studio
```

## 🌐 Passo 4: Deploy da Aplicação Next.js

### Opção A: Deploy com PM2 (Recomendado)

#### 4.1 Instalar Node.js no Servidor

```bash
# Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Instalar Node.js
nvm install 20
nvm use 20
```

#### 4.2 Instalar PM2

```bash
npm install -g pm2
```

#### 4.3 Fazer Deploy

```bash
# No servidor
cd ~/vipassist
git clone seu-repositorio.git app
cd app

# Instalar dependências
npm install

# Configurar .env
cp .env.production.example .env.production
nano .env.production
# Ajuste DATABASE_URL para: postgresql://vipassist:senha@localhost:5432/vipassist

# Build
npm run build

# Iniciar com PM2
pm2 start npm --name "vipassist" -- start

# Configurar para iniciar no boot
pm2 startup
pm2 save
```

### Opção B: Deploy com Docker

#### 4.1 Criar Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Dependências
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### 4.2 Adicionar ao docker-compose.yml

```yaml
  app:
    build: ./app
    container_name: vipassist-app
    restart: always
    environment:
      DATABASE_URL: postgresql://vipassist:${POSTGRES_PASSWORD}@postgres:5432/vipassist?schema=public
      NODE_ENV: production
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    networks:
      - vipassist-network
```

## 🔒 Passo 5: Configurar Nginx (Proxy Reverso)

### 5.1 Instalar Nginx

```bash
sudo apt install nginx -y
```

### 5.2 Configurar Site

```bash
sudo nano /etc/nginx/sites-available/vipassist
```

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5.3 Ativar Site

```bash
sudo ln -s /etc/nginx/sites-available/vipassist /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5.4 Configurar SSL com Certbot

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Renovação automática já está configurada
```

## 📊 Passo 6: Monitoramento e Manutenção

### 6.1 Ver Logs

```bash
# Logs do PostgreSQL
docker-compose logs -f postgres

# Logs da aplicação (PM2)
pm2 logs vipassist

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 6.2 Backup Manual

```bash
# Entrar no container de backup
docker exec -it vipassist-backup sh

# Executar backup manualmente
/backup.sh
```

### 6.3 Restaurar Backup

```bash
# Listar backups
ls -lh ~/vipassist/backups/

# Restaurar
gunzip < ~/vipassist/backups/backup_TIMESTAMP.sql.gz | \
docker exec -i vipassist-postgres-prod psql -U vipassist -d vipassist
```

### 6.4 Atualizar Aplicação

```bash
cd ~/vipassist/app
git pull
npm install
npm run build
pm2 restart vipassist
```

## 🔧 Comandos Úteis

```bash
# Ver status dos containers
docker-compose ps

# Parar tudo
docker-compose down

# Iniciar tudo
docker-compose up -d

# Ver uso de recursos
docker stats

# Limpar volumes não usados
docker volume prune

# Backup do volume PostgreSQL
docker run --rm -v vipassist_postgres_data:/data -v $(pwd):/backup ubuntu tar czf /backup/postgres-volume-backup.tar.gz /data
```

## 🚨 Troubleshooting

### Problema: Container não inicia

```bash
# Ver logs detalhados
docker-compose logs postgres

# Verificar permissões
ls -la ~/vipassist/backups
```

### Problema: Não consegue conectar ao banco

```bash
# Verificar se está rodando
docker ps

# Testar conexão
docker exec -it vipassist-postgres-prod psql -U vipassist -d vipassist

# Verificar firewall
sudo ufw status
```

### Problema: Aplicação lenta

```bash
# Ver uso de recursos
docker stats
htop

# Otimizar PostgreSQL
# Editar docker-compose.yml e ajustar parâmetros
```

## ✅ Checklist Final

- [ ] Docker e Docker Compose instalados
- [ ] Firewall configurado
- [ ] PostgreSQL rodando em Docker
- [ ] Backups automáticos configurados
- [ ] Migration executada
- [ ] Aplicação Next.js rodando
- [ ] Nginx configurado
- [ ] SSL/HTTPS ativo
- [ ] Monitoramento configurado
- [ ] Backup testado e funcionando

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs: `docker-compose logs`
2. Verifique o status: `docker-compose ps`
3. Teste a conexão: `docker exec -it vipassist-postgres-prod psql -U vipassist`
4. Verifique o firewall: `sudo ufw status`

---

**Deploy completo e pronto para produção! 🚀**
