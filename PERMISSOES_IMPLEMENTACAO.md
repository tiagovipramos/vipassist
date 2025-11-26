# 🔐 Implementação do Sistema de Permissões

## 📋 Visão Geral

Sistema completo de permissões com auto-save conectado ao banco de dados SQLite via Prisma.

## 🗄️ Estrutura do Banco de Dados

### Modelo Permissao (Prisma)

```prisma
model Permissao {
  id          String   @id @default(cuid())
  role        String   // admin, gestor, atendente
  modulo      String   // dashboard, chamados, mapa, prestadores, clientes, etc
  permissao   String   // criar_chamado, lista_chamados, etc
  ativo       Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([role, modulo, permissao])
  @@map("permissoes")
}
```

## 🎯 Permissões por Cargo

### Administrador (admin)
- ✅ Acesso total a todos os módulos
- ✅ Gerenciamento de usuários e permissões
- ✅ Logs e auditoria
- ✅ Configurações do sistema

### Gestor (gestor)
- ✅ Dashboard
- ✅ Operações (Chamados, Mapa, Prestadores, Clientes)
- ✅ Gestão (Financeiro, Relatórios)
- ✅ Logs e Segurança (visualização)
- ❌ Gerenciamento de usuários e permissões

### Atendente (atendente)
- ✅ Dashboard
- ✅ Operações básicas (Chamados, Mapa, Prestadores, Clientes)
- ❌ Financeiro
- ❌ Relatórios
- ❌ Administrativo
- ✅ Ajuda

## 🔧 Implementação

### 1. Atualizar Schema Prisma

Adicionar o modelo `Permissao` ao `prisma/schema.prisma`

### 2. Migração do Banco

```bash
npx prisma migrate dev --name add_permissoes
npx prisma generate
```

### 3. API Endpoints

#### GET /api/permissoes
- Retorna todas as permissões do sistema
- Agrupa por cargo (role)

#### GET /api/permissoes/[role]
- Retorna permissões de um cargo específico

#### PUT /api/permissoes
- Atualiza uma permissão específica
- Body: `{ role, modulo, permissao, ativo }`

#### POST /api/permissoes/seed
- Popula permissões padrão no banco

### 4. Frontend (Auto-save)

#### Estado
```typescript
const [permissoes, setPermissoes] = useState<Record<string, Record<string, boolean>>>({});
const [salvando, setSalvando] = useState(false);
```

#### Handler onChange
```typescript
const handlePermissaoChange = async (role: string, chave: string, valor: boolean) => {
  // Atualizar estado local imediatamente
  setPermissoes(prev => ({
    ...prev,
    [role]: {
      ...prev[role],
      [chave]: valor
    }
  }));
  
  // Salvar no backend (debounced)
  await salvarPermissao(role, chave, valor);
};
```

## 📊 Estrutura de Chaves

### Formato: `modulo.permissao`

Exemplos:
- `geral.dashboard`
- `operacional.chamados`
- `operacional.criar_chamado`
- `operacional.lista_chamados`
- `operacional.mapa`
- `operacional.prestadores`
- `operacional.clientes`
- `gestao.financeiro`
- `gestao.relatorios`
- `administrativo.usuarios`
- `administrativo.logs`
- `administrativo.seguranca`
- `suporte.ajuda`
- `suporte.api`

## ✅ Checklist de Implementação

- [ ] Atualizar schema Prisma
- [ ] Criar migração
- [ ] Criar API /api/permissoes
- [ ] Criar API /api/permissoes/[role]
- [ ] Criar API /api/permissoes/seed
- [ ] Implementar auto-save no frontend
- [ ] Adicionar feedback visual (loading, sucesso, erro)
- [ ] Testar todas as operações
- [ ] Popular permissões padrão

## 🚀 Próximos Passos

1. Implementar middleware de verificação de permissões
2. Proteger rotas baseado em permissões
3. Adicionar auditoria de mudanças de permissões
4. Implementar cache de permissões
