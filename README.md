# 🚗 VIP ASSIST - Sistema de Assistência Veicular 24h

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Sistema completo de gerenciamento de assistência veicular 24h com rastreamento em tempo real, distribuição inteligente de prestadores e acompanhamento via link para clientes.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Características Principais](#-características-principais)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Módulos do Sistema](#-módulos-do-sistema)
- [API Routes](#-api-routes)
- [Banco de Dados](#-banco-de-dados)
- [Fluxo Operacional](#-fluxo-operacional)
- [Desenvolvimento](#-desenvolvimento)
- [Deploy](#-deploy)
- [Suporte](#-suporte)

---

## 🎯 Visão Geral

O **VIP ASSIST** é uma plataforma web completa para gerenciamento de assistência veicular 24h que permite:

- ✅ Receber e gerenciar chamados de assistência
- ✅ Distribuir chamados para prestadores via link (sem necessidade de app)
- ✅ Rastrear prestadores em tempo real através do navegador
- ✅ Permitir que clientes acompanhem a chegada do prestador via link público
- ✅ Controlar operação, SLA e pagamentos pela central
- ✅ Integração com Google Maps e Mapbox para mapas, rotas e ETA

### Diferenciais

- 🌐 **100% Web** - Sem necessidade de aplicativos móveis
- 📱 **Rastreamento via Navegador** - Prestadores são rastreados pelo browser
- 🔗 **Links Públicos** - Clientes acompanham sem login
- ⚡ **Tempo Real** - Atualizações instantâneas de localização
- 💰 **Gestão Financeira** - Controle completo de pagamentos
- 📊 **Relatórios Completos** - Análises operacionais e financeiras

---

## ✨ Características Principais

### Para a Central de Atendimento

- 📞 **Abertura de Chamados** - Interface intuitiva para registro de solicitações
- 🗺️ **Mapa ao Vivo** - Visualização em tempo real de todos os prestadores
- 👥 **Gestão de Prestadores** - Cadastro, aprovação e controle de status
- 💳 **Controle Financeiro** - Gestão de pagamentos e tabela de preços
- 📈 **Dashboard Completo** - Métricas e KPIs em tempo real
- 📋 **Relatórios Avançados** - Operacional, financeiro e de desempenho

### Para Prestadores (via Link)

- ✅ **Aceite de Chamados** - Aceitar ou recusar via navegador
- 📍 **Rastreamento Automático** - Localização enviada automaticamente
- 📸 **Finalização com Fotos** - Registro fotográfico com geolocalização
- 💰 **Visualização de Valores** - Transparência nos pagamentos

### Para Clientes (via Link)

- 🗺️ **Acompanhamento em Tempo Real** - Visualização do prestador no mapa
- ⏱️ **ETA (Tempo Estimado)** - Previsão de chegada
- 📱 **Sem Cadastro** - Acesso direto via link único
- ℹ️ **Informações do Prestador** - Nome, telefone e veículo

---

## 🛠️ Tecnologias

### Frontend

- **[Next.js 14.2](https://nextjs.org/)** - Framework React com App Router
- **[React 18.3](https://react.dev/)** - Biblioteca UI
- **[TypeScript 5.5](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis
- **[Framer Motion](https://www.framer.com/motion/)** - Animações
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Gerenciamento de estado
- **[Lucide React](https://lucide.dev/)** - Ícones
- **[Recharts](https://recharts.org/)** - Gráficos e visualizações

### Backend & Database

- **[Prisma ORM 5.22](https://www.prisma.io/)** - ORM moderno para Node.js
- **[SQLite](https://www.sqlite.org/)** - Banco de dados (desenvolvimento)
- **Next.js API Routes** - Endpoints REST

### Mapas & Geolocalização

- **[Google Maps API](https://developers.google.com/maps)** - Geocoding e Places
- **[Mapbox GL JS](https://www.mapbox.com/)** - Mapas interativos 3D
- **Geolocation API** - Rastreamento de localização

### Ferramentas de Desenvolvimento

- **[ESLint](https://eslint.org/)** - Linting
- **[PostCSS](https://postcss.org/)** - Processamento CSS
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - Prefixos CSS automáticos

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Central    │  │  Prestador   │  │   Cliente    │      │
│  │   (Painel)   │  │  (via Link)  │  │  (via Link)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    API ROUTES (Next.js)                      │
│  /api/tickets  /api/prestadores  /api/clientes  /api/logs   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    PRISMA ORM (Data Layer)                   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (SQLite/PostgreSQL)              │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              SERVIÇOS EXTERNOS (Google Maps, Mapbox)         │
└─────────────────────────────────────────────────────────────┘
```

### Padrões Arquiteturais

- **Server Components** - Renderização no servidor quando possível
- **Client Components** - Interatividade no cliente
- **API Routes** - Backend serverless
- **Service Layer** - Lógica de negócio isolada
- **Repository Pattern** - Acesso a dados via Prisma

---

## 📦 Instalação

### Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** ou **pnpm**
- **Git**

### Passo a Passo

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/vip-assist.git
cd vip-assist
```

2. **Instale as dependências**

```bash
npm install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL="file:./dev.db"

# Next Auth
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="sua-chave-google-maps"

# Mapbox API
NEXT_PUBLIC_MAPBOX_TOKEN="seu-token-mapbox"
```

4. **Configure o banco de dados**

```bash
# Gerar o Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate dev --name init

# (Opcional) Popular com dados de teste
node popular-tabela-precos.js
```

5. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

6. **Acesse o sistema**

Abra [http://localhost:3000](http://localhost:3000) no navegador.

**Credenciais de teste:**
- Email: `admin@vip-assist.com`
- Senha: qualquer senha (sistema mockado)

---

## ⚙️ Configuração

### Google Maps API

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative as seguintes APIs:
   - **Places API**
   - **Geocoding API**
   - **Maps JavaScript API**
4. Crie uma chave de API em "Credenciais"
5. Configure restrições de segurança (domínios permitidos)
6. Adicione a chave no `.env`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSy..."
```

### Mapbox Token

1. Acesse [Mapbox](https://www.mapbox.com/)
2. Crie uma conta ou faça login
3. Vá em "Access Tokens"
4. Crie um novo token com os escopos:
   - `styles:read`
   - `fonts:read`
   - `datasets:read`
5. Adicione o token no `.env`:

```env
NEXT_PUBLIC_MAPBOX_TOKEN="pk.eyJ1..."
```

### Banco de Dados

#### Desenvolvimento (SQLite)

O projeto vem configurado com SQLite por padrão:

```env
DATABASE_URL="file:./dev.db"
```

#### Produção (PostgreSQL)

Para produção, recomenda-se PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/database"
```

Atualize o `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Altere de "sqlite" para "postgresql"
  url      = env("DATABASE_URL")
}
```

Execute as migrations:

```bash
npx prisma migrate deploy
```

---

## 📁 Estrutura do Projeto

```
vip-assist/
├── prisma/
│   ├── schema.prisma              # Schema do banco de dados
│   ├── migrations/                # Histórico de migrações
│   └── dev.db                     # Banco SQLite (desenvolvimento)
│
├── public/
│   ├── avatars/                   # Avatares de usuários
│   └── fotos/                     # Fotos de conclusão de tickets
│
├── src/
│   ├── app/                       # App Router (Next.js 14)
│   │   ├── (autenticado)/         # Rotas protegidas
│   │   │   ├── painel/            # Dashboard
│   │   │   ├── tickets/           # Gestão de chamados
│   │   │   ├── prestadores/       # Gestão de prestadores
│   │   │   ├── clientes/          # Gestão de clientes
│   │   │   ├── pagamentos/        # Controle financeiro
│   │   │   ├── relatorios/        # Relatórios
│   │   │   ├── equipe/            # Gestão de usuários
│   │   │   ├── logs/              # Logs do sistema
│   │   │   └── configuracoes/     # Configurações
│   │   │
│   │   ├── (publico)/             # Rotas públicas
│   │   │   ├── entrar/            # Login
│   │   │   └── corrida/[protocolo]/ # Acompanhamento cliente
│   │   │
│   │   ├── api/                   # API Routes
│   │   │   ├── tickets/           # CRUD de tickets
│   │   │   ├── prestadores/       # CRUD de prestadores
│   │   │   ├── clientes/          # CRUD de clientes
│   │   │   ├── pagamentos/        # Gestão de pagamentos
│   │   │   ├── relatorios/        # Geração de relatórios
│   │   │   ├── equipe/            # Gestão de equipe
│   │   │   ├── logs/              # Logs do sistema
│   │   │   ├── google-maps/       # Integração Google Maps
│   │   │   └── upload-foto/       # Upload de imagens
│   │   │
│   │   ├── layout.tsx             # Layout raiz
│   │   └── page.tsx               # Página inicial
│   │
│   ├── componentes/               # Componentes React
│   │   ├── ui/                    # Componentes base (Radix UI)
│   │   ├── layout/                # Header, Sidebar
│   │   ├── tickets/               # Componentes de tickets
│   │   ├── mapa/                  # Componentes de mapa
│   │   ├── errors/                # Error boundaries
│   │   ├── loading/               # Loading states
│   │   └── notificacoes/          # Sistema de notificações
│   │
│   ├── lib/                       # Bibliotecas e utilitários
│   │   ├── prisma.ts              # Cliente Prisma
│   │   ├── utils.ts               # Funções utilitárias
│   │   ├── services/              # Camada de serviços
│   │   │   ├── tickets.service.ts
│   │   │   ├── prestadores.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   └── googleMaps.service.ts
│   │   ├── mocks/                 # Dados mockados
│   │   └── providers/             # Context providers
│   │
│   ├── stores/                    # Zustand stores
│   │   ├── authStore.ts           # Autenticação
│   │   ├── sidebarStore.ts        # Estado da sidebar
│   │   └── inboxStore.ts          # Estado do inbox
│   │
│   ├── tipos/                     # TypeScript types
│   │   ├── ticket.ts
│   │   ├── prestador.ts
│   │   ├── cliente.ts
│   │   ├── usuario.ts
│   │   └── ...
│   │
│   ├── estilos/
│   │   └── globals.css            # Estilos globais
│   │
│   └── hooks/                     # Custom hooks
│       └── useMemoization.ts
│
├── .env                           # Variáveis de ambiente
├── .env.example                   # Exemplo de variáveis
├── .gitignore                     # Arquivos ignorados pelo Git
├── next.config.js                 # Configuração Next.js
├── tailwind.config.js             # Configuração Tailwind
├── tsconfig.json                  # Configuração TypeScript
├── package.json                   # Dependências
└── README.md                      # Este arquivo
```

---

## 🎯 Módulos do Sistema

### 1. 📊 Dashboard (Painel)

**Rota:** `/painel`

Visão geral da operação com:
- Métricas em tempo real (tickets abertos, em andamento, concluídos)
- Gráficos de desempenho
- Mapa com prestadores ativos
- Últimos chamados
- Alertas e notificações

### 2. 🎫 Tickets (Chamados)

**Rotas:** `/tickets`, `/tickets/criar`, `/tickets/mapa`

Gestão completa de chamados:
- ✅ Criar novo chamado
- ✅ Listar todos os chamados
- ✅ Filtrar por status, prioridade, prestador
- ✅ Visualizar detalhes completos
- ✅ Atribuir/reatribuir prestador
- ✅ Acompanhar em tempo real no mapa
- ✅ Histórico de eventos
- ✅ Finalizar chamado
- ✅ Cancelar chamado

**Status de Tickets:**
- `aberto` - Aguardando atribuição
- `em_andamento` - Prestador a caminho
- `concluido` - Atendimento finalizado
- `cancelado` - Chamado cancelado

**Prioridades:**
- `critica` - Atendimento urgente
- `alta` - Prioridade alta
- `media` - Prioridade normal
- `baixa` - Pode aguardar

### 3. 👷 Prestadores

**Rota:** `/prestadores`

Gestão de prestadores de serviço:
- ✅ Cadastrar prestador (pessoa física ou jurídica)
- ✅ Listar prestadores
- ✅ Filtrar por status, cidade, serviços
- ✅ Buscar via Google Maps Places API
- ✅ Visualizar histórico de atendimentos
- ✅ Gerenciar documentos
- ✅ Controlar status (ativo, inativo, bloqueado)
- ✅ Definir área de atuação
- ✅ Configurar serviços prestados

**Tipos de Serviços:**
- Reboque/Guincho
- Troca de pneu
- Chaveiro
- Bateria
- Combustível
- Mecânica leve

### 4. 👥 Clientes

**Rota:** `/clientes`

Cadastro e gestão de clientes:
- ✅ Cadastrar cliente
- ✅ Listar clientes
- ✅ Vincular veículos
- ✅ Histórico de chamados
- ✅ Dados de plano/seguro
- ✅ Informações de contato

### 5. 💰 Pagamentos

**Rota:** `/pagamentos`

Controle financeiro:
- ✅ Listar pagamentos pendentes
- ✅ Aprovar pagamentos
- ✅ Registrar comprovantes
- ✅ Tabela de preços por serviço
- ✅ Cálculo automático de valores
- ✅ Exportar relatórios

**Métodos de Pagamento:**
- PIX
- Cartão
- Dinheiro
- Boleto

### 6. 📈 Relatórios

**Rota:** `/relatorios`

Relatórios completos:
- **Operacional:** Tickets por período, status, prestador
- **Financeiro:** Receitas, pagamentos, pendências
- **Prestadores:** Desempenho, avaliações, tempo médio
- **Clientes:** Histórico, frequência de uso
- **SLA:** Tempo de resposta, tempo de atendimento

Exportação em:
- PDF
- Excel (CSV)
- JSON

### 7. 👨‍💼 Equipe

**Rota:** `/equipe`

Gestão de usuários:
- ✅ Cadastrar usuários
- ✅ Definir permissões (admin, supervisor, atendente)
- ✅ Gerenciar setores
- ✅ Visualizar atividades
- ✅ Controlar acesso

**Roles:**
- `admin` - Acesso total
- `supervisor` - Gestão operacional
- `atendente` - Atendimento básico

### 8. 📋 Logs

**Rota:** `/logs`

Auditoria completa:
- ✅ Logs de sistema
- ✅ Logs de usuário
- ✅ Logs de tickets
- ✅ Logs de prestadores
- ✅ Logs de erros
- ✅ Filtros avançados

**Níveis de Log:**
- `debug` - Informações de debug
- `info` - Informações gerais
- `warning` - Avisos
- `error` - Erros
- `critical` - Erros críticos

### 9. ⚙️ Configurações

**Rota:** `/configuracoes`

Configurações do sistema:
- ✅ Dados da empresa
- ✅ API Keys (Google Maps, Mapbox)
- ✅ Tabela de preços
- ✅ Templates de mensagens
- ✅ Configurações de SLA
- ✅ Regras de distribuição

---

## 🔌 API Routes

### Tickets

```typescript
GET    /api/tickets              // Listar tickets
POST   /api/tickets              // Criar ticket
GET    /api/tickets/[id]         // Buscar ticket
PATCH  /api/tickets/[id]         // Atualizar ticket
DELETE /api/tickets/[id]         // Excluir ticket
```

### Prestadores

```typescript
GET    /api/prestadores          // Listar prestadores
POST   /api/prestadores          // Criar prestador
GET    /api/prestadores/[id]     // Buscar prestador
PUT    /api/prestadores/[id]     // Atualizar prestador
DELETE /api/prestadores/[id]     // Excluir prestador
GET    /api/prestadores/proximos // Buscar prestadores próximos
```

### Clientes

```typescript
GET    /api/clientes             // Listar clientes
POST   /api/clientes             // Criar cliente
GET    /api/clientes/[id]        // Buscar cliente
PUT    /api/clientes/[id]        // Atualizar cliente
DELETE /api/clientes/[id]        // Excluir cliente
```

### Pagamentos

```typescript
GET    /api/pagamentos           // Listar pagamentos
POST   /api/pagamentos           // Criar pagamento
GET    /api/pagamentos/[id]      // Buscar pagamento
PUT    /api/pagamentos/[id]      // Atualizar pagamento
```

### Relatórios

```typescript
GET    /api/relatorios           // Relatório geral
GET    /api/relatorios/tickets   // Relatório de tickets
GET    /api/relatorios/prestadores // Relatório de prestadores
GET    /api/relatorios/financeiro  // Relatório financeiro
GET    /api/relatorios/clientes    // Relatório de clientes
```

### Outros

```typescript
GET    /api/dashboard            // Dados do dashboard
GET    /api/equipe               // Listar equipe
POST   /api/equipe               // Criar usuário
GET    /api/logs                 // Listar logs
POST   /api/upload-foto          // Upload de foto
GET    /api/google-maps/buscar   // Buscar no Google Maps
```

---

## 🗄️ Banco de Dados

### Schema Prisma

O sistema utiliza **Prisma ORM** com o seguinte schema:

#### Principais Modelos

**Usuario**
- Gerenciamento de usuários do sistema
- Roles: admin, supervisor, atendente
- Relações: tickets, mensagens, setor

**Cliente**
- Cadastro de clientes
- Dados pessoais e endereço
- Plano/seguro
- Relações: tickets, veiculos

**Veiculo**
- Veículos dos clientes
- Placa, marca, modelo, ano
- Relação: cliente, tickets

**Prestador**
- Prestadores de serviço
- Pessoa física ou jurídica
- Localização GPS
- Serviços prestados
- Avaliações
- Relações: tickets, documentos, avaliacoes

**Ticket**
- Chamados de assistência
- Origem e destino (coordenadas)
- Status e prioridade
- Valores e tempos
- Foto de conclusão
- Relações: cliente, veiculo, prestador, atendente, mensagens, historico

**Mensagem**
- Chat dos tickets
- Tipos: texto, imagem, arquivo, audio
- Relação: ticket, usuario

**Pagamento**
- Controle financeiro
- Métodos de pagamento
- Status: pendente, pago, cancelado
- Comprovantes

**Log**
- Auditoria do sistema
- Tipos: sistema, usuario, ticket, prestador, cliente, pagamento, erro
- Níveis: debug, info, warning, error, critical

### Comandos Prisma

```bash
# Gerar Prisma Client
npx prisma generate

# Criar migration
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrations (produção)
npx prisma migrate deploy

# Abrir Prisma Studio (GUI)
npx prisma studio

# Reset do banco (CUIDADO!)
npx prisma migrate reset
```

---

## 🔄 Fluxo Operacional

### 1. Criação do Chamado

```
Cliente liga → Atendente registra → Sistema gera protocolo
```

**Dados coletados:**
- Cliente e veículo
- Tipo de serviço necessário
- Localização (GPS ou endereço)
- Descrição do problema
- Prioridade

### 2. Seleção do Prestador

```
Sistema busca prestadores próximos → Atendente seleciona → Link enviado
```

**Critérios de seleção:**
- Proximidade (raio de atuação)
- Tipo de serviço
- Disponibilidade
- Avaliação

### 3. Aceite do Prestador

```
Prestador recebe link → Visualiza detalhes → Aceita ou recusa
```

**Link de aceite:**
```
https://vip-assist.com/aceitar/{token}
```

**Ao aceitar:**
- Ticket muda para "em_andamento"
- Sistema solicita permissão de localização
- Rastreamento inicia automaticamente

### 4. Rastreamento em Tempo Real

```
Navegador do prestador → Envia localização → Central e cliente visualizam
```

**Tecnologias:**
- Geolocation API
- WebSocket (futuro)
- Atualização a cada 10 segundos
- Funciona com tela bloqueada (Wake Lock API)

### 5. Acompanhamento pelo Cliente

```
Cliente recebe link → Visualiza mapa → Vê ETA e localização
```

**Link de acompanhamento:**
```
https://vip-assist.com/corrida/{protocolo}
```

**Cliente visualiza:**
- Mapa com prestador em tempo real
- ETA (tempo estimado de chegada)
- Nome e telefone do prestador
- Dados do veículo

### 6. Finalização

```
Prestador chega → Realiza serviço → Finaliza no sistema
```

**Ao finalizar:**
- Foto obrigatória com geolocalização
- Observações do serviço
- Confirmação de valores
- Ticket muda para "concluido"

### 7. Pagamento

```
Ticket concluído → Gera pagamento pendente → Aprovação → Pagamento
```

**Fluxo financeiro:**
- Cálculo automático baseado na tabela de preços
- Aprovação pela central
- Registro de comprovante
- Atualização de status

---

## 💻 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build            # Cria build de produção
npm run start            # Inicia servidor de produção

# Linting
npm run lint             # Executa ESLint

# Prisma
npx prisma generate      # Gera Prisma Client
npx prisma studio        # Abre Prisma Studio
npx prisma migrate dev   # Cria migration
```

### Estrutura de Componentes

```typescript
// Componente Server (padrão)
export default function Page() {
  return <div>Server Component</div>
}

// Componente Client (interativo)
'use client'
export default function ClientComponent() {
  const [state, setState] = useState()
  return <div>Client Component</div>
}
```

### Criando uma Nova API Route

```typescript
// src/app/api/exemplo/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const data = await prisma.exemplo.findMany()
    
    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro ao buscar dados'
    }, { status: 500 })
  }
}
```

### Criando um Novo Service

```typescript
// src/lib/services/exemplo.service.ts
export const exemploService = {
  async listar() {
    const response = await fetch('/api/exemplo')
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error)
    }
    
    return data.data
  }
}
```

### Boas Práticas

1. **Sempre use TypeScript** - Aproveite a tipagem estática
2. **Componentes pequenos** - Mantenha componentes focados
3. **Server Components por padrão** - Use Client Components apenas quando necessário
4. **Validação de dados** - Valide inputs no backend
5. **Tratamento de erros** - Use try/catch e Error Boundaries
6. **Logs** - Registre ações importantes
7. **Comentários** - Documente código complexo
8. **Testes** - Escreva testes para lógica crítica

---

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte seu repositório**

Acesse [Vercel](https://vercel.com) e importe seu repositório do GitHub.

2. **Configure as variáveis de ambiente**

No painel da Vercel, adicione as seguintes variáveis:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="sua-chave-secreta"
NEXTAUTH_URL="https://seu-dominio.vercel.app"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="sua-chave"
NEXT_PUBLIC_MAPBOX_TOKEN="seu-token"
```

3. **Configure o banco de dados**

Recomenda-se usar um serviço de PostgreSQL gerenciado:
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)
- [Neon](https://neon.tech/)

4. **Execute as migrations**

```bash
npx prisma migrate deploy
```

5. **Deploy**

A Vercel fará o deploy automaticamente a cada push na branch principal.

### Docker

1. **Crie um Dockerfile**

```dockerfile
FROM node:18-alpine AS base

# Dependências
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

2. **Build e execute**

```bash
docker build -t vip-assist .
docker run -p 3000:3000 vip-assist
```

### VPS (Ubuntu/Debian)

1. **Instale dependências**

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2
sudo npm install -g pm2
```

2. **Clone e configure**

```bash
git clone https://github.com/seu-usuario/vip-assist.git
cd vip-assist
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
```

3. **Inicie com PM2**

```bash
pm2 start npm --name "vip-assist" -- start
pm2 save
pm2 startup
```

4. **Configure Nginx**

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📱 Página de Suporte

Para criar a página de suporte em `http://localhost:3000/suporte`, siga estes passos:

### 1. Crie o arquivo da página

```bash
# Crie o diretório se não existir
mkdir -p src/app/(autenticado)/suporte

# Crie o arquivo page.tsx
touch src/app/(autenticado)/suporte/page.tsx
```

### 2. Estrutura da página de suporte

```typescript
// src/app/(autenticado)/suporte/page.tsx
import { Metadata } from 'next'
import { 
  BookOpen, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText,
  Video,
  HelpCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Suporte | VIP Assist',
  description: 'Central de ajuda e suporte do VIP Assist'
}

export default function SuportePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Central de Suporte
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Encontre ajuda, documentação e entre em contato com nossa equipe
        </p>
      </div>

      {/* Cards de Suporte */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Documentação */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Documentação</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Guias completos sobre como usar o sistema
          </p>
          <a 
            href="#documentacao" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver documentação →
          </a>
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <HelpCircle className="h-12 w-12 text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Perguntas Frequentes</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Respostas para as dúvidas mais comuns
          </p>
          <a 
            href="#faq" 
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Ver FAQ →
          </a>
        </div>

        {/* Vídeos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <Video className="h-12 w-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Tutoriais em Vídeo</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Aprenda visualmente com nossos tutoriais
          </p>
          <a 
            href="#videos" 
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Assistir vídeos →
          </a>
        </div>
      </div>

      {/* Contato */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-white mb-8">
        <h2 className="text-2xl font-bold mb-4">Precisa de ajuda personalizada?</h2>
        <p className="mb-6">
          Nossa equipe está pronta para ajudar você
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Phone className="h-6 w-6" />
            <div>
              <div className="font-semibold">Telefone</div>
              <div className="text-blue-100">(11) 9999-9999</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6" />
            <div>
              <div className="font-semibold">Email</div>
              <div className="text-blue-100">suporte@vip-assist.com</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6" />
            <div>
              <div className="font-semibold">Chat</div>
              <div className="text-blue-100">Seg-Sex, 8h-18h</div>
            </div>
          </div>
        </div>
      </div>

      {/* Seções de Conteúdo */}
      <div className="space-y-8">
        {/* Documentação */}
        <section id="documentacao">
          <h2 className="text-2xl font-bold mb-4">📚 Documentação</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Guia de Início Rápido
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Como Criar um Chamado
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Gerenciamento de Prestadores
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Relatórios e Análises
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <h2 className="text-2xl font-bold mb-4">❓ Perguntas Frequentes</h2>
          <div className="space-y-4">
            {/* Adicione suas FAQs aqui */}
          </div>
        </section>
      </div>
    </div>
  )
}
```

### 3. Adicione ao menu da Sidebar

Edite `src/componentes/layout/Sidebar.tsx` e adicione o item de menu:

```typescript
{
  nome: 'Suporte',
  icone: HelpCircle,
  href: '/suporte',
  badge: null
}
```

---

## 🧪 Testes

### Testes Unitários (Futuro)

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### Testes E2E (Futuro)

```bash
npm install --save-dev playwright
```

---

## 📝 Scripts Úteis

### Popular Banco com Dados de Teste

```bash
# Tabela de preços
node popular-tabela-precos.js

# Criar prestador de teste
node criar-prestador-negado.js

# Criar ticket de teste
node criar-ticket-teste.js

# Criar pagamentos
node criar-pagamentos-tickets.js

# Criar logs de teste
node criar-logs-teste.js
```

### Verificar Dados

```bash
# Verificar prestadores
node check-prestador.js

# Verificar clientes
node check-clientes.js

# Verificar pagamentos
node check-pagamentos.js

# Verificar usuários
node check-usuarios.js
```

### Limpar Dados

```bash
# Limpar usuários de teste
node limpar-usuarios-teste.js
```

---

## 🔐 Segurança

### Implementado

- ✅ Headers de segurança (CSP, HSTS, X-Frame-Options)
- ✅ Validação de dados de entrada
- ✅ Sanitização de inputs
- ✅ Type-safety com TypeScript
- ✅ Proteção contra SQL Injection (Prisma)

### Recomendações para Produção

1. **Autenticação JWT** - Implementar autenticação real
2. **Rate Limiting** - Limitar requisições por IP
3. **HTTPS** - Sempre usar SSL/TLS
4. **Backup** - Backup automático do banco
5. **Monitoramento** - Logs e alertas
6. **Firewall** - Configurar firewall adequado
7. **Atualizações** - Manter dependências atualizadas

---

## 📊 Performance

### Otimizações Implementadas

- ✅ **Server Components** - Renderização no servidor
- ✅ **Code Splitting** - Chunks otimizados
- ✅ **Image Optimization** - Next.js Image
- ✅ **Bundle Optimization** - Tree-shaking
- ✅ **Memoization** - React.memo e useMemo
- ✅ **Lazy Loading** - Componentes sob demanda

### Métricas Alvo

- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **TTI** (Time to Interactive): < 3.8s
- **CLS** (Cumulative Layout Shift): < 0.1

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript
- Siga o ESLint configurado
- Escreva commits descritivos
- Documente código complexo
- Adicione testes quando possível

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

- **Desenvolvimento**: Equipe VIP Assist
- **Design**: Equipe VIP Assist
- **Suporte**: suporte@vip-assist.com

---

## 📞 Suporte

### Documentação Adicional

- [DATABASE_IMPLEMENTATION.md](DATABASE_IMPLEMENTATION.md) - Implementação do banco de dados
- [IMPLEMENTACAO_PRESTADORES.md](IMPLEMENTACAO_PRESTADORES.md) - Sistema de prestadores
- [GOOGLE_MAPS_IMPLEMENTATION.md](GOOGLE_MAPS_IMPLEMENTATION.md) - Integração Google Maps
- [RELATORIOS_IMPLEMENTACAO.md](RELATORIOS_IMPLEMENTACAO.md) - Sistema de relatórios
- [EQUIPE_IMPLEMENTACAO.md](EQUIPE_IMPLEMENTACAO.md) - Gestão de equipe
- [REFATORACAO.md](REFATORACAO.md) - Histórico de refatorações

### Contato

- 📧 Email: suporte@vip-assist.com
- 📱 WhatsApp: (11) 99999-9999
- 🌐 Website: https://vip-assist.com
- 💬 Discord: [Link do servidor]

---

## 🎯 Roadmap

### Versão 1.1 (Próxima)

- [ ] Autenticação JWT real
- [ ] WebSocket para atualizações em tempo real
- [ ] Notificações push
- [ ] App mobile (React Native)
- [ ] Integração com WhatsApp Business API
- [ ] Sistema de avaliações

### Versão 1.2

- [ ] IA para distribuição inteligente
- [ ] Chatbot de atendimento
- [ ] Análise preditiva
- [ ] Integração com ERPs
- [ ] Multi-idioma

### Versão 2.0

- [ ] Marketplace de prestadores
- [ ] Sistema de leilão reverso
- [ ] Gamificação
- [ ] Programa de fidelidade

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework incrível
- [Vercel](https://vercel.com/) - Hospedagem e deploy
- [Prisma](https://www.prisma.io/) - ORM moderno
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Radix UI](https://www.radix-ui.com/) - Componentes acessíveis
- [Mapbox](https://www.mapbox.com/) - Mapas interativos
- [Google Maps](https://developers.google.com/maps) - APIs de localização

---

<div align="center">

**VIP ASSIST** - Sistema de Assistência Veicular 24h

Feito com ❤️ pela equipe VIP Assist

[Website](https://vip-assist.com) • [Documentação](https://docs.vip-assist.com) • [Suporte](mailto:suporte@vip-assist.com)

</div>
