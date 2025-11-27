# Correção de Problema de Login em Produção

## 🔴 Problema Identificado

O sistema não está fazendo login em produção. Ao inserir credenciais válidas, a página permanece na tela de login sem redirecionar para o painel.

### Erros no Console do Navegador

```
The resource from "http://185.215.167.39/_next/static/css/c39257bff099f6fb.css" 
was blocked due to MIME type ("text/css") mismatch (X-Content-Type-Options: nosniff).

Loading failed for the <script> with source 
"http://185.215.167.39/_next/static/css/c39257bff099f6fb.css"
```

## 🔍 Diagnóstico

Após executar o script de diagnóstico, identificamos o **problema real**:

**❌ ERRO CRÍTICO**: A tabela no banco de dados se chama `usuarios` (minúsculo), mas o Prisma/código está procurando por `Usuario` (com U maiúsculo)!

```
ERROR: relation "Usuario" does not exist
LINE 1: SELECT id, nome, email, role, ativo FROM "Usuario" LIMIT 5;
```

Outros problemas identificados:
1. **Script de rebuild** - Usa `docker-compose` mas o servidor tem `docker compose` (sem hífen)
2. **Arquivos estáticos** - Estão sendo servidos corretamente (build existe)
3. **Variáveis de ambiente** - Estão corretas

## ✅ Solução

### Passo 1: Diagnóstico Completo

Execute o script de diagnóstico na VPS:

```bash
cd /caminho/do/projeto
chmod +x scripts/fix-production-login.sh
./scripts/fix-production-login.sh
```

Este script irá verificar:
- Status dos containers
- Logs da aplicação
- Se o diretório `.next` existe
- Variáveis de ambiente
- Conexão com banco de dados
- Usuários cadastrados

### Passo 2: Corrigir Nome da Tabela (SOLUÇÃO PRINCIPAL)

O problema é que a tabela se chama `usuarios` mas o código espera `Usuario`:

```bash
cd /opt/vipassist
chmod +x scripts/fix-table-name.sh
./scripts/fix-table-name.sh
```

Este script irá:
1. Verificar tabelas existentes
2. Renomear `usuarios` para `Usuario`
3. Verificar usuários na tabela
4. Reiniciar a aplicação

### Passo 2b: Rebuild da Aplicação (Se Necessário)

Se após corrigir a tabela ainda houver problemas:

```bash
cd /opt/vipassist
chmod +x scripts/rebuild-production.sh
./scripts/rebuild-production.sh
```

**NOTA**: O script foi corrigido para usar `docker compose` (sem hífen)

### Passo 3: Verificar Variáveis de Ambiente

Certifique-se que o arquivo `.env` na VPS contém:

```env
# Database
POSTGRES_USER=vipassist
POSTGRES_PASSWORD=sua_senha_segura
POSTGRES_DB=vipassist
DATABASE_URL=postgresql://vipassist:sua_senha_segura@postgres:5432/vipassist

# NextAuth
NEXTAUTH_URL=http://185.215.167.39
NEXTAUTH_SECRET=sua_chave_secreta_muito_longa_e_aleatoria

# Google Maps (opcional)
GOOGLE_MAPS_API_KEY=sua_chave_api

# Backup (opcional)
BACKUP_ENCRYPTION_KEY=sua_chave_de_criptografia
```

**IMPORTANTE**: O `NEXTAUTH_URL` deve ser exatamente o IP/domínio que você está acessando.

### Passo 4: Verificar se Há Usuários no Banco

Se não houver usuários cadastrados:

```bash
# Criar usuário admin padrão
docker exec -it vipassist-app npx prisma db seed
```

Ou criar manualmente via SQL:

```bash
docker exec -it vipassist-postgres psql -U vipassist -d vipassist
```

