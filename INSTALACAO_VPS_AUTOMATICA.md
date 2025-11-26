# 🚀 Instalação Automática na VPS - VIP ASSIST

## 📋 Pré-requisitos

- **VPS com Ubuntu 20.04+** ou Debian 11+
- **Acesso root** ou sudo
- **Mínimo:** 2GB RAM, 2 CPU cores, 20GB disco
- **Recomendado:** 4GB RAM, 4 CPU cores, 40GB disco

---

## ⚡ Instalação em 1 Comando

### Opção 1: Download e Execução Direta

```bash
curl -fsSL https://raw.githubusercontent.com/tiagovipramos/vipassist/master/scripts/install-vps.sh | sudo bash
```

### Opção 2: Download, Revisar e Executar

```bash
# Download do script
wget https://raw.githubusercontent.com/tiagovipramos/vipassist/master/scripts/install-vps.sh

# Revisar o script (recomendado)
cat install-vps.sh

# Tornar executável
chmod +x install-vps.sh

# Executar
sudo ./install-vps.sh
```

---

## 🔧 O que o Script Faz Automaticamente

### 1. Atualização do Sistema
- ✅ Atualiza todos os pacotes
- ✅ Instala dependências básicas

### 2. Instalação do Docker
- ✅ Remove versões antigas
- ✅ Instala Docker CE mais recente
- ✅ Instala Docker Compose Plugin
- ✅ Configura para iniciar automaticamente

### 3. Configuração de Firewall
- ✅ Permite SSH (porta 22)
- ✅ Permite HTTP (porta 80)
- ✅ Permite HTTPS (porta 443)
- ✅ Habilita UFW

### 4. Clone do Repositório
- ✅ Clona de https://github.com/tiagovipramos/vipassist
- ✅ Cria em `/opt/vipassist`

### 5. Configuração Automática
- ✅ Cria arquivo `.env`
- ✅ Gera senhas seguras automaticamente
- ✅ Salva credenciais em `/root/vipassist-credentials.txt`

### 6. Build e Deploy
- ✅ Faz build das imagens Docker
- ✅ Inicia todos os serviços
- ✅ Aplica migrations do banco
- ✅ Testa health check

### 7. Configurações Adicionais
- ✅ Configura backup automático (diário às 3h)
- ✅ Configura rotação de logs
- ✅ Exibe resumo completo

---

## ⏱️ Tempo de Instalação

- **VPS Rápida (4GB RAM):** ~10-15 minutos
- **VPS Média (2GB RAM):** ~15-20 minutos
- **VPS Lenta (1GB RAM):** ~20-30 minutos

---

## 📊 Após a Instalação

### 1. Verificar Credenciais

```bash
cat /root/vipassist-credentials.txt
```

**Exemplo de saída:**
```
============================================
VIP ASSIST - Credenciais
============================================
Data: Tue Nov 26 18:00:00 UTC 2025

PostgreSQL Password: xK9mP2nQ7vR4sT8wY3zL6hN1jM5kB0cD
NextAuth Secret: aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV
Backup Encryption Key: wX4yZ5aB6cD7eF8gH9iJ0kL1mN2oP3qR

IMPORTANTE: Guarde este arquivo em local seguro!
============================================
```

### 2. Configurar Variáveis de Ambiente

```bash
cd /opt/vipassist
nano .env
```

**Adicione suas chaves de API:**
```env
# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="sua-chave-aqui"

# Mapbox Token
NEXT_PUBLIC_MAPBOX_TOKEN="seu-token-aqui"

# URL do sistema (se tiver domínio)
NEXTAUTH_URL="https://seudominio.com.br"
```

### 3. Reiniciar Serviços

```bash
cd /opt/vipassist
docker compose -f docker-compose.full.yml restart
```

### 4. Acessar o Sistema

```bash
# Obter IP do servidor
curl ifconfig.me
```

**Acesse:** `http://SEU-IP:3000`

---

## 🔍 Verificar Status

### Ver Serviços Rodando

```bash
cd /opt/vipassist
docker compose -f docker-compose.full.yml ps
```

**Saída esperada:**
```
NAME                    STATUS              PORTS
vipassist-app           Up 5 minutes        0.0.0.0:3000->3000/tcp
vipassist-postgres      Up 5 minutes        5432/tcp
vipassist-backup        Up 5 minutes        
vipassist-nginx         Up 5 minutes        0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
```

### Ver Logs

```bash
# Todos os logs
docker compose -f docker-compose.full.yml logs -f

# Apenas da aplicação
docker compose -f docker-compose.full.yml logs -f app

# Apenas do PostgreSQL
docker compose -f docker-compose.full.yml logs -f postgres
```

### Testar Health Check

```bash
curl http://localhost:3000/api/health
```

**Resposta esperada:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-26T21:00:00.000Z",
  "uptime": 300,
  "checks": {
    "database": {
      "status": "connected",
      "responseTime": 5
    },
    "memory": {
      "used": 150,
      "total": 512,
      "percentage": 29
    }
  }
}
```

---

## 🛠️ Comandos Úteis

### Gerenciar Serviços

```bash
cd /opt/vipassist

