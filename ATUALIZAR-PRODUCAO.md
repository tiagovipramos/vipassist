# 🚀 Como Atualizar o Servidor de Produção

## ⚠️ IMPORTANTE
O código foi atualizado no GitHub, mas o servidor https://conectiva24h.com.br ainda está rodando a versão antiga.

## 📋 Passos para Atualizar

### Opção 1: Via SSH (Recomendado)

```bash
# 1. Conectar ao servidor
ssh usuario@conectiva24h.com.br

# 2. Navegar até o diretório do projeto
cd /caminho/do/projeto/vipassist

# 3. Fazer backup (opcional mas recomendado)
cp .env .env.backup

# 4. Atualizar o código
git pull origin master

# 5. Reconstruir e reiniciar os containers Docker
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# 6. Verificar os logs
docker-compose logs -f app
```

### Opção 2: Via Painel de Controle

Se você tem acesso a um painel de controle (cPanel, Plesk, etc.):

1. Acesse o gerenciador de arquivos ou Git
2. Execute um "pull" do repositório
3. Reinicie a aplicação/containers

### Opção 3: Deploy Automático

Se você configurou CI/CD (GitHub Actions, por exemplo):

1. O deploy pode ser automático após o push
2. Verifique o status do workflow no GitHub
3. Aguarde a conclusão do deploy

## 🔍 Como Verificar se Funcionou

Após atualizar, teste:

1. Acesse: https://conectiva24h.com.br
2. Faça login
3. Clique no avatar do usuário → API
4. Tente salvar as chaves API
5. Deve funcionar sem erros!

## 🐛 Se Ainda Não Funcionar

Verifique os logs do servidor:

```bash
# Ver logs da aplicação
docker-compose logs -f app

# Ver logs do Nginx (se aplicável)
docker-compose logs -f nginx

# Ver todos os logs
docker-compose logs -f
```

## 📝 Arquivos Atualizados

Os seguintes arquivos foram criados/modificados:

1. ✅ `src/app/api/configuracoes/api-keys/route.ts` (NOVO)
2. ✅ `src/componentes/configuracoes/ModalConfiguracoesAPI.tsx` (ATUALIZADO)
3. ✅ `src/componentes/layout/Header.tsx` (ATUALIZADO - botão Sair)
4. ✅ `update-production.bat` (NOVO)

## 💡 Dica

Se você não tem acesso SSH ao servidor, entre em contato com o administrador do servidor ou provedor de hospedagem para fazer o deploy das atualizações.

---

**Última atualização:** 27/11/2025
**Commits:** `8ef70ae`, `ac6d716`
