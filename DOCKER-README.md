# 🐳 Docker - VIP Assist

Guia completo para rodar o VIP Assist com Docker, idêntico ao ambiente local.

---

## 📋 Pré-requisitos

- **Docker Desktop** instalado
  - Windows: https://www.docker.com/products/docker-desktop
  - Certifique-se que o Docker está rodando

---

## 🚀 Início Rápido

### **Windows (Recomendado)**

```bash
# Iniciar aplicação
docker-start.bat

# Parar aplicação
docker-stop.bat
```

### **Linux/Mac ou Linha de Comando**

```bash
# Iniciar
docker-compose up --build -d

# Parar
docker-compose down
```

---

## 📦 O que está incluído?

O `docker-compose.yml` cria **2 containers**:

### **1. PostgreSQL** (`vipassist-postgres`)
- Imagem: `postgres:16-alpine`
- Porta: `5432`
- Banco: `vipassist`
- Volume persistente para dados

### **2. Aplicação Next.js** (`vipassist-app`)
- Build do Dockerfile
- Porta: `3000`
- Conecta automaticamente ao PostgreSQL
- Aguarda o banco estar pronto (healthcheck)

---

## 🔧 Configuração

### **Variáveis de Ambiente**

Copie `.env.docker` para `.env.local` e ajuste conforme necessário:

```bash
# Copiar template
copy .env.docker .env.local
```

**Principais variáveis:**

```env
# Portas
APP_PORT=3000
POSTGRES_PORT=5432

# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=vipassist

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# APIs
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua-chave
NEXT_PUBLIC_MAPBOX_TOKEN=seu-token
```

---

## 📝 Comandos Úteis

### **Gerenciamento Básico**

```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Reiniciar containers
docker-compose restart

# Ver status
docker-compose ps
```

### **Logs**

```bash
# Ver todos os logs
docker-compose logs -f

# Ver logs da aplicação
docker-compose logs -f app

# Ver logs do banco
docker-compose logs -f postgres

# Ver últimas 100 linhas
docker-compose logs --tail=100 app
```

### **Reconstruir**

```bash
# Reconstruir imagens
docker-compose build

# Reconstruir e iniciar
docker-compose up --build -d

# Reconstruir sem cache
docker-compose build --no-cache
```

### **Banco de Dados**

```bash
# Acessar PostgreSQL
docker exec -it vipassist-postgres psql -U postgres -d vipassist

# Backup do banco
docker exec vipassist-postgres pg_dump -U postgres vipassist > backup.sql

# Restaurar backup
docker exec -i vipassist-postgres psql -U postgres vipassist < backup.sql
```

### **Limpeza**

```bash
# Parar e remover containers
docker-compose down

# Remover volumes (APAGA DADOS!)
docker-compose down -v

# Limpar tudo do Docker
docker system prune -a
```

---

## 🌐 Acesso

Após iniciar os containers:

- **Aplicação**: http://localhost:3000
- **PostgreSQL**: `localhost:5432`
  - Usuário: `postgres`
  - Senha: `postgres`
  - Database: `vipassist`

---

## 🔍 Troubleshooting

### **Porta já em uso**

Se a porta 3000 ou 5432 já estiver em uso:

1. Edite `.env.local`:
```env
APP_PORT=3001
POSTGRES_PORT=5433
```

2. Reinicie:
```bash
docker-compose down
docker-compose up -d
```

### **Erro de build**

```bash
# Limpar cache e reconstruir
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

### **Banco não conecta**

```bash
# Ver logs do PostgreSQL
docker-compose logs postgres

# Verificar se está rodando
docker-compose ps

# Reiniciar apenas o banco
docker-compose restart postgres
```

### **Aplicação não inicia**

```bash
# Ver logs detalhados
docker-compose logs -f app

# Verificar healthcheck
docker inspect vipassist-app | grep -A 10 Health

