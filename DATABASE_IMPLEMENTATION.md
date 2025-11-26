# 🗄️ Implementação do Banco de Dados - VIP ASSIST

## 📋 Visão Geral

Sistema completo de banco de dados implementado com **Prisma ORM** e **SQLite** para persistência de dados.

---

## 🏗️ Arquitetura

### Tecnologias Utilizadas
- **Prisma ORM** v5.22.0 - ORM moderno para Node.js e TypeScript
- **SQLite** - Banco de dados relacional leve e eficiente
- **Next.js API Routes** - Endpoints REST para comunicação

### Estrutura de Arquivos
```
VIP ASSIST/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   ├── dev.db                 # Arquivo do banco SQLite
│   └── migrations/            # Histórico de migrações
├── src/
│   ├── lib/
│   │   └── prisma.ts          # Cliente Prisma singleton
│   └── app/
│       └── api/
│           └── prestadores/
│               ├── route.ts           # GET (listar) e POST (criar)
│               └── [id]/route.ts      # GET, PUT, DELETE por ID
└── .env                       # Variáveis de ambiente
```

---

## 📊 Modelos do Banco de Dados

### 1. **Usuários** (`usuarios`)
Gerenciamento de usuários do sistema (atendentes, supervisores, admins)

**Campos principais:**
- `id`, `nome`, `email`, `senha`, `role`, `ativo`
- Relações: tickets, mensagens

### 2. **Clientes** (`clientes`)
Cadastro de clientes que solicitam serviços

**Campos principais:**
- Dados pessoais: `nome`, `email`, `telefone`, `cpf`
- Endereço completo
- Plano/Seguro: `plano`, `numeroApolice`, `seguradora`
- Relações: tickets, veículos

### 3. **Veículos** (`veiculos`)
Veículos dos clientes

**Campos principais:**
- `placa`, `marca`, `modelo`, `ano`, `cor`
- `renavam`, `chassi`
- Relação: cliente, tickets

### 4. **Prestadores** (`prestadores`) ✅ **IMPLEMENTADO**
Cadastro de prestadores de serviço

**Campos principais:**
- Dados pessoais/empresariais: `nome`, `razaoSocial`, `cpf`, `cnpj`
- Contato: `email`, `telefone`, `celular`
- Endereço completo
- Serviços: JSON array de serviços prestados
- Dados bancários: PIX, banco, agência, conta
- Status: `ativo`, `inativo`, `pendente`, `bloqueado`
- Avaliação: `avaliacaoMedia`, `totalAtendimentos`
- Localização GPS: `latitude`, `longitude`

### 5. **Tickets/Chamados** (`tickets`)
Solicitações de serviço

**Campos principais:**
- `protocolo` único
- Cliente e veículo
- Tipo de serviço e descrição
- Origem e destino (endereços + coordenadas)
- Status e prioridade
- Prestador atribuído
- Valores (cotado e final)
- Tempos de atendimento
- Avaliação do cliente

### 6. **Mensagens** (`mensagens`)
Chat/comunicação dos tickets

**Campos principais:**
- `tipo`: texto, imagem, arquivo, audio
- `conteudo`, `arquivo`
- `lida` (boolean)

### 7. **Pagamentos** (`pagamentos`)
Controle financeiro

**Campos principais:**
- `valor`, `metodoPagamento`
- `status`: pendente, pago, cancelado
- `comprovante` (URL)

### 8. **Avaliações** (`avaliacoes_prestadores`)
Avaliações dos prestadores pelos clientes

**Campos principais:**
- `nota` (1-5)
- `comentario`

### 9. **Notificações** (`notificacoes`)
Sistema de notificações

**Campos principais:**
- `tipo`: info, alerta, urgente
- `titulo`, `mensagem`, `link`
- `lida` (boolean)

---

## 🔧 Configuração

### 1. Variáveis de Ambiente (.env)
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Comandos Prisma

#### Gerar Cliente Prisma
```bash
npx prisma generate
```

#### Criar/Aplicar Migrações
```bash
npx prisma migrate dev --name nome_da_migracao
```

#### Visualizar Banco de Dados (Prisma Studio)
```bash
npx prisma studio
```

#### Reset do Banco (CUIDADO!)
```bash
npx prisma migrate reset
```

---

## 🚀 API Implementada

### Prestadores

#### **GET** `/api/prestadores`
Lista todos os prestadores com filtros opcionais

**Query Parameters:**
- `status`: ativo, inativo, pendente, bloqueado, todos
- `tipoPessoa`: fisica, juridica, todos
- `estado`: UF do estado
- `cidade`: Nome da cidade
- `search`: Busca por nome, email, telefone, CPF, CNPJ