# Parar todos os serviços
docker compose -f docker-compose.full.yml stop

# Iniciar todos os serviços
docker compose -f docker-compose.full.yml start

# Reiniciar todos os serviços
docker compose -f docker-compose.full.yml restart

# Parar e remover (cuidado!)
docker compose -f docker-compose.full.yml down

# Rebuild e restart
docker compose -f docker-compose.full.yml up -d --build
```

### Backup Manual

```bash
cd /opt/vipassist
./scripts/backup.sh
```

### Restore de Backup

```bash
cd /opt/vipassist
./scripts/restore.sh /caminho/para/backup.sql.gz
```

### Atualizar Sistema

```bash
cd /opt/vipassist

# Puxar últimas mudanças
git pull

# Rebuild e restart
docker compose -f docker-compose.full.yml up -d --build

# Aplicar migrations
docker compose -f docker-compose.full.yml exec app npx prisma migrate deploy
```

---

## 🌐 Configurar Domínio e SSL

### 1. Apontar DNS

No seu provedor de DNS (Cloudflare, GoDaddy, etc):

```
Tipo: A
Nome: @
Valor: SEU-IP-DA-VPS
TTL: 3600
```

### 2. Instalar Certbot

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seudominio.com.br -d www.seudominio.com.br

# Renovação automática já está configurada
```

### 3. Atualizar .env

```bash
nano /opt/vipassist/.env
```

```env
NEXTAUTH_URL="https://seudominio.com.br"
```

### 4. Reiniciar

```bash
docker compose -f docker-compose.full.yml restart
```

---

## 🔒 Segurança Adicional

### 1. Mudar Porta SSH (Recomendado)

```bash
# Editar configuração SSH
sudo nano /etc/ssh/sshd_config

# Mudar linha:
Port 22
# Para:
Port 2222

# Reiniciar SSH
sudo systemctl restart sshd

# Atualizar firewall
sudo ufw allow 2222/tcp
sudo ufw delete allow 22/tcp
```

### 2. Desabilitar Login Root

```bash
# Criar usuário admin
sudo adduser admin
sudo usermod -aG sudo admin

# Desabilitar root
sudo nano /etc/ssh/sshd_config

# Mudar:
PermitRootLogin yes
# Para:
PermitRootLogin no

# Reiniciar SSH
sudo systemctl restart sshd
```

### 3. Configurar Fail2Ban

```bash
# Instalar
sudo apt install -y fail2ban

# Configurar
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Iniciar
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

---

## 🐛 Solução de Problemas

### Serviço não inicia

```bash
# Ver logs de erro
docker compose -f docker-compose.full.yml logs app

# Verificar se portas estão em uso
sudo netstat -tulpn | grep :3000

# Reiniciar Docker
sudo systemctl restart docker
docker compose -f docker-compose.full.yml up -d
```

### Banco de dados não conecta

```bash
# Ver logs do PostgreSQL
docker compose -f docker-compose.full.yml logs postgres

# Verificar se está rodando
docker compose -f docker-compose.full.yml ps postgres

# Reiniciar apenas o PostgreSQL
docker compose -f docker-compose.full.yml restart postgres
```

### Erro de memória

```bash
# Verificar uso de memória
free -h

# Verificar uso do Docker
docker stats

# Limpar containers parados
docker system prune -a
```

### Reinstalar do Zero

```bash
# Parar e remover tudo
cd /opt/vipassist
docker compose -f docker-compose.full.yml down -v

# Remover diretório
cd /opt
sudo rm -rf vipassist

# Executar script novamente
curl -fsSL https://raw.githubusercontent.com/tiagovipramos/vipassist/master/scripts/install-vps.sh | sudo bash
```

---

## 📞 Suporte

### Logs do Sistema

```bash
# Logs da aplicação
tail -f /opt/vipassist/logs/app.log

# Logs do Docker
journalctl -u docker -f

# Logs do sistema
tail -f /var/log/syslog
```

### Informações do Sistema

```bash
# Uso de recursos
htop

# Espaço em disco
df -h

# Memória
free -h

# Processos Docker
docker ps -a
```

---

## ✅ Checklist Pós-Instalação

- [ ] Script executado com sucesso
- [ ] Todos os serviços rodando
- [ ] Health check retorna "healthy"
- [ ] Credenciais salvas em local seguro
- [ ] Chaves de API configuradas no .env
- [ ] Domínio apontado (se aplicável)
- [ ] SSL configurado (se aplicável)
- [ ] Backup testado
- [ ] Firewall configurado
- [ ] Monitoramento configurado (Sentry/UptimeRobot)

---

## 🎉 Pronto!

Seu sistema VIP ASSIST está rodando em produção!

**Acesse:** `http://SEU-IP:3000` ou `https://seudominio.com.br`

---

**Última atualização:** 26/11/2025  
**Versão do Script:** 1.0.0  
**Compatível com:** Ubuntu 20.04+, Debian 11+
