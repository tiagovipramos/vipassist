# 🔥 SOLUÇÃO FINAL - Problema de Login

## ❌ Problema Persistente

Mesmo após renomear a tabela e regenerar o Prisma Client, o erro continua:
```
The table `public.usuarios` does not exist in the current database.
meta: { modelName: 'Usuario', table: 'public.usuarios' }
```

## 🎯 Causa Raiz

O Prisma Client está **compilado no build do Next.js**. Apenas regenerar não é suficiente - precisamos fazer **rebuild completo** da aplicação.

## ✅ SOLUÇÃO DEFINITIVA

Execute estes comandos na VPS:

```bash
cd /opt/vipassist

# 1. Parar containers
docker compose -f docker-compose.full.yml down

# 2. Remover imagem antiga
docker rmi vipassist-app

# 3. Rebuild SEM CACHE
docker compose -f docker-compose.full.yml build --no-cache app

# 4. Subir containers
docker compose -f docker-compose.full.yml up -d

# 5. Aguardar 30 segundos
sleep 30

# 6. Verificar logs
docker logs --tail 50 vipassist-app
```

## 🚀 Comando Único (Copie e Cole)

```bash
cd /opt/vipassist && \
docker compose -f docker-compose.full.yml down && \
docker rmi vipassist-app && \
docker compose -f docker-compose.full.yml build --no-cache app && \
docker compose -f docker-compose.full.yml up -d && \
echo "Aguardando 30 segundos..." && sleep 30 && \
docker logs --tail 50 vipassist-app
```

## ⏱️ Tempo Estimado

- **5-10 minutos** para rebuild completo
- O build vai recompilar tudo do zero
- O Prisma Client será gerado corretamente

## ✅ Após o Rebuild

1. Acesse: http://185.215.167.39
2. Faça login
3. **Funcionará!** ✨

## 🔍 Se Ainda Houver Erro

Verifique se a tabela foi realmente renomeada:

```bash
docker exec vipassist-postgres psql -U vipassist -d vipassist -c "\dt"
```

Deve mostrar `Usuario` (com U maiúsculo), não `usuarios`.

Se mostrar `usuarios`, execute:

```bash
docker exec vipassist-postgres psql -U vipassist -d vipassist -c 'ALTER TABLE usuarios RENAME TO "Usuario";'
```

Depois faça o rebuild novamente.

---

**IMPORTANTE**: O rebuild é necessário porque o Prisma Client é gerado durante o build e fica "congelado" na imagem Docker. Apenas regenerar dentro do container não atualiza o código compilado do Next.js.