**Resposta:**
```json
{
  "success": true,
  "data": [...],
  "total": 10
}
```

#### **POST** `/api/prestadores`
Cria um novo prestador

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "(11) 99999-9999",
  "tipoPessoa": "fisica",
  "cpf": "123.456.789-00",
  "endereco": {
    "cep": "01310-100",
    "logradouro": "Av. Paulista",
    "numero": "1000",
    "bairro": "Bela Vista",
    "cidade": "São Paulo",
    "estado": "SP"
  },
  "servicos": ["reboque", "pneu"],
  "status": "ativo",
  "disponivel": true
}
```

#### **GET** `/api/prestadores/[id]`
Busca um prestador específico por ID

#### **PUT** `/api/prestadores/[id]`
Atualiza um prestador existente

#### **DELETE** `/api/prestadores/[id]`
Exclui um prestador

---

## 💾 Persistência de Dados

### ✅ **Antes (Memória)**
```typescript
let prestadores: Prestador[] = []
// Dados perdidos ao reiniciar servidor
```

### ✅ **Agora (Banco de Dados)**
```typescript
const prestadores = await prisma.prestador.findMany()
// Dados persistidos permanentemente
```

### Vantagens
- ✅ **Persistência permanente** - Dados não são perdidos
- ✅ **Consultas eficientes** - Filtros e buscas otimizadas
- ✅ **Integridade referencial** - Relações entre tabelas
- ✅ **Transações** - Operações atômicas
- ✅ **Migrações** - Controle de versão do schema
- ✅ **Type-safe** - TypeScript completo

---

## 🔄 Fluxo de Dados

```
Frontend (React)
    ↓
Service Layer (prestadores.service.ts)
    ↓
API Routes (/api/prestadores)
    ↓
Prisma Client (prisma.ts)
    ↓
SQLite Database (dev.db)
```

---

## 📝 Exemplos de Uso

### Criar Prestador
```typescript
const novoPrestador = await prisma.prestador.create({
  data: {
    nome: "João Silva",
    email: "joao@example.com",
    // ... outros campos
  }
})
```

### Listar com Filtros
```typescript
const prestadores = await prisma.prestador.findMany({
  where: {
    status: "ativo",
    disponivel: true,
    cidade: "São Paulo"
  },
  orderBy: { createdAt: 'desc' }
})
```

### Atualizar
```typescript
const atualizado = await prisma.prestador.update({
  where: { id: "123" },
  data: { status: "bloqueado" }
})
```

### Excluir
```typescript
await prisma.prestador.delete({
  where: { id: "123" }
})
```

---

## 🎯 Próximos Passos

### Implementar APIs para:
1. ✅ **Prestadores** - COMPLETO
2. ⏳ **Clientes** - Pendente
3. ⏳ **Veículos** - Pendente
4. ⏳ **Tickets** - Pendente
5. ⏳ **Mensagens** - Pendente
6. ⏳ **Pagamentos** - Pendente
7. ⏳ **Usuários** - Pendente

### Melhorias Futuras
- [ ] Migrar para PostgreSQL (produção)
- [ ] Implementar cache com Redis
- [ ] Adicionar índices para otimização
- [ ] Implementar soft delete
- [ ] Adicionar auditoria de mudanças
- [ ] Implementar backup automático

---

## 🔒 Segurança

### Implementado
- ✅ Validação de dados de entrada
- ✅ Verificação de duplicatas (email, CPF, CNPJ)
- ✅ Tratamento de erros
- ✅ Type-safety com TypeScript

### A Implementar
- [ ] Autenticação JWT
- [ ] Autorização por roles
- [ ] Rate limiting
- [ ] Sanitização de inputs
- [ ] Logs de auditoria

---

## 📚 Documentação Adicional

- [Prisma Docs](https://www.prisma.io/docs)
- [SQLite Docs](https://www.sqlite.org/docs.html)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

## 🐛 Troubleshooting

### Erro: "Can't reach database server"
```bash
# Verificar se o arquivo dev.db existe
ls prisma/dev.db

# Recriar banco
npx prisma migrate reset
```

### Erro: "Prisma Client not generated"
```bash
npx prisma generate
```

### Limpar e Recomeçar
```bash
# Deletar banco e migrações
rm -rf prisma/dev.db prisma/migrations

# Recriar tudo
npx prisma migrate dev --name init
```

---

**Implementado em:** 20/11/2025  
**Versão:** 1.0.0  
**Status:** ✅ Funcional e Testado