# Entrar no container
docker exec -it vipassist-app sh
```

---

## 🔄 Migração de Dados

### **Do Local para Docker**

```bash
# 1. Exportar dados locais
pg_dump -U postgres vipassist > backup-local.sql

# 2. Importar no Docker
docker exec -i vipassist-postgres psql -U postgres vipassist < backup-local.sql
```

### **Do Docker para Local**

```bash
# 1. Exportar do Docker
docker exec vipassist-postgres pg_dump -U postgres vipassist > backup-docker.sql

# 2. Importar localmente
psql -U postgres vipassist < backup-docker.sql
```

---

## 🚀 Deploy em VPS

### **1. Preparar VPS**

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### **2. Enviar arquivos**

```bash
# Via Git
git clone seu-repositorio
cd vipassist

# Ou via SCP
scp -r . user@vps:/path/to/vipassist
```

### **3. Configurar ambiente**

```bash
# Copiar e editar .env
cp .env.docker .env.local
nano .env.local

# Alterar:
# - NEXTAUTH_URL para seu domínio
# - NEXTAUTH_SECRET (gerar novo)
# - Senhas do PostgreSQL
```

### **4. Iniciar**

```bash
docker-compose up --build -d
```

### **5. Configurar Nginx (Opcional)**

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📊 Monitoramento

### **Recursos dos Containers**

```bash
# Ver uso de CPU/Memória
docker stats

# Ver apenas VIP Assist
docker stats vipassist-app vipassist-postgres
```

### **Healthchecks**

```bash
# Status da aplicação
curl http://localhost:3000/api/health

# Status do PostgreSQL
docker exec vipassist-postgres pg_isready -U postgres
```

---

## 🔐 Segurança

### **Produção**

1. **Altere todas as senhas**
```env
POSTGRES_PASSWORD=senha-forte-aqui
NEXTAUTH_SECRET=secret-gerado-com-openssl
```

2. **Gere novo NEXTAUTH_SECRET**
```bash
openssl rand -base64 32
```

3. **Não exponha portas desnecessárias**
```yaml
# Remover do docker-compose.yml em produção:
ports:
  - "5432:5432"  # Comentar esta linha
```

4. **Use HTTPS**
- Configure SSL/TLS no Nginx
- Use Let's Encrypt para certificados gratuitos

---

## 📚 Estrutura de Arquivos

```
VIP ASSIST/
├── docker-compose.yml      # Configuração Docker
├── Dockerfile              # Build da aplicação
├── .env.docker            # Template de variáveis
├── docker-start.bat       # Script de início (Windows)
├── docker-stop.bat        # Script de parada (Windows)
├── DOCKER-README.md       # Este arquivo
└── backups/               # Backups do banco (criado automaticamente)
```

---

## ✅ Checklist de Deploy

- [ ] Docker instalado e rodando
- [ ] Arquivo `.env.local` configurado
- [ ] Senhas alteradas para produção
- [ ] NEXTAUTH_SECRET gerado
- [ ] NEXTAUTH_URL configurado com domínio real
- [ ] Portas disponíveis (3000, 5432)
- [ ] Firewall configurado
- [ ] SSL/TLS configurado (produção)
- [ ] Backups automáticos configurados
- [ ] Monitoramento ativo

---

## 🆘 Suporte

**Problemas comuns:**
- Verifique os logs: `docker-compose logs -f`
- Reinicie os containers: `docker-compose restart`
- Reconstrua se necessário: `docker-compose up --build -d`

**Documentação:**
- Docker: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
- PostgreSQL: https://www.postgresql.org/docs

---

## 📝 Notas

- Os dados do PostgreSQL são persistidos em um volume Docker
- Mesmo após `docker-compose down`, os dados permanecem
- Para apagar tudo: `docker-compose down -v` (⚠️ CUIDADO!)
- A aplicação aguarda o banco estar pronto antes de iniciar
- Healthchecks garantem que os serviços estão funcionando

---

**Desenvolvido para funcionar identicamente ao ambiente local! 🚀**
