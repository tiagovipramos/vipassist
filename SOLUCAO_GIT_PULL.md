# Solução para Erro no Git Pull

## ❌ Erro Encontrado

```
error: Your local changes to the following files would be overwritten by merge:
        scripts/rebuild-production.sh
Please commit your changes or stash them before you merge.
```

## ✅ Solução Rápida

Execute os seguintes comandos na VPS:

```bash
cd /opt/vipassist

# Opção 1: Descartar mudanças locais e pegar a versão do GitHub
git checkout -- scripts/rebuild-production.sh
git pull origin master

# Opção 2: Salvar mudanças locais temporariamente
git stash
git pull origin master
git stash pop  # Se quiser recuperar as mudanças locais depois

# Opção 3: Forçar pull (CUIDADO: descarta TODAS as mudanças locais)
git reset --hard origin/master
```

## 🚀 Após Resolver o Git Pull

Execute o script de correção:

```bash
chmod +x scripts/fix-table-name.sh
./scripts/fix-table-name.sh
```

## 📝 Comando Completo (Recomendado)

```bash
cd /opt/vipassist
git checkout -- scripts/rebuild-production.sh
git pull origin master
chmod +x scripts/fix-table-name.sh
./scripts/fix-table-name.sh
```

Este comando irá:
1. ✅ Descartar mudanças locais no arquivo problemático
2. ✅ Fazer pull das atualizações
3. ✅ Dar permissão de execução ao script
4. ✅ Executar a correção da tabela
5. ✅ Login funcionará!

---

**Nota**: Se você fez mudanças importantes no arquivo `scripts/rebuild-production.sh` na VPS, use a Opção 2 (git stash) para não perdê-las.
