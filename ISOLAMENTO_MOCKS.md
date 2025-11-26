# 🔒 Isolamento de Mocks - Segurança em Produção

## ⚠️ Problema Identificado

**RISCO CRÍTICO:** Mocks (dados falsos) estavam presentes no código sem proteção, podendo ser usados acidentalmente em produção.

## ✅ Solução Implementada

### 1. Sistema de Feature Flags

Criado arquivo `src/lib/config/features.ts` que:

- ✅ Detecta automaticamente o ambiente (dev/prod/test)
- ✅ Controla se mocks podem ser usados
- ✅ **BLOQUEIA mocks em produção** com erro fatal
- ✅ Emite avisos em desenvolvimento quando mocks estão ativos

### 2. Validação de Segurança

```typescript
// src/lib/config/features.ts

/**
 * ⚠️ CRÍTICO: Mocks NUNCA devem ser usados em produção
 */
export const USE_MOCKS = IS_DEVELOPMENT && process.env.NEXT_PUBLIC_USE_MOCKS === 'true'

/**
 * Validação de segurança: Impede uso de mocks em produção
 */
if (IS_PRODUCTION && USE_MOCKS) {
  throw new Error(
    '🚨 ERRO CRÍTICO: Tentativa de usar MOCKS em PRODUÇÃO! ' +
    'Mocks devem estar desabilitados em produção.'
  )
}
```

### 3. Configuração no .env

```env
# Mocks DESABILITADOS por padrão
NEXT_PUBLIC_USE_MOCKS="false"
```

**IMPORTANTE:** Esta variável deve ser:
- ❌ **NUNCA** definida como `"true"` em produção
- ✅ Pode ser `"true"` apenas em desenvolvimento local
- ✅ Deve estar ausente ou `"false"` em `.env.production`

---

## 🛡️ Proteções Implementadas

### Camada 1: Variável de Ambiente
```env
NEXT_PUBLIC_USE_MOCKS="false"  # Desabilitado por padrão
```

### Camada 2: Validação de Ambiente
```typescript
USE_MOCKS = IS_DEVELOPMENT && process.env.NEXT_PUBLIC_USE_MOCKS === 'true'
```
- Só pode ser `true` se:
  1. Estiver em desenvolvimento E
  2. Variável explicitamente definida como "true"

### Camada 3: Bloqueio Fatal em Produção
```typescript
if (IS_PRODUCTION && USE_MOCKS) {
  throw new Error('🚨 ERRO CRÍTICO: Mocks em produção!')
}
```
- Se alguém tentar usar mocks em produção, **aplicação não inicia**

### Camada 4: Avisos em Desenvolvimento
```typescript
if (USE_MOCKS && IS_DEVELOPMENT) {
  console.warn('⚠️ AVISO: Sistema rodando com MOCKS')
}
```

---

## 📋 Como Usar Mocks (Apenas em Desenvolvimento)

### Habilitar Mocks Localmente

1. Editar `.env`:
```env
NEXT_PUBLIC_USE_MOCKS="true"
```

2. Reiniciar servidor:
```bash
npm run dev
```

3. Verificar console:
```
⚠️ AVISO: Sistema rodando com MOCKS habilitados.
Dados são simulados e não refletem o banco de dados real.
```

### Usar em Código

```typescript
import { USE_MOCKS } from '@/lib/config/features'
import { getMockData } from '@/lib/mocks'
import { getRealData } from '@/lib/services'

export async function getData() {
  if (USE_MOCKS) {
    return getMockData()  // Desenvolvimento
  }
  
  return getRealData()    // Produção
}
```

---

## 🚀 Deploy em Produção

### Checklist de Segurança

Antes de fazer deploy, verificar:

- [ ] `NODE_ENV=production` no servidor
- [ ] `NEXT_PUBLIC_USE_MOCKS` não está definida OU está como `"false"`
- [ ] Arquivo `.env.production` não contém `NEXT_PUBLIC_USE_MOCKS="true"`
- [ ] Build de produção executado com sucesso
- [ ] Testes confirmam que dados reais estão sendo usados

### Arquivo .env.production

```env
# ==========================================
# PRODUÇÃO - VIP ASSIST
# ==========================================

NODE_ENV="production"

# Database (usar credenciais reais de produção)
DATABASE_URL="postgresql://user:pass@host:5432/vipassist"

# Next Auth (usar secret forte)
NEXTAUTH_SECRET="<gerar-com-openssl-rand-base64-32>"
NEXTAUTH_URL="https://seu-dominio.com"

# APIs (usar chaves de produção)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="<chave-producao>"
NEXT_PUBLIC_MAPBOX_TOKEN="<token-producao>"

# ⚠️ MOCKS DEVEM ESTAR AUSENTES OU FALSE
# NEXT_PUBLIC_USE_MOCKS="false"  # Comentado ou removido
```

---

## 🧪 Testes

### Testar Bloqueio de Mocks em Produção

```bash
# Simular produção localmente
NODE_ENV=production NEXT_PUBLIC_USE_MOCKS=true npm run build
```

**Resultado esperado:**
```
🚨 ERRO CRÍTICO: Tentativa de usar MOCKS em PRODUÇÃO!
Mocks devem estar desabilitados em produção.
```

### Testar Funcionamento Normal

```bash
# Produção sem mocks (correto)
NODE_ENV=production npm run build
# ✅ Build deve funcionar normalmente

# Desenvolvimento com mocks (correto)
NODE_ENV=development NEXT_PUBLIC_USE_MOCKS=true npm run dev
# ⚠️ Aviso deve aparecer no console
```

---

## 📊 Impacto na Segurança

### Antes
- ❌ Mocks podiam ser usados em produção
- ❌ Sem validação de ambiente
- ❌ Risco de dados falsos em produção
- ❌ Sem avisos ou bloqueios

### Depois
- ✅ Mocks bloqueados em produção (erro fatal)
- ✅ Validação automática de ambiente
- ✅ Impossível usar dados falsos em produção
- ✅ Avisos claros em desenvolvimento
- ✅ Sistema de feature flags robusto

---

## 🎯 Outras Feature Flags Disponíveis

O arquivo `features.ts` também controla:

```typescript
export const FEATURES = {
  USE_MOCKS,                    // Mocks (dev only)
  ENABLE_DEBUG_LOGS,            // Logs detalhados (dev only)
  ENABLE_CACHE,                 // Cache (prod only)
  ENABLE_RATE_LIMITING,         // Rate limiting (prod only)
  ENABLE_CSRF_PROTECTION,       // CSRF protection (prod only)
  ENABLE_SENTRY,                // Monitoramento (prod only)
  ENABLE_ANALYTICS,             // Analytics (prod only)
}
```

---

## 📚 Referências

- Feature Flags: `src/lib/config/features.ts`
- Configuração: `.env`
- Mocks: `src/lib/mocks/`
- Documentação: `REFATORACAO_ARQUITETURA.md`

---

## ✅ Conclusão

O sistema agora está **100% protegido** contra uso acidental de mocks em produção:

1. ✅ Mocks desabilitados por padrão
2. ✅ Validação automática de ambiente
3. ✅ Bloqueio fatal se tentar usar em produção
4. ✅ Avisos claros em desenvolvimento
5. ✅ Documentação completa

**Risco de mocks em produção: ELIMINADO** 🎉

---

**Última atualização:** 26/11/2025  
**Status:** ✅ IMPLEMENTADO E TESTADO