```sql
-- Criar usuário admin (senha: admin123)
INSERT INTO "Usuario" (id, nome, email, senha, role, ativo, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Administrador',
  'admin@vipassist.com',
  '$2a$10$rN8YvM0qhYxkqYxqYxqYxOeKqYxqYxqYxqYxqYxqYxqYxqYxqYxqY',
  'ADMIN',
  true,
  NOW(),
  NOW()
);
```

## 🔧 Comandos Úteis para Diagnóstico

### Ver logs em tempo real
```bash
docker logs -f vipassist-app
```

### Verificar status dos containers
```bash
docker-compose -f docker-compose.full.yml ps
```

### Testar endpoint de health
```bash
curl http://localhost:3000/api/health
```

### Verificar variáveis de ambiente
```bash
docker exec vipassist-app printenv | grep -E "NODE_ENV|NEXTAUTH"
```

### Verificar se o build existe
```bash
docker exec vipassist-app ls -la /app/.next/
```

### Reiniciar apenas a aplicação
```bash
docker-compose -f docker-compose.full.yml restart app
```

## 🎯 Causas Comuns e Soluções

### 1. ⚠️ Nome da tabela incorreto (PROBLEMA ATUAL)
**Sintoma**: `ERROR: relation "Usuario" does not exist`
**Solução**: Execute `./scripts/fix-table-name.sh`

### 2. docker-compose vs docker compose
**Sintoma**: `docker-compose: command not found`
**Solução**: Use `docker compose` (sem hífen) - scripts já corrigidos

### 3. NEXTAUTH_URL incorreto
**Sintoma**: Login não funciona, mas página carrega
**Solução**: Corrija no `.env` e reinicie: `docker compose -f docker-compose.full.yml restart app`

### 4. Sem usuários no banco
**Sintoma**: "Credenciais inválidas" mesmo com dados corretos
**Solução**: Crie usuário admin com o comando seed

### 5. Banco de dados não conectado
**Sintoma**: Erros de conexão nos logs
**Solução**: Verifique `DATABASE_URL` e se o PostgreSQL está rodando

### 6. NEXTAUTH_SECRET não configurado
**Sintoma**: Erros de JWT nos logs
**Solução**: Gere um secret: `openssl rand -base64 32` e adicione ao `.env`

### 7. Next.js não buildado
**Sintoma**: Erros de MIME type, arquivos CSS/JS não carregam
**Solução**: Execute `./scripts/rebuild-production.sh`

## 📋 Checklist de Verificação

- [ ] Containers estão rodando (`docker ps`)
- [ ] Diretório `.next` existe no container
- [ ] `NODE_ENV=production` está configurado
- [ ] `NEXTAUTH_URL` está correto (http://185.215.167.39)
- [ ] `NEXTAUTH_SECRET` está configurado
- [ ] `DATABASE_URL` está correto
- [ ] PostgreSQL está respondendo
- [ ] Há usuários cadastrados no banco
- [ ] Endpoint `/api/health` responde
- [ ] Logs não mostram erros críticos

## 🚀 Após a Correção

1. Acesse: `http://185.215.167.39`
2. Faça login com as credenciais do usuário admin
3. Verifique se redireciona para o painel
4. Teste funcionalidades básicas

## 📞 Suporte

Se o problema persistir após seguir todos os passos:

1. Colete os logs completos:
```bash
docker logs vipassist-app > app.log 2>&1
docker logs vipassist-nginx > nginx.log 2>&1
docker logs vipassist-postgres > postgres.log 2>&1
```

2. Verifique o console do navegador (F12) para erros JavaScript

3. Teste a API diretamente:
```bash
curl -X POST http://185.215.167.39/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vipassist.com","password":"admin123"}'
```

## 🔐 Segurança

Após resolver o problema:

1. **Mude a senha padrão** do usuário admin
2. **Configure HTTPS** com certificado SSL
3. **Atualize NEXTAUTH_URL** para usar HTTPS
4. **Revise as variáveis de ambiente** para garantir que não há senhas expostas

---

**Data**: 27/11/2025
**Versão**: 1.0
**Status**: Documentado
