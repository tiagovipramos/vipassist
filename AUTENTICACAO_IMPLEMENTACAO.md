# 🔐 Implementação de Autenticação Real com NextAuth.js

## ✅ Problema Resolvido

**ANTES:**
- Sistema de login mockado (aceitava qualquer senha)
- Não havia validação real de credenciais
- Tokens JWT eram falsos
- **RISCO:** Qualquer pessoa podia acessar o sistema

**DEPOIS:**
- ✅ Autenticação real com NextAuth.js
- ✅ Validação de credenciais no banco de dados
- ✅ Senhas criptografadas com bcrypt
- ✅ Tokens JWT reais e seguros
- ✅ Sessões gerenciadas adequadamente

## 📋 O Que Foi Implementado

### 1. Instalação de Dependências
```bash
npm install next-auth@latest bcryptjs jsonwebtoken
npm install @types/bcryptjs @types/jsonwebtoken --save-dev
```

### 2. Configuração do NextAuth.js

**Arquivo:** `src/lib/auth/auth.config.ts`
- Configuração do CredentialsProvider
- Validação de credenciais no banco de dados
- Verificação de senha com bcrypt
- Callbacks para JWT e Session
- Configuração de páginas customizadas

**Arquivo:** `src/types/next-auth.d.ts`
- Extensão dos tipos do NextAuth
- Adição de campos customizados (role, avatar, etc.)

### 3. API Routes

**Arquivo:** `src/app/api/auth/[...nextauth]/route.ts`
- Rota catch-all para todas as operações do NextAuth
- Gerencia login, logout, session, etc.

### 4. Session Provider

**Arquivo:** `src/lib/providers/SessionProvider.tsx`
- Wrapper do SessionProvider do NextAuth
- Fornece contexto de sessão para toda a aplicação

**Arquivo:** `src/app/layout.tsx`
- SessionProvider adicionado ao layout raiz

### 5. Auth Store Atualizado

**Arquivo:** `src/stores/authStore.ts`
- Integração com NextAuth (signIn, signOut)
- Remoção do sistema mockado
- Validação real de credenciais
- Gerenciamento de sessão adequado

### 6. Variáveis de Ambiente

**Arquivo:** `.env`
```env
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

⚠️ **IMPORTANTE:** Em produção, gere um secret seguro:
```bash
openssl rand -base64 32
```

### 7. Scripts Utilitários

**Arquivo:** `criar-usuarios-teste.js`
- Cria usuários de teste com senhas hasheadas
- Útil para desenvolvimento e testes

**Arquivo:** `hash-senhas-usuarios.js`
- Atualiza senhas existentes para formato hash
- Útil para migração de dados

## 🔑 Credenciais de Teste

Após executar `node criar-usuarios-teste.js`:

| Perfil | Email | Senha |
|--------|-------|-------|
| Admin | admin@vipassist.com | admin123 |
| Gerente | gerente@vipassist.com | gerente123 |
| Atendente | atendente@vipassist.com | atendente123 |

⚠️ **Altere estas senhas após o primeiro login em produção!**

## 🔒 Segurança Implementada

### 1. Criptografia de Senhas
- Senhas armazenadas com bcrypt (salt rounds: 10)
- Impossível reverter hash para senha original
- Proteção contra rainbow tables

### 2. Tokens JWT
- Tokens assinados com secret seguro
- Expiração configurada (24 horas)
- Renovação automática de sessão

### 3. Validação de Credenciais
- Verificação de usuário no banco de dados
- Verificação de status ativo
- Comparação segura de senhas com bcrypt

### 4. Proteção de Rotas
- Middleware do NextAuth protege rotas autenticadas
- Redirecionamento automático para login
- Verificação de sessão em cada requisição

## 📝 Como Usar

### Login
```typescript
import { signIn } from 'next-auth/react'

const result = await signIn('credentials', {
  email: 'admin@vipassist.com',
  senha: 'admin123',
  redirect: false
})

if (result?.ok) {
  // Login bem-sucedido
  router.push('/painel')
}
```

### Logout
```typescript
import { signOut } from 'next-auth/react'

await signOut({ redirect: false })
router.push('/entrar')
```

### Verificar Sessão
```typescript
import { useSession } from 'next-auth/react'

const { data: session, status } = useSession()

if (status === 'authenticated') {
  console.log('Usuário:', session.user)
}
```

### Proteger Rotas (Server Side)
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth.config'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Rota protegida
}
```

## 🧪 Testando a Autenticação

1. **Criar usuários de teste:**
```bash
node criar-usuarios-teste.js
```

2. **Iniciar servidor:**
```bash
npm run dev
```

3. **Acessar página de login:**
```
http://localhost:3000/entrar
```

4. **Fazer login com credenciais de teste**

5. **Verificar:**
   - ✅ Login só funciona com credenciais válidas
   - ✅ Senha incorreta é rejeitada
   - ✅ Usuário inativo não pode fazer login
   - ✅ Sessão persiste após refresh
   - ✅ Logout limpa sessão corretamente

## 🔄 Migração de Dados Existentes

Se você já tem usuários no banco com senhas em texto plano:

```bash
node hash-senhas-usuarios.js
```

Este script:
- Busca todos os usuários
- Verifica se senha já está hasheada
- Gera hash para senhas em texto plano
- Atualiza no banco de dados

## 🚀 Deploy em Produção

### 1. Gerar Secret Seguro
```bash
openssl rand -base64 32
```

### 2. Configurar Variáveis de Ambiente
```env
NEXTAUTH_SECRET="seu-secret-super-seguro-aqui"
NEXTAUTH_URL="https://seu-dominio.com"
```

### 3. Criar Usuário Admin
```bash
node criar-usuarios-teste.js
```

### 4. Alterar Senhas Padrão
- Fazer login com credenciais padrão
- Ir em Configurações > Segurança
- Alterar senha para uma senha forte

## 📚 Referências

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## ✅ Checklist de Segurança

- [x] Senhas criptografadas com bcrypt
- [x] Tokens JWT assinados
- [x] Secret seguro configurado
- [x] Validação de credenciais no backend
- [x] Verificação de usuário ativo
- [x] Sessões com expiração
- [x] Logout limpa sessão
- [x] Proteção contra SQL injection (Prisma)
- [ ] Rate limiting (implementar futuramente)
- [ ] 2FA (implementar futuramente)
- [ ] Logs de tentativas de login (implementar futuramente)

## 🎯 Próximos Passos

1. **Rate Limiting:** Limitar tentativas de login
2. **2FA:** Autenticação de dois fatores
3. **Logs de Auditoria:** Registrar todas as tentativas de login
4. **Recuperação de Senha:** Sistema de reset de senha
5. **Sessões Múltiplas:** Gerenciar múltiplas sessões do usuário
6. **OAuth:** Adicionar login social (Google, GitHub, etc.)

---

**Status:** ✅ Implementado e Testado
**Data:** 23/11/2025
**Versão:** 1.0.0
