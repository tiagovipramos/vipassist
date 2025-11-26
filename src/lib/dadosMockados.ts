/**
 * @deprecated Este arquivo existe apenas para compatibilidade retroativa
 * 
 * ⚠️ ATENÇÃO: Para novos componentes, use @/lib/mocks diretamente
 * 
 * Exemplos:
 * ❌ Antigo: import { atendentesMockados } from '@/lib/dadosMockados'
 * ✅ Novo:   import { atendentesMockados } from '@/lib/mocks'
 * 
 * Este arquivo apenas re-exporta @/lib/mocks para manter imports antigos funcionando.
 * Não causa impacto no bundle size - o tree-shaking funciona normalmente.
 * 
 * Pode ser removido quando todos os imports forem migrados para @/lib/mocks.
 */

export * from './mocks';
