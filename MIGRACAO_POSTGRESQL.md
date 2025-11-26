# 🔄 Guia de Migração para PostgreSQL

## ✅ Alterações Já Realizadas

Todas as alterações de código foram concluídas com sucesso:

1. ✅ Schema do Prisma atualizado para PostgreSQL
2. ✅ Campos JSON convertidos (servicos, metadados)
3. ✅ Arquivo .env configurado
4. ✅ Código da aplicação atualizado (removido JSON.parse/stringify)

## 📋 Próximos Passos (Você Precisa Executar)

### Opção 1: Usando PostgreSQL Local (Recomendado se já tiver instalado)

Se você já tem PostgreSQL instalado na sua máquina:

1. **Inicie o serviço PostgreSQL**
   - Windows: Abra "Serviços" e inicie "PostgreSQL"
   - Ou use pgAdmin para iniciar o servidor

2. **Crie o banco de dados** (se necessário)
   ```sql
   CREATE DATABASE vipassist;
   ```

3. **Execute a migration**
   ```bash
   npx prisma migrate dev --name migrate_to_postgresql
   ```

4. **Regenere o Prisma Client**
   ```bash
   npx prisma generate
   ```

### Opção 2: Usando Docker (Se preferir)

1. **Inicie o Docker Desktop**
   - Abra o Docker Desktop e aguarde inicializar completamente

2. **Execute o container PostgreSQL**
   ```bash
   docker run --name vipassist-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=vipassist -p 5432:5432 -d postgres
   ```

3. **Aguarde alguns segundos** para o PostgreSQL inicializar

4. **Execute a migration**
   ```bash
   npx prisma migrate dev --name migrate_to_postgresql
   ```

5. **Regenere o Prisma Client**
   ```bash
   npx prisma generate
   ```

### Opção 3: Usando PostgreSQL em Nuvem

Se preferir usar um serviço em nuvem (Supabase, Railway, Neon, etc.):

1. **Crie um banco PostgreSQL** no serviço escolhido

2. **Copie a connection string** fornecida pelo serviço

3. **Atualize o .env**
   ```env
   DATABASE_URL="sua-connection-string-aqui"
   ```

4. **Execute a migration**
   ```bash
   npx prisma migrate dev --name migrate_to_postgresql
   ```

5. **Regenere o Prisma Client**
   ```bash
   npx prisma generate
   ```

## 🔍 Verificação

Após executar os comandos, verifique se tudo funcionou:

```bash
# Verificar se o Prisma Client foi gerado
npx prisma studio

# Ou teste a conexão
npx prisma db pull
```

## ⚙️ Configuração Atual do .env

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vipassist?schema=public"
```

**Ajuste conforme sua configuração:**
- `postgres:postgres` = usuário:senha
- `localhost:5432` = host:porta
- `vipassist` = nome do banco

## 🎯 Benefícios da Migração

- ✅ Melhor performance em produção
- ✅ Suporte a múltiplas conexões simultâneas
- ✅ Tipo JSON nativo (mais eficiente)
- ✅ Recursos avançados de indexação
- ✅ Melhor para escalabilidade

## ❓ Problemas Comuns

### Erro: "Can't reach database server"
- **Solução**: Certifique-se que o PostgreSQL está rodando
- Verifique se a porta 5432 está disponível
- Teste a conexão: `psql -h localhost -U postgres`

### Erro: "Database does not exist"
- **Solução**: Crie o banco manualmente:
  ```sql
  CREATE DATABASE vipassist;
  ```

### Erro: "Authentication failed"
- **Solução**: Verifique usuário e senha no .env
- Confirme as credenciais do PostgreSQL

## 📞 Suporte

Se encontrar algum problema:
1. Verifique os logs do PostgreSQL
2. Confirme que o serviço está rodando
3. Teste a connection string manualmente

---

**Status**: Código 100% pronto para PostgreSQL ✅
**Aguardando**: Inicialização do banco de dados e execução da migration
