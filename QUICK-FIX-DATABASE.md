# 🔧 Solução Rápida - Erro de Conexão com Banco de Dados

## ❌ Problema
```
Can't reach database server at `localhost:5432`
```

A aplicação não consegue conectar ao PostgreSQL porque o banco de dados não está rodando.

---

## ✅ Soluções Disponíveis

### 🚀 SOLUÇÃO 1: Usar Modo Mock (MAIS RÁPIDO)

**Ideal para:** Desenvolvimento de interface, testes rápidos, quando não precisa de dados persistentes

**Como usar:**
```bash
# Execute este comando:
enable-mocks.bat
```

Ou manualmente, crie o arquivo `.env.local` com:
```
NEXT_PUBLIC_USE_MOCKS="true"
```

**Vantagens:**
- ✅ Funciona imediatamente
- ✅ Não precisa de Docker
- ✅ Não precisa de banco de dados
- ✅ Dados mockados para desenvolvimento

**Desvantagens:**
- ❌ Dados não são persistidos
- ❌ Não testa integração real com banco

---

### 🐳 SOLUÇÃO 2: Usar Docker + PostgreSQL (RECOMENDADO)

**Ideal para:** Desenvolvimento completo, testes de integração, dados persistentes

**Pré-requisitos:**
1. Instalar Docker Desktop: https://www.docker.com/products/docker-desktop
2. Iniciar o Docker Desktop e aguardar até estar completamente rodando

**Como usar:**
```bash
# Execute este script que faz tudo automaticamente:
start-dev.bat
```

O script irá:
1. ✅ Verificar se Docker está instalado e rodando
2. ✅ Iniciar container PostgreSQL
3. ✅ Executar migrações do banco
4. ✅ Iniciar a aplicação

**Vantagens:**
- ✅ Banco de dados real
- ✅ Dados persistentes
- ✅ Testa integração completa
- ✅ Ambiente próximo da produção

---

## 🔄 Script Antigo (restart-server.bat)

O script `restart-server.bat` **não gerencia o banco de dados**. Ele apenas:
- Limpa portas
- Para processos Node.js
- Limpa cache do Next.js
- Inicia o frontend

**Use o novo script:** `start-dev.bat` que gerencia tudo!

---

## 📋 Comandos Úteis

### Verificar se Docker está rodando:
```bash
docker ps
```

### Verificar se PostgreSQL está rodando:
```bash
docker ps --filter "name=vipassist-postgres-dev"
```

### Parar PostgreSQL:
```bash
docker stop vipassist-postgres-dev
```

### Iniciar PostgreSQL (se já existe):
```bash
docker start vipassist-postgres-dev
```

### Ver logs do PostgreSQL:
```bash
docker logs vipassist-postgres-dev
```

### Remover container PostgreSQL:
```bash
docker rm -f vipassist-postgres-dev
```

---

## 🆘 Problemas Comuns

### "Docker não está disponível"
- Instale o Docker Desktop
- Ou use o modo mock

### "Docker Desktop não está rodando"
- Abra o Docker Desktop
- Aguarde até o ícone ficar verde
- Execute `start-dev.bat` novamente

### "Erro ao executar migrações"
- O script tentará criar o banco automaticamente
- Se persistir, execute: `npx prisma db push`

### "Porta 5432 já está em uso"
- Você pode ter outro PostgreSQL rodando
- Pare o outro PostgreSQL ou mude a porta no `docker-compose.dev.yml`

---

## 📝 Resumo

| Situação | Solução |
|----------|---------|
| Quero começar AGORA | `enable-mocks.bat` |
| Quero desenvolvimento completo | Instale Docker + `start-dev.bat` |
| Docker já instalado | `start-dev.bat` |
| Já tenho PostgreSQL local | Configure `.env` com sua conexão |

---

## 🎯 Próximos Passos

1. Escolha uma solução acima
2. Execute o script correspondente
3. Acesse http://localhost:3000
4. Faça login e teste a aplicação

**Dúvidas?** Verifique os logs no terminal para mais detalhes.
