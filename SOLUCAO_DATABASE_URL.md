# 🔧 Solução para Erro de Autenticação PostgreSQL

## ❌ Problema

```
Error: P1000: Authentication failed against database server at `postgres`
```

## 🔍 Causa

O arquivo `.env` existente na VPS tem credenciais antigas ou incorretas. O script não sobrescreve o `.env` existente, apenas atualiza algumas linhas com `sed`.

## ✅ Solução Manual (Execute na VPS)

### 1. Parar os containers
```bash
cd /opt/vipassist
docker compose -f docker-compose.full.yml down
```

### 2. Remover o .env antigo
```bash
rm .env
```

### 3. Copiar o exemplo
```bash
cp .env.production.example .env
```

### 4. Ver a senha gerada
```bash
cat /root/vipassist-credentials.txt
```

### 5. Editar o .env manualmente
```bash
nano .env
```

Atualize estas linhas com a senha do arquivo de credenciais:

```env
DATABASE_URL="postgresql://vipassist:SENHA_AQUI@postgres:5432/vipassist?schema=public"
POSTGRES_PASSWORD="SENHA_AQUI"
NEXTAUTH_SECRET="SECRET_AQUI"
BACKUP_ENCRYPTION_KEY="KEY_AQUI"
```

**IMPORTANTE:** Use `postgres` (não `localhost`) no DATABASE_URL!

### 6. Rebuild e restart
```bash
docker compose -f docker-compose.full.yml build
docker compose -f docker-compose.full.yml up -d
```

### 7. Aplicar migrations
```bash
docker compose -f docker-compose.full.yml exec app npm run prisma:migrate
```

### 8. Verificar
```bash
docker compose -f docker-compose.full.yml ps
docker compose -f docker-compose.full.yml logs app
```

---

## 🚀 Solução Automática (Atualização do Script)

O script precisa ser modificado para:

1. **Sempre remover o .env antigo** antes de copiar o exemplo
2. **Ou usar um .env.tmp** e depois mover para .env

### Opção 1: Remover .env antigo
```bash
# No script, trocar:
if [ ! -f ".env" ]; then
    cp .env.production.example .env
else
    log_info "Arquivo .env já existe"
fi

# Por:
rm -f .env
cp .env.production.example .env
log_success "Arquivo .env criado"
```

### Opção 2: Usar arquivo temporário
```bash
# Copiar para temp
cp .env.production.example .env.tmp

# Atualizar o temp
sed -i "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=\"$POSTGRES_PASSWORD\"|" .env.tmp
sed -i "s|^NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=\"$NEXTAUTH_SECRET\"|" .env.tmp
sed -i "s|^BACKUP_ENCRYPTION_KEY=.*|BACKUP_ENCRYPTION_KEY=\"$BACKUP_ENCRYPTION_KEY\"|" .env.tmp
sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"postgresql://vipassist:$POSTGRES_PASSWORD@postgres:5432/vipassist?schema=public\"|" .env.tmp

# Mover para .env
mv .env.tmp .env
```

---

## 📋 Checklist de Verificação

- [ ] DATABASE_URL usa `postgres` (não `localhost`)
- [ ] POSTGRES_PASSWORD está correto
- [ ] Senha não tem caracteres especiais problemáticos (`/`, `+`, `=`)
- [ ] Containers foram recriados após mudança no .env
- [ ] PostgreSQL está healthy (`docker compose ps`)

---

## 🐛 Debug

### Ver o .env atual
```bash
cat /opt/vipassist/.env | grep -E "(DATABASE_URL|POSTGRES_PASSWORD)"
```

### Ver logs do PostgreSQL
```bash
docker compose -f docker-compose.full.yml logs postgres
```

### Ver logs da aplicação
```bash
docker compose -f docker-compose.full.yml logs app
```

### Testar conexão manualmente
```bash
docker compose -f docker-compose.full.yml exec postgres psql -U vipassist -d vipassist
```

---

## ✅ Resultado Esperado

Após aplicar a solução, você deve ver:

```
> prisma migrate deploy

Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "vipassist", schema "public" at "postgres:5432"

1 migration found in prisma/migrations

Applying migration `20251123024555_init_postgresql`

The following migration(s) have been applied:

migrations/
  └─ 20251123024555_init_postgresql/
    └─ migration.sql

All migrations have been successfully applied.
