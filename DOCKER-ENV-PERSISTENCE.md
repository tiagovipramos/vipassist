# 🔧 Persistência de Configurações no Docker

## ⚠️ Problema Identificado

Quando você salvava as chaves API pelo modal de configurações, elas desapareciam após reiniciar o Docker. Isso acontecia porque:

1. O modal salvava as chaves no arquivo `.env` do **host**
2. O Docker não tinha acesso a esse arquivo
3. Ao reiniciar, o container usava apenas as variáveis de ambiente do `docker-compose.yml`

## ✅ Solução Implementada

Adicionamos um **volume** no `docker-compose.yml` para montar o arquivo `.env` do host dentro do container:

```yaml
volumes:
  - ./public/fotos:/app/public/fotos
  - app_logs:/app/logs
  - ./.env:/app/.env  # ← NOVO: Persiste o .env
```

## 🚀 Como Usar Agora

### 1. Salvar Configurações

1. Acesse o sistema
2. Clique no avatar → "API"
3. Configure as chaves e o raio de busca
4. Clique em "Salvar"

### 2. Aplicar as Mudanças

**Opção A: Reiniciar apenas o app (mais rápido)**
```bash
docker-compose restart app
```

**Opção B: Recriar o container (recomendado após mudanças)**
```bash
docker-compose down
docker-compose up -d
```

### 3. Verificar se Funcionou

As configurações agora persistem! Você pode verificar:

```bash
# Ver o conteúdo do .env no container
docker exec vipassist-app cat /app/.env

# Ver as variáveis de ambiente carregadas
docker exec vipassist-app env | grep GOOGLE_MAPS
```

## 📋 Configurações Salvas

O modal salva as seguintes variáveis no `.env`:

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Chave da API do Google Maps
- `NEXT_PUBLIC_MAPBOX_TOKEN` - Token do Mapbox
- `GOOGLE_MAPS_SEARCH_RADIUS` - Raio de busca em metros (ex: 50000 = 50km)

## 🔄 Fluxo Completo

```
1. Usuário salva configurações no modal
   ↓
2. API salva no arquivo .env do host
   ↓
3. Docker monta o .env via volume
   ↓
4. Container lê o .env em runtime
   ↓
5. Configurações aplicadas! ✅
```

## ⚙️ Detalhes Técnicos

### Leitura em Runtime

As rotas API leem o `.env` diretamente em cada requisição:

```typescript
// src/app/api/google-maps/buscar/route.ts
function getApiKey(): string | undefined {
  const envPath = path.join(process.cwd(), '.env')
  const envContent = fs.readFileSync(envPath, 'utf-8')
  // ... lê a chave
}
```

Isso significa que **não precisa rebuild** após salvar as configurações!

### Persistência

O arquivo `.env` no host é montado como volume, então:
- ✅ Mudanças no host refletem no container
- ✅ Mudanças no container refletem no host
- ✅ Configurações persistem após restart
- ✅ Configurações persistem após rebuild

## 🐛 Troubleshooting

### As configurações ainda não persistem?

1. **Verifique se o volume está montado:**
   ```bash
   docker inspect vipassist-app | grep -A 5 Mounts
   ```

2. **Verifique se o .env existe no host:**
   ```bash
   ls -la .env
   cat .env
   ```

3. **Recrie os containers:**
   ```bash
   docker-compose down
   docker-compose up -d --force-recreate
   ```

### Erro de permissão?

Se o Docker não conseguir acessar o `.env`:

```bash
# Dar permissão de leitura/escrita
chmod 666 .env

# Ou criar o arquivo se não existir
touch .env
chmod 666 .env
```

## 📝 Notas Importantes

1. **Segurança:** O `.env` está no `.gitignore` e não será commitado
2. **Backup:** Faça backup do `.env` antes de mudanças importantes
3. **Produção:** Em produção, use variáveis de ambiente do servidor ao invés do `.env`

---

**Última atualização:** 27/11/2025
**Commit:** `fix: Adicionar volume para persistir .env no Docker`
