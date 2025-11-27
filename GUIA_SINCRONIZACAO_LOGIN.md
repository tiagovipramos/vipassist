# 🔄 GUIA DE SINCRONIZAÇÃO - CORREÇÃO DE LOGIN

## 📋 RESUMO DO PROBLEMA IDENTIFICADO

O diagnóstico revelou **redirecionamentos em loop** para `/api/auth/signin?csrf=true`, indicando que o NextAuth está rejeitando as tentativas de login. O problema está na validação de credenciais.

## 🎯 SOLUÇÃO IMPLEMENTADA

Criamos scripts específicos para corrigir o problema:
- **Diagnóstico completo**: `debug-login-completo.sh`
- **Correção automática**: `corrigir-login-nextauth.sh`
- **Teste via Docker**: `teste-frontend-docker.sh`

## 🚀 COMANDOS PARA APLICAR NO VPS

### 1. **Atualizar código no VPS:**
```bash
cd /opt/vipassist
git pull origin master
```

### 2. **Executar correção automática:**
```bash
chmod +x scripts/corrigir-login-nextauth.sh
./scripts/corrigir-login-nextauth.sh
```

### 3. **Se necessário, executar diagnóstico completo:**
```bash
chmod +x scripts/debug-login-completo.sh
./scripts/debug-login-completo.sh
```

## 🔧 COMANDOS PARA AMBIENTE LOCAL

### 1. **Verificar se há diferenças:**
```bash
# Verificar status do Git
git status

# Verificar se está sincronizado com o repositório
git pull origin master
```

### 2. **Se estiver rodando localmente, aplicar a mesma correção:**

#### Para ambiente Docker local:
```bash
# Se usando docker-compose local
docker-compose exec app node -e "
const bcrypt = require('bcryptjs');
console.log('Novo hash:', bcrypt.hashSync('admin123', 10));
"

# Atualizar no banco local (ajustar comando conforme seu setup)
```

#### Para ambiente de desenvolvimento local:
```bash
# Se usando banco local diferente, ajustar conforme necessário
npm run dev
```

## 📊 VERIFICAÇÃO DE SINCRONIZAÇÃO

### **No VPS:**
```bash
# Verificar hash da senha atual
docker compose -f docker-compose.full.yml exec -T postgres psql -U vipassist -d vipassist -c "SELECT LEFT(senha, 10) FROM \"Usuario\" WHERE email = 'admin@vipassist.com';"

# Testar login via API
curl -k https://conectiva24h.com.br/api/auth/session
```

### **No ambiente local:**
```bash
# Verificar se o código está atualizado
git log --oneline -5

# Se rodando localmente, testar endpoints
curl -k http://localhost:3000/api/auth/session
```

## 🔍 DIFERENÇAS ENTRE AMBIENTES

### **VPS (Produção):**
- ✅ PostgreSQL em container Docker
- ✅ HTTPS com SSL
- ✅ Nginx como proxy reverso
- ✅ Domínio: `conectiva24h.com.br`

### **Local (Desenvolvimento):**
- 🔄 Pode usar SQLite ou PostgreSQL local
- 🔄 HTTP sem SSL
- 🔄 Sem proxy (Next.js direto)
- 🔄 Localhost: `http://localhost:3000`

## ⚠️ PONTOS DE ATENÇÃO

### **1. Variáveis de Ambiente:**
Verificar se as variáveis estão corretas em ambos os ambientes:

**VPS (.env):**
```env
NEXTAUTH_URL=https://conectiva24h.com.br
NEXTAUTH_SECRET=[secret_seguro]
DATABASE_URL=postgresql://vipassist:senha@postgres:5432/vipassist
```

**Local (.env.local):**
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[mesmo_secret_ou_diferente]
DATABASE_URL=[sua_string_de_conexao_local]
```

### **2. Banco de Dados:**
- **VPS**: PostgreSQL em container
- **Local**: Pode ser diferente (SQLite, PostgreSQL local, etc.)

### **3. Usuário Admin:**
Garantir que o usuário admin existe em ambos os bancos:

```sql
-- Verificar se existe
SELECT email, nome, role, ativo FROM "Usuario" WHERE email = 'admin@vipassist.com';

-- Se não existir, criar
INSERT INTO "Usuario" (id, nome, email, senha, role, ativo, "createdAt", "updatedAt") 
VALUES (
  gen_random_uuid(), 
  'Administrador', 
  'admin@vipassist.com', 
  '$2b$10$[hash_gerado]', 
  'admin', 
  true, 
  NOW(), 
  NOW()
) ON CONFLICT (email) DO NOTHING;
```

## 🛠️ COMANDOS DE SINCRONIZAÇÃO COMPLETA

### **Para garantir que tudo está igual:**

```bash
# 1. No ambiente local
git pull origin master
git status

# 2. No VPS
cd /opt/vipassist
git pull origin master

# 3. Aplicar correções em ambos
./scripts/corrigir-login-nextauth.sh

# 4. Verificar se funcionou
curl -k [URL]/api/auth/session
```

## 📝 CHECKLIST DE VERIFICAÇÃO

- [ ] ✅ Código sincronizado (git pull em ambos)
- [ ] ✅ Scripts executados no VPS
- [ ] ✅ Usuário admin existe em ambos os bancos
- [ ] ✅ Variáveis de ambiente corretas
- [ ] ✅ Login funcionando no VPS
- [ ] ✅ Login funcionando localmente (se aplicável)
- [ ] ✅ Testes de API respondendo corretamente

## 🆘 TROUBLESHOOTING

### **Se ainda não funcionar:**

1. **Limpar cache do navegador**
2. **Testar em modo anônimo**
3. **Verificar console do navegador (F12)**
4. **Executar diagnóstico completo**: `./scripts/debug-login-completo.sh`
5. **Verificar logs**: `docker compose -f docker-compose.full.yml logs -f app`

### **Comandos úteis:**
```bash
# Ver logs em tempo real
docker compose -f docker-compose.full.yml logs -f app

# Reiniciar aplicação
docker compose -f docker-compose.full.yml restart app

# Verificar containers
docker compose -f docker-compose.full.yml ps

# Testar conectividade do banco
docker compose -f docker-compose.full.yml exec postgres pg_isready -U vipassist
```

---

## 🎯 RESULTADO ESPERADO

Após seguir este guia:
- ✅ Login funcionando no VPS
- ✅ Ambientes sincronizados
- ✅ Usuário admin consegue acessar o sistema
- ✅ Redirecionamentos em loop corrigidos
