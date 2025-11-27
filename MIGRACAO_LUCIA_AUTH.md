# 🔄 MIGRAÇÃO: NextAuth → Lucia Auth

## 🎯 **Por que migrar para Lucia Auth?**

### **Problemas com NextAuth:**
- ❌ Configuração complexa e propensa a erros
- ❌ Problemas de cookies e domínios (como enfrentamos)
- ❌ Dependências pesadas e abstrações desnecessárias
- ❌ Debugging difícil em produção

### **Vantagens do Lucia Auth:**
- ✅ **Simples e direto** - Menos abstrações
- ✅ **TypeScript nativo** - Melhor tipagem
- ✅ **Controle total** sobre sessões e cookies
- ✅ **Menor bundle size** - Mais performático
- ✅ **Debugging fácil** - Código mais transparente
- ✅ **Compatível com Prisma** - Integração natural

## 📋 **PLANO DE MIGRAÇÃO**

### **Fase 1: Preparação**
- [ ] Instalar Lucia Auth e dependências
- [ ] Criar schema de sessões no Prisma
- [ ] Configurar Lucia com PostgreSQL

### **Fase 2: Implementação**
- [ ] Criar configuração do Lucia
- [ ] Implementar endpoints de login/logout
- [ ] Criar middleware de autenticação
- [ ] Implementar hooks de sessão

### **Fase 3: Migração**
- [ ] Substituir NextAuth nos componentes
- [ ] Atualizar middleware de rotas
- [ ] Migrar SessionProvider
- [ ] Testar funcionalidade completa

### **Fase 4: Limpeza**
- [ ] Remover NextAuth e dependências
- [ ] Limpar arquivos antigos
- [ ] Atualizar documentação

## 🔧 **IMPLEMENTAÇÃO DETALHADA**

### **1. Dependências**

```bash
npm install lucia @lucia-auth/adapter-prisma
npm uninstall next-auth
```

### **2. Schema Prisma (Adicionar)**

```prisma
model Session {
  id        String   @id
  userId    String
  expiresAt DateTime
  user      Usuario  @relation(references: [id], fields: [userId], onDelete: Cascade)

  @@map("sessions")
}

// Adicionar ao modelo Usuario:
model Usuario {
  // ... campos existentes
  sessions Session[]
}
```

### **3. Configuração Lucia**

```typescript
// src/lib/auth/lucia.ts
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "@/lib/prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.usuario);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
      domain: process.env.NODE_ENV === "production" ? ".conectiva24h.com.br" : undefined
    }
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      email: attributes.email,
      nome: attributes.nome,
      role: attributes.role,
      ativo: attributes.ativo
    };
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: string;
      email: string;
      nome: string;
      role: string;
      ativo: boolean;
    };
  }
}
```

### **4. Endpoints de Autenticação**

```typescript
// src/app/api/auth/login/route.ts
import { lucia } from "@/lib/auth/lucia";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await prisma.usuario.findUnique({
    where: { email }
  });

  if (!user || !user.ativo) {
    return Response.json({ error: "Credenciais inválidas" }, { status: 400 });
  }

  const validPassword = await bcrypt.compare(password, user.senha);
  if (!validPassword) {
    return Response.json({ error: "Credenciais inválidas" }, { status: 400 });
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return Response.json({ success: true });
}
```

### **5. Middleware Atualizado**

```typescript
// middleware.ts
import { lucia } from "@/lib/auth/lucia";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get(lucia.sessionCookieName)?.value ?? null;
  
  if (!sessionId) {
    if (request.nextUrl.pathname.startsWith('/painel')) {
      return NextResponse.redirect(new URL('/entrar', request.url));
    }
    return NextResponse.next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  
  if (!session) {
    if (request.nextUrl.pathname.startsWith('/painel')) {
      return NextResponse.redirect(new URL('/entrar', request.url));
    }
  }

  return NextResponse.next();
}
```

### **6. Hook de Sessão**

```typescript
// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  nome: string;
  role: string;
  ativo: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        setUser(data.user || null);
        setLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      window.location.href = '/painel';
    } else {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/entrar';
  };

  return { user, loading, login, logout };
}
```

## 🚀 **SCRIPT DE MIGRAÇÃO AUTOMÁTICA**

Vou criar um script que faz toda a migração automaticamente:

### **Benefícios da Migração:**
1. **Resolve problemas atuais** - Sem mais loops de login
2. **Código mais limpo** - Fácil de entender e manter
3. **Performance melhor** - Bundle menor
4. **Controle total** - Sem abstrações desnecessárias
5. **TypeScript nativo** - Melhor DX

### **Tempo estimado:** 2-3 horas
### **Risco:** Baixo (podemos reverter facilmente)

## 🤔 **Decisão**

Quer que eu implemente a migração completa? Posso criar:

1. **Script automático** que faz toda a migração
2. **Implementação passo a passo** com testes
3. **Rollback plan** caso algo dê errado

A migração vai resolver definitivamente os problemas de login e dar muito mais controle sobre a autenticação.
